/* Saboot time limits. Pure data + arithmetic; no DOM.
   Every rule quotes the Schedule of the Limitation Act, 1963 as printed in the official text kept in law/limitation-act-1963.txt.
   Rules are a guide for the person, never a calculation their case depends on: we always show a range or an "about" date,
   prefer the EARLIER start when the law could be read two ways, and never tell anyone they are "within time". */
(function (root) {
  const LA = 'Limitation Act, 1963';
  const ART = {
    15: { n: '15', d: 'For the price of goods sold and delivered to be paid for after the expiry of a fixed period of credit.', p: 'Three years.', s: 'When the period of credit expires.' },
    18: { n: '18', d: 'For the price of work done by the plaintiff for the defendant at his request, where no time has been fixed for payment.', p: 'Three years.', s: 'When the work is done.' },
    19: { n: '19', d: 'For money payable for money lent.', p: 'Three years.', s: 'When the loan is made.' },
    55: { n: '55', d: 'For compensation for the breach of any contract, express or implied not herein specially provided for.', p: 'Three years.', s: 'When the contract is broken or (where there are successive breaches) when the breach in respect of which the suit is instituted occurs or (where the breach is continuing) when it ceases.' },
    59: { n: '59', d: 'To cancel or set aside an instrument or decree or for the rescission of a contract.', p: 'Three years.', s: 'When the facts entitling the plaintiff to have the instrument or decree cancelled or set aside or the contract rescinded first become known to him.' },
    64: { n: '64', d: 'For possession of immovable property based on previous possession and not on title, when the plaintiff while in possession of the property has been dispossessed.', p: 'Twelve years.', s: 'The date of dispossession.' },
    65: { n: '65', d: 'For possession of immovable property or any interest therein based on title.', p: 'Twelve years.', s: 'When the possession of the defendant becomes adverse to the plaintiff.' },
    75: { n: '75', d: 'For compensation for libel.', p: 'One year.', s: 'When the libel is published.' },
    76: { n: '76', d: 'For compensation for slander.', p: 'One year.', s: 'When the words are spoken, or, if the words are not actionable in themselves, when the special damage complained of results.' },
    113: { n: '113', d: 'Any suit for which no period of limitation is provided elsewhere in this Schedule.', p: 'Three years.', s: 'When the right to sue accrues.' }
  };
  // Ways the clock can start again or count later. Plain words first, the section after.
  const TIP = {
    ack: { t: 'Did they admit the debt in writing and sign it? That can start the time again.', s: 'Section 18' },
    part: { t: 'Did they pay any part back? That can start the time again.', s: 'Section 19' },
    fraud: { t: 'Were you cheated and found out only later? The time may count from when you found out.', s: 'Section 17' },
    continuing: { t: 'Is the breach still going on? The time may count from when it stops.', s: 'Article 55' },
    adverse: { t: 'The 12 years usually count from when they openly claimed it as theirs — not from when they arrived.', s: 'Article 65' },
    knowledge: { t: 'The 3 years count from when you found out — not from the date on the paper.', s: 'Article 59' },
    criminal: { t: 'This is for a civil case for money. A police complaint has its own time limit.', s: '' }
  };
  const Y = (a, b) => [a * 12, b == null ? null : b * 12];
  const STD5 = { m6: [0, 6], y1: [6, 12], y2: [12, 24], y3: [24, 36], older: [36, null] };
  const RULES = [
    { id: 'loan', guide: 'money-lent-not-returned', q: 'ml_when', months: 36, arts: [19], what: 'a case to get your money back',
      start: 'the day the money was given', startShort: 'Money given', unknown: { several: 'If you gave money several times, the time usually runs separately from each payment. List every date.' },
      b: { y1: [0, 12], y2: [12, 24], y3: [24, 36], older: [36, null] },
      restart: { q: 'ml_since', in: ['paid', 'admitted'], t: 'They paid something back or admitted the debt — the time can start again from that date. Note exactly when.' },
      tips: ['ack', 'part', 'fraud'], replaces: ['ml_u_old'] },
    { id: 'biz', guide: 'business-unpaid', q: 'bu_since', months: 36, arts: [15, 18, 113], what: 'a case to recover what you are owed',
      start: 'the day payment fell due', startShort: 'Payment due',
      b: { recent: [0, 12], y2: [12, 24], y3: [24, 36], older: [36, null] },
      restart: { q: 'bu_ack', in: ['yes'], t: 'The client admitted the dues or paid part — the time can start again from that date. Note exactly when.' },
      tips: ['ack', 'part'], replaces: ['bu_u_limit'] },
    { id: 'defame', guide: 'defamation', q: 'df_when', when: { q: 'df_side', in: ['victim'] }, months: 12, arts: [75, 76], what: 'a case claiming compensation',
      start: 'the day it was first published or said', startShort: 'Published',
      b: { recent: [0, 3], m9: [3, 9], year: [9, 12], old: [12, null] }, tips: ['criminal'] },
    { id: 'land', guide: 'land-encroachment', q: 'le_since', months: 144, arts: [64, 65], what: 'a case to get the land back',
      when: { all: [{ q: 'le_possession', in: ['them', 'partly'] }, { q: 'le_problem', in: ['building', 'occupied', 'boundary', 'access'] }] },
      start: 'the day you were pushed out, or their possession became openly against you', startShort: 'Pushed out',
      b: { weeks: [0, 1], year: [1, 12], years: [12, 120], long: [120, null] }, tips: ['adverse'], replaces: ['le_u_long'] },
    { id: 'landdocs', guide: 'land-encroachment', q: 'le_since', months: 36, arts: [59], what: 'a case to cancel the fake or wrong papers',
      when: { q: 'le_problem', in: ['fakedocs', 'records'] },
      start: 'the day you first found out', startShort: 'Found out',
      b: { weeks: [0, 1], year: [1, 12], years: [12, 120], long: [120, null] }, tips: ['knowledge', 'fraud'] },
    { id: 'nriland', guide: 'nri-property', q: 'np_since', months: 144, arts: [64, 65], what: 'a case to get the property back',
      when: { q: 'np_problem', in: ['relative', 'stranger', 'caretaker'] },
      start: 'the day they took it over, or their possession became openly against you', startShort: 'Taken over',
      b: { recent: [0, 12], years: [12, 120], long: [120, null] }, tips: ['adverse'], replaces: ['np_u_long'] },
    { id: 'nridocs', guide: 'nri-property', q: 'np_since', months: 36, arts: [59], what: 'a case to cancel the fake or wrong papers',
      when: { q: 'np_problem', in: ['sold', 'records'] },
      start: 'the day you first found out', startShort: 'Found out',
      b: { recent: [0, 12], years: [12, 120], long: [120, null] }, tips: ['knowledge', 'fraud'] },
    { id: 'deposit', guide: 'rental-security-deposit', q: 'rd_moved', months: 36, arts: [113], what: 'a case to get the deposit back',
      start: 'the day you moved out and handed back the keys', startShort: 'Moved out', b: STD5, tips: [] },
    { id: 'contract', guide: 'contract-breach', q: 'cbx_when', months: 36, arts: [55], what: 'a case for compensation',
      start: 'the day the deal was broken', startShort: 'Deal broken', b: STD5, tips: ['continuing'] },
    { id: 'gig', guide: 'internship-creator-pay', q: 'ic_when', months: 36, arts: [18, 113], what: 'a case to recover the payment',
      start: 'the day payment fell due, or the work was finished', startShort: 'Payment due', b: STD5, tips: ['ack', 'part'] }
  ];
  function evalWhen(c, a) {
    if (!c) return true;
    if (c.all) return c.all.every((x) => evalWhen(x, a));
    if (c.any) return c.any.some((x) => evalWhen(x, a));
    if (c.not) return !evalWhen(c.not, a);
    const v = a[c.q]; if (v == null) return false; return [].concat(v).some((x) => c.in.includes(x));
  }
  const rulesFor = (gid) => RULES.filter((r) => r.guide === gid);
  function rule(gid, answers) { return rulesFor(gid).find((r) => evalWhen(r.when, answers) && answers[r.q] != null) || null; }

  // months → "about 2 years" style parts (returned as [n, unit] so the app can translate)
  function span(m) {
    if (m < 1) return [Math.max(1, Math.round(m * 30)), 'days'];
    if (m < 11.5) return [Math.round(m), m < 1.5 ? 'month' : 'months'];
    const y = Math.floor(m / 12 + 0.25), r = m / 12 - Math.floor(m / 12);
    if (r >= 0.25 && r < 0.75) return [Math.floor(m / 12) + 0.5, 'years'];
    return [y, y === 1 ? 'year' : 'years'];
  }
  const addMonths = (d, m) => { const x = new Date(d.getTime()); const day = x.getDate(); x.setMonth(x.getMonth() + m); if (x.getDate() !== day) x.setDate(0); return x; };
  const monthsBetween = (a, b) => (b - a) / (1000 * 60 * 60 * 24 * 30.4375);

  /* status: ok | soon | edge | past | unknown
     exact: optional ISO date (yyyy-mm-dd) the person typed for the start event */
  function card(gid, answers, exact, today) {
    const r = rule(gid, answers); if (!r) return null;
    today = today || new Date();
    const P = r.months; const ans = [].concat(answers[r.q])[0];
    const restarted = !!(r.restart && evalWhen({ q: r.restart.q, in: r.restart.in }, answers));
    const out = { rule: r, arts: r.arts.map((n) => ART[n]), law: LA, months: P, restarted, tips: r.tips.map((k) => TIP[k]) };
    const soonAt = Math.max(Math.min(P * 0.25, 12), 2);
    if (exact && /^\d{4}-\d{2}-\d{2}$/.test(exact)) {
      const [y, mo, d] = exact.split('-').map(Number); const st = new Date(y, mo - 1, d);
      if (st <= today) {
        const end = addMonths(st, P); const left = monthsBetween(today, end);
        out.exact = { start: st, end, leftDays: Math.round((end - today) / 864e5) };
        out.elapsed = [monthsBetween(st, today), monthsBetween(st, today)];
        out.status = left < 0 ? 'past' : left <= Math.min(1, soonAt) ? 'edge' : left <= soonAt ? 'soon' : 'ok';
        out.left = left > 0 ? [left, left] : null;
        return out;
      }
    }
    const b = r.b[ans];
    if (!b) { out.status = 'unknown'; out.note = (r.unknown || {})[ans] || null; return out; }
    const [mn, mx] = b; out.elapsed = [mn, mx == null ? Math.max(P * 1.25, mn + 12) : mx];
    const remMax = P - mn, remMin = mx == null ? -Infinity : P - mx;
    out.status = remMax <= 0 ? 'past' : remMin <= 0 ? 'edge' : remMin <= soonAt ? 'soon' : 'ok';
    out.left = remMax > 0 ? [Math.max(remMin, 0), remMax] : null;
    return out;
  }
  const replaced = (gid, answers) => { const r = rule(gid, answers); return r ? r.replaces || [] : []; };
  // unit phrases the app translates (listed so the translation allowlist sees them): '{n} days' '{n} month' '{n} months' '{n} year' '{n} years'
  const api = { RULES, ART, TIP, LA, rule, rulesFor, card, span, replaced, addMonths };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.ER_LIM = api;
})(typeof window !== 'undefined' ? window : globalThis);
