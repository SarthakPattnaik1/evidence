// Read my list aloud, in a natural human voice, in any of Saboot's languages.
// POST { lang, text ≤ 900 chars (one chunk of the spoken script), part } → { audio: base64 WAV }.
// Gemini text-to-speech, directed like a voice actor (profile, scene, director's notes). Nothing is stored.
const { send, ip, body: readBody } = require('./_lib.js');
const MODELS = () => [...new Set([process.env.GEMINI_TTS_MODEL, 'gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts', 'gemini-2.5-flash-preview-tts'].filter(Boolean))];
const NAME = { en: 'Indian English', hi: 'Hindi', bn: 'Bengali', te: 'Telugu', mr: 'Marathi', ta: 'Tamil', ur: 'Urdu', gu: 'Gujarati', kn: 'Kannada', or: 'Odia', ml: 'Malayalam', pa: 'Punjabi', as: 'Assamese', mai: 'Maithili', sat: 'Santali', ks: 'Kashmiri', ne: 'Nepali', sd: 'Sindhi', doi: 'Dogri', kok: 'Konkani', mni: 'Manipuri', brx: 'Bodo', sa: 'Sanskrit' };
const hits = new Map();
const limited = (who) => { const now = Date.now(); const a = (hits.get(who) || []).filter((t) => now - t < 60000); a.push(now); hits.set(who, a); if (hits.size > 5000) hits.clear(); return a.length > 24; };
// How people actually speak each language at home — keeps the voice from sounding bookish or like a news reader.
const SPOKEN = { hi: 'everyday spoken Hindi with natural Hindustani pronunciation; English words such as "cheque", "bank" and "advocate" said the way Indians say them', ur: 'everyday spoken Urdu', bn: 'everyday spoken Bengali', mr: 'everyday spoken Marathi', ta: 'everyday spoken Tamil (not formal written Tamil)', te: 'everyday spoken Telugu', kn: 'everyday spoken Kannada', ml: 'everyday spoken Malayalam', gu: 'everyday spoken Gujarati', pa: 'everyday spoken Punjabi', or: 'everyday spoken Odia', as: 'everyday spoken Assamese', en: 'warm Indian English' };
const VOICE = process.env.SPEAK_VOICE || 'Sulafat';
const direct = (lang, text, part) => `# AUDIO PROFILE: Meera, a kind, calm woman in her thirties who helps people get ready to meet a lawyer.\n## THE SCENE: She is sitting beside someone who is worried about a legal problem, going through their list with them, one paper at a time.\n### DIRECTOR'S NOTES\nLanguage: ${SPOKEN[lang] || 'natural spoken ' + NAME[lang]}. Read the transcript exactly as written — do not add, drop or change any words.\nStyle: warm, reassuring and human, like a helpful elder sister — never robotic, never like an announcement or a news reader.\nPace: unhurried. A short natural pause after each paper, and a slightly longer one before moving on to the next.\nIntonation: natural rise and fall; gentle emphasis on the name of each paper.${part ? '\nThis continues an ongoing reading — no greeting, just carry on in the same voice.' : ''}\n#### TRANSCRIPT\n${text}`;
function wav(pcmB64, rate) { const pcm = Buffer.from(pcmB64, 'base64'); const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40); return Buffer.concat([h, pcm]).toString('base64'); }
module.exports = async (req, res) => {
  if (req.method === 'GET') return send(res, 200, { ok: !!process.env.GEMINI_API_KEY });
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  if (!process.env.GEMINI_API_KEY) return send(res, 503, { error: 'Reading aloud is not set up.' });
  if (limited(ip(req))) return send(res, 429, { error: 'Please wait a minute and try again.' });
  let b = req.body; if (b == null) b = await readBody(req); if (typeof b !== 'object') { try { b = JSON.parse(String(b || '{}')); } catch (e) { b = {}; } }
  const lang = NAME[b.lang] ? b.lang : 'en';
  const text = String(b.text || '').replace(/[\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 900);
  const part = Number(b.part) || 0;
  if (!text) return send(res, 400, { error: 'empty' });
  for (const model of MODELS()) {
    const c = new AbortController(); const tm = setTimeout(() => c.abort(), 40000);
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST', signal: c.signal, headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: direct(lang, text, part) }] }], generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } } } })
      });
      clearTimeout(tm);
      if (!r.ok) { if (r.status === 429) continue; continue; }
      const j = await r.json(); const aud = ((((j.candidates || [])[0] || {}).content || {}).parts || []).find((p) => p.inlineData);
      if (!aud) continue;
      const rate = Number((/rate=(\d+)/.exec(aud.inlineData.mimeType || '') || [])[1] || 24000);
      return send(res, 200, { audio: wav(aud.inlineData.data, rate) });
    } catch (e) { clearTimeout(tm); }
  }
  return send(res, 502, { error: 'Reading aloud is not available right now.' });
};
