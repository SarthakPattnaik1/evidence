// Read-aloud fallback for languages the phone has no voice for (e.g. Odia on many phones).
// POST { lang, text ≤ 1400 chars } → { audio: base64 WAV }. Uses Gemini text-to-speech; nothing is stored.
const { send, ip } = require('./_lib.js');
const MODELS = () => [...new Set([process.env.GEMINI_TTS_MODEL, 'gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts', 'gemini-2.5-flash-preview-tts'].filter(Boolean))];
const NAME = { en: 'Indian English', hi: 'Hindi', bn: 'Bengali', te: 'Telugu', mr: 'Marathi', ta: 'Tamil', ur: 'Urdu', gu: 'Gujarati', kn: 'Kannada', or: 'Odia', ml: 'Malayalam', pa: 'Punjabi', as: 'Assamese', mai: 'Maithili', sat: 'Santali', ks: 'Kashmiri', ne: 'Nepali', sd: 'Sindhi', doi: 'Dogri', kok: 'Konkani', mni: 'Manipuri', brx: 'Bodo', sa: 'Sanskrit' };
const hits = new Map();
const limited = (who) => { const now = Date.now(); const a = (hits.get(who) || []).filter((t) => now - t < 60000); a.push(now); hits.set(who, a); if (hits.size > 5000) hits.clear(); return a.length > 6; };
function wav(pcmB64, rate) { const pcm = Buffer.from(pcmB64, 'base64'); const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40); return Buffer.concat([h, pcm]).toString('base64'); }
module.exports = async (req, res) => {
  if (req.method === 'GET') return send(res, 200, { ok: !!process.env.GEMINI_API_KEY });
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  if (!process.env.GEMINI_API_KEY) return send(res, 503, { error: 'Reading aloud is not set up.' });
  if (limited(ip(req))) return send(res, 429, { error: 'Please wait a minute and try again.' });
  let b = req.body; if (!b || typeof b !== 'object') { try { b = JSON.parse(String(b || '{}')); } catch (e) { b = {}; } }
  const lang = NAME[b.lang] ? b.lang : 'en';
  const text = String(b.text || '').replace(/[\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 1400);
  if (!text) return send(res, 400, { error: 'empty' });
  for (const model of MODELS()) {
    const c = new AbortController(); const tm = setTimeout(() => c.abort(), 40000);
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST', signal: c.signal, headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Read this aloud slowly and clearly in ' + NAME[lang] + ', as a calm helper: ' + text }] }], generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } } })
      });
      clearTimeout(tm);
      if (!r.ok) { if (r.status === 429) continue; continue; }
      const j = await r.json(); const part = ((((j.candidates || [])[0] || {}).content || {}).parts || []).find((p) => p.inlineData);
      if (!part) continue;
      const rate = Number((/rate=(\d+)/.exec(part.inlineData.mimeType || '') || [])[1] || 24000);
      return send(res, 200, { audio: wav(part.inlineData.data, rate) });
    } catch (e) { clearTimeout(tm); }
  }
  return send(res, 502, { error: 'Reading aloud is not available right now.' });
};
