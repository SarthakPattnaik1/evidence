// Exhaustive sweep: walks every guide (first and last answers), opens every situation, renders every language,
// and checks for console errors, stuck questions, thin lists, junk text and sideways scrolling on a 360px phone.
// Needs test/devserver.js running (FAKE_TRANSLATE=1). Usage: node test/sweep.js [guides|sits|langs|all]
const { chromium } = require('playwright');
const consent = require('./_consent.js');
const BASE = process.env.BASE || 'http://localhost:8790';
const what = process.argv[2] || 'all';
const bugs = [];
const bug = (k, ...m) => { bugs.push(k + ': ' + m.join(' ')); };
const JUNK = /\bundefined\b|\bNaN\b|\[object |\{\{|\$\{/;

async function page(b, w = 360) {
  const ctx = await b.newContext({ viewport: { width: w, height: 740 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  p._errs = [];
  p.on('pageerror', (e) => p._errs.push('pageerror ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !/favicon|Failed to load resource|fonts\.g/.test(m.text())) p._errs.push('console ' + m.text().slice(0, 160)); });
  await p.goto(BASE + '/#home'); await p.waitForTimeout(400);
  return p;
}
const overflow = async (p) => { const o = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (o > 2 && process.env.WHY) console.log(await p.evaluate(() => { const W = document.documentElement.clientWidth; return [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > W + 1).slice(-4).map((e) => e.tagName + '.' + e.className + ' r=' + Math.round(e.getBoundingClientRect().right) + ' ' + (e.innerText || '').slice(0, 50).replace(/\n/g, ' ')).join(' | '); }));
  return o; };
const text = (p) => p.evaluate(() => document.getElementById('app').innerText);

async function walk(p, pick) {
  for (let step = 0; step < 40; step++) {
    await p.waitForTimeout(120);
    const done = await p.evaluate(() => location.hash.startsWith('#list') || !!document.querySelector('[data-go=report],[data-act=report]'));
    if (done) return { ok: true, steps: step };
    const opts = p.locator('label.opt:visible');
    const n = await opts.count();
    if (n) {
      const multi = await p.locator('input[type=checkbox]:visible').count();
      await opts.nth(pick === 'last' ? n - 1 : 0).click();
      if (multi) { const nx = p.locator('[data-act=next]:visible'); if (await nx.count()) await nx.first().click(); }
      continue;
    }
    for (const sel of ['[data-act=ackurgent]', '[data-act=next]', '[data-act=begin]', '[data-act=skip]']) {
      const l = p.locator(sel + ':visible');
      if (await l.count()) { await l.first().click(); break; }
    }
    if (step > 35) break;
  }
  return { ok: false };
}

async function guides(b) {
  global.window = global;
  ['kb', 'cites', 'j-money', 'j-family', 'j-consumer', 'j-other', 'j-nri', 'j-business', 'j-more', 'j-genz', 'j-gaps', 'j-rights', 'j-crucial', 'stand', 'law-2026'].forEach((f) => require('../src/' + f + '.js'));
  const ids = global.ER_KB.issues.map((i) => i.id);
  const p = await page(b);
  for (const id of ids) {
    for (const pick of ['first', 'last']) {
      p._errs = [];
      await p.evaluate(() => { try { sessionStorage.removeItem('saboot_state'); } catch (e) {} });
      await p.goto(BASE + '/#start-' + id); await p.waitForTimeout(250);
      const r = await walk(p, pick);
      if (!r.ok) { bug('STUCK', id, pick, (await p.evaluate(() => location.hash))); continue; }
      const t = await text(p);
      if (JUNK.test(t)) bug('JUNK', id, pick, (t.match(JUNK) || [])[0]);
      const items = await p.locator('#app button.cbox').count();
      if (items < 3) bug('THIN', id, pick, items + ' items');
      const o = await overflow(p); if (o > 2) bug('OVERFLOW', id, pick, o + 'px');
      if (pick === 'first') {
        const rep = p.locator('[data-go=report],[data-act=report]');
        if (await rep.count()) {
          await rep.first().click(); await p.waitForTimeout(250);
          const t2 = await text(p); if (JUNK.test(t2)) bug('JUNK-report', id, (t2.match(JUNK) || [])[0]);
          const o2 = await overflow(p); if (o2 > 2) bug('OVERFLOW-report', id, o2 + 'px');
        } else bug('NO-REPORT', id);
      }
      p._errs.forEach((e) => bug('ERR', id, pick, e));
    }
  }
  console.log('guides walked', ids.length * 2);
}

async function sits(b) {
  global.window = global;
  ['kb', 'cites', 'j-money', 'j-family', 'j-consumer', 'j-other', 'j-nri', 'j-business', 'j-more', 'j-genz', 'j-gaps', 'j-rights', 'j-crucial', 'stand', 'law-2026', 'situations'].forEach((f) => require('../src/' + f + '.js'));
  const KB = global.ER_KB;
  const list = KB.directory.filter((d) => d.sit);
  const p = await page(b);
  let n = 0;
  for (const d of list) {
    p._errs = [];
    await p.goto(BASE + '/#sit-' + d.slug); await p.waitForTimeout(150);
    const h = await p.evaluate(() => location.hash);
    const t = await text(p);
    if (!t.includes(d.title.slice(0, 20)) && !/Start|Begin/.test(t)) bug('SIT-NOINTRO', d.slug, h);
    if (JUNK.test(t)) bug('SIT-JUNK', d.slug, (t.match(JUNK) || [])[0]);
    // Every 7th situation: walk it to the end to check the prefilled answers lead somewhere sensible.
    if (n++ % 7 === 0) {
      const r = await walk(p, 'first');
      if (!r.ok) bug('SIT-STUCK', d.slug);
      else { const items = await p.locator('#app button.cbox').count(); if (items < 3) bug('SIT-THIN', d.slug, items); }
    }
    p._errs.forEach((e) => bug('SIT-ERR', d.slug, e));
  }
  console.log('situations opened', list.length);
}

async function langs(b) {
  const L = ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'ur', 'gu', 'kn', 'or', 'ml', 'pa', 'as', 'mai', 'sat', 'ks', 'ne', 'sd', 'doi', 'kok', 'mni', 'brx', 'sa'];
  const RTL = new Set(['ur', 'ks', 'sd']);
  for (const w of [320, 360, 768, 1280]) {
    const p = await page(b, w);
    for (const l of L) {
      p._errs = [];
      await p.evaluate((l) => localStorage.setItem('er_lang', JSON.stringify(l)), l);
      for (const h of ['#home', '#start-cheque-bounce', '#help']) {
        await p.goto(BASE + '/' + h); await p.reload(); await p.waitForTimeout(500);
        const dir = await p.evaluate(() => document.documentElement.dir || 'ltr');
        if ((dir === 'rtl') !== RTL.has(l)) bug('DIR', l, w, h, dir);
        const o = await overflow(p); if (o > 2) bug('LANG-OVERFLOW', l, w, h, o + 'px');
        const t = await text(p); if (JUNK.test(t)) bug('LANG-JUNK', l, h, (t.match(JUNK) || [])[0]);
      }
      p._errs.forEach((e) => bug('LANG-ERR', l, w, e));
    }
    await p.context().close();
  }
  console.log('languages x widths', L.length * 4);
}

(async () => {
  const b = consent(await chromium.launch());
  if (what === 'all' || what === 'guides') await guides(b);
  if (what === 'all' || what === 'sits') await sits(b);
  if (what === 'all' || what === 'langs') await langs(b);
  await b.close();
  const u = [...new Set(bugs)];
  console.log(u.length ? u.join('\n') : 'NO BUGS FOUND');
  process.exit(u.length ? 1 : 0);
})();
