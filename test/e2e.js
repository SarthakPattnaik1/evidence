const { chromium } = require('playwright');
const fs = require('fs');
// Optional: `npm i @fontsource/bricolage-grotesque @fontsource/courier-prime @fontsource/noto-sans` in FONT_DIR for true-to-life screenshots
const F = (process.env.FONT_DIR || '/tmp/fonts') + '/node_modules/@fontsource/';
const css = !fs.existsSync(F) ? '' : [['Bricolage Grotesque', 'bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff2', 700], ['Bricolage Grotesque', 'bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff2', 800],
  ['Courier Prime', 'courier-prime/files/courier-prime-latin-700-normal.woff2', 700], ['Noto Sans', 'noto-sans/files/noto-sans-latin-400-normal.woff2', 400], ['Noto Sans', 'noto-sans/files/noto-sans-latin-600-normal.woff2', 600], ['Noto Sans', 'noto-sans/files/noto-sans-latin-700-normal.woff2', 700]]
  .map(([f, p, w]) => `@font-face{font-family:"${f}";font-weight:${w};src:url(data:font/woff2;base64,${fs.readFileSync(F + p).toString('base64')}) format("woff2")}`).join('\n');
const url = 'file://' + require('path').resolve(__dirname, '../build/index.html') + '';
(async () => {
  const b = await chromium.launch(); const errs = [];
  const page = async (vp) => { const p = await b.newPage({ viewport: vp }); p.on('pageerror', (e) => errs.push(e.message));
    await p.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ contentType: 'text/css', body: css })); return p; };
  const shot = (p, n, full) => p.screenshot({ path: '' + require('path').resolve(__dirname, 'shots') + '/' + n + '.png', fullPage: !!full });
  for (const [n, vp] of [['m', { width: 390, height: 844 }], ['d', { width: 1280, height: 860 }]]) {
    const p = await page(vp); await p.goto(url); await p.waitForTimeout(500);
    await shot(p, n + '-home', n === 'd');
    if (n === 'm') await shot(p, 'm-home-full', true);
    await p.fill('#matter', 'my cheque bounced'); await p.waitForTimeout(150); await shot(p, n + '-search');
    await p.click('.res >> nth=0'); await p.waitForTimeout(200); await shot(p, n + '-intro');
    await p.click('[data-act=begin]'); await p.waitForTimeout(250);
    const pick = async (t) => { await p.click(`.opt:has-text("${t}")`); await p.waitForTimeout(450); if (await p.locator('[data-act=continue]').count() && !/30-day/.test(await p.textContent('h1'))) { await p.click('[data-act=continue]'); await p.waitForTimeout(250); } };
    await p.click('.opt:has-text("I received the cheque")'); await p.waitForTimeout(450);
    await shot(p, n + '-break1');
    if (await p.locator('[data-act=continue]').count()) { await p.click('[data-act=continue]'); await p.waitForTimeout(250); }
    await shot(p, n + '-quiz');
    await pick('Funds insufficient'); await p.waitForTimeout(100);
    await pick('Within the last 15 days');
    const h = await p.textContent('h1'); if (!/30-day/.test(h)) errs.push(n + ' expected cheque urgent, got ' + h);
    await shot(p, n + '-urgent');
    await p.click('[data-act=ackurgent]'); await p.waitForTimeout(250);
    if ((await p.textContent('h1')).includes('Chapter')) { await p.click('[data-act=continue]'); await p.waitForTimeout(250); }
    await p.keyboard.press('B'); await p.waitForTimeout(500); // Not yet (notice sent)
    for (let i = 0; i < 6; i++) { const t = await p.textContent('h1'); if (/Chapter done|round done/.test(t)) { const c = p.locator('[data-act=continue]'); if (await c.count()) { await c.click(); await p.waitForTimeout(250); continue; } else break; } if (!(await p.locator('#qform').count())) break; await p.keyboard.press('A'); await p.waitForTimeout(500); }
    await shot(p, n + '-roundend');
    await p.click('[data-act=showlist]'); await p.waitForTimeout(250);
    await p.click('#ev-cb_e_cheque [data-status=have]'); await p.waitForTimeout(100);
    await p.fill('#ev-cb_e_cheque input[name=label]', 'Cheque no. 004512, HDFC, ₹2,40,000'); await p.fill('#ev-cb_e_cheque input[name=date]', '2 Oct 2026'); await p.fill('#ev-cb_e_cheque input[name=pages]', '1');
    await p.click('#ev-cb_e_cheque button[type=submit]'); await p.waitForTimeout(150);
    await p.click('#ev-cb_e_memo [data-status=have]'); await p.waitForTimeout(500);
    await shot(p, n + '-file', true);
    await p.goto(url + '#report'); await p.waitForTimeout(200);
    const rep = await p.textContent('#report'); if (!rep.includes('A-1')) errs.push(n + ' no annex');
    await shot(p, n + '-report', true);
    await p.goto(url + '#questions'); await p.waitForTimeout(200); await p.click('.qa >> nth=0'); await shot(p, n + '-questions');
    await p.goto(url + '#myths'); await p.waitForTimeout(200); await p.click('[data-mf=fact]'); await p.waitForTimeout(150); await shot(p, n + '-myth');
    const ow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ow > 1) errs.push(n + ' overflow ' + ow);
    await p.close();
  }
  // every journey: open, answer first option till first list, ensure no errors and no overflow on mobile
  const p = await page({ width: 360, height: 760 });
  const ids = await (async () => { await p.goto(url); return p.evaluate(() => ER_KB.issues.map((i) => i.id)); })();
  for (const id of ids) {
    await p.goto(url + '#start-' + id); await p.waitForTimeout(80); await p.click('[data-act=begin]'); await p.waitForTimeout(120);
    for (let i = 0; i < 25; i++) {
      if (await p.locator('[data-act=ackurgent]').count()) { await p.click('[data-act=ackurgent]'); await p.waitForTimeout(100); continue; }
      if (await p.locator('[data-act=continue]').count()) { await p.click('[data-act=continue]'); await p.waitForTimeout(100); continue; }
      if (!(await p.locator('#qform').count())) break;
      const multi = await p.locator('#nextbtn:not([hidden])').count();
      await p.click('.opt >> nth=0'); await p.waitForTimeout(multi ? 60 : 280);
      if (multi) { await p.click('#nextbtn'); await p.waitForTimeout(250); }
    }
    if (await p.locator('[data-act=showlist]').count()) { await p.click('[data-act=showlist]'); await p.waitForTimeout(120); }
    const n = await p.locator('.ev').count(); const ow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (n < 3 || ow > 1) errs.push(`${id}: ev=${n} overflow=${ow}`);
    await p.evaluate(() => { location.hash = 'home'; });
  }
  console.log(errs.length ? errs.join('\n') : 'E2E OK (' + ids.length + ' journeys walked)'); await b.close();
})();
