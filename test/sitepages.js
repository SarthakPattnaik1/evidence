/* Situation pages: one per situation, specific content, near-duplicates kept out of search engines. Run after build.py. */
const fs = require('fs'); const path = require('path'); const B = path.join(__dirname, '..', 'build');
const fails = []; const dir = path.join(B, 's'); const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html') && f !== 'index.html');
const sm = fs.readFileSync(path.join(B, 'sitemap.xml'), 'utf8'); let idx = 0, noidx = 0;
for (const f of files) {
  const h = fs.readFileSync(path.join(dir, f), 'utf8'); const slug = f.replace('.html', '');
  if (!h.includes('href="/#sit-' + slug + '"')) fails.push('no app link: ' + slug);
  if (!h.includes('<h2>Papers to gather</h2>')) fails.push('no papers: ' + slug);
  if (!h.includes('id="dgh"') && !h.includes('dgh')) fails.push('no disclaimer: ' + slug);
  const no = h.includes('noindex'); const inMap = sm.includes('/s/' + slug + '<');
  if (no && inMap) fails.push('noindex page in sitemap: ' + slug); if (!no && !inMap) fails.push('indexed page missing from sitemap: ' + slug);
  no ? noidx++ : idx++;
}
fails.slice(0, 20).forEach((x) => console.log('FAIL', x));
console.log(`situation pages: ${files.length} (${idx} indexed, ${noidx} noindex near-duplicates)`);
if (fails.length || files.length < 500) process.exit(1); console.log('SITEPAGES OK');
