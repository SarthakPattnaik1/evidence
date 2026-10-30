/* High-search gaps (Oct 2026 research): scams, apps, travel, utilities, family paperwork, property, PF, medical, education.
   Draft, not advocate-reviewed. */
(function (root) {
  const { W, ALL, ANY, NOT, ANS, o, NS, PN } = root.ER_H;
  const KB = root.ER_KB; const I = KB.issues;
  Object.assign(KB.help, {
    chakshu: { label: 'Chakshu', name: 'Sanchar Saathi — report fraud calls and messages (DoT)', detail: 'Report the number or link used to cheat you, so it can be blocked.', href: 'https://sancharsaathi.gov.in' },
    sachet: { label: 'Sachet', name: 'RBI Sachet portal', detail: 'Report unregistered lenders, deposit schemes and illegal loan apps.', href: 'https://sachet.rbi.org.in' },
    airsewa: { label: 'AirSewa', name: 'AirSewa (Ministry of Civil Aviation)', detail: 'Complaints about airlines and airports, including refunds.', href: 'https://airsewa.gov.in' },
    echallan: { label: 'eChallan', name: 'eChallan portal (Parivahan)', detail: 'Check, pay or contest traffic challans with evidence.', href: 'https://echallan.parivahan.gov.in' },
    epfo: { label: 'EPFiGMS', name: 'EPFO grievance portal', detail: 'Complaints about PF transfer, withdrawal, pension and employer non-deposit.', href: 'https://epfigms.gov.in' },
    ugc: { label: 'e-Samadhaan', name: 'UGC e-Samadhaan', detail: 'Student complaints against colleges and universities, including fee refunds and withheld certificates.', href: 'https://www.ugc.gov.in' }
  });
  const acc = KB.categories.find((c) => c.id === 'accidents'); if (acc) acc.blurb = 'Road accidents, injury and medical negligence';

  /* ---------------- Digital arrest / impersonation scam ---------------- */
  I.push({
    id: 'digital-arrest-scam', cat: 'money', title: 'Someone posing as police, CBI, customs or a court threatened me or took money ("digital arrest")', short: '"Digital arrest" or fake police call',
    synonyms: ['digital arrest', 'fake cbi call', 'fake police call', 'customs parcel call', 'fedex scam', 'courier drugs parcel', 'video call police', 'ed notice call', 'trai call disconnect', 'narcotics call', 'fake arrest warrant', 'impersonation scam', 'skype police'],
    intro: 'No police, CBI, ED, customs officer or judge ever arrests anyone over a video call or asks for money to "verify" it. Reporting fast is what gives money a chance of being frozen.',
    juris: 'There is no "digital arrest" under Indian law. The Supreme Court asked the CBI to coordinate a pan-India probe into these scams in late 2025. Report on 1930 / cybercrime.gov.in; money moved to mule accounts can sometimes be frozen and later released by court order.',
    questions: [
      { id: 'da_now', text: 'Is the call or threat still going on?', why: 'If you are still being kept on a call, the first step is to end it safely.', options: o([['ongoing', 'Yes, they are still in touch'], ['ended', 'It has stopped']]) },
      { id: 'da_paid', text: 'Did you send any money?', why: 'If money left your account, every hour counts for freezing it.', options: o([['yes', 'Yes'], ['no', 'No, only threats']]) },
      { id: 'da_when', text: 'When did you send the last payment?', when: W('da_paid', 'yes'), why: 'Reports within hours have the best chance of a freeze.', options: o([['today', 'Today'], ['days', 'In the last few days'], ['older', 'More than a week ago']]) },
      { id: 'da_reported', text: 'Have you reported it?', why: 'A complaint number is needed for the bank, police and court.', options: o([['h1930', 'Yes, on 1930 or cybercrime.gov.in'], ['police', 'Yes, at a police station'], ['none', 'Not yet']]) },
      { id: 'da_shared', text: 'Did you share any of these?', deep: true, why: 'Shared IDs or remote access can be misused again.', options: o([['ids', 'Aadhaar, PAN or photos of ID'], ['otp', 'OTP, PIN or passwords'], ['app', 'Installed an app they asked for'], ['none', 'None of these']]) },
      { id: 'da_mode', text: 'How did the money go?', deep: true, when: W('da_paid', 'yes'), why: 'Bank transfers, UPI and cash deposits are traced differently.', options: o([['bank', 'Bank transfer / RTGS / NEFT'], ['upi', 'UPI'], ['cash', 'Cash deposit or handed over'], ['crypto', 'Crypto or gift cards']]) }
    ],
    evidence: [
      { id: 'da_e_numbers', name: 'Phone numbers, video-call IDs and names they used', fact: 'Who contacted you', why: 'Police trace and block these numbers and accounts.', where: 'Call log, WhatsApp/Skype chat info.', preserve: 'Screenshot before blocking; do not delete the chat.' },
      { id: 'da_e_docs', name: 'Fake notices, "warrants" or ID cards they sent', fact: 'How they impersonated officials', why: 'Shows the fraud and helps identify the gang.', where: 'Chats, email.', preserve: 'Save the files, not just screenshots.' },
      { id: 'da_e_txn', name: 'Every transaction: date, time, amount, UTR and the receiving account', fact: 'Where the money went', why: 'Banks freeze the receiving accounts using these details.', where: 'Bank statement, UPI app, deposit slips.', preserve: 'Download the statement PDF today.', when: W('da_paid', 'yes'), time: 'Report within hours if you can — money moves on quickly.' },
      { id: 'da_e_ack', name: '1930 / cybercrime.gov.in acknowledgement number', fact: 'You reported it', why: 'Needed for bank, police and court steps.', where: 'SMS or portal.', preserve: 'Note it down and screenshot.', when: W('da_reported', 'h1930') },
      { id: 'da_e_fir', name: 'FIR or police complaint copy', fact: 'A criminal case exists', why: 'Needed to ask the court to release frozen money back to you.', where: 'Police station or cyber cell.', preserve: 'Ask for a free copy of the FIR.', when: ANY(W('da_paid', 'yes'), W('da_reported', 'police')) },
      { id: 'da_e_bankcomp', name: 'Written complaint to your bank, with reference number', fact: 'Your bank was told', why: 'Starts the bank\'s own fraud process and record.', where: 'Bank app, email or branch.', preserve: 'Keep the reference.', when: W('da_paid', 'yes') },
      { id: 'da_e_report', name: 'Call 1930 or file on cybercrime.gov.in now', fact: 'Reporting', why: 'This is how freezes start.', where: '1930 / cybercrime.gov.in', preserve: '', action: true, when: W('da_reported', 'none') },
      { id: 'da_e_chakshu', name: 'Report the number on Sanchar Saathi (Chakshu)', fact: 'The number is flagged', why: 'Helps block it so others are not targeted.', where: 'sancharsaathi.gov.in', preserve: '', action: true },
      { id: 'da_e_secure', name: 'Change passwords, uninstall any app they made you install, and tell your bank about shared details', fact: 'Further misuse is stopped', why: 'Shared details can be used again.', where: 'Your phone and bank.', preserve: '', action: true, when: W('da_shared', 'ids', 'otp', 'app') }
    ],
    urgent: [
      { id: 'da_u_end', level: 'now', when: W('da_now', 'ongoing'), title: 'End the call. You are not under arrest.', text: 'No officer arrests anyone on a video call. Hang up, do not pay anything more, and tell a family member. Then call 1930.', help: ['cy1930', 'e112'] },
      { id: 'da_u_report', level: 'now', when: ALL(W('da_paid', 'yes'), W('da_reported', 'none')), title: 'Call 1930 right now', text: 'Money sent to fraud accounts can be frozen if reported quickly. Keep your transaction details ready.', help: ['cy1930'] }
    ],
    info: [{ when: W('da_mode', 'crypto'), text: 'Crypto and gift cards are much harder to trace. Report anyway and keep wallet addresses and card codes.' }],
    stand: [
      { k: 'good', when: W('da_paid', 'no'), text: 'You did not pay. Nothing more is needed except reporting the number.' },
      { k: 'good', when: W('da_reported', 'h1930', 'police'), text: 'You have already reported — the freeze process can start from your complaint.' },
      { k: 'risk', when: ALL(W('da_paid', 'yes'), W('da_when', 'older')), text: 'After a week, money has usually moved on. Recovery is harder but still possible if accounts were frozen.' },
      { k: 'next', when: W('da_paid', 'yes'), text: 'Once police freeze money, an advocate can apply to the court to release it to you.' }
    ],
    lawyerQs: [{ text: 'Has any of my money been frozen, and how do I apply to the court to get it released?', when: W('da_paid', 'yes') }, { text: 'Can my bank be held responsible for any part of this?', when: W('da_paid', 'yes') }]
  });

  /* ---------------- Job / task / investment scam ---------------- */
  I.push({
    id: 'job-investment-scam', cat: 'money', title: 'I lost money in a job, task, trading or investment scam', short: 'Job, task or investment scam',
    synonyms: ['task scam', 'part time job scam', 'youtube like job', 'telegram task', 'work from home fraud', 'trading app scam', 'stock tips whatsapp group', 'investment fraud', 'crypto scam', 'ponzi', 'chit fund fraud', 'fake job offer', 'registration fee job', 'ipo scam app'],
    intro: 'These scams pay small amounts first, then ask for bigger "deposits". Stop paying, keep every message, and report.',
    juris: 'Cheating is an offence under the Bharatiya Nyaya Sanhita; online fraud is reported on 1930 / cybercrime.gov.in. Unregistered deposit schemes can also be reported on RBI\'s Sachet portal.',
    questions: [
      { id: 'js_kind', text: 'What kind of scheme was it?', why: 'Different evidence and authorities apply.', options: o([['task', 'Paid tasks (likes, reviews, ratings)'], ['trading', 'Trading / stock tips / app'], ['job', 'Job offer with a fee'], ['deposit', 'Deposit or chit scheme'], ['crypto', 'Crypto']]) },
      { id: 'js_still', text: 'Are they asking you for more money to "withdraw" your earnings?', why: 'This is the classic sign — paying more never releases the money.', options: o([['yes', 'Yes'], ['no', 'No'], ['stopped', 'I have stopped paying']]) },
      { id: 'js_when', text: 'When was your last payment?', why: 'Faster reports mean better chances of freezing money.', options: o([['days', 'In the last 3 days'], ['month', 'This month'], ['older', 'Earlier']]) },
      { id: 'js_reported', text: 'Have you reported it?', why: 'You need a complaint number for every next step.', options: o([['yes', 'Yes, 1930 / cyber portal / police'], ['no', 'Not yet']]) },
      { id: 'js_others', text: 'Were other people cheated the same way?', deep: true, why: 'Group complaints are taken more seriously and help trace the gang.', options: o([['yes', 'Yes, I know others'], ['no', 'No'], NS]) }
    ],
    evidence: [
      { id: 'js_e_chats', name: 'All chats, group names, links and the app or website used', fact: 'How the scheme worked', why: 'Shows the false promises and identifies the operators.', where: 'Telegram, WhatsApp, the app itself.', preserve: 'Export the chat; screenshot the app dashboard before it disappears.' },
      { id: 'js_e_txn', name: 'All payments made and any small "returns" received', fact: 'Money trail both ways', why: 'Receiving accounts are frozen using these details.', where: 'Bank statement, UPI history.', preserve: 'Download the statement PDF.' },
      { id: 'js_e_offer', name: 'Job offer, "appointment letter" or scheme brochure', fact: 'What was promised', why: 'Proves the promise was false.', where: 'Email, chat.', preserve: '', when: W('js_kind', 'job', 'deposit') },
      { id: 'js_e_ack', name: 'Complaint acknowledgement number or FIR', fact: 'You reported it', why: 'Needed for bank and court steps.', where: 'Portal SMS or police.', preserve: '', when: W('js_reported', 'yes') },
      { id: 'js_e_victims', name: 'Names and contacts of other victims', fact: 'A pattern of cheating', why: 'Supports a joint complaint.', where: 'Your contacts, group members.', preserve: '', holder: 'others', when: W('js_others', 'yes') },
      { id: 'js_e_report', name: 'Report on 1930 or cybercrime.gov.in', fact: 'Reporting', why: 'Starts the freeze process.', where: '1930 / cybercrime.gov.in', preserve: '', action: true, when: W('js_reported', 'no') },
      { id: 'js_e_sachet', name: 'Report the scheme on RBI Sachet', fact: 'Regulator informed', why: 'For unregistered deposit or chit schemes.', where: 'sachet.rbi.org.in', preserve: '', action: true, when: W('js_kind', 'deposit') }
    ],
    urgent: [
      { id: 'js_u_stop', level: 'now', when: W('js_still', 'yes'), title: 'Do not pay anything more', text: 'Paying a "tax", "fee" or "unlock charge" will not release your money. Stop and report on 1930.', help: ['cy1930'] },
      { id: 'js_u_fast', level: 'soon', when: ALL(W('js_when', 'days'), W('js_reported', 'no')), title: 'Report today', text: 'A recent payment can still be frozen.', help: ['cy1930'] }
    ],
    stand: [
      { k: 'risk', when: W('js_kind', 'crypto'), text: 'Crypto transfers are hard to trace, but the wallet addresses still matter for police.' },
      { k: 'good', when: W('js_others', 'yes'), text: 'Several victims together make a stronger complaint.' },
      { k: 'next', when: W('js_reported', 'yes'), text: 'Follow up with the cyber cell on whether any receiving account was frozen.' }
    ],
    lawyerQs: [{ text: 'Was any money frozen, and how do I claim it back through the court?' }, { text: 'Can a group complaint or case be filed with other victims?', when: W('js_others', 'yes') }]
  });

  /* ---------------- Loan app harassment ---------------- */
  I.push({
    id: 'loan-app-harassment', cat: 'money', title: 'A loan app is harassing me, calling my contacts or threatening to post photos', short: 'Loan app harassment',
    synonyms: ['loan app harassment', 'instant loan app', 'loan app calling contacts', 'morphed photos loan', 'loan app blackmail', 'illegal loan app', 'chinese loan app', 'recovery agent abuse', 'digital lending app', 'loan app threat'],
    intro: 'Lenders regulated by RBI cannot shame you or reach into your contacts. Illegal apps often are not lenders at all. We will work out which you are dealing with.',
    juris: 'RBI\'s Digital Lending Directions, 2025 require regulated lenders to list their apps in RBI\'s public directory, disclose all charges in a Key Fact Statement, tell you about recovery agents in advance, and stay away from your contacts and photos. Threats and morphed images are crimes and can be reported to police and 1930.',
    questions: [
      { id: 'la_problem', text: 'What is happening?', why: 'Threats and image misuse need police; charges and recovery need the lender or RBI.', options: o([['contacts', 'They call or message my contacts'], ['morph', 'Morphed or obscene photos / threats to post them'], ['abuse', 'Abusive or threatening calls'], ['charges', 'Huge charges or amount I never agreed'], ['unasked', 'Money came without my asking']]) },
      { id: 'la_registered', text: 'Is the app in RBI\'s directory of digital lending apps, or linked to a bank/NBFC?', why: 'Illegal apps are handled through police; regulated ones also through RBI.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'la_repaid', text: 'Where do you stand on repayment?', why: 'Even if you owe money, harassment is not allowed — but it changes what you ask for.', options: o([['repaid', 'I have repaid'], ['partly', 'Partly'], ['no', 'Not yet']]) },
      { id: 'la_reported', text: 'Have you complained anywhere?', why: 'Complaint numbers are needed for escalation.', options: o([['police', 'Police / 1930'], ['lender', 'The lender'], ['none', 'Not yet']]) },
      { id: 'la_kfs', text: 'Did you get a Key Fact Statement (loan summary with interest and fees)?', deep: true, why: 'Charges not shown in the KFS cannot be charged.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) }
    ],
    evidence: [
      { id: 'la_e_app', name: 'App name, developer, and screenshots of the loan screen', fact: 'Who the lender is', why: 'Identifies the app and any bank/NBFC behind it.', where: 'App store page, app screens.', preserve: 'Screenshot before uninstalling.' },
      { id: 'la_e_calls', name: 'Call recordings, messages and the numbers used', fact: 'The harassment', why: 'Main proof of threats and abuse.', where: 'Phone, WhatsApp.', preserve: 'Do not delete; export chats.' },
      { id: 'la_e_contacts', name: 'Messages your contacts received (from them)', fact: 'Contacts were targeted', why: 'Shows misuse of your data.', where: 'Ask friends to forward screenshots.', preserve: '', holder: 'others', when: W('la_problem', 'contacts', 'morph') },
      { id: 'la_e_images', name: 'The morphed images or threat to post them', fact: 'Image-based blackmail', why: 'Needed for police; platforms can remove posted images.', where: 'Wherever they sent them.', preserve: 'Save, do not forward further.', when: W('la_problem', 'morph') },
      { id: 'la_e_money', name: 'Amount received and every repayment made', fact: 'What you actually got and paid', why: 'Shows unfair charges and what (if anything) is owed.', where: 'Bank / UPI statement.', preserve: '' },
      { id: 'la_e_kfs', name: 'Key Fact Statement and loan agreement', fact: 'Agreed interest and charges', why: 'Anything not disclosed cannot be charged.', where: 'App, email.', preserve: '', when: W('la_kfs', 'yes') },
      { id: 'la_e_police', name: 'Police / 1930 complaint about threats', fact: 'Crime reported', why: 'Threats and morphed images are criminal.', where: '1930, cybercrime.gov.in, police station.', preserve: '', action: true, when: ALL(W('la_problem', 'morph', 'abuse', 'contacts'), NOT(W('la_reported', 'police'))) },
      { id: 'la_e_sachet', name: 'Report the app on RBI Sachet', fact: 'Regulator informed', why: 'For apps not linked to a regulated lender.', where: 'sachet.rbi.org.in', preserve: '', action: true, when: W('la_registered', 'no', 'unsure') }
    ],
    urgent: [
      { id: 'la_u_morph', level: 'now', when: W('la_problem', 'morph'), title: 'Image threats are a crime — report them', text: 'Do not pay under blackmail. Report on 1930 / cybercrime.gov.in and keep the proof. Tell close contacts in advance that fake images may be sent.', help: ['cy1930', 'w181'] }
    ],
    stand: [
      { k: 'good', when: W('la_repaid', 'repaid'), text: 'You have repaid — keep the proof; any further demand needs a written account.' },
      { k: 'risk', when: W('la_registered', 'no'), text: 'An unlisted app may not be a legal lender at all; deal with it through police, not by paying more.' },
      { k: 'next', when: W('la_registered', 'yes'), text: 'Complain to the lender in writing, then to RBI (cms.rbi.org.in) if not resolved in 30 days.' }
    ],
    lawyerQs: [{ text: 'How much do I actually owe, if anything?' }, { text: 'Can I claim compensation for the harassment?', when: W('la_registered', 'yes') }]
  });

  /* ---------------- E-commerce order ---------------- */
  I.push({
    id: 'ecommerce-order', cat: 'shopping', title: 'Online order problem — not delivered, wrong item, fake, or return refused', short: 'Online order problem',
    synonyms: ['order not delivered', 'wrong item delivered', 'fake product online', 'return not accepted', 'refund pending flipkart', 'amazon refund', 'meesho', 'myntra return', 'empty box', 'cash on delivery problem', 'seller not responding', 'online shopping complaint', 'quick commerce', 'swiggy zomato refund'],
    intro: 'E-commerce sites must acknowledge your complaint within 48 hours and resolve it within a month. Most cases end at the National Consumer Helpline.',
    juris: 'Consumer Protection (E-Commerce) Rules, 2020 apply to platforms and sellers. Complaints can go to the National Consumer Helpline (1915), then the Consumer Commission on e-Jagriti within 2 years.',
    questions: [
      { id: 'ec_problem', text: 'What went wrong?', why: 'Each problem needs slightly different proof.', options: o([['notdel', 'Not delivered (but shown as delivered)'], ['wrong', 'Wrong or empty item'], ['fake', 'Fake or used item'], ['damaged', 'Damaged / not working'], ['return', 'Return or refund refused'], ['cancel', 'Cancelled but money not back']]) },
      { id: 'ec_paid', text: 'How did you pay?', why: 'Card and UPI payments have extra routes through the bank.', options: o([['card', 'Card'], ['upi', 'UPI / wallet'], ['cod', 'Cash on delivery'], ['emi', 'EMI / pay later']]) },
      { id: 'ec_complained', text: 'Have you complained to the platform?', why: 'The platform\'s grievance officer must respond within set times.', options: o([['ticket', 'Yes, with a ticket number'], ['chat', 'Only chat or call'], ['no', 'Not yet']]) },
      { id: 'ec_value', text: 'Roughly how much is involved?', why: 'Helps decide whether to go beyond the helpline.', options: o([['u5k', 'Under ₹5,000'], ['5to50', '₹5,000–₹50,000'], ['over50', 'More than ₹50,000']]) },
      { id: 'ec_unbox', text: 'Do you have an unboxing video or photos?', deep: true, why: 'The strongest proof for wrong, empty or damaged items.', options: o([['video', 'Video'], ['photos', 'Photos'], ['no', 'No']]) },
      { id: 'ec_nch', text: 'Have you filed on the National Consumer Helpline?', deep: true, why: 'Platforms usually respond to NCH quickly.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'ec_e_order', name: 'Order page, invoice and seller name', fact: 'What you bought and from whom', why: 'Basic proof of the purchase.', where: 'App order history, email.', preserve: 'Download the invoice PDF.' },
      { id: 'ec_e_dates', name: 'Key dates: order, promised delivery, complaint, and any refund promise', fact: 'Timeline', why: 'Shows delays against the platform\'s own promises and the 1-month redress rule.', where: 'Your notes and app.', preserve: '' },
      { id: 'ec_e_pay', name: 'Payment proof', fact: 'You paid', why: 'Needed for refund and chargeback.', where: 'Bank / UPI statement.', preserve: '', when: NOT(W('ec_paid', 'cod')) },
      { id: 'ec_e_track', name: 'Tracking page and delivery status', fact: 'Delivery claims', why: 'Shows "delivered" when it was not.', where: 'Order tracking.', preserve: 'Screenshot with date and time.', when: W('ec_problem', 'notdel') },
      { id: 'ec_e_unbox', name: 'Unboxing video / photos of what arrived', fact: 'What was actually in the box', why: 'The key proof for wrong, empty, fake or damaged items.', where: 'Your phone.', preserve: 'Keep the original file and the packaging.', when: W('ec_problem', 'wrong', 'fake', 'damaged') },
      { id: 'ec_e_listing', name: 'Product listing as it was when you ordered', fact: 'What was promised', why: 'Proves it was not as described.', where: 'Product page.', preserve: 'Screenshot now — listings change.', when: W('ec_problem', 'wrong', 'fake', 'damaged') },
      { id: 'ec_e_chat', name: 'Complaint tickets, chat transcripts and replies', fact: 'You complained and how they replied', why: 'Shows the platform had a chance to fix it.', where: 'App help section, email.', preserve: '', when: W('ec_complained', 'ticket', 'chat') },
      { id: 'ec_e_grievance', name: 'Write to the platform\'s grievance officer (details on its website)', fact: 'Formal complaint', why: 'They must acknowledge within 48 hours and redress within one month.', where: 'Platform\'s "Grievance Officer" page.', preserve: 'Keep the email.', action: true, when: W('ec_complained', 'chat', 'no') },
      { id: 'ec_e_nch', name: 'File on National Consumer Helpline (1915 / consumerhelpline.gov.in)', fact: 'Pre-litigation complaint', why: 'Most e-commerce refunds are settled here.', where: 'consumerhelpline.gov.in', preserve: 'Note the docket number.', action: true, when: NOT(W('ec_nch', 'yes')) },
      { id: 'ec_e_bank', name: 'Dispute the charge with your card issuer or bank', fact: 'Chargeback route', why: 'Can reverse the payment if the platform fails.', where: 'Card app / bank.', preserve: '', action: true, when: W('ec_paid', 'card', 'emi') }
    ],
    urgent: [
      { id: 'ec_u_return', level: 'soon', when: W('ec_problem', 'wrong', 'fake', 'damaged'), title: 'Return windows are short', text: 'Raise it in the app now, even if you also complain elsewhere. Keep the item and packaging.', help: ['nch'] }
    ],
    stand: [
      { k: 'good', when: W('ec_unbox', 'video'), text: 'An unboxing video is the strongest proof you can have.' },
      { k: 'risk', when: ALL(W('ec_problem', 'wrong', 'damaged'), W('ec_unbox', 'no')), text: 'Without photos or video it is your word against the seller\'s — keep the packaging and invoice.' },
      { k: 'next', when: W('ec_value', 'u5k', '5to50'), text: 'The National Consumer Helpline usually resolves this size of claim without court.' },
      { k: 'next', when: W('ec_value', 'over50'), text: 'If the helpline fails, a District Consumer Commission complaint (e-Jagriti) is the next step.' }
    ],
    lawyerQs: [{ text: 'Is the platform or the seller responsible here?' }, { text: 'Should I file in the District Consumer Commission, and for how much compensation?' }]
  });

  /* ---------------- Flight / travel refund ---------------- */
  I.push({
    id: 'travel-refund', cat: 'shopping', title: 'Flight, train, bus, hotel or travel package — refund, cancellation or delay', short: 'Flight or travel refund',
    synonyms: ['flight cancelled refund', 'airline refund', 'indigo refund', 'flight delay compensation', 'denied boarding', 'lost baggage', 'travel agent refund', 'makemytrip refund', 'irctc refund', 'tdr refund', 'hotel booking refund', 'tour package cancelled', 'visa agent fraud'],
    intro: 'Airlines now have firm refund deadlines. For trains, hotels and packages, the consumer helpline and commission are the main routes.',
    juris: 'DGCA\'s revised refund rules (in force from 26 March 2026): refunds within 14 working days, the airline is responsible even when you booked through an agent or portal, a free 48-hour "look-in" to cancel or change (for bookings made well ahead), and free name correction within 24 hours on direct bookings. Other travel disputes go to the National Consumer Helpline and Consumer Commission.',
    questions: [
      { id: 'ft_mode', text: 'What was it?', why: 'Rules differ by type of travel.', options: o([['flight', 'Flight'], ['train', 'Train'], ['bus', 'Bus'], ['hotel', 'Hotel'], ['package', 'Tour package / travel agent']]) },
      { id: 'ft_problem', text: 'What happened?', why: 'Cancellation, delay and baggage have different remedies.', options: o([['theycancel', 'They cancelled / changed it'], ['icancel', 'I cancelled'], ['delay', 'Long delay'], ['denied', 'Denied boarding / overbooked'], ['baggage', 'Lost or damaged baggage'], ['service', 'Not as promised']]) },
      { id: 'ft_booked', text: 'How did you book?', why: 'For flights, the airline is responsible even for agent bookings.', options: o([['direct', 'Directly with the company'], ['portal', 'Through an app or agent']]) },
      { id: 'ft_waited', text: 'How long have you been waiting for the refund?', why: 'Tells us whether the deadline has passed.', options: o([['u14', 'Less than 2 weeks'], ['o14', 'More than 2 weeks'], ['none', 'Not about a refund']]) },
      { id: 'ft_complained', text: 'Have you complained in writing?', deep: true, why: 'A written complaint starts the formal timelines.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'ft_e_ticket', name: 'Ticket / booking confirmation and fare breakup', fact: 'What you booked and paid', why: 'Basis for any refund.', where: 'Email, app.', preserve: 'Save the PDF.' },
      { id: 'ft_e_pay', name: 'Payment proof', fact: 'Amount paid', why: 'Refund is calculated from it.', where: 'Bank / card statement.', preserve: '' },
      { id: 'ft_e_notice', name: 'Cancellation, delay or schedule-change message from them', fact: 'They changed or cancelled', why: 'Decides whether you get a full refund or compensation.', where: 'SMS, email, app.', preserve: 'Screenshot with time.', when: W('ft_problem', 'theycancel', 'delay', 'denied') },
      { id: 'ft_e_cancel', name: 'Your cancellation confirmation and the refund amount shown', fact: 'You cancelled and what they promised', why: 'Shows deductions charged.', where: 'App / email.', preserve: '', when: W('ft_problem', 'icancel') },
      { id: 'ft_e_pir', name: 'Baggage irregularity report (PIR) and baggage tag', fact: 'Baggage problem recorded', why: 'Needed for any baggage claim.', where: 'Airline counter at the airport.', preserve: 'Keep the bag tag and receipts for essentials you bought.', when: W('ft_problem', 'baggage') },
      { id: 'ft_e_boarding', name: 'Boarding pass and proof you reached in time', fact: 'You were there', why: 'Needed for denied boarding or delay claims.', where: 'Phone, airport.', preserve: '', when: W('ft_problem', 'denied', 'delay') },
      { id: 'ft_e_promise', name: 'Brochure, itinerary or promises made', fact: 'What was promised', why: 'Proves service fell short.', where: 'Agent emails, website.', preserve: 'Screenshot the listing.', when: W('ft_problem', 'service') },
      { id: 'ft_e_complaint', name: 'Written complaint and its reference number', fact: 'You complained', why: 'Starts formal timelines.', where: 'Email / grievance page.', preserve: '', when: W('ft_complained', 'yes') },
      { id: 'ft_e_airsewa', name: 'Complain on AirSewa', fact: 'Escalation', why: 'Ministry portal that airlines respond to.', where: 'airsewa.gov.in', preserve: '', action: true, when: ALL(W('ft_mode', 'flight'), W('ft_waited', 'o14')) },
      { id: 'ft_e_nch', name: 'File on National Consumer Helpline (1915)', fact: 'Escalation', why: 'Travel is one of its biggest refund sectors.', where: 'consumerhelpline.gov.in', preserve: '', action: true, when: NOT(W('ft_mode', 'flight')) }
    ],
    info: [
      { when: ALL(W('ft_mode', 'flight'), W('ft_booked', 'portal')), text: 'For flights booked through an agent or portal, DGCA rules make the airline responsible for the refund — you do not have to chase both.' },
      { when: ALL(W('ft_mode', 'flight'), W('ft_problem', 'theycancel', 'delay', 'denied')), text: 'When the airline cancels, delays or denies boarding, DGCA rules may also give you an alternative flight, meals, a hotel or compensation depending on the case.' }
    ],
    urgent: [],
    stand: [
      { k: 'risk', when: ALL(W('ft_mode', 'flight'), W('ft_waited', 'o14')), text: 'More than 14 working days have passed — the airline may already be outside DGCA\'s refund deadline.' },
      { k: 'good', when: W('ft_problem', 'theycancel'), text: 'When they cancel, you are normally entitled to a full refund, not just a credit shell.' },
      { k: 'next', when: W('ft_mode', 'train', 'bus', 'hotel', 'package'), text: 'If the company does not resolve it, the Consumer Commission can order refund with compensation.' }
    ],
    lawyerQs: [{ text: 'Am I owed compensation beyond the refund?' }, { text: 'Is a Consumer Commission complaint worth filing for this amount?' }]
  });

  /* ---------------- Telecom / internet ---------------- */
  I.push({
    id: 'telecom-internet', cat: 'shopping', title: 'Mobile, broadband or DTH problem — wrong bill, no service, SIM or porting issue', short: 'Mobile, internet or DTH problem',
    synonyms: ['wrong mobile bill', 'broadband not working', 'internet down refund', 'jio complaint', 'airtel complaint', 'vi complaint', 'bsnl complaint', 'port out problem', 'sim swap', 'sim blocked', 'dth recharge', 'value added service charged', 'spam calls', 'postpaid bill dispute'],
    intro: 'Telecom complaints go first to the company and its appellate authority. The Supreme Court has confirmed you can also go to the Consumer Commission.',
    juris: 'Every operator must run a complaint centre and an appellate authority under TRAI rules. In Vodafone Idea v. Ajay Kumar Agarwal (2022) the Supreme Court held consumer complaints against telecom companies are maintainable.',
    questions: [
      { id: 'tc_problem', text: 'What is the problem?', why: 'Billing, service and SIM issues need different proof.', options: o([['bill', 'Wrong or inflated bill'], ['service', 'No service / very poor service'], ['sim', 'SIM blocked or swapped'], ['port', 'Porting problem'], ['vas', 'Charged for services I did not ask for'], ['spam', 'Spam / fraud calls']]) },
      { id: 'tc_type', text: 'Which service?', why: 'Postpaid bills and broadband outages are handled differently.', options: o([['prepaid', 'Mobile prepaid'], ['postpaid', 'Mobile postpaid'], ['broadband', 'Broadband / fibre'], ['dth', 'DTH / cable']]) },
      { id: 'tc_complained', text: 'Have you complained to the company?', why: 'A docket number is needed to go to the appellate authority.', options: o([['docket', 'Yes, I have a docket number'], ['call', 'Called, no number'], ['no', 'Not yet']]) },
      { id: 'tc_appeal', text: 'Have you gone to the company\'s appellate authority?', deep: true, when: W('tc_complained', 'docket'), why: 'The second step inside the company before outside remedies.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'tc_e_bills', name: 'Bills or recharge history for the disputed months', fact: 'What you were charged', why: 'Shows the wrong charges.', where: 'App, email.', preserve: 'Download PDFs.' },
      { id: 'tc_e_plan', name: 'Your plan details as sold to you', fact: 'What you agreed to', why: 'Charges outside the plan are disputable.', where: 'App, SMS, website.', preserve: 'Screenshot.' },
      { id: 'tc_e_outage', name: 'Dates and duration of outages, speed tests, technician visit records', fact: 'Service failure', why: 'Supports refund or compensation.', where: 'Your notes, speed-test app, SMS.', preserve: 'Keep a simple log.', when: W('tc_problem', 'service') },
      { id: 'tc_e_docket', name: 'Complaint docket numbers and replies', fact: 'You complained', why: 'Needed for escalation.', where: 'SMS from the operator.', preserve: '', when: W('tc_complained', 'docket') },
      { id: 'tc_e_sim', name: 'Messages about SIM change, and bank alerts after it', fact: 'SIM was swapped', why: 'SIM swap is often followed by bank fraud.', where: 'SMS, bank.', preserve: '', when: W('tc_problem', 'sim') },
      { id: 'tc_e_spam', name: 'Numbers and screenshots of spam/fraud calls', fact: 'Unsolicited calls', why: 'For reporting and blocking.', where: 'Call log.', preserve: '', when: W('tc_problem', 'spam') },
      { id: 'tc_e_docketact', name: 'Raise a complaint and get a docket number', fact: 'Formal complaint', why: 'Starts the process.', where: 'Customer care / app.', preserve: '', action: true, when: W('tc_complained', 'call', 'no') }
    ],
    urgent: [
      { id: 'tc_u_sim', level: 'now', when: W('tc_problem', 'sim'), title: 'A swapped SIM can empty your bank account', text: 'Call your bank to block online banking, then the operator. If money moved, call 1930.', help: ['cy1930'] }
    ],
    stand: [
      { k: 'next', when: W('tc_complained', 'docket'), text: 'If not fixed, escalate to the operator\'s appellate authority with your docket number.' },
      { k: 'next', when: W('tc_problem', 'spam'), text: 'Report the number on Sanchar Saathi (Chakshu) and register DND by sending "FULL BLOCK" to 1909.' },
      { k: 'good', when: W('tc_problem', 'bill', 'vas'), text: 'Charges outside your plan are usually reversed once you show the plan.' }
    ],
    lawyerQs: [{ text: 'Is a Consumer Commission complaint worth it for this, and what compensation can I ask?' }]
  });

  /* ---------------- Bank service / mis-selling ---------------- */
  I.push({
    id: 'bank-service', cat: 'money', title: 'Bank problem — wrong charges, mis-sold policy, account closed, locker or poor service', short: 'Bank charges, mis-selling or service',
    synonyms: ['bank charges', 'minimum balance charges', 'wrong deduction bank', 'mis selling insurance bank', 'bank sold insurance', 'fd broken', 'account closed without notice', 'bank locker', 'bank not responding', 'cheque book not issued', 'banking ombudsman', 'rbi complaint', 'senior citizen bank'],
    intro: 'Most bank problems follow one path: complain to the bank, wait 30 days, then go to the RBI Ombudsman. We will make sure you have what that needs.',
    juris: 'Under the RBI Integrated Ombudsman Scheme, you must first complain to the bank. If there is no reply in 30 days, or the reply is unsatisfactory, you can complain on cms.rbi.org.in — generally within one year of the bank\'s reply.',
    questions: [
      { id: 'bs_problem', text: 'What is the problem?', why: 'Each problem needs different proof.', options: o([['charges', 'Wrong or unexplained charges'], ['missell', 'They sold me insurance or an investment I did not want'], ['closed', 'Account closed or restricted'], ['locker', 'Locker problem'], ['service', 'Poor service / request ignored'], ['senior', 'Senior citizen or disability access refused']]) },
      { id: 'bs_complained', text: 'Have you complained in writing to the bank?', why: 'The Ombudsman needs a prior written complaint.', options: o([['ref', 'Yes, with a reference'], ['verbal', 'Only at the branch'], ['no', 'Not yet']]) },
      { id: 'bs_days', text: 'How long ago did you complain?', when: W('bs_complained', 'ref'), why: 'After 30 days without a fair reply you can go to RBI.', options: o([['u30', 'Less than 30 days'], ['o30', 'More than 30 days'], ['replied', 'They replied and I disagree']]) },
      { id: 'bs_when_sold', text: 'When was the policy or product sold?', when: W('bs_problem', 'missell'), why: 'Insurance has a free-look period to cancel for a refund.', options: o([['u30', 'In the last 30 days'], ['older', 'Earlier']]) }
    ],
    evidence: [
      { id: 'bs_e_stmt', name: 'Account statement showing the issue', fact: 'What happened in the account', why: 'Shows charges, debits or restrictions.', where: 'Net banking / passbook.', preserve: 'Download PDF.' },
      { id: 'bs_e_acct', name: 'Account number, branch and customer ID', fact: 'Which account', why: 'Every complaint form asks for it.', where: 'Passbook / app.', preserve: '' },
      { id: 'bs_e_timeline', name: 'A short dated timeline of what happened', fact: 'Sequence of events', why: 'Makes your complaint clear and complete.', where: 'Write it yourself.', preserve: '' },
      { id: 'bs_e_terms', name: 'Bank\'s schedule of charges or product terms', fact: 'What the bank was allowed to charge', why: 'Charges outside it are disputable.', where: 'Bank website.', preserve: 'Save the page.', when: W('bs_problem', 'charges') },
      { id: 'bs_e_policy', name: 'Policy document, proposal form and premium debits', fact: 'What was sold and what you signed', why: 'Mis-selling turns on what you were told and signed.', where: 'Email, bank, insurer.', preserve: '', when: W('bs_problem', 'missell') },
      { id: 'bs_e_pitch', name: 'Messages or notes of what the staff told you', fact: 'The sales promise', why: 'Shows you were misled.', where: 'Chats, your notes.', preserve: 'Write down dates and names now.', when: W('bs_problem', 'missell') },
      { id: 'bs_e_closure', name: 'Any notice of closure or restriction', fact: 'How the account was closed', why: 'Banks must give notice and reasons.', where: 'Letters, SMS, email.', preserve: '', when: W('bs_problem', 'closed') },
      { id: 'bs_e_locker', name: 'Locker agreement, rent receipts, and inventory if any', fact: 'Your locker contract', why: 'Decides bank liability.', where: 'Branch, your files.', preserve: '', when: W('bs_problem', 'locker') },
      { id: 'bs_e_comp', name: 'Written complaint to the bank and its reply', fact: 'Bank had its chance', why: 'Required before RBI.', where: 'Email, grievance portal.', preserve: '', when: W('bs_complained', 'ref') },
      { id: 'bs_e_write', name: 'Send a written complaint to the bank (email or grievance portal)', fact: 'Formal complaint', why: 'Starts the 30-day clock.', where: 'Bank\'s grievance page.', preserve: 'Keep the reference.', action: true, when: W('bs_complained', 'verbal', 'no') },
      { id: 'bs_e_rbi', name: 'File on cms.rbi.org.in', fact: 'Ombudsman complaint', why: 'Free and binding on the bank if you accept the award.', where: 'cms.rbi.org.in', preserve: '', action: true, when: W('bs_days', 'o30', 'replied') }
    ],
    urgent: [
      { id: 'bs_u_freelook', level: 'soon', when: W('bs_when_sold', 'u30'), title: 'You may still cancel the policy for a refund', text: 'Insurance policies have a free-look period (30 days for most policies). Write to the insurer now asking to cancel under free-look.', help: ['ins'] }
    ],
    stand: [
      { k: 'next', when: W('bs_days', 'o30', 'replied'), text: 'You can now go to the RBI Ombudsman — it is free and needs no lawyer.' },
      { k: 'risk', when: W('bs_complained', 'verbal', 'no'), text: 'A branch conversation does not count — you need a written complaint first.' }
    ],
    lawyerQs: [{ text: 'Should I go to RBI or the Consumer Commission for this?' }]
  });

  /* ---------------- Traffic challan / vehicle seized ---------------- */
  I.push({
    id: 'traffic-challan', cat: 'police', title: 'Traffic challan, wrong e-challan, or my vehicle was seized', short: 'Traffic challan or seized vehicle',
    synonyms: ['traffic challan', 'e challan', 'wrong challan', 'challan not mine', 'contest challan', 'pay challan', 'vehicle seized', 'bike seized police', 'licence suspended', 'driving licence suspended', 'overspeeding challan', 'helmet challan', 'lok adalat challan', 'number plate cloned'],
    intro: 'Under the 2026 rules you have 45 days to pay or contest an e-challan with evidence. Missing that window counts as accepting it.',
    juris: 'Central Motor Vehicles (Third Amendment) Rules, 2026: e-challans must reach you within 3 days (15 days if physical); you have 45 days to pay or contest on the portal with evidence; five or more challans in a calendar year can lead to licence suspension after a hearing. Some states are still adopting these rules. Pending challans are often settled at National Lok Adalats.',
    questions: [
      { id: 'tr_problem', text: 'What is your situation?', why: 'Contesting, paying and getting a vehicle back are different steps.', options: o([['wrong', 'Challan is wrong or not my vehicle'], ['pay', 'I want to settle old challans'], ['seized', 'My vehicle was seized'], ['licence', 'Licence suspension notice']]) },
      { id: 'tr_days', text: 'When was the challan issued?', when: W('tr_problem', 'wrong', 'pay'), why: 'The 45-day contest window decides your options.', options: o([['u45', 'Within the last 45 days'], ['o45', 'More than 45 days ago'], NS]) },
      { id: 'tr_docs', text: 'Are your vehicle documents valid (RC, insurance, PUC, licence)?', why: 'Seized vehicles are released against valid papers.', options: o([['all', 'All valid'], ['some', 'Some expired'], NS]) },
      { id: 'tr_count', text: 'How many challans this year?', deep: true, why: 'Five or more in a calendar year can trigger licence action.', options: o([['few', '1 to 4'], ['five', '5 or more'], NS]) }
    ],
    evidence: [
      { id: 'tr_e_challan', name: 'The challan (number, date, photo/video evidence)', fact: 'What you are accused of', why: 'Basis to pay or contest.', where: 'SMS link, echallan.parivahan.gov.in', preserve: 'Screenshot the challan page.' },
      { id: 'tr_e_alibi', name: 'Proof the vehicle was elsewhere or it was not a violation', fact: 'The challan is wrong', why: 'Contest needs documentary evidence.', where: 'Toll receipts, GPS history, photos, dashcam.', preserve: '', when: W('tr_problem', 'wrong') },
      { id: 'tr_e_rc', name: 'Registration certificate (RC)', fact: 'You own the vehicle', why: 'Needed for any release or contest.', where: 'DigiLocker / mParivahan / original.', preserve: '' },
      { id: 'tr_e_dl', name: 'Driving licence', fact: 'You are licensed', why: 'Asked for in every settlement or hearing.', where: 'DigiLocker / original.', preserve: '' },
      { id: 'tr_e_paidlist', name: 'List of pending challans and receipts for any already paid', fact: 'What is pending', why: 'Avoids paying twice; needed at Lok Adalat.', where: 'echallan.parivahan.gov.in', preserve: 'Screenshot the list.', when: W('tr_problem', 'pay', 'licence') },
      { id: 'tr_e_ins', name: 'Insurance and PUC certificate', fact: 'Vehicle papers are valid', why: 'Required to release a seized vehicle.', where: 'DigiLocker / originals.', preserve: '', when: W('tr_problem', 'seized', 'licence') },
      { id: 'tr_e_seizure', name: 'Seizure memo / receipt', fact: 'Why and where it was seized', why: 'Needed to apply for release.', where: 'From the officer who seized it.', preserve: '', when: W('tr_problem', 'seized') },
      { id: 'tr_e_notice', name: 'Licence suspension notice', fact: 'Proposed action', why: 'You have a right to be heard first.', where: 'RTO letter / SMS.', preserve: '', when: W('tr_problem', 'licence') },
      { id: 'tr_e_contest', name: 'Contest the challan online with your evidence', fact: 'Formal objection', why: 'Silence for 45 days counts as acceptance.', where: 'echallan.parivahan.gov.in', preserve: 'Keep the grievance number.', action: true, when: ALL(W('tr_problem', 'wrong'), NOT(W('tr_days', 'o45'))) }
    ],
    urgent: [
      { id: 'tr_u_45', level: 'soon', when: ALL(W('tr_problem', 'wrong'), W('tr_days', 'u45')), title: 'Contest before 45 days run out', text: 'After 45 days the challan is treated as accepted and must be paid.', help: ['echallan'] }
    ],
    stand: [
      { k: 'risk', when: W('tr_count', 'five'), text: 'Five or more challans in a year can lead to licence suspension — contest wrong ones so they do not count.' },
      { k: 'next', when: W('tr_problem', 'pay'), text: 'Old pending challans are often settled at a National Lok Adalat, sometimes at a reduced amount.' },
      { k: 'risk', when: W('tr_docs', 'some'), text: 'Renew expired papers first — release and settlement usually need them.' }
    ],
    lawyerQs: [{ text: 'Should this go to the virtual court, Lok Adalat, or the RTO?' }, { text: 'How do I get my vehicle released quickly?', when: W('tr_problem', 'seized') }]
  });

  /* ---------------- Electricity bill / connection ---------------- */
  I.push({
    id: 'electricity-bill', cat: 'home', title: 'Electricity problem — high or wrong bill, disconnection, meter, or new connection delay', short: 'Electricity bill or connection',
    synonyms: ['high electricity bill', 'wrong electricity bill', 'meter fast', 'meter faulty', 'smart meter bill', 'power cut disconnection', 'disconnected without notice', 'new connection delay', 'electricity theft notice', 'discom complaint', 'cgrf', 'electricity ombudsman', 'bijli bill'],
    intro: 'Electricity disputes go to the distribution company, then its Consumer Grievance Redressal Forum (CGRF), then the state Electricity Ombudsman.',
    juris: 'Electricity (Rights of Consumers) Rules, 2020 (amended 2024) set service standards. Disconnection for non-payment needs at least 15 clear days\' written notice (Section 56, Electricity Act, 2003), and old arrears generally cannot be recovered after two years unless shown continuously as due. "Theft" assessments under Section 135 are serious — see an advocate.',
    questions: [
      { id: 'el_problem', text: 'What is the problem?', why: 'Each problem has a different route.', options: o([['bill', 'Bill much higher than usual / wrong'], ['meter', 'Faulty or fast meter'], ['disconnect', 'Disconnected or threatened'], ['newconn', 'New connection delayed'], ['theft', 'Theft / unauthorised use notice']]) },
      { id: 'el_complained', text: 'Have you complained to the electricity company?', why: 'CGRF usually needs a prior complaint.', options: o([['yes', 'Yes, with a complaint number'], ['no', 'Not yet']]) },
      { id: 'el_notice', text: 'Did you get a written notice before disconnection?', when: W('el_problem', 'disconnect'), why: 'Disconnection needs proper notice.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'el_paid', text: 'Have you paid the disputed bill?', deep: true, when: W('el_problem', 'bill', 'meter'), why: 'Paying under protest can avoid disconnection while you dispute.', options: o([['protest', 'Paid under protest'], ['part', 'Paid part'], ['no', 'Not paid']]) }
    ],
    evidence: [
      { id: 'el_e_bills', name: 'Last 12 months of bills', fact: 'Your normal usage', why: 'A sudden jump is the main proof of a wrong bill.', where: 'Discom app / website.', preserve: 'Download PDFs.' },
      { id: 'el_e_conn', name: 'Consumer / connection number and the owner\'s ID', fact: 'Whose connection it is', why: 'Every complaint needs it.', where: 'Any bill.', preserve: '' },
      { id: 'el_e_receipts', name: 'Payment receipts for recent bills', fact: 'What you have paid', why: 'Shows you are not in default, or what was paid under protest.', where: 'App / receipts.', preserve: '', when: W('el_problem', 'bill', 'meter', 'disconnect') },
      { id: 'el_e_meter', name: 'Photos of the meter reading with date', fact: 'Actual reading', why: 'Compares against the billed reading.', where: 'Your phone.', preserve: 'Take a photo every few days.', when: W('el_problem', 'bill', 'meter') },
      { id: 'el_e_test', name: 'Request for meter testing and its report', fact: 'Meter accuracy', why: 'A faulty meter requires bill revision.', where: 'Discom office.', preserve: '', when: W('el_problem', 'meter') },
      { id: 'el_e_notice', name: 'Disconnection notice (if any)', fact: 'Notice given or not', why: 'No proper notice makes the disconnection challengeable.', where: 'Letters, SMS.', preserve: '', when: W('el_problem', 'disconnect') },
      { id: 'el_e_app', name: 'New connection application and acknowledgement', fact: 'When you applied', why: 'Delay beyond the timeline can earn compensation.', where: 'Discom portal.', preserve: '', when: W('el_problem', 'newconn') },
      { id: 'el_e_theft', name: 'Inspection report, provisional assessment and seizure memo', fact: 'What is alleged', why: 'Needed to object within the time given.', where: 'From the inspecting team.', preserve: 'Do not sign anything you disagree with.', when: W('el_problem', 'theft') },
      { id: 'el_e_complaint', name: 'Complaint number and reply from the company', fact: 'You complained', why: 'Needed before CGRF.', where: 'Discom app / SMS.', preserve: '', when: W('el_complained', 'yes') },
      { id: 'el_e_cgrf', name: 'File with the CGRF (forum) of your discom', fact: 'Escalation', why: 'Free consumer forum for electricity disputes.', where: 'Discom website / office.', preserve: '', action: true, when: W('el_complained', 'yes') }
    ],
    urgent: [
      { id: 'el_u_theft', level: 'now', when: W('el_problem', 'theft'), title: 'Theft notices have short deadlines', text: 'Object in writing within the time given in the assessment and see an advocate quickly.', help: ['l15100'] }
    ],
    stand: [
      { k: 'good', when: W('el_notice', 'no'), text: 'Disconnection without a written notice of at least 15 clear days is challengeable.' },
      { k: 'good', when: W('el_paid', 'protest'), text: 'Paying under protest protects your supply while the dispute runs.' },
      { k: 'next', when: W('el_complained', 'yes'), text: 'If not resolved, go to the CGRF, then the state Electricity Ombudsman.' }
    ],
    lawyerQs: [{ text: 'Can I get the bill revised and compensation for wrong billing?' }, { text: 'How do I respond to the theft assessment?', when: W('el_problem', 'theft') }]
  });

  /* ---------------- Court marriage / couple protection ---------------- */
  I.push({
    id: 'court-marriage', cat: 'family', title: 'Court marriage, marriage registration, or protection for a couple facing threats', short: 'Court marriage & couple protection',
    synonyms: ['court marriage', 'special marriage act', 'love marriage', 'inter caste marriage', 'inter religion marriage', 'marriage registration', 'marriage certificate', 'arya samaj marriage', 'family threatening couple', 'police protection couple', 'run away marriage', 'live in registration', 'honour killing threat'],
    intro: 'Adults have the right to marry the person they choose. The papers you need depend on the law you marry under — and safety comes first if families are threatening you.',
    juris: 'Under the Special Marriage Act, 1954 one partner must have lived 30 days in the district before giving notice; the notice is displayed for 30 days for objections, and the marriage needs three witnesses. Hindu marriages can be registered after the ceremony under state rules. The Supreme Court (Shakti Vahini, 2018) directed police to protect couples facing threats and set up safe houses. Some states (e.g. Uttarakhand) require registration of marriages and live-in relationships.',
    questions: [
      { id: 'cm_safe', text: 'Are you or your partner facing threats?', why: 'Safety comes before paperwork.', options: o([['safe', 'No threats'], ['threat', 'Family is threatening us'], ['danger', 'We are in danger now'], PN]) },
      { id: 'cm_need', text: 'What do you need?', why: 'Getting married and registering a past marriage need different papers.', options: o([['marry', 'To get married in court'], ['register', 'To register a marriage already done'], ['protect', 'Police protection'], ['cert', 'A copy or correction of a certificate']]) },
      { id: 'cm_same', text: 'Do you both follow the same religion?', when: W('cm_need', 'marry', 'register'), why: 'Decides whether personal law or the Special Marriage Act is used.', options: o([['same', 'Yes'], ['diff', 'No'], PN]) },
      { id: 'cm_age', text: 'Are you both of legal age (man 21+, woman 18+)?', why: 'Age proof is mandatory.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'cm_foreign', text: 'Is either partner a foreign national, NRI or OCI?', deep: true, why: 'Extra documents like passport and visa are needed.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'cm_e_age', name: 'Age proof for both (birth certificate, Class 10 certificate or passport)', fact: 'Both are of legal age', why: 'Required for any marriage registration.', where: 'School, municipality, passport.', preserve: '' },
      { id: 'cm_e_id', name: 'Photo ID of both (Aadhaar, voter ID or passport)', fact: 'Identity', why: 'Required for registration and any police request.', where: '', preserve: '' },
      { id: 'cm_e_cert', name: 'Existing marriage certificate or registration number', fact: 'Marriage already registered', why: 'Needed to get a copy or correction.', where: 'Your records / registrar.', preserve: '', when: W('cm_need', 'cert') },
      { id: 'cm_e_contacts', name: 'Contact details of a trusted friend, advocate and the local police station', fact: 'Help is reachable', why: 'Useful in an emergency and for any protection order.', where: '', preserve: 'Save in both phones.', when: ANY(W('cm_safe', 'threat', 'danger'), W('cm_need', 'protect')) },
      { id: 'cm_e_address', name: 'Address proof showing 30 days\' residence in the district', fact: 'Residence requirement', why: 'Needed for the Special Marriage Act notice.', where: 'Aadhaar, rent agreement, utility bill.', preserve: '', when: W('cm_need', 'marry') },
      { id: 'cm_e_photos', name: 'Passport photos of both', fact: 'Identity', why: 'Attached to the application.', where: '', preserve: '', when: W('cm_need', 'marry', 'register') },
      { id: 'cm_e_status', name: 'Proof of single status (affidavit; divorce decree or death certificate if previously married)', fact: 'Free to marry', why: 'A prior subsisting marriage makes a new one void.', where: 'Notary / court records.', preserve: '', when: W('cm_need', 'marry', 'register') },
      { id: 'cm_e_witness', name: 'Three witnesses with ID and address proof', fact: 'Witnesses to the marriage', why: 'Required at registration.', where: 'Friends / relatives.', preserve: '', holder: 'others', when: W('cm_need', 'marry', 'register') },
      { id: 'cm_e_ceremony', name: 'Wedding invitation, photos and ceremony proof', fact: 'Marriage took place', why: 'Needed to register a marriage already done.', where: 'Your photos, temple/gurudwara/church certificate.', preserve: '', when: W('cm_need', 'register') },
      { id: 'cm_e_threats', name: 'Threat messages, call recordings, names of those threatening', fact: 'Danger to the couple', why: 'Supports a protection request to police or High Court.', where: 'Phones.', preserve: 'Back up to cloud.', when: ANY(W('cm_safe', 'threat', 'danger'), W('cm_need', 'protect')) },
      { id: 'cm_e_police', name: 'Written request to the Superintendent of Police for protection', fact: 'Police were told', why: 'Courts expect you to approach police first.', where: 'SP office / email.', preserve: 'Keep the received copy.', action: true, when: ANY(W('cm_safe', 'threat', 'danger'), W('cm_need', 'protect')) },
      { id: 'cm_e_foreign', name: 'Passport, visa and no-impediment/single-status certificate from the embassy', fact: 'Foreign partner can marry', why: 'Required for a foreign national.', where: 'Embassy.', preserve: '', when: W('cm_foreign', 'yes') }
    ],
    urgent: [
      { id: 'cm_u_danger', level: 'now', when: W('cm_safe', 'danger'), title: 'Get to safety now', text: 'Call 112. Ask police for protection and a safe house — the Supreme Court has directed police to protect couples.', help: ['e112', 'w181', 'l15100'] }
    ],
    info: [{ when: W('cm_age', 'no'), text: 'A marriage below the legal age is not allowed. Please speak to a legal aid lawyer (15100) before taking any step.' }],
    stand: [
      { k: 'next', when: ALL(W('cm_need', 'marry'), W('cm_same', 'diff')), text: 'You will marry under the Special Marriage Act — expect about 30 days of notice before the date.' },
      { k: 'good', when: ALL(W('cm_need', 'register'), W('cm_same', 'same')), text: 'A ceremony already done under your personal law can usually be registered quickly.' },
      { k: 'risk', when: W('cm_safe', 'threat'), text: 'The public notice can reveal your plans — ask an advocate about protection before filing.' }
    ],
    lawyerQs: [{ text: 'Which law should we marry or register under?' }, { text: 'Should we file a protection petition in the High Court?', when: W('cm_safe', 'threat', 'danger') }]
  });

  /* ---------------- Parents / senior citizen maintenance ---------------- */
  I.push({
    id: 'parents-maintenance', cat: 'family', title: 'My children or relatives are not looking after me (senior citizen / parent)', short: 'Senior citizen neglected by children',
    synonyms: ['children not taking care of parents', 'son not giving money', 'parents maintenance', 'senior citizen act', 'elderly abuse', 'thrown out by son', 'gift deed cancel son', 'senior citizen tribunal', 'old age maintenance', 'daughter in law harassing'],
    intro: 'Parents and senior citizens can claim monthly maintenance from children or heirs through a tribunal that must decide quickly. Property given on a promise of care can sometimes be taken back.',
    juris: 'Maintenance and Welfare of Parents and Senior Citizens Act, 2007: the tribunal (usually the SDM) can order up to ₹10,000 a month and should decide within 90 days. A transfer of property made on condition of care can be declared void if the care is refused (Section 23). Maintenance can also be claimed before a magistrate under the BNSS, without that cap.',
    questions: [
      { id: 'pm_safe', text: 'Are you safe where you live?', why: 'Abuse needs urgent help.', options: o([['safe', 'Yes'], ['threat', 'I am being abused or threatened'], ['out', 'I have been thrown out'], PN]) },
      { id: 'pm_who', text: 'Who should be supporting you?', why: 'Children, grandchildren and heirs can be ordered to pay.', options: o([['son', 'Son(s)'], ['daughter', 'Daughter(s)'], ['both', 'Sons and daughters'], ['heir', 'Relatives who will inherit']]) },
      { id: 'pm_property', text: 'Did you give or transfer property to them?', why: 'A gift made on condition of care can be challenged.', options: o([['gift', 'Yes, by gift deed'], ['will', 'Only in my will'], ['no', 'No']]) },
      { id: 'pm_income', text: 'Do you have your own income?', why: 'Maintenance depends on your needs and their means.', options: o([['none', 'No income'], ['pension', 'Small pension or income'], ['enough', 'Enough, but they took my property']]) }
    ],
    evidence: [
      { id: 'pm_e_age', name: 'Age proof (Aadhaar, pension book or birth certificate)', fact: 'You are a parent / senior citizen', why: 'The Act applies to parents and people 60+.', where: '', preserve: '' },
      { id: 'pm_e_relation', name: 'Proof of relationship to the children (birth certificates, ration card, family register)', fact: 'They are your children or heirs', why: 'Who can be ordered to pay.', where: 'Municipality, ration office.', preserve: '' },
      { id: 'pm_e_needs', name: 'List of monthly expenses with medical bills', fact: 'Your needs', why: 'Decides the amount.', where: 'Pharmacy and hospital bills.', preserve: '' },
      { id: 'pm_e_their', name: 'What you know of their income, jobs, property', fact: 'They can pay', why: 'The tribunal looks at their means.', where: 'Your knowledge, salary info, property records.', preserve: '' },
      { id: 'pm_e_gift', name: 'Gift deed or transfer document, and anything showing it was on condition of care', fact: 'Property given for care', why: 'Needed to ask for the transfer to be declared void.', where: 'Sub-registrar, your copy.', preserve: '', when: W('pm_property', 'gift') },
      { id: 'pm_e_abuse', name: 'Medical reports, photos, witnesses of neglect or abuse', fact: 'Ill-treatment', why: 'Supports protection and eviction requests.', where: 'Doctors, neighbours.', preserve: '', when: W('pm_safe', 'threat', 'out') },
      { id: 'pm_e_app', name: 'Application to the Maintenance Tribunal (SDM office)', fact: 'Claim filed', why: 'Starts the 90-day process — no lawyer is required.', where: 'SDM / tribunal office.', preserve: 'Keep the receiving copy.', action: true }
    ],
    urgent: [
      { id: 'pm_u_abuse', level: 'now', when: W('pm_safe', 'threat', 'out'), title: 'You can get help today', text: 'Call 112 if in danger, or Elderline 14567 for support. Police in many states have senior-citizen cells.', help: ['e112', 's14567', 'l15100'] }
    ],
    stand: [
      { k: 'good', when: W('pm_property', 'gift'), text: 'If the gift was made on the understanding that you would be cared for, the tribunal can declare it void.' },
      { k: 'risk', when: W('pm_property', 'gift'), text: 'Courts look for proof that care was a condition — write down what was promised and who heard it.' },
      { k: 'next', text: 'Apply to the Maintenance Tribunal; it should decide within 90 days.' }
    ],
    lawyerQs: [{ text: 'Should I apply under the Senior Citizens Act or the BNSS — or both?' }, { text: 'Can the gift deed be cancelled?', when: W('pm_property', 'gift') }]
  });

  /* ---------------- Death in family: claims & certificates ---------------- */
  I.push({
    id: 'death-claims', cat: 'family', title: 'A family member died — bank, PF, insurance, pension and property claims', short: 'Claims after a death in the family',
    synonyms: ['legal heir certificate', 'succession certificate', 'nominee claim', 'deceased bank account', 'death claim bank', 'pf death claim', 'family pension', 'lic death claim', 'transfer property after death', 'mutation after death', 'probate', 'locker after death', 'shares after death', 'vehicle transfer after death'],
    intro: 'Each institution has its own claim form, but the same few papers repeat. Getting them early saves months.',
    juris: 'RBI\'s 2025 directions require banks to settle deceased depositors\' claims within 15 calendar days of receiving all documents, with compensation for delay. Since 1 November 2025, accounts can have up to four nominees. A nominee receives the money, but the legal heirs remain entitled to it under succession law. A succession certificate (civil court) is often needed for debts and securities when there is no nominee; a legal heir certificate is issued by the state revenue office.',
    questions: [
      { id: 'dh_assets', text: 'What do you need to claim first?', why: 'Each asset has different paperwork.', options: o([['bank', 'Bank account / FD / locker'], ['pf', 'PF, pension or gratuity'], ['ins', 'Life insurance'], ['property', 'House or land'], ['shares', 'Shares / mutual funds'], ['vehicle', 'Vehicle']]) },
      { id: 'dh_nominee', text: 'Was there a nominee?', why: 'With a nominee, claims are simpler.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'dh_will', text: 'Did they leave a will?', why: 'A will can change who receives what, and may need probate in some cities.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'dh_dispute', text: 'Is anyone in the family disputing the claim?', why: 'A dispute usually means a court process.', options: o([['no', 'No, all agree'], ['yes', 'Yes'], NS]) },
      { id: 'dh_bankreply', text: 'Has the bank or institution delayed or refused?', deep: true, why: 'Delays beyond the deadlines can be escalated.', options: o([['delay', 'Delayed'], ['refused', 'Refused'], ['notyet', 'Not applied yet']]) }
    ],
    evidence: [
      { id: 'dh_e_death', name: 'Death certificate (several attested copies)', fact: 'The death', why: 'Every claim needs it.', where: 'Municipality / panchayat registrar.', preserve: 'Get 5–10 copies.' },
      { id: 'dh_e_idkyc', name: 'Your ID and KYC, and the deceased\'s ID', fact: 'Identity of claimant and deceased', why: 'Required by all institutions.', where: '', preserve: '' },
      { id: 'dh_e_details', name: 'List of accounts, policies, PF/UAN, folio and property details', fact: 'What exists', why: 'Lets you claim everything; nothing is missed.', where: 'Passbooks, emails, tax returns, CAS statement.', preserve: '' },
      { id: 'dh_e_nominee', name: 'Nomination records', fact: 'Who is nominee', why: 'Simplifies the claim.', where: 'Bank, insurer, EPFO, depository.', preserve: '', when: W('dh_nominee', 'yes', 'unsure') },
      { id: 'dh_e_heir', name: 'Legal heir certificate or family tree / heirship affidavit', fact: 'Who the heirs are', why: 'Needed where there is no nominee, and for pension and property.', where: 'Tahsildar / revenue office.', preserve: '', when: ANY(W('dh_nominee', 'no', 'unsure'), W('dh_assets', 'property', 'pf')) },
      { id: 'dh_e_noc', name: 'No-objection letters from the other heirs', fact: 'Heirs agree', why: 'Lets one person claim without a court.', where: 'Other heirs.', preserve: '', holder: 'others', when: W('dh_dispute', 'no') },
      { id: 'dh_e_will', name: 'The will (original) and probate if required', fact: 'Their wishes', why: 'Decides distribution where valid.', where: 'Family, lawyer, sub-registrar.', preserve: 'Keep the original safe.', when: W('dh_will', 'yes') },
      { id: 'dh_e_pf', name: 'EPF death claim forms (PF, pension and EDLI insurance)', fact: 'PF and pension claim', why: 'EPFO pays PF, family pension and EDLI insurance.', where: 'EPFO portal / employer.', preserve: '', when: W('dh_assets', 'pf') },
      { id: 'dh_e_policy', name: 'Insurance policy document and claim form', fact: 'Life cover', why: 'Basis of the insurance claim.', where: 'Insurer.', preserve: '', when: W('dh_assets', 'ins') },
      { id: 'dh_e_title', name: 'Property title documents and tax receipts', fact: 'Property owned', why: 'Needed for mutation in heirs\' names.', where: 'Family records, sub-registrar.', preserve: '', when: W('dh_assets', 'property') },
      { id: 'dh_e_rc', name: 'Vehicle RC and insurance', fact: 'Vehicle owned', why: 'Needed to transfer the vehicle.', where: '', preserve: '', when: W('dh_assets', 'vehicle') },
      { id: 'dh_e_complaint', name: 'Written complaint about the delay, then escalation (RBI / insurer / EPFO portal)', fact: 'Escalation', why: 'Deadlines are enforceable.', where: 'cms.rbi.org.in / Bima Bharosa / EPFiGMS', preserve: '', action: true, when: W('dh_bankreply', 'delay', 'refused') }
    ],
    urgent: [],
    stand: [
      { k: 'good', when: W('dh_nominee', 'yes'), text: 'With a nominee, the bank should settle within 15 days of receiving all documents.' },
      { k: 'risk', when: W('dh_dispute', 'yes'), text: 'A family dispute usually means a succession certificate or civil case — avoid signing releases until advised.' },
      { k: 'risk', when: W('dh_nominee', 'no'), text: 'Without a nominee, larger amounts may need a succession certificate from the civil court.' },
      { k: 'next', when: W('dh_will', 'yes'), text: 'Ask whether the will needs probate in your city before institutions will act on it.' }
    ],
    lawyerQs: [{ text: 'Do I need a succession certificate, legal heir certificate or probate — and for which assets?' }, { text: 'How should the property be divided among heirs?', when: W('dh_assets', 'property') }]
  });

  /* ---------------- Buying property: checks / fraud ---------------- */
  I.push({
    id: 'property-purchase', cat: 'home', title: 'Buying property — what to check, or I was cheated in a property deal', short: 'Buying property safely / fraud',
    synonyms: ['property documents check', 'title verification', 'encumbrance certificate', 'buying flat documents', 'buying land checklist', 'sale deed fraud', 'property sold twice', 'fake owner', 'power of attorney sale', 'advance paid seller backed out', 'agreement to sell', 'mutation khata', 'rera registration check'],
    intro: 'Most property fraud is avoidable with a title check before paying. If it has already happened, act fast — before the property is sold again.',
    juris: 'Title passes only by a registered sale deed; a power-of-attorney or agreement sale does not transfer ownership (Supreme Court, Suraj Lamp, 2011). New projects must be RERA-registered. Tax must be deducted at 1% where the price is ₹50 lakh or more.',
    questions: [
      { id: 'pp_stage', text: 'Where are you?', why: 'Before buying is about checks; after a fraud is about speed.', options: o([['before', 'Planning to buy'], ['advance', 'Paid an advance / agreement signed'], ['after', 'Bought, and now there is a problem'], ['cheated', 'I was cheated (fake owner / sold twice)']]) },
      { id: 'pp_kind', text: 'What kind of property?', why: 'Flats, plots and farmland need different checks.', options: o([['newflat', 'New flat from a builder'], ['resale', 'Resale flat / house'], ['plot', 'Plot'], ['agri', 'Agricultural land']]) },
      { id: 'pp_seller', text: 'Who is selling?', why: 'Sales through power of attorney or many heirs need extra care.', options: o([['owner', 'The owner directly'], ['poa', 'Through a power of attorney'], ['heirs', 'Heirs of the owner'], ['builder', 'Builder / developer']]) },
      { id: 'pp_paid', text: 'How did you pay?', when: W('pp_stage', 'advance', 'after', 'cheated'), why: 'Bank payments are easy to prove.', options: o([['bank', 'Bank / cheque'], ['cash', 'Cash'], ['mixed', 'Both']]) }
    ],
    evidence: [
      { id: 'pp_e_title', name: 'Chain of title documents for about 30 years', fact: 'Seller owns it', why: 'The core check — who owned it before and how it passed.', where: 'Seller, sub-registrar office.', preserve: 'Get certified copies.' },
      { id: 'pp_e_ec', name: 'Encumbrance certificate', fact: 'No loans or sales registered against it', why: 'Reveals mortgages and earlier sales.', where: 'Sub-registrar / state portal.', preserve: '' },
      { id: 'pp_e_records', name: 'Revenue / municipal records (mutation, khata, record of rights) and tax receipts', fact: 'Records show the seller', why: 'Must match the title documents.', where: 'Tahsil / municipality.', preserve: '' },
      { id: 'pp_e_rera', name: 'RERA registration, approved plan and occupancy/completion certificate', fact: 'Project is legal', why: 'Unregistered projects and missing OC are major risks.', where: 'State RERA portal, builder.', preserve: '', when: W('pp_kind', 'newflat') },
      { id: 'pp_e_poa', name: 'Registered power of attorney and proof the owner is alive', fact: 'Agent can sell', why: 'A cancelled PoA or deceased owner makes the sale invalid.', where: 'Seller.', preserve: '', when: W('pp_seller', 'poa') },
      { id: 'pp_e_heirs', name: 'Death certificate, legal heir proof and consent of all heirs', fact: 'All heirs agree', why: 'One missing heir can challenge the sale.', where: 'Seller family.', preserve: '', when: W('pp_seller', 'heirs') },
      { id: 'pp_e_landuse', name: 'Land-use / conversion order and any purchase eligibility', fact: 'Land can be bought and built on', why: 'Agricultural land has state restrictions.', where: 'Revenue office.', preserve: '', when: W('pp_kind', 'agri', 'plot') },
      { id: 'pp_e_agreement', name: 'Agreement to sell, receipts and payment proof', fact: 'What you paid and the terms', why: 'Basis for refund or a suit to enforce the sale.', where: 'Your records, bank statement.', preserve: '', when: W('pp_stage', 'advance', 'after', 'cheated') },
      { id: 'pp_e_fir', name: 'Police complaint about the fraud', fact: 'Crime reported', why: 'Forgery and cheating are crimes; quick reporting matters.', where: 'Police station / economic offences wing.', preserve: '', action: true, when: W('pp_stage', 'cheated') }
    ],
    urgent: [
      { id: 'pp_u_cheat', level: 'now', when: W('pp_stage', 'cheated'), title: 'Stop it from being sold again', text: 'See an advocate quickly about a court order restraining further sale and a police complaint. Check the encumbrance certificate today.', help: ['l15100'] }
    ],
    stand: [
      { k: 'risk', when: W('pp_seller', 'poa'), text: 'A sale through power of attorney alone does not give you title — insist on a registered sale deed signed by an authorised attorney.' },
      { k: 'risk', when: W('pp_paid', 'cash'), text: 'Cash payments are hard to prove — collect signed receipts and witnesses now.' },
      { k: 'next', when: W('pp_stage', 'before'), text: 'Get a lawyer\'s title search report before paying any big advance.' }
    ],
    lawyerQs: [{ text: 'Is the title clear, and what risks remain?' }, { text: 'Should I sue for refund or to enforce the sale?', when: W('pp_stage', 'advance', 'cheated') }]
  });

  /* ---------------- PF / gratuity ---------------- */
  I.push({
    id: 'pf-gratuity', cat: 'work', title: 'PF not deposited, PF withdrawal stuck, or gratuity not paid', short: 'PF or gratuity problem',
    synonyms: ['pf not deposited', 'pf withdrawal rejected', 'pf claim rejected', 'pf transfer', 'uan problem', 'epf passbook', 'employer not paying pf', 'gratuity not paid', 'gratuity calculation', 'pension epfo', 'eps pension', 'kyc mismatch pf', 'date of exit pf'],
    intro: 'PF problems usually go to EPFO; unpaid gratuity goes to the Controlling Authority. Both are free and need no lawyer to start.',
    juris: 'The Code on Social Security, 2020 (in force from 21 November 2025) now covers both. Gratuity is due after 5 years of continuous service (1 year for fixed-term employees), capped at ₹20 lakh, and must be paid within 30 days of becoming due. The EPF wage ceiling was raised to ₹25,000 a month from 17 September 2026.',
    questions: [
      { id: 'pf_issue', text: 'What is the problem?', why: 'PF and gratuity go to different authorities.', options: o([['notdep', 'Employer deducted PF but did not deposit'], ['withdraw', 'Withdrawal or claim rejected / stuck'], ['transfer', 'Transfer or UAN / KYC problem'], ['gratuity', 'Gratuity not paid or underpaid'], ['pension', 'Pension (EPS) problem']]) },
      { id: 'pf_years', text: 'How long did you work there?', when: W('pf_issue', 'gratuity'), why: 'Gratuity eligibility depends on service length.', options: o([['u1', 'Under 1 year'], ['1to5', '1 to 5 years'], ['o5', '5 years or more']]) },
      { id: 'pf_fixed', text: 'Were you a fixed-term (contract) employee?', when: W('pf_years', '1to5'), why: 'Fixed-term employees qualify after 1 year.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'pf_grievance', text: 'Have you filed a grievance?', why: 'A grievance number helps escalation.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'pf_e_slips', name: 'Salary slips showing PF deductions', fact: 'PF was deducted', why: 'Proves the employer took your share.', where: 'HR / email.', preserve: '' },
      { id: 'pf_e_passbook', name: 'EPF passbook and UAN details', fact: 'What was deposited', why: 'Gaps show non-deposit.', where: 'EPFO member portal / UMANG.', preserve: 'Download PDF.' },
      { id: 'pf_e_est', name: 'Employer name, establishment code and your dates of joining and leaving', fact: 'Which employer and period', why: 'EPFO tracks deposits by establishment.', where: 'Passbook header, HR letters.', preserve: '' },
      { id: 'pf_e_eps', name: 'EPS scheme certificate or pension payment order (PPO)', fact: 'Pension entitlement', why: 'Needed for pension disputes.', where: 'EPFO.', preserve: '', when: W('pf_issue', 'pension') },
      { id: 'pf_e_reject', name: 'Claim rejection message and reason', fact: 'Why it was rejected', why: 'Most rejections are KYC or date mismatches that can be fixed.', where: 'EPFO portal.', preserve: '', when: W('pf_issue', 'withdraw', 'transfer') },
      { id: 'pf_e_kyc', name: 'Aadhaar, PAN and bank details matching EPFO records', fact: 'KYC matches', why: 'Name, date of birth and bank mismatches block claims.', where: '', preserve: '', when: W('pf_issue', 'withdraw', 'transfer') },
      { id: 'pf_e_service', name: 'Appointment letter, relieving letter and last salary details', fact: 'Service period and wages', why: 'Gratuity is calculated from them.', where: 'HR.', preserve: '', when: W('pf_issue', 'gratuity') },
      { id: 'pf_e_demand', name: 'Written gratuity claim to employer and any reply', fact: 'You claimed it', why: 'Needed before the Controlling Authority.', where: 'Email / letter.', preserve: '', when: W('pf_issue', 'gratuity') },
      { id: 'pf_e_griev', name: 'File on EPFiGMS', fact: 'Grievance raised', why: 'Gets EPFO to act on deposit, claim or transfer issues.', where: 'epfigms.gov.in', preserve: '', action: true, when: ALL(NOT(W('pf_issue', 'gratuity')), W('pf_grievance', 'no')) }
    ],
    urgent: [],
    stand: [
      { k: 'good', when: ANY(W('pf_years', 'o5'), W('pf_fixed', 'yes')), text: 'You appear eligible for gratuity on service length.' },
      { k: 'risk', when: ALL(W('pf_years', '1to5'), W('pf_fixed', 'no')), text: 'Permanent employees usually need 5 years (except on death or disablement).' },
      { k: 'next', when: W('pf_issue', 'notdep'), text: 'Non-deposit of deducted PF is serious — EPFO can recover it with interest and damages.' }
    ],
    lawyerQs: [{ text: 'How much gratuity is due, and should I apply to the Controlling Authority?', when: W('pf_issue', 'gratuity') }]
  });

  /* ---------------- Medical negligence / hospital ---------------- */
  I.push({
    id: 'medical-negligence', cat: 'accidents', title: 'Medical negligence, hospital overbilling, or hospital refusing records or discharge', short: 'Medical negligence or hospital dispute',
    synonyms: ['medical negligence', 'doctor negligence', 'wrong treatment', 'surgery gone wrong', 'hospital overcharging', 'hospital bill too high', 'hospital not giving records', 'hospital not releasing body', 'hospital detained patient bill', 'wrong diagnosis', 'death in hospital negligence', 'consumer case against hospital'],
    intro: 'Your medical records are the case. Hospitals must give copies on request, and a doctor is liable only if care fell well below accepted standards — an independent medical opinion usually decides it.',
    juris: 'Patients or attendants can get copies of records within 72 hours of a request (Indian Medical Council Regulations, 2002). Negligence claims go to the Consumer Commission (district up to ₹50 lakh, state up to ₹2 crore) within 2 years. Criminal cases against doctors need gross negligence and usually an independent medical opinion first (Jacob Mathew, 2005).',
    questions: [
      { id: 'mn_problem', text: 'What happened?', why: 'Negligence, billing and records have different routes.', options: o([['harm', 'Wrong treatment / harm'], ['death', 'A death we believe was negligent'], ['bill', 'Overbilling'], ['records', 'Refusing records'], ['detain', 'Not discharging patient or releasing body over bills']]) },
      { id: 'mn_when', text: 'When did it happen?', why: 'Consumer complaints have a 2-year limit.', options: o([['recent', 'In the last month'], ['y2', 'Within 2 years'], ['older', 'More than 2 years ago']]) },
      { id: 'mn_records', text: 'Do you have the medical records?', why: 'Nothing can be assessed without them.', options: o([['all', 'Full case file'], ['some', 'Only discharge summary / some reports'], ['none', 'None']]) },
      { id: 'mn_opinion', text: 'Has another doctor looked at what happened?', deep: true, why: 'An independent opinion is key evidence.', options: o([['yes', 'Yes, in writing'], ['verbal', 'Only verbally'], ['no', 'No']]) },
      { id: 'mn_postmortem', text: 'Was a post-mortem done?', deep: true, when: W('mn_problem', 'death'), why: 'It can establish the cause of death.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) }
    ],
    evidence: [
      { id: 'mn_e_file', name: 'Complete case file: admission notes, consent forms, treatment and nursing charts, test reports, discharge summary', fact: 'What was done', why: 'The core evidence in every medical case.', where: 'Hospital medical records department.', preserve: 'Request in writing; keep the request copy.', time: 'Ask now — records must be given within 72 hours of a request.' },
      { id: 'mn_e_bills', name: 'All bills, estimates and payment receipts', fact: 'What was charged', why: 'Proves overbilling and your loss.', where: 'Hospital billing.', preserve: 'Ask for an itemised bill.' },
      { id: 'mn_e_patient', name: 'Patient ID / admission number, and proof of your relationship if you are not the patient', fact: 'Whose treatment it was', why: 'Needed to request records and to file a claim.', where: 'Admission papers, family ID.', preserve: '' },
      { id: 'mn_e_timeline', name: 'Dated timeline: symptoms, what doctors said, what was done, what went wrong', fact: 'Sequence of events', why: 'Experts and commissions need a clear sequence.', where: 'Write it now while memory is fresh.', preserve: '', when: W('mn_problem', 'harm', 'death') },
      { id: 'mn_e_opinion', name: 'Written opinion from an independent doctor', fact: 'Care fell below standard', why: 'Commissions and police rely on expert opinion.', where: 'Another specialist.', preserve: '', when: W('mn_problem', 'harm', 'death') },
      { id: 'mn_e_after', name: 'Records of later treatment that fixed or found the problem', fact: 'The harm caused', why: 'Shows the consequence of the negligence.', where: 'Second hospital.', preserve: '', when: W('mn_problem', 'harm') },
      { id: 'mn_e_pm', name: 'Post-mortem report and death certificate', fact: 'Cause of death', why: 'Key in death cases.', where: 'Hospital / police.', preserve: '', when: W('mn_problem', 'death') },
      { id: 'mn_e_loss', name: 'Income proof and extra costs caused', fact: 'Financial loss', why: 'Decides compensation.', where: 'Salary slips, ITRs, bills.', preserve: '', when: W('mn_problem', 'harm', 'death') },
      { id: 'mn_e_request', name: 'Written request to the hospital for records', fact: 'Records requested', why: 'Refusal after 72 hours is itself a complaint.', where: 'Hospital MRD / email.', preserve: '', action: true, when: W('mn_records', 'some', 'none') }
    ],
    urgent: [
      { id: 'mn_u_detain', level: 'now', when: W('mn_problem', 'detain'), title: 'A hospital should not hold a patient or body over unpaid bills', text: 'Courts have repeatedly said so. Ask the hospital in writing, contact police or the district administration, and call 15100 for legal aid.', help: ['e112', 'l15100'] },
      { id: 'mn_u_old', level: 'soon', when: W('mn_when', 'older'), title: 'The 2-year limit may have passed', text: 'Consumer complaints must be filed within 2 years, though delay can sometimes be excused. See an advocate soon.', help: ['l15100'] }
    ],
    stand: [
      { k: 'risk', when: W('mn_records', 'none'), text: 'Without the case file nobody can judge the treatment — get the records first.' },
      { k: 'good', when: W('mn_opinion', 'yes'), text: 'A written independent opinion is often the strongest single piece of evidence.' },
      { k: 'next', when: W('mn_problem', 'bill'), text: 'An itemised bill compared with the estimate and package rates often settles overbilling.' }
    ],
    lawyerQs: [{ text: 'Is this negligence in law, or a known risk of the treatment?' }, { text: 'Consumer Commission, civil suit or criminal complaint — which fits?' }]
  });

  /* ---------------- School / college / coaching ---------------- */
  I.push({
    id: 'education-dispute', cat: 'other', title: 'School, college or coaching — fee refund, certificates withheld, or admission/result problem', short: 'College or school fee & certificates',
    synonyms: ['college not returning fees', 'fee refund college', 'admission cancelled refund', 'original certificates withheld', 'college not giving tc', 'transfer certificate', 'coaching refund', 'school fee hike', 'ugc refund policy', 'marksheet withheld', 'degree not given', 'result withheld'],
    intro: 'Colleges must refund fees on withdrawal as per UGC rules and cannot keep your original certificates. Schools and coaching centres have their own rules.',
    juris: 'UGC\'s fee-refund rules require refunds on withdrawal of admission (full refund, with a small processing deduction, if you withdraw in time) and prohibit higher-education institutions from retaining original certificates. School fee increases are regulated by state fee laws in many states. Education services can also be challenged before the Consumer Commission in some cases.',
    questions: [
      { id: 'ed_inst', text: 'What kind of institution?', why: 'Different rules and regulators apply.', options: o([['college', 'College / university'], ['school', 'School'], ['coaching', 'Coaching centre']]) },
      { id: 'ed_problem', text: 'What is the problem?', why: 'Refunds and certificates need different proof.', options: o([['refund', 'Fee not refunded after leaving'], ['certs', 'Original certificates withheld'], ['fee', 'Unfair fee or fee hike'], ['result', 'Result, marksheet or degree withheld']]) },
      { id: 'ed_withdrew', text: 'When did you withdraw?', when: W('ed_problem', 'refund'), why: 'The refund depends on timing.', options: o([['before', 'Before classes / last admission date'], ['after', 'After classes started'], NS]) },
      { id: 'ed_wrote', text: 'Have you asked in writing?', why: 'A written request is needed for any escalation.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'ed_e_receipts', name: 'Fee receipts and payment proof', fact: 'What you paid', why: 'Basis of the refund.', where: 'Institution, bank statement.', preserve: '' },
      { id: 'ed_e_enrol', name: 'Student ID / enrolment or roll number and admission records', fact: 'You were admitted', why: 'Identifies you in any complaint.', where: 'Institution, ID card.', preserve: '' },
      { id: 'ed_e_result', name: 'Admit card, result notice and any reason given for withholding', fact: 'Result or degree withheld', why: 'Shows what is held back and why.', where: 'Institution / board portal.', preserve: '', when: W('ed_problem', 'result') },
      { id: 'ed_e_admission', name: 'Admission letter, prospectus and fee/refund policy', fact: 'Terms promised', why: 'Shows the refund and fee terms.', where: 'Website, brochure.', preserve: 'Save the page as it was.' },
      { id: 'ed_e_withdraw', name: 'Withdrawal application with received stamp/date', fact: 'When you withdrew', why: 'Decides the refund percentage.', where: 'Your copy.', preserve: '', when: W('ed_problem', 'refund') },
      { id: 'ed_e_certslist', name: 'List of originals submitted and any receipt for them', fact: 'They hold your originals', why: 'Proves retention.', where: 'Admission receipt.', preserve: '', when: W('ed_problem', 'certs') },
      { id: 'ed_e_notice', name: 'Fee hike circulars and parent association communications', fact: 'The fee change', why: 'Shows whether the hike followed state rules.', where: 'School notices.', preserve: '', when: W('ed_problem', 'fee') },
      { id: 'ed_e_letter', name: 'Written request and any reply', fact: 'They were asked', why: 'Needed for UGC / regulator / court.', where: 'Email, registered post.', preserve: '', when: W('ed_wrote', 'yes') },
      { id: 'ed_e_ugc', name: 'Complain on UGC e-Samadhaan', fact: 'Regulator complaint', why: 'UGC acts on refund and certificate complaints.', where: 'UGC website.', preserve: '', action: true, when: W('ed_inst', 'college') }
    ],
    urgent: [
      { id: 'ed_u_certs', level: 'soon', when: W('ed_problem', 'certs'), title: 'You need your originals — ask in writing now', text: 'Colleges are not allowed to keep originals. Send a written demand and complain to UGC if refused.', help: ['ugc'] }
    ],
    stand: [
      { k: 'good', when: W('ed_withdrew', 'before'), text: 'Withdrawing before the admission deadline usually means a near-full refund.' },
      { k: 'risk', when: W('ed_withdrew', 'after'), text: 'After classes start, refunds reduce — the exact share depends on the policy that applied that year.' }
    ],
    lawyerQs: [{ text: 'Is a writ petition or consumer complaint the right route here?' }]
  });

  /* ---- retire directory items now covered by full guides ---- */
  KB.directory = KB.directory.filter((d) => !['Marriage registration', 'Elderly parent neglect', 'Digital lending app dispute', 'Telecom or internet service dispute', 'Sale deed or property purchase fraud', 'Provident fund or gratuity', 'Hospital billing or medical records refused', 'Alleged medical negligence', 'School, college or exam dispute'].includes(d.title));
})(typeof window !== 'undefined' ? window : globalThis);
