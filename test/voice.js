/* Voice + multilingual search, end to end with a fake microphone. Needs: FAKE_TRANSLATE=50 node test/devserver.js */
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/';
(async () => {
  const b = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--user-agent=Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36'] });
  const errs = []; const fails = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, permissions: ['microphone'] });
  const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message));
  const titles = () => p.evaluate(() => [...document.querySelectorAll('#results .prob b')].map((x) => x.textContent));
  // 1. Hindi UI: server recording path (fake mic gives a tone; fake Gemini returns a Hindi sentence)
  await p.goto(URL + '#home'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('er_lang', '"hi"'); }); await p.reload(); await p.waitForTimeout(800);
  if (!(await p.locator('[data-act=mic]').count())) fails.push('no mic button in Hindi');
  await p.click('[data-act=mic]'); await p.waitForTimeout(400);
  if (!(await p.evaluate(() => document.querySelector('.searchbox').classList.contains('listening')))) fails.push('not listening after tap');
  if ((await p.getAttribute('[data-act=mic]', 'aria-pressed')) !== 'true') fails.push('aria-pressed not true');
  await p.waitForTimeout(1500); await p.click('[data-act=mic]'); await p.waitForTimeout(2500);
  const v1 = await p.inputValue('#matter'); const t1 = await titles();
  if (!/कुत्ते/.test(v1)) fails.push('transcript not put in search box: ' + v1);
  if (!t1.length || !/dog|animal|कुत्त/i.test(t1.join(' '))) fails.push('voice search did not find dog-bite guide: ' + t1.join(' | '));
  await p.screenshot({ path: '/tmp/voice-hi.png' });
  // 1b. English UI, speaking another language: must go to the server (which detects the language), not the browser's English recogniser
  await p.evaluate(() => localStorage.setItem('er_lang', '"en"')); await p.reload(); await p.waitForTimeout(700);
  let hit = 0; const onReq = (r) => { if (r.url().includes('/api/voice') && r.method() === 'POST') hit++; }; p.on('request', onReq);
  await p.click('[data-act=mic]'); await p.waitForTimeout(1200); await p.click('[data-act=mic]'); await p.waitForTimeout(2500); p.off('request', onReq);
  if (!hit) fails.push('English UI did not send speech to the server');
  if (!/कुत्ते/.test(await p.inputValue('#matter'))) fails.push('English UI: non-English speech not transcribed');
  await p.evaluate(() => localStorage.setItem('er_lang', '"hi"')); await p.reload(); await p.waitForTimeout(700);
  // 2. typed Hindi (Devanagari) search
  await p.fill('#matter', ''); await p.type('#matter', 'मेरा फोन चोरी हो गया', { delay: 10 }); await p.waitForTimeout(1500);
  const t2 = await titles(); if (!/phone|फ़ोन|फोन/i.test(t2.join(' '))) fails.push('typed Hindi did not find phone guide: ' + t2.join(' | '));
  // 3. Odia
  await p.evaluate(() => localStorage.setItem('er_lang', '"or"')); await p.reload(); await p.waitForTimeout(800);
  await p.fill('#matter', ''); await p.type('#matter', 'ମୋ ଜମି ଦଖଲ', { delay: 10 }); await p.waitForTimeout(1500);
  const t3 = await titles(); if (!t3.length) fails.push('typed Odia found nothing');
  // 4. overflow on a small phone while listening
  await p.setViewportSize({ width: 320, height: 640 }); await p.click('[data-act=mic]'); await p.waitForTimeout(300);
  const ow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ow > 1) fails.push('overflow while listening: ' + ow);
  await p.screenshot({ path: '/tmp/voice-320.png' }); await p.click('[data-act=mic]'); await p.waitForTimeout(2000);
  // 5. mic permission denied → friendly message
  const c2 = await b.newContext({ viewport: { width: 390, height: 844 } }); const q = await c2.newPage(); q.on('pageerror', (e) => errs.push(e.message));
  await q.goto(URL + '#home'); await q.evaluate(() => localStorage.setItem('er_lang', '"ta"')); await q.reload(); await q.waitForTimeout(600);
  await q.evaluate(() => { navigator.mediaDevices.getUserMedia = () => Promise.reject(Object.assign(new Error('denied'), { name: 'NotAllowedError' })); });
  await q.click('[data-act=mic]'); await q.waitForTimeout(500);
  const h = await q.textContent('#voicehint'); if (!/permission|Microphone|माइक/i.test(h || '')) fails.push('no permission message: ' + h);
  console.log(errs.length || fails.length ? 'VOICE FAIL\n' + errs.concat(fails).join('\n') : 'VOICE OK (Hindi voice, English UI + other language, typed Hindi, typed Odia, 320px, permission denied)');
  console.log('typed Hindi →', t2.join(' | '), '\ntyped Odia →', t3.join(' | '));
  await b.close(); process.exit(errs.length || fails.length ? 1 : 0);
})();
