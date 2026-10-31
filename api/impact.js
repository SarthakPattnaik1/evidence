// Public, verifiable impact ledger. Anyone can read it; a nightly GitHub Action commits it to the repo (impact/ledger.json),
// so each day's numbers get an independent, timestamped public record that cannot be quietly rewritten later.
//
// Numbers are "verified people": distinct networks per day (daily-salted hash, no IPs kept) where a real person
// (tapped/typed, page visible ≥ 3 s, not automated) did the action, through a page that got a signed session token.
// This deliberately undercounts (a family on one Wi-Fi counts once), so totals can be stated as "at least".
const { hasStore, store, dayKey, send, crypto } = require('./_lib.js');
const START = '2026-10-31';
const LABEL = { 'v:visit': 'people who used Saboot', 'v:agree': 'agreed to the disclaimer', 'v:start': 'started a guide', 'v:list': 'got a list of papers', 'v:print': 'printed or saved the list', 'v:share': 'shared it', 'v:done': 'finished all questions', 'v:voice': 'used voice' };
module.exports = async (req, res) => {
  if (!hasStore()) return send(res, 503, { error: 'storage not set up' });
  const today = dayKey(); const days = [];
  for (let t = new Date(START + 'T00:00:00Z'); ; t = new Date(t.getTime() + 864e5)) { const d = t.toISOString().slice(0, 10); if (d >= today) break; days.push(d); if (days.length > 800) break; }
  let rows = [];
  try { rows = days.length ? await store.ledger(days) : []; } catch (e) { return send(res, 502, { error: 'storage error' }); }
  let prev = 'saboot-ledger-v1'; const out = []; const total = {};
  for (const r of rows) {
    const v = {}; Object.keys(r.v || {}).sort().forEach((k) => { if (LABEL[k]) v[k] = +r.v[k]; });
    const entry = { d: r.d, v, rejected: +r.rejected || 0 };
    const hash = crypto.createHash('sha256').update(prev + '|' + JSON.stringify(entry)).digest('hex');
    out.push(Object.assign(entry, { hash })); prev = hash;
    for (const k in v) total[k] = (total[k] || 0) + v[k];
  }
  return send(res, 200, {
    site: 'https://saboot.org', generated: new Date().toISOString(), complete_through: days[days.length - 1] || null,
    method: 'Verified people = distinct networks per day (daily-salted hash; no IP stored) where a real person did the action through a page with a signed session token. Undercounts shared Wi-Fi; never counts scripts, bots or repeats. "rejected" = events refused for a missing/forged token or wrong origin. Each day hash = SHA-256(previous hash | day JSON).',
    labels: LABEL, totals: total, head: prev, days: out
  }, { 'cache-control': 'public, s-maxage=3600, max-age=300' });
};
