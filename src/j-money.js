/* Money & banking journeys (draft, not advocate-reviewed). */
(function (root) {
  const { W, ALL, ANY, NOT, ANS, o, NS, PN, LAWFUL } = root.ER_H;
  const I = root.ER_KB.issues;

  /* ---------------- Cheque bounce (both sides) ---------------- */
  I.push({
    id: 'cheque-bounce', cat: 'money', title: 'A cheque bounced — I gave it or I received it', short: 'Cheque bounce',
    synonyms: ['cheque bounce', 'cheque bounced', 'cheque dishonour', 'cheque return', 'section 138', '138 notice', 'insufficient funds', 'funds insufficient', 'cheque case', 'ni act'],
    intro: 'Cheque cases run on strict deadlines. We\'ll find out which side you are on and which dates matter.',
    juris: 'Cheque dishonour is a criminal complaint under Section 138 of the Negotiable Instruments Act. Deadlines are counted from specific events, so exact dates matter.',
    tips: [
      'Most cheque complaints must be filed in the court where the payee keeps the account the cheque was presented through.',
      'Many districts hold special Lok Adalats for cheque cases. A settlement there is final.',
      'A court can order the accused to pay interim compensation of up to 20% of the cheque amount while the case runs.'
    ],
    questions: [
      { id: 'cb_side', text: 'Which side are you on?', chapter: 'Your side', why: 'The person who received the cheque and the person who issued it need completely different records.',
        options: o([['payee', 'I received the cheque and it bounced'], ['drawer', 'I issued the cheque and it bounced'], ['drawer_notice', 'I issued it and got a legal notice or court summons']]) },
      { id: 'cb_reason', text: 'What reason is written on the bank\'s return memo?', chapter: 'The cheque', why: '"Funds insufficient" and "exceeds arrangement" usually support a case. Signature or account-closed reasons need a closer look.',
        options: o([['funds', 'Funds insufficient / exceeds arrangement'], ['stopped', 'Payment stopped by drawer'], ['closed', 'Account closed'], ['signature', 'Signature differs / other technical reason'], ['nomemo', 'No memo yet'], NS]) },
      { id: 'cb_memo_when', text: 'When did the bank tell you the cheque bounced?', chapter: 'The clock', when: W('cb_side', 'payee'),
        why: 'A written demand notice must usually be sent within 30 days of learning about the dishonour.',
        options: o([['d15', 'Within the last 15 days'], ['d30', '15 to 30 days ago'], ['over30', 'More than 30 days ago'], NS]) },
      { id: 'cb_notice_sent', text: 'Have you sent a written demand notice to the person who issued it?', chapter: 'The clock', when: W('cb_side', 'payee'),
        why: 'Without a notice sent in time, a cheque-bounce complaint usually cannot proceed.',
        options: o([['yes', 'Yes'], ['no', 'Not yet']]) },
      { id: 'cb_notice_days', text: 'How long ago was the notice delivered?', chapter: 'The clock', when: W('cb_notice_sent', 'yes'),
        why: 'After delivery the issuer gets 15 days to pay. The complaint is then due within one month.',
        options: o([['under15', 'Less than 15 days ago'], ['d15_45', '15 to 45 days ago'], ['over45', 'More than 45 days ago'], ['undelivered', 'It came back undelivered or refused'], NS]) },
      { id: 'cb_purpose', text: 'Why was the cheque given?', chapter: 'The debt', why: 'The law presumes a cheque was for a debt, but the issuer can try to disprove this. The reason matters for both sides.',
        options: o([['loan', 'Repayment of a loan'], ['goods', 'Payment for goods or services'], ['security', 'As "security" for a loan or deal'], ['blank', 'Signed blank cheque given earlier'], ['other', 'Something else']]) },
      { id: 'cb_amount', text: 'Roughly how much is the cheque for?', chapter: 'The debt', why: 'The amount affects fees and the interim compensation a court can order.',
        options: o([['small', 'Up to ₹50,000'], ['mid', '₹50,000 to ₹5 lakh'], ['large', 'More than ₹5 lakh']]) },
      { id: 'cb_summons', text: 'What have you received?', chapter: 'Papers', when: W('cb_side', 'drawer_notice'), type: 'multi',
        why: 'A notice gives you a chance to pay within 15 days. A court summons means a case is already filed.',
        options: o([['notice', 'A legal (demand) notice'], ['summons', 'A court summons'], ['warrant', 'A warrant'], NS]) },
      { id: 'cb_dispute', text: 'Do you dispute that you owed this amount?', chapter: 'Papers', when: W('cb_side', 'drawer', 'drawer_notice'),
        why: 'If the money was already paid, not owed, or the cheque was misused, records proving that become central.',
        options: o([['owe', 'No, I owe it'], ['partpaid', 'I have already paid part or all of it'], ['notowed', 'I never owed this amount'], ['misused', 'The cheque was given as security or misused']]) },
      { id: 'cb_other_cheques', text: 'Were other cheques or payments part of the same deal?', deep: true, chapter: 'Money trail',
        why: 'Several cheques can mean several complaints, and earlier payments affect the amount due.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'cb_written', text: 'Is there a written agreement, invoice or message about the underlying debt?', deep: true, chapter: 'Money trail',
        why: 'Written proof of the debt strengthens the payee and is what the issuer will try to answer.', options: o([['yes', 'Yes'], ['messages', 'Only messages'], ['no', 'No']]) },
      { id: 'cb_settle', text: 'Is either side open to settling?', deep: true, chapter: 'Way forward',
        why: 'Cheque cases can be compounded (settled) at any stage. Courts encourage early settlement.', options: o([['yes', 'Yes'], ['maybe', 'Maybe'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'cb_e_cheque', name: 'The original cheque', fact: 'The cheque that was dishonoured', why: 'The court will need to see the original.', where: 'Your bank returns it with the memo.',
        preserve: 'Keep the original flat and safe. Do not write on it. Give the advocate copies until asked.', when: W('cb_side', 'payee') },
      { id: 'cb_e_memo', name: 'Bank return memo (cheque return slip)', fact: 'Date and reason of dishonour', why: 'Starts the 30-day clock and shows the reason.',
        where: 'Your bank, along with the returned cheque.', preserve: 'Note the date you actually received it.', time: 'The demand notice is usually due within 30 days of receiving information of dishonour.', when: W('cb_side', 'payee') },
      { id: 'cb_e_passbook', name: 'Bank statement showing the cheque deposit and its return', fact: 'The cheque was presented in time', why: 'Shows the cheque was presented within its validity (generally 3 months from its date).',
        where: 'Net banking or branch.', preserve: '', when: W('cb_side', 'payee') },
      { id: 'cb_e_noticeact', name: 'Send a written demand notice (through an advocate) and keep proof of dispatch', fact: 'Statutory notice was given', why: 'A complaint usually cannot proceed without it.',
        where: 'An advocate usually drafts it. Send by speed post / registered post (and email or WhatsApp if known).', preserve: 'Keep postal receipts and tracking printouts.', action: true,
        time: 'Within 30 days of learning about the bounce.', when: ALL(W('cb_side', 'payee'), W('cb_notice_sent', 'no')) },
      { id: 'cb_e_notice', name: 'Copy of the demand notice, postal receipts and delivery tracking', fact: 'When the notice was delivered', why: 'Delivery date starts the 15-day payment window and then the one-month window to file.',
        where: 'Your advocate, post office tracking.', preserve: 'Keep any returned envelope unopened — it may itself be evidence.', when: W('cb_notice_sent', 'yes') },
      { id: 'cb_e_debt', name: 'Proof of the underlying debt (loan transfer, invoice, agreement, ledger)', fact: 'The cheque was for a legally enforceable debt', why: 'The presumption of debt can be challenged; independent proof helps.',
        where: 'Your bank statements, invoices, agreements, account books.', preserve: '', when: W('cb_side', 'payee') },
      { id: 'cb_e_msgs', name: 'Messages where the issuer admits the debt or promises payment', fact: 'The debt was acknowledged', why: 'Admissions are strong evidence.', where: 'WhatsApp, SMS, email.',
        preserve: 'Export full chats; keep the phone.', when: ANY(W('cb_side', 'payee'), W('cb_written', 'messages', 'yes')) },
      { id: 'cb_e_party', name: 'Issuer\'s full name, address, and account bank branch', fact: 'Who is liable', why: 'Needed for notice and complaint.', where: 'Cheque, your records.', preserve: '', when: W('cb_side', 'payee') },
      { id: 'cb_e_company', name: 'Company details and names of directors/partners who sign', fact: 'Who is responsible when a company issued the cheque', why: 'Those in charge of the company may also be made accused.',
        where: 'MCA company search, letterhead, invoices.', preserve: '', when: W('cb_purpose', 'goods') },
      { id: 'cb_e_recvnotice', name: 'The notice or summons you received, with its envelope', fact: 'What you are being asked to do and by when', why: 'Paying within 15 of receiving the notice usually ends the matter.',
        where: 'Your post.', preserve: 'Note the date you received it.', time: 'You usually have 15 days from receiving a demand notice to pay.', when: W('cb_side', 'drawer_notice') },
      { id: 'cb_e_paid', name: 'Proof of payments already made towards this debt', fact: 'The amount was not (fully) owed', why: 'Reduces or disproves the liability.', where: 'Bank statements, receipts.', preserve: '',
        when: W('cb_dispute', 'partpaid') },
      { id: 'cb_e_security', name: 'Records showing the cheque was given as security, or the deal it related to', fact: 'Purpose of the cheque', why: 'Whether a "security" cheque can be the basis of a case depends on whether a debt existed when it was presented.',
        where: 'Agreement, loan papers, messages at the time.', preserve: '', limit: 'Security cheques can still lead to liability if a debt was due on the date of presentation.', when: ANY(W('cb_dispute', 'misused', 'notowed'), W('cb_purpose', 'security', 'blank')) },
      { id: 'cb_e_drawerdeal', name: 'Papers about the deal behind the cheque (agreement, invoices, loan papers, messages)', fact: 'Why the cheque was given', why: 'Your defence or settlement depends on what was actually owed.',
        where: 'Your records.', preserve: 'Do not delete or edit messages.', when: W('cb_side', 'drawer', 'drawer_notice') },
      { id: 'cb_e_plan', name: 'A realistic payment or settlement proposal, with proof of what you can pay', fact: 'Ability to settle', why: 'Paying within the notice period, or settling later, can end the case.',
        where: 'Your bank statements and income records.', preserve: '', action: true, when: ALL(W('cb_side', 'drawer', 'drawer_notice'), ANY(W('cb_dispute', 'owe', 'partpaid'), W('cb_settle', 'yes', 'maybe'))) },
      { id: 'cb_e_myacct', name: 'Your account statement around the cheque date', fact: 'Your account position', why: 'Shows balance, stop-payment instructions or closure.', where: 'Net banking.', preserve: '', when: W('cb_side', 'drawer', 'drawer_notice') },
      { id: 'cb_e_others', name: 'List of all cheques, dates, amounts and payments in the deal', fact: 'The full money trail', why: 'Avoids confusion over amounts and multiple cases.', where: 'Your records.', preserve: '', action: true, when: W('cb_other_cheques', 'yes') }
    ],
    urgent: [
      { id: 'cb_u_clock', level: 'now', when: ALL(W('cb_side', 'payee'), W('cb_memo_when', 'd15', 'd30', 'unsure'), NOT(W('cb_notice_sent', 'yes'))), title: 'Your 30-day notice window is running',
        text: 'A written demand notice usually has to go within 30 days of learning about the bounce. See an advocate now; finish this list after.', help: ['l15100'] },
      { id: 'cb_u_file', level: 'now', when: W('cb_notice_days', 'd15_45'), title: 'The filing window may be open now',
        text: 'If 15 days have passed since delivery without payment, the complaint is usually due within one month. Speak to an advocate this week.', help: ['l15100'] },
      { id: 'cb_u_late', level: 'soon', when: ANY(W('cb_memo_when', 'over30'), W('cb_notice_days', 'over45')), title: 'A deadline may have passed',
        text: 'Late notices or complaints can sometimes be excused for good reason, and a civil recovery suit may still be possible. Ask an advocate.', help: ['l15100'] },
      { id: 'cb_u_drawer', level: 'now', when: W('cb_summons', 'summons', 'warrant'), title: 'A court case is already filed',
        text: 'Appear on the date in the summons, with an advocate. Ignoring a summons can lead to a warrant.', help: ['l15100'] },
      { id: 'cb_u_15', level: 'soon', when: W('cb_summons', 'notice'), title: 'You may have 15 days to respond',
        text: 'Paying within 15 days of receiving the notice usually prevents a case. If you dispute the debt, reply through an advocate.', help: ['l15100'] }
    ],
    lawyerQs: [
      { text: 'Are all the Section 138 deadlines met, and where should the complaint be filed?', when: W('cb_side', 'payee') },
      { text: 'Should we also file a civil suit for recovery?', when: W('cb_side', 'payee') },
      { text: 'Can I rebut the presumption of debt with my records?', when: W('cb_dispute', 'notowed', 'misused', 'partpaid') },
      { text: 'Should I settle, and how do I compound the case?', when: W('cb_settle', 'yes', 'maybe') }
    ]
  });

  /* ---------------- Loan / EMI / recovery ---------------- */
  I.push({
    id: 'loan-recovery', cat: 'money', title: 'Loan or EMI trouble — recovery calls, bank notices, settlement', short: 'Loan, EMI and recovery',
    synonyms: ['loan recovery', 'recovery agent', 'recovery agents harassment', 'emi bounce', 'emi default', 'npa', 'sarfaesi', '13(2) notice', 'bank notice loan', 'loan settlement', 'one time settlement', 'ots', 'loan app harassment', 'instant loan app', 'digital lending', 'home loan', 'personal loan', 'noc not given'],
    intro: 'Borrowers have rights even when they have fallen behind. We\'ll sort out what stage you are at and what records protect you.',
    juris: 'RBI rules govern recovery conduct and digital lending. Secured-loan enforcement follows the SARFAESI Act, with appeals to the Debts Recovery Tribunal.',
    tips: [
      'RBI rules say recovery agents should not call before 8 am or after 7 pm, and must not threaten or humiliate you or your family.',
      'A SARFAESI demand notice usually gives 60 days to pay, and you can send written objections to the bank.',
      'Always get a settlement in writing on the lender\'s letterhead before paying, and ask for a no-dues letter afterwards.'
    ],
    questions: [
      { id: 'lr_type', text: 'What kind of loan is it?', chapter: 'The loan', why: 'Home, vehicle and other secured loans can lead to property being taken; unsecured loans cannot, without a court.',
        options: o([['home', 'Home or property loan'], ['vehicle', 'Vehicle loan'], ['personal', 'Personal loan or credit line'], ['app', 'Loan from a mobile app'], ['business', 'Business / MSME loan'], ['gold', 'Gold loan']]) },
      { id: 'lr_lender', text: 'Who lent the money?', chapter: 'The loan', why: 'Banks and RBI-registered NBFCs are covered by RBI complaint routes; unregistered lenders are not.',
        options: o([['bank', 'A bank'], ['nbfc', 'A finance company (NBFC)'], ['app', 'An app, not sure who is behind it'], ['private', 'A private moneylender'], NS]) },
      { id: 'lr_problem', text: 'What is happening now?', type: 'multi', chapter: 'What\'s happening', why: 'Each problem has its own protections and records.',
        options: o([['calls', 'Harassing calls or visits'], ['contacts', 'They are calling my family, friends or contacts'], ['notice', 'I got a bank or legal notice'], ['possession', 'They took or want to take my vehicle or property'], ['settle', 'I want to settle or close the loan'], ['noc', 'Loan closed, but no NOC / documents returned'], ['charges', 'Wrong charges or interest']]) },
      { id: 'lr_overdue', text: 'How far behind are the EMIs?', chapter: 'What\'s happening', why: 'Loans overdue for more than 90 days are usually classified as non-performing, which triggers formal recovery.',
        options: o([['none', 'Not behind'], ['m1', '1–2 EMIs'], ['m3', '3 or more EMIs'], ['closed', 'Loan already closed'], NS]) },
      { id: 'lr_notice_type', text: 'Which notice did you receive?', chapter: 'Papers', when: W('lr_problem', 'notice', 'possession'),
        why: 'A SARFAESI demand notice, a possession notice and a court summons each have their own deadlines.',
        options: o([['s132', 'Demand notice (often "Section 13(2)")'], ['s134', 'Possession notice'], ['legal', 'Lawyer\'s notice / arbitration notice'], ['court', 'Court or DRT summons'], ['police', 'Police complaint against me'], NS]) },
      { id: 'lr_threats', text: 'Have there been threats, abuse or calls at odd hours?', chapter: 'Conduct', when: W('lr_problem', 'calls', 'contacts'), sensitive: true,
        why: 'Abusive recovery practices breach RBI rules and may be crimes.', options: o([['threats', 'Threats or abuse'], ['odd', 'Calls before 8 am or after 7 pm'], ['morph', 'Morphed photos or messages to my contacts'], ['no', 'No, just frequent calls']]) },
      { id: 'lr_registered', text: 'Is the app\'s lender registered with RBI?', chapter: 'Conduct', when: W('lr_type', 'app'),
        why: 'RBI\'s digital lending rules require loans to come from a regulated entity. Unregistered apps are a police matter.', options: o([['yes', 'Yes, it names a bank/NBFC'], ['no', 'No'], NS]) },
      { id: 'lr_complained', text: 'Have you complained in writing to the lender\'s grievance officer?', deep: true, chapter: 'Complaints',
        why: 'A written complaint is usually needed before the RBI Ombudsman.', options: o([['yes', 'Yes, with reference'], ['no', 'No']]) },
      { id: 'lr_hardship', text: 'Is there a reason you fell behind?', deep: true, chapter: 'Your situation', when: W('lr_overdue', 'm1', 'm3'),
        why: 'Job loss, illness or business failure can support a restructuring or settlement request.', options: o([['job', 'Job loss / income fall'], ['medical', 'Medical emergency'], ['business', 'Business loss'], ['dispute', 'I dispute the amount'], ['other', 'Other'], PN]) },
      { id: 'lr_insurance', text: 'Was any insurance sold with the loan?', deep: true, chapter: 'Your situation',
        why: 'Loan-protection insurance may cover EMIs in death, disability or job loss.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) }
    ],
    evidence: [
      { id: 'lr_e_sanction', name: 'Loan agreement, sanction letter and key fact statement (KFS)', fact: 'The agreed terms, interest and charges', why: 'Shows what you actually agreed to.',
        where: 'Lender\'s app, email, branch (you can ask for a copy).', preserve: '' },
      { id: 'lr_e_soa', name: 'Loan account statement (statement of account)', fact: 'What has been paid and what is claimed', why: 'Shows EMIs paid, charges and the outstanding.',
        where: 'Lender\'s app/website or written request.', preserve: 'Download the official PDF.' },
      { id: 'lr_e_emi', name: 'Your bank statement showing EMI debits and bounces', fact: 'Your payment history', why: 'Checks the lender\'s figures.', where: 'Net banking.', preserve: '' },
      { id: 'lr_e_calllog', name: 'Call log, recordings and messages from recovery agents', fact: 'How recovery is being done', why: 'Abusive conduct breaches RBI rules.',
        where: 'Your phone.', preserve: 'Screenshot call logs with times. Keep recordings and messages; note agent names and numbers.', when: W('lr_problem', 'calls', 'contacts') },
      { id: 'lr_e_contacts', name: 'Messages your family/friends received from the lender', fact: 'Contacts were harassed', why: 'Contacting your contacts to shame you is a serious breach.',
        where: 'Ask them to forward screenshots with dates.', preserve: '', when: ANY(W('lr_problem', 'contacts'), W('lr_threats', 'morph')) },
      { id: 'lr_e_notice', name: 'The notice received, with envelope', fact: 'What the lender is claiming and the deadline', why: 'Each notice has its own reply/objection period.',
        where: 'Your post.', preserve: 'Note date of receipt.', time: 'A SARFAESI demand notice usually gives 60 days; objections should be sent well within that.', when: W('lr_problem', 'notice', 'possession') },
      { id: 'lr_e_possession', name: 'Possession notice, panchnama or vehicle repossession papers and inventory', fact: 'How possession was taken', why: 'Possession must follow procedure; vehicle seizure needs notice and an inventory.',
        where: 'From the lender or agent; photos of the notice on the property.', preserve: 'Photograph what was taken and its condition.', time: 'Challenges to SARFAESI possession are usually due within 45 days at the DRT.', when: W('lr_problem', 'possession') },
      { id: 'lr_e_settle', name: 'Settlement offer or sanction letter on the lender\'s letterhead', fact: 'Agreed settlement terms', why: 'Verbal settlements are a common trap.',
        where: 'Ask the lender in writing.', preserve: 'Do not pay a settlement into a personal account or to an agent\'s UPI.', when: W('lr_problem', 'settle') },
      { id: 'lr_e_noc', name: 'Closure proof and your written request for NOC and original documents', fact: 'Loan was closed and documents are due back', why: 'RBI rules require original property documents to be returned within 30 days of closure, with compensation for delay.',
        where: 'Final payment receipt, closure letter.', preserve: '', when: W('lr_problem', 'noc') },
      { id: 'lr_e_complaint', name: 'Your complaint to the lender\'s grievance officer and reply', fact: 'The lender was given a chance to fix it', why: 'Usually required before an RBI Ombudsman complaint.',
        where: 'Grievance email on the lender\'s website.', preserve: '', when: W('lr_complained', 'yes') },
      { id: 'lr_e_appinfo', name: 'App name, download link, screenshots of loan terms, and permissions it took', fact: 'Who the lender is and how the loan was given', why: 'Needed for police and RBI complaints.',
        where: 'Your phone, app store page.', preserve: 'Screenshot before uninstalling.', when: W('lr_type', 'app') },
      { id: 'lr_e_hardship', name: 'Proof of hardship (termination letter, medical bills, business accounts)', fact: 'Why you fell behind', why: 'Supports a restructuring or settlement request.', where: 'Your records.', preserve: '',
        when: W('lr_hardship', 'job', 'medical', 'business') },
      { id: 'lr_e_policy', name: 'Insurance policy linked to the loan', fact: 'Whether insurance can cover dues', why: 'May pay EMIs in some situations.', where: 'Loan papers, insurer.', preserve: '', when: W('lr_insurance', 'yes', 'unsure') }
    ],
    urgent: [
      { id: 'lr_u_morph', level: 'now', when: ANY(W('lr_threats', 'threats', 'morph'), W('lr_registered', 'no')), title: 'Report threats and morphed images',
        text: 'Threats, extortion or morphed photos are crimes. Report at cybercrime.gov.in or 1930 and to local police. Do not pay to make it stop.', help: ['cy1930', 'e112'] },
      { id: 'lr_u_sarfaesi', level: 'soon', when: W('lr_notice_type', 's132', 's134', 'court'), title: 'Your notice has a deadline',
        text: 'Take the notice to an advocate soon. Objections and appeals have fixed time limits.', help: ['l15100'] }
    ],
    lawyerQs: [
      { text: 'Is the amount claimed correct, and are the charges allowed under my agreement?' },
      { text: 'How do I object to the SARFAESI notice or challenge possession?', when: W('lr_notice_type', 's132', 's134') },
      { text: 'Can I complain to the RBI Ombudsman or police about recovery conduct?', when: W('lr_problem', 'calls', 'contacts') },
      { text: 'Is a one-time settlement possible, and how will it affect my credit report?', when: W('lr_problem', 'settle') }
    ]
  });

  /* ---------------- Credit card dispute ---------------- */
  I.push({
    id: 'credit-card-dispute', cat: 'money', title: 'Credit card problem — wrong charges, closure, billing or fraud', short: 'Credit card problem',
    synonyms: ['credit card', 'card charges', 'annual fee', 'late fee', 'card closure', 'close credit card', 'card not closed', 'credit card fraud', 'card billing', 'unsolicited card', 'emi conversion', 'chargeback'],
    intro: 'Credit cards are now the second-largest source of RBI banking complaints. We\'ll pin down exactly what went wrong.',
    juris: 'RBI\'s credit card directions set rules on billing, closure, charges and recovery.',
    tips: [
      'Under RBI rules, a card closure request should be completed within 7 working days, or the issuer pays ₹500 per day of delay (if nothing is owed).',
      'Card issuers must not upgrade your card or raise your limit without your explicit consent.',
      'For fraudulent card transactions from 1 January 2027, banks must give a provisional "shadow reversal" within 5 calendar days of your report.'
    ],
    questions: [
      { id: 'cc_issue', text: 'What is the problem?', type: 'multi', chapter: 'The problem', why: 'Each issue has its own rule and records.',
        options: o([['fraud', 'Transactions I didn\'t make'], ['charges', 'Fees, interest or charges I don\'t agree with'], ['closure', 'I asked to close it and they didn\'t'], ['unsolicited', 'Card or limit increase I never asked for'], ['merchant', 'Merchant didn\'t deliver / refund'], ['recovery', 'Recovery calls or harassment'], ['cibil', 'Wrong entry on my credit report']]) },
      { id: 'cc_reported', text: 'Have you reported it to the card issuer in writing?', chapter: 'The problem', why: 'Your written complaint date matters for liability and RBI escalation.',
        options: o([['yes', 'Yes, with reference number'], ['phone', 'Only on phone'], ['no', 'Not yet']]) },
      { id: 'cc_when', text: 'When did it happen?', chapter: 'Timing', when: W('cc_issue', 'fraud'), why: 'Fraud must be reported fast.',
        options: o([['d3', 'Within the last 3 days'], ['d30', 'Within the last month'], ['older', 'Earlier']]) },
      { id: 'cc_dues', text: 'Is anything outstanding on the card?', chapter: 'Timing', when: W('cc_issue', 'closure'), why: 'Closure must follow once dues are cleared.',
        options: o([['none', 'Nothing'], ['some', 'Some dues'], ['disputed', 'Only the disputed charges']]) },
      { id: 'cc_reply', text: 'What did the issuer reply?', deep: true, chapter: 'Response', when: W('cc_reported', 'yes'),
        why: 'A rejection, or no reply in 30 days, opens the RBI Ombudsman route.', options: o([['rejected', 'Rejected'], ['none', 'No reply after 30 days'], ['partial', 'Partly resolved'], ['waiting', 'Still within 30 days']]) }
    ],
    evidence: [
      { id: 'cc_e_statements', name: 'Card statements for the months involved', fact: 'The disputed charges', why: 'Shows exactly what was billed.', where: 'Issuer app or email.', preserve: 'Download PDFs.' },
      { id: 'cc_e_alerts', name: 'SMS/email alerts for the disputed transactions', fact: 'When you were alerted', why: 'Fixes timing for liability.', where: 'Phone, email.', preserve: '', when: W('cc_issue', 'fraud') },
      { id: 'cc_e_report', name: 'Report the fraud to the issuer now, block the card, and keep the reference', fact: 'Prompt reporting', why: 'Your liability depends on how fast you report.', where: 'Issuer app/helpline; also 1930 for cyber fraud.',
        preserve: '', action: true, time: 'Report immediately.', when: ALL(W('cc_issue', 'fraud'), NOT(W('cc_reported', 'yes'))) },
      { id: 'cc_e_block', name: 'Card block confirmation and the bank\'s complaint reference', fact: 'The card was blocked and fraud reported', why: 'Limits further loss and fixes the reporting time.', where: 'Issuer app / SMS.', preserve: '', when: W('cc_issue', 'fraud') },
      { id: 'cc_e_cyber', name: 'Cybercrime complaint number (1930 / cybercrime.gov.in)', fact: 'Fraud reported to police', why: 'Helps trace and hold the money; banks often ask for it.', where: 'cybercrime.gov.in.', preserve: '', when: W('cc_issue', 'fraud') },
      { id: 'cc_e_closure', name: 'Your closure request (email, app request, letter) and acknowledgement', fact: 'Date you asked for closure', why: 'The 7-working-day rule runs from this date.', where: 'Email, app.', preserve: '', when: W('cc_issue', 'closure') },
      { id: 'cc_e_consent', name: 'Anything showing what you did or didn\'t consent to (application form, recorded calls, OTP messages)', fact: 'Whether you asked for the card or limit', why: 'Unsolicited cards and upgrades need your explicit consent.',
        where: 'Your email and messages.', preserve: '', when: W('cc_issue', 'unsolicited') },
      { id: 'cc_e_mitc', name: 'Most Important Terms and Conditions (MITC) and fee schedule', fact: 'What charges were agreed', why: 'Charges not disclosed may not be payable.', where: 'Issuer website, welcome kit.', preserve: '', when: W('cc_issue', 'charges') },
      { id: 'cc_e_merchant', name: 'Order, cancellation and merchant correspondence', fact: 'The merchant failed to deliver or refund', why: 'Supports a chargeback request.', where: 'Merchant email/app.', preserve: '', when: W('cc_issue', 'merchant') },
      { id: 'cc_e_calls', name: 'Recovery call logs and messages', fact: 'How recovery was done', why: 'Abusive recovery breaches RBI rules.', where: 'Your phone.', preserve: '', when: W('cc_issue', 'recovery') },
      { id: 'cc_e_credit', name: 'Your credit report showing the wrong entry', fact: 'The error', why: 'Needed for the correction request.', where: 'Free annual report from a credit bureau.', preserve: '', when: W('cc_issue', 'cibil') },
      { id: 'cc_e_reply', name: 'Issuer\'s reply or proof of no reply', fact: 'Bank had its chance', why: 'Needed for an RBI Ombudsman complaint.', where: 'Email.', preserve: '', when: W('cc_reply', 'rejected', 'none', 'partial') }
    ],
    urgent: [
      { id: 'cc_u_fraud', level: 'now', when: ALL(W('cc_issue', 'fraud'), W('cc_when', 'd3', 'd30'), NOT(W('cc_reported', 'yes'))), title: 'Block the card and report now',
        text: 'Call the issuer to block the card and report the fraud in writing. For cyber fraud, also call 1930.', help: ['cy1930', 'rbi'] }
    ],
    lawyerQs: [
      { text: 'Am I liable for these transactions under RBI rules?', when: W('cc_issue', 'fraud') },
      { text: 'Can I claim the ₹500/day closure compensation?', when: W('cc_issue', 'closure') },
      { text: 'Should I go to the RBI Ombudsman or a consumer commission?' }
    ]
  });

  /* ---------------- Credit report error ---------------- */
  I.push({
    id: 'credit-report-error', cat: 'money', title: 'My credit score or CIBIL report is wrong', short: 'Credit report (CIBIL) error',
    synonyms: ['cibil', 'credit score', 'credit report', 'cibil wrong', 'loan shows active', 'settled status', 'written off', 'experian', 'equifax', 'crif'],
    intro: 'Most errors come from the lender\'s reporting. Correction needs the right proof sent to the right place.',
    juris: 'Credit information companies and lenders must correct errors within set timelines, and RBI rules provide ₹100 per day compensation for delay beyond 30 days.',
    tips: ['You can dispute directly with the credit bureau; it must check with the lender.', 'A "settled" status is different from "closed" — settling a loan can lower your score.'],
    questions: [
      { id: 'cr_error', text: 'What is wrong in the report?', type: 'multi', chapter: 'The error', why: 'Different errors need different proof.',
        options: o([['notmine', 'A loan or card that isn\'t mine'], ['active', 'A closed loan shown as active/overdue'], ['settled', 'Shown as "settled"/"written off" wrongly'], ['dpd', 'Wrong late-payment entries'], ['personal', 'Wrong name, PAN, address']]) },
      { id: 'cr_disputed', text: 'Have you raised a dispute?', chapter: 'Steps so far', why: 'The 30-day correction clock starts from the dispute.',
        options: o([['bureau', 'Yes, with the credit bureau'], ['lender', 'Yes, with the lender'], ['both', 'Both'], ['no', 'Not yet']]) },
      { id: 'cr_days', text: 'How long ago was the dispute raised?', chapter: 'Steps so far', when: W('cr_disputed', 'bureau', 'lender', 'both'), why: 'Delay beyond 30 days can attract compensation.',
        options: o([['under30', 'Under 30 days'], ['over30', 'More than 30 days']]) }
    ],
    evidence: [
      { id: 'cr_e_report', name: 'Your latest credit report (all pages)', fact: 'The error', why: 'Shows exactly what is reported.', where: 'Credit bureau website (one free report a year from each).', preserve: '' },
      { id: 'cr_e_noc', name: 'No-dues / closure letter for the loan or card', fact: 'The account is closed', why: 'Main proof for wrong active or overdue status.', where: 'Lender.', preserve: '', when: W('cr_error', 'active', 'dpd') },
      { id: 'cr_e_payments', name: 'Statements showing EMIs paid on time', fact: 'You were not late', why: 'Answers wrong late-payment entries.', where: 'Bank statement.', preserve: '', when: W('cr_error', 'dpd') },
      { id: 'cr_e_settlement', name: 'Settlement letter and payment proof', fact: 'Terms of settlement', why: 'Shows whether "settled" is correct.', where: 'Lender.', preserve: '', when: W('cr_error', 'settled') },
      { id: 'cr_e_identity', name: 'ID and PAN copies, and a police/cyber complaint if someone used your identity', fact: 'The account isn\'t yours', why: 'Identity misuse needs a formal complaint.', where: 'Your records; cybercrime.gov.in.', preserve: '', when: W('cr_error', 'notmine', 'personal') },
      { id: 'cr_e_dispute', name: 'Dispute reference numbers and replies', fact: 'When correction was requested', why: 'Starts the 30-day clock.', where: 'Bureau/lender email.', preserve: '', when: W('cr_disputed', 'bureau', 'lender', 'both') },
      { id: 'cr_e_raise', name: 'Raise an online dispute with the credit bureau and the lender', fact: 'Correction requested', why: 'Required first step.', where: 'Bureau dispute page; lender grievance email.', preserve: '', action: true, when: W('cr_disputed', 'no') }
    ],
    urgent: [],
    lawyerQs: [{ text: 'Can I claim compensation for delay in correction?', when: W('cr_days', 'over30') }, { text: 'Should I approach the RBI Ombudsman about the lender?' }]
  });
})(globalThis);
