/* Time limits: every quote must match the official Schedule word for word; every rule must point at a real question and real options;
   the arithmetic must hold on worked examples. Needs the dev server (for the guide data): node test/devserver.js */
const L = require('../src/limits.js'); const sched = require('../law/limitation-schedule.json').articles;
const { chromium } = require('playwright'); const B = process.env.URL || 'http://localhost:8790/';
const fails = []; const norm = (x) => x.replace(/\s+/g, ' ').replace(/[‘’]/g, "'").trim();
for (const [n, a] of Object.entries(L.ART)) {
  const o = sched[Number(n) - 1]; if (!o || o.art !== Number(n)) { fails.push('Article ' + n + ' missing from schedule'); continue; }
  const raw = norm(o.raw.replace(/-\s*\n\s*/g, '').replace(/\n/g, ' '));
  for (const part of [a.d, a.p, a.s]) { const words = norm(part).split(' '); if (!words.every((w) => raw.includes(w))) fails.push(`Article ${n}: "${part.slice(0, 50)}…" not in the official text`); }
  if (norm(o.period) !== norm(a.p)) fails.push(`Article ${n}: period ${a.p} ≠ official ${o.period}`);
}
const t = new Date(2026, 9, 31); const st = (g, a, e) => { const c = L.card(g, a, e, t); return c ? c.status : null; };
const cases = [
  ['money-lent-not-returned', { ml_when: 'y1' }, null, 'ok'], ['money-lent-not-returned', { ml_when: 'y3' }, null, 'edge'], ['money-lent-not-returned', { ml_when: 'older' }, null, 'past'],
  ['money-lent-not-returned', { ml_when: 'several' }, null, 'unknown'], ['money-lent-not-returned', { ml_when: 'y3' }, '2023-12-15', 'soon'], ['money-lent-not-returned', { ml_when: 'y3' }, '2023-10-01', 'past'],
  ['money-lent-not-returned', { ml_when: 'y1' }, '2026-10-20', 'ok'], ['defamation', { df_side: 'accused', df_when: 'old' }, null, null], ['defamation', { df_side: 'victim', df_when: 'old' }, null, 'past'],
  ['land-encroachment', { le_possession: 'me', le_problem: 'occupied', le_since: 'long' }, null, null], ['land-encroachment', { le_possession: 'them', le_problem: 'occupied', le_since: 'years' }, null, 'ok'],
  ['land-encroachment', { le_possession: 'me', le_problem: 'fakedocs', le_since: 'year' }, null, 'ok'], ['nri-property', { np_problem: 'tenant', np_since: 'long' }, null, null]
];
for (const [g, a, e, want] of cases) { const got = st(g, a, e); if (got !== want) fails.push(`${g} ${JSON.stringify(a)} ${e || ''}: ${got} ≠ ${want}`); }
const ex = L.card('money-lent-not-returned', { ml_when: 'y3' }, '2024-02-29', t); if (!ex || ex.exact.end.toDateString() !== new Date(2027, 1, 28).toDateString()) fails.push('29 Feb + 3 years should be 28 Feb');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); await p.goto(B); await p.waitForTimeout(400);
  const guides = await p.evaluate(() => (window.ER_KB.issues || []).map((g) => ({ id: g.id, qs: g.questions.map((q) => ({ id: q.id, opts: q.options.map((o) => o.id) })), urgent: (g.urgent || []).map((u) => u.id) })));
  for (const r of L.RULES) {
    const g = guides.find((x) => x.id === r.guide); if (!g) { fails.push('rule ' + r.id + ': no guide ' + r.guide); continue; }
    const q = g.qs.find((x) => x.id === r.q); if (!q) { fails.push('rule ' + r.id + ': no question ' + r.q); continue; }
    for (const k of Object.keys(r.b)) if (!q.opts.includes(k)) fails.push(`rule ${r.id}: option ${k} not in ${r.q}`);
    for (const o of q.opts) if (!r.b[o] && !(r.unknown || {})[o] && !['unsure'].includes(o)) fails.push(`rule ${r.id}: answer ${r.q}=${o} has no range`);
    for (const u of r.replaces || []) if (!g.urgent.includes(u)) fails.push(`rule ${r.id}: replaces unknown banner ${u}`);
  }
  await b.close();
  console.log(fails.length ? 'LIMITS FAIL\n' + fails.join('\n') : `LIMITS OK (${Object.keys(L.ART).length} articles match the official text; ${L.RULES.length} rules; ${cases.length + 1} worked examples)`);
  process.exit(fails.length ? 1 : 0);
})();
