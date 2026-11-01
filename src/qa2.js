/* Quick "know your rights" answers, batch 2 (Nov 2026). Settled points only, each with the exact law.
   BNSS sections checked 1 Nov 2026 (ss.35, 38, 43, 47, 48, 53, 58, 173, 175, 193, 479, 482). Draft, not advocate-reviewed. */
(function (root) {
  const KB = root.ER_KB;
  const Q = (cat, id, q, a, depends, law, journey, kw = []) => KB.questions.push({ cat, id, q, a, depends, law, journey, kw });

  /* ---------- Police, arrest, FIR ---------- */
  Q('police', 'woman-arrest-night', 'Can the police arrest a woman at night?',
    "As a rule, no. A woman cannot be arrested after sunset and before sunrise except in exceptional circumstances, and then a woman police officer must first get the written permission of a Judicial Magistrate First Class. Arrest of a woman should be made by a woman officer.",
    ['Whether there were truly exceptional circumstances', 'Whether a woman officer and the Magistrate’s permission were involved'], 'BNSS s.43(5)', 'police-stop', ['woman arrested at night', 'arrest after sunset', 'lady arrest night']);
  Q('police', 'grounds-of-arrest', 'Do the police have to tell me why I am being arrested?',
    "Yes. The officer must tell you the grounds of arrest straight away, and for a bailable offence must tell you that you can be released on bail. The Supreme Court has said grounds must be clearly communicated; failure can make the arrest and remand open to challenge.",
    ['Whether the offence is bailable', 'Whether the grounds were given in a language you understand'], 'BNSS s.47; Constitution Art. 22(1)', 'police-stop', ['why arrested', 'grounds of arrest', 'reason for arrest']);
  Q('police', 'inform-family-arrest', 'Can my family be told that I have been arrested?',
    "Yes. The police must immediately inform a relative, friend or person you name about the arrest and where you are being held, and record that they did so.",
    ['Whom you nominate', 'Which police station holds you'], 'BNSS s.48', 'accused-arrest', ['inform family arrest', 'call family police station']);
  Q('police', 'produce-24-hours', 'How long can police keep me without taking me to a Magistrate?',
    "Not more than 24 hours, leaving out travel time to the court. Keeping someone longer without producing them before a Magistrate is illegal.",
    ['Exact time of arrest', 'Distance to the nearest Magistrate'], 'BNSS s.58; Constitution Art. 22(2)', 'accused-arrest', ['24 hours magistrate', 'kept in lockup', 'detention time']);
  Q('police', 'lawyer-interrogation', 'Can I have a lawyer while police question me?',
    "You can meet an advocate of your choice during interrogation, though not necessarily for the whole of it. You also cannot be forced to be a witness against yourself.",
    ['Stage of the investigation'], 'BNSS s.38; Constitution Art. 20(3) and 22(1)', 'accused-arrest', ['lawyer during questioning', 'right to lawyer police']);
  Q('police', 'notice-not-arrest', 'If an FIR is filed against me, will I be arrested straight away?',
    "Not necessarily. For offences punishable with up to seven years, police are generally expected to send a notice asking you to appear instead of arresting you. If you comply with the notice, arrest needs recorded reasons.",
    ['The punishment for the offence', 'Whether you comply with the notice'], 'BNSS s.35(3)–(6); Arnesh Kumar v. State of Bihar', 'accused-arrest', ['41a notice', '35 notice', 'fir arrest immediately']);
  Q('police', 'elderly-arrest', 'Can police arrest someone over 60 for a minor offence?',
    "For an offence punishable with less than three years, a person who is infirm or above 60 cannot be arrested without the prior permission of an officer not below the rank of Deputy Superintendent of Police.",
    ['The punishment for the offence', 'Age or health of the person'], 'BNSS s.35(7)', 'accused-arrest', ['senior citizen arrest', 'old person arrest']);
  Q('police', 'zero-fir', 'Can I file an FIR at any police station?',
    "Yes. For a serious (cognisable) offence, any police station must register your information even if the crime happened elsewhere — a 'Zero FIR' — and transfer it to the right station.",
    ['Whether the offence is cognisable'], 'BNSS s.173(1)', 'police-complaint', ['zero fir', 'fir any police station', 'jurisdiction fir']);
  Q('police', 'e-fir', 'Can I file an FIR online?',
    "Yes, information can be given electronically through your state police portal. You must sign it within three days for it to be taken on record as an FIR.",
    ['Your state police portal', 'Signing within three days'], 'BNSS s.173(1)(ii)', 'police-complaint', ['online fir', 'e fir', 'fir by email']);
  Q('police', 'fir-copy-free', 'Do I get a copy of my FIR?',
    "Yes, free of cost. Ask for it when the FIR is registered.",
    [], 'BNSS s.173(2)', 'police-complaint', ['fir copy', 'copy of fir']);
  Q('police', 'police-refuse-fir', 'What can I do if the police refuse to register my FIR?',
    "Send the complaint in writing to the Superintendent of Police. If that fails, you can apply to the Magistrate to direct the police to register and investigate. Keep copies and postal receipts.",
    ['Whether the offence is cognisable', 'Proof that you approached the police'], 'BNSS ss.173(4), 175(3); Lalita Kumari v. Govt of UP', 'police-complaint', ['fir not registered', 'police refused fir', 'sp complaint']);
  Q('police', 'preliminary-enquiry', 'Why did police say they will first do an enquiry before an FIR?',
    "For offences punishable with three to seven years, police may, with a DSP-level officer’s permission, do a preliminary enquiry for up to 14 days to see if there is a case before registering an FIR.",
    ['The punishment for the offence'], 'BNSS s.173(3)', 'police-complaint', ['preliminary enquiry', 'enquiry before fir']);
  Q('police', 'fir-progress', 'Will police tell me what is happening in my case?',
    "Yes. Police must inform the victim of the progress of the investigation within 90 days of the FIR.",
    [], 'BNSS s.193(3)(ii)', 'police-complaint', ['case progress', 'investigation status']);
  Q('police', 'undertrial-release', 'Can an undertrial be released after spending a long time in jail?',
    "Yes. An undertrial who has spent half the maximum sentence for the offence must be released on bond; a first-time offender, after one-third. This does not apply to offences punishable with death or life imprisonment.",
    ['Maximum sentence for the offence', 'Whether it is a first offence'], 'BNSS s.479', 'accused-arrest', ['undertrial', 'long time in jail', 'bail after half sentence']);
  Q('police', 'medical-after-arrest', 'Is an arrested person medically examined?',
    "Yes. The arrested person must be examined by a medical officer soon after arrest, and the report is recorded. Ask for it, especially if there are injuries.",
    [], 'BNSS s.53', 'police-stop', ['medical after arrest', 'injury in custody']);
  Q('police', 'ncr-vs-fir', 'What is the difference between an NCR and an FIR?',
    "An FIR is for a serious (cognisable) offence and police must investigate. An NCR is recorded for a minor (non-cognisable) offence; police need the Magistrate’s permission to investigate it.",
    ['Which offence it is'], 'BNSS ss.173, 174', 'police-complaint', ['ncr', 'non cognisable', 'ncr vs fir']);
  Q('police', 'legal-notice-needed', 'Do I have to send a legal notice before filing a case?',
    "Usually not, but sometimes it is required: before a cheque-bounce complaint, and two months before suing the government. In other cases a notice is optional but often useful.",
    ['Type of case', 'Who the other side is'], 'NI Act s.138; Code of Civil Procedure s.80', 'legal-notice-received', ['legal notice mandatory', 'notice before case']);

  /* ---------- Banks, cards, loans, credit ---------- */
  Q('money', 'unauthorised-txn-liability', 'Money left my account without my doing anything — will the bank refund it?',
    "Until 31 December 2026: if a third party caused it and you tell your bank within three working days, your liability is zero. From 1 January 2027, under RBI\u2019s new directions, the window becomes five calendar days, the rules also cover payments you were tricked into making, banks must decide within 45 days, and small frauds can get a one-time compensation — but only if you report to both your bank and 1930 / cybercrime.gov.in within five days.",
    ['How quickly you reported it, and to whom', 'Whether you shared an OTP or PIN', 'The date of the transaction'], 'RBI directions on limiting customer liability (2017; amended 24 June 2026, effective 1 January 2027)', 'upi-cyber-fraud', ['zero liability', 'unauthorised transaction refund', 'bank fraud refund', '5 days report fraud']);
  Q('money', 'atm-failed-tat', 'ATM did not give cash but debited my account — how fast must the bank fix it?',
    "The bank must reverse it within five days of the transaction; after that it must pay you ₹100 a day automatically.",
    ['Date of the failed withdrawal'], 'RBI Turn Around Time framework for failed transactions (2019)', 'failed-payment-debited', ['atm failed', 'atm compensation 100']);
  Q('money', 'rbi-ombudsman', 'My bank is not solving my complaint — where do I go?',
    "Complain to the bank first. If it does not reply in 30 days or you are unhappy with the reply, complain free of charge to the RBI Ombudsman at cms.rbi.org.in. No lawyer is needed.",
    ['Date of your complaint to the bank', 'Whether the matter is already in court'], 'Reserve Bank – Integrated Ombudsman Scheme', 'bank-service', ['rbi ombudsman', 'bank complaint rbi', 'cms rbi']);
  Q('money', 'loan-documents-30-days', 'I closed my loan — when must the bank return my property papers?',
    "Within 30 days of full repayment. If it delays without a reason it caused by you, it must pay ₹5,000 for each day of delay.",
    ['Date of loan closure'], 'RBI circular on release of movable/immovable property documents (2023)', 'loan-recovery', ['property papers after loan', 'loan noc delay', 'documents not returned']);
  Q('money', 'card-closure-7-days', 'How fast must a credit card be closed after I ask?',
    "Within seven working days, if there are no dues. After that the card issuer must pay ₹500 a day until it is closed.",
    ['Whether any dues are pending'], 'RBI Master Direction on credit and debit cards (2022)', 'credit-card-dispute', ['close credit card', 'card closure penalty']);
  Q('money', 'credit-report-30-days', 'How long does a credit bureau get to fix an error?',
    "The lender and bureau together must resolve it within 30 days. If they do not, they must pay you ₹100 for each day of delay.",
    ['Date you raised the dispute'], 'RBI directions on credit information companies (2023)', 'credit-report-error', ['cibil correction time', 'credit report compensation']);
  Q('money', 'free-credit-report', 'Can I get my credit report free?',
    "Yes. Each credit bureau must give you one full credit report free every year.",
    [], 'RBI directions on credit information companies', 'credit-report-error', ['free cibil report', 'credit score free']);
  Q('money', 'locker-liability', 'If valuables are stolen from my bank locker, will the bank pay?',
    "If the loss is due to theft, fire, burglary, building collapse or fraud by staff, the bank’s liability can be up to 100 times the annual locker rent. It is not liable for natural disasters beyond its control.",
    ['How the loss happened', 'Annual locker rent'], 'RBI revised instructions on safe deposit lockers (2021)', 'bank-service', ['locker theft', 'locker liability']);
  Q('money', 'negative-balance-charges', 'Can minimum-balance charges make my account go negative?',
    "No. Charges for not keeping the minimum balance must be in proportion to the shortfall and must not turn your balance negative.",
    [], 'RBI circular on penal charges for non-maintenance of minimum balance (2014)', 'bank-service', ['negative balance', 'minimum balance charges']);
  Q('money', 'basic-savings-account', 'Is there a bank account with no minimum balance?',
    "Yes. Every bank must offer a Basic Savings Bank Deposit Account with no minimum balance and basic free services.",
    [], 'RBI instructions on Basic Savings Bank Deposit Account', 'bank-service', ['zero balance account', 'bsbda']);
  Q('money', 'prepayment-penalty', 'Can a bank charge me for paying off a home loan early?',
    "Not for a floating-rate loan taken by an individual for non-business purposes. Fixed-rate and business loans can have charges as per your loan agreement.",
    ['Floating or fixed rate', 'Personal or business loan'], 'RBI instructions on foreclosure charges', 'loan-recovery', ['foreclosure charges', 'prepayment penalty']);
  Q('money', 'cheque-validity', 'How long is a cheque valid?',
    "Three months from the date written on it. For a cheque bounce case, it must be presented within that time.",
    [], 'RBI directions; NI Act s.138', 'cheque-bounce', ['cheque validity', 'old cheque']);
  Q('money', 'loan-app-legal', 'How do I know if a loan app is legal?',
    "A legal app must be linked to an RBI-regulated bank or NBFC, show a Key Fact Statement with all charges before the loan, and must not take your contacts or photos. RBI publishes a directory of digital lending apps.",
    [], 'RBI Digital Lending Directions, 2025', 'loan-app-harassment', ['legal loan app', 'rbi loan app list']);
  Q('money', 'wrong-upi', 'I sent money to the wrong UPI ID — will I get it back?',
    "There is no automatic reversal. Complain to your bank and in the UPI app straight away; the bank will contact the receiver’s bank, but the receiver must agree. If they refuse, a police complaint or civil case may be needed.",
    ['Whether the receiver agrees to return it'], 'NPCI UPI dispute procedure', 'failed-payment-debited', ['wrong upi', 'sent to wrong account']);

  /* ---------- Consumer ---------- */
  Q('shopping', 'consumer-fee', 'Does it cost money to file a consumer complaint?',
    "Not for claims up to ₹5 lakh — there is no fee. Above that a small fee applies. You can file yourself, without a lawyer, on e-Jagriti.",
    ['Value of your claim'], 'Consumer Protection (Consumer Commission Procedure) Regulations, 2020', 'refund-refused', ['consumer court fee', 'e jagriti fee']);
  Q('shopping', 'consumer-which-forum', 'Which consumer commission do I go to?',
    "District Commission for claims up to ₹50 lakh, State Commission for ₹50 lakh to ₹2 crore, and National Commission above ₹2 crore. You can file where you live or work.",
    ['Value of goods or services paid for'], 'Consumer Protection Act 2019 ss.34, 47, 58; pecuniary jurisdiction notification (2021)', 'refund-refused', ['district consumer forum', 'consumer court limit']);
  Q('shopping', 'consumer-time-limit', 'Is there a time limit for a consumer complaint?',
    "Yes — generally two years from when the problem arose. A late complaint can be admitted only if you show a good reason for the delay.",
    ['When the problem arose'], 'Consumer Protection Act 2019 s.69', 'refund-refused', ['consumer complaint time limit', 'limitation consumer']);
  Q('shopping', 'service-charge', 'Do I have to pay the service charge in a restaurant?',
    "No. A restaurant cannot add a service charge by default or make it compulsory; a tip is your choice. You can ask for it to be removed and complain to the National Consumer Helpline (1915).",
    [], 'CCPA guidelines on service charge (2022); Delhi High Court (2025)', 'refund-refused', ['service charge', 'restaurant service charge']);
  Q('shopping', 'above-mrp', 'Can a shop charge more than the MRP?',
    "No. Selling a packaged product above its MRP is not allowed. Complain to your state Legal Metrology department or the National Consumer Helpline.",
    [], 'Legal Metrology (Packaged Commodities) Rules, 2011', 'refund-refused', ['above mrp', 'mrp overcharge']);
  Q('shopping', 'ecommerce-grievance', 'How fast must an online shopping site handle my complaint?',
    "E-commerce sites must have a grievance officer who acknowledges your complaint within 48 hours and resolves it within one month. Seller details and return policy must be shown.",
    [], 'Consumer Protection (E-Commerce) Rules, 2020', 'ecommerce-order', ['ecommerce complaint time', 'grievance officer']);
  Q('shopping', 'no-exchange-board', 'Is a "No exchange, no refund" board legal?',
    "It does not take away your rights. If a product is defective or not as described, you can still claim repair, replacement or refund.",
    ['Whether the product was defective'], 'Consumer Protection Act 2019 (unfair trade practice)', 'refund-refused', ['no refund board', 'no exchange policy']);
  Q('shopping', 'health-cashless-time', 'How fast must a health insurer approve cashless treatment?',
    "Insurers must decide a cashless request within one hour and give final approval at discharge within three hours.",
    [], 'IRDAI Master Circular on health insurance (2024)', 'insurance-claim', ['cashless approval time', 'discharge approval']);
  Q('shopping', 'ped-waiting', 'How long can a health policy make me wait for a pre-existing disease?',
    "At most three years of continuous cover. After 60 months of continuous cover, the insurer cannot reject a claim for non-disclosure except for proven fraud.",
    ['Date your cover started', 'Continuous renewal'], 'IRDAI health insurance regulations and master circular (2024)', 'insurance-claim', ['pre existing disease waiting', 'moratorium period']);
  Q('shopping', 'free-look', 'Can I return an insurance policy I just bought?',
    "Yes, within the free-look period — 30 days for most life and health policies. You get the premium back minus small deductions.",
    ['Date you received the policy'], 'IRDAI regulations on protection of policyholders (2024)', 'insurance-claim', ['free look period', 'cancel new policy']);
  Q('shopping', 'insurance-ombudsman', 'Insurer rejected my claim — is there a free complaint forum?',
    "Yes. Complain to the insurer first; then go to the Insurance Ombudsman within a year of the insurer’s reply, for claims up to ₹50 lakh. It is free and needs no lawyer.",
    ['Value of the claim', 'Date of the insurer’s final reply'], 'Insurance Ombudsman Rules, 2017 (amended 2023)', 'insurance-claim', ['insurance ombudsman', 'claim rejected complaint']);

  /* ---------- Family ---------- */
  Q('family', 'marriage-age', 'What is the legal age to marry?',
    "21 for men and 18 for women. A child marriage can be stopped by the Child Marriage Prohibition Officer or the police; call 1098 or 112.",
    [], 'Prohibition of Child Marriage Act 2006; Hindu Marriage Act s.5; Special Marriage Act s.4', 'court-marriage', ['marriage age', 'legal age marriage']);
  Q('family', 'sma-notice', 'How does a court marriage under the Special Marriage Act work?',
    "You give notice to the Marriage Officer of the district where one of you has lived for 30 days. After a 30-day objection period, the marriage is solemnised before the officer with three witnesses.",
    ['Residence of either partner', 'Any objections'], 'Special Marriage Act 1954 ss.5–13', 'court-marriage', ['court marriage process', 'special marriage act notice']);
  Q('family', 'muslim-wife-maintenance', 'Can a Muslim wife claim maintenance under the general law?',
    "Yes. The Supreme Court held in 2024 that a divorced Muslim woman can also claim maintenance under the general criminal-procedure provision, in addition to her rights under the 1986 Act.",
    ['Her income and the husband’s means'], 'BNSS s.144; Mohd. Abdul Samad v. State of Telangana (2024)', 'maintenance', ['muslim maintenance', '125 muslim woman']);
  Q('family', 'triple-talaq', 'Is instant triple talaq valid?',
    "No. Instant triple talaq (talaq-e-biddat) is void and illegal, and pronouncing it is an offence. The wife can claim subsistence allowance and custody of minor children.",
    [], 'Muslim Women (Protection of Rights on Marriage) Act, 2019', 'divorce-separation', ['triple talaq', 'instant talaq']);
  Q('family', 'live-in-dv', 'Is a woman in a live-in relationship protected from domestic violence?',
    "Yes, if the relationship is 'in the nature of marriage' — living together in a shared household for a reasonable time. She can seek protection, residence and money orders.",
    ['Length and nature of the relationship'], 'Protection of Women from Domestic Violence Act 2005 s.2(f); D. Velusamy v. D. Patchaiammal (2010)', 'live-in', ['live in domestic violence', 'live in rights woman']);
  Q('family', 'residence-right', 'Can my in-laws throw me out of the house?',
    "A wife has a right to live in the shared household, even if it belongs to the in-laws, and can ask the Magistrate for a residence order. Courts balance this against senior in-laws’ rights in some cases.",
    ['Who owns the house', 'Whether you lived there as a family'], 'DV Act s.17, s.19; Satish Chander Ahuja v. Sneha Ahuja (2020)', 'domestic-violence', ['thrown out in laws', 'right to residence']);
  Q('family', 'senior-maintenance-amount', 'How much maintenance can elderly parents get from children?',
    "The Maintenance Tribunal can order up to ₹10,000 a month. It should decide within 90 days. Parents and senior citizens can apply without a lawyer.",
    ['Children’s income', 'Parents’ needs'], 'Maintenance and Welfare of Parents and Senior Citizens Act 2007 ss.5, 9', 'parents-maintenance', ['senior citizen maintenance amount', 'parents maintenance tribunal']);
  Q('family', 'gift-cancel-senior', 'Can parents take back property they gifted to a child who neglects them?',
    "Yes, if the gift was made on the condition that the child would look after them and the child fails to. The Tribunal can declare the transfer void.",
    ['Whether care was a condition of the gift', 'Evidence of neglect'], 'Senior Citizens Act s.23; Sudesh Chhikara v. Ramti Devi (2022)', 'parents-maintenance', ['cancel gift deed parents', 'son neglect property back']);
  Q('family', 'adoption-age-gap', 'Who can adopt a child in India?',
    "Married couples, single women and single men can adopt through CARA. A single man cannot adopt a girl child. There must be at least 25 years between the child and the adoptive parent.",
    ['Marital status', 'Age of parents and child'], 'Adoption Regulations 2022; Juvenile Justice Act 2015', 'adoption-guardianship', ['who can adopt', 'adoption eligibility']);
  Q('family', 'void-marriage-children', 'Do children from a void marriage inherit?',
    "Yes, they are treated as legitimate and inherit their parents’ property, but not a share in ancestral coparcenary property of others (under Hindu law).",
    [], 'Hindu Marriage Act s.16; Revanasiddappa v. Mallikarjun (2023)', 'inheritance-partition', ['second wife children property', 'void marriage children']);

  /* ---------- Home, property, tenancy ---------- */
  Q('home', 'agreement-to-sell-title', 'Does an agreement to sell make me the owner?',
    "No. Only a registered sale deed transfers ownership. An agreement to sell, GPA or will does not, though the agreement can be enforced in court.",
    [], 'Transfer of Property Act s.54; Suraj Lamp v. State of Haryana (2011)', 'property-purchase', ['agreement to sell ownership', 'gpa sale valid']);
  Q('home', 'lease-registration', 'Does a rent agreement have to be registered?',
    "A lease for more than one year must be registered. Shorter agreements need not be, which is why many are made for 11 months. Some states also require online registration for all tenancies.",
    ['Length of the lease', 'Your state’s rules'], 'Registration Act 1908 s.17; Transfer of Property Act s.107', 'eviction-tenancy', ['register rent agreement', 'lease registration']);
  Q('home', 'mutation-not-title', 'If my name is in the land record, am I the owner?',
    "Not by itself. Mutation is an entry for revenue (tax) purposes. Ownership comes from the title deed, will, inheritance or court decree.",
    [], 'Settled position — e.g. Jitendra Singh v. State of MP (2021)', 'land-records', ['mutation ownership', 'land record title']);
  Q('home', 'rera-registration', 'Must a builder register the project under RERA?',
    "Yes, for projects larger than 500 square metres or with more than 8 flats. You can check the project on your state RERA website before paying.",
    ['Project size'], 'RERA 2016 s.3', 'builder-delay', ['rera registration', 'project registered rera']);
  Q('home', 'rera-delay-interest', 'What can I get if the builder delays possession?',
    "You can withdraw and get your money back with interest, or stay and get interest for every month of delay until possession.",
    ['Agreed possession date', 'Whether you want to stay in the project'], 'RERA 2016 s.18', 'builder-delay', ['builder delay compensation', 'rera interest']);
  Q('home', 'rera-defects', 'How long is a builder responsible for defects?',
    "For structural defects or poor workmanship reported within five years of possession, the builder must fix them within 30 days at no cost, or pay compensation.",
    ['Date of possession'], 'RERA 2016 s.14(3)', 'builder-delay', ['builder defect liability', 'cracks new flat']);
  Q('home', 'carpet-area', 'Can a builder sell on super built-up area?',
    "Under RERA, flats must be sold on carpet area — the usable floor area inside the walls. Ask for the carpet area in writing.",
    [], 'RERA 2016 ss.2(k), 13', 'builder-delay', ['carpet area', 'super built up']);
  Q('home', 'eviction-court-order', 'Can a landlord evict me without going to court?',
    "Generally no. If you do not leave, the landlord must go through the rent authority or court. Locking you out or cutting water or power to force you out is not lawful.",
    ['Your state’s rent law', 'Terms of your agreement'], 'State rent laws; Specific Relief Act s.6', 'eviction-tenancy', ['eviction without court', 'landlord threw out']);

  /* ---------- Work ---------- */
  Q('work', 'salary-due-date', 'By when must my salary be paid?',
    "Monthly wages must be paid by the 7th of the next month. If you leave, resign or are removed, wages must be paid within two working days.",
    ['Whether you are an employee or a contractor'], 'Code on Wages, 2019 s.17 (in force from 21 Nov 2025)', 'unpaid-salary', ['salary date', 'salary late', 'fnf two days']);
  Q('work', 'maternity-leave', 'How much paid maternity leave do I get?',
    "Up to 26 weeks of paid leave for the first two children (12 weeks from the third). Adoptive and commissioning mothers also get leave. An employer cannot dismiss a woman because of her maternity leave.",
    ['Number of children', 'Days worked in the past year'], 'Code on Social Security, 2020 (maternity benefit; in force from 21 Nov 2025)', 'unpaid-salary', ['maternity leave', '26 weeks', 'maternity benefit']);
  Q('work', 'equal-pay', 'Can a woman be paid less than a man for the same work?',
    "No. Employers cannot discriminate on the ground of gender in wages, recruitment or conditions for the same or similar work.",
    [], 'Code on Wages, 2019 s.3', 'unpaid-salary', ['equal pay', 'women paid less']);
  Q('work', 'overtime-pay', 'Must I be paid extra for overtime?',
    "Yes — overtime must be paid at twice the normal rate of wages.",
    ['Your working hours'], 'Code on Wages, 2019; Occupational Safety, Health and Working Conditions Code, 2020', 'unpaid-salary', ['overtime pay', 'double wages']);
  Q('work', 'appointment-letter', 'Must my employer give me an appointment letter?',
    "Yes. Employers covered by the labour codes must give every employee an appointment letter.",
    [], 'Occupational Safety, Health and Working Conditions Code, 2020 s.6', 'wrongful-termination', ['appointment letter', 'no offer letter']);
  Q('work', 'posh-time-limit', 'Is there a time limit to complain of sexual harassment at work?',
    "Complain to the Internal Committee within three months of the incident (or the last incident). The Committee can extend this by another three months for good reason, and must finish the inquiry within 90 days.",
    ['Date of the last incident'], 'POSH Act 2013 ss.9, 11', 'workplace-harassment', ['posh time limit', 'harassment complaint deadline']);
  Q('work', 'pf-who', 'Is my employer required to give me PF?',
    "Establishments with 20 or more employees must enrol employees in EPF. Usually 12% of basic wages is contributed by each side. Enrolment is compulsory up to the wage ceiling, raised to ₹25,000 a month from 17 September 2026; above that it is optional.",
    ['Size of the establishment'], 'EPF and MP Act 1952 / Code on Social Security 2020', 'pf-gratuity', ['pf mandatory', 'employer not giving pf']);

  /* ---------- Government, RTI, documents ---------- */
  Q('other', 'rti-basics', 'How do I file an RTI and how long do they get to reply?',
    "Write to the Public Information Officer with a ₹10 fee (free for BPL card holders); for central bodies, file at rtionline.gov.in. They must reply in 30 days, or 48 hours if life or liberty is involved.",
    ['Central or state body'], 'Right to Information Act 2005 ss.6, 7', 'govt-benefits', ['rti how to file', 'rti fee', 'rti reply time']);
  Q('other', 'rti-appeal', 'What if my RTI is not answered?',
    "File a first appeal within 30 days to the senior officer named in the reply (or the department’s appellate authority), then a second appeal to the Information Commission within 90 days.",
    ['Date of the reply or the deadline'], 'Right to Information Act 2005 s.19', 'govt-benefits', ['rti first appeal', 'rti second appeal']);
  Q('other', 'birth-cert-dob', 'Is the birth certificate the proof of date of birth?',
    "For births registered from 1 October 2023, the birth certificate is the single document to prove date of birth for admissions, jobs, passports and more.",
    [], 'Registration of Births and Deaths (Amendment) Act 2023', 'documents-correction', ['birth certificate proof', 'dob proof']);
  Q('other', 'lok-adalat', 'What is a Lok Adalat?',
    "A free forum where cases are settled by agreement. There is no fee, court fees already paid are refunded, and the settlement is final and binding — there is no appeal.",
    ['Whether both sides agree'], 'Legal Services Authorities Act 1987 ss.19–21', 'traffic-challan', ['lok adalat', 'settle case free']);
  Q('other', 'party-in-person', 'Can I argue my own case without a lawyer?',
    "Yes. You can appear as a 'party in person' in most courts. For serious or complex cases, free legal aid (15100) is usually a better choice.",
    [], 'Code of Civil Procedure, Order III Rule 1', 'legal-notice-received', ['argue own case', 'party in person']);
  Q('money', 'money-recovery-limit', 'How long do I have to recover money I lent?',
    "Generally three years from when the money became due (or from the last written acknowledgement or part-payment).",
    ['Due date', 'Any written acknowledgement or part-payment'], 'Limitation Act 1963 Articles 19–21; ss.18, 19', 'money-lent-not-returned', ['money recovery time limit', '3 years loan']);

  /* ---------- Accidents ---------- */
  Q('accidents', 'good-samaritan', 'Will I get into trouble if I help a road accident victim?',
    "No. A Good Samaritan who helps a victim in good faith cannot be held liable, need not give their name, and cannot be forced to be a witness.",
    [], 'Motor Vehicles Act 1988 s.134A', 'road-accident', ['good samaritan', 'help accident victim']);
  Q('accidents', 'hit-run-compensation', 'What compensation is there for a hit-and-run?',
    "Under the government scheme, ₹2 lakh for death and ₹50,000 for grievous injury, claimed through the Claims Enquiry Officer of the district.",
    ['Death or grievous injury'], 'Compensation to Victims of Hit and Run Motor Accidents Scheme, 2022 (MV Act s.161)', 'road-accident', ['hit and run compensation', 'unknown vehicle accident']);
  Q('accidents', 'cashless-accident', 'Is there free treatment for road accident victims?',
    "Yes. Under the government scheme, accident victims get cashless treatment up to ₹1.5 lakh for up to seven days at designated hospitals.",
    [], 'Cashless Treatment of Road Accident Victims Scheme, 2025 (MV Act s.162)', 'road-accident', ['cashless accident treatment', 'free treatment accident']);
  Q('accidents', 'third-party-insurance', 'Is third-party insurance compulsory?',
    "Yes. Every vehicle on a public road must have third-party insurance; it pays for injury or death caused to others.",
    [], 'Motor Vehicles Act 1988 s.146', 'road-accident', ['third party insurance', 'vehicle insurance compulsory']);

  /* ---------- Cyber ---------- */
  Q('other', 'sanchar-saathi', 'How do I check which SIM cards are registered in my name?',
    "Use Sanchar Saathi (sancharsaathi.gov.in) to see all mobile connections in your name and report ones you don’t use. You can also block a lost phone there.",
    [], 'Department of Telecommunications', 'account-hacked', ['sim in my name', 'sanchar saathi']);
  Q('other', 'report-fraud-call', 'Where do I report a fraud call or message?',
    "Report suspected fraud calls and messages on Chakshu (in Sanchar Saathi). If money is lost, call 1930 at once and file on cybercrime.gov.in.",
    ['Whether money was lost'], 'Department of Telecommunications; MHA (I4C)', 'upi-cyber-fraud', ['report fraud call', 'chakshu']);

  /* ======== Batch 3: online crimes, family, property, labour codes, traffic, schemes ======== */
  /* ---------- Online crimes ---------- */
  Q('other', 'share-private-photos', 'Is it a crime to share someone’s private photos without consent?',
    "Yes. Capturing or sharing images of a person’s private parts or private acts without consent is a crime, and so is publishing sexually explicit material. Report on cybercrime.gov.in and ask the platform to remove it.",
    [], 'BNS s.77 (voyeurism); IT Act ss.66E, 67, 67A', 'intimate-images', ['share private photos crime', 'leaked photos punishment']);
  Q('other', 'stalking-crime', 'Is following or messaging someone again and again a crime?',
    "Yes. Repeatedly following a woman or contacting her despite clear disinterest, or watching her online activity, is stalking — a crime.",
    [], 'BNS s.78', 'online-harassment', ['stalking', 'keeps messaging me', 'cyberstalking punishment']);
  Q('other', 'fake-profile-crime', 'Is making a fake profile of someone a crime?',
    "Using someone’s identity, photos or password to impersonate or cheat them is an offence. Report the profile to the platform and on cybercrime.gov.in.",
    [], 'IT Act ss.66C, 66D', 'account-hacked', ['fake profile crime', 'impersonation punishment']);
  Q('other', 'extortion-crime', 'Someone threatens to post my photos unless I pay — what is this?',
    "This is extortion, a serious crime. Do not pay — paying usually leads to more demands. Save the messages and report on cybercrime.gov.in or at a police station.",
    [], 'BNS s.308', 'intimate-images', ['sextortion', 'blackmail money photos']);
  Q('other', 'threat-crime', 'Is threatening someone a crime?',
    "Yes. Threatening injury to a person, their reputation or property to frighten them is criminal intimidation; threats of death or grievous hurt are punished more severely.",
    [], 'BNS s.351', 'assault-threat', ['threat crime', 'criminal intimidation']);
  Q('other', 'defamation-crime', 'Is defamation a crime or a civil matter?',
    "Both. You can file a criminal complaint before a Magistrate and/or sue for damages. Truth stated for the public good and fair comment are defences.",
    ['Where and how the statement was made', 'Whether it is true'], 'BNS s.356; civil suit for damages', 'defamation', ['defamation crime', 'defamation case']);
  Q('other', 'child-abuse-material', 'What should I do if I see sexual images of a child online?',
    "Do not share or download them. Report on cybercrime.gov.in (child section, can be anonymous) or call 1098. Reporting is required by law.",
    [], 'POCSO Act ss.15, 19; IT Act s.67B', 'sexual-assault', ['child images report', 'csam report']);

  /* ---------- Family ---------- */
  Q('family', 'divorce-one-year', 'Can I file for divorce within a year of marriage?',
    "Under the Hindu Marriage Act, generally not within one year of marriage, unless the court allows it for exceptional hardship or depravity.",
    ['Exceptional hardship'], 'Hindu Marriage Act s.14', 'divorce-separation', ['divorce first year', 'divorce within one year']);
  Q('family', 'wife-file-where', 'Can a wife file for divorce where she lives now?',
    "Yes. A wife can file in the district where she is living, as well as where the marriage took place or where the couple last lived together.",
    [], 'Hindu Marriage Act s.19', 'divorce-separation', ['divorce jurisdiction', 'where to file divorce']);
  Q('family', 'second-marriage', 'Is a second marriage valid if the first spouse is alive?',
    "No, for Hindus, Christians, Parsis and marriages under the Special Marriage Act — it is void and bigamy is a crime. Personal law rules differ for Muslim men.",
    ['Religion and the law of the marriage'], 'Hindu Marriage Act ss.5, 11; BNS s.82', 'divorce-separation', ['second marriage', 'bigamy']);
  Q('family', 'dowry-offence', 'Is giving dowry also a crime?',
    "Yes. Both giving and taking dowry are offences, as is demanding it. Gifts given voluntarily at the wedding, listed in writing, are not dowry.",
    [], 'Dowry Prohibition Act 1961 ss.3, 4', 'dowry-cruelty', ['dowry crime', 'giving dowry']);
  Q('family', 'cruelty-498a', 'What is the law on cruelty by husband or in-laws?',
    "Cruelty by a husband or his relatives — harassment for dowry or conduct likely to drive a woman to harm herself — is a crime (formerly section 498A IPC).",
    [], 'BNS ss.85, 86', 'dowry-cruelty', ['498a', 'cruelty husband', 'section 85 bns']);
  Q('family', 'class-one-heirs', 'Who inherits if a Hindu man dies without a will?',
    "His Class I heirs share equally — mainly his widow, sons, daughters and mother (and heirs of predeceased children).",
    ['Whether the property is ancestral or self-acquired'], 'Hindu Succession Act s.8 and Schedule', 'inheritance-partition', ['who inherits no will', 'class 1 heirs']);
  Q('family', 'will-registration', 'Does a will have to be registered?',
    "No. A will is valid if signed by the person and attested by two witnesses. Registering it is optional but makes it harder to challenge.",
    [], 'Indian Succession Act s.63; Registration Act s.18', 'will-gift', ['register will', 'will without registration']);
  Q('family', 'muslim-will-limit', 'How much can a Muslim leave by will?',
    "Generally up to one-third of the estate to anyone; the rest goes by inheritance rules unless the heirs consent.",
    [], 'Muslim personal law (Shariat Application Act 1937)', 'will-gift', ['muslim will one third', 'wasiyat']);
  Q('family', 'interfaith-hma', 'Can a Hindu marry a non-Hindu under the Hindu Marriage Act?',
    "No. Inter-religion couples who want to marry without conversion can marry under the Special Marriage Act.",
    [], 'Hindu Marriage Act s.2, s.5; Special Marriage Act 1954', 'court-marriage', ['interfaith marriage law', 'hindu christian marriage']);

  /* ---------- Property ---------- */
  Q('home', 'encumbrance-certificate', 'What is an encumbrance certificate?',
    "It shows registered transactions on a property — sales, mortgages, leases — over a period. Get it from the Sub-Registrar’s office (often online) before buying.",
    [], 'Registration Act 1908', 'property-purchase', ['encumbrance certificate', 'ec property']);
  Q('home', 'rera-ten-percent', 'How much can a builder take before signing the agreement?',
    "Not more than 10% of the price as advance or application fee before a written, registered agreement for sale.",
    [], 'RERA 2016 s.13', 'builder-delay', ['builder advance', '10 percent advance']);
  Q('home', 'noise-hours', 'Are loudspeakers allowed at night?',
    "Loudspeakers and public address systems are generally not allowed between 10 pm and 6 am, except in closed premises or limited exempted occasions. Complain to the police.",
    [], 'Noise Pollution (Regulation and Control) Rules, 2000', 'neighbour-dispute', ['loudspeaker night', 'noise after 10 pm']);

  /* ---------- Work ---------- */
  Q('work', 'gratuity-formula', 'How is gratuity calculated?',
    "Fifteen days’ wages for every completed year: last drawn wages × 15 ÷ 26 × years of service. The ceiling is ₹20 lakh. It must be paid within 30 days of becoming due.",
    ['Last drawn wages', 'Years of service'], 'Payment of Gratuity Act / Code on Social Security 2020', 'pf-gratuity', ['gratuity calculation', 'gratuity formula']);
  Q('work', 'bonus', 'Is bonus compulsory?',
    "For covered employees, a minimum bonus of 8.33% of wages (maximum 20%) is payable every year.",
    ['Your wage level and the employer’s size'], 'Code on Wages, 2019 (bonus)', 'unpaid-salary', ['bonus mandatory', 'minimum bonus']);
  Q('work', 'working-hours', 'How many hours can I be made to work?',
    "Generally not more than 8 hours a day and 48 hours a week, with overtime paid at double rate.",
    [], 'Occupational Safety, Health and Working Conditions Code, 2020', 'unpaid-salary', ['working hours', '48 hours week']);
  Q('work', 'retrenchment-pay', 'What do I get if I am retrenched?',
    "One month’s notice or pay in lieu, and compensation of 15 days’ average pay for every completed year of service, plus a further 15 days’ wages from the reskilling fund.",
    ['Years of service', 'Whether you are a “worker” under the Code'], 'Industrial Relations Code, 2020 ss.70, 83', 'wrongful-termination', ['retrenchment compensation', 'layoff compensation']);
  Q('work', 'child-labour', 'At what age can a child work?',
    "No child under 14 may be employed in any work (except helping in family enterprises after school). Adolescents aged 14 to 18 cannot work in hazardous jobs. Call 1098 to report.",
    [], 'Child and Adolescent Labour (Prohibition and Regulation) Act 1986', 'trafficking', ['child labour age', 'child working']);
  Q('work', 'esic-coverage', 'Am I covered by ESIC?',
    "Employees earning up to ₹21,000 a month (₹25,000 for persons with disabilities) in covered establishments are covered by ESIC for medical care, sickness, maternity and injury benefits.",
    ['Your monthly wages'], 'ESI scheme / Code on Social Security 2020', 'workplace-injury', ['esic eligibility', 'esi coverage']);

  /* ---------- Criminal procedure ---------- */
  Q('police', 'default-bail', 'What if police do not file a chargesheet in time?',
    "If the investigation is not completed within 60 days (or 90 days for offences punishable with death, life or 10+ years), the accused in custody gets a right to bail, called default bail.",
    ['The punishment for the offence', 'Days spent in custody'], 'BNSS s.187(3)', 'accused-arrest', ['default bail', 'chargesheet not filed']);
  Q('police', 'plea-bargaining', 'What is plea bargaining?',
    "For offences punishable with less than seven years (not against women or children under 14, or socio-economic offences), the accused can plead guilty for a lesser sentence through a court-supervised process.",
    ['The offence'], 'BNSS ss.289–300', 'accused-arrest', ['plea bargaining', 'plead guilty lesser sentence']);
  Q('police', 'compounding', 'Can a criminal case be settled between the parties?',
    "Some offences can be compounded (settled) by the victim, some only with the court’s permission. Serious offences cannot. High Courts can also quash some cases after settlement.",
    ['Which offence it is'], 'BNSS s.359; BNSS s.528', 'accused-arrest', ['settle criminal case', 'compromise fir']);
  Q('police', 'victim-compensation', 'Can a crime victim get compensation from the government?',
    "Yes. Every state has a victim compensation scheme run through the Legal Services Authority; victims can apply even if the accused is not found.",
    [], 'BNSS s.396', 'police-complaint', ['victim compensation', 'compensation for crime victim']);
  Q('police', 'child-accused', 'What happens if a child is accused of a crime?',
    "A child under 18 is dealt with by the Juvenile Justice Board, not an ordinary court, and cannot be kept in a police lock-up or jail.",
    [], 'Juvenile Justice (Care and Protection of Children) Act 2015', 'accused-arrest', ['juvenile accused', 'minor arrested']);

  /* ---------- Traffic ---------- */
  Q('police', 'drunk-driving-fine', 'What is the penalty for drunk driving?',
    "Up to ₹10,000 fine and/or six months’ jail for a first offence; more for repeat offences. Your licence can also be suspended.",
    [], 'Motor Vehicles Act 1988 s.185', 'traffic-challan', ['drunk driving fine', 'drink and drive']);
  Q('police', 'no-licence-fine', 'What is the fine for driving without a licence?',
    "Up to ₹5,000.",
    [], 'Motor Vehicles Act 1988 s.181', 'traffic-challan', ['no licence fine', 'driving without licence']);
  Q('police', 'helmet-fine', 'What is the fine for riding without a helmet?',
    "₹1,000, and your licence can be disqualified for three months.",
    [], 'Motor Vehicles Act 1988 s.194D', 'traffic-challan', ['helmet fine', 'no helmet challan']);
  Q('police', 'minor-driving', 'What happens if a minor drives a vehicle?',
    "The guardian or vehicle owner is treated as guilty: fine of ₹25,000 and up to three years’ jail, and the vehicle’s registration can be cancelled.",
    [], 'Motor Vehicles Act 1988 s.199A', 'traffic-challan', ['minor driving', 'underage driving fine']);

  /* ---------- Schemes, utilities, everyday rights ---------- */
  Q('other', 'pmjay', 'Who gets free hospital treatment under Ayushman Bharat?',
    "Eligible families get cover of up to ₹5 lakh a year at empanelled hospitals, and all senior citizens aged 70 and above are eligible regardless of income.",
    ['Whether your family is eligible', 'Your age'], 'Ayushman Bharat PM-JAY (expanded 2024)', 'govt-benefits', ['ayushman card', 'pmjay', 'free treatment 5 lakh']);
  Q('other', 'onorc', 'Can I get my ration in another state?',
    "Yes. Under One Nation One Ration Card, you can take your ration from any ration shop in the country using your existing card.",
    [], 'National Food Security Act 2013; One Nation One Ration Card', 'govt-benefits', ['ration other state', 'onorc']);
  Q('other', 'rte-ews', 'Can my child study free in a private school?',
    "Private unaided schools must reserve 25% of entry-level seats for children from weaker sections and disadvantaged groups, free of cost. Apply through your state’s RTE admission process.",
    ['Your income or category', 'Your state’s admission dates'], 'Right of Children to Free and Compulsory Education Act 2009 s.12(1)(c)', 'education-dispute', ['rte admission', 'free seat private school']);
  Q('other', 'ragging-helpline', 'Where do I report ragging?',
    "Call the national anti-ragging helpline 1800-180-5522 or email helpline@antiragging.in, and complain to the college’s anti-ragging committee. Ragging is a punishable offence.",
    [], 'UGC Regulations on Curbing the Menace of Ragging 2009', 'ragging', ['ragging helpline', 'report ragging']);
  Q('other', 'smoking-public', 'Is smoking in public places allowed?',
    "No. Smoking in public places is banned and can be fined. Selling tobacco to anyone under 18 is also banned.",
    [], 'Cigarettes and Other Tobacco Products Act 2003 ss.4, 6', 'neighbour-dispute', ['smoking public place', 'cotpa']);
  Q('other', 'electricity-new-connection', 'How quickly must I get a new electricity connection?',
    "Within 7 days in metro cities, 15 days in other municipal areas and 30 days in rural areas, once the application is complete.",
    ['Where you live'], 'Electricity (Rights of Consumers) Rules, 2020', 'electricity-bill', ['new electricity connection time', 'meter connection days']);
  Q('other', 'electricity-forum', 'Where do I complain if the electricity company won’t fix my problem?',
    "Every distribution company must have a Consumer Grievance Redressal Forum; if unhappy, go to the Electricity Ombudsman. Both are free.",
    [], 'Electricity Act 2003 s.42(5), (6)', 'electricity-bill', ['electricity ombudsman', 'cgrf']);
  Q('other', 'medical-records-72h', 'How soon must a hospital give my medical records?',
    "Doctors and hospitals should provide medical records within 72 hours of a request by the patient or authorised attendant.",
    [], 'Indian Medical Council (Professional Conduct) Regulations 2002, reg. 1.3.2', 'medical-negligence', ['medical records', 'case sheet copy']);
  Q('other', 'emergency-treatment', 'Can a hospital refuse emergency treatment?',
    "No. Every doctor and hospital must give emergency medical aid to preserve life; formalities and police paperwork cannot come first.",
    [], 'Parmanand Katara v. Union of India (1989); Constitution Art. 21', 'medical-negligence', ['emergency treatment refused', 'hospital refused accident']);
  Q('money', 'ponzi-ban', 'Are deposit schemes promising high returns legal?',
    "Unregulated deposit schemes are banned. Taking money in such schemes — and promoting them — is an offence; check whether the company is registered with RBI, SEBI or another regulator.",
    [], 'Banning of Unregulated Deposit Schemes Act 2019', 'job-investment-scam', ['ponzi scheme', 'unregulated deposit', 'chit fund fraud']);
  Q('other', 'voter-registration', 'How do I get my name on the voter list?',
    "Apply online with Form 6 on the Election Commission’s voter portal or app, or through your Booth Level Officer.",
    [], 'Registration of Electors Rules 1960; Election Commission of India', 'govt-benefits', ['voter id apply', 'form 6']);
})(typeof window !== 'undefined' ? window : globalThis);
