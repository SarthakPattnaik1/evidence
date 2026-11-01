/* Gaps found while mapping 500+ everyday situations (Nov 2026): no guide covered disability discrimination,
   stock market / mutual fund complaints, or cruelty to animals. Draft, not advocate-reviewed.
   Researched 31 Oct – 1 Nov 2026: RPwD Act 2016 ss.12, 20, 32, 34, 75, 80, 92; LSA Act 1987 s.12(d); ccpd.nic.in;
   SEBI SCORES 2.0 (investor.sebi.gov.in); BNS 2023 s.325; PCA Act 1960 s.11; ABC Rules 2023. */
(function (root) {
  const { W, ANY, o, NS, PN } = root.ER_H;
  const KB = root.ER_KB; const I = KB.issues;
  const S = (t, u) => ({ t, u });
  const SRC = {
    rpwd: S('Rights of Persons with Disabilities Act, 2016 (sections 12, 20, 32, 34, 75, 80, 92)', ''),
    lsa: S('Legal Services Authorities Act, 1987 — section 12(d)', ''),
    ccpd: S('Chief Commissioner for Persons with Disabilities — complaints', 'https://ccpd.nic.in'),
    udid: S('UDID — disability certificate portal', 'https://www.swavlambancard.gov.in'),
    nalsa: S('NALSA — free legal aid', 'https://nalsa.gov.in/legal-aid/'),
    scores: S('SEBI SCORES 2.0 — investor complaints (investor.sebi.gov.in)', ''),
    odr: S('SEBI Online Dispute Resolution (SMART ODR) — conciliation and arbitration', ''),
    bns: root.ER_CITE.ACT.bns,
    pca: S('Prevention of Cruelty to Animals Act, 1960 — section 11', ''),
    abc: S('Animal Welfare Board of India (official site) — Animal Birth Control Rules, 2023', 'https://awbi.gov.in')
  };

  /* ================= Disability: discrimination, access and benefits ================= */
  I.push({
    id: 'disability-rights', cat: 'other', title: 'Disability — denied a job, admission, access, benefit or treated unfairly', short: 'Disability rights',
    synonyms: ['disability', 'disabled', 'divyang', 'handicapped', 'person with disability', 'pwd', 'disability discrimination', 'disability certificate', 'udid', 'udid card', 'wheelchair access', 'not accessible', 'no ramp', 'blind', 'visually impaired', 'deaf', 'hearing impaired', 'sign language interpreter', 'disability quota', 'pwd quota', 'pwd reservation', 'disability pension', 'scribe for exam', 'extra time exam', 'chief commissioner disabilities', 'state commissioner disabilities', 'autism', 'dyslexia', 'cerebral palsy', 'locomotor disability'],
    intro: 'A disability gives you extra rights — a free lawyer whatever your income, a free complaint to the Disabilities Commissioner, and reservation in jobs and colleges. Your UDID card or disability certificate is the key paper.',
    juris: 'The Rights of Persons with Disabilities Act, 2016 bars discrimination on the ground of disability, and denying reasonable accommodation is discrimination. Government establishments cannot discriminate in employment or promotion (s.20) and must reserve at least 4% of posts for persons with benchmark disabilities (40% or more) (s.34); government and aided higher-education institutions must reserve at least 5% of seats with 5 years’ age relaxation (s.32). Courts, police and commissions must be accessible (s.12). Complaints go free of charge to the Chief Commissioner (central bodies and others) or the State Commissioner (state government bodies) (ss.75, 80) — by post, email or online, without a lawyer or a personal visit. Intentionally insulting or intimidating a person with disability in public view to humiliate them is punishable with 6 months to 5 years (s.92). Every person with a disability is entitled to free legal aid (Legal Services Authorities Act, s.12(d)).',
    questions: [
      { id: 'pd_what', text: 'What happened?', why: 'Each problem has its own route.', options: o([['job', 'Refused a job, promotion or fired'], ['edu', 'Refused admission, scribe, extra time or fee concession'], ['access', 'A building, bank, transport or website is not accessible'], ['benefit', 'Pension, certificate or scheme refused or delayed'], ['insult', 'Insulted, threatened or abused'], ['court', 'Need support in a court or police case']]) },
      { id: 'pd_cert', text: 'Do you have a UDID card or disability certificate?', why: 'It proves your disability and its percentage everywhere.', options: o([['yes', 'Yes'], ['applied', 'Applied, not received'], ['no', 'No'], NS]) },
      { id: 'pd_who', text: 'Who is responsible?', why: 'Central bodies go to the Chief Commissioner, state bodies to the State Commissioner.', options: o([['central', 'Central government, railways, bank or central PSU'], ['state', 'State government, municipality or state school/college'], ['private', 'Private company, school, hospital or shop'], NS]) },
      { id: 'pd_writing', text: 'Have you complained in writing to them?', why: 'A written complaint and their reply (or silence) is the first proof.', options: o([['yes', 'Yes'], ['no', 'No']]) },
      { id: 'pd_pct', text: 'What percentage of disability is on your certificate?', deep: true, chapter: 'Details', why: 'Reservation and some benefits are for “benchmark” disability — 40% or more.', options: o([['u40', 'Below 40%'], ['o40', '40% or more'], NS]) }
    ],
    evidence: [
      { id: 'pd_e_cert', name: 'UDID card or disability certificate', fact: 'Your disability and its percentage', why: 'Needed for every right, reservation and free legal aid.', where: 'swavlambancard.gov.in, or the district medical board.', preserve: 'Keep copies.' },
      { id: 'pd_e_refusal', name: 'The refusal — letter, email, message or a note of what was said, by whom and when', fact: 'You were refused or treated unfairly', why: 'The core proof of discrimination.', where: 'Your records.', preserve: 'Write down spoken refusals the same day.' },
      { id: 'pd_e_apply', name: 'Your application, advertisement or notice you responded to', fact: 'You applied and were eligible', why: 'Shows what you asked for.', where: 'Your records; the website.', preserve: '', when: W('pd_what', 'job', 'edu', 'benefit') },
      { id: 'pd_e_quota', name: 'The vacancy notice or prospectus showing PwD seats or posts (or that none were reserved)', fact: 'Reservation was due', why: 'Missing 4% / 5% reservation is a direct violation.', where: 'The advertisement or prospectus.', preserve: '', when: W('pd_what', 'job', 'edu') },
      { id: 'pd_e_photos', name: 'Photos or video of the barrier (steps, no ramp, no lift, inaccessible website screenshots)', fact: 'The place is not accessible', why: 'Shows the barrier clearly.', where: 'Your phone.', preserve: 'Note date and place.', when: W('pd_what', 'access') },
      { id: 'pd_e_witness', name: 'Names and numbers of people who saw what happened', fact: 'Independent support', why: 'Needed for an insult or threat case.', where: 'People present.', preserve: '', when: W('pd_what', 'insult') },
      { id: 'pd_e_written', name: 'Send a written complaint to the office or company and keep the receipt', fact: 'They were told', why: 'Commissioners and courts ask whether you complained first.', where: 'Email or registered post.', preserve: 'Keep the acknowledgement.', action: true, when: W('pd_writing', 'no') },
      { id: 'pd_e_needs', name: 'A short list of the support you need (ramp, interpreter, large print, scribe, extra time)', fact: 'Reasonable accommodation asked for', why: 'Denying reasonable accommodation is discrimination under the Act.', where: 'Write it yourself.', preserve: '' }
    ],
    urgent: [
      { id: 'pd_u_insult', level: 'soon', when: W('pd_what', 'insult'), title: 'Insulting a person with disability in public is a crime', text: 'Report it to the police and keep witness names. Free legal aid: 15100.', help: ['l15100', 'e112'] }
    ],
    stand: [
      { k: 'good', text: 'You are entitled to a free lawyer whatever your income — call 15100.' },
      { k: 'good', text: 'A complaint to the Disabilities Commissioner is free, needs no lawyer and can be filed online or by email.' },
      { k: 'next', when: W('pd_who', 'state'), text: 'For a state government office, complain to your State Commissioner for Persons with Disabilities.' },
      { k: 'risk', when: W('pd_cert', 'no'), text: 'Apply for a UDID card now — most rights are hard to claim without it.' },
      { k: 'risk', when: W('pd_pct', 'u40'), text: 'Reservation is for 40% or more, but you are still protected against discrimination below 40%.' }
    ],
    lawyerQs: [{ text: 'Should I go to the Disabilities Commissioner, a court, or both?' }, { text: 'What reasonable accommodation can I ask for in my case?' }],
    sources: [SRC.rpwd, SRC.lsa, SRC.ccpd, SRC.udid, SRC.nalsa]
  });

  /* ================= Stock market, demat, mutual fund ================= */
  I.push({
    id: 'securities-complaint', cat: 'money', title: 'Stock broker, demat, mutual fund or listed company problem — trades, money or shares not given', short: 'Stock broker or mutual fund problem',
    synonyms: ['stock broker', 'broker fraud', 'unauthorised trade', 'unauthorized trades', 'demat', 'demat account', 'shares not credited', 'shares missing', 'mutual fund', 'mutual fund redemption', 'sip not stopped', 'dividend not received', 'sebi complaint', 'scores', 'sebi scores', 'trading account', 'f&o loss broker', 'margin', 'ipo refund', 'ipo shares not allotted', 'investment adviser', 'research analyst', 'stock tips', 'telegram stock tips', 'pms', 'zerodha', 'groww', 'upstox', 'angel one', 'transfer of shares', 'transmission of shares', 'physical share certificate'],
    intro: 'Complaints against brokers, demat providers, mutual funds and listed companies go to SEBI’s SCORES portal — free, online, and the company must reply within 21 days. File within one year.',
    juris: 'SEBI’s SCORES 2.0 sends your complaint straight to the broker, depository participant, mutual fund, registrar or listed company, which must resolve it and file an Action Taken Report within 21 calendar days. If you are not satisfied you can ask for a first review within 15 days (by the stock exchange or depository), and then a second review by SEBI. A complaint must be filed within one year of the problem. Money disputes can go to SEBI’s online dispute resolution (SMART ODR) for conciliation and arbitration. Unregistered “tip” sellers and fake trading apps are frauds — report them to 1930 and cybercrime.gov.in.',
    questions: [
      { id: 'sc_who', text: 'Who is the problem with?', why: 'SCORES covers SEBI-registered entities; fake apps go to the cyber police.', options: o([['broker', 'Stock broker or trading app'], ['dp', 'Demat account (depository participant)'], ['mf', 'Mutual fund'], ['company', 'A listed company or its registrar (shares, dividend)'], ['adviser', 'Investment adviser or tip seller'], ['fake', 'An app or group I now think is fake']]) },
      { id: 'sc_what', text: 'What went wrong?', why: 'Each problem needs different records.', options: o([['trades', 'Trades I did not authorise'], ['funds', 'Money or shares not paid out or credited'], ['charges', 'Wrong charges or margin penalty'], ['close', 'Account not closed / SIP not stopped'], ['transfer', 'Share transfer, transmission or dividend'], ['advice', 'Bad or fraudulent advice']]) },
      { id: 'sc_when', text: 'When did it happen?', why: 'SCORES complaints must be filed within one year.', options: o([['u1', 'Within the last year'], ['o1', 'More than a year ago'], NS]) },
      { id: 'sc_complained', text: 'Have you complained to them in writing?', why: 'The ticket number and their reply are your first proof.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'sc_e_contract', name: 'Contract notes and the trade / transaction statement for the period', fact: 'What was done in your account', why: 'Shows the disputed trades or transactions.', where: 'Broker app or email; NSDL/CDSL statement.', preserve: 'Download PDFs now.' },
      { id: 'sc_e_cas', name: 'Consolidated Account Statement (CAS) from NSDL or CDSL', fact: 'Your holdings across all accounts', why: 'Independent record of shares and mutual funds.', where: 'NSDL / CDSL email, or request online.', preserve: '' },
      { id: 'sc_e_bank', name: 'Bank statement showing money paid in and out', fact: 'Your funds', why: 'Matches money to the account.', where: 'Your bank.', preserve: '' },
      { id: 'sc_e_ticket', name: 'Your complaint to the entity and their reply, with ticket number', fact: 'You complained first', why: 'SCORES and SEBI review rely on it.', where: 'Email or app.', preserve: '', when: W('sc_complained', 'yes') },
      { id: 'sc_e_write', name: 'Write to the broker / fund / company first, then file on SCORES', fact: 'Complaint made', why: 'Starts the 21-day clock.', where: 'Email; then SCORES.', preserve: 'Keep the SCORES registration number.', action: true, when: W('sc_complained', 'no') },
      { id: 'sc_e_calls', name: 'Call recordings, chats or messages with the dealer, relationship manager or adviser', fact: 'What you were told or asked', why: 'Key in unauthorised trades and mis-selling.', where: 'Phone, WhatsApp, email.', preserve: 'Export full chats.', when: W('sc_what', 'trades', 'advice') },
      { id: 'sc_e_reg', name: 'Screenshot of the adviser’s or app’s registration (or proof it is not registered)', fact: 'Whether they are SEBI-registered', why: 'Unregistered sellers are a police matter, not SCORES.', where: 'SEBI website search; the group or app.', preserve: '', when: W('sc_who', 'adviser', 'fake') },
      { id: 'sc_e_cert', name: 'Share certificates, folio numbers, death certificate and succession papers (for transmission)', fact: 'Your title to the shares', why: 'Needed for transfer, transmission and old dividends.', where: 'Family papers; registrar.', preserve: 'Keep originals safe.', when: W('sc_what', 'transfer') }
    ],
    urgent: [
      { id: 'sc_u_fake', level: 'now', when: W('sc_who', 'fake'), title: 'Stop paying and report the fake app or group', text: 'Call 1930 and report on cybercrime.gov.in. Do not pay any “tax” or “fee” to withdraw.', help: ['cy1930'] },
      { id: 'sc_u_year', level: 'soon', when: W('sc_when', 'o1'), title: 'SCORES has a one-year limit', text: 'Ask an advocate about other remedies such as arbitration or a court case.', help: ['l15100'] }
    ],
    stand: [
      { k: 'good', text: 'The entity must reply on SCORES within 21 days, and you can ask for two levels of review.' },
      { k: 'next', text: 'For money claims, SEBI’s online dispute resolution offers conciliation and then arbitration.' },
      { k: 'risk', when: W('sc_who', 'adviser', 'fake'), text: 'Unregistered tip sellers and fake apps are outside SEBI’s complaint system — treat it as cyber fraud.' }
    ],
    lawyerQs: [{ text: 'Should I use SCORES, online dispute resolution, or a police complaint?' }],
    sources: [SRC.scores, SRC.odr]
  });

  /* ================= Cruelty to animals, strays and pets ================= */
  I.push({
    id: 'animal-cruelty', cat: 'other', title: 'Cruelty to animals — beating, poisoning, killing, or strays and pets troubled', short: 'Animal cruelty',
    synonyms: ['animal cruelty', 'cruelty to animals', 'dog poisoned', 'dog killed', 'dog beaten', 'cat killed', 'stray dogs relocated', 'stray dogs removed', 'feeding stray dogs', 'dog feeder harassed', 'pet not allowed society', 'society banning pets', 'pet ban', 'pet shop cruelty', 'animal abuse', 'cow abandoned', 'horse cruelty', 'bird cruelty', 'animal hit', 'pfa', 'peta', 'awbi'],
    intro: 'Killing, poisoning or maiming any animal is a crime with up to five years in jail. Report it to the police the same day and keep photos and the vet’s report.',
    juris: 'Section 325 of the Bharatiya Nyaya Sanhita, 2023 punishes killing, poisoning, maiming or rendering useless any animal with up to 5 years’ imprisonment, fine, or both, and the police must register it. Section 11 of the Prevention of Cruelty to Animals Act, 1960 makes beating, torturing or causing unnecessary suffering an offence (its fines are small, so ask that BNS s.325 be added where an animal is killed or maimed). Stray dogs are handled under the Animal Birth Control Rules, 2023: they are sterilised, vaccinated and returned to the same area, not relocated or killed; the Supreme Court’s stray-dog case (from 2025) also deals with feeding spots and dangerous dogs, so check your city’s current rules. The Animal Welfare Board of India has advised that housing societies cannot ban pets.',
    questions: [
      { id: 'ac_what', text: 'What happened?', why: 'Killing or maiming is a serious crime; other cases have other routes.', options: o([['killed', 'An animal was killed, poisoned or badly injured'], ['beaten', 'An animal is being beaten or kept cruelly'], ['relocate', 'Strays are being removed or relocated'], ['feeder', 'I am stopped or harassed for feeding animals'], ['pet', 'My society wants to ban or charge for my pet'], ['other', 'Something else']]) },
      { id: 'ac_animal', text: 'Which animal?', why: 'Helps the police and animal groups respond.', options: o([['dog', 'Dog'], ['cat', 'Cat'], ['cattle', 'Cow, buffalo or horse'], ['other', 'Bird or other animal']]) },
      { id: 'ac_police', text: 'Has it been reported to the police?', why: 'Killing or maiming must be registered as an FIR.', options: o([['no', 'Not yet'], ['fir', 'Yes, FIR registered'], ['refused', 'Police refused'], NS]) },
      { id: 'ac_who', text: 'Do you know who did it?', why: 'Named persons are easier to act against.', options: o([['known', 'Yes'], ['suspect', 'I suspect someone'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'ac_e_photos', name: 'Photos and video of the animal and the place, with date and time', fact: 'What was done', why: 'The main proof.', where: 'Your phone; neighbours’ phones.', preserve: 'Do not edit; keep originals.' },
      { id: 'ac_e_vet', name: 'Vet’s report or post-mortem showing injury or poisoning', fact: 'Cause of injury or death', why: 'Proves cruelty or poisoning.', where: 'Government vet hospital or private vet.', preserve: 'Ask for a written report.', when: W('ac_what', 'killed', 'beaten') },
      { id: 'ac_e_cctv', name: 'CCTV footage from society, shops or homes nearby', fact: 'Who did it', why: 'Identifies the person.', where: 'Society office, shops.', preserve: 'Ask within days — footage is overwritten.', when: W('ac_what', 'killed', 'beaten', 'relocate') },
      { id: 'ac_e_witness', name: 'Names and numbers of witnesses', fact: 'Independent support', why: 'Supports the FIR.', where: 'People nearby.', preserve: '' },
      { id: 'ac_e_fir', name: 'FIR copy (ask for BNS section 325 if an animal was killed or maimed)', fact: 'Reported', why: 'Starts the criminal case.', where: 'Police station.', preserve: '', action: true, when: W('ac_police', 'no', 'refused') },
      { id: 'ac_e_society', name: 'Society notice, bylaw, fine or message about pets or feeding', fact: 'What the society did', why: 'Shows the restriction you are challenging.', where: 'Notice board, WhatsApp group, letters.', preserve: '', when: W('ac_what', 'pet', 'feeder') },
      { id: 'ac_e_awb', name: 'Written complaint to the Animal Welfare Board of India or your state animal welfare board', fact: 'Authority told', why: 'They can advise societies and authorities and follow up on cruelty.', where: 'awbi.gov.in or the state board.', preserve: 'Keep the complaint number.', action: true, when: W('ac_what', 'other', 'pet', 'feeder') },
      { id: 'ac_e_muni', name: 'Written complaint to the municipality / animal welfare officer', fact: 'Authority told', why: 'Relocation or culling of strays is against the ABC Rules.', where: 'Municipal portal or office.', preserve: 'Keep the complaint number.', action: true, when: W('ac_what', 'relocate') }
    ],
    urgent: [
      { id: 'ac_u_vet', level: 'now', when: W('ac_what', 'killed', 'beaten'), title: 'Get the animal to a vet and report it today', text: 'Take photos first, then go to the nearest vet. Report to the police the same day — poisoning evidence fades fast.', help: ['e112'] }
    ],
    stand: [
      { k: 'good', when: W('ac_what', 'killed'), text: 'Killing, poisoning or maiming an animal is a crime with up to 5 years in jail.' },
      { k: 'good', when: W('ac_what', 'relocate'), text: 'Under the ABC Rules, sterilised strays must be returned to the same area, not relocated.' },
      { k: 'good', when: W('ac_what', 'pet'), text: 'The Animal Welfare Board of India has advised that societies cannot ban pets.' },
      { k: 'next', when: W('ac_police', 'refused'), text: 'If police refuse, send a written complaint to the Superintendent of Police and keep the receipt.' }
    ],
    lawyerQs: [{ text: 'Which sections should the FIR include, and can I also complain to the Animal Welfare Board?' }],
    sources: [SRC.bns, SRC.pca, SRC.abc]
  });
})(typeof window !== 'undefined' ? window : globalThis);
