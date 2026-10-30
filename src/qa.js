/* Legal questions (answer-first explainers) and Myth-or-Fact cards. Draft, not advocate-reviewed. */
(function (root) {
  const KB = root.ER_KB;
  const Q = (cat, id, q, a, depends, law, journey, kw = []) => KB.questions.push({ cat, id, q, a, depends, law, journey, kw });

  /* ---------- Family ---------- */
  Q('family', 'mutual-divorce-time', 'How long does a mutual consent divorce take?',
    'Under the Hindu Marriage Act, a couple must usually have lived separately for at least a year before filing jointly. After the first motion there is a six-month waiting period before the final decree, which courts can waive in suitable cases. In practice many cases finish in 6 to 18 months.',
    ['Which law your marriage falls under', 'Whether all terms (money, children, belongings) are agreed', 'Whether the court agrees to waive the waiting period'],
    'Hindu Marriage Act s.13B; Special Marriage Act s.28; Amardeep Singh v. Harveen Kaur (2017)', 'divorce-separation', ['mutual divorce', 'divorce time', 'cooling period']);
  Q('family', 'divorce-grounds', 'On what grounds can I file for divorce without my spouse\'s consent?',
    'Common grounds include cruelty, desertion for two years, adultery, conversion, serious mental disorder and not being heard of for seven years. The exact grounds depend on the personal law or the Special Marriage Act that applies. Cruelty includes serious mental cruelty, not only physical violence.',
    ['Personal law that governs your marriage', 'The evidence available for the ground', 'How long you have been separated'], 'Hindu Marriage Act s.13; Special Marriage Act s.27; Divorce Act 1869', 'divorce-separation', ['contested divorce', 'grounds of divorce', 'cruelty']);
  Q('family', 'wife-maintenance', 'Can a wife claim maintenance, and how much?',
    'Yes. A wife, children and parents who cannot maintain themselves can claim maintenance, including during a divorce case. Courts consider both sides\' income, needs and lifestyle; both parties usually file a sworn affidavit of income and assets. There is no fixed percentage.',
    ['Both spouses\' income and assets', 'Children\'s needs', 'Which law and forum the claim is filed under'], 'BNSS s.144 (formerly CrPC 125); Hindu Adoptions & Maintenance Act; DV Act; Rajnesh v. Neha (2020)', 'maintenance', ['alimony', 'maintenance amount', 'interim maintenance']);
  Q('family', 'husband-maintenance', 'Can a husband claim maintenance from his wife?',
    'Under the Hindu Marriage Act, either spouse can seek maintenance during and after divorce proceedings if they lack independent income. Under the general BNSS provision, only a wife (not a husband) can claim from a spouse.',
    ['Which law the case is under', 'Each spouse\'s earning capacity'], 'Hindu Marriage Act ss.24–25; BNSS s.144', 'maintenance', ['husband alimony']);
  Q('family', 'custody-mother', 'Does the mother always get custody of the child?',
    'Not always. The child\'s welfare is the paramount consideration. Under Hindu law, custody of a child under five is ordinarily with the mother, but courts can decide differently. The other parent usually gets visiting rights.',
    ['Child\'s age and wishes', 'Who has been the primary carer', 'Any safety concerns'], 'Guardians and Wards Act 1890; Hindu Minority and Guardianship Act 1956 s.6', 'child-custody', ['child custody', 'who gets child']);
  Q('family', 'daughter-share', 'Does a married daughter have a share in her father\'s property?',
    'Yes, for Hindu families. Since the 2005 amendment, a daughter is a coparcener in ancestral (joint family) property by birth, with the same rights as a son, whether married or not. She also inherits her father\'s self-acquired property equally with other Class I heirs if he died without a will.',
    ['Whether the property is ancestral or self-acquired', 'Whether there is a valid will', 'Whether a partition was completed before 20 Dec 2004'], 'Hindu Succession Act s.6 (2005 amendment); Vineeta Sharma v. Rakesh Sharma (2020)', 'inheritance-partition', ['daughter right', 'sister share', 'father property']);
  Q('family', 'succession-vs-heir', 'What is the difference between a succession certificate and a legal heir certificate?',
    'A succession certificate is issued by a civil court and is mainly used to collect debts and securities of a deceased person — like bank deposits and shares. A legal heir certificate is issued by the state revenue authority and identifies the heirs for purposes such as pensions, utilities and mutation.',
    ['The asset you want to claim', 'Whether there is a will (then probate or letters of administration may be needed)'], 'Indian Succession Act, Part X', 'inheritance-partition', ['succession certificate', 'legal heir certificate']);
  Q('family', 'nominee-owner', 'Does the nominee become the owner of a deceased person\'s bank account or policy?',
    'Generally no. A nominee receives the money but holds it for the legal heirs, who are entitled to it under succession law or the will. Some special rules apply to shares and insurance — ask an advocate about your asset.',
    ['Type of asset', 'Whether there is a will'], 'Shakti Yezdani v. Jayanand Salgaonkar (2023)', 'inheritance-partition', ['nominee rights']);
  Q('family', 'dv-what', 'What counts as domestic violence?',
    'Domestic violence includes physical, sexual, verbal, emotional and economic abuse by a husband, partner or his relatives — not only beating. Economic abuse includes withholding money, stridhan or access to the shared home. A Magistrate can order protection, residence, monetary relief and custody.',
    ['The relationship and shared household', 'Kind of abuse'], 'Protection of Women from Domestic Violence Act 2005', 'domestic-violence', ['domestic violence meaning', 'dv act']);
  Q('family', 'stridhan', 'What is stridhan, and can I get it back?',
    'Stridhan is property a woman receives — gifts, jewellery, money — before, at or after marriage. It belongs to her alone, even if in-laws keep it. She can demand it back, and refusing can be an offence.',
    ['Proof of what was given (photos, bills, lists)', 'Who holds it now'], 'Hindu Succession Act s.14; Pratibha Rani v. Suraj Kumar (1985)', 'domestic-violence', ['stridhan return', 'jewellery']);

  /* ---------- Money ---------- */
  Q('money', 'cheque-bounce-steps', 'My cheque bounced. What are the steps and deadlines?',
    'Present the cheque within its validity (generally three months). If it bounces, send a written demand notice within 30 days of learning of it. The issuer then has 15 days to pay. If they don\'t, file a complaint within one month after those 15 days end.',
    ['The reason on the return memo', 'Whether the cheque was for a legally enforceable debt', 'Exact dates'], 'Negotiable Instruments Act ss.138, 142', 'cheque-bounce', ['cheque bounce', '138']);
  Q('money', 'cheque-bounce-jail', 'Can I go to jail for a bounced cheque?',
    'A cheque bounce is a criminal offence punishable with up to two years\' imprisonment or a fine up to twice the cheque amount, or both. In practice, many cases end in settlement (compounding), which courts encourage at any stage.',
    ['Whether a debt was owed', 'Whether you settle'], 'Negotiable Instruments Act ss.138, 147', 'cheque-bounce', ['cheque bounce punishment']);
  Q('money', 'upi-fraud-first', 'I lost money to a UPI/online fraud. What should I do first?',
    'Report immediately on 1930 or cybercrime.gov.in, and inform your bank in writing. Speed matters — the faster you report, the better the chance of the money being put on hold, and the stronger your position with the bank.',
    ['When the fraud happened and when you reported', 'Whether you shared an OTP or were tricked'], 'RBI customer liability framework (revised rules from 1 Jan 2027)', 'upi-cyber-fraud', ['upi fraud', 'cyber fraud', 'refund fraud']);
  Q('money', 'bank-liability', 'Will my bank refund money taken by fraud?',
    'If the fraud was due to the bank\'s fault, you should bear nothing. For third-party fraud (not your or the bank\'s fault), your liability is zero if you report quickly — 3 working days under the rules for transactions until 31 Dec 2026, and 5 calendar days from 1 Jan 2027. If you shared credentials, you may bear the loss until you report it.',
    ['Date of the transaction', 'How quickly you reported', 'Whether you shared OTP/PIN'], 'RBI 2017 circular; RBI Responsible Business Conduct Directions (amended 2026)', 'upi-cyber-fraud', ['bank refund fraud', 'zero liability']);
  Q('money', 'failed-upi', 'Money got debited but the UPI payment failed. When will I get it back?',
    'Under RBI\'s timelines, failed UPI transfers to a person should be reversed by the next day (T+1); payments to merchants within 5 days (T+5). If the bank is late, it owes ₹100 per day of delay.',
    ['Type of payment', 'Whether the beneficiary was credited'], 'RBI circular on TAT for failed transactions (2019)', 'failed-payment-debited', ['upi failed', 'money debited']);
  Q('money', 'recovery-agent', 'What can recovery agents legally do?',
    'They can contact you to recover dues, but must not threaten, abuse, humiliate, or contact your friends and relatives to shame you. RBI rules restrict calls to between 8 am and 7 pm. Complain to the lender and then the RBI Ombudsman; threats can be reported to police.',
    ['Whether the lender is RBI-regulated', 'What exactly was said or done'], 'RBI directions on recovery agents and digital lending', 'loan-recovery', ['recovery agent harassment', 'loan harassment']);
  Q('money', 'sarfaesi', 'The bank sent a SARFAESI notice. Will I lose my house?',
    'A demand notice gives you 60 days to pay. You can send written objections, which the bank must answer. If the bank later takes possession, you can challenge it before the Debts Recovery Tribunal, usually within 45 days. Restructuring or settlement is often still possible.',
    ['Amount due and loan type', 'Whether procedure was followed'], 'SARFAESI Act ss.13(2), 13(3A), 13(4), 17', 'loan-recovery', ['sarfaesi notice', '13(2)', 'bank auction']);
  Q('money', 'card-closure', 'My bank isn\'t closing my credit card. What can I do?',
    'Under RBI rules, a closure request should be completed within 7 working days if there are no dues. After that, the issuer must pay you ₹500 per day of delay until the card is closed.',
    ['Whether dues are pending', 'Date of your request'], 'RBI Master Direction on Credit and Debit Cards (2022)', 'credit-card-dispute', ['close credit card']);
  Q('money', 'cibil-correction', 'How do I correct a wrong entry in my CIBIL report?',
    'Raise a dispute with the credit bureau (and the lender). The correction should be done within 30 days; RBI rules provide compensation of ₹100 per day for delay beyond that.',
    ['Who caused the error', 'Proof you have'], 'RBI framework on credit information compensation (2023)', 'credit-report-error', ['cibil', 'credit score correction']);
  Q('money', 'money-lent-no-paper', 'I lent money without any written agreement. Can I still recover it?',
    'Possibly. Bank transfers, messages asking for the money or promising to repay, and part-payments can together prove a loan. Money claims generally have a three-year limit, which a written acknowledgement or part-payment can extend.',
    ['How the money was given', 'Any written acknowledgement', 'Date of the loan and last acknowledgement'], 'Limitation Act ss.18–19; Order XXXVII CPC (summary suits)', 'money-lent-not-returned', ['recover money', 'hand loan']);

  /* ---------- Shopping ---------- */
  Q('shopping', 'consumer-complaint', 'How do I file a consumer complaint?',
    'First complain to the seller in writing, and try the National Consumer Helpline (1915). If unresolved, file on e-Jagriti before the District Commission (if you paid up to ₹50 lakh), the State Commission (₹50 lakh–₹2 crore), or the National Commission (above ₹2 crore). You can file without a lawyer.',
    ['Amount paid', 'Where you live or the seller works', 'Time since the problem (generally 2 years)'], 'Consumer Protection Act 2019; Jurisdiction Rules 2021', 'refund-refused', ['consumer court', 'e-jagriti', 'consumer forum']);
  Q('shopping', 'consumer-time', 'Is there a time limit for consumer complaints?',
    'Generally yes — two years from when the problem arose. A commission can accept a late complaint if you show sufficient cause for the delay.',
    ['When the cause of action arose', 'Reasons for delay'], 'Consumer Protection Act 2019 s.69', 'refund-refused', ['consumer limitation']);
  Q('shopping', 'insurance-rejected', 'My insurance claim was rejected. Where can I complain?',
    'First the insurer\'s grievance officer (or the IRDAI Bima Bharosa portal). If it rejects your grievance or doesn\'t reply in 30 days, you can go to the Insurance Ombudsman for free, or to a consumer commission.',
    ['The rejection reason', 'Claim amount', 'Policy wording'], 'Insurance Ombudsman Rules 2017; IRDAI regulations', 'insurance-claim', ['claim rejected', 'insurance ombudsman']);
  Q('shopping', 'rera-or-consumer', 'Builder delayed my flat: RERA or consumer court?',
    'Both are available for many buyers. RERA lets you claim a refund with interest or interest for each month of delay. Consumer commissions can also award compensation. Your advocate will advise which is faster and more suitable for your project.',
    ['Whether the project is RERA-registered', 'Whether you want a refund or the flat'], 'RERA 2016 s.18; Imperia Structures v. Anil Patni (2020)', 'builder-delay', ['rera complaint', 'flat delay']);

  /* ---------- Home ---------- */
  Q('home', 'rent-11-months', 'Why are rent agreements made for 11 months?',
    'Leases of a year or more must be registered, which costs stamp duty and registration fees. An 11-month agreement avoids that. It is still valid between the parties, but registration questions can arise if it is renewed repeatedly — check your state\'s rules.',
    ['Your state\'s stamp and rent laws', 'Duration and renewals'], 'Registration Act s.17; Transfer of Property Act s.107', 'eviction-tenancy', ['11 month agreement', 'rent agreement validity']);
  Q('home', 'landlord-evict', 'Can my landlord throw me out without a court order?',
    'No. A landlord must follow due process — usually notice and, if you don\'t leave, an eviction order. Changing locks, removing belongings or cutting water or electricity to force you out is not lawful.',
    ['State rent law', 'Rent agreement terms'], 'State rent control laws; Transfer of Property Act', 'eviction-tenancy', ['eviction', 'landlord forcing']);
  Q('home', 'deposit-return', 'How do I get my security deposit back?',
    'Ask in writing after handing over the keys, with proof of the home\'s condition and paid bills. If refused, a legal notice and then a civil or consumer claim (depending on facts) are the usual routes. Some states cap deposits.',
    ['Rent agreement', 'Condition proof', 'State law'], 'Contract Act; state rent laws', 'rental-security-deposit', ['deposit refund']);
  Q('home', 'mutation-title', 'Does mutation in land records make someone the owner?',
    'No. Mutation updates revenue records for tax and possession; it does not create or end ownership. Title is decided by deeds and, in disputes, by civil courts.',
    ['The title documents', 'How the mutation was done'], 'Settled Supreme Court position (e.g. Jitendra Singh v. State of MP, 2021)', 'land-encroachment', ['mutation', 'dakhil kharij']);
  Q('home', 'adverse-possession', 'Can someone become the owner of my land by occupying it for years?',
    'Possibly. Open, continuous and hostile possession for 12 years (30 years for government land) can lead to a claim of adverse possession. That\'s why you should act quickly when someone occupies your land.',
    ['How long they have occupied it', 'Whether you objected'], 'Limitation Act, Article 65', 'land-encroachment', ['adverse possession', '12 years']);

  /* ---------- Police ---------- */
  Q('police', 'fir-refused', 'Police are refusing to register my FIR. What can I do?',
    'Give a written complaint and get a receipt. If they still refuse, send it to the Superintendent of Police. If nothing happens, you can apply to a Magistrate to direct registration. You can also file a "zero FIR" at any station or an e-FIR.',
    ['Whether the offence is cognizable', 'Proof of refusal'], 'BNSS ss.173, 175; Lalita Kumari v. Govt of UP (2013)', 'police-complaint', ['police not registering fir', 'zero fir']);
  Q('police', 'anticipatory-bail', 'What is anticipatory bail and when do I need it?',
    'It is a court order that you will be released on bail if arrested. You can apply to the Sessions Court or High Court when you reasonably fear arrest for a non-bailable offence. Courts consider the allegations, your background and whether you will cooperate.',
    ['The offence alleged', 'Your record', 'Stage of investigation'], 'BNSS s.482 (formerly CrPC 438)', 'accused-arrest', ['anticipatory bail', 'bail']);
  Q('police', 'arrest-rights', 'What are my rights if I am arrested?',
    'You must be told the grounds of arrest, allowed to inform a relative or friend, have a lawyer, get a medical examination, and be produced before a Magistrate within 24 hours. You can get free legal aid.',
    ['Type of offence (bailable or not)'], 'Constitution Art. 22; BNSS ss.47–58; D.K. Basu guidelines', 'accused-arrest', ['arrest rights', 'arrested']);
  Q('police', 'notice-35', 'I got a police notice to appear. Will I be arrested?',
    'For offences punishable up to seven years, police generally issue a notice to appear instead of arresting. If you comply and cooperate, arrest is usually not needed unless police record reasons. See an advocate before you go.',
    ['Offence alleged', 'Whether you comply with the notice'], 'BNSS s.35 (formerly CrPC 41A); Arnesh Kumar v. State of Bihar (2014)', 'accused-arrest', ['41a notice', 'police notice']);
  Q('police', 'legal-notice-reply', 'Do I have to reply to a legal notice?',
    'There is usually no legal obligation to reply, but ignoring it can hurt you later — silence may be read against you, and some notices (like cheque notices) start strict clocks. A careful reply through an advocate is usually wise.',
    ['What the notice is about', 'The deadline'], '—', 'legal-notice-received', ['reply legal notice']);

  /* ---------- Work ---------- */
  Q('work', 'salary-not-paid', 'My employer hasn\'t paid my salary. Where do I complain?',
    'Send a written demand first. Workers can approach the labour authority under the Code on Wages; others may send a legal notice and file a civil suit or summary recovery suit. Keep proof of employment and pay.',
    ['Your role and pay', 'Type of employer', 'Amount and period'], 'Code on Wages 2019 (in force from 21 Nov 2025)', 'unpaid-salary', ['salary not paid']);
  Q('work', 'gratuity', 'When am I entitled to gratuity?',
    'Generally after five years of continuous service, on resignation, retirement, death or disablement. Under the new Social Security Code, fixed-term employees can get gratuity after one year. It is calculated at 15 days\' wages per year of service.',
    ['Length of service', 'Type of employment'], 'Code on Social Security 2020 (in force from 21 Nov 2025)', 'wrongful-termination', ['gratuity eligibility']);
  Q('work', 'posh-complaint', 'How do I complain about sexual harassment at work?',
    'Make a written complaint to your workplace\'s Internal Committee (or the district Local Committee) within three months of the last incident; this can be extended by three months. You can ask for interim relief like a transfer during the inquiry.',
    ['Workplace size', 'Date of last incident'], 'POSH Act 2013 ss.9, 12', 'workplace-harassment', ['posh', 'internal committee']);

  /* ---------- Accidents & online ---------- */
  Q('accidents', 'accident-claim-where', 'Where and how do I claim compensation after a road accident?',
    'File a claim before the Motor Accident Claims Tribunal where the accident happened, where you live or work, or where the other side lives. Compensation covers medical costs, lost income, pain and suffering, and dependency in death cases. The insurer of the vehicle is usually liable.',
    ['Police records', 'Medical and income proof', 'Whether the vehicle is insured'], 'Motor Vehicles Act ss.166, 168', 'road-accident', ['mact', 'accident claim']);
  Q('accidents', 'hit-and-run', 'What compensation is available for hit-and-run victims?',
    'A government scheme gives fixed compensation: ₹2 lakh for death and ₹50,000 for grievous injury. Apply through the claims enquiry officer (usually the SDM/tehsildar) with the FIR and medical or death papers.',
    ['FIR showing unknown vehicle'], 'Compensation to Victims of Hit and Run Motor Accidents Scheme 2022', 'road-accident', ['hit and run compensation']);
  Q('other', 'morphed-photos', 'Someone is threatening to share my private or morphed photos. What do I do?',
    'Don\'t pay. Save screenshots and links, then report at cybercrime.gov.in or call 1930, and report to the platform. Platforms must remove such content within 24 hours of a complaint.',
    ['Whether you know the person', 'Platform involved'], 'IT Act ss.66E, 67; BNS; IT Rules 2021', 'online-harassment', ['sextortion', 'morphed photo']);
  Q('other', 'rti', 'How do I file an RTI application?',
    'Write to the Public Information Officer of the department (or file online at rtionline.gov.in for central bodies), with a ₹10 fee. A reply is due within 30 days (48 hours if life or liberty is involved). If refused or not answered, file a first appeal within 30 days.',
    ['Central or state department'], 'Right to Information Act 2005 ss.6, 7, 19', null, ['rti']);

  /* ---------- Myth or fact ---------- */
  const M = (s, fact, why) => KB.myths.push({ s, fact, why });
  M('An FIR can only be filed at the police station where the crime happened.', false, 'You can file a "zero FIR" at any police station; it is then transferred.');
  M('Mutation in land records makes you the legal owner.', false, 'Mutation is a revenue entry. Ownership comes from title documents.');
  M('A married daughter has the same right as a son in ancestral property (Hindu law).', true, 'Since 2005, daughters are coparceners by birth, married or not.');
  M('If a cheque bounces, you can file a criminal case any time within three years.', false, 'You must send a notice within 30 days of learning of the bounce, and file within a month after the 15-day payment window.');
  M('Your landlord can cut your electricity to make you leave.', false, 'Eviction must follow due process. Cutting essential supplies to force you out is not lawful.');
  M('You can file a consumer complaint without a lawyer.', true, 'Consumers can file and argue their own cases on e-Jagriti.');
  M('A nominee automatically owns the money in a bank account after the holder dies.', false, 'Generally, a nominee holds the money for the legal heirs.');
  M('Recovery agents can call you any time of the day.', false, 'RBI rules restrict recovery calls to between 8 am and 7 pm.');
  M('A person arrested must be produced before a Magistrate within 24 hours.', true, 'This is a constitutional right (Article 22).');
  M('Domestic violence only means physical beating.', false, 'It includes sexual, verbal, emotional and economic abuse too.');
  M('Police must arrest the accused as soon as an FIR is filed.', false, 'For offences up to seven years, police generally issue a notice to appear first.');
  M('A failed UPI payment that was debited must be reversed by the next day.', true, 'For transfers to a person, RBI requires reversal by T+1, with ₹100/day compensation after that.');
  M('An 11-month rent agreement is invalid because it is not registered.', false, 'It is valid between the parties; the 11-month term is chosen to avoid compulsory registration.');
  M('You have to wait 24 hours before reporting a missing person.', false, 'There is no waiting period. Report immediately.');
  M('Stridhan belongs to the woman, even if her in-laws keep it.', true, 'Stridhan is her absolute property.');
  M('Settling a loan improves your credit score as much as closing it normally.', false, 'A "settled" status usually hurts your score more than "closed".');
  M('A legal notice is the same as a court order.', false, 'A notice is a demand from the other side. Only a court can issue an order.');
  M('Someone occupying your land openly for 12 years may be able to claim it.', true, 'This is adverse possession. Act promptly when someone occupies your land.');
})(globalThis);
