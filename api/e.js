// Anonymous, aggregate usage events. No answers, no names, no cookies, no IP stored.
// Each batch only increments daily counters; unique visitors are counted with a HyperLogLog over a
// hash of (IP + browser + a salt that changes every day), so nobody can be followed across days.
const { hasStore, store, dayKey, ip, hmac, body, send } = require('./_lib.js');
const { check: checkToken } = require('./s.js');
// Only pages served from these hosts may report. Scripts can fake this header, so it is a first filter, not the only one.
const ORIGIN_OK = /^https?:\/\/(saboot\.org|www\.saboot\.org|[a-z0-9-]+\.vercel\.app|localhost(:\d+)?|127\.0\.0\.1(:\d+)?)(\/|$)/i;
// Things a verified person did (counted once per network per day, so repeats cannot inflate them).
const VERIFIED = new Set(['start', 'list', 'print', 'share', 'done', 'voice', 'consent']);

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

  // 1. Must come from our own pages, with a valid signed session token issued by /api/s to this browser.
  const origin = String(req.headers.origin || req.headers.referer || '');
  const tok = checkToken(b.k, ua);
  if (!ORIGIN_OK.test(origin) || !tok) {
    add(!ORIGIN_OK.test(origin) ? 'x:origin' : 'x:token', ev.length);   // rejected events are counted, never used
    try { await store.ingest(day, inc, [], []); } catch (err) { /* ignore */ }
    return send(res, 202, { ok: false });
  }
  // 2. Human signals from the page: 1 = tapped/clicked/typed, 2 = page visible ≥ 3 s, 4 = not automated (navigator.webdriver false).
  const hflags = Number.isInteger(b.h) ? b.h : 0; const human = (hflags & 7) === 7;
  const net = hmac('net|' + day + '|' + ip(req)).slice(0, 16);   // one per network per day; salted daily, cannot be reversed to an IP
  const lang = LANGS.has(b.l) ? b.l : 'en';
  const sid = tok.sid;

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
      case 'consent': if (e.x === 'agree' || e.x === 'disagree') add('consent:' + e.x); break;
      case 'oc': { if (!g) break; const met = ['yes', 'notyet', 'noneed'].includes(e.x) ? e.x : 'na'; const hp = ['yes', 'little', 'no'].includes(e.y) ? e.y : 'na'; add('oc:met:' + met); add('oc:help:' + hp); add('oc:all'); break; }
      case 'aid': if (['yes', 'likely', 'maybe', 'no'].includes(e.x)) add('aid:' + e.x); break;
      case 'aidopen': add('aid:open'); break;
      case 'remind': if (g && (e.x === 'cal' || e.x === 'wa')) { add('remind:' + e.x); add('remind:' + g); } break;
      case 'read': if (e.x === 'device' || e.x === 'server') { add('read:' + e.x); if (LANGS.has(e.l)) add('read:' + e.l); } break;
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
  // 3. Verified, de-duplicated counts: distinct networks per day where a real person did each thing.
  if (human) {
    add('h:batch');
    uniq.push(['v:visit', net]);
    for (const e of ev) {
      if (e && e.t === 'oc' && ID.test(e.g || '')) { if (e.x === 'yes') uniq.push(['v:met', net]); if (e.y === 'yes' || e.y === 'little') uniq.push(['v:helped', net]); continue; }
      if (e && e.t === 'aid' && (e.x === 'yes' || e.x === 'likely')) { uniq.push(['v:aid', net]); continue; }
      if (e && e.t === 'remind') { uniq.push(['v:remind', net]); continue; }
      if (!e || !VERIFIED.has(e.t)) continue;
      if (e.t === 'consent') { if (e.x === 'agree') uniq.push(['v:agree', net]); continue; }
      if (e.t !== 'voice' && !ID.test(e.g || '')) continue;
      uniq.push(['v:' + e.t, net]);
    }
  } else add('x:nothuman', 1);
  try { await store.ingest(day, inc, uniq, lists); } catch (err) { console.error('[e] store', err.message); return send(res, 202, { ok: false }); }
  return send(res, 202, { ok: true });
};
