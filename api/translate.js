// Saboot translation endpoint (Vercel serverless, Node 18+).
//
// Free providers, tried in this order (set whichever you have in Vercel → Settings → Environment Variables):
//   1. Bhashini (Government of India, free, all 22 scheduled languages)
//        BHASHINI_USER_ID, BHASHINI_API_KEY   — from bhashini.gov.in (free registration)
//   2. Google Gemini free tier (Flash models)
//        GEMINI_API_KEY                        — from aistudio.google.com (free, no card)
//        GEMINI_MODEL (optional, default gemini-flash-latest)
//   3. Anthropic (paid, optional)              ANTHROPIC_API_KEY, TRANSLATE_MODEL
//
// Only text that already exists in the app's own source is translated (checked against _corpus.js),
// so nobody can use this as a free general-purpose translator on your quota.
const CORPUS = require('./_corpus.js');
const { body: readBody, store, hasStore, crypto } = require('./_lib.js');
const H = (s) => crypto.createHash('sha1').update(s).digest('base64url').slice(0, 20);

const LANGS = {
  hi: ['Hindi', 'हिन्दी'], bn: ['Bengali', 'বাংলা'], te: ['Telugu', 'తెలుగు'], mr: ['Marathi', 'मराठी'], ta: ['Tamil', 'தமிழ்'],
  ur: ['Urdu', 'اردو', 'Urdu (Nastaliq/Naskh) script'], gu: ['Gujarati', 'ગુજરાતી'], kn: ['Kannada', 'ಕನ್ನಡ'], or: ['Odia', 'ଓଡ଼ିଆ'],
  ml: ['Malayalam', 'മലയാളം'], pa: ['Punjabi', 'ਪੰਜਾਬੀ'], as: ['Assamese', 'অসমীয়া'], mai: ['Maithili', 'मैथिली'],
  sat: ['Santali', 'ᱥᱟᱱᱛᱟᱲᱤ', 'Ol Chiki script'], ks: ['Kashmiri', 'کٲشُر', 'Perso-Arabic script'], ne: ['Nepali', 'नेपाली'],
  sd: ['Sindhi', 'سنڌي', 'Perso-Arabic script'], doi: ['Dogri', 'डोगरी'], kok: ['Konkani', 'कोंकणी', 'Devanagari script'],
  mni: ['Manipuri', 'ꯃꯤꯇꯩꯂꯣꯟ', 'Meitei Mayek script'], brx: ['Bodo', 'बड़ो', 'Devanagari script'], sa: ['Sanskrit', 'संस्कृतम्', 'Devanagari script']
};
// Bhashini language codes / scripts where they differ from ours.
const BH = { kok: { code: 'gom' }, sat: { script: 'Olck' }, mni: { script: 'Mtei' }, ks: { script: 'Arab' }, sd: { script: 'Arab' } };

