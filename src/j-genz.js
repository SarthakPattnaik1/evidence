/* Young people & students (Gen Z) — draft, not advocate-reviewed. Researched Oct 2026. */
(function (root) {
  const { W, ALL, ANY, NOT, o, NS, PN } = root.ER_H;
  const KB = root.ER_KB; const I = KB.issues;
  KB.categories.splice(1, 0, { id: 'young', title: 'Young people & students', blurb: 'Leaked photos, hacked accounts, gaming losses, internships, ragging, live-in', icon: 'spark' });
  Object.assign(KB.help, {
    ragging: { label: '1800-180-5522', name: 'National Anti-Ragging Helpline (UGC)', detail: '24x7, toll-free. You do not have to go through your college first. Online: antiragging.in', href: 'https://www.antiragging.in' },
    telemanas: { label: '14416', name: 'Tele-MANAS mental health helpline', detail: 'Free, 24x7 support in many languages if things feel too heavy.', href: null },
    stopncii: { label: 'StopNCII', name: 'StopNCII.org', detail: 'Creates a private fingerprint of an intimate image on your phone so partner platforms can block it. The image itself is not uploaded.', href: 'https://stopncii.org' }
  });
  const also = (ids) => ids.forEach((id) => { const x = I.find((i) => i.id === id); if (x) x.also = (x.also || []).concat('young'); });

  /* ---------------- Leaked / morphed / deepfake images, sextortion ---------------- */
  I.push({
    id: 'intimate-images', cat: 'young', title: 'Someone leaked, morphed or deepfaked my photos, or is blackmailing me with them', short: 'Leaked or deepfake photos, sextortion',
    synonyms: ['leaked photos', 'leaked video', 'nudes leaked', 'private photos shared', 'morphed photos', 'deepfake', 'ai nude', 'sextortion', 'video call blackmail', 'revenge porn', 'ex sharing photos', 'threatening to post my pics', 'instagram nude', 'telegram leak'],
    intro: 'This is not your fault, and it can be taken down fast. Platforms must now remove intimate or morphed images within 2 hours of a complaint.',
    juris: 'IT Rules (amended, in force from 20 February 2026): platforms must remove non-consensual intimate images, including AI-made or morphed ones, within 2 hours of a complaint. Sharing such images is a crime under the IT Act and the Bharatiya Nyaya Sanhita. Report on cybercrime.gov.in (women and child safety section) or 1930.',
    questions: [
      { id: 'ni_safe', text: 'Are you safe right now?', why: 'Safety and support come first.', options: o([['safe', 'Yes'], ['scared', 'I am scared or overwhelmed'], ['danger', 'Someone is threatening to hurt me'], PN]) },
      { id: 'ni_what', text: 'What is happening?', why: 'Blackmail, leaks and fakes are handled slightly differently.', options: o([['posted', 'Images are already posted or shared'], ['threat', 'Someone is threatening to post them'], ['money', 'They are demanding money or more images'], ['fake', 'They are fake / AI-made / morphed']]) },
      { id: 'ni_who', text: 'Do you know who is doing it?', why: 'A known person (often an ex) can also face a protection order.', options: o([['ex', 'An ex or someone I know'], ['online', 'Someone I met online'], ['unknown', 'I don\'t know']]) },
      { id: 'ni_age', text: 'Were you under 18 in the images?', why: 'Images of anyone under 18 are treated far more seriously and platforms act immediately.', options: o([['no', 'No'], ['yes', 'Yes'], PN]) },
      { id: 'ni_reported', text: 'Have you reported it anywhere?', deep: true, why: 'Report numbers help police and platforms move quickly.', options: o([['platform', 'To the app / website'], ['cyber', 'Cyber portal or police'], ['none', 'Not yet']]) }
    ],
    evidence: [
      { id: 'ni_e_links', name: 'Links (URLs) and usernames where it is posted or sent from', fact: 'Where it is', why: 'Platforms remove by link; police trace accounts by username.', where: 'Copy from the app (Share → Copy link).', preserve: 'Save links in a note. Do not forward the images to anyone.' },
      { id: 'ni_e_msgs', name: 'Screenshots of threats and demands, with date and time', fact: 'The blackmail or threat', why: 'Proves the crime even if they delete it.', where: 'Your chats.', preserve: 'Screenshot before blocking; back up to a private folder.' },
      { id: 'ni_e_pay', name: 'Any payments you made to them', fact: 'Money extorted', why: 'Helps trace them and freeze accounts.', where: 'UPI / bank history.', preserve: '', when: W('ni_what', 'money') },
      { id: 'ni_e_original', name: 'An original photo of you that was used (for fakes)', fact: 'The image was altered', why: 'Shows the morph or deepfake.', where: 'Your gallery or public profile.', preserve: '', when: W('ni_what', 'fake') },
      { id: 'ni_e_platform', name: 'Report to the platform (choose "nudity / non-consensual / impersonation")', fact: 'Platform told', why: 'They must act within 2 hours for this kind of content.', where: 'Report button in the app.', preserve: 'Screenshot the report confirmation.', action: true, when: NOT(W('ni_reported', 'platform')) },
      { id: 'ni_e_cyber', name: 'Complaint on cybercrime.gov.in or at the police station', fact: 'Crime reported', why: 'Starts investigation and lets police order takedowns.', where: 'cybercrime.gov.in (you can report anonymously in this section)', preserve: 'Keep the acknowledgement number.', action: true, when: NOT(W('ni_reported', 'cyber')) },
      { id: 'ni_e_stopncii', name: 'Use StopNCII.org to block the image on partner platforms', fact: 'Prevents re-uploads', why: 'Works without sending the actual image.', where: 'stopncii.org', preserve: '', action: true, when: NOT(W('ni_age', 'yes')) },
      { id: 'ni_e_stop', name: 'Stop replying and do not pay', fact: 'Blackmail stopped', why: 'Paying almost always leads to more demands.', where: '', preserve: 'Block only after saving evidence.', action: true, when: W('ni_what', 'threat', 'money') }
    ],
    urgent: [
      { id: 'ni_u_danger', level: 'now', when: W('ni_safe', 'danger'), title: 'Call 112 if you are in danger', text: 'Your safety comes first. Women can also call 181.', help: ['e112', 'w181'] },
      { id: 'ni_u_minor', level: 'now', when: W('ni_age', 'yes'), title: 'Report it now — this is treated as a serious crime', text: 'Report on cybercrime.gov.in or call 1098 / 112. Tell a trusted adult. Do not share the images with anyone, even to show proof.', help: ['c1098', 'e112', 'cy1930'] },
      { id: 'ni_u_heavy', level: 'soon', when: W('ni_safe', 'scared'), title: 'You are not alone', text: 'This happens to many people and it is not your fault. Free, confidential support: Tele-MANAS 14416.', help: ['telemanas', 'w181'] }
    ],
    stand: [
      { k: 'good', text: 'Platforms must remove intimate or morphed images within 2 hours of your complaint.' },
      { k: 'good', when: W('ni_who', 'ex'), text: 'When the person is known, police and courts can act faster, including protection orders.' },
      { k: 'risk', when: W('ni_what', 'money'), text: 'Paying rarely ends it — keep the evidence and report instead.' },
      { k: 'next', text: 'If a platform ignores you, its Grievance Officer and then the Grievance Appellate Committee are the next steps.' }
    ],
    lawyerQs: [{ text: 'Can I get a court order against the person, and can I claim compensation?' }, { text: 'How do I get it removed from sites that do not respond?' }]
  });

  /* ---------------- Account hacked / impersonation ---------------- */
  I.push({
    id: 'account-hacked', cat: 'young', title: 'My Instagram, WhatsApp, email or gaming account was hacked, or someone made a fake profile of me', short: 'Account hacked or fake profile',
    synonyms: ['instagram hacked', 'insta hacked', 'ig hacked', 'whatsapp hacked', 'account hacked', 'gmail hacked', 'fake profile', 'fake account in my name', 'impersonation', 'someone using my photos', 'snapchat hacked', 'facebook hacked', 'game account stolen', 'otp shared hacked'],
    intro: 'Most hacked accounts can be recovered if you act fast. A fake profile can be taken down — platforms must act on impersonation quickly.',
    juris: 'Hacking and identity theft are offences under the IT Act. Report on cybercrime.gov.in; for money lost call 1930. Platforms must act quickly on impersonation complaints under the IT Rules.',
    questions: [
      { id: 'ah_what', text: 'What happened?', why: 'Recovery and fake-profile takedown are different steps.', options: o([['hacked', 'My account was hacked'], ['fake', 'Someone made a fake profile of me'], ['both', 'Both']]) },
      { id: 'ah_misuse', text: 'Is the account being used to ask people for money or post things?', why: 'Misuse needs a warning to your contacts and a police complaint.', options: o([['money', 'Asking my friends for money'], ['posts', 'Posting things as me'], ['no', 'Not that I know']]) },
      { id: 'ah_access', text: 'Can you still log in?', when: W('ah_what', 'hacked', 'both'), why: 'Decides whether you can secure it yourself or need the platform\'s recovery.', options: o([['yes', 'Yes'], ['no', 'No, I am locked out']]) },
      { id: 'ah_money', text: 'Did you lose any money?', why: 'Lost money needs a 1930 report fast.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'ah_e_account', name: 'Your account username, linked email and phone', fact: 'Which account is yours', why: 'Needed for recovery and complaints.', where: 'Your old messages, email.', preserve: '' },
      { id: 'ah_e_proof', name: 'Proof it is yours: old screenshots, ID, photos you posted, purchase receipts', fact: 'You own the account', why: 'Platforms ask for this during recovery.', where: 'Gallery, email.', preserve: '' },
      { id: 'ah_e_alerts', name: 'Security emails / SMS about login, password or email change', fact: 'When it was taken', why: 'Shows the hack and its timing; often has a "secure account" link.', where: 'Email inbox, spam folder.', preserve: 'Do not delete.', when: W('ah_what', 'hacked', 'both') },
      { id: 'ah_e_fake', name: 'Link to the fake profile and screenshots of it', fact: 'Impersonation', why: 'Needed for the takedown report.', where: 'The app.', preserve: 'Screenshot the profile page with username visible.', when: W('ah_what', 'fake', 'both') },
      { id: 'ah_e_misuse', name: 'Messages sent from your account to others', fact: 'Misuse', why: 'Shows what the hacker did in your name.', where: 'Ask friends to forward screenshots.', preserve: '', holder: 'others', when: W('ah_misuse', 'money', 'posts') },
      { id: 'ah_e_recover', name: 'Use the app\'s official "hacked account" recovery page', fact: 'Recovery started', why: 'Only the official flow can restore access.', where: 'Help centre of the app — never a "recovery agent" from DMs.', preserve: '', action: true, when: W('ah_access', 'no') },
      { id: 'ah_e_secure', name: 'Change password, turn on two-step verification, log out other devices', fact: 'Account secured', why: 'Stops the hacker getting back in.', where: 'Account settings.', preserve: '', action: true, when: W('ah_access', 'yes') },
      { id: 'ah_e_warn', name: 'Warn your contacts not to send money or OTPs', fact: 'Others protected', why: 'Hackers target your friends next.', where: 'Status / story from another account.', preserve: '', action: true, when: W('ah_misuse', 'money') },
      { id: 'ah_e_report', name: 'Complaint on cybercrime.gov.in (and 1930 if money was lost)', fact: 'Crime reported', why: 'Needed if recovery fails or money was taken.', where: 'cybercrime.gov.in / 1930', preserve: '', action: true, when: ANY(W('ah_money', 'yes'), W('ah_misuse', 'money', 'posts')) }
    ],
    urgent: [
      { id: 'ah_u_money', level: 'now', when: W('ah_money', 'yes'), title: 'Call 1930 now', text: 'Money lost to a hacked account can sometimes be frozen if reported quickly.', help: ['cy1930'] }
    ],
    stand: [
      { k: 'good', when: W('ah_access', 'yes'), text: 'You still have access — secure it now and you will likely keep it.' },
      { k: 'risk', text: 'Anyone offering to "recover" your account for a fee in your DMs is a scammer.' },
      { k: 'next', when: W('ah_what', 'fake', 'both'), text: 'Report the fake profile as impersonation; if ignored, write to the platform\'s Grievance Officer.' }
    ],
    lawyerQs: [{ text: 'Can I take legal action against the person if I know who it is?' }]
  });

  /* ---------------- Gaming / betting money ---------------- */
  I.push({
    id: 'gaming-betting', cat: 'young', title: 'I lost money on a gaming, betting or trading app, or my winnings are stuck', short: 'Gaming or betting app money',
    synonyms: ['betting app', 'online betting loss', 'fantasy app withdrawal', 'rummy app', 'casino app', 'colour prediction game', 'aviator game', 'gaming app money stuck', 'winnings not paid', 'dream11 withdrawal', 'online game addiction debt', 'betting id', 'satta app', 'f&o loss'],
    intro: 'Real-money online games and betting apps are now banned in India. Apps still taking money are operating illegally — report them, and get help if it has become a habit.',
    juris: 'The Promotion and Regulation of Online Gaming Act, 2025 and its Rules (in force from 1 May 2026) ban online money games and betting, whether based on skill or chance, and require banks to block payments to them. The law targets operators, advertisers and payment facilitators. Free games and e-sports remain allowed.',
    questions: [
      { id: 'gb_what', text: 'What is the problem?', why: 'Stuck balances, losses and debts are handled differently.', options: o([['stuck', 'My balance or winnings are stuck'], ['scam', 'The app or "betting ID" agent took my money'], ['debt', 'I borrowed money to play and now owe a lot'], ['family', 'A family member is losing money']]) },
      { id: 'gb_when', text: 'When was the money deposited?', why: 'Before or after the ban changes how platforms must refund.', options: o([['before', 'Before May 2026'], ['after', 'After May 2026'], ['both', 'Both']]) },
      { id: 'gb_paid', text: 'How did you pay?', why: 'UPI and bank payments can be traced.', options: o([['upi', 'UPI / bank'], ['agent', 'Through an agent or "ID" seller'], ['crypto', 'Crypto / wallet']]) },
      { id: 'gb_cope', text: 'How are you handling it?', deep: true, why: 'Gambling losses can feel crushing — help exists.', options: o([['ok', 'I am OK'], ['hard', 'It is very hard right now'], PN]) }
    ],
    evidence: [
      { id: 'gb_e_app', name: 'App name, website, and screenshots of your balance / transaction history', fact: 'What the app owes or took', why: 'Basis of any complaint.', where: 'The app.', preserve: 'Screenshot now — illegal apps disappear.' },
      { id: 'gb_e_pay', name: 'All deposits and withdrawals with UTR numbers', fact: 'Money trail', why: 'Lets police trace receiving accounts.', where: 'Bank / UPI history.', preserve: 'Download statement PDF.' },
      { id: 'gb_e_agent', name: 'Chats with the agent or "ID" seller and their numbers', fact: 'Who took the money', why: 'Agents are often the easiest to trace.', where: 'WhatsApp / Telegram.', preserve: '', when: W('gb_paid', 'agent') },
      { id: 'gb_e_support', name: 'Your complaints to the app\'s support and replies', fact: 'App was asked to pay', why: 'Shows refusal.', where: 'Email, in-app chat.', preserve: '', when: W('gb_what', 'stuck') },
      { id: 'gb_e_loans', name: 'List of loans, cards and people you borrowed from', fact: 'What you owe', why: 'Needed to plan repayment and stop harassment.', where: 'Your records.', preserve: '', when: W('gb_what', 'debt', 'family') },
      { id: 'gb_e_report', name: 'Report the app on cybercrime.gov.in (or 1930 if money was just taken)', fact: 'Illegal app reported', why: 'Can freeze accounts and get the app blocked.', where: 'cybercrime.gov.in', preserve: '', action: true, when: W('gb_what', 'stuck', 'scam') },
      { id: 'gb_e_block', name: 'Ask your bank to block gambling/betting payments on your account', fact: 'Future losses stopped', why: 'Banks are required to block these payments; asking helps.', where: 'Bank branch / app.', preserve: '', action: true }
    ],
    urgent: [
      { id: 'gb_u_hard', level: 'soon', when: W('gb_cope', 'hard'), title: 'Please talk to someone today', text: 'Money problems can be fixed. Free, confidential support 24x7: Tele-MANAS 14416.', help: ['telemanas'] }
    ],
    stand: [
      { k: 'risk', text: 'Illegal apps rarely pay out — treat money still on them as at risk, and stop adding more.' },
      { k: 'next', when: W('gb_what', 'debt'), text: 'Lenders must follow fair-recovery rules; see the "Loan app harassment" guide if they threaten you.' },
      { k: 'good', when: W('gb_paid', 'upi'), text: 'UPI and bank payments can be traced — keep every UTR number.' }
    ],
    lawyerQs: [{ text: 'Can I recover my deposits from this app or its payment agents?' }, { text: 'How do I deal with lenders while I repay?', when: W('gb_what', 'debt') }]
  });

  /* ---------------- Internship, freelance, creator pay ---------------- */
  I.push({
    id: 'internship-creator-pay', cat: 'young', title: 'Internship stipend, freelance or creator payment not paid, or my job offer was taken back', short: 'Internship, freelance or creator pay',
    synonyms: ['stipend not paid', 'internship certificate not given', 'unpaid internship', 'freelance payment pending', 'client not paying freelancer', 'brand deal not paid', 'influencer payment', 'creator payment', 'offer letter revoked', 'joining delayed', 'onboarding cancelled', 'training bond', 'fake internship fee'],
    intro: 'What you can claim depends on what was written down. Even emails and DMs count as a contract.',
    juris: 'A promise of payment in an email, offer letter or chat can be enforced as a contract (Indian Contract Act). Unpaid amounts can be demanded by legal notice and recovered through a civil suit or, for some cases, the consumer or labour route. Influencers must disclose paid promotions under ASCI and consumer rules.',
    questions: [
      { id: 'ic_type', text: 'What is it about?', why: 'Interns, freelancers and new hires have different routes.', options: o([['intern', 'Internship stipend or certificate'], ['freelance', 'Freelance / client work'], ['creator', 'Brand deal / creator payment'], ['offer', 'Job offer revoked or joining delayed'], ['fee', 'I paid a fee for an internship or job']]) },
      { id: 'ic_written', text: 'What do you have in writing?', why: 'Written terms are the key proof.', options: o([['letter', 'Offer letter / contract'], ['emails', 'Emails or DMs agreeing the work and pay'], ['nothing', 'Almost nothing']]) },
      { id: 'ic_done', text: 'Did you complete the work or period?', when: NOT(W('ic_type', 'offer', 'fee')), why: 'Completed work is harder to deny.', options: o([['all', 'Yes, fully'], ['part', 'Partly'], ['no', 'No']]) },
      { id: 'ic_amount', text: 'How much is owed?', why: 'Helps choose between a notice, consumer forum or suit.', options: o([['u50k', 'Under ₹50,000'], ['50to5', '₹50,000–₹5 lakh'], ['over5', 'Over ₹5 lakh']]) },
      { id: 'ic_when', text: 'When was the payment due?', when: W('ic_type', 'intern', 'freelance', 'creator'), why: 'A case to recover unpaid work must usually be filed within 3 years. We use this to show how much time you have.', options: o([['m6', 'In the last 6 months'], ['y1', '6 months to 1 year ago'], ['y2', '1 to 2 years ago'], ['y3', '2 to 3 years ago'], ['older', 'More than 3 years ago']]) }
    ],
    evidence: [
      { id: 'ic_e_terms', name: 'Offer letter, contract, or the emails/DMs where pay was agreed', fact: 'What was promised', why: 'The core of your claim.', where: 'Email, LinkedIn, Instagram DMs.', preserve: 'Screenshot with dates and usernames; export the chat.' },
      { id: 'ic_e_work', name: 'Proof of work delivered: files, posts, links, approval messages', fact: 'You did the work', why: 'Shows they accepted it.', where: 'Drive, email, the posts.', preserve: '', when: NOT(W('ic_type', 'offer', 'fee')) },
      { id: 'ic_e_invoice', name: 'Invoices or payment requests you sent and any replies', fact: 'You asked to be paid', why: 'Shows the amount and the delay.', where: 'Email.', preserve: '', when: W('ic_type', 'freelance', 'creator') },
      { id: 'ic_e_attend', name: 'Attendance, ID card, work emails, certificates', fact: 'You were an intern there', why: 'Proves the internship.', where: 'Your records.', preserve: '', when: W('ic_type', 'intern') },
      { id: 'ic_e_revoke', name: 'The revocation or delay message, and what you gave up (other offers, resignation)', fact: 'Loss caused by the revocation', why: 'Supports a claim for losses.', where: 'Email.', preserve: '', when: W('ic_type', 'offer') },
      { id: 'ic_e_fee', name: 'Payment proof for the fee and the advert that promised a job', fact: 'Fee taken on a false promise', why: 'Often a scam — basis for refund or complaint.', where: 'UPI / bank, website.', preserve: '', when: W('ic_type', 'fee') },
      { id: 'ic_e_demand', name: 'Send a polite written demand with a deadline', fact: 'Formal demand', why: 'Many pay at this stage; it is also needed before a case.', where: 'Email.', preserve: 'Keep the sent copy.', action: true }
    ],
    urgent: [],
    stand: [
      { k: 'good', when: W('ic_written', 'letter', 'emails'), text: 'Written promises — even DMs — are strong proof of a contract.' },
      { k: 'risk', when: W('ic_written', 'nothing'), text: 'With little in writing, look for any message mentioning the work or pay.' },
      { k: 'risk', when: W('ic_type', 'fee'), text: 'Genuine employers do not charge a fee to hire you — this may be a scam; see the job-scam guide.' },
      { k: 'next', text: 'A lawyer\'s notice often gets payment without going to court.' }
    ],
    lawyerQs: [{ text: 'Is a legal notice enough, or should I file a case — and where?' }]
  });

  /* ---------------- Ragging / campus harassment ---------------- */
  I.push({
    id: 'ragging', cat: 'young', title: 'Ragging, bullying or harassment at college or hostel', short: 'Ragging or campus harassment',
    synonyms: ['ragging', 'seniors ragging', 'hostel ragging', 'college bullying', 'campus harassment', 'anti ragging complaint', 'forced to drink', 'seniors beating', 'whatsapp group ragging', 'caste harassment college', 'professor harassment'],
    intro: 'Ragging is a crime and colleges must act on it. You can complain straight to the national helpline — you do not have to go through your college first.',
    juris: 'UGC anti-ragging regulations require every college to have an Anti-Ragging Committee and Squad and to act on complaints. The National Anti-Ragging Helpline (1800-180-5522, 24x7) forwards complaints to the college, university and police. Serious cases are also crimes under the Bharatiya Nyaya Sanhita.',
    questions: [
      { id: 'rg_safe', text: 'Are you safe right now?', why: 'Safety first.', options: o([['safe', 'Yes'], ['unsafe', 'I am scared to go back'], ['danger', 'I am in danger now'], PN]) },
      { id: 'rg_who', text: 'Who is doing it?', why: 'Seniors, staff and outsiders go to different authorities.', options: o([['seniors', 'Seniors / other students'], ['staff', 'Teacher or staff'], ['online', 'In group chats / online']]) },
      { id: 'rg_told', text: 'Have you told anyone official?', why: 'Decides the next step.', options: o([['college', 'College committee / warden'], ['helpline', 'National helpline'], ['none', 'Not yet']]) },
      { id: 'rg_kind', text: 'What kind of harassment?', deep: true, why: 'Physical harm or sexual harassment need police involvement too.', options: o([['verbal', 'Verbal / humiliation'], ['physical', 'Physical'], ['sexual', 'Sexual'], ['caste', 'Caste, religion or region-based'], PN]) }
    ],
    evidence: [
      { id: 'rg_e_log', name: 'Dated notes: what happened, where, who was there', fact: 'The incidents', why: 'Committees decide on specific incidents.', where: 'Write in your phone notes now.', preserve: '' },
      { id: 'rg_e_chats', name: 'Group chat messages, voice notes, videos', fact: 'Proof of ragging', why: 'Hard to deny.', where: 'Phone.', preserve: 'Screenshot and back up; do not leave the group if you need the evidence.' },
      { id: 'rg_e_witness', name: 'Names of witnesses and friends you told', fact: 'Support for your account', why: 'Committees speak to witnesses.', where: '', preserve: '', holder: 'others' },
      { id: 'rg_e_medical', name: 'Medical record of any injury', fact: 'Physical harm', why: 'Needed for a police case.', where: 'Campus clinic / hospital.', preserve: '', when: W('rg_kind', 'physical', 'sexual') },
      { id: 'rg_e_helpline', name: 'Complaint on 1800-180-5522 or antiragging.in', fact: 'Formal complaint', why: 'Sent to the college, university and police; can be confidential.', where: 'antiragging.in', preserve: 'Note the complaint number.', action: true, when: NOT(W('rg_told', 'helpline')) }
    ],
    urgent: [
      { id: 'rg_u_danger', level: 'now', when: W('rg_safe', 'danger'), title: 'Call 112 now', text: 'Get to a safe place. Then call the anti-ragging helpline 1800-180-5522.', help: ['e112', 'ragging'] },
      { id: 'rg_u_unsafe', level: 'soon', when: W('rg_safe', 'unsafe'), title: 'You can complain without going through your college', text: 'The national helpline is 24x7 and confidential. Support is also available on Tele-MANAS 14416.', help: ['ragging', 'telemanas'] }
    ],
    stand: [
      { k: 'good', text: 'Colleges can be penalised by UGC for not acting on ragging complaints.' },
      { k: 'next', when: W('rg_kind', 'sexual'), text: 'Sexual harassment can also go to the college\'s Internal Committee and the police.' }
    ],
    lawyerQs: [{ text: 'Should I also file an FIR, and how do I stay safe on campus meanwhile?' }]
  });

  /* ---------------- Live-in relationship ---------------- */
  I.push({
    id: 'live-in', cat: 'young', title: 'Live-in relationship — rights, breakup, money, or family pressure', short: 'Live-in relationship',
    synonyms: ['live in relationship', 'living together', 'live in rights', 'breakup money', 'partner left', 'live in registration', 'boyfriend cheated promise of marriage', 'live in police harassment', 'landlord live in', 'live in maintenance'],
    intro: 'Living together is legal for adults. Long, marriage-like relationships also bring some protection — especially for women and children.',
    juris: 'Live-in relationships between adults are protected by the right to life and liberty. Women in a relationship "in the nature of marriage" can seek protection, residence and money under the Domestic Violence Act, 2005, and maintenance under the BNSS. Children are treated as legitimate. Uttarakhand requires live-in couples to register under its Uniform Civil Code (since January 2025).',
    questions: [
      { id: 'lv_need', text: 'What do you need help with?', why: 'Each need has different proof.', options: o([['safety', 'Family or others are threatening us'], ['breakup', 'We broke up — money, belongings or support'], ['violence', 'My partner is abusive'], ['register', 'Registration / documents'], ['landlord', 'Landlord or police trouble']]) },
      { id: 'lv_length', text: 'How long have you lived together?', why: 'Longer, marriage-like relationships get more legal protection.', options: o([['short', 'Under a year'], ['mid', '1–3 years'], ['long', 'More than 3 years']]) },
      { id: 'lv_child', text: 'Do you have a child together?', why: 'Children have full rights regardless of marriage.', options: o([['yes', 'Yes'], ['no', 'No'], PN]) },
      { id: 'lv_shared', text: 'Did you share money, a home or bills?', deep: true, why: 'Shared finances help show a marriage-like relationship and your contributions.', options: o([['yes', 'Yes'], ['some', 'Some'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'lv_e_address', name: 'Proof you lived together: rent agreement, shared address on IDs, bills, deliveries', fact: 'You lived together', why: 'The starting point for any claim.', where: 'Your records.', preserve: '' },
      { id: 'lv_e_public', name: 'Photos, trips, social media, people who knew you as a couple', fact: 'You presented as a couple', why: 'Shows a relationship "in the nature of marriage".', where: 'Gallery, friends.', preserve: '' },
      { id: 'lv_e_money', name: 'Bank transfers, joint purchases, who paid for what', fact: 'Shared finances and your contributions', why: 'Supports claims for money or belongings.', where: 'Bank / UPI history.', preserve: '', when: ANY(W('lv_need', 'breakup'), W('lv_shared', 'yes', 'some')) },
      { id: 'lv_e_child', name: 'Child\'s birth certificate and school records', fact: 'Parentage', why: 'Needed for child support.', where: 'Municipality, school.', preserve: '', when: W('lv_child', 'yes') },
      { id: 'lv_e_threats', name: 'Threat messages and names of those threatening', fact: 'Danger to the couple', why: 'Supports police or court protection.', where: 'Phones.', preserve: 'Back up.', when: W('lv_need', 'safety') },
      { id: 'lv_e_abuse', name: 'Medical records, photos, messages showing abuse', fact: 'Domestic violence', why: 'Needed for protection orders.', where: 'Hospital, phone.', preserve: '', when: W('lv_need', 'violence') },
      { id: 'lv_e_ids', name: 'Age and ID proof of both', fact: 'Both are adults', why: 'Police and courts check this first.', where: '', preserve: '' }
    ],
    urgent: [
      { id: 'lv_u_danger', level: 'now', when: W('lv_need', 'safety', 'violence'), title: 'If you are in danger, call 112', text: 'Police must protect adult couples. Women can also call 181.', help: ['e112', 'w181'] }
    ],
    stand: [
      { k: 'good', when: W('lv_length', 'long'), text: 'A long relationship living as a couple is more likely to be treated as "in the nature of marriage".' },
      { k: 'risk', when: W('lv_length', 'short'), text: 'Short relationships get less protection — your money claims will rest on what you can show you paid.' },
      { k: 'good', when: W('lv_child', 'yes'), text: 'A child has full rights to support from both parents.' }
    ],
    lawyerQs: [{ text: 'Do I qualify for protection or maintenance under the Domestic Violence Act?' }, { text: 'How do I get my money or belongings back?', when: W('lv_need', 'breakup') }]
  });

  /* ---------------- Gender identity / queer rights ---------------- */
  I.push({
    id: 'gender-identity', cat: 'young', title: 'Trans or queer — ID documents, family pressure, safety or discrimination', short: 'Trans & queer rights',
    synonyms: ['transgender certificate', 'change gender on documents', 'name change trans', 'queer couple protection', 'gay couple family threat', 'conversion therapy', 'forced marriage gay', 'lgbtq rights india', 'trans discrimination job', 'pride', 'non binary id'],
    intro: 'You have the right to self-identify your gender and to be safe. Courts regularly protect queer couples from family threats.',
    juris: 'The Transgender Persons (Protection of Rights) Act, 2019 lets you get a certificate of identity through the National Portal for Transgender Persons and bars discrimination in education, jobs and healthcare. The Supreme Court decriminalised same-sex relations (Navtej Johar, 2018); courts grant police protection to queer couples facing family threats, and have called "conversion therapy" misconduct.',
    questions: [
      { id: 'gi_need', text: 'What do you need?', why: 'Documents, safety and discrimination have different routes.', options: o([['docs', 'Change name / gender on documents'], ['family', 'Family pressure, forced marriage or threats'], ['couple', 'Protection for me and my partner'], ['work', 'Discrimination at school, work or hospital']]) },
      { id: 'gi_safe', text: 'Are you safe right now?', why: 'Safety first.', options: o([['safe', 'Yes'], ['unsafe', 'Not really'], ['danger', 'In danger now'], PN]) },
      { id: 'gi_adult', text: 'Are you 18 or older?', why: 'Adults can choose where and with whom to live.', options: o([['yes', 'Yes'], ['no', 'No'], PN]) }
    ],
    evidence: [
      { id: 'gi_e_ids', name: 'Current ID documents (Aadhaar, PAN, school certificates, passport)', fact: 'Your existing records', why: 'Every change starts from these.', where: '', preserve: 'Keep copies somewhere safe outside home if needed.' },
      { id: 'gi_e_portal', name: 'Application on the National Portal for Transgender Persons', fact: 'Certificate of identity', why: 'Lets you update gender on other documents.', where: 'transgender.dosje.gov.in', preserve: 'Note the application number.', action: true, when: W('gi_need', 'docs') },
      { id: 'gi_e_threats', name: 'Threat messages, recordings, names of people threatening', fact: 'Danger', why: 'Supports police or High Court protection.', where: 'Phone.', preserve: 'Back up to a cloud account your family cannot access.', when: W('gi_need', 'family', 'couple') },
      { id: 'gi_e_sp', name: 'Written request to the Superintendent of Police for protection', fact: 'Police told', why: 'Courts expect you to approach police first.', where: 'SP office / email.', preserve: 'Keep the received copy.', action: true, when: W('gi_need', 'family', 'couple') },
      { id: 'gi_e_discrim', name: 'Messages, notices or rejection letters showing discrimination', fact: 'Discrimination', why: 'Basis for a complaint.', where: 'Email, letters.', preserve: '', when: W('gi_need', 'work') },
      { id: 'gi_e_age', name: 'Age proof', fact: 'You are an adult', why: 'Police and courts check this first.', where: '', preserve: '', when: W('gi_need', 'family', 'couple') },
      { id: 'gi_e_affidavit', name: 'Affidavit / declaration of your chosen name and gender', fact: 'Your self-identification', why: 'Asked for by the portal, schools and offices when updating records.', where: 'Notary.', preserve: '', when: W('gi_need', 'docs') },
      { id: 'gi_e_contacts', name: 'Contacts of a trusted friend, a queer support group and a lawyer', fact: 'Help is reachable', why: 'Useful in an emergency and when going to police.', where: '', preserve: 'Save them where family cannot see.', when: NOT(W('gi_need', 'docs')) },
      { id: 'gi_e_log', name: 'Dated notes of what happened and who was involved', fact: 'Sequence of events', why: 'Makes complaints clear and believable.', where: 'Your phone notes.', preserve: '', when: NOT(W('gi_need', 'docs')) }
    ],
    urgent: [
      { id: 'gi_u_danger', level: 'now', when: W('gi_safe', 'danger'), title: 'Call 112 if you are in danger', text: 'Get to a safe place. Free legal aid: 15100.', help: ['e112', 'l15100'] },
      { id: 'gi_u_support', level: 'soon', when: W('gi_safe', 'unsafe'), title: 'Support is available', text: 'Confidential mental-health support 24x7: Tele-MANAS 14416. Free legal aid: 15100.', help: ['telemanas', 'l15100'] }
    ],
    stand: [
      { k: 'good', when: W('gi_adult', 'yes'), text: 'As an adult, you can choose where and with whom you live; courts protect this.' },
      { k: 'next', when: W('gi_need', 'couple', 'family'), text: 'If police do not help, an advocate can file a protection petition in the High Court.' }
    ],
    lawyerQs: [{ text: 'Should I file for protection in the High Court?', when: W('gi_need', 'family', 'couple') }, { text: 'How do I update my school and university records?', when: W('gi_need', 'docs') }]
  });

  /* ---------------- Stopped / detained by police ---------------- */
  I.push({
    id: 'police-stop', cat: 'police', also: ['young'], title: 'Police stopped, searched or detained me or a friend, or took my phone', short: 'Stopped or detained by police',
    synonyms: ['police stopped me', 'police took my phone', 'police checking phone', 'detained by police', 'friend arrested', 'friend in police station', 'drunk driving case', 'police harassment', 'police asking bribe', 'police at party', 'drugs case friend', 'bail for friend', 'night police checking'],
    intro: 'You have rights even when police stop you. Stay calm, do not resist, and remember what happened — details matter later.',
    juris: 'Under the BNSS, an arrested person must be told the grounds of arrest, can have a relative or friend informed, can meet a lawyer, and must be produced before a magistrate within 24 hours. For many offences police issue a notice to appear instead of arresting. Seized items, including phones, must be listed in a seizure memo.',
    questions: [
      { id: 'ps_what', text: 'What happened?', why: 'A stop, a seizure and an arrest have different rights.', options: o([['stopped', 'Stopped and questioned or searched'], ['phone', 'They took my phone / laptop'], ['detained', 'Taken to the police station'], ['arrested', 'Arrested (me or a friend)']]) },
      { id: 'ps_now', text: 'Is this happening right now?', why: 'Right-now situations need different steps.', options: o([['now', 'Yes'], ['past', 'It already happened']]) },
      { id: 'ps_paper', text: 'Were you given any paper (memo, notice, FIR copy)?', why: 'These papers decide the next step.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'ps_bribe', text: 'Did anyone ask for money?', deep: true, why: 'Bribe demands can be reported separately.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'ps_e_details', name: 'Time, place, police station, and officers\' names or badge numbers', fact: 'Who and where', why: 'Needed for any complaint or bail.', where: 'Write it down as soon as you can.', preserve: '' },
      { id: 'ps_e_memo', name: 'Arrest memo, seizure memo, notice or FIR copy', fact: 'What police recorded', why: 'Your lawyer needs these first.', where: 'Ask the police for copies.', preserve: '', when: W('ps_paper', 'yes', 'unsure') },
      { id: 'ps_e_phone', name: 'Make, model, IMEI of the seized phone and the seizure receipt', fact: 'Seized device', why: 'Needed to apply for its return.', where: 'Phone box / bill (IMEI).', preserve: '', when: W('ps_what', 'phone') },
      { id: 'ps_e_witness', name: 'Names and numbers of people who saw it', fact: 'Independent account', why: 'Supports your version.', where: '', preserve: '', holder: 'others' },
      { id: 'ps_e_yourid', name: 'Your ID and, if driving, licence, RC and insurance', fact: 'Identity and papers', why: 'Most stops end quickly when papers are in order.', where: 'DigiLocker / wallet.', preserve: '' },
      { id: 'ps_e_id', name: 'ID of the person detained and a family member\'s contact', fact: 'Identity', why: 'Needed for bail and visits.', where: '', preserve: '', when: W('ps_what', 'detained', 'arrested') },
      { id: 'ps_e_lawyer', name: 'Contact a lawyer or legal aid (15100) for bail', fact: 'Legal help', why: 'Bail and production deadlines are short.', where: '15100 / local advocate', preserve: '', action: true, when: W('ps_what', 'detained', 'arrested') }
    ],
    urgent: [
      { id: 'ps_u_now', level: 'now', when: ALL(W('ps_now', 'now'), W('ps_what', 'detained', 'arrested')), title: 'Ask for the grounds of arrest and to inform a relative', text: 'Stay calm and do not resist. Ask which police station, and call a lawyer or legal aid 15100. They must be produced before a magistrate within 24 hours.', help: ['l15100'] }
    ],
    stand: [
      { k: 'good', when: W('ps_paper', 'yes'), text: 'You have the papers your lawyer needs to act quickly.' },
      { k: 'next', when: W('ps_what', 'phone'), text: 'A seized phone can be returned by applying to the court with the seizure memo.' },
      { k: 'next', when: W('ps_bribe', 'yes'), text: 'Bribe demands can be reported to the state anti-corruption bureau or vigilance.' }
    ],
    lawyerQs: [{ text: 'Is this a bailable offence, and how fast can bail be arranged?', when: W('ps_what', 'detained', 'arrested') }, { text: 'How do I get my phone back?', when: W('ps_what', 'phone') }]
  });

  /* ---------------- Gig / delivery worker ---------------- */
  I.push({
    id: 'gig-worker', cat: 'work', also: ['young'], title: 'Delivery or ride app blocked my ID, cut my pay, or I was hurt on the job', short: 'Delivery / ride app worker',
    synonyms: ['zomato id blocked', 'swiggy id blocked', 'uber driver deactivated', 'ola account blocked', 'rapido id block', 'blinkit rider', 'delivery partner payout', 'gig worker rights', 'platform worker', 'accident while delivering', 'urban company partner', 'rating blocked'],
    intro: 'Gig workers are now recognised in law, and some states protect you from blocking without reason. Proof of your trips and payouts is everything.',
    juris: 'The Code on Social Security, 2020 (in force from 21 November 2025) recognises gig and platform workers and provides for registration on e-Shram. Rajasthan, Karnataka and some other states have their own gig-worker laws with welfare boards and, in Karnataka, protection against arbitrary deactivation.',
    questions: [
      { id: 'gw_issue', text: 'What happened?', why: 'Blocking, pay and injury go to different places.', options: o([['blocked', 'My ID was blocked / deactivated'], ['pay', 'Payouts or incentives not paid'], ['injury', 'I was hurt while working'], ['other', 'Other unfair treatment']]) },
      { id: 'gw_state', text: 'Which state do you work in?', why: 'Some states give extra protection.', options: o([['kar', 'Karnataka'], ['raj', 'Rajasthan'], ['other', 'Another state']]) },
      { id: 'gw_eshram', text: 'Are you registered on e-Shram?', why: 'Registration gives access to government cover.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) }
    ],
    evidence: [
      { id: 'gw_e_profile', name: 'Partner ID, profile screenshots and onboarding agreement', fact: 'You work on the platform', why: 'Basic proof.', where: 'The partner app.', preserve: 'Screenshot before access is lost.' },
      { id: 'gw_e_earnings', name: 'Trip/order history and payout statements', fact: 'What you earned and are owed', why: 'Shows unpaid amounts.', where: 'App earnings section, bank.', preserve: 'Download or screenshot every week.' },
      { id: 'gw_e_block', name: 'The blocking message and any reason given', fact: 'How you were blocked', why: 'Needed to challenge it.', where: 'App, SMS, email.', preserve: '', when: W('gw_issue', 'blocked') },
      { id: 'gw_e_support', name: 'Your support tickets and replies', fact: 'You raised it', why: 'Shows the platform had a chance to fix it.', where: 'App help.', preserve: '' },
      { id: 'gw_e_injury', name: 'Medical records, FIR (if road accident), and the order you were on', fact: 'Injury at work', why: 'Needed for insurance and compensation.', where: 'Hospital, police, app.', preserve: '', when: W('gw_issue', 'injury') },
      { id: 'gw_e_eshram', name: 'Register on e-Shram', fact: 'Government registration', why: 'Opens social security schemes for platform workers.', where: 'eshram.gov.in', preserve: '', action: true, when: W('gw_eshram', 'no', 'unsure') }
    ],
    urgent: [],
    stand: [
      { k: 'good', when: W('gw_state', 'kar'), text: 'Karnataka\'s gig-worker law protects against arbitrary deactivation and requires a grievance process.' },
      { k: 'next', when: W('gw_issue', 'injury'), text: 'Check the platform\'s accident insurance and any road-accident claim — see the road-accident guide.' }
    ],
    lawyerQs: [{ text: 'Can I challenge the deactivation, and where?', when: W('gw_issue', 'blocked') }]
  });

  /* ---- existing guides that young people search for ---- */
  also(['online-harassment', 'education-dispute', 'loan-app-harassment', 'job-investment-scam', 'digital-arrest-scam', 'court-marriage', 'ecommerce-order', 'traffic-challan', 'rental-security-deposit', 'upi-cyber-fraud']);
  const syn = (id, words) => { const x = I.find((i) => i.id === id); if (x) x.synonyms = x.synonyms.concat(words); };
  syn('job-investment-scam', ['romance scam', 'dating app scam', 'pig butchering', 'crypto girlfriend', 'finfluencer tips scam']);
  syn('ip-brand', ['reel copied', 'content stolen', 'copyright strike', 'youtube claim', 'my art stolen', 'my design copied']);
  syn('online-harassment', ['cyberbullying', 'doxxing', 'trolls', 'hate comments', 'stalker on instagram']);
  syn('rental-security-deposit', ['pg deposit', 'hostel deposit', 'flatmate deposit', 'broker not returning']);
})(typeof window !== 'undefined' ? window : globalThis);
