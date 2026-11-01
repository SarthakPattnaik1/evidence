/* Everyday situations, in the words people use, each opening the right guide with matching answers
   already filled in (the person can change them). They add NO new legal claims: every fact shown comes from
   the guide it opens. A situation with no fitting guide is a gap to be built, not a reason to invent law.
   Checked by test/situations.js: every guide, question and answer id must exist. Nov 2026. */
(function (root) {
  const KB = root.ER_KB; const out = [];
  const G = (g, rows) => rows.forEach(([t, s, pre, note]) => out.push({ g, t, s: s ? s.split('|') : [], pre: pre || null, note: note || null }));

  /* ---------------- MONEY, BANKS, FRAUD ---------------- */
  G('upi-cyber-fraud', [
    ['Money gone after I accepted a UPI collect request', 'collect request|upi request|approved request by mistake', { uf_how: 'tricked', uf_mode: 'upi' }, 'Call 1930 at once — the faster you report, the more can be frozen.'],
    ['Scammer told me to scan a QR code to “receive” money', 'qr code scam|scan to receive|qr fraud', { uf_how: 'tricked', uf_mode: 'upi' }, 'Call 1930 at once.'],
    ['I shared an OTP and money was taken', 'shared otp|otp fraud|gave otp', { uf_how: 'otp' }, 'Call 1930 at once.'],
    ['Money taken after I installed a screen-sharing app', 'anydesk|teamviewer|quick support|screen share fraud|remote app', { uf_how: 'remote' }, 'Uninstall the app, change your bank passwords from another phone, and call 1930.'],
    ['Fake customer care number took my money', 'fake customer care|customer care fraud|google number fraud|helpline scam', { uf_how: 'tricked' }, 'Call 1930 at once.'],
    ['Money taken from my account by fraud — I did nothing', 'unauthorised debit|unauthorized transaction|money deducted without otp|money deducted fraud|fraud debit', { uf_how: 'unauth' }, 'Report to your bank in writing within 3 days — your liability can be zero.'],
    ['Card cloned and used at an ATM or shop', 'card cloning|skimming|atm skimmer|card used without me', { uf_how: 'unauth', uf_mode: 'card' }, 'Block the card and tell your bank in writing today.'],
    ['Fraud through a fake electricity-bill disconnection message', 'electricity bill scam|power cut message|light bill fraud', { uf_how: 'tricked' }, 'Call 1930 at once.'],
    ['Fake KYC update link emptied my account', 'kyc update scam|kyc link|kyc expired message', { uf_how: 'tricked' }, 'Call 1930 at once.'],
    ['Scam on OLX or a selling site — buyer “sent” money', 'olx fraud|olx scam|quikr fraud|army officer buyer|marketplace selling scam', { uf_how: 'tricked', uf_mode: 'upi' }, 'Call 1930 at once.'],
    ['Paid an advance online for a rental flat that did not exist', 'fake rental listing|rental advance scam|flat booking fraud', { uf_how: 'tricked' }],
    ['Fake relative or friend asked for urgent money on WhatsApp', 'hacked whatsapp asking money|fake friend money|impersonation money request', { uf_how: 'tricked' }],
    ['Money lost through a fake courier or parcel call', 'fedex scam|courier scam|parcel drugs call|customs parcel', { uf_how: 'tricked' }],
    ['Paid for a fake online shopping website', 'fake website|fake shopping site|cheap sale fraud|instagram shop scam', { uf_how: 'tricked' }],
    ['SIM swapped and money taken from my bank', 'sim swap|sim card blocked suddenly|duplicate sim', { uf_how: 'unauth' }, 'Call your telecom company and bank, and 1930, right away.'],
    ['Older parent tricked into giving bank details', 'senior citizen fraud|elderly parent scammed|grandparent scam', { uf_how: 'tricked' }, 'Call 1930 at once.'],
    ['Money lost to a fake loan offer asking for a “processing fee”', 'loan processing fee scam|fake loan offer|advance fee loan', { uf_how: 'tricked' }],
    ['Fraud reported days ago and bank is not refunding', 'bank not refunding fraud|zero liability|chargeback fraud', { uf_reported: 'bank' }],
    ['Lost money to a fake lottery or prize message', 'lottery scam|kbc lottery|prize winner message|lucky draw scam', { uf_how: 'tricked' }],
    ['Paid a fake matrimonial or dating match who asked for money', 'dating scam|romance scam|matrimonial fraud|gift customs fee', { uf_how: 'tricked' }]
  ]);
  G('digital-arrest-scam', [
    ['Video call from “CBI” or “police” saying I am under digital arrest', 'cbi call|ed call|video call police|digital arrest', { da_now: 'ongoing' }, 'Disconnect now. No agency arrests anyone on a video call.'],
    ['Told my Aadhaar was used for money laundering', 'aadhaar money laundering call|aadhaar misused call', null, 'This is a known scam. Disconnect and call 1930.'],
    ['Paid money to “clear my name” on a police video call', 'paid fake police|verification money|safe account transfer', { da_paid: 'yes' }, 'Call 1930 now — money can still be frozen.'],
    ['Call saying a parcel in my name has drugs', 'drugs parcel call|customs parcel call|parcel with my aadhaar', null, 'This is a known scam. Disconnect and call 1930.'],
    ['Fake TRAI call saying my number will be cut', 'trai call|number disconnected call|mobile number block call', null, 'This is a known scam. Disconnect.'],
    ['Family member is on a long video call with “officers” and won’t hang up', 'parent on video call scam|kept on call for hours', { da_now: 'ongoing' }, 'Help them disconnect now. No real officer does this.']
  ]);
  G('job-investment-scam', [
    ['Paid to do “tasks” like liking videos and can’t withdraw', 'task scam|like youtube video job|telegram task|prepaid task', { js_kind: 'task' }, 'Stop paying. Call 1930.'],
    ['Stock tips group showed fake profits and won’t let me withdraw', 'fake trading app|stock tips telegram|ipo scam group|withdrawal blocked', { js_kind: 'trading' }, 'Stop paying any “tax” or “fee” to withdraw.'],
    ['Paid a registration fee for a job that never came', 'job registration fee|fake job offer|job scam|offer letter fee', { js_kind: 'job' }],
    ['Fake overseas job agent took my money', 'abroad job scam|gulf job fraud|visa agent fraud|overseas recruitment fraud', { js_kind: 'job' }, 'Check the agent on eMigrate before paying anyone more.'],
    ['Crypto platform froze my money', 'crypto scam|crypto withdrawal blocked|usdt scam|bitcoin fraud', { js_kind: 'crypto' }],
    ['Invested in a scheme that promised double money', 'double money scheme|ponzi|chain scheme|mlm fraud', { js_kind: 'deposit' }],
    ['Work-from-home typing or data-entry job asked for deposit', 'data entry job scam|typing job fraud|work from home fraud', { js_kind: 'job' }],
    ['Paid “security deposit” for a delivery or franchise job', 'franchise scam|dealership fraud|distributorship scam', { js_kind: 'deposit' }],
    ['Lost money in a “hotel review” or “rating” job', 'hotel rating job|paid rating task|review task scam', { js_kind: 'task' }]
  ]);
  G('loan-app-harassment', [
    ['Loan app is calling everyone in my contacts', 'loan app calling contacts|recovery calls to friends', { la_problem: 'contacts' }],
    ['Loan app made morphed photos of me', 'loan app morphed photo|obscene photo loan app', { la_problem: 'morph' }, 'Report on cybercrime.gov.in and 1930 today.'],
    ['Got money in my account from a loan app I never asked for', 'unasked loan|loan credited without applying|fake disbursement', { la_problem: 'unasked' }],
    ['Paid back but loan app still demands more', 'repaid still harassed|loan app extra money', { la_problem: 'charges', la_repaid: 'repaid' }],
    ['Loan app abuses me in calls and messages', 'loan app abuse|loan app threats|recovery agent abuse', { la_problem: 'abuse' }],
    ['Got ₹3,000 but have to repay ₹6,000 in a week', 'loan app hidden charges|high interest loan app|short tenure loan', { la_problem: 'charges' }]
  ]);
  G('bank-account-frozen', [
    ['Bank froze my account because of a cyber complaint', 'account frozen cyber|lien cyber cell|debit freeze police', { bf_reason: 'police' }],
    ['Got money from a stranger and now my account is frozen', 'received fraud money|frozen after receiving upi', { bf_reason: 'police' }],
    ['Account frozen for KYC not updated', 'kyc freeze|account blocked kyc|re-kyc', { bf_reason: 'kyc' }],
    ['Only part of my balance is on hold', 'partial freeze|lien amount|amount on hold', { bf_scope: 'partial' }],
    ['Freelancer payment from abroad got my account frozen', 'foreign payment freeze|paypal frozen account|crypto p2p freeze', { bf_reason: 'suspicious' }],
    ['Payment failed and I learned my account is blocked', 'transaction failed account blocked|debit freeze discovered', { bf_how: 'txn_failed' }],
    ['Income tax or court order froze my account', 'tax attachment|garnishee|court attachment', { bf_reason: 'order' }]
  ]);
  G('failed-payment-debited', [
    ['UPI payment failed but money left my account', 'upi failed money deducted|transaction failed amount debited', { fp_mode: 'upi_p2p', fp_status: 'failed' }],
    ['ATM did not give cash but my account was debited', 'atm no cash|atm debited no cash|cash not dispensed', { fp_mode: 'atm' }],
    ['Shop card machine failed but I was charged', 'pos failed charged|swipe failed debited', { fp_mode: 'card_pos' }],
    ['Paid a merchant on UPI, shop says not received', 'merchant not received upi|shop says payment not came', { fp_mode: 'upi_merchant' }],
    ['IMPS or bank transfer stuck for days', 'imps pending|neft not credited|transfer pending', { fp_mode: 'imps' }],
    ['Sent money to the wrong UPI ID or account', 'wrong upi transfer|sent money wrong person|wrong account number', { fp_mode: 'upi_p2p', fp_status: 'success' }, 'Complain to your bank in writing today; the receiver’s bank is asked to contact them.'],
    ['Online card payment failed but money not returned', 'card payment failed refund|payment gateway debited', { fp_mode: 'card_online' }]
  ]);
  G('cheque-bounce', [
    ['A cheque I received bounced for insufficient funds', 'insufficient funds cheque|funds insufficient|cheque returned unpaid', { cb_side: 'payee', cb_reason: 'funds' }],
    ['The person stopped payment on the cheque he gave me', 'stop payment cheque|payment stopped by drawer', { cb_side: 'payee', cb_reason: 'stopped' }],
    ['Cheque bounced because the account was closed', 'account closed cheque', { cb_side: 'payee', cb_reason: 'closed' }],
    ['Cheque bounced for signature mismatch', 'signature differs cheque|signature mismatch', { cb_side: 'payee', cb_reason: 'signature' }],
    ['I gave a cheque and it bounced — what now?', 'my cheque bounced|i issued cheque bounced', { cb_side: 'drawer' }],
    ['Got a cheque bounce notice — I gave the cheque', 'section 138 notice received|cheque bounce notice received', { cb_side: 'drawer_notice' }, 'Paying within 15 days of receiving the notice usually ends the matter.'],
    ['Security cheque I gave years ago was misused', 'security cheque misused|blank cheque misuse', { cb_side: 'drawer' }],
    ['Got a court summons in a cheque bounce case', '138 case summons|cheque case court notice', { cb_side: 'drawer_notice' }],
    ['Rent or salary cheque bounced', 'rent cheque bounced|salary cheque bounced', { cb_side: 'payee' }],
    ['Bank memo date is near 30 days and I haven’t sent notice', 'cheque notice deadline|30 days notice cheque', { cb_side: 'payee', cb_notice_sent: 'no' }, 'The notice must go within 30 days of the bank memo.']
  ]);
  G('loan-recovery', [
    ['Recovery agents come home and threaten my family', 'recovery agent at home|goons for loan|agents threatening', { lr_problem: 'calls' }],
    ['Bank sent a SARFAESI notice for my home loan', 'sarfaesi notice|13(2) notice|possession notice home loan', { lr_type: 'home', lr_problem: 'notice' }, 'You usually have 60 days to reply. Show it to an advocate now.'],
    ['Car or bike was seized for missed EMIs', 'vehicle seized emi|car repossessed|bike taken by agents', { lr_type: 'vehicle', lr_problem: 'possession' }],
    ['Paid off my loan but bank won’t give the NOC or papers', 'loan noc not given|original documents not returned|property papers after loan', { lr_problem: 'noc', lr_overdue: 'closed' }, 'Banks must return property papers within 30 days of closure, or pay a penalty.'],
    ['Want a one-time settlement with the bank', 'ots|one time settlement|loan settlement', { lr_problem: 'settle' }],
    ['Bank added charges I don’t understand to my loan', 'loan hidden charges|penal interest|foreclosure charges', { lr_problem: 'charges' }],
    ['Gold loan company wants to auction my gold', 'gold auction notice|gold loan auction', { lr_type: 'gold', lr_problem: 'notice' }],
    ['I lost my job and can’t pay EMIs', 'cannot pay emi|job loss emi|restructure loan', { lr_overdue: 'm1' }],
    ['Lender calls me at night and on holidays', 'recovery calls night|calls after 7 pm', { lr_problem: 'calls' }, 'Recovery calls are allowed only between 8 am and 7 pm.'],
    ['Business loan in default and bank is threatening', 'msme loan default|business loan npa', { lr_type: 'business' }],
    ['Bank says I am a guarantor for someone’s loan', 'guarantor notice|guarantor liability loan', { lr_problem: 'notice' }],
    ['Loan declared NPA and account marked as fraud', 'npa|wilful defaulter|fraud classification', { lr_overdue: 'm3' }]
  ]);
  G('credit-card-dispute', [
    ['Card company charged annual fees they promised were free', 'lifetime free card charged|annual fee waiver', { cc_issue: 'charges' }],
    ['Card closed and paid off but still getting bills', 'closed card still billed|card closure not done', { cc_issue: 'closure' }, 'A card must be closed within 7 working days of your request.'],
    ['Got a credit card I never applied for', 'card without consent|unsolicited credit card', { cc_issue: 'unsolicited' }],
    ['Paid by card, merchant did not deliver — want chargeback', 'chargeback|card dispute merchant', { cc_issue: 'merchant' }],
    ['Card used for transactions I didn’t make', 'card fraud transactions|unknown card transactions', { cc_issue: 'fraud' }],
    ['Card recovery agents harassing me', 'credit card recovery calls', { cc_issue: 'recovery' }],
    ['Late fee and interest piled up on a small amount', 'credit card interest high|late payment fee', { cc_issue: 'charges' }]
  ]);
  G('credit-report-error', [
    ['CIBIL shows a loan I never took', 'cibil wrong loan|fraud loan in my name|unknown loan cibil', { cr_error: 'notmine' }, 'This may be identity fraud — also report on cybercrime.gov.in.'],
    ['Closed loan still shows active in CIBIL', 'cibil not updated|loan closed still showing', { cr_error: 'active' }],
    ['Settled loan is hurting my credit score', 'settled status cibil|written off cibil', { cr_error: 'settled' }],
    ['CIBIL shows late payments I never made', 'wrong dpd|late payment wrong cibil', { cr_error: 'dpd' }],
    ['My name or PAN is wrong in my credit report', 'cibil wrong pan|wrong details credit report', { cr_error: 'personal' }],
    ['Loan rejected because of a wrong credit report', 'loan rejected cibil|low score wrong entry', null],
    ['Disputed with the credit bureau but nothing changed in 30 days', 'cibil dispute no response|bureau not correcting', { cr_disputed: 'bureau', cr_days: 'over30' }, 'Bureaus that miss the 30-day deadline must pay compensation of ₹100 a day.']
  ]);
  G('bank-service', [
    ['Bank sold me insurance saying it was a fixed deposit', 'insurance sold as fd|mis-selling bank|told it was fd', { bs_problem: 'missell' }],
    ['Bank deducted minimum balance charges', 'minimum balance penalty|charges deducted bank', { bs_problem: 'charges' }],
    ['Valuables missing from my bank locker', 'locker theft|locker items missing', { bs_problem: 'locker' }, 'Banks can be liable for up to 100 times the annual locker rent.'],
    ['Bank closed my account without telling me', 'account closed without notice', { bs_problem: 'closed' }],
    ['Bank branch refuses to serve my elderly parent', 'senior citizen bank|doorstep banking|bank not helping elderly', { bs_problem: 'senior' }],
    ['Bank is not answering my complaint for weeks', 'bank no reply complaint|rbi ombudsman', { bs_complained: 'ref', bs_days: 'o30' }, 'After 30 days with no reply, you can go to the RBI Ombudsman.'],
    ['Cheque book or debit card charges I never asked for', 'unwanted charges bank|sms charges', { bs_problem: 'charges' }],
    ['Fixed deposit broken or not paid on maturity', 'fd not paid|fd maturity not credited', { bs_problem: 'service' }],
    ['Nominee not being paid the money in a bank account', 'nominee claim bank|deceased account money', { bs_problem: 'service' }],
    ['Bank refuses to open an account for me', 'account opening refused|basic savings account refused', { bs_problem: 'service' }]
  ]);
  G('money-lent-not-returned', [
    ['Lent money to a friend and he is not returning it', 'friend not returning money|loan to friend', { ml_how: 'bank' }],
    ['Gave cash to a relative, nothing in writing', 'cash loan relative|no proof loan', { ml_how: 'cash', ml_written: 'none' }],
    ['Lent money and only have WhatsApp chats as proof', 'whatsapp proof loan|chat proof money', { ml_written: 'messages' }],
    ['Borrower admits the debt but keeps delaying', 'keeps delaying payment|promises to pay', { ml_since: 'admitted' }],
    ['Lent money over three years ago', 'old loan time limit|3 years loan recovery', { ml_when: 'older' }, 'Time limits apply — the time-limit card in your list will show the date.'],
    ['Gave money for a business that never started', 'investment in friend business|money given for business', null],
    ['Ex-partner borrowed money and stopped talking', 'ex borrowed money|girlfriend boyfriend money', null],
    ['Paid a deposit to someone for a deal that fell through', 'advance returned not|deal cancelled advance', null]
  ]);
  G('tax-notice', [
    ['Got an income tax notice asking me to explain', 'income tax notice|143(1)|scrutiny notice', { tx_kind: 'income', tx_type: 'explain' }],
    ['Income tax demand I don’t agree with', 'tax demand wrong|outstanding demand', { tx_kind: 'income', tx_type: 'demand' }],
    ['Old income tax case reopened', 'reassessment|148 notice|reopened assessment', { tx_kind: 'income', tx_type: 'reopen' }],
    ['Income tax refund not received', 'tax refund delayed|refund not credited', { tx_kind: 'income', tx_type: 'refund' }],
    ['GST notice for my small business', 'gst notice|gst show cause|asmt 10', { tx_kind: 'gst', tx_type: 'explain' }],
    ['GST registration cancelled', 'gst cancelled|gstin cancelled', { tx_kind: 'gst', tx_type: 'cancel' }],
    ['Tax notice deadline has passed', 'missed tax notice deadline', { tx_deadline: 'passed' }, 'Reply as soon as possible and ask for more time in writing.'],
    ['Notice about high-value cash deposit', 'cash deposit notice|sft notice|demonetisation notice', { tx_kind: 'income', tx_type: 'explain' }],
    ['Someone used my PAN for transactions I don’t know', 'pan misused|pan used for gst|fake gst on my pan', { tx_kind: 'income' }]
  ]);
  G('securities-complaint', [
    ['Broker did trades in my account without asking', 'unauthorised trades broker|dealer traded without consent', { sc_who: 'broker', sc_what: 'trades' }],
    ['Shares not credited to my demat account', 'shares not received demat|shares missing', { sc_who: 'dp', sc_what: 'funds' }],
    ['Mutual fund redemption money not received', 'redemption not credited|mutual fund money stuck', { sc_who: 'mf', sc_what: 'funds' }],
    ['SIP still deducted after I stopped it', 'sip not stopped|sip cancel not processed', { sc_who: 'mf', sc_what: 'close' }],
    ['Dividend from a company never reached me', 'dividend not received|unpaid dividend', { sc_who: 'company', sc_what: 'transfer' }],
    ['Transfer my late father’s shares to my name', 'transmission of shares|shares of deceased|old share certificates', { sc_who: 'company', sc_what: 'transfer' }],
    ['Paid an “adviser” on Telegram for stock tips and lost money', 'telegram tips|stock tips fraud|fake advisor', { sc_who: 'adviser', sc_what: 'advice' }],
    ['Broker charged huge margin penalty', 'margin penalty|broker charges wrong', { sc_who: 'broker', sc_what: 'charges' }],
    ['Trading account closure not done', 'close demat account|account closure broker', { sc_who: 'broker', sc_what: 'close' }],
    ['IPO money blocked but shares not allotted or refund delayed', 'ipo refund|ipo unblock|asba not released', { sc_who: 'company', sc_what: 'funds' }]
  ]);

  /* ---------------- SHOPPING, SERVICES, CONSUMER ---------------- */
  G('ecommerce-order', [
    ['Online order never arrived but shows delivered', 'shows delivered not received|fake delivery', { ec_problem: 'notdel' }],
    ['Got a brick or empty box instead of the phone', 'empty box|stone in parcel|wrong item delivered', { ec_problem: 'wrong' }],
    ['Received a fake or used product online', 'fake product online|duplicate item|used product sold as new', { ec_problem: 'fake' }],
    ['Seller refuses to accept a return', 'return rejected|no return policy|return denied', { ec_problem: 'return' }],
    ['Order cancelled but money not refunded', 'cancelled order refund|refund pending online', { ec_problem: 'cancel' }],
    ['Damaged item delivered and seller blames courier', 'damaged parcel|broken item delivered', { ec_problem: 'damaged' }],
    ['Cash on delivery order — delivery person took extra money', 'cod extra money|delivery boy fraud', { ec_paid: 'cod' }],
    ['Instagram seller took money and blocked me', 'instagram seller scam|insta shop fraud', { ec_problem: 'notdel' }]
  ]);
  G('refund-refused', [
    ['Coaching or course refused to refund fees', 'coaching fee refund|online course refund|edtech refund', { rr_what: 'service', rr_problem: 'cancelled' }],
    ['Gym membership — they won’t refund after closing', 'gym refund|gym closed', { rr_what: 'service', rr_problem: 'poorservice' }],
    ['Wedding hall or caterer won’t return the advance', 'wedding venue refund|banquet advance|caterer advance', { rr_what: 'service', rr_problem: 'cancelled' }],
    ['Car service centre damaged my car or overcharged', 'car service overcharge|service centre damage', { rr_what: 'service', rr_problem: 'poorservice' }],
    ['Restaurant added service charge I didn’t agree to', 'service charge restaurant|mandatory service charge', { rr_what: 'service', rr_problem: 'poorservice' }, 'Restaurants cannot add a service charge by default — you can ask for it to be removed.'],
    ['Shop charged more than MRP', 'above mrp|mrp overcharge', { rr_what: 'product', rr_where: 'shop' }],
    ['Event or concert cancelled, no refund', 'concert cancelled refund|event ticket refund', { rr_what: 'service', rr_problem: 'cancelled' }],
    ['Paid for home repairs or interiors, work left half done', 'interior designer fraud|contractor left work|renovation half done', { rr_what: 'service', rr_problem: 'poorservice' }],
    ['Packers and movers damaged or held my goods', 'packers movers damage|movers holding goods', { rr_what: 'service', rr_problem: 'poorservice' }],
    ['Salon or clinic treatment went wrong', 'salon damage|hair treatment burn|cosmetic treatment wrong', { rr_what: 'service', rr_problem: 'poorservice' }],
    ['Shop gave a defective item and refuses exchange', 'shop no exchange|no refund no exchange board', { rr_what: 'product', rr_where: 'shop', rr_problem: 'defective' }],
    ['Subscription auto-debited after I cancelled', 'auto debit after cancel|subscription charged', { rr_what: 'service', rr_problem: 'cancelled' }]
  ]);
  G('defective-product', [
    ['New phone has a defect and the brand refuses replacement', 'phone defect replacement|mobile not working new', { dp_item: 'phone' }],
    ['Fridge, AC or washing machine broke within warranty', 'appliance warranty|ac not cooling warranty', { dp_item: 'appliance', dp_when: 'warranty' }],
    ['New car or bike keeps breaking down', 'new car defect|lemon car|bike repeated problem', { dp_item: 'vehicle', dp_repairs: 'many' }],
    ['Laptop repaired many times, same problem', 'laptop repeated repair', { dp_item: 'other', dp_repairs: 'many' }],
    ['Furniture delivered broken or bad quality', 'furniture defect|sofa damaged', { dp_item: 'furniture' }],
    ['Brand says warranty void because of “water damage”', 'warranty rejected water damage|physical damage claim', { dp_when: 'warranty' }],
    ['Electric two-wheeler battery failed early', 'ev battery failed|electric two wheeler battery', { dp_item: 'vehicle' }],
    ['Product caught fire or exploded', 'phone exploded|appliance fire|product injured me', null, 'Keep the burnt product and get medical records — this can be a product-liability case.']
  ]);
  G('insurance-claim', [
    ['Health insurance rejected my claim for a pre-existing disease', 'pre existing disease rejection|ped claim rejected', { in_type: 'health', in_status: 'rejected', in_reason: 'ped' }],
    ['Hospital says cashless not approved', 'cashless denied|cashless rejected', { in_type: 'health', in_status: 'cashless' }, 'Insurers must decide cashless requests within 1 hour.'],
    ['Insurer paid much less than my hospital bill', 'partial settlement|deductions claim', { in_type: 'health', in_status: 'partial' }],
    ['Claim stuck for months with no decision', 'claim delayed|insurance not settling', { in_status: 'delayed' }],
    ['Car insurance rejected because of driving licence', 'licence claim rejected|motor claim rejected', { in_type: 'motor', in_reason: 'licence' }],
    ['Car stolen and insurer is delaying', 'vehicle theft claim|car stolen insurance', { in_type: 'motor', in_status: 'delayed' }],
    ['Life insurance claim rejected after a death', 'death claim rejected|life insurance rejected', { in_type: 'life', in_status: 'rejected' }],
    ['Claim rejected because I told them late', 'late intimation rejection', { in_reason: 'late' }],
    ['Insurer says the treatment is not “reasonable and customary”', 'reasonable customary deduction', { in_type: 'health', in_reason: 'reasonable' }],
    ['Crop or home insurance not paid after damage', 'home insurance flood|crop insurance claim', { in_type: 'other' }],
    ['Policy cancelled or not renewed after I made a claim', 'policy not renewed|renewal denied', null]
  ]);
  G('travel-refund', [
    ['Airline cancelled my flight and refund is not coming', 'flight cancelled refund|airline refund delayed', { ft_mode: 'flight', ft_problem: 'theycancel' }],
    ['Flight delayed for hours, no food or hotel', 'flight delay compensation|delayed flight rights', { ft_mode: 'flight', ft_problem: 'delay' }],
    ['Denied boarding though I had a confirmed ticket', 'denied boarding|overbooked flight', { ft_mode: 'flight', ft_problem: 'denied' }],
    ['Baggage lost or damaged by the airline', 'lost baggage|damaged luggage|bag not arrived', { ft_mode: 'flight', ft_problem: 'baggage' }, 'File the baggage report at the airport before you leave, if you can.'],
    ['Booked on a travel portal — refund stuck between portal and airline', 'makemytrip refund|travel portal refund', { ft_booked: 'portal' }],
    ['Train ticket refund not received', 'irctc refund|tdr refund', { ft_mode: 'train' }],
    ['Holiday package was not as promised', 'tour package fraud|travel agent cheated', { ft_mode: 'package', ft_problem: 'service' }],
    ['Hotel booking cancelled on arrival', 'hotel denied check in|booking not honoured', { ft_mode: 'hotel' }],
    ['Bus operator cancelled, no refund', 'bus cancelled refund|redbus refund', { ft_mode: 'bus' }]
  ]);
  G('telecom-internet', [
    ['Postpaid bill much higher than my plan', 'high mobile bill|wrong postpaid bill', { tc_problem: 'bill', tc_type: 'postpaid' }],
    ['Broadband not working for days', 'internet down|wifi not working|broadband complaint', { tc_problem: 'service', tc_type: 'broadband' }],
    ['Porting my number is being blocked', 'mnp rejected|port out blocked|upc code', { tc_problem: 'port' }],
    ['Charged for caller tunes or services I never asked for', 'vas charges|caller tune charges', { tc_problem: 'vas' }],
    ['Getting spam calls despite DND', 'spam calls|dnd not working|telemarketing', { tc_problem: 'spam' }],
    ['SIM issued in my name that I never took', 'sim in my name|fake sim on my aadhaar', { tc_problem: 'sim' }, 'Check all SIMs in your name on Sanchar Saathi and block the ones you don’t use.'],
    ['DTH charging after I stopped the service', 'dth refund|dth disconnection', { tc_type: 'dth' }]
  ]);
  G('builder-delay', [
    ['Builder has not given possession years after the date', 'possession delayed|flat not handed over', { bd_stage: 'delayed' }],
    ['Builder offered possession but the flat is incomplete', 'incomplete flat possession|no oc possession', { bd_stage: 'offered' }],
    ['Cracks and leaks in a new flat', 'construction defects|seepage new flat', { bd_stage: 'defects' }, 'Builders must fix structural defects reported within 5 years of possession.'],
    ['Want to cancel my flat booking and get money back', 'cancel flat booking|refund from builder', { bd_stage: 'cancel' }],
    ['Project stopped and builder disappeared', 'project stalled|builder absconding|builder insolvency', { bd_stage: 'stalled' }],
    ['Paying EMI and rent together because flat is late', 'subvention scheme|pre emi delayed flat', { bd_loan: 'subvention' }],
    ['Builder demanding extra money before handover', 'extra charges builder|escalation charges', { bd_stage: 'offered' }],
    ['Plot in a layout not developed as promised', 'plot developer delay|layout not developed', { bd_stage: 'delayed' }]
  ]);
  G('electricity-bill', [
    ['Electricity bill suddenly very high', 'high electricity bill|wrong meter reading', { el_problem: 'bill' }],
    ['Meter is faulty or jumping', 'faulty meter|meter running fast|smart meter', { el_problem: 'meter' }],
    ['Power cut off without notice', 'disconnected electricity|power cut without notice', { el_problem: 'disconnect' }],
    ['New electricity connection delayed', 'new connection pending|meter not installed', { el_problem: 'newconn' }],
    ['Accused of electricity theft', 'electricity theft case|power theft penalty', { el_problem: 'theft' }, 'Show the notice to an advocate quickly — there may be a short time to reply.'],
    ['Landlord cut my electricity to make me leave', 'landlord cut power|electricity cut by owner', { el_problem: 'disconnect' }]
  ]);
  G('medical-negligence', [
    ['Wrong surgery or treatment harmed a family member', 'wrong operation|surgical mistake|doctor error', { mn_problem: 'harm' }],
    ['Patient died and we think the hospital was careless', 'death due to negligence|hospital death', { mn_problem: 'death' }, 'Ask for a post-mortem before the funeral if you suspect negligence.'],
    ['Hospital overcharged or added items we didn’t use', 'hospital bill padding|overbilling hospital', { mn_problem: 'bill' }],
    ['Hospital refuses to give medical records', 'medical records refused|case sheet not given', { mn_problem: 'records' }, 'Hospitals should give records within 72 hours of a request.'],
    ['Hospital won’t release the body or patient until we pay', 'hospital detaining body|patient detained bill', { mn_problem: 'detain' }],
    ['Hospital refused emergency treatment', 'emergency refused|accident victim refused', { mn_problem: 'harm' }, 'Every hospital must give first aid in an emergency. Call 112 if needed.'],
    ['Wrong diagnosis led to delay in treatment', 'misdiagnosis|wrong diagnosis', { mn_problem: 'harm' }],
    ['Infection after surgery due to poor hygiene', 'hospital infection|post surgery infection', { mn_problem: 'harm' }],
    ['Childbirth went wrong at the hospital', 'delivery complication negligence|birth injury', { mn_problem: 'harm' }]
  ]);
  G('education-dispute', [
    ['College won’t refund fees after I left', 'college fee refund|admission cancelled refund', { ed_inst: 'college', ed_problem: 'refund' }, 'UGC rules require refunds when you withdraw before the deadline.'],
    ['College holding my original certificates', 'original certificates withheld|10th 12th marksheet held', { ed_inst: 'college', ed_problem: 'certs' }, 'Colleges are not allowed to keep your original certificates.'],
    ['School increased fees by a lot', 'school fee hike|fee increase private school', { ed_inst: 'school', ed_problem: 'fee' }],
    ['School won’t give the transfer certificate', 'tc not given|leaving certificate withheld', { ed_inst: 'school', ed_problem: 'certs' }],
    ['Result withheld or wrong marks', 'result withheld|marks wrong|revaluation', { ed_problem: 'result' }],
    ['Coaching institute won’t refund after I quit', 'coaching refund|coaching centre fee', { ed_inst: 'coaching', ed_problem: 'refund' }],
    ['Child denied admission under the RTE free seats quota', 'rte admission|25 percent quota|ews admission school', { ed_inst: 'school' }],
    ['Degree not recognised or college was fake', 'fake university|unrecognised degree', { ed_inst: 'college' }],
    ['Scholarship not credited', 'scholarship not received|post matric scholarship', null]
  ]);

  /* ---------------- HOME, PROPERTY, RENT ---------------- */
  G('rental-security-deposit', [
    ['Landlord not returning my deposit after I moved out', 'deposit not returned|landlord kept deposit', { rd_role: 'tenant', rd_vacated: 'yes' }],
    ['Landlord deducting painting and cleaning from deposit', 'painting charges deposit|deposit deductions', { rd_role: 'tenant' }],
    ['Paid deposit in cash and no agreement', 'cash deposit no agreement', { rd_role: 'tenant', rd_paid: 'cash', rd_agreement: 'none' }],
    ['PG or hostel won’t return my deposit', 'pg deposit|hostel deposit not returned', { rd_role: 'tenant' }],
    ['Tenant left damage worth more than the deposit', 'tenant damaged flat|landlord claim damage', { rd_role: 'landlord' }],
    ['Shop or office lease deposit not returned', 'commercial deposit refund|office deposit', { rd_role: 'tenant' }],
    ['Gave notice to vacate — landlord says deposit only after new tenant', 'deposit after new tenant', { rd_role: 'tenant', rd_vacated: 'notice' }]
  ]);
  G('eviction-tenancy', [
    ['Landlord wants me out before the agreement ends', 'landlord asking to vacate|eviction before term', { ev_side: 'tenant', ev_issue: 'evict' }],
    ['Landlord locked my house or threw out my things', 'landlord locked house|forcible eviction', { ev_side: 'tenant', ev_issue: 'evict' }, 'Forcible eviction without a court order is illegal. Call 112 if you are locked out.'],
    ['Tenant not paying rent for months', 'tenant not paying rent|rent arrears|tenant stopped paying|tenant not paying and not leaving', { ev_side: 'landlord', ev_issue: 'rentdue' }],
    ['Tenant refuses to leave after the agreement ended', 'tenant not vacating|overstaying tenant', { ev_side: 'landlord', ev_issue: 'overstay' }],
    ['Landlord raised the rent suddenly', 'rent increase|rent hike', { ev_side: 'tenant', ev_issue: 'increase' }],
    ['Landlord cut water or electricity', 'water cut landlord|utilities cut', { ev_side: 'tenant', ev_issue: 'utilities' }],
    ['Landlord won’t do essential repairs', 'repairs landlord|leaking roof rented', { ev_side: 'tenant', ev_issue: 'repairs' }],
    ['Tenant has sublet my flat to others', 'subletting|tenant sublet', { ev_side: 'landlord', ev_issue: 'subletting' }],
    ['Shop tenant won’t vacate', 'shop tenant not leaving|commercial eviction', { ev_side: 'landlord', ev_use: 'shop' }],
    ['No rent agreement — what are my rights?', 'no rent agreement|oral tenancy', { ev_agreement: 'none' }],
    ['Landlord entering my rented house without telling me', 'landlord enters without permission|privacy rented house', { ev_side: 'tenant', ev_issue: 'repairs' }]
  ]);
  G('neighbour-dispute', [
    ['Neighbour building illegally next to my house', 'illegal construction neighbour|unauthorised construction', { nb_what: 'build' }],
    ['Water leaking from the flat above', 'seepage from upstairs|leakage neighbour', { nb_what: 'leak', nb_flat: 'flat' }],
    ['Loud music or noise every night', 'noise complaint|loud music neighbour|dj noise', { nb_what: 'noise' }, 'Loudspeakers are generally not allowed between 10 pm and 6 am.'],
    ['Neighbour blocking my pathway or gate', 'path blocked|gate blocked|car parked blocking', { nb_what: 'path' }],
    ['Neighbour harasses and abuses my family', 'neighbour abuse|neighbour harassment', { nb_what: 'harass' }],
    ['Neighbour’s tree or wall damaging my house', 'tree roots damage|wall collapse neighbour', { nb_what: 'build' }],
    ['Smoke or bad smell from a neighbour’s business', 'smoke nuisance|factory smell residential', { nb_what: 'noise' }],
    ['Neighbour put CCTV facing my house', 'cctv facing my home|privacy camera neighbour', { nb_what: 'harass' }]
  ]);
  G('society-dispute', [
    ['Society charging high maintenance or penalties', 'maintenance charges high|society penalty', { so_what: 'charges' }],
    ['Society won’t give NOC to sell my flat', 'society noc sale|noc refused', { so_what: 'noc' }],
    ['Parking dispute in the society', 'parking spot dispute|parking allotment', { so_what: 'parking' }],
    ['Society not repairing leaks or lifts', 'society repairs|lift not working', { so_what: 'repairs' }],
    ['Society committee hiding accounts', 'society accounts|rwa mismanagement|audit society', { so_what: 'mgmt' }],
    ['Builder still running the society after handover', 'builder not handing society', { so_type: 'builder' }],
    ['Society discriminating against tenants or bachelors', 'tenant ban society|bachelors not allowed', { so_role: 'tenant' }],
    ['Society not transferring the flat to legal heirs', 'transfer flat after death|heir membership society', { so_role: 'heir' }]
  ]);
  G('land-encroachment', [
    ['Someone built on my plot while I was away', 'encroachment plot|built on my land', { le_kind: 'plot', le_problem: 'building' }],
    ['Relatives occupying my land and refusing to leave', 'relative occupying land|family occupying property', { le_problem: 'occupied' }],
    ['Boundary dispute with the neighbour’s farm', 'farm boundary|boundary measurement', { le_kind: 'agri', le_problem: 'boundary' }],
    ['Someone made fake papers for my land', 'fake documents land|forged sale deed', { le_problem: 'fakedocs' }],
    ['Land records show someone else’s name', 'wrong name land record|record of rights wrong', { le_problem: 'records' }],
    ['Road to my land blocked by others', 'access road blocked|no way to my land', { le_problem: 'access' }],
    ['Government land allotted to me taken by others', 'patta land occupied|allotted land encroached', { le_how: 'govt' }],
    ['Land grabbers threatening me', 'land mafia|land grabbing threat', { le_problem: 'occupied' }, 'If you are threatened, report it to the police and keep the complaint copy.']
  ]);
  G('land-records', [
    ['Mutation pending for months after I bought land', 'mutation pending|namantaran|dakhil kharij', { lrc_what: 'stuck', lrc_how: 'bought' }],
    ['Need to transfer land records after a parent’s death', 'mutation after death|inheritance mutation', { lrc_what: 'mutate', lrc_how: 'inherit' }],
    ['Wrong area or name in the land record', 'land record error|khatian error|7/12 error|jamabandi error', { lrc_what: 'wrong' }],
    ['Land needs to be measured again', 'land survey|demarcation|measurement land', { lrc_what: 'measure' }],
    ['Family objecting to mutation in my name', 'mutation objection|family objects mutation', { lrc_object: 'family' }],
    ['City property tax records in someone else’s name', 'property tax name change|municipal mutation', { lrc_type: 'urban' }]
  ]);
  G('property-purchase', [
    ['Checking a property before buying it', 'property verification|title check|before buying flat', { pp_stage: 'before' }],
    ['Paid advance and seller backed out', 'seller backed out advance|token money not returned', { pp_stage: 'advance' }],
    ['Seller sold the same property to two people', 'double sale|sold to two buyers', { pp_stage: 'cheated' }],
    ['Bought a plot and found it has a loan or case on it', 'property under loan|encumbrance after purchase', { pp_stage: 'after' }],
    ['Buying through a power of attorney holder', 'poa sale|gpa sale', { pp_seller: 'poa' }],
    ['Paid part in cash and seller is denying it', 'cash part payment property', { pp_paid: 'mixed' }],
    ['Agricultural land purchase — conversion and rules', 'buy farmland|agricultural land purchase', { pp_kind: 'agri' }],
    ['Resale flat purchase — society and loan clearance', 'resale flat|second sale flat', { pp_kind: 'resale' }]
  ]);
  G('will-gift', [
    ['Want to make a will for my property', 'make a will|write a will', { wg_what: 'will' }],
    ['Want to gift property to my child', 'gift deed|transfer property to son daughter', { wg_what: 'gift' }],
    ['Siblings want me to sign a release deed', 'release deed|relinquishment deed|sign off share', { wg_what: 'release' }],
    ['Want to cancel a gift deed I made', 'cancel gift deed|revoke gift', { wg_what: 'undo' }],
    ['Parent gifted property to one child only', 'gift to one sibling', { wg_what: 'gift' }]
  ]);
  G('inheritance-partition', [
    ['Brothers not giving sisters their share of father’s property', 'daughter share property|sister share ancestral', { ip_death: 'deceased' }],
    ['Father died without a will — how is property divided?', 'no will property division|intestate', { ip_death: 'deceased', ip_will: 'no' }],
    ['Suspect a fake will', 'fake will|forged will|will challenge', { ip_will: 'disputed' }],
    ['Want my share of ancestral land partitioned', 'partition suit|ancestral property share', { ip_kind: 'land' }],
    ['Muslim family property share', 'muslim inheritance|islamic share property', { ip_law: 'muslim' }],
    ['Christian family property share', 'christian inheritance|indian succession act share', { ip_law: 'christian' }],
    ['Relatives selling family property without my consent', 'property sold without consent|co-owner sold', null],
    ['Widow’s share in husband’s property', 'widow share property|wife share after death', { ip_death: 'deceased' }],
    ['Gold or jewellery of a deceased parent taken by one sibling', 'jewellery division|gold after death', { ip_kind: 'gold' }]
  ]);
  G('death-claims', [
    ['Bank won’t release a deceased parent’s money', 'bank claim deceased|deceased account', { dh_assets: 'bank' }],
    ['PF and pension after a family member’s death', 'pf death claim|family pension|late husband pension|pension after husband death', { dh_assets: 'pf' }],
    ['Life insurance claim after a death', 'insurance death claim|nominee claim insurance', { dh_assets: 'ins' }],
    ['Transfer a deceased person’s vehicle', 'vehicle transfer after death', { dh_assets: 'vehicle' }],
    ['Shares or mutual funds of a deceased parent', 'shares after death|mutual fund transmission', { dh_assets: 'shares' }],
    ['No nominee was made — how do heirs claim?', 'no nominee|legal heir certificate|succession certificate', { dh_nominee: 'no' }],
    ['Nominee is refusing to share with other heirs', 'nominee not sharing', { dh_dispute: 'yes' }]
  ]);
  G('land-acquisition', [
    ['Government notice to take my land for a highway', 'highway land acquisition|nhai notice', { la_stage: 'notice', la_purpose: 'highway' }],
    ['Compensation for acquired land is too low', 'low compensation land|enhancement compensation', { la_stage: 'award' }],
    ['Land acquired but compensation not paid', 'compensation not paid acquisition', { la_stage: 'notpaid' }],
    ['Losing my house and livelihood to a project', 'rehabilitation resettlement|displaced by project', { la_house: 'both' }],
    ['Railway project taking my land', 'railway land acquisition', { la_purpose: 'rail' }]
  ]);

  /* ---------------- FAMILY ---------------- */
  G('divorce-separation', [
    ['We both agree to divorce', 'mutual divorce|mutual consent divorce', { dv_agree: 'all' }],
    ['My spouse filed for divorce and I got a notice', 'divorce notice received|divorce summons', { dv_role: 'filed' }],
    ['Want divorce but spouse refuses', 'contested divorce|spouse not agreeing divorce', { dv_role: 'me', dv_agree: 'no' }],
    ['Spouse left years ago and doesn’t come back', 'desertion|spouse left me', { dv_role: 'me' }],
    ['Muslim divorce — talaq or khula', 'talaq|khula|muslim divorce', { dv_marriage: 'nikah' }],
    ['Christian divorce', 'christian divorce|church marriage divorce', { dv_marriage: 'church' }],
    ['Inter-religion marriage under Special Marriage Act — divorce', 'special marriage act divorce', { dv_marriage: 'sma' }],
    ['Living separately and want a legal separation', 'judicial separation|separation without divorce', null],
    ['Married less than a year and want out', 'divorce within one year|annulment', null],
    ['Spouse hiding income during divorce', 'hiding income divorce|spouse income proof', null],
    ['Want to remarry after divorce — appeal period', 'remarriage after divorce|appeal period divorce', null]
  ]);
  G('maintenance', [
    ['Husband not giving money for household and children', 'husband not giving money|maintenance wife', { mt_who: 'spouse' }],
    ['Need child support from my ex', 'child support|maintenance for child', { mt_who: 'child' }],
    ['Maintenance order exists but he stopped paying', 'maintenance not paid|arrears maintenance', { mt_order: 'unpaid' }],
    ['I am being asked to pay maintenance I can’t afford', 'reduce maintenance|maintenance too high', { mt_who: 'payer' }],
    ['Interim maintenance while the case goes on', 'interim maintenance|maintenance pending case', { mt_order: 'pending' }],
    ['Husband claims he has no income', 'husband hiding income|no income claim', { mt_payer_income: 'no' }]
  ]);
  G('domestic-violence', [
    ['Husband beats me', 'husband hitting|wife beating|physical abuse husband', { dvx_who: 'husband', dvx_kind: 'physical' }, 'If you are in danger now, call 112 or the women’s helpline 181.'],
    ['In-laws taunting and torturing me', 'in laws harassment|mother in law abuse', { dvx_who: 'inlaws', dvx_kind: 'verbal' }],
    ['Thrown out of my marital home', 'thrown out of house|wife evicted', { dvx_kind: 'outhouse' }, 'You have a right to live in the shared household — ask about a residence order.'],
    ['Husband controls all money and gives nothing', 'economic abuse|financial abuse', { dvx_kind: 'economic' }],
    ['Parents or siblings abusing me at home', 'abuse by parents|family violence', { dvx_who: 'parents' }],
    ['Grown son or daughter abusing elderly parents', 'son beating parents|elder abuse', { dvx_who: 'child' }],
    ['Husband forces himself on me', 'marital sexual abuse|forced by husband', { dvx_kind: 'sexual' }],
    ['Living in a women’s shelter and need protection', 'shelter home|one stop centre', { dvx_living: 'shelter' }]
  ]);
  G('dowry-cruelty', [
    ['In-laws demanding more dowry', 'dowry demand|dahej', { dc_side: 'complainant', dc_what: 'dowry' }],
    ['Want my stridhan and jewellery back from in-laws', 'stridhan|jewellery return', { dc_side: 'complainant', dc_what: 'stridhan' }],
    ['Falsely accused in a dowry case', 'false 498a|false dowry case', { dc_side: 'accused' }],
    ['Police called me to the women’s cell', 'crime against women cell|mahila thana notice', { dc_stage: 'cell' }],
    ['FIR filed under 498A against my family', '498a fir|cruelty fir', { dc_side: 'accused', dc_stage: 'fir' }],
    ['Chargesheet filed in a dowry case', 'chargesheet 498a', { dc_stage: 'chargesheet' }]
  ]);
  G('child-custody', [
    ['Spouse took the children and won’t let me see them', 'not allowed to meet child|children taken', { ch_role: 'want_visits' }],
    ['Want full custody of my child', 'custody of child|sole custody', { ch_role: 'want_custody' }],
    ['Ex filed a custody case against me', 'custody petition received', { ch_role: 'defend' }],
    ['Grandparents want to see grandchildren', 'grandparents visitation', { ch_now: 'grand' }],
    ['Spouse took the child abroad without consent', 'child taken abroad|child abduction parent', { ch_role: 'removed' }, 'Contact an advocate urgently; also inform the police and the Ministry of External Affairs.'],
    ['Shared parenting after divorce', 'joint custody|shared parenting', { ch_now: 'shared' }]
  ]);
  G('parents-maintenance', [
    ['Son and daughter-in-law not looking after us', 'children neglecting parents|old parents neglected', { pm_who: 'son' }],
    ['Gave property to my son and now he threw me out', 'cancel gift parents|son threw parents out', { pm_property: 'gift' }, 'A gift made on condition of care can sometimes be cancelled by the Maintenance Tribunal.'],
    ['Old parents have no income and children won’t pay', 'maintenance for parents|senior citizen maintenance', { pm_income: 'none' }],
    ['Elderly parent being beaten at home', 'elder abuse home|old parent beaten', { pm_safe: 'threat' }, 'Call 112 or Elderline 14567.'],
    ['Daughter refuses to support aged parents', 'daughter maintenance parents', { pm_who: 'daughter' }]
  ]);
  G('court-marriage', [
    ['Want to marry someone of another religion', 'inter religion marriage|interfaith marriage', { cm_need: 'marry' }],
    ['Our families threaten us for marrying', 'couple threatened family|honour threat', { cm_need: 'protect' }, 'Courts give police protection to adult couples. Call 112 if in danger.'],
    ['Need to register a marriage done at a temple', 'register marriage|temple marriage certificate', { cm_need: 'register' }],
    ['Lost our marriage certificate', 'marriage certificate copy|duplicate marriage certificate', { cm_need: 'cert' }],
    ['Inter-caste marriage and want the government incentive', 'inter caste marriage scheme', { cm_need: 'register' }],
    ['Marriage notice under the Special Marriage Act', 'special marriage notice|30 days notice marriage', { cm_need: 'marry' }]
  ]);
  G('adoption-guardianship', [
    ['Want to adopt a child', 'adopt child|adoption process', { ad_what: 'unrelated' }],
    ['Want to adopt a relative’s child', 'adopt relative child', { ad_what: 'relative' }],
    ['Single woman wants to adopt', 'single mother adoption', { ad_status: 'single_f' }],
    ['Need guardianship of a minor after parents died', 'guardian of minor|guardianship certificate', { ad_what: 'guardian' }],
    ['Gave a child informally to relatives — now a dispute', 'informal adoption dispute', { ad_what: 'given' }]
  ]);
  G('live-in', [
    ['Live-in partner abuses me', 'live in violence|partner abuse', { lv_need: 'violence' }],
    ['Breaking up with a live-in partner — money and belongings', 'live in breakup', { lv_need: 'breakup' }],
    ['Landlord refuses to rent to us because we are unmarried', 'unmarried couple rent', { lv_need: 'landlord' }],
    ['Child born in a live-in relationship — rights', 'live in child rights', { lv_child: 'yes' }],
    ['Uttarakhand live-in registration', 'live in registration ucc', { lv_need: 'register' }]
  ]);
  G('nri-marriage', [
    ['NRI husband abandoned me and went abroad', 'nri husband left|abandoned by nri', { nm_side: 'left' }],
    ['Husband got a divorce abroad without my consent', 'foreign divorce|divorce abroad', { nm_side: 'foreigndiv' }],
    ['NRI spouse took our child abroad', 'child taken abroad nri', { nm_side: 'child' }],
    ['I am an NRI and my wife filed a case in India', 'nri accused 498a|case against nri husband', { nm_side: 'nri_accused' }]
  ]);

  /* ---------------- WORK ---------------- */
  G('unpaid-salary', [
    ['Salary not paid for months', 'salary pending|salary not received', { us_type: 'employee', us_status: 'working' }],
    ['Full and final settlement not paid after resigning', 'fnf not paid|full and final', { us_status: 'resigned', us_amount: 'fnf' }],
    ['Company shut down without paying salaries', 'company closed salary', { us_status: 'closed' }],
    ['Daily wages not paid by contractor', 'contractor not paying wages|labour wages', { us_type: 'daily' }],
    ['Agency or contract worker unpaid', 'contract worker salary|manpower agency salary', { us_type: 'agency' }],
    ['Paid less than minimum wage', 'minimum wage|below minimum wages', { us_type: 'daily' }],
    ['Domestic worker or maid not paid', 'maid salary|domestic help wages', { us_type: 'daily' }],
    ['Company deducting salary for notice period I served', 'notice period recovery|salary deducted notice', { us_status: 'resigned' }],
    ['Freelance client not paying invoice', 'freelancer unpaid|client not paying', { us_type: 'freelance' }],
    ['Overtime not paid', 'overtime pay|extra hours not paid', { us_status: 'working' }]
  ]);
  G('wrongful-termination', [
    ['Fired without any notice', 'terminated without notice|sacked suddenly', { wt_how: 'fired' }],
    ['Forced to resign or they would fire me', 'forced resignation|asked to resign', { wt_how: 'forced' }],
    ['Laid off with no compensation', 'layoff compensation|retrenchment', { wt_how: 'layoff' }],
    ['Fired after I complained about something wrong', 'fired for complaining|retaliation termination', { wt_reason: 'retaliation' }],
    ['Fired because I got pregnant', 'fired pregnant|maternity termination|pregnancy discrimination', { wt_reason: 'retaliation' }, 'Dismissing a woman during maternity leave is not allowed — ask about the maternity benefit law.'],
    ['Company won’t give relieving or experience letter', 'relieving letter not given|experience certificate withheld', { wt_how: 'ongoing' }],
    ['Company asking me to pay a training bond amount', 'training bond|employment bond recovery', { wt_how: 'ongoing' }],
    ['Contract not renewed after years of work', 'contract not renewed|fixed term ended', { wt_how: 'contract' }],
    ['Accused of misconduct and suspended', 'suspended at work|domestic enquiry', { wt_reason: 'misconduct' }],
    ['Put on a performance plan to push me out', 'pip|performance improvement plan', { wt_reason: 'performance' }]
  ]);
  G('workplace-harassment', [
    ['Boss makes sexual comments at work', 'sexual comments boss|harassment by manager', { wh_who: 'senior' }],
    ['Colleague sends unwanted messages', 'colleague harassment messages|unwanted advances', { wh_who: 'peer' }],
    ['Company has no Internal Committee for complaints', 'no icc|no internal committee|posh not set up', { wh_ic: 'no' }, 'You can complain to the Local Committee of your district instead.'],
    ['Client or customer harassed me at work', 'client harassment', { wh_who: 'client' }],
    ['Facing retaliation after a POSH complaint', 'posh retaliation|after complaint harassment', null],
    ['Harassed at an unorganised workplace or as a domestic worker', 'domestic worker harassment|local committee', { wh_ic: 'no' }]
  ]);
  G('pf-gratuity', [
    ['Employer deducted PF but did not deposit it', 'pf not deposited|pf deducted not credited', { pf_issue: 'notdep' }],
    ['PF withdrawal claim rejected', 'pf claim rejected|epf withdrawal', { pf_issue: 'withdraw' }],
    ['Old PF account not transferred', 'pf transfer|merge uan', { pf_issue: 'transfer' }],
    ['Gratuity not paid after 5 years', 'gratuity not paid|gratuity calculation', { pf_issue: 'gratuity', pf_years: 'o5' }],
    ['Pension from EPS not started', 'eps pension|epfo pension', { pf_issue: 'pension' }],
    ['Fixed-term employee wants gratuity after one year', 'gratuity fixed term|one year gratuity', { pf_issue: 'gratuity', pf_fixed: 'yes' }],
    ['Name or date of birth wrong in PF', 'pf kyc mismatch|pf name correction', { pf_issue: 'withdraw' }]
  ]);
  G('workplace-injury', [
    ['Injured at a factory or construction site', 'factory accident|construction injury', { wi_who: 'me', wi_type: 'construction' }],
    ['Worker died at work — family wants compensation', 'death at workplace|worker died site', { wi_who: 'died' }],
    ['Injured at work and ESIC is not paying', 'esic claim|esic disablement', { wi_esic: 'yes' }],
    ['Contract worker injured — company denies responsibility', 'contract labour injury', { wi_type: 'contract' }],
    ['Accident while travelling for work', 'injury on duty travel', { wi_who: 'me' }]
  ]);
  G('gig-worker', [
    ['Delivery app blocked my ID without reason', 'id blocked swiggy zomato|deactivated rider', { gw_issue: 'blocked' }],
    ['Ride app not paying my earnings', 'driver payout pending|uber ola earnings', { gw_issue: 'pay' }],
    ['Injured during a delivery', 'delivery accident|rider injured', { gw_issue: 'injury' }],
    ['Gig worker in Karnataka or Rajasthan — welfare board', 'gig workers act|gig welfare board', { gw_state: 'kar' }]
  ]);
  G('govt-service', [
    ['Suspended from a government job', 'government employee suspended', { gs_what: 'suspend' }],
    ['Transferred as punishment', 'punishment transfer|transfer order challenge', { gs_what: 'transfer' }],
    ['Promotion denied to me', 'promotion denied|seniority dispute', { gs_what: 'promo' }],
    ['Pension not fixed after retirement', 'pension not started|pension fixation', { gs_what: 'pension' }],
    ['Dismissed from government service', 'dismissal from service|removal from service', { gs_what: 'termination' }],
    ['Armed forces pension or service matter', 'aft|armed forces tribunal|army pension', { gs_employer: 'forces' }]
  ]);
  G('internship-creator-pay', [
    ['Internship stipend not paid', 'stipend not paid|intern salary', { ic_type: 'intern' }],
    ['Brand didn’t pay for my Instagram or YouTube collab', 'brand not paying influencer|creator payment', { ic_type: 'creator' }],
    ['Freelance work done, client vanished', 'client ghosted|freelance unpaid', { ic_type: 'freelance' }],
    ['Job offer withdrawn after I resigned from my old job', 'offer revoked|offer letter cancelled', { ic_type: 'offer' }],
    ['Paid a fee for an internship that was fake', 'fake internship|internship fee', { ic_type: 'fee' }]
  ]);
  G('trafficking', [
    ['Family member forced to work to repay a loan', 'bonded labour|forced labour loan', { tf_what: 'bonded' }],
    ['Child working in a shop or factory', 'child labour|child working', { tf_what: 'child' }, 'Call the child helpline 1098.'],
    ['Relative taken to another state for work and can’t return', 'trafficked for work|held at workplace', { tf_what: 'held' }, 'Call 112 if someone is held against their will.'],
    ['Girl taken with a job promise and now missing', 'girl trafficked|job promise missing', { tf_what: 'trafficked' }, 'Call 112 now.']
  ]);

  /* ---------------- POLICE, CRIME, COURT ---------------- */
  G('police-complaint', [
    ['Police refusing to register my FIR', 'fir not registered|police refused complaint', { pc_status: 'refused' }, 'You can send the complaint in writing to the Superintendent of Police.'],
    ['My phone or bike was stolen', 'theft fir|bike stolen|vehicle theft', { pc_what: 'theft' }],
    ['Someone cheated me of money', 'cheating complaint|fraud by known person', { pc_what: 'cheating' }],
    ['Police gave only an NCR, not an FIR', 'ncr|non cognisable report', { pc_status: 'ncr' }],
    ['FIR registered but police doing nothing', 'no action on fir|police inactive', { pc_status: 'noaction' }],
    ['Want to file a complaint online', 'e-fir|online fir|zero fir', { pc_status: 'notyet' }],
    ['House break-in or burglary', 'burglary|house theft|break in', { pc_what: 'theft' }],
    ['Chain snatching or mobile snatching', 'chain snatching|snatching', { pc_what: 'theft' }],
    ['Fake police case threat to extort money', 'false case threat money', { pc_what: 'threat' }]
  ]);
  G('accused-arrest', [
    ['Fear arrest in a false case — want anticipatory bail', 'anticipatory bail|fear of arrest', { aa_stage: 'heard' }],
    ['Family member arrested — need bail', 'bail for family member|regular bail', { aa_stage: 'arrested' }, 'The person must be produced before a magistrate within 24 hours. Call 15100 for free legal aid.'],
    ['Got a police notice to appear', '35 notice|police notice appear|41a notice', { aa_stage: 'notice' }],
    ['Court summons in a criminal case', 'criminal summons', { aa_stage: 'summons' }],
    ['Warrant issued against me', 'warrant|nbw|non bailable warrant', { aa_stage: 'warrant' }],
    ['Accused in a cheque or money case', 'accused money case', { aa_type: 'money' }],
    ['Accused in a fight case with neighbours', 'cross case|fight fir', { aa_type: 'assault', aa_relation: 'neighbour' }],
    ['Accused in a cybercrime case', 'cyber case accused|it act case', { aa_type: 'cyber' }],
    ['Want an FIR against me quashed', 'quash fir|quashing petition', { aa_stage: 'fir' }]
  ]);
  G('police-stop', [
    ['Police asking to check my phone on the street', 'police checking phone|phone search', { ps_what: 'phone' }],
    ['Picked up by police without being told why', 'detained without reason|illegal detention', { ps_what: 'detained' }, 'You must be told the grounds of arrest and can inform a family member.'],
    ['Police stopped my car and asked for money', 'police bribe|traffic police money', { ps_what: 'stopped' }],
    ['Family member taken to police station at night', 'taken to police station', { ps_what: 'detained', ps_now: 'now' }, 'Call 112 or a lawyer now; ask which station and why.'],
    ['Police beat me in custody', 'custodial violence|police beating', { ps_what: 'arrested', ps_now: 'past' }, 'Get a medical examination as soon as possible and keep the report.']
  ]);
  G('assault-threat', [
    ['Someone hit me in a fight', 'beaten up|assaulted|attacked', { at_what: 'hit' }],
    ['Getting death threats', 'death threat|threatening calls', { at_what: 'threat' }, 'Call 112 if you are in danger.'],
    ['Someone demanding money with threats', 'extortion|hafta|threat for money', { at_what: 'money' }],
    ['Someone damaged my car or shop', 'property damage|vandalism', { at_what: 'damage' }],
    ['Attacked by a group', 'mob attack|group assault', { at_who: 'group' }],
    ['Acid attack or serious injury', 'acid attack|grievous hurt', { at_injury: 'serious' }, 'Get medical help now — hospitals must treat acid attack victims free.'],
    ['Road rage — hit by another driver', 'road rage|driver attacked', { at_what: 'hit', at_who: 'unknown' }]
  ]);
  G('legal-notice-received', [
    ['Got a legal notice for money I owe', 'legal notice money|recovery notice', { ln_about: 'money' }],
    ['Got a legal notice from my landlord or tenant', 'legal notice rent|eviction notice received', { ln_about: 'tenancy' }],
    ['Got a legal notice from my employer', 'employer notice|notice from company', { ln_about: 'work' }],
    ['Got a legal notice about property', 'property notice received', { ln_about: 'property' }],
    ['Notice gives me only 7 days to reply', '7 days legal notice', { ln_days: 'd7' }],
    ['Got a legal notice from my spouse', 'wife legal notice|husband legal notice', { ln_about: 'family' }]
  ]);
  G('lost-phone', [
    ['Phone stolen — block it and protect my bank', 'phone stolen block|ceir block', { lp_what: 'phone', lp_how: 'stolen', lp_banking: 'yes' }, 'Block it on Sanchar Saathi and call your bank today.'],
    ['Lost my Aadhaar, PAN and other documents', 'lost documents|lost aadhaar card', { lp_what: 'docs' }],
    ['Wallet with cards lost', 'lost wallet|lost cards', { lp_what: 'wallet' }],
    ['Someone is misusing my lost phone', 'lost phone misuse|whatsapp misused', { lp_misuse: 'yes' }],
    ['Need a police report for a lost passport', 'lost passport report', { lp_what: 'docs' }]
  ]);
  G('missing-person', [
    ['My child is missing', 'missing child|child not come home', { mp_who: 'child' }, 'Go to the police now — they must register an FIR for a missing child at once. Call 112.'],
    ['Elderly parent with memory loss is missing', 'missing elderly|dementia missing', { mp_who: 'elder' }, 'Report to the police now and share a recent photo.'],
    ['Adult family member hasn’t returned for days', 'missing adult|family member missing', { mp_who: 'adult', mp_since: 'days' }],
    ['Police won’t search for my missing family member', 'missing report refused', { mp_police: 'refused' }],
    ['Teenager ran away with someone', 'teen eloped|ran away from home', { mp_who: 'child', mp_fear: 'left' }]
  ]);
  G('sexual-assault', [
    ['I was sexually assaulted recently', 'rape|sexual assault recent', { sa_who: 'me', sa_when: '72h' }, 'Get to a hospital or One Stop Centre — treatment is free and they cannot refuse.'],
    ['A child was abused', 'child sexual abuse|pocso', { sa_who: 'child' }, 'Call 1098 or 112. Reporting child abuse is required by law.'],
    ['Abused by a family member', 'abuse by relative|incest', { sa_known: 'family' }],
    ['Assault happened years ago', 'old sexual assault|past abuse report', { sa_when: 'past' }]
  ]);
  G('caste-atrocity', [
    ['Insulted by caste name in public', 'caste slur|caste abuse public', { ca_what: 'insult', ca_public: 'yes' }],
    ['Attacked because of caste', 'caste violence|atrocity attack', { ca_what: 'violence' }],
    ['Land taken by force from a Dalit or Adivasi family', 'sc st land grabbed', { ca_what: 'land' }],
    ['Social boycott of my family', 'social boycott|village boycott', { ca_what: 'boycott' }],
    ['Police not registering an atrocity case', 'atrocity fir refused', { ca_police: 'refused' }]
  ]);
  G('online-harassment', [
    ['Someone made a fake profile of me', 'fake profile|impersonation account', { oh_what: 'fake' }],
    ['Being stalked online by an ex', 'cyberstalking|ex stalking online', { oh_what: 'stalking', oh_known: 'yes' }],
    ['Trolls abusing me in comments and DMs', 'trolling|online abuse', { oh_what: 'messages' }],
    ['Someone blackmailing me over chats', 'blackmail chats|online blackmail', { oh_what: 'blackmail' }, 'Do not pay. Save evidence and report on cybercrime.gov.in.'],
    ['Harassed on a dating app', 'dating app harassment', { oh_platform: 'dating' }],
    ['Anonymous account spreading lies about me', 'anonymous troll|fake news about me', { oh_known: 'no' }]
  ]);
  G('intimate-images', [
    ['Ex threatening to leak my private photos', 'ex threatening photos|revenge porn threat', { ni_what: 'threat', ni_who: 'ex' }, 'Report now — platforms must act fast. Do not pay.'],
    ['Private photos posted online', 'nude leaked|private photo posted', { ni_what: 'posted' }],
    ['Someone made a deepfake or morphed photo of me', 'deepfake|morphed photo|ai nude', { ni_what: 'fake' }],
    ['Sextortion after a video call', 'sextortion video call|nude video call blackmail', { ni_what: 'money', ni_who: 'online' }, 'Do not pay. Report on cybercrime.gov.in and 1930.'],
    ['Leaked photos of someone under 18', 'minor photos leaked|child images', { ni_age: 'yes' }, 'Report immediately on cybercrime.gov.in (child section) or call 1098.']
  ]);
  G('account-hacked', [
    ['Instagram account hacked', 'instagram hacked', { ah_what: 'hacked' }],
    ['WhatsApp hacked and asking my contacts for money', 'whatsapp hacked', { ah_what: 'hacked', ah_misuse: 'money' }],
    ['Email hacked and password changed', 'gmail hacked|email hacked', { ah_what: 'hacked', ah_access: 'no' }],
    ['Facebook hacked and posting bad things', 'facebook hacked', { ah_what: 'hacked', ah_misuse: 'posts' }],
    ['Fake account using my name and photos', 'fake account my photos', { ah_what: 'fake' }]
  ]);
  G('defamation', [
    ['Someone posted lies about me on social media', 'defamatory post|false post about me', { df_side: 'victim', df_where: 'social' }],
    ['Fake negative review hurting my business', 'fake review|google review defamation', { df_side: 'victim', df_where: 'review' }],
    ['Newspaper or channel published false news about me', 'news defamation|false news report', { df_where: 'news' }],
    ['I am being sued for defamation over a post', 'sued for defamation|defamation case against me', { df_side: 'accused' }],
    ['Got a legal notice for defamation', 'defamation notice received|defamation legal notice', { df_side: 'accused' }],
    ['Rumours spread about me in the neighbourhood', 'rumours|spoken defamation', { df_where: 'spoken' }]
  ]);
  G('traffic-challan', [
    ['Got a challan for something I didn’t do', 'wrong challan|e challan wrong', { tr_problem: 'wrong' }],
    ['Vehicle seized by traffic police', 'vehicle impounded|bike seized police', { tr_problem: 'seized' }],
    ['Driving licence suspended', 'licence suspended|dl suspended', { tr_problem: 'licence' }],
    ['Want to pay or settle old challans in Lok Adalat', 'lok adalat challan|pay challan', { tr_problem: 'pay' }],
    ['Challan for a car I already sold', 'challan sold car', { tr_problem: 'wrong' }]
  ]);
  G('road-accident', [
    ['Injured in a road accident', 'accident injury claim|mact claim', { ra_harm: 'injury' }],
    ['Family member died in a road accident', 'accident death claim|fatal accident', { ra_harm: 'death' }],
    ['Hit-and-run — driver unknown', 'hit and run', { ra_vehicle: 'hitrun' }, 'Hit-and-run victims can claim fixed compensation from the government scheme.'],
    ['My vehicle damaged in an accident', 'vehicle damage accident', { ra_harm: 'vehicle' }],
    ['I am accused of causing an accident', 'accused accident|rash driving case', { ra_harm: 'accused' }],
    ['Accident happened months ago and no claim filed', 'late accident claim', { ra_when: 'older' }],
    ['Police did not register an FIR for the accident', 'accident fir not filed', { ra_fir: 'no' }]
  ]);
  G('dog-bite', [
    ['Stray dog bit my child', 'stray dog bit child', { db_animal: 'stray', db_who: 'child' }, 'Start the anti-rabies vaccine today — it is free at government hospitals.'],
    ['Neighbour’s pet dog bit me', 'pet dog bite|neighbour dog|neighbour dog bit son|pitbull|dog bit my son', { db_animal: 'pet', db_who: 'me' }],
    ['Monkey or cattle attacked me', 'monkey bite|cow attack', { db_animal: 'other' }],
    ['Elderly parent bitten by stray dogs', 'stray dog bite elderly', { db_animal: 'stray', db_who: 'elder' }]
  ]);
  G('animal-cruelty', [
    ['Someone poisoned the street dogs', 'dogs poisoned|stray dogs killed', { ac_what: 'killed', ac_animal: 'dog' }],
    ['Neighbour beats his dog', 'pet abuse|dog beaten neighbour', { ac_what: 'beaten', ac_animal: 'dog' }],
    ['Municipality taking away street dogs', 'dogs relocated|dog catchers', { ac_what: 'relocate' }],
    ['Stopped from feeding street animals', 'feeder harassed|stopped feeding dogs', { ac_what: 'feeder' }],
    ['Society says no pets allowed', 'society pet ban|pet fine society', { ac_what: 'pet' }],
    ['Cattle abandoned or kept starving', 'cow abandoned|cattle cruelty', { ac_what: 'beaten', ac_animal: 'cattle' }],
    ['Someone hit and killed my pet with a vehicle', 'pet killed vehicle', { ac_what: 'killed' }]
  ]);

  /* ---------------- YOUNG PEOPLE ---------------- */
  G('ragging', [
    ['Seniors ragging me in the hostel', 'hostel ragging|senior ragging', { rg_who: 'seniors' }, 'Call the anti-ragging helpline 1800-180-5522.'],
    ['Ragging in a WhatsApp group', 'online ragging|whatsapp ragging', { rg_who: 'online' }],
    ['College ignored my ragging complaint', 'college not acting ragging', { rg_told: 'college' }],
    ['Teacher or staff humiliating me', 'teacher harassment|staff harassment college', { rg_who: 'staff' }]
  ]);
  G('gaming-betting', [
    ['Gaming app holding my winnings', 'gaming withdrawal|winnings stuck', { gb_what: 'stuck' }],
    ['Lost money on a betting app', 'betting loss|online betting', { gb_what: 'scam' }],
    ['In debt because of online gaming', 'gaming debt|loans for gaming', { gb_what: 'debt' }],
    ['Child spent money on games without permission', 'child spent on game|in app purchase child', { gb_what: 'family' }],
    ['Paid an agent to load money for betting', 'betting agent|bookie', { gb_paid: 'agent' }]
  ]);
  G('gender-identity', [
    ['Change name and gender on documents', 'gender change documents|transgender certificate', { gi_need: 'docs' }],
    ['Family forcing me to marry or change', 'conversion therapy|family pressure lgbt', { gi_need: 'family' }],
    ['Same-sex couple facing threats', 'same sex couple|gay couple threat', { gi_need: 'couple' }],
    ['Discriminated at work for being trans or queer', 'trans discrimination work', { gi_need: 'work' }]
  ]);

  /* ---------------- NRI ---------------- */
  G('nri-property', [
    ['Tenant in my India flat won’t pay or leave — I live abroad', 'nri tenant problem', { np_problem: 'tenant' }],
    ['Relative occupying my property while I’m abroad', 'relative occupying nri property', { np_problem: 'relative' }],
    ['Caretaker sold or rented my property without consent', 'caretaker fraud nri', { np_problem: 'caretaker' }],
    ['My land records changed while I was abroad', 'nri mutation fraud', { np_problem: 'records' }],
    ['OCI holder — can I hold or buy agricultural land?', 'oci agricultural land', { np_status: 'oci' }]
  ]);
  G('nri-sale-repatriation', [
    ['Sell my India property and send money abroad', 'nri sell property|repatriation', { ns_what: 'sell' }],
    ['Inherited property in India — sell and repatriate', 'nri inherited property sale', { ns_what: 'inherit' }],
    ['High TDS deducted on my sale as an NRI', 'nri tds sale|lower tds certificate', { ns_cert: 'no' }]
  ]);
  G('nri-poa', [
    ['Give power of attorney from abroad to sell property', 'poa from abroad|apostille poa', { pa_goal: 'give', pa_for: 'sell' }],
    ['Cancel a power of attorney I gave', 'revoke poa|cancel power of attorney', { pa_goal: 'cancel' }],
    ['Attorney misused my power of attorney', 'poa misuse|attorney cheated', { pa_goal: 'misuse' }],
    ['Sub-registrar rejected my foreign POA', 'poa rejected registrar', { pa_stage: 'rejected' }]
  ]);
  G('nri-case-abroad', [
    ['Have a case in India but I live abroad', 'case in india living abroad|nri litigation', { nc_side: 'me' }],
    ['Warrant or summons in India while I’m abroad', 'nri warrant|lookout circular', { nc_stage: 'warrant' }],
    ['Consumer complaint from abroad', 'nri consumer complaint', { nc_type: 'consumer' }]
  ]);
  G('nri-bank-tax', [
    ['Bank froze my NRO or savings account after I moved abroad', 'nro frozen|account frozen nri', { nb_issue: 'frozen' }],
    ['Convert my savings account to NRO', 'convert to nro|nri account', { nb_issue: 'convert' }],
    ['Income tax notice as an NRI', 'nri tax notice', { nb_issue: 'tax' }],
    ['Excess TDS on my NRI income', 'nri tds refund', { nb_issue: 'tds' }]
  ]);

  /* ---------------- BUSINESS ---------------- */
  G('business-unpaid', [
    ['Customer company not paying my invoices', 'invoice unpaid|client not paying invoice', { bu_who: 'company' }],
    ['MSME — buyer delayed payment beyond 45 days', 'msme 45 days|msme samadhaan|udyam delayed payment', { bu_msme: 'yes' }],
    ['Government department not paying my bills', 'government bill pending|contractor payment govt', { bu_who: 'govt' }],
    ['Foreign client not paying', 'export payment pending|foreign client unpaid', { bu_who: 'foreign' }],
    ['Supplier took advance and didn’t deliver', 'supplier advance|vendor did not deliver', null]
  ]);
  G('contract-breach', [
    ['Supplier sent poor-quality material', 'bad quality supply|supply defect', { cbx_kind: 'supply', cbx_breach: 'quality' }],
    ['Franchise owner broke the agreement', 'franchise dispute|franchisor', { cbx_kind: 'franchise' }],
    ['Client ended our contract early', 'contract terminated early', { cbx_breach: 'termination' }],
    ['Ex-employee or partner leaked business secrets', 'nda breach|confidential info leaked', { cbx_breach: 'confidential' }],
    ['Commercial lease dispute with landlord', 'commercial lease dispute', { cbx_kind: 'lease' }]
  ]);
  G('shareholder-dispute', [
    ['Removed as a director from my own company', 'removed director|ousted founder', { sd_issue: 'removed' }],
    ['My shareholding diluted without my consent', 'share dilution|shares issued without consent', { sd_issue: 'dilution' }],
    ['Co-founder taking company money', 'siphoning|co-founder fraud', { sd_issue: 'siphon' }],
    ['Not being shown company accounts', 'company records access|financials hidden', { sd_issue: 'records' }],
    ['Want to exit the company and get fair value', 'founder exit|buyout shares', { sd_issue: 'exit' }],
    ['Board deadlock between founders', 'founder deadlock', { sd_issue: 'deadlock' }]
  ]);
  G('partnership-dispute', [
    ['Partner not showing accounts', 'partner accounts|partnership accounts', { pd_issue: 'accounts' }],
    ['Partner took money from the firm', 'partner siphoned money', { pd_issue: 'money' }],
    ['Want to leave the partnership', 'retire from partnership|exit partnership', { pd_issue: 'exit' }],
    ['Thrown out of the partnership', 'expelled partner', { pd_issue: 'expelled' }],
    ['Informal business with a friend broke down', 'business with friend dispute|no partnership deed', { pd_type: 'informal', pd_deed: 'no' }]
  ]);
  G('ip-brand', [
    ['Someone copying my brand name', 'brand copied|trademark infringement', { ip_what: 'brand' }],
    ['My photos or content used without permission', 'content stolen|copyright infringement', { ip_what: 'content' }],
    ['Someone registered a domain with my brand', 'domain squatting|cybersquatting', { ip_what: 'domain' }],
    ['Ex-employee took our client list', 'trade secrets|client list stolen', { ip_what: 'secrets' }],
    ['Fake products of my brand sold online', 'counterfeit|fake of my brand', { ip_what: 'brand', ip_where: 'online' }]
  ]);

  /* ---------------- GOVERNMENT, DOCUMENTS, BENEFITS ---------------- */
  G('documents-correction', [
    ['Change my name after marriage', 'surname change marriage|name after marriage', { doc_what: 'name', doc_why: 'marriage' }],
    ['Wrong date of birth in my certificates', 'dob correction|date of birth wrong', { doc_what: 'dob' }],
    ['No birth certificate — need one now', 'late birth registration|no birth certificate', { doc_birthcert: 'no' }],
    ['Spelling mistake in my name in Aadhaar or PAN', 'aadhaar spelling|pan name mismatch', { doc_what: 'name', doc_why: 'error' }],
    ['Passport application stuck or rejected', 'passport rejected|passport police verification', { doc_what: 'passport' }],
    ['Father’s name wrong in my documents', 'parent name wrong certificate', { doc_what: 'parent' }],
    ['Child’s name or details wrong in school records', 'school record correction', { doc_minor: 'yes' }]
  ]);
  G('govt-benefits', [
    ['Old-age, widow or disability pension stopped', 'pension stopped|widow pension', { gvb_what: 'benefit' }],
    ['Ration card cancelled or not issued', 'ration card|pds card cancelled', { gvb_what: 'ration' }],
    ['Caste, income or domicile certificate refused', 'caste certificate refused|income certificate', { gvb_what: 'cert' }],
    ['Want to file an RTI', 'rti|right to information', { gvb_what: 'rti', gvb_rtistage: 'new' }],
    ['No reply to my RTI in 30 days', 'rti no reply|rti first appeal', { gvb_what: 'rti', gvb_rtistage: 'noreply' }],
    ['Government office not doing my work for months', 'government office delay|public service guarantee', { gvb_what: 'office' }],
    ['PM-Kisan or scheme money stopped', 'pm kisan stopped|dbt not received', { gvb_what: 'benefit', gvb_level: 'central' }],
    ['Housing scheme house not allotted', 'pmay|housing scheme', { gvb_what: 'benefit' }],
    ['Name missing from the voter list', 'voter id|name not in voter list', { gvb_what: 'office' }]
  ]);
  G('vehicle-transfer', [
    ['Sold my car but RC is still in my name', 'rc transfer pending|sold vehicle rc', { vt_side: 'seller', vt_problem: 'notdone' }],
    ['Bought a second-hand car with a hidden loan', 'used car loan hidden|hypothecation', { vt_side: 'buyer', vt_problem: 'loan' }],
    ['Bought a stolen or fake-paper vehicle', 'stolen car bought|fake rc', { vt_side: 'buyer', vt_problem: 'fraud' }],
    ['Dealer took money but didn’t transfer the RC', 'dealer rc transfer', { vt_how: 'dealer' }]
  ]);

  /* ---------------- DISABILITY ---------------- */
  G('disability-rights', [
    ['Denied a job because of my disability', 'job refused disability|pwd job', { pd_what: 'job' }],
    ['College refused me a scribe or extra time', 'scribe refused|extra time exam pwd', { pd_what: 'edu' }],
    ['No ramp or lift at a government office or bank', 'no ramp|inaccessible building', { pd_what: 'access' }],
    ['Disability pension or UDID card delayed', 'udid delayed|disability pension', { pd_what: 'benefit' }],
    ['Mocked or insulted because of my disability', 'disability insult|mocked disabled', { pd_what: 'insult' }],
    ['Need a sign-language interpreter in court', 'interpreter court deaf', { pd_what: 'court' }],
    ['PwD reservation not given in a government job or college', 'pwd quota not given|disability reservation', { pd_what: 'job', pd_pct: 'o40' }],
    ['Website or app not usable with a screen reader', 'website not accessible|screen reader', { pd_what: 'access' }]
  ]);

  /* Install as directory entries routed to their guide. */
  const BY = Object.fromEntries(KB.issues.map((i) => [i.id, i]));
  out.forEach((x) => {
    const iss = BY[x.g]; if (!iss) return;
    KB.directory.push({ cat: iss.cat, title: x.t, synonyms: x.s, route: x.g, urgentNote: x.note, pre: x.pre, sit: true });
  });
  KB.situations = out;
})(typeof window !== 'undefined' ? window : globalThis);
