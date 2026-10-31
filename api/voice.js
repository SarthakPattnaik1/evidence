// Saboot voice + multilingual search helper (Vercel serverless, Node 18+).
//
// POST { mode: 'audio', lang, audio: <base64 WAV, 16 kHz mono, ≤ 20 s> }
//   → { text: what the person said (their script), en: short English meaning for search }
// POST { mode: 'text', lang, text: <≤ 200 chars typed in any Indian language> }
//   → { en }
// GET  → { ok, provider }  (lets the app hide the mic when nothing is configured)
//
// Uses GEMINI_API_KEY (free tier). Nothing is stored: audio and text are passed to the model and dropped.
const { send, ip } = require('./_lib.js');

const LANG = {
  en: 'English (Indian English, may mix Hindi words)', hi: 'Hindi', bn: 'Bengali', te: 'Telugu', mr: 'Marathi', ta: 'Tamil', ur: 'Urdu', gu: 'Gujarati', kn: 'Kannada',
  or: 'Odia', ml: 'Malayalam', pa: 'Punjabi', as: 'Assamese', mai: 'Maithili', sat: 'Santali', ks: 'Kashmiri', ne: 'Nepali', sd: 'Sindhi', doi: 'Dogri',
  kok: 'Konkani', mni: 'Manipuri (Meitei)', brx: 'Bodo', sa: 'Sanskrit'
};
const MAX_AUDIO = 1_600_000;   // base64 chars ≈ 1.2 MB WAV ≈ 37 s at 16 kHz mono; the app stops at 20 s
const MAX_TEXT = 200;
const hits = new Map();         // per-instance rate limit: ip -> [timestamps]
const limited = (who) => { const now = Date.now(); const a = (hits.get(who) || []).filter((t) => now - t < 60000); a.push(now); hits.set(who, a); if (hits.size > 5000) hits.clear(); return a.length > 12; };
const cache = new Map();        // text-mode cache: lang|text -> en

async function readBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) { try { return JSON.parse(String(req.body)); } catch (e) { return {}; } }
  return new Promise((resolve) => { let d = ''; req.on('data', (c) => { d += c; if (d.length > MAX_AUDIO + 4096) { resolve({ tooBig: true }); req.destroy(); } }); req.on('end', () => { try { resolve(JSON.parse(d || '{}')); } catch (e) { resolve({}); } }); req.on('error', () => resolve({})); });
}

