// Prints the values /api/e will accept, so made-up ids, numbers or sites cannot create new rows:
//   g: {guideId: [urgentId, ...]}, tel: helpline numbers the app links to, out: sites the app links to.
global.window = global;
const fs = require('fs'), path = require('path');
['kb','cites','j-money','j-family','j-consumer','j-other','j-nri','j-business','j-more','j-genz','j-gaps','j-rights','j-crucial','stand','law-2026','situations','reviews','qa','qa2'].forEach((f) => require('../src/' + f + '.js'));
const KB = global.ER_KB;
const g = {}; for (const i of KB.issues) g[i.id] = (i.urgent || []).map((u) => u.id);
const src = fs.readdirSync(path.join(__dirname, '../src')).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8')).join('\n');
const tel = new Set();
for (const h of Object.values(KB.help)) for (const s of [h.label, h.detail, h.href]) for (const m of String(s || '').matchAll(/\d[\d -]{1,14}\d/g)) { const d = m[0].replace(/\D/g, ''); if (d.length >= 3 && d.length <= 12) tel.add(d); }
for (const m of src.matchAll(/tel:(\d{3,12})/g)) tel.add(m[1]);
const out = new Set(); for (const m of src.matchAll(/https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/gi)) out.add(m[1].toLowerCase().replace(/^www\./, ''));
process.stdout.write(JSON.stringify({ g, tel: [...tel].sort(), out: [...out].sort() }));
