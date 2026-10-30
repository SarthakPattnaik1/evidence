// Shared helpers for Pehlo's serverless functions (files starting with _ are not routes).
// Analytics storage works with EITHER backend, whichever is connected in Vercel:
//   • Supabase (Postgres): SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) + SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY)
//     → run supabase/schema.sql once in the Supabase SQL Editor.
//   • Upstash Redis: KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL / _TOKEN)
const crypto = require('crypto');

const env = (...ks) => { for (const k of ks) if (process.env[k]) return process.env[k]; return ''; };
const SB_URL = () => env('SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_PROJECT_URL').replace(/\/$/, '');
const SB_KEY = () => env('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_KEY');
const R_URL = () => env('KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL');
const R_TOK = () => env('KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN');
function backend() {
  if (SB_URL() && SB_KEY()) return 'supabase';
  if (R_URL() && R_TOK()) return 'upstash';
  return null;
}
const hasStore = () => !!backend();

/* ---------- Upstash ---------- */
async function pipe(cmds) {
  if (!cmds.length) return [];
  const r = await fetch(R_URL().replace(/\/$/, '') + '/pipeline', {
    method: 'POST', headers: { Authorization: 'Bearer ' + R_TOK(), 'content-type': 'application/json' }, body: JSON.stringify(cmds)
  });
  if (!r.ok) throw new Error('upstash ' + r.status);
  const j = await r.json();
  return j.map((x) => (x && x.error ? null : x && x.result));
}
/* ---------- Supabase ---------- */
async function rpc(fn, args) {
  const r = await fetch(SB_URL() + '/rest/v1/rpc/' + fn, {
    method: 'POST', headers: { apikey: SB_KEY(), Authorization: 'Bearer ' + SB_KEY(), 'content-type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify(args)
  });
  const t = await r.text();
  if (!r.ok) { const e = new Error('supabase ' + r.status + ' ' + t.slice(0, 200)); e.status = r.status; e.body = t; throw e; }
  try { return t ? JSON.parse(t) : null; } catch (e) { return t; }
}

const TTL = 400 * 86400;
const hashOf = (arr) => { const o = {}; if (Array.isArray(arr)) for (let i = 0; i < arr.length; i += 2) o[arr[i]] = Number(arr[i + 1]) || 0; return o; };
const sum = (hs) => { const o = {}; for (const h of hs) for (const [k, v] of Object.entries(h || {})) o[k] = (o[k] || 0) + Number(v); return o; };
const parse = (xs) => (xs || []).map((x) => { if (x && typeof x === 'object') return x; try { return JSON.parse(x); } catch (e) { return null; } }).filter(Boolean);

const store = {
  // inc: Map(field -> n); uniq: [[kind, id]]; logs: [[kind, obj]]
  async ingest(day, inc, uniq, logs) {
    if (backend() === 'supabase') return rpc('pa_ingest', { p_day: day, p_inc: Object.fromEntries(inc), p_uniq: uniq, p_logs: logs });
    const key = 'pa:d:' + day; const cmds = [...inc].map(([f, n]) => ['HINCRBY', key, f, n]); cmds.push(['EXPIRE', key, TTL]);
    for (const [k, h] of uniq) cmds.push(['PFADD', 'pa:' + k + ':' + day, h], ['EXPIRE', 'pa:' + k + ':' + day, TTL]);
    for (const kind of ['search', 'err', 'report']) { const L = logs.filter((l) => l[0] === kind); if (L.length) cmds.push(...L.map((l) => ['LPUSH', 'pa:' + kind, JSON.stringify(l[1])]), ['LTRIM', 'pa:' + kind, 0, kind === 'search' ? 999 : kind === 'report' ? 499 : 199]); }
    return pipe(cmds);
  },
  async stats(cur, prev) {
    if (backend() === 'supabase') {
      const j = await rpc('pa_stats', { p_days: cur, p_prev: prev });
      return { days: j.days.map((x) => ({ d: x.d, h: x.h || {}, u: +x.u, s: +x.s, sl: +x.sl })), prevH: j.prev || {}, uCur: +j.ucur, uPrev: +j.uprev, sCur: +j.scur, sPrev: +j.sprev, slCur: +j.slcur, slPrev: +j.slprev, search: parse(j.search), errors: parse(j.err), reports: parse(j.rep) };
    }
    const cmds = [];
    cur.forEach((d) => cmds.push(['HGETALL', 'pa:d:' + d], ['PFCOUNT', 'pa:u:' + d], ['PFCOUNT', 'pa:s:' + d], ['PFCOUNT', 'pa:sl:' + d]));
    prev.forEach((d) => cmds.push(['HGETALL', 'pa:d:' + d]));
    for (const k of ['u', 's', 'sl']) cmds.push(['PFCOUNT', ...cur.map((d) => 'pa:' + k + ':' + d)], ['PFCOUNT', ...prev.map((d) => 'pa:' + k + ':' + d)]);
    cmds.push(['LRANGE', 'pa:search', 0, 999], ['LRANGE', 'pa:err', 0, 59], ['LRANGE', 'pa:report', 0, 199]);
    const r = await pipe(cmds); let i = 0;
    const days = cur.map((d) => ({ d, h: hashOf(r[i++]), u: r[i++] || 0, s: r[i++] || 0, sl: r[i++] || 0 }));
    const prevH = sum(prev.map(() => hashOf(r[i++])));
    const [uCur, uPrev, sCur, sPrev, slCur, slPrev] = [r[i++], r[i++], r[i++], r[i++], r[i++], r[i++]].map((x) => x || 0);
    return { days, prevH, uCur, uPrev, sCur, sPrev, slCur, slPrev, search: parse(r[i++]), errors: parse(r[i++]), reports: parse(r[i++]) };
  },
  async loginHit(ip) {
    if (backend() === 'supabase') return Number(await rpc('pa_login_hit', { p_ip: ip })) || 0;
    const [n] = await pipe([['INCR', 'pa:login:' + ip], ['EXPIRE', 'pa:login:' + ip, 900, 'NX']]); return n || 0;
  },
  async loginClear(ip) {
    if (backend() === 'supabase') return rpc('pa_login_clear', { p_ip: ip });
    return pipe([['DEL', 'pa:login:' + ip]]);
  },
  // Shared translation cache (best effort: callers ignore failures).
  async trGet(lang, hashes) {
    if (!hashes.length) return {};
    if (backend() === 'supabase') return (await rpc('pa_tr_get', { p_lang: lang, p_h: hashes })) || {};
    if (backend() === 'upstash') { const [vals] = await pipe([['HMGET', 'pa:tr:' + lang, ...hashes]]); const o = {}; (vals || []).forEach((v, i) => { if (v) o[hashes[i]] = v; }); return o; }
    return {};
  },
  async trPut(lang, items) {
    if (!items.length) return;
    if (backend() === 'supabase') return rpc('pa_tr_put', { p_lang: lang, p_items: items });
    if (backend() === 'upstash') return pipe([['HSET', 'pa:tr:' + lang, ...items.flatMap(([h, , t]) => [h, t])]]);
  },
  // Cheap round trip used by /api/health and the admin "System" box.
  async ping() {
    if (backend() === 'supabase') { await rpc('pa_stats', { p_days: [], p_prev: [] }); return true; }
    await pipe([['PING']]); return true;
  }
};

// Days are counted in India time, where almost all users are.
function dayKey(d) { const t = new Date((d ? d.getTime() : Date.now()) + 330 * 60000); return t.toISOString().slice(0, 10); }
function daysBack(n, offset = 0) { const out = []; const now = Date.now(); for (let i = n - 1 + offset; i >= offset; i--) out.push(dayKey(new Date(now - i * 86400000))); return out; }

function ip(req) { return String(req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '').split(',')[0].trim() || '0.0.0.0'; }
function secret() {
  const s = process.env.ADMIN_SECRET || ((process.env.ADMIN_PASSWORD || '') + '|pehlo-admin|' + (SB_KEY() || R_TOK() || ''));
  return crypto.createHash('sha256').update(s).digest();
}
const hmac = (data) => crypto.createHmac('sha256', secret()).update(data).digest('base64url');

function cookies(req) {
  const o = {}; String(req.headers.cookie || '').split(';').forEach((p) => { const i = p.indexOf('='); if (i > 0) o[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); });
  return o;
}
async function body(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) { try { return JSON.parse(String(req.body)); } catch (e) { return {}; } }
  return new Promise((resolve) => { let d = ''; req.on('data', (c) => { d += c; if (d.length > 65536) req.destroy(); }); req.on('end', () => { try { resolve(JSON.parse(d || '{}')); } catch (e) { resolve({}); } }); req.on('error', () => resolve({})); });
}
function send(res, code, obj, headers = {}) {
  res.statusCode = code;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(obj));
}

module.exports = { backend, hasStore, store, dayKey, daysBack, ip, hmac, cookies, body, send, crypto, sum };
