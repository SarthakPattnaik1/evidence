/* Business & company journeys (draft, not advocate-reviewed). */
(function (root) {
  const { W, ALL, ANY, NOT, ANS, o, NS, PN, LAWFUL } = root.ER_H;
  const KB = root.ER_KB; const I = KB.issues;
  KB.categories.splice(3, 0, { id: 'business', title: 'Business & company', blurb: 'Unpaid invoices, shareholder and partner disputes, contracts', icon: 'briefcase' });
  Object.assign(KB.help, {
    msmeodr: { label: 'MSME ODR', name: 'MSME Online Dispute Resolution portal (Ministry of MSME)', detail: 'For micro and small suppliers with delayed payments. New claims go here instead of Samadhaan (since 15 Oct 2025).', href: null },
    mca: { label: 'MCA', name: 'Ministry of Corporate Affairs portal', detail: 'Company master data, filings, directors and charges.', href: 'https://www.mca.gov.in' },
    ecourts: { label: 'eCourts', name: 'eCourts services', detail: 'Check case status, orders and next dates.', href: 'https://services.ecourts.gov.in' }
  });

  /* ---------------- Unpaid invoice / business dues ---------------- */
  I.push({
    id: 'business-unpaid', cat: 'business', title: 'A client or buyer hasn\'t paid my business', short: 'Unpaid invoices & business dues',
    synonyms: ['unpaid invoice', 'client not paying', 'payment pending', 'msme delayed payment', 'msme samadhaan', 'msme odr', 'recovery of dues', 'commercial suit', 'insolvency notice', 'ibc', 'operational creditor', 'vendor dues', 'freelancer payment'],
    intro: 'You have more routes than a regular suit: the MSME council, a commercial suit, arbitration or insolvency. The records decide which is best.',
    juris: 'Micro and small suppliers must be paid within the agreed period (never more than 45 days), with compound interest at three times the RBI bank rate on delay. Commercial disputes of ₹3 lakh or more go to commercial courts, usually after mandatory pre-institution mediation. Insolvency against a company needs a default of at least ₹1 crore.',
    tips: ['If you are a registered micro or small enterprise, the buyer cannot contract out of the 45-day limit or the interest.', 'Before filing a commercial suit you usually must try mediation, unless you need urgent interim relief.', 'Insolvency is a collective remedy, not a debt-collection tool — a genuine prior dispute can defeat it.'],
    questions: [
      { id: 'bu_who', text: 'Who owes you?', chapter: 'The debt', why: 'Companies, individuals and government buyers have different remedies.', options: o([['company', 'A company or LLP'], ['person', 'An individual or proprietorship'], ['govt', 'A government body or PSU'], ['foreign', 'A foreign client']]) },
      { id: 'bu_amount', text: 'How much is unpaid (approximately)?', chapter: 'The debt', why: 'Thresholds decide the forum: ₹3 lakh for commercial courts, ₹1 crore for insolvency.', options: o([['u3', 'Under ₹3 lakh'], ['3to100', '₹3 lakh to ₹1 crore'], ['over1cr', 'More than ₹1 crore']]) },
      { id: 'bu_msme', text: 'Is your business registered as a micro or small enterprise (Udyam)?', chapter: 'Your business', why: 'Opens the MSME Facilitation Council route with statutory interest.', options: o([['yes', 'Yes, before the supply'], ['after', 'Registered after the supply'], ['no', 'No'], NS]) },
      { id: 'bu_contract', text: 'What do you have in writing?', type: 'multi', chapter: 'Paper trail', why: 'Written terms, purchase orders and acceptance prove the debt.', options: o([['contract', 'Signed contract'], ['po', 'Purchase order / work order'], ['invoice', 'Invoices'], ['emails', 'Emails / messages agreeing terms'], ['none', 'Little in writing']]) },
      { id: 'bu_dispute', text: 'Has the client raised any complaint about your work?', chapter: 'Paper trail', why: 'A genuine dispute before your demand can block insolvency and weaken summary routes.', options: o([['no', 'No, they just haven\'t paid'], ['after', 'Only after I demanded payment'], ['before', 'Yes, they complained earlier'], NS]) },
      { id: 'bu_arb', text: 'Does the contract have an arbitration clause?', chapter: 'Paper trail', when: W('bu_contract', 'contract', 'po'), why: 'An arbitration clause usually sends the dispute to arbitration, not court.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'bu_since', text: 'When was payment due?', chapter: 'Timing', why: 'Money claims generally have a 3-year limit from when payment fell due. We use this to show how much time you have.', options: o([['recent', 'Within the last year'], ['y2', '1–2 years ago'], ['y3', '2–3 years ago'], ['older', 'More than 3 years ago']]) },
      { id: 'bu_ack', text: 'Has the client admitted the dues (ledger confirmation, part-payment, email)?', deep: true, chapter: 'Timing', why: 'Admissions strengthen your case and can extend limitation.', options: o([['yes', 'Yes'], ['no', 'No']]) },
      { id: 'bu_gst', text: 'Have you paid GST on these invoices?', deep: true, chapter: 'Tax', why: 'Affects the amount and your records.', options: o([['yes', 'Yes'], ['no', 'No / not applicable']]) }
    ],
    evidence: [
      { id: 'bu_e_contract', name: 'Contract, purchase/work order and any amendments', fact: 'The agreed terms', why: 'Defines scope, price and payment terms.', where: 'Your files, email.', preserve: '', when: W('bu_contract', 'contract', 'po') },
      { id: 'bu_e_invoices', name: 'All invoices, with dates and GST details', fact: 'Amounts billed', why: 'The core of the claim.', where: 'Accounting software.', preserve: 'Export a statement of account.' },
      { id: 'bu_e_delivery', name: 'Proof of delivery/acceptance (delivery challans, sign-offs, completion emails)', fact: 'Goods/services were accepted', why: 'The 45-day clock and your claim run from acceptance.', where: 'Your records, client emails.', preserve: '' },
      { id: 'bu_e_ledger', name: 'Ledger of the client\'s account, payments received and balance', fact: 'Outstanding amount', why: 'Shows exactly what is due.', where: 'Accounting software.', preserve: '' },
      { id: 'bu_e_emails', name: 'Emails/messages agreeing terms or promising payment', fact: 'Agreement and admissions', why: 'Fills gaps where nothing is signed.', where: 'Email, WhatsApp.', preserve: 'Export full threads.', when: W('bu_contract', 'emails', 'none') },
      { id: 'bu_e_udyam', name: 'Udyam registration certificate', fact: 'MSME status at the time of supply', why: 'Needed for the MSME council route.', where: 'Udyam portal.', preserve: '', when: W('bu_msme', 'yes', 'after') },
      { id: 'bu_e_msmeclaim', name: 'File a delayed-payment reference on the MSME ODR portal', fact: 'Statutory claim made', why: 'Councils can mediate, arbitrate and award interest at three times the bank rate.', where: 'MSME ODR portal (Ministry of MSME).', preserve: '', action: true, when: W('bu_msme', 'yes') },
      { id: 'bu_e_ack', name: 'Ledger confirmations, part-payments or emails admitting dues', fact: 'Admission of debt', why: 'Strong evidence and may extend the time limit.', where: 'Email, bank statements.', preserve: '', when: W('bu_ack', 'yes') },
      { id: 'bu_e_complaints', name: 'The client\'s complaints and your replies', fact: 'Whether a genuine dispute exists', why: 'Decides which remedies are realistic.', where: 'Email.', preserve: '', when: W('bu_dispute', 'before', 'after') },
      { id: 'bu_e_demand', name: 'Legal demand notice and proof of delivery', fact: 'Formal demand made', why: 'Usually the first formal step.', where: 'Your advocate.', preserve: '' },
      { id: 'bu_e_company', name: 'Debtor company details: CIN, registered office, directors, charges', fact: 'Who to sue and whether they can pay', why: 'Needed for notices, suits and insolvency.', where: 'MCA portal.', preserve: '', when: W('bu_who', 'company') },
      { id: 'bu_e_gst', name: 'GST returns showing the invoices', fact: 'Invoices were declared', why: 'Corroborates the supply; the client\'s input credit records may also show acceptance.', where: 'GST portal.', preserve: '', when: W('bu_gst', 'yes') }
    ],
    urgent: [{ id: 'bu_u_limit', level: 'soon', when: ALL(W('bu_since', 'y3', 'older'), NOT(W('bu_ack', 'yes'))), title: 'Check the time limit now', text: 'Money claims generally must be filed within 3 years of the due date unless the debt was acknowledged. See an advocate soon.', help: ['l15100'] }],
    lawyerQs: [{ text: 'MSME council, commercial suit, arbitration or insolvency — which is fastest here?' }, { text: 'Can I claim interest at three times the bank rate?', when: W('bu_msme', 'yes') }, { text: 'Is pre-institution mediation required before a commercial suit?', when: W('bu_amount', '3to100', 'over1cr') }]
  });

  /* ---------------- Shareholder / director dispute ---------------- */
  I.push({
    id: 'shareholder-dispute', cat: 'business', title: 'Dispute with co-founders, shareholders or directors of my company', short: 'Shareholder & director disputes',
    synonyms: ['shareholder dispute', 'co-founder dispute', 'founder dispute', 'oppression and mismanagement', 'nclt', 'removed as director', 'director removal', 'shares transferred without consent', 'share dilution', 'company records access', 'minority shareholder', 'vesting', 'cap table'],
    intro: 'Company disputes are won on the company\'s own paperwork: shareholding, minutes and filings. We\'ll build that record.',
    juris: 'Oppression and mismanagement cases go to the National Company Law Tribunal (NCLT). Members generally need at least 10% of shares (or 100 members), though the Tribunal can waive this. Shareholders\' agreements often add arbitration.',
    tips: ['Download the company\'s filings from the MCA portal now — they show directors, allotments and changes.', 'A director can only be removed by an ordinary resolution of shareholders after special notice and a chance to be heard.', 'Keep company documents you lawfully hold, but don\'t copy confidential company data after your access ends.'],
    questions: [
      { id: 'sd_role', text: 'What is your position?', chapter: 'Your position', why: 'Shareholders, directors and founders have different rights.', options: o([['founder', 'Co-founder / shareholder-director'], ['minority', 'Minority shareholder (not a director)'], ['majority', 'Majority shareholder'], ['investor', 'Investor']]) },
      { id: 'sd_stake', text: 'What percentage of the shares do you hold?', chapter: 'Your position', why: 'Decides eligibility for oppression cases and voting power.', options: o([['u10', 'Under 10%'], ['10to50', '10% to 50%'], ['over50', 'More than 50%'], NS]) },
      { id: 'sd_issue', text: 'What has happened?', type: 'multi', chapter: 'The dispute', why: 'Each act has different proof.', options: o([['removed', 'I was removed as director / from management'], ['dilution', 'New shares issued to dilute me'], ['transfer', 'My shares transferred without consent'], ['records', 'Denied access to accounts or records'], ['siphon', 'Money diverted / related-party deals'], ['deadlock', 'Complete deadlock between founders'], ['exit', 'I want to exit / be bought out']]) },
      { id: 'sd_sha', text: 'Is there a shareholders\' or founders\' agreement?', chapter: 'Paper trail', why: 'It may decide exits, vesting, deadlock and arbitration.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'sd_arb', text: 'Does it have an arbitration clause?', chapter: 'Paper trail', when: W('sd_sha', 'yes'), why: 'May decide the forum for contractual claims.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'sd_notice', text: 'Did you receive notice of the board/general meeting where this happened?', chapter: 'Process', when: W('sd_issue', 'removed', 'dilution', 'transfer'), why: 'Lack of proper notice can make decisions invalid.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'sd_type', text: 'What type of company?', deep: true, chapter: 'Company', why: 'Private, public and LLP rules differ.', options: o([['pvt', 'Private limited'], ['public', 'Public company'], ['llp', 'LLP'], NS]) },
      { id: 'sd_when', text: 'When did the main act happen?', deep: true, chapter: 'Timing', why: 'Delay can weaken claims and urgent relief.', options: o([['recent', 'Within 3 months'], ['year', 'Within a year'], ['older', 'Earlier']]) }
    ],
    evidence: [
      { id: 'sd_e_moa', name: 'Memorandum and Articles of Association (current version)', fact: 'Company rules', why: 'Sets transfer, appointment and meeting rules.', where: 'MCA portal (public documents).', preserve: '' },
      { id: 'sd_e_sha', name: 'Shareholders\' / founders\' agreement and term sheets', fact: 'What was agreed between you', why: 'Often decides exit, vesting and deadlock.', where: 'Your records.', preserve: '', when: W('sd_sha', 'yes') },
      { id: 'sd_e_shares', name: 'Share certificates, register of members extract, cap table, allotment filings', fact: 'Your shareholding', why: 'Proves your stake and any dilution.', where: 'Company, MCA filings (allotment returns).', preserve: '' },
      { id: 'sd_e_mca', name: 'MCA filings: director appointments/resignations, allotments, charges, annual returns', fact: 'What was officially recorded', why: 'Shows unauthorised changes and their dates.', where: 'MCA portal (view public documents).', preserve: 'Download with dates now.', action: true },
      { id: 'sd_e_minutes', name: 'Board and general meeting notices, agendas and minutes you hold', fact: 'What was decided and how', why: 'Defective notice or quorum can invalidate decisions.', where: 'Your email, company secretary.', preserve: LAWFUL, when: W('sd_issue', 'removed', 'dilution', 'transfer', 'deadlock') },
      { id: 'sd_e_accounts', name: 'Financial statements, bank statements and related-party transactions you can lawfully access', fact: 'Diversion of funds', why: 'Supports mismanagement claims.', where: 'Annual filings on MCA, company records.', preserve: LAWFUL, when: W('sd_issue', 'siphon', 'records') },
      { id: 'sd_e_demand', name: 'Your written requests for records/meetings and the replies', fact: 'Access was denied', why: 'Shows exclusion from management.', where: 'Email.', preserve: '', when: W('sd_issue', 'records', 'removed') },
      { id: 'sd_e_comms', name: 'Founder messages and emails about roles, equity and exits', fact: 'The understanding between founders', why: 'Fills gaps where nothing was signed.', where: 'Email, Slack, WhatsApp.', preserve: 'Export complete threads.' },
      { id: 'sd_e_valuation', name: 'Latest valuation reports and funding round documents', fact: 'Value of your shares', why: 'Needed for any buy-out.', where: 'Company, investors.', preserve: '', when: W('sd_issue', 'exit', 'dilution') }
    ],
    urgent: [{ id: 'sd_u_recent', level: 'soon', when: ALL(W('sd_issue', 'removed', 'dilution', 'transfer'), W('sd_when', 'recent')), title: 'Urgent relief may be possible', text: 'NCLT can pass interim orders to freeze changes. Speak to an advocate soon — delay weakens urgency.', help: ['mca'] }],
    lawyerQs: [{ text: 'Do I qualify to file an oppression and mismanagement case, or should I seek a waiver?' }, { text: 'Is the dispute for NCLT or for arbitration under our agreement?', when: W('sd_arb', 'yes') }, { text: 'Can the removal, allotment or transfer be reversed?', when: W('sd_issue', 'removed', 'dilution', 'transfer') }]
  });

  /* ---------------- Partnership / LLP ---------------- */
  I.push({
    id: 'partnership-dispute', cat: 'business', title: 'Dispute with my business partner (partnership firm or LLP)', short: 'Partnership & LLP disputes',
    synonyms: ['partnership dispute', 'business partner dispute', 'partner cheated', 'dissolution of partnership', 'llp dispute', 'partner not sharing profit', 'retirement of partner', 'partnership deed'],
    intro: 'Partner disputes come down to the deed, the accounts and who did what. Let\'s collect those.',
    juris: 'Partnership firms are governed by the Partnership Act, 1932; LLPs by the LLP Act, 2008. An unregistered firm faces limits on suing third parties and partners in some cases. Many deeds require arbitration.',
    tips: ['A partner can ask for accounts and a share of profits as per the deed.', 'Retirement and dissolution follow the deed; where it is silent, the statute fills the gaps.'],
    questions: [
      { id: 'pd_type', text: 'What kind of business?', chapter: 'The business', why: 'Firm and LLP rules differ.', options: o([['firm', 'Partnership firm'], ['llp', 'LLP'], ['informal', 'Informal, nothing registered']]) },
      { id: 'pd_reg', text: 'Is the firm registered with the Registrar of Firms?', chapter: 'The business', when: W('pd_type', 'firm'), why: 'Registration affects which suits can be filed.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'pd_issue', text: 'What is the problem?', type: 'multi', chapter: 'The dispute', why: 'Each issue needs different records.', options: o([['accounts', 'Partner won\'t show accounts'], ['money', 'Partner took money / clients'], ['exit', 'I want to exit / dissolve'], ['expelled', 'I was pushed out'], ['capital', 'Capital not returned'], ['debts', 'I\'m being made to pay firm debts']]) },
      { id: 'pd_deed', text: 'Is there a written partnership deed / LLP agreement?', chapter: 'Paper trail', why: 'It usually decides profit shares, exit and arbitration.', options: o([['yes', 'Yes'], ['no', 'No']]) },
      { id: 'pd_arb', text: 'Does it have an arbitration clause?', chapter: 'Paper trail', when: W('pd_deed', 'yes'), why: 'Usually sends the dispute to arbitration.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) }
    ],
    evidence: [
      { id: 'pd_e_deed', name: 'Partnership deed / LLP agreement and amendments', fact: 'Agreed shares and rules', why: 'The starting point.', where: 'Your records; Registrar of Firms; MCA for LLPs.', preserve: '', when: W('pd_deed', 'yes') },
      { id: 'pd_e_reg', name: 'Registration certificate (Form A / LLP incorporation)', fact: 'Registration status', why: 'Affects remedies.', where: 'Registrar of Firms / MCA.', preserve: '', when: W('pd_type', 'firm', 'llp') },
      { id: 'pd_e_capital', name: 'Proof of capital contributed by each partner', fact: 'Capital accounts', why: 'Basis for return of capital.', where: 'Bank statements, books.', preserve: '' },
      { id: 'pd_e_books', name: 'Books of accounts, bank statements and tax returns of the business', fact: 'Profits and withdrawals', why: 'Shows diversion and profit shares.', where: 'Accountant, bank.', preserve: LAWFUL },
      { id: 'pd_e_clients', name: 'Evidence of diverted clients or money (invoices raised elsewhere, messages)', fact: 'Misappropriation', why: 'Supports recovery and criminal complaints.', where: 'Your records, clients.', preserve: '', when: W('pd_issue', 'money') },
      { id: 'pd_e_informal', name: 'Messages, payments and witnesses showing the partnership existed', fact: 'Partnership existed', why: 'Needed when nothing was written.', where: 'Phone, bank, people involved.', preserve: '', when: W('pd_deed', 'no') },
      { id: 'pd_e_notice', name: 'Your notice of retirement/dissolution or the notice expelling you', fact: 'How the relationship ended', why: 'Fixes dates and rights.', where: 'Email, letters.', preserve: '', when: W('pd_issue', 'exit', 'expelled') },
      { id: 'pd_e_debts', name: 'Firm loans, guarantees and creditor demands', fact: 'Liability for firm debts', why: 'Partners can be personally liable in firms.', where: 'Bank, creditors.', preserve: '', when: W('pd_issue', 'debts') }
    ],
    urgent: [],
    lawyerQs: [{ text: 'Should I seek accounts, dissolution, or recovery — and in court or arbitration?' }, { text: 'Does non-registration of the firm affect my case?', when: W('pd_reg', 'no') }]
  });

  /* ---------------- Contract breach (commercial) ---------------- */
  I.push({
    id: 'contract-breach', cat: 'business', title: 'A business deal or contract was broken', short: 'Commercial contract dispute',
    synonyms: ['breach of contract', 'contract dispute', 'agreement broken', 'vendor did not deliver', 'supplier dispute', 'franchise dispute', 'distributor dispute', 'commercial dispute', 'arbitration', 'pre-institution mediation'],
    intro: 'Contract cases turn on what was promised, what was done, and what loss followed. We\'ll gather all three.',
    juris: 'Commercial disputes of ₹3 lakh or more go to commercial courts, generally after mandatory pre-institution mediation unless urgent interim relief is needed. If the contract has an arbitration clause, courts usually refer the dispute to arbitration but can grant interim protection.',
    tips: ['Send a clear written notice of breach before escalating; it fixes dates and positions.', 'Courts can grant urgent interim relief (e.g. to stop invocation of a bank guarantee) even when there is an arbitration clause.', 'You must take reasonable steps to limit your loss after a breach.'],
    questions: [
      { id: 'cbx_role', text: 'Which side are you on?', chapter: 'The deal', why: 'Claimants and respondents need different records.', options: o([['claim', 'The other side broke the deal'], ['defend', 'I am accused of breaking it']]) },
      { id: 'cbx_kind', text: 'What kind of deal?', chapter: 'The deal', why: 'Different industries keep different records.', options: o([['supply', 'Supply of goods'], ['services', 'Services / software / consulting'], ['franchise', 'Franchise / distribution'], ['lease', 'Commercial lease'], ['jv', 'Joint venture / investment'], ['other', 'Other']]) },
      { id: 'cbx_value', text: 'Value of the dispute?', chapter: 'The deal', why: '₹3 lakh is the threshold for commercial courts.', options: o([['u3', 'Under ₹3 lakh'], ['3to1cr', '₹3 lakh to ₹1 crore'], ['over1cr', 'More than ₹1 crore']]) },
      { id: 'cbx_breach', text: 'What went wrong?', type: 'multi', chapter: 'The breach', why: 'Each breach needs specific proof.', options: o([['nondelivery', 'Not delivered / not performed'], ['quality', 'Poor quality'], ['delay', 'Delay'], ['nonpayment', 'Payment not made'], ['termination', 'Contract wrongly terminated'], ['guarantee', 'Bank guarantee being invoked'], ['confidential', 'Confidential information misused']]) },
      { id: 'cbx_when', text: 'When did the other side break the deal?', when: W('cbx_role', 'claim'), chapter: 'The breach', why: 'A case for breach of contract must usually be filed within 3 years of the breach. We use this to show how much time you have.', options: o([['m6', 'In the last 6 months'], ['y1', '6 months to 1 year ago'], ['y2', '1 to 2 years ago'], ['y3', '2 to 3 years ago'], ['older', 'More than 3 years ago']]) },
      { id: 'cbx_arb', text: 'Does the contract have an arbitration clause?', chapter: 'The contract', why: 'Decides forum.', options: o([['yes', 'Yes'], ['no', 'No'], ['nowritten', 'No written contract']]) },
      { id: 'cbx_notice', text: 'Has a notice of breach been sent or received?', deep: true, chapter: 'Steps so far', why: 'Notices fix dates and cure periods.', options: o([['sent', 'Sent'], ['received', 'Received'], ['no', 'No']]) },
      { id: 'cbx_loss', text: 'Can you show your loss in numbers?', deep: true, chapter: 'Loss', when: W('cbx_role', 'claim'), why: 'Damages must be proved, not assumed.', options: o([['yes', 'Yes'], ['partly', 'Partly'], ['no', 'Not yet']]) }
    ],
    evidence: [
      { id: 'cbx_e_contract', name: 'Signed contract with annexures, amendments and SOWs', fact: 'What was promised', why: 'The foundation.', where: 'Your files.', preserve: '', when: NOT(W('cbx_arb', 'nowritten')) },
      { id: 'cbx_e_oral', name: 'Emails, quotations, POs and messages forming the deal', fact: 'Terms without a signed contract', why: 'A contract can be formed by correspondence.', where: 'Email.', preserve: 'Export full threads.', when: W('cbx_arb', 'nowritten') },
      { id: 'cbx_e_performance', name: 'Delivery records, milestones, acceptance and rejection notes', fact: 'Who performed what', why: 'Central to breach.', where: 'Project records, email.', preserve: '' },
      { id: 'cbx_e_payments', name: 'Payment records and invoices', fact: 'Money paid or due', why: 'Shows the financial position.', where: 'Accounts.', preserve: '' },
      { id: 'cbx_e_notices', name: 'Notices of breach, termination and replies', fact: 'Positions taken and dates', why: 'Fixes timeline and cure periods.', where: 'Email, letters.', preserve: '', when: W('cbx_notice', 'sent', 'received') },
      { id: 'cbx_e_loss', name: 'Loss calculation with supporting bills, lost orders, replacement costs', fact: 'Damages', why: 'Courts and tribunals award proven loss.', where: 'Accounts.', preserve: '', when: W('cbx_role', 'claim') },
      { id: 'cbx_e_bg', name: 'Bank guarantee and invocation letter', fact: 'Guarantee terms', why: 'Urgent injunctions turn on exact wording.', where: 'Bank.', preserve: '', time: 'Invocation can be paid quickly — act within days.', when: W('cbx_breach', 'guarantee') },
      { id: 'cbx_e_nda', name: 'NDA/confidentiality clauses and proof of misuse', fact: 'Confidential information misused', why: 'Supports injunction claims.', where: 'Contract, emails, market evidence.', preserve: '', when: W('cbx_breach', 'confidential') },
      { id: 'cbx_e_mitigate', name: 'Steps you took to limit the loss', fact: 'Mitigation', why: 'Required for damages.', where: 'Your records.', preserve: '', when: W('cbx_role', 'claim') }
    ],
    urgent: [{ id: 'cbx_u_bg', level: 'now', when: W('cbx_breach', 'guarantee'), title: 'Bank guarantee invocation is urgent', text: 'Courts can be approached for urgent interim relief. Speak to an advocate today.', help: ['l15100'] }],
    lawyerQs: [{ text: 'Court or arbitration — and is pre-institution mediation required?' }, { text: 'What damages can I realistically claim?', when: W('cbx_role', 'claim') }, { text: 'Can I get interim relief now?', when: W('cbx_breach', 'guarantee', 'confidential', 'termination') }]
  });

  /* ---------------- Brand / IP / ex-employee ---------------- */
  I.push({
    id: 'ip-brand', cat: 'business', title: 'Someone copied my brand, product or content, or took my business secrets', short: 'Brand copying & business secrets',
    synonyms: ['trademark infringement', 'brand copied', 'logo copied', 'passing off', 'copyright infringement', 'content copied', 'domain squatting', 'ex employee took clients', 'trade secrets', 'non compete', 'design copied'],
    intro: 'Brand and IP cases are about proving you were first and showing the copying clearly.',
    juris: 'Trademarks, copyright and designs are protected by statute; unregistered brands can still be protected through passing off. Post-employment non-compete clauses are generally unenforceable in India, but confidentiality obligations can be enforced.',
    tips: ['Evidence of earlier use (invoices, ads, dated web pages) matters as much as registration.', 'Take dated screenshots and test purchases of the copy before sending a notice.'],
    questions: [
      { id: 'ip_what', text: 'What was copied or taken?', type: 'multi', chapter: 'What happened', why: 'Each right is proved differently.', options: o([['brand', 'Brand name / logo'], ['content', 'Content, photos, software'], ['design', 'Product design'], ['domain', 'Domain or social handle'], ['secrets', 'Client lists or confidential data (by ex-employee/partner)']]) },
      { id: 'ip_reg', text: 'Is your brand or design registered?', chapter: 'Your rights', when: W('ip_what', 'brand', 'design'), why: 'Registration gives an infringement action; otherwise passing off.', options: o([['yes', 'Registered'], ['applied', 'Applied'], ['no', 'Not registered']]) },
      { id: 'ip_since', text: 'Since when have you used it?', chapter: 'Your rights', when: W('ip_what', 'brand', 'design', 'content'), why: 'Prior use decides who wins.', options: o([['y5', 'More than 5 years'], ['y1', '1–5 years'], ['new', 'Under a year']]) },
      { id: 'ip_where', text: 'Where is the copy being used?', type: 'multi', chapter: 'The copy', why: 'Marketplaces and platforms have takedown routes.', options: o([['online', 'Website / marketplace / social media'], ['shops', 'Shops / offline'], ['both', 'Both']]) }
    ],
    evidence: [
      { id: 'ip_e_reg', name: 'Trademark/design registration certificate or application', fact: 'Your registered rights', why: 'Basis of infringement action.', where: 'IP India portal.', preserve: '', when: W('ip_reg', 'yes', 'applied') },
      { id: 'ip_e_use', name: 'Proof of earliest and continuous use: invoices, ads, packaging, dated web pages', fact: 'You used it first', why: 'Decides priority and passing off.', where: 'Your records; web archives.', preserve: '' },
      { id: 'ip_e_sales', name: 'Sales figures and marketing spend', fact: 'Your reputation (goodwill)', why: 'Needed for passing off.', where: 'Accounts.', preserve: '', when: W('ip_what', 'brand', 'design') },
      { id: 'ip_e_copy', name: 'Dated screenshots, URLs, test purchases and invoices of the copy', fact: 'The infringement', why: 'Shows what is copied and where.', where: 'Web, marketplaces, shops.', preserve: 'Keep the purchased product sealed.' },
      { id: 'ip_e_confusion', name: 'Instances of customer confusion (messages, reviews, misdirected orders)', fact: 'Consumers were misled', why: 'Strong evidence in brand cases.', where: 'Customer support, reviews.', preserve: '', when: W('ip_what', 'brand') },
      { id: 'ip_e_creation', name: 'Original files with creation dates (source files, drafts, code repos)', fact: 'You created it', why: 'Proves authorship in copyright cases.', where: 'Your systems.', preserve: '', when: W('ip_what', 'content', 'design') },
      { id: 'ip_e_employment', name: 'Employment/consultancy agreement with confidentiality clauses; exit records', fact: 'Confidentiality obligations', why: 'Basis for action over secrets.', where: 'HR records.', preserve: '', when: W('ip_what', 'secrets') },
      { id: 'ip_e_leak', name: 'Evidence the data or clients were taken (access logs, client messages)', fact: 'Misuse of confidential information', why: 'Supports injunction.', where: 'IT logs, clients.', preserve: 'Ask IT to preserve logs; don\'t access the person\'s private accounts.', when: W('ip_what', 'secrets') }
    ],
    urgent: [],
    lawyerQs: [{ text: 'Infringement, passing off, or both — and can I get an urgent injunction?' }, { text: 'Should I use platform takedowns first?', when: W('ip_where', 'online', 'both') }, { text: 'What can I enforce against the ex-employee?', when: W('ip_what', 'secrets') }]
  });

  /* ---------- Business questions ---------- */
  const Q = (id, q, a, depends, law, journey, kw) => KB.questions.push({ cat: 'business', id, q, a, depends, law, journey, kw });
  Q('msme-45', 'My buyer hasn\'t paid in 45 days. I\'m a small business. What can I do?', 'If you were registered as a micro or small enterprise when you supplied, the buyer must pay within the agreed period (not more than 45 days). Late payment carries compound interest at three times the RBI bank rate. You can file a reference with the state MSE Facilitation Council through the MSME ODR portal.', ['Udyam registration date', 'Proof of delivery and acceptance'], 'MSMED Act 2006 ss.15–18', 'business-unpaid', ['msme', '45 days', 'samadhaan']);
  Q('ibc-threshold', 'Can I file insolvency against a company that owes me money?', 'Only if the unpaid debt is at least ₹1 crore and there is no genuine pre-existing dispute. As an operational creditor you first send a demand notice; the company can dispute it within 10 days. Insolvency is a collective process, not a recovery shortcut.', ['Amount and nature of debt', 'Any prior dispute'], 'Insolvency and Bankruptcy Code 2016 ss.8–9', 'business-unpaid', ['insolvency', 'nclt']);
  Q('commercial-mediation', 'Do I have to try mediation before filing a commercial suit?', 'Generally yes. For commercial disputes not seeking urgent interim relief, pre-institution mediation is mandatory before filing a suit in a commercial court.', ['Whether you need urgent relief', 'Value of the dispute'], 'Commercial Courts Act 2015 s.12A; Patil Automation v. Rakheja Engineers (2022)', 'contract-breach', ['pre-institution mediation']);
  Q('oppression', 'What is an oppression and mismanagement case?', 'It lets shareholders ask the NCLT for relief when the company is run in a way unfairly prejudicial to them — for example being removed, diluted or kept out of records. Members usually need at least 10% of shares (or 100 members), though the Tribunal can waive this.', ['Your shareholding', 'What exactly was done'], 'Companies Act 2013 ss.241–244', 'shareholder-dispute', ['oppression mismanagement', 'nclt']);
  Q('non-compete', 'Can my ex-employer stop me from joining a competitor?', 'Generally no — restraints after employment ends are largely unenforceable in India. But you must still respect confidentiality obligations and not take confidential information or solicit in breach of a valid clause.', ['Your contract wording', 'What information you hold'], 'Indian Contract Act s.27', 'ip-brand', ['non compete']);
  KB.myths.push({ s: 'A non-compete clause can stop you from working for a competitor after you resign.', fact: false, why: 'Post-employment restraints are generally unenforceable in India, though confidentiality obligations remain.' });
  KB.myths.push({ s: 'A small supplier can charge interest if a registered buyer pays after 45 days.', fact: true, why: 'Micro and small enterprises are entitled to compound interest at three times the RBI bank rate on delayed payment.' });

  KB.directory = KB.directory.filter((d) => !['Unpaid invoice or business payment', 'Breach of contract', 'Partnership dispute'].includes(d.title));
})(globalThis);
