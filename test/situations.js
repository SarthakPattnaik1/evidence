/* Every situation must open a real guide, and every pre-filled answer must be a real question/option of that guide. */
global.window = global;
['kb', 'cites', 'j-money', 'j-family', 'j-consumer', 'j-other', 'j-nri', 'j-business', 'j-more', 'j-genz', 'j-gaps', 'j-rights', 'stand', 'law-2026', 'situations', 'reviews', 'qa'].forEach((f) => require('../src/' + f + '.js'));
const K = global.ER_KB; const fails = [];
const BY = Object.fromEntries(K.issues.map((i) => [i.id, i]));
const seen = new Set(); const perGuide = {}; const slugs = new Set();
for (const s of K.situations) {
  const iss = BY[s.g]; if (!iss) { fails.push('no guide: ' + s.g + ' — ' + s.t); continue; }
  perGuide[s.g] = (perGuide[s.g] || 0) + 1;
  if (!s.slug || slugs.has(s.slug)) fails.push('slug missing or repeated: ' + s.t); slugs.add(s.slug);
  const k = s.t.toLowerCase(); if (seen.has(k)) fails.push('duplicate: ' + s.t); seen.add(k);
  if (BY[s.g] && s.t.toLowerCase() === iss.short.toLowerCase()) fails.push('same as guide name: ' + s.t);
  for (const [q, v] of Object.entries(s.pre || {})) {
    const qq = iss.questions.find((x) => x.id === q);
    if (!qq) { fails.push(`${s.g}: no question ${q} (${s.t})`); continue; }
    if (!qq.options.some((o) => o.id === v)) fails.push(`${s.g}: ${q} has no option ${v} (${s.t})`);
  }
  if (s.t.length > 80) fails.push('title too long: ' + s.t);
}
const guides = K.issues.filter((i) => !i.general);
const none = guides.filter((g) => !perGuide[g.id]).map((g) => g.id);
fails.forEach((f) => console.log('FAIL', f));
console.log(`situations: ${K.situations.length} across ${Object.keys(perGuide).length}/${guides.length} guides` + (none.length ? '; guides with none: ' + none.join(', ') : ''));
if (fails.length || K.situations.length < 500) { if (K.situations.length < 500) console.log('FAIL: fewer than 500'); process.exit(1); }
console.log('SITUATIONS OK');
