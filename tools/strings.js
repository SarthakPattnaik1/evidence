// Every English string the app can show, so it can be translated ahead of time (tools/pretranslate.js).
const fs = require('fs'); const path = require('path');
const SRC = path.join(__dirname, '..', 'src');
global.window = global;
['kb', 'j-money', 'j-family', 'j-consumer', 'j-other', 'j-nri', 'j-business', 'j-more', 'j-genz', 'stand', 'law-2026', 'reviews', 'qa', 'i18n'].forEach((f) => require(path.join(SRC, f + '.js')));
const KB = global.ER_KB; const I18N = global.ER_I18N;
const app = fs.readFileSync(path.join(SRC, 'app.js'), 'utf8');
const out = new Set(); const add = (s) => { if (typeof s === 'string' && s.trim() && /[A-Za-z]/.test(s)) out.add(s); };
const unq = (s) => s.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');

// 1. Interface words (needed for languages without built-in strings)
I18N.STRINGS.en.forEach(add);
// 2. Literal X('...') calls in the app
for (const m of app.matchAll(/\b(?:X|tx)\('((?:[^'\\]|\\.)*)'/g)) add(unq(m[1]));
// Help page: call-grid labels and portal group names
for (const m of app.matchAll(/\['[a-z0-9]+', '([^']+)'\]/g)) add(m[1]);
for (const m of app.matchAll(/\['([^']+)', '[a-z]+', \[/g)) add(m[1]);
add('All');
// 3. Home page constants
const grab = (name) => { const m = app.match(new RegExp('const ' + name + ' = (\\{[^\\n]*\\}|\\[[^\\n]*\\]);')); return m ? Function('return ' + m[1])() : null; };
const HERO = grab('HERO') || {}; const FOOT = grab('FOOT') || {}; const SUGGEST = grab('SUGGEST') || [];
Object.values(HERO).forEach(add); Object.values(FOOT).forEach(add); SUGGEST.forEach(add);
['Ask', 'In your language', 'Prepare', 'Step by step', 'Organize', 'Your evidence', 'Be Ready', 'With confidence'].forEach(add);
// 4. Knowledge base
KB.categories.forEach((c) => { add(c.title); add(c.blurb); });
KB.directory.forEach((d) => { add(d.title); add(d.urgentNote); });
add(KB.reviewed.label);
for (const i of KB.issues) {
  [i.short, i.title, i.intro, i.juris].forEach(add);
  i.questions.forEach((q) => { add(q.text); add(q.why); add(q.chapter || 'The basics'); q.options.forEach((o) => add(o.label)); });
  i.evidence.forEach((e) => ['name', 'why', 'where', 'preserve', 'time', 'limit'].forEach((k) => add(e[k])));
  (i.urgent || []).forEach((u) => { add(u.title); add(u.text); });
  (i.info || []).forEach((x) => add(x.text));
  (i.stand || []).forEach((x) => add(x.text));
}
Object.values(KB.help).forEach((h) => { add(h.name); add(h.detail); });
(KB.questions || []).forEach((q) => { add(q.q); add(q.a); (q.depends || []).forEach(add); });
(KB.myths || []).forEach((m) => { add(m.s); add(m.why); });

const list = [...out];
if (require.main === module) { const chars = list.reduce((n, s) => n + s.length, 0); console.log(JSON.stringify({ strings: list.length, chars })); }
module.exports = list;
