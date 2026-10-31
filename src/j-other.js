/* Home, work, police, accident and online journeys (draft, not advocate-reviewed). */
(function (root) {
  const { W, ALL, ANY, NOT, ANS, o, NS, PN, LAWFUL } = root.ER_H;
  const I = root.ER_KB.issues;

  /* ---------------- Eviction / tenancy (both sides) ---------------- */
  I.push({
    id: 'eviction-tenancy', cat: 'home', title: 'Tenant–landlord dispute: eviction, rent, or tenant not leaving', short: 'Eviction & tenancy',
    synonyms: ['eviction', 'evict tenant', 'tenant not vacating', 'landlord forcing to vacate', 'rent increase', 'rent not paid', 'tenant not paying rent', 'electricity cut by landlord', 'rent agreement expired', 'vacate notice', 'rent control'],
    intro: 'Both tenants and landlords use this guide. Eviction must follow due process — locks, power cuts and threats are not a lawful shortcut.',
    juris: 'Tenancy is governed by state rent laws (some states follow the Model Tenancy Act), the rent agreement, and the Transfer of Property Act.',
    tips: ['A landlord generally cannot evict by changing locks, removing belongings or cutting water/electricity — eviction needs due process.', 'Unregistered agreements of more than 11 months raise registration issues; your advocate will check the effect.', 'Keep paying (or offering) rent and keep proof, even during a dispute.'],
    questions: [
      { id: 'ev_side', text: 'Which side are you on?', chapter: 'Your side', why: 'Tenants and landlords need different records.',
        options: o([['tenant', 'Tenant'], ['landlord', 'Landlord / owner']]) },
      { id: 'ev_issue', text: 'What is the problem?', type: 'multi', chapter: 'The dispute', why: 'Each issue has its own records.',
        options: o([['evict', 'Eviction / asked to vacate'], ['rentdue', 'Rent not paid'], ['increase', 'Rent increase'], ['utilities', 'Water/electricity cut or locks changed'], ['repairs', 'Repairs or damage'], ['overstay', 'Tenant staying after agreement ended'], ['subletting', 'Subletting / misuse']]) },
      { id: 'ev_agreement', text: 'Is there a written rent agreement?', chapter: 'Papers', why: 'Notice periods and rent terms usually come from it.',
        options: o([['registered', 'Yes, registered'], ['unregistered', 'Yes, not registered'], ['expired', 'Yes, but it has expired'], ['none', 'No']]) },
      { id: 'ev_use', text: 'Is the property used as a home or for business?', chapter: 'Papers', why: 'Residential and commercial tenancies are treated differently.',
        options: o([['home', 'Home'], ['shop', 'Shop / office'], ['both', 'Both']]) },
      { id: 'ev_notice', text: 'Has a written notice been given?', chapter: 'Notices', why: 'Eviction and termination normally need a proper notice.',
        options: o([['received', 'I received one'], ['sent', 'I sent one'], ['no', 'No written notice']]) },
      { id: 'ev_reason', text: 'What reason is given for eviction?', chapter: 'Notices', when: W('ev_issue', 'evict', 'overstay'),
        why: 'Rent laws allow eviction only on specific grounds.', options: o([['default', 'Rent default'], ['ownneed', 'Owner needs it for own use'], ['expiry', 'Agreement ended'], ['damage', 'Damage/nuisance'], ['none', 'No reason'], NS]) },
      { id: 'ev_years', text: 'How long has the tenancy lasted?', deep: true, chapter: 'History', why: 'Long tenancies may get more protection under rent laws.',
        options: o([['u1', 'Under a year'], ['1to5', '1–5 years'], ['over5', 'More than 5 years']]) },
      { id: 'ev_police', text: 'Was police verification of the tenant done?', deep: true, chapter: 'History', why: 'Many cities require it; it also proves the tenancy.',
        options: o([['yes', 'Yes'], ['no', 'No'], NS]) }
    ],
    evidence: [
      { id: 'ev_e_agreement', name: 'Rent agreement and any renewals', fact: 'Terms, rent, notice period', why: 'Starting point for both sides.', where: 'Your copy; sub-registrar if registered.', preserve: '', when: W('ev_agreement', 'registered', 'unregistered', 'expired') },
      { id: 'ev_e_rent', name: 'Rent payment records for the whole tenancy', fact: 'Rent paid or unpaid', why: 'Decides default claims.', where: 'Bank/UPI statements, receipts.', preserve: 'Make a month-by-month table.' },
      { id: 'ev_e_tenancyproof', name: 'Proof of tenancy without agreement (rent receipts, address proofs, police verification, utility bills)', fact: 'Tenancy exists', why: 'Needed when nothing is written.', where: 'Your records.', preserve: '', when: W('ev_agreement', 'none') },
      { id: 'ev_e_notice', name: 'The notice (sent or received) with postal proof', fact: 'Proper notice given', why: 'Defective notices are a common defence.', where: 'Post office, advocate.', preserve: 'Keep envelopes and tracking.', when: W('ev_notice', 'received', 'sent') },
      { id: 'ev_e_cut', name: 'Photos/videos and complaints about utilities cut or locks changed', fact: 'Illegal self-help eviction', why: 'Supports urgent court or police action.', where: 'Your phone, police, utility.', preserve: '', when: ALL(W('ev_side', 'tenant'), W('ev_issue', 'utilities')) },
      { id: 'ev_e_need', name: 'Proof of the owner\'s genuine need (family size, current housing, business plans)', fact: 'Bona fide need', why: 'A common eviction ground that must be proved.', where: 'Owner\'s records.', preserve: '', when: ALL(W('ev_side', 'landlord'), W('ev_reason', 'ownneed')) },
      { id: 'ev_e_title', name: 'Ownership papers of the property', fact: 'Who is the landlord', why: 'Landlords must show their right to let/evict.', where: 'Sale deed, tax receipts.', preserve: '', when: W('ev_side', 'landlord') },
      { id: 'ev_e_condition', name: 'Photos of the property\'s condition and repair bills', fact: 'Damage or repairs', why: 'Answers damage claims.', where: 'Phone, contractors.', preserve: '', when: W('ev_issue', 'repairs') },
      { id: 'ev_e_police', name: 'Police verification form', fact: 'Tenancy registered with police', why: 'Supports the tenancy record.', where: 'Local police / online portal.', preserve: '', when: W('ev_police', 'yes') },
      { id: 'ev_e_msgs', name: 'Messages between landlord and tenant', fact: 'What each side said', why: 'Shows threats, promises or admissions.', where: 'Phone.', preserve: 'Export full chats.' }
    ],
    urgent: [
      { id: 'ev_u_selfhelp', level: 'now', when: ALL(W('ev_side', 'tenant'), W('ev_issue', 'utilities')), title: 'Forced eviction is not lawful', text: 'If you are being locked out or threatened, call 112 and see an advocate quickly — courts can pass urgent orders.', help: ['e112', 'l15100'] }
    ],
    lawyerQs: [{ text: 'Which rent law applies in my state, and what grounds and notice periods does it require?' }, { text: 'Is the notice valid?', when: W('ev_notice', 'received', 'sent') }, { text: 'What is the fastest lawful way to recover possession or rent?', when: W('ev_side', 'landlord') }]
  });

  /* ---------------- Land encroachment / title ---------------- */
  I.push({
    id: 'land-encroachment', cat: 'home', title: 'Someone is encroaching on or claiming my land', short: 'Land encroachment or title dispute',
    synonyms: ['encroachment', 'land grab', 'illegal possession', 'boundary dispute', 'neighbour built on my land', 'land occupied', 'trespass', 'fake documents land', 'land fraud', 'mutation wrong', 'demarcation', 'survey'],
    intro: 'Land disputes are decided on title papers, revenue records and who is in possession. Speed matters.',
    juris: 'Civil courts decide title and injunctions; revenue authorities handle measurement, demarcation and records. Long, open possession by someone else can create claims, so do not delay.',
    tips: ['Revenue records (record of rights, khatian, 7/12, jamabandi) show who is recorded, but title comes from deeds.', 'Ask the revenue office for an official demarcation (measurement) if the boundary itself is disputed.', 'An injunction from a civil court can stop construction while the case runs.'],
    questions: [
      { id: 'le_kind', text: 'What kind of land is it?', chapter: 'The land', why: 'Urban plots and agricultural land have different records.', options: o([['agri', 'Agricultural land'], ['plot', 'Residential plot'], ['house', 'House / building'], ['commercial', 'Commercial property']]) },
      { id: 'le_how', text: 'How did you get it?', chapter: 'The land', why: 'Your title documents depend on this.', options: o([['bought', 'Bought it'], ['inherited', 'Inherited'], ['gift', 'Gift / family settlement'], ['govt', 'Government allotment / patta']]) },
      { id: 'le_problem', text: 'What is happening?', type: 'multi', chapter: 'The problem', why: 'Each kind of interference needs different action.',
        options: o([['building', 'Someone is building on it now'], ['occupied', 'Someone has occupied it'], ['boundary', 'Neighbour has moved the boundary'], ['fakedocs', 'Someone has fake documents / sold it'], ['records', 'Records changed into someone else\'s name'], ['access', 'My access/path is blocked']]) },
      { id: 'le_since', text: 'Since when?', chapter: 'The problem', why: 'Delay weakens your position and can raise possession claims.', options: o([['weeks', 'Last few weeks'], ['year', 'Within a year'], ['years', 'Several years'], ['long', 'More than 10 years']]) },
      { id: 'le_possession', text: 'Who is in physical possession now?', chapter: 'The problem', why: 'Possession decides which case to file.', options: o([['me', 'I am'], ['them', 'They are'], ['partly', 'Partly each']]) },
      { id: 'le_survey', text: 'Has the land been officially measured (demarcation) recently?', deep: true, chapter: 'Records', why: 'Official measurement settles many boundary disputes.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'le_police', text: 'Have you complained to police or revenue officials?', deep: true, chapter: 'Records', type: 'multi', why: 'Earlier complaints show you objected promptly.', options: o([['police', 'Police'], ['revenue', 'Tehsildar / revenue office'], ['none', 'No']]) }
    ],
    evidence: [
      { id: 'le_e_deed', name: 'Title deed (sale deed, gift deed, partition deed, patta) — certified copy', fact: 'Your ownership', why: 'The foundation of any claim.', where: 'Your records; certified copy from sub-registrar.', preserve: '' },
      { id: 'le_e_chain', name: 'Earlier chain of title deeds (previous owners)', fact: 'Title history', why: 'Answers rival claims.', where: 'Sub-registrar.', preserve: '', when: W('le_problem', 'fakedocs', 'records') },
      { id: 'le_e_ror', name: 'Revenue records: record of rights, khatian/7-12/jamabandi, mutation entries', fact: 'Who is recorded as owner/possessor', why: 'Shows record changes.', where: 'State land records portal, tehsil.', preserve: 'Get certified copies.' },
      { id: 'le_e_map', name: 'Survey map, layout plan, sketch with boundaries and measurements', fact: 'Exact boundaries', why: 'Needed for boundary disputes.', where: 'Survey office, layout approval.', preserve: '' },
      { id: 'le_e_demarcation', name: 'Demarcation report / apply for official measurement', fact: 'Where the boundary actually is', why: 'Independent measurement settles many disputes.', where: 'Revenue office.', preserve: '', action: true, when: W('le_problem', 'boundary') },
      { id: 'le_e_tax', name: 'Land revenue / property tax receipts and utility bills', fact: 'Continuous possession and ownership', why: 'Supports possession.', where: 'Municipality, tehsil.', preserve: '' },
      { id: 'le_e_photos', name: 'Dated photos/videos of the land before and after the encroachment', fact: 'What changed and when', why: 'Shows the encroachment.', where: 'Your phone; neighbours.', preserve: 'Take fresh dated photos now; keep originals.' },
      { id: 'le_e_ec', name: 'Encumbrance certificate', fact: 'Any sale or mortgage registered', why: 'Detects fraudulent sales.', where: 'Sub-registrar / portal.', preserve: '', when: W('le_problem', 'fakedocs') },
      { id: 'le_e_complaints', name: 'Copies of police/revenue complaints and replies', fact: 'You objected promptly', why: 'Shows you acted in time.', where: 'Police, revenue office.', preserve: '', when: W('le_police', 'police', 'revenue') },
      { id: 'le_e_witness', name: 'Names of neighbours who know the boundaries and your possession', fact: 'Long possession', why: 'Supporting witnesses.', where: '—', preserve: 'Names only.' }
    ],
    urgent: [
      { id: 'le_u_build', level: 'now', when: W('le_problem', 'building'), title: 'Construction is happening now', text: 'Courts can grant an urgent injunction to stop construction. Photograph it today and see an advocate quickly.', help: ['l15100'] },
      { id: 'le_u_long', level: 'soon', when: W('le_since', 'years', 'long'), title: 'Long possession by others can create claims', text: 'Do not delay further — see an advocate about time limits.', help: ['l15100'] }
    ],
    lawyerQs: [{ text: 'Should I file for injunction, possession, or declaration of title?' }, { text: 'Do I need an official demarcation first?', when: W('le_problem', 'boundary') }, { text: 'Is a criminal complaint (trespass, forgery) also possible?', when: W('le_problem', 'fakedocs', 'occupied') }]
  });

  /* ---------------- Wrongful termination ---------------- */
  I.push({
    id: 'wrongful-termination', cat: 'work', title: 'I was fired, forced to resign, or my dues were withheld', short: 'Termination & dues',
    synonyms: ['fired', 'terminated', 'dismissed', 'layoff', 'forced resignation', 'asked to resign', 'full and final', 'relieving letter not given', 'experience letter', 'gratuity', 'notice period', 'bond', 'retrenchment'],
    intro: 'Whether labour law protects you depends partly on your role and pay. We\'ll capture the facts your advocate needs to decide.',
    juris: 'The four Labour Codes came into force on 21 November 2025. "Workers" have protection against unfair termination; managerial staff above set thresholds may need to rely on their contract instead.',
    tips: ['Gratuity is generally payable after five years of continuous service (shorter for some fixed-term employees under the new codes).', 'Don\'t sign a resignation letter you didn\'t write without advice.', 'Ask for reasons, a relieving letter and your full-and-final settlement in writing.'],
    questions: [
      { id: 'wt_how', text: 'How did the job end?', chapter: 'What happened', why: 'Termination, forced resignation and layoffs are treated differently.',
        options: o([['fired', 'Terminated / dismissed'], ['forced', 'Forced to resign'], ['layoff', 'Laid off / retrenched'], ['contract', 'Contract not renewed'], ['ongoing', 'Still employed but being pushed out']]) },
      { id: 'wt_role', text: 'What was your role?', chapter: 'Your job', why: 'Labour-law protection depends on whether you are a "worker" or in a managerial/supervisory role.',
        options: o([['worker', 'Worker / staff / technician / operator'], ['supervisor', 'Supervisor'], ['manager', 'Manager or above'], NS]) },
      { id: 'wt_years', text: 'How long did you work there?', chapter: 'Your job', why: 'Length of service affects notice, compensation and gratuity.',
        options: o([['u1', 'Under 1 year'], ['1to5', '1–5 years'], ['over5', 'More than 5 years']]) },
      { id: 'wt_reason', text: 'What reason was given?', chapter: 'What happened', why: 'Misconduct allegations need an inquiry; "performance" needs proof.',
        options: o([['misconduct', 'Misconduct'], ['performance', 'Performance'], ['restructure', 'Restructuring / cost cutting'], ['none', 'No reason'], ['retaliation', 'After I complained / took leave / was pregnant']]) },
      { id: 'wt_inquiry', text: 'Was there a show-cause notice or inquiry?', chapter: 'Process', when: W('wt_reason', 'misconduct'), why: 'Dismissal for misconduct generally needs a fair inquiry.',
        options: o([['yes', 'Yes, I could reply'], ['no', 'No'], NS]) },
      { id: 'wt_dues', text: 'What is still unpaid?', type: 'multi', chapter: 'Money', why: 'Each due has its own rules and records.',
        options: o([['salary', 'Salary'], ['notice', 'Notice pay'], ['leave', 'Leave encashment'], ['gratuity', 'Gratuity'], ['pf', 'PF transfer/withdrawal'], ['bonus', 'Bonus / incentives'], ['none', 'Nothing']]) },
      { id: 'wt_docs', text: 'What have you been given?', type: 'multi', deep: true, chapter: 'Papers', why: 'Missing documents can be requested in writing.',
        options: o([['termletter', 'Termination letter'], ['relieving', 'Relieving / experience letter'], ['fnf', 'Full-and-final statement'], ['none', 'Nothing in writing']]) }
    ],
    evidence: [
      { id: 'wt_e_appointment', name: 'Appointment letter, contract and any later revision letters', fact: 'Your terms and notice period', why: 'Defines what you were owed.', where: 'Email, HR portal.', preserve: '' },
      { id: 'wt_e_termination', name: 'Termination / resignation-acceptance letter, and the emails around it', fact: 'How and why the job ended', why: 'The central document.', where: 'Email.', preserve: 'Forward to personal email before access is cut (only your own records).', when: W('wt_how', 'fired', 'forced', 'layoff', 'contract') },
      { id: 'wt_e_pressure', name: 'Messages or recordings showing pressure to resign', fact: 'Resignation was not voluntary', why: 'Forced resignation can be treated as termination.', where: 'Phone, email.', preserve: LAWFUL, when: W('wt_how', 'forced', 'ongoing') },
      { id: 'wt_e_inquiry', name: 'Show-cause notice, your reply, inquiry report', fact: 'Whether a fair process was followed', why: 'Dismissal without a fair inquiry may be challenged.', where: 'HR.', preserve: '', when: W('wt_reason', 'misconduct') },
      { id: 'wt_e_performance', name: 'Appraisals, ratings, appreciation emails, targets met', fact: 'Your performance record', why: 'Answers performance-based termination.', where: 'HR portal, email.', preserve: '', when: W('wt_reason', 'performance', 'none') },
      { id: 'wt_e_slips', name: 'Salary slips, Form 16 and bank statements', fact: 'Your pay', why: 'Needed to calculate dues.', where: 'HR portal, bank.', preserve: '' },
      { id: 'wt_e_pf', name: 'EPFO passbook / UAN details', fact: 'PF contributions', why: 'Shows employment and PF dues.', where: 'EPFO portal.', preserve: '', when: W('wt_dues', 'pf') },
      { id: 'wt_e_leave', name: 'Leave balance record', fact: 'Leave encashment due', why: 'Calculates encashment.', where: 'HR portal.', preserve: '', when: W('wt_dues', 'leave') },
      { id: 'wt_e_fnf', name: 'Written request for full-and-final settlement, relieving and experience letters', fact: 'Dues were demanded', why: 'Creates a record.', where: 'Email to HR.', preserve: '', action: true, when: ANY(W('wt_docs', 'none'), W('wt_dues', 'salary', 'notice', 'leave', 'gratuity', 'bonus')) },
      { id: 'wt_e_retaliation', name: 'Your earlier complaint, leave application or maternity request, and the dates', fact: 'Termination followed a protected act', why: 'Timing can show retaliation.', where: 'Email.', preserve: '', when: W('wt_reason', 'retaliation') }
    ],
    urgent: [],
    lawyerQs: [{ text: 'Am I a "worker" under the Industrial Relations Code, or is this a contract claim?' }, { text: 'What compensation and dues can I claim, and is there a time limit?' }, { text: 'Was the inquiry process fair?', when: W('wt_reason', 'misconduct') }]
  });

  /* ---------------- Workplace sexual harassment ---------------- */
  I.push({
    id: 'workplace-harassment', cat: 'work', sensitive: true, title: 'Sexual harassment at work (POSH)', short: 'Sexual harassment at work',
    synonyms: ['posh', 'sexual harassment at work', 'harassment at office', 'internal committee', 'icc complaint', 'boss harassment', 'colleague harassment'],
    intro: 'You can stop at any time. Your answers stay on this device.',
    juris: 'The Sexual Harassment of Women at Workplace Act, 2013 requires workplaces with 10 or more employees to have an Internal Committee. A Local Committee in each district covers others. Complaints are generally due within 3 months of the last incident (extendable by 3 months).',
    tips: ['You can ask the committee for interim relief, such as a transfer or leave, while the inquiry runs.', 'Conciliation is possible only if you ask for it, and money cannot be the basis of a settlement.', 'Your identity and the proceedings must be kept confidential.'],
    questions: [
      { id: 'wh_safe', text: 'Are you safe right now?', sensitive: true, chapter: 'Safety', why: 'Safety comes first.', options: o([['safe', 'Yes'], ['threat', 'I have been threatened'], ['danger', 'I am in danger'], PN]) },
      { id: 'wh_when', text: 'When was the most recent incident?', chapter: 'Timing', why: 'The complaint is generally due within 3 months of the last incident.', options: o([['m1', 'Within the last month'], ['m3', '1–3 months ago'], ['m6', '3–6 months ago'], ['older', 'More than 6 months ago']]) },
      { id: 'wh_who', text: 'Who is responsible?', chapter: 'What happened', why: 'Seniority can affect interim relief and who hears the complaint.', options: o([['senior', 'A senior / manager'], ['peer', 'A colleague'], ['client', 'A client or visitor'], PN]) },
      { id: 'wh_ic', text: 'Does your workplace have an Internal Committee?', chapter: 'Where to complain', why: 'If not, the district Local Committee hears the complaint.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'wh_records', text: 'What records exist?', type: 'multi', chapter: 'Records', sensitive: true, why: 'Choose what applies.', options: o([['messages', 'Messages, emails or calls'], ['witness', 'Someone saw or heard'], ['told', 'I told someone at the time'], ['none', 'Nothing written'], PN]) },
      { id: 'wh_retaliation', text: 'Have you faced any retaliation?', deep: true, chapter: 'After', why: 'Retaliation can be raised with the committee.', options: o([['yes', 'Yes'], ['no', 'No'], PN]) }
    ],
    evidence: [
      { id: 'wh_e_diary', name: 'A dated, private account of each incident: what happened, where, who was nearby', fact: 'The incidents', why: 'Detailed notes made close to the time carry weight.', where: 'Write it yourself.', preserve: 'Keep a copy outside work devices.', action: true },
      { id: 'wh_e_msgs', name: 'Messages, emails, call logs or voice notes from the person', fact: 'The conduct', why: 'Direct evidence.', where: 'Your phone and email.', preserve: 'Keep originals; back up to a personal account. Only your own messages.', when: W('wh_records', 'messages') },
      { id: 'wh_e_witness', name: 'Names of people who saw, heard, or were told at the time', fact: 'Corroboration', why: 'Supports your account.', where: '—', preserve: 'Names only.', when: W('wh_records', 'witness', 'told') },
      { id: 'wh_e_policy', name: 'Your employer\'s POSH policy and committee details', fact: 'How to complain', why: 'Names the committee and process.', where: 'HR portal, notice board.', preserve: '' },
      { id: 'wh_e_complaint', name: 'Your written complaint and acknowledgement', fact: 'Complaint filed in time', why: 'Fixes the date.', where: 'Committee, or SHe-Box portal.', preserve: '', time: 'Generally within 3 months of the last incident.' },
      { id: 'wh_e_retaliation', name: 'Records of retaliation (transfers, bad reviews, exclusion) with dates', fact: 'Adverse action after complaint', why: 'Can be raised with the committee.', where: 'Email, HR records.', preserve: '', when: W('wh_retaliation', 'yes') }
    ],
    urgent: [
      { id: 'wh_u_danger', level: 'now', when: W('wh_safe', 'danger'), title: 'Please get help now', text: 'If you are in danger, call 112.', help: ['e112', 'w181'] },
      { id: 'wh_u_time', level: 'soon', when: W('wh_when', 'm3', 'm6'), title: 'The complaint window may be closing', text: 'Complaints are generally due within 3 months of the last incident, extendable by another 3 for good reason. Act soon.', help: ['posh', 'l15100'] }
    ],
    lawyerQs: [{ text: 'Should I complain to the Internal Committee, the Local Committee, the police, or more than one?' }, { text: 'What interim relief can I ask for during the inquiry?' }, { text: 'Can the delay be condoned?', when: W('wh_when', 'm6', 'older') }]
  });

  /* ---------------- FIR / police complaint ---------------- */
  I.push({
    id: 'police-complaint', cat: 'police', title: 'I want to file an FIR, or the police won\'t register my complaint', short: 'FIR or police complaint',
    synonyms: ['fir', 'file fir', 'police complaint', 'police not registering fir', 'police refused fir', 'zero fir', 'e-fir', 'online fir', 'ncr', 'cheating complaint', 'theft complaint', 'fraud complaint'],
    intro: 'A clear written complaint with dates and documents makes an FIR far more likely — and more useful.',
    juris: 'Under the Bharatiya Nagarik Suraksha Sanhita (BNSS), police must register an FIR for cognizable offences, including a "zero FIR" at any station and e-FIRs. If they refuse, you can approach the Superintendent of Police and then a Magistrate.',
    tips: ['You are entitled to a free copy of the FIR.', 'A "zero FIR" can be filed at any police station, which then transfers it.', 'For some offences punishable with 3 to 7 years, police may first do a preliminary enquiry, generally within 14 days.'],
    questions: [
      { id: 'pc_what', text: 'What happened?', chapter: 'The incident', why: 'The kind of offence decides how police must respond.',
        options: o([['theft', 'Theft / robbery'], ['cheating', 'Cheating or fraud'], ['assault', 'Assault / hurt'], ['threat', 'Threats or intimidation'], ['missing', 'Missing person'], ['women', 'Offence against a woman or child'], ['other', 'Something else']]) },
      { id: 'pc_when', text: 'When did it happen?', chapter: 'The incident', why: 'Delay in reporting needs an explanation.', options: o([['today', 'Today or yesterday'], ['week', 'Within a week'], ['month', 'Within a month'], ['older', 'Earlier']]) },
      { id: 'pc_status', text: 'What has happened with the police so far?', chapter: 'Police', why: 'The next step depends on how police responded.',
        options: o([['notyet', 'I haven\'t gone yet'], ['refused', 'They refused to register'], ['ncr', 'They gave only a "non-cognizable report"/receipt'], ['fir', 'FIR registered'], ['noaction', 'FIR registered, no action']]) },
      { id: 'pc_accused', text: 'Do you know who did it?', chapter: 'The incident', why: 'Names and details help the investigation.', options: o([['yes', 'Yes'], ['partly', 'Some details'], ['no', 'No']]) },
      { id: 'pc_evidence', text: 'What do you already have?', type: 'multi', chapter: 'Records', why: 'These go with the written complaint.',
        options: o([['docs', 'Documents / bills / agreements'], ['digital', 'Messages, call records, transactions'], ['cctv', 'CCTV may exist'], ['witness', 'Witnesses'], ['medical', 'Medical records'], ['none', 'Nothing yet']]) },
      { id: 'pc_sp', text: 'Have you sent the complaint to the Superintendent of Police?', deep: true, chapter: 'Escalation', when: W('pc_status', 'refused', 'ncr'),
        why: 'Writing to the SP is usually the step before going to a Magistrate.', options: o([['yes', 'Yes'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'pc_e_written', name: 'A signed written complaint: who, what, when, where, and a list of attachments', fact: 'The facts of the offence', why: 'A clear written complaint is harder to ignore and becomes the basis of the FIR.', where: 'Write it; take two copies.', preserve: 'Get the second copy stamped as received.', action: true },
      { id: 'pc_e_timeline', name: 'A short dated timeline of what happened', fact: 'Sequence of events', why: 'Police and courts test complaints against dates.', where: 'Use "My timeline".', preserve: '', action: true },
      { id: 'pc_e_id', name: 'Your ID and address proof', fact: 'Who is complaining', why: 'Needed to register and follow up.', where: 'Your documents.', preserve: '' },
      { id: 'pc_e_docs', name: 'Supporting documents (bills, agreements, transaction records)', fact: 'Loss and transactions', why: 'Shows what happened.', where: 'Your records.', preserve: 'Give copies; keep originals.', when: W('pc_evidence', 'docs', 'digital') },
      { id: 'pc_e_cctv', name: 'Written request to preserve CCTV footage', fact: 'Video evidence', why: 'Footage is often overwritten within days.', where: 'Shop/building owner, police.', preserve: '', action: true, time: 'Ask immediately — CCTV is often overwritten within days.', when: W('pc_evidence', 'cctv') },
      { id: 'pc_e_medical', name: 'Medical (MLC) report and injury photos', fact: 'Injuries', why: 'Corroborates assault.', where: 'Government hospital.', preserve: '', when: ANY(W('pc_what', 'assault'), W('pc_evidence', 'medical')) },
      { id: 'pc_e_witness', name: 'Witness names and contact details', fact: 'Who saw it', why: 'Helps investigation.', where: '—', preserve: '', when: W('pc_evidence', 'witness') },
      { id: 'pc_e_accused', name: 'Details of the accused: name, phone, address, vehicle, bank account', fact: 'Who did it', why: 'Speeds up investigation.', where: 'Your records.', preserve: '', when: W('pc_accused', 'yes', 'partly') },
      { id: 'pc_e_fir', name: 'FIR copy and number', fact: 'FIR registered', why: 'Needed for follow-up, insurance and court.', where: 'Police station or state police website.', preserve: '', when: W('pc_status', 'fir', 'noaction') },
      { id: 'pc_e_refusal', name: 'Proof police refused (receipt, diary number, date, officer name)', fact: 'Police did not register', why: 'Needed to escalate to SP and Magistrate.', where: 'Police station.', preserve: '', when: W('pc_status', 'refused', 'ncr') },
      { id: 'pc_e_sp', name: 'Complaint to the Superintendent of Police with postal proof', fact: 'Escalation done', why: 'Usually required before approaching a Magistrate.', where: 'SP office by post/email.', preserve: '', action: true, when: W('pc_status', 'refused', 'ncr') }
    ],
    urgent: [
      { id: 'pc_u_missing', level: 'now', when: W('pc_what', 'missing'), title: 'Report a missing person immediately', text: 'There is no waiting period. Go to the nearest police station or call 112. For a missing child, also call 1098.', help: ['e112', 'c1098'] },
      { id: 'pc_u_women', level: 'soon', when: W('pc_what', 'women'), title: 'Special protections apply', text: 'Statements of women and children have special safeguards. Women Helpline 181 can help.', help: ['w181', 'c1098'] }
    ],
    lawyerQs: [{ text: 'Which offences do these facts disclose?' }, { text: 'How do I approach the Magistrate if police still refuse?', when: W('pc_status', 'refused', 'ncr') }, { text: 'How do I follow up on investigation and get a copy of the chargesheet?', when: W('pc_status', 'fir', 'noaction') }]
  });

  /* ---------------- Accused / arrest ---------------- */
  I.push({
    id: 'accused-arrest', cat: 'police', title: 'A case has been filed against me, or I fear arrest', short: 'Accused or fear of arrest',
    synonyms: ['anticipatory bail', 'bail', 'arrest', 'fear arrest', 'false case', 'fir against me', 'police called me', 'police notice', 'section 35 notice', '41a notice', 'summons', 'warrant', 'chargesheet', 'quash fir'],
    intro: 'Stay calm. Don\'t go to the police without advice if you can avoid it. Bring every paper to an advocate.',
    juris: 'Under BNSS, for offences punishable up to 7 years police generally issue a notice to appear (Section 35) instead of arresting straight away. Anticipatory bail can be sought from the Sessions Court or High Court.',
    tips: ['If arrested, you must be told the grounds, allowed to inform a relative, and produced before a Magistrate within 24 hours.', 'You have a right to a lawyer and to free legal aid.', 'Do not destroy or edit any messages or documents — that can make things worse.'],
    questions: [
      { id: 'aa_stage', text: 'What has happened so far?', type: 'multi', chapter: 'Where it stands', why: 'Each stage needs a different response.',
        options: o([['heard', 'I heard a complaint may be filed'], ['fir', 'An FIR is registered against me'], ['notice', 'I got a police notice to appear'], ['summons', 'I got a court summons'], ['warrant', 'There is a warrant'], ['arrested', 'Someone has been arrested']]) },
      { id: 'aa_type', text: 'What is the case about?', chapter: 'The case', why: 'Offence type affects bail and process.',
        options: o([['matrimonial', 'Matrimonial / dowry'], ['money', 'Money / cheating / cheque'], ['assault', 'Fight / assault'], ['property', 'Property dispute'], ['cyber', 'Online / social media'], ['other', 'Other'], PN]) },
      { id: 'aa_copy', text: 'Do you have a copy of the FIR or complaint?', chapter: 'Papers', why: 'Everything depends on exactly what is alleged.', options: o([['yes', 'Yes'], ['no', 'No']]) },
      { id: 'aa_relation', text: 'Do you know the complainant?', chapter: 'The case', why: 'Prior disputes or relationships often explain a complaint.', options: o([['family', 'Family member'], ['business', 'Business / money dealings'], ['neighbour', 'Neighbour'], ['stranger', 'No']]) },
      { id: 'aa_prior', text: 'Have you ever been named in another case?', sensitive: true, deep: true, chapter: 'History', why: 'Courts consider this for bail. Your advocate needs to know.', options: o([['no', 'No'], ['yes', 'Yes'], PN]) },
      { id: 'aa_job', text: 'Is anything at stake if you are arrested — job, business, health, dependants?', deep: true, type: 'multi', chapter: 'Personal', why: 'Courts weigh personal circumstances for bail.', options: o([['job', 'Job'], ['business', 'Business'], ['health', 'Health condition'], ['dependants', 'Children / elderly parents'], ['none', 'None of these'], PN]) }
    ],
    evidence: [
      { id: 'aa_e_fir', name: 'FIR or complaint copy', fact: 'What is alleged', why: 'Your defence starts here.', where: 'State police website (many FIRs are online), police station, or through an advocate.', preserve: '', holder: 'others' },
      { id: 'aa_e_getfir', name: 'Get the FIR copy (online police portal or through an advocate)', fact: 'What is alleged', why: 'Needed before any application.', where: 'State police citizen portal.', preserve: '', action: true, when: W('aa_copy', 'no') },
      { id: 'aa_e_notice', name: 'Police notice, summons or warrant — with envelope and date received', fact: 'What you are required to do', why: 'Has dates you must not miss.', where: 'Your post.', preserve: '', time: 'Check the appearance date now.', when: W('aa_stage', 'notice', 'summons', 'warrant') },
      { id: 'aa_e_counter', name: 'Documents that answer the allegations (agreements, payments, messages, alibi proof)', fact: 'Your side of the story', why: 'Supports bail and defence.', where: 'Your records.', preserve: 'Do not delete or edit anything.' },
      { id: 'aa_e_history', name: 'Records of the earlier dispute with the complainant', fact: 'Motive / background', why: 'Shows context for the complaint.', where: 'Messages, earlier complaints, cases.', preserve: '', when: W('aa_relation', 'family', 'business', 'neighbour') },
      { id: 'aa_e_personal', name: 'ID, address proof, employment letter, medical records, dependants\' details', fact: 'Roots in society and personal situation', why: 'Courts consider these for bail.', where: 'Your records.', preserve: '' },
      { id: 'aa_e_surety', name: 'Names of two people who could stand surety, with their ID and property/ salary proof', fact: 'Ability to furnish bail', why: 'Bail often requires sureties.', where: '—', preserve: '', action: true },
      { id: 'aa_e_cases', name: 'Details of any other cases', fact: 'Criminal antecedents', why: 'Must be disclosed accurately in bail applications.', where: 'Your records.', preserve: '', when: W('aa_prior', 'yes') }
    ],
    urgent: [
      { id: 'aa_u_arrest', level: 'now', when: W('aa_stage', 'arrested', 'warrant'), title: 'Get a lawyer now', text: 'A person arrested must be produced before a Magistrate within 24 hours and has the right to a lawyer. Call legal aid on 15100 if you cannot afford one.', help: ['l15100', 'e112'] },
      { id: 'aa_u_fir', level: 'now', when: W('aa_stage', 'fir', 'notice', 'summons'), title: 'See an advocate before you appear', text: 'Get advice on anticipatory bail and how to respond to the notice before going to the police station or court.', help: ['l15100'] }
    ],
    lawyerQs: [{ text: 'Do I need anticipatory bail, and in which court?' }, { text: 'Can the FIR be quashed?', when: W('aa_stage', 'fir', 'notice') }, { text: 'What should I say — or not say — if I am called for questioning?' }]
  });

  /* ---------------- Legal notice received ---------------- */
  I.push({
    id: 'legal-notice-received', cat: 'police', title: 'I received a legal notice', short: 'Legal notice received',
    synonyms: ['legal notice', 'lawyer notice', 'notice received', 'reply to legal notice', 'demand notice', 'notice from advocate', 'defamation notice'],
    intro: 'A legal notice is not a court order. But it often comes before a case, and replying well matters.',
    juris: 'Most legal notices are demands before a civil or criminal case. Some (like cheque-bounce notices) start statutory clocks.',
    tips: ['Note the date you received the notice — not the date written on it.', 'Notices about cheques, tenancy and loans can have legal consequences if ignored.', 'A reply should usually be sent through an advocate, and should not admit facts carelessly.'],
    questions: [
      { id: 'ln_about', text: 'What is the notice about?', chapter: 'The notice', why: 'Different notices need different records and urgency.',
        options: o([['cheque', 'A bounced cheque'], ['money', 'Money owed / loan'], ['tenancy', 'Rent / vacating property'], ['work', 'Employment / contract'], ['family', 'Marriage / family'], ['defamation', 'Something I said or posted'], ['property', 'Property'], ['other', 'Other']]) },
      { id: 'ln_days', text: 'How many days does it give you?', chapter: 'The clock', why: 'Plan your response within the time given.', options: o([['d7', '7 days or less'], ['d15', '15 days'], ['d30', '30 days or more'], ['none', 'No time given']]) },
      { id: 'ln_received', text: 'When did you receive it?', chapter: 'The clock', why: 'Time usually runs from receipt.', options: o([['d3', 'In the last 3 days'], ['d10', '4–10 days ago'], ['older', 'More than 10 days ago']]) },
      { id: 'ln_agree', text: 'Do you agree with what it claims?', chapter: 'Your position', why: 'Decides whether to settle, partly accept, or deny.', options: o([['yes', 'Mostly yes'], ['part', 'Partly'], ['no', 'No'], NS]) }
    ],
    evidence: [
      { id: 'ln_e_notice', name: 'The notice and its envelope (keep the postal stamp)', fact: 'What is demanded and when it arrived', why: 'The date of receipt matters.', where: 'Your post.', preserve: 'Write the date of receipt on a separate note.' },
      { id: 'ln_e_docs', name: 'All documents about the underlying deal or relationship', fact: 'Your side of the facts', why: 'Needed to reply accurately.', where: 'Agreements, bills, messages.', preserve: '' },
      { id: 'ln_e_payments', name: 'Payment records', fact: 'What was paid', why: 'Answers money claims.', where: 'Bank statements.', preserve: '', when: W('ln_about', 'cheque', 'money', 'tenancy') },
      { id: 'ln_e_post', name: 'The post or statement complained about, with context', fact: 'What was actually said', why: 'Defamation depends on exact words and context.', where: 'Screenshots, archive.', preserve: 'Do not delete before getting advice.', when: W('ln_about', 'defamation') },
      { id: 'ln_e_timeline', name: 'A short timeline of the dispute', fact: 'Sequence of events', why: 'Helps draft a precise reply.', where: 'Use "My timeline".', preserve: '', action: true }
    ],
    urgent: [
      { id: 'ln_u_cheque', level: 'now', when: W('ln_about', 'cheque'), title: 'Cheque notices start a 15-day clock', text: 'Paying within 15 days of receipt usually prevents a criminal complaint. See an advocate now if you dispute the debt.', help: ['l15100'] },
      { id: 'ln_u_short', level: 'soon', when: ALL(W('ln_days', 'd7', 'd15'), W('ln_received', 'd10', 'older')), title: 'Your reply time is running out', text: 'Speak to an advocate this week.', help: ['l15100'] }
    ],
    lawyerQs: [{ text: 'Should I reply, and what should the reply say?' }, { text: 'What happens if I don\'t reply?' }, { text: 'Is settlement worth exploring?', when: W('ln_agree', 'yes', 'part') }]
  });

  /* ---------------- Road accident claim ---------------- */
  I.push({
    id: 'road-accident', cat: 'accidents', title: 'Road accident — injury, death or vehicle damage claim', short: 'Road accident claim',
    synonyms: ['accident', 'road accident', 'hit and run', 'motor accident claim', 'mact', 'accident compensation', 'accident death compensation', 'injured in accident', 'vehicle hit me', 'third party claim'],
    intro: 'Accident claims are decided on the police record, the medical record and the proof of income. We\'ll collect all three.',
    juris: 'Compensation claims go to the Motor Accident Claims Tribunal (MACT). Section 166(3) of the Motor Vehicles Act says a claim must be filed within 6 months of the accident. Its validity is being challenged in the Supreme Court: by interim order of 4 Nov 2025 (ICICI Lombard v. Ayiti Navaneetha), tribunals must not dismiss claims as time-barred under it while the case is pending, and by order of 16 Dec 2025 they may hear late claims but not finalise the judgment until the Supreme Court decides. So file within 6 months if you can; if that time has passed, still file.',
    tips: ['You can file the claim where the accident happened, where you live or work, or where the other side lives.', 'Hit-and-run victims can claim fixed compensation from a government fund (₹2 lakh for death, ₹50,000 for grievous injury).', 'Police must send an accident report to the tribunal, but your own documents still matter.'],
    questions: [
      { id: 'ra_harm', text: 'What happened?', chapter: 'The accident', why: 'Death, injury and vehicle damage claims are calculated differently.',
        options: o([['injury', 'I (or someone) was injured'], ['death', 'Someone died'], ['vehicle', 'Only vehicle damage'], ['accused', 'I was driving and someone is claiming against me']]) },
      { id: 'ra_when', text: 'When was the accident?', chapter: 'The accident', why: 'File as early as possible.', options: o([['week', 'Within a week'], ['m6', 'Within 6 months'], ['older', 'More than 6 months ago']]) },
      { id: 'ra_vehicle', text: 'Is the other vehicle known?', chapter: 'The accident', why: 'Hit-and-run cases use a separate compensation scheme.', options: o([['known', 'Yes, I have the number'], ['hitrun', 'No, hit and run'], NS]) },
      { id: 'ra_fir', text: 'Was a police FIR registered?', chapter: 'Police', why: 'The FIR and police accident report are key evidence.', options: o([['yes', 'Yes'], ['no', 'No'], NS]) },
      { id: 'ra_earning', text: 'Was the injured or deceased person earning?', chapter: 'Loss', when: W('ra_harm', 'injury', 'death'), why: 'Income is the basis for loss-of-earning compensation.',
        options: o([['salaried', 'Salaried'], ['self', 'Self-employed / business'], ['daily', 'Daily wage'], ['none', 'Not earning (student, homemaker, retired)']]) },
      { id: 'ra_disability', text: 'Has any permanent disability been assessed?', deep: true, chapter: 'Loss', when: W('ra_harm', 'injury'), why: 'A disability certificate significantly affects compensation.',
        options: o([['yes', 'Yes'], ['no', 'No'], ['pending', 'Treatment still going on']]) },
      { id: 'ra_insurance', text: 'Do you have your own vehicle/health insurance that may also pay?', deep: true, chapter: 'Insurance', why: 'Own-damage and health claims run alongside MACT.', options: o([['motor', 'Vehicle insurance'], ['health', 'Health insurance'], ['both', 'Both'], ['no', 'No']]) }
    ],
    evidence: [
      { id: 'ra_e_fir', name: 'FIR copy and the police accident report (DAR)', fact: 'How the accident happened', why: 'Primary evidence of negligence and vehicles involved.', where: 'Police station / online portal.', preserve: '', holder: 'others' },
      { id: 'ra_e_registerfir', name: 'Get an FIR registered and note the number', fact: 'Accident reported', why: 'Claims rely heavily on police records.', where: 'Police station where the accident happened.', preserve: '', action: true, when: W('ra_fir', 'no', 'unsure') },
      { id: 'ra_e_vehicle', name: 'Other vehicle\'s number, photos, driver details and insurance', fact: 'Who is liable', why: 'The insurer is made a party.', where: 'Spot photos, police seizure memo, Parivahan.', preserve: '', when: W('ra_vehicle', 'known') },
      { id: 'ra_e_medical', name: 'Hospital records: MLC, discharge summaries, bills, prescriptions', fact: 'Injuries and treatment cost', why: 'Basis of medical compensation.', where: 'Hospital (ask for certified copies).', preserve: 'Keep every bill and pharmacy receipt.', when: W('ra_harm', 'injury', 'death') },
      { id: 'ra_e_disability', name: 'Disability certificate from a medical board', fact: 'Permanent disability', why: 'Major factor in compensation.', where: 'Government medical board.', preserve: '', when: W('ra_disability', 'yes', 'pending') },
      { id: 'ra_e_income', name: 'Income proof: salary slips, ITR, business records, employer letter', fact: 'Earnings lost', why: 'Basis of loss-of-income/dependency.', where: 'Employer, CA, bank.', preserve: '', when: W('ra_earning', 'salaried', 'self', 'daily') },
      { id: 'ra_e_age', name: 'Age proof of the injured/deceased (school certificate, Aadhaar, PAN)', fact: 'Age', why: 'Age affects the multiplier used for compensation.', where: 'Your records.', preserve: '', when: W('ra_harm', 'injury', 'death') },
      { id: 'ra_e_death', name: 'Death certificate, post-mortem report, legal heirs\' details', fact: 'Death and dependants', why: 'Needed for a death claim.', where: 'Registrar, hospital, police.', preserve: '', when: W('ra_harm', 'death') },
      { id: 'ra_e_spot', name: 'Spot photos/videos, CCTV request, witness names', fact: 'How the accident happened', why: 'Supports the claim on negligence.', where: 'Phone, nearby shops.', preserve: 'Ask nearby shops to keep CCTV — it gets overwritten.' },
      { id: 'ra_e_repair', name: 'Vehicle repair estimate, bills, surveyor report', fact: 'Vehicle damage', why: 'Basis of damage claim.', where: 'Garage, insurer.', preserve: '', when: W('ra_harm', 'vehicle') },
      { id: 'ra_e_ownpolicy', name: 'Your own insurance policies and claim papers', fact: 'Other cover', why: 'Coordinate claims.', where: 'Insurer.', preserve: '', when: W('ra_insurance', 'motor', 'health', 'both') },
      { id: 'ra_e_dl', name: 'Your driving licence, RC, insurance and PUC (if you were driving)', fact: 'Your documents were valid', why: 'Insurers check these to avoid liability.', where: 'Your records; Parivahan.', preserve: '', when: W('ra_harm', 'accused', 'vehicle') }
    ],
    urgent: [
      { id: 'ra_u_treat', level: 'soon', when: ALL(W('ra_when', 'week'), W('ra_harm', 'injury')), title: 'Treatment first', text: 'Get treatment first. Ask the hospital for a medico-legal (MLC) record and keep every bill.', help: ['e112'] }
    ],
    lawyerQs: [{ text: 'Where should the MACT claim be filed and how is compensation calculated?' }, { text: 'Can I claim from the hit-and-run fund?', when: W('ra_vehicle', 'hitrun') }, { text: 'Is my claim affected by delay?', when: W('ra_when', 'older') }, { text: 'Will my insurer defend me?', when: W('ra_harm', 'accused') }]
  });

  /* ---------------- Online harassment ---------------- */
  I.push({
    id: 'online-harassment', cat: 'other', sensitive: true, title: 'Online harassment, stalking, fake profiles or leaked images', short: 'Online harassment',
    synonyms: ['online harassment', 'cyber stalking', 'fake profile', 'morphed photo', 'leaked photos', 'sextortion', 'blackmail', 'trolling', 'impersonation', 'revenge porn', 'abusive messages'],
    intro: 'You can stop at any time. First we\'ll make sure the evidence is saved, then get the content taken down.',
    juris: 'Online harassment can be an offence under the Bharatiya Nyaya Sanhita and the IT Act. Platforms must act on complaints, and must remove intimate or morphed images within 24 hours of a complaint.',
    tips: ['Save evidence before blocking or reporting — once deleted, it is hard to recover.', 'Never pay a blackmailer. Payment usually leads to more demands.', 'Women and children can report anonymously at cybercrime.gov.in.'],
    questions: [
      { id: 'oh_safe', text: 'Are you safe right now?', sensitive: true, chapter: 'Safety', why: 'Safety first.', options: o([['safe', 'Yes'], ['threat', 'I have been threatened'], ['danger', 'I am in danger'], PN]) },
      { id: 'oh_what', text: 'What is happening?', type: 'multi', chapter: 'What is happening', sensitive: true, why: 'Each problem has a different fix.',
        options: o([['messages', 'Abusive or threatening messages'], ['fake', 'Fake profile / impersonation'], ['images', 'Private or morphed images shared or threatened'], ['blackmail', 'Blackmail / money demanded'], ['stalking', 'Being followed or monitored online'], PN]) },
      { id: 'oh_known', text: 'Do you know who it is?', chapter: 'What is happening', why: 'Known persons may also be covered by other laws (e.g. domestic violence).', options: o([['yes', 'Yes'], ['suspect', 'I suspect someone'], ['no', 'No']]) },
      { id: 'oh_platform', text: 'Where is it happening?', type: 'multi', chapter: 'Where', why: 'Each platform has its own reporting and grievance officer.', options: o([['whatsapp', 'WhatsApp / SMS / calls'], ['instagram', 'Instagram / Facebook'], ['x', 'X / YouTube'], ['dating', 'Dating app'], ['other', 'Other site']]) },
      { id: 'oh_reported', text: 'Have you reported it?', type: 'multi', deep: true, chapter: 'Reports', why: 'Reference numbers are needed for follow-up.', options: o([['platform', 'To the platform'], ['cyber', 'cybercrime.gov.in / 1930'], ['police', 'Police'], ['none', 'Not yet']]) }
    ],
    evidence: [
      { id: 'oh_e_screens', name: 'Screenshots showing the content, profile name/URL, date and time', fact: 'The harassing content', why: 'Evidence before it is deleted.', where: 'Your phone/computer.', preserve: 'Capture the URL and the profile page. Keep the originals; do not edit.' },
      { id: 'oh_e_links', name: 'List of links (URLs), usernames and phone numbers involved', fact: 'Who and where', why: 'Platforms and police need exact links.', where: 'Copy from the app or browser.', preserve: '', action: true },
      { id: 'oh_e_export', name: 'Full chat export and call log', fact: 'The pattern of messages', why: 'Shows frequency and threats.', where: 'WhatsApp/Telegram export.', preserve: '', when: W('oh_what', 'messages', 'blackmail', 'stalking') },
      { id: 'oh_e_payment', name: 'Payment demands and any payments already made', fact: 'Extortion', why: 'Supports extortion charges.', where: 'Messages, bank statements.', preserve: 'Do not pay further.', when: W('oh_what', 'blackmail') },
      { id: 'oh_e_report', name: 'Platform report confirmations and cybercrime complaint number', fact: 'Complaints made', why: 'Needed to escalate.', where: 'Email confirmations, portal.', preserve: '', when: W('oh_reported', 'platform', 'cyber', 'police') },
      { id: 'oh_e_reportnow', name: 'Report the content to the platform and at cybercrime.gov.in', fact: 'Takedown requested', why: 'Starts the takedown clock.', where: 'Platform report button / grievance officer; cybercrime.gov.in.', preserve: 'Screenshot before reporting.', action: true, when: W('oh_reported', 'none') },
      { id: 'oh_e_identity', name: 'Proof of your identity and your genuine profile', fact: 'The fake is not you', why: 'Needed for impersonation takedowns.', where: 'Your ID, your account.', preserve: '', when: W('oh_what', 'fake') }
    ],
    urgent: [
      { id: 'oh_u_danger', level: 'now', when: W('oh_safe', 'danger'), title: 'Please get help now', text: 'If you are in danger, call 112.', help: ['e112', 'w181'] },
      { id: 'oh_u_images', level: 'now', when: W('oh_what', 'images', 'blackmail'), title: 'Act now to stop the images spreading', text: 'Report at cybercrime.gov.in or 1930 and to the platform. Platforms must remove intimate images within 24 hours of a complaint. Don\'t pay.', help: ['cy1930', 'w181'] }
    ],
    lawyerQs: [{ text: 'Which offences apply, and should I file an FIR?' }, { text: 'How do I get the content removed if the platform doesn\'t act?' }, { text: 'Can I get an order against a known person?', when: W('oh_known', 'yes', 'suspect') }]
  });
})(globalThis);
