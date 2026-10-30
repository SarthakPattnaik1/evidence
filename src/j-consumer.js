/* Consumer journeys (draft, not advocate-reviewed). */
(function (root) {
  const { W, ALL, ANY, NOT, ANS, o, NS, PN, LAWFUL } = root.ER_H;
  const I = root.ER_KB.issues;

  /* ---------------- Defective product / warranty ---------------- */
  I.push({
    id: 'defective-product', cat: 'shopping', title: 'Defective product or warranty refused', short: 'Defective product / warranty',
    synonyms: ['defective', 'faulty', 'warranty', 'warranty claim rejected', 'service centre', 'replacement', 'phone not working', 'ac not working', 'fridge', 'washing machine', 'tv', 'car defect', 'bike defect', 'manufacturing defect', 'repair failed'],
    intro: 'Defect cases are about three things: what you bought, what went wrong, and what the seller or service centre did about it.',
    juris: 'The Consumer Protection Act, 2019 covers defective goods and deficient service, including product liability of manufacturers and sellers. Complaints generally must be filed within two years.',
    tips: ['Keep the defective product and its packaging. It may need to be examined.', 'Repeated repair visits for the same fault are strong evidence of a manufacturing defect.', 'District Consumer Commissions hear cases where the price paid is up to ₹50 lakh.'],
    questions: [
      { id: 'dp_item', text: 'What is the product?', chapter: 'The product', why: 'Vehicles, electronics and appliances have different service records.',
        options: o([['phone', 'Phone, laptop or electronics'], ['appliance', 'Appliance (AC, fridge, washing machine, TV)'], ['vehicle', 'Car or two-wheeler'], ['furniture', 'Furniture or other goods'], ['other', 'Something else']]) },
      { id: 'dp_where', text: 'Where did you buy it?', chapter: 'The product', why: 'Online platforms and dealers each keep records you can download or request.',
        options: o([['online', 'Online marketplace'], ['brand', 'Brand website or store'], ['dealer', 'Local dealer / shop']]) },
      { id: 'dp_when', text: 'When did the problem start?', chapter: 'The defect', why: 'Defects on arrival, within warranty and after warranty are treated differently.',
        options: o([['arrival', 'On arrival or first use'], ['warranty', 'Within the warranty period'], ['after', 'After the warranty ended'], NS]) },
      { id: 'dp_repairs', text: 'How many times has it been to the service centre for this problem?', chapter: 'The defect', why: 'Repeated failures suggest a manufacturing defect.',
        options: o([['zero', 'Not yet'], ['once', 'Once'], ['many', 'Two or more times']]) },
      { id: 'dp_refusal', text: 'What did the seller or brand say?', chapter: 'Their response', type: 'multi', why: 'The refusal reason decides what you must answer.',
        options: o([['physical', '"Physical/liquid damage", not covered'], ['outofwarranty', '"Out of warranty"'], ['charges', 'Asked me to pay for repair'], ['noreply', 'No response'], ['replace_refused', 'Refused replacement or refund']]) },
      { id: 'dp_safety', text: 'Did the defect cause any injury or damage to other property?', chapter: 'Their response', why: 'Harm caused by a defective product can lead to a product liability claim.',
        options: o([['yes', 'Yes'], ['no', 'No']]) },
      { id: 'dp_extended', text: 'Did you buy an extended warranty or protection plan?', deep: true, chapter: 'Extra cover', why: 'Extended plans have their own terms and claim process.',
        options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'dp_complaint', text: 'Have you complained in writing to the brand or the National Consumer Helpline?', deep: true, chapter: 'Complaints', why: 'A written complaint and docket number show you tried to resolve it.',
        options: o([['brand', 'To the brand/seller'], ['nch', 'To the National Consumer Helpline'], ['both', 'Both'], ['no', 'Not yet']]) }
    ],
    evidence: [
      { id: 'dp_e_invoice', name: 'Tax invoice / bill', fact: 'Purchase, date, price, seller', why: 'Required for any claim.', where: 'Order history, email, shop.', preserve: 'Download the invoice PDF; keep the paper bill.' },
      { id: 'dp_e_warranty', name: 'Warranty card and warranty terms', fact: 'What is covered and until when', why: 'Decides whether the repair is free.', where: 'Box, brand website.', preserve: '' },
      { id: 'dp_e_ext', name: 'Extended warranty / protection plan certificate and terms', fact: 'Extra cover purchased', why: 'Has its own claim rules.', where: 'Email, seller.', preserve: '', when: W('dp_extended', 'yes', 'unsure') },
      { id: 'dp_e_defect', name: 'Photos and videos showing the defect (and unboxing video if any)', fact: 'The defect', why: 'Direct evidence.', where: 'Your phone.', preserve: 'Keep original files with dates.' },
      { id: 'dp_e_jobsheets', name: 'All service job sheets, repair reports and replaced-parts records', fact: 'Repeated failures', why: 'The strongest proof of a persistent defect.', where: 'Service centre (ask for copies each visit).', preserve: '', when: W('dp_repairs', 'once', 'many') },
      { id: 'dp_e_rejection', name: 'Written rejection or estimate from the service centre', fact: 'Their reason for refusing', why: 'You need to answer their stated reason.', where: 'Email, SMS, job sheet.', preserve: '', when: W('dp_refusal', 'physical', 'outofwarranty', 'charges', 'replace_refused') },
      { id: 'dp_e_expert', name: 'An independent technician\'s written opinion (optional)', fact: 'Nature of the defect', why: 'Can counter a "physical damage" claim.', where: 'Independent repair shop.', preserve: '', when: W('dp_refusal', 'physical') },
      { id: 'dp_e_product', name: 'The product itself and its packaging', fact: 'The defective item', why: 'May need to be examined by an expert.', where: 'Keep at home.', preserve: 'Do not sell, throw away, or get it repaired by outsiders without advice.' },
      { id: 'dp_e_harm', name: 'Photos, bills and medical records of the harm caused', fact: 'Damage caused by the product', why: 'Supports compensation.', where: 'Hospital, repair bills.', preserve: '', when: W('dp_safety', 'yes') },
      { id: 'dp_e_complaints', name: 'Complaint emails, ticket numbers, NCH docket number', fact: 'You tried to resolve it', why: 'Shows the dispute history.', where: 'Email, NCH portal.', preserve: '', when: W('dp_complaint', 'brand', 'nch', 'both') }
    ],
    urgent: [],
    lawyerQs: [{ text: 'Is this a manufacturing defect, and should I seek replacement, refund or compensation?' }, { text: 'Which consumer commission should I file in, and against whom — seller, brand, or both?' }, { text: 'Can I claim for the injury or damage caused?', when: W('dp_safety', 'yes') }]
  });

  /* ---------------- Insurance claim rejected ---------------- */
  I.push({
    id: 'insurance-claim', cat: 'shopping', title: 'Insurance claim rejected, delayed or underpaid', short: 'Insurance claim rejected',
    synonyms: ['insurance claim rejected', 'claim rejected', 'claim repudiated', 'mediclaim', 'health insurance', 'cashless denied', 'motor insurance claim', 'life insurance claim', 'term insurance claim', 'pre-existing disease', 'non disclosure', 'claim delayed', 'partial claim'],
    intro: 'Insurance disputes turn on the policy wording and the exact reason for rejection. Let\'s get both.',
    juris: 'Complain first to the insurer\'s grievance officer. If not resolved, you can approach the Insurance Ombudsman (free) or a consumer commission. IRDAI rules set timelines for claim decisions.',
    tips: ['IRDAI requires insurers to decide cashless requests quickly — within an hour for authorisation and three hours for discharge.', 'Insurers must give the specific reason for rejecting a claim in writing.', 'After a long period of continuous health cover, insurers generally cannot reject claims for non-disclosure except for fraud — ask your advocate how this applies.'],
    questions: [
      { id: 'in_type', text: 'What kind of insurance?', chapter: 'The policy', why: 'Health, motor and life policies need different papers.',
        options: o([['health', 'Health / mediclaim'], ['motor', 'Vehicle'], ['life', 'Life / term'], ['other', 'Travel, home or other']]) },
      { id: 'in_status', text: 'What happened to the claim?', chapter: 'The claim', why: 'Rejection, partial payment and delay are handled differently.',
        options: o([['rejected', 'Fully rejected'], ['partial', 'Paid only partly'], ['delayed', 'No decision for a long time'], ['cashless', 'Cashless denied at hospital']]) },
      { id: 'in_reason', text: 'What reason did they give?', chapter: 'The claim', type: 'multi', why: 'You must answer the specific reason.',
        options: o([['ped', 'Pre-existing disease / non-disclosure'], ['waiting', 'Waiting period'], ['exclusion', 'Not covered / exclusion'], ['docs', 'Documents missing'], ['late', 'Claim made late'], ['licence', 'Driving licence / permit issue'], ['reasonable', '"Not reasonable and customary" charges'], ['none', 'No reason given']]) },
      { id: 'in_grievance', text: 'Have you complained to the insurer\'s grievance cell in writing?', chapter: 'Complaints', why: 'Needed before the Ombudsman.',
        options: o([['yes', 'Yes'], ['no', 'No']]) },
      { id: 'in_reply_days', text: 'Did they reply within 30 days?', chapter: 'Complaints', when: W('in_grievance', 'yes'), why: 'No reply in 30 days, or a rejection, opens the Ombudsman route.',
        options: o([['rejected', 'Yes, rejected again'], ['noreply', 'No reply in 30 days'], ['waiting', 'Not yet 30 days']]) },
      { id: 'in_years', text: 'How long have you held the policy continuously (including renewals/portability)?', deep: true, chapter: 'Policy history', when: W('in_type', 'health'),
        why: 'Long continuous cover limits the insurer\'s ability to reject for non-disclosure.', options: o([['u2', 'Under 2 years'], ['2to5', '2–5 years'], ['over5', 'More than 5 years']]) },
      { id: 'in_agent', text: 'Did an agent or bank fill the proposal form for you?', deep: true, chapter: 'Policy history', why: 'Mistakes by the agent in the form are a common dispute.',
        options: o([['yes', 'Yes'], ['no', 'No, I filled it'], NS]) }
    ],
    evidence: [
      { id: 'in_e_policy', name: 'Policy document with schedule, terms and all renewal certificates', fact: 'What is covered', why: 'The wording decides most disputes.', where: 'Insurer portal, email.', preserve: '' },
      { id: 'in_e_proposal', name: 'Proposal form (application) — ask the insurer for a copy', fact: 'What was disclosed', why: 'Central to non-disclosure rejections.', where: 'Insurer (request in writing).', preserve: '', holder: 'others', when: ANY(W('in_reason', 'ped'), W('in_agent', 'yes')) },
      { id: 'in_e_rejection', name: 'Rejection / settlement letter with reasons', fact: 'The insurer\'s stated reason', why: 'What you must answer.', where: 'Email, letter.', preserve: '', when: W('in_status', 'rejected', 'partial', 'cashless') },
      { id: 'in_e_claimform', name: 'Claim form and acknowledgement with date', fact: 'When and what you claimed', why: 'Answers "late claim" objections.', where: 'Your records.', preserve: '' },
      { id: 'in_e_hospital', name: 'Discharge summary, hospital bills, prescriptions, test reports', fact: 'Treatment and cost', why: 'Supports the claim amount.', where: 'Hospital.', preserve: 'Get certified copies.', when: W('in_type', 'health') },
      { id: 'in_e_history', name: 'Doctor\'s certificate on when the illness began', fact: 'Whether it was pre-existing', why: 'Answers pre-existing disease objections.', where: 'Treating doctor.', preserve: '', when: W('in_reason', 'ped', 'waiting') },
      { id: 'in_e_motor', name: 'FIR/accident report, survey report, repair estimate and invoices, photos', fact: 'Accident and loss', why: 'Supports a motor claim.', where: 'Police, garage, surveyor.', preserve: '', when: W('in_type', 'motor') },
      { id: 'in_e_dl', name: 'Driving licence, RC and permit valid on the accident date', fact: 'Policy conditions were met', why: 'Answers licence objections.', where: 'Your records; Parivahan.', preserve: '', when: ANY(W('in_type', 'motor'), W('in_reason', 'licence')) },
      { id: 'in_e_life', name: 'Death certificate, medical records of last illness, nominee ID', fact: 'Death and the nominee\'s claim', why: 'Needed for life claims.', where: 'Hospital, registrar.', preserve: '', when: W('in_type', 'life') },
      { id: 'in_e_grievance', name: 'Grievance complaint and insurer\'s reply', fact: 'Insurer had its chance', why: 'Needed for Ombudsman.', where: 'Email; Bima Bharosa portal.', preserve: '', when: W('in_grievance', 'yes') },
      { id: 'in_e_raise', name: 'File a written grievance with the insurer and keep the reference', fact: 'Grievance raised', why: 'First step before Ombudsman.', where: 'Insurer grievance email or Bima Bharosa portal.', preserve: '', action: true, when: W('in_grievance', 'no') },
      { id: 'in_e_renewals', name: 'Renewal and portability records showing continuous cover', fact: 'Length of continuous cover', why: 'Limits non-disclosure rejections after long cover.', where: 'Insurer emails.', preserve: '', when: W('in_years', '2to5', 'over5') }
    ],
    urgent: [
      { id: 'in_u_cashless', level: 'soon', when: W('in_status', 'cashless'), title: 'Treatment comes first', text: 'If cashless is denied, ask the hospital for a written denial, pay if you must and claim reimbursement. Do not delay treatment.', help: ['ins'] }
    ],
    lawyerQs: [{ text: 'Is the rejection reason valid under the policy wording and IRDAI rules?' }, { text: 'Should I go to the Insurance Ombudsman or a consumer commission?', when: W('in_reply_days', 'rejected', 'noreply') }, { text: 'Can the insurer reject for non-disclosure after this many years?', when: W('in_years', '2to5', 'over5') }]
  });

  /* ---------------- Builder delay ---------------- */
  I.push({
    id: 'builder-delay', cat: 'shopping', title: 'Builder delayed my flat or isn\'t delivering what was promised', short: 'Builder delay (flat / plot)',
    synonyms: ['builder delay', 'flat possession delay', 'possession not given', 'rera complaint', 'rera', 'builder fraud', 'refund from builder', 'construction delay', 'oc not received', 'occupancy certificate', 'carpet area less', 'builder buyer agreement'],
    intro: 'Homebuyer cases rest on the agreement, the payments and the promised date. Let\'s gather those first.',
    juris: 'Homebuyers can approach the state RERA authority (Real Estate (Regulation and Development) Act, 2016) and/or a consumer commission. RERA allows a refund with interest, or interest for every month of delay.',
    tips: ['Every registered project has a RERA registration number and a declared completion date on the state RERA website.', 'You generally choose between a refund with interest and staying in the project with delay interest.', 'Consumer commissions decide jurisdiction by the price paid: up to ₹50 lakh district, ₹50 lakh–₹2 crore state, above ₹2 crore national.'],
    questions: [
      { id: 'bd_stage', text: 'Where do things stand?', chapter: 'The project', why: 'Delay, poor quality and cancellation need different records.',
        options: o([['delayed', 'Possession date has passed'], ['offered', 'Possession offered, but incomplete or with demands'], ['defects', 'Got possession, but defects / less area'], ['cancel', 'I want to cancel and get a refund'], ['stalled', 'Project stalled / builder insolvent']]) },
      { id: 'bd_rera', text: 'Is the project registered with RERA?', chapter: 'The project', why: 'Registration decides whether the RERA route is available.',
        options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'bd_paid', text: 'How much have you paid?', chapter: 'Money', why: 'Decides forum and is the basis of any refund.',
        options: o([['u50', 'Up to ₹50 lakh'], ['50to2', '₹50 lakh to ₹2 crore'], ['over2', 'More than ₹2 crore']]) },
      { id: 'bd_loan', text: 'Is there a home loan or subvention scheme?', chapter: 'Money', why: 'The bank becomes part of the picture, especially if the builder promised to pay interest.',
        options: o([['loan', 'Home loan'], ['subvention', 'Subvention (builder pays EMIs till possession)'], ['no', 'No loan']]) },
      { id: 'bd_demands', text: 'Has the builder raised new demands?', deep: true, chapter: 'Money', type: 'multi', why: 'Escalation, parking or maintenance charges are often disputed.',
        options: o([['escalation', 'Cost escalation'], ['area', 'Increased area charges'], ['maintenance', 'Advance maintenance'], ['none', 'None']]) },
      { id: 'bd_oc', text: 'Has the builder got the occupancy/completion certificate?', deep: true, chapter: 'Possession', when: W('bd_stage', 'offered', 'defects'),
        why: 'Possession without an OC can be refused in many cases.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'bd_group', text: 'Are other buyers in the project also affected?', deep: true, chapter: 'Others', why: 'Buyers can file together, which saves cost.',
        options: o([['yes', 'Yes'], ['no', 'No'], NS]) }
    ],
    evidence: [
      { id: 'bd_e_bba', name: 'Builder-buyer agreement / agreement for sale (all pages)', fact: 'Promised date, area and terms', why: 'The core document.', where: 'Your records; sub-registrar if registered.', preserve: '' },
      { id: 'bd_e_allot', name: 'Booking form and allotment letter', fact: 'When you booked and the promises made', why: 'Delay can be counted from early documents in some cases.', where: 'Your records.', preserve: '' },
      { id: 'bd_e_payments', name: 'All payment receipts and the builder\'s demand letters', fact: 'What you paid and when', why: 'Basis of refund or interest.', where: 'Bank statements, builder receipts.', preserve: 'Make a table of every payment.' },
      { id: 'bd_e_brochure', name: 'Brochure, advertisements and promised amenities', fact: 'What was promised', why: 'Shows misrepresentation.', where: 'Your files, old emails, project website archives.', preserve: '' },
      { id: 'bd_e_reraprint', name: 'RERA project page printout (registration, completion date, progress updates)', fact: 'Official project status', why: 'Builder\'s own declarations to RERA.', where: 'State RERA website.', preserve: 'Print with date.', when: W('bd_rera', 'yes', 'unsure') },
      { id: 'bd_e_loan', name: 'Home loan sanction, tripartite agreement and EMI statements', fact: 'Loan and subvention terms', why: 'Needed if the builder stopped paying EMIs.', where: 'Bank.', preserve: '', when: W('bd_loan', 'loan', 'subvention') },
      { id: 'bd_e_corr', name: 'Emails and letters with the builder about delays', fact: 'Delays and excuses given', why: 'Shows the history.', where: 'Your email.', preserve: '' },
      { id: 'bd_e_possession', name: 'Possession offer letter and the demands attached', fact: 'Terms of possession', why: 'Shows any unfair conditions.', where: 'Builder.', preserve: '', when: W('bd_stage', 'offered', 'defects') },
      { id: 'bd_e_defects', name: 'Photos/videos of defects and an architect or engineer\'s report', fact: 'Quality and area problems', why: 'Supports claims for repair or compensation.', where: 'Independent engineer.', preserve: '', when: W('bd_stage', 'defects') },
      { id: 'bd_e_ibc', name: 'Insolvency/IRP public notice and your claim form', fact: 'Insolvency claims', why: 'Homebuyers must file claims with the resolution professional.', where: 'IBBI website, newspapers.', preserve: '', time: 'Claims have a filing deadline in the public notice.', when: W('bd_stage', 'stalled') }
    ],
    urgent: [
      { id: 'bd_u_ibc', level: 'soon', when: W('bd_stage', 'stalled'), title: 'Check for insolvency proceedings', text: 'If the builder is under insolvency, claims must be filed by the date in the public notice. See an advocate soon.', help: ['l15100'] }
    ],
    lawyerQs: [{ text: 'RERA or consumer commission — which is better here, and can I approach both?' }, { text: 'How much interest or compensation can I claim for the delay?' }, { text: 'Can I refuse possession without an occupancy certificate?', when: W('bd_oc', 'no', 'unsure') }]
  });
})(globalThis);
