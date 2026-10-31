/* Next-step features: deadline reminder (.ics + WhatsApp), where to go, free-lawyer check, read aloud, follow-up question.
   Needs: FAKE_TRANSLATE=50 node test/devserver.js */
const { chromium } = require('playwright'); const fs = require('fs');
const B = process.env.URL || 'http://localhost:8790/';
(async () => {
  const b = require('./_consent.js')(await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }));
  const p = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = [], fails = []; p.on('pageerror', (e) => errs.push(e.message));
  const walk = async (id) => { await p.goto(B + '#home'); await p.evaluate((g) => { const x = document.createElement('button'); x.dataset.play = g; document.body.appendChild(x); x.click(); }, id); await p.waitForTimeout(300);
    for (let i = 0; i < 25; i++) { if (await p.locator('[data-act=ackurgent]').count()) { await p.click('[data-act=ackurgent]'); await p.waitForTimeout(100); continue; } if (!(await p.locator('#qform').count())) break; await p.click('.opt >> nth=0'); await p.waitForTimeout(330); } };
  // 1. Reminder on a deadline warning
  await walk('traffic-challan');
  if (!(await p.locator('[data-act=remind]').count())) fails.push('no Remind me on a deadline warning');
  else {
    await p.click('[data-act=remind] >> nth=0'); await p.waitForTimeout(200); await p.click('[data-rd="7"]');
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 4000 }).catch(() => null), p.click('[data-rm=cal]')]);
    const t = dl ? fs.readFileSync(await dl.path(), 'utf8') : '';
    if (!/BEGIN:VCALENDAR[\s\S]*DTSTART:\d{8}T100000[\s\S]*TRIGGER:-P1D[\s\S]*END:VCALENDAR/.test(t)) fails.push('calendar file invalid');
    if (!/wa\.me\/\?text=/.test(await p.getAttribute('[data-rm=wa]', 'href'))) fails.push('no WhatsApp reminder link');
    await p.click('[data-close]');
  }
  // 2. Where to go: official offices, at least one
  const where = await p.locator('.wherebox li').count(); if (!where) fails.push('no where-to-go offices');
  if (/advocate\s+[A-Z]/.test(await p.textContent('.wherebox'))) fails.push('where-to-go names an advocate');
  // 3. Free-lawyer check: category → yes; no category + income yes → likely; income no → still free advice
  await p.click('[data-act=aidcheck]'); await p.check('.aidcats input[value=woman]'); await p.click('[data-aid=next]');
  if (!/free lawyer/i.test(await p.textContent('.dialog.aid h2')) || !(await p.$('.dialog.aid a[href="tel:15100"]'))) fails.push('woman → should qualify with 15100'); await p.click('[data-close]');
  await p.click('[data-act=aidcheck]'); await p.click('[data-aid=next]'); await p.click('[data-aid=inc-no]');
  if (!(await p.$('.dialog.aid a[href="tel:14454"]'))) fails.push('not eligible → should still offer Tele-Law 14454'); await p.click('[data-close]');
  // 4. Read aloud in Odia (no device voice in headless → server)
  await p.evaluate(() => localStorage.setItem('er_lang', '"or"')); await p.reload(); await p.waitForTimeout(400); let spoke = null; p.on('request', (r) => { if (r.url().includes('/api/speak')) spoke = JSON.parse(r.postData()); });
  await walk('dog-bite'); await p.click('[data-act=readaloud]'); await p.waitForTimeout(2500);
  if (!spoke || spoke.lang !== 'or' || spoke.text.length < 60) fails.push('read aloud did not send the Odia list');
  await p.evaluate(() => localStorage.setItem('er_lang', '"en"'));
  // 5. Follow-up: not the same day; once after a day; gone after answering
  await p.evaluate(() => localStorage.setItem('saboot_last', JSON.stringify({ g: 'dog-bite', t: Date.now() - 60000, step: 0 }))); await p.goto(B + '#home'); await p.waitForTimeout(400);
  if (await p.locator('.oc').count()) fails.push('follow-up shown the same day');
  await p.evaluate(() => localStorage.setItem('saboot_last', JSON.stringify({ g: 'dog-bite', t: Date.now() - 2 * 864e5, step: 0 }))); await p.reload(); await p.waitForTimeout(400);
  if (!(await p.locator('.oc').count())) fails.push('follow-up not shown after a day');
  else { await p.click('[data-k=met][data-v=yes]'); await p.waitForTimeout(150); await p.click('[data-k=help][data-v=little]'); await p.waitForTimeout(150); await p.reload(); await p.waitForTimeout(300); if (await p.locator('.oc').count()) fails.push('follow-up shown again after answering'); }
  const ow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ow > 1) fails.push('overflow ' + ow);
  console.log(errs.length || fails.length ? 'NEXT FAIL\n' + errs.concat(fails).join('\n') : 'NEXT OK (reminder .ics + WhatsApp, where to go, free-lawyer check, Odia read aloud, follow-up once)');
  await b.close(); process.exit(errs.length || fails.length ? 1 : 0);
})();
