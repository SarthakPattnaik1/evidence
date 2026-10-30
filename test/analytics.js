// End-to-end: simulated visitors generate events, then the admin logs in and sees them.
const { chromium } = require('playwright');
const B = 'http://localhost:8790';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function visitor(b, { geo, mobile, lang, guide, answers, search, call, deep, fb, miss, pick }) {
  const ctx = await b.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1366, height: 860 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36', extraHTTPHeaders: { 'x-test-geo': geo } });
  await ctx.addCookies([{ name: 'saboot_track', value: '1', url: B }]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(B + '/#home'); await p.evaluate((l) => { localStorage.clear(); if (l) localStorage.setItem('er_lang', JSON.stringify(l)); }, lang); await p.reload(); await wait(700);
  if (miss) { await p.fill('#matter', miss); await wait(1800); }
  if (search) { await p.fill('#matter', search); await wait(1800); }

  if (pick) { await p.fill('#matter', pick); await wait(300); await p.click('#results .prob'); await wait(800); }
  if (guide) {
    await p.goto(B + '/#start-' + guide); await wait(400); await p.click('[data-act=begin]'); const t0 = Date.now(); await p.waitForSelector('#qform', { timeout: 15000 }).catch(() => {}); if (Date.now() - t0 > 1500) console.log('slow start', guide, lang, Date.now() - t0);
    for (let i = 0; i < answers; i++) { if (!(await p.$('#qform label.opt'))) break; await p.locator('#qform label.opt').first().click(); await wait(500); }
    if (deep) { await p.goto(B + '/#list'); await wait(400); const d = await p.$('[data-act=deep]'); if (d) { await d.click(); await wait(500); if (await p.$('#qform label.opt')) { await p.locator('#qform label.opt').first().click(); await wait(500); } } }
    if (fb) { await p.goto(B + '/#list'); await wait(400); const f = await p.$(`[data-act=fb][data-v=${fb}]`); if (f) await f.click(); }
  }
  if (call) { await p.goto(B + '/#help'); await p.waitForSelector(`a[href="tel:${call}"]`, { timeout: 5000 }).catch(async () => console.log('no tel on', await p.evaluate(() => location.hash), (await p.textContent('#app')).slice(0, 120))); await p.evaluate((n) => { document.addEventListener('click', (e) => e.preventDefault()); document.querySelector(`a[href="tel:${n}"]`).click(); }, call); }
  await p.goto('about:blank'); await wait(400);
  await p.close(); await ctx.close(); // pagehide flush
  if (errs.length) console.log('page errors', errs);
}
(async () => {
  const b = await chromium.launch({ args: ['--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'] });
  const V = [
    { geo: 'IN-OR', mobile: true, lang: 'or', guide: 'upi-cyber-fraud', answers: 9, call: '1930', fb: 'y' },
    { geo: 'IN-MH', mobile: true, guide: 'cheque-bounce', answers: 3 },
    { geo: 'IN-MH', mobile: false, guide: 'cheque-bounce', answers: 14, deep: true, fb: 'y' },
    { geo: 'IN-DL', mobile: true, lang: 'hi', guide: 'divorce-separation', answers: 2, miss: 'qwerty zzkx mera 9876543210' },
    { geo: 'IN-WB', mobile: true, pick: 'cheque bounced' },
    { geo: 'IN-KA', mobile: true, guide: 'intimate-images', answers: 6, call: '1930', fb: 'n' },
    { geo: 'IN-TN', mobile: false, lang: 'ta', search: 'salary', guide: 'unpaid-salary', answers: 8 },
    { geo: 'US-CA', mobile: false, guide: 'nri-property', answers: 1, miss: 'visa refusal appeal' },
    { geo: 'IN-OR', mobile: true, call: '112' },
  ];
  for (const v of V) await visitor(b, v);
  await wait(800);
  // Admin
  const ctx = await b.newContext({ viewport: { width: 1366, height: 900 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(B + '/admin'); await wait(500);
  await p.fill('#p', 'wrong'); await p.click('#lf button'); await wait(900); console.log('bad login:', await p.textContent('#lerr'));
  await p.fill('#p', 'test-pass-123'); await p.click('#lf button'); await wait(1500);
  console.log('tiles:', (await p.textContent('#tiles')).replace(/\s+/g, ' '));
  console.log('funnel:', (await p.textContent('#funnel')).replace(/\s+/g, ' '));
  console.log('calls:', (await p.textContent('#calls')).replace(/\s+/g, ' '));
  console.log('search:', (await p.textContent('#miss')).replace(/\s+/g, ' '));
  console.log('langs:', (await p.textContent('#langs')).replace(/\s+/g, ' ').slice(0, 200));
  console.log('geo:', (await p.textContent('#geo')).replace(/\s+/g, ' '));
  await p.screenshot({ path: '/tmp/admin-full.png', fullPage: true });
  await p.setViewportSize({ width: 390, height: 844 }); await wait(300); await p.screenshot({ path: '/tmp/admin-mobile.png' });
  console.log('admin errors', errs);
  // cookie flags
  console.log('cookie', (await ctx.cookies()).map((c) => [c.name, c.httpOnly, c.secure, c.sameSite, c.path]));
  // unauth access blocked
  const r = await (await b.newContext()).request.get(B + '/api/admin?a=stats'); console.log('unauth stats:', r.status());
  await b.close();
})();
