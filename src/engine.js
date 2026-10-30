/* Saboot deterministic interview engine. Pure functions; no DOM. */
(function (root) {
  function asArr(v) { return v == null ? [] : Array.isArray(v) ? v : [v]; }

  function evalWhen(cond, answers) {
    if (!cond) return true;
    if (cond.all) return cond.all.every((c) => evalWhen(c, answers));
    if (cond.any) return cond.any.some((c) => evalWhen(c, answers));
    if (cond.not) return !evalWhen(cond.not, answers);
    if (cond.q) {
      const a = answers[cond.q];
      if (cond.answered) return a != null;
      if (a == null) return false;
      const vals = asArr(a);
      return cond.in.some((v) => vals.includes(v));
    }
    throw new Error('Bad condition ' + JSON.stringify(cond));
  }

  function applicable(q, answers) { return evalWhen(q.when, answers); }

  /* Remove answers to questions that no longer apply (repeat until stable). Returns removed ids. */
  function prune(issue, answers) {
    const removed = [];
    let changed = true;
    while (changed) {
      changed = false;
      for (const q of issue.questions) {
        if (answers[q.id] != null && !applicable(q, answers)) { delete answers[q.id]; removed.push(q.id); changed = true; }
      }
    }
    return removed;
  }

  function stageQuestions(issue, answers, stage) {
    return issue.questions.filter((q) => (stage === 'deep' ? !!q.deep : !q.deep) && applicable(q, answers));
  }

  function nextQuestion(issue, answers, stage, skipped) {
    skipped = skipped || {};
    return stageQuestions(issue, answers, stage).find((q) => answers[q.id] == null && !skipped[q.id]) || null;
  }

  function progress(issue, answers, stage, skipped) {
    const qs = stageQuestions(issue, answers, stage);
    const done = qs.filter((q) => answers[q.id] != null || (skipped && skipped[q.id])).length;
    return { done, total: qs.length };
  }

  function evidence(issue, answers) { return issue.evidence.filter((e) => evalWhen(e.when, answers)); }
  function urgent(issue, answers) { return (issue.urgent || []).filter((u) => evalWhen(u.when, answers)); }
  function info(issue, answers) { return (issue.info || []).filter((i) => evalWhen(i.when, answers)); }
  function lawyerQs(issue, answers) { return (issue.lawyerQs || []).filter((l) => evalWhen(l.when, answers)); }
  function stand(issue, answers) { return (issue.stand || []).map((s, idx) => Object.assign({ idx }, s)).filter((s) => evalWhen(s.when, answers)); }
  function hasDeep(issue, answers) { return stageQuestions(issue, answers, 'deep').length > 0; }

  /* Collect every question/option ID referenced by conditions (for validation). */
  function refs(cond, out) {
    if (!cond) return out;
    if (cond.all) cond.all.forEach((c) => refs(c, out));
    else if (cond.any) cond.any.forEach((c) => refs(c, out));
    else if (cond.not) refs(cond.not, out);
    else if (cond.q) out.push(cond);
    return out;
  }

  /* ---- Search: plain words, English word endings and common Hindi/Hinglish words people type ---- */
  const PHRASES = [
    ['god lena', 'adopt'], ['god le', 'adopt'], ['kho gaya', 'lost'], ['kho gayi', 'lost'], ['gum ho', 'missing'], ['bhaag gayi', 'ran away missing'], ['bhag gayi', 'ran away missing'], ['bhaag gaya', 'ran away missing'],
    ['ghar se', 'home'], ['wapas nahi', 'not returned'], ['nahi de raha', 'not paying'], ['nahi di', 'not paid'], ['nahi mila', 'not received'], ['nahi ban raha', 'not issued delayed'],
    ['kaat liya', 'bite'], ['kaat lia', 'bite'], ['naam badal', 'name change'], ['naam badalna', 'name change'], ['jaati ke naam', 'caste'], ['rasta band', 'pathway blocked'], ['dhamki de', 'threat'],
    ['police nahi', 'police refused'], ['fir darj', 'fir registered'], ['case kar diya', 'case filed against me'], ['jhoota case', 'false case'], ['jhutha case', 'false case'], ['nikal diya', 'thrown out fired'], ['nikaal diya', 'thrown out fired'], ['nikala', 'thrown out fired'], ['another woman', 'extramarital affair'], ['another man', 'extramarital affair'], ['dusri shaadi', 'second marriage'], ['doosri shaadi', 'second marriage'], ['shikayat nahi', 'complaint refused'], ['maang rahe', 'demand'], ['not answering', 'missing'], ['not picking', 'missing'], ['switched off', 'missing'], ['in my name', 'misuse identity'], ['using my aadhaar', 'aadhaar misuse identity'], ['used my aadhaar', 'aadhaar misuse identity'], ['let me see', 'visitation custody'], ['letting me see', 'visitation custody'], ['not allowing us', 'denied access'], ['cannot come back', 'held trafficked'], ['can not come back', 'held trafficked']
  ];
  const HI = {
    kutta: 'dog', kutte: 'dog', kutto: 'dog', bandar: 'monkey', gaay: 'cattle', saand: 'cattle', jaati: 'caste', jati: 'caste', gaali: 'abuse insult', gali: 'abuse insult', naam: 'name', badalna: 'change',
    vasiyat: 'will', wasiyat: 'will', vasiyatnama: 'will', bachcha: 'child', bacha: 'child', bachche: 'child', bacchi: 'child', beti: 'daughter', beta: 'son', raashan: 'ration', rashan: 'ration',
    chori: 'stolen theft', chor: 'theft', zameen: 'land', jameen: 'land', jamin: 'land', bhumi: 'land', khet: 'farm land', makaan: 'house', makan: 'house', ghar: 'house home', paisa: 'money', paise: 'money', rupaye: 'money',
    padosi: 'neighbour', pados: 'neighbour', patni: 'wife', biwi: 'wife', pati: 'husband', sasur: 'in laws', saas: 'in laws', sasural: 'in laws', naukri: 'job', sarkari: 'government', sarkar: 'government',
    bijli: 'electricity', kiraya: 'rent', kirayedar: 'tenant', kirayadar: 'tenant', malik: 'owner landlord', makaanmalik: 'landlord', thagi: 'fraud', dhokha: 'fraud cheated', dhoka: 'fraud cheated', marpeet: 'assault', maarpeet: 'assault',
    dhamki: 'threat', talak: 'divorce', talaq: 'divorce', dahej: 'dowry', shaadi: 'marriage', shadi: 'marriage', vivah: 'marriage', tankhwah: 'salary', vetan: 'salary', majdoori: 'wages', mazdoori: 'wages', kharab: 'defective',
    wapas: 'return refund', gaadi: 'vehicle', gadi: 'vehicle', chalan: 'challan', mobile: 'phone', fone: 'phone', bimari: 'illness', aspatal: 'hospital', hospital: 'hospital', bank: 'bank', karz: 'loan', karza: 'loan', udhar: 'udhaar',
    vakil: 'lawyer', adalat: 'court', kachehri: 'court', thana: 'police station', daroga: 'police', hissa: 'share partition', batwara: 'partition', virasat: 'inheritance', warisat: 'inheritance', pension: 'pension',
    beej: 'seed', fasal: 'crop', bima: 'insurance', naukrani: 'maid', school: 'school', fees: 'fee', namantaran: 'mutation', dakhil: 'mutation', kharij: 'mutation', registry: 'registry', jhagda: 'dispute', jhagra: 'dispute',
    lapata: 'missing', gumshuda: 'missing', balatkar: 'rape', chhed: 'molestation harassment', chhedkhani: 'molestation harassment', pareshan: 'harassment', pareshaan: 'harassment', dhanda: 'business', vyapar: 'business'
  };
  const EN = {
    stole: 'stolen theft', stolen: 'theft', snatched: 'stolen theft', snatch: 'stolen theft', robbed: 'stolen theft', theft: 'stolen', pickpocket: 'stolen', seeping: 'seepage leakage', seepage: 'leakage', leaking: 'leakage',
    insulted: 'insult abuse', abused: 'abuse', slurs: 'abuse', cops: 'police', kids: 'child', children: 'child', fired: 'terminated', sacked: 'terminated', laid: 'terminated', bitten: 'bite', bit: 'bite',
    widow: 'pension death', late: 'death', died: 'death', deceased: 'death', passed: 'death', facebook: 'social media', instagram: 'instagram social media', twitter: 'social media', lies: 'false defamation',
    landlord: 'landlord', flat: 'flat', ceiling: 'leakage', upstairs: 'neighbour', downstairs: 'neighbour', factory: 'factory work', kiln: 'brick kiln bonded', villagers: 'village', upper: 'caste', eloped: 'ran away',
    passport: 'passport', marksheet: 'certificate', spelling: 'correction', labourer: 'worker', labour: 'worker', worker: 'worker', fell: 'injury accident', fall: 'injury accident', injured: 'injury', affair: 'extramarital affair', cheating: 'cheated', clients: 'business', rival: 'business', overtime: 'wages salary', probation: 'terminated', sacking: 'terminated', shikayat: 'complaint', shikayaat: 'complaint', saman: 'product', samaan: 'product', dukaan: 'shop', dukan: 'shop', dukaandar: 'seller', army: 'armed forces government', navy: 'armed forces government', airforce: 'armed forces government', soldier: 'armed forces government', jawan: 'armed forces government', temple: 'caste access', mandir: 'caste access', expressway: 'land acquisition highway', highway: 'land acquisition highway', canal: 'land acquisition', dam: 'land acquisition', farmland: 'farm land', customer: 'client business', project: 'client business', invoice: 'client business', qr: 'upi fraud', scan: 'upi fraud', booking: 'builder flat', jewellery: 'streedhan', jewelry: 'streedhan', gold: 'streedhan', identity: 'misuse', misused: 'misuse', answering: 'missing', unreachable: 'missing', meet: 'visitation custody', see: 'visitation custody', abuses: 'abuse', uncle: 'relative', maid: 'domestic worker'
  };
  const STOP = ['the', 'and', 'has', 'have', 'been', 'not', 'was', 'with', 'from', 'that', 'this', 'someone', 'what', 'about', 'my', 'me', 'is', 'are', 'did', 'got', 'for', 'nahi', 'hai', 'kya', 'kaise', 'mera', 'meri', 'mere', 'ka', 'ki', 'ke', 'ko', 'se', 'ne', 'par', 'raha', 'rahi', 'gaya', 'gayi', 'kar', 'diya', 'liya', 'want', 'how', 'can', 'will', 'please', 'help', 'need', 'what', 'they', 'them', 'his', 'her', 'our', 'their', 'very', 'into', 'after', 'before'];
  const SHORT = ['pf', 'rc', 'dl', 'dv', 'ip', 'it', 'nri', 'ca'];
  const stem = (w) => w.length > 5 && w.endsWith('ing') ? w.slice(0, -3) : w.length > 4 && w.endsWith('ied') ? w.slice(0, -3) + 'y' : w.length > 4 && w.endsWith('ed') ? w.slice(0, -2) : w.length > 4 && w.endsWith('es') ? w.slice(0, -2) : w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w;
  function normalise(q) {
    let t = ' ' + String(q || '').toLowerCase().replace(/[^\p{L}\p{N}\s/]/gu, ' ').replace(/\s+/g, ' ') + ' ';
    const extra = [];
    PHRASES.forEach(([a, b]) => { if (t.includes(' ' + a + ' ') || t.includes(' ' + a)) extra.push(b); });
    t.trim().split(' ').forEach((w) => { if (HI[w]) extra.push(HI[w]); if (EN[w]) extra.push(EN[w]); });
    return (t.trim() + ' ' + extra.join(' ')).trim();
  }
  let _idx = null, _idxFor = null;
  function index(items) {
    if (_idxFor === items) return _idx;
    const docs = items.map((it) => [...new Set((it.text + ' ' + it.syn.join(' ')).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean))]);
    _idx = { docs, N: items.length }; _idxFor = items; return _idx;
  }
  function search(items, q) {
    const nq = normalise(q);
    const words = [...new Set(nq.split(/\s+/).filter((w) => (w.length > 2 || SHORT.includes(w)) && !STOP.includes(w)))];
    if (!words.length) return [];
    const { docs, N } = index(items);
    const ql = ' ' + nq + ' ';
    // how each query word matches a document's tokens: exact prefix, stem, or near-stem
    const match = (toks, w) => { if (toks.some((k) => k.startsWith(w))) return 1; const st = stem(w); if (st !== w && st.length > 2 && toks.some((k) => k.startsWith(st))) return 1; if (w.length > 4 && toks.some((k) => k.startsWith(w.slice(0, -1)))) return 0.5; return 0; };
    // rarer words count more (inverse document frequency)
    const weight = {}; words.forEach((w) => { const df = docs.reduce((n, t) => n + (match(t, w) ? 1 : 0), 0); weight[w] = df ? Math.max(0.6, 4 * Math.log((N + 1) / (df + 1)) / Math.log(N + 1)) : 0; });
    const lq = String(q).toLowerCase().trim();
    return items.map((it, i) => {
      let s = 0; words.forEach((w) => { const m = match(docs[i], w); if (m) s += m * weight[w]; });
      let best = 0;
      it.syn.forEach((x) => { const lx = x.toLowerCase(); if (ql.includes(lx)) { s += 4; best = Math.max(best, lx.length); } if (lx === lq) s += 6; });
      return { s: s > 0.5 ? Math.round((s + Math.min(6, Math.floor(best / 4))) * 10) / 10 : 0, ref: it.ref };
    }).filter((x) => x.s).sort((a, b) => b.s - a.s);
  }
  const ER_ENGINE = { evalWhen, applicable, prune, stageQuestions, nextQuestion, progress, evidence, urgent, info, lawyerQs, stand, hasDeep, refs, search, normalise };
  root.ER_ENGINE = ER_ENGINE;
})(globalThis);
