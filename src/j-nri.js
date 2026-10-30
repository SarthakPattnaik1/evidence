/* NRI journeys (draft, not advocate-reviewed). */
(function (root) {
  const { W, ALL, ANY, NOT, ANS, o, NS, PN, LAWFUL } = root.ER_H;
  const KB = root.ER_KB; const I = KB.issues;
  KB.categories.splice(2, 0, { id: 'nri', title: 'NRI', blurb: 'Property, PoA, marriage, cases and money from abroad', icon: 'globe' });
  Object.assign(KB.help, {
    madad: { label: 'MADAD', name: 'MEA consular grievance portal', detail: 'For NRIs abroad: consular help, including in matrimonial and legal matters.', href: 'https://madad.gov.in' },
    ncwnri: { label: 'NCW', name: 'National Commission for Women — NRI cell', detail: 'Complaints by women deserted or harassed by NRI spouses.', href: 'https://ncw.nic.in' },
    passport: { label: 'Passport', name: 'Passport Seva / Regional Passport Office', detail: 'Applications relating to passports, including impounding requests.', href: 'https://www.passportindia.gov.in' }
  });
  const ABROAD = 'Documents signed abroad for use in India are usually executed before an Indian embassy/consulate, or before a local notary and then apostilled (for Hague Apostille countries).';

  /* ---------------- NRI property ---------------- */
  I.push({
    id: 'nri-property', cat: 'nri', title: 'My property in India is occupied, misused or claimed while I live abroad', short: 'NRI property problems',
    synonyms: ['nri property', 'nri property dispute', 'tenant not vacating nri', 'relative occupied my house', 'property grabbed nri', 'nri land encroachment', 'caretaker', 'nri rent', 'property abroad india', 'oci property'],
    intro: 'Most NRI property disputes are lost on missing papers and delay, not on the law. We\'ll build the file you\'d need to act from abroad.',
    juris: 'NRIs and OCIs can own and inherit residential and commercial property in India. They generally cannot buy agricultural land, plantations or farmhouses, but can inherit them. You can act through an advocate and a power-of-attorney holder without living in India.',
    tips: ['You can file and pursue most civil cases through a power-of-attorney holder and an advocate; personal evidence may be recorded by video conference with court permission.', 'Keep paying property tax and utility bills in your own name — they help prove possession and ownership.', 'Mutation in revenue records does not by itself decide ownership, but check it regularly so changes don\'t go unnoticed.'],
    questions: [
      { id: 'np_problem', text: 'What is happening with the property?', type: 'multi', chapter: 'The problem', why: 'Each problem has a different remedy and different records.',
        options: o([['tenant', 'Tenant won\'t pay or won\'t leave'], ['relative', 'A relative is occupying or claiming it'], ['stranger', 'Someone encroached or built on it'], ['caretaker', 'Caretaker or agent misused it'], ['sold', 'Someone sold or mortgaged it with fake papers'], ['records', 'Records changed into someone else\'s name']]) },
      { id: 'np_how', text: 'How did you get the property?', chapter: 'Your title', why: 'Your title documents depend on this.', options: o([['bought', 'Bought it'], ['inherited', 'Inherited it'], ['gift', 'Gift or family settlement'], ['builder', 'Builder allotment']]) },
      { id: 'np_kind', text: 'What kind of property is it?', chapter: 'Your title', why: 'Agricultural land has extra rules for NRIs; flats and plots have different records.', options: o([['flat', 'Flat / apartment'], ['house', 'House'], ['plot', 'Plot'], ['agri', 'Agricultural land'], ['commercial', 'Shop / office']]) },
      { id: 'np_status', text: 'What is your status abroad?', chapter: 'Your title', why: 'NRI (Indian passport) and OCI (foreign passport) have slightly different rules and documents.', options: o([['nri', 'NRI — Indian passport'], ['oci', 'OCI — foreign passport'], ['foreign', 'Foreign citizen without OCI'], NS]) },
      { id: 'np_poa', text: 'Is someone in India acting for you under a power of attorney?', chapter: 'In India', why: 'A PoA holder can act for you — or can be the source of the problem.', options: o([['yes_good', 'Yes, someone I trust'], ['yes_problem', 'Yes, and they misused it'], ['no', 'No']]) },
      { id: 'np_tenancy', text: 'Is there a written rent agreement?', chapter: 'In India', when: W('np_problem', 'tenant'), why: 'Rent terms and notice periods usually come from it.', options: o([['registered', 'Registered'], ['unregistered', 'Unregistered'], ['none', 'None']]) },
      { id: 'np_since', text: 'Since when has this been going on?', chapter: 'Timing', why: 'Long, open occupation by others can create claims. Delay hurts.', options: o([['recent', 'Within a year'], ['years', '1–10 years'], ['long', 'More than 10 years']]) },
      { id: 'np_visit', text: 'Can you travel to India if needed?', deep: true, chapter: 'Logistics', why: 'Some steps (like registration) may need you in person or a properly authenticated PoA.', options: o([['yes', 'Yes'], ['maybe', 'Maybe, with notice'], ['no', 'Not for now']]) },
      { id: 'np_police', text: 'Have you complained to police or revenue officials?', deep: true, chapter: 'Steps so far', type: 'multi', why: 'Prompt complaints show you objected.', options: o([['police', 'Police'], ['revenue', 'Revenue / tehsil office'], ['madad', 'Indian embassy / MADAD'], ['none', 'Not yet']]) }
    ],
    evidence: [
      { id: 'np_e_deed', name: 'Title deed (sale deed, gift deed, allotment) — certified copy', fact: 'Your ownership', why: 'The foundation of any case.', where: 'Your records; certified copy from the sub-registrar (many states allow online request).', preserve: 'Keep originals in a safe place; share scans with your advocate.' },
      { id: 'np_e_inherit', name: 'Death certificate, legal heir/succession papers, will (if any)', fact: 'How the property came to you', why: 'Inherited property needs the chain of succession.', where: 'Family records, municipality, court.', preserve: '', when: W('np_how', 'inherited') },
      { id: 'np_e_records', name: 'Land/property records: mutation, khata/khatian, 7/12, property card', fact: 'Who is recorded as owner', why: 'Shows any changes made behind your back.', where: 'State land records portal; municipal property tax portal.', preserve: 'Download and date screenshots now.' },
      { id: 'np_e_ec', name: 'Encumbrance certificate (last 15–30 years)', fact: 'Any sale or mortgage registered', why: 'Detects fake sales or loans.', where: 'Sub-registrar / state portal.', preserve: '', when: W('np_problem', 'sold', 'records', 'caretaker') },
      { id: 'np_e_tax', name: 'Property tax receipts and electricity/water bills in your name', fact: 'Continuous ownership and possession', why: 'Strong supporting proof.', where: 'Municipality and utility portals.', preserve: '' },
      { id: 'np_e_passport', name: 'Your passport, OCI card and visa/residence proof abroad', fact: 'Your identity and status', why: 'Needed for PoA, cases and registration.', where: 'Your documents.', preserve: 'Keep certified copies ready.' },
      { id: 'np_e_pan', name: 'PAN and Indian bank (NRO) account details', fact: 'Tax and payment identity', why: 'Needed for rent, sale and court fees.', where: 'Your records.', preserve: '' },
      { id: 'np_e_poa', name: 'The power of attorney (and proof of any revocation)', fact: 'What your representative may do', why: 'Misused or overbroad PoAs are a common cause of loss.', where: 'Your records; sub-registrar if registered.', preserve: '', when: W('np_poa', 'yes_good', 'yes_problem') },
      { id: 'np_e_revoke', name: 'Revoke the misused PoA in writing, notify the sub-registrar and third parties', fact: 'Authority was withdrawn', why: 'Stops further misuse.', where: 'Indian consulate or notary + apostille; send to the holder, sub-registrar and banks.', preserve: '', action: true, when: W('np_poa', 'yes_problem') },
      { id: 'np_e_tenancy', name: 'Rent agreement, rent received, and the tenant\'s police verification', fact: 'Tenancy terms and default', why: 'Basis for eviction or recovery.', where: 'Your records; bank statements.', preserve: '', when: W('np_problem', 'tenant') },
      { id: 'np_e_photos', name: 'Recent dated photos/video of the property (ask a trusted person)', fact: 'Current state and occupation', why: 'Shows encroachment or unauthorised use.', where: 'Trusted friend, neighbour or local advocate.', preserve: '' },
      { id: 'np_e_comms', name: 'Messages and emails with the occupant, relative or caretaker', fact: 'What they claim and promised', why: 'Admissions and promises matter.', where: 'Your phone and email.', preserve: 'Export complete chats.' },
      { id: 'np_e_complaints', name: 'Copies of police, revenue or MADAD complaints and replies', fact: 'You objected promptly', why: 'Shows you acted in time.', where: 'Email, portals.', preserve: '', when: W('np_police', 'police', 'revenue', 'madad') },
      { id: 'np_e_newpoa', name: 'A fresh, specific PoA for your trusted representative/advocate', fact: 'Someone can act for you in India', why: 'Lets cases and complaints proceed while you\'re abroad.', where: ABROAD, preserve: 'Make it specific to this property and dispute; avoid broad "sell anything" powers.', action: true, when: W('np_poa', 'no', 'yes_problem') }
    ],
    urgent: [
      { id: 'np_u_sale', level: 'now', when: W('np_problem', 'sold', 'stranger'), title: 'Move quickly to stop a sale or construction', text: 'Courts can grant urgent injunctions, and a public notice/caution with the sub-registrar can warn buyers. Speak to an advocate in India this week.', help: ['l15100', 'madad'] },
      { id: 'np_u_long', level: 'soon', when: W('np_since', 'long'), title: 'Long occupation can create claims', text: 'Occupation for many years may let the occupant raise adverse-possession claims. Don\'t delay further.', help: ['l15100'] }
    ],
    lawyerQs: [{ text: 'Which case should be filed — eviction, injunction, possession or declaration — and where?' }, { text: 'Can my PoA holder pursue the case, and will I need to depose by video?' }, { text: 'Should I also file a criminal complaint for forgery or trespass?', when: W('np_problem', 'sold', 'records', 'caretaker') }]
  });

  /* ---------------- Selling / inheriting property and moving money abroad ---------------- */
  I.push({
    id: 'nri-sale-repatriation', cat: 'nri', title: 'Selling or inheriting property in India and moving the money abroad', short: 'NRI property sale & repatriation',
    synonyms: ['nri sell property', 'repatriation', 'repatriate money', 'nri tds property', 'form 15ca', '15cb', 'lower tds certificate', 'nro to nre', 'usd 1 million', 'nri inherited property sale', 'capital gains nri'],
    intro: 'Selling is mostly paperwork: title, tax and banking. Getting the order right saves months and a lot of blocked tax.',
    juris: 'Buyers must deduct tax (TDS) from payments to NRI sellers on the full sale value unless a lower/nil deduction certificate is obtained. From 1 April 2026 these rules sit in the Income-tax Act, 2025 (renumbered sections and forms). Repatriation is governed by FEMA and RBI rules.',
    tips: ['RBI generally allows NRIs to repatriate up to USD 1 million per financial year from their NRO account, including property sale proceeds, after tax.', 'Applying for a lower/nil TDS certificate before the sale can stop a large amount of tax being blocked until your refund.', 'Your bank will usually need a chartered accountant\'s certificate and online declaration before sending money abroad.'],
    questions: [
      { id: 'ns_what', text: 'What are you doing?', chapter: 'The deal', why: 'Selling, inheriting and transferring money each need different papers.', options: o([['sell', 'Selling property I own'], ['inherit', 'Selling or claiming inherited property'], ['money', 'Moving money already in India to abroad']]) },
      { id: 'ns_kind', text: 'What kind of property?', chapter: 'The deal', when: W('ns_what', 'sell', 'inherit'), why: 'Agricultural land and residential property have different rules.', options: o([['res', 'Residential'], ['comm', 'Commercial'], ['agri', 'Agricultural / farmhouse']]) },
      { id: 'ns_held', text: 'How long has it been owned (by you or the person you inherited from)?', chapter: 'Tax', when: W('ns_what', 'sell', 'inherit'), why: 'Long-term and short-term gains are taxed differently.', options: o([['short', 'Less than 2 years'], ['long', '2 years or more'], NS]) },
      { id: 'ns_cert', text: 'Have you applied for a lower/nil TDS certificate?', chapter: 'Tax', when: W('ns_what', 'sell', 'inherit'), why: 'Without it, TDS is on the whole sale value, not just the gain.', options: o([['yes', 'Yes'], ['no', 'Not yet'], NS]) },
      { id: 'ns_present', text: 'Will you be in India to sign the sale deed?', chapter: 'Signing', when: W('ns_what', 'sell', 'inherit'), why: 'If not, you need a properly executed PoA.', options: o([['yes', 'Yes'], ['poa', 'No, through a PoA holder'], NS]) },
      { id: 'ns_account', text: 'Which Indian account will receive the money?', chapter: 'Moving money', why: 'Sale proceeds usually go to an NRO account before repatriation.', options: o([['nro', 'NRO account'], ['nre', 'NRE account'], ['resident', 'An old resident savings account'], ['none', 'No Indian account']]) },
      { id: 'ns_heirs', text: 'Are other heirs involved?', deep: true, chapter: 'Other heirs', when: W('ns_what', 'inherit'), why: 'All co-owners must join or release their share.', options: o([['yes_agree', 'Yes, all agree'], ['yes_dispute', 'Yes, there is a dispute'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'ns_e_title', name: 'Title deed and chain of earlier deeds', fact: 'You can sell it', why: 'Buyers and banks check the full chain.', where: 'Your records; sub-registrar.', preserve: '', when: W('ns_what', 'sell', 'inherit') },
      { id: 'ns_e_cost', name: 'Purchase cost proof: original sale deed value, payment records, improvement bills', fact: 'Cost of acquisition', why: 'Capital gains (and TDS certificate) are worked out from it.', where: 'Your records, builder receipts.', preserve: '', when: W('ns_what', 'sell', 'inherit') },
      { id: 'ns_e_inherit', name: 'Death certificate, will/probate or succession/legal heir papers, and mutation in your name', fact: 'You inherited it', why: 'Needed before you can sell.', where: 'Municipality, court, revenue office.', preserve: '', when: W('ns_what', 'inherit') },
      { id: 'ns_e_release', name: 'Release / relinquishment deeds or consent of other heirs', fact: 'Other heirs\' shares', why: 'A sale without all co-owners is risky for buyers.', where: 'Sub-registrar (registered deeds).', preserve: '', when: W('ns_heirs', 'yes_agree', 'yes_dispute') },
      { id: 'ns_e_certapp', name: 'Apply for a lower/nil TDS certificate (through a CA) before the sale', fact: 'Correct tax deduction', why: 'Avoids TDS on the full sale value.', where: 'Income-tax portal (a CA usually files it).', preserve: '', action: true, time: 'Apply well before the sale — processing takes time.', when: ALL(W('ns_what', 'sell', 'inherit'), W('ns_cert', 'no', 'unsure')) },
      { id: 'ns_e_ids', name: 'PAN, passport, OCI card, overseas address proof', fact: 'Your identity and tax status', why: 'Required for the deed, TDS and bank.', where: 'Your documents.', preserve: '' },
      { id: 'ns_e_poa', name: 'Sale PoA executed abroad (consulate, or notary + apostille), stamped in India', fact: 'Your representative can sign', why: 'Registrars reject improperly executed PoAs.', where: ABROAD, preserve: '', time: 'Documents executed abroad generally must be stamped within 3 months of reaching India — check your state\'s stamp law.', when: W('ns_present', 'poa') },
      { id: 'ns_e_tds', name: 'Buyer\'s TDS payment proof and TDS certificate', fact: 'Tax was deducted', why: 'Needed for your tax return and repatriation.', where: 'From the buyer; income-tax portal.', preserve: '', when: W('ns_what', 'sell', 'inherit') },
      { id: 'ns_e_ca', name: 'CA certificate and online declaration for the remittance (Forms 15CA/15CB or new equivalents)', fact: 'Tax is settled on the money being sent', why: 'Banks need it before sending money abroad.', where: 'Your chartered accountant; bank.', preserve: '' },
      { id: 'ns_e_bank', name: 'NRO statement showing sale proceeds and the bank\'s remittance form', fact: 'Source of funds', why: 'Banks track repatriation limits.', where: 'Your bank.', preserve: '' },
      { id: 'ns_e_convert', name: 'Ask your bank to redesignate old resident accounts as NRO', fact: 'Account compliance', why: 'FEMA requires resident accounts to be redesignated when you become NRI; frozen accounts are a common result.', where: 'Your bank.', preserve: '', action: true, when: W('ns_account', 'resident', 'none') },
      { id: 'ns_e_return', name: 'Indian income-tax return for the year of sale', fact: 'Final tax and refund', why: 'Claims refund of excess TDS and shows tax compliance.', where: 'Income-tax portal / CA.', preserve: '', when: W('ns_what', 'sell', 'inherit') }
    ],
    info: [{ when: W('ns_kind', 'agri'), text: 'NRIs and OCIs generally cannot buy agricultural land in India but may inherit it and can usually sell it to a resident Indian. Check state land laws with your advocate.' }],
    urgent: [{ id: 'ns_u_dispute', level: 'soon', when: W('ns_heirs', 'yes_dispute'), title: 'Settle the heirs\' dispute first', text: 'A sale with an unresolved co-owner dispute can be challenged. Ask an advocate about partition or a family settlement.', help: ['l15100'] }],
    lawyerQs: [{ text: 'Is the title clean enough for a buyer, and are all heirs\' rights settled?' }, { text: 'How much TDS and capital gains tax applies, and should I apply for a lower deduction certificate?', when: W('ns_what', 'sell', 'inherit') }, { text: 'How much can I repatriate this year, and what will my bank need?' }]
  });

  /* ---------------- Power of attorney from abroad ---------------- */
  I.push({
    id: 'nri-poa', cat: 'nri', title: 'Giving, using or cancelling a power of attorney from abroad', short: 'Power of attorney (from abroad)',
    synonyms: ['power of attorney', 'poa', 'gpa', 'spa', 'poa from abroad', 'apostille', 'consulate attestation', 'cancel power of attorney', 'revoke poa', 'poa misuse', 'adjudication of poa'],
    intro: 'A power of attorney is how most NRIs act in India. A badly drafted or badly executed one causes more disputes than it solves.',
    juris: 'A PoA signed abroad is generally executed before an Indian consulate, or before a notary and then apostilled. It must usually be stamped in India within a set time after it arrives, and registered if it will be used to sell property.',
    tips: ['Prefer a specific PoA (for one property or one case) over a general one.', 'Courts have held that a PoA holder cannot give evidence about facts only you personally know.', 'Since 2011, transfers of property through "GPA sales" are not valid substitutes for a registered sale deed.'],
    questions: [
      { id: 'pa_goal', text: 'What do you need?', chapter: 'Goal', why: 'Creating, using and cancelling a PoA have different steps.', options: o([['give', 'Give someone a PoA'], ['use', 'My PoA was rejected or questioned'], ['cancel', 'Cancel a PoA'], ['misuse', 'A PoA was misused']]) },
      { id: 'pa_for', text: 'What is it for?', type: 'multi', chapter: 'Goal', why: 'Selling property needs a registered PoA; court cases and bank work need specific powers.', options: o([['sell', 'Selling property'], ['rent', 'Renting / managing property'], ['case', 'A court case'], ['bank', 'Bank or tax work'], ['other', 'Other']]) },
      { id: 'pa_where', text: 'Which country are you in?', chapter: 'Signing', why: 'Apostille works in Hague Convention countries; otherwise the Indian consulate route is used.', options: o([['hague', 'A Hague Apostille country (e.g. USA, UK, Australia, most of Europe)'], ['nonhague', 'A non-Hague country (e.g. many Gulf countries)'], NS]) },
      { id: 'pa_stage', text: 'Where is the document now?', chapter: 'Signing', when: W('pa_goal', 'give', 'use'), why: 'Stamping and registration deadlines run from when it arrives in India.', options: o([['draft', 'Still a draft'], ['signed', 'Signed abroad, not yet sent'], ['india', 'Already in India'], ['rejected', 'Rejected by the registrar/bank/court']]) }
    ],
    evidence: [
      { id: 'pa_e_draft', name: 'A clear PoA draft naming the property/case and the exact powers', fact: 'What the agent may do', why: 'Vague, broad drafts are the main cause of misuse and rejection.', where: 'Your advocate in India.', preserve: '', action: true, when: W('pa_goal', 'give') },
      { id: 'pa_e_exec', name: 'Execution proof: consular attestation, or notarisation + apostille certificate', fact: 'Valid execution abroad', why: 'Registrars and courts check this first.', where: ABROAD, preserve: 'Get extra certified copies.' },
      { id: 'pa_e_stamp', name: 'Stamp duty payment / adjudication in India', fact: 'Duly stamped', why: 'Unstamped documents can be refused or impounded.', where: 'Sub-registrar / collector of stamps in your state.', preserve: '', time: 'Generally within 3 months of the document reaching India — confirm your state rule.', when: W('pa_stage', 'india', 'signed', 'rejected') },
      { id: 'pa_e_reg', name: 'Registration of the PoA (if it will be used to sell property)', fact: 'Registered authority to sell', why: 'Many registrars require it.', where: 'Sub-registrar office.', preserve: '', when: W('pa_for', 'sell') },
      { id: 'pa_e_ids', name: 'Passport/OCI copies of you and ID of the attorney holder; photos', fact: 'Identity of both parties', why: 'Required at execution and registration.', where: 'Your documents.', preserve: '' },
      { id: 'pa_e_reason', name: 'The written rejection or objection', fact: 'What went wrong', why: 'Tells you what to fix.', where: 'Registrar, bank or court.', preserve: '', when: W('pa_stage', 'rejected') },
      { id: 'pa_e_revoke', name: 'Revocation deed executed abroad, and notices to the holder, sub-registrar, banks and buyers', fact: 'Authority was withdrawn', why: 'Revocation must be communicated to be effective against others.', where: ABROAD, preserve: 'Keep postal/email proof of each notice.', action: true, when: W('pa_goal', 'cancel', 'misuse') },
      { id: 'pa_e_misuse', name: 'Records of what the holder did (deeds, bank withdrawals, messages)', fact: 'Misuse of authority', why: 'Supports civil and criminal action.', where: 'Encumbrance certificate, bank statements, sub-registrar.', preserve: '', when: W('pa_goal', 'misuse') }
    ],
    urgent: [{ id: 'pa_u_misuse', level: 'now', when: W('pa_goal', 'misuse'), title: 'Revoke and warn others now', text: 'Revoke the PoA, notify the sub-registrar and banks, and see an advocate about stopping any sale.', help: ['l15100', 'madad'] }],
    lawyerQs: [{ text: 'Should this be a general or specific PoA, and what exact powers should it have?' }, { text: 'Does it need registration, and what stamp duty applies in this state?' }, { text: 'Can my attorney give evidence in my case, or will I need to appear by video?', when: W('pa_for', 'case') }]
  });

  /* ---------------- NRI marriage ---------------- */
  I.push({
    id: 'nri-marriage', cat: 'nri', sensitive: true, title: 'NRI marriage problem — abandoned, divorce abroad, child taken, or case against an NRI spouse', short: 'NRI marriage disputes',
    synonyms: ['nri husband', 'nri marriage', 'abandoned by nri husband', 'deserted wife nri', 'foreign divorce', 'divorce abroad valid in india', 'nri divorce', 'child taken abroad', 'child abduction', 'passport impound', 'look out circular', 'loc', 'nri wife'],
    intro: 'This guide works for both sides: a spouse left behind in India, and an NRI spouse facing cases in India. You can stop any time.',
    juris: 'A foreign divorce is generally recognised in India only if the court had proper jurisdiction and decided on grounds available under the law the couple married under, with both sides participating. India is not a party to the Hague Convention on child abduction, so courts decide custody on the child\'s welfare.',
    tips: ['Indian courts can hear maintenance and domestic-violence cases against a spouse living abroad; summons can be served through the embassy.', 'The Ministry of External Affairs and the National Commission for Women have cells for deserted spouses of NRIs.', 'A foreign divorce obtained without the other spouse\'s participation may not be recognised in India.'],
    questions: [
      { id: 'nm_safe', text: 'First: are you safe right now?', sensitive: true, chapter: 'Safety', why: 'Safety first.', options: o([['safe', 'Yes'], ['threat', 'I have been threatened'], ['danger', 'I am in danger'], PN]) },
      { id: 'nm_side', text: 'Which describes you?', chapter: 'Your side', why: 'The two sides need very different records.', options: o([['left', 'My NRI spouse left me / stopped contact'], ['foreigndiv', 'My spouse got (or is seeking) a divorce abroad'], ['child', 'Our child has been taken to / kept in another country'], ['nri_accused', 'I am the NRI spouse and a case was filed against me in India'], ['nri_divorce', 'I live abroad and want a divorce']]) },
      { id: 'nm_where', text: 'Where was the marriage performed and registered?', chapter: 'The marriage', why: 'Decides which law and court applies.', options: o([['india_reg', 'In India, registered'], ['india_unreg', 'In India, not registered'], ['abroad', 'Abroad'], NS]) },
      { id: 'nm_know', text: 'What do you know about the spouse abroad?', type: 'multi', chapter: 'The other side', when: W('nm_side', 'left', 'foreigndiv', 'child'), why: 'Address, employer and passport details help courts and authorities reach them.', options: o([['address', 'Address abroad'], ['employer', 'Employer'], ['passport', 'Passport details'], ['visa', 'Visa / immigration status'], ['none', 'Very little']]) },
      { id: 'nm_cases', text: 'What cases or orders exist?', type: 'multi', chapter: 'Cases', why: 'Existing cases decide next steps.', options: o([['india', 'A case in India'], ['abroad', 'A case or order abroad'], ['loc', 'Look Out Circular / passport action'], ['none', 'None yet']]) },
      { id: 'nm_money', text: 'Is financial support an issue?', deep: true, chapter: 'Money', when: W('nm_side', 'left', 'foreigndiv', 'child'), why: 'Maintenance can be claimed in India against a spouse abroad.', options: o([['yes', 'Yes'], ['no', 'No'], PN]) },
      { id: 'nm_participate', text: 'Did you take part in the foreign divorce case?', deep: true, chapter: 'Foreign divorce', when: W('nm_side', 'foreigndiv'), why: 'Participation affects whether India will recognise the decree.', options: o([['yes', 'Yes, I contested or consented'], ['no', 'No'], ['notice', 'I only got a notice']]) }
    ],
    evidence: [
      { id: 'nm_e_marriage', name: 'Marriage certificate, wedding photos, invitation', fact: 'The marriage', why: 'Basic proof in every case.', where: 'Registrar, family.', preserve: '' },
      { id: 'nm_e_register', name: 'Get the marriage registered (if it isn\'t)', fact: 'Registered marriage', why: 'Registration makes enforcement and passport-linked remedies easier.', where: 'Marriage registrar.', preserve: '', action: true, when: W('nm_where', 'india_unreg') },
      { id: 'nm_e_spouse', name: 'Spouse\'s passport copy, visa/residence details, foreign address, employer', fact: 'How to reach the spouse abroad', why: 'Needed for service of summons, maintenance enforcement and passport action.', where: 'Old documents, emails, visa papers.', preserve: LAWFUL, when: W('nm_side', 'left', 'foreigndiv', 'child') },
      { id: 'nm_e_desertion', name: 'Proof of desertion: last contact, travel dates, messages, money stopped', fact: 'Abandonment', why: 'Supports maintenance, DV and divorce claims.', where: 'Phone, bank statements, passport stamps.', preserve: 'Export full chats.', when: W('nm_side', 'left') },
      { id: 'nm_e_dowry', name: 'Records of dowry demands, money transferred, stridhan kept', fact: 'Demands and property', why: 'Supports criminal and recovery claims.', where: 'Messages, bank records, photos.', preserve: '', when: W('nm_side', 'left') },
      { id: 'nm_e_foreigndecree', name: 'The foreign divorce decree/petition and proof of how you were served', fact: 'Validity of the foreign divorce', why: 'Decides whether India will recognise it.', where: 'Court papers, emails.', preserve: '', when: W('nm_side', 'foreigndiv', 'nri_divorce') },
      { id: 'nm_e_child', name: 'Child\'s birth certificate, passport details, school records, travel details', fact: 'The child\'s residence and removal', why: 'Courts decide custody on the child\'s welfare and habitual residence.', where: 'Your records, school, airline.', preserve: '', when: W('nm_side', 'child') },
      { id: 'nm_e_indiacase', name: 'FIR, complaint, summons or orders in India', fact: 'What is alleged', why: 'Your response starts here.', where: 'Police portal, court, your advocate.', preserve: '', when: ANY(W('nm_side', 'nri_accused'), W('nm_cases', 'india')) },
      { id: 'nm_e_loc', name: 'Any Look Out Circular, passport notice or impounding order', fact: 'Travel restrictions', why: 'May need urgent legal action before travel.', where: 'Passport office, police, your advocate.', preserve: '', when: W('nm_cases', 'loc') },
      { id: 'nm_e_abroad', name: 'Your residence, job and immigration papers abroad', fact: 'Your situation abroad', why: 'Relevant to appearance, bail and jurisdiction.', where: 'Your documents.', preserve: '', when: W('nm_side', 'nri_accused', 'nri_divorce') },
      { id: 'nm_e_income', name: 'Income and expense records (both spouses, as far as lawfully known)', fact: 'Maintenance', why: 'Courts require income disclosure.', where: 'Salary slips, bank statements.', preserve: LAWFUL, when: W('nm_money', 'yes') }
    ],
    urgent: [
      { id: 'nm_u_danger', level: 'now', when: W('nm_safe', 'danger'), title: 'Please get help now', text: 'If you are in danger, call 112 in India or the local emergency number abroad.', help: ['e112', 'w181', 'madad'] },
      { id: 'nm_u_child', level: 'now', when: W('nm_side', 'child'), title: 'Act fast for the child', text: 'Courts can pass urgent orders, including on passports and travel. See an advocate now and contact the Indian embassy through MADAD.', help: ['madad', 'l15100'] },
      { id: 'nm_u_left', level: 'soon', when: W('nm_side', 'left'), title: 'Support for deserted spouses', text: 'The National Commission for Women\'s NRI cell and legal aid can help with complaints, maintenance and service of summons abroad.', help: ['ncwnri', 'l15100', 'madad'] },
      { id: 'nm_u_accused', level: 'now', when: W('nm_side', 'nri_accused'), title: 'Get advice before you travel', text: 'If an FIR or Look Out Circular exists, you may be stopped at the airport. Speak to an advocate about anticipatory bail first.', help: ['l15100'] }
    ],
    lawyerQs: [{ text: 'Will the foreign divorce be recognised in India?', when: W('nm_side', 'foreigndiv', 'nri_divorce') }, { text: 'Can I claim maintenance in India and enforce it against my spouse abroad?', when: W('nm_side', 'left') }, { text: 'What can be done to bring the child back or get custody?', when: W('nm_side', 'child') }, { text: 'Do I need anticipatory bail before travelling to India?', when: W('nm_side', 'nri_accused') }]
  });

  /* ---------------- Case in India while living abroad ---------------- */
  I.push({
    id: 'nri-case-abroad', cat: 'nri', title: 'I live abroad and have a case, notice or summons in India', short: 'Handling a case from abroad',
    synonyms: ['nri court case', 'case in india living abroad', 'summons nri', 'appear in court from abroad', 'video conferencing court', 'exemption from appearance', 'nri cheque case', 'nri consumer complaint', 'nri legal notice'],
    intro: 'You can run most cases from abroad with the right advocate, papers and authority. Missing a date is the real risk.',
    juris: 'Many courts allow exemption from personal appearance and evidence by video conference. Criminal cases may need personal appearance at certain stages. A power-of-attorney holder can file and manage civil cases but cannot testify to facts only you know.',
    tips: ['Consumer complaints can be filed online on e-Jagriti from abroad.', 'You can track case status online on the eCourts services portal using the case number.', 'Keep your advocate updated with a working phone and email — notices are now often served electronically.'],
    questions: [
      { id: 'nc_side', text: 'Are you bringing the case or responding to one?', chapter: 'The case', why: 'Different documents and urgency.', options: o([['me', 'I want to file a case'], ['against', 'A case/notice is against me']]) },
      { id: 'nc_type', text: 'What kind of matter?', chapter: 'The case', why: 'Civil, criminal and consumer matters handle absence differently.', options: o([['civil', 'Property / money / civil'], ['criminal', 'Criminal (FIR, complaint, cheque)'], ['family', 'Family'], ['consumer', 'Consumer'], ['tax', 'Tax notice']]) },
      { id: 'nc_stage', text: 'What do you have right now?', chapter: 'The case', type: 'multi', why: 'Tells us the deadline.', options: o([['notice', 'A legal notice'], ['summons', 'A court summons'], ['warrant', 'A warrant'], ['caseno', 'A case number'], ['none', 'Nothing yet']]) },
      { id: 'nc_advocate', text: 'Do you have an advocate in India?', chapter: 'Your team', why: 'Needed to appear and seek exemptions.', options: o([['yes', 'Yes'], ['no', 'Not yet']]) },
      { id: 'nc_travel', text: 'Can you travel to India if the court insists?', deep: true, chapter: 'Your team', why: 'Affects what to ask the court.', options: o([['yes', 'Yes'], ['hard', 'With difficulty'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'nc_e_papers', name: 'The notice/summons/warrant and its envelope or email, with date received', fact: 'What is required and by when', why: 'Dates run from receipt.', where: 'Post at your Indian address, email.', preserve: '', when: W('nc_stage', 'notice', 'summons', 'warrant') },
      { id: 'nc_e_status', name: 'Case status printout (eCourts) with next date', fact: 'Next hearing', why: 'Avoids missing dates.', where: 'eCourts services portal or app.', preserve: '', action: true, when: W('nc_stage', 'caseno', 'summons') },
      { id: 'nc_e_vakalat', name: 'Signed vakalatnama for your advocate (executed abroad as required)', fact: 'Advocate\'s authority', why: 'Your advocate can\'t appear without it.', where: 'Advocate sends; sign as instructed, often with consular/notary attestation.', preserve: '' },
      { id: 'nc_e_poa', name: 'Specific PoA for a trusted person to manage the case (civil matters)', fact: 'Someone can act for you', why: 'Lets the case move while you\'re abroad.', where: ABROAD, preserve: '', when: W('nc_type', 'civil', 'consumer', 'family') },
      { id: 'nc_e_abroad', name: 'Proof of residence and job abroad; travel constraints', fact: 'Why you can\'t attend', why: 'Supports exemption from appearance / video evidence.', where: 'Employer letter, visa, residence permit.', preserve: '' },
      { id: 'nc_e_merits', name: 'All documents about the underlying dispute', fact: 'Your side', why: 'Your advocate needs them before the first date.', where: 'Your records.', preserve: 'Scan and share in date order.' },
      { id: 'nc_e_passport', name: 'Passport and OCI copies', fact: 'Identity', why: 'Needed for affidavits and bail papers.', where: 'Your documents.', preserve: '' }
    ],
    urgent: [
      { id: 'nc_u_warrant', level: 'now', when: W('nc_stage', 'warrant'), title: 'A warrant is serious', text: 'Ask your advocate to apply to recall the warrant before you travel. You may be stopped on arrival.', help: ['l15100'] },
      { id: 'nc_u_noadv', level: 'soon', when: ALL(W('nc_side', 'against'), W('nc_advocate', 'no')), title: 'Appoint an advocate before the date', text: 'Missing a hearing can lead to orders against you. Legal aid (15100) may help if you\'re eligible.', help: ['l15100', 'madad'] }
    ],
    lawyerQs: [{ text: 'Can I be exempted from personal appearance or give evidence by video?' }, { text: 'What powers should my PoA holder have?', when: W('nc_type', 'civil', 'consumer', 'family') }, { text: 'Is it safe for me to travel to India?', when: W('nc_type', 'criminal') }]
  });

  /* ---------------- NRI bank / tax ---------------- */
  I.push({
    id: 'nri-bank-tax', cat: 'nri', title: 'NRI bank account frozen, KYC problems or an Indian tax notice', short: 'NRI bank account or tax notice',
    synonyms: ['nri account frozen', 'nre account', 'nro account', 'account frozen after moving abroad', 'kyc nri', 'income tax notice nri', 'tax notice nri', 'residential status', 'fema account'],
    intro: 'Most NRI account freezes come from status or KYC mismatches. Tax notices usually come from data mismatches. Both are fixable with the right papers.',
    juris: 'FEMA rules require accounts held as a resident to be redesignated as NRO once you become non-resident. Indian tax notices from 1 April 2026 are issued under the Income-tax Act, 2025 (older years may still refer to the 1961 Act).',
    tips: ['Tell every Indian bank and investment platform when your residential status changes.', 'Most tax notices give a reply date; responding late can lead to orders without hearing you.'],
    questions: [
      { id: 'nb_issue', text: 'What is the problem?', type: 'multi', chapter: 'The problem', why: 'Each problem has different fixes.', options: o([['frozen', 'Account frozen / debit-blocked'], ['kyc', 'KYC update demanded'], ['convert', 'Need to convert a resident account to NRO/NRE'], ['tax', 'Income-tax notice'], ['tds', 'Too much TDS deducted']]) },
      { id: 'nb_notice_due', text: 'Does the tax notice have a reply date?', chapter: 'Deadlines', when: W('nb_issue', 'tax'), why: 'Missing it can lead to an order without your side.', options: o([['soon', 'Within 15 days'], ['later', 'Later'], ['passed', 'It has passed'], NS]) }
    ],
    evidence: [
      { id: 'nb_e_bank', name: 'Bank\'s freeze/KYC message and account statements', fact: 'What the bank wants', why: 'Shows the reason.', where: 'Email, net banking.', preserve: '', when: W('nb_issue', 'frozen', 'kyc', 'convert') },
      { id: 'nb_e_kyc', name: 'Passport, visa/residence permit, overseas address proof, PAN, photo (attested as the bank asks)', fact: 'NRI status and identity', why: 'Standard NRI KYC set.', where: 'Your documents; consulate/notary attestation if required.', preserve: '' },
      { id: 'nb_e_request', name: 'Written request to the bank to redesignate/unfreeze, with reference number', fact: 'You asked for correction', why: 'Starts the bank\'s timeline and RBI complaint route.', where: 'Bank NRI desk email.', preserve: '', action: true, when: W('nb_issue', 'frozen', 'convert', 'kyc') },
      { id: 'nb_e_notice', name: 'The tax notice and the income-tax portal "e-proceedings" page', fact: 'What the department asks', why: 'Every reply starts here.', where: 'Income-tax e-filing portal.', preserve: '', when: W('nb_issue', 'tax', 'tds') },
      { id: 'nb_e_ais', name: 'Annual Information Statement (AIS), Form 26AS and your filed returns', fact: 'What the department sees', why: 'Most notices come from mismatches.', where: 'Income-tax portal.', preserve: '', when: W('nb_issue', 'tax', 'tds') },
      { id: 'nb_e_status', name: 'Proof of days spent in India and abroad (passport stamps, travel history)', fact: 'Residential status', why: 'Decides how you are taxed.', where: 'Passport, airline records.', preserve: '', when: W('nb_issue', 'tax') },
      { id: 'nb_e_trc', name: 'Tax residency certificate from your country of residence', fact: 'Treaty benefits', why: 'Needed to claim lower tax under a tax treaty.', where: 'Your foreign tax authority.', preserve: '', when: W('nb_issue', 'tax', 'tds') }
    ],
    urgent: [{ id: 'nb_u_tax', level: 'soon', when: W('nb_notice_due', 'soon', 'passed'), title: 'Reply before the date', text: 'Ask a chartered accountant or advocate to reply or seek more time now.', help: [] }],
    lawyerQs: [{ text: 'What is my residential status for this year?', when: W('nb_issue', 'tax') }, { text: 'Can I go to the RBI Ombudsman if the bank doesn\'t unfreeze my account?', when: W('nb_issue', 'frozen') }]
  });

  /* ---------- NRI questions ---------- */
  const Q = (id, q, a, depends, law, journey, kw) => KB.questions.push({ cat: 'nri', id, q, a, depends, law, journey, kw });
  Q('nri-buy-agri', 'Can an NRI or OCI buy agricultural land in India?', 'Generally no. NRIs and OCIs can buy residential and commercial property, but not agricultural land, plantations or farmhouses. They can inherit such land and can usually sell it to a resident Indian.', ['Whether you are NRI or OCI', 'State land laws'], 'FEMA (Non-debt Instruments) Rules, 2019', 'nri-sale-repatriation', ['nri agricultural land']);
  Q('nri-repatriate', 'How much money can an NRI send abroad from India?', 'Under RBI rules, NRIs can generally repatriate up to USD 1 million per financial year from their NRO account, which can include property sale proceeds, after taxes are paid. Your bank will usually ask for a CA certificate and an online declaration.', ['Source of the money', 'Taxes paid'], 'FEMA; RBI Master Direction on remittances', 'nri-sale-repatriation', ['repatriation limit', 'usd 1 million']);
  Q('nri-tds-sale', 'How much tax is deducted when an NRI sells property?', 'The buyer must deduct tax on the whole sale value, not only the profit — for long-term gains at an effective rate of up to about 15% including surcharge and cess. You can apply for a lower or nil deduction certificate before the sale to reduce it. Section numbers changed when the Income-tax Act, 2025 took effect on 1 April 2026.', ['How long the property was held', 'Your actual gain'], 'Income-tax Act, 2025 (TDS on payments to non-residents)', 'nri-sale-repatriation', ['nri tds', 'capital gains nri']);
  Q('nri-poa-abroad', 'How do I make a power of attorney while living abroad?', 'Sign it before the Indian embassy or consulate, or before a local notary and then get it apostilled if your country is in the Hague Apostille Convention. After it reaches India it must usually be stamped within three months, and registered if it will be used to sell property.', ['Your country', 'What the PoA is for', 'Your state\'s stamp law'], 'Indian Stamp Act / state stamp laws; Registration Act; Hague Apostille Convention', 'nri-poa', ['power of attorney abroad', 'apostille']);
  Q('nri-foreign-divorce', 'Is a divorce obtained abroad valid in India?', 'Only if certain conditions are met. Indian courts generally recognise a foreign divorce if that court had proper jurisdiction, decided on grounds available under the law you married under, and both spouses had a fair chance to participate. A one-sided foreign divorce may not be recognised.', ['Where and under which law you married', 'Whether you took part in the foreign case'], 'CPC s.13; Y. Narasimha Rao v. Y. Venkata Lakshmi (1991)', 'nri-marriage', ['foreign divorce']);
  Q('nri-case-video', 'Do I have to fly to India for my court case?', 'Not always. Courts can exempt you from personal appearance at many stages, record evidence by video conference, and let a PoA holder manage civil cases. Criminal cases may still need you in person at certain stages.', ['Type of case', 'Stage of case', 'Court\'s directions'], 'CPC; BNSS; High Court video-conferencing rules', 'nri-case-abroad', ['nri court case', 'video conferencing']);

  const M2 = (s, fact, why) => KB.myths.push({ s, fact, why });
  M2('An OCI card holder can buy agricultural land in India.', false, 'OCIs, like NRIs, generally cannot buy agricultural land, but can inherit it.');
  M2('A power of attorney signed abroad can be used in India without any further steps.', false, 'It usually needs consular attestation or an apostille, and stamping in India within a set time.');
})(globalThis);
