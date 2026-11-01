global.window = global;
['kb','cites','j-money','j-family','j-consumer','j-other','j-nri','j-business','j-more','j-genz', 'j-gaps', 'j-rights', 'j-crucial', 'stand','law-2026','situations','reviews','qa', 'qa2'].forEach((f) => require('../src/' + f + '.js'));
const KB = global.ER_KB; require('../src/engine.js'); const E = global.ER_ENGINE;
// Could this condition still come true once the remaining questions are answered? An unanswered question counts
// as "maybe" only if it could still be asked (its own condition can come true); otherwise it never will be answered.
const maybe = (c, a, iss) => !c ? true : c.all ? c.all.every((x) => maybe(x, a, iss)) : c.any ? c.any.some((x) => maybe(x, a, iss))
  : c.not ? (refsAnswered(c.not, a) ? !E.evalWhen(c.not, a) : true)
  : c.q ? (a[c.q] != null ? E.evalWhen(c, a) : (() => { const q = iss.questions.find((x) => x.id === c.q); return !!q && maybe(q.when, a, iss); })()) : true;
const refsAnswered = (c, a) => E.refs(c, []).every((r) => a[r.q] != null);
require('../src/i18n.js');
process.stdout.write(JSON.stringify({ checked: KB.lawChecked, version: KB.version, langs: global.ER_I18N.LANGS.map((l) => ({ code: l.code, name: l.name, native: l.native, ui: !!global.ER_I18N.STRINGS[l.code] })), help: KB.help, cats: KB.categories, issues: KB.issues.map((i) => ({ id: i.id, cat: i.cat, title: i.title, short: i.short, intro: i.intro, juris: i.juris, synonyms: i.synonyms, checked: i.checked, review: i.review || null, sources: i.sources, nq: i.questions.length, urgent: (i.urgent || []).map((u) => ({ id: u.id, title: u.title, level: u.level })), evidence: i.evidence.map((e) => ({ name: e.name, why: e.why })), questions: i.questions.slice(0, 8).map((q) => q.text),
  full: { qs: i.questions.map((q) => ({ id: q.id, t: q.text, why: q.why, deep: !!q.deep, cond: !!q.when, o: q.options.map((o) => o.label) })),
    ev: i.evidence.map((e) => ({ name: e.name, why: e.why, where: e.where || '', preserve: e.preserve || '', time: e.time || '', action: !!e.action, cond: !!e.when })),
    urg: (i.urgent || []).map((u) => ({ level: u.level, t: u.title, x: u.text })), stand: (i.stand || []).map((s) => ({ k: s.k, t: s.text })),
    lqs: (i.lawyerQs || []).map((l) => l.text), nsit: KB.situations.filter((x) => x.g === i.id).length } })) , situations: KB.situations.map((x) => { const iss = KB.issues.find((i) => i.id === x.g); const a = x.pre || {};
  const qmap = Object.fromEntries(iss.questions.map((q) => [q.id, q]));
  return { slug: x.slug, t: x.t, g: x.g, cat: iss.cat, note: x.note, syn: x.s,
    told: Object.entries(a).map(([q, v]) => ({ q: qmap[q].text, a: (qmap[q].options.find((o) => o.id === v) || {}).label })),
    ev: E.evidence(iss, a).map((e) => ({ id: e.id, name: e.name, why: e.why, where: e.where || '', action: !!e.action })),
    maybe: iss.evidence.filter((e) => !E.evalWhen(e.when, a) && maybe(e.when, a, iss)).map((e) => ({ id: e.id, name: e.name, why: e.why })),
    urg: E.urgent(iss, a).filter((u) => u.level !== 'info').map((u) => ({ t: u.title, x: u.text })),
    stand: E.stand(iss, a).map((s) => ({ k: s.k, t: s.text })),
    ask: E.stageQuestions(iss, a, 'quick').filter((q) => a[q.id] == null).map((q) => q.text).slice(0, 6) }; })}));
