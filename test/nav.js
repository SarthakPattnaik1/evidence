const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 375, height: 740 } }); const out = [];
  const q = async () => (await p.locator('.qtext').count()) ? (await p.textContent('.qtext')).trim().slice(0, 40) : (await p.locator('.carryhead').count() ? 'LIST' : 'OTHER:' + p.url().split('#')[1]);
  await p.goto('file://' + require('path').resolve(__dirname, '../build/index.html') + '#cat-shopping'); await p.waitForTimeout(200);
  await p.click('[data-play="ecommerce-order"]'); await p.waitForTimeout(300); out.push('start ' + await q());
  for (let i = 0; i < 2; i++) { await p.click('.opt >> nth=1'); await p.waitForTimeout(450); out.push('ans→ ' + await q() + ' ' + p.url().split('#')[1]); }
  await p.goBack(); await p.waitForTimeout(300); out.push('BACK→ ' + await q() + ' checked=' + await p.locator('input[name=a]:checked').count());
  await p.goBack(); await p.waitForTimeout(300); out.push('BACK→ ' + await q());
  await p.click('[data-act=qback]').catch(() => out.push('no qback on first')); await p.waitForTimeout(300); out.push('app-back→ ' + await q() + ' ' + p.url().split('#')[1]);
  for (let i = 0; i < 8 && await p.locator('#qform').count(); i++) { await p.click('.opt >> nth=1'); await p.waitForTimeout(450); }
  out.push('end ' + await q());
  await p.goBack(); await p.waitForTimeout(300); out.push('BACK from list→ ' + await q());
  await p.goForward(); await p.waitForTimeout(300); out.push('FWD→ ' + await q());
  await p.click('.opt >> nth=1'); await p.waitForTimeout(450); out.push('re-answer→ ' + await q());
  console.log(out.join('\n')); out.length = 0; await p.evaluate(() => { location.hash = 'answers'; }); await p.waitForTimeout(300); console.log('change buttons:', await p.locator('[data-act=change]').count(), 'html:', (await p.innerHTML('#app')).match(/Change/g)); await p.waitForTimeout(200); await p.click('[data-act=change] >> nth=0'); await p.waitForTimeout(300); out.push('change→ ' + await q());
  console.log(out.join('\n')); await b.close(); })();
