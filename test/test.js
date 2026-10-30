/* Automated checks: KB invariants + branch behaviour. Run: node test/test.js */
['kb','j-money','j-family','j-consumer','j-other','j-nri','j-business','j-more','j-genz','stand','law-2026','qa','engine'].forEach((f) => require('../src/' + f + '.js'));
const KB = globalThis.ER_KB, E = globalThis.ER_ENGINE;
let fails = 0, passes = 0;
const ok = (c, m) => { if (c) passes++; else { fails++; console.log('FAIL:', m); } };

const allIds = new Set();
for (const issue of KB.issues) {
  const qIds = new Map(issue.questions.map((q) => [q.id, new Set(q.options.map((o) => o.id))]));
  // unique IDs
  for (const x of [...issue.questions, ...issue.evidence, ...(issue.urgent || [])]) {
    ok(!allIds.has(x.id), `duplicate id ${x.id}`); allIds.add(x.id);
  }
  ok(KB.categories.some((c) => c.id === issue.cat), `${issue.id}: bad category`);
  // condition references exist and point backwards (no forward deps for questions)
  const check = (cond, where, idx) => {
    for (const r of E.refs(cond, [])) {
      ok(qIds.has(r.q), `${issue.id}/${where}: unknown question ${r.q}`);
      if (qIds.has(r.q) && r.in) r.in.forEach((v) => ok(qIds.get(r.q).has(v), `${issue.id}/${where}: unknown option ${r.q}=${v}`));
      if (idx != null) ok(issue.questions.findIndex((q) => q.id === r.q) < idx, `${issue.id}/${where}: depends on later question ${r.q}`);
    }
  };
  issue.questions.forEach((q, i) => {
    check(q.when, q.id, i);
    ok(q.text && q.why, `${q.id}: missing text/why`);
    ok(q.options.length >= 2, `${q.id}: needs options`);
  });
  issue.evidence.forEach((e) => { check(e.when, e.id); ok(e.name && e.fact && e.why && e.where != null, `${e.id}: missing fields`); });
  (issue.urgent || []).forEach((u) => { check(u.when, u.id); (u.help || []).forEach((h) => ok(KB.help[h], `${u.id}: unknown help ${h}`)); });
  (issue.info || []).forEach((x, i) => check(x.when, 'info' + i));
  (issue.lawyerQs || []).forEach((x, i) => check(x.when, 'lq' + i));
  (issue.stand || []).forEach((x, i) => { check(x.when, 'st' + i); ok(['good', 'risk', 'next'].includes(x.k) && x.text, `${issue.id}/st${i}: bad stand item`); });
  // first quick question must be unconditional; quick round 3-6 questions on the default path
  const first = E.nextQuestion(issue, {}, 'quick');
  ok(first && !first.when, `${issue.id}: first question must be unconditional`);

  // Exhaustive-ish random walks: every walk terminates, evidence list non-empty, prune is stable
  for (let t = 0; t < 400; t++) {
    const ans = {};
    let steps = 0;
    for (const stage of ['quick', 'deep']) {
      let q;
      while ((q = E.nextQuestion(issue, ans, stage)) && steps < 60) {
        const opts = q.options.map((o) => o.id);
        ans[q.id] = q.type === 'multi' ? opts.filter(() => Math.random() < 0.4).concat(opts[0]).filter((v, i, a) => a.indexOf(v) === i) : opts[Math.floor(Math.random() * opts.length)];
        steps++;
      }
    }
    ok(steps < 60, `${issue.id}: walk did not terminate`);
    ok(E.evidence(issue, ans).length >= 3, `${issue.id}: fewer than 3 evidence items for ${JSON.stringify(ans)}`);
    const before = JSON.stringify(ans); E.prune(issue, ans); ok(before === JSON.stringify(ans), `${issue.id}: prune changed a consistent answer set`);
  }
}