let GEM_OK = null;
const MODELS = () => [...new Set([process.env.GEMINI_VOICE_MODEL, GEM_OK, 'gemini-flash-latest', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-lite-latest'].filter(Boolean))];
async function gemini(parts) {
  let last;
  for (const model of MODELS()) {
    const c = new AbortController(); const timer = setTimeout(() => c.abort(), 25000);
    let r;
    try {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST', signal: c.signal, headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: { responseMimeType: 'application/json', temperature: 0 } })
      });
    } catch (e) { clearTimeout(timer); last = new Error('network/timeout'); continue; }
    clearTimeout(timer);
    if (r.ok) {
      const j = await r.json(); GEM_OK = model;
      const txt = ((((j.candidates || [])[0] || {}).content || {}).parts || []).filter((x) => !x.thought).map((x) => x.text || '').join('');
      const m = txt.match(/\{[\s\S]*\}/); if (!m) throw new Error('bad model output');
      return JSON.parse(m[0]);
    }
    last = new Error('gemini ' + model + ' ' + r.status); last.status = r.status;
    if (r.status === 429) throw last;
  }
  throw last || new Error('no model');
}


// Voice prompt. Tested live (Oct 2026) with synthetic speech in Odia, Tamil, Hindi, Bengali, Telugu, Malayalam, Kannada.
// Odia was being heard as Bengali, so the prompt spells out how to tell close languages apart and to prefer the app language.
const PROMPT = (lang) => {
  const name = LANG[lang] || LANG.en;
  return 'Transcribe this voice recording. A person in India is describing a legal problem.\n'
    + 'Step 1 — identify the language actually spoken. It can be any Indian language (Hindi, Bengali, Odia, Assamese, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Punjabi, Urdu, Maithili, Santali, Nepali, Konkani, Manipuri, Bodo, Dogri, Kashmiri, Sindhi, Sanskrit) or English, often mixed with English words.\n'
    + 'Close languages: Odia, Bengali and Assamese sound alike. Odia uses words like ମୁଁ (mun), ମୋ (mo), କଣ (kana), କରିବି (karibi), ଅଛି (achhi), କରିଛି (karichhi), ପଡ଼ୋଶୀ (padoshi). Bengali uses আমি (ami), আমার (amar), করব (korbo), আছে (achhe). Assamese uses মই (moi), মোৰ (mor). Hindi and Marathi, Hindi and Urdu, Tamil and Malayalam, Kannada and Telugu are also close — listen for their own words.\n'
    + (lang !== 'en' ? 'The app is set to ' + name + '. If the speech could be ' + name + ', it is ' + name + '.\n' : '')
    + 'Step 2 — write exactly what they said in that language’s own script (Odia in ଓଡ଼ିଆ script, Bengali in বাংলা, Tamil in தமிழ், Hindi in देवनागरी, Urdu in اردو, Santali in Ol Chiki, Manipuri in Meitei Mayek). Never write one language in another language’s script.\n'
    + 'Step 3 — give a short, plain English phrase (max 12 words) saying what legal problem they describe.\n'
    + 'If there is no clear speech, use empty strings. Do not add advice. Reply only as JSON: {"lang": "<ISO 639-1 or 639-3 code>", "text": "...", "en": "..."}';
};

const clean = (s, n) => String(s || '').replace(/[\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);

const handler = async (req, res) => {
  const configured = !!process.env.GEMINI_API_KEY;
  if (req.method === 'GET') return send(res, 200, { ok: configured, provider: configured ? 'gemini' : null });
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });
  if (!configured) return send(res, 503, { error: 'Voice is not set up on this server.' });
  if (limited(ip(req))) return send(res, 429, { error: 'Too many requests. Please wait a minute.' });
  const b = await readBody(req);
  if (b.tooBig) return send(res, 413, { error: 'Recording too long.' });
  const lang = LANG[b.lang] ? b.lang : 'en'; const name = LANG[lang];
  try {
    if (b.mode === 'text') {
      const text = clean(b.text, MAX_TEXT); if (!text) return send(res, 400, { error: 'empty' });
      const key = lang + '|' + text.toLowerCase();
      if (cache.has(key)) return send(res, 200, { en: cache.get(key) });
      const out = await gemini([{ text: 'A person in India typed this into a legal-help search box. The app is set to ' + name + ', but the text may be in any Indian language or script, mixed or romanised. '
        + 'Give a short, plain English phrase (max 12 words) that says what legal problem they describe. Keep names of apps, banks, laws and places. '
        + 'Do not add advice. Reply only as JSON: {"en": "..."}\n\nTEXT: ' + JSON.stringify(text) }]);
      const en = clean(out.en, 160);
      if (cache.size > 2000) cache.clear(); cache.set(key, en);
      return send(res, 200, { en });
    }
    if (b.mode === 'audio') {
      const audio = String(b.audio || '');
      if (!audio || audio.length > MAX_AUDIO || !/^[A-Za-z0-9+/=]+$/.test(audio.slice(0, 2000))) return send(res, 400, { error: 'bad audio' });
      const out = await gemini([
        { inlineData: { mimeType: 'audio/wav', data: audio } },
        { text: PROMPT(lang) }
      ]);
      return send(res, 200, { text: clean(out.text, 300), en: clean(out.en, 160), spoken: clean(out.lang, 8) });
    }
    return send(res, 400, { error: 'mode' });
  } catch (e) {
    return send(res, e.status === 429 ? 429 : 502, { error: e.status === 429 ? 'Voice is busy right now. Please type instead.' : 'Could not understand the recording. Please try again or type.' });
  }
};
module.exports = handler;
module.exports.PROMPT = PROMPT;
