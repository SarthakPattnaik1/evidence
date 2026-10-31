/* Law update pass — checked 30 Oct 2026 against official and primary-reporting sources.
   Adds: per-guide sources + "law checked" date, and patches for changes made in 2025–26.
   Draft: still needs advocate review. */
(function (root) {
  const { W, ALL, ANY, NOT } = root.ER_H;
  const KB = root.ER_KB; const I = KB.issues;
  const by = (id) => I.find((i) => i.id === id);
  const CHECKED = '2026-10-30';
  KB.lawChecked = CHECKED;

  /* ---- Official / primary sources, by guide ---- */
  const C = root.ER_CITE, A = C.ACT, K = C.CASE;
  const SRC = {
    // rules, circulars and portals: official pages, each opened and checked on 31 Oct 2026
    rbiFraud: { t: 'RBI press release, 24 Jun 2026: Amendment Directions on limiting customer liability in digital transactions (effective 1 Jan 2027)', u: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63011' },
    rbiDL: { t: 'RBI (Digital Lending) Directions, 2025 — 8 May 2025', u: 'https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=12848' },
    rbiIOS: { t: 'RBI complaint portal (Integrated Ombudsman Scheme)', u: 'https://cms.rbi.org.in' },
    sachet: { t: 'RBI Sachet portal — check if a lender or scheme is registered', u: 'https://sachet.rbi.org.in' },
    cyber: { t: 'National Cyber Crime Reporting Portal (MHA)', u: 'https://cybercrime.gov.in' },
    ni138: A.ni,
    sanjabij: K['Sanjabij Tari v. Kishore S. Borcar'],
    mvStay: K['ICICI Lombard v. Ayiti Navaneetha'],
    mv: A.mv,
    janVishwas: { t: 'Jan Vishwas (Amendment of Provisions) Act, 2026 — Motor Vehicles Act changes in force from 15 Aug 2026', u: '' },
    echallan: { t: 'eChallan portal (Parivahan)', u: 'https://echallan.parivahan.gov.in' },
    cpa: A.cpa,
    ejag: { t: 'e-Jagriti — file a consumer complaint online', u: 'https://e-jagriti.gov.in' },
    ecom: { t: 'Consumer Protection (E-Commerce) (Amendment) Rules, 2026 — G.S.R. 789(E), 9 Sep 2026, effective 1 Jan 2027 (official PDF)', u: 'https://consumeraffairs.gov.in/public/upload/admin/cmsfiles/whatsnews/E_Commerce_Amendment_Rules_2026_2026-09-11_18-12-39.pdf' },
    nch: { t: 'National Consumer Helpline (1915)', u: 'https://consumerhelpline.gov.in' },
    dgca: { t: 'DGCA — civil aviation regulator (passenger rules)', u: 'https://www.dgca.gov.in' },
    airsewa: { t: 'AirSewa — complaint against an airline', u: 'https://airsewa.gov.in' },
    irdai: { t: 'IRDAI — insurance regulator', u: 'https://irdai.gov.in' },
    bima: { t: 'Bima Bharosa — IRDAI complaint portal', u: 'https://bimabharosa.irdai.gov.in' },
    itRules: { t: 'IT (Intermediary Guidelines and Digital Media Ethics Code) Amendment Rules, 2026 — G.S.R. 120(E), in force 20 Feb 2026 (intimate-image complaints: action within 2 hours)', u: '' },
    gaming: { t: 'Promotion and Regulation of Online Gaming Act, 2025', u: '' },
    dpdp: { t: 'Digital Personal Data Protection Rules, 2025 — PIB document, 17 Nov 2025', u: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf' },
    trans: { t: 'Transgender Persons (Protection of Rights) Amendment Act, 2026 (No. 3 of 2026, in force 25 May 2026)', u: '' },
    transPortal: { t: 'National Portal for Transgender Persons', u: 'https://transgender.dosje.gov.in' },
    ugcRag: { t: 'Anti-ragging helpline and complaint portal (UGC)', u: 'https://www.antiragging.in' },
    ugcFee: { t: 'UGC — University Grants Commission', u: 'https://www.ugc.gov.in' },
    coss: { t: 'Ministry of Labour and Employment (official site) — Code on Social Security, 2020 in force from 21 Nov 2025', u: 'https://labour.gov.in' },
    epfo: { t: 'EPFO grievance portal', u: 'https://epfigms.gov.in' },
    eshram: { t: 'e-Shram portal', u: 'https://eshram.gov.in' },
    rbiDeceased: { t: 'RBI complaint portal — for delays in settling a deceased customer\'s account', u: 'https://cms.rbi.org.in' },
    rera: A.rera,
    elec: { t: 'Ministry of Power (official site) — consumer rules on connections and bills', u: 'https://powermin.gov.in' },
    senior: A.senior,
    sma: A.sma,
    dv: A.dv,
    bnss: A.bnss,
    bns: A.bns,
    nalsa: { t: 'NALSA — free legal aid and who is eligible', u: 'https://nalsa.gov.in/legal-aid/' },
    labourCodes: { t: 'Ministry of Labour and Employment (official site) — Labour Codes in force from 21 Nov 2025', u: 'https://labour.gov.in' },
    samadhan: { t: 'Samadhan — labour dispute portal', u: 'https://samadhan.labour.gov.in' },
    posh: A.posh,
    shebox: { t: 'SHe-Box — online complaint of sexual harassment at work', u: 'https://shebox.wcd.gov.in' },
    msme: A.msmed,
    msmeOdr: { t: 'MSME Samadhaan — delayed payment complaints', u: 'https://samadhaan.msme.gov.in' },
    ibc: A.ibc,
    companies: A.companies,
    partnership: A.partnership,
    contract: A.contract,
    sra: A.sra,
    lim: A.lim,
    tpa: A.tpa,
    tm: A.tm,
    copyright: A.copyright,
    ipindia: { t: 'IP India — trade mark search and filing', u: 'https://ipindia.gov.in' },
    commercial: A.commercial,
    fema: { t: 'Reserve Bank of India — FEMA rules for NRIs', u: 'https://www.rbi.org.in' },
    itAct2025: { t: 'Income Tax e-filing portal (official) — the Income-tax Act, 2025 applies from 1 Apr 2026', u: 'https://www.incometax.gov.in' },
    madad: { t: 'MADAD consular grievance portal (MEA)', u: 'https://madad.gov.in' },
    hma: A.hma,
    hsa: A.hsa,
    gwa: A.gwa,
    hmga: A.hmga,
    succession: A.succession,
    ucc: { t: 'Uttarakhand Uniform Civil Code — registration portal', u: 'https://ucc.uk.gov.in' },
    trai: { t: 'TRAI — telecom regulator', u: 'https://www.trai.gov.in' },
    vodafone: K['Vodafone Idea v. Ajay Kumar Agarwal'],
    nmc: { t: 'National Medical Commission', u: 'https://www.nmc.org.in' }
  };
  const MAP = {
    'upi-cyber-fraud': ['rbiFraud', 'cyber', 'rbiIOS'], 'bank-account-frozen': ['rbiIOS', 'bnss'], 'failed-payment-debited': ['rbiIOS'],
    'cheque-bounce': ['ni138', 'sanjabij', 'lim'], 'money-lent-not-returned': ['lim', 'contract', 'ni138'], 'loan-recovery': ['rbiIOS', 'rbiDL'], 'credit-card-dispute': ['rbiFraud', 'rbiIOS'], 'credit-report-error': ['rbiIOS'],
    'digital-arrest-scam': ['cyber', 'rbiFraud'], 'job-investment-scam': ['cyber', 'sachet', 'rbiFraud'], 'loan-app-harassment': ['rbiDL', 'sachet', 'cyber'], 'bank-service': ['rbiIOS', 'irdai'],
    'refund-refused': ['cpa', 'nch', 'ejag'], 'defective-product': ['cpa', 'nch', 'ejag'], 'ecommerce-order': ['ecom', 'cpa', 'nch'], 'travel-refund': ['airsewa', 'nch', 'cpa'], 'telecom-internet': ['vodafone', 'trai', 'cpa'],
    'insurance-claim': ['bima', 'irdai', 'cpa'], 'builder-delay': ['rera', 'cpa'], 'road-accident': ['mvStay', 'mv'], 'traffic-challan': ['echallan', 'janVishwas', 'mv'],
    'medical-negligence': ['cpa', 'nmc'], 'electricity-bill': ['elec'], 'education-dispute': ['ugcFee', 'cpa'], 'ragging': ['ugcRag'],
    'divorce-separation': ['hma', 'sma', 'bnss'], 'maintenance': ['bnss', 'dv'], 'domestic-violence': ['dv'], 'child-custody': ['gwa', 'hmga'], 'dowry-cruelty': ['bns', 'dv'], 'inheritance-partition': ['hsa', 'succession'],
    'court-marriage': ['sma', 'ucc'], 'parents-maintenance': ['senior', 'bnss'], 'death-claims': ['rbiDeceased', 'epfo', 'hsa'], 'live-in': ['dv', 'bnss', 'ucc'], 'gender-identity': ['trans', 'transPortal'],
    'rental-security-deposit': ['contract', 'lim'], 'eviction-tenancy': ['tpa', 'sra'], 'land-encroachment': ['sra', 'lim', 'bnss'], 'property-purchase': ['rera', 'tpa', 'itAct2025'],
    'unpaid-salary': ['labourCodes', 'samadhan'], 'wrongful-termination': ['labourCodes', 'samadhan'], 'workplace-harassment': ['posh', 'shebox'], 'pf-gratuity': ['coss', 'epfo'], 'gig-worker': ['coss', 'eshram'], 'internship-creator-pay': ['contract', 'lim'],
    'police-complaint': ['bnss'], 'accused-arrest': ['bnss', 'nalsa'], 'police-stop': ['bnss', 'nalsa'], 'legal-notice-received': ['nalsa', 'lim'],
    'online-harassment': ['itRules', 'cyber'], 'intimate-images': ['itRules', 'cyber'], 'account-hacked': ['itRules', 'cyber'], 'gaming-betting': ['gaming', 'cyber'],
    'nri-property': ['sra', 'lim', 'madad'], 'nri-sale-repatriation': ['fema', 'itAct2025'], 'nri-poa': ['madad'], 'nri-marriage': ['madad', 'hma'], 'nri-case-abroad': ['madad', 'bnss'], 'nri-bank-tax': ['fema', 'itAct2025'],
    'business-unpaid': ['msme', 'msmeOdr', 'lim'], 'shareholder-dispute': ['companies'], 'partnership-dispute': ['partnership', 'contract'], 'contract-breach': ['contract', 'sra', 'commercial'], 'ip-brand': ['tm', 'copyright', 'ipindia'], general: ['nalsa']
  };
  I.forEach((i) => { i.checked = CHECKED; i.sources = MAP[i.id] ? MAP[i.id].map((k) => SRC[k]).filter(Boolean) : (i.sources && i.sources.length ? i.sources : [SRC.nalsa]); });

  /* ---- UPI / online fraud: RBI 2026 directions (effective 1 Jan 2027) ---- */
  const uf = by('upi-cyber-fraud');
  if (uf) {
    uf.juris = 'Until 31 Dec 2026: for an unauthorised transaction caused by a third-party breach, you bear nothing if you tell your bank within 3 working days. For transactions from 1 Jan 2027 (RBI directions of 24 June 2026): the window is 5 calendar days, the rules also cover payments you were tricked or pressured into making, banks must decide within 45 days, and small frauds (loss up to ₹50,000) can get a one-time compensation of 85% of the net loss or ₹25,000, whichever is lower — only if you report to BOTH your bank and 1930 / cybercrime.gov.in within 5 calendar days.';
    uf.stand = (uf.stand || []).concat([
      { k: 'next', text: 'Report to your bank AND to 1930 / cybercrime.gov.in — from 2027, compensation depends on both reports within 5 calendar days.' },
      { k: 'good', when: W('uf_how', 'tricked'), text: 'From 1 Jan 2027, RBI rules also cover payments you were tricked or pressured into making.' }
    ]);
    uf.stand = uf.stand.filter((s) => !/RBI rules on this change from 1 January 2027/.test(s.text));
  }
  const cc = by('credit-card-dispute');
  if (cc) {
    cc.juris = 'RBI\'s credit card directions set rules on billing, closure, charges and recovery. For card fraud from 1 Jan 2027, the bank must give a temporary ("shadow") reversal within 5 calendar days of your complaint, and you bear nothing for third-party fraud reported within 5 calendar days.';
  }
  const da = by('digital-arrest-scam');
  if (da) da.stand = (da.stand || []).concat([{ k: 'next', when: W('da_paid', 'yes'), text: 'For frauds from 1 Jan 2027, reporting to both your bank and 1930 within 5 calendar days can make small losses (up to ₹50,000) eligible for RBI compensation.' }]);

  /* ---- Cheque bounce: Supreme Court guidelines (Sanjabij Tari, effective 1 Nov 2025) ---- */
  for (const id of ['cheque-bounce']) {
    const x = by(id); if (!x) continue;
    x.juris = 'Cheque dishonour is a criminal complaint under Section 138 of the Negotiable Instruments Act. Deadlines run from specific events, so exact dates matter. Since 1 November 2025 (Supreme Court, Sanjabij Tari), summons can be served by email and WhatsApp, the accused can pay online at the start, and settlement costs were reduced: no cost if paid before the accused\'s evidence, 5% before the trial court\'s judgment, 7.5% in the High Court and 10% in the Supreme Court.';
    x.info = (x.info || []).concat([{ when: W('cb_side', 'drawer', 'drawer_notice'), text: 'Settling early costs least: under the Supreme Court\'s 2025 guidelines, paying the cheque amount before your evidence is recorded allows the case to be closed without extra costs.' }]);
  }

  /* ---- Traffic: Jan Vishwas Act 2026 changes to the Motor Vehicles Act ---- */
  const tr = by('traffic-challan');
  if (tr) {
    tr.juris += ' Separately, the Jan Vishwas (Amendment of Provisions) Act, 2026 changed several Motor Vehicles Act offences into civil penalties or first-time warnings and gives a 30-day grace period after a driving licence expires; its Motor Vehicles provisions were brought into force by notification in 2026 — check the current position for your state.';
    tr.stand = (tr.stand || []).concat([{ k: 'good', text: 'Some minor motor-vehicle lapses are now civil penalties or first-time warnings under the Jan Vishwas Act, 2026.' }]);
  }

  /* ---- E-commerce: 2026 amendment ---- */
  const ec = by('ecommerce-order');
  if (ec) ec.juris += ' From 1 January 2027, amended e-commerce rules also require platforms to take part in the National Consumer Helpline process and add new disclosure duties.';

  /* ---- Trans & queer rights: 2026 amendment replaced self-identification ---- */
  const gi = by('gender-identity');
  if (gi) {
    gi.intro = 'The law on legal gender recognition changed in May 2026 and is being challenged in the Supreme Court. Your safety is protected either way, and courts regularly protect queer couples.';
    gi.juris = 'The Transgender Persons (Protection of Rights) Amendment Act, 2026 (in force from 25 May 2026) removed the statutory right to self-identified gender: the District Magistrate now issues a certificate of identity after considering a designated medical board\'s recommendation. The amendment is under challenge in the Supreme Court. The 2019 Act\'s bar on discrimination in education, jobs and healthcare continues. Same-sex relations are not a crime (Navtej Johar, 2018), and courts grant police protection to couples facing threats.';
    gi.evidence.forEach((e) => {
      if (e.id === 'gi_e_portal') { e.name = 'Application for a certificate of identity (National Portal for Transgender Persons / District Magistrate)'; e.why = 'Since May 2026 the District Magistrate decides after a medical board\'s recommendation — ask an advocate or support group before you apply.'; }
      if (e.id === 'gi_e_affidavit') { e.name = 'Affidavit of your name and gender, and any medical records you choose to share'; e.why = 'Applications and record updates ask for them; the medical board may ask for medical documents.'; }
    });
    gi.stand = (gi.stand || []).concat([{ k: 'risk', when: W('gi_need', 'docs'), text: 'Since 25 May 2026 a medical board is involved in issuing the certificate. The Supreme Court is hearing a challenge — the process may change again.' }]);
  }

  /* ---- Fill "Where you stand" for guides that had none ---- */
  const fill = {
    'workplace-harassment': [{ k: 'next', text: 'Complain in writing to the Internal Committee within 3 months of the last incident (extendable); if there is no committee, go to the Local Committee or SHe-Box.' }, { k: 'good', when: W('wh_records', 'messages', 'witness'), text: 'Messages and witnesses make an Internal Committee inquiry much stronger.' }],
    'nri-sale-repatriation': [{ k: 'next', text: 'Get the tax certificate and bank documents sorted before the sale — repatriation needs them.' }, { k: 'good', when: W('ns_account', 'nro', 'nre'), text: 'You already have an NRO/NRE account, which repatriation requires.' }],
    'nri-poa': [{ k: 'next', text: 'A power of attorney signed abroad usually needs embassy attestation or an apostille, then stamping in India within the set time.' }],
    'nri-marriage': [{ k: 'next', text: 'Indian courts, the MEA\'s MADAD portal and the embassy can all be used while you are abroad.' }],
    'nri-case-abroad': [{ k: 'good', when: W('nc_advocate', 'yes'), text: 'An advocate in India can appear for you in most hearings.' }, { k: 'risk', when: W('nc_stage', 'warrant'), text: 'A warrant can lead to a Look Out Circular — act through an advocate quickly.' }],
    'nri-bank-tax': [{ k: 'next', when: W('nb_issue', 'tax', 'tds'), text: 'Reply to tax notices by the due date shown; lower-TDS certificates can be applied for in advance.' }, { k: 'risk', when: W('nb_notice_due', 'soon', 'passed'), text: 'A tax reply deadline is close or past — act now.' }],
    'shareholder-dispute': [{ k: 'good', when: W('sd_stake', '10to50', 'over50'), text: 'With 10% or more, you can usually bring an oppression and mismanagement case before the NCLT.' }, { k: 'risk', when: W('sd_stake', 'u10'), text: 'Below 10%, NCLT oppression cases need a waiver — your shareholders\' agreement matters more.' }],
    'partnership-dispute': [{ k: 'risk', when: W('pd_reg', 'no'), text: 'An unregistered firm faces limits on suing third parties and partners — ask about registration.' }, { k: 'next', when: W('pd_arb', 'yes'), text: 'An arbitration clause usually sends the dispute to arbitration first.' }],
    'contract-breach': [{ k: 'next', when: W('cbx_arb', 'yes'), text: 'Your contract points to arbitration — that is likely the route.' }, { k: 'next', when: W('cbx_value', '3to1cr', 'over1cr'), text: 'Commercial claims of ₹3 lakh or more usually need pre-litigation mediation first.' }],
    'ip-brand': [{ k: 'good', when: W('ip_reg', 'yes'), text: 'A registered mark or design is much easier to enforce.' }, { k: 'next', when: W('ip_where', 'online', 'both'), text: 'Platforms have takedown processes for copied listings and content — use them alongside a legal notice.' }]
  };
  Object.entries(fill).forEach(([id, arr]) => { const x = by(id); if (x) x.stand = (x.stand || []).concat(arr); });
})(typeof window !== 'undefined' ? window : globalThis);
