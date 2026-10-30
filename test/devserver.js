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
Object.assign(process.env, { KV_REST_API_URL: 'http://127.0.0.1:' + PORT + '/__redis', KV_REST_API_TOKEN: 't', ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'test-pass-123' });
const handlers = {}; const load = (n) => handlers[n] || (handlers[n] = require(path.join(ROOT, 'api', n + '.js')));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/__redis/pipeline') { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { const out = JSON.parse(b).map((c) => { try { return { result: cmd(c) }; } catch (e) { return { error: e.message }; } }); res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(out)); }); return; }
  const m = u.pathname.match(/^\/api\/([a-z]+)$/);
  if (m && fs.existsSync(path.join(ROOT, 'api', m[1] + '.js'))) {
    res.status = (c) => { res.statusCode = c; return res; }; res.json = (o) => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(o)); };
    req.headers['x-forwarded-for'] = req.headers['x-forwarded-for'] || '10.0.0.' + (Math.floor(Math.random() * 3) + 1);
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