const MAX_KEYS = 400, MAX_CHARS = 40000;
const norm = (s) => String(s).replace(/[\\'"`\s]/g, '').toLowerCase();
const NC = norm(CORPUS);
const mem = new Map(); // warm-instance cache: lang|text -> translation

const known = (v) => String(v).split(/\{[^}]*\}/).map(norm).filter((p) => p.length >= 4).every((p) => NC.includes(p));
const withTimeout = (ms) => { const c = new AbortController(); const t = setTimeout(() => c.abort(), ms); return { signal: c.signal, done: () => clearTimeout(t) }; };

/* ---------- Bhashini ---------- */
let bhCfg = {}; // lang -> { url, auth, serviceId, at }
async function bhashiniConfig(lang) {
  const c = bhCfg[lang]; if (c && Date.now() - c.at < 6 * 3600e3) return c;
  const m = BH[lang] || {}; const lc = { sourceLanguage: 'en', targetLanguage: m.code || lang };
  const t = withTimeout(15000);
  const r = await fetch('https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline', {
    method: 'POST', signal: t.signal,
    headers: { 'content-type': 'application/json', userID: process.env.BHASHINI_USER_ID, ulcaApiKey: process.env.BHASHINI_API_KEY },
    body: JSON.stringify({ pipelineTasks: [{ taskType: 'translation', config: { language: lc } }], pipelineRequestConfig: { pipelineId: process.env.BHASHINI_PIPELINE_ID || '64392f96daac500b55c543cd' } })
  }).finally(t.done);
  if (!r.ok) throw new Error('bhashini config ' + r.status);
  const j = await r.json();
  const ep = j.pipelineInferenceAPIEndPoint || {};
  const svc = (((j.pipelineResponseConfig || [])[0] || {}).config || [])[0] || {};
  if (!ep.callbackUrl || !ep.inferenceApiKey || !svc.serviceId) throw new Error('bhashini config incomplete');
  return (bhCfg[lang] = { url: ep.callbackUrl, auth: [ep.inferenceApiKey.name || 'Authorization', ep.inferenceApiKey.value], serviceId: svc.serviceId, at: Date.now() });
}
async function bhashini(lang, texts) {
  const cfg = await bhashiniConfig(lang);
  const m = BH[lang] || {};
  const language = { sourceLanguage: 'en', targetLanguage: m.code || lang };
  if (m.script) language.targetScriptCode = m.script;
  const out = [];
  for (let i = 0; i < texts.length; i += 25) {
    const batch = texts.slice(i, i + 25);
    const t = withTimeout(25000);
    const r = await fetch(cfg.url, {
      method: 'POST', signal: t.signal, headers: { 'content-type': 'application/json', [cfg.auth[0]]: cfg.auth[1] },
      body: JSON.stringify({ pipelineTasks: [{ taskType: 'translation', config: { language, serviceId: cfg.serviceId } }], inputData: { input: batch.map((source) => ({ source })) } })
    }).finally(t.done);
    if (!r.ok) throw new Error('bhashini ' + r.status);
    const j = await r.json();
    const o = (((j.pipelineResponse || [])[0] || {}).output || []).map((x) => x.target);
    if (o.length !== batch.length) throw new Error('bhashini count mismatch');
    out.push(...o);
  }
  return out;
}

/* ---------- LLM providers (Gemini free tier, Anthropic) ---------- */
function prompt(lang, obj) {
  const [name, native, script] = LANGS[lang];
  return `You are translating a free legal-help app for ordinary people in India into ${name} (${native}${script ? ', ' + script : ''}).
Rules:
- Use very simple, everyday words that a person with little schooling, or an elderly person, understands. Short sentences. Respectful tone.
- Keep unchanged: anything in {curly braces}, numbers, ₹ amounts, phone numbers, website addresses, names of Acts and sections, and common terms like FIR, UPI, RBI, PAN, NRI, OCI, PoA, KYC, GST, CIBIL, OTP, EMI, RERA, NCLT, MSME.
- Do not add, drop or soften any meaning, warning or deadline.
Return ONLY a JSON object with exactly the same keys and the translated strings as values.

${JSON.stringify(obj)}`;
}
const parseJSON = (txt) => { const m = String(txt).match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]) : {}; };
async function viaLLM(lang, texts, call) {
  // Small batches in parallel: keeps each model call short so the whole request finishes well inside Vercel's time limit.
  const out = new Array(texts.length); const SIZE = 30; const batches = [];
  for (let i = 0; i < texts.length; i += SIZE) batches.push(i);
  let idx = 0; let lastErr = null; let okCount = 0;
  async function worker() {
    while (idx < batches.length) {
      const i = batches[idx++]; const obj = {}; texts.slice(i, i + SIZE).forEach((s, k) => { obj['k' + (i + k)] = s; });
      try { let res; try { res = await call(prompt(lang, obj)); } catch (e) { if (e.status !== 429) throw e; await new Promise((r) => setTimeout(r, 2500)); res = await call(prompt(lang, obj)); } okCount++; Object.keys(obj).forEach((k) => { if (typeof res[k] === 'string' && res[k].trim()) out[Number(k.slice(1))] = res[k]; }); }
      catch (e) { lastErr = e; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(3, batches.length) }, worker));
  if (!okCount && lastErr) throw lastErr;
  return out;
}
// Gemini model IDs change often; try current ones in order and remember the first that works.
let GEM_OK = null;
// Measured live (Oct 2026): flash-lite translates a batch into Odia in ≈ 1 s with good quality; 3.x flash took ≈ 47 s.
const GEM_MODELS = () => [...new Set([process.env.GEMINI_MODEL, GEM_OK, 'gemini-flash-lite-latest', 'gemini-3.5-flash-lite', 'gemini-2.5-flash-lite', 'gemini-flash-latest', 'gemini-3.5-flash'].filter(Boolean))];
async function geminiCall(p) {
  let last;
  for (const model of GEM_MODELS()) {
    for (const thinking of [false, true]) {
      const gc = { responseMimeType: 'application/json', temperature: 0.2 };
      if (thinking) gc.thinkingConfig = { thinkingLevel: 'low' };
      const t = withTimeout(20000);
      let r;
      try {
        r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST', signal: t.signal, headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
          body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: p }] }], generationConfig: gc })
        });
      } catch (e) { t.done(); last = new Error('gemini ' + model + ' network/timeout'); break; }
      t.done();
      if (r.ok) {
        const j = await r.json(); GEM_OK = model;
        const parts = (((j.candidates || [])[0] || {}).content || { parts: [] }).parts || [];
        return parseJSON(parts.filter((x) => !x.thought).map((x) => x.text || '').join(''));
      }
      const txt = (await r.text()).slice(0, 300).replace(/\s+/g, ' ');
      last = new Error(`gemini ${model} ${r.status}: ${txt}`); last.status = r.status;
      if (r.status === 429) throw last;                                   // quota: other models share it
      if (r.status === 400 && thinking && /thinking/i.test(txt)) break;    // model doesn't take thinkingConfig
      break;                                                               // 400/401/403/404: try the next model
    }
  }
  throw last || new Error('gemini: no model available');
}
async function gemini(lang, texts) { return viaLLM(lang, texts, geminiCall); }
async function anthropic(lang, texts) {
  return viaLLM(lang, texts, async (p) => {
    const t = withTimeout(55000);
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: t.signal, headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: process.env.TRANSLATE_MODEL || 'claude-haiku-5-5', max_tokens: 16000, messages: [{ role: 'user', content: p }] })
    }).finally(t.done);
    if (!r.ok) throw new Error('anthropic ' + r.status);
    const j = await r.json();
    return parseJSON((j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join(''));
  });
}

