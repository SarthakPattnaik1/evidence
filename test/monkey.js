// Taps every button and link-button the app renders (data-act and data-go) on the main screens and checks that
// nothing throws, nothing renders junk, and the page never goes blank. Needs test/devserver.js running.
const { chromium } = require('playwright');
const consent = require('./_consent.js');
const BASE = process.env.BASE || 'http://localhost:8790';
const SKIP = new Set(['exit', 'clear', 'mic', 'download']);
const JUNK = /\bundefined\b|\bNaN\b|\[object |\$\{/;
const bugs = [];
(async () => {
  const b = consent(await chromium.launch());
  const ctx = await b.newContext({ viewport: { width: 390, height: 800 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('dialog', (d) => d.dismiss());
  await p.addInitScript(() => { window.print = () => {}; window.open = () => null; });
  const toResults = async (id) => {
    await p.goto(BASE + '/#start-' + id); await p.waitForTimeout(400); await p.click('[data-act=begin]');
    for (let i = 0; i < 30; i++) {
      await p.waitForTimeout(120);
      const o = p.locator('label.opt:visible'); if (await o.count()) { await o.first().click(); continue; }
      const a = p.locator('[data-act=ackurgent]:visible,[data-act=next]:visible'); if (await a.count()) { await a.first().click(); continue; }
      break;
    }
  };
  const screens = [
    ['home', async () => { await p.goto(BASE + '/#home'); await p.waitForTimeout(400); }],
    ['results', async () => toResults('cheque-bounce')],
    ['results-sensitive', async () => toResults('domestic-violence')],
    ['lawyer', async () => { await toResults('upi-cyber-fraud'); await p.click('[data-go=report]'); await p.waitForTimeout(300); }],
    ['help', async () => { await p.goto(BASE + '/#help'); await p.waitForTimeout(300); }]
  ];
  for (const [name, open] of screens) {
    await open();
    const n = await p.locator('[data-act]:visible,[data-go]:visible').count();
    for (let i = 0; i < n; i++) {
      await open();
      const el = p.locator('[data-act]:visible,[data-go]:visible').nth(i);
      if (!(await el.count())) continue;
      const act = (await el.getAttribute('data-act')) || 'go:' + (await el.getAttribute('data-go'));
      if (SKIP.has(act)) continue;
      errs.length = 0;
      try { await el.click({ timeout: 2000 }); } catch (e) { continue; }
      await p.waitForTimeout(250);
      const t = await p.evaluate(() => document.body.innerText);
      if (t.trim().length < 40) bugs.push(`BLANK ${name} after ${act}`);
      if (JUNK.test(t)) bugs.push(`JUNK ${name} after ${act}: ${(t.match(JUNK) || [])[0]}`);
      errs.forEach((e) => bugs.push(`ERROR ${name} after ${act}: ${e}`));
      await p.keyboard.press('Escape');
    }
    console.log(name, 'tapped', n);
  }
  await b.close();
  const u = [...new Set(bugs)]; console.log(u.length ? u.join('\n') : 'MONKEY OK'); process.exit(u.length ? 1 : 0);
})();
