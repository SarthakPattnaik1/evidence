/* Disclaimer (agree / disagree) and analytics integrity. Needs: FIXED_IP=10.9.9.9 node test/devserver.js (sendBeacon drops custom headers) */
const { chromium } = require('playwright');
const B = process.env.URL || 'http://localhost:8790';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch({ args: ['--user-agent=Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36'] });
  const fails = []; const errs = [];
  // ---- 1. Disclaimer on first visit, including a deep link someone shared
  const c1 = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await c1.newPage(); p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(B + '/#start-cheque-bounce'); await wait(700);
  if (!(await p.isVisible('#consent'))) fails.push('disclaimer not shown on first visit');
  const txt = await p.textContent('#consent');
  for (const must of ['Bar Council of India', 'not a law firm', 'advocate–client relationship', 'I agree', 'I disagree']) if (!txt.includes(must)) fails.push('disclaimer missing: ' + must);
  if (!(await p.$('#consent a[href="tel:112"]'))) fails.push('112 not callable before agreeing');
  if ((await p.evaluate(() => document.activeElement && document.activeElement.closest('#consent') ? 1 : 0)) !== 1) fails.push('focus not inside disclaimer');
  await p.screenshot({ path: '/tmp/consent-390.png' });
  // disagree → help, back, agree
  await p.click('[data-cs=disagree]'); await wait(200);
  if (!(await p.textContent('#consent')).includes('15100')) fails.push('disagree screen lacks legal aid');
  await p.screenshot({ path: '/tmp/consent-no.png' });
  await p.click('[data-cs=back]'); await wait(200); await p.click('[data-cs=agree]'); await wait(300);
  if (await p.$('#consent')) fails.push('disclaimer did not close on agree');
  await p.reload(); await wait(600); if (await p.$('#consent')) fails.push('disclaimer shown again after agreeing');
  // language switch inside the disclaimer
  await p.evaluate(() => localStorage.removeItem('saboot_consent')); await p.reload(); await wait(500);
  await p.selectOption('[data-cslang]', 'hi'); await wait(500);
  if (!(await p.isVisible('#consent'))) fails.push('disclaimer vanished after changing language');
  await p.click('[data-cs=agree]'); await wait(200);
  // footer link reopens it
  await p.goto(B + '/#home'); await wait(400); await p.click('[data-act=disclaimer]'); await wait(200);
  if (!(await p.isVisible('#consent'))) fails.push('footer Disclaimer did not reopen'); await p.click('[data-cs=agree]');
  // 320 px: no sideways scroll
  await p.setViewportSize({ width: 320, height: 600 }); await p.evaluate(() => localStorage.removeItem('saboot_consent')); await p.reload(); await wait(500);
  const ow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ow > 1) fails.push('disclaimer overflows at 320px: ' + ow);
  await p.screenshot({ path: '/tmp/consent-320.png' });
  await c1.close();

  // ---- 2. Integrity: forged and token-less events are rejected; only real people count as verified
  const post = (body, origin) => fetch(B + '/api/e', { method: 'POST', headers: { 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0 Chrome/130', origin: origin || B }, body: JSON.stringify(body) }).then((r) => r.json());
  const ev = [{ t: 'list', g: 'cheque-bounce' }, { t: 'start', g: 'cheque-bounce' }];
  if ((await post({ e: ev, h: 7 })).ok) fails.push('event without token accepted');
  if ((await post({ k: 'aaaaaaaaaaaa.1793420000.AAAAAAAAAAAAAAAAAAAAAA', e: ev, h: 7 })).ok) fails.push('forged token accepted');
  const tk = await fetch(B + '/api/s', { headers: { 'user-agent': 'Mozilla/5.0 Chrome/130' } }).then((r) => r.json());
  if ((await post({ k: tk.k, e: ev, h: 7 }, 'https://evil.example')).ok) fails.push('wrong origin accepted');
  const okBot = await fetch(B + '/api/e', { method: 'POST', headers: { 'content-type': 'application/json', 'user-agent': 'Different-UA/1.0', origin: B }, body: JSON.stringify({ k: tk.k, e: ev, h: 7 }) }).then((r) => r.json());
  if (okBot.ok) fails.push('token reused from another browser accepted');
  // Real person: webdriver hidden, real taps, page visible > 3 s
  const human = async (auto) => {
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, extraHTTPHeaders: { 'x-forwarded-for': '10.9.9.9' } });
    await c.addCookies([{ name: 'saboot_track', value: '1', url: B }]);
    await c.addInitScript(() => { localStorage.setItem('saboot_consent', JSON.stringify({ v: 1 })); });
    if (!auto) await c.addInitScript(() => { Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }); });
    const q = await c.newPage(); await q.goto(B + '/#start-cheque-bounce'); await wait(3500);
    await q.click('[data-act=begin]'); await q.waitForSelector('#qform'); for (let i = 0; i < 8; i++) { if (!(await q.$('#qform label.opt'))) break; await q.locator('#qform label.opt').first().click(); await wait(350); }
    await q.goto('about:blank'); await wait(500); await c.close();
  };
  await human(false); await human(true); await wait(800);
  // Admin view
  const c3 = await b.newContext({ viewport: { width: 1366, height: 900 } }); const a = await c3.newPage();
  await a.goto(B + '/admin'); await wait(400); await a.fill('#p', 'test-pass-123'); await a.click('#lf button'); await wait(1500);
  const vt = (await a.textContent('#vtiles')).replace(/\s+/g, ' '); const tn = (await a.textContent('#trustnote')).replace(/\s+/g, ' ');
  console.log('verified:', vt); console.log('trust:', tn);
  const n = (label) => Number(((new RegExp(label + '\\s*([\\d,]+)').exec(vt) || [])[1] || '0').replace(/,/g, ''));
  if (n('People') !== 1) fails.push('verified people should be 1 (one real person; the automated one must not count), got ' + n('People'));
  if (n('Started a guide') !== 1) fails.push('verified starts should be 1, got ' + n('Started a guide'));
  if (!/Rejected[^:]*: (\d+)/.test(tn) || Number(/Rejected[^:]*: ([\d,]+)/.exec(tn)[1]) < 6) fails.push('rejected events not counted');
  const imp = await fetch(B + '/api/impact').then((r) => r.json());
  if (!imp.method || !Array.isArray(imp.days) || !imp.head) fails.push('impact ledger malformed');
  await a.screenshot({ path: '/tmp/admin-trust.png', clip: { x: 0, y: 0, width: 1366, height: 700 } });
  console.log(errs.length || fails.length ? 'CONSENT/INTEGRITY FAIL\n' + errs.concat(fails).join('\n') : 'CONSENT/INTEGRITY OK (disclaimer, disagree, language, reopen, 320px; no-token, forged, wrong-origin, cross-browser token rejected; bot not counted; real person counted once)');
  await b.close(); process.exit(errs.length || fails.length ? 1 : 0);
})();
