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
    await shot(p, n + '-home', true);
    await p.click('.tile >> nth=0'); await p.waitForTimeout(200); await shot(p, n + '-area');
    await p.goto(url); await p.fill('#matter', 'my cheque bounced'); await p.waitForTimeout(150); await shot(p, n + '-search');
    await p.click('#results .prob >> nth=0'); await p.waitForTimeout(250); await shot(p, n + '-q1');
    const pick = async (t) => { await p.click(`.opt:has-text("${t}")`); await p.waitForTimeout(550); };
    await pick('I received the cheque');
    await pick('Funds insufficient');
    await shot(p, n + '-q3');
    await pick('Within the last 15 days');
    if (!/30-day/.test(await p.textContent('h1'))) errs.push(n + ' expected cheque urgent');
    await p.click('[data-act=ackurgent]'); await p.waitForTimeout(250);
    for (let i = 0; i < 10 && await p.locator('#qform').count(); i++) { await p.keyboard.press('1'); await p.waitForTimeout(550); }
    if (!(await p.locator('#evlist').count())) errs.push(n + ' did not land on list');
    await p.click('#ev-cb_e_cheque .cbox'); await p.waitForTimeout(150);
    if (await p.getAttribute('#ev-cb_e_cheque .cbox', 'aria-checked') !== 'true') errs.push(n + ' tick did not stick');
    if (await p.locator('.tray').count()) errs.push(n + ' tray should be gone');
    await shot(p, n + '-list', true);
    await p.goto(url + '#report'); await p.waitForTimeout(200);
    if (!(await p.textContent('#report')).includes('A-1')) errs.push(n + ' no annex');
    await shot(p, n + '-report', true);
    const ow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ow > 1) errs.push(n + ' overflow ' + ow);
    await p.close();
  }
  // languages: static (hi), RTL (ur), runtime-translated via a mocked sampler (sat)
  { const lp = await b.newPage({ viewport: { width: 390, height: 844 } }); lp.on('pageerror', (e) => errs.push('lang: ' + e.message));
    await lp.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ contentType: 'text/css', body: css }));
    await lp.addInitScript(() => { window.claude = { use: async () => ({ json: async (prompt) => { const m = JSON.parse(prompt.slice(prompt.indexOf('\n\n{') + 2)); const o = {}; for (const k in m) o[k] = '᱕ ' + m[k]; return o; } }) }; });
    await lp.goto(url); await lp.waitForTimeout(300);
    const shape = () => lp.evaluate(() => [...document.querySelectorAll('.tile')].map((t) => t.children.length).join(',') + '|' + document.querySelectorAll('.slipchip').length);
    const enShape = await shape();
    await lp.click('.lchip[data-lang=hi]'); await lp.waitForTimeout(600);
    if (await shape() !== enShape) errs.push('hi: home layout differs from English');
    if (!/[ऀ-ॿ]/.test(await lp.textContent('.band h1'))) errs.push('hi: heading not Hindi');
    await shot(lp, 'm-home-hi', true);
    await lp.click('.tile >> nth=0'); await lp.waitForTimeout(600);
    if (!(await lp.textContent('.probs')).includes('᱕')) errs.push('hi: area list not translated');
    await lp.click('.prob >> nth=0'); await lp.waitForTimeout(700);
    if (!(await lp.textContent('.qtext')).includes('᱕')) errs.push('hi: question not translated');
    await shot(lp, 'm-q-hi');
    await lp.goto(url + '#home'); await lp.click('.lchip[data-lang=ur]'); await lp.waitForTimeout(200);
    if (await lp.evaluate(() => document.documentElement.dir) !== 'rtl') errs.push('ur: not rtl');
    const ow = await lp.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ow > 1) errs.push('ur overflow ' + ow);
    await shot(lp, 'm-home-ur', true);
    await lp.click('[data-act=lang] >> nth=0'); await lp.waitForTimeout(150);
    if ((await lp.locator('.langopt').count()) !== 23) errs.push('lang dialog count');
    await shot(lp, 'm-langs');
    await lp.click('.langopt[data-lang=sat]'); await lp.waitForTimeout(700);
    if (!(await lp.textContent('.band h1')).includes('᱕')) errs.push('sat: runtime UI not translated');
    await lp.click('.lchip[data-lang=en]'); await lp.waitForTimeout(150);
    if (!/papers/i.test(await lp.textContent('.band'))) errs.push('en: did not return');
    await lp.close(); }
  // every journey: open, answer first option till first list, ensure no errors and no overflow on mobile
  const p = await page({ width: 360, height: 760 });
  const ids = await (async () => { await p.goto(url); return p.evaluate(() => ER_KB.issues.map((i) => i.id)); })();
  for (const id of ids) {
    await p.goto(url + '#home'); await p.waitForTimeout(60);
    await p.evaluate((id) => { const b = document.createElement('button'); b.dataset.play = id; document.body.appendChild(b); b.click(); }, id); await p.waitForTimeout(150);
    for (let i = 0; i < 25; i++) {
      if (await p.locator('[data-act=ackurgent]').count()) { await p.click('[data-act=ackurgent]'); await p.waitForTimeout(100); continue; }
      if (!(await p.locator('#qform').count())) break;
      await p.click('.opt >> nth=0'); await p.waitForTimeout(330);
    }
    if (await p.locator('[data-act=deep]').count()) { await p.click('[data-act=deep]'); await p.waitForTimeout(120);
      for (let i = 0; i < 25 && await p.locator('#qform').count(); i++) { if (await p.locator('[data-act=ackurgent]').count()) { await p.click('[data-act=ackurgent]'); await p.waitForTimeout(100); continue; } await p.click('.opt >> nth=-1'); await p.waitForTimeout(330); } }
    const n = await p.locator('.crow').count(); const ow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (n < 3 || ow > 1) errs.push(`${id}: ev=${n} overflow=${ow}`);
    await p.evaluate(() => { location.hash = 'home'; });
  }
  console.log(errs.length ? errs.join('\n') : 'E2E OK (' + ids.length + ' journeys walked)'); await b.close();
})();
