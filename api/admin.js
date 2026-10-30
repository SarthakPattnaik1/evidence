// Admin API: /api/admin?a=login|logout|me|stats
// Set ADMIN_PASSWORD (and optionally ADMIN_USER, default "admin"; ADMIN_SECRET to sign sessions) in Vercel.
const { backend, hasStore, store, daysBack, ip, hmac, cookies, body, send, crypto, sum } = require('./_lib.js');

const COOKIE = 'pehlo_admin';
const TTL = 12 * 3600;
const eq = (a, b) => { const x = crypto.createHash('sha256').update(String(a)).digest(); const y = crypto.createHash('sha256').update(String(b)).digest(); return crypto.timingSafeEqual(x, y); };

function token(user) { const p = Buffer.from(JSON.stringify({ u: user, exp: Math.floor(Date.now() / 1000) + TTL })).toString('base64url'); return p + '.' + hmac(p); }
function check(req) {
  const t = cookies(req)[COOKIE]; if (!t || !process.env.ADMIN_PASSWORD) return null;
  const [p, sig] = t.split('.'); if (!p || !sig || !eq(sig, hmac(p))) return null;
  try { const o = JSON.parse(Buffer.from(p, 'base64url').toString()); return o.exp > Date.now() / 1000 ? o : null; } catch (e) { return null; }
}
const setCookie = (v, age) => `${COOKIE}=${v}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;


module.exports = async function handler(req, res) {
  const url = new URL(req.url, 'http://x'); const a = url.searchParams.get('a') || 'me';
  if (!process.env.ADMIN_PASSWORD) return send(res, 503, { error: 'setup', message: 'Set ADMIN_PASSWORD in Vercel → Settings → Environment Variables, then redeploy.' });

  if (a === 'login') {
    if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
    const who = ip(req);
    if (hasStore()) {
      try { const n = await store.loginHit(who); if (n > 8) return send(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' }); } catch (e) { /* store down: allow */ }
    }
    const b = await body(req);
    const user = process.env.ADMIN_USER || 'admin';
    const ok = eq(String(b.user || '').trim().toLowerCase(), user.toLowerCase()) & eq(String(b.pass || ''), process.env.ADMIN_PASSWORD);
    if (!ok) { await new Promise((r) => setTimeout(r, 600)); return send(res, 401, { error: 'Wrong username or password.' }); }
    if (hasStore()) { try { await store.loginClear(who); } catch (e) { /* ignore */ } }
    return send(res, 200, { ok: true, user }, { 'set-cookie': setCookie(token(user), TTL) });
  }
  if (a === 'logout') return send(res, 200, { ok: true }, { 'set-cookie': setCookie('', 0) });

  const s = check(req);
  if (!s) return send(res, 401, { error: 'login required' });
  if (a === 'me') return send(res, 200, { user: s.u, store: hasStore(), backend: backend() });
  if (a !== 'stats') return send(res, 400, { error: 'unknown action' });
  if (!hasStore()) return send(res, 200, { store: false });

  const n = Math.min(Math.max(parseInt(url.searchParams.get('days'), 10) || 30, 1), 180);
  const cur = daysBack(n); const prev = daysBack(n, n);
  let r;
  try { r = await store.stats(cur, prev); }
  catch (e) {
    const missing = /pa_stats|function|schema cache|PGRST202|42883/i.test(String(e.body || e.message));
    return send(res, 200, { store: true, backend: backend(), error: missing && backend() === 'supabase' ? 'schema' : 'read', message: missing && backend() === 'supabase' ? 'Supabase is connected, but the analytics tables are not set up yet. Run supabase/schema.sql in the Supabase SQL Editor.' : 'Could not read the analytics store.' });
  }
  const days = r.days.map((x) => ({ d: x.d, u: x.u, s: x.s, sl: x.sl, pv: x.h.pv || 0, start: x.h['all:start'] || 0, list: x.h['all:list'] || 0, print: x.h['all:print'] || 0 }));
  return send(res, 200, {
    store: true, backend: backend(), from: cur[0], to: cur[cur.length - 1], days,
    cur: sum(r.days.map((x) => x.h)), prev: r.prevH,
    uniq: { cur: r.uCur, prev: r.uPrev }, sessions: { cur: r.sCur, prev: r.sPrev }, listSessions: { cur: r.slCur, prev: r.slPrev },
    nomatch: r.search, errors: r.errors, reports: r.reports || []
  });
};