function providers() {
  const p = [];
  if (process.env.BHASHINI_USER_ID && process.env.BHASHINI_API_KEY) p.push(['bhashini', bhashini]);
  if (process.env.GEMINI_API_KEY) p.push(['gemini', gemini]);
  if (process.env.ANTHROPIC_API_KEY) p.push(['anthropic', anthropic]);
  return p;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method === 'GET') {
    const url = new URL(req.url, 'http://x'); const check = url.searchParams.get('check');
    const info = { providers: providers().map((x) => x[0]) };
    if (check && LANGS[check]) {
      // Live test with one short phrase, so problems show up in the browser instead of only in server logs.
      info.test = {};
      for (const [name, fn] of providers()) {
        const t0 = Date.now();
        try { const r = await fn(check, ['Cheque bounce', 'What papers do I need?']); info.test[name] = { ok: !!(r && r[0]), sample: r && r[0], ms: Date.now() - t0, model: name === 'gemini' ? GEM_OK : undefined }; }
        catch (e) { info.test[name] = { ok: false, error: String(e.message || e).replace(/(key|token)=[^&\s]+/gi, '$1=***').slice(0, 400), ms: Date.now() - t0 }; }
      }
    }
    return res.status(200).json(info);
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const prov = providers();
  if (!prov.length) return res.status(501).json({ error: 'translation not configured' });

  const body = await readBody(req);
  const lang = body && body.lang; const map = body && body.map;
  if (!LANGS[lang] || !map || typeof map !== 'object' || Array.isArray(map)) return res.status(400).json({ error: 'bad request' });
  const entries = Object.entries(map).filter(([k, v]) => typeof k === 'string' && k.length < 80 && typeof v === 'string');
  const chars = entries.reduce((n, [, v]) => n + v.length, 0);
  if (!entries.length || entries.length > MAX_KEYS || chars > MAX_CHARS) return res.status(413).json({ error: 'too large' });
  const clean = entries.filter(([, v]) => known(v));
  if (!clean.length) return res.status(400).json({ error: 'unknown text' });

  // LLMs get whole strings (better grammar) and must keep every {placeholder}; Bhashini gets the text
  // between placeholders, so it can never damage them.
  const ph = (v) => (String(v).match(/\{[^}]*\}/g) || []).sort().join('|');
  const isPh = (p) => /^\{[^}]*\}$/.test(p);
  let need = [...new Set(clean.map(([, v]) => v).filter((v) => !mem.has(lang + '|' + v)))];
  let used = 'cache';
  // 1) Shared cache in the analytics store, so each string is translated only once for everyone.
  if (need.length && hasStore()) {
    try { const got = await store.trGet(lang, need.map(H)); need.forEach((v) => { const t = got[H(v)]; if (t) mem.set(lang + '|' + v, t); }); used = 'shared-cache'; } catch (e) { console.error('[translate] cache read', e.message); }
    need = need.filter((v) => !mem.has(lang + '|' + v));
  }
  const fresh = new Set(need);
  for (const [name, fn] of prov) {
    if (!need.length) break;
    try {
      if (name === 'bhashini') {
        const parts = need.map((v) => String(v).split(/(\{[^}]*\})/));
        const units = [...new Set(parts.flat().filter((x) => x.trim() && !isPh(x)))];
        const tr = await fn(lang, units); const m = new Map(units.map((u, i) => [u, tr[i]]));
        need.forEach((v, i) => {
          if (parts[i].every((x) => !x.trim() || isPh(x) || (typeof m.get(x) === 'string' && m.get(x).trim())))
            mem.set(lang + '|' + v, parts[i].map((x) => (!x.trim() || isPh(x) ? x : x.match(/^\s*/)[0] + m.get(x).trim() + x.match(/\s*$/)[0])).join(''));
        });
      } else {
        const tr = await fn(lang, need);
        need.forEach((v, i) => { if (typeof tr[i] === 'string' && tr[i].trim() && ph(tr[i]) === ph(v)) mem.set(lang + '|' + v, tr[i]); });
      }
      used = name;
      need = need.filter((v) => !mem.has(lang + '|' + v));
    } catch (e) {
      console.error('[translate]', name, lang, e.message);
      if (hasStore()) { try { await store.ingest(new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10), new Map([['trerr:' + name, 1]]), [], [['err', { t: Date.now(), m: ('translate ' + name + ' ' + lang + ': ' + e.message).slice(0, 300), v: 'server' }]]); } catch (er) { /* ignore */ } }
    }
  }
  if (hasStore()) { const items = [...fresh].filter((v) => mem.has(lang + '|' + v)).map((v) => [H(v), v.slice(0, 2000), mem.get(lang + '|' + v)]); if (items.length) { try { await store.trPut(lang, items); } catch (e) { console.error('[translate] cache write', e.message); } } }
  if (mem.size > 20000) mem.clear();
  const out = {};
  for (const [k, v] of clean) if (mem.has(lang + '|' + v)) out[k] = mem.get(lang + '|' + v);
  if (!Object.keys(out).length) return res.status(502).json({ error: 'translation failed' });
  res.setHeader('X-Translated-By', used);
  return res.status(200).json(out);
};
