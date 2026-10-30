// Shared helpers for Pehlo's serverless functions (files starting with _ are not routes).
const crypto = require('crypto');

// Upstash Redis over REST. Works with either Vercel's Upstash/KV integration variable names or Upstash's own.
const R_URL = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const R_TOK = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const hasStore = () => !!(R_URL() && R_TOK());

async function pipe(cmds) {
  if (!cmds.length) return [];
  const r = await fetch(R_URL().replace(/\/$/, '') + '/pipeline', {
    method: 'POST', headers: { Authorization: 'Bearer ' + R_TOK(), 'content-type': 'application/json' }, body: JSON.stringify(cmds)
  });
  if (!r.ok) throw new Error('store ' + r.status);
  const j = await r.json();
  return j.map((x) => (x && x.error ? null : x && x.result));
}

// Days are counted in India time, where almost all users are.
function dayKey(d) { const t = new Date((d ? d.getTime() : Date.now()) + 330 * 60000); return t.toISOString().slice(0, 10); }
function daysBack(n, offset = 0) { const out = []; const now = Date.now(); for (let i = n - 1 + offset; i >= offset; i--) out.push(dayKey(new Date(now - i * 86400000))); return out; }

function ip(req) { return String(req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '').split(',')[0].trim() || '0.0.0.0'; }
function secret() {
  const s = process.env.ADMIN_SECRET || ((process.env.ADMIN_PASSWORD || '') + '|pehlo-admin|' + (R_TOK() || ''));
  return crypto.createHash('sha256').update(s).digest();
}
const hmac = (data) => crypto.createHmac('sha256', secret()).update(data).digest('base64url');

function cookies(req) {
  const o = {}; String(req.headers.cookie || '').split(';').forEach((p) => { const i = p.indexOf('='); if (i > 0) o[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); });
  return o;
}
async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  return new Promise((resolve) => { let d = ''; req.on('data', (c) => { d += c; if (d.length > 65536) req.destroy(); }); req.on('end', () => { try { resolve(JSON.parse(d || '{}')); } catch (e) { resolve({}); } }); req.on('error', () => resolve({})); });
}
function send(res, code, obj, headers = {}) {
  res.statusCode = code;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(obj));
}

module.exports = { hasStore, pipe, dayKey, daysBack, ip, hmac, cookies, body, send, crypto };
