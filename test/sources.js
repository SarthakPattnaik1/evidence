/* Sources must open what they say. Fails if: a link points to the retired India Code domain or the old Supreme Court
   domain; a named Act or judgment links to a bare homepage; or a link is not on the list checked on 31 Oct 2026.
   To add a link: open it on a phone in India, confirm the page matches the label, then add it to CHECKED. */
global.window = global;
['kb', 'cites', 'j-money', 'j-family', 'j-consumer', 'j-other', 'j-nri', 'j-business', 'j-more', 'j-genz', 'j-gaps', 'j-rights', 'stand', 'law-2026', 'situations', 'reviews', 'qa', 'qa2'].forEach((f) => require('../src/' + f + '.js'));
const K = global.ER_KB, C = global.ER_CITE; const fails = [];
// Opened and matched on 31 Oct 2026 (Mumbai and US). "blocked" = refused automated checks from cloud servers; open on a phone to confirm.
const CHECKED = new Set(require('fs').readFileSync(__dirname + '/sources-checked.txt', 'utf8').split('\n').map((l) => l.split(' ')[0]).filter((l) => /^https?:/.test(l)));
const all = [];
K.issues.forEach((i) => (i.sources || []).forEach((s) => all.push({ where: 'guide ' + i.id, t: s.t, u: s.u })));
Object.entries(K.help || {}).forEach(([k, h]) => h.href && all.push({ where: 'help ' + k, t: h.name, u: h.href }));
Object.entries(C.CASE).forEach(([k, c]) => all.push({ where: 'case ' + k, t: c.t, u: c.u }));
Object.entries(C.ACT).forEach(([k, c]) => all.push({ where: 'act ' + k, t: c.t, u: c.u }));
for (const s of all) {
  if (!s.u) continue;
  if (/indiacode\.nic\.in|main\.sci\.gov\.in|www\.sci\.gov\.in\/?$/.test(s.u)) fails.push(`${s.where}: retired or homepage-only domain ${s.u}`);
  const specific = /\b\w+ Act, \d{4}\b|\bv\. [A-Z]/.test(s.t) && !/official|portal|site/i.test(s.t);
  const bare = !/indiankanoon\.org\/doc\/\d+\/$/.test(s.u) && new URL(s.u).pathname.replace(/\/$/, '') === '' && !new URL(s.u).search;
  if (specific && bare) fails.push(`${s.where}: "${s.t.slice(0, 60)}" names a specific law or case but links to a homepage (${s.u})`);
  if (!CHECKED.has(s.u)) fails.push(`${s.where}: ${s.u} is not on the checked list`);
}
// every case named in a Q&A "Law:" line or guide text must be in the registry
const text = JSON.stringify([K.issues.map((i) => i.juris), K.questions.map((q) => q.law)]);
(text.match(/[A-Z][A-Za-z.]+(?: [A-Z][A-Za-z.]+)* v\. [A-Z][A-Za-z.]+(?: [A-Za-z.]+){0,4}/g) || []).forEach((m0) => { const m = m0.replace(/^(In|See|Per|In the case of) /, ''); if (!Object.keys(C.CASE).some((k) => m.startsWith(k) || k.startsWith(m.replace(/ \(.*/, '')))) fails.push('case named but not in src/cites.js: ' + m); });
const n = all.filter((s) => s.u).length, nolink = all.filter((s) => !s.u).length;
console.log(fails.length ? 'SOURCES FAIL\n' + [...new Set(fails)].join('\n') : `SOURCES OK (${n} links all on the checked list, ${nolink} citations shown without a link, no retired domains, no homepage stand-ins)`);
process.exit(fails.length ? 1 : 0);
