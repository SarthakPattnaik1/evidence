// Tests run as a person who has already agreed to the disclaimer (test/consent.js checks the disclaimer itself).
const AGREE = () => { try { localStorage.setItem('saboot_consent', JSON.stringify({ v: 1, t: '2026-10-31' })); } catch (e) {} };
module.exports = (b) => {
  const nc = b.newContext.bind(b); const np = b.newPage.bind(b);
  b.newContext = async (o) => { const c = await nc(o); await c.addInitScript(AGREE); return c; };
  b.newPage = async (o) => { const c = await b.newContext(o); const p = await c.newPage(); p.close = async () => c.close(); return p; };
  return b;
};
