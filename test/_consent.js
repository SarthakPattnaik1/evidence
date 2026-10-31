// Tests run as a person who taps "I agree" on the disclaimer as soon as it appears (it is shown on every visit;
// test/consent.js checks the disclaimer itself).
const AGREE = () => {
  const tap = () => { const b = document.querySelector('[data-cs=agree],[data-dg=agree]'); if (b) b.click(); };
  new MutationObserver(tap).observe(document, { childList: true, subtree: true }); document.addEventListener('DOMContentLoaded', tap);
};
module.exports = (b) => {
  const nc = b.newContext.bind(b); const np = b.newPage.bind(b);
  b.newContext = async (o) => { const c = await nc(o); await c.addInitScript(AGREE); return c; };
  b.newPage = async (o) => { const c = await b.newContext(o); const p = await c.newPage(); p.close = async () => c.close(); return p; };
  return b;
};
