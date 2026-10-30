/* Search coverage: real-world queries (English, Hinglish) must find the right guide. Run: node test/search.js */
const fs = require('fs'); const path = require('path');
global.window = global;
['kb', 'j-money', 'j-family', 'j-consumer', 'j-other', 'j-nri', 'j-business', 'j-more', 'j-genz', 'j-gaps', 'stand', 'law-2026', 'reviews', 'qa', 'engine'].forEach((f) => require('../src/' + f + '.js'));
const K = global.ER_KB, E = global.ER_ENGINE;
const items = [];
K.issues.filter((i) => !i.general).forEach((i) => items.push({ text: i.title + ' ' + i.short, syn: i.synonyms, ref: { bonus: 1, id: i.id } }));
K.directory.forEach((d) => items.push({ text: d.title, syn: d.synonyms, ref: { bonus: 0, id: 'dir:' + d.title } }));
K.questions.forEach((x) => items.push({ text: x.q, syn: x.kw, ref: { bonus: -1, min: 3, id: 'qa:' + x.id } }));
const search = (q) => E.search(items, q).filter((r) => !r.ref.min || r.s >= r.ref.min).map((r) => ({ s: r.s + r.ref.bonus, id: r.ref.id })).sort((a, b) => b.s - a.s).filter((r, i, a) => i === 0 || r.s >= a[0].s * 0.4).slice(0, 5);
let total = 0, top3 = 0, first = 0; const misses = [];
for (const f of fs.readdirSync(path.join(__dirname, 'search'))) {
  for (const l of fs.readFileSync(path.join(__dirname, 'search', f), 'utf8').split('\n')) {
    if (!l.trim() || l.startsWith('#')) continue;
    const [q, exp] = l.split('|').map((s) => s.trim()); const want = exp.split(',').map((s) => s.trim());
    const ids = search(q).map((x) => x.id); total++;
    if (want.includes(ids[0])) first++;
    if (ids.slice(0, 3).some((x) => want.includes(x))) top3++; else misses.push(`${q} → want ${want.join('/')}, got ${ids.slice(0, 3).join(', ') || 'nothing'}`);
  }
}
misses.forEach((m) => console.log('MISS:', m));
console.log(`search: ${total} queries, right guide first ${Math.round(first / total * 100)}%, in top 3 ${Math.round(top3 / total * 100)}%`);
if (top3 / total < 0.97 || first / total < 0.9) { console.log('FAIL: search coverage dropped'); process.exit(1); }
