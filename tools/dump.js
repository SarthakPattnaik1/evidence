global.window = global;
['kb','j-money','j-family','j-consumer','j-other','j-nri','j-business','j-more','j-genz', 'j-gaps', 'stand','law-2026','reviews','qa'].forEach((f) => require('../src/' + f + '.js'));
const KB = global.ER_KB;
require('../src/i18n.js');
process.stdout.write(JSON.stringify({ checked: KB.lawChecked, version: KB.version, langs: global.ER_I18N.LANGS.map((l) => ({ code: l.code, name: l.name, native: l.native, ui: !!global.ER_I18N.STRINGS[l.code] })), help: KB.help, cats: KB.categories, issues: KB.issues.map((i) => ({ id: i.id, cat: i.cat, title: i.title, short: i.short, intro: i.intro, juris: i.juris, synonyms: i.synonyms, checked: i.checked, review: i.review || null, sources: i.sources, nq: i.questions.length, urgent: (i.urgent || []).map((u) => ({ id: u.id, title: u.title, level: u.level })), evidence: i.evidence.map((e) => ({ name: e.name, why: e.why })), questions: i.questions.slice(0, 8).map((q) => q.text) })) }));
