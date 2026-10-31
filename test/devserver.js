// Local stand-in for Vercel: serves build/ with clean URLs, runs api/*.js, and fakes Upstash Redis in memory.
const http = require('http'); const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const PORT = +process.env.PORT || 8790;
// ---- fake Upstash ----
const db = new Map();
function cmd([c, k, ...a]) {
  c = c.toUpperCase();
  const get = (t) => { if (!db.has(k)) db.set(k, t()); return db.get(k); };
  switch (c) {
    case 'HINCRBY': { const h = get(() => new Map()); h.set(a[0], (h.get(a[0]) || 0) + Number(a[1])); return h.get(a[0]); }
    case 'HGETALL': { const h = db.get(k); return h ? [...h].flat().map(String) : []; }
    case 'EXPIRE': return 1;
    case 'HMGET': { const h = db.get(k); return a.map((f) => (h && h.has(f) ? String(h.get(f)) : null)); }
    case 'PFADD': { const s = get(() => new Set()); a.forEach((x) => s.add(x)); return 1; }
    case 'PFCOUNT': { const u = new Set(); [k, ...a].forEach((kk) => (db.get(kk) || new Set()).forEach((x) => u.add(kk + '|' + x))); return u.size; }
    case 'LPUSH': { const l = get(() => []); a.forEach((x) => l.unshift(x)); return l.length; }
    case 'LTRIM': { const l = db.get(k) || []; db.set(k, l.slice(+a[0], +a[1] + 1)); return 'OK'; }
    case 'LRANGE': { const l = db.get(k) || []; return l.slice(+a[0], +a[1] + 1); }
    case 'INCR': { const v = (db.get(k) || 0) + 1; db.set(k, v); return v; }
    case 'DEL': db.delete(k); return 1;
    default: throw new Error('unsupported ' + c);
  }
}
if (process.env.STORE === 'supabase') Object.assign(process.env, { SUPABASE_URL: 'http://127.0.0.1:' + PORT, SUPABASE_SERVICE_ROLE_KEY: 'svc-test' });
else Object.assign(process.env, { KV_REST_API_URL: 'http://127.0.0.1:' + PORT + '/__redis', KV_REST_API_TOKEN: 't' });
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test-pass-123';
process.env.ADMIN_USER = process.env.ADMIN_USER || 'admin@example.com';
// Fake PostgREST: /rest/v1/rpc/<fn> runs the function in a local Postgres (PG_URL), like Supabase does.
let pg = null; if (process.env.STORE === 'supabase') { const { Pool } = require(process.env.PG_MODULE || 'pg'); pg = new Pool({ connectionString: process.env.PG_URL }); }
const SIG = { pa_ingest: ['p_day', 'p_inc', 'p_uniq', 'p_logs'], pa_stats: ['p_days', 'p_prev'], pa_login_hit: ['p_ip'], pa_login_clear: ['p_ip'], pa_tr_get: ['p_lang', 'p_h'], pa_tr_put: ['p_lang', 'p_items'] };
const CAST = { p_day: 'date', p_inc: 'jsonb', p_uniq: 'jsonb', p_logs: 'jsonb', p_days: 'date[]', p_prev: 'date[]', p_ip: 'text', p_lang: 'text', p_h: 'text[]', p_items: 'jsonb' };
if (process.env.FAKE_TRANSLATE) {
  // Pretend to be Gemini: prefix every string so tests can see what got translated. Delay simulates a slow model.
  process.env.GEMINI_API_KEY = 'AQ.fake'; const realFetch = global.fetch;
  global.fetch = async (u, o) => {
    if (!String(u).includes('generativelanguage.googleapis.com')) return realFetch(u, o);
    const b = JSON.parse(o.body);
    const vp = b.contents[0].parts; const vt = vp.map((x) => x.text || '').join(' ');
    if (b.generationConfig && b.generationConfig.responseModalities) { global.TTSCALLS = (global.TTSCALLS || 0) + 1; const pcm = Buffer.alloc(24000 * 2 * 0.3).toString('base64'); return { ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'audio/L16;codec=pcm;rate=24000', data: pcm } }] } }] }), text: async () => '' }; }
    if (vp.some((x) => x.inlineData) || vt.includes('legal-help search box')) {
      global.VOICECALLS = (global.VOICECALLS || 0) + 1;
      const audio = vp.find((x) => x.inlineData); const okWav = !audio || Buffer.from(audio.inlineData.data.slice(0, 16), 'base64').toString('latin1').startsWith('RIFF');
      const out = audio ? { text: okWav ? 'कुत्ते ने मेरे बेटे को काट लिया' : '', en: okWav ? 'stray dog bit my son' : '' } : { en: /फोन|फ़ोन|ফোন/.test(vt) ? 'mobile phone stolen' : /कुत्त|ନୁକୁର|କୁକୁର/.test(vt) ? 'dog bite' : /जमीन|ज़मीन|ଜମି/.test(vt) ? 'land encroachment by neighbour' : 'legal problem' };
      return { ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(out) }] } }] }), text: async () => '' };
    }
    // FAKE_FAIL=N: the first N translation calls fail like Gemini's free-tier daily limit (429), then it works again.
    global.FAILN = (global.FAILN || 0) + 1;
    if (global.FAILN <= +(process.env.FAKE_FAIL || 0)) return { ok: false, status: 429, json: async () => ({ error: { code: 429, message: 'You exceeded your current quota (per day)' } }), text: async () => '{"error":{"code":429,"message":"You exceeded your current quota, PerDay"}}' };
    const p = b.contents[0].parts[0].text; const obj = JSON.parse(p.slice(p.lastIndexOf('\n\n') + 2)); const r = {};
    global.GEMCALLS = (global.GEMCALLS || 0) + 1; for (const k in obj) r[k] = '«' + obj[k] + '»';
    await new Promise((res) => setTimeout(res, +process.env.FAKE_TRANSLATE || 300));
    return { ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(r) }] } }] }), text: async () => '' };
  };
}
const handlers = {}; const load = (n) => handlers[n] || (handlers[n] = require(path.join(ROOT, 'api', n + '.js')));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml' };
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/__gemcalls') { res.end(String(global.GEMCALLS || 0)); return; }
  if (u.pathname === '/__redis/pipeline') { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { const out = JSON.parse(b).map((c) => { try { return { result: cmd(c) }; } catch (e) { return { error: e.message }; } }); res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(out)); }); return; }
  const rp = u.pathname.match(/^\/rest\/v1\/rpc\/([a-z_]+)$/);
  if (rp && pg) { let b = ''; req.on('data', (c) => (b += c)); req.on('end', async () => {
    if (req.headers.apikey !== 'svc-test') { res.statusCode = 401; return res.end('{"message":"bad key"}'); }
    const fn = rp[1]; const sig = SIG[fn]; if (!sig) { res.statusCode = 404; return res.end('{"code":"PGRST202","message":"Could not find the function in the schema cache"}'); }
    const a = JSON.parse(b || '{}'); const vals = sig.map((k) => (CAST[k] === 'jsonb' ? JSON.stringify(a[k]) : a[k]));
    try { const q = await pg.query(`select ${fn}(${sig.map((k, i) => `$${i + 1}::${CAST[k]}`).join(',')}) as r`, vals); res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(q.rows[0].r)); }
    catch (e) { res.statusCode = 400; res.end(JSON.stringify({ code: e.code, message: e.message })); } }); return; }
  const m = u.pathname.match(/^\/api\/([a-z]+)$/);
  if (m && fs.existsSync(path.join(ROOT, 'api', m[1] + '.js'))) {
    res.status = (c) => { res.statusCode = c; return res; }; res.json = (o) => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(o)); };
    req.headers['x-forwarded-for'] = req.headers['x-forwarded-for'] || process.env.FIXED_IP || '10.0.0.' + (Math.floor(Math.random() * 3) + 1);
    if (req.headers['x-test-geo']) { const [c, r] = req.headers['x-test-geo'].split('-'); req.headers['x-vercel-ip-country'] = c; req.headers['x-vercel-ip-country-region'] = r; }
    if (m[1] === 'e') { const orig = req.on.bind(req); let buf=''; req.on('data', (c) => (buf += c)); req.on('end', () => { try { const j = JSON.parse(buf); console.log('E', j.s, j.e.map((x) => x.t).join(',')); } catch (e) { console.log('E?', buf.slice(0, 80)); } }); }
    if (m[1] === 'e') { const oe = res.end.bind(res); res.end = (d) => { console.log('R', res.statusCode, String(d).slice(0, 60)); return oe(d); }; }
    try { await load(m[1])(req, res); } catch (e) { console.error(e); res.statusCode = 500; res.end('err'); }
    return;
  }
  let p = path.join(ROOT, 'build', decodeURIComponent(u.pathname));
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  else if (!fs.existsSync(p) && fs.existsSync(p + '.html')) p += '.html';
  if (!fs.existsSync(p)) { res.statusCode = 404; res.end('not found'); return; }
  res.setHeader('content-type', TYPES[path.extname(p)] || 'application/octet-stream'); fs.createReadStream(p).pipe(res);
}).listen(PORT, () => console.log('dev on ' + PORT));
