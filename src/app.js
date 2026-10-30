/* EvidenceReady — UI. Answers stay in this tab unless the user opts in to saving on this device. */
(function () {
  'use strict';
  const KB = window.ER_KB, E = window.ER_ENGINE;
  const app = document.getElementById('app');
  const live = document.getElementById('live');
  const STORE_KEY = 'evidenceready_v2';
  const BY_ID = Object.fromEntries(KB.issues.map((i) => [i.id, i]));
  const BUILT = KB.issues.filter((i) => !i.general);
  const CAT = Object.fromEntries(KB.categories.map((c) => [c.id, c]));

  /* ---------- icons ---------- */
  const P = {
    family: '<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c.5-3.6 2.8-6 5.5-6s5 2.4 5.5 6"/><path d="M14 20c.3-2.6 1.6-4.5 3.2-4.5S20.6 17.4 21 20"/>',
    bank: '<path d="M3 10 12 4l9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 20h18"/>',
    bag: '<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    house: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Z"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2"/><path d="M3 13h18"/>',
    umbrella: '<path d="M3 12a9 9 0 0 1 18 0H3Z"/><path d="M12 12v6a2 2 0 0 1-4 0"/>',
    more: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    check: '<path d="m5 12 4.5 4.5L19 7"/>',
    spark: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="2.5"/>',
    chat: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17h0A1.5 1.5 0 0 1 4 15.5Z"/><path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01"/>',
    circlecheck: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.7 2.7L16.5 9.5"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    alert: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17.5v.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    back: '<path d="M15 5 8 12l7 7"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.2-7 8-7s7 2.5 8 7"/>',
    chev: '<path d="m9 5 7 7-7 7"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    q: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17v.5"/>'
  };
  const ic = (n, s = 20) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
  const LOGO = `<svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><path d="M7 8.5A3.5 3.5 0 0 1 10.5 5H17a8.5 8.5 0 0 1 0 17h-3v4.5a3.5 3.5 0 0 1-7 0Z" fill="#0E3A2C"/><path d="m12.4 13.6 2.7 2.7 5.2-5.6" fill="none" stroke="#EDB14C" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* ---------- helpers ---------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const today = () => new Date().toISOString().slice(0, 10);
  const fmtDate = (d) => { if (!d) return ''; const t = new Date(d + 'T00:00:00'); return isNaN(t) ? d : t.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); };
  const KEYS = 'ABCDEFGHI'; const OPTKEYS = '123456789';
  function announce(m) { live.textContent = ''; setTimeout(() => { live.textContent = m; }, 30); }
  let tt; function toast(m) { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2400); announce(m); }
  const optLabel = (q, id) => (q.options.find((o) => o.id === id) || {}).label || id;
  const answerText = (q, a) => (Array.isArray(a) ? a.map((x) => optLabel(q, x)).join('; ') : optLabel(q, a));
  const chapOf = (q) => q.chapter || 'The basics';

  /* ---------- state ---------- */
  const blank = () => ({ issueId: null, topic: null, answers: {}, skipped: {}, stage: 'quick', history: [], quickDone: false, deepDone: false,
    status: {}, records: {}, chrono: [], ackUrgent: {}, adv: null, excludeSensitive: true, notes: '', prefill: {}, chapterFound: [], breaks: 0 });
  let S = blank();
  const UI = { club: 'money', qcat: 'all', qsearch: '', mf: { i: 0, score: 0, ans: null, order: null } };
  let saveOn = false;
  function persist() { if (!saveOn) return; try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* unavailable */ } }
  function loadSaved() { try { const v = localStorage.getItem(STORE_KEY); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function clearSaved() { try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ } }
  const issue = () => BY_ID[S.issueId];

  let downloads = null;
  try { if (window.claude && window.claude.use) window.claude.use('downloads').then((d) => { downloads = d; if (location.hash === '#report') render(); }).catch(() => {}); } catch (e) { /* none */ }

  /* ============ LANGUAGE ============ */
  const I18N = window.ER_I18N; const LMETA = Object.fromEntries(I18N.LANGS.map((l) => [l.code, l]));
  const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } };
  let LANG = lsGet('er_lang') || 'en'; if (!LMETA[LANG]) LANG = 'en';
  const RT = { ui: {}, tr: {} };   // runtime translations: ui[lang] = {key:str}; tr[lang|chunk] = {key:str}
  let sampler = null;
  try { if (window.claude && window.claude.use) window.claude.use('sample').then((s) => { sampler = s; }).catch(() => {}); } catch (e) { /* none */ }
  function T(key, vars) {
    const i = I18N.KEYS.indexOf(key);
    let s = (I18N.STRINGS[LANG] || [])[i] || (RT.ui[LANG] || {})[key] || I18N.STRINGS.en[i] || key;
    if (vars) Object.keys(vars).forEach((k) => { s = s.replace('{' + k + '}', vars[k]); });
    return s;
  }
  const uiReady = (l) => l === 'en' || !!I18N.STRINGS[l] || !!RT.ui[l];
  function trGet(chunk, key, en) { if (LANG === 'en') return en; const m = RT.tr[LANG + '|' + chunk]; return (m && m[key]) || en; }
  const G = (iss, key, en) => trGet('g:' + iss.id + ':' + (/^[a-z]+_e_|^lq|^info|^st\d/.test(key) || /_u_/.test(key) ? 'b' : 'a'), key, en);
  function applyLangDom() {
    const m = LMETA[LANG]; const root = document.documentElement;
    root.lang = LANG; root.dir = m.rtl ? 'rtl' : 'ltr';
    if (m.font) {
      const id = 'font-' + m.font.replace(/\W/g, '');
      if (!document.getElementById(id)) { const l = document.createElement('link'); l.id = id; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(m.font) + ':wght@400;600;700&display=swap'; document.head.appendChild(l); }
      root.style.setProperty('--lfont', '"' + m.font + '"'); root.dataset.script = '1';
    } else { root.style.removeProperty('--lfont'); delete root.dataset.script; }
  }
  const SCRIPT_NOTE = { sat: 'Ol Chiki script', mni: 'Meitei Mayek script', ks: 'Perso-Arabic script', sd: 'Perso-Arabic script', brx: 'Devanagari script', sa: 'Devanagari script', ur: 'Urdu (Nastaliq/Naskh) script' };
  const pending = {};
  let apiOff = false; const trFailed = {}; const chunkFail = {};
  async function viaApi(map) {
    if (apiOff || !/^https?:$/.test(location.protocol)) return null;
    const ac = new AbortController(); const to = setTimeout(() => ac.abort(), 58000);
    try {
      const r = await fetch('/api/translate', { method: 'POST', signal: ac.signal, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ lang: LANG, map }) });
      if (r.status === 501 || r.status === 404 || r.status === 405) { apiOff = true; return null; }
      if (!r.ok) return null;
      const j = await r.json(); const out = {};
      Object.keys(map).forEach((k) => { if (typeof j[k] === 'string' && j[k].trim()) out[k] = j[k]; });
      return Object.keys(out).length ? out : null;
    } catch (e) { return null; } finally { clearTimeout(to); }
  }
  const devT = {};
  async function viaDevice(map) {
    // Chrome's built-in on-device translator, where available.
    try {
      const Tr = window.Translator; if (!Tr || !Tr.create) return null;
      const lim = (pr, ms) => Promise.race([pr, new Promise((_, rj) => setTimeout(() => rj(new Error('timeout')), ms))]);
      const av = await lim(Tr.availability({ sourceLanguage: 'en', targetLanguage: LANG }), 3000);
      if (av === 'unavailable') return null;
      const t = devT[LANG] || (devT[LANG] = await lim(Tr.create({ sourceLanguage: 'en', targetLanguage: LANG }), 20000));
      const out = {};
      for (const [k, v] of Object.entries(map)) {
        const parts = String(v).split(/(\{[^}]*\})/);
        out[k] = (await lim(Promise.all(parts.map((p) => (/^\{[^}]*\}$/.test(p) || !p.trim() ? p : t.translate(p)))), 15000)).join('');
      }
      return out;
    } catch (e) { return null; }
  }
  async function translateMap(map, cacheKey, store) {
    if (LANG === 'en') return true;
    const lk = 'er_tr_' + LANG + '_' + KB.version + '_' + cacheKey;
    const cached = lsGet(lk); if (cached) { store(cached); return true; }
    if (pending[lk]) return pending[lk];
    if (chunkFail[lk] && Date.now() - chunkFail[lk] < 45000) return false;
    if (!sampler) {
      const L0 = LANG;
      pending[lk] = viaApi(map).then((out) => out || viaDevice(map)).then((out) => {
        if (out && Object.keys(out).length) { lsSet(lk, out); if (LANG === L0) store(out); trFailed[L0] = false; delete chunkFail[lk]; TRACK.once('tr', { x: L0, ok: 1 }); return true; }
        trFailed[L0] = true; chunkFail[lk] = Date.now(); TRACK.once('tr', { x: L0, ok: 0 }); return false;
      }).catch(() => { trFailed[L0] = true; chunkFail[lk] = Date.now(); return false; }).finally(() => { delete pending[lk]; trPill(); });
      trPill();
      return pending[lk];
    }
    const m = LMETA[LANG];
    const prompt = `You are translating a free legal-help app for ordinary people in India into ${m.name} (${m.native}${SCRIPT_NOTE[LANG] ? ', ' + SCRIPT_NOTE[LANG] : ''}).
Rules:
- Use very simple, everyday words that a person with little schooling, or an elderly person, understands. Short sentences. Respectful tone.
- Keep unchanged: anything in {curly braces}, numbers, ₹ amounts, phone numbers, website addresses, names of Acts and sections, and common terms like FIR, UPI, RBI, PAN, NRI, OCI, PoA, KYC, GST, CIBIL, OTP, EMI, RERA, NCLT, MSME.
- Do not add, drop or soften any meaning, warning or deadline.
Return ONLY a JSON object with exactly the same keys and the translated strings as values.

${JSON.stringify(map)}`;
    pending[lk] = sampler.json(prompt, { modelTier: 'default', cache: { gcTime: 86400000 } }).then((res) => {
      const out = {}; if (res && typeof res === 'object') Object.keys(map).forEach((k) => { if (typeof res[k] === 'string' && res[k].trim()) out[k] = res[k]; });
      if (Object.keys(out).length) { lsSet(lk, out); store(out); return true; } return false;
    }).catch(() => false).finally(() => { delete pending[lk]; trPill(); });
    trPill();
    return pending[lk];
  }
  function trPill() {
    let el = document.getElementById('trpill'); const n = Object.keys(pending).length;
    if (!el) { el = document.createElement('div'); el.id = 'trpill'; el.className = 'trpill'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.hidden = !(n && LANG !== 'en'); if (n && LANG !== 'en') el.textContent = T('trans', { l: LMETA[LANG].native });
  }
  /* X(): any fixed English text on screen. Missing translations are collected while rendering and fetched together afterwards. */
  let XMAP = {}; let XLANG = null; const XQ = new Set(); const xFail = {}; const xFly = new Set();
  const XKEY = () => 'er_x_' + LANG + '_' + KB.version;
  function X(en) {
    if (LANG === 'en' || !en) return en;
    if (XLANG !== LANG) { XLANG = LANG; XMAP = lsGet(XKEY()) || {}; }
    const t = XMAP[en]; if (t) return t;
    if (!xFail[LANG + '|' + en] && !xFly.has(LANG + '|' + en)) XQ.add(en);
    return en;
  }
  const hashStr = (str) => { let h = 5381; for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
  function xFlush() {
    if (LANG === 'en' || !XQ.size) return;
    const all = [...XQ]; XQ.clear(); const L0 = LANG; all.forEach((t) => xFly.add(L0 + '|' + t));
    const batches = []; let cur = []; let chars = 0;
    for (const t of all) { if (cur.length >= 90 || chars + t.length > 12000) { batches.push(cur); cur = []; chars = 0; } cur.push(t); chars += t.length; }
    if (cur.length) batches.push(cur);
    batches.forEach((b) => {
      const map = {}; b.forEach((t, i) => { map['x' + i] = t; });
      translateMap(map, 'x:' + hashStr(b.join('\u0001')), (o) => {
        if (LANG !== L0) return;
        if (XLANG !== LANG) { XLANG = LANG; XMAP = lsGet(XKEY()) || {}; }
        Object.keys(o).forEach((k) => { if (map[k]) XMAP[map[k]] = o[k]; }); lsSet(XKEY(), XMAP);
      }).then((ok) => { b.forEach((t) => xFly.delete(L0 + '|' + t)); if (!ok) b.forEach((t) => { xFail[L0 + '|' + t] = 1; setTimeout(() => { delete xFail[L0 + '|' + t]; }, 60000); }); else if (LANG === L0) safeRender(); });
    });
  }
  let srT = null;
  function safeRender() {
    clearTimeout(srT);
    const a = document.activeElement;
    if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && a.type !== 'radio' && a.type !== 'checkbox') { srT = setTimeout(safeRender, 1200); return; }
    if (document.querySelector('.overlay')) { srT = setTimeout(safeRender, 1200); return; }
    const now = Date.now(); if (now - (safeRender.last || 0) < 250) { srT = setTimeout(safeRender, 260); return; }
    safeRender.last = now;
    const y = window.scrollY; render(); window.scrollTo(0, y);
  }
  /* Start whatever translations the current screen needs, without blocking it. */
  function autoTranslate(view, arg) {
    if (LANG === 'en') return;
    const bg = (p) => Promise.resolve(p).then((ok) => { if (ok) safeRender(); });
    if (!uiReady(LANG)) bg(ensureUI());
    if ((view === 'home' || view === '') && !RT.tr[LANG + '|home']) bg(ensureHome());
    if (view === 'cat' && CAT[arg] && !RT.tr[LANG + '|c:' + arg]) bg(ensureCat(arg));
    if (view === 'start' && BY_ID[arg]) { const i = BY_ID[arg]; if (!RT.tr[LANG + '|g:' + i.id + ':a']) bg(ensureGuide(i, 'a')); }
    if (S.issueId && /^(quiz|list|brk|urgent|answers|timeline|report)$/.test(view)) {
      const i = issue();
      if (i && !RT.tr[LANG + '|g:' + i.id + ':a']) bg(ensureGuide(i, 'a'));
      if (i && !RT.tr[LANG + '|g:' + i.id + ':b']) bg(ensureGuide(i, 'b'));
    }
    setTimeout(xFlush, 30);
  }
  const ensureUI = () => (uiReady(LANG) ? Promise.resolve(true) : translateMap(Object.fromEntries(I18N.KEYS.map((k, i) => [k, I18N.STRINGS.en[i]])), 'ui', (o) => { RT.ui[LANG] = o; }));
  function guideChunks(iss) {
    const a = { s: iss.short, t: iss.title, i: iss.intro };
    iss.questions.forEach((q) => { a[q.id + '.t'] = q.text; a[q.id + '.w'] = q.why; q.options.forEach((o) => { a[q.id + '.' + o.id] = o.label; }); });
    const b = {};
    iss.evidence.forEach((e) => { b[e.id + '.n'] = e.name; b[e.id + '.y'] = e.why; if (e.where) b[e.id + '.wh'] = e.where; if (e.preserve) b[e.id + '.p'] = e.preserve; if (e.time) b[e.id + '.tm'] = e.time; if (e.limit) b[e.id + '.l'] = e.limit; });
    (iss.urgent || []).forEach((u) => { b[u.id + '.t'] = u.title; b[u.id + '.x'] = u.text; });
    (iss.info || []).forEach((x, i) => { b['info' + i] = x.text; });
    (iss.stand || []).forEach((x, i) => { b['st' + i] = x.text; });
    return { a, b };
  }
  function ensureGuide(iss, part) {
    if (LANG === 'en') return Promise.resolve(true);
    const key = 'g:' + iss.id + ':' + part; if (RT.tr[LANG + '|' + key]) return Promise.resolve(true);
    return translateMap(guideChunks(iss)[part], key, (o) => { RT.tr[LANG + '|' + key] = o; });
  }
  function ensureCat(cid) {
    if (LANG === 'en') return Promise.resolve(true);
    const key = 'c:' + cid; if (RT.tr[LANG + '|' + key]) return Promise.resolve(true);
    const map = {}; BUILT.filter((i) => i.cat === cid || (i.also || []).includes(cid)).forEach((i) => { map[i.id + '.s'] = i.short; map[i.id + '.t'] = i.title; });
    KB.directory.forEach((d, idx) => { if (d.cat === cid) map['d' + idx] = d.title; });
    return translateMap(map, key, (o) => { RT.tr[LANG + '|' + key] = o; });
  }
  const C = (cid, key, en) => trGet('c:' + cid, key, en);
  const translated = () => LANG !== 'en';
  const canTranslate = () => LANG === 'en' || !!sampler || !apiOff || !!window.Translator;
  let busy = null;  // { label } while a translation is loading
  function withTranslation(promises, then) {
    // Never block the screen on translation: show it now, swap in the translation when it arrives.
    promises.forEach((p) => Promise.resolve(typeof p === 'function' ? p() : p).then((ok) => { if (ok) safeRender(); }));
    then();
  }
  function setLang(code) {
    LANG = code; lsSet('er_lang', code); applyLangDom(); TRACK.ev('lang', { x: code });
    render();
  }
  function trNote() { return translated() ? `<p class="trnote">${ic('globe', 16)} ${esc(trFailed[LANG] && !Object.keys(pending).length ? T('enonly') : T('auto'))} <button class="btn text" data-act="toen">${esc(T('en'))}</button></p>` : ''; }

  /* ---------- routing ---------- */
  function go(v) { if (location.hash === '#' + v) render(); else location.hash = v; }
  const goQuiz = () => go('quiz-' + S.history.length);
  /* Browser/phone Back inside the questions: '#quiz-k' means "k answers given"; going back undoes later answers. */
  function syncQuiz(arg) {
    const k = Number(arg); if (arg === '' || Number.isNaN(k) || !S.issueId) return;
    let changed = false;
    while (S.history.length > k) { const last = S.history.pop(); S.prefill[last.id] = S.answers[last.id]; delete S.answers[last.id]; delete S.skipped[last.id]; S.stage = last.stage; changed = true; }
    if (changed) { if (S.stage === 'quick') S.quickDone = false; else S.deepDone = false; E.prune(issue(), S.answers); persist(); }
  }
  window.addEventListener('hashchange', render);

  function shell(inner, opt = {}) {
    const sensitive = !!(issue() && issue().sensitive && opt.inJourney);
    document.body.classList.toggle('calm', sensitive);
    return `<header class="top"><div class="wrap">
        <button class="brand" data-go="home" aria-label="Pehlo home"><img class="blogo" src="${window.ER_BRAND.logo}" alt="Pehlo" width="132" height="49"></button>
        <button class="nav navq" data-go="questions" aria-label="${esc(T('q'))}">${ic('q', 18)}<span class="lbl-long">${esc(T('q').replace(/\?$/, ''))}</span></button>
        <button class="nav" data-go="help">${ic('phone', 18)}<span class="lbl-long">${esc(T('help').replace(/\?$/, ''))}</span><span class="lbl-short">${esc(H('nav_help', 'Help'))}</span></button>
        <button class="nav lang" data-act="lang" aria-label="Language: ${esc(LMETA[LANG].name)}. Change language">${ic('globe', 18)}<span>${esc(LMETA[LANG].native)}</span></button>
        ${sensitive ? `<a class="nav exit" data-act="exit" href="https://www.google.com" target="_blank" rel="noopener noreferrer" title="Clears this page and opens a neutral website">${ic('x', 18)}<span>Exit</span></a>` : ''}
      </div></header>
      <main id="main" tabindex="-1">${inner}</main>
      ${opt.tray ? trayHTML() : ''}
      ${opt.noFooter ? '' : opt.inJourney ? slimFooter() : footer()}`;
  }
  const FOOT = {"f_disc": "Pehlo helps you prepare for a meeting with an advocate. It is not legal advice, does not replace an advocate, and cannot tell you whether a court will accept any document.", "f_about": "How this works & privacy", "f_adv": "For advocates", "f_myth": "Myth or fact", "f_help": "Legal aid & urgent help", "f_clear": "Clear my answers"};
  function slimFooter() {
    return `<footer class="foot slim"><div class="wrap"><span class="small muted">${esc(T('draft'))} · ${esc(X('Not legal advice'))}</span><span class="row"><button data-go="help">${esc(H('nav_help', 'Help'))}</button><button data-go="about">${esc(H('f_about', FOOT.f_about))}</button>${S.issueId ? `<button data-act="clear">${esc(H('f_clear', FOOT.f_clear))}</button>` : ''}</span></div></footer>`;
  }
  function footer() {
    const f = (k) => esc(H(k, FOOT[k]));
    return `<footer class="foot"><div class="wrap">
      <img class="flogo" src="${window.ER_BRAND.logoFull}" alt="Pehlo — Samajh. Tayyari. Apna Haq." width="210" height="96">
      <p><span class="tag draft">${esc(T('draft'))}</span></p>
      <p style="max-width:62em">${f('f_disc')} v${esc(KB.version)}.</p>
      <div class="row"><button data-go="about">${f('f_about')}</button><button data-go="advocates">${f('f_adv')}</button><button data-go="myths">${f('f_myth')}</button><button data-go="help">${f('f_help')}</button>${S.issueId ? `<button data-act="clear">${f('f_clear')}</button>` : ''}${/^https?:$/.test(location.protocol) && !/claude|anthropic/.test(location.hostname) ? `<a class="flink" href="/guide">${esc(X('All guides'))}</a><a class="flink" href="/privacy">${esc(X('Privacy'))}</a><a class="flink" href="/terms">${esc(X('Terms'))}</a>` : ''}</div>
      <p class="small muted" style="margin:8px 0 0">${esc(X('Law last checked {d} against official sources.').replace('{d}', new Date((KB.lawChecked || '2026-10-30') + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })))}</p>
      ${/^https?:$/.test(location.protocol) && !/claude|anthropic/.test(location.hostname) && /^#?(home)?$/.test(location.hash) ? '<a class="adminlink" href="/admin" rel="nofollow">Admin</a>' : ''}
    </div></footer>`;
  }

  function render() {
    const raw = (location.hash || '').slice(1);
    if (raw.startsWith('a-')) { applyAdvLink(raw); return; }
    const [view, ...rest] = raw.split('-'); const arg = rest.join('-');
    const need = (fn) => (S.issueId ? fn() : viewHome());
    const map = {
      cat: () => viewCat(arg),
      start: () => viewIntro(arg), topic: () => viewIntro('general', KB.directory[Number(arg)]),
      quiz: () => need(() => { syncQuiz(arg); return viewQuiz(); }), brk: () => need(viewList), urgent: () => need(viewUrgent), list: () => need(viewList),
      answers: () => need(viewAnswers), timeline: () => need(viewTimeline), report: () => need(viewReport),
      questions: () => viewQuestions(), q: () => viewQuestions(arg), myths: () => viewMyths(), advocates: () => viewAdvocates(), help: () => viewHelp(), about: () => viewAbout()
    };
    app.innerHTML = busy ? viewBusy() : (map[view] || (() => viewHome()))();
    const h = app.querySelector('h1');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    try { trackRender(); } catch (e) { /* never break the app for analytics */ }
    try { autoTranslate(view || 'home', arg); } catch (e) { /* translation is best-effort */ }
    if (view === 'q') document.getElementById('qa-' + arg)?.scrollIntoView();
    else window.scrollTo(0, 0);
    afterRender(view);
  }

  /* ============ HOME ============ */
  const SUGGEST = ['Cheque bounced', 'Money stolen online', 'Leaked photos', 'Instagram hacked', '"Digital arrest" call', 'Divorce', 'Online order not delivered', 'Internship not paid', 'Flight refund', 'Wrong challan', 'Legal heir certificate', 'Rent deposit not returned'];
  const TOP_LANGS = ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'ur', 'gu', 'kn', 'or', 'ml', 'pa'];
  const catTitle = (c) => T('c_' + c.id) || c.title;
  function problemRows(cid) {
    const deep = BUILT.filter((i) => i.cat === cid).concat(BUILT.filter((i) => i.cat !== cid && (i.also || []).includes(cid)));
    const gen = KB.directory.map((d, idx) => ({ ...d, idx })).filter((d) => d.cat === cid);
    return deep.map((i) => `<button class="prob" data-play="${i.id}"><b>${esc(C(cid, i.id + '.s', i.short))}</b><span>${esc(C(cid, i.id + '.t', i.title))}</span>${ic('chev', 22)}</button>`).join('')
      + gen.map((d) => `<button class="prob" data-play="general" data-topic="${d.idx}"><b>${esc(C(cid, 'd' + d.idx, d.title))}</b><span>${esc(T('basic'))}</span>${ic('chev', 22)}</button>`).join('');
  }
  const H = (k, en) => { if (LANG === 'en') return en; const m = RT.tr[LANG + '|home']; return (m && m[k]) || X(en); };
  const HERO = { nav_help: 'Help', hero_h: 'Legal preparation made simple for every Indian', hero_s1: 'Ask. Understand. Prepare.', hero_s2: 'All in your language.', hero_go: 'Get Started', hero_f: 'Free • Simple • Multilingual', tagline: 'Samajh. Tayyari. Apna Haq.', f1: 'Ask', f1s: 'In your language', f2: 'Prepare', f2s: 'Step by step', f3: 'Organize', f3s: 'Your evidence', f4: 'Be Ready', f4s: 'With confidence' };
  function ensureHome() {
    if (LANG === 'en' || RT.tr[LANG + '|home']) return Promise.resolve(true);
    const map = {}; KB.categories.forEach((c) => { map['b_' + c.id] = c.blurb; }); SUGGEST.forEach((x, i) => { map['s' + i] = x; }); Object.assign(map, FOOT, HERO); delete map.tagline; [['f1', 'Ask'], ['f1s', 'In your language'], ['f2', 'Prepare'], ['f2s', 'Step by step'], ['f3', 'Organize'], ['f3s', 'Your evidence'], ['f4', 'Be Ready'], ['f4s', 'With confidence']].forEach(([k, v]) => { map[k] = v; });
    return translateMap(map, 'home5', (o) => { RT.tr[LANG + '|home'] = o; });
  }
  function viewHome() {
    const saved = !S.issueId && loadSaved();
    const FEAT = [['chat', 'f1', 'Ask', 'f1s', 'In your language', 'sage'], ['file', 'f2', 'Prepare', 'f2s', 'Step by step', 'sky'], ['folder', 'f3', 'Organize', 'f3s', 'Your evidence', 'sand'], ['circlecheck', 'f4', 'Be Ready', 'f4s', 'With confidence', 'rose']];
    return shell(`<section class="hero2"><div class="wrap hero2in">
        <div class="hcopy">
          <h1>${esc(H('hero_h', HERO.hero_h))}</h1>
          <p class="lead">${esc(H('hero_s1', HERO.hero_s1))}<br>${esc(H('hero_s2', HERO.hero_s2))}</p>
          <button class="langsel" data-act="lang">${ic('globe', 22)}<span>${esc(LMETA[LANG].native)}</span>${ic('down', 20)}</button>
          <button class="getstarted" data-act="getstarted">${esc(H('hero_go', HERO.hero_go))} ${ic('arrow', 20)}</button>
          <p class="fsm">${esc(H('hero_f', HERO.hero_f))}</p>
        </div>
        <div class="hart"><img src="${window.ER_BRAND.hero}" alt="" width="872" height="1320"></div>
      </div></section>
      <section class="feats"><div class="wrap featsin">${FEAT.map(([icn, k, en, ks, ens, tone]) => `<div class="feat"><span class="fic ${tone}">${ic(icn, 30)}</span><div><b>${esc(H(k, en))}</b><span>${esc(H(ks, ens))}</span></div></div>`).join('')}</div></section>
      <div class="wrap home" id="start">
        <div class="searchbox" role="search">
          <label class="sr" for="matter">${esc(T('search'))}</label>
          ${ic('search', 22)}<input id="matter" type="search" autocomplete="off" placeholder="${esc(T('search'))}">
        </div>
        <div id="results" class="results" aria-live="polite"></div>
        <div class="suggest" id="suggest">${SUGGEST.map((x, i) => `<button class="slipchip" data-ex="${esc(x)}">${esc(H('s' + i, x))}</button>`).join('')}</div>
      ${saved && saved.issueId ? `<div class="banner info" style="margin-top:18px">${ic('folder')}<div><h3>${esc(T('listh'))}</h3><p>${esc((BY_ID[saved.issueId] || {}).short || '')}. <button class="btn text" data-act="resume">${esc(T('seelist'))}</button> <button class="btn text" data-act="forget">${esc(T('delall'))}</button></p></div></div>` : ''}
      <section aria-labelledby="areah">
        <h2 id="areah">${esc(T('area'))}</h2>
        <div class="tiles">${KB.categories.map((c) => `<button class="tile" data-go="cat-${c.id}"><span class="tic">${ic(c.icon, 26)}</span><b>${esc(catTitle(c))}</b><span>${esc(H('b_' + c.id, c.blurb))}</span></button>`).join('')}
          <button class="tile" data-play="general"><span class="tic">${ic('q', 26)}</span><b>${esc(T('notsure'))}</b><span>${esc(T('notsure_s'))}</span></button></div>
      </section>
      <section class="minirow">
        <button class="mini" data-go="questions">${ic('q', 22)}<span><b>${esc(T('q'))}</b>${esc(T('q_s'))}</span></button>
        <button class="mini" data-go="myths">${ic('check', 22)}<span><b>${esc(T('myth'))}</b>${esc(T('myth_s'))}</span></button>
        <button class="mini" data-go="help">${ic('phone', 22)}<span><b>${esc(T('help'))}</b>${esc(T('help_s'))}</span></button>
      </section>
    </div>`);
  }
  function viewCat(cid) {
    const c = CAT[cid]; if (!c) return viewHome();
    return shell(`<div class="wrap narrow" style="padding-top:18px;padding-bottom:40px">
      <button class="btn text" data-go="home">${ic('back', 20)} ${esc(T('home'))}</button>
      <h1 class="pageh"><span class="tic big">${ic(c.icon, 30)}</span>${esc(catTitle(c))}</h1>
      <p class="lead" style="margin:6px 0 16px">${esc(T('whathap'))}</p>
      ${trNote()}
      <div class="probs">${problemRows(cid)}<button class="prob" data-play="general"><b>${esc(T('else'))}</b><span>${esc(T('basic'))}</span>${ic('chev', 22)}</button></div>
    </div>`);
  }
  function viewBusy() {
    return shell(`<div class="wrap narrow busy" role="status" aria-live="polite"><div class="spinner" aria-hidden="true"></div><h1>${esc(busy.label)}</h1><p class="muted">${esc(T('auto'))}</p></div>`, { noFooter: true });
  }
  function searchAll(q) {
    const stop = ['the', 'and', 'has', 'have', 'been', 'not', 'was', 'with', 'from', 'that', 'this', 'someone', 'what', 'about', 'my', 'me', 'is', 'are', 'did', 'got', 'for'];
    const words = q.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter((w) => w.length > 2 && !stop.includes(w));
    if (!words.length) return [];
    const ql = q.toLowerCase();
    const score = (t, syn) => { const toks = (t + ' ' + syn.join(' ')).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean); const has = (w) => toks.some((k) => k.startsWith(w)); let s = 0; words.forEach((w) => { if (has(w)) s += 2; else if (w.length > 4 && has(w.slice(0, -1))) s += 1; }); syn.forEach((x) => { if (ql.includes(x)) s += 4; }); return s; };
    const res = [];
    BUILT.forEach((i) => { const s = score(i.title + ' ' + i.short, i.synonyms); if (s) res.push({ s: s + 1, play: i.id, title: i.short }); });
    KB.directory.forEach((d, idx) => { const s = score(d.title, d.synonyms); if (s) res.push({ s, play: 'general', topic: idx, title: d.title }); });
    KB.questions.forEach((x) => { const s = score(x.q, x.kw); if (s > 2) res.push({ s: s - 1, go: 'q-' + x.id, title: x.q, kind: 'Answer' }); });
    return res.sort((a, b) => b.s - a.s).slice(0, 6);
  }
  function renderResults(q) {
    const box = document.getElementById('results'); if (!box) return;
    document.getElementById('suggest').hidden = !!q.trim();
    if (!q.trim()) { box.innerHTML = ''; return; }
    const r = searchAll(q);
    box.innerHTML = r.length ? r.map((x) => `<button class="prob" ${x.play ? `data-play="${x.play}" ${x.topic != null ? `data-topic="${x.topic}"` : ''}` : `data-go="${x.go}"`}><b>${esc(x.title)}</b><span>${x.play ? 'Start' : 'Read the answer'}</span>${ic('chev', 22)}</button>`).join('')
      : `<button class="prob" data-play="general"><b>${esc(X('Not sure what this is?'))}</b><span>${esc(X('Answer a few simple questions'))}</span>${ic('chev', 22)}</button>`;
  }

  /* ============ INTRO ============ */
  function startIssue(id, topic) { const keep = S.adv && S.adv.issueId === id ? S.adv : null; S = blank(); S.issueId = id; S.topic = topic || null; S.adv = keep; persist(); }
  function viewIntro(id, topic) {
    const iss = BY_ID[id]; if (!iss) return viewHome();
    const qs = E.stageQuestions(iss, {}, 'quick');
    const chaps = [...new Set(iss.questions.map(chapOf))];
    const adv = S.adv && S.adv.issueId === id ? S.adv : null;
    return shell(`<div class="wrap narrow"><section style="padding:20px 0 40px">
      <button class="btn text" data-go="${topic ? 'cat-' + topic.cat : 'cat-' + iss.cat}">${ic('back', 18)} ${esc(X('Back to the shelf'))}</button>
      ${adv ? advBanner(adv) : ''}
      <div class="filehead"><span class="tape" aria-hidden="true"></span><p class="typed">${esc(X('In the matter of:'))}</p><h1>${esc(topic ? X(topic.title) : G(iss, 's', iss.short))}</h1></div>
      ${topic && topic.urgentNote ? `<div class="banner soon">${ic('alert')}<div><h3>${esc(X('Before you start'))}</h3><p>${esc(X(topic.urgentNote))}</p></div></div>` : ''}
      <p class="lead">${esc(G(iss, 'i', iss.intro))}</p>
      <div class="panel">
        <h3>${esc(X('{c} chapters, about {q} quick questions to start').replace('{c}', chaps.length).replace('{q}', qs.length))}</h3>
        <p class="muted small" style="margin:6px 0 0">${chaps.map((c) => esc(X(c))).join(' → ')}</p>
        <p class="small" style="margin:10px 0 0">${esc(X('Your first list appears after the quick round. You can go deeper after that, or stop.'))}</p>
      </div>
      <p class="small muted" style="margin-top:14px"><span class="tag draft">${esc(X(KB.reviewed.label))}</span> ${esc(X(iss.juris))}</p>
      ${srcBlock(iss)}
      <div class="row" style="margin-top:18px"><button class="btn go" data-act="begin" data-id="${iss.id}" ${topic ? `data-topic="${KB.directory.indexOf(topic)}"` : ''}>${esc(X('Open my file'))}</button><span class="small muted">${ic('lock', 14)} ${esc(X('Skip any question. Stop any time.'))}</span></div>
    </section></div>`);
  }
  function advBanner(adv) {
    return `<div class="banner adv">${ic('user')}<div><h3>${adv.name ? esc(adv.name) + ' asked you to prepare' : 'Your advocate asked you to prepare'}</h3>${adv.note ? `<p>“${esc(adv.note)}”</p>` : ''}${adv.must && adv.must.length ? '<p class="small">Records they want are marked <span class="tag adv">Advocate asked</span>.</p>' : ''}</div></div>`;
  }

  /* ============ QUESTIONS ============ */
  const currentQ = () => E.nextQuestion(issue(), S.answers, S.stage, S.skipped);
  function trayHTML() {
    const n = E.evidence(issue(), S.answers).length;
    return `<div class="tray noprint"><div class="wrap"><div class="trayin" id="tray"><span class="count" id="traycount">${n}</span><span class="lbl">${esc(T('onlist'))}</span><button class="btn" data-act="showlist">${esc(T('seelist'))}</button></div></div></div>`;
  }
  function viewQuiz() {
    const iss = issue(); const q = currentQ();
    if (!q) { finishStage(); return viewList(); }
    const pr = E.progress(iss, S.answers, S.stage, S.skipped);
    const pct = Math.round((pr.done / Math.max(pr.total, 1)) * 100);
    const cur = S.answers[q.id] != null ? [].concat(S.answers[q.id])[0] : [].concat((S.prefill || {})[q.id] || [])[0];
    const urg = E.urgent(iss, S.answers).filter((u) => u.level !== 'info');
    const first = S.stage === 'quick' && pr.done === 0;
    return shell(`<div class="wrap narrow qwrap">
      <div class="qtop"><button class="btn text" data-act="${S.history.length ? 'qback' : 'quit'}">${ic('back', 20)} ${esc(T('back'))}</button><span class="ptitle">${esc(S.topic ? S.topic.title : G(iss, 's', iss.short))}</span></div>
      <div class="barrow"><div class="bar" role="progressbar" aria-label="Progress" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${Math.max(pct, 4)}%"></span></div><span class="qcount">${pr.done + 1}/${Math.max(pr.total, pr.done + 1)}</span></div>
      ${first ? `${trNote()}<p class="opener">${esc(G(iss, 'i', iss.intro))}</p>${S.topic && S.topic.urgentNote ? `<div class="banner soon">${ic('alert')}<div><p>${esc(S.topic.urgentNote)}</p></div></div>` : ''}${S.adv && S.adv.issueId === iss.id ? advBanner(S.adv) : ''}` : ''}
      ${urg.map((u) => urgentBanner(u, iss)).join('')}
      <form id="qform" data-q="${q.id}">
        <fieldset><legend><h1 class="qtext">${esc(G(iss, q.id + '.t', q.text))}</h1></legend>
          <div class="opts">${q.options.map((o) => `<label class="opt"><input type="radio" name="a" value="${o.id}" ${cur === o.id ? 'checked data-pre="1"' : ''}><span class="dot" aria-hidden="true"></span><span>${esc(G(iss, q.id + '.' + o.id, o.label))}</span></label>`).join('')}</div>
        </fieldset>
      </form>
      <details class="why"><summary>${esc(T('why'))}</summary><p>${esc(G(iss, q.id + '.w', q.why))}</p></details>
      <p style="margin-top:14px"><button class="btn text" data-act="skip">${esc(T('skip'))}</button></p>
    </div>`, { inJourney: true });
  }
  function urgentBanner(u, iss) {
    iss = iss || issue();
    const help = (u.help || []).map((h) => KB.help[h]).filter(Boolean);
    return `<div class="banner ${u.level}" role="${u.level === 'now' ? 'alert' : 'note'}">${ic(u.level === 'info' ? 'info' : 'alert')}<div><h3>${esc(G(iss, u.id + '.t', u.title))}</h3><p>${esc(G(iss, u.id + '.x', u.text))}</p>${help.length ? `<p class="small" style="margin-top:6px">${help.map((h) => `<b>${esc(h.label)}</b> ${esc(X(h.name))}`).join(' | ')}</p>` : ''}</div></div>`;
  }
  function answer(q, val) {
    const iss = issue();
    const beforeEv = new Set(E.evidence(iss, S.answers).map((e) => e.id));
    const beforeUrg = new Set(E.urgent(iss, S.answers).map((u) => u.id));
    S.history.push({ id: q.id, stage: S.stage });
    S.answers[q.id] = val; delete S.skipped[q.id];
    E.prune(iss, S.answers).forEach((id) => { S.history = S.history.filter((h) => h.id !== id); });
    const added = E.evidence(iss, S.answers).filter((e) => !beforeEv.has(e.id));
    persist();
    const newNow = E.urgent(iss, S.answers).find((u) => u.level === 'now' && !beforeUrg.has(u.id) && !S.ackUrgent[u.id]);
    if (newNow) { S.pendingUrgent = newNow.id; go('urgent'); return; }
    nextAfter(q);
  }
  function nextAfter() {
    if (!currentQ()) { finishStage(); go('list'); return; }
    goQuiz();
  }
  function finishStage() { if (S.stage === 'quick') S.quickDone = true; else S.deepDone = true; persist(); }

  function viewUrgent() {
    const iss = issue(); const u = (iss.urgent || []).find((x) => x.id === S.pendingUrgent);
    if (!u) return viewQuiz();
    const help = (u.help || []).map((h) => KB.help[h]).filter(Boolean);
    return shell(`<div class="wrap narrow" style="padding:26px 0 60px">
      <div class="banner now" role="alert">${ic('alert', 24)}<div><h1 style="font-size:clamp(24px,4vw,32px);margin:0 0 6px">${esc(u.title)}</h1><p>${esc(u.text)}</p></div></div>
      <div class="grid" style="margin:16px 0">${help.map(helpCard).join('')}</div>
      <p class="muted">${esc(X('Your answers are kept on this page. Come back and finish when you can.'))}</p>
      <div class="row"><button class="btn go" data-act="ackurgent">Continue</button></div>
    </div>`, { inJourney: true });
  }
  function helpCard(h) {
    return `<div class="helpcard">${/^\d{3,6}$/.test(h.label) ? `<a class="helpnum" href="tel:${esc(h.label)}" aria-label="Call ${esc(h.label)}">${esc(h.label)}</a>` : `<span class="helpnum">${esc(h.label)}</span>`}<div><h3>${esc(X(h.name))}</h3><p class="small muted" style="margin:2px 0 0">${esc(X(h.detail))}</p>${h.href ? `<a class="small" href="${esc(h.href)}" target="_blank" rel="noopener">${esc(h.href.replace('https://', ''))}</a>` : ''}</div></div>`;
  }

  /* ============ THE LIST: papers to carry ============ */
  const STATUSES = () => [['have', T('s_have')], ['find', T('s_find')], ['others', T('s_others')], ['na', T('s_na')]];
  const ACTION_ST = () => [['have', T('s_done')], ['find', T('s_notdone')], ['na', T('s_na')]];
  function viewList() {
    const iss = issue();
    const items = E.evidence(iss, S.answers);
    const must = new Set((S.adv && S.adv.issueId === iss.id && S.adv.must) || []);
    const order = (a, b) => (must.has(b.id) - must.has(a.id)) || ((!!b.time) - (!!a.time));
    const papers = items.filter((e) => !e.action).sort(order);
    const steps = items.filter((e) => e.action).sort(order);
    const have = papers.filter((e) => S.status[e.id] === 'have').length;
    const urg = E.urgent(iss, S.answers); const infos = E.info(iss, S.answers);
    const quickLeft = E.nextQuestion(iss, S.answers, 'quick', S.skipped);
    if (quickLeft) return viewQuiz();
    const deepLeft = E.nextQuestion(iss, S.answers, 'deep', S.skipped);
    const deepN = E.stageQuestions(iss, S.answers, 'deep').filter((q) => S.answers[q.id] == null && !S.skipped[q.id]).length;
    return shell(`<div class="wrap narrow" style="padding-top:14px;padding-bottom:30px">
      <button class="btn text noprint" data-go="home">${ic('back', 20)} ${esc(T('home'))}</button>
      ${S.adv && S.adv.issueId === iss.id ? advBanner(S.adv) : ''}
      <div class="carryhead"><p class="typed">${esc(S.topic ? S.topic.title : G(iss, 's', iss.short))}</p><h1>${esc(T('carry'))}</h1>
        <p class="fh">${esc(T('tickhave'))} <b>${have}/${papers.length}</b></p></div>
      ${trNote()}
      ${urg.map((u) => urgentBanner(u, iss)).join('')}
      ${steps.length ? `<h2 class="lh">${esc(T('dofirst'))}</h2><div class="checks">${steps.map((e) => checkRow(e, iss, must.has(e.id))).join('')}</div>` : ''}
      <h2 class="lh">${esc(T('papers'))} <span class="muted small">(${papers.length})</span></h2>
      <div class="checks" id="evlist">${papers.map((e) => checkRow(e, iss, must.has(e.id))).join('')}</div>
      <p class="muted small" style="margin-top:10px">${esc(T('worry'))}</p>
      ${infos.map((x) => `<div class="banner info">${ic('info')}<div><p>${esc(G(iss, 'info' + iss.info.indexOf(x), x.text))}</p></div></div>`).join('')}
      ${standCard(iss, papers, have)}
      ${srcBlock(iss)}
      <div class="fbk noprint" id="fbk">${UI.fb && UI.fb[iss.id] ? `<p class="small muted">${ic('check', 16)} ${esc(X('Thanks — that helps us improve this guide.'))}</p>` : `<span>${esc(X('Was this list useful?'))}</span><button class="btn line sm" data-act="fb" data-v="y">${esc(X('Yes'))}</button><button class="btn line sm" data-act="fb" data-v="n">${esc(X('Not really'))}</button>`}</div>
      <div class="actbar noprint"><button class="btn go" data-act="print">${ic('file', 18)} ${esc(T('print'))}</button><button class="btn line" data-go="report">${esc(T('makepage'))}</button></div>
      ${deepLeft ? `<button class="deeper noprint" data-act="deep"><span><b>${esc(T('better'))}</b>${esc(T('more', { n: deepN }))}</span>${ic('chev', 24)}</button>` : ''}
      <div class="panel noprint">
        <div class="row dupact"><button class="btn go big" data-act="print">${ic('file', 20)} ${esc(T('print'))}</button><button class="btn line" data-go="report">${esc(T('makepage'))}</button></div>
        <p class="small muted" id="printhint" hidden style="margin:6px 0 0">Browser menu → Print, or Ctrl+P.</p>
        <hr style="border:0;border-top:1px solid var(--line);margin:16px 0">
        <label class="check"><input type="checkbox" data-act="savetoggle" ${saveOn ? 'checked' : ''}> ${esc(T('save'))}</label>
        <div class="row" style="margin-top:6px"><button class="btn text" data-go="answers">${esc(T('change'))}</button><button class="btn text" data-act="clear">${esc(T('delall'))}</button></div>
      </div>
    </div>`, { inJourney: true });
  }
  function checkRow(e, iss, flagged) {
    const on = S.status[e.id] === 'have'; const g = (k, en) => G(iss, e.id + k, en);
    const more = [e.where && g('.wh', e.where), e.preserve && g('.p', e.preserve), e.limit && g('.l', e.limit)].filter(Boolean);
    return `<div class="crow ${on ? 'on' : ''} ${e.action ? 'act' : ''}" id="ev-${e.id}">
      <button class="cbox" data-status="have" data-ev="${e.id}" role="checkbox" aria-checked="${on}" aria-label="${esc(g('.n', e.name))}">${on ? ic('check', 18) : ''}</button>
      <div class="cbody"><h3>${flagged ? '★ ' : ''}${esc(g('.n', e.name))}</h3>
        <p class="w">${esc(g('.y', e.why))}</p>
        ${e.time ? `<p class="ctime">${ic('alert', 15)} ${esc(g('.tm', e.time))}</p>` : ''}
        <details class="noprint"><summary>${esc(T('where'))}</summary><p class="wm">${esc(g('.y', e.why))}</p>${more.map((m) => `<p>${esc(m)}</p>`).join('')}</details>
      </div></div>`;
  }
  function evCard(e, flagged, iss) { return checkRow(e, iss || issue(), flagged); }
  function viewAnswers() {
    const iss = issue(); const qs = iss.questions.filter((q) => S.answers[q.id] != null || S.skipped[q.id]);
    return shell(`<div class="wrap narrow" style="padding:20px 0 40px"><button class="btn text" data-go="list">${ic('back', 18)} ${esc(T('listh'))}</button>
      <h1 style="font-size:clamp(28px,5vw,42px);margin:8px 0 10px">${esc(X('Your answers'))}</h1>
      <p class="muted">${esc(X('Change any answer. Questions that depend on it will be asked again. Documents you named are kept.'))}</p>
      <div class="grid">${qs.map((q) => `<div class="helpcard" style="justify-content:space-between;align-items:center"><div><p class="small muted" style="margin:0">${esc(q.text)}</p><p style="margin:2px 0 0;font-weight:700">${S.skipped[q.id] ? '<span class="muted">Skipped</span>' : esc(answerText(q, S.answers[q.id]))}</p></div><button class="btn line" data-act="change" data-q="${q.id}">Change</button></div>`).join('') || '<p class="muted">' + esc(X('No answers yet.')) + '</p>'}</div>
    </div>`, { inJourney: true });
  }

  function viewTimeline() {
    const items = [...S.chrono].sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
    return shell(`<div class="wrap narrow" style="padding:20px 0 40px"><button class="btn text" data-go="list">${ic('back', 18)} ${esc(T('listh'))}</button>
      <h1 style="font-size:clamp(28px,5vw,42px);margin:8px 0 10px">${esc(X('Your timeline'))}</h1>
      <p class="muted">${esc(X('List the main events in your own words. Approximate dates are fine — mark them.'))}</p>
      ${items.length ? `<ol class="tl">${items.map((t) => `<li><div class="d">${t.date ? esc(fmtDate(t.date)) + (t.approx ? ' (approx.)' : '') : 'Date unknown'}</div><div>${esc(t.text)}</div><button class="btn text small" data-delchrono="${t.id}">Remove</button></li>`).join('')}</ol>` : '<p class="panel muted">' + esc(X('No events yet. Add the first one below.')) + '</p>'}
      <form class="panel" id="chronoform">
        <h2>${esc(X('Add an event'))}</h2>
        <div class="grid" style="grid-template-columns:1fr 1fr;align-items:end"><label class="f">Date<input class="t" type="date" name="date" max="${today()}"></label><label class="check"><input type="checkbox" name="approx"> Approximate</label></div>
        <label class="f" style="margin-top:10px">${esc(X('What happened?'))}<textarea class="t" name="text" rows="2" maxlength="300" required placeholder="e.g. Paid ₹40,000 deposit by UPI"></textarea></label>
        <p class="small muted">${esc(X('Stick to what happened. Leave out private details you don\'t need.'))}</p>
        <button class="btn go" type="submit">${esc(X('Add to timeline'))}</button>
      </form>
      <div class="row" style="margin-top:18px"><button class="btn go" data-go="report">${ic('file', 18)} Make my lawyer page</button></div>
    </div>`, { inJourney: true });
  }


  function srcBlock(iss) {
    if (!iss || !iss.sources || !iss.sources.length) return '';
    const d = iss.checked ? new Date(iss.checked + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    return `<details class="srcs"><summary>${ic('file', 14)} ${esc(X('Law checked {d} · {n} official sources').replace('{d}', d).replace('{n}', iss.sources.length))}</summary><ul>${iss.sources.map((x) => `<li><a href="${esc(x.u)}" target="_blank" rel="noopener">${esc(x.t)}</a></li>`).join('')}</ul><p class="small muted">${esc(X('Law changes. Confirm the current position with an advocate before you act.'))}</p></details>`;
  }
  function standCard(iss, items, have) {
    const st = E.stand(iss, S.answers);
    const rows = { good: [], risk: [], next: [] };
    st.forEach((x) => rows[x.k].push(G(iss, 'st' + x.idx, x.text)));
    if (have) rows.good.push(T('have', { a: have, b: items.length }));
    if (!rows.next.length) { const a = items.find((e) => e.action && S.status[e.id] !== 'have'); if (a) rows.next.push(G(iss, a.id + '.n', a.name)); }
    if (!rows.good.length && !rows.risk.length && !rows.next.length) return '';
    const sec = (k, icon) => rows[k].length ? `<div class="srow s-${k}"><span class="sic">${ic(icon, 18)}</span><div><b>${esc(T('k_' + k))}</b><ul>${rows[k].map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div></div>` : '';
    return `<section class="standcard" aria-labelledby="standh"><h2 id="standh">${esc(T('stand'))}</h2>${sec('good', 'check')}${sec('risk', 'alert')}${sec('next', 'chev')}</section>`;
  }
  /* ============ REPORT ============ */
  const INSTRUCTION = 'Arrange the documents in the order shown in this preparation report. Keep related pages together, preserve original records, and make clear, complete copies. Where appropriate, add dates and page numbers so your advocate can review the materials and determine how they should be presented as annexures or exhibits in court. The final order, numbering, certification, format, admissibility and filing requirements must be confirmed by your advocate and the relevant court.';
  function reportData() {
    const iss = issue(); const items = E.evidence(iss, S.answers);
    const shown = iss.questions.filter((q) => S.answers[q.id] != null && !(S.excludeSensitive && q.sensitive));
    const unresolved = iss.questions.filter((q) => E.applicable(q, S.answers) && (S.skipped[q.id] || (S.answers[q.id] && [].concat(S.answers[q.id]).includes('unsure'))));
    const by = (k) => items.filter((e) => (S.status[e.id] || '') === k);
    const annex = []; items.forEach((e) => { if (S.status[e.id] !== 'have' || e.action) return; const rs = S.records[e.id] || []; (rs.length ? rs : [{ label: e.name }]).forEach((r) => annex.push({ ...r, ev: e })); });
    return { iss, shown, unresolved, have: by('have').filter((e) => !e.action), others: by('others'), missing: items.filter((e) => ['find', 'unsure', ''].includes(S.status[e.id] || '') && !e.action),
      todo: items.filter((e) => e.action && !['have', 'na'].includes(S.status[e.id])), annex, urgent: E.urgent(iss, S.answers).filter((u) => u.level !== 'info'), lqs: E.lawyerQs(iss, S.answers),
      chrono: [...S.chrono].sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999')) };
  }
  function reportHTML(d) {
    const iss = d.iss; const li = (arr, f) => arr.length ? `<ul>${arr.map((x) => `<li>${f(x)}</li>`).join('')}</ul>` : '<p class="muted">None recorded.</p>';
    return `<p class="meta">Pehlo preparation pack. Prepared ${esc(fmtDate(today()))}. Content v${esc(KB.version)} (${esc(KB.reviewed.label)}).</p>
      <h1>Papers for my lawyer</h1><p><b>${esc(S.topic ? S.topic.title : iss.title)}</b></p>
      ${S.adv && S.adv.issueId === iss.id && S.adv.name ? `<p class="meta">Prepared at the request of ${esc(S.adv.name)}.</p>` : ''}
      ${d.urgent.length ? `<p class="instr" style="background:var(--tape-l)">Flagged for prompt attention: ${d.urgent.map((u) => esc(u.title)).join('; ')}.</p>` : ''}
      <h2>A. Matter overview: what I told the tool</h2>
      <p class="meta">These are my own answers and have not been checked by anyone.${S.excludeSensitive && d.shown.length < Object.keys(S.answers).length ? ' Some sensitive answers are left out at my request.' : ''}</p>
      ${d.shown.length ? `<table><thead><tr><th>Question</th><th>My answer</th></tr></thead><tbody>${d.shown.map((q) => `<tr><td>${esc(q.text)}</td><td>${esc(answerText(q, S.answers[q.id]))}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">No answers.</p>'}
      ${S.notes ? `<p><b>In my own words:</b> ${esc(S.notes)}</p>` : ''}
      <h2>B. Chronology</h2>
      ${d.chrono.length ? `<table><thead><tr><th style="width:30%">Date</th><th>Event</th></tr></thead><tbody>${d.chrono.map((t) => `<tr><td>${t.date ? esc(fmtDate(t.date)) + (t.approx ? ' (approx.)' : '') : 'Unknown'}</td><td>${esc(t.text)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">No timeline entries yet.</p>'}
      <h2>C. Records I have</h2>${li(d.have, (e) => `<b>${esc(e.name)}</b>${(S.records[e.id] || []).length ? ': ' + S.records[e.id].map((r) => esc(r.label)).join('; ') : ' <span class="muted">(not named yet)</span>'}`)}
      <h2>D. Records still to find or check</h2>${li(d.missing, (e) => `${esc(e.name)} <span class="muted">(${esc(e.where || '')})</span>${e.time ? ' <b>Time-sensitive.</b>' : ''}`)}
      ${d.todo.length ? `<p><b>Steps not yet done:</b></p>${li(d.todo, (e) => esc(e.name))}` : ''}
      <h2>E. Records held by others</h2>${li(d.others, (e) => `${esc(e.name)} <span class="muted">(${esc(e.where || '')})</span>`)}
      <p class="meta">I will not try to obtain other people's records without lawful permission.</p>
      <h2>F. Unresolved points</h2>${li(d.unresolved, (q) => esc(q.text) + (S.skipped[q.id] ? ' <span class="muted">(skipped)</span>' : ' <span class="muted">(not sure)</span>'))}
      <h2>G. Questions for my advocate</h2>${li(d.lqs, (l) => esc(l.text))}<p class="meta">${esc(iss.juris)}</p>
      <h2>H. Proposed annexure index (provisional)</h2>
      ${d.annex.length ? `<table><thead><tr><th>Proposed</th><th>Document</th><th>Date / period</th><th>Pages</th></tr></thead><tbody>${d.annex.map((r, i) => `<tr><td class="lab">A-${i + 1}</td><td>${esc(r.label)}<br><span class="meta">${esc(r.ev.name)}</span></td><td>${esc(r.date || '—')}</td><td>${esc(r.pages || '—')}</td></tr>`).join('')}</tbody></table>`
        : '<p class="muted">No documents named yet. Mark a record "I have it" and name it to include it here. Missing records are never listed as annexures.</p>'}
      <p class="meta">These numbers are provisional preparation references, not final court exhibit labels.</p>
      <p class="instr">${esc(INSTRUCTION)}</p>
      <p class="meta" style="margin-top:22px">Prepared with Pehlo, a free preparation tool. Not legal advice and not a court filing. It does not show that any record is admissible or legally required. Electronic records may have additional legal requirements.</p>`;
  }
  function viewReport() {
    return shell(`<div class="wrap narrow" style="padding-bottom:30px">
      <div class="toolbar noprint"><button class="btn text" data-go="list">${ic('back', 18)} ${esc(T('listh'))}</button><button class="btn go" data-act="print">${ic('file', 18)} Print or save as PDF</button>${downloads ? '<button class="btn line" data-act="download">Download</button>' : ''}<button class="btn line" data-act="copytext">${esc(X('Copy as text'))}</button></div>
      <div class="panel noprint" style="margin:0 0 16px">
        <label class="check"><input type="checkbox" data-act="excl" ${S.excludeSensitive ? 'checked' : ''}> Leave out my answers to sensitive questions</label>
        <label class="f" style="margin-top:12px">Anything else your advocate should know? (optional)<textarea class="t" id="notes" rows="2" maxlength="500">${esc(S.notes)}</textarea></label>
        <p class="small muted" style="margin:8px 0 0">${ic('lock', 14)} A printed or downloaded file can stay on this device and in print queues.</p>
        <p class="small muted" id="printhint" hidden style="margin:6px 0 0">If nothing happened, use your browser menu → Print, or Ctrl+P (⌘P on Mac).</p>
      </div>
      <article class="report" id="report">${reportHTML(reportData())}</article>
    </div>`, { inJourney: true });
  }
  function reportText() {
    const el = document.getElementById('report'); if (!el) return ''; const c = el.cloneNode(true);
    c.querySelectorAll('tr').forEach((tr) => { tr.insertAdjacentText('beforeend', '\n'); tr.querySelectorAll('td,th').forEach((x) => x.insertAdjacentText('afterend', ' | ')); });
    c.querySelectorAll('h1,h2,p,li').forEach((n) => n.insertAdjacentText('afterend', '\n'));
    return c.textContent.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+\n/g, '\n').trim();
  }
  const standaloneReport = () => `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lawyer preparation pack</title><style>${document.getElementById('appcss').textContent} body{padding:24px}</style></head><body><article class="report">${document.getElementById('report').innerHTML}</article></body></html>`;

  /* ============ LEGAL QUESTIONS ============ */
  function viewQuestions(openId) {
    const cats = [['all', 'All'], ...KB.categories.map((c) => [c.id, c.title])].filter(([id]) => id === 'all' || KB.questions.some((q) => q.cat === id));
    const s = UI.qsearch.toLowerCase();
    const list = KB.questions.filter((q) => (UI.qcat === 'all' || q.cat === UI.qcat || q.id === openId) && (!s || (q.q + ' ' + q.a + ' ' + q.kw.join(' ')).toLowerCase().includes(s)));
    return shell(`<div class="wrap narrow" style="padding:26px 0 40px">
      <h1 style="font-size:clamp(30px,5.4vw,48px)">${esc(X('Legal questions, answered plainly'))}</h1>
      <p class="lead" style="margin-top:12px">${esc(X('Short answers to what people ask most. Each one says what can change the answer — and links to a guide if you need to prepare for a lawyer.'))}</p>
      <label class="sr" for="qsearch">Search questions</label>
      <input id="qsearch" class="t" type="search" placeholder="${esc(X('Search, e.g. bail, deposit, gratuity'))}" value="${esc(UI.qsearch)}" style="margin-top:14px">
      <div class="filters">${cats.map(([id, t]) => `<button class="fchip" data-qcat="${id}" aria-pressed="${UI.qcat === id}">${esc(X(t))}</button>`).join('')}</div>
      <div id="qalist">${(() => {
        const qa = (q) => `<details class="qa" id="qa-${q.id}" ${q.id === openId ? 'open' : ''}><summary>${esc(X(q.q))}</summary><div class="body">
        <p>${esc(X(q.a))}</p><p class="small" style="margin:0"><b>${esc(X('What can change the answer'))}</b></p><ul>${q.depends.map((x) => `<li>${esc(X(x))}</li>`).join('')}</ul>
        <p class="law">Law: ${esc(q.law)}. ${esc(KB.reviewed.label)}.</p>
        ${q.journey && BY_ID[q.journey] ? `<button class="btn line" data-play="${q.journey}">${esc(X('Prepare for a lawyer:'))} ${esc(BY_ID[q.journey].short)}</button>` : ''}
      </div></details>`;
        if (!list.length) return '<p class="panel muted">' + esc(X('No match. Try other words, or ')) + '<button class="btn text" data-go="start-general">use general preparation</button>.</p>';
        if (UI.qcat !== 'all' || s) return list.map(qa).join('');
        return `<div class="acc">${cats.filter(([id]) => id !== 'all').map(([id, t]) => { const qs = list.filter((q) => q.cat === id); const c = CAT[id]; return qs.length ? `<details class="accg" ${qs.some((q) => q.id === openId) ? 'open' : ''}><summary>${ic(c ? c.icon : 'q', 20)}<b>${esc(X(t))}</b><span class="cnt">${qs.length}</span>${ic('down', 18)}</summary><div class="accb">${qs.map(qa).join('')}</div></details>` : ''; }).join('')}</div>`;
      })()}</div>
    </div>`);
  }

  /* ============ MYTH OR FACT ============ */
  function viewMyths() {
    const mf = UI.mf; if (!mf.order) mf.order = KB.myths.map((_, i) => i).sort(() => Math.random() - 0.5);
    const tx = (t, o) => { let r = X(t); Object.entries(o || {}).forEach(([k, v]) => { r = r.replace('{' + k + '}', v); }); return esc(r); };
    if (mf.i >= mf.order.length) {
      return shell(`<div class="wrap mf"><h1 style="font-size:clamp(30px,5vw,44px)">${tx('You got {s} of {n}', { s: mf.score, n: mf.order.length })}</h1>
        <p class="lead" style="margin-top:12px">${mf.score >= mf.order.length * 0.8 ? tx('You know your rights better than most.') : tx('Now you know a few things most people get wrong.')}</p>
        <div class="row" style="margin-top:18px"><button class="btn go" data-act="mfrestart">${tx('Play again')}</button><button class="btn line" data-go="questions">${tx('Read the legal questions')}</button></div></div>`);
    }
    const m = KB.myths[mf.order[mf.i]]; const a = mf.ans;
    return shell(`<div class="wrap mf">
      <h1 style="font-size:clamp(28px,4.6vw,40px);margin-bottom:6px">${tx('Myth or fact?')}</h1>
      <p class="muted">${tx('Card {i} of {n}', { i: mf.i + 1, n: mf.order.length })} <span class="score" style="margin-left:10px">${tx('Score {s}', { s: mf.score })}</span></p>
      <div class="mfcard"><span class="n">${tx('Card {i}', { i: mf.i + 1 })}</span><p class="s">${esc(X(m.s))}</p></div>
      ${a == null ? `<div class="mfbtns"><button class="btn line" data-mf="myth">${tx('Myth')}</button><button class="btn go" data-mf="fact">${tx('Fact')}</button></div>`
        : `<div class="mfresult ${a === m.fact ? 'right' : 'wrong'}" role="status"><b>${a === m.fact ? (m.fact ? tx('Right: it\'s a fact.') : tx('Right: it\'s a myth.')) : (m.fact ? tx('Not quite: it\'s a fact.') : tx('Not quite: it\'s a myth.'))}</b><p style="margin:6px 0 0">${esc(X(m.why))}</p></div>
           <div class="row" style="margin-top:14px"><button class="btn go" data-act="mfnext">${mf.i + 1 < mf.order.length ? tx('Next card') : tx('See my score')}</button></div>`}
      <p class="small muted" style="margin-top:20px">${tx('General information, not legal advice.')} ${esc(X(KB.reviewed.label))}.</p>
    </div>`);
  }

  /* ============ ADVOCATES ============ */
  const encodeHex = (s) => Array.from(new TextEncoder().encode(s)).map((b) => b.toString(16).padStart(2, '0')).join('');
  function decodeHex(h) { try { return new TextDecoder().decode(new Uint8Array((h.match(/.{2}/g) || []).map((x) => parseInt(x, 16)))); } catch (e) { return ''; } }
  function viewAdvocates() {
    const d = UI.advDraft || {}; const sel = d.issueId || BUILT[0].id; const iss = BY_ID[sel]; const must = new Set(d.must || []);
    return shell(`<div class="wrap narrow" style="padding:26px 0 40px">
      <h1 style="font-size:clamp(30px,5vw,46px)">Send a client a preparation link</h1>
      <p class="lead" style="margin-top:12px">Choose a guide, tick the records you want the client to bring, and add a note. The link carries only these choices — never client information.</p>
      <form id="advform" class="panel">
        <label class="f">Guide<select class="t" name="issue" id="advissue">${KB.categories.map((c) => `<optgroup label="${esc(c.title)}">${BUILT.filter((i) => i.cat === c.id).map((i) => `<option value="${i.id}" ${i.id === sel ? 'selected' : ''}>${esc(i.short)}</option>`).join('')}</optgroup>`).join('')}</select></label>
        <fieldset style="margin-top:14px"><legend class="f">Records to flag as “Advocate asked”</legend><p class="small muted" style="margin:2px 0 6px">The client only sees items that apply to their answers.</p>
          ${iss.evidence.map((e) => `<label class="check" style="margin:7px 0"><input type="checkbox" name="must" value="${e.id}" ${must.has(e.id) ? 'checked' : ''}> ${esc(e.name)}</label>`).join('')}</fieldset>
        <label class="f" style="margin-top:14px">Your name as the client knows you (optional)<input class="t" name="name" maxlength="60" placeholder="e.g. Adv. R. Mohanty" value="${esc(d.name || '')}"></label>
        <label class="f" style="margin-top:10px">Short note (optional)<input class="t" name="note" maxlength="140" placeholder="e.g. Bring originals and copies on Friday." value="${esc(d.note || '')}"></label>
        <div class="row" style="margin-top:16px"><button class="btn go" type="submit">Create link</button></div><div id="advout"></div>
      </form></div>`);
  }
  function makeAdvCode(id, mustIds, name, note) {
    const idx = BUILT.findIndex((i) => i.id === id); const ev = BY_ID[id].evidence;
    let mask = 0; mustIds.forEach((m) => { const k = ev.findIndex((e) => e.id === m); if (k >= 0) mask += 2 ** k; });
    return ['a', idx.toString(36), mask.toString(36), encodeHex(name.trim()), encodeHex(note.trim())].join('-');
  }
  function applyAdvLink(raw) {
    const p = raw.split('-'); const iss = BUILT[parseInt(p[1], 36)]; if (!iss) { location.hash = 'home'; return; }
    const mask = parseInt(p[2] || '0', 36) || 0;
    const must = iss.evidence.filter((e, k) => Math.floor(mask / 2 ** k) % 2 === 1).map((e) => e.id);
    if (S.issueId !== iss.id) S = blank();
    S.adv = { issueId: iss.id, must, name: decodeHex(p[3] || '').slice(0, 60), note: decodeHex(p[4] || '').slice(0, 140) };
    location.replace('#start-' + iss.id);
  }

  /* ============ HELP / ABOUT ============ */
  function viewHelp() {
    const CALL = [['e112', 'Emergency'], ['w181', 'Women'], ['c1098', 'Children'], ['s14567', 'Senior citizens'], ['cy1930', 'Cyber fraud'], ['l15100', 'Free legal aid'], ['telemanas', 'Mental health'], ['ragging', 'Ragging']];
    const GROUPS = [
      ['Money & banking', 'bank', ['rbi', 'sachet', 'chakshu']],
      ['Shopping, travel & services', 'bag', ['nch', 'ejag', 'airsewa']],
      ['Insurance', 'shield', ['ins', 'cio']],
      ['Online safety', 'lock', ['stopncii']],
      ['Work, PF & students', 'briefcase', ['posh', 'samadhan', 'epfo', 'ugc']],
      ['Home & property', 'house', ['rera']],
      ['NRI & abroad', 'globe', ['madad', 'ncwnri', 'passport']],
      ['Courts, traffic & business', 'file', ['ecourts', 'echallan', 'mca', 'msmeodr']]
    ].map(([t, icn, ks]) => [t, icn, ks.filter((k) => KB.help[k])]).filter((g) => g[2].length);
    const num = (h) => h.label.replace(/\D/g, '');
    return shell(`<div class="wrap narrow" style="padding:22px 0 36px">
      <h1 style="font-size:clamp(28px,5vw,44px)">${esc(X('Urgent help and free legal aid'))}</h1>
      <div class="banner now" style="margin-top:14px">${ic('alert')}<div><h3>${esc(X('In immediate danger?'))}</h3><p>${esc(X('Call 112. You don\'t need this tool first.'))}</p></div></div>
      <h2 class="lh" style="margin-top:20px">${esc(X('Call now'))}</h2>
      <div class="callgrid">${CALL.filter(([k]) => KB.help[k]).map(([k, short]) => { const h = KB.help[k]; return `<a class="callbtn${h.label.length > 6 ? ' long' : ''}" href="tel:${num(h)}" title="${esc(h.name)}">${ic('phone', 18)}<b>${esc(h.label)}</b><span>${esc(X(short))}</span></a>`; }).join('')}</div>
      <p class="small muted" style="margin:8px 0 0">${esc(X('Free legal aid covers women, children, people with disabilities, people in custody and those below the income limit — call 15100 to ask.'))}</p>
      <h2 class="lh" style="margin-top:22px">${esc(X('Complaint portals'))}</h2>
      <p class="small muted" style="margin:0 0 8px">${esc(X('Tap an area to see the official place to complain.'))}</p>
      <div class="acc">${GROUPS.map(([t, icn, ks]) => `<details class="accg"><summary>${ic(icn, 20)}<b>${esc(X(t))}</b><span class="cnt">${ks.length}</span>${ic('down', 18)}</summary><div class="grid">${ks.map((k) => helpCard(KB.help[k])).join('')}</div></details>`).join('')}</div>
      <p class="small muted" style="margin-top:14px">${esc(X('If a number doesn\'t open, dial it yourself. Checked October 2026.'))}</p>
    </div>`);
  }
  function viewAbout() {
    const counts = KB.categories.map((c) => `${c.title}: ${BUILT.filter((i) => i.cat === c.id).length}`).join(', ');
    return shell(`<div class="wrap narrow" style="padding:26px 0 40px">
      <h1 style="font-size:clamp(30px,5vw,46px)">${esc(X('How this works'))}</h1>
      <details class="panel accp" open><summary><h2>${esc(X('What it does'))}</h2>${ic('down', 18)}</summary><div class="accb"><p>Pick your problem and answer a few one-tap questions. Each answer changes which papers you need. The rules come from a written, tested set of guides — not from a chatbot making things up.</p><p style="margin:0">At the end you get one list: what to do first, the papers to take to your advocate, and where you stand. You can print it, or make a page for your advocate with your answers and a dated timeline.</p></div></details>
      <details class="panel accp"><summary><h2>${esc(X('What it doesn\'t do'))}</h2>${ic('down', 18)}</summary><div class="accb"><ul style="margin:0;padding-left:20px"><li>Give legal advice or predict results.</li><li>Say a record is legally required or admissible.</li><li>Prepare court filings.</li><li>Ask you to upload documents.</li></ul></div></details>
      <details class="panel accp"><summary><h2>${esc(X('Why these problems'))}</h2>${ic('down', 18)}</summary><div class="accb"><p style="margin:0">Guides are chosen from what most often reaches Indian courts and Lok Adalats (cheque bounce, family, motor accident, traffic challans, property), the National Consumer Helpline (e-commerce, banking, telecom, travel), the RBI Ombudsman (loans and credit cards lead) and police cyber-crime data (online fraud and fake-police "digital arrest" calls). Guides by area — ${esc(counts)}.</p></div></details>
      <details class="panel accp"><summary><h2>${esc(X('Privacy'))}</h2>${ic('down', 18)}</summary><div class="accb"><p>Your answers stay in this browser tab — they are never sent to us. On the public website, the app counts anonymous events (for example, "a list was made for the cheque-bounce guide", or which language was used) to improve the guides; no cookies, no IP addresses, nothing you typed into a question. If you switch on "Keep my file on this device", it is saved only in this browser. Advocate links contain only the guide choice and the advocate's note.</p><p style="margin:0">${esc(X('Exit clears the page and opens a neutral website. It does not erase browser history.'))}</p></div></details>
      <details class="panel accp"><summary><h2>${esc(X('Review status'))}</h2>${ic('down', 18)}</summary><div class="accb"><p style="margin:0">All guides are <b>drafts</b>, not yet reviewed by a practising advocate. Each guide will show its reviewer and date once reviewed. Languages: all 22 scheduled languages of India plus English. 16 have a hand-written interface; Santali, Kashmiri, Sindhi, Manipuri, Bodo and Sanskrit, and all guide content in every language, are machine-translated on the fly and labelled so. Translations need native-speaker and advocate review. The page for your lawyer always stays in English. Content v${esc(KB.version)}: ${BUILT.length} guided problems, ${KB.questions.length} answered questions, ${KB.myths.length} myth cards.</p></div></details>
      ${S.issueId || loadSaved() ? '<button class="btn line" data-act="clear" style="margin-top:16px">' + esc(X('Clear everything on this device')) + '</button>' : ''}
    </div>`);
  }
  function showLang() {
    const ov = document.createElement('div'); ov.className = 'overlay'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'langh');
    ov.innerHTML = `<div class="dialog wide"><h2 id="langh">${esc(T('lang'))}</h2><p class="small muted">${esc(T('auto'))}</p>
      <div class="langgrid">${I18N.LANGS.map((l) => `<button class="langopt" lang="${l.code}" data-lang="${l.code}" aria-current="${LANG === l.code}"><b>${esc(l.native)}</b><span>${esc(l.name)}</span></button>`).join('')}</div>
      <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn line" data-close>✕</button></div></div>`;
    document.body.appendChild(ov);
    const close = () => { ov.remove(); };
    ov.addEventListener('click', (e) => { if (e.target === ov || e.target.closest('[data-close]')) close(); });
    ov.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    ov.querySelector('[aria-current="true"]')?.focus();
  }

  /* ============ events ============ */
  function flyToTray(names) {
    const tray = document.getElementById('tray'); const cnt = document.getElementById('traycount');
    if (!tray || !names.length || issue().sensitive || matchMedia('(prefers-reduced-motion: reduce)').matches) { if (names.length) announce(names.length + ' record' + (names.length > 1 ? 's' : '') + ' added to your file'); return; }
    const from = document.querySelector('.qtext').getBoundingClientRect(); const to = tray.getBoundingClientRect();
    const final = Number(cnt.textContent); const shown = names.slice(0, 3); cnt.textContent = final - names.length;
    shown.forEach((n, i) => {
      const el = document.createElement('div'); el.className = 'flyslip'; el.textContent = n; document.body.appendChild(el);
      const sx = Math.max(12, Math.min(from.left, window.innerWidth - 310)), sy = from.top + 20 + i * 8;
      el.style.left = sx + 'px'; el.style.top = sy + 'px';
      const dx = to.left + 30 - sx, dy = to.top - sy;
      const a = el.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 0 }, { transform: 'translate(0,-6px) rotate(-2deg)', opacity: 1, offset: 0.25 }, { transform: `translate(${dx}px,${dy}px) rotate(4deg) scale(.5)`, opacity: 0.2 }],
        { duration: 900, delay: i * 160, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' });
      a.onfinish = () => { el.remove(); cnt.textContent = i === shown.length - 1 ? final : Number(cnt.textContent) + 1; };
    });
    announce(names.length + ' record' + (names.length > 1 ? 's' : '') + ' added to your file');
  }
  function afterRender(view) {
    const m = document.getElementById('matter'); if (m) m.addEventListener('input', () => { renderResults(m.value); trackSearch(m.value); });
    const qs = document.getElementById('qsearch'); if (qs) qs.addEventListener('input', () => { UI.qsearch = qs.value; const pos = qs.selectionStart; render(); const n = document.getElementById('qsearch'); n.focus(); n.setSelectionRange(pos, pos); });
    const form = document.getElementById('qform');
    if (form) {
      const qq = issue().questions.find((x) => x.id === form.dataset.q);
      let done = false; const pick = (v) => { if (done) return; done = true; form.classList.add('picked'); setTimeout(() => answer(qq, v), 220); };
      form.addEventListener('change', (e) => { if (e.target.name === 'a') pick(e.target.value); });
      form.addEventListener('click', (e) => { const i = e.target.closest('input[name=a]'); if (i && i.dataset.pre) pick(i.value); });
      form.addEventListener('submit', (e) => e.preventDefault());
    }
    const cf = document.getElementById('chronoform');
    if (cf) cf.addEventListener('submit', (e) => { e.preventDefault(); const f = new FormData(cf); S.chrono.push({ id: Date.now().toString(36), date: f.get('date') || '', approx: !!f.get('approx'), text: String(f.get('text')).trim() }); persist(); render(); announce('Event added'); });
    const af = document.getElementById('advform');
    if (af) {
      document.getElementById('advissue').addEventListener('change', (e) => { UI.advDraft = { issueId: e.target.value, must: [] }; render(); });
      af.addEventListener('submit', (e) => { e.preventDefault(); const f = new FormData(af);
        const d = { issueId: f.get('issue'), must: f.getAll('must'), name: String(f.get('name') || ''), note: String(f.get('note') || '') }; UI.advDraft = d;
        const code = makeAdvCode(d.issueId, d.must, d.name, d.note); history.replaceState(null, '', '#' + code);
        document.getElementById('advout').innerHTML = `<div class="banner info" style="margin-top:14px">${ic('check')}<div><h3>Link ready</h3><p>This page's address now carries your guide. Copy it from the address bar, or use Share → Copy link, and send it to your client.</p><p class="small" style="margin-top:6px;word-break:break-all">Guide code: <code>${esc(code)}</code> <button type="button" class="btn text" data-copy="${esc(code)}">Copy code</button></p></div></div>`; });
    }
    const notes = document.getElementById('notes'); if (notes) notes.addEventListener('change', () => { S.notes = notes.value.trim(); persist(); render(); });
    S._stamp = null;
  }
  document.addEventListener('keydown', (e) => {
    const form = document.getElementById('qform'); if (!form || e.metaKey || e.ctrlKey || e.altKey) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) && document.activeElement.type !== 'radio' && document.activeElement.type !== 'checkbox') return;
    const k = e.key; let idx = /^[1-9]$/.test(k) ? Number(k) - 1 : -1;
    const inputs = form.querySelectorAll('input[name=a]'); if (idx < 0 || idx >= inputs.length) return;
    e.preventDefault(); const inp = inputs[idx]; inp.checked = true; inp.dispatchEvent(new Event('change', { bubbles: true })); inp.focus();
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-addrec]'); if (!f) return; e.preventDefault();
    const d = new FormData(f); const id = f.dataset.addrec; const label = String(d.get('label') || '').trim(); if (!label) return;
    (S.records[id] = S.records[id] || []).push({ label, date: String(d.get('date') || '').trim(), pages: String(d.get('pages') || '').replace(/\D/g, '') });
    persist(); rerenderList('ev-' + id, 'input[name=label]'); announce('Document added');
  });
  function rerenderList(anchor, sel) {
    const y = window.scrollY; app.innerHTML = viewList(); afterRender('list'); window.scrollTo(0, y);
    const a = document.getElementById(anchor); if (a) { const b = a.querySelector(sel) || a.querySelector('[aria-pressed=true]'); if (b) b.focus({ preventScroll: true }); }
  }
  function enterGuide() { goQuiz(); }
  document.addEventListener('click', async (e) => {
    const sr = e.target.closest('#results [data-play], #results [data-go]'); if (sr) { const m = document.getElementById('matter'); TRACK.ev('pick', { g: sr.dataset.play === 'general' && sr.dataset.topic != null ? 'topic-' + sr.dataset.topic : (sr.dataset.play || sr.dataset.go), x: m ? m.value : '' }); }
    const pl = e.target.closest('[data-play]');
    if (pl) { e.preventDefault(); startIssue(pl.dataset.play, pl.dataset.topic != null ? KB.directory[Number(pl.dataset.topic)] : null);
      enterGuide(); return; }
    const lc = e.target.closest('[data-lang]'); if (lc) { setLang(lc.dataset.lang); document.querySelector('.overlay')?.remove(); return; }
    const t = e.target.closest('[data-go],[data-act],[data-status],[data-delrec],[data-delchrono],[data-ex],[data-copy],[data-club],[data-qcat],[data-mf]'); if (!t) return;
    if (t.dataset.go) { e.preventDefault(); go(t.dataset.go); return; }
    if (t.dataset.club) { UI.club = t.dataset.club; document.querySelectorAll('.tab').forEach((x) => x.setAttribute('aria-selected', x === t)); const d = document.getElementById('drawer'); d.setAttribute('aria-labelledby', t.id); d.innerHTML = clubRows(UI.club) + '<button class="issue gen" data-play="general"><b>' + esc(X('Something else, or not sure')) + '</b><span>' + esc(X('Answer a few general questions')) + '</span><em>general</em></button>'; return; }
    if (t.dataset.qcat) { UI.qcat = t.dataset.qcat; render(); return; }
    if (t.dataset.ex) { const m = document.getElementById('matter'); m.value = t.dataset.ex; renderResults(m.value); m.focus(); return; }
    if (t.dataset.copy) { try { await navigator.clipboard.writeText(t.dataset.copy); toast('Copied'); } catch (err) { toast('Copy blocked — select and copy manually'); } return; }
    if (t.dataset.mf) { UI.mf.ans = t.dataset.mf === 'fact'; const m = KB.myths[UI.mf.order[UI.mf.i]]; if (UI.mf.ans === m.fact) UI.mf.score++; render(); document.querySelector('.mfresult')?.focus?.(); return; }
    if (t.dataset.status) { const id = t.dataset.ev; const nv = S.status[id] === t.dataset.status ? undefined : t.dataset.status; if (nv) S.status[id] = nv; else delete S.status[id]; if (nv === 'have') S._stamp = id; persist(); rerenderList('ev-' + id, '.cbox'); return; }
    if (t.dataset.delrec) { const [id, i] = t.dataset.delrec.split(':'); S.records[id].splice(Number(i), 1); persist(); rerenderList('ev-' + id, 'input[name=label]'); return; }
    if (t.dataset.delchrono) { S.chrono = S.chrono.filter((c) => c.id !== t.dataset.delchrono); persist(); render(); return; }
    const iss = issue();
    switch (t.dataset.act) {
      case 'toshelf': document.getElementById('shelf').scrollIntoView({ behavior: 'smooth' }); break;
      case 'lang': showLang(); break;
      case 'begin': startIssue(t.dataset.id, t.dataset.topic != null ? KB.directory[Number(t.dataset.topic)] : null); enterGuide(); break;
      case 'skip': { const q = currentQ(); if (q) { S.skipped[q.id] = true; S.history.push({ id: q.id, stage: S.stage, skip: true }); persist(); nextAfter(q); } break; }
      case 'qback': { if (!S.history.length) break; syncQuiz(String(S.history.length - 1)); history.replaceState(null, '', '#quiz-' + S.history.length); render(); break; }
      case 'toen': setLang('en'); break;
      case 'getstarted': { const st = document.getElementById('start'); if (st) st.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); setTimeout(() => document.getElementById('matter')?.focus({ preventScroll: true }), 400); break; }
      case 'quit': go(S.topic ? 'cat-' + S.topic.cat : 'cat-' + issue().cat); break;
      case 'showlist': S.pendingUrgent = null; S.chapterFound = []; go('list'); break;
      case 'ackurgent': S.ackUrgent[S.pendingUrgent] = true; S.pendingUrgent = null; persist(); if (currentQ()) goQuiz(); else { finishStage(); go('list'); } break;
      case 'resumequiz': S.stage = 'quick'; S.skipped = Object.fromEntries(Object.entries(S.skipped).filter(([k]) => iss.questions.find((q) => q.id === k && q.deep))); goQuiz(); break;
      case 'fb': UI.fb = UI.fb || {}; UI.fb[S.issueId] = t.dataset.v; TRACK.once('fb', { g: S.issueId, x: t.dataset.v }); { const f = document.getElementById('fbk'); if (f) f.innerHTML = `<p class="small muted">${ic('check', 16)} Thanks — that helps us improve this guide.</p>`; } break;
      case 'deep': TRACK.once('deep', { g: S.issueId }); S.stage = 'deep'; S.chapterFound = []; persist(); goQuiz(); break;
      case 'change': { const q = iss.questions.find((x) => x.id === t.dataset.q); if (!q) break; S.prefill[q.id] = S.answers[q.id]; delete S.answers[q.id]; delete S.skipped[q.id]; S.stage = q.deep ? 'deep' : 'quick'; S.history = S.history.filter((h) => h.id !== q.id); if (q.deep) S.deepDone = false; else S.quickDone = false; S.chapterFound = []; persist(); goQuiz(); break; }
      case 'savetoggle': if (t.checked) TRACK.once('save', { g: S.issueId }); saveOn = t.checked; if (saveOn) persist(); else clearSaved(); toast(saveOn ? 'Saved on this device' : 'Removed from this device'); break;
      case 'clear': S = blank(); saveOn = false; clearSaved(); toast('Cleared'); go('home'); break;
      case 'forget': clearSaved(); render(); break;
      case 'resume': { const v = loadSaved(); if (v) { S = Object.assign(blank(), v); saveOn = true; go('list'); } break; }
      case 'exit': S = blank(); saveOn = false; clearSaved(); app.innerHTML = ''; history.replaceState(null, '', '#home'); render(); break;
      case 'excl': S.excludeSensitive = t.checked; persist(); render(); break;
      case 'print': TRACK.once('print', { g: S.issueId }); try { window.print(); } catch (err) { /* blocked */ } document.getElementById('printhint').hidden = false; break;
      case 'copytext': try { await navigator.clipboard.writeText(reportText()); toast('Report copied as text'); } catch (err) { toast('Copy was blocked by the browser'); } break;
      case 'download': if (!downloads) break;
        try { await downloads.save({ filename: 'lawyer-preparation-pack.html', data: standaloneReport() }); toast('Saved'); }
        catch (err) { const c = err && err.code; if (c === 'declined') break; if (c === 'rate_limited') { toast('Please wait a moment and try again'); break; } downloads = null; toast('Download isn\'t available here — use Print or Copy'); render(); }
        break;
      case 'mfnext': UI.mf.i++; UI.mf.ans = null; render(); break;
      case 'mfrestart': UI.mf = { i: 0, score: 0, ans: null, order: null }; render(); break;
    }
  });

  /* ============ ANONYMOUS USAGE COUNTS (live site only) ============
     Sends counts like "a list was made for cheque-bounce" to /api/e. Never sends answers, notes, names or dates.
     Off inside Claude, on file://, and when the browser asks not to be tracked. */
  const TRACK = (() => {
    const on = /^https:$/.test(location.protocol) && !/claude\.ai|anthropic|claudeusercontent|localhost$/.test(location.hostname) && navigator.doNotTrack !== '1' && window.doNotTrack !== '1';
    const forced = /^http:$/.test(location.protocol) && /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && /pehlo_track=1/.test(document.cookie + location.search);
    if (!on && !forced) return { ev() {}, once() {} };
    let sid = ''; try { sid = sessionStorage.getItem('pa_s') || ''; if (!sid) { sid = Math.random().toString(36).slice(2, 12) + Date.now().toString(36).slice(-4); sessionStorage.setItem('pa_s', sid); } } catch (e) { sid = Math.random().toString(36).slice(2, 14); }
    const seen = new Set(); let q = []; let first = true; let timer = null;
    const ref = (() => { try { const r = document.referrer && new URL(document.referrer); return r && r.hostname !== location.hostname ? r.hostname : ''; } catch (e) { return ''; } })();
    const utm = (() => { try { return new URLSearchParams(location.search).get('utm_source') || ''; } catch (e) { return ''; } })();
    const dev = () => (Math.min(screen.width, innerWidth) < 640 ? 'm' : Math.min(screen.width, innerWidth) < 1024 ? 't' : 'd');
    function flush() {
      if (!q.length) return; clearTimeout(timer); timer = null;
      const payload = { s: sid, l: LANG, d: dev(), e: q.splice(0, 60) };
      if (first) { payload.first = 1; payload.r = ref; payload.u = utm; first = false; }
      const body = JSON.stringify(payload);
      try { if (!(navigator.sendBeacon && navigator.sendBeacon('/api/e', new Blob([body], { type: 'application/json' })))) fetch('/api/e', { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => {}); } catch (e) { /* ignore */ }
      if (q.length) flush();
    }
    function ev(t, o) { q.push(Object.assign({ t }, o || {})); if (q.length >= 25) flush(); else if (!timer) timer = setTimeout(flush, 4000); }
    function once(t, o) { const k = t + '|' + JSON.stringify(o || {}); if (seen.has(k)) return; seen.add(k); ev(t, o); }
    addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
    addEventListener('pagehide', flush);
    let errs = 0;
    addEventListener('error', (e) => { if (errs++ < 5) ev('err', { x: String((e && e.message) || 'error') + (e && e.lineno ? ' @' + e.lineno : ''), v: KB.version }); });
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
      const h = a.getAttribute('href');
      if (/^tel:/.test(h)) ev('call', { x: h.replace(/\D/g, '') });
      else if (/^https?:/.test(h)) { try { const u = new URL(h); if (u.hostname !== location.hostname) ev('out', { x: u.hostname.replace(/^www\./, '') }); } catch (er) { /* ignore */ } }
    }, true);
    return { ev, once };
  })();
  let lastView = '';
  function trackRender() {
    const raw = (location.hash || '').slice(1); const view = raw.split('-')[0] || 'home';
    if (busy) return;
    const iss = S.issueId ? issue() : null; const id = iss && iss.id;
    const key = raw; if (key !== lastView) { lastView = key; TRACK.ev('view', { v: view }); }
    if (view === 'start') { const g = raw.slice(6); if (BY_ID[g]) TRACK.once('intro', { g }); }
    if (!id) return;
    if (view === 'quiz') {
      if (S.history.length === 0) { TRACK.once('intro', { g: id }); TRACK.once('start', { g: id }); }
      TRACK.once('step', { g: id, n: Math.min(S.history.length, 60) });
    }
    if (view === 'list' || view === 'brk') {
      TRACK.once('list', { g: id });
      if (S.stage === 'deep' && !currentQ()) TRACK.once('done', { g: id });
    }
    if (view === 'report') TRACK.once('report', { g: id });
    if (view === 'quiz' || view === 'list' || view === 'urgent') {
      try { E.urgent(iss, S.answers).filter((u) => u.level === 'now').forEach((u) => TRACK.once('urg', { g: id, x: u.id })); } catch (e) { /* ignore */ }
    }
  }
  let searchT = null;
  function trackSearch(qv) {
    clearTimeout(searchT); const v = String(qv || '').trim(); if (v.length < 3) return;
    searchT = setTimeout(() => { let n = 0; try { n = searchAll(v).length; } catch (e) { /* ignore */ } TRACK.ev('search', { n, x: v }); }, 1500);
  }
  try { const fi = document.createElement('link'); fi.rel = 'icon'; fi.href = window.ER_BRAND.icon; document.head.appendChild(fi); } catch (e) { /* none */ }
  applyLangDom();
  render();
})();
