// Translate every app string ahead of time into src/tr/<lang>.json (English -> language).
// Resumable: saves after every batch; re-runs only translate what is missing or changed.
// Usage: GEMINI_API_KEY=... node tools/pretranslate.js [hi,bn,...]   (env MAX_MINUTES, default 40)
const fs = require('fs'); const path = require('path');
const STRINGS = require('./strings.js');
const DIR = path.join(__dirname, '..', 'src', 'tr'); fs.mkdirSync(DIR, { recursive: true });
const KEY = process.env.GEMINI_API_KEY; if (!KEY) { console.error('Set GEMINI_API_KEY'); process.exit(1); }
const ORDER = 'hi bn or ur sd mr te ta gu kn ml pa as ks ne mai kok doi sat mni brx sa'.split(' ');
const NAMES = { hi: ['Hindi', 'हिन्दी'], bn: ['Bengali', 'বাংলা'], te: ['Telugu', 'తెలుగు'], mr: ['Marathi', 'मराठी'], ta: ['Tamil', 'தமிழ்'], ur: ['Urdu', 'اردو', 'Urdu (Nastaliq/Naskh) script'], gu: ['Gujarati', 'ગુજરાતી'], kn: ['Kannada', 'ಕನ್ನಡ'], or: ['Odia', 'ଓଡ଼ିଆ'], ml: ['Malayalam', 'മലയാളം'], pa: ['Punjabi', 'ਪੰਜਾਬੀ'], as: ['Assamese', 'অসমীয়া'], mai: ['Maithili', 'मैथिली'], sat: ['Santali', 'ᱥᱟᱱᱛᱟᱲᱤ', 'Ol Chiki script'], ks: ['Kashmiri', 'کٲشُر', 'Perso-Arabic script'], ne: ['Nepali', 'नेपाली'], sd: ['Sindhi', 'سنڌي', 'Perso-Arabic script'], doi: ['Dogri', 'डोगरी'], kok: ['Konkani', 'कोंकणी', 'Devanagari script'], mni: ['Manipuri', 'ꯃꯤꯇꯩꯂꯣꯟ', 'Meitei Mayek script'], brx: ['Bodo', 'बड़ो', 'Devanagari script'], sa: ['Sanskrit', 'संस्कृतम्', 'Devanagari script'] };
const langs = (process.argv[2] ? process.argv[2].split(',') : ORDER).filter((l) => NAMES[l]);
const deadline = Date.now() + (Number(process.env.MAX_MINUTES) || 40) * 60000;
// fast models first: the 'thinking' flash models took ~18 s a batch, which is why a 45-minute run finished only 2 languages
const MODELS = [process.env.GEMINI_MODEL, 'gemini-flash-lite-latest', 'gemini-3.5-flash-lite', 'gemini-flash-latest', 'gemini-3.5-flash'].filter(Boolean);
let okModel = null; const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ph = (v) => (String(v).match(/\{[^}]*\}/g) || []).sort().join('|');

async function gemini(prompt) {
  for (const model of [okModel, ...MODELS].filter(Boolean)) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.2 } }) });
      if (r.ok) { okModel = model; const j = await r.json(); const t = ((((j.candidates || [])[0] || {}).content || {}).parts || []).filter((x) => !x.thought).map((x) => x.text || '').join(''); const m = t.match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]) : {}; }
      const body = (await r.text()).slice(0, 300);
      if (r.status === 429) { if (/per day|PerDay|daily/i.test(body)) { const e = new Error('daily quota: ' + body); e.quota = true; throw e; } await sleep(15000 * (attempt + 1)); continue; }
      if (r.status >= 500) { await sleep(5000); continue; }
      console.warn(`  ${model} ${r.status}: ${body.replace(/\s+/g, ' ').slice(0, 160)}`); break;
    }
  }
  throw new Error('no Gemini model worked');
}

(async () => {
  for (const lang of langs) {
    const file = path.join(DIR, lang + '.json');
    const old = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
    const dict = {}; STRINGS.forEach((s) => { if (old[s]) dict[s] = old[s]; });   // drop strings the app no longer uses
    const missing = STRINGS.filter((s) => !dict[s]);
    console.log(`${lang}: ${Object.keys(dict).length}/${STRINGS.length} done, ${missing.length} to translate`);
    const [name, native, script] = NAMES[lang];
    let i = 0;
    while (i < missing.length) {
      if (Date.now() > deadline) { fs.writeFileSync(file, JSON.stringify(dict)); console.log('time budget used; saved progress'); return; }
      const batch = []; let chars = 0;
      while (i < missing.length && batch.length < 80 && chars < 7000) { batch.push(missing[i]); chars += missing[i].length; i++; }
      const obj = {}; batch.forEach((s, k) => { obj['k' + k] = s; });
      const prompt = `You are translating a free legal-help app for ordinary people in India into ${name} (${native}${script ? ', ' + script : ''}).
Rules:
- Use very simple, everyday words that a person with little schooling, or an elderly person, understands. Short sentences. Respectful tone.
- Keep unchanged: anything in {curly braces}, numbers, ₹ amounts, phone numbers, website addresses, names of Acts and sections, and common terms like FIR, UPI, RBI, PAN, NRI, OCI, PoA, KYC, GST, CIBIL, OTP, EMI, RERA, NCLT, MSME.
- Do not add, drop or soften any meaning, warning or deadline.
Return ONLY a JSON object with exactly the same keys and the translated strings as values.

${JSON.stringify(obj)}`;
      try {
        const res = await gemini(prompt); let n = 0;
        batch.forEach((s, k) => { const t = res['k' + k]; if (typeof t === 'string' && t.trim() && ph(t) === ph(s)) { dict[s] = t; n++; } });
        fs.writeFileSync(file, JSON.stringify(dict));
        process.stdout.write(`  ${lang} +${n} (${Object.keys(dict).length}/${STRINGS.length})\n`);
      } catch (e) {
        fs.writeFileSync(file, JSON.stringify(dict));
        if (e.quota) { console.log('Daily Gemini quota reached; progress saved. Run again tomorrow.'); return; }
        console.warn('  batch failed:', e.message.slice(0, 200)); await sleep(3000);
      }
      await sleep(process.env.PAUSE_MS != null ? Number(process.env.PAUSE_MS) : 4500);   // stay under free-tier requests per minute
    }
  }
  console.log('All requested languages complete.');
})();
