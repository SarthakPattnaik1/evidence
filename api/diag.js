// Private live diagnostics for translation and voice speed/accuracy. Locked: needs ?t=<token> whose SHA-256 matches below.
const { send, crypto } = require('./_lib.js');
const HASH = '4f0e33dff7722513fae43b8caee6764e83162c65022b4370c1c7f392075defaa';
const KEY = () => process.env.GEMINI_API_KEY;
const base = 'https://generativelanguage.googleapis.com/v1beta/models/';
async function call(model, parts, gc, ms = 50000) {
  const c = new AbortController(); const tm = setTimeout(() => c.abort(), ms); const t0 = Date.now();
  try {
    const r = await fetch(base + model + ':generateContent', { method: 'POST', signal: c.signal, headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY() }, body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: gc || {} }) });
    const j = await r.json(); clearTimeout(tm);
    if (!r.ok) return { ok: false, status: r.status, ms: Date.now() - t0, err: JSON.stringify(j.error || j).slice(0, 200) };
    const p = (((j.candidates || [])[0] || {}).content || {}).parts || [];
    return { ok: true, ms: Date.now() - t0, text: p.filter((x) => !x.thought).map((x) => x.text || '').join(''), audio: (p.find((x) => x.inlineData) || {}).inlineData };
  } catch (e) { clearTimeout(tm); return { ok: false, ms: Date.now() - t0, err: String(e.message || e) }; }
}
function wav(pcmB64, rate) { const pcm = Buffer.from(pcmB64, 'base64'); const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40); return Buffer.concat([h, pcm]).toString('base64'); }
const SAY = { or: 'ମୋ ପଡ଼ୋଶୀ ମୋ ଜମି ଦଖଲ କରିଛି, ମୁଁ କଣ କରିବି', ta: 'என் கைபேசி திருடப்பட்டது, நான் என்ன செய்ய வேண்டும்', hi: 'मेरे पति मुझे पैसे नहीं दे रहे हैं, बच्चों का खर्चा भी नहीं', bn: 'আমার বেতন তিন মাস ধরে দেওয়া হয়নি', te: 'నా బ్యాంక్ ఖాతా నుండి డబ్బు మోసంగా తీసుకున్నారు', mr: 'घरमालक माझे डिपॉझिट परत देत नाही', ml: 'ഒരു നായ എന്റെ മകനെ കടിച്ചു', kn: 'ನನ್ನ ಚೆಕ್ ಬೌನ್ಸ್ ಆಗಿದೆ' };
module.exports = async (req, res) => {
  const u = new URL(req.url, 'http://x'); const t = u.searchParams.get('t') || '';
  if (crypto.createHash('sha256').update(t).digest('hex') !== HASH) return send(res, 404, { error: 'not found' });
  if (!KEY()) return send(res, 200, { error: 'no GEMINI_API_KEY' });
  const what = u.searchParams.get('what') || 'models';
  if (what === 'models') {
    const r = await fetch(base + '?pageSize=200', { headers: { 'x-goog-api-key': KEY() } }); const j = await r.json();
    return send(res, 200, { models: (j.models || []).filter((m) => /flash|tts|lite|audio/i.test(m.name)).map((m) => m.name.replace('models/', '') + ' [' + (m.supportedGenerationMethods || []).join(',') + ']') });
  }
  if (what === 'speed') {
    const S = { a: 'Cheque bounce', b: 'What papers do I need?', c: 'Your answers stay on your phone. They are never sent to us.', d: 'Call 1930 fast — money can still be frozen.', e: 'Take these to your advocate' };
    const prompt = 'Translate the JSON values into Odia (ଓଡ଼ିଆ script). Return JSON with the same keys.\n\n' + JSON.stringify(S);
    const cfgs = (u.searchParams.get('m') || 'gemini-flash-lite-latest,gemini-flash-latest').split(',').flatMap((m) => [[m, {}], [m, { thinkingConfig: { thinkingBudget: 0 } }], [m, { thinkingConfig: { thinkingLevel: 'minimal' } }], [m, { thinkingConfig: { thinkingLevel: 'low' } }]]);
    const out = await Promise.all(cfgs.map(async ([m, g]) => { const r = await call(m, [{ text: prompt }], Object.assign({ responseMimeType: 'application/json', temperature: 0.2 }, g)); return { m, g: JSON.stringify(g.thinkingConfig || 'default'), ok: r.ok, ms: r.ms, out: (r.text || r.err || '').slice(0, 160) }; }));
    return send(res, 200, { speed: out });
  }
  if (what === 'voice') {
    const tts = u.searchParams.get('tts') || 'gemini-2.5-flash-preview-tts'; const stt = u.searchParams.get('stt') || 'gemini-flash-latest';
    const sttCfg = u.searchParams.get('think') === 'off' ? { thinkingConfig: { thinkingBudget: 0 } } : u.searchParams.get('think') === 'min' ? { thinkingConfig: { thinkingLevel: 'minimal' } } : {};
    const langs = (u.searchParams.get('l') || 'or,ta,hi').split(',');
    const out = await Promise.all(langs.map(async (l) => {
      const s = await call(tts, [{ text: SAY[l] }], { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } });
      if (!s.ok || !s.audio) return { l, tts: { ok: false, ms: s.ms, err: s.err || 'no audio' } };
      const rate = Number((/rate=(\d+)/.exec(s.audio.mimeType || '') || [])[1] || 24000);
      const audio = wav(s.audio.data, rate);
      const prompt = require('./voice.js').PROMPT(u.searchParams.get('app') || 'en');
      const r = await call(stt, [{ inlineData: { mimeType: 'audio/wav', data: audio } }, { text: prompt }], Object.assign({ responseMimeType: 'application/json', temperature: 0 }, sttCfg));
      return { l, said: SAY[l], ttsMs: s.ms, kb: Math.round(audio.length * 0.75 / 1024), stt: { ok: r.ok, ms: r.ms, out: (r.text || r.err || '').slice(0, 300) } };
    }));
    return send(res, 200, { tts, stt, think: u.searchParams.get('think') || 'default', voice: out });
  }
  return send(res, 400, { error: 'what?' });
};
