/* Saboot knowledge base — Phase 1 (English).
   Status: authored content, reviewed by an advocate.
   Stable IDs only: conditions reference question/option IDs, never display text. */
(function (root) {
  const W = (q, ...v) => ({ q, in: v });            // answer to q is one of v (multi: any overlap)
  const ALL = (...c) => ({ all: c });
  const ANY = (...c) => ({ any: c });
  const NOT = (c) => ({ not: c });
  const ANS = (q) => ({ q, answered: true });
  const o = (pairs) => pairs.map(([id, label]) => ({ id, label }));
  const NS = ['unsure', "I'm not sure"];
  const PN = ['prefer_not', 'Prefer not to say'];

  const KB_VERSION = '2.0.0-draft';
  const REVIEWED = { status: 'reviewed', label: '', date: null };

  /* ---------- Official help directory ---------- */
  const HELP = {
    e112: { label: '112', name: 'Emergency Response (police, fire, ambulance)', detail: 'Call 112 if anyone is in immediate danger.', href: null },
    w181: { label: '181', name: 'Women Helpline', detail: 'Support for women facing violence or threats.', href: null },
    c1098: { label: '1098', name: 'Childline', detail: 'For a child at risk or in need of care.', href: null },
    s14567: { label: '14567', name: 'Elderline (senior citizens)', detail: 'National helpline for older persons.', href: null },
    cy1930: { label: '1930', name: 'National Cyber Crime Helpline', detail: 'Report financial cyber fraud quickly. Online: cybercrime.gov.in', href: 'https://cybercrime.gov.in' },
    l15100: { label: '15100', name: 'NALSA free legal aid helpline', detail: 'Free legal advice and a panel advocate if you are eligible.', href: 'https://nalsa.gov.in' },
    rbi: { label: 'RBI CMS', name: 'RBI Complaint Management System', detail: 'For bank complaints not resolved by the bank (usually after 30 days or an unsatisfactory reply).', href: 'https://cms.rbi.org.in' },
    nch: { label: '1915', name: 'National Consumer Helpline', detail: 'Pre-litigation help for consumer complaints. Online: consumerhelpline.gov.in', href: 'https://consumerhelpline.gov.in' },
    ejag: { label: 'e-Jagriti', name: 'Consumer Commission e-filing', detail: 'Official portal for filing consumer complaints (replaced e-Daakhil from 1 Jan 2025).', href: 'https://e-jagriti.gov.in' },
    ins: { label: 'Bima Bharosa', name: 'IRDAI insurance grievance portal', detail: 'Complain about an insurer after its own grievance cell; then the Insurance Ombudsman.', href: 'https://bimabharosa.irdai.gov.in' },
    cio: { label: 'Ombudsman', name: 'Insurance Ombudsman (Council for Insurance Ombudsmen)', detail: 'Free route for many claim rejections after the insurer replies or 30 days pass.', href: 'https://www.cioins.co.in' },
    rera: { label: 'RERA', name: 'Your state Real Estate Regulatory Authority', detail: 'Complaints against registered real-estate projects and builders. Each state has its own portal.', href: null },
    posh: { label: 'SHe-Box', name: 'SHe-Box (sexual harassment at work)', detail: 'Government portal to register workplace sexual-harassment complaints.', href: 'https://shebox.wcd.gov.in' },
    ccpd: { label: 'CCPD', name: 'Chief Commissioner for Persons with Disabilities', detail: 'Free complaint if you are denied a right because of disability — by post, email (ccpd@nic.in) or online. No lawyer needed. Complaints about a state government office go to your State Commissioner.', href: 'https://ccpd.nic.in' },
    udid: { label: 'UDID', name: 'UDID card and disability certificate', detail: 'Apply online for the Unique Disability ID card that proves your disability everywhere in India.', href: 'https://www.swavlambancard.gov.in' },
    samadhan: { label: 'SAMADHAN', name: 'Labour dispute portal (Ministry of Labour)', detail: 'Online filing of certain workplace disputes.', href: 'https://samadhan.labour.gov.in' }
  };

  const CATEGORIES = [
    { id: 'money', title: 'Money & banking', blurb: 'Cheques, loans, cards, UPI fraud, frozen accounts', icon: 'bank' },
    { id: 'family', title: 'Family', blurb: 'Divorce, maintenance, custody, violence at home, inheritance', icon: 'family' },
    { id: 'shopping', title: 'Shopping & services', blurb: 'Refunds, defective goods, insurance, builders', icon: 'bag' },
    { id: 'home', title: 'Home & land', blurb: 'Rent, deposits, eviction, encroachment', icon: 'house' },
    { id: 'police', title: 'Police & notices', blurb: 'FIR, arrest, summons, legal notices', icon: 'shield' },
    { id: 'work', title: 'Work', blurb: 'Salary, termination, harassment at work', icon: 'user' },
    { id: 'accidents', title: 'Accidents', blurb: 'Road accidents and injury claims', icon: 'umbrella' },
    { id: 'other', title: 'Online & other', blurb: 'Online harassment, money lent, anything else', icon: 'more' }
  ];


  /* ---------- Shared lawful-collection rules ---------- */
  const LAWFUL = 'Only collect records you are lawfully entitled to. Do not access another person\'s phone, email or accounts without permission.';

  /* =====================================================================
     JOURNEYS
     q fields: id, text, why, type ('single'|'multi'), options, when, deep, chapter, sensitive
     e fields: id, name, fact, why, where, preserve, limit, time, when, holder ('me'|'others')
     ===================================================================== */
  const ISSUES = [];

  /* ---------------- 1. Bank account frozen ---------------- */
  ISSUES.push({
    id: 'bank-account-frozen', cat: 'money', title: 'My bank account has been frozen',
    short: 'Bank account frozen',
    synonyms: ['account frozen', 'account blocked', 'debit freeze', 'lien', 'hold on account', 'cannot withdraw', 'account restricted', 'kyc block', 'cyber police freeze'],
    intro: 'We will work out why the account was restricted, because the records you need depend on the reason.',
    juris: 'Freezes ordered by police, courts or tax authorities follow different procedures. Your advocate will check which authority acted and under what power.',
    questions: [
      { id: 'bf_how', text: 'How did you find out the account was frozen?', why: 'It tells us whether you already have something in writing.',
        options: o([['txn_failed', 'A payment or withdrawal failed'], ['bank_told', 'The bank told me (SMS, email, call or at the branch)'], ['authority', 'Police or another authority contacted me'], NS]) },
      { id: 'bf_reason', text: 'What reason have you been given?', why: 'A KYC block, a police request and a court or tax order each need different records and a different next step.',
        options: o([['kyc', 'KYC / documents not updated'], ['police', 'Police or cyber-crime investigation'], ['suspicious', 'Suspicious or disputed transaction'], ['order', 'Court, tax or other government order'], ['none', 'No reason given'], NS]) },
      { id: 'bf_written', text: 'Do you have any written message or notice about the restriction?', why: 'A written communication usually names who asked for the freeze. That decides who can lift it.',
        options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'bf_scope', text: 'Is the whole account blocked, or only a part of the money?', why: 'Sometimes only a specific amount is held (a "lien"). The rest may remain usable.',
        options: o([['full', 'Whole account blocked'], ['partial', 'Only part of the money is held'], NS]) },
      { id: 'bf_received', text: 'Before the freeze, did you receive money from someone you did not know well?', why: 'Accounts are often frozen because they received part of money that someone else reported as stolen — for example from a buyer, a crypto (P2P) trade, a gaming app or a stranger.',
        when: W('bf_reason', 'police', 'suspicious', 'none', 'unsure'),
        options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'bf_police_contact', text: 'Have the police given you anything?', deep: true, chapter: 'Notices',
        why: 'Police notices often carry a date to appear or respond.',
        when: ANY(W('bf_reason', 'police'), W('bf_how', 'authority')),
        options: o([['notice', 'A written notice or FIR number'], ['called', 'Only a phone call'], ['no', 'Nothing yet'], NS]) },
      { id: 'bf_kyc_attempts', text: 'Have you already submitted your KYC documents again?', deep: true, chapter: 'KYC',
        why: 'If you submitted and the block continued, the acknowledgement matters.',
        when: W('bf_reason', 'kyc'),
        options: o([['submitted', 'Yes, submitted'], ['rejected', 'Tried, but it was refused'], ['no', 'Not yet']]) },
      { id: 'bf_needs', text: 'Do you need this account for any of these?', type: 'multi', deep: true, chapter: 'Impact',
        why: 'Hardship can matter when asking for the freeze to be reduced or lifted.',
        options: o([['salary', 'Receiving salary'], ['business', 'Running a business'], ['medical', 'Medical or urgent family costs'], ['none', 'None of these']]) },
      { id: 'bf_complained', text: 'Have you complained to the bank in writing?', deep: true, chapter: 'Complaints',
        why: 'A written complaint with a reference number creates a record and opens the RBI complaint route if needed.',
        options: o([['yes_ref', 'Yes, I have a reference number'], ['verbal', 'Only spoke to them'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'bf_e_notice', name: 'The freeze message or notice', fact: 'Who restricted the account and why',
        why: 'It usually names the authority or reason. This decides who can lift the freeze.',
        where: 'SMS, email, net-banking alert, or a letter from the branch.', preserve: 'Keep the original SMS or email. Screenshot it with the date and sender visible.',
        when: W('bf_written', 'yes') },
      { id: 'bf_e_request', name: 'Your written request to the bank asking for the reason', fact: 'Who restricted the account and why',
        why: 'Without a written reason, it is hard to know whether to approach the bank, the police or a court.',
        where: 'Write to your branch or the bank\'s grievance email. Ask: the reason, the authority that asked for the freeze, its reference number, and the amount held.',
        preserve: 'Keep the sent email or a stamped acknowledgement copy.', when: NOT(W('bf_written', 'yes')), action: true },
      { id: 'bf_e_statement', name: 'Account statement from about 6 months before the freeze to today', fact: 'Which transactions triggered the freeze',
        why: 'Your advocate can see the credits that may be linked and the balance that is held.',
        where: 'Net banking (download PDF) or request at the branch.', preserve: 'Download the official PDF. Do not edit it.' },
      { id: 'bf_e_credits', name: 'Details of the specific incoming payments (date, amount, UTR/reference, sender)', fact: 'Whether you received disputed money',
        why: 'Freezes linked to cyber complaints usually point to particular credits.',
        where: 'Your statement and UPI app history.', preserve: 'Note the 12-digit UTR for each payment.', when: W('bf_received', 'yes', 'unsure') },
      { id: 'bf_e_deal', name: 'Proof of the deal behind those payments', fact: 'Whether you received the money in good faith',
        why: 'Invoices, chats with the buyer, or a trading platform order record can show why the money came to you.',
        where: 'Your messages, email, invoices, trading-platform order history.', preserve: 'Export the complete chat, not cropped screenshots.',
        limit: 'Showing a genuine deal does not automatically lift a freeze; the investigating agency or a court decides.', when: W('bf_received', 'yes') },
      { id: 'bf_e_police', name: 'Police notice, FIR number or cyber-complaint reference', fact: 'Which investigation the freeze is linked to',
        why: 'Your advocate needs the case details to approach the police or the court.',
        where: 'From the bank\'s reply, the police notice, or by asking the bank for the requesting agency.', preserve: 'Keep the original notice and the envelope.',
        time: 'A notice may set a date to appear. Show it to an advocate before you respond.', holder: 'others',
        when: ANY(W('bf_reason', 'police'), W('bf_police_contact', 'notice')) },
      { id: 'bf_e_order', name: 'Copy of the court, tax or government order', fact: 'Which authority restricted the account',
        why: 'Orders have their own appeal or review routes and time limits.', where: 'Ask the bank for a copy, or the authority that issued it.',
        preserve: 'Keep the complete order with all pages.', holder: 'others', time: 'Orders can have short challenge periods.', when: W('bf_reason', 'order') },
      { id: 'bf_e_kyc', name: 'The KYC documents you submitted and the bank\'s acknowledgement', fact: 'Whether the KYC requirement was met',
        why: 'Shows you complied with the bank\'s request.', where: 'Your copies; acknowledgement slip or email.', preserve: 'Keep the acknowledgement with its date.',
        when: W('bf_reason', 'kyc') },
      { id: 'bf_e_corr', name: 'All messages and letters with the bank about the freeze', fact: 'What the bank has said and when',
        why: 'Creates a timeline and shows whether the bank responded properly.', where: 'Email, SMS, branch letters, app chat.', preserve: 'Keep them in date order.' },
      { id: 'bf_e_complaint', name: 'Bank complaint reference number and replies', fact: 'Whether the bank\'s complaint process has been used',
        why: 'Usually needed before going to the RBI complaint system.', where: 'Bank email or app.', preserve: 'Note the date of filing.',
        when: W('bf_complained', 'yes_ref') },
      { id: 'bf_e_need', name: 'Proof that you depend on the account (salary slips, business invoices, medical bills)', fact: 'Hardship caused by the freeze',
        why: 'Can support a request to release part of the money.', where: 'Employer, your business records, hospital.', preserve: 'Keep originals.',
        when: W('bf_needs', 'salary', 'business', 'medical') },
      { id: 'bf_e_owner', name: 'Proof that you own the account (passbook, account opening papers, ID)', fact: 'You are the account holder',
        why: 'Basic identification for any application.', where: 'Your records or the branch.', preserve: '' }
    ],
    urgent: [
      { id: 'bf_u_police', when: W('bf_police_contact', 'notice'), level: 'soon', title: 'Speak to an advocate before replying to a police notice',
        text: 'A notice may require you to appear or produce documents by a date. Get advice before you go or respond.', help: ['l15100'] },
      { id: 'bf_u_medical', when: W('bf_needs', 'medical'), level: 'soon', title: 'Urgent medical need',
        text: 'If you need the money for treatment, tell an advocate now. It may be possible to ask for part of the money to be released.', help: ['l15100'] }
    ],
    lawyerQs: [
      { text: 'Which authority asked for the freeze, and under what power?' },
      { text: 'Is the whole balance frozen, or only the disputed amount — and can the rest be released?' },
      { text: 'Should we approach the bank, the investigating agency, or a court?', when: W('bf_reason', 'police', 'suspicious', 'order') },
      { text: 'Do I need to respond to the police notice, and how?', when: W('bf_police_contact', 'notice') }
    ]
  });

  /* ---------------- 2. UPI / cyber fraud ---------------- */
  ISSUES.push({
    id: 'upi-cyber-fraud', cat: 'money', title: 'I was cheated online or money left my account without permission',
    short: 'UPI or online fraud',
    synonyms: ['upi fraud', 'upi scam', 'cyber fraud', 'online fraud', 'otp fraud', 'scam', 'unauthorised transaction', 'unauthorized debit', 'hacked', 'phishing', 'card fraud', 'credit card fraud', 'debit card fraud', 'investment fraud', 'task scam'],
    intro: 'Speed matters with online fraud. We will ask what happened and make sure you have reported it, then list your records.',
    juris: 'Your bank\'s liability depends on how quickly you reported and whether the bank or you were at fault. RBI\'s revised rules apply to transactions from 1 January 2027; older ones follow the 2017 framework.',
    questions: [
      { id: 'uf_when', text: 'When did the money leave your account?', why: 'The first hours matter most. Fast reports improve the chance of money being put on hold.',
        options: o([['today', 'Within the last 24 hours'], ['3days', '1 to 3 days ago'], ['month', 'Within the last month'], ['older', 'More than a month ago']]) },
      { id: 'uf_how', text: 'Which best describes what happened?', why: 'Being tricked into paying is treated differently from money taken without your action.',
        options: o([['tricked', 'I was tricked into sending money (fake seller, job, investment, etc.)'], ['unauth', 'Money left without me doing anything'], ['otp', 'I shared an OTP, PIN or card details'], ['remote', 'Someone made me install an app or share my screen'], NS]) },
      { id: 'uf_reported', text: 'Where have you reported it so far?', type: 'multi', why: 'Each report creates a reference number your advocate will ask for.',
        options: o([['h1930', '1930 helpline or cybercrime.gov.in'], ['bank', 'My bank'], ['police', 'Police station'], ['none', 'Nowhere yet']]) },
      { id: 'uf_mode', text: 'How did the money go?', why: 'Card, UPI and net-banking leave different records.',
        options: o([['upi', 'UPI'], ['card', 'Debit or credit card'], ['netbanking', 'Net banking / IMPS / NEFT'], ['wallet', 'Wallet'], ['multiple', 'More than one way']]) },
      { id: 'uf_contact', text: 'Do you still have the messages, call log, links or app the scammer used?', deep: true, chapter: 'Scammer details',
        why: 'These help trace the people involved.', options: o([['yes', 'Yes, all of it'], ['partly', 'Some of it'], ['deleted', 'Deleted or lost']]) },
      { id: 'uf_beneficiary', text: 'Do you know where the money went (UPI ID, account number or phone)?', deep: true, chapter: 'Scammer details',
        why: 'Receiving account details let the police and banks act on that account.', options: o([['yes', 'Yes'], ['no', 'No']]) },
      { id: 'uf_device', text: 'Is the app the scammer asked you to install still on your phone?', deep: true, chapter: 'Your phone',
        why: 'Its name and installation details may matter to the investigation.', when: W('uf_how', 'remote'),
        options: o([['yes', 'Yes'], ['removed', 'Already removed'], NS]) },
      { id: 'uf_bankresp', text: 'What has the bank said?', deep: true, chapter: 'Bank response', when: W('uf_reported', 'bank'),
        why: 'A rejection or no reply opens the RBI complaint route.', options: o([['refunded', 'Refunded (fully or partly)'], ['rejected', 'Rejected my claim'], ['pending', 'Still pending'], ['silent', 'No reply']]) }
    ],
    evidence: [
      { id: 'uf_e_report', name: 'Report at 1930 / cybercrime.gov.in and keep the acknowledgement number', fact: 'The fraud was reported promptly',
        why: 'An official report can lead to the receiving account being put on hold.', where: 'Call 1930 or file at cybercrime.gov.in.',
        preserve: 'Save the acknowledgement number.', time: 'Report as quickly as possible.', action: true, when: NOT(W('uf_reported', 'h1930')) },
      { id: 'uf_e_ack', name: '1930 / cybercrime.gov.in acknowledgement number', fact: 'The fraud was reported promptly',
        why: 'Your advocate and the police will use it to track the complaint.', where: 'SMS or email after reporting.', preserve: 'Screenshot with date.',
        when: W('uf_reported', 'h1930') },
      { id: 'uf_e_txn', name: 'Transaction records for every payment (date, time, amount, UTR/reference)', fact: 'How much went, when, and where',
        why: 'The 12-digit UTR or reference is the key to tracing each payment.', where: 'UPI app history, bank statement, card statement.',
        preserve: 'Download the official statement PDF; note each reference.' },
      { id: 'uf_e_alerts', name: 'Bank SMS and email alerts for those payments', fact: 'When you were told about each debit',
        why: 'Alert times help show when you first knew.', where: 'Your phone and email.', preserve: 'Do not delete the SMS. Screenshot with the sender visible.' },
      { id: 'uf_e_bank', name: 'Your written complaint to the bank and its reference number', fact: 'You notified the bank, and when',
        why: 'For money taken without your action, the time you informed the bank can affect whether you bear any loss.',
        where: 'Bank app, email, branch.', preserve: 'Note the date and time you reported.',
        time: 'Tell the bank in writing today. Under RBI rules in force until 31 Dec 2026, reporting an unauthorised debit within 3 working days gives the most protection. From 1 Jan 2027 the window becomes 5 calendar days, and also covers payments you were tricked into making.',
        when: ANY(W('uf_how', 'unauth', 'otp', 'remote', 'unsure'), W('uf_reported', 'bank')) },
      { id: 'uf_e_chats', name: 'The complete conversation with the scammer (chat, call log, emails, links)', fact: 'How you were deceived',
        why: 'Shows what was promised or claimed, and who was involved.', where: 'WhatsApp, Telegram, SMS, email, call log.',
        preserve: 'Export the whole chat; do not crop. Do not reply or delete anything. Note phone numbers and profile names.',
        limit: 'Screenshots can be questioned; keep the phone and original files too.', when: NOT(W('uf_contact', 'deleted')) },
      { id: 'uf_e_lost', name: 'Anything left about the scammer (numbers, names, website, payment request)', fact: 'Who was involved',
        why: 'Even partial details help.', where: 'Call log, browser history, bank statement payee names.', preserve: 'Write down what you remember now, with dates.',
        when: W('uf_contact', 'deleted') },
      { id: 'uf_e_benef', name: 'Receiving UPI ID, account number or phone number', fact: 'Where the money went', why: 'Lets the police and banks act on the receiving account.',
        where: 'Transaction details in your UPI app or statement.', preserve: '', when: W('uf_beneficiary', 'yes') },
      { id: 'uf_e_app', name: 'Name of the app you were asked to install, with screenshots', fact: 'How access to your phone was obtained',
        why: 'Helps the investigation and your bank claim.', where: 'Your phone\'s app list.', preserve: 'Note the app name before removing it. Ask the police before resetting the phone.',
        when: W('uf_how', 'remote') },
      { id: 'uf_e_fir', name: 'Police complaint or FIR copy', fact: 'A criminal complaint exists', why: 'Often needed for bank claims and recovery.',
        where: 'Police station or the cyber cell.', preserve: 'Keep the stamped copy.', holder: 'others', when: W('uf_reported', 'police') },
      { id: 'uf_e_bankreply', name: 'The bank\'s reply (refund, rejection or none)', fact: 'How the bank handled your claim',
        why: 'Needed to escalate to the RBI complaint system.', where: 'Email or letter from bank.', preserve: '', when: W('uf_bankresp', 'rejected', 'silent', 'pending', 'refunded') },
      { id: 'uf_e_offer', name: 'The fake ad, job offer, website or investment page', fact: 'What you were promised',
        why: 'Shows the deception.', where: 'Screenshots, browser history.', preserve: 'Save the web address and screenshots with dates.', when: W('uf_how', 'tricked') }
    ],
    urgent: [
      { id: 'uf_u_report', level: 'now', when: ALL(W('uf_when', 'today', '3days'), ANS('uf_reported'), NOT(W('uf_reported', 'h1930'))),
        title: 'Report this now — before finishing the list',
        text: 'Call 1930 or report at cybercrime.gov.in, and tell your bank in writing. Faster reports improve the chance money can be put on hold.', help: ['cy1930'] },
      { id: 'uf_u_bank', level: 'soon', when: ALL(W('uf_how', 'unauth', 'otp', 'remote'), ANS('uf_reported'), NOT(W('uf_reported', 'bank'))),
        title: 'Tell your bank in writing today', text: 'For money taken without your action, the time you report to the bank can affect how much of the loss you bear.', help: ['rbi'] }
    ],
    lawyerQs: [
      { text: 'Am I entitled to a refund from my bank under RBI rules, given when I reported?', when: W('uf_how', 'unauth', 'otp', 'remote', 'unsure') },
      { text: 'What should I do if the bank rejects my claim — RBI complaint or consumer commission?' },
      { text: 'How do I follow up the police investigation and any amount put on hold?' }
    ]
  });

  /* ---------------- 3. Money debited, payment failed ---------------- */
  ISSUES.push({
    id: 'failed-payment-debited', cat: 'money', title: 'Money was debited but the payment failed',
    short: 'Failed payment, money debited',
    synonyms: ['payment failed', 'transaction failed', 'money debited', 'amount deducted', 'refund not received', 'atm no cash', 'atm cash not dispensed', 'pending transaction', 'upi failed', 'double debit'],
    intro: 'RBI has set deadlines for reversing failed payments, with compensation for delay. We will find out which deadline applies to you.',
    juris: 'Timelines come from RBI\'s 2019 framework on failed transactions. Your advocate or the bank can confirm the current rule.',
    questions: [
      { id: 'fp_mode', text: 'What kind of payment was it?', why: 'The reversal deadline depends on the payment type.',
        options: o([['upi_p2p', 'UPI to a person'], ['upi_merchant', 'UPI to a shop or website'], ['card_pos', 'Card at a shop machine'], ['card_online', 'Card online'], ['atm', 'ATM — cash not given'], ['imps', 'IMPS / net banking transfer']]) },
      { id: 'fp_days', text: 'How long ago was it?', why: 'Tells us whether the reversal deadline has passed.',
        options: o([['d1', 'Today or yesterday'], ['d5', '2 to 5 days'], ['d30', '6 to 30 days'], ['older', 'More than 30 days']]) },
      { id: 'fp_status', text: 'What does your app, slip or statement show?', why: 'A "success" status needs proof the other side did not get the money.',
        options: o([['failed', 'Failed'], ['pending', 'Pending'], ['success', 'Successful, but the other side says they did not get it'], NS]) },
      { id: 'fp_complained', text: 'Have you raised a complaint with your bank?', why: 'A complaint reference is needed before going to RBI.',
        options: o([['yes', 'Yes, with a reference number'], ['no', 'Not yet']]) },
      { id: 'fp_other_side', text: 'Has the shop or person confirmed in writing that they did not receive it?', deep: true, chapter: 'Other side',
        why: 'Written confirmation helps prove the money did not reach them.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'fp_bankresp', text: 'What has the bank said?', deep: true, chapter: 'Bank response', when: W('fp_complained', 'yes'),
        why: 'If the bank does not resolve it within 30 days, or rejects it, you can go to the RBI complaint system.',
        options: o([['waiting', 'Still waiting (under 30 days)'], ['none30', 'No resolution after 30 days'], ['rejected', 'Rejected'], ['partial', 'Refunded without compensation']]) }
    ],
    evidence: [
      { id: 'fp_e_ref', name: 'Transaction reference (UTR / RRN), date, time and amount', fact: 'Which payment failed', why: 'The bank tracks failed payments by this reference.',
        where: 'UPI app history, ATM slip, card slip, statement.', preserve: 'Screenshot the transaction details screen.' },
      { id: 'fp_e_debit', name: 'Debit SMS and the statement entry', fact: 'Your account was actually debited', why: 'Shows the money left your account.',
        where: 'SMS, net banking statement.', preserve: 'Keep the SMS; download the statement PDF.' },
      { id: 'fp_e_screen', name: 'Screenshot of the failed or pending screen', fact: 'The payment did not complete', why: 'Shows the status at the time.',
        where: 'Your phone gallery.', preserve: 'Keep the original image file.', when: NOT(W('fp_mode', 'atm')) },
      { id: 'fp_e_atm', name: 'ATM slip, ATM ID and location, and exact time', fact: 'Cash was not dispensed', why: 'The bank checks the ATM\'s records against your claim.',
        where: 'ATM slip; ATM ID is printed on the machine.', preserve: 'Write down the time and location now.',
        time: 'Ask the bank in writing to preserve the ATM\'s CCTV and cash records — these may be kept only for a limited time.', when: W('fp_mode', 'atm') },
      { id: 'fp_e_merchant', name: 'Written confirmation from the shop or person that they did not receive it', fact: 'The beneficiary was not credited',
        why: 'Strong support where your app shows "success".', where: 'Email or message from the merchant.', preserve: '', holder: 'others',
        when: ANY(W('fp_status', 'success'), W('fp_other_side', 'yes')) },
      { id: 'fp_e_complaint', name: 'Bank complaint reference and all replies', fact: 'The bank was told and how it responded', why: 'Needed for an RBI complaint.',
        where: 'Bank app or email.', preserve: 'Note the date filed.', when: W('fp_complained', 'yes') },
      { id: 'fp_e_raise', name: 'Raise a written complaint with your bank and keep the reference', fact: 'The bank was told', why: 'Starts the formal process and the record for compensation.',
        where: 'Bank app, grievance email or branch.', preserve: 'Ask for both the reversal and any compensation due.', action: true, when: W('fp_complained', 'no') },
      { id: 'fp_e_rbi', name: 'RBI complaint (cms.rbi.org.in) and its number', fact: 'Escalation after the bank', why: 'Available when the bank rejects or does not resolve within 30 days.',
        where: 'cms.rbi.org.in', preserve: '', action: true, when: W('fp_bankresp', 'none30', 'rejected', 'partial') }
    ],
    info: [
      { when: W('fp_mode', 'upi_p2p', 'imps'), text: 'RBI framework: transfers to a person should be reversed by the day after the transaction (T+1). After that, ₹100 per day compensation is payable.' },
      { when: W('fp_mode', 'upi_merchant', 'card_pos', 'card_online'), text: 'RBI framework: payments to a merchant should be reversed within 5 days (T+5). After that, ₹100 per day compensation is payable.' },
      { when: W('fp_mode', 'atm'), text: 'RBI framework: an ATM debit without cash should be reversed within 5 days (T+5). After that, ₹100 per day compensation is payable.' }
    ],
    urgent: [],
    lawyerQs: [
      { text: 'How much compensation is due for the delay, and has the bank paid it?' },
      { text: 'Should I file with RBI, or with the consumer commission?', when: W('fp_bankresp', 'none30', 'rejected', 'partial') }
    ]
  });

  /* ---------------- 4. Rental security deposit ---------------- */
  ISSUES.push({
    id: 'rental-security-deposit', cat: 'home', title: 'My landlord is not returning my security deposit',
    short: 'Security deposit not returned',
    synonyms: ['security deposit', 'rent deposit', 'advance not returned', 'landlord deposit', 'deposit refund', 'tenant deposit', 'house owner not returning advance'],
    intro: 'Deposit disputes turn on what was paid, the condition of the home, and any dues. We will ask about each.',
    juris: 'Rent laws differ by state. Some states follow the Model Tenancy Act approach, including caps on deposits.',
    questions: [
      { id: 'rd_role', text: 'Which side are you on?', why: 'Tenants and landlords need different records.',
        options: o([['tenant', 'I am the tenant'], ['landlord', 'I am the landlord (the tenant is claiming)']]) },
      { id: 'rd_agreement', text: 'Is there a written rent agreement?', why: 'It usually states the deposit and the deductions allowed.',
        options: o([['registered', 'Yes, registered'], ['unregistered', 'Yes, but not registered'], ['none', 'No written agreement'], NS]) },
      { id: 'rd_paid', text: 'How was the deposit paid?', why: 'Cash payments need different proof than bank transfers.',
        options: o([['bank', 'Bank transfer or UPI'], ['cheque', 'Cheque'], ['cash', 'Cash'], ['mixed', 'Mixed']]) },
      { id: 'rd_vacated', text: 'Has the house been vacated and the keys handed back?', why: 'The deposit usually becomes due after handover.',
        options: o([['yes', 'Yes'], ['notice', 'Notice given, still living there'], ['no', 'No']]) },
      { id: 'rd_moved', text: 'When did you move out and hand back the keys?', when: ALL(W('rd_vacated', 'yes'), W('rd_role', 'tenant')), why: 'There is a time limit for a case to get the deposit back — usually 3 years. We use this to show how much time you have.',
        options: o([['m6', 'In the last 6 months'], ['y1', '6 months to 1 year ago'], ['y2', '1 to 2 years ago'], ['y3', '2 to 3 years ago'], ['older', 'More than 3 years ago']]) },
      { id: 'rd_reason', text: 'What reason has been given for keeping the deposit?', type: 'multi', why: 'Each reason needs different evidence.',
        options: o([['damage', 'Damage to the property'], ['dues', 'Unpaid rent, electricity or maintenance'], ['painting', 'Painting or cleaning charges'], ['none', 'No reason'], ['other', 'Something else']]) },
      { id: 'rd_photos', text: 'Are there photos or videos of the home\'s condition?', deep: true, chapter: 'Condition',
        why: 'Photos are the main evidence in damage disputes.', options: o([['both', 'At move-in and move-out'], ['in', 'Only at move-in'], ['out', 'Only at move-out'], ['none', 'None']]) },
      { id: 'rd_dues', text: 'Are any rent or bills unpaid?', deep: true, chapter: 'Dues',
        why: 'Undisputed dues are often adjusted against the deposit.', options: o([['none', 'No, all paid'], ['some', 'Some'], ['disputed', 'Disputed']]) },
      { id: 'rd_demand', text: 'Has the deposit been demanded in writing?', deep: true, chapter: 'Demand',
        why: 'A written demand fixes the date and the other side\'s reply.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'rd_e_agreement', name: 'Rent agreement (all pages)', fact: 'The deposit amount and deduction terms', why: 'Usually states the deposit, notice period and deductions.',
        where: 'Your copy, or the copy given at registration.', preserve: 'Keep the original; copy every page.',
        limit: 'An unregistered or unstamped agreement can still help, but may raise stamp or registration questions — ask your advocate.', when: W('rd_agreement', 'registered', 'unregistered', 'unsure') },
      { id: 'rd_e_noagr', name: 'Any messages or receipts that mention the deposit amount', fact: 'The deposit amount', why: 'Without an agreement, messages and receipts prove what was agreed.',
        where: 'WhatsApp, SMS, email, broker messages.', preserve: 'Export the complete chat.', when: W('rd_agreement', 'none') },
      { id: 'rd_e_payment', name: 'Proof of paying the deposit', fact: 'The deposit was paid', why: 'The central fact of the claim.',
        where: 'Bank statement or UPI history; cheque counterfoil and statement entry.', preserve: 'Download the statement PDF.', when: W('rd_paid', 'bank', 'cheque', 'mixed') },
      { id: 'rd_e_cash', name: 'Cash receipt, acknowledgement message, or names of witnesses', fact: 'A cash deposit was paid', why: 'Cash is harder to prove; any written acknowledgement helps.',
        where: 'Receipts, messages, broker, people present.', preserve: 'Note witness names only — do not ask them to sign statements without advice.',
        limit: 'A large cash payment without a receipt may be difficult to prove.', when: W('rd_paid', 'cash', 'mixed') },
      { id: 'rd_e_rent', name: 'Rent payment records for the whole stay', fact: 'Rent was paid', why: 'Answers claims of unpaid rent.', where: 'Bank statement, receipts.', preserve: '' },
      { id: 'rd_e_handover', name: 'Proof of handing back the keys and the date', fact: 'When possession was returned', why: 'Fixes when the deposit became due.',
        where: 'Messages, handover note, photo of keys handed over.', preserve: '', when: W('rd_vacated', 'yes') },
      { id: 'rd_e_notice', name: 'Your notice to vacate', fact: 'Notice was given as agreed', why: 'Short notice is a common reason for deductions.', where: 'Messages or letter.', preserve: '',
        when: W('rd_vacated', 'yes', 'notice') },
      { id: 'rd_e_photos', name: 'Photos or videos of the home\'s condition', fact: 'Whether there was damage beyond normal wear', why: 'The main evidence on damage claims.',
        where: 'Your phone gallery or cloud.', preserve: 'Keep the original files (they carry the date); do not edit.', when: ANY(W('rd_photos', 'both', 'in', 'out'), W('rd_reason', 'damage')) },
      { id: 'rd_e_bills', name: 'Final electricity, water and maintenance bills and meter readings', fact: 'Whether utility dues are outstanding', why: 'Answers claims of unpaid bills.',
        where: 'Utility app, society office, photo of the meter.', preserve: '', when: ANY(W('rd_reason', 'dues'), W('rd_dues', 'some', 'disputed')) },
      { id: 'rd_e_claim', name: 'The messages in which the deposit was refused or deductions claimed', fact: 'The reason given for keeping it', why: 'Shows the reason and its date.',
        where: 'WhatsApp, SMS, email.', preserve: 'Export the full chat.' },
      { id: 'rd_e_demand', name: 'Your written demand and any reply', fact: 'The deposit was demanded', why: 'Fixes the date of demand.', where: 'Email, message, letter, legal notice.', preserve: '',
        when: W('rd_demand', 'yes') },
      { id: 'rd_e_id', name: 'Landlord\'s and tenant\'s full names and addresses', fact: 'Who the parties are', why: 'Needed for any notice or complaint.', where: 'Agreement, ID copies, police verification form.', preserve: '' },
      { id: 'rd_e_repairs', name: 'Repair invoices and damage photos (landlord)', fact: 'The cost of damage beyond normal wear', why: 'Supports deductions.',
        where: 'Contractor invoices, your photos.', preserve: '', when: W('rd_role', 'landlord') }
    ],
    urgent: [],
    lawyerQs: [
      { text: 'Which rent law applies in my state, and what deductions are allowed?' },
      { text: 'Is a legal notice the right first step, and where would a claim be filed?' },
      { text: 'Does the unregistered agreement cause any problem?', when: W('rd_agreement', 'unregistered') }
    ]
  });

  /* ---------------- 5. Unpaid salary ---------------- */
  ISSUES.push({
    id: 'unpaid-salary', cat: 'work', title: 'I have not been paid my salary or wages',
    short: 'Unpaid salary or wages',
    synonyms: ['salary not paid', 'unpaid salary', 'wages not paid', 'pending salary', 'full and final', 'final settlement', 'employer not paying', 'salary delay', 'gratuity not paid'],
    intro: 'The key is proving you worked there and what you were owed. We will help you find records even without an appointment letter.',
    juris: 'Forums and rules depend on whether you are an "employee" or "worker", the type of employer and the state. Your advocate will check.',
    questions: [
      { id: 'us_type', text: 'How were you engaged?', why: 'Employees, agency contract workers and freelancers use different routes.',
        options: o([['employee', 'Directly employed'], ['agency', 'Through a contractor or agency'], ['daily', 'Daily wage'], ['freelance', 'Freelancer / consultant'], NS]) },
      { id: 'us_status', text: 'Are you still working there?', why: 'Resignation or termination records then become important.',
        options: o([['working', 'Still working'], ['resigned', 'I resigned'], ['terminated', 'I was removed'], ['closed', 'The business has closed or disappeared']]) },
      { id: 'us_amount', text: 'What is unpaid?', why: 'Tells us which records prove the amount.',
        options: o([['one', 'One month'], ['several', '2 to 3 months'], ['many', 'More than 3 months'], ['fnf', 'Only final settlement / dues on leaving']]) },
      { id: 'us_proof', text: 'Which of these do you have?', type: 'multi', why: 'Any one of these can help prove you worked there.',
        options: o([['letter', 'Appointment letter or offer email'], ['slips', 'Salary slips'], ['bank', 'Past salary credits in my bank account'], ['idcard', 'Employee ID card'], ['pf', 'PF/UAN or ESI number'], ['none', 'None of these']]) },
      { id: 'us_paidhow', text: 'How was salary usually paid?', deep: true, chapter: 'Payment',
        why: 'Cash wages need other kinds of proof.', options: o([['bank', 'Into my bank account'], ['cash', 'In cash'], ['mixed', 'Mixed']]) },
      { id: 'us_asked', text: 'Have you asked for the salary in writing?', deep: true, chapter: 'Demand',
        why: 'A written request and the employer\'s reply are strong evidence.', options: o([['yes', 'Yes (email or message)'], ['no', 'Only verbally or not at all']]) },
      { id: 'us_employer', text: 'What kind of employer is it?', deep: true, chapter: 'Employer',
        why: 'Government and private employers have different routes.', options: o([['company', 'Company'], ['small', 'Shop or small business'], ['govt', 'Government or public sector'], NS]) }
    ],
    evidence: [
      { id: 'us_e_letter', name: 'Appointment letter, offer email or contract', fact: 'You were employed and on what pay', why: 'States the salary and terms.',
        where: 'Your email or files.', preserve: 'Keep the original email (forwarding can change details).', when: W('us_proof', 'letter') },
      { id: 'us_e_slips', name: 'Salary slips', fact: 'Your salary and deductions', why: 'Shows the agreed salary and any PF/tax deducted.', where: 'HR portal, email.', preserve: '', when: W('us_proof', 'slips') },
      { id: 'us_e_bank', name: 'Bank statement showing past salary credits from the employer', fact: 'You were paid by this employer before', why: 'Shows the employment and the usual amount.',
        where: 'Net banking.', preserve: 'Download the official PDF.', when: ANY(W('us_proof', 'bank'), W('us_paidhow', 'bank', 'mixed')) },
      { id: 'us_e_pf', name: 'EPFO (UAN) passbook or ESI records', fact: 'The employer registered you', why: 'Employer contributions are independent proof of employment.',
        where: 'EPFO member portal / UMANG app; ESI portal.', preserve: 'Download the passbook PDF.', holder: 'me', when: W('us_proof', 'pf') },
      { id: 'us_e_id', name: 'Employee ID card, visiting card or uniform', fact: 'You worked there', why: 'Supporting proof of employment.', where: 'Your belongings.', preserve: '', when: W('us_proof', 'idcard') },
      { id: 'us_e_attend', name: 'Attendance, timesheets, rosters, work emails or work-group messages', fact: 'You actually worked during the unpaid period',
        why: 'Shows work was done for the months claimed.', where: 'Work email, WhatsApp work groups, attendance app.', preserve: 'Save only your own records; do not copy confidential company data.' },
      { id: 'us_e_cash', name: 'Records of cash wages (notebook entries, messages, co-workers\' names)', fact: 'Wages were paid in cash', why: 'Cash wages need indirect proof.',
        where: 'Your notes, messages.', preserve: 'Write down amounts and dates you remember now.', when: W('us_paidhow', 'cash', 'mixed') },
      { id: 'us_e_none', name: 'Anything linking you to the employer (photos at work, delivery records, customer messages, co-workers)', fact: 'You worked there',
        why: 'Without formal papers, several small pieces of proof can work together.', where: 'Your phone, messages.', preserve: '', when: W('us_proof', 'none') },
      { id: 'us_e_demand', name: 'Your written request for salary and the employer\'s replies', fact: 'The salary was demanded and not paid', why: 'Shows the employer knew and did not pay.',
        where: 'Email, WhatsApp.', preserve: 'Export the full chat.', when: W('us_asked', 'yes') },
      { id: 'us_e_exit', name: 'Resignation, termination letter or relieving letter', fact: 'How and when the job ended', why: 'Final settlement dues depend on the exit date.',
        where: 'Email or HR portal.', preserve: '', when: W('us_status', 'resigned', 'terminated') },
      { id: 'us_e_employer', name: 'Employer\'s registered name and address (and GST/CIN if known)', fact: 'Who is liable to pay', why: 'Needed for any notice or complaint.',
        where: 'Offer letter, salary slip, invoices, GST portal search, MCA company search.', preserve: '' },
      { id: 'us_e_contractor', name: 'Details of the contractor/agency and the principal company where you worked', fact: 'Who engaged you and where you worked', why: 'Both may have obligations to pay.',
        where: 'Gate pass, agency letters.', preserve: '', when: W('us_type', 'agency') },
      { id: 'us_e_invoices', name: 'Your invoices, work orders and payment history (freelancers)', fact: 'What was agreed and delivered', why: 'Freelance claims are usually contract claims.',
        where: 'Email, invoices.', preserve: '', when: W('us_type', 'freelance') }
    ],
    urgent: [
      { id: 'us_u_closed', level: 'soon', when: W('us_status', 'closed'), title: 'The employer has closed or disappeared',
        text: 'See an advocate soon. Records and assets can be harder to trace later.', help: ['l15100', 'samadhan'] }
    ],
    lawyerQs: [
      { text: 'Am I an "employee"/"worker" for labour law, or is this a contract claim?' },
      { text: 'Should I go to the labour authority, send a legal notice, or file a claim — and is there a time limit?' },
      { text: 'Can the agency and the principal company both be held responsible?', when: W('us_type', 'agency') }
    ]
  });

  /* ---------------- 6. Money lent not returned ---------------- */
  ISSUES.push({
    id: 'money-lent-not-returned', cat: 'other', title: 'I lent money and it has not been returned',
    short: 'Money lent not returned',
    synonyms: ['loan not returned', 'friend not returning money', 'hand loan', 'money recovery', 'borrowed money', 'udhar', 'recovery suit'],
    intro: 'Proof of payment alone may not prove it was a loan. We will look for anything showing the person agreed to repay.',
    juris: 'Time limits apply to money claims. A written acknowledgement or part-payment can affect them. Your advocate will check.',
    questions: [
      { id: 'ml_how', text: 'How was the money given?', why: 'Bank transfers leave a record; cash needs other proof.',
        options: o([['bank', 'Bank transfer or UPI'], ['cash', 'Cash'], ['cheque', 'By cheque'], ['mixed', 'Mixed']]) },
      { id: 'ml_written', text: 'Is there anything in writing showing it was a loan?', why: 'A transfer shows money moved. It does not, by itself, show that it had to be repaid.',
        options: o([['agreement', 'A signed agreement or promissory note'], ['messages', 'Messages where they accept they owe me'], ['none', 'Nothing in writing'], NS]) },
      { id: 'ml_when', text: 'When was the money given?', why: 'Courts accept a case to recover a loan for 3 years from the day the money was given. We use this to show how much time you have.',
        options: o([['y1', 'Within the last year'], ['y2', '1 to 2 years ago'], ['y3', '2 to 3 years ago'], ['older', 'More than 3 years ago'], ['several', 'Several times over a period']]) },
      { id: 'ml_since', text: 'Since then, has the person paid anything back or admitted the debt?', why: 'A part-payment or written admission can be important for time limits.',
        options: o([['paid', 'Paid part of it'], ['admitted', 'Admitted it in a message'], ['nothing', 'Neither'], NS]) },
      { id: 'ml_cheque', text: 'Did they give you a cheque for repayment?', why: 'A bounced cheque has its own strict deadlines.',
        options: o([['bounced', 'Yes, and it bounced'], ['notdeposited', 'Yes, not deposited yet'], ['no', 'No']]) },
      { id: 'ml_bounce_date', text: 'When did you get the bank\'s cheque return memo?', deep: false, why: 'The deadline for a legal notice runs from when you learn of the dishonour.',
        when: W('ml_cheque', 'bounced'), options: o([['w2', 'Within the last 2 weeks'], ['w4', '2 to 4 weeks ago'], ['older', 'More than 30 days ago'], NS]) },
      { id: 'ml_witness', text: 'Was anyone present when the money was given or discussed?', deep: true, chapter: 'Witnesses',
        why: 'Witnesses can support an oral agreement.', options: o([['yes', 'Yes'], ['no', 'No']]) },
      { id: 'ml_demand', text: 'Have you asked for repayment in writing?', deep: true, chapter: 'Demand',
        why: 'Their reply — or silence — to a written demand matters.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'ml_e_transfer', name: 'Transfer records (statement, UPI history, cheque encashment)', fact: 'The money was paid to them', why: 'Proves payment and the date.',
        where: 'Net banking, UPI app.', preserve: 'Download the statement PDF.', limit: 'Proof of payment alone may not prove it was a loan rather than a gift or business payment.',
        when: W('ml_how', 'bank', 'cheque', 'mixed') },
      { id: 'ml_e_cashsrc', name: 'Proof of where the cash came from (withdrawal slip or statement) and when it was handed over', fact: 'You had and gave the cash', why: 'Supports a cash loan.',
        where: 'Bank statement, ATM withdrawals.', preserve: '', limit: 'Large cash transactions can raise tax questions — ask your advocate.', when: W('ml_how', 'cash', 'mixed') },
      { id: 'ml_e_agreement', name: 'Signed agreement or promissory note', fact: 'Repayment was agreed', why: 'The clearest proof of a loan.',
        where: 'Your records.', preserve: 'Keep the original safely; give copies only.', when: W('ml_written', 'agreement') },
      { id: 'ml_e_ack', name: 'Complete chat where they accept the debt or promise to repay', fact: 'They admit owing the money', why: 'Shows the money was a loan and may affect time limits.',
        where: 'WhatsApp, SMS, email.', preserve: 'Export the whole chat, not selected screenshots. Keep the phone.',
        limit: 'Electronic records may need a certificate when filed — your advocate will advise.', when: ANY(W('ml_written', 'messages'), W('ml_since', 'admitted')) },
      { id: 'ml_e_part', name: 'Records of any part-payments they made', fact: 'They treated it as a loan', why: 'Part-payment supports the loan and may affect time limits.',
        where: 'Bank statement, UPI.', preserve: '', when: W('ml_since', 'paid') },
      { id: 'ml_e_cheque', name: 'The original cheque and the bank\'s return memo', fact: 'The repayment cheque was dishonoured', why: 'Needed for a cheque-bounce case.',
        where: 'Your bank returns the cheque with a memo.', preserve: 'Keep the originals; do not write on them.',
        time: 'Strict deadlines: a legal notice usually must be sent within 30 days of learning of the dishonour.', when: W('ml_cheque', 'bounced') },
      { id: 'ml_e_chqvalid', name: 'The cheque (check its date)', fact: 'The cheque is still valid', why: 'Cheques are generally valid for 3 months from their date.',
        where: 'Your records.', preserve: '', time: 'Check the date before it expires; ask an advocate before depositing.', when: W('ml_cheque', 'notdeposited') },
      { id: 'ml_e_witness', name: 'Names and contact details of people present', fact: 'Others know of the loan', why: 'Can support an oral loan.',
        where: 'Your memory.', preserve: 'Write down names only. Do not prepare statements for them.', when: W('ml_witness', 'yes') },
      { id: 'ml_e_demand', name: 'Your written demand and any reply', fact: 'Repayment was demanded', why: 'Their response may admit or dispute the debt.', where: 'Messages, email, legal notice.', preserve: '',
        when: W('ml_demand', 'yes') },
      { id: 'ml_e_indirect', name: 'Messages around the time of the payment (them asking for money, saying why they needed it, or promising to return it)', fact: 'The money was given as a loan',
        why: 'Without a signed paper, the surrounding messages often show the money was a loan and not a gift.', where: 'WhatsApp, SMS, email, call log.',
        preserve: 'Export the complete chat from before the payment to today.', when: W('ml_written', 'none', 'unsure') },
      { id: 'ml_e_list', name: 'A dated list of every amount given and every amount repaid', fact: 'How much is outstanding', why: 'Your advocate needs the exact balance claimed.',
        where: 'Your statements and notes.', preserve: '', action: true },
      { id: 'ml_e_askfirst', name: 'Ask your advocate whether to send a written demand or a legal notice', fact: 'Repayment was demanded', why: 'A demand and the reply (or silence) can matter later.',
        where: '—', preserve: '', action: true, when: NOT(W('ml_demand', 'yes')) },
      { id: 'ml_e_party', name: 'Borrower\'s full name and current address', fact: 'Who owes the money', why: 'Needed for a notice or a case.', where: 'Your records.', preserve: '' }
    ],
    urgent: [
      { id: 'ml_u_cheque', level: 'now', when: W('ml_bounce_date', 'w2', 'w4', 'unsure'), title: 'Cheque-bounce deadlines are short',
        text: 'A legal notice usually has to be sent within 30 days of learning about the dishonour. See an advocate now, before finishing the list.', help: ['l15100'] },
      { id: 'ml_u_old', level: 'soon', when: ALL(W('ml_when', 'older'), W('ml_since', 'nothing', 'unsure')), title: 'Time limits may matter',
        text: 'Older money claims can be affected by time limits. See an advocate soon.', help: ['l15100'] }
    ],
    lawyerQs: [
      { text: 'Is the claim within the time limit, given the dates and any acknowledgement?' },
      { text: 'Is a cheque-bounce case available, and are the deadlines still open?', when: W('ml_cheque', 'bounced') },
      { text: 'Is a legal notice the right first step?' }
    ]
  });

  /* ---------------- 7. Refund refused ---------------- */
  ISSUES.push({
    id: 'refund-refused', cat: 'shopping', title: 'A seller or service provider refuses a refund',
    short: 'Refund refused',
    synonyms: ['refund', 'refund not given', 'online order not delivered', 'e-commerce', 'order not received', 'wrong product', 'warranty', 'service not provided', 'consumer complaint', 'consumer court', 'flight refund', 'travel refund', 'cancelled booking'],
    intro: 'Consumer complaints depend on what was promised, what you paid, and what went wrong. We will gather each.',
    juris: 'Consumer complaints generally must be filed within two years of the problem arising. Forum depends on the amount claimed.',
    questions: [
      { id: 'rr_what', text: 'What did you pay for?', why: 'Products and services need different records.',
        options: o([['product', 'A product'], ['service', 'A service (repair, course, event, etc.)'], ['travel', 'Travel, flight or hotel booking']]) },
      { id: 'rr_where', text: 'Where did you buy it?', why: 'Online marketplaces keep order records you can download.',
        options: o([['marketplace', 'Online marketplace or app'], ['website', 'Brand\'s own website'], ['shop', 'In a shop'], ['provider', 'Directly from a service provider']]) },
      { id: 'rr_problem', text: 'What went wrong?', type: 'multi', why: 'Each problem needs different proof.',
        options: o([['defective', 'Defective or damaged'], ['notdelivered', 'Not delivered'], ['notasdescribed', 'Not as described'], ['cancelled', 'Cancelled, but refund not given'], ['poorservice', 'Service not provided or poor']]) },
      { id: 'rr_paid', text: 'How did you pay?', why: 'Card payments may also allow a chargeback through your bank.',
        options: o([['upi', 'UPI / bank'], ['card', 'Credit or debit card'], ['cash', 'Cash'], ['emi', 'EMI / pay later']]) },
      { id: 'rr_complained', text: 'Have you complained to the seller?', why: 'Their reply is usually the key document.',
        options: o([['ticket', 'Yes, I have a ticket or email'], ['verbal', 'Only by phone or in person'], ['no', 'Not yet']]) },
      { id: 'rr_when', text: 'When did the problem start?', deep: true, chapter: 'Dates', why: 'Consumer complaints generally have a two-year time limit.',
        options: o([['m6', 'Within 6 months'], ['y2', '6 months to 2 years'], ['older', 'More than 2 years ago']]) },
      { id: 'rr_promise', text: 'Do you have the ad, product page or terms that were shown when you paid?', deep: true, chapter: 'What was promised',
        why: 'Pages change; a copy from the time of purchase shows the promise.', options: o([['yes', 'Yes'], ['no', 'No']]) },
      { id: 'rr_nch', text: 'Have you contacted the National Consumer Helpline (1915)?', deep: true, chapter: 'Complaints',
        why: 'It can mediate before a case, and creates a docket number.', options: o([['yes', 'Yes, I have a docket number'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'rr_e_invoice', name: 'Invoice, bill or order confirmation', fact: 'What you bought, from whom, for how much', why: 'The basic proof of the purchase.',
        where: 'Order history, email, shop bill.', preserve: 'Download the invoice PDF.' },
      { id: 'rr_e_payment', name: 'Payment proof', fact: 'You paid', why: 'Shows the amount and date.', where: 'Bank / card statement, UPI history.', preserve: '', when: W('rr_paid', 'upi', 'card', 'emi') },
      { id: 'rr_e_cashbill', name: 'Cash bill or receipt', fact: 'You paid in cash', why: 'Cash purchases need a bill.', where: 'Your records.', preserve: '', when: W('rr_paid', 'cash') },
      { id: 'rr_e_listing', name: 'The ad, listing, or terms as shown when you paid', fact: 'What was promised', why: 'Shows what you were told.',
        where: 'Screenshots, saved pages, brochures.', preserve: 'If you don\'t have it, save the current page with the date — but note it may have changed.', when: ANY(W('rr_promise', 'yes'), W('rr_problem', 'notasdescribed')) },
      { id: 'rr_e_policy', name: 'Refund, return or cancellation policy', fact: 'The seller\'s own refund terms', why: 'Sellers are expected to follow their stated policy.', where: 'Website, booking confirmation, invoice back.', preserve: '' },
      { id: 'rr_e_defect', name: 'Photos or videos of the defect (and unboxing video if any)', fact: 'The product was defective', why: 'Direct proof of the problem.',
        where: 'Your phone.', preserve: 'Keep original files. Keep the product and packaging — don\'t throw them away.', when: W('rr_problem', 'defective', 'notasdescribed') },
      { id: 'rr_e_delivery', name: 'Tracking history and delivery status', fact: 'Whether it was delivered', why: 'Shows non-delivery or late delivery.', where: 'Order page, courier site.', preserve: 'Screenshot with dates.',
        when: W('rr_problem', 'notdelivered') },
      { id: 'rr_e_cancel', name: 'Cancellation confirmation', fact: 'The order or booking was cancelled', why: 'Shows the refund became due.', where: 'Email, app.', preserve: '',
        when: W('rr_problem', 'cancelled') },
      { id: 'rr_e_job', name: 'Job sheet, service report or booking details', fact: 'What service was promised and done', why: 'Shows the service failure.', where: 'Service provider.', preserve: '',
        when: W('rr_what', 'service', 'travel') },
      { id: 'rr_e_warranty', name: 'Warranty card or warranty terms', fact: 'The product was under warranty', why: 'Warranty claims depend on the period and terms.', where: 'Box, invoice, brand website.', preserve: '',
        when: W('rr_what', 'product') },
      { id: 'rr_e_tickets', name: 'All complaint tickets, emails and replies', fact: 'You complained and the seller refused', why: 'The refusal is usually the key document.',
        where: 'Email, app chat, ticket history.', preserve: 'Save the full thread with dates.', when: W('rr_complained', 'ticket') },
      { id: 'rr_e_writecomplaint', name: 'Make a written complaint to the seller and keep the reply', fact: 'The seller was asked to fix it', why: 'Creates a dated record.',
        where: 'Seller email, app, grievance officer listed on the website.', preserve: '', action: true, when: W('rr_complained', 'verbal', 'no') },
      { id: 'rr_e_nch', name: 'National Consumer Helpline docket number', fact: 'Pre-litigation complaint was made', why: 'Shows you tried to resolve it.', where: 'consumerhelpline.gov.in', preserve: '', when: W('rr_nch', 'yes') },
      { id: 'rr_e_chargeback', name: 'Card dispute / chargeback request to your bank', fact: 'You disputed the charge with your bank', why: 'An additional route for card payments.', where: 'Your card issuer.', preserve: '',
        time: 'Card disputes often have short windows set by the card network — ask your bank.', action: true, when: W('rr_paid', 'card') }
    ],
    urgent: [
      { id: 'rr_u_old', level: 'soon', when: W('rr_when', 'older'), title: 'Check the time limit', text: 'Consumer complaints generally have a two-year limit. Ask an advocate whether yours is still in time.', help: ['nch'] }
    ],
    lawyerQs: [
      { text: 'Which consumer commission has jurisdiction for this amount, and should I file on e-Jagriti?' },
      { text: 'What compensation can I ask for besides the refund?' },
      { text: 'Is the complaint within the two-year limit?', when: W('rr_when', 'older', 'y2') }
    ]
  });

  /* ---------------- 8. Divorce or separation (sensitive) ---------------- */
  ISSUES.push({
    id: 'divorce-separation', cat: 'family', title: 'Divorce or separation', short: 'Divorce or separation', sensitive: true,
    synonyms: ['divorce', 'separation', 'mutual divorce', 'mutual consent', 'contested divorce', 'husband wants divorce', 'wife wants divorce', 'judicial separation', 'talaq', 'khula', 'marriage problem', 'stridhan', 'custody'],
    intro: 'You can stop at any time. Your safety matters more than finishing. Questions about religion or marriage type are only asked because different laws apply.',
    juris: 'Grounds and procedure depend on the personal law or the Special Marriage Act that applies, and on where you live.',
    questions: [
      { id: 'dv_safe', text: 'First: are you safe right now?', sensitive: true, why: 'If you are in danger, getting help comes before any checklist.',
        options: o([['safe', 'Yes, I am safe'], ['threat', 'I have been threatened'], ['danger', 'I am in danger now'], PN]) },
      { id: 'dv_role', text: 'Which best describes your situation?', why: 'The papers depend on who is starting the process.',
        options: o([['me', 'I want a divorce or separation'], ['spouse', 'My spouse wants it'], ['both', 'We both want it'], ['filed', 'My spouse has already filed a case or sent a notice']]) },
      { id: 'dv_agree', text: 'Do you both agree on the divorce and its terms (money, children, belongings)?', why: 'Mutual-consent cases need a settlement record. Contested cases need evidence of grounds.',
        options: o([['all', 'Yes, on everything'], ['divorce_only', 'On divorce, but not on the terms'], ['no', 'No'], NS]) },
      { id: 'dv_marriage', text: 'How was the marriage performed or registered?', sensitive: true, why: 'Different laws apply depending on this. Choose "prefer not to say" if you wish.',
        options: o([['hindu', 'Hindu, Sikh, Jain or Buddhist rites'], ['nikah', 'Nikah'], ['church', 'Church / Christian'], ['sma', 'Registered under the Special Marriage Act'], ['other', 'Other'], PN]) },
      { id: 'dv_cert', text: 'Do you have a marriage certificate?', why: 'If not, other records can show the marriage.',
        options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'dv_children', text: 'Do you have children together?', why: 'Children\'s needs and arrangements require separate records.',
        options: o([['none', 'No'], ['with_me', 'Yes, living with me'], ['with_spouse', 'Yes, living with my spouse'], ['shared', 'Yes, time is shared']]) },
      { id: 'dv_separated', text: 'Are you living separately?', deep: true, chapter: 'Separation',
        why: 'The date of separation can matter, especially for mutual consent.', options: o([['exact', 'Yes, I know the date'], ['approx', 'Yes, roughly'], ['no', 'No, same home']]) },
      { id: 'dv_issues', text: 'What else needs to be resolved?', type: 'multi', deep: true, chapter: 'What needs resolving',
        why: 'Each issue has its own records. Pick all that apply.', options: o([['maintenance', 'Maintenance / financial support'], ['custody', 'Children\'s custody or visits'], ['stridhan', 'Stridhan, jewellery or gifts'], ['property', 'Jointly owned property'], ['residence', 'Where I will live'], ['none', 'Nothing else']]) },
      { id: 'dv_existing', text: 'Are there any existing notices, complaints or court cases?', type: 'multi', deep: true, chapter: 'Existing cases',
        why: 'Existing cases have dates that must not be missed.', options: o([['notice', 'Legal notice'], ['court', 'Court case'], ['police', 'Police complaint'], ['none', 'None']]) },
      { id: 'dv_violence', text: 'Has there been violence, threats or dowry demands?', sensitive: true, deep: true, chapter: 'Safety',
        why: 'This can open protection remedies and needs careful, safe record keeping.', options: o([['yes', 'Yes'], ['no', 'No'], PN]) },
      { id: 'dv_income', text: 'Do you have any lawful record of your spouse\'s income or assets?', deep: true, chapter: 'Money',
        why: 'Maintenance depends on both sides\' income.', when: W('dv_issues', 'maintenance'),
        options: o([['docs', 'Yes, documents'], ['partly', 'I know some details'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'dv_e_cert', name: 'Marriage certificate', fact: 'The marriage and its date', why: 'Basic proof of the marriage.', where: 'Your records or the registrar\'s office.', preserve: '', when: W('dv_cert', 'yes') },
      { id: 'dv_e_altproof', name: 'Other proof of the marriage (wedding photos, invitation card, ceremony receipts, joint documents)', fact: 'The marriage took place', why: 'Used when there is no certificate.',
        where: 'Family albums, invitations, joint bank or ID records.', preserve: '', limit: 'Your advocate will advise whether registration is needed.', when: W('dv_cert', 'no', 'unsure') },
      { id: 'dv_e_ids', name: 'ID and address proof for both of you', fact: 'Identity and residence', why: 'Residence affects which court can hear the case.', where: 'Your records.', preserve: '' },
      { id: 'dv_e_settlement', name: 'Any written settlement or draft terms', fact: 'What has been agreed', why: 'Mutual-consent petitions record the agreed terms.', where: 'Your records.', preserve: 'Do not sign anything final without advice.',
        when: W('dv_agree', 'all', 'divorce_only') },
      { id: 'dv_e_sepdate', name: 'Proof of the date you started living apart (rent agreement, letters, messages)', fact: 'When separation began', why: 'Separation periods can matter.',
        where: 'Rent agreement, utility bills, messages.', preserve: '', when: W('dv_separated', 'exact', 'approx') },
      { id: 'dv_e_children', name: 'Children\'s birth certificates, school and medical records', fact: 'Children\'s details and needs', why: 'Needed for custody and support.',
        where: 'Your records, school, hospital.', preserve: '', when: W('dv_children', 'with_me', 'with_spouse', 'shared') },
      { id: 'dv_e_care', name: 'Records of who takes care of the children day to day', fact: 'The children\'s current care arrangement', why: 'Courts focus on the child\'s welfare.',
        where: 'School communications, fee receipts, medical visits.', preserve: '', when: ANY(W('dv_children', 'with_me', 'with_spouse', 'shared'), W('dv_issues', 'custody')) },
      { id: 'dv_e_income', name: 'Your own income proof (salary slips, ITR, bank statements)', fact: 'Your income', why: 'Maintenance considers both sides. Courts often require an affidavit of income and assets.',
        where: 'Employer, income-tax portal, bank.', preserve: '', when: ANY(W('dv_issues', 'maintenance'), W('dv_agree', 'divorce_only', 'no')) },
      { id: 'dv_e_spouseincome', name: 'Lawfully held records of your spouse\'s income or assets', fact: 'Your spouse\'s means', why: 'Supports a maintenance claim.',
        where: 'Documents you already have lawful access to.', preserve: LAWFUL, when: W('dv_income', 'docs', 'partly') },
      { id: 'dv_e_expenses', name: 'List of monthly expenses with bills (rent, school, medical, household)', fact: 'What you and the children need', why: 'Maintenance is based on reasonable needs.',
        where: 'Bills, receipts, bank statements.', preserve: '', when: W('dv_issues', 'maintenance', 'custody') },
      { id: 'dv_e_stridhan', name: 'List of stridhan, jewellery and gifts, with photos or bills', fact: 'What belongs to you and where it is', why: 'Supports a claim to return them.',
        where: 'Wedding photos, jewellery bills, gift lists.', preserve: 'Make the list now while you remember.', when: W('dv_issues', 'stridhan') },
      { id: 'dv_e_property', name: 'Property papers for jointly owned property and loan records', fact: 'Who owns what', why: 'Needed to divide or protect property.', where: 'Sale deed, loan statements.', preserve: '',
        when: W('dv_issues', 'property') },
      { id: 'dv_e_existing', name: 'All notices, complaints, court papers and orders received', fact: 'What proceedings exist', why: 'Existing cases have deadlines.',
        where: 'Your records, the envelope with postal date.', preserve: 'Keep envelopes — the delivery date can matter.', time: 'Court dates and response periods may apply.', when: W('dv_existing', 'notice', 'court', 'police') },
      { id: 'dv_e_respondpapers', name: 'The petition or notice your spouse sent, with the date you received it', fact: 'The case against you', why: 'Response deadlines run from receipt.',
        where: 'Your records.', preserve: '', time: 'Show this to an advocate promptly.', when: W('dv_role', 'filed') },
      { id: 'dv_e_violence', name: 'Records of violence or threats (medical records, photos, complaints, messages) — kept safely', fact: 'Violence, threats or dowry demands', why: 'Supports protection orders and related claims.',
        where: 'Hospital, police, your phone.', preserve: 'Keep copies somewhere your spouse cannot access (e.g. with a trusted person). Do not put yourself at risk to collect them.', when: W('dv_violence', 'yes') },
      { id: 'dv_e_comms', name: 'Relevant messages and emails between you (complete threads)', fact: 'What was said', why: 'May show agreements, demands or conduct.', where: 'Your own phone and email.', preserve: LAWFUL }
    ],
    urgent: [
      { id: 'dv_u_danger', level: 'now', when: W('dv_safe', 'danger'), title: 'Please get help now',
        text: 'If you are in danger, call 112. You do not need to finish this list.', help: ['e112', 'w181', 'l15100'] },
      { id: 'dv_u_threat', level: 'soon', when: ANY(W('dv_safe', 'threat'), W('dv_violence', 'yes')), title: 'Protection is available',
        text: 'Protection officers and courts can issue protection and residence orders. Legal aid can help you quickly.', help: ['w181', 'l15100'] },
      { id: 'dv_u_filed', level: 'soon', when: W('dv_role', 'filed'), title: 'A case has been filed — check the dates',
        text: 'See an advocate soon so a hearing or reply date is not missed.', help: ['l15100'] }
    ],
    lawyerQs: [
      { text: 'Which law applies to my marriage, and which court can hear the case?' },
      { text: 'Is mutual consent possible here, and how long would it take?', when: W('dv_agree', 'all', 'divorce_only') },
      { text: 'What interim maintenance or custody arrangements can be asked for?', when: W('dv_issues', 'maintenance', 'custody') },
      { text: 'How can I get protection or residence orders?', when: ANY(W('dv_safe', 'threat', 'danger'), W('dv_violence', 'yes')) }
    ]
  });

  /* ---------------- 9. Maintenance ---------------- */
  ISSUES.push({
    id: 'maintenance', cat: 'family', title: 'Maintenance or financial support', short: 'Maintenance or support', sensitive: true,
    synonyms: ['maintenance', 'alimony', 'financial support', 'husband not giving money', 'child support', 'parents maintenance', 'senior citizen maintenance', 'elderly parents', 'support order not paid'],
    intro: 'Maintenance depends on need and the other side\'s means. We will help you gather proof of both.',
    juris: 'Spouses, children and parents can claim under different laws (including the BNSS, personal laws, the Domestic Violence Act, and the senior citizens\' maintenance law).',
    questions: [
      { id: 'mt_who', text: 'Who needs support, or who is being asked to pay?', why: 'Different people use different laws and forums.',
        options: o([['spouse', 'Me, from my spouse'], ['child', 'My child'], ['parent', 'Me, as a parent, from my children'], ['payer', 'I have been asked to pay']]) },
      { id: 'mt_safe', text: 'Are you safe where you are living?', sensitive: true, why: 'Safety comes first.', when: W('mt_who', 'spouse', 'parent'),
        options: o([['safe', 'Yes'], ['unsafe', 'No, I feel unsafe'], PN]) },
      { id: 'mt_order', text: 'Is there already a maintenance order or case?', why: 'Unpaid orders are enforced differently from new claims.',
        options: o([['unpaid', 'There is an order, but it is not being paid'], ['pending', 'A case is pending'], ['none', 'No']]) },
      { id: 'mt_payer_income', text: 'Do you have any lawful record of the paying person\'s income or assets?', why: 'The amount depends heavily on their means.',
        when: NOT(W('mt_who', 'payer')), options: o([['docs', 'Yes, documents'], ['some', 'I know some details'], ['no', 'No']]) },
      { id: 'mt_own_income', text: 'Do you have your own income?', why: 'Courts consider the income of both sides.',
        options: o([['none', 'No income'], ['some', 'Some, irregular'], ['regular', 'Regular income']]) },
      { id: 'mt_expenses', text: 'Do you have records of regular expenses?', deep: true, chapter: 'Expenses', why: 'Bills show what support is needed.',
        options: o([['yes', 'Yes'], ['partly', 'Some'], ['no', 'No']]) },
      { id: 'mt_property', text: 'Did you transfer property to the child or relative from whom you seek support?', deep: true, chapter: 'Property',
        why: 'In some cases, a transfer made on the promise of care can be challenged.', when: W('mt_who', 'parent'), options: o([['yes', 'Yes'], ['no', 'No']]) },
      { id: 'mt_paid_already', text: 'Have you been paying anything already?', deep: true, chapter: 'Payments', when: W('mt_who', 'payer'),
        why: 'Past payments may be adjusted.', options: o([['yes', 'Yes, with records'], ['cash', 'Yes, in cash'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'mt_e_relation', name: 'Proof of the relationship (marriage certificate, birth certificate)', fact: 'You are entitled to claim', why: 'The starting point of any claim.', where: 'Your records.', preserve: '' },
      { id: 'mt_e_order', name: 'The maintenance order and the record of payments received or missed', fact: 'How much is unpaid', why: 'Needed to recover arrears.',
        where: 'Court papers, bank statement.', preserve: 'Make a month-by-month table of what was due and what was paid.', when: W('mt_order', 'unpaid') },
      { id: 'mt_e_case', name: 'Papers in the pending case and the next date', fact: 'Status of the existing case', why: 'Keeps you prepared for the next hearing.', where: 'Your advocate or the court.', preserve: '', when: W('mt_order', 'pending') },
      { id: 'mt_e_payerincome', name: 'Records of the paying person\'s income, job, business, property or lifestyle', fact: 'Their means to pay', why: 'The amount depends on their means.',
        where: 'Documents you already hold lawfully (old salary slips, property papers, public business listings).', preserve: LAWFUL, when: W('mt_payer_income', 'docs', 'some') },
      { id: 'mt_e_ownincome', name: 'Your own income proof, or a note that you have none', fact: 'Your financial position', why: 'Courts often require both sides to disclose income and assets in an affidavit.',
        where: 'Salary slips, ITR, bank statements.', preserve: '' },
      { id: 'mt_e_expenses', name: 'Monthly expense records (rent, food, school fees, medical bills, loan EMIs)', fact: 'Your reasonable needs', why: 'Supports the amount claimed.',
        where: 'Bills, receipts, statements.', preserve: '' },
      { id: 'mt_e_children', name: 'Children\'s school fee receipts and medical records', fact: 'Children\'s needs', why: 'Children\'s costs are considered separately.', where: 'School, hospital.', preserve: '',
        when: W('mt_who', 'child', 'spouse') },
      { id: 'mt_e_refusal', name: 'Messages showing support was refused or stopped', fact: 'Neglect or refusal to maintain', why: 'Shows the need to approach the court.', where: 'Your phone.', preserve: 'Export the complete chat.',
        when: NOT(W('mt_who', 'payer')) },
      { id: 'mt_e_transfer', name: 'The gift or transfer deed and any record of the promise of care', fact: 'Property was transferred on a promise of care', why: 'May support a claim to undo the transfer.',
        where: 'Sub-registrar office, your records.', preserve: '', when: W('mt_property', 'yes') },
      { id: 'mt_e_payerdocs', name: 'Your income, liabilities, other dependants and payments already made', fact: 'Your ability to pay', why: 'The court will weigh your means and obligations.',
        where: 'Salary slips, loan statements, bank records.', preserve: '', when: W('mt_who', 'payer') },
      { id: 'mt_e_pastpay', name: 'Proof of payments already made', fact: 'What you have already paid', why: 'May be adjusted against claims.', where: 'Bank statement, receipts.', preserve: '',
        when: W('mt_paid_already', 'yes', 'cash') }
    ],
    urgent: [
      { id: 'mt_u_unsafe', level: 'now', when: W('mt_safe', 'unsafe'), title: 'Your safety comes first', text: 'If you are in danger, call 112. Women can call 181; older persons can call 14567.', help: ['e112', 'w181', 's14567'] },
      { id: 'mt_u_parent', level: 'info', when: W('mt_who', 'parent'), title: 'Help for older persons', text: 'Maintenance Tribunals hear claims by parents and senior citizens. Elderline (14567) can guide you.', help: ['s14567', 'l15100'] }
    ],
    lawyerQs: [
      { text: 'Which law and forum should I use, and can I ask for interim maintenance?' },
      { text: 'How can the unpaid amount be recovered?', when: W('mt_order', 'unpaid') },
      { text: 'Can the property transfer be challenged?', when: W('mt_property', 'yes') }
    ]
  });

  /* ---------------- General preparation (fallback for all other matters) ---------------- */
  const GENERAL = {
    id: 'general', cat: 'other', title: 'General preparation for any legal problem', short: 'General preparation',
    synonyms: [], general: true,
    intro: 'A detailed guide for this problem is not ready yet. These general questions still help you prepare for an advocate.',
    juris: 'This is a general checklist. Your advocate will tell you which records matter for your specific problem.',
    questions: [
      { id: 'g_role', text: 'Are you the person raising the problem, or responding to someone else?', why: 'People responding to a claim need the papers they received.',
        options: o([['claimant', 'I am raising it'], ['respondent', 'Someone has made a claim or complaint against me'], NS]) },
      { id: 'g_notice', text: 'Have you received any notice, summons or court papers?', why: 'Notices often have deadlines.',
        options: o([['deadline', 'Yes, with a date or deadline'], ['yes', 'Yes, no date that I can see'], ['no', 'No']]) },
      { id: 'g_custody', text: 'Is anyone in police custody, or do you fear arrest?', sensitive: true, why: 'Custody and arrest need a lawyer immediately.',
        options: o([['custody', 'Someone is in custody'], ['fear', 'I fear arrest'], ['no', 'No']]) },
      { id: 'g_money', text: 'Is money involved?', why: 'Payment records then become central.', options: o([['yes', 'Yes'], ['no', 'No']]) },
      { id: 'g_written', text: 'Is there any agreement, receipt or official document about it?', why: 'Written terms are usually the first thing an advocate asks for.',
        options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'g_comms', text: 'Are there messages, emails or calls about the problem?', why: 'Communications show what was said and when.', options: o([['yes', 'Yes'], ['no', 'No']]) },
      { id: 'g_others', text: 'Who else may hold records about it?', type: 'multi', deep: true, chapter: 'Records held by others',
        why: 'Your advocate can advise how to request them lawfully.', options: o([['bank', 'A bank'], ['employer', 'An employer'], ['govt', 'A government office'], ['otherparty', 'The other side'], ['none', 'Nobody / not sure']]) },
      { id: 'g_when', text: 'When did the problem start?', deep: true, chapter: 'Dates', why: 'Many claims have time limits.',
        options: o([['m1', 'Within the last month'], ['y1', 'Within the last year'], ['y3', '1 to 3 years ago'], ['older', 'More than 3 years ago']]) }
    ],
    evidence: [
      { id: 'g_e_notice', name: 'The notice, summons or court papers, with the envelope', fact: 'What has been demanded and by when', why: 'Deadlines often run from the date of receipt.',
        where: 'Your post or email.', preserve: 'Keep the envelope; note the date you received it.', time: 'Check for a date to reply or appear.', when: W('g_notice', 'deadline', 'yes') },
      { id: 'g_e_written', name: 'Agreements, receipts or official documents', fact: 'What was agreed or decided', why: 'Usually the first thing an advocate reviews.', where: 'Your records.', preserve: 'Keep originals; bring copies.',
        when: W('g_written', 'yes', 'unsure') },
      { id: 'g_e_money', name: 'Payment records (statements, receipts, UPI history)', fact: 'What was paid, when, and to whom', why: 'Proves amounts and dates.', where: 'Bank, UPI app, receipts.', preserve: '', when: W('g_money', 'yes') },
      { id: 'g_e_comms', name: 'Complete messages and emails about the problem', fact: 'What was said and when', why: 'Shows promises, admissions or demands.', where: 'Your phone and email.', preserve: 'Export complete chats; do not delete or edit.',
        when: W('g_comms', 'yes') },
      { id: 'g_e_ids', name: 'Your ID and address proof, and the other side\'s name and address', fact: 'Who the parties are', why: 'Needed for any notice or case.', where: 'Your records.', preserve: '' },
      { id: 'g_e_timeline', name: 'A short written timeline of what happened', fact: 'The order of events', why: 'Saves time in the first meeting.', where: 'Use "My timeline" in this tool.', preserve: '', action: true },
      { id: 'g_e_others', name: 'List of records held by others, and who holds them', fact: 'What may need to be requested', why: 'Your advocate can advise how to obtain them lawfully.', where: '—', preserve: '', holder: 'others',
        when: W('g_others', 'bank', 'employer', 'govt', 'otherparty') }
    ],
    urgent: [
      { id: 'g_u_custody', level: 'now', when: W('g_custody', 'custody', 'fear'), title: 'Contact an advocate or legal aid now',
        text: 'If someone is in custody or you fear arrest, speak to an advocate immediately. Free legal aid is available on 15100.', help: ['l15100', 'e112'] },
      { id: 'g_u_deadline', level: 'soon', when: W('g_notice', 'deadline'), title: 'There is a deadline', text: 'Show the notice to an advocate before the date on it.', help: ['l15100'] }
    ],
    lawyerQs: [
      { text: 'What type of legal problem is this, and which law applies?' },
      { text: 'Are there any deadlines or time limits I should know about?' },
      { text: 'Which records are most important for my situation?' }
    ]
  };
  ISSUES.push(GENERAL);

  /* ---------- Directory of other problems (routed to general preparation for now) ---------- */
  const D = (cat, title, syn = [], urgentNote = null) => ({ cat, title, synonyms: syn, route: 'general', urgentNote });
  const DIRECTORY = [
    D('family', 'Marriage registration', ['marriage certificate', 'register marriage']),
    D('family', 'Guardianship or adoption', ['adoption', 'guardian']),
    D('family', 'Elderly parent neglect', ['parents neglected', 'senior citizen'], 'Older persons can call Elderline 14567.'),
    D('money', 'Digital lending app dispute', ['loan app', 'instant loan app']),
    D('money', 'Cooperative society deposit not returned', ['cooperative bank', 'society deposit']),
    D('money', 'Disputed guarantee', ['guarantor']),
    D('shopping', 'Telecom or internet service dispute', ['mobile bill', 'broadband']),
    D('shopping', 'Subscription or auto-debit problem', ['auto debit', 'subscription cancel']),
    D('home', 'Boundary or access dispute', ['boundary', 'pathway', 'easement']),
    D('home', 'Will dispute', ['will challenged', 'fake will']),
    D('home', 'Sale deed or property purchase fraud', ['sale deed', 'property fraud']),
    D('home', 'Housing society or RWA dispute', ['society', 'rwa', 'maintenance charges']),
    D('police', 'Threats, assault or extortion', ['threat', 'assault', 'extortion', 'blackmail'], 'If you are in danger, call 112.'),
    D('work', 'Provident fund or gratuity', ['pf', 'epf', 'gratuity']),
    D('work', 'Notice period or resignation dispute', ['notice period', 'relieving letter', 'resignation']),
    D('accidents', 'Hospital billing or medical records refused', ['hospital bill', 'medical records']),
    D('accidents', 'Alleged medical negligence', ['medical negligence', 'doctor mistake']),
    D('accidents', 'Workplace injury', ['injury at work']),
    D('other', 'Unpaid invoice or business payment', ['invoice', 'client not paying', 'msme payment']),
    D('other', 'Breach of contract', ['contract breach', 'agreement broken']),
    D('other', 'Partnership dispute', ['partner', 'partnership']),
    D('other', 'Defamation', ['defamation', 'false allegations online']),
    D('other', 'Government certificate, ID or pension problem', ['certificate', 'pension', 'aadhaar', 'ration card', 'name correction']),
    D('other', 'RTI (Right to Information) request', ['rti']),
    D('other', 'School, college or exam dispute', ['college fee refund', 'exam result', 'certificate withheld'])
  ];

  const KB = { version: KB_VERSION, reviewed: REVIEWED, help: HELP, categories: CATEGORIES, issues: ISSUES, directory: DIRECTORY, questions: [], myths: [] };
  root.ER_KB = KB;
  root.ER_H = { W, ALL, ANY, NOT, ANS, o, NS, PN, LAWFUL };
})(globalThis);
