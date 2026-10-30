// Anonymous, aggregate usage events. No answers, no names, no cookies, no IP stored.
// Each batch only increments daily counters; unique visitors are counted with a HyperLogLog over a
// hash of (IP + browser + a salt that changes every day), so nobody can be followed across days.
const { hasStore, store, dayKey, ip, hmac, body, send } = require('./_lib.js');

const ID = /^[a-z0-9][a-z0-9_-]{0,47}$/;
const ROUTES = new Set(['home', 'cat', 'start', 'topic', 'quiz', 'brk', 'urgent', 'list', 'answers', 'timeline', 'report', 'questions', 'q', 'myths', 'advocates', 'help', 'about', 'a', 'other']);
const GUIDE_EV = new Set(['intro', 'start', 'list', 'deep', 'done', 'print', 'report', 'save', 'share']);
const LANGS = new Set('en hi bn te mr ta ur gu kn or ml pa as mai sat ks ne sd doi kok mni brx sa'.split(' '));
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|monitor|curl|wget|python|axios|node-fetch/i;

const clip = (s, n) => String(s == null ? '' : s).slice(0, n);
// Strip anything that could identify a person from free-text search misses.
const scrub = (s) => clip(s, 80).toLowerCase()
  .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]').replace(/\+?\d[\d\s-]{5,}\d/g, '[number]').replace(/\d{4,}/g, '[number]')
  .replace(/https?:\/\/\S+/g, '[link]').replace(/\s+/g, ' ').trim();

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  if (!hasStore()) return send(res, 202, { ok: false, reason: 'no store' });
  const ua = String(req.headers['user-agent'] || '');
  if (!ua || BOT.test(ua)) { if (process.env.SABOOT_DEBUG) console.error('[e] bot', ua); return send(res, 202, { ok: false }); }
  const b = await body(req);
  const ev = Array.isArray(b.e) ? b.e.slice(0, 60) : [];
  if (!ev.length) return send(res, 400, { error: 'no events' });

  const day = dayKey(); const inc = new Map(); const lists = [];
  const add = (f, n = 1) => inc.set(f, (inc.get(f) || 0) + n);
  const lang = LANGS.has(b.l) ? b.l : 'en';
  const sid = typeof b.s === 'string' && /^[a-z0-9]{8,24}$/.test(b.s) ? b.s : '';

  if (b.first) {
    add('dev:' + (b.d === 'm' ? 'm' : b.d === 't' ? 't' : 'd'));
    const ref = clip(b.r, 60).toLowerCase().replace(/^www\./, '');
    add('ref:' + (/^[a-z0-9.-]+$/.test(ref) && ref ? ref : 'direct'));
    if (b.u && ID.test(String(b.u).toLowerCase())) add('utm:' + String(b.u).toLowerCase());
    const c = clip(req.headers['x-vercel-ip-country'], 2).toUpperCase(); const rg = clip(req.headers['x-vercel-ip-country-region'], 4).toUpperCase();
    if (/^[A-Z]{2}$/.test(c)) add('geo:' + c + (/^[A-Z0-9]{1,4}$/.test(rg) ? '-' + rg : ''));
    add('vlang:' + lang);
  }
  for (const e of ev) {
    if (!e || typeof e.t !== 'string') continue;
    const g = ID.test(e.g || '') ? e.g : null;
    switch (e.t) {
      case 'view': add('v:' + (ROUTES.has(e.v) ? e.v : 'other')); add('pv'); add('pvl:' + lang); break;
      case 'step': if (g && Number.isInteger(e.n) && e.n >= 0 && e.n <= 60) add('step:' + g + ':' + e.n); break;
      case 'urg': if (g && ID.test(e.x || '')) add('urg:' + g + ':' + e.x); break;
      case 'call': if (/^\d{3,12}$/.test(String(e.x))) add('call:' + e.x); break;
      case 'out': { const d = clip(e.x, 60).toLowerCase(); if (/^[a-z0-9.-]+\.[a-z]{2,}$/.test(d)) add('out:' + d); break; }
      case 'search': { const n = Number.isInteger(e.n) ? Math.max(0, Math.min(e.n, 9)) : 0; add(n > 0 ? 'search:hit' : 'search:miss'); const q = scrub(e.x); if (q.length >= 3) lists.push(['search', { t: Date.now(), q, n, l: lang }]); break; }
      case 'pick': { if (!ID.test(e.g || '')) break; add('search:pick'); const q = scrub(e.x); if (q.length >= 3) lists.push(['search', { t: Date.now(), q, g: e.g, l: lang }]); break; }
      case 'lang': if (LANGS.has(e.x)) add('lang:' + e.x); break;
      case 'voice': add('voice:all'); if (LANGS.has(e.l)) add('voice:' + e.l); break;
      case 'tr': if (LANGS.has(e.x)) add('tr:' + (e.ok ? 'ok' : 'fail') + ':' + e.x); break;
      case 'fb': if (g && (e.x === 'y' || e.x === 'n')) add('fb:' + g + ':' + e.x); break;
      case 'report': { if (!g) break; const k = ['law', 'paper', 'confusing', 'translation', 'other'].includes(e.x) ? e.x : 'other'; add('rep:' + g); add('rep:all'); lists.push(['report', { t: Date.now(), g, k, m: scrub(e.m).slice(0, 400), l: lang, v: clip(e.v, 20) }]); break; }
      case 'err': add('err'); lists.push(['err', { t: Date.now(), m: clip(e.x, 160), v: clip(e.v, 20) }]); break;
      default: if (GUIDE_EV.has(e.t) && g) { add(e.t + ':' + g); add('all:' + e.t); }
    }
  }
  if (!inc.size && !lists.length) return send(res, 202, { ok: false });
  add('ev', ev.length);

  const vis = hmac(day + '|' + ip(req) + '|' + ua).slice(0, 16);
  const uniq = [['u', vis]];
  if (sid) uniq.push(['s', sid]);
  if (sid && ev.some((x) => x && x.t === 'list')) uniq.push(['sl', sid]);
  try { await store.ingest(day, inc, uniq, lists); } catch (err) { console.error('[e] store', err.message); return send(res, 202, { ok: false }); }
  return send(res, 202, { ok: true });
};
