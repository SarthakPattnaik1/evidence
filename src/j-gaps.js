/* Coverage gaps found by testing real search queries (Oct 2026): 20 guides people search for that had no journey.
   Draft, not advocate-reviewed. Researched 31 Oct 2026 against official sources listed per guide. */
(function (root) {
  const { W, ALL, ANY, NOT, o, NS, PN } = root.ER_H;
  const KB = root.ER_KB; const I = KB.issues;
  const S = (t, u) => ({ t, u });
  const SRC = {
    bns: S('Bharatiya Nyaya Sanhita, 2023 (India Code)', 'https://www.indiacode.nic.in'),
    bnss: S('Bharatiya Nagarik Suraksha Sanhita, 2023 (India Code)', 'https://www.indiacode.nic.in'),
    nalsa: S('NALSA — free legal aid', 'https://nalsa.gov.in'),
    rti: S('RTI Online (Government of India)', 'https://rtionline.gov.in'),
    cpgrams: S('CPGRAMS — public grievance portal', 'https://pgportal.gov.in'),
    sanchar: S('Sanchar Saathi — block or trace a lost phone (CEIR)', 'https://www.sancharsaathi.gov.in'),
    cara: S('Central Adoption Resource Authority (CARA)', 'https://cara.wcd.gov.in'),
    vahan: S('Parivahan — vehicle services (Vahan)', 'https://vahan.parivahan.gov.in'),
    itportal: S('Income Tax e-filing portal', 'https://www.incometax.gov.in'),
    gst: S('GST portal', 'https://www.gst.gov.in'),
    landAcq: S('Right to Fair Compensation in Land Acquisition Act, 2013 (India Code)', 'https://www.indiacode.nic.in'),
    dilrmp: S('Department of Land Resources — land records (DILRMP)', 'https://dolr.gov.in'),
    egazette: S('e-Gazette of India (name change notifications)', 'https://egazette.gov.in'),
    crs: S('Civil Registration System — births and deaths', 'https://crsorgi.gov.in'),
    uidai: S('UIDAI — Aadhaar update', 'https://uidai.gov.in'),
    passport: S('Passport Seva', 'https://www.passportindia.gov.in'),
    cat: S('Central Administrative Tribunal', 'https://cgat.gov.in'),
    pension: S('CPENGRAMS — pensioners grievance portal', 'https://pgportal.gov.in/pension'),
    coss: S('Code on Social Security, 2020 (Ministry of Labour)', 'https://labour.gov.in'),
    esic: S('ESIC', 'https://www.esic.gov.in'),
    scst: S('SC/ST (Prevention of Atrocities) Act, 1989 (India Code)', 'https://www.indiacode.nic.in'),
    ncsc: S('National Commission for Scheduled Castes', 'https://ncsc.nic.in'),
    bonded: S('Ministry of Labour — bonded and child labour', 'https://labour.gov.in'),
    pencil: S('PENCIL — child labour complaint portal', 'https://pencil.gov.in'),
    trackchild: S('Khoya-Paya / TrackChild (missing children)', 'https://trackthemissingchild.gov.in'),
    abc: S('Animal Birth Control Rules, 2023 (Animal Welfare Board of India)', 'https://awbi.gov.in'),
    succession: S('Indian Succession Act, 1925 and Registration Act, 1908 (India Code)', 'https://www.indiacode.nic.in'),
    senior: S('Maintenance and Welfare of Parents and Senior Citizens Act, 2007', 'https://www.indiacode.nic.in'),
    udid: S('UDID — disability certificate portal', 'https://www.swavlambancard.gov.in'),
    itRules: S('IT (Intermediary Guidelines) Rules — MeitY', 'https://www.meity.gov.in'),
    pocso: S('POCSO Act, 2012 (India Code)', 'https://www.indiacode.nic.in'),
    onestop: S('One Stop Centres for women (Ministry of WCD)', 'https://wcd.gov.in'),
    rpwd: S('Rights of Persons with Disabilities Act, 2016', 'https://depwd.gov.in')
  };
  Object.assign(KB.help, {
    ceir: { label: 'CEIR', name: 'Sanchar Saathi — block a lost or stolen phone', detail: 'Blocks the phone on every network using its IMEI, and helps trace it. Needs a police report number.', href: 'https://www.sancharsaathi.gov.in' },
    rtionline: { label: 'RTI Online', name: 'File an RTI to a central government office', detail: 'Fee ₹10 (free for BPL). States have their own RTI portals.', href: 'https://rtionline.gov.in' },
    cpgrams: { label: 'CPGRAMS', name: 'Public grievance portal (Government of India)', detail: 'Complain about any central ministry or department. States have their own portals too.', href: 'https://pgportal.gov.in' },
    childline: { label: '1098', name: 'Child Helpline', detail: 'For any child who is missing, abused, working or in danger. Free, 24x7.', href: null },
    cara: { label: 'CARA', name: 'Central Adoption Resource Authority', detail: 'The only legal route to adopt an unrelated child in India. Register on CARINGS.', href: 'https://cara.wcd.gov.in' },
    efiling: { label: 'e-Filing', name: 'Income Tax e-filing portal', detail: 'See and reply to notices under Pending Actions → e-Proceedings.', href: 'https://www.incometax.gov.in' },
    trackchild: { label: 'Khoya-Paya', name: 'Missing children portal', detail: 'Report and search for missing and found children.', href: 'https://trackthemissingchild.gov.in' }
  });

  /* ================= 1. Neighbour dispute ================= */
  I.push({
    id: 'neighbour-dispute', cat: 'home', title: 'Neighbour problem — illegal construction, leakage, drain, noise, nuisance or harassment', short: 'Neighbour dispute',
    synonyms: ['neighbour', 'neighbor', 'padosi', 'padosi jhagda', 'neighbour illegal construction', 'neighbour construction', 'neighbour noise', 'noise complaint', 'loudspeaker', 'water leakage from neighbour', 'seepage', 'drain water', 'sewage', 'neighbour harassment', 'nuisance', 'garbage dumping', 'tree cutting', 'window facing', 'common wall', 'neighbour blocked light', 'terrace', 'terrace dispute', 'roof dispute'],
    intro: 'Most neighbour problems are solved fastest through the municipality or the magistrate, not a long civil case. Proof over time is what matters.',
    juris: 'Unauthorised construction is handled by the municipal or development authority under state building laws. A public nuisance can be stopped by an order of the Sub-Divisional / Executive Magistrate under Section 152 of the Bharatiya Nagarik Suraksha Sanhita, 2023 (earlier Section 133 CrPC). A civil court can grant an injunction and damages for private nuisance or interference with light, air or a common wall. Noise is governed by the Noise Pollution (Regulation and Control) Rules, 2000 — loudspeakers are generally not allowed between 10 pm and 6 am.',
    questions: [
      { id: 'nb_what', text: 'What is the problem?', why: 'Each kind of problem goes to a different office.', options: o([['build', 'Illegal or unsafe construction'], ['leak', 'Water leakage, seepage or drain'], ['noise', 'Noise, smoke, garbage or smell'], ['harass', 'Abuse, threats or harassment'], ['path', 'Blocking my way, parking or light']]) },
      { id: 'nb_own', text: 'Do you own or rent your home?', why: 'Owners and tenants have different rights; tenants may need the landlord to act.', options: o([['own', 'I own it'], ['rent', 'I rent it'], ['family', 'It belongs to my family']]) },
      { id: 'nb_flat', text: 'Is this in an apartment or a separate house?', why: 'In apartments the society or RWA often has to act first.', options: o([['flat', 'Apartment / society'], ['house', 'Separate house or plot'], NS]) },
      { id: 'nb_tried', text: 'Have you complained anywhere yet?', why: 'Written complaints show the problem was raised and ignored.', options: o([['none', 'Not yet'], ['talk', 'Only spoke to them'], ['written', 'Written complaint to society, municipality or police']]) },
      { id: 'nb_danger', text: 'Is anyone at risk of harm (cracks, collapse, violence)?', deep: true, why: 'Danger changes how fast you need to act.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) }
    ],
    evidence: [
      { id: 'nb_e_title', name: 'Your sale deed, allotment letter or rent agreement', fact: 'Your right to the property', why: 'Every office first asks who you are.', where: 'Your property file / landlord.', preserve: '' },
      { id: 'nb_e_photos', name: 'Dated photos and videos of the problem, taken over several days', fact: 'What is happening and that it continues', why: 'Repeated proof is stronger than one photo.', where: 'Your phone.', preserve: 'Keep the original files with date and location.' },
      { id: 'nb_e_plan', name: 'Approved building plan or a copy of the neighbour’s sanction (if available)', fact: 'What was allowed to be built', why: 'Shows the construction goes beyond approval.', where: 'Municipal office, RTI, or the society.', preserve: '', when: W('nb_what', 'build', 'path') },
      { id: 'nb_e_damage', name: 'Photos of damage to your walls, ceiling or floor, and repair estimates', fact: 'Loss caused to you', why: 'Needed to claim repair costs.', where: 'Your home; a contractor’s written estimate.', preserve: '', when: W('nb_what', 'leak', 'build') },
      { id: 'nb_e_noise', name: 'Audio/video recordings with time, and a simple log of dates and hours', fact: 'How often and how late it happens', why: 'Noise cases depend on pattern and timing.', where: 'Your phone; a notebook.', preserve: '', when: W('nb_what', 'noise') },
      { id: 'nb_e_threats', name: 'Messages, recordings or witness names for abuse or threats', fact: 'Harassment', why: 'Needed for a police complaint.', where: 'Phone; neighbours who saw it.', preserve: 'Screenshot with date.', when: W('nb_what', 'harass') },
      { id: 'nb_e_complaints', name: 'Copies of every complaint you made and any reply', fact: 'You raised it and nothing was done', why: 'Courts and magistrates ask what you tried first.', where: 'Society, municipality, police acknowledgments.', preserve: 'Keep the receipt or diary number.' },
      { id: 'nb_e_muni', name: 'Written complaint to the municipal / development authority', fact: 'Authority told about illegal construction or drainage', why: 'They can stop work, seal or demolish.', where: 'Ward office or the city’s online grievance portal.', preserve: 'Keep the complaint number.', action: true, when: ALL(W('nb_what', 'build', 'leak'), W('nb_tried', 'none', 'talk')) },
      { id: 'nb_e_society', name: 'Written complaint to the society / RWA', fact: 'The managing body was told', why: 'Societies can act on common areas and leakage between flats.', where: 'Society office or email.', preserve: '', action: true, when: ALL(W('nb_flat', 'flat'), W('nb_tried', 'none', 'talk')) },
      { id: 'nb_e_landlord', name: 'Message to your landlord asking them to act', fact: 'Owner informed', why: 'Some remedies must be pursued by the owner.', where: '', preserve: '', action: true, when: W('nb_own', 'rent') }
    ],
    urgent: [
      { id: 'nb_u_danger', level: 'now', when: W('nb_danger', 'yes'), title: 'If there is danger, call 112 and inform the municipality today', text: 'Cracks after digging or construction, or threats of violence, should not wait for a civil case.', help: ['e112'] }
    ],
    stand: [
      { k: 'next', when: W('nb_what', 'build'), text: 'The municipality can issue a stop-work notice or seal illegal construction — this is usually faster than a suit.' },
      { k: 'next', when: W('nb_what', 'noise'), text: 'Loudspeakers at night are generally not allowed between 10 pm and 6 am — police can act on a call.' },
      { k: 'good', when: W('nb_tried', 'written'), text: 'You already have written complaints on record — that helps any magistrate or court action.' },
      { k: 'risk', when: W('nb_tried', 'none', 'talk'), text: 'Without a written complaint it is your word against theirs. Put it in writing first.' }
    ],
    lawyerQs: [
      { text: 'Should I go to the municipality, the magistrate (Section 152 BNSS), or the civil court for an injunction?' },
      { text: 'Can I recover repair costs from my neighbour?', when: W('nb_what', 'leak', 'build') },
      { text: 'Can I get an urgent stay on the construction?', when: W('nb_what', 'build') }
    ],
    sources: [SRC.bnss, S('Noise Pollution (Regulation and Control) Rules, 2000 — CPCB', 'https://cpcb.nic.in'), SRC.nalsa]
  });

  /* ================= 2. Housing society / RWA ================= */
  I.push({
    id: 'society-dispute', cat: 'home', title: 'Housing society or RWA dispute — maintenance charges, NOC, parking, repairs or elections', short: 'Housing society or RWA dispute',
    synonyms: ['society', 'housing society', 'rwa', 'apartment association', 'society maintenance charges', 'maintenance bill', 'society noc', 'noc for sale', 'share certificate', 'society parking', 'parking dispute', 'society election', 'society secretary', 'society chairman', 'society repairs', 'transfer fee', 'non occupancy charges', 'cooperative housing society', 'flat owners association'],
    intro: 'Most society disputes go first to the Registrar of Co-operative Societies or the authority under your state’s apartment law — not a regular court.',
    juris: 'Co-operative housing societies are governed by your state’s Co-operative Societies Act and the society’s bye-laws; disputes go to the Registrar or a Co-operative Court. Apartment owners’ associations are governed by state apartment ownership laws. A society cannot refuse a sale NOC or charge transfer fees beyond what the bye-laws and state rules allow. Where you pay for services, a Consumer Commission may also hear the complaint.',
    questions: [
      { id: 'so_what', text: 'What is the dispute about?', why: 'Charges, NOCs, parking and elections each have their own rules.', options: o([['charges', 'Maintenance or other charges'], ['noc', 'NOC, share certificate or transfer refused'], ['parking', 'Parking or use of common areas'], ['repairs', 'Repairs, leakage or redevelopment'], ['mgmt', 'Elections, accounts or committee misconduct']]) },
      { id: 'so_type', text: 'What kind of body runs your building?', why: 'Decides which authority hears the dispute.', options: o([['coop', 'Co-operative housing society'], ['assoc', 'Apartment owners’ association / RWA'], ['builder', 'Still with the builder'], NS]) },
      { id: 'so_role', text: 'Are you the flat owner?', why: 'Tenants usually have to act through the owner.', options: o([['owner', 'Yes, owner'], ['tenant', 'Tenant'], ['heir', 'Legal heir of the owner']]) },
      { id: 'so_written', text: 'Did you raise it in writing with the committee?', why: 'Authorities ask for this first.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'so_e_deed', name: 'Sale deed / allotment letter and share certificate', fact: 'You are a member', why: 'Membership is the basis of every claim.', where: 'Your property file.', preserve: '' },
      { id: 'so_e_bye', name: 'Society bye-laws and any registration certificate', fact: 'The society’s own rules', why: 'Most disputes turn on what the bye-laws allow.', where: 'Society office; Registrar’s office.', preserve: '' },
      { id: 'so_e_bills', name: 'Maintenance bills, receipts and the general body resolution fixing charges', fact: 'What was charged and how it was approved', why: 'Charges must be approved and reasonable.', where: 'Society office.', preserve: '', when: W('so_what', 'charges', 'mgmt') },
      { id: 'so_e_noc', name: 'Your NOC or transfer application and any refusal', fact: 'NOC was asked for and refused or delayed', why: 'Shows unreasonable refusal.', where: 'Your sent letters/emails.', preserve: '', when: W('so_what', 'noc') },
      { id: 'so_e_parking', name: 'Parking allotment letter, sale deed clause, or committee decision', fact: 'Your right to the space', why: 'Parking disputes turn on allotment records.', where: 'Society or builder documents.', preserve: '', when: W('so_what', 'parking') },
      { id: 'so_e_photos', name: 'Photos of damage, leakage or the disputed area', fact: 'The condition', why: 'Supports repair or use complaints.', where: 'Your phone.', preserve: '', when: W('so_what', 'repairs', 'parking') },
      { id: 'so_e_minutes', name: 'Minutes of meetings, audit reports and election notices', fact: 'How decisions were made', why: 'Needed to challenge committee actions.', where: 'Society office (members can ask for copies).', preserve: '', when: W('so_what', 'mgmt', 'charges') },
      { id: 'so_e_letters', name: 'Your letters/emails to the committee and their replies', fact: 'You raised it', why: 'Required before going to the Registrar.', where: 'Your email.', preserve: '' },
      { id: 'so_e_write', name: 'Write to the committee and ask for a reply within 15 days', fact: 'Formal demand', why: 'Most authorities expect this step.', where: '', preserve: 'Keep proof of delivery.', action: true, when: W('so_written', 'no') }
    ],
    urgent: [],
    stand: [
      { k: 'good', when: W('so_what', 'noc'), text: 'Societies generally cannot block a sale by refusing an NOC when the bye-laws do not require one.' },
      { k: 'risk', when: W('so_what', 'charges'), text: 'Unpaid dues can lead to interest and recovery orders — pay the undisputed part and dispute the rest in writing.' },
      { k: 'next', when: W('so_type', 'coop'), text: 'For a co-operative society, the Deputy / Assistant Registrar of Co-operative Societies is usually the first stop.' },
      { k: 'next', when: W('so_type', 'builder'), text: 'If the builder has not handed over to an association, RERA may be able to order it.' }
    ],
    lawyerQs: [
      { text: 'Should this go to the Registrar, the Co-operative Court, RERA, or the Consumer Commission?' },
      { text: 'Are these charges allowed under our bye-laws and state rules?', when: W('so_what', 'charges') }
    ],
    sources: [S('Ministry of Cooperation — state co-operative laws', 'https://www.cooperation.gov.in'), S('RERA — Ministry of Housing and Urban Affairs', 'https://mohua.gov.in'), SRC.nalsa]
  });

  /* ================= 3. Land records / mutation ================= */
  I.push({
    id: 'land-records', cat: 'home', title: 'Land or property records wrong, or mutation / name transfer stuck (khata, 7/12, jamabandi, patta)', short: 'Land records and mutation',
    synonyms: ['mutation', 'dakhil kharij', 'namantaran', 'name transfer', 'property name transfer', 'khata transfer', 'khata', 'patta', 'chitta', 'adangal', '7/12', '7 12', 'satbara', 'jamabandi', 'khatauni', 'ror', 'record of rights', 'land record wrong', 'bhulekh', 'girdawari', 'survey number', 'land measurement', 'demarcation', 'property tax name change', 'fard', 'pahani'],
    intro: 'Mutation only updates government records for tax — it does not decide who owns the land. But wrong records cause real trouble, so fix them early.',
    juris: 'Land and property records are kept by the state revenue department (rural) or the municipal body (urban) under state land revenue laws. Mutation is ordered by the Tehsildar / Revenue Officer after notice to everyone affected; appeals lie to higher revenue officers. Courts have repeatedly held that mutation entries do not create or end ownership — title depends on documents such as a sale deed, will, partition or inheritance. Many states now give a time limit for mutation and let you apply and track online.',
    questions: [
      { id: 'lrc_what', text: 'What do you need?', why: 'New mutation, correction and demarcation follow different steps.', options: o([['mutate', 'Transfer the name after purchase or inheritance'], ['wrong', 'Correct a wrong name, area or entry'], ['stuck', 'My mutation application is stuck or rejected'], ['measure', 'Measurement / demarcation of my land']]) },
      { id: 'lrc_how', text: 'How did you get the property?', why: 'Each route needs different proof.', options: o([['bought', 'I bought it'], ['inherit', 'Inherited after a death'], ['gift', 'Gift, partition or family settlement'], ['allot', 'Government allotment or lease']]) },
      { id: 'lrc_type', text: 'Is it farm land or a house/plot in a town?', why: 'Rural land goes to the revenue office; town property to the municipality.', options: o([['rural', 'Farm / rural land'], ['urban', 'House, flat or plot in a town'], NS]) },
      { id: 'lrc_object', text: 'Is anyone objecting?', why: 'An objection turns a paper process into a dispute.', options: o([['no', 'No'], ['family', 'A family member'], ['other', 'Someone else'], NS]) }
    ],
    evidence: [
      { id: 'lrc_e_deed', name: 'The document that gives you the property (sale deed, gift/partition deed, will, or allotment)', fact: 'Your title', why: 'Mutation follows the title document.', where: 'Your records; certified copy from the Sub-Registrar.', preserve: '' },
      { id: 'lrc_e_extract', name: 'Current record extract (7/12, khatauni, jamabandi, patta, khata or property tax record)', fact: 'What the record says now', why: 'Shows the entry to be changed.', where: 'State land records portal or Tehsil / municipal office.', preserve: 'Download a dated copy.' },
      { id: 'lrc_e_death', name: 'Death certificate and legal heir certificate / succession papers', fact: 'Who the heirs are', why: 'Needed for inheritance mutation.', where: 'Municipal office; Tehsildar.', preserve: '', when: W('lrc_how', 'inherit') },
      { id: 'lrc_e_noc', name: 'No-objection or consent from other heirs (if any)', fact: 'Others agree', why: 'Avoids objections and delay.', where: 'Family members, ideally on stamp paper.', preserve: '', when: W('lrc_how', 'inherit', 'gift') },
      { id: 'lrc_e_old', name: 'Older records and maps (previous mutations, survey map, partition records)', fact: 'How the entry got there', why: 'Proves the record is wrong.', where: 'Revenue office; RTI.', preserve: '', when: W('lrc_what', 'wrong', 'measure') },
      { id: 'lrc_e_tax', name: 'Land revenue or property tax receipts', fact: 'You have been paying', why: 'Supports possession and the correction.', where: 'Your records.', preserve: '' },
      { id: 'lrc_e_app', name: 'Your mutation application, acknowledgement and any rejection order', fact: 'What happened to your application', why: 'Needed for appeal or follow-up.', where: 'Tehsil / municipal portal.', preserve: '', when: W('lrc_what', 'stuck') },
      { id: 'lrc_e_id', name: 'ID proof of all applicants', fact: 'Who you are', why: 'Asked in every application.', where: 'Aadhaar / voter ID.', preserve: '' },
      { id: 'lrc_e_rti', name: 'File an RTI for the status and file notings of your application', fact: 'Why it is stuck', why: 'Often moves a stuck file.', where: 'State RTI portal or by post.', preserve: '', action: true, when: W('lrc_what', 'stuck') }
    ],
    urgent: [
      { id: 'lrc_u_appeal', level: 'soon', when: W('lrc_what', 'stuck'), title: 'If you got a rejection order, check the appeal deadline', text: 'Revenue appeals have short time limits, often 30 to 90 days depending on the state.', help: ['l15100'] }
    ],
    stand: [
      { k: 'good', text: 'Mutation does not decide ownership — a wrong entry does not by itself take away your title.' },
      { k: 'risk', when: W('lrc_object', 'family', 'other'), text: 'With an objection, the revenue officer may send the matter to a civil court to decide title.' },
      { k: 'next', when: W('lrc_what', 'stuck'), text: 'An RTI and a written reminder to the Tehsildar often move a stuck mutation.' }
    ],
    lawyerQs: [
      { text: 'Is this a revenue matter or does title have to be decided by a civil court?' },
      { text: 'What is the appeal route and time limit in my state?', when: W('lrc_what', 'stuck', 'wrong') }
    ],
    also: ['family'],
    sources: [SRC.dilrmp, SRC.rti, SRC.nalsa]
  });

  /* ================= 4. Will / gift / transfer to family ================= */
  I.push({
    id: 'will-gift', cat: 'family', title: 'Making a will, gift deed or release deed — passing property to family', short: 'Will, gift deed or release deed',
    synonyms: ['how to make a will', 'make a will', 'write a will', 'will registration', 'gift deed', 'transfer property to son', 'transfer property to daughter', 'transfer property to wife', 'property transfer to children', 'release deed', 'relinquishment deed', 'hak tyag', 'settlement deed', 'nominee vs will', 'probate', 'codicil', 'cancel gift deed'],
    intro: 'A will takes effect after death and can be changed any time. A gift deed works now and is hard to undo. Choose with care.',
    juris: 'A will must be in writing, signed by the person making it and attested by two witnesses (Indian Succession Act, 1925); registration is optional but helps. A gift of immovable property must be by a registered deed (Transfer of Property Act, 1882) and stamp duty applies, often reduced for close family. A release/relinquishment deed by a co-owner must also be registered. Muslims can will away only up to one-third without heirs’ consent. Under the Senior Citizens Act, 2007, a gift made on the condition of being cared for can be cancelled by the tribunal if that care is not given.',
    questions: [
      { id: 'wg_what', text: 'What do you want to do?', why: 'Each document has different formalities.', options: o([['will', 'Make or change a will'], ['gift', 'Gift property now to a family member'], ['release', 'Give up my share to a co-owner (release deed)'], ['undo', 'Cancel a gift I already made']]) },
      { id: 'wg_prop', text: 'What property is involved?', why: 'Land and flats need registration; money and shares do not.', options: o([['land', 'House, flat or land'], ['money', 'Bank deposits, shares or insurance'], ['both', 'Both']]) },
      { id: 'wg_source', text: 'Is the property self-acquired or ancestral / joint family?', why: 'You can only give what is legally yours.', options: o([['self', 'Self-acquired'], ['ancestral', 'Ancestral or joint family'], NS]) },
      { id: 'wg_religion', text: 'Which personal law applies to you?', why: 'Muslim law limits wills to one-third.', options: o([['hindu', 'Hindu, Sikh, Jain or Buddhist'], ['muslim', 'Muslim'], ['christian', 'Christian, Parsi or other'], PN]) },
      { id: 'wg_family', text: 'Could anyone in the family object later?', deep: true, why: 'Expected disputes need extra safeguards.', options: o([['no', 'Unlikely'], ['yes', 'Yes, possibly'], NS]) }
    ],
    evidence: [
      { id: 'wg_e_title', name: 'Title documents for each property (sale deed, mutation, tax receipts)', fact: 'The property is yours to give', why: 'A will or gift cannot pass more than you own.', where: 'Your records.', preserve: '' },
      { id: 'wg_e_list', name: 'List of assets with account / folio / policy numbers and current nominees', fact: 'Everything covered', why: 'Avoids gaps and conflicts with nominations.', where: 'Bank, demat, insurance statements.', preserve: '' },
      { id: 'wg_e_family', name: 'Names, ages and addresses of family members and beneficiaries', fact: 'Who gets what', why: 'Clear identification avoids challenges.', where: '', preserve: '' },
      { id: 'wg_e_ids', name: 'ID proof of you and the beneficiaries', fact: 'Identity', why: 'Needed for registration.', where: 'Aadhaar / PAN.', preserve: '' },
      { id: 'wg_e_witness', name: 'Two adult witnesses who are not beneficiaries', fact: 'Valid attestation', why: 'A will without two witnesses can fail.', where: 'Trusted friends, colleagues or your doctor.', preserve: '', when: W('wg_what', 'will') },
      { id: 'wg_e_medical', name: 'A doctor’s note that you are of sound mind (helpful if older or unwell)', fact: 'Capacity', why: 'The most common challenge to a will is mental capacity.', where: 'Your doctor, on the day of signing.', preserve: '', when: ALL(W('wg_what', 'will', 'gift'), W('wg_family', 'yes')) },
      { id: 'wg_e_coowner', name: 'Documents showing the co-ownership and the other co-owners’ details', fact: 'Your share', why: 'A release deed must describe the share given up.', where: 'Inheritance or purchase papers.', preserve: '', when: W('wg_what', 'release') },
      { id: 'wg_e_giftdeed', name: 'The registered gift deed and proof of the care condition', fact: 'What was promised in return', why: 'Needed to cancel a gift under the Senior Citizens Act.', where: 'Sub-Registrar copy; letters, witnesses.', preserve: '', when: W('wg_what', 'undo') },
      { id: 'wg_e_stamp', name: 'Check stamp duty and registration fee for family gifts in your state', fact: 'Cost', why: 'Many states charge much less for gifts to close family.', where: 'State registration (IGR) website.', preserve: '', action: true, when: W('wg_what', 'gift', 'release') }
    ],
    urgent: [],
    stand: [
      { k: 'good', when: W('wg_what', 'will'), text: 'You can change or cancel a will at any time while you are alive.' },
      { k: 'risk', when: W('wg_what', 'gift'), text: 'Once a gift deed is registered and accepted, it is generally hard to cancel. Consider a will, or put the care condition in writing.' },
      { k: 'risk', when: W('wg_religion', 'muslim'), text: 'Under Muslim law, a will beyond one-third of the estate needs the other heirs’ consent.' },
      { k: 'risk', when: W('wg_source', 'ancestral'), text: 'Ancestral or joint family property may not be fully yours to will or gift.' },
      { k: 'next', when: W('wg_what', 'undo'), text: 'A parent who gifted property on condition of care can ask the Maintenance Tribunal to cancel the gift.' }
    ],
    lawyerQs: [
      { text: 'Is a will or a gift deed better for my situation, including tax and stamp duty?' },
      { text: 'Should I register the will, and who should be executor?', when: W('wg_what', 'will') },
      { text: 'Can my gift be cancelled because the promised care is not given?', when: W('wg_what', 'undo') }
    ],
    sources: [SRC.succession, SRC.senior, SRC.nalsa]
  });

  /* ================= 5. Adoption / guardianship ================= */
  I.push({
    id: 'adoption-guardianship', cat: 'family', title: 'Adoption or guardianship of a child', short: 'Adoption or guardianship',
    synonyms: ['adoption', 'adopt a child', 'adopt child process', 'adopt relative child', 'step parent adoption', 'stepchild adoption', 'cara', 'guardianship', 'guardian of child', 'legal guardian', 'guardian certificate', 'kafala', 'adoption deed', 'adoption certificate', 'orphan child care', 'foster care'],
    intro: 'Adopting a child you are not related to is only legal through CARA. Adopting a relative’s child or a stepchild has a simpler route — but still needs an order.',
    juris: 'Adoption of orphaned, abandoned or surrendered children, and relative or step-parent adoption, is governed by the Juvenile Justice (Care and Protection of Children) Act, 2015 and the Adoption Regulations, 2022; adoption orders are passed by the District Magistrate and applications go through CARA’s CARINGS portal. Hindus may also adopt under the Hindu Adoptions and Maintenance Act, 1956. Personal laws of Muslims, Christians and Parsis do not provide for adoption, but anyone can adopt under the JJ Act, or be appointed guardian by a court under the Guardians and Wards Act, 1890. Taking a child without this process is illegal and can be treated as trafficking.',
    questions: [
      { id: 'ad_what', text: 'What are you trying to do?', why: 'Unrelated adoption, relative adoption and guardianship follow different routes.', options: o([['unrelated', 'Adopt a child not related to me'], ['relative', 'Adopt a relative’s child or my stepchild'], ['guardian', 'Become guardian (not adopt)'], ['given', 'A child was given to us informally']]) },
      { id: 'ad_status', text: 'What is your situation?', why: 'Eligibility differs for couples and single people.', options: o([['couple', 'Married couple'], ['single_f', 'Single woman'], ['single_m', 'Single man'], ['other', 'Other']]) },
      { id: 'ad_religion', text: 'Which personal law applies to you?', why: 'Hindus have an extra route; others use the JJ Act or guardianship.', options: o([['hindu', 'Hindu, Sikh, Jain or Buddhist'], ['other', 'Muslim, Christian, Parsi or other'], PN]) },
      { id: 'ad_abroad', text: 'Do you live outside India?', deep: true, why: 'NRIs and foreigners have extra steps and documents.', options: o([['no', 'No'], ['yes', 'Yes']]) }
    ],
    evidence: [
      { id: 'ad_e_ids', name: 'ID and address proof, and photos of the adoptive parents', fact: 'Who you are', why: 'Required for registration.', where: 'Aadhaar / passport.', preserve: '' },
      { id: 'ad_e_marriage', name: 'Marriage certificate (if a couple) and consent of the spouse', fact: 'Both partners agree', why: 'Couples must adopt jointly with consent.', where: 'Your records.', preserve: '', when: W('ad_status', 'couple') },
      { id: 'ad_e_income', name: 'Income proof (salary slips, ITR)', fact: 'You can support the child', why: 'Part of the eligibility check.', where: 'Employer / IT portal.', preserve: '' },
      { id: 'ad_e_medical', name: 'Medical fitness certificates', fact: 'You are fit to care for a child', why: 'Required by the Adoption Regulations.', where: 'A registered doctor.', preserve: '' },
      { id: 'ad_e_birth', name: 'Your birth certificates / age proof', fact: 'Age eligibility', why: 'There are age limits by the child’s age.', where: 'Your records.', preserve: '' },
      { id: 'ad_e_child', name: 'The child’s birth certificate and the birth parents’ consent', fact: 'Who the child is and who agrees', why: 'Needed for relative or step-parent adoption.', where: 'Family; birth registrar.', preserve: '', when: W('ad_what', 'relative', 'given') },
      { id: 'ad_e_carings', name: 'Register on CARA’s CARINGS portal', fact: 'Formal application', why: 'The only lawful route for adopting an unrelated child.', where: 'cara.wcd.gov.in', preserve: 'Keep your registration number.', action: true, when: W('ad_what', 'unrelated', 'relative') },
      { id: 'ad_e_guardian', name: 'Proof of the child’s situation (parents’ death certificates, or why you should be guardian)', fact: 'Need for a guardian', why: 'The court decides in the child’s welfare.', where: 'Family records.', preserve: '', when: W('ad_what', 'guardian') }
    ],
    urgent: [
      { id: 'ad_u_informal', level: 'soon', when: W('ad_what', 'given'), title: 'Make it legal soon', text: 'A child handed over informally is not legally adopted. Without an order, the child may lose inheritance and documents, and the arrangement can be treated as illegal. Speak to an advocate or the District Child Protection Unit.', help: ['childline', 'l15100'] }
    ],
    stand: [
      { k: 'good', when: W('ad_what', 'relative'), text: 'Relative and step-parent adoption has its own simpler track under the Adoption Regulations, 2022.' },
      { k: 'risk', when: W('ad_status', 'single_m'), text: 'A single man is generally not allowed to adopt a girl child.' },
      { k: 'next', when: W('ad_what', 'unrelated'), text: 'After registration there is a home study, then a referral — the wait can be long.' }
    ],
    lawyerQs: [
      { text: 'Which law and route applies to us, and how long will it take?' },
      { text: 'How do we regularise a child who was given to us informally?', when: W('ad_what', 'given') }
    ],
    sources: [SRC.cara, S('Juvenile Justice (Care and Protection of Children) Act, 2015 (India Code)', 'https://www.indiacode.nic.in'), SRC.nalsa]
  });

  /* ================= 6. Government job / service matters ================= */
  I.push({
    id: 'govt-service', cat: 'work', title: 'Government job problem — suspension, departmental inquiry, transfer, promotion, salary or pension', short: 'Government job or pension',
    synonyms: ['government employee', 'govt employee', 'government job', 'suspension', 'suspended from job', 'departmental inquiry', 'departmental enquiry', 'charge sheet government employee', 'chargesheet rule 14', 'transfer order', 'promotion denied', 'seniority', 'acp macp', 'pay fixation', 'pension not received', 'pension stopped', 'family pension', 'armed forces pension', 'ex serviceman', 'cat case', 'central administrative tribunal', 'armed forces tribunal', 'regularisation', 'contract employee government', 'psu employee'],
    intro: 'Most government service disputes must first go through internal appeals and then to a tribunal — and the tribunal has a strict one-year limit.',
    juris: 'Central government employees’ disputes go to the Central Administrative Tribunal under the Administrative Tribunals Act, 1985, usually after exhausting departmental remedies, and generally within one year of the final order. Disciplinary action follows the CCS (CCA) Rules, 1965 or your service rules — a charge sheet, a chance to reply, an inquiry and a reasoned order. Suspensions must be reviewed within set periods. Armed forces personnel and veterans go to the Armed Forces Tribunal. State employees go to the State Administrative Tribunal or the High Court. Pension grievances can be raised on CPENGRAMS.',
    questions: [
      { id: 'gs_what', text: 'What is the problem?', why: 'Each issue has its own rules and remedies.', options: o([['suspend', 'Suspension or charge sheet / inquiry'], ['transfer', 'Transfer order'], ['promo', 'Promotion, seniority or pay fixation'], ['pension', 'Pension, gratuity or retirement dues'], ['termination', 'Termination, removal or non-regularisation']]) },
      { id: 'gs_employer', text: 'Who is your employer?', why: 'Decides which tribunal or court hears it.', options: o([['central', 'Central government'], ['state', 'State government'], ['psu', 'PSU / public bank / autonomous body'], ['forces', 'Armed forces / CAPF']]) },
      { id: 'gs_order', text: 'Is there a final order against you?', why: 'Time limits run from the final order.', options: o([['yes', 'Yes, a final order'], ['pending', 'Proceedings are still on'], ['none', 'No order — just no action']]) },
      { id: 'gs_appeal', text: 'Have you filed a departmental appeal or representation?', why: 'Usually required before going to a tribunal.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'gs_e_appt', name: 'Appointment letter, service book extract and current pay slip', fact: 'Your service details', why: 'Basic proof of your post and pay.', where: 'Your office / HRMS.', preserve: '' },
      { id: 'gs_e_order', name: 'The order you are challenging (suspension, transfer, penalty, rejection)', fact: 'What was decided', why: 'The core document of any case.', where: 'Your copy; office.', preserve: '' },
      { id: 'gs_e_charge', name: 'Charge sheet, your reply, inquiry report and documents relied on', fact: 'The case against you and your defence', why: 'Procedural defects are common grounds to challenge.', where: 'Disciplinary file (you can inspect it).', preserve: '', when: W('gs_what', 'suspend', 'termination') },
      { id: 'gs_e_rules', name: 'The service rules, policy or circular that applies', fact: 'What the rules require', why: 'Transfers and promotions must follow policy.', where: 'Department website; RTI.', preserve: '', when: W('gs_what', 'transfer', 'promo') },
      { id: 'gs_e_comparator', name: 'Details of juniors or colleagues treated better', fact: 'Unequal treatment', why: 'Seniority and promotion cases need comparison.', where: 'Seniority lists, gradation lists, RTI.', preserve: '', when: W('gs_what', 'promo') },
      { id: 'gs_e_ppo', name: 'PPO, retirement order and pension papers', fact: 'Pension due', why: 'Needed for any pension claim.', where: 'Pension office / SPARSH / bank.', preserve: '', when: W('gs_what', 'pension') },
      { id: 'gs_e_reps', name: 'Your representations / appeals and any replies', fact: 'You used internal remedies', why: 'Tribunals expect this first.', where: 'Your office copies.', preserve: 'Keep diary numbers.' },
      { id: 'gs_e_rep', name: 'File a written representation or appeal to the competent authority', fact: 'Internal remedy used', why: 'Usually needed before a tribunal case.', where: 'Through proper channel.', preserve: '', action: true, when: W('gs_appeal', 'no') },
      { id: 'gs_e_cpen', name: 'Register the pension grievance on CPENGRAMS', fact: 'Grievance on record', why: 'Departments must respond.', where: 'pgportal.gov.in/pension', preserve: '', action: true, when: ALL(W('gs_what', 'pension'), W('gs_employer', 'central', 'forces')) }
    ],
    urgent: [
      { id: 'gs_u_limit', level: 'soon', when: W('gs_order', 'yes'), title: 'Watch the one-year limit', text: 'Tribunal cases generally must be filed within one year of the final order (or of the appeal decision). Delay needs a strong reason.', help: ['l15100'] }
    ],
    stand: [
      { k: 'good', when: W('gs_what', 'suspend'), text: 'Long suspensions must be reviewed, and subsistence allowance is payable during suspension.' },
      { k: 'risk', when: W('gs_what', 'transfer'), text: 'Courts rarely interfere with transfers unless they break policy, are malicious, or punish you without inquiry.' },
      { k: 'good', when: W('gs_what', 'suspend', 'termination'), text: 'A penalty without a fair inquiry or a chance to reply can be set aside.' }
    ],
    lawyerQs: [
      { text: 'Have I used all internal remedies, and when does my tribunal limit expire?' },
      { text: 'Were there defects in the inquiry I can rely on?', when: W('gs_what', 'suspend', 'termination') }
    ],
    sources: [SRC.cat, SRC.pension, S('Armed Forces Tribunal', 'https://aftdelhi.nic.in'), SRC.nalsa]
  });

  /* ================= 7. Workplace injury ================= */
  I.push({
    id: 'workplace-injury', cat: 'work', title: 'I was injured at work, or a worker died on the job — compensation', short: 'Injury at work',
    synonyms: ['injured at work', 'injury at work', 'accident at work', 'factory accident', 'workplace accident', 'construction site accident', 'employee compensation', 'workmen compensation', 'esic claim', 'esi', 'esi claim', 'disablement benefit', 'dependants benefit', 'died on duty', 'worker died', 'labour accident', 'machine accident'],
    intro: 'Employers must pay compensation for injuries arising out of work, whether or not it was anyone’s fault. Report it quickly and keep every medical paper.',
    juris: 'Compensation for injury or death arising out of and in the course of employment is now under the Code on Social Security, 2020 (in force from 21 November 2025), which replaces the Employee’s Compensation Act, 1923. Workers covered by ESIC claim disablement and dependants’ benefits from ESIC. Other claims go to the employer and, if refused, to the competent authority under the Code. Separate police action is possible if negligence caused the accident.',
    questions: [
      { id: 'wi_who', text: 'Who was hurt?', why: 'Families of workers who died have their own claims.', options: o([['me', 'Me'], ['family', 'A family member'], ['died', 'A worker who died']]) },
      { id: 'wi_esic', text: 'Is the worker covered by ESIC (ESI card / IP number)?', why: 'ESIC pays benefits directly; others claim from the employer.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'wi_type', text: 'What kind of work?', why: 'Contract and site workers often have unclear employers.', options: o([['regular', 'Regular employee'], ['contract', 'Contract or daily-wage worker'], ['construction', 'Construction site'], ['other', 'Other']]) },
      { id: 'wi_reported', text: 'Was the accident reported to the employer in writing?', why: 'Notice to the employer is the first step.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) }
    ],
    evidence: [
      { id: 'wi_e_emp', name: 'Proof of employment (ID card, pay slips, attendance, contractor’s gate pass)', fact: 'The worker was employed', why: 'Employers often deny the worker was theirs.', where: 'Wallet, phone photos, co-workers.', preserve: '' },
      { id: 'wi_e_medical', name: 'Hospital records, discharge summary, bills and disability certificate', fact: 'The injury and its effect', why: 'Compensation depends on loss of earning capacity.', where: 'Hospital; medical board.', preserve: 'Keep originals; give copies.' },
      { id: 'wi_e_accident', name: 'Accident details: date, time, place, witnesses, photos', fact: 'It happened at work', why: 'Must arise out of and in the course of employment.', where: 'Co-workers; your phone.', preserve: '' },
      { id: 'wi_e_wage', name: 'Wage proof (salary slips, bank credits)', fact: 'Monthly wages', why: 'Compensation is calculated on wages.', where: 'Bank statements.', preserve: '' },
      { id: 'wi_e_esic', name: 'ESI card / IP number and the accident report (Form 12 or online)', fact: 'ESIC coverage', why: 'Needed for ESIC benefits.', where: 'Employer / ESIC portal.', preserve: '', when: W('wi_esic', 'yes') },
      { id: 'wi_e_death', name: 'Death certificate, post-mortem report and FIR', fact: 'Cause of death', why: 'Needed for dependants’ claims.', where: 'Hospital, police.', preserve: '', when: W('wi_who', 'died') },
      { id: 'wi_e_dependants', name: 'Proof of dependants (family ID, ration card, birth certificates)', fact: 'Who depended on the worker', why: 'Decides who gets compensation.', where: 'Family records.', preserve: '', when: W('wi_who', 'died') },
      { id: 'wi_e_notice', name: 'Written notice of the accident to the employer', fact: 'Employer informed', why: 'A formal step before claiming.', where: '', preserve: 'Keep a signed copy or email.', action: true, when: W('wi_reported', 'no', 'unsure') }
    ],
    urgent: [
      { id: 'wi_u_death', level: 'now', when: W('wi_who', 'died'), title: 'Ensure a post-mortem and police report', text: 'These are needed for compensation and to fix responsibility. Do not sign any settlement before getting advice.', help: ['e112', 'l15100'] }
    ],
    stand: [
      { k: 'good', text: 'Compensation does not depend on proving the employer was at fault.' },
      { k: 'risk', when: W('wi_type', 'contract', 'construction'), text: 'The principal employer can be liable if the contractor does not pay.' },
      { k: 'next', when: W('wi_esic', 'yes'), text: 'ESIC pays temporary and permanent disablement benefit — claim through the ESIC branch.' }
    ],
    lawyerQs: [
      { text: 'How much compensation is due, and who must pay it?' },
      { text: 'Should a police case also be filed for negligence?', when: W('wi_who', 'died', 'family') }
    ],
    also: ['accidents'],
    sources: [SRC.coss, SRC.esic, SRC.nalsa]
  });

  /* ================= 8. Assault, threats, extortion ================= */
  I.push({
    id: 'assault-threat', cat: 'police', title: 'Someone beat me, attacked me, threatened me, or is demanding money (extortion)', short: 'Assault, threats or extortion',
    synonyms: ['someone beat me', 'beaten', 'assault', 'attack', 'attacked', 'maarpeet', 'mar peet', 'fight', 'hit me', 'slapped', 'hurt', 'injury by someone', 'threat', 'threat to kill', 'death threat', 'jaan se marne ki dhamki', 'dhamki', 'criminal intimidation', 'extortion', 'hafta', 'ransom', 'blackmail money', 'goons', 'mob attack'],
    intro: 'Get medical help first and ask the hospital to record your injuries. Then report it in writing — even if the police treat it as a minor matter.',
    juris: 'Under the Bharatiya Nyaya Sanhita, 2023: voluntarily causing hurt (Section 115), grievous hurt (Section 117), criminal intimidation (Section 351) and extortion (Section 308). Serious offences are cognisable and police must register an FIR (Section 173 BNSS, including Zero FIR and e-FIR). For minor (non-cognisable) offences police record it and you may need a magistrate’s order to investigate. A medico-legal certificate (MLC) from the hospital is key evidence.',
    questions: [
      { id: 'at_what', text: 'What happened?', why: 'Hurt, threats and extortion are different offences.', type: 'multi', options: o([['hit', 'I was hit or injured'], ['threat', 'I was threatened'], ['money', 'Someone is demanding money'], ['damage', 'My property was damaged']]) },
      { id: 'at_injury', text: 'How serious are the injuries?', when: W('at_what', 'hit'), why: 'Grievous injuries are more serious offences.', options: o([['minor', 'Minor (bruises, small cuts)'], ['serious', 'Fracture, deep wound, eye/ear injury, or hospital stay'], ['none', 'No visible injury']]) },
      { id: 'at_who', text: 'Do you know the person?', why: 'Known persons can be named in the FIR.', options: o([['known', 'Yes'], ['unknown', 'No'], ['group', 'A group or gang']]) },
      { id: 'at_police', text: 'Have you gone to the police?', why: 'What you do next depends on their response.', options: o([['no', 'Not yet'], ['fir', 'FIR registered'], ['ncr', 'They gave an NCR / did not file FIR'], ['refused', 'They refused']]) },
      { id: 'at_continue', text: 'Is the threat still going on?', deep: true, why: 'Ongoing danger may need protection.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'at_e_mlc', name: 'Medico-legal certificate (MLC) and hospital records', fact: 'Your injuries', why: 'The most important proof in any hurt case.', where: 'Government or private hospital — ask for an MLC.', preserve: 'Get a copy.', when: W('at_what', 'hit') },
      { id: 'at_e_photos', name: 'Photos of injuries and damaged property, taken the same day', fact: 'What was done', why: 'Injuries fade quickly.', where: 'Your phone.', preserve: '' },
      { id: 'at_e_witness', name: 'Names and phone numbers of witnesses', fact: 'Others saw it', why: 'Independent witnesses carry weight.', where: '', preserve: '' },
      { id: 'at_e_cctv', name: 'CCTV footage from nearby shops or buildings', fact: 'The attack on camera', why: 'Often deleted within days.', where: 'Ask owners to save it; police can seize it.', preserve: 'Ask today.' },
      { id: 'at_e_threats', name: 'Threat messages, call recordings and call logs', fact: 'The threat or demand', why: 'Proves intimidation or extortion.', where: 'Your phone.', preserve: 'Screenshot with date and number; back up.', when: W('at_what', 'threat', 'money') },
      { id: 'at_e_payment', name: 'Proof of any money paid', fact: 'Extortion', why: 'Helps trace and recover.', where: 'UPI/bank records.', preserve: '', when: W('at_what', 'money') },
      { id: 'at_e_complaint', name: 'Your written complaint and the FIR / NCR copy', fact: 'You reported it', why: 'Next steps depend on it.', where: 'Police station; state police website.', preserve: '' },
      { id: 'at_e_sp', name: 'If police refuse, send the complaint to the Superintendent of Police in writing', fact: 'Escalation', why: 'The next step before going to the magistrate.', where: 'SP office or by registered post / email.', preserve: '', action: true, when: W('at_police', 'refused', 'ncr') }
    ],
    urgent: [
      { id: 'at_u_danger', level: 'now', when: ANY(W('at_continue', 'yes'), W('at_injury', 'serious')), title: 'Call 112 if you are in danger or badly hurt', text: 'Get treatment first. Hospitals must treat emergencies and record injuries.', help: ['e112'] }
    ],
    stand: [
      { k: 'good', when: W('at_injury', 'serious'), text: 'Serious injuries are cognisable offences — the police must register an FIR.' },
      { k: 'risk', when: W('at_police', 'ncr'), text: 'With only an NCR the police will not investigate on their own — you may need a magistrate’s order.' },
      { k: 'next', when: W('at_police', 'refused'), text: 'You can write to the SP, then apply to the magistrate to direct registration of an FIR.' }
    ],
    lawyerQs: [
      { text: 'Which offences apply, and are they cognisable?' },
      { text: 'Can I get protection or a bond against the person?', when: W('at_continue', 'yes') },
      { text: 'Will they file a counter-case against me, and how do I prepare?', when: W('at_who', 'known') }
    ],
    sources: [SRC.bns, SRC.bnss, SRC.nalsa]
  });

  /* ================= 9. Defamation ================= */
  I.push({
    id: 'defamation', cat: 'other', title: 'Someone is spreading lies about me, or I got a defamation notice', short: 'Defamation',
    synonyms: ['defamation', 'defamed', 'spreading lies', 'false rumours', 'false allegations', 'false allegation on social media', 'character assassination', 'bad review', 'fake review', 'insulting post', 'maanhani', 'manhani', 'reputation damaged', 'defamation notice', 'defamation case against me', 'slander', 'libel'],
    intro: 'Defamation can be fought in criminal court, civil court, or simply by getting the content removed. Save the proof before it disappears.',
    juris: 'Criminal defamation is an offence under Section 356 of the Bharatiya Nyaya Sanhita, 2023; a court can take it up only on a complaint by the person defamed. A civil suit for damages and an injunction is also possible; it should generally be filed within one year of publication. Truth for the public good, fair comment and good-faith opinions are defences. Online content can be reported to the platform’s Grievance Officer under the IT Rules, which must acknowledge and act within set times.',
    questions: [
      { id: 'df_side', text: 'Which side are you on?', why: 'Accusing and defending are very different.', options: o([['victim', 'Someone defamed me'], ['accused', 'I received a notice or case for defamation']]) },
      { id: 'df_where', text: 'Where was it said or published?', why: 'Online posts can be removed quickly; evidence differs.', type: 'multi', options: o([['social', 'Social media or WhatsApp'], ['news', 'News or website'], ['review', 'Review site'], ['spoken', 'Spoken to others'], ['letter', 'Letter, notice or complaint to an office']]) },
      { id: 'df_when', text: 'When was it first published?', why: 'Civil cases should usually be filed within a year.', options: o([['recent', 'Within the last 3 months'], ['year', '3 to 12 months ago'], ['old', 'More than a year ago']]) },
      { id: 'df_harm', text: 'What harm has it caused?', deep: true, when: W('df_side', 'victim'), why: 'Damages depend on harm.', type: 'multi', options: o([['job', 'Job or business loss'], ['family', 'Family or marriage trouble'], ['social', 'Social humiliation'], ['none', 'Not sure yet']]) }
    ],
    evidence: [
      { id: 'df_e_content', name: 'Screenshots / copies of the statement with date, link and who posted it', fact: 'What was said and where', why: 'The case rests on the exact words.', where: 'The post, page or document.', preserve: 'Save the URL and a full-page capture; posts get deleted.', when: W('df_side', 'victim') },
      { id: 'df_e_falsity', name: 'Proof that the statement is false', fact: 'It is untrue', why: 'Truth is a defence, so you must show it is false.', where: 'Documents, records, witnesses.', preserve: '', when: W('df_side', 'victim') },
      { id: 'df_e_reach', name: 'Who saw it (shares, comments, people who told you)', fact: 'It reached others', why: 'Defamation needs publication to third persons.', where: 'Comments, shares, witnesses.', preserve: '', when: W('df_side', 'victim') },
      { id: 'df_e_harm', name: 'Proof of harm (lost clients, messages from family, job emails)', fact: 'Damage to reputation', why: 'Supports damages.', where: 'Emails, letters.', preserve: '', when: W('df_side', 'victim') },
      { id: 'df_e_notice', name: 'The defamation notice or court summons you received', fact: 'What you are accused of', why: 'Reply deadlines run from it.', where: 'Your mail.', preserve: '', when: W('df_side', 'accused') },
      { id: 'df_e_basis', name: 'Proof of what you said and why (facts, documents, good-faith reasons)', fact: 'Your defence', why: 'Truth, fair comment and good faith are defences.', where: 'Your records.', preserve: '', when: W('df_side', 'accused') },
      { id: 'df_e_report', name: 'Report the post to the platform’s Grievance Officer', fact: 'Removal requested', why: 'Often the fastest relief.', where: 'Platform help centre / grievance contact.', preserve: 'Keep the ticket number.', action: true, when: ALL(W('df_side', 'victim'), W('df_where', 'social', 'review', 'news')) },
      { id: 'df_e_all', name: 'All messages and posts between you and the other person', fact: 'Context', why: 'Shows provocation, earlier disputes or apologies.', where: 'Your phone.', preserve: '' }
    ],
    urgent: [
      { id: 'df_u_summons', level: 'soon', when: W('df_side', 'accused'), title: 'Do not ignore a summons', text: 'If a court has summoned you, appear or arrange representation on the date. A legal notice should be answered after advice.', help: ['l15100'] }
    ],
    stand: [
      { k: 'risk', when: W('df_when', 'old'), text: 'More than a year has passed — a civil suit may be time-barred, though a criminal complaint may still be possible.' },
      { k: 'next', when: ALL(W('df_side', 'victim'), W('df_where', 'social', 'review')), text: 'A takedown request to the platform is often faster than any court case.' },
      { k: 'good', when: W('df_side', 'accused'), text: 'True statements made for the public good, and honest opinions, are recognised defences.' }
    ],
    lawyerQs: [
      { text: 'Is a criminal complaint, a civil suit, or a takedown the best route?', when: W('df_side', 'victim') },
      { text: 'How should I reply to the notice without making it worse?', when: W('df_side', 'accused') }
    ],
    also: ['young'],
    sources: [SRC.bns, SRC.itRules, SRC.nalsa]
  });

  /* ================= 10. Lost / stolen phone or documents ================= */
  I.push({
    id: 'lost-phone', cat: 'police', title: 'My phone was stolen or lost, or I lost important documents', short: 'Lost or stolen phone or documents',
    synonyms: ['mobile phone stolen', 'phone stolen', 'phone lost', 'mobile lost', 'mobile chori', 'phone chori', 'ceir', 'block phone imei', 'imei block', 'sanchar saathi', 'lost documents', 'documents lost', 'lost aadhaar', 'lost pan card', 'lost passport', 'lost rc', 'lost certificate', 'wallet stolen', 'lost article report', 'lost sim'],
    intro: 'Act in this order: block the SIM, report to police, then block the phone on CEIR. Do it today — stolen phones are used for fraud.',
    juris: 'Theft is an offence under the Bharatiya Nyaya Sanhita, 2023; most state police let you file an e-FIR for theft or a lost-article report online. The Department of Telecommunications’ CEIR system (on Sanchar Saathi) blocks a phone on all networks by IMEI and helps trace it, using your police report number. Duplicate documents are issued by the department that issued them, usually against the police report.',
    questions: [
      { id: 'lp_what', text: 'What did you lose?', why: 'Phones and documents need different steps.', type: 'multi', options: o([['phone', 'Mobile phone'], ['docs', 'ID or important documents'], ['wallet', 'Wallet / cards'], ['bag', 'Bag or other items']]) },
      { id: 'lp_how', text: 'Was it stolen or lost?', why: 'Theft needs an FIR; loss needs a lost-article report.', options: o([['stolen', 'Stolen / snatched'], ['lost', 'Lost'], NS]) },
      { id: 'lp_banking', text: 'Did the phone have UPI or banking apps?', when: W('lp_what', 'phone'), why: 'Money can be taken quickly from a stolen phone.', options: o([['yes', 'Yes'], ['no', 'No']]) },
      { id: 'lp_misuse', text: 'Has anything been misused (money taken, messages sent)?', why: 'Misuse needs a cyber complaint too.', options: o([['yes', 'Yes'], ['no', 'Not yet'], NS]) }
    ],
    evidence: [
      { id: 'lp_e_imei', name: 'IMEI number(s) of the phone', fact: 'Which phone', why: 'CEIR blocks by IMEI.', where: 'Phone box, purchase invoice, or Google/Apple account.', preserve: '', when: W('lp_what', 'phone') },
      { id: 'lp_e_bill', name: 'Purchase invoice of the phone', fact: 'You own it', why: 'Needed for CEIR and insurance.', where: 'Email, shop, e-commerce order.', preserve: '', when: W('lp_what', 'phone') },
      { id: 'lp_e_police', name: 'FIR or lost-article report with its number', fact: 'Reported to police', why: 'Needed for CEIR, duplicates and insurance.', where: 'State police website or police station.', preserve: 'Download the PDF.' },
      { id: 'lp_e_sim', name: 'Block the SIM with your operator and get a replacement', fact: 'Number secured', why: 'Stops OTP misuse.', where: 'Operator store or helpline.', preserve: '', action: true, when: W('lp_what', 'phone') },
      { id: 'lp_e_bank', name: 'Block UPI, cards and net banking', fact: 'Money protected', why: 'Prevents fraud.', where: 'Bank helpline / app from another phone.', preserve: 'Note the reference numbers.', action: true, when: ANY(W('lp_banking', 'yes'), W('lp_what', 'wallet')) },
      { id: 'lp_e_ceir', name: 'Block the phone on CEIR (Sanchar Saathi)', fact: 'Phone blocked on all networks', why: 'Makes it useless to thieves and helps trace it.', where: 'sancharsaathi.gov.in → Block your lost/stolen mobile', preserve: 'Keep the request ID to unblock later.', action: true, when: W('lp_what', 'phone') },
      { id: 'lp_e_list', name: 'List of documents lost with their numbers', fact: 'What must be replaced', why: 'Duplicates are faster with numbers.', where: 'DigiLocker, photocopies, emails.', preserve: '', when: W('lp_what', 'docs', 'wallet') },
      { id: 'lp_e_cyber', name: 'Cyber complaint for any money taken or misuse', fact: 'Fraud reported', why: 'Starts freezing of money.', where: 'Call 1930 or cybercrime.gov.in', preserve: '', action: true, when: W('lp_misuse', 'yes') }
    ],
    urgent: [
      { id: 'lp_u_money', level: 'now', when: ANY(W('lp_misuse', 'yes'), W('lp_banking', 'yes')), title: 'Block banking now; call 1930 if money was taken', text: 'Call your bank to block UPI and cards from another phone. If money has gone, call 1930 at once.', help: ['cy1930'] }
    ],
    stand: [
      { k: 'good', text: 'A blocked phone can be traced on CEIR if someone puts in a new SIM.' },
      { k: 'next', when: W('lp_what', 'docs'), text: 'Most duplicates (PAN, Aadhaar, RC, certificates) can be applied for online with the police report.' }
    ],
    lawyerQs: [{ text: 'Do I need an FIR or is a lost-article report enough for my documents?' }],
    sources: [SRC.sanchar, SRC.bnss, S('National Cyber Crime Reporting Portal', 'https://cybercrime.gov.in')]
  });

  /* ================= 11. Missing person ================= */
  I.push({
    id: 'missing-person', cat: 'police', sensitive: true, title: 'A family member is missing — a child, an adult, or an elderly person', short: 'Missing person',
    synonyms: ['missing person', 'person missing', 'missing child', 'child missing', 'son missing', 'daughter missing', 'daughter ran away', 'husband missing', 'wife missing', 'father missing', 'mother missing', 'gumshuda', 'lapata', 'kidnapped', 'kidnapping', 'abducted', 'not come home', 'run away from home'],
    intro: 'Go to the police now. There is no rule that you must wait 24 hours. For a missing child, police must register an FIR at once.',
    juris: 'Police must accept a missing person report immediately. For a missing child, the Supreme Court has directed that an FIR be registered and investigated as a possible case of kidnapping or trafficking (Bachpan Bachao Andolan v. Union of India, 2013). Kidnapping and abduction are offences under the Bharatiya Nyaya Sanhita, 2023. Missing and found children are listed on the Khoya-Paya / TrackChild portals. If you believe an adult is being held against their will, the High Court can be asked for a habeas corpus order.',
    questions: [
      { id: 'mp_who', text: 'Who is missing?', why: 'Children, adults and elderly people are handled differently.', options: o([['child', 'A child (under 18)'], ['adult', 'An adult'], ['elder', 'An elderly person or someone with illness/disability']]) },
      { id: 'mp_since', text: 'Since when?', why: 'The first hours matter most.', options: o([['today', 'Today'], ['days', 'A few days'], ['long', 'More than a week']]) },
      { id: 'mp_fear', text: 'Do you suspect someone took them or they are in danger?', why: 'Suspected kidnapping is treated as a crime straight away.', options: o([['yes', 'Yes'], ['left', 'They may have left on their own'], NS]) },
      { id: 'mp_police', text: 'Have you gone to the police?', why: 'Next steps depend on their response.', options: o([['no', 'Not yet'], ['report', 'Report / FIR registered'], ['refused', 'Police refused or delayed']]) }
    ],
    evidence: [
      { id: 'mp_e_photo', name: 'Recent clear photos', fact: 'What they look like', why: 'Circulated to police, stations and portals.', where: 'Phone, social media.', preserve: '' },
      { id: 'mp_e_desc', name: 'Description: height, clothes last worn, marks, languages spoken', fact: 'Identification', why: 'Helps police and the public recognise them.', where: '', preserve: '' },
      { id: 'mp_e_phone', name: 'Their mobile number, IMEI if known, and social media accounts', fact: 'How to trace them', why: 'Police can trace phone location.', where: 'Family; phone box.', preserve: '' },
      { id: 'mp_e_last', name: 'Last place and time seen, and who they were with', fact: 'Starting point', why: 'Guides the search and CCTV checks.', where: 'Family, friends, school/work.', preserve: '' },
      { id: 'mp_e_contacts', name: 'Names and numbers of friends, relatives and anyone suspected', fact: 'Where they may be', why: 'Police will question them.', where: '', preserve: '' },
      { id: 'mp_e_id', name: 'ID proof and age proof (birth certificate for a child)', fact: 'Identity and age', why: 'Age decides how the case is treated.', where: 'Family records.', preserve: '' },
      { id: 'mp_e_medical', name: 'Medical conditions and medicines needed', fact: 'Health risk', why: 'Makes the search urgent.', where: '', preserve: '', when: W('mp_who', 'elder') },
      { id: 'mp_e_fir', name: 'Copy of the FIR / missing report with number', fact: 'Case registered', why: 'Needed for every follow-up.', where: 'Police station.', preserve: '' },
      { id: 'mp_e_portal', name: 'Report on the Khoya-Paya / TrackChild portal', fact: 'National listing', why: 'Child care homes check these lists.', where: 'trackthemissingchild.gov.in', preserve: '', action: true, when: W('mp_who', 'child') }
    ],
    urgent: [
      { id: 'mp_u_now', level: 'now', title: 'Go to the police now — do not wait 24 hours', text: 'Call 112. For a child, also call 1098. Ask for an FIR and the officer’s name and number.', help: ['e112', 'childline'] },
      { id: 'mp_u_refused', level: 'now', when: W('mp_police', 'refused'), title: 'If police refuse, go to the SP the same day', text: 'Write to the Superintendent of Police. For a child, refusing an FIR goes against Supreme Court directions.', help: ['l15100'] }
    ],
    stand: [
      { k: 'good', when: W('mp_who', 'child'), text: 'A missing child must be registered as an FIR and treated as possible kidnapping or trafficking.' },
      { k: 'risk', when: W('mp_who', 'adult'), text: 'An adult who left by choice cannot be forced to return — but police must still check they are safe.' },
      { k: 'next', when: W('mp_since', 'long'), text: 'If an adult is believed to be held illegally, a habeas corpus petition in the High Court is possible.' }
    ],
    lawyerQs: [
      { text: 'Should we file a habeas corpus petition?', when: ANY(W('mp_fear', 'yes'), W('mp_since', 'long')) },
      { text: 'How do we push the investigation if it is not moving?' }
    ],
    also: ['family'],
    sources: [SRC.trackchild, SRC.bns, SRC.nalsa]
  });

  /* ================= 12. Sexual assault / POCSO (survivor) ================= */
  I.push({
    id: 'sexual-assault', cat: 'police', sensitive: true, title: 'Rape, sexual assault or molestation — or a child was sexually abused', short: 'Sexual assault or child abuse',
    synonyms: ['rape', 'sexual assault', 'sexual abuse', 'molestation', 'molested', 'groped', 'touched inappropriately', 'eve teasing', 'stalking', 'child abuse', 'child sexual abuse', 'pocso', 'pocso complaint', 'abused as a child', 'marital', 'outraging modesty', 'unwanted touch', 'harassed on road'],
    intro: 'What happened is not your fault. You can get medical care, free treatment and support even before deciding about a police case.',
    juris: 'Rape and sexual offences are crimes under the Bharatiya Nyaya Sanhita, 2023 (including Sections 63–64 for rape, 74–79 for assault and harassment). Offences against children are covered by the POCSO Act, 2012, under which reporting is compulsory. Under the Bharatiya Nagarik Suraksha Sanhita, 2023: an FIR can be filed at any police station (Zero FIR) and should be recorded by a woman officer; the survivor must be medically examined by a registered doctor, with consent; all hospitals must give free first aid and treatment; and victims can claim compensation from the state. Publishing a survivor’s identity is a crime.',
    questions: [
      { id: 'sa_safe', text: 'First: are you safe right now?', sensitive: true, why: 'Safety and medical care come first.', options: o([['safe', 'Yes'], ['danger', 'No, I am in danger'], PN]) },
      { id: 'sa_who', text: 'Who was harmed?', why: 'For a child, POCSO applies and reporting is compulsory.', options: o([['me', 'Me (adult)'], ['child', 'A child'], ['other', 'Another adult I am helping']]) },
      { id: 'sa_when', text: 'When did it happen?', sensitive: true, why: 'Recent cases need medical examination quickly; older cases can still be reported.', options: o([['72h', 'Within the last 3 days'], ['recent', 'In the last few weeks'], ['past', 'Longer ago'], PN]) },
      { id: 'sa_known', text: 'Is the person known to you?', sensitive: true, why: 'Known persons may also need a protection order.', options: o([['family', 'A family member'], ['known', 'Someone I know'], ['stranger', 'A stranger'], PN]) },
      { id: 'sa_police', text: 'Have you told the police?', why: 'You decide when — support is available either way.', options: o([['no', 'Not yet'], ['yes', 'Yes, FIR filed'], ['refused', 'They refused or discouraged me']]) }
    ],
    evidence: [
      { id: 'sa_e_medical', name: 'Medical examination report and treatment records', fact: 'Injuries and medical evidence', why: 'Medical evidence is time-sensitive and key.', where: 'Any hospital — they must treat you free.', preserve: 'Ask for a copy.' },
      { id: 'sa_e_clothes', name: 'Clothes worn at the time, unwashed, in a paper bag', fact: 'Physical evidence', why: 'May hold forensic evidence.', where: '', preserve: 'Do not wash. Paper, not plastic.', when: W('sa_when', '72h', 'recent') },
      { id: 'sa_e_msgs', name: 'Messages, calls, photos or anything the person sent', fact: 'Contact, threats or admissions', why: 'Supports your account.', where: 'Your phone.', preserve: 'Screenshot with dates; back up privately.' },
      { id: 'sa_e_notes', name: 'Your own notes: what happened, when, where — written as soon as you can', fact: 'Your account', why: 'Memory fades; notes help later.', where: '', preserve: 'Keep them private.' },
      { id: 'sa_e_told', name: 'Names of anyone you told afterwards', fact: 'Early disclosure', why: 'Witnesses to what you said soon after.', where: '', preserve: '' },
      { id: 'sa_e_age', name: 'Age proof of the child (birth certificate, school record)', fact: 'The child’s age', why: 'POCSO applies to anyone under 18.', where: 'Family / school.', preserve: '', when: W('sa_who', 'child') },
      { id: 'sa_e_fir', name: 'Copy of the FIR (free) and your statement', fact: 'Case registered', why: 'You are entitled to a free copy.', where: 'Police station.', preserve: '', when: W('sa_police', 'yes') },
      { id: 'sa_e_onestop', name: 'Contact a One Stop Centre (181) for medical, legal and counselling help', fact: 'Support arranged', why: 'They help with police, hospital and a lawyer under one roof.', where: 'Call 181 or go to the district One Stop Centre.', preserve: '', action: true, when: NOT(W('sa_who', 'child')) }
    ],
    urgent: [
      { id: 'sa_u_danger', level: 'now', when: W('sa_safe', 'danger'), title: 'Call 112 now', text: 'Get to a safe place. Women can also call 181.', help: ['e112', 'w181'] },
      { id: 'sa_u_child', level: 'now', when: W('sa_who', 'child'), title: 'Protect the child and report it', text: 'Call 1098 or 112. Under POCSO, abuse of a child must be reported. Keep the child away from the person.', help: ['childline', 'e112'] },
      { id: 'sa_u_72', level: 'now', when: W('sa_when', '72h'), title: 'See a doctor within 72 hours if you can', text: 'Treatment can prevent pregnancy and infections, and evidence can be collected. Hospitals must treat you free.', help: ['w181'] },
      { id: 'sa_u_refused', level: 'soon', when: W('sa_police', 'refused'), title: 'Police cannot refuse', text: 'Refusing to record this information is itself an offence. Write to the SP, or contact the One Stop Centre or legal aid for help.', help: ['w181', 'l15100'] }
    ],
    stand: [
      { k: 'good', text: 'You can file at any police station (Zero FIR), and your identity must be kept confidential.' },
      { k: 'good', when: W('sa_when', 'past'), text: 'It is not too late — sexual offences can be reported long after they happen.' },
      { k: 'next', text: 'You can claim compensation from the state victim compensation scheme, even during the case.' }
    ],
    lawyerQs: [
      { text: 'Can I get free legal aid and a support person through the case?' },
      { text: 'How do I apply for interim compensation?' },
      { text: 'Can I get a protection order against the person?', when: W('sa_known', 'family', 'known') }
    ],
    also: ['young', 'family'],
    sources: [SRC.bns, SRC.bnss, SRC.pocso, SRC.onestop, SRC.nalsa]
  });

  /* ================= 13. Caste atrocity ================= */
  I.push({
    id: 'caste-atrocity', cat: 'police', sensitive: true, title: 'Caste abuse, discrimination or attack (SC/ST Atrocities Act)', short: 'Caste abuse or atrocity',
    synonyms: ['caste abuse', 'caste slur', 'casteist remark', 'caste discrimination', 'sc st act', 'sc/st act', 'atrocity', 'atrocity case', 'atrocities act', 'untouchability', 'dalit', 'adivasi', 'tribal land grabbed', 'social boycott', 'caste violence', 'honour'],
    intro: 'The Atrocities Act gives special protection: police must register an FIR without a preliminary inquiry, and victims are entitled to relief money and protection.',
    juris: 'The Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989 makes caste-based insults in public view, social or economic boycott, land grabbing, violence and other acts specific offences. Under Section 18A, no preliminary inquiry is needed before registering an FIR and anticipatory bail is generally barred. Investigation is by an officer of at least DSP rank, cases are tried in Special Courts, victims have a right to be heard and to protection (Section 15A), and the rules give monetary relief at set stages. An accused can face this law only if they are not themselves SC/ST.',
    questions: [
      { id: 'ca_what', text: 'What happened?', why: 'Different acts are different offences under the law.', type: 'multi', options: o([['insult', 'Caste insult or slur in public view'], ['violence', 'Violence or threats'], ['land', 'Land or property taken'], ['boycott', 'Social or economic boycott'], ['work', 'Denied work, water, temple or other access']]) },
      { id: 'ca_public', text: 'Did it happen where others could see or hear?', when: W('ca_what', 'insult'), why: 'Insults must be "in public view" to be this offence.', options: o([['yes', 'Yes'], ['no', 'No, in private'], NS]) },
      { id: 'ca_cert', text: 'Do you have a caste certificate?', why: 'It proves you are covered by the Act.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'ca_police', text: 'Have you gone to the police?', why: 'Next steps depend on their response.', options: o([['no', 'Not yet'], ['fir', 'FIR filed under the Atrocities Act'], ['other', 'FIR filed but without the Atrocities Act'], ['refused', 'They refused']]) }
    ],
    evidence: [
      { id: 'ca_e_cert', name: 'Caste certificate', fact: 'You belong to a Scheduled Caste or Tribe', why: 'Basis for the Act to apply.', where: 'Tehsildar / e-district portal.', preserve: '' },
      { id: 'ca_e_witness', name: 'Names and numbers of people who saw or heard it', fact: 'It was in public view', why: 'Independent witnesses are crucial.', where: '', preserve: '' },
      { id: 'ca_e_record', name: 'Videos, audio or messages with the words used', fact: 'The insult or threat', why: 'Proves exact words and intent.', where: 'Phones of those present.', preserve: 'Save originals; back up.' },
      { id: 'ca_e_mlc', name: 'Medical certificate (MLC) and hospital records', fact: 'Injuries', why: 'Needed for violence offences and relief.', where: 'Hospital.', preserve: '', when: W('ca_what', 'violence') },
      { id: 'ca_e_land', name: 'Land records and documents of the property taken', fact: 'Your land', why: 'Wrongful occupation of SC/ST land is an offence.', where: 'Revenue office.', preserve: '', when: W('ca_what', 'land') },
      { id: 'ca_e_fir', name: 'FIR copy showing the Atrocities Act sections', fact: 'Correct sections applied', why: 'Relief and special protections depend on it.', where: 'Police station.', preserve: '' },
      { id: 'ca_e_sp', name: 'Written complaint to the SP or District Magistrate, and the State/National Commission', fact: 'Escalation', why: 'For refusal or wrong sections.', where: 'SP office; ncsc.nic.in / ncst.nic.in', preserve: '', action: true, when: W('ca_police', 'refused', 'other') }
    ],
    urgent: [
      { id: 'ca_u_danger', level: 'now', when: W('ca_what', 'violence'), title: 'If you are in danger, call 112', text: 'You have a right to protection for yourself, your family and witnesses.', help: ['e112'] },
      { id: 'ca_u_refused', level: 'soon', when: W('ca_police', 'refused'), title: 'Refusing to register is itself punishable', text: 'A public servant who neglects duties under this Act can be punished. Write to the SP and the Commission.', help: ['l15100'] }
    ],
    stand: [
      { k: 'good', text: 'No preliminary inquiry is needed — the FIR must be registered on your complaint.' },
      { k: 'good', text: 'Victims are entitled to monetary relief at stages of the case, paid by the state.' },
      { k: 'risk', when: W('ca_public', 'no'), text: 'An insult in a private place may not fall under this specific offence — other offences may still apply.' },
      { k: 'risk', when: W('ca_cert', 'no', 'unsure'), text: 'Get your caste certificate — relief and the Act’s protections depend on it.' }
    ],
    lawyerQs: [
      { text: 'Which sections apply, and how do I claim relief under the rules?' },
      { text: 'Can I get protection for witnesses?' }
    ],
    sources: [SRC.scst, SRC.ncsc, SRC.nalsa]
  });

  /* ================= 14. Trafficking / bonded labour / child labour ================= */
  I.push({
    id: 'trafficking', cat: 'work', sensitive: true, title: 'Someone is being forced to work, held, trafficked, or a child is working', short: 'Bonded labour, trafficking or child labour',
    synonyms: ['bonded labour', 'bandhua mazdoor', 'forced labour', 'debt bondage', 'brick kiln', 'not allowed to leave work', 'human trafficking', 'trafficking', 'sold', 'child labour', 'child working', 'child domestic worker', 'placement agency maid', 'passport taken by employer', 'held captive'],
    intro: 'Bonded labour, trafficking and child labour are crimes. The District Magistrate must free bonded workers, and freed people are entitled to rehabilitation money.',
    juris: 'The Bonded Labour System (Abolition) Act, 1976 abolishes all bonded debts; the District Magistrate must identify, release and issue release certificates. Freed bonded labourers get rehabilitation assistance under the Central Sector Scheme. Trafficking (Section 143) and unlawful compulsory labour are offences under the Bharatiya Nyaya Sanhita, 2023. Children under 14 cannot be employed, and adolescents (14–18) cannot work in hazardous jobs, under the Child and Adolescent Labour Act, 1986. Complaints about child labour can be made on the PENCIL portal or to 1098.',
    questions: [
      { id: 'tf_what', text: 'What is happening?', why: 'Each situation goes to a different authority first.', options: o([['bonded', 'Forced to work to repay a debt / not allowed to leave'], ['trafficked', 'Taken or sold for work, marriage or sex'], ['child', 'A child is working'], ['held', 'Documents or wages withheld to stop leaving']]) },
      { id: 'tf_who', text: 'Who are you?', why: 'Victims, family and witnesses can all complain.', options: o([['victim', 'It is happening to me'], ['family', 'A family member'], ['witness', 'I have seen it']]) },
      { id: 'tf_where', text: 'Do you know where they are?', why: 'Rescue needs a location.', options: o([['yes', 'Yes'], ['partly', 'Roughly'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'tf_e_place', name: 'Address or location of the workplace, and the employer’s name', fact: 'Where they are held', why: 'Needed for a rescue.', where: '', preserve: '' },
      { id: 'tf_e_people', name: 'Names, ages and photos of the people affected', fact: 'Who needs rescue', why: 'Helps identify them.', where: 'Family.', preserve: '' },
      { id: 'tf_e_debt', name: 'Details of the advance or loan given and how it is being "repaid"', fact: 'Debt bondage', why: 'Bonded labour is proved by the debt and lack of freedom.', where: 'Workers, family, notebooks.', preserve: '', when: W('tf_what', 'bonded') },
      { id: 'tf_e_msgs', name: 'Calls, messages or voice notes from the person', fact: 'They are held or forced', why: 'Direct evidence.', where: 'Phone.', preserve: 'Save and back up.' },
      { id: 'tf_e_agent', name: 'Details of the agent or placement agency', fact: 'Who arranged it', why: 'Agents are often part of trafficking.', where: 'Family, payments made.', preserve: '', when: W('tf_what', 'trafficked', 'child', 'held') },
      { id: 'tf_e_age', name: 'Age proof of the child', fact: 'Under 14 or under 18', why: 'Decides which offence applies.', where: 'School / birth certificate.', preserve: '', when: W('tf_what', 'child') },
      { id: 'tf_e_dm', name: 'Written complaint to the District Magistrate / SDM', fact: 'Rescue requested', why: 'The DM must act on bonded labour.', where: 'DM / SDM office.', preserve: 'Keep the receipt.', action: true, when: W('tf_what', 'bonded') },
      { id: 'tf_e_pencil', name: 'Complaint on the PENCIL portal or to 1098', fact: 'Child labour reported', why: 'Triggers rescue.', where: 'pencil.gov.in or call 1098', preserve: '', action: true, when: W('tf_what', 'child') }
    ],
    urgent: [
      { id: 'tf_u_now', level: 'now', when: W('tf_what', 'trafficked', 'held', 'bonded'), title: 'Call 112 if someone is being held now', text: 'Police can rescue. For children call 1098.', help: ['e112', 'childline'] },
      { id: 'tf_u_child', level: 'now', when: W('tf_what', 'child'), title: 'Call 1098 for the child', text: 'Child labour rescue is free and confidential.', help: ['childline'] }
    ],
    stand: [
      { k: 'good', when: W('tf_what', 'bonded'), text: 'Every bonded debt is cancelled by law — the worker owes nothing.' },
      { k: 'good', text: 'Rescued workers are entitled to a release certificate and rehabilitation assistance.' }
    ],
    lawyerQs: [
      { text: 'How do we get the release certificate and rehabilitation money?' },
      { text: 'Can we recover the unpaid wages?' }
    ],
    sources: [SRC.bonded, SRC.pencil, SRC.bns, SRC.nalsa]
  });

  /* ================= 15. Vehicle bought / sold — RC transfer ================= */
  I.push({
    id: 'vehicle-transfer', cat: 'police', title: 'Bought or sold a vehicle — RC not transferred, challans on old vehicle, or second-hand fraud', short: 'Vehicle RC transfer or second-hand vehicle',
    synonyms: ['rc transfer', 'vehicle transfer', 'ownership transfer', 'sold bike but rc not transferred', 'sold car', 'buyer not transferring rc', 'challan on sold vehicle', 'second hand car', 'second hand bike', 'used car fraud', 'odometer tampered', 'hypothecation removal', 'noc from bank vehicle', 'form 29', 'form 30', 'form 35', 'duplicate rc'],
    intro: 'Until the RC is transferred, the seller stays the owner on record — and can be held responsible for challans and accidents.',
    juris: 'Under Section 50 of the Motor Vehicles Act, 1988, the seller must report the sale to the registering authority (within 14 days in the same state) and the buyer must apply for transfer within 30 days, using Forms 29 and 30 on the Vahan portal. A loan (hypothecation) must be closed with Form 35 and the bank’s NOC. The Supreme Court has held that the registered owner can remain liable for accidents until the transfer is recorded. Fraud in a sale (hidden accidents, tampered odometer, stolen vehicle) can be a criminal and consumer matter.',
    questions: [
      { id: 'vt_side', text: 'Are you the buyer or the seller?', why: 'Duties and risks are different.', options: o([['seller', 'Seller'], ['buyer', 'Buyer']]) },
      { id: 'vt_problem', text: 'What is the problem?', why: 'Each problem has a different fix.', options: o([['notdone', 'Transfer is not done'], ['challan', 'Challans or accident on a sold vehicle'], ['fraud', 'Vehicle had hidden problems or was stolen'], ['loan', 'Loan / hypothecation not removed']]) },
      { id: 'vt_how', text: 'How was it sold?', why: 'Dealers and platforms have more obligations.', options: o([['person', 'Directly to a person'], ['dealer', 'Through a dealer or used-car platform']]) },
      { id: 'vt_papers', text: 'Was a written sale agreement or delivery note signed?', why: 'It proves the date of handover.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'vt_e_rc', name: 'RC copy and vehicle details (registration, chassis, engine number)', fact: 'Which vehicle', why: 'Basic proof.', where: 'mParivahan / DigiLocker.', preserve: '' },
      { id: 'vt_e_sale', name: 'Sale agreement / delivery note with date and time of handover, and payment proof', fact: 'When ownership changed hands', why: 'Shows you were not in control after that time.', where: 'Your copy; bank records.', preserve: '' },
      { id: 'vt_e_forms', name: 'Signed Forms 29 and 30 and the buyer’s ID', fact: 'Transfer paperwork', why: 'Needed to report or complete transfer.', where: 'Vahan portal.', preserve: '', when: W('vt_problem', 'notdone', 'challan') },
      { id: 'vt_e_challans', name: 'Challans or notices received after the sale', fact: 'Violations after handover', why: 'Show they happened after you sold it.', where: 'echallan.parivahan.gov.in', preserve: '', when: W('vt_problem', 'challan') },
      { id: 'vt_e_noc', name: 'Loan closure letter, bank NOC and Form 35', fact: 'Loan closed', why: 'Needed to remove hypothecation.', where: 'The bank.', preserve: '', when: W('vt_problem', 'loan') },
      { id: 'vt_e_inspection', name: 'Inspection report, service history, insurance claim history', fact: 'Hidden defects or accidents', why: 'Proves misrepresentation.', where: 'Mechanic; insurer; service centre.', preserve: '', when: W('vt_problem', 'fraud') },
      { id: 'vt_e_ads', name: 'The advertisement and messages describing the vehicle', fact: 'What was promised', why: 'Shows what was misrepresented.', where: 'Platform listing; chats.', preserve: 'Screenshot before it is removed.', when: W('vt_problem', 'fraud') },
      { id: 'vt_e_report', name: 'Report the sale on Vahan / at the RTO, and send the buyer a written notice', fact: 'Sale reported', why: 'Protects the seller from future liability.', where: 'vahan.parivahan.gov.in or RTO.', preserve: 'Keep the acknowledgement.', action: true, when: ALL(W('vt_side', 'seller'), W('vt_problem', 'notdone', 'challan')) }
    ],
    urgent: [
      { id: 'vt_u_accident', level: 'soon', when: ALL(W('vt_side', 'seller'), W('vt_problem', 'challan')), title: 'Report the sale and inform the police of any accident notice', text: 'As registered owner you may be pulled into accident claims. Report the sale now and keep proof of the handover date.', help: ['echallan'] }
    ],
    stand: [
      { k: 'risk', when: W('vt_side', 'seller'), text: 'Until transfer is recorded, you remain the owner on paper.' },
      { k: 'good', when: W('vt_papers', 'yes'), text: 'A dated delivery note helps prove the violation happened after you handed over the vehicle.' },
      { k: 'next', when: ALL(W('vt_problem', 'fraud'), W('vt_how', 'dealer')), text: 'A dealer or platform can be taken to the Consumer Commission for misrepresentation.' }
    ],
    lawyerQs: [{ text: 'How do I protect myself from liability for the period after the sale?' }, { text: 'Is this a police case, a consumer complaint, or both?', when: W('vt_problem', 'fraud') }],
    also: ['accidents'],
    sources: [SRC.vahan, S('Motor Vehicles Act, 1988 (India Code)', 'https://www.indiacode.nic.in'), SRC.nalsa]
  });

  /* ================= 16. Dog bite / animal attack ================= */
  I.push({
    id: 'dog-bite', cat: 'accidents', title: 'Dog bite or animal attack — stray or pet', short: 'Dog bite or animal attack',
    synonyms: ['dog bite', 'dog bit me', 'stray dog', 'stray dog bite', 'stray dog bite compensation', 'pet dog attacked', 'neighbour dog bite', 'monkey bite', 'cattle attack', 'stray cattle', 'animal attack', 'rabies', 'anti rabies vaccine', 'dog attack child'],
    intro: 'Get the anti-rabies vaccine today — it is free at government hospitals. Then keep every medical paper for compensation.',
    juris: 'Stray dogs are managed by municipal bodies under the Animal Birth Control Rules, 2023. In the ongoing Supreme Court case on stray dogs (since July 2025), the Court in January 2026 warned that it would make state governments pay heavy compensation for dog-bite injuries and deaths. Some High Courts have already fixed compensation formulas. A pet owner who negligently fails to control an animal can be liable under the Bharatiya Nyaya Sanhita, 2023 and must pay damages.',
    questions: [
      { id: 'db_animal', text: 'What kind of animal?', why: 'Strays are the municipality’s responsibility; pets are the owner’s.', options: o([['stray', 'A stray dog'], ['pet', 'Someone’s pet dog'], ['other', 'Monkey, cattle or other animal']]) },
      { id: 'db_who', text: 'Who was bitten?', why: 'Children and elderly victims get priority attention.', options: o([['me', 'Me'], ['child', 'A child'], ['elder', 'An elderly person'], ['died', 'Someone died']]) },
      { id: 'db_vaccine', text: 'Has the anti-rabies vaccine been started?', why: 'Rabies is almost always fatal once symptoms show.', options: o([['yes', 'Yes'], ['no', 'Not yet']]) },
      { id: 'db_place', text: 'Where did it happen?', deep: true, why: 'Bites in schools, hospitals or stations add to the authority’s duty.', options: o([['street', 'Street or colony'], ['inst', 'School, hospital, station or public office'], ['home', 'Near a home or society']]) }
    ],
    evidence: [
      { id: 'db_e_medical', name: 'Hospital records, vaccine card and bills', fact: 'The injury and treatment', why: 'Basis of any compensation.', where: 'Hospital.', preserve: 'Keep originals.' },
      { id: 'db_e_photos', name: 'Photos of wounds (with a scale or ruler) taken the same day', fact: 'Size and number of bite marks', why: 'Some courts fix compensation per tooth mark and wound size.', where: 'Your phone.', preserve: '' },
      { id: 'db_e_place', name: 'Location details and photos/video of the animal or area', fact: 'Where it happened', why: 'Identifies the responsible body.', where: 'Your phone; CCTV nearby.', preserve: '' },
      { id: 'db_e_owner', name: 'Pet owner’s name and address, and any earlier complaints', fact: 'Who is responsible', why: 'Owner liability.', where: 'Neighbours, society.', preserve: '', when: W('db_animal', 'pet') },
      { id: 'db_e_muni', name: 'Written complaint to the municipality (and any earlier complaints about the same dogs)', fact: 'Authority knew', why: 'Supports a claim against the authority.', where: 'Municipal helpline / portal.', preserve: 'Keep complaint numbers.', action: true, when: W('db_animal', 'stray', 'other') },
      { id: 'db_e_police', name: 'Police complaint (for a pet attack or a death)', fact: 'Reported', why: 'Needed for a criminal case or claim.', where: 'Police station.', preserve: '', when: ANY(W('db_animal', 'pet'), W('db_who', 'died')) },
      { id: 'db_e_income', name: 'Proof of lost income or school days', fact: 'Loss suffered', why: 'Adds to compensation.', where: 'Employer / school.', preserve: '' }
    ],
    urgent: [
      { id: 'db_u_vaccine', level: 'now', when: W('db_vaccine', 'no'), title: 'Start the anti-rabies vaccine today', text: 'Wash the wound with soap and running water for 15 minutes and go to a government hospital — the vaccine is free.', help: ['e112'] }
    ],
    stand: [
      { k: 'good', when: W('db_animal', 'stray'), text: 'The Supreme Court has signalled that states will be made to pay compensation for stray dog bites.' },
      { k: 'next', when: W('db_animal', 'stray'), text: 'Some High Courts have set compensation rates — ask about the formula in your state.' },
      { k: 'good', when: W('db_animal', 'pet'), text: 'A pet owner who fails to control their dog can be made to pay and face a police case.' }
    ],
    lawyerQs: [{ text: 'Whom should I claim compensation from, and how much is usual in my state?' }],
    sources: [SRC.abc, SRC.bns, SRC.nalsa]
  });

  /* ================= 17. Name / date of birth / document correction ================= */
  I.push({
    id: 'documents-correction', cat: 'other', title: 'Name change, or correcting date of birth / name in birth certificate, Aadhaar, passport or certificates', short: 'Name change or document correction',
    synonyms: ['name change', 'change my name', 'gazette name change', 'name correction', 'surname change after marriage', 'date of birth correction', 'dob correction', 'birth certificate correction', 'late birth registration', 'birth certificate not available', 'aadhaar correction', 'aadhaar name change', 'pan correction', 'passport name change', 'passport rejected', 'police verification adverse', 'marksheet correction', 'father name wrong', 'spelling mistake in certificate', 'affidavit for name change'],
    intro: 'Most corrections start with an affidavit and the “root” document — usually the birth certificate. Fix that first, and the rest follow.',
    juris: 'Name change for adults is usually done by an affidavit, a newspaper notice and publication in the Gazette (Department of Publication for central, or the state gazette). Birth records are corrected by the Registrar under the Registration of Births and Deaths Act, 1969; since 1 October 2023, a birth certificate is the single document to prove date of birth for births after that date, and delayed registration needs an order. Aadhaar allows name and date-of-birth changes only a limited number of times. A pending criminal case can lead to passport refusal, but a court can permit one.',
    questions: [
      { id: 'doc_what', text: 'What do you need to change?', why: 'Each document has its own office and proof.', options: o([['name', 'My name (new name or spelling)'], ['dob', 'Date of birth'], ['parent', 'Parent’s name or other detail'], ['passport', 'Passport refused or stuck']]) },
      { id: 'doc_why', text: 'Why is it needed?', when: W('doc_what', 'name'), why: 'Marriage, religion change and errors have different proof.', options: o([['marriage', 'Marriage or divorce'], ['error', 'Spelling or record error'], ['choice', 'Personal choice'], ['religion', 'Change of religion or gender']]) },
      { id: 'doc_birthcert', text: 'Do you have a birth certificate?', why: 'It is the root document for most corrections.', options: o([['yes', 'Yes, correct'], ['wrong', 'Yes, but it is wrong'], ['no', 'No birth certificate']]) },
      { id: 'doc_minor', text: 'Is this for a child under 18?', why: 'Parents apply for children; school records can be corrected too.', options: o([['no', 'No'], ['yes', 'Yes']]) }
    ],
    evidence: [
      { id: 'doc_e_affidavit', name: 'Affidavit stating old and new name/detail, on stamp paper, notarised', fact: 'Formal declaration', why: 'First step for name change and most corrections.', where: 'Notary.', preserve: '' },
      { id: 'doc_e_root', name: 'Your birth certificate or school leaving / 10th certificate', fact: 'The original correct detail', why: 'Other records are corrected to match it.', where: 'Municipal office; school; board.', preserve: '' },
      { id: 'doc_e_ids', name: 'All IDs showing the mismatch (Aadhaar, PAN, passport, certificates)', fact: 'What needs to change', why: 'You will update each one.', where: 'DigiLocker.', preserve: '' },
      { id: 'doc_e_paper', name: 'Newspaper notice of the name change', fact: 'Public notice', why: 'Needed for gazette publication.', where: 'One local and one national newspaper.', preserve: 'Keep the full page.', when: W('doc_what', 'name') },
      { id: 'doc_e_gazette', name: 'Gazette notification of the new name', fact: 'Official record of change', why: 'Accepted by passport, PAN and banks.', where: 'egazette.gov.in (central) or state gazette.', preserve: '', when: W('doc_what', 'name') },
      { id: 'doc_e_marriage', name: 'Marriage certificate or divorce decree', fact: 'Reason for change', why: 'Often enough for a surname change.', where: 'Your records.', preserve: '', when: W('doc_why', 'marriage') },
      { id: 'doc_e_hospital', name: 'Hospital birth record or other old evidence of birth', fact: 'Date and place of birth', why: 'Needed for late registration or DOB correction.', where: 'Hospital; school admission register.', preserve: '', when: W('doc_birthcert', 'wrong', 'no') },
      { id: 'doc_e_court', name: 'Details of any pending criminal case and court permission', fact: 'Why passport was refused', why: 'A court can allow a passport despite a pending case.', where: 'Court records.', preserve: '', when: W('doc_what', 'passport') }
    ],
    urgent: [],
    stand: [
      { k: 'next', when: W('doc_birthcert', 'no'), text: 'Delayed birth registration is possible with an order and supporting proof.' },
      { k: 'risk', when: W('doc_what', 'dob'), text: 'Aadhaar date-of-birth changes are limited — get the documents right the first time.' },
      { k: 'good', when: W('doc_why', 'marriage'), text: 'A surname change after marriage is often accepted with the marriage certificate alone.' }
    ],
    lawyerQs: [{ text: 'Do I need a gazette notification, or will an affidavit be enough here?' }, { text: 'Can the court allow my passport despite the pending case?', when: W('doc_what', 'passport') }],
    sources: [SRC.egazette, SRC.crs, SRC.uidai, SRC.passport]
  });

  /* ================= 18. Government benefits, certificates, RTI ================= */
  I.push({
    id: 'govt-benefits', cat: 'other', title: 'Government benefit, pension, ration card or certificate refused or delayed — or I want to file an RTI', short: 'Government benefit, certificate or RTI',
    synonyms: ['rti', 'how to file rti', 'right to information', 'rti appeal', 'no reply to rti', 'ration card', 'ration card cancelled', 'old age pension', 'widow pension', 'disability pension', 'scheme not received', 'government scheme denied', 'pm kisan', 'ayushman card', 'caste certificate', 'income certificate', 'domicile certificate', 'disability certificate', 'udid', 'complaint against government office', 'government office not working', 'bribe demanded', 'cpgrams', 'public grievance', 'scholarship not received'],
    intro: 'Two tools work for almost every government delay: an RTI asking why your file is stuck, and a grievance on the official portal.',
    juris: 'Under the Right to Information Act, 2005, you can ask any public authority for information; they must reply within 30 days (48 hours if life or liberty is involved). First appeal is within 30 days to the appellate officer, and second appeal within 90 days to the Information Commission. Since 13 November 2025, personal information about others is exempt from disclosure. Grievances against central offices can be filed on CPGRAMS; most states have Right to Public Services laws that fix time limits for certificates and services and allow appeals. Disability rights and certificates are under the Rights of Persons with Disabilities Act, 2016 (UDID).',
    questions: [
      { id: 'gvb_what', text: 'What is the problem?', why: 'Benefits, certificates and information each have their own route.', options: o([['benefit', 'A pension or scheme benefit stopped or refused'], ['cert', 'A certificate (caste, income, domicile, disability) delayed or refused'], ['ration', 'Ration card problem'], ['rti', 'I want information / file an RTI'], ['office', 'An office is not acting or asked for a bribe']]) },
      { id: 'gvb_level', text: 'Which government?', why: 'Decides which portal and commission.', options: o([['central', 'Central government'], ['state', 'State or local office'], NS]) },
      { id: 'gvb_applied', text: 'Did you apply in writing and get a receipt?', why: 'Time limits run from your application.', options: o([['yes', 'Yes, I have a receipt'], ['no', 'No receipt'], ['rejected', 'Got a rejection']]) },
      { id: 'gvb_rtistage', text: 'Where is your RTI?', when: W('gvb_what', 'rti'), why: 'Next step depends on the stage.', options: o([['new', 'Not filed yet'], ['noreply', 'Filed, no reply in 30 days'], ['bad', 'Reply was incomplete or refused'], ['appeal', 'First appeal also failed']]) }
    ],
    evidence: [
      { id: 'gvb_e_app', name: 'Your application with date and receipt / acknowledgement number', fact: 'When you applied', why: 'Service time limits run from this date.', where: 'Your copy; the portal.', preserve: '' },
      { id: 'gvb_e_idp', name: 'Your ID and address proof', fact: 'Who you are', why: 'Every application and appeal asks for it.', where: 'Aadhaar / voter ID / ration card.', preserve: '' },
      { id: 'gvb_e_qs', name: 'Short, specific questions you want answered (file number, dates, names of officers)', fact: 'What information you need', why: 'Vague RTIs get vague replies; specific ones get answers.', where: 'Write them down before filing.', preserve: '', when: W('gvb_what', 'rti') },
      { id: 'gvb_e_elig', name: 'Proof you are eligible (income, age, caste, disability, land, residence)', fact: 'You qualify', why: 'Refusals are challenged on eligibility.', where: 'Your records.', preserve: '', when: W('gvb_what', 'benefit', 'cert', 'ration') },
      { id: 'gvb_e_rejection', name: 'The rejection order or stoppage message', fact: 'Why it was refused', why: 'An appeal attacks the reason given.', where: 'Office / SMS / portal.', preserve: '', when: W('gvb_applied', 'rejected') },
      { id: 'gvb_e_bank', name: 'Bank passbook showing when payments stopped, and Aadhaar seeding status', fact: 'Payments stopped', why: 'Many stoppages are due to Aadhaar/bank mismatch.', where: 'Bank.', preserve: '', when: W('gvb_what', 'benefit') },
      { id: 'gvb_e_rti', name: 'RTI application asking for your file status and reasons for delay', fact: 'Information requested', why: 'Often moves a stuck file.', where: 'rtionline.gov.in or state RTI portal / by post with ₹10 fee.', preserve: 'Keep the registration number.', action: true, when: ANY(W('gvb_what', 'rti'), W('gvb_applied', 'yes')) },
      { id: 'gvb_e_rticopy', name: 'Copy of your RTI, any reply, and your first appeal', fact: 'RTI history', why: 'Needed for appeals.', where: 'Your records.', preserve: '', when: W('gvb_rtistage', 'noreply', 'bad', 'appeal') },
      { id: 'gvb_e_grievance', name: 'Grievance on CPGRAMS or the state portal', fact: 'Grievance on record', why: 'Departments must respond and are monitored.', where: 'pgportal.gov.in / state CM helpline.', preserve: 'Keep the registration number.', action: true, when: W('gvb_what', 'benefit', 'cert', 'ration', 'office') },
      { id: 'gvb_e_bribe', name: 'Details of any bribe demand (who, when, how much)', fact: 'Corruption', why: 'Can be reported to the vigilance / anti-corruption bureau.', where: '', preserve: 'Do not pay; note details.', when: W('gvb_what', 'office') }
    ],
    urgent: [
      { id: 'gvb_u_appeal', level: 'soon', when: W('gvb_rtistage', 'noreply', 'bad'), title: 'File the first appeal within 30 days', text: 'After 30 days with no reply, or after a bad reply, appeal to the First Appellate Authority named in the reply or on the office’s website.', help: ['rtionline'] }
    ],
    stand: [
      { k: 'good', when: W('gvb_what', 'rti'), text: 'An RTI costs ₹10 (free for BPL) and must be answered within 30 days.' },
      { k: 'risk', when: W('gvb_what', 'rti'), text: 'Since November 2025, information that is personal to someone else can be refused.' },
      { k: 'next', when: W('gvb_level', 'state'), text: 'Many states have Right to Public Services laws with fixed deadlines and penalties on officers.' }
    ],
    lawyerQs: [{ text: 'Is there a time limit in my state for this service, and whom do I appeal to?' }, { text: 'Should I go to the High Court if the office still does not act?' }],
    sources: [SRC.rti, SRC.cpgrams, SRC.udid, SRC.rpwd]
  });

  /* ================= 19. Income tax / GST notice ================= */
  I.push({
    id: 'tax-notice', cat: 'money', title: 'I got an income tax or GST notice, or my refund is stuck', short: 'Income tax or GST notice',
    synonyms: ['income tax notice', 'it notice', 'tax notice', 'scrutiny notice', 'reassessment notice', '148 notice', '143(2)', 'notice section 280', 'defective return notice', 'demand notice', 'tds refund', 'income tax refund', 'refund not received', 'tds mismatch', 'ais mismatch', 'gst notice', 'gst show cause', 'drc 01', 'gst registration cancelled', 'gst demand', 'tax demand', 'outstanding demand'],
    intro: 'Most tax notices just ask for an explanation. What matters is replying on the portal before the deadline — silence leads to an order against you.',
    juris: 'The Income-tax Act, 2025 replaced the 1961 Act from 1 April 2026; notices for earlier years may still be under the 1961 Act. Under the new Act, reassessment notices are issued under Sections 280–281 (earlier 148/148A), and scrutiny follows a notice served within set time limits. All notices carry a DIN and can be seen and answered on the e-filing portal (e-Proceedings). For GST, demands for FY 2024-25 onwards are under Section 74A of the CGST Act (earlier Sections 73/74), and paying within 60 days of the notice reduces the penalty.',
    questions: [
      { id: 'tx_kind', text: 'Which tax?', why: 'Income tax and GST have different portals and rules.', options: o([['income', 'Income tax'], ['gst', 'GST']]) },
      { id: 'tx_type', text: 'What does the notice say?', why: 'Explanations, demands and reassessments need different replies.', options: o([['explain', 'Asks for explanation / documents'], ['demand', 'Shows a tax demand'], ['reopen', 'Reopens an old year (reassessment)'], ['refund', 'My refund is stuck or adjusted'], ['cancel', 'GST registration suspended / cancelled']]) },
      { id: 'tx_deadline', text: 'When is the reply due?', why: 'Missed deadlines lead to orders against you.', options: o([['week', 'Within a week'], ['later', 'Later'], ['passed', 'Already passed'], NS]) },
      { id: 'tx_ca', text: 'Do you have a CA or tax adviser?', deep: true, why: 'Complex notices usually need one.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'tx_e_notice', name: 'The notice with its DIN, section and year', fact: 'What is being asked', why: 'Check it is genuine (DIN) and which law applies.', where: 'e-filing portal → e-Proceedings / GST portal.', preserve: 'Download the PDF.' },
      { id: 'tx_e_return', name: 'Your return for that year and its acknowledgement', fact: 'What you declared', why: 'The notice compares against it.', where: 'Portal.', preserve: '' },
      { id: 'tx_e_ais', name: 'AIS / Form 26AS (income tax) or GSTR-1, 3B, 2B (GST)', fact: 'What the department sees', why: 'Most notices come from mismatches.', where: 'Portal.', preserve: '' },
      { id: 'tx_e_proof', name: 'Proof for the items questioned (bank statements, bills, sale deeds, invoices)', fact: 'Your explanation', why: 'Replies need documents, not just words.', where: 'Your records.', preserve: '' },
      { id: 'tx_e_refund', name: 'Refund status and bank account validation on the portal', fact: 'Why the refund is stuck', why: 'Unvalidated accounts are the most common cause.', where: 'e-filing portal → Refund status.', preserve: '', when: W('tx_type', 'refund') },
      { id: 'tx_e_past', name: 'Earlier notices, replies and orders for the same year', fact: 'History', why: 'Repeat questions or time limits may help you.', where: 'Portal.', preserve: '', when: W('tx_type', 'reopen', 'demand') },
      { id: 'tx_e_reply', name: 'Reply online before the deadline (or ask for more time on the portal)', fact: 'Response filed', why: 'Silence leads to an ex parte order.', where: 'e-Proceedings / GST portal.', preserve: 'Keep the acknowledgement.', action: true, when: W('tx_deadline', 'week', 'later', 'unsure') }
    ],
    urgent: [
      { id: 'tx_u_due', level: 'now', when: W('tx_deadline', 'week'), title: 'Reply or seek an adjournment before the due date', text: 'You can ask for more time on the portal. Do not let the date pass without any response.' },
      { id: 'tx_u_passed', level: 'soon', when: W('tx_deadline', 'passed'), title: 'Deadline passed — act now', text: 'File the reply anyway and ask for it to be considered. If an order has been passed, appeal time limits now apply.', help: ['efiling'] }
    ],
    stand: [
      { k: 'good', when: W('tx_type', 'explain'), text: 'A notice asking for explanation is not a finding against you.' },
      { k: 'next', when: ALL(W('tx_kind', 'gst'), W('tx_type', 'demand')), text: 'For FY 2024-25 onwards, paying within 60 days of the GST notice reduces the penalty.' },
      { k: 'risk', when: W('tx_type', 'reopen'), text: 'Reassessment has strict procedure and time limits — a defect may make the notice invalid.' }
    ],
    lawyerQs: [{ text: 'Is the notice within time and under the correct section?' }, { text: 'Should I pay, reply, or appeal?', when: W('tx_type', 'demand') }],
    also: ['business'],
    sources: [SRC.itportal, SRC.gst, S('Income-tax Act, 2025 (in force 1 Apr 2026)', 'https://incometaxindia.gov.in')]
  });

  /* ================= 20. Land acquisition ================= */
  I.push({
    id: 'land-acquisition', cat: 'home', title: 'The government is taking my land — acquisition, compensation or rehabilitation', short: 'Land acquisition compensation',
    synonyms: ['land acquisition', 'land acquisition compensation', 'government took my land', 'land acquired', 'highway land acquisition', 'compensation for land', 'award', 'enhancement of compensation', 'rehabilitation', 'resettlement', 'nhai compensation', 'railway land acquisition', 'section 64 reference', 'land acquisition notice'],
    intro: 'You can object before the award and ask for higher compensation after it — but both have short deadlines.',
    juris: 'Most acquisitions follow the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013: a preliminary notification, objections, a declaration and an award by the Collector, with compensation based on market value multiplied by a factor, plus a 100% solatium and rehabilitation entitlements. If you do not accept the award, you can ask for a reference to the Land Acquisition Authority under Section 64 — generally within six weeks of the award if you were present, or within six months otherwise. National Highway acquisitions follow the National Highways Act, 1956, where compensation disputes go to an arbitrator. Some states buy land by consent under their own laws.',
    questions: [
      { id: 'la_stage', text: 'At what stage is it?', why: 'Your options change at each stage.', options: o([['notice', 'I got a notice / survey happened'], ['award', 'An award has been declared'], ['paid', 'Compensation paid but too low'], ['notpaid', 'Land taken, compensation not paid']]) },
      { id: 'la_purpose', text: 'For what project?', why: 'Highways and some projects follow different laws.', options: o([['highway', 'National highway'], ['rail', 'Railway, airport or industry'], ['other', 'Other / not sure']]) },
      { id: 'la_house', text: 'Did you lose a house or your livelihood?', why: 'Rehabilitation benefits depend on this.', options: o([['house', 'House'], ['livelihood', 'Farming or livelihood'], ['both', 'Both'], ['none', 'Neither']]) }
    ],
    evidence: [
      { id: 'la_e_notices', name: 'All notifications and notices (preliminary, declaration, award)', fact: 'What was notified and when', why: 'Deadlines run from these dates.', where: 'Gazette, newspaper, notice served.', preserve: '' },
      { id: 'la_e_title', name: 'Title and revenue records of the land', fact: 'You are the owner or occupant', why: 'Basis of compensation.', where: 'Revenue office.', preserve: '' },
      { id: 'la_e_award', name: 'The award and calculation sheet', fact: 'How compensation was worked out', why: 'Needed to seek enhancement.', where: 'Collector / LAO office.', preserve: '', when: W('la_stage', 'award', 'paid') },
      { id: 'la_e_sales', name: 'Sale deeds of nearby land at higher prices', fact: 'True market value', why: 'The strongest proof for higher compensation.', where: 'Sub-Registrar records.', preserve: '', when: W('la_stage', 'award', 'paid') },
      { id: 'la_e_assets', name: 'Proof of trees, wells, buildings and crops on the land', fact: 'Additional assets', why: 'These are compensated separately.', where: 'Photos, valuation, records.', preserve: '' },
      { id: 'la_e_livelihood', name: 'Proof of livelihood or residence on the land', fact: 'Who is affected', why: 'Needed for rehabilitation entitlements.', where: 'Ration card, voter ID, income records.', preserve: '', when: W('la_house', 'house', 'livelihood', 'both') },
      { id: 'la_e_ref', name: 'Written application for reference / arbitration against the award', fact: 'You object to the amount', why: 'Short deadline after the award.', where: 'Collector’s office (or the arbitrator for highways).', preserve: 'Keep the receipt.', action: true, when: W('la_stage', 'award', 'paid') }
    ],
    urgent: [
      { id: 'la_u_six', level: 'soon', when: W('la_stage', 'award', 'paid'), title: 'Apply for reference within the deadline', text: 'Generally six weeks from the award if you were present, or six months otherwise. Accept payment "under protest" to keep your claim alive.', help: ['l15100'] }
    ],
    stand: [
      { k: 'good', text: 'Compensation includes a solatium equal to the amount fixed, plus interest for delay.' },
      { k: 'next', when: W('la_purpose', 'highway'), text: 'For national highways, compensation disputes go to an arbitrator appointed by the government.' },
      { k: 'risk', when: W('la_stage', 'paid'), text: 'Accepting compensation without protest can weaken a later claim for more.' }
    ],
    lawyerQs: [{ text: 'Which law applies, and what is my deadline to challenge the award?' }, { text: 'Am I entitled to rehabilitation and resettlement benefits?', when: W('la_house', 'house', 'livelihood', 'both') }],
    sources: [SRC.landAcq, S('National Highways Authority of India', 'https://nhai.gov.in'), SRC.nalsa]
  });

  /* ---- Directory topics now covered by full guides ---- */
  const covered = ['Guardianship or adoption', 'Housing society or RWA dispute', 'Threats, assault or extortion', 'Defamation', 'Government certificate, ID or pension problem', 'RTI (Right to Information) request', 'Workplace injury', 'Boundary or access dispute', 'Will dispute', 'Notice period or resignation dispute'];
  KB.directory = KB.directory.filter((d) => !covered.includes(d.title));

  /* ---- Search words people use for existing guides (from query testing) ---- */
  const syn = (id, words) => { const x = I.find((i) => i.id === id); if (x) x.synonyms = x.synonyms.concat(words); };
  syn('upi-cyber-fraud', ['1930', '1930 complaint', 'customer care fraud', 'fake customer care', 'paise kat gaye', 'online thagi', 'thagi', 'otp fraud', 'kyc fraud', 'refund scam']);
  syn('money-lent-not-returned', ['udhaar', 'udhar', 'udhaar wapas', 'paisa wapas', 'loan to friend', 'recovery suit', 'money recovery']);
  syn('land-encroachment', ['kabza', 'zameen par kabza', 'jameen kabza', 'illegal possession', 'pathway blocked', 'rasta band', 'boundary dispute', 'boundary wall', 'easement', 'right of way']);
  syn('inheritance-partition', ['will dispute', 'will challenged', 'fake will', 'release deed', 'relinquishment deed', 'warisat', 'batwara', 'hissa']);
  syn('divorce-separation', ['talaq', 'khula', 'triple talaq', 'mubarat', 'annulment', 'void marriage', 'restitution of conjugal rights', 'rcr', 'husband second marriage', 'bigamy', 'extramarital affair', 'wife left home', 'husband left home', 'talak']);
  syn('maintenance', ['125 crpc', 'section 144 bnss', '144 bnss', 'kharcha', 'kharcha pani', 'alimony', 'interim maintenance']);
  syn('dowry-cruelty', ['streedhan', 'stridhan', 'jewellery not returned', 'sasural', 'sasural wale pareshan', 'in laws harassment', 'dahej']);
  syn('domestic-violence', ['sasural wale pareshan', 'pati marta hai', 'husband beating', 'in laws beating', 'gharelu hinsa']);
  syn('wrongful-termination', ['relieving letter', 'experience letter', 'notice period', 'notice period buyout', 'resignation not accepted', 'service bond', 'employment bond', 'maternity leave denied', 'maternity benefit', 'full and final', 'fnf']);
  syn('pf-gratuity', ['esi', 'esic', 'uan', 'pf transfer']);
  syn('online-harassment', ['eve teasing online', 'stalking', 'stalker']);
  syn('accused-arrest', ['pocso false case', 'false pocso', 'bail for son', 'son arrested', 'husband arrested', 'father arrested', 'jail', 'bail kaise']);
  syn('legal-notice-received', ['arbitration notice', 'arbitration award loan', 'court summons', 'summons']);
  syn('loan-recovery', ['sarfaesi', '13(2)', '13 2 notice', 'bank auction', 'possession notice', 'guarantor']);
  syn('refund-refused', ['gym refund', 'gym membership', 'service not provided', 'restaurant complaint', 'consumer complaint', 'consumer court']);
  syn('electricity-bill', ['water bill', 'water connection', 'municipal water']);
  syn('insurance-claim', ['crop insurance', 'pmfby', 'mediclaim', 'cashless denied']);
  syn('unpaid-salary', ['maid salary', 'domestic worker wages', 'labour wages', 'majdoori']);
  syn('death-claims', ['legal heir certificate', 'succession certificate', 'nominee', 'claim after death']);
  const unsyn = (id, words) => { const x = I.find((i) => i.id === id); if (x) x.synonyms = x.synonyms.filter((w) => !words.includes(w)); };
  unsyn('inheritance-partition', ['mutation']); unsyn('maintenance', ['senior citizen maintenance']);
  syn('job-investment-scam', ['task fraud', 'task scam', 'like and earn', 'youtube like task', 'telegram task', 'trading app fraud', 'ipo scam']);
  syn('digital-arrest-scam', ['fedex scam', 'fedex parcel scam', 'parcel scam', 'courier scam', 'drugs in parcel', 'customs call scam', 'trai call scam']);
  syn('loan-recovery', ['emi not paid', 'emi bounce', 'cannot pay emi', 'loan default', 'npa']);
  syn('loan-app-harassment', ['loan app harassment', 'loan app', 'loan app threatening', 'loan app morphing']);
  syn('bank-service', ['locker', 'locker missing items', 'bank locker', 'locker theft']);
  syn('land-records', ['mutation not done', 'mutation pending', 'mutation rejected']);
  syn('property-purchase', ['registry', 'registry kaise', 'property registration', 'stamp duty', 'encumbrance certificate']);
  syn('adoption-guardianship', ['guardianship of child', 'guardian of minor', 'guardians and wards']);
  syn('parents-maintenance', ['senior citizen maintenance', 'senior citizen', 'old parents', 'elderly parents']);
  syn('wrongful-termination', ['full and final settlement', 'full and final settlement not done']);
  syn('pf-gratuity', ['gratuity not paid', 'gratuity']);
  syn('gig-worker', ['swiggy', 'zomato', 'uber driver', 'ola driver', 'rapido', 'blinkit', 'zepto', 'urban company', 'delivery partner', 'swiggy account blocked']);
  syn('internship-creator-pay', ['freelance payment not received', 'freelance payment', 'freelancer not paid']);
  syn('dog-bite', ['pet dog attacked', 'dog attacked']);
  syn('defective-product', ['warranty not honoured', 'warranty rejected', 'warranty claim']);
  syn('ecommerce-order', ['flipkart', 'amazon', 'meesho', 'myntra', 'wrong product', 'fake product online']);
  syn('travel-refund', ['flight cancelled', 'flight cancelled refund', 'train refund', 'irctc refund', 'tatkal refund', 'bus refund', 'hotel refund']);
  syn('education-dispute', ['coaching fee refund', 'coaching refund', 'tuition fee refund']);
  syn('intimate-images', ['morphed photos', 'sextortion', 'nude video call']);
  syn('will-gift', ['give my house', 'give property', 'make my will', 'write will', 'vasiyat', 'wasiyat', 'vasiyatnama', 'house to my daughter', 'house to my son', 'property to my children']);
  syn('inheritance-partition', ['sister share', 'brother share', 'share in house', 'share in property', 'refusing share', 'father property share']);
  syn('court-marriage', ['married against', 'against parents', 'parents against marriage', 'family threatening couple', 'honour threat', 'inter religion marriage']);
  syn('lost-phone', ['snatched', 'phone snatched', 'mobile snatched', 'iphone', 'smartphone', 'phone theft']);
  syn('police-complaint', ['bike stolen', 'vehicle stolen', 'car stolen', 'chain snatching', 'house theft', 'burglary', 'theft']);
  syn('govt-benefits', ['status of my file', 'file status', 'municipality not responding', 'government office', 'file pending', 'application pending']);
  syn('documents-correction', ['passport not issued', 'passport refused', 'passport delayed', 'passport case']);
  syn('cheque-bounce', ['cheque returned', 'returned unpaid', 'cheque dishonoured']);
  syn('rental-security-deposit', ['advance not returned', 'after i vacated', 'vacated flat', 'rent advance']);
  syn('govt-service', ['teacher transferred', 'government teacher', 'government school teacher', 'transferred unfairly', 'police constable', 'railway employee']);
  syn('missing-person', ['did not come back', 'not come back', 'not returned home', 'not reachable for days']);
  syn('sexual-assault', ['touched wrongly', 'bad touch', 'touched me', 'touched my child', 'sexually harassed']);
  syn('caste-atrocity', ['caste name', 'upper caste', 'lower caste', 'called by caste']);
  syn('trafficking', ['children working', 'kids working', 'minor working', 'child in factory']);
  syn('ecommerce-order', ['online order', 'order came broken', 'damaged product delivered', 'seller not refunding']);
  syn('travel-refund', ['airline', 'cancelled ticket', 'ticket refund', 'indigo refund', 'air india refund']);
  syn('online-harassment', ['fake id', 'fake account', 'fake instagram', 'impersonation', 'fake page']);
  syn('account-hacked', ['got hacked', 'hacked', 'password changed by someone']);
  syn('partnership-dispute', ['business partner', 'partner took money', 'partner cheated']);
  syn('tax-notice', ['income tax', 'tax ka notice', 'tds deducted', 'refund not came', 'refund not credited']);
  syn('dog-bite', ['monkey attacked', 'monkey', 'bull attacked', 'cow attacked']);
  syn('defamation', ['defamation notice', 'defamation case']);
  syn('insurance-claim', ['car insurance', 'vehicle insurance', 'motor insurance', 'bike insurance', 'flood damage', 'fire insurance', 'shop insurance']);
  syn('partnership-dispute', ['rival business', 'competing business', 'took our clients', 'stole clients', 'partner opened']);
  syn('wrongful-termination', ['thrown out of job', 'fired', 'fired during probation', 'probation termination', 'sacked']);
  syn('parents-maintenance', ['threw me out', 'thrown out of house', 'son threw me out', 'ghar se nikal']);
  syn('workplace-injury', ['worker fell', 'fell from building', 'labourer injured', 'construction worker died']);
  syn('unpaid-salary', ['not paid me', 'company not paid', 'has not paid', 'months salary pending', 'salary pending']);
  syn('pf-gratuity', ['pf money', 'pf not transferred', 'pf transfer', 'old company pf']);
  syn('credit-report-error', ['aadhaar misuse', 'loan in my name', 'identity misuse', 'identity theft', 'pan misuse']);
  syn('child-custody', ['visitation', 'not letting me see', 'meet my child', 'see my daughter', 'see my son']);
  syn('caste-atrocity', ['denied access', 'temple entry', 'not allowed in temple', 'separate glass', 'water denied']);
  syn('trafficking', ['held trafficked', 'cannot come back', 'maid abroad', 'domestic worker held']);
  syn('business-unpaid', ['customer not paying', 'client not paying', 'project payment', 'software project']);
})(typeof window !== 'undefined' ? window : globalThis);
