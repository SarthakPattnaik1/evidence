global.window = global;
['kb','j-money','j-family','j-consumer','j-other','j-nri','j-business','j-more','j-genz','stand','law-2026','qa'].forEach((f) => require('../src/' + f + '.js'));
const KB = global.ER_KB;
process.stdout.write(JSON.stringify({ checked: KB.lawChecked, cats: KB.categories, issues: KB.issues.map((i) => ({ id: i.id, cat: i.cat, title: i.title, short: i.short, intro: i.intro, juris: i.juris, synonyms: i.synonyms, checked: i.checked, sources: i.sources, evidence: i.evidence.map((e) => ({ name: e.name, why: e.why })), questions: i.questions.slice(0, 8).map((q) => q.text) })) }));
