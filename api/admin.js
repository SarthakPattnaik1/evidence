// Admin API: /api/admin?a=login|logout|me|stats
// Set ADMIN_PASSWORD (and optionally ADMIN_USER, default "admin"; ADMIN_SECRET to sign sessions) in Vercel.
const { hasStore, pipe, daysBack, ip, hmac, cookies, body, send, crypto } = require('./_lib.js');

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

const hash = (arr) => { const o = {}; if (Array.isArray(arr)) for (let i = 0; i < arr.length; i += 2) o[arr[i]] = Number(arr[i + 1]) || 0; return o; };
const sum = (hs) => { const o = {}; for (const h of hs) for (const [k, v] of Object.entries(h)) o[k] = (o[k] || 0) + v; return o; };
const parse = (xs) => (xs || []).map((x) => { try { return JSON.parse(x); } catch (e) { return null; } }).filter(Boolean);

module.exports = async function handler(req, res) {
  const url = new URL(req.url, 'http://x'); const a = url.searchParams.get('a') || 'me';
  if (!process.env.ADMIN_PASSWORD) return send(res, 503, { error: 'setup', message: 'Set ADMIN_PASSWORD in Vercel → Settings → Environment Variables, then redeploy.' });

  if (a === 'login') {
    if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
    const who = ip(req); const rk = 'pa:login:' + who;
    if (hasStore()) {
      try { const [n] = await pipe([['INCR', rk], ['EXPIRE', rk, 900, 'NX']]); if (n > 8) return send(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' }); } catch (e) { /* store down: allow */ }
    }
    const b = await body(req);
    const user = process.env.ADMIN_USER || 'admin';
    const ok = eq(String(b.user || '').trim().toLowerCase(), user.toLowerCase()) & eq(String(b.pass || ''), process.env.ADMIN_PASSWORD);
    if (!ok) { await new Promise((r) => setTimeout(r, 600)); return send(res, 401, { error: 'Wrong username or password.' }); }
    if (hasStore()) { try { await pipe([['DEL', rk]]); } catch (e) { /* ignore */ } }
    return send(res, 200, { ok: true, user }, { 'set-cookie': setCookie(token(user), TTL) });
  }
  if (a === 'logout') return send(res, 200, { ok: true }, { 'set-cookie': setCookie('', 0) });

  const s = check(req);
  if (!s) return send(res, 401, { error: 'login required' });
  if (a === 'me') return send(res, 200, { user: s.u, store: hasStore() });
  if (a !== 'stats') return send(res, 400, { error: 'unknown action' });
  if (!hasStore()) return send(res, 200, { store: false });

  const n = Math.min(Math.max(parseInt(url.searchParams.get('days'), 10) || 30, 1), 180);
  const cur = daysBack(n); const prev = daysBack(n, n);
  const cmds = [];
  cur.forEach((d) => cmds.push(['HGETALL', 'pa:d:' + d], ['PFCOUNT', 'pa:u:' + d], ['PFCOUNT', 'pa:s:' + d], ['PFCOUNT', 'pa:sl:' + d]));
  prev.forEach((d) => cmds.push(['HGETALL', 'pa:d:' + d]));
  cmds.push(['PFCOUNT', ...cur.map((d) => 'pa:u:' + d)], ['PFCOUNT', ...prev.map((d) => 'pa:u:' + d)]);
  cmds.push(['PFCOUNT', ...cur.map((d) => 'pa:s:' + d)], ['PFCOUNT', ...prev.map((d) => 'pa:s:' + d)]);
  cmds.push(['PFCOUNT', ...cur.map((d) => 'pa:sl:' + d)], ['PFCOUNT', ...prev.map((d) => 'pa:sl:' + d)]);
  cmds.push(['LRANGE', 'pa:search', 0, 999], ['LRANGE', 'pa:err', 0, 59]);
  let r;
  try { r = await pipe(cmds); } catch (e) { return send(res, 502, { store: true, error: 'Could not read the analytics store.' }); }
  let i = 0; const days = []; const curH = [];
  for (const d of cur) { const h = hash(r[i++]); curH.push(h); days.push({ d, u: r[i++] || 0, s: r[i++] || 0, sl: r[i++] || 0, pv: h.pv || 0, start: h['all:start'] || 0, list: h['all:list'] || 0, print: h['all:print'] || 0 }); }
  const prevH = prev.map(() => hash(r[i++]));
  const [uCur, uPrev, sCur, sPrev, slCur, slPrev] = [r[i++], r[i++], r[i++], r[i++], r[i++], r[i++]];
  const nomatch = parse(r[i++]); const errors = parse(r[i++]);
  return send(res, 200, {
    store: true, from: cur[0], to: cur[cur.length - 1], days,
    cur: sum(curH), prev: sum(prevH),
    uniq: { cur: uCur || 0, prev: uPrev || 0 }, sessions: { cur: sCur || 0, prev: sPrev || 0 }, listSessions: { cur: slCur || 0, prev: slPrev || 0 },
    nomatch, errors
  });
};
