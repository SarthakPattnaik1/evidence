/* "Where you stand" — plain-language situation check for existing guides.
   k: good = helps you, risk = watch out, next = what usually comes next. Draft, not advocate-reviewed. */
(function (root) {
  const { W, ALL, ANY, NOT } = root.ER_H;
  const KB = root.ER_KB;
  const S = {
    'cheque-bounce': [
      { k: 'good', when: ALL(W('cb_side', 'payee'), W('cb_memo_when', 'd15', 'd30')), text: 'You are inside the 30-day window to send the demand notice.' },
      { k: 'risk', when: ALL(W('cb_side', 'payee'), W('cb_memo_when', 'over30'), W('cb_notice_sent', 'no')), text: 'The 30 days to send a notice have passed — a criminal case may be out, but you can still sue to recover the money.' },
      { k: 'good', when: W('cb_purpose', 'loan', 'goods'), text: 'A cheque given for a real debt is the strongest kind of cheque-bounce case.' },
      { k: 'risk', when: W('cb_purpose', 'security', 'blank'), text: 'Security and blank cheques are argued over a lot — the debt itself must be proved.' },
      { k: 'risk', when: W('cb_summons', 'warrant'), text: 'A warrant means you must appear or apply to the court quickly.' },
      { k: 'next', when: W('cb_settle', 'yes', 'maybe'), text: 'Most cheque cases end in settlement — courts and Lok Adalats encourage it.' }
    ],
    'upi-cyber-fraud': [
      { k: 'good', when: W('uf_reported', 'h1930', 'bank'), text: 'You reported it — that starts the freeze and the bank\'s liability clock.' },
      { k: 'good', when: ALL(W('uf_how', 'unauth', 'otp', 'remote'), W('uf_when', 'today', '3days')), text: 'Reported within 3 working days, RBI rules can limit your loss for unauthorised transactions.' },
      { k: 'risk', when: W('uf_how', 'tricked'), text: 'When you were tricked into paying, banks often refuse — RBI rules on this change from 1 January 2027.' },
      { k: 'risk', when: W('uf_when', 'older'), text: 'Older frauds are harder; money has usually moved on.' },
      { k: 'next', when: W('uf_bankresp', 'rejected', 'silent'), text: 'After 30 days or a rejection, go to the RBI Ombudsman (cms.rbi.org.in).' }
    ],
    'divorce-separation': [
      { k: 'good', when: W('dv_agree', 'all'), text: 'Agreeing on everything allows mutual-consent divorce — usually the fastest and cheapest route.' },
      { k: 'risk', when: W('dv_agree', 'no'), text: 'A contested divorce needs legal grounds and usually takes years — documents decide outcomes.' },
      { k: 'risk', when: W('dv_cert', 'no'), text: 'No marriage certificate — wedding photos, invitations and witnesses will prove the marriage.' },
      { k: 'next', when: W('dv_children', 'with_me', 'with_spouse', 'shared'), text: 'Custody and child support are decided on the child\'s welfare — school and care records help.' }
    ],
    'maintenance': [
      { k: 'good', when: W('mt_payer_income', 'docs'), text: 'Proof of the other side\'s income is what decides the amount — you have it.' },
      { k: 'risk', when: W('mt_payer_income', 'no'), text: 'Without income proof, courts rely on lifestyle evidence — gather what you can.' },
      { k: 'next', when: W('mt_order', 'unpaid'), text: 'An unpaid order can be enforced — arrears can be recovered and the court can act against the payer.' },
      { k: 'next', when: W('mt_order', 'none'), text: 'Ask for interim maintenance as soon as the case is filed.' }
    ],
    'rental-security-deposit': [
      { k: 'good', when: W('rd_paid', 'bank', 'cheque'), text: 'You paid through the bank — the deposit is easy to prove.' },
      { k: 'risk', when: W('rd_paid', 'cash'), text: 'A cash deposit needs a receipt or a written mention in the agreement.' },
      { k: 'good', when: W('rd_photos', 'both'), text: 'Move-in and move-out photos are the best answer to damage claims.' },
      { k: 'next', when: W('rd_demand', 'no'), text: 'A written demand (or lawyer\'s notice) usually comes before any case.' }
    ],
    'unpaid-salary': [
      { k: 'good', when: W('us_proof', 'letter', 'slips', 'bank', 'pf'), text: 'You can prove you were employed — that is half the case.' },
      { k: 'risk', when: W('us_proof', 'none'), text: 'Little proof of employment — messages, photos at work and co-worker statements help.' },
      { k: 'next', when: W('us_type', 'employee', 'daily'), text: 'Wage claims can go to the labour authority under the Code on Wages — free and quicker than court.' },
      { k: 'next', when: W('us_type', 'freelance'), text: 'As a freelancer this is a contract debt: demand notice, then a civil or commercial suit.' }
    ],
    'money-lent-not-returned': [
      { k: 'good', when: W('ml_how', 'bank', 'cheque'), text: 'Bank transfers prove the money went to them.' },
      { k: 'good', when: W('ml_since', 'admitted', 'paid'), text: 'An admission or part-payment in writing helps and can extend the time limit.' },
      { k: 'risk', when: ALL(W('ml_how', 'cash'), W('ml_written', 'none')), text: 'Cash with nothing in writing is hard to prove — look for any message mentioning the loan.' },
      { k: 'risk', when: W('ml_when', 'older'), text: 'Loans generally must be sued on within 3 years — check dates with an advocate.' }
    ],
    'refund-refused': [
      { k: 'good', when: W('rr_complained', 'ticket'), text: 'Your ticket number shows they had the chance to fix it.' },
      { k: 'next', when: NOT(W('rr_nch', 'yes')), text: 'The National Consumer Helpline (1915) settles many refunds without court.' },
      { k: 'risk', when: W('rr_when', 'older'), text: 'Consumer complaints must be filed within 2 years.' }
    ],
    'loan-recovery': [
      { k: 'good', when: W('lr_registered', 'yes'), text: 'A regulated lender must follow RBI\'s fair-recovery rules — you can complain to RBI.' },
      { k: 'risk', when: W('lr_notice_type', 's132'), text: 'A SARFAESI 13(2) notice gives 60 days — reply in writing and see an advocate.' },
      { k: 'risk', when: W('lr_notice_type', 'court', 'police'), text: 'A court or police notice needs a response by its date.' },
      { k: 'next', when: W('lr_problem', 'settle'), text: 'Get any settlement (OTS) in writing, and a no-dues certificate after paying.' }
    ],
    'road-accident': [
      { k: 'good', when: W('ra_fir', 'yes'), text: 'An FIR exists — it is the base document for the claims tribunal and insurer.' },
      { k: 'risk', when: W('ra_fir', 'no'), text: 'No FIR yet — ask police; the claim process depends on it.' },
      { k: 'next', when: W('ra_vehicle', 'hitrun'), text: 'Hit-and-run victims can claim fixed compensation under the government scheme.' },
      { k: 'next', when: W('ra_harm', 'injury', 'death'), text: 'Compensation is claimed before the Motor Accident Claims Tribunal; many settle in Lok Adalat.' }
    ],
    'police-complaint': [
      { k: 'next', when: W('pc_status', 'refused', 'noaction'), text: 'If police will not register an FIR, write to the Superintendent of Police, then apply to the magistrate.' },
      { k: 'good', when: W('pc_status', 'fir'), text: 'An FIR is registered — ask for your free copy and the investigating officer\'s name.' },
      { k: 'good', when: W('pc_evidence', 'cctv', 'digital', 'docs', 'medical'), text: 'You have independent evidence beyond your own statement.' },
      { k: 'risk', when: W('pc_evidence', 'cctv'), text: 'CCTV footage is often overwritten in days — ask for it to be preserved now.' }
    ],
    'insurance-claim': [
      { k: 'next', when: W('in_grievance', 'no'), text: 'Complain to the insurer\'s grievance cell first; the Ombudsman comes after.' },
      { k: 'next', when: W('in_reply_days', 'rejected', 'noreply'), text: 'You can now go to the Insurance Ombudsman — free, no lawyer needed.' },
      { k: 'good', when: ALL(W('in_type', 'health'), W('in_years', 'over5')), text: 'After 5 years of continuous cover, health insurers generally cannot reject a claim for non-disclosure, except fraud.' }
    ],
    'builder-delay': [
      { k: 'good', when: W('bd_rera', 'yes'), text: 'A RERA-registered project lets you claim interest or refund at RERA.' },
      { k: 'good', when: W('bd_group', 'yes'), text: 'Several buyers filing together carry more weight.' },
      { k: 'risk', when: W('bd_oc', 'no'), text: 'Without an occupancy certificate, taking possession has risks — ask before accepting.' }
    ],
    'domestic-violence': [
      { k: 'next', text: 'A Protection Officer or the police can help file under the Domestic Violence Act — you can ask for protection, residence and money orders.' },
      { k: 'good', when: W('dvx_medical', 'yes'), text: 'Medical records of injuries are strong evidence.' }
    ],
    'wrongful-termination': [
      { k: 'good', when: W('wt_role', 'worker'), text: 'As a "worker" you have stronger statutory protection against termination.' },
      { k: 'risk', when: W('wt_role', 'manager'), text: 'Managers usually have contract remedies (notice pay, damages) rather than reinstatement.' },
      { k: 'next', when: W('wt_dues', 'gratuity', 'pf'), text: 'PF and gratuity can be claimed separately — see the PF & gratuity guide.' }
    ],
    'bank-account-frozen': [
      { k: 'next', when: W('bf_reason', 'kyc'), text: 'KYC freezes are usually lifted once documents are accepted — get written acknowledgement.' },
      { k: 'next', when: W('bf_reason', 'police'), text: 'Police freezes need the investigating officer or a court to release — ask for the order.' },
      { k: 'risk', when: W('bf_written', 'no'), text: 'Ask the bank in writing for the reason and the authority behind the freeze.' }
    ],
    'failed-payment-debited': [
      { k: 'good', when: W('fp_days', 'd30', 'older'), text: 'The reversal deadline has passed — you may also be owed ₹100 per day compensation.' },
      { k: 'next', when: W('fp_complained', 'no'), text: 'Complain to your bank in writing; RBI comes after 30 days.' }
    ],
    'inheritance-partition': [
      { k: 'good', when: ALL(W('ip_law', 'hindu'), W('ip_me', 'child')), text: 'Under Hindu law, daughters and sons have equal shares.' },
      { k: 'risk', when: W('ip_released', 'yes'), text: 'A signed release of your share is hard to undo — show it to your advocate.' },
      { k: 'next', when: W('ip_problem', 'mutation'), text: 'Mutation updates revenue records; it does not by itself decide ownership.' }
    ],
    'accused-arrest': [
      { k: 'next', when: W('aa_stage', 'heard', 'fir'), text: 'You may be able to apply for anticipatory bail — speak to an advocate before any police visit.' },
      { k: 'next', when: W('aa_stage', 'notice'), text: 'A notice to appear usually means arrest is not required if you comply.' },
      { k: 'risk', when: W('aa_stage', 'warrant'), text: 'A warrant needs urgent action through an advocate.' }
    ],
    'eviction-tenancy': [
      { k: 'risk', when: W('ev_agreement', 'none', 'unregistered'), text: 'An unregistered or missing agreement weakens some claims — rent receipts and bank transfers help.' },
      { k: 'next', when: W('ev_side', 'landlord'), text: 'Eviction must go through the rent authority or court — never by force.' }
    ],
    'land-encroachment': [
      { k: 'good', when: W('le_possession', 'me'), text: 'You are in possession — courts protect settled possession.' },
      { k: 'next', when: W('le_problem', 'boundary'), text: 'An official survey/demarcation often settles boundary disputes.' }
    ],
    'legal-notice-received': [
      { k: 'next', text: 'Reply in time through an advocate if you disagree — silence is sometimes used against you.' }
    ],
    'online-harassment': [
      { k: 'next', text: 'Platforms must act on complaints about intimate or impersonating content; report it there and on cybercrime.gov.in.' }
    ],
    'child-custody': [
      { k: 'next', text: 'Courts decide on the child\'s welfare — schooling, care and stability records matter most.' }
    ],
    'dowry-cruelty': [
      { k: 'next', when: W('dc_side', 'accused'), text: 'Speak to an advocate about bail before responding to police.' },
      { k: 'next', when: W('dc_side', 'complainant'), text: 'Medical records, messages and witness details strengthen the complaint.' }
    ],
    'defective-product': [
      { k: 'good', when: W('dp_repairs', 'many'), text: 'Repeated failed repairs strongly support a replacement or refund.' },
      { k: 'next', text: 'The National Consumer Helpline, then the District Consumer Commission.' }
    ],
    'credit-card-dispute': [
      { k: 'good', when: ALL(W('cc_issue', 'fraud'), W('cc_when', 'd3')), text: 'Reported within 3 working days — RBI rules limit your liability for unauthorised use.' },
      { k: 'next', when: W('cc_reply', 'rejected', 'none'), text: 'Go to the RBI Ombudsman after 30 days or a rejection.' }
    ],
    'credit-report-error': [
      { k: 'next', when: W('cr_days', 'over30'), text: 'Unresolved after 30 days — you can claim compensation and complain to RBI.' }
    ],
    'nri-property': [
      { k: 'risk', when: W('np_since', 'long'), text: 'Long occupation by others can create claims — act without further delay.' },
      { k: 'good', when: W('np_poa', 'yes_good'), text: 'A working power of attorney lets someone act for you in India.' }
    ],
    'business-unpaid': [
      { k: 'good', when: W('bu_msme', 'yes'), text: 'As a registered micro or small supplier, you get statutory interest and the MSME council route.' },
      { k: 'risk', when: W('bu_dispute', 'before'), text: 'A complaint raised before your demand can block insolvency proceedings.' },
      { k: 'next', when: W('bu_amount', '3to100', 'over1cr'), text: 'Commercial suits usually need pre-litigation mediation first.' }
    ]
  };
  for (const iss of KB.issues) if (S[iss.id]) iss.stand = (iss.stand || []).concat(S[iss.id]);
})(typeof window !== 'undefined' ? window : globalThis);
