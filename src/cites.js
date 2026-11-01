/* Saboot citations: one place for every Act and judgment the app names.
   Each link was opened and its page title matched to the citation on 31 Oct 2026 (from Mumbai, and by page title):
   judgments and Acts on Indian Kanoon (free full text, stable addresses); rules and circulars on the official site.
   India Code moved from indiacode.nic.in to indiacode.gov.in in 2026 and its old deep links no longer open,
   so nothing links there. Where an exact page could not be confirmed, the citation is shown WITHOUT a link:
   a wrong link costs more trust than no link. test/sources.js enforces this. */
(function (root) {
  const IK = (n) => 'https://indiankanoon.org/doc/' + n + '/';
  const ACT = {
    lim: { t: 'Limitation Act, 1963', u: IK(1317393) },
    ni: { t: 'Negotiable Instruments Act, 1881', u: IK(1132672) },
    cpa: { t: 'Consumer Protection Act, 2019', u: IK(48103131) },
    rera: { t: 'Real Estate (Regulation and Development) Act, 2016', u: IK(65068227) },
    senior: { t: 'Maintenance and Welfare of Parents and Senior Citizens Act, 2007', u: IK(118724005) },
    sma: { t: 'Special Marriage Act, 1954', u: IK(4234) },
    dv: { t: 'Protection of Women from Domestic Violence Act, 2005', u: IK(542601) },
    bnss: { t: 'Bharatiya Nagarik Suraksha Sanhita, 2023', u: IK(91117739) },
    hma: { t: 'Hindu Marriage Act, 1955', u: IK(590166) },
    hsa: { t: 'Hindu Succession Act, 1956', u: IK(685111) },
    gwa: { t: 'Guardians and Wards Act, 1890', u: IK(1874830) },
    hmga: { t: 'Hindu Minority and Guardianship Act, 1956', u: IK(76168618) },
    contract: { t: 'Indian Contract Act, 1872', u: IK(171398) },
    sra: { t: 'Specific Relief Act, 1963', u: IK(1671917) },
    tm: { t: 'Trade Marks Act, 1999', u: IK(1017213) },
    copyright: { t: 'Copyright Act, 1957', u: IK(1136195) },
    tpa: { t: 'Transfer of Property Act, 1882', u: IK(515323) },
    posh: { t: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013', u: IK(35616442) },
    msmed: { t: 'Micro, Small and Medium Enterprises Development Act, 2006', u: IK(352833) },
    // exact page not yet confirmed — shown as text only
    bns: { t: 'Bharatiya Nyaya Sanhita, 2023', u: '' },
    partnership: { t: 'Indian Partnership Act, 1932 and Limited Liability Partnership Act, 2008', u: '' },
    companies: { t: 'Companies Act, 2013', u: '' },
    ibc: { t: 'Insolvency and Bankruptcy Code, 2016', u: '' },
    jj: { t: 'Juvenile Justice (Care and Protection of Children) Act, 2015', u: '' },
    succession: { t: 'Indian Succession Act, 1925 and Registration Act, 1908', u: '' },
    commercial: { t: 'Commercial Courts Act, 2015', u: '' },
    mv: { t: 'Motor Vehicles Act, 1988', u: '' },
    landAcq: { t: 'Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013', u: '' },
    scst: { t: 'Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989', u: '' },
    pocso: { t: 'Protection of Children from Sexual Offences Act, 2012', u: '' }
  };
  // name as it appears in the text → full citation and link
  const CASE = {
    'Amardeep Singh v. Harveen Kaur': { t: 'Amardeep Singh v. Harveen Kaur, Supreme Court, 12 Sep 2017 — (2017) 8 SCC 746', u: IK(79830357) },
    'Rajnesh v. Neha': { t: 'Rajnesh v. Neha, Supreme Court, 4 Nov 2020 — (2021) 2 SCC 324', u: IK(117541087) },
    'Vineeta Sharma v. Rakesh Sharma': { t: 'Vineeta Sharma v. Rakesh Sharma, Supreme Court, 11 Aug 2020 — (2020) 9 SCC 1', u: IK(67965481) },
    'Shakti Yezdani v. Jayanand Salgaonkar': { t: 'Shakti Yezdani v. Jayanand Jayant Salgaonkar, Supreme Court, 14 Dec 2023', u: IK(166607072) },
    'Pratibha Rani v. Suraj Kumar': { t: 'Pratibha Rani v. Suraj Kumar, Supreme Court, 12 Mar 1985 — (1985) 2 SCC 370', u: IK(1684706) },
    'Imperia Structures v. Anil Patni': { t: 'Imperia Structures Ltd. v. Anil Patni, Supreme Court, 2 Nov 2020 — (2020) 10 SCC 783', u: IK(122264633) },
    'Jitendra Singh v. State of MP': { t: 'Jitendra Singh v. State of Madhya Pradesh, Supreme Court, 6 Sep 2021 — 2021 SCC OnLine SC 802', u: IK(104309066) },
    'Lalita Kumari v. Govt of UP': { t: 'Lalita Kumari v. Govt. of U.P., Supreme Court (Constitution Bench), 12 Nov 2013 — (2014) 2 SCC 1', u: IK(10239019) },
    'Arnesh Kumar v. State of Bihar': { t: 'Arnesh Kumar v. State of Bihar, Supreme Court, 2 Jul 2014 — (2014) 8 SCC 273', u: IK(2982624) },
    'Y. Narasimha Rao v. Y. Venkata Lakshmi': { t: 'Y. Narasimha Rao v. Y. Venkata Lakshmi, Supreme Court, 9 Jul 1991 — (1991) 3 SCC 451', u: IK(989920) },
    'Patil Automation v. Rakheja Engineers': { t: 'Patil Automation Pvt. Ltd. v. Rakheja Engineers Pvt. Ltd., Supreme Court, 17 Aug 2022 — (2022) 10 SCC 1', u: IK(164693074) },
    'Vodafone Idea v. Ajay Kumar Agarwal': { t: 'Vodafone Idea Cellular Ltd. v. Ajay Kumar Agarwal, Supreme Court, 16 Feb 2022 — (2022) 6 SCC 496 (Indian Kanoon lists it with the connected appeal M. Lakshman Bhakta v. Vodafone Idea)', u: IK(149138346) },
    'Sanjabij Tari v. Kishore S. Borcar': { t: 'Sanjabij Tari v. Kishore S. Borcar, Supreme Court, 25 Sep 2025 — 2025 INSC 1158', u: IK(198100584) },
    'ICICI Lombard v. Ayiti Navaneetha': { t: 'ICICI Lombard General Insurance Co. Ltd. v. Ayiti Navaneetha, Supreme Court interim order, 4 Nov 2025', u: IK(199850448) },
    // named in short answers (src/qa2.js); exact page not yet confirmed — shown as text only
    'Mohd. Abdul Samad v. State of Telangana': { t: 'Mohd. Abdul Samad v. State of Telangana, Supreme Court, 10 Jul 2024', u: '' },
    'D. Velusamy v. D. Patchaiammal': { t: 'D. Velusamy v. D. Patchaiammal, Supreme Court, 21 Oct 2010 — (2010) 10 SCC 469', u: '' },
    'Satish Chander Ahuja v. Sneha Ahuja': { t: 'Satish Chander Ahuja v. Sneha Ahuja, Supreme Court, 15 Oct 2020 — (2021) 1 SCC 414', u: '' },
    'Sudesh Chhikara v. Ramti Devi': { t: 'Sudesh Chhikara v. Ramti Devi, Supreme Court, 2 Dec 2022', u: '' },
    'Revanasiddappa v. Mallikarjun': { t: 'Revanasiddappa v. Mallikarjun, Supreme Court (three judges), 1 Sep 2023', u: '' },
    'Suraj Lamp v. State of Haryana': { t: 'Suraj Lamp & Industries Pvt. Ltd. v. State of Haryana, Supreme Court, 11 Oct 2011 — (2012) 1 SCC 656', u: '' },
    'Parmanand Katara v. Union of India': { t: 'Parmanand Katara v. Union of India, Supreme Court, 28 Aug 1989 — (1989) 4 SCC 286', u: '' },
    'Bachpan Bachao Andolan v. Union of India': { t: 'Bachpan Bachao Andolan v. Union of India, W.P.(C) 75 of 2012, Supreme Court orders of 17 Jan 2013 and 10 May 2013', u: '' }
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
  // Turn a plain "Law:" line into HTML with every known case linked to its judgment.
  function linkify(text) {
    let out = esc(text);
    for (const [name, c] of Object.entries(CASE)) {
      const re = new RegExp(esc(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      out = out.replace(re, c.u ? `<a href="${c.u}" target="_blank" rel="noopener" title="${esc(c.t)}">${esc(name)}</a>` : esc(name));
    }
    return out;
  }
  root.ER_CITE = { ACT, CASE, IK, linkify, host };
})(typeof window !== 'undefined' ? window : globalThis);
