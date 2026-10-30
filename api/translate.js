// Pehlo translation endpoint (Vercel serverless, Node).
// Only translates text that already exists in the app's own source (checked against _corpus.js),
// so it can't be used as a free general-purpose translator.
// Needs the ANTHROPIC_API_KEY environment variable set in Vercel. Optional: TRANSLATE_MODEL.
const CORPUS = require('./_corpus.js');

const LANGS = {
  hi: ['Hindi', 'हिन्दी'], bn: ['Bengali', 'বাংলা'], te: ['Telugu', 'తెలుగు'], mr: ['Marathi', 'मराठी'], ta: ['Tamil', 'தமிழ்'],
  ur: ['Urdu', 'اردو', 'Urdu (Nastaliq/Naskh) script'], gu: ['Gujarati', 'ગુજરાતી'], kn: ['Kannada', 'ಕನ್ನಡ'], or: ['Odia', 'ଓଡ଼ିଆ'],
  ml: ['Malayalam', 'മലയാളം'], pa: ['Punjabi', 'ਪੰਜਾਬੀ'], as: ['Assamese', 'অসমীয়া'], mai: ['Maithili', 'मैथिली'],
  sat: ['Santali', 'ᱥᱟᱱᱛᱟᱲᱤ', 'Ol Chiki script'], ks: ['Kashmiri', 'کٲشُر', 'Perso-Arabic script'], ne: ['Nepali', 'नेपाली'],
  sd: ['Sindhi', 'سنڌي', 'Perso-Arabic script'], doi: ['Dogri', 'डोगरी'], kok: ['Konkani', 'कोंकणी'],
  mni: ['Manipuri', 'ꯃꯤꯇꯩꯂꯣꯟ', 'Meitei Mayek script'], brx: ['Bodo', 'बड़ो', 'Devanagari script'], sa: ['Sanskrit', 'संस्कृतम्', 'Devanagari script']
};
const MAX_KEYS = 400, MAX_CHARS = 40000;
const norm = (s) => String(s).replace(/\$\{[^}]*\}/g, '').replace(/[\\'"`\s]/g, '').toLowerCase();
const NC = norm(CORPUS);
const mem = new Map(); // warm-instance cache

function known(v) {
  // Strip {placeholders} and split on them; every piece of 4+ chars must exist in the source.
  return String(v).split(/\{[^}]*\}/).map(norm).filter((p) => p.length >= 4).every((p) => NC.includes(p));
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(501).json({ error: 'translation not configured' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = null; } }
  const lang = body && body.lang; const map = body && body.map;
  if (!LANGS[lang] || !map || typeof map !== 'object' || Array.isArray(map)) return res.status(400).json({ error: 'bad request' });
  const entries = Object.entries(map).filter(([k, v]) => typeof k === 'string' && k.length < 80 && typeof v === 'string');
  const chars = entries.reduce((n, [, v]) => n + v.length, 0);
  if (!entries.length || entries.length > MAX_KEYS || chars > MAX_CHARS) return res.status(413).json({ error: 'too large' });
  const clean = {};
  for (const [k, v] of entries) if (known(v)) clean[k] = v;
  if (!Object.keys(clean).length) return res.status(400).json({ error: 'unknown text' });

  const ck = lang + '|' + JSON.stringify(clean);
  if (mem.has(ck)) return res.status(200).json(mem.get(ck));

  const [name, native, script] = LANGS[lang];
  const prompt = `You are translating a free legal-help app for ordinary people in India into ${name} (${native}${script ? ', ' + script : ''}).
Rules:
- Use very simple, everyday words that a person with little schooling, or an elderly person, understands. Short sentences. Respectful tone.
- Keep unchanged: anything in {curly braces}, numbers, ₹ amounts, phone numbers, website addresses, names of Acts and sections, and common terms like FIR, UPI, RBI, PAN, NRI, OCI, PoA, KYC, GST, CIBIL, OTP, EMI, RERA, NCLT, MSME.
- Do not add, drop or soften any meaning, warning or deadline.
Return ONLY a JSON object with exactly the same keys and the translated strings as values.

${JSON.stringify(clean)}`;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: process.env.TRANSLATE_MODEL || 'claude-sonnet-5-5', max_tokens: 16000, messages: [{ role: 'user', content: prompt }] })
    });
    if (!r.ok) return res.status(502).json({ error: 'upstream ' + r.status });
    const j = await r.json();
    const txt = (j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
    const m = txt.match(/\{[\s\S]*\}/);
    const parsed = m ? JSON.parse(m[0]) : {};
    const out = {};
    for (const k of Object.keys(clean)) if (typeof parsed[k] === 'string' && parsed[k].trim()) out[k] = parsed[k];
    if (mem.size > 500) mem.clear();
    mem.set(ck, out);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(out);
  } catch (e) {
    return res.status(502).json({ error: 'translation failed' });
  }
};
