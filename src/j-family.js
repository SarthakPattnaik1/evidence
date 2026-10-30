/* Family journeys (draft, not advocate-reviewed). */
(function (root) {
  const { W, ALL, ANY, NOT, ANS, o, NS, PN, LAWFUL } = root.ER_H;
  const I = root.ER_KB.issues;
  const SAFE_Q = (id) => ({ id, text: 'First: are you safe right now?', sensitive: true, chapter: 'Safety first', why: 'If you are in danger, getting help comes before any checklist.',
    options: o([['safe', 'Yes, I am safe'], ['threat', 'I have been threatened'], ['danger', 'I am in danger now'], PN]) });
  const DANGER = (id, q) => ({ id, level: 'now', when: W(q, 'danger'), title: 'Please get help now', text: 'If you are in danger, call 112. You do not need to finish this list.', help: ['e112', 'w181', 'l15100'] });

  /* ---------------- Domestic violence ---------------- */
  I.push({
    id: 'domestic-violence', cat: 'family', sensitive: true, title: 'Violence, abuse or threats at home', short: 'Domestic violence',
    synonyms: ['domestic violence', 'dv act', 'husband beats', 'abuse at home', 'in-laws harassment', 'thrown out of house', 'protection order', 'residence order', 'mental cruelty', 'shared household'],
    intro: 'You can stop at any time and use Quick exit. Nothing you type leaves this device.',
    juris: 'The Protection of Women from Domestic Violence Act, 2005 lets a Magistrate grant protection, residence, money, custody and compensation orders. Protection Officers and legal aid can help you file.',
    tips: ['Domestic violence includes physical, sexual, verbal, emotional and economic abuse — not only beating.', 'A woman has a right to reside in the shared household, whether or not she owns it.', 'You can approach a Protection Officer, a service provider, the police or a Magistrate directly.'],
    questions: [
      SAFE_Q('dvx_safe'),
      { id: 'dvx_who', text: 'Who is causing the harm?', type: 'multi', chapter: 'What is happening', why: 'Protection orders can be sought against a husband/partner and his relatives.',
        options: o([['husband', 'Husband or partner'], ['inlaws', 'In-laws'], ['parents', 'My parents or siblings'], ['child', 'My son or daughter'], ['other', 'Someone else in the home'], PN]) },
      { id: 'dvx_kind', text: 'What has happened?', type: 'multi', chapter: 'What is happening', sensitive: true, why: 'Each kind of abuse is recorded differently. Choose only what you are comfortable with.',
        options: o([['physical', 'Physical harm'], ['verbal', 'Insults, threats, humiliation'], ['economic', 'Money, salary or belongings taken or withheld'], ['dowry', 'Dowry demands'], ['outhouse', 'Thrown out, or stopped from entering the home'], ['sexual', 'Sexual abuse'], PN]) },
      { id: 'dvx_living', text: 'Where are you living now?', chapter: 'Home', why: 'Residence orders can protect your right to stay in the shared home.',
        options: o([['same', 'Same home as them'], ['parents', 'With my parents/relatives'], ['shelter', 'Shelter or elsewhere'], PN]) },
      { id: 'dvx_children', text: 'Are children affected?', chapter: 'Home', why: 'Temporary custody can be asked for along with protection.',
        options: o([['with_me', 'Yes, they are with me'], ['with_them', 'Yes, they are with the other side'], ['no', 'No children'], PN]) },
      { id: 'dvx_medical', text: 'Have you seen a doctor about any injuries?', deep: true, chapter: 'Records', sensitive: true, why: 'Medical records made close to the time are strong evidence.',
        options: o([['yes', 'Yes'], ['no', 'No'], PN]) },
      { id: 'dvx_reported', text: 'Have you told anyone official?', type: 'multi', deep: true, chapter: 'Records', why: 'Earlier complaints show the history.',
        options: o([['police', 'Police'], ['po', 'Protection Officer'], ['ngo', 'Women\'s helpline or NGO'], ['none', 'No one yet']]) },
      { id: 'dvx_money', text: 'Do you have your own money and documents with you?', deep: true, chapter: 'Money', why: 'You can ask the court for monetary relief and return of your belongings.',
        options: o([['yes', 'Yes'], ['partly', 'Some'], ['no', 'No, they are with the other side']]) }
    ],
    evidence: [
      { id: 'dvx_e_list', name: 'A private written record of incidents — dates, what happened, who saw it', fact: 'The pattern of abuse', why: 'Courts look at incidents over time. Notes made close to the time help.',
        where: 'Write it yourself.', preserve: 'Keep it somewhere the other side cannot access (with a trusted person or in a secure email).', action: true },
      { id: 'dvx_e_medical', name: 'Medical records, prescriptions and injury photos', fact: 'Physical harm', why: 'Independent proof of injuries.', where: 'Hospital, clinic.', preserve: 'Ask for copies; keep photos with dates.', when: ANY(W('dvx_kind', 'physical', 'sexual'), W('dvx_medical', 'yes')) },
      { id: 'dvx_e_msgs', name: 'Threatening messages, voice notes or emails', fact: 'Threats and abuse', why: 'Shows threats in their own words.', where: 'Your phone.', preserve: 'Back them up somewhere safe. Do not reply in anger.', when: W('dvx_kind', 'verbal', 'dowry', 'physical') },
      { id: 'dvx_e_complaints', name: 'Copies of earlier complaints (police, helpline, Protection Officer, Domestic Incident Report)', fact: 'History of reporting', why: 'Shows the abuse was reported.', where: 'Police station, Protection Officer.', preserve: '', holder: 'others', when: W('dvx_reported', 'police', 'po', 'ngo') },
      { id: 'dvx_e_residence', name: 'Proof you lived in the shared home (ID with address, letters, photos, ration card)', fact: 'Your right to reside', why: 'Supports a residence order.', where: 'Your documents.', preserve: '', when: W('dvx_living', 'parents', 'shelter', 'same') },
      { id: 'dvx_e_marriage', name: 'Marriage certificate or other proof of marriage/relationship', fact: 'The domestic relationship', why: 'The Act applies to relationships in a shared household.', where: 'Your records.', preserve: '' },
      { id: 'dvx_e_stridhan', name: 'List and photos of your jewellery, gifts and belongings held by them', fact: 'Your property they hold', why: 'Court can order their return.', where: 'Wedding photos, bills, memory.', preserve: '', when: W('dvx_kind', 'economic', 'outhouse', 'dowry') },
      { id: 'dvx_e_money', name: 'Your income and expenses, and their income if you know it', fact: 'What monetary relief is needed', why: 'Court can order maintenance and medical/ loss expenses.', where: 'Bank statements, bills.', preserve: LAWFUL },
      { id: 'dvx_e_children', name: 'Children\'s birth certificates, school records', fact: 'Children\'s details', why: 'Needed for a custody order.', where: 'Your records, school.', preserve: '', when: W('dvx_children', 'with_me', 'with_them') },
      { id: 'dvx_e_ids', name: 'Your ID, bank card, phone and important documents — kept with you or a trusted person', fact: 'Your safety and independence', why: 'Makes it possible to leave safely if needed.', where: '—', preserve: '', action: true, when: W('dvx_money', 'partly', 'no') }
    ],
    urgent: [
      DANGER('dvx_u_danger', 'dvx_safe'),
      { id: 'dvx_u_help', level: 'soon', when: ANY(W('dvx_safe', 'threat'), W('dvx_kind', 'physical', 'sexual')), title: 'Protection can be quick', text: 'Women Helpline 181 and legal aid (15100) can connect you to a Protection Officer and help you apply for protection orders.', help: ['w181', 'l15100'] },
      { id: 'dvx_u_child', level: 'soon', when: W('dvx_children', 'with_them'), title: 'If a child is at risk', text: 'Call Childline 1098 or 112 if a child is in danger.', help: ['c1098'] }
    ],
    lawyerQs: [
      { text: 'Which orders should I ask for — protection, residence, monetary, custody?' },
      { text: 'Should I also file a police complaint, and under which provisions?' },
      { text: 'How do I get my belongings and documents back?', when: W('dvx_kind', 'economic', 'outhouse', 'dowry') }
    ]
  });

  /* ---------------- Child custody ---------------- */
  I.push({
    id: 'child-custody', cat: 'family', sensitive: true, title: 'Child custody or visiting rights', short: 'Child custody',
    synonyms: ['custody', 'child custody', 'visitation', 'visiting rights', 'guardianship', 'not allowing me to meet child', 'took my child', 'child removed', 'shared parenting'],
    intro: 'Courts decide custody by asking one question: what is best for the child. These questions help show that.',
    juris: 'Custody is decided by family courts under the Guardians and Wards Act and the applicable personal law (e.g. Hindu Minority and Guardianship Act). The child\'s welfare is the paramount consideration.',
    tips: ['Custody of a child under five is ordinarily with the mother under Hindu law, but courts can decide otherwise for the child\'s welfare.', 'A parent without custody is usually given visiting rights unless that harms the child.', 'Older children are often asked about their own preference.'],
    questions: [
      SAFE_Q('ch_safe'),
      { id: 'ch_role', text: 'What is your situation?', chapter: 'The child', why: 'Seeking custody, seeking visits, and defending a custody claim need different records.',
        options: o([['want_custody', 'I want custody'], ['want_visits', 'I want to see my child more'], ['defend', 'The other parent is asking for custody'], ['removed', 'My child was taken away without my consent']]) },
      { id: 'ch_age', text: 'How old is the child (or the youngest child)?', chapter: 'The child', why: 'Age affects how courts weigh care and the child\'s own wishes.',
        options: o([['u5', 'Under 5'], ['5to12', '5 to 12'], ['teen', '13 or older']]) },
      { id: 'ch_now', text: 'Who does the child live with now?', chapter: 'The child', why: 'The current arrangement and how it came about matter.',
        options: o([['me', 'With me'], ['other', 'With the other parent'], ['grand', 'With grandparents or relatives'], ['shared', 'Shared']]) },
      { id: 'ch_existing', text: 'Is there any existing case or order?', chapter: 'Papers', why: 'Interim orders or divorce proceedings may already cover custody.',
        options: o([['order', 'Yes, a custody/visit order'], ['divorce', 'Divorce case pending'], ['none', 'No'], NS]) },
      { id: 'ch_concern', text: 'Is there any concern about the child\'s safety with the other parent?', sensitive: true, chapter: 'Welfare', why: 'Safety concerns change everything and need careful records.',
        options: o([['yes', 'Yes'], ['no', 'No'], PN]) },
      { id: 'ch_abroad', text: 'Is there a risk the child may be taken out of the city or country?', deep: true, chapter: 'Welfare', why: 'Courts can restrict travel and passports in urgent cases.',
        options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'ch_school', text: 'Who handles school, health and daily care?', deep: true, chapter: 'Daily life', why: 'Day-to-day involvement is central evidence.',
        options: o([['me', 'Mostly me'], ['other', 'Mostly the other parent'], ['both', 'Both'], ['others', 'Grandparents / others']]) },
      { id: 'ch_work', text: 'What is your work schedule like?', deep: true, chapter: 'Daily life', why: 'Courts consider who can actually care for the child.',
        options: o([['flex', 'Flexible / at home'], ['fixed', 'Fixed hours'], ['travel', 'Travel a lot'], PN]) }
    ],
    evidence: [
      { id: 'ch_e_birth', name: 'Child\'s birth certificate and ID', fact: 'Parentage and age', why: 'Basic proof.', where: 'Municipal records, your files.', preserve: '' },
      { id: 'ch_e_school', name: 'School records: admission form, fee receipts, report cards, PTM attendance', fact: 'Your involvement in schooling', why: 'Shows who manages education.', where: 'School, your files.', preserve: '' },
      { id: 'ch_e_medical', name: 'Child\'s medical and vaccination records', fact: 'Who looks after health', why: 'Shows care and any special needs.', where: 'Doctor, hospital.', preserve: '' },
      { id: 'ch_e_photos', name: 'Photos and messages showing daily involvement (tuitions, activities, routines)', fact: 'Your bond and role', why: 'Courts look at the relationship, not just money.', where: 'Your phone.', preserve: 'Pick a reasonable set; no need for hundreds.' },
      { id: 'ch_e_order', name: 'Existing custody or visitation orders and the case file', fact: 'What is already ordered', why: 'New requests build on existing orders.', where: 'Your advocate, court.', preserve: '', when: W('ch_existing', 'order', 'divorce') },
      { id: 'ch_e_denied', name: 'Record of visits refused or cancelled (dates, messages)', fact: 'Access was denied', why: 'Supports a visitation request or enforcement.', where: 'Your messages.', preserve: 'Keep a dated log.', when: W('ch_role', 'want_visits', 'removed') },
      { id: 'ch_e_removed', name: 'How and when the child was taken, and where they are now (messages, police report)', fact: 'Removal without consent', why: 'Urgent applications rely on these facts.', where: 'Messages, police.', preserve: '', when: W('ch_role', 'removed') },
      { id: 'ch_e_safety', name: 'Records of safety concerns (medical, school reports, complaints, messages)', fact: 'Risk to the child', why: 'Welfare concerns need proof, not just allegations.', where: 'Hospital, school, police.', preserve: 'Do not coach the child or record them secretly.', when: W('ch_concern', 'yes') },
      { id: 'ch_e_means', name: 'Your income, home and support arrangements (who helps with care)', fact: 'Your ability to care', why: 'Courts check stability, not wealth alone.', where: 'Salary slips, rent agreement.', preserve: '' },
      { id: 'ch_e_passport', name: 'Child\'s passport details and any travel plans you know of', fact: 'Travel risk', why: 'Supports a request to restrict travel.', where: 'Your records.', preserve: '', when: W('ch_abroad', 'yes') }
    ],
    urgent: [
      DANGER('ch_u_danger', 'ch_safe'),
      { id: 'ch_u_removed', level: 'soon', when: ANY(W('ch_role', 'removed'), W('ch_abroad', 'yes')), title: 'Act quickly', text: 'Courts can pass urgent interim orders. See an advocate soon.', help: ['l15100', 'c1098'] },
      { id: 'ch_u_risk', level: 'soon', when: W('ch_concern', 'yes'), title: 'If the child is in danger', text: 'Call 112 or Childline 1098 if the child is at immediate risk.', help: ['c1098', 'e112'] }
    ],
    lawyerQs: [
      { text: 'Which court and law apply, and can I ask for interim custody or visits?' },
      { text: 'How will the court consider my child\'s wishes?', when: W('ch_age', '5to12', 'teen') },
      { text: 'Can travel or passport restrictions be ordered?', when: W('ch_abroad', 'yes') }
    ]
  });

  /* ---------------- Dowry / cruelty complaint (both sides) ---------------- */
  I.push({
    id: 'dowry-cruelty', cat: 'family', sensitive: true, title: 'Dowry or cruelty case (498A) — filing one, or accused in one', short: 'Dowry or cruelty case (498A)',
    synonyms: ['498a', 'section 85 bns', 'dowry', 'dowry harassment', 'dowry case', 'false dowry case', 'cruelty case', 'in-laws case', 'husband family fir', 'crime against women cell', 'caw cell'],
    intro: 'This guide works for both sides: a woman facing cruelty or dowry demands, and family members accused in such a complaint.',
    juris: 'Cruelty by a husband or his relatives is now an offence under Section 85 of the Bharatiya Nyaya Sanhita (formerly IPC 498A). The Dowry Prohibition Act also applies. Arrest is not automatic; courts have laid down safeguards.',
    tips: ['For offences punishable up to 7 years, police generally issue a notice to appear (BNSS Section 35) instead of arresting straight away.', 'Many matrimonial complaints first go to mediation or a women\'s cell for counselling.', 'Gifts given voluntarily at marriage are different from dowry demanded as a condition.'],
    questions: [
      { id: 'dc_side', text: 'Which side are you on?', chapter: 'Your side', why: 'The two sides need different records.',
        options: o([['complainant', 'I am facing cruelty or dowry demands'], ['accused', 'I or my family have been accused']]) },
      { id: 'dc_safe', text: 'Are you safe right now?', sensitive: true, chapter: 'Your side', when: W('dc_side', 'complainant'), why: 'Safety first.',
        options: o([['safe', 'Yes'], ['threat', 'I have been threatened'], ['danger', 'I am in danger now'], PN]) },
      { id: 'dc_stage', text: 'Where does it stand?', chapter: 'Stage', why: 'Each stage has different papers and urgency.',
        options: o([['none', 'Nothing filed yet'], ['cell', 'Complaint at a women\'s cell / counselling'], ['fir', 'FIR registered'], ['notice', 'Police notice to appear received'], ['chargesheet', 'Chargesheet or court summons'], NS]) },
      { id: 'dc_what', text: 'What is alleged or what happened?', type: 'multi', chapter: 'Facts', sensitive: true, why: 'Each allegation is proved or answered with different records.',
        options: o([['dowry', 'Dowry or money demands'], ['physical', 'Physical harm'], ['mental', 'Mental cruelty, insults'], ['stridhan', 'Jewellery/stridhan kept back'], ['thrownout', 'Thrown out of the home'], PN]) },
      { id: 'dc_accused', text: 'Who is named?', type: 'multi', chapter: 'Facts', when: W('dc_side', 'accused'), why: 'Relatives living elsewhere often have separate defences.',
        options: o([['husband', 'Husband'], ['parents', 'His parents'], ['siblings', 'Siblings'], ['distant', 'Relatives who live elsewhere']]) },
      { id: 'dc_other_cases', text: 'Are there other cases between the families?', type: 'multi', deep: true, chapter: 'Other cases', why: 'Divorce, maintenance and DV cases often run in parallel.',
        options: o([['divorce', 'Divorce'], ['maintenance', 'Maintenance'], ['dv', 'Domestic violence case'], ['none', 'None']]) },
      { id: 'dc_settle', text: 'Is settlement being discussed?', deep: true, chapter: 'Way forward', why: 'Matrimonial cases can be settled and, with court permission, quashed.',
        options: o([['yes', 'Yes'], ['no', 'No'], PN]) }
    ],
    evidence: [
      { id: 'dc_e_marriage', name: 'Marriage certificate, wedding photos and invitation', fact: 'Date and fact of marriage', why: 'Basic background for either side.', where: 'Your records.', preserve: '' },
      { id: 'dc_e_demands', name: 'Messages, calls or letters showing dowry/money demands', fact: 'Demands were made', why: 'Direct proof of demands.', where: 'Your phone, family members.', preserve: 'Export full chats; back them up safely.', when: ALL(W('dc_side', 'complainant'), W('dc_what', 'dowry')) },
      { id: 'dc_e_medical', name: 'Medical records and injury photos', fact: 'Physical harm', why: 'Independent proof.', where: 'Hospital.', preserve: '', when: ALL(W('dc_side', 'complainant'), W('dc_what', 'physical')) },
      { id: 'dc_e_stridhan', name: 'List of stridhan and gifts with photos and bills', fact: 'Property that belongs to her', why: 'Supports return of stridhan.', where: 'Photos, bills, family.', preserve: '', when: W('dc_what', 'stridhan', 'dowry') },
      { id: 'dc_e_witness', name: 'Names of people who saw incidents or heard demands', fact: 'Corroboration', why: 'Supports the account.', where: 'Your memory.', preserve: 'Names only — no prepared statements.' },
      { id: 'dc_e_fir', name: 'FIR copy, complaint and any police notice', fact: 'What is alleged and against whom', why: 'Everything turns on the exact allegations.', where: 'Police station (FIR copy is free), online police portal.', preserve: '', holder: 'others', when: W('dc_stage', 'fir', 'notice', 'chargesheet') },
      { id: 'dc_e_residence', name: 'Proof of where each accused relative lives and works (rent, utility bills, employer letters)', fact: 'They lived separately', why: 'Courts look closely at general allegations against distant relatives.', where: 'Their documents.', preserve: '', when: ALL(W('dc_side', 'accused'), W('dc_accused', 'distant', 'siblings')) },
      { id: 'dc_e_timeline', name: 'Timeline of the marriage, with dates when she lived where', fact: 'Sequence of events', why: 'Allegations are tested against dates.', where: 'Write it out.', preserve: '', action: true },
      { id: 'dc_e_comms', name: 'Complete chats between spouses and families over the period', fact: 'The relationship as it was', why: 'Shows context on both sides.', where: 'Your own phone.', preserve: LAWFUL },
      { id: 'dc_e_cases', name: 'Papers in the other cases (divorce, maintenance, DV)', fact: 'Connected proceedings', why: 'Statements in one case are compared in others.', where: 'Your advocate.', preserve: '', when: W('dc_other_cases', 'divorce', 'maintenance', 'dv') },
      { id: 'dc_e_settlement', name: 'Any written settlement terms', fact: 'Agreed terms', why: 'Needed for quashing on settlement.', where: '—', preserve: 'Do not sign without advice.', when: W('dc_settle', 'yes') }
    ],
    urgent: [
      DANGER('dc_u_danger', 'dc_safe'),
      { id: 'dc_u_notice', level: 'now', when: ALL(W('dc_side', 'accused'), W('dc_stage', 'fir', 'notice', 'chargesheet')), title: 'Speak to an advocate before going to the police',
        text: 'If an FIR is registered or you received a notice, get advice now about appearing, anticipatory bail and what to carry. Free legal aid: 15100.', help: ['l15100'] },
      { id: 'dc_u_help', level: 'soon', when: ALL(W('dc_side', 'complainant'), W('dc_what', 'physical')), title: 'Support is available', text: 'Women Helpline 181 and legal aid can help you with a complaint and protection.', help: ['w181', 'l15100'] }
    ],
    lawyerQs: [
      { text: 'Should I file a police complaint, a DV case, or both?', when: W('dc_side', 'complainant') },
      { text: 'Do I need anticipatory bail, and how do I respond to the police notice?', when: W('dc_side', 'accused') },
      { text: 'Can the case be quashed if we settle?', when: W('dc_settle', 'yes') }
    ]
  });

  /* ---------------- Inheritance / partition ---------------- */
  I.push({
    id: 'inheritance-partition', cat: 'family', title: 'Family property — inheritance, partition, will or daughters\' share', short: 'Family property & inheritance',
    synonyms: ['inheritance', 'ancestral property', 'partition', 'property share', 'daughter share', 'daughter right in father property', 'will', 'will dispute', 'succession certificate', 'legal heir certificate', 'mutation', 'brother not giving share', 'family settlement', 'probate'],
    intro: 'Property cases are won on paper. We\'ll work out how the property came to the family and which papers prove each share.',
    juris: 'Shares depend on the personal law (Hindu Succession Act, Muslim personal law, Indian Succession Act), whether the property was ancestral or self-acquired, and whether there is a will. Since 2005, Hindu daughters are coparceners by birth.',
    tips: ['Mutation in revenue records helps collect tax and records possession; it does not by itself decide ownership.', 'A succession certificate is used mainly for debts and securities like bank deposits and shares; a legal heir certificate is issued by the state for other purposes.', 'A family settlement or a relinquishment of share usually needs proper stamping and registration to be valid for immovable property.'],
    questions: [
      { id: 'ip_death', text: 'Whose property is it?', chapter: 'The property', why: 'Inheritance opens when the owner dies; partition can happen while family members are alive.',
        options: o([['deceased', 'A family member who has died'], ['living', 'A living parent or joint family'], NS]) },
      { id: 'ip_will', text: 'Did they leave a will?', chapter: 'The property', when: W('ip_death', 'deceased'), why: 'A will changes who inherits.',
        options: o([['yes', 'Yes'], ['disputed', 'There is a will but I doubt it'], ['no', 'No will'], NS]) },
      { id: 'ip_law', text: 'Which law applies to the family?', chapter: 'The property', sensitive: true, why: 'Shares are calculated differently under each personal law. Choose "prefer not" if you wish.',
        options: o([['hindu', 'Hindu, Sikh, Jain or Buddhist'], ['muslim', 'Muslim'], ['christian', 'Christian / Parsi / other'], PN]) },
      { id: 'ip_kind', text: 'What kind of property is involved?', type: 'multi', chapter: 'The property', why: 'Each asset has its own records and process.',
        options: o([['land', 'Agricultural land'], ['house', 'House / flat / plot'], ['bank', 'Bank deposits, shares, insurance'], ['business', 'Family business'], ['gold', 'Gold, jewellery, cash']]) },
      { id: 'ip_origin', text: 'How did the family get the main property?', chapter: 'History', why: 'Ancestral and self-acquired property are shared very differently.',
        options: o([['ancestral', 'Inherited through generations'], ['self', 'Bought by the person who died'], ['mixed', 'Both'], NS]) },
      { id: 'ip_problem', text: 'What is the dispute?', type: 'multi', chapter: 'The dispute', why: 'Each dispute needs different proof.',
        options: o([['share', 'I am being denied my share'], ['sold', 'Someone sold or is selling it without my consent'], ['mutation', 'Records were changed to exclude me'], ['bank', 'Bank/insurer won\'t release money'], ['possession', 'Someone is occupying it'], ['nominee', 'Nominee is claiming everything']]) },
      { id: 'ip_me', text: 'What is your relationship to the person whose property it is?', chapter: 'History', why: 'Your class of heir decides your share.',
        options: o([['child', 'Son or daughter'], ['spouse', 'Spouse'], ['parent', 'Parent'], ['grandchild', 'Grandchild'], ['sibling', 'Sibling or other relative']]) },
      { id: 'ip_released', text: 'Did you ever sign any release, relinquishment or family settlement?', deep: true, chapter: 'Papers', why: 'Signed releases can end a claim — or be challenged.',
        options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'ip_case', text: 'Is any case already filed?', deep: true, chapter: 'Papers', why: 'Pending cases may already have orders.',
        options: o([['yes', 'Yes'], ['no', 'No'], NS]) }
    ],
    evidence: [
      { id: 'ip_e_death', name: 'Death certificate', fact: 'Inheritance has opened', why: 'Required for every inheritance step.', where: 'Municipal / panchayat registrar.', preserve: '', when: W('ip_death', 'deceased') },
      { id: 'ip_e_tree', name: 'Family tree with all legal heirs (names, ages, alive or not)', fact: 'Who inherits', why: 'Every claim starts with the list of heirs.', where: 'Write it; legal heir certificate if available.', preserve: '', action: true },
      { id: 'ip_e_will', name: 'The will (original or copy), and any probate or registration details', fact: 'What the will says', why: 'A will can be challenged on capacity, signatures or suspicious circumstances.',
        where: 'Family, sub-registrar if registered.', preserve: '', when: W('ip_will', 'yes', 'disputed') },
      { id: 'ip_e_willdoubt', name: 'Records about the testator\'s health and situation when the will was signed', fact: 'Whether the will is genuine', why: 'Supports or answers a challenge.', where: 'Medical records, witnesses.', preserve: '', when: W('ip_will', 'disputed') },
      { id: 'ip_e_title', name: 'Title deeds: sale deed, gift deed, partition deed, old family documents', fact: 'How the property came to the family', why: 'Shows ancestral or self-acquired character.', where: 'Family records; certified copies from the sub-registrar.', preserve: '', when: W('ip_kind', 'land', 'house') },
      { id: 'ip_e_revenue', name: 'Land records: record of rights, khata/khatian, 7/12, jamabandi, mutation entries', fact: 'Recorded possession and changes', why: 'Shows who is recorded and any changes made.', where: 'State land-records portal; tehsil office.', preserve: 'Get certified copies.', when: W('ip_kind', 'land', 'house') },
      { id: 'ip_e_ec', name: 'Encumbrance certificate (to see if it was sold or mortgaged)', fact: 'Transactions on the property', why: 'Reveals sales or loans behind your back.', where: 'Sub-registrar office / state portal.', preserve: '', when: W('ip_problem', 'sold', 'mutation') },
      { id: 'ip_e_tax', name: 'Property tax and electricity bills', fact: 'Possession and use', why: 'Supports possession and ownership claims.', where: 'Municipality, utility.', preserve: '', when: W('ip_kind', 'house') },
      { id: 'ip_e_bank', name: 'Passbooks, policy and share details, nominee details, and the institution\'s reply', fact: 'Assets held by banks/insurers', why: 'A nominee generally holds money for the legal heirs.', where: 'Bank, insurer, demat statements.', preserve: '', holder: 'others', when: ANY(W('ip_kind', 'bank'), W('ip_problem', 'bank', 'nominee')) },
      { id: 'ip_e_release', name: 'Any release deed or family settlement you signed', fact: 'Whether you gave up a share', why: 'Central to whether a claim survives.', where: 'Your records, sub-registrar.', preserve: '', when: W('ip_released', 'yes', 'unsure') },
      { id: 'ip_e_relation', name: 'Proof of your relationship (birth certificate, school records, ID with parent\'s name)', fact: 'You are an heir', why: 'Required to claim.', where: 'Your records.', preserve: '' },
      { id: 'ip_e_case', name: 'Papers and orders in any pending case', fact: 'What is already decided', why: 'Avoids duplicate cases.', where: 'Your advocate, court.', preserve: '', when: W('ip_case', 'yes') }
    ],
    urgent: [
      { id: 'ip_u_sale', level: 'soon', when: W('ip_problem', 'sold'), title: 'A sale may be happening', text: 'Courts can pass an injunction to stop a sale. See an advocate soon.', help: ['l15100'] }
    ],
    lawyerQs: [
      { text: 'Is the property ancestral or self-acquired, and what is my share?' },
      { text: 'Can the will be challenged?', when: W('ip_will', 'disputed') },
      { text: 'Do I need a partition suit, a succession certificate, or a legal heir certificate?' },
      { text: 'Can we stop the sale or undo the mutation?', when: W('ip_problem', 'sold', 'mutation') }
    ]
  });
})(globalThis);
