// GET /api/trending — guides most often started in the last 7 days (India time), for the home-page strip.
// Returns only guide ids in order, never counts, and only guides started at least MIN times, so small numbers
// cannot single anyone out. The app removes sensitive guides before showing anything.
const { hasStore, store, daysBack, send } = require('./_lib.js');
const MIN = 5, MAX = 16;
let memo = null; // warm-instance cache
module.exports = async function handler(req, res) {
  const headers = { 'cache-control': 'public, s-maxage=1800, stale-while-revalidate=86400' };
  if (memo && Date.now() - memo.at < 15 * 60e3) return send(res, 200, memo.body, headers);
  if (!hasStore()) return send(res, 200, { ids: [], reason: 'no-store' }, headers);
  try {
    const r = await store.stats(daysBack(7), []);
    const tot = {};
    for (const d of r.days || []) for (const [k, n] of Object.entries(d.h || {})) {
      const m = /^start:([a-z0-9-]{2,40})$/.exec(k); if (m) tot[m[1]] = (tot[m[1]] || 0) + (Number(n) || 0);
    }
    const ids = Object.entries(tot).filter(([, n]) => n >= MIN).sort((a, b) => b[1] - a[1]).slice(0, MAX).map(([id]) => id);
    memo = { at: Date.now(), body: { ids, days: 7 } };
    return send(res, 200, memo.body, headers);
  } catch (e) {
    return send(res, 200, { ids: [], reason: 'read' }, headers);
  }
};