// Help references in directory-free places
// Branch-difference checks (brief §9: "The resulting evidence checklist must differ")
const byId = (id) => KB.issues.find((i) => i.id === id);
const ev = (id, a) => E.evidence(byId(id), a).map((e) => e.id).sort().join(',');
const bf = (reason) => ({ bf_how: 'bank_told', bf_reason: reason, bf_written: 'no', bf_scope: 'full' });
ok(ev('bank-account-frozen', bf('kyc')) !== ev('bank-account-frozen', bf('police')), 'bank frozen: KYC vs police lists must differ');
ok(ev('bank-account-frozen', bf('police')) !== ev('bank-account-frozen', bf('none')), 'bank frozen: police vs none lists must differ');
ok(ev('bank-account-frozen', bf('kyc')).includes('bf_e_kyc') && !ev('bank-account-frozen', bf('police')).includes('bf_e_kyc'), 'KYC item only on KYC branch');
const d1 = { dv_safe: 'safe', dv_role: 'both', dv_agree: 'all', dv_marriage: 'hindu', dv_cert: 'yes', dv_children: 'none' };
const d2 = { dv_safe: 'safe', dv_role: 'me', dv_agree: 'no', dv_marriage: 'hindu', dv_cert: 'no', dv_children: 'with_me' };
ok(ev('divorce-separation', d1) !== ev('divorce-separation', d2), 'divorce: mutual vs contested lists must differ');
ok(!ev('divorce-separation', d1).includes('dv_e_children'), 'divorce: no children docs when no children');

// Prune: changing an answer removes dependent answers
const ans = { bf_how: 'bank_told', bf_reason: 'kyc', bf_written: 'no', bf_scope: 'full', bf_kyc_attempts: 'submitted' };
ans.bf_reason = 'police'; const removed = E.prune(byId('bank-account-frozen'), ans);
ok(removed.includes('bf_kyc_attempts') && !('bf_kyc_attempts' in ans), 'prune removes stale KYC answer');

// Urgent routing
ok(E.urgent(byId('upi-cyber-fraud'), { uf_when: 'today', uf_reported: ['none'] }).some((u) => u.level === 'now'), 'UPI fraud today + unreported => urgent now');
ok(!E.urgent(byId('upi-cyber-fraud'), { uf_when: 'today', uf_reported: ['h1930', 'bank'] }).some((u) => u.id === 'uf_u_report'), 'no report-now banner once reported');
ok(E.urgent(byId('divorce-separation'), { dv_safe: 'danger' }).some((u) => u.level === 'now'), 'divorce danger => urgent now');
ok(E.urgent(byId('money-lent-not-returned'), { ml_cheque: 'bounced', ml_bounce_date: 'w2' }).some((u) => u.level === 'now'), 'cheque bounce => urgent');
ok(E.info(byId('failed-payment-debited'), { fp_mode: 'atm' })[0].text.includes('T+5'), 'ATM TAT is T+5');
ok(E.info(byId('failed-payment-debited'), { fp_mode: 'upi_p2p' })[0].text.includes('T+1'), 'UPI P2P TAT is T+1');

// New guides: situation check + key branches
ok(E.stand(byId('cheque-bounce'), { cb_side: 'payee', cb_memo_when: 'd15' }).some((x) => x.k === 'good'), 'cheque: inside notice window => good');
ok(E.urgent(byId('digital-arrest-scam'), { da_now: 'ongoing' }).some((u) => u.level === 'now'), 'digital arrest ongoing => urgent');
ok(E.urgent(byId('traffic-challan'), { tr_problem: 'wrong', tr_days: 'u45' }).length === 1, 'challan within 45 days => contest banner');
ok(ev('ecommerce-order', { ec_problem: 'wrong', ec_paid: 'card', ec_complained: 'no', ec_value: 'u5k' }).includes('ec_e_unbox'), 'ecommerce wrong item asks for unboxing');
ok(!ev('ecommerce-order', { ec_problem: 'notdel', ec_paid: 'cod', ec_complained: 'no', ec_value: 'u5k' }).includes('ec_e_pay'), 'COD: no payment proof');
ok(KB.issues.length >= 66, 'at least 66 guides');
ok(KB.issues.filter((i) => i.cat === 'young' || (i.also || []).includes('young')).length >= 15, 'young people area has at least 15 guides');
// QA journeys exist
KB.questions.forEach((q) => ok(!q.journey || KB.issues.some((i) => i.id === q.journey), 'qa journey missing ' + q.id));
ok(KB.issues.filter((i) => !i.general).length >= 40, 'expected >=40 journeys, got ' + KB.issues.length);
// Directory titles unique
const titles = KB.directory.map((d) => d.title.toLowerCase());
ok(new Set(titles).size === titles.length, 'directory titles unique');

console.log(`${passes} passed, ${fails} failed`);
process.exit(fails ? 1 : 0);
