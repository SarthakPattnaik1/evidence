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
  const SRC = {
    rbiFraud: { t: 'RBI: Amendment Directions on limiting customer liability in digital transactions (24 Jun 2026, effective 1 Jan 2027)', u: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx' },
    rbiDL: { t: 'RBI (Digital Lending) Directions, 2025', u: 'https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=12848' },
    rbiIOS: { t: 'RBI Integrated Ombudsman Scheme — complaint portal', u: 'https://cms.rbi.org.in' },
    sachet: { t: 'RBI Sachet portal', u: 'https://sachet.rbi.org.in' },
    cyber: { t: 'National Cyber Crime Reporting Portal (MHA)', u: 'https://cybercrime.gov.in' },
    ni138: { t: 'Negotiable Instruments Act, 1881 (India Code)', u: 'https://www.indiacode.nic.in' },
    sanjabij: { t: 'Supreme Court: Sanjabij Tari v. Kishore S. Borcar, 2025 INSC 1158 (25 Sep 2025)', u: 'https://www.sci.gov.in' },
    mvStay: { t: 'Supreme Court interim order staying s.166(3) MV Act (ICICI Lombard v. Ayiti Navaneetha, 7 Nov 2025)', u: 'https://www.sci.gov.in' },
    janVishwas: { t: 'Jan Vishwas (Amendment of Provisions) Act, 2026 — Gazette, Act 8 of 2026', u: 'https://egazette.gov.in' },
    cmvr2026: { t: 'Ministry of Road Transport and Highways — Motor Vehicles Act and rules', u: 'https://morth.nic.in' },
    echallan: { t: 'eChallan portal (Parivahan)', u: 'https://echallan.parivahan.gov.in' },
    cpa: { t: 'Consumer Protection Act, 2019 and Jurisdiction Rules, 2021', u: 'https://consumeraffairs.gov.in' },
    ejag: { t: 'e-Jagriti consumer complaint filing', u: 'https://e-jagriti.gov.in' },
    ecom: { t: 'Consumer Protection (E-Commerce) (Amendment) Rules, 2026 (G.S.R. 789(E), effective 1 Jan 2027)', u: 'https://consumeraffairs.gov.in/public/upload/admin/cmsfiles/whatsnews/E_Commerce_Amendment_Rules_2026_2026-09-11_18-12-39.pdf' },
    nch: { t: 'National Consumer Helpline', u: 'https://consumerhelpline.gov.in' },
    dgca: { t: 'DGCA Civil Aviation Requirement on refund of airline tickets', u: 'https://www.dgca.gov.in' },
    irdai: { t: 'IRDAI Master Circular on Health Insurance Business (29 May 2024)', u: 'https://irdai.gov.in' },
    bima: { t: 'Bima Bharosa (IRDAI grievance portal)', u: 'https://bimabharosa.irdai.gov.in' },
    itRules: { t: 'IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, as amended (MeitY)', u: 'https://www.meity.gov.in' },
    gaming: { t: 'Promotion and Regulation of Online Gaming Act, 2025 (MeitY)', u: 'https://www.meity.gov.in' },
    dpdp: { t: 'DPDP Rules, 2025 (PIB, 17 Nov 2025)', u: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf' },
    trans: { t: 'Transgender Persons (Protection of Rights) Amendment Act, 2026 (in force 25 May 2026)', u: 'https://egazette.gov.in' },
    transPortal: { t: 'National Portal for Transgender Persons', u: 'https://transgender.dosje.gov.in' },
    ugcRag: { t: 'UGC anti-ragging regulations and helpline', u: 'https://www.antiragging.in' },
    ugcFee: { t: 'UGC fee refund policy and non-retention of certificates', u: 'https://www.ugc.gov.in' },
    coss: { t: 'Code on Social Security, 2020 (in force 21 Nov 2025)', u: 'https://labour.gov.in' },
    epfo: { t: 'EPFO grievance portal', u: 'https://epfigms.gov.in' },
    eshram: { t: 'e-Shram portal', u: 'https://eshram.gov.in' },
    rbiDeceased: { t: 'RBI rules on settling claims of deceased bank customers', u: 'https://www.rbi.org.in' },
    rera: { t: 'Real Estate (Regulation and Development) Act, 2016', u: 'https://www.indiacode.nic.in' },
    elec: { t: 'Electricity (Rights of Consumers) Rules, 2020 (amended 2024)', u: 'https://powermin.gov.in' },
    senior: { t: 'Maintenance and Welfare of Parents and Senior Citizens Act, 2007', u: 'https://www.indiacode.nic.in' },
    sma: { t: 'Special Marriage Act, 1954', u: 'https://www.indiacode.nic.in' },
    dv: { t: 'Protection of Women from Domestic Violence Act, 2005', u: 'https://www.indiacode.nic.in' },
    bnss: { t: 'Bharatiya Nagarik Suraksha Sanhita, 2023', u: 'https://www.indiacode.nic.in' },
    bns: { t: 'Bharatiya Nyaya Sanhita, 2023', u: 'https://www.indiacode.nic.in' },
    nalsa: { t: 'NALSA — free legal aid', u: 'https://nalsa.gov.in' },
    labourCodes: { t: 'Labour Codes (in force from 21 Nov 2025) — Ministry of Labour', u: 'https://labour.gov.in' },
    posh: { t: 'Sexual Harassment of Women at Workplace Act, 2013 and SHe-Box', u: 'https://shebox.wcd.gov.in' },
    msme: { t: 'MSMED Act, 2006 and MSME ODR portal', u: 'https://msme.gov.in' },
    ibc: { t: 'Insolvency and Bankruptcy Code, 2016', u: 'https://ibbi.gov.in' },
    companies: { t: 'Companies Act, 2013 (MCA)', u: 'https://www.mca.gov.in' },
    fema: { t: 'FEMA and RBI rules on NRI property and repatriation', u: 'https://www.rbi.org.in' },
    itAct2025: { t: 'Income-tax Act, 2025 (in force 1 Apr 2026)', u: 'https://incometaxindia.gov.in' },
    madad: { t: 'MADAD consular grievance portal (MEA)', u: 'https://madad.gov.in' },
    hindu: { t: 'Hindu Marriage Act, 1955 and Hindu Succession Act, 1956', u: 'https://www.indiacode.nic.in' },
    ucc: { t: 'Uttarakhand Uniform Civil Code — registration portal', u: 'https://ucc.uk.gov.in' },
    trai: { t: 'TRAI consumer complaint framework; Vodafone Idea v. Ajay Kumar Agarwal (SC, 2022)', u: 'https://www.trai.gov.in' },
    imc: { t: 'Indian Medical Council (Professional Conduct) Regulations, 2002 — records within 72 hours', u: 'https://www.nmc.org.in' }
  };
  const MAP = {
    'upi-cyber-fraud': ['rbiFraud', 'cyber', 'rbiIOS'], 'bank-account-frozen': ['rbiIOS', 'bnss'], 'failed-payment-debited': ['rbiIOS'],
    'cheque-bounce': ['ni138', 'sanjabij'], 'money-lent-not-returned': ['ni138', 'sanjabij'], 'loan-recovery': ['rbiIOS', 'rbiDL'], 'credit-card-dispute': ['rbiFraud', 'rbiIOS'], 'credit-report-error': ['rbiIOS'],
    'digital-arrest-scam': ['cyber', 'rbiFraud'], 'job-investment-scam': ['cyber', 'sachet', 'rbiFraud'], 'loan-app-harassment': ['rbiDL', 'sachet', 'cyber'], 'bank-service': ['rbiIOS', 'irdai'],
    'refund-refused': ['cpa', 'nch', 'ejag'], 'defective-product': ['cpa', 'nch', 'ejag'], 'ecommerce-order': ['ecom', 'nch', 'ejag'], 'travel-refund': ['dgca', 'nch'], 'telecom-internet': ['trai', 'cpa'],
    'insurance-claim': ['irdai', 'bima'], 'builder-delay': ['rera', 'cpa'], 'road-accident': ['mvStay', 'janVishwas'], 'traffic-challan': ['cmvr2026', 'janVishwas', 'echallan'],
    'medical-negligence': ['imc', 'cpa'], 'electricity-bill': ['elec'], 'education-dispute': ['ugcFee'], 'ragging': ['ugcRag'],
    'divorce-separation': ['hindu', 'sma', 'bnss'], 'maintenance': ['bnss', 'dv'], 'domestic-violence': ['dv'], 'child-custody': ['hindu'], 'dowry-cruelty': ['bns', 'dv'], 'inheritance-partition': ['hindu'],
    'court-marriage': ['sma', 'ucc'], 'parents-maintenance': ['senior', 'bnss'], 'death-claims': ['rbiDeceased', 'epfo'], 'live-in': ['dv', 'bnss', 'ucc'], 'gender-identity': ['trans', 'transPortal'],
    'rental-security-deposit': ['cpa'], 'eviction-tenancy': ['bnss'], 'land-encroachment': ['bnss'], 'property-purchase': ['rera', 'itAct2025'],
    'unpaid-salary': ['labourCodes'], 'wrongful-termination': ['labourCodes'], 'workplace-harassment': ['posh'], 'pf-gratuity': ['coss', 'epfo'], 'gig-worker': ['coss', 'eshram'], 'internship-creator-pay': ['labourCodes'],
    'police-complaint': ['bnss'], 'accused-arrest': ['bnss', 'nalsa'], 'police-stop': ['bnss', 'nalsa'], 'legal-notice-received': ['nalsa'],
    'online-harassment': ['itRules', 'cyber'], 'intimate-images': ['itRules', 'cyber'], 'account-hacked': ['itRules', 'cyber'], 'gaming-betting': ['gaming', 'cyber'],
    'nri-property': ['fema', 'madad'], 'nri-sale-repatriation': ['fema', 'itAct2025'], 'nri-poa': ['madad'], 'nri-marriage': ['madad', 'hindu'], 'nri-case-abroad': ['madad', 'bnss'], 'nri-bank-tax': ['fema', 'itAct2025'],
    'business-unpaid': ['msme', 'ibc'], 'shareholder-dispute': ['companies'], 'partnership-dispute': ['companies'], 'contract-breach': ['ibc'], 'ip-brand': ['companies'], general: ['nalsa']
  };
  I.forEach((i) => { i.checked = CHECKED; i.sources = (MAP[i.id] || ['nalsa']).map((k) => SRC[k]).filter(Boolean); });

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
