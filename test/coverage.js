/* Coverage against official complaint categories (Nov 2026).
   Each category people are routed by in India must lead somewhere real in Saboot: a guide (g:) or a situation (s:).
   Sources: National Consumer Helpline sectors (consumerhelpline.gov.in reports; Rajya Sabha answer, Mar 2025);
   National Cybercrime Reporting Portal categories/sub-categories (MHA citizen manual, Annexure A);
   Tele-Law advice areas (tele-law.in FAQ; Department of Justice). Run: node test/coverage.js  (writes COVERAGE.md) */
global.window = global;
['kb', 'cites', 'j-money', 'j-family', 'j-consumer', 'j-other', 'j-nri', 'j-business', 'j-more', 'j-genz', 'j-gaps', 'j-rights', 'stand', 'law-2026', 'situations', 'reviews', 'qa', 'qa2'].forEach((f) => require('../src/' + f + '.js'));
const K = global.ER_KB; const fs = require('fs'); const path = require('path');
const G = new Set(K.issues.map((i) => i.id)); const S = new Map(K.situations.map((x) => [x.t, x.g]));

const TAX = {
  'National Consumer Helpline — sectors': [
    ['E-commerce', 'g:ecommerce-order'], ['Banking', 'g:bank-service'], ['Digital payment modes', 'g:failed-payment-debited'],
    ['Non-banking financial companies (NBFC)', 'g:loan-recovery'], ['Electronics products', 'g:defective-product'], ['Consumer durables', 'g:defective-product'],
    ['Telecom', 'g:telecom-internet'], ['Broadband and internet', 'g:telecom-internet'], ['DTH and cable', 'g:telecom-internet'],
    ['General insurance', 'g:insurance-claim'], ['Life insurance', 'g:insurance-claim'], ['Travel and tourism', 'g:travel-refund'], ['Airlines', 'g:travel-refund'],
    ['Railways', 's:Train ticket refund not received'], ['Automobiles', 's:New car or bike keeps breaking down'], ['Real estate', 'g:builder-delay'],
    ['Education', 'g:education-dispute'], ['Medical and health services', 'g:medical-negligence'], ['Agency services', 's:Packers and movers damaged or held my goods'],
    ['Food (delivery and restaurants)', 's:Food delivery order was wrong, spoilt or missing'], ['Food safety and adulteration', 's:Bought adulterated or unsafe food from a shop or restaurant'],
    ['Legal metrology (MRP, short weight)', 's:Shop gave less weight or quantity than I paid for'], ['Retail outlets', 's:Shop gave a defective item and refuses exchange'],
    ['Petroleum and LPG', 's:Gas cylinder overcharged, underweight or delivery charge demanded'], ['Electricity', 'g:electricity-bill'],
    ['Water supply and municipal services', 's:No water supply or a wrong water bill from the municipality'], ['Courier and postal', 's:Courier company lost or damaged my parcel'],
    ['Direct selling / MLM', 's:Invested in a scheme that promised double money'], ['Gyms, salons and other services', 's:Gym membership — they won’t refund after closing'],
    ['Securities and mutual funds', 'g:securities-complaint']
  ],
  'Cybercrime portal — categories and sub-categories': [
    ['Debit/credit card fraud', 's:Card cloned and used at an ATM or shop'], ['SIM swap fraud', 's:SIM swapped and money taken from my bank'],
    ['Internet banking related fraud', 's:Money taken from my account by fraud — I did nothing'], ['Business fraud / email takeover', 's:A fake email changed our supplier’s bank details and we paid'],
    ['Fraud call / vishing', 's:Fake customer care number took my money'], ['E-wallet related fraud', 'g:upi-cyber-fraud'], ['UPI fraud', 'g:upi-cyber-fraud'],
    ['Online job fraud', 's:Paid a registration fee for a job that never came'], ['Online matrimonial fraud', 's:Paid a fake matrimonial or dating match who asked for money'],
    ['Cyber bullying / stalking / sexting', 'g:online-harassment'], ['Fake / impersonating profile', 's:Someone made a fake profile of me'], ['Impersonating email', 's:Fake account using my name and photos'],
    ['Intimidating email', 's:Getting death threats'], ['Profile hacking', 's:Instagram account hacked'], ['Email hacking / phishing', 's:Email hacked and password changed'],
    ['Provocative speech', 's:Hateful posts targeting my religion, caste or community'], ['Unauthorised access / data breach', 'g:account-hacked'],
    ['Ransomware', 's:Our office computers were locked by ransomware'], ['Cryptocurrency fraud', 's:Crypto platform froze my money'], ['Online trafficking', 'g:trafficking'],
    ['Online gambling', 'g:gaming-betting'], ['Sexually explicit content / morphed images', 'g:intimate-images'], ['Child sexual abuse material', 's:Leaked photos of someone under 18'],
    ['Loan app harassment', 'g:loan-app-harassment'], ['Fake police / “digital arrest”', 'g:digital-arrest-scam'], ['Investment / trading scams', 'g:job-investment-scam']
  ],
  'Tele-Law — advice areas': [
    ['Dowry', 'g:dowry-cruelty'], ['Family dispute', 'g:divorce-separation'], ['Divorce / talaq', 's:Muslim divorce — talaq or khula'], ['Protection from domestic violence', 'g:domestic-violence'],
    ['Sexual harassment at the workplace', 'g:workplace-harassment'], ['Sexual abuse', 'g:sexual-assault'], ['Eve teasing', 's:Men follow, tease or harass me on the street'],
    ['Maintenance of women and children', 'g:maintenance'], ['Maintenance of senior citizens', 'g:parents-maintenance'], ['Land disputes', 'g:land-encroachment'],
    ['Tenancy and lease', 'g:eviction-tenancy'], ['Property and inheritance rights', 'g:inheritance-partition'], ['Equal wages for men and women', 's:Paid less than men for the same work'],
    ['Minimum wages', 's:Paid less than minimum wage'], ['Maternity benefits', 's:Employer not paying my maternity leave'], ['Prevention of child marriage', 's:A child is about to be married'],
    ['Child labour', 's:Child working in a shop or factory'], ['Atrocities against SC/ST', 'g:caste-atrocity'], ['Arrest, bail and FIR', 'g:accused-arrest'],
    ['Entitlements: certificates, pensions, schemes', 'g:govt-benefits'], ['Bank account activation', 's:Bank refuses to open an account for me'], ['Disability certificate and rights', 'g:disability-rights'],
    ['Education', 'g:education-dispute']
  ]
};

