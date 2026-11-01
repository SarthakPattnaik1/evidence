/* Crucial gaps found on 1 Nov 2026 while checking 617 situations against real life: whole groups had no guide —
   children at risk (child marriage was routed to the FIR guide), families of prisoners, farmers, workers abroad,
   people facing government demolition and street vendors, mental-health detention, and abortion / pregnancy rights.
   Researched 1 Nov 2026: PCMA 2006 ss.3, 9-11, 13-14, 16; JJ Act 2015 ss.27, 32-34, 75-76; RTE Act s.17;
   BNSS ss.196(2), 479; PMFBY operational guidelines (72-hour intimation, KRPH 14447); Seeds Act 1966; Insecticides Act 1968;
   Emigration Act 1983 (the draft Overseas Mobility (Facilitation and Welfare) Bill, 2025 is not yet law); Supreme Court,
   In Re: Directions in the matter of Demolition of Structures, 13 Nov 2024; Street Vendors Act 2014 ss.3(3), 18, 19;
   Mental Healthcare Act 2017 ss.18, 20, 21, 27, 86, 89, 90, 95; MTP Act 1971 as amended 2021, s.3, s.5A; PCPNDT Act 1994. */
(function (root) {
  const { W, o, NS, PN } = root.ER_H;
  const KB = root.ER_KB; const I = KB.issues;
  const S = (t, u) => ({ t, u });
  Object.assign(KB.help, {
    krph: { label: '14447', name: 'Krishi Rakshak — crop insurance (PMFBY) helpline', detail: 'Report crop loss within 72 hours and raise claim complaints. You get a ticket number by SMS.', href: null },
    pbsk: { label: '1800-11-3090', name: 'Pravasi Bharatiya Sahayata Kendra (MEA)', detail: '24x7 help for Indian workers abroad and their families. Grievances can also be filed on the MADAD portal.', href: null }
  });
  const SRC = {
    pcma: S('Prohibition of Child Marriage Act, 2006 (sections 3, 9–11, 13, 14, 16)', ''),
    jj: root.ER_CITE.ACT.jj,
    rte: S('Right of Children to Free and Compulsory Education Act, 2009 — section 17', ''),
    bnss: root.ER_CITE.ACT.bnss,
    nalsa: S('NALSA — free legal aid', 'https://nalsa.gov.in/legal-aid/'),
    pmfby: S('Pradhan Mantri Fasal Bima Yojana — operational guidelines (pmfby.gov.in)', ''),
    seeds: S('Seeds Act, 1966; Insecticides Act, 1968; Fertiliser (Control) Order, 1985', ''),
    cpa: root.ER_CITE.ACT.cpa,
    emig: S('Emigration Act, 1983 (draft Overseas Mobility (Facilitation and Welfare) Bill, 2025 not yet in force)', ''),
    madad: S('MADAD — consular grievance portal, Ministry of External Affairs (madad.gov.in)', ''),
    demol: S('Supreme Court, In Re: Directions in the matter of Demolition of Structures, W.P.(C) 295 of 2022, 13 Nov 2024', ''),
    sva: S('Street Vendors (Protection of Livelihood and Regulation of Street Vending) Act, 2014 — sections 3, 18, 19', ''),
    mhca: S('Mental Healthcare Act, 2017 (sections 18, 20, 21, 27, 86, 89, 90, 95)', ''),
    mtp: S('Medical Termination of Pregnancy Act, 1971 (as amended in 2021) — sections 3 and 5A', ''),
    pcpndt: S('Pre-Conception and Pre-Natal Diagnostic Techniques (Prohibition of Sex Selection) Act, 1994', '')
  };

  /* ================= Children at risk ================= */
  I.push({
    id: 'child-protection', cat: 'family', title: 'A child is at risk — child marriage, abandoned child, beating at school, child begging, or a child in a police case', short: 'Child at risk',
    synonyms: ['child marriage', 'bal vivah', 'daughter wedding', 'year old daughter wedding', 'underage wedding', 'minor wedding', 'wedding of minor', 'underage marriage', 'minor marriage', 'girl married before 18', 'marriage of minor girl', 'stop child marriage', 'abandoned child', 'abandoned baby', 'found a baby', 'orphan child', 'child welfare committee', 'cwc', 'corporal punishment', 'teacher beat my child', 'teacher hit child', 'school punishment', 'child begging', 'children begging', 'juvenile', 'juvenile justice board', 'jjb', 'child arrested', 'minor arrested', 'son arrested minor', 'child in conflict with law', 'child neglected', 'child beaten at home', 'child abuse at home', 'cruelty to child', 'child protection', 'dcpu'],
    intro: 'If a child is in danger right now, call 1098 or 112. A child marriage can be stopped before it happens, and every district has a Child Welfare Committee that must act for a child who needs care.',
    juris: 'Under the Prohibition of Child Marriage Act, 2006 a girl must be 18 and a boy 21. A Judicial Magistrate can issue an injunction to stop a child marriage on a complaint from anyone (s.13), and a marriage held in breach of it is void (s.14). An adult man who marries a child, and anyone who performs, promotes or permits it, faces up to 2 years and a fine up to ₹1 lakh (ss.9–11). A child married off can have the marriage annulled within 2 years of becoming an adult (s.3). Each district has a Child Marriage Prohibition Officer (s.16). Under the Juvenile Justice Act, 2015 anyone who finds an abandoned child must report to the police, Childline 1098 or the Child Welfare Committee within 24 hours (s.32); cruelty to a child by a person in charge is punishable with up to 3 years (s.75), and using a child for begging with up to 5 years (s.76). A child accused of an offence goes to the Juvenile Justice Board, not to a regular court, and must not be kept in a police lock-up or jail. Physical punishment and mental harassment in school are banned (RTE Act s.17).',
    questions: [
      { id: 'cp_what', text: 'What is happening to the child?', why: 'Each problem has its own authority.', options: o([['marriage', 'A child marriage is planned or has happened'], ['abandoned', 'A child has been abandoned or has no one to care for them'], ['school', 'Beaten or humiliated at school or a hostel'], ['home', 'Beaten, starved or neglected at home'], ['begging', 'Made to beg or sell on the street'], ['juvenile', 'The child has been caught or arrested by police']]) },
      { id: 'cp_when', text: 'How soon is it?', when: W('cp_what', 'marriage'), why: 'Before the wedding it can be stopped; after it, other remedies apply.', options: o([['days', 'Within the next few days'], ['later', 'Later — weeks or months away'], ['done', 'It has already happened']]) },
      { id: 'cp_who', text: 'How are you connected to the child?', why: 'Anyone can report — but parents and the child have extra rights.', options: o([['parent', 'Parent or guardian'], ['child', 'I am the child (under 18)'], ['relative', 'Relative or neighbour'], ['teacher', 'Teacher, doctor or social worker'], PN]) },
      { id: 'cp_reported', text: 'Has anyone reported it yet?', why: 'A written record makes officials act.', options: o([['no', 'Not yet'], ['1098', 'Called 1098 or 112'], ['police', 'Told the police'], ['ignored', 'Reported but nothing happened']]) }
    ],
    evidence: [
      { id: 'cp_e_age', name: 'Proof of the child’s age — birth certificate, school leaving certificate or Aadhaar', fact: 'The child is under 18 (or a boy under 21 for marriage)', why: 'Age decides every right and offence here.', where: 'School, municipality, family papers.', preserve: 'A photo of any one is enough to start.' },
      { id: 'cp_e_note', name: 'A short dated note: what happened, where, who is involved and who saw it', fact: 'The facts', why: 'Officials and the Committee act on clear facts.', where: 'Write it yourself.', preserve: 'Add dates and times.' },
      { id: 'cp_e_call', name: 'The 1098 / 112 call time, complaint or diary number, and the officer’s name', fact: 'It was reported', why: 'Lets you follow up and escalate.', where: 'Your phone log; the police.', preserve: '', action: true },
      { id: 'cp_e_invite', name: 'Wedding card, photos, messages or names of the families, priest or hall', fact: 'A child marriage is planned', why: 'Needed for a Magistrate’s injunction or police action.', where: 'Family, WhatsApp groups, the venue.', preserve: 'Screenshot before it is deleted.', when: W('cp_what', 'marriage') },
      { id: 'cp_e_medical', name: 'Doctor’s note and photos of injuries', fact: 'The child was hurt', why: 'Proves cruelty or corporal punishment.', where: 'Government hospital.', preserve: 'Take photos the same day.', when: W('cp_what', 'school', 'home') },
      { id: 'cp_e_school', name: 'Written complaint to the principal and school management committee, with receipt', fact: 'The school was told', why: 'RTE s.17 bans physical punishment; the complaint starts action.', where: 'School office or by email.', preserve: 'Keep the receipt.', action: true, when: W('cp_what', 'school') },
      { id: 'cp_e_cwc', name: 'Written report to the Child Welfare Committee or District Child Protection Unit', fact: 'The Committee was told', why: 'The Committee can order care, shelter and protection for the child.', where: 'District collectorate or DCPU office; 1098 can connect you.', preserve: 'Keep the receipt.', action: true, when: W('cp_what', 'abandoned', 'home', 'begging') },
      { id: 'cp_e_jjb', name: 'The child’s age proof and the police memo, given to the Juvenile Justice Board', fact: 'The child is a juvenile', why: 'The child must go before the Board, not a regular court, and must not be held in a lock-up.', where: 'Police station; the Board in the district court complex.', preserve: '', when: W('cp_what', 'juvenile') }
    ],
    urgent: [
      { id: 'cp_u_marriage', level: 'now', when: W('cp_when', 'days'), title: 'Call 1098 or 112 now — the marriage can be stopped', text: 'Also tell the Child Marriage Prohibition Officer (usually through the district collectorate or 1098). A Magistrate can issue an injunction; a marriage after that is void.', help: ['c1098', 'e112'] },
      { id: 'cp_u_danger', level: 'now', when: W('cp_what', 'abandoned', 'home', 'begging'), title: 'If the child is in danger, call 1098 or 112 now', text: 'An abandoned child must be reported within 24 hours — to the police, 1098 or the Child Welfare Committee.', help: ['c1098', 'e112'] },
      { id: 'cp_u_juv', level: 'now', when: W('cp_what', 'juvenile'), title: 'A child must not be kept in a police lock-up or jail', text: 'Show proof of age and ask that the child be produced before the Juvenile Justice Board. Free legal aid: 15100.', help: ['l15100'] }
    ],
    stand: [
      { k: 'good', text: 'Anyone can report — you do not need to be a parent or a relative.' },
      { k: 'good', when: W('cp_what', 'marriage'), text: 'A child married off can get the marriage annulled within 2 years of turning 18.' },
      { k: 'good', when: W('cp_what', 'juvenile'), text: 'A child is presumed entitled to bail before the Juvenile Justice Board, except in narrow cases.' },
      { k: 'next', when: W('cp_reported', 'ignored'), text: 'If officials did nothing, write to the District Magistrate and the State Commission for Protection of Child Rights.' },
      { k: 'risk', when: W('cp_who', 'child'), text: 'You are not in trouble for asking for help. 1098 is free and works day and night.' }
    ],
    lawyerQs: [{ text: 'Should we ask the Magistrate for an injunction, or is a police complaint enough?' }, { text: 'What will the Child Welfare Committee decide, and can the child stay with family?' }],
    sources: [SRC.pcma, SRC.jj, SRC.rte, SRC.nalsa]
  });

  /* ================= Family member in jail ================= */
  I.push({
    id: 'prisoner-rights', cat: 'police', title: 'A family member is in jail — bail, long detention as an undertrial, meeting them, parole, or death in custody', short: 'Family member in jail',
    synonyms: ['in jail', 'jail', 'prison', 'undertrial', 'under trial', 'judicial custody', 'son in jail', 'husband in jail', 'brother in jail', 'father in jail', 'meet prisoner', 'jail visit', 'mulakat', 'parole', 'furlough', 'jail for years', 'no trial', 'case not starting', 'custodial death', 'died in police custody', 'died in jail', 'jail beating', 'section 479', '479 bnss', 'half sentence undertrial', 'legal aid jail', 'jail lawyer', 'prisoner rights'],
    intro: 'An undertrial who has spent half the maximum sentence in jail (a third, for a first offence) must be released on bail in most cases. Free legal aid is available inside every jail. If someone died in custody, a Judicial Magistrate must inquire.',
    juris: 'Under section 479 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), an undertrial who has been detained for half the maximum sentence for the offence must be released on bail, and a first-time offender after one-third — this does not apply to offences punishable with death or life imprisonment, and the jail superintendent must apply to the court. Every district has an Undertrial Review Committee and legal aid clinics in jails run by the District Legal Services Authority; any prisoner is entitled to a free lawyer. Meetings (mulakat), parole and furlough are governed by each state’s prison rules. When a person dies, disappears or a woman alleges rape in police or judicial custody, an inquiry by a Judicial Magistrate is mandatory in addition to the police investigation (BNSS s.196(2)); the National Human Rights Commission is to be informed within 24 hours. Courts award compensation for custodial deaths and torture under Article 21.',
    questions: [
      { id: 'pr_what', text: 'What do you need?', why: 'Each need has a different route.', options: o([['bail', 'Bail — they have been in jail for a long time'], ['lawyer', 'They have no lawyer'], ['meet', 'We are not allowed to meet them'], ['parole', 'Parole or furlough for a family event or illness'], ['hurt', 'They were beaten or are ill and not treated'], ['death', 'They died in police or jail custody']]) },
      { id: 'pr_stage', text: 'Has the person been convicted?', why: 'Undertrials and convicts have different rights.', options: o([['ut', 'No — undertrial (case going on)'], ['conv', 'Yes — convicted'], NS]) },
      { id: 'pr_time', text: 'How long have they been in jail?', when: W('pr_stage', 'ut', 'unsure'), why: 'Section 479 depends on time served against the maximum sentence.', options: o([['u6m', 'Less than 6 months'], ['6m3y', '6 months to 3 years'], ['o3y', 'More than 3 years'], NS]) },
      { id: 'pr_offence', text: 'Is the offence punishable with death or life imprisonment?', when: W('pr_stage', 'ut', 'unsure'), why: 'Section 479 release does not apply to those offences.', options: o([['no', 'No'], ['yes', 'Yes (for example murder, rape)'], NS]) }
    ],
    evidence: [
      { id: 'pr_e_fir', name: 'FIR number, police station, sections charged and the court name', fact: 'The case details', why: 'Every application starts from these.', where: 'Police station, the family’s copy, or the eCourts website.', preserve: '' },
      { id: 'pr_e_custody', name: 'Date of arrest and the custody (remand) orders', fact: 'How long they have been held', why: 'Time served decides bail under section 479.', where: 'Court order sheets; jail office.', preserve: '' },
      { id: 'pr_e_prison', name: 'Prisoner number, jail name and ward', fact: 'Where they are held', why: 'Needed for meetings, legal aid and applications.', where: 'Jail office.', preserve: '' },
      { id: 'pr_e_dlsa', name: 'Written request to the District Legal Services Authority for a free lawyer, with receipt', fact: 'Legal aid asked for', why: 'Any prisoner is entitled to a free lawyer.', where: 'DLSA office at the district court, or call 15100.', preserve: 'Keep the receipt.', action: true, when: W('pr_what', 'lawyer', 'bail') },
      { id: 'pr_e_479', name: 'Application to the jail superintendent and the court for release under BNSS s.479', fact: 'Release asked for', why: 'The superintendent must apply once half (or a third) of the maximum sentence is served.', where: 'Through the lawyer or the jail legal aid clinic.', preserve: '', action: true, when: W('pr_what', 'bail') },
      { id: 'pr_e_medical', name: 'Medical records, photos and names of fellow prisoners or staff who saw it', fact: 'Injury or neglect', why: 'Proves custodial violence or denial of treatment.', where: 'Jail hospital; family visits.', preserve: 'Note dates.', when: W('pr_what', 'hurt', 'death') },
      { id: 'pr_e_pm', name: 'Post-mortem report and a request that it be videographed, plus the Judicial Magistrate’s inquiry number', fact: 'Cause of death', why: 'A judicial inquiry is mandatory for any death in custody.', where: 'Hospital; the Magistrate’s court.', preserve: 'Ask for copies in writing.', when: W('pr_what', 'death') },
      { id: 'pr_e_reason', name: 'Proof of the reason for parole — illness certificate, wedding card or death certificate', fact: 'Why release is needed', why: 'Parole is granted for specific reasons under state rules.', where: 'Hospital; family.', preserve: '', when: W('pr_what', 'parole') }
    ],
    urgent: [
      { id: 'pr_u_death', level: 'now', when: W('pr_what', 'death'), title: 'Ask for a judicial inquiry and a videographed post-mortem', text: 'A Judicial Magistrate must inquire into every death in custody. Write to the Magistrate and the National Human Rights Commission (nhrc.nic.in) today.', help: ['l15100'] },
      { id: 'pr_u_hurt', level: 'soon', when: W('pr_what', 'hurt'), title: 'Tell the court at the next date', text: 'The prisoner can tell the Magistrate about injuries when produced. Ask the lawyer to seek a medical examination.', help: ['l15100'] }
    ],
    stand: [
      { k: 'good', text: 'Any prisoner can get a free lawyer through the District Legal Services Authority — call 15100.' },
      { k: 'good', when: W('pr_time', 'o3y'), text: 'Long detention without trial is itself a strong ground for bail.' },
      { k: 'risk', when: W('pr_offence', 'yes'), text: 'Release under section 479 does not apply to offences punishable with death or life imprisonment — bail must be argued on the facts.' },
      { k: 'next', when: W('pr_what', 'meet'), text: 'Meeting rules are in your state’s prison manual; ask the jail for the written rule if you are refused.' }
    ],
    lawyerQs: [{ text: 'Has half (or a third) of the maximum sentence been served, so that section 479 applies?' }, { text: 'Can the Undertrial Review Committee take up this case?' }],
    sources: [SRC.bnss, SRC.nalsa]
  });

  /* ================= Farmers ================= */
  I.push({
    id: 'farmer-problem', cat: 'money', title: 'Farmer problem — crop insurance not paid, fake seeds or pesticide, crop loan, or mandi payment stuck', short: 'Farmer problem',
    synonyms: ['farmer', 'kisan', 'crop insurance', 'fasal bima', 'pmfby', 'crop insurance not paid', 'crop loss claim', 'hailstorm crop', 'flood crop damage', 'fake seeds', 'bad seeds', 'seeds did not germinate', 'spurious seeds', 'fake pesticide', 'fake fertiliser', 'fake fertilizer', 'urea black market', 'kcc', 'kisan credit card', 'crop loan', 'mandi payment', 'commission agent did not pay', 'arhtiya', 'trader did not pay for crop', 'msp', 'crop not bought at msp', 'tractor loan', 'krishi'],
    intro: 'For crop insurance, report the loss within 72 hours on 14447 — late reporting is the most common reason claims are refused. Fake seeds and pesticide can be reported to the agriculture department and taken to a consumer commission.',
    juris: 'Under the Pradhan Mantri Fasal Bima Yojana, localised losses (hailstorm, flooding, landslide, cloudburst and others notified by the state) and damage to harvested crop lying in the field must be reported within 72 hours — on the Krishi Rakshak helpline 14447, the Crop Insurance app, pmfby.gov.in, the bank or the agriculture office; a surveyor should be appointed within about 48 hours. Widespread yield loss is assessed through crop-cutting experiments without individual reporting. Claim disputes go to the District Grievance Redressal Committee. Selling seeds that fail standards is an offence under the Seeds Act, 1966; pesticides are covered by the Insecticides Act, 1968 and fertilisers by the Fertiliser (Control) Order, 1985 — agriculture department inspectors can take samples and act. The Supreme Court has held that farmers who buy seeds are consumers, so a consumer commission can award compensation for crop loss. Bank complaints about crop loans and Kisan Credit Cards go to the bank and then the RBI Ombudsman.',
    questions: [
      { id: 'fm_what', text: 'What is the problem?', why: 'Each problem has its own route.', options: o([['ins', 'Crop insurance claim not paid or too low'], ['seed', 'Seeds, pesticide or fertiliser were fake or failed'], ['loan', 'Crop loan, Kisan Credit Card or bank problem'], ['mandi', 'Trader or mandi did not pay for my crop'], ['other', 'Something else']]) },
      { id: 'fm_reported', text: 'Did you report the loss within 72 hours?', when: W('fm_what', 'ins'), why: 'Late reporting is the most common reason for rejection.', options: o([['yes', 'Yes — I have a ticket or receipt'], ['late', 'Yes, but after 72 hours'], ['no', 'No'], ['wide', 'The whole area was hit (drought, widespread loss)']]) },
      { id: 'fm_bill', text: 'Do you have the bill for the seeds, pesticide or fertiliser?', when: W('fm_what', 'seed'), why: 'The bill and the packet are the main proof against the seller and the company.', options: o([['yes', 'Yes, with the packet'], ['bill', 'Bill only'], ['no', 'No bill']]) },
      { id: 'fm_enrolled', text: 'Were you enrolled in crop insurance this season?', when: W('fm_what', 'ins'), why: 'Loanee farmers are often enrolled by the bank; check your policy.', options: o([['yes', 'Yes'], ['bank', 'The bank enrolled me'], NS]) }
    ],
    evidence: [
      { id: 'fm_e_land', name: 'Land record (khatauni / 7-12 / patta) or lease agreement, and sowing proof', fact: 'You cultivate this land and this crop', why: 'Needed for insurance, compensation and any complaint.', where: 'Land records portal; patwari; your lease.', preserve: '' },
      { id: 'fm_e_photos', name: 'Geo-tagged photos and video of the damaged or failed crop, with date', fact: 'The loss', why: 'The surveyor, inspector and commission rely on them.', where: 'Your phone (location on).', preserve: 'Take them before clearing the field.' },
      { id: 'fm_e_bank', name: 'Bank passbook or statement and Aadhaar', fact: 'Where money should come', why: 'Claims and refunds are paid to this account.', where: 'Your bank.', preserve: '' },
      { id: 'fm_e_ticket', name: 'Crop loss ticket number from 14447, the app or the bank', fact: 'Loss was reported in time', why: 'Without it the insurer may say you never reported.', where: 'SMS on your phone.', preserve: 'Screenshot it.', action: true, when: W('fm_what', 'ins') },
      { id: 'fm_e_policy', name: 'Policy number or enrolment receipt, and premium deduction in the bank statement', fact: 'You were insured', why: 'Proves cover.', where: 'pmfby.gov.in; bank; CSC receipt.', preserve: '', when: W('fm_what', 'ins') },
      { id: 'fm_e_packet', name: 'Bill, packet with lot / batch number, and some unused seed or product', fact: 'What was sold and by whom', why: 'The inspector can test the sample; the lot number links it to the company.', where: 'Keep in a dry, sealed bag.', preserve: 'Do not throw the packet away.', when: W('fm_what', 'seed') },
      { id: 'fm_e_ado', name: 'Written complaint to the agriculture development officer asking for inspection and sample testing', fact: 'Authority told', why: 'An official inspection report is strong proof of fake seeds.', where: 'Block or district agriculture office.', preserve: 'Keep the receipt and inspection report.', action: true, when: W('fm_what', 'seed') },
      { id: 'fm_e_sale', name: 'Sale slip (J-form / bill), weighment slip, and the trader’s or agent’s name', fact: 'You sold the crop and to whom', why: 'Proves the payment due.', where: 'Mandi records; e-NAM; your copy.', preserve: '', when: W('fm_what', 'mandi') },
      { id: 'fm_e_loan', name: 'Loan or KCC sanction letter, statement and the bank’s letters', fact: 'Your loan terms', why: 'Needed for any complaint to the bank or Ombudsman.', where: 'Your bank.', preserve: '', when: W('fm_what', 'loan') }
    ],
    urgent: [
      { id: 'fm_u_72', level: 'now', when: W('fm_reported', 'no'), title: 'Call 14447 today, even if it is late', text: 'Report the loss now and note the ticket number. Late reporting may be refused, but no reporting will be. Take photos before clearing the field.', help: ['krph'] },
      { id: 'fm_u_sample', level: 'soon', when: W('fm_what', 'seed'), title: 'Keep the packet and some seed — and complain before harvesting', text: 'The agriculture inspector needs to see the standing crop and test a sample.', help: ['l15100'] }
    ],
    stand: [
      { k: 'good', when: W('fm_what', 'seed'), text: 'Farmers who buy seeds are consumers — a consumer commission can order compensation for the lost crop.' },
      { k: 'good', when: W('fm_reported', 'wide'), text: 'For widespread loss, claims are worked out from crop-cutting results — you do not need to report individually.' },
      { k: 'next', when: W('fm_what', 'ins'), text: 'If the claim is refused or low, complain to the District Grievance Redressal Committee through the agriculture office.' },
      { k: 'next', when: W('fm_what', 'loan'), text: 'If the bank does not reply in 30 days, complain to the RBI Ombudsman at cms.rbi.org.in.' }
    ],
    lawyerQs: [{ text: 'Should I go to the consumer commission or wait for the agriculture department’s report?' }],
    sources: [SRC.pmfby, SRC.seeds, SRC.cpa]
  });

  /* ================= Workers abroad ================= */
  I.push({
    id: 'overseas-worker', cat: 'nri', title: 'Working abroad (Gulf and elsewhere) — passport taken, salary not paid, stuck, cheated by an agent, or a worker died abroad', short: 'Worker stuck abroad',
    synonyms: ['gulf', 'dubai', 'saudi', 'qatar', 'kuwait', 'oman', 'bahrain', 'malaysia job', 'worker abroad', 'stuck abroad', 'stuck in gulf', 'kafala', 'passport taken by employer', 'sponsor took passport', 'salary not paid abroad', 'exit visa', 'husband stuck abroad', 'son stuck in dubai', 'body repatriation', 'died abroad', 'death in gulf', 'emigrate', 'emigration', 'ecr', 'protector of emigrants', 'recruiting agent', 'madad', 'indian embassy help', 'icwf', 'pravasi bima'],
    intro: 'The Indian embassy can help with food, shelter, a ticket home and bringing back a body, from the Indian Community Welfare Fund. File a grievance on MADAD or call 1800-11-3090 — family in India can do this too.',
    juris: 'Indian recruitment for jobs abroad is governed by the Emigration Act, 1983: recruiting agents must be registered with the Protector General of Emigrants (check the list on emigrate.gov.in), and recruiting without a licence or charging more than the permitted fee is an offence — complain to the Protector of Emigrants and the police. The draft Overseas Mobility (Facilitation and Welfare) Bill, 2025 has not yet replaced it. Workers with an ECR passport going to ECR countries must be covered by the Pravasi Bharatiya Bima Yojana (₹10 lakh for death or permanent disability). Indian missions can use the Indian Community Welfare Fund for shelter, legal help, an air ticket home and transport of mortal remains for workers in distress. Grievances go on the MADAD portal; the employer’s country’s labour courts decide unpaid wages, and the embassy can help file there. Most Gulf countries now forbid employers from keeping a worker’s passport.',
    questions: [
      { id: 'ow_what', text: 'What has happened?', why: 'Each problem needs a different kind of help.', options: o([['passport', 'Employer took the passport or will not let them leave'], ['salary', 'Salary not paid for months'], ['stuck', 'Stuck — visa expired, no work, no food or shelter'], ['agent', 'The agent in India cheated us or the job was different'], ['abuse', 'Beaten, abused or locked in'], ['death', 'The worker died abroad']]) },
      { id: 'ow_where', text: 'Which country?', why: 'Embassy contacts and labour rules differ.', options: o([['gulf', 'Gulf country (UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain)'], ['asia', 'Malaysia or another Asian country'], ['other', 'Elsewhere']]) },
      { id: 'ow_who', text: 'Who is asking?', why: 'Family in India can file on MADAD and approach the Protector of Emigrants.', options: o([['worker', 'The worker'], ['family', 'Family in India']]) },
      { id: 'ow_emigrate', text: 'Did the worker go through a registered agent with emigration clearance?', why: 'Registered agents can be acted against through the Protector of Emigrants.', options: o([['yes', 'Yes'], ['visit', 'No — went on a visit or tourist visa'], NS]) }
    ],
    evidence: [
      { id: 'ow_e_passport', name: 'Copy of the passport and visa or residence permit', fact: 'Who the worker is and their status', why: 'The embassy needs it for any help, even if the original is taken.', where: 'Family copies; old photos; the agent.', preserve: 'Keep scans with the family in India.' },
      { id: 'ow_e_contract', name: 'Job offer or employment contract, and the employer’s name, address and phone', fact: 'What was promised and by whom', why: 'Proves unpaid wages or a different job.', where: 'Worker’s phone; agent; emigrate.gov.in record.', preserve: '' },
      { id: 'ow_e_contact', name: 'Worker’s exact location, local phone number and photos of the place', fact: 'Where they are', why: 'The embassy must be able to reach them.', where: 'Worker; co-workers.', preserve: 'Share live location with family.' },
      { id: 'ow_e_madad', name: 'MADAD grievance number (madad.gov.in) or embassy email reference', fact: 'Help was asked for', why: 'Lets you follow up and escalate.', where: 'madad.gov.in; the embassy.', preserve: '', action: true },
      { id: 'ow_e_wages', name: 'Salary records, bank transfers home, and messages about non-payment', fact: 'Wages owed', why: 'Needed for a labour complaint abroad.', where: 'Phone; bank statements.', preserve: 'Export chats.', when: W('ow_what', 'salary', 'stuck') },
      { id: 'ow_e_agent', name: 'Agent’s name, licence number, receipts of money paid, and messages', fact: 'Who sent the worker and what was charged', why: 'For a complaint to the Protector of Emigrants and police.', where: 'Family; receipts; WhatsApp.', preserve: '', when: W('ow_what', 'agent', 'stuck', 'passport') },
      { id: 'ow_e_death', name: 'Death certificate or hospital report from abroad, and the next of kin’s ID', fact: 'The death and the family’s claim', why: 'Needed to bring the body home and claim insurance and dues.', where: 'Embassy; employer; hospital.', preserve: '', when: W('ow_what', 'death') },
      { id: 'ow_e_bima', name: 'Pravasi Bharatiya Bima Yojana policy (if any)', fact: 'Insurance cover', why: 'Death or permanent disability cover of ₹10 lakh for ECR workers.', where: 'Agent; insurer; emigrate.gov.in.', preserve: '', when: W('ow_what', 'death', 'abuse') }
    ],
    urgent: [
      { id: 'ow_u_abuse', level: 'now', when: W('ow_what', 'abuse', 'stuck'), title: 'Contact the Indian embassy now', text: 'Call 1800-11-3090 (24x7) or the embassy’s emergency number and file on MADAD. The embassy can arrange shelter and a ticket home.', help: ['pbsk'] },
      { id: 'ow_u_death', level: 'now', when: W('ow_what', 'death'), title: 'Ask the embassy to help bring the body home', text: 'Give the embassy the next of kin’s details and consent. If the family cannot pay, ask for help from the Indian Community Welfare Fund.', help: ['pbsk'] }
    ],
    stand: [
      { k: 'good', text: 'Family in India can file on MADAD and contact the embassy — the worker does not have to do it alone.' },
      { k: 'good', when: W('ow_what', 'passport'), text: 'Most Gulf countries now forbid employers from keeping a worker’s passport; the embassy can also issue an emergency travel document.' },
      { k: 'risk', when: W('ow_emigrate', 'visit'), text: 'Going on a visit visa for work makes help harder, but the embassy will still assist in distress.' },
      { k: 'next', when: W('ow_what', 'agent'), text: 'Complain about the agent to the Protector of Emigrants and the local police; unregistered recruitment is an offence.' }
    ],
    lawyerQs: [{ text: 'Can we claim the unpaid wages from India, or must the case be filed in that country?' }],
    sources: [SRC.emig, SRC.madad]
  });

  /* ================= Government demolition, slum eviction, street vendors ================= */
  I.push({
    id: 'demolition-eviction', cat: 'home', title: 'Government wants to demolish my house or shop, evict our basti, or remove my street stall', short: 'Demolition or eviction by government',
    synonyms: ['demolition', 'demolition notice', 'bulldozer', 'house demolished', 'shop demolished', 'municipality demolish', 'illegal construction notice', 'sealing', 'property sealed', 'slum', 'basti', 'jhuggi', 'slum eviction', 'eviction drive', 'encroachment drive', 'street vendor', 'hawker', 'thela', 'rehri', 'stall removed', 'cart seized', 'goods seized municipality', 'vending certificate', 'town vending committee', 'rehabilitation', 'resettlement colony'],
    intro: 'In most cases a house or shop cannot be demolished without a 15-day written notice and a chance to reply, and street vendors are entitled to 30 days’ notice. Act within the notice period — that is when it can still be stopped.',
    juris: 'On 13 November 2024 the Supreme Court laid down binding directions: no demolition without a show-cause notice served by registered post and pasted on the structure, giving at least 15 days (or longer if local law allows) to reply; a personal hearing; a reasoned final order; a further 15 days before it is carried out so it can be challenged; and videography of any demolition. Officials who break these directions face contempt and must personally pay for restoration. The directions do not apply to unauthorised structures on public places such as roads, footpaths, railway lines or water bodies, or where a court has ordered demolition. Under the Street Vendors Act, 2014, no vendor may be evicted until the town’s vendor survey is complete and certificates issued (s.3(3)); eviction needs 30 days’ notice (s.18(3)); seized goods must be listed, and released the same day if perishable and within two working days otherwise (s.19). Slum eviction and rehabilitation depend on state law and policy; ask whether you were counted in the survey.',
    questions: [
      { id: 'dm_what', text: 'What is happening?', why: 'Houses, slums and street stalls have different protections.', options: o([['house', 'My house or shop is to be demolished or sealed'], ['slum', 'Our basti or slum is being cleared'], ['vendor', 'My street stall or cart is being removed or goods seized'], ['done', 'It has already been demolished']]) },
      { id: 'dm_notice', text: 'Did you get a written notice?', why: 'The notice period is your window to reply and challenge.', options: o([['yes', 'Yes'], ['oral', 'Only told verbally'], ['no', 'No notice at all']]) },
      { id: 'dm_place', text: 'Where is the structure?', when: W('dm_what', 'house', 'done'), why: 'The 2024 directions do not cover roads, footpaths, railway land or water bodies.', options: o([['private', 'On my own or allotted land'], ['public', 'On a road, footpath, railway or riverbank'], NS]) },
      { id: 'dm_days', text: 'How many days are left?', when: W('dm_notice', 'yes'), why: 'Urgent cases need a court the same week.', options: o([['u3', 'Less than 3 days'], ['u15', '3 to 15 days'], ['o15', 'More than 15 days']]) }
    ],
    evidence: [
      { id: 'dm_e_notice', name: 'The notice or order, with the date you received it and the envelope', fact: 'What was ordered and when', why: 'The time limits run from receipt.', where: 'Your records.', preserve: 'Photograph the notice pasted on the wall too.', when: W('dm_notice', 'yes') },
      { id: 'dm_e_title', name: 'Ownership, allotment, lease or possession papers, and property tax or electricity bills', fact: 'You lawfully hold the place, and for how long', why: 'Long possession and tax payments matter in every hearing.', where: 'Your records; municipality.', preserve: '' },
      { id: 'dm_e_plan', name: 'Sanctioned building plan, or an application to regularise', fact: 'The construction is permitted or can be regularised', why: 'Only structures that cannot be regularised should be demolished.', where: 'Municipality; your architect.', preserve: '', when: W('dm_what', 'house', 'done') },
      { id: 'dm_e_reply', name: 'Your written reply to the notice, with receipt, asking for a personal hearing', fact: 'You objected in time', why: 'A hearing is required before a final order.', where: 'Deliver to the office that issued the notice.', preserve: 'Keep the stamped copy.', action: true, when: W('dm_notice', 'yes') },
      { id: 'dm_e_photos', name: 'Photos and video of the structure — and of the demolition if it happens', fact: 'What existed and what was done', why: 'Needed for a court challenge or compensation.', where: 'Your phone and neighbours’.', preserve: 'Back up online.' },
      { id: 'dm_e_survey', name: 'Your name in the slum or vendor survey, ration card, voter ID at that address', fact: 'You were living or vending there', why: 'Rehabilitation and vending rights depend on being counted.', where: 'Municipality; your documents.', preserve: '', when: W('dm_what', 'slum', 'vendor') },
      { id: 'dm_e_vend', name: 'Vending certificate or survey slip, and the list of goods seized', fact: 'Your right to vend and what was taken', why: 'Seized goods must be listed and returned on time.', where: 'Town vending committee; the officer who seized.', preserve: 'Insist on a signed list.', when: W('dm_what', 'vendor') }
    ],
    urgent: [
      { id: 'dm_u_court', level: 'now', when: W('dm_days', 'u3'), title: 'See an advocate today about an urgent stay', text: 'A High Court or civil court can stay a demolition that breaks the rules. Free legal aid: 15100.', help: ['l15100'] },
      { id: 'dm_u_none', level: 'now', when: W('dm_notice', 'no', 'oral'), title: 'Ask for the written order — a demolition without notice breaks the Supreme Court’s directions', text: 'Record what is happening, note officers’ names, and contact an advocate or legal aid at once.', help: ['l15100'] }
    ],
    stand: [
      { k: 'good', when: W('dm_what', 'house'), text: 'You are entitled to at least 15 days’ notice, a hearing, a reasoned order and 15 more days to challenge it.' },
      { k: 'good', when: W('dm_what', 'vendor'), text: 'Street vendors need 30 days’ notice, and perishable goods must be returned the same day you claim them.' },
      { k: 'risk', when: W('dm_place', 'public'), text: 'Structures on roads, footpaths, railway land or water bodies are outside the 2024 directions; rehabilitation policy may still help.' },
      { k: 'next', when: W('dm_what', 'done'), text: 'If the rules were broken, a court can order officials to pay for rebuilding and damages.' }
    ],
    lawyerQs: [{ text: 'Was the notice valid, and should we reply, appeal or go to the High Court?' }, { text: 'Are we eligible for rehabilitation under the state policy?' }],
    sources: [SRC.demol, SRC.sva]
  });

  /* ================= Mental health: admission and rights ================= */
  I.push({
    id: 'mental-health-rights', cat: 'other', title: 'Mental health — admitted to a hospital against my will, mistreated, or insurance refused for mental illness', short: 'Mental health rights',
    synonyms: ['mental health', 'mental hospital', 'psychiatric hospital', 'asylum', 'rehab centre', 'de-addiction centre forced', 'admitted against my will', 'forced admission', 'family admitted me', 'locked in rehab', 'chained', 'electric shock treatment', 'ect', 'mental illness insurance', 'psychiatric treatment not covered', 'depression insurance claim', 'mental health review board', 'mental healthcare act', 'nominated representative', 'advance directive'],
    intro: 'An adult who chooses to be admitted can ask to leave, and admission without consent is allowed only in narrow cases, for a limited time, with review by a Mental Health Review Board. Insurers must cover mental illness like physical illness.',
    juris: 'The Mental Healthcare Act, 2017 gives every person the right to access mental healthcare from government-funded services (s.18), to live with dignity and to be protected from cruel or degrading treatment (s.20), and to free legal services (s.27). Insurers must provide medical insurance for mental illness on the same basis as physical illness (s.21(4)). An adult may seek admission on their own (independent admission, s.86) and can ask to be discharged. Admission without the person’s consent (supported admission) needs specific conditions and lasts up to 30 days (s.89); longer stays need the Mental Health Review Board’s approval (s.90), and the Board hears appeals. Chaining, electroconvulsive therapy without anaesthesia and muscle relaxants, ECT for minors and sterilisation as treatment are banned (s.95). A person can make an advance directive and name a nominated representative. Private “rehab” or de-addiction centres must also follow the law.',
    questions: [
      { id: 'mh_what', text: 'What is the problem?', why: 'Each problem has a different remedy.', options: o([['admit', 'Admitted or kept in a hospital or rehab against my will'], ['abuse', 'Beaten, chained, or given treatment without consent'], ['ins', 'Insurance refused a claim for mental illness'], ['denied', 'Refused treatment at a government hospital'], ['work', 'Treated unfairly at work or college because of a mental illness']]) },
      { id: 'mh_who', text: 'Who is asking?', why: 'The person, a relative or a friend can all seek help.', options: o([['self', 'I am the person'], ['family', 'Family member'], ['friend', 'Friend or someone else']]) },
      { id: 'mh_where', text: 'Where is the person held?', when: W('mh_what', 'admit', 'abuse'), why: 'Government and private establishments are both covered by the Act.', options: o([['govt', 'Government hospital'], ['private', 'Private hospital'], ['rehab', 'Rehab or de-addiction centre'], ['home', 'At home']]) },
      { id: 'mh_days', text: 'How long has the person been kept there?', when: W('mh_what', 'admit'), why: 'Stays beyond 30 days without consent need the Review Board’s approval.', options: o([['u30', 'Less than 30 days'], ['o30', 'More than 30 days'], NS]) }
    ],
    evidence: [
      { id: 'mh_e_place', name: 'Name and address of the hospital or centre, and the date of admission', fact: 'Where and since when', why: 'Needed for any complaint or application.', where: 'Family; admission papers.', preserve: '' },
      { id: 'mh_e_papers', name: 'Admission form — whether it says independent or supported admission — and any consent signed', fact: 'On what basis the person is held', why: 'Shows whether the legal conditions were followed.', where: 'Ask the hospital for a copy; patients are entitled to information.', preserve: '' },
      { id: 'mh_e_note', name: 'A short dated note of what happened, who decided, and what treatment was given', fact: 'The facts', why: 'The Review Board acts on clear facts.', where: 'Write it yourself.', preserve: '' },
      { id: 'mh_e_board', name: 'Application to the Mental Health Review Board or State Mental Health Authority, with receipt', fact: 'Review asked for', why: 'The Board can order discharge and stop illegal treatment.', where: 'State Mental Health Authority; district court complex. Legal aid can help: 15100.', preserve: '', action: true, when: W('mh_what', 'admit', 'abuse') },
      { id: 'mh_e_injury', name: 'Photos of injuries or chains, and names of people who saw it', fact: 'Cruel treatment', why: 'Chaining and cruel treatment are banned.', where: 'Visitors; other patients; staff.', preserve: 'Take photos on a visit if you can.', when: W('mh_what', 'abuse') },
      { id: 'mh_e_ins', name: 'Insurance policy, claim form, bills, and the rejection letter', fact: 'The claim and why it was refused', why: 'Refusing cover only because the illness is mental breaks the Act.', where: 'Insurer; hospital.', preserve: '', when: W('mh_what', 'ins') },
      { id: 'mh_e_refusal', name: 'The refusal — name of the doctor or office, date, and what was said', fact: 'Treatment was refused', why: 'Access to government mental healthcare is a right.', where: 'Write it down the same day.', preserve: '', when: W('mh_what', 'denied', 'work') }
    ],
    urgent: [
      { id: 'mh_u_abuse', level: 'now', when: W('mh_what', 'abuse'), title: 'Chaining and cruel treatment are illegal — act today', text: 'Call 112 if someone is in danger. Ask for legal aid (15100) to approach the Review Board or a court.', help: ['e112', 'l15100'] },
      { id: 'mh_u_support', level: 'soon', title: 'Support is available, free and confidential', text: 'Tele-MANAS 14416 is free, 24x7 and in many languages.', help: ['telemanas'] }
    ],
    stand: [
      { k: 'good', text: 'Anyone with a mental illness is entitled to free legal services.' },
      { k: 'good', when: W('mh_what', 'ins'), text: 'Insurers must cover mental illness on the same basis as physical illness — complain to the insurer, then the Insurance Ombudsman.' },
      { k: 'risk', when: W('mh_days', 'o30'), text: 'A stay of more than 30 days without consent needs the Review Board’s approval — ask to see it.' },
      { k: 'next', when: W('mh_where', 'rehab'), text: 'Private rehab and de-addiction centres must be registered and follow the same rules; you can complain to the State Mental Health Authority.' }
    ],
    lawyerQs: [{ text: 'Was the admission lawful, and how fast can the Review Board hear us?' }],
    sources: [SRC.mhca, SRC.nalsa]
  });

  /* ================= Abortion and pregnancy rights ================= */
  I.push({
    id: 'pregnancy-rights', cat: 'family', title: 'Abortion refused or delayed, consent demanded from husband or family, or illegal sex determination', short: 'Abortion and pregnancy rights',
    synonyms: ['abortion', 'mtp', 'termination of pregnancy', 'end pregnancy', 'abortion refused', 'doctor refused abortion', 'husband consent abortion', 'unmarried abortion', 'abortion after 20 weeks', 'abortion 24 weeks', 'medical board abortion', 'pregnant after rape', 'foetal abnormality', 'sex determination', 'gender test pregnancy', 'sex selection', 'pcpndt', 'forced abortion'],
    intro: 'An adult woman, married or not, can end a pregnancy up to 20 weeks on one doctor’s opinion, and up to 24 weeks in listed situations such as rape or a minor. Only her consent is needed — not her husband’s or family’s.',
    juris: 'Under the Medical Termination of Pregnancy Act, 1971 (as amended in 2021), a pregnancy can be ended by a registered medical practitioner up to 20 weeks on one doctor’s opinion, and from 20 to 24 weeks on two doctors’ opinion for categories listed in the rules — including survivors of rape or incest, minors, a change in marital status, women with disabilities, and foetal malformation. Beyond 24 weeks it is allowed for substantial foetal abnormalities diagnosed by a Medical Board, and women can approach the High Court in other cases. The Supreme Court held in 2022 that unmarried women have the same rights as married women under the Act. Only the woman’s consent is required; a guardian’s consent is needed only if she is under 18 or mentally ill. Her identity must be kept confidential (s.5A). For a minor, doctors must report under POCSO, but the Supreme Court has said the girl’s name need not be disclosed in that report. Sex determination and sex selection are crimes under the PCPNDT Act, 1994.',
    questions: [
      { id: 'rp_what', text: 'What is the problem?', why: 'Each situation has its own rule.', options: o([['refused', 'A doctor or hospital refused or delayed an abortion'], ['consent', 'They demand my husband’s or family’s consent'], ['late', 'The pregnancy is past 20 or 24 weeks'], ['forced', 'Someone is forcing me to have an abortion'], ['sexdet', 'Someone offered or did a sex-determination test']]) },
      { id: 'rp_weeks', text: 'How many weeks pregnant?', when: W('rp_what', 'refused', 'consent', 'late'), why: 'The weeks decide who can approve it.', options: o([['u20', 'Up to 20 weeks'], ['u24', '20 to 24 weeks'], ['o24', 'More than 24 weeks'], NS]) },
      { id: 'rp_cat', text: 'Do any of these apply?', when: W('rp_weeks', 'u24', 'o24'), why: '20–24 weeks is allowed for listed categories.', options: o([['rape', 'Pregnancy from rape or incest'], ['minor', 'I am under 18'], ['status', 'Widowed, divorced or separated during pregnancy'], ['foetal', 'Serious problem found in the baby'], ['none', 'None of these'], PN]) },
      { id: 'rp_age', text: 'Are you 18 or older?', why: 'An adult’s own consent is enough.', options: o([['adult', 'Yes'], ['minor', 'No'], PN]) }
    ],
    evidence: [
      { id: 'rp_e_scan', name: 'Ultrasound report showing the weeks of pregnancy', fact: 'How far along', why: 'The time limits depend on it.', where: 'Your doctor or a government hospital.', preserve: 'Keep a copy with you.' },
      { id: 'rp_e_id', name: 'Your ID with date of birth', fact: 'Your age', why: 'An adult needs no one else’s consent.', where: 'Your documents.', preserve: '' },
      { id: 'rp_e_refusal', name: 'Name of the doctor or hospital that refused, the date, and what reason was given', fact: 'The refusal', why: 'Needed for a complaint or a High Court petition.', where: 'Write it down the same day.', preserve: '', when: W('rp_what', 'refused', 'consent') },
      { id: 'rp_e_fir', name: 'FIR or complaint copy (if the pregnancy is from rape)', fact: 'The rape was reported', why: 'Helps show the 20–24 week category; the police must not delay medical care.', where: 'Police station; the hospital’s one-stop centre.', preserve: '', when: W('rp_cat', 'rape') },
      { id: 'rp_e_board', name: 'Medical Board report (for over 24 weeks)', fact: 'Foetal abnormality or medical need', why: 'Required beyond 24 weeks.', where: 'Government medical college hospital.', preserve: '', when: W('rp_weeks', 'o24') },
      { id: 'rp_e_note', name: 'A short dated note of who is pressuring you and what they said or did', fact: 'Coercion', why: 'Forcing an abortion is a crime; also useful for a domestic violence case.', where: 'Write it yourself; keep messages.', preserve: '', when: W('rp_what', 'forced') },
      { id: 'rp_e_sex', name: 'Clinic name, address, person who offered the test, date, and any message or payment proof', fact: 'Sex determination offered or done', why: 'For a complaint to the district Appropriate Authority under the PCPNDT Act.', where: 'Your phone; receipts.', preserve: '', when: W('rp_what', 'sexdet') },
      { id: 'rp_e_hosp', name: 'List of government hospitals near you that provide MTP services', fact: 'Where to go next', why: 'Government hospitals provide abortion care free or at low cost.', where: 'District hospital; 104 or your state health helpline.', preserve: '', action: true }
    ],
    urgent: [
      { id: 'rp_u_time', level: 'now', when: W('rp_weeks', 'u24', 'o24'), title: 'Time matters — see a government hospital or an advocate this week', text: 'Past 24 weeks a Medical Board or the High Court must decide; courts hear these cases urgently. Free legal aid: 15100.', help: ['l15100'] },
      { id: 'rp_u_forced', level: 'now', when: W('rp_what', 'forced'), title: 'No one can force you to end a pregnancy', text: 'If you are unsafe, call 112 or the women’s helpline 181.', help: ['e112', 'w181'] }
    ],
    stand: [
      { k: 'good', when: W('rp_age', 'adult'), text: 'As an adult, only your consent is needed — not your husband’s or family’s.' },
      { k: 'good', text: 'Your identity must be kept confidential by the doctor and hospital.' },
      { k: 'good', text: 'Unmarried women have the same rights under the MTP Act as married women.' },
      { k: 'risk', when: W('rp_cat', 'none'), text: 'Between 20 and 24 weeks, the listed categories apply; otherwise an advocate can advise on a High Court petition.' }
    ],
    lawyerQs: [{ text: 'Do I need to go to the High Court, and how quickly can it be listed?' }],
    sources: [SRC.mtp, SRC.pcpndt]
  });
})(typeof window !== 'undefined' ? window : globalThis);