const fails = []; const md = ['# Coverage against official complaint categories', '', `Generated by test/coverage.js. ${K.issues.length - 1} guides, ${K.situations.length} situations, ${K.questions.length} answered questions.`, ''];
let total = 0;
for (const [name, rows] of Object.entries(TAX)) {
  md.push('## ' + name, '', '| Category | Saboot |', '|---|---|');
  for (const [cat, target] of rows) {
    total++; const [kind, val] = [target.slice(0, 1), target.slice(2)];
    let ok = false, label = '';
    if (kind === 'g') { ok = G.has(val); label = 'Guide: ' + (ok ? K.issues.find((i) => i.id === val).short : val); }
    if (kind === 's') { ok = S.has(val); label = 'Situation: “' + val + '”' + (ok ? ' → ' + K.issues.find((i) => i.id === S.get(val)).short : ''); }
    if (!ok) fails.push(`${name}: “${cat}” → ${target} does not exist`);
    md.push(`| ${cat} | ${ok ? '' : 'MISSING — '}${label} |`);
  }
  md.push('');
}
fs.writeFileSync(path.join(__dirname, '..', 'COVERAGE.md'), md.join('\n'));
fails.forEach((f) => console.log('FAIL', f));
console.log(`coverage: ${total - fails.length}/${total} official categories lead somewhere real`);
if (fails.length) process.exit(1); console.log('COVERAGE OK');
