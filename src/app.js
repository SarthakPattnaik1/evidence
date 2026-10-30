/* EvidenceReady — UI. Answers stay in this tab unless the user opts in to saving on this device. */
(function () {
  'use strict';
  const KB = window.ER_KB, E = window.ER_ENGINE;
  const app = document.getElementById('app');
  const live = document.getElementById('live');
  const STORE_KEY = 'evidenceready_v2';
  const BY_ID = Object.fromEntries(KB.issues.map((i) => [i.id, i]));
  const BUILT = KB.issues.filter((i) => !i.general);
  const CAT = Object.fromEntries(KB.categories.map((c) => [c.id, c]));

  /* ---------- icons ---------- */
  const P = {
    family: '<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c.5-3.6 2.8-6 5.5-6s5 2.4 5.5 6"/><path d="M14 20c.3-2.6 1.6-4.5 3.2-4.5S20.6 17.4 21 20"/>',
    bank: '<path d="M3 10 12 4l9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 20h18"/>',
    bag: '<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    house: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Z"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2"/><path d="M3 13h18"/>',
    umbrella: '<path d="M3 12a9 9 0 0 1 18 0H3Z"/><path d="M12 12v6a2 2 0 0 1-4 0"/>',
    more: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    check: '<path d="m5 12 4.5 4.5L19 7"/>',
    alert: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17.5v.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    back: '<path d="M15 5 8 12l7 7"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.2-7 8-7s7 2.5 8 7"/>',
    q: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17v.5"/>'
  };
  const ic = (n, s = 20) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
  const LOGO = `<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path d="M4 8a2 2 0 0 1 2-2h7l2.5 2.5H26a2 2 0 0 1 2 2V25a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" fill="#E7D4A2"/><rect x="8" y="5" width="3" height="23" rx="1" fill="#B02A23"/><path d="m14.5 17.5 3 3 6-6.5" fill="none" stroke="#14254A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* ---------- helpers ---------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const today = () => new Date().toISOString().slice(0, 10);
  const fmtDate = (d) => { if (!d) return ''; const t = new Date(d + 'T00:00:00'); return isNaN(t) ? d : t.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); };
  const KEYS = 'ABCDEFGHI';
  function announce(m) { live.textContent = ''; setTimeout(() => { live.textContent = m; }, 30); }
  let tt; function toast(m) { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2400); announce(m); }
  const optLabel = (q, id) => (q.options.find((o) => o.id === id) || {}).label || id;
  const answerText = (q, a) => (Array.isArray(a) ? a.map((x) => optLabel(q, x)).join('; ') : optLabel(q, a));
  const chapOf = (q) => q.chapter || 'The basics';

  /* ---------- state ---------- */
  const blank = () => ({ issueId: null, topic: null, answers: {}, skipped: {}, stage: 'quick', history: [], quickDone: false, deepDone: false,
    status: {}, records: {}, chrono: [], ackUrgent: {}, adv: null, excludeSensitive: true, notes: '', prefill: {}, chapterFound: [], breaks: 0 });
  let S = blank();
  const UI = { club: 'money', qcat: 'all', qsearch: '', mf: { i: 0, score: 0, ans: null, order: null } };
  let saveOn = false;
  function persist() { if (!saveOn) return; try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* unavailable */ } }
  function loadSaved() { try { const v = localStorage.getItem(STORE_KEY); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function clearSaved() { try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ } }
  const issue = () => BY_ID[S.issueId];

  let downloads = null;
  try { if (window.claude && window.claude.use) window.claude.use('downloads').then((d) => { downloads = d; if (location.hash === '#report') render(); }).catch(() => {}); } catch (e) { /* none */ }

  /* ---------- routing ---------- */
  function go(v) { if (location.hash === '#' + v) render(); else location.hash = v; }
  window.addEventListener('hashchange', render);

  function shell(inner, opt = {}) {
    const sensitive = !!(issue() && issue().sensitive && opt.inJourney);
    document.body.classList.toggle('calm', sensitive);
    return `<header class="top"><div class="wrap">
        <button class="brand" data-go="home" aria-label="EvidenceReady home">${LOGO}<span>EvidenceReady</span></button>
        <button class="nav" data-go="questions">${ic('q', 18)}<span class="lbl-long">Legal questions</span><span class="lbl-short">Ask</span></button>
        <button class="nav" data-go="help">${ic('phone', 18)}<span class="lbl-long">Urgent help</span><span class="lbl-short">Help</span></button>
        <button class="nav lang" data-act="lang" aria-label="Language: English. Change language">${ic('globe', 18)}<span class="lbl-long">English</span><span class="lbl-short">EN</span></button>
        ${sensitive ? `<a class="nav exit" data-act="exit" href="https://www.google.com" target="_blank" rel="noopener noreferrer" title="Clears this page and opens a neutral website">${ic('x', 18)}<span>Exit</span></a>` : ''}
      </div></header>
      <main id="main" tabindex="-1">${inner}</main>
      ${opt.tray ? trayHTML() : ''}
      ${opt.noFooter ? '' : footer()}`;
  }
  function footer() {
    return `<footer class="foot"><div class="wrap">
      <p><span class="tag draft">${esc(KB.reviewed.label)}</span></p>
      <p style="max-width:62em">EvidenceReady helps you prepare for a meeting with an advocate. It is not legal advice, does not replace an advocate, and cannot tell you whether a court will accept any document. Content v${esc(KB.version)}.</p>
      <div class="row"><button data-go="about">How this works &amp; privacy</button><button data-go="advocates">For advocates</button><button data-go="myths">Myth or fact</button><button data-go="help">Legal aid &amp; urgent help</button>${S.issueId ? '<button data-act="clear">Clear my answers</button>' : ''}</div>
    </div></footer>`;
  }

  function render() {
    const raw = (location.hash || '').slice(1);
    if (raw.startsWith('a-')) { applyAdvLink(raw); return; }
    const [view, ...rest] = raw.split('-'); const arg = rest.join('-');
    const need = (fn) => (S.issueId ? fn() : viewHome());
    const map = {
      cat: () => { UI.club = CAT[arg] ? arg : UI.club; return viewHome(true); },
      start: () => viewIntro(arg), topic: () => viewIntro('general', KB.directory[Number(arg)]),
      quiz: () => need(viewQuiz), brk: () => need(viewBreak), urgent: () => need(viewUrgent), list: () => need(viewList),
      answers: () => need(viewAnswers), timeline: () => need(viewTimeline), report: () => need(viewReport),
      questions: () => viewQuestions(), q: () => viewQuestions(arg), myths: () => viewMyths(), advocates: () => viewAdvocates(), help: () => viewHelp(), about: () => viewAbout()
    };
    app.innerHTML = (map[view] || (() => viewHome()))();
    const h = app.querySelector('h1');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    if (view === 'cat') document.getElementById('shelf')?.scrollIntoView();
    else if (view === 'q') document.getElementById('qa-' + arg)?.scrollIntoView();
    else window.scrollTo(0, 0);
    afterRender(view);
  }

  /* ============ HOME ============ */
  const SUGGEST = ['My cheque bounced', 'UPI fraud', 'Divorce', 'NRI property', 'Client not paying', 'Landlord kept my deposit'];
  function clubRows(cid) {
    const deep = BUILT.filter((i) => i.cat === cid);
    const gen = KB.directory.map((d, idx) => ({ ...d, idx })).filter((d) => d.cat === cid);
    return deep.map((i) => `<button class="issue" data-play="${i.id}"><b>${esc(i.short)}</b><span>${esc(i.title)}</span><em>Guided, up to ${i.evidence.length} records</em></button>`).join('')
      + gen.map((d) => `<button class="issue gen" data-play="general" data-topic="${d.idx}"><b>${esc(d.title)}</b><span>General preparation for now</span><em>general</em></button>`).join('');
  }
  function viewHome() {
    const saved = !S.issueId && loadSaved();
    const topQs = ['cheque-bounce-steps', 'mutual-divorce-time', 'upi-fraud-first', 'daughter-share', 'fir-refused', 'consumer-complaint', 'anticipatory-bail', 'rent-11-months'].map((id) => KB.questions.find((q) => q.id === id)).filter(Boolean);
    const sample = KB.myths.slice(0, 3);
    return shell(`<div class="wrap">
      ${saved && saved.issueId ? `<div class="banner info" style="margin-top:18px">${ic('folder')}<div><h3>Your saved file is on this device</h3><p>${esc((BY_ID[saved.issueId] || {}).short || '')}. <button class="btn text" data-act="resume">Open it</button> <button class="btn text" data-act="forget">Delete it</button></p></div></div>` : ''}
      <section class="hero">
        <div>
          <h1>Going to a lawyer? Know what to bring.</h1>
          <p class="lead">Tell us what happened in a few taps. We'll build your case file: the records to collect, where to find them, the dates that matter, and the questions to ask.</p>
          <div class="row" style="margin-top:22px"><button class="btn go" data-act="toshelf">Pick your problem</button><button class="btn line" data-go="questions">I just have a legal question</button></div>
        </div>
        <div class="cover" role="search">
          <span class="tape" aria-hidden="true"></span>
          <label for="matter">In the matter of:</label>
          <input id="matter" class="matter" type="search" autocomplete="off" placeholder="describe it in your words…" aria-describedby="mhint">
          <span id="mhint" class="sr">Matching problems appear below as you type</span>
          <div id="results" class="results" aria-live="polite"></div>
          <div class="suggest" id="suggest">${SUGGEST.map((x) => `<button class="slipchip" data-ex="${esc(x)}">${esc(x)}</button>`).join('')}</div>
          <div class="foot"><span>${ic('check', 15)} Free</span><span>${ic('check', 15)} No sign-up</span><span>${ic('lock', 15)} Nothing is uploaded</span></div>
        </div>
      </section>
      <section class="shelf" id="shelf" aria-labelledby="shelfh">
        <h2 id="shelfh">Or pick from the shelf</h2>
        <p class="muted" style="margin:0">${BUILT.length} guided problems, chosen from the disputes that most often reach Indian courts, consumer helplines and the RBI Ombudsman.</p>
        <div class="tabs" role="tablist" aria-label="Problem areas">${KB.categories.map((c) => `<button class="tab" role="tab" id="tab-${c.id}" aria-controls="drawer" aria-selected="${UI.club === c.id}" data-club="${c.id}">${ic(c.icon, 17)} ${esc(c.title)}</button>`).join('')}</div>
        <div class="drawer" id="drawer" role="tabpanel" aria-labelledby="tab-${UI.club}">${clubRows(UI.club)}
          <button class="issue gen" data-play="general"><b>Something else, or not sure</b><span>Answer a few general questions</span><em>general</em></button></div>
      </section>
      <section class="split">
        <div>
          <h2>Questions people ask most</h2>
          <ul class="qlist">${topQs.map((q) => `<li><button data-go="q-${q.id}">${esc(q.q)}</button></li>`).join('')}</ul>
          <p style="margin-top:12px"><button class="btn text" data-go="questions">See all ${KB.questions.length} questions</button></p>
        </div>
        <div class="game">
          <h2>Myth or fact?</h2>
          <p>${KB.myths.length} quick cards on rights people often get wrong. Takes two minutes.</p>
          <div class="deck" aria-hidden="true">${sample.map((m) => `<div>${esc(m.s)}</div>`).join('')}</div>
          <button class="btn go" data-go="myths">Play</button>
        </div>
      </section>

    </div>`);
  }
  function searchAll(q) {
    const stop = ['the', 'and', 'has', 'have', 'been', 'not', 'was', 'with', 'from', 'that', 'this', 'someone', 'what', 'about', 'my', 'me', 'is', 'are', 'did', 'got', 'for'];
    const words = q.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter((w) => w.length > 2 && !stop.includes(w));
    if (!words.length) return [];
    const ql = q.toLowerCase();
    const score = (t, syn) => { const hay = (t + ' | ' + syn.join(' | ')).toLowerCase(); let s = 0; words.forEach((w) => { if (hay.includes(w)) s += 2; else if (w.length > 4 && hay.includes(w.slice(0, -1))) s += 1; }); syn.forEach((x) => { if (ql.includes(x)) s += 4; }); return s; };
    const res = [];
    BUILT.forEach((i) => { const s = score(i.title + ' ' + i.short, i.synonyms); if (s) res.push({ s: s + 1, play: i.id, title: i.short, kind: 'Guided' }); });
    KB.directory.forEach((d, idx) => { const s = score(d.title, d.synonyms); if (s) res.push({ s, play: 'general', topic: idx, title: d.title, kind: 'General' }); });
    KB.questions.forEach((x) => { const s = score(x.q, x.kw); if (s > 2) res.push({ s: s - 1, go: 'q-' + x.id, title: x.q, kind: 'Answer' }); });
    return res.sort((a, b) => b.s - a.s).slice(0, 6);
  }
  function renderResults(q) {
    const box = document.getElementById('results'); if (!box) return;
    document.getElementById('suggest').hidden = !!q.trim();
    if (!q.trim()) { box.innerHTML = ''; return; }
    const r = searchAll(q);
    box.innerHTML = r.length ? r.map((x) => `<button class="res" ${x.play ? `data-play="${x.play}" ${x.topic != null ? `data-topic="${x.topic}"` : ''}` : `data-go="${x.go}"`}><span>${esc(x.title)}</span><small>${x.kind}</small></button>`).join('')
      : `<button class="res" data-play="general"><span>Not sure what this is? Use general preparation</span><small>General</small></button>`;
  }

  /* ============ INTRO ============ */
  function startIssue(id, topic) { const keep = S.adv && S.adv.issueId === id ? S.adv : null; S = blank(); S.issueId = id; S.topic = topic || null; S.adv = keep; persist(); }
  function viewIntro(id, topic) {
    const iss = BY_ID[id]; if (!iss) return viewHome();
    const qs = E.stageQuestions(iss, {}, 'quick');
    const chaps = [...new Set(iss.questions.map(chapOf))];
    const adv = S.adv && S.adv.issueId === id ? S.adv : null;
    return shell(`<div class="wrap narrow"><section style="padding:20px 0 40px">
      <button class="btn text" data-go="${topic ? 'cat-' + topic.cat : 'cat-' + iss.cat}">${ic('back', 18)} Back to the shelf</button>
      ${adv ? advBanner(adv) : ''}
      <div class="filehead"><span class="tape" aria-hidden="true"></span><p class="typed">In the matter of:</p><h1>${esc(topic ? topic.title : iss.short)}</h1></div>
      ${topic && topic.urgentNote ? `<div class="banner soon">${ic('alert')}<div><h3>Before you start</h3><p>${esc(topic.urgentNote)}</p></div></div>` : ''}
      <p class="lead">${esc(iss.intro)}</p>
      <div class="panel">
        <h3>${chaps.length} chapters, about ${qs.length} quick questions to start</h3>
        <p class="muted small" style="margin:6px 0 0">${chaps.map(esc).join(' → ')}</p>
        <p class="small" style="margin:10px 0 0">Your first list appears after the quick round. You can go deeper after that, or stop.</p>
      </div>
      <p class="small muted" style="margin-top:14px"><span class="tag draft">${esc(KB.reviewed.label)}</span> ${esc(iss.juris)}</p>
      <div class="row" style="margin-top:18px"><button class="btn go" data-act="begin" data-id="${iss.id}" ${topic ? `data-topic="${KB.directory.indexOf(topic)}"` : ''}>Open my file</button><span class="small muted">${ic('lock', 14)} Skip any question. Stop any time.</span></div>
    </section></div>`);
  }
  function advBanner(adv) {
    return `<div class="banner adv">${ic('user')}<div><h3>${adv.name ? esc(adv.name) + ' asked you to prepare' : 'Your advocate asked you to prepare'}</h3>${adv.note ? `<p>“${esc(adv.note)}”</p>` : ''}${adv.must && adv.must.length ? '<p class="small">Records they want are marked <span class="tag adv">Advocate asked</span>.</p>' : ''}</div></div>`;
  }

  /* ============ QUIZ ============ */
  const currentQ = () => E.nextQuestion(issue(), S.answers, S.stage, S.skipped);
  function chaptersFor(stage, cur) {
    const iss = issue(); const qs = E.stageQuestions(iss, S.answers, stage);
    const names = [...new Set(qs.map(chapOf))];
    return names.map((n) => { const inC = qs.filter((q) => chapOf(q) === n); const done = inC.every((q) => S.answers[q.id] != null || S.skipped[q.id]); return { n, done, now: cur && chapOf(cur) === n }; });
  }
  function trayHTML() {
    const n = E.evidence(issue(), S.answers).length;
    return `<div class="tray noprint"><div class="wrap"><div class="trayin" id="tray"><span class="count" id="traycount">${n}</span><span class="lbl">records in<br>your file</span><button class="btn" data-act="showlist">Open file</button></div></div></div>`;
  }
  function viewQuiz() {
    const iss = issue(); const q = currentQ();
    if (!q) { finishStage(); return viewList(); }
    const pr = E.progress(iss, S.answers, S.stage, S.skipped);
    const multi = q.type === 'multi';
    const cur = S.answers[q.id] != null ? S.answers[q.id] : (S.prefill || {})[q.id];
    const urg = E.urgent(iss, S.answers).filter((u) => u.level !== 'info');
    return shell(`<div class="wrap narrow qwrap">
      <nav class="chapters" aria-label="Chapters">${chaptersFor(S.stage, q).map((c) => `<span class="chap ${c.now ? 'now' : c.done ? 'done' : ''}" ${c.now ? 'aria-current="step"' : ''}>${c.done && !c.now ? ic('check', 14) : ''}${esc(c.n)}</span>`).join('')}</nav>
      ${S.stage === 'quick' && pr.done === 0 ? `<div class="opener"><span class="typed">In the matter of:</span> <b>${esc(S.topic ? S.topic.title : iss.short)}</b><p>${esc(iss.intro)}</p>${S.topic && S.topic.urgentNote ? `<p class="warn">${esc(S.topic.urgentNote)}</p>` : ''}${S.adv && S.adv.issueId === iss.id ? advBanner(S.adv) : ''}</div>` : ''}
      ${urg.map(urgentBanner).join('')}
      <div class="qmeta"><span>${S.stage === 'quick' ? 'Quick round' : 'Going deeper'}</span><span>${pr.done + 1} of about ${pr.total}</span></div>
      <form id="qform" data-q="${q.id}">
        <fieldset><legend><h1 class="qtext">${esc(q.text)}</h1></legend>
          ${multi ? '<p class="muted small" style="margin:8px 0 0">Choose all that apply, then continue.</p>' : ''}
          <div class="opts">${q.options.map((o, i) => { const ch = multi ? (cur || []).includes(o.id) : cur === o.id;
            return `<label class="opt"><input type="${multi ? 'checkbox' : 'radio'}" name="a" value="${o.id}" ${ch ? 'checked' : ''}><span class="key" aria-hidden="true">${KEYS[i]}</span><span>${esc(o.label)}</span></label>`; }).join('')}</div>
        </fieldset>
        <p class="why"><b>Why we ask:</b> ${esc(q.why)}</p>
        <div class="qfoot"><div class="row"><button type="button" class="btn line" data-act="qback" ${S.history.length ? '' : 'disabled'}>${ic('back', 18)} Back</button><button type="button" class="btn text" data-act="skip">Skip</button></div>
          <button type="submit" class="btn go" id="nextbtn" ${multi ? '' : 'hidden'}>Continue</button></div>
      </form>
      <p class="small muted keytip" style="margin-top:14px">Tip: press ${KEYS.slice(0, q.options.length).split('').join(', ')} to answer.</p>
    </div>`, { tray: true, inJourney: true });
  }
  function urgentBanner(u) {
    const help = (u.help || []).map((h) => KB.help[h]).filter(Boolean);
    return `<div class="banner ${u.level}" role="${u.level === 'now' ? 'alert' : 'note'}">${ic(u.level === 'info' ? 'info' : 'alert')}<div><h3>${esc(u.title)}</h3><p>${esc(u.text)}</p>${help.length ? `<p class="small" style="margin-top:6px">${help.map((h) => `<b>${esc(h.label)}</b> ${esc(h.name)}`).join(' | ')}</p>` : ''}</div></div>`;
  }
  function answer(q, val) {
    const iss = issue();
    const beforeEv = new Set(E.evidence(iss, S.answers).map((e) => e.id));
    const beforeUrg = new Set(E.urgent(iss, S.answers).map((u) => u.id));
    S.history.push({ id: q.id, stage: S.stage });
    S.answers[q.id] = val; delete S.skipped[q.id];
    E.prune(iss, S.answers).forEach((id) => { S.history = S.history.filter((h) => h.id !== id); });
    const added = E.evidence(iss, S.answers).filter((e) => !beforeEv.has(e.id));
    S.chapterFound = [...new Set([...(S.chapterFound || []), ...added.map((e) => e.id)])];
    persist();
    const newNow = E.urgent(iss, S.answers).find((u) => u.level === 'now' && !beforeUrg.has(u.id) && !S.ackUrgent[u.id]);
    if (newNow) { S.pendingUrgent = newNow.id; go('urgent'); return; }
    S._fly = added.map((e) => e.name);
    nextAfter(q);
  }
  function nextAfter(q) {
    const nq = currentQ();
    if (!nq) { S._fly = null; finishStage(); go('brk'); return; }
    if (q && chapOf(nq) !== chapOf(q)) {
      const chapQs = issue().questions.filter((x) => chapOf(x) === chapOf(q) && (S.answers[x.id] != null || S.skipped[x.id]));
      if ((S.chapterFound || []).length) { S._fly = null; S.breakChapter = chapOf(q); go('brk'); return; }
    }
    render();
  }
  function finishStage() { if (S.stage === 'quick') S.quickDone = true; else S.deepDone = true; S.breakChapter = S.breakChapter || null; persist(); }

  /* chapter break / end of round */
  function viewBreak() {
    const iss = issue(); const nq = currentQ();
    const found = (S.chapterFound || []).map((id) => iss.evidence.find((e) => e.id === id)).filter(Boolean);
    const tips = iss.tips || [];
    const tip = tips.length ? tips[(S.breaks || 0) % tips.length] : null;
    const title = nq ? `Chapter done: ${S.breakChapter || ''}` : (S.stage === 'quick' ? 'Quick round done' : 'All questions done');
    return shell(`<div class="wrap narrow break">
      ${iss.sensitive ? '' : '<span class="stamp">Filed</span>'}
      <h1 style="font-size:clamp(28px,5vw,44px)">${esc(title)}</h1>
      ${found.length ? `<p class="lead">${found.length === 1 ? 'One new record' : found.length + ' new records'} went into your file.</p><div class="found">${found.map((e) => `<div class="slip">${esc(e.name)}</div>`).join('')}</div>` : '<p class="lead">Nothing new this chapter — that\'s normal.</p>'}
      ${tip ? `<div class="tip"><b>Good to know</b>${esc(tip)}</div>` : ''}
      <div class="row">${nq ? `<button class="btn go" data-act="continue">Next chapter: ${esc(chapOf(nq))}</button><button class="btn line" data-act="showlist">Open my file</button>`
        : `<button class="btn go" data-act="showlist">Open my file</button>`}</div>
    </div>`, { tray: !!nq, inJourney: true });
  }

  function viewUrgent() {
    const iss = issue(); const u = (iss.urgent || []).find((x) => x.id === S.pendingUrgent);
    if (!u) return viewQuiz();
    const help = (u.help || []).map((h) => KB.help[h]).filter(Boolean);
    return shell(`<div class="wrap narrow" style="padding:26px 0 60px">
      <div class="banner now" role="alert">${ic('alert', 24)}<div><h1 style="font-size:clamp(24px,4vw,32px);margin:0 0 6px">${esc(u.title)}</h1><p>${esc(u.text)}</p></div></div>
      <div class="grid" style="margin:16px 0">${help.map(helpCard).join('')}</div>
      <p class="muted">Your answers are kept on this page. Come back and finish when you can.</p>
      <div class="row"><button class="btn go" data-act="ackurgent">Continue preparing</button><button class="btn line" data-act="showlist">Open my file now</button></div>
    </div>`, { inJourney: true });
  }
  function helpCard(h) {
    return `<div class="helpcard"><span class="helpnum">${esc(h.label)}</span><div><h3>${esc(h.name)}</h3><p class="small muted" style="margin:2px 0 0">${esc(h.detail)}</p>${h.href ? `<a class="small" href="${esc(h.href)}" target="_blank" rel="noopener">${esc(h.href.replace('https://', ''))}</a>` : ''}</div></div>`;
  }

  /* ============ YOUR FILE ============ */
  const STATUSES = [['have', 'I have it'], ['find', 'Need to find it'], ['others', 'Someone else has it'], ['unsure', 'Not sure'], ['na', 'Doesn\'t apply']];
  const ACTION_ST = [['have', 'Done'], ['find', 'To do'], ['na', 'Doesn\'t apply']];
  function viewList() {
    const iss = issue();
    const items = E.evidence(iss, S.answers);
    const must = new Set((S.adv && S.adv.issueId === iss.id && S.adv.must) || []);
    items.sort((a, b) => (must.has(b.id) - must.has(a.id)) || ((!!b.time) - (!!a.time)));
    const st = (e) => S.status[e.id] || '';
    const checked = items.filter((e) => st(e)).length;
    const urg = E.urgent(iss, S.answers); const infos = E.info(iss, S.answers);
    const quickLeft = E.nextQuestion(iss, S.answers, 'quick', S.skipped);
    const deepLeft = E.nextQuestion(iss, S.answers, 'deep', S.skipped);
    return shell(`<div class="wrap narrow" style="padding-bottom:30px">
      ${S.adv && S.adv.issueId === iss.id ? `<div style="margin-top:18px">${advBanner(S.adv)}</div>` : ''}
      <div class="filehead"><span class="tape" aria-hidden="true"></span><p class="typed">In the matter of: ${esc(S.topic ? S.topic.title : iss.short)}</p><h1>Your file</h1>
        <div class="stack" aria-hidden="true">${items.map((e) => `<i class="${st(e) === 'unsure' ? 'find' : st(e)}"></i>`).join('')}</div>
        <div class="legend"><span>${checked} of ${items.length} checked</span><span>${items.filter((e) => st(e) === 'have').length} in hand</span><span>${items.filter((e) => ['find', 'unsure'].includes(st(e))).length} to find</span><span>${items.filter((e) => st(e) === 'others').length} with others</span></div>
      </div>
      <p class="muted">These records <b>may</b> help your advocate. Mark each one. Missing records are fine — never a reason to delay seeing an advocate.</p>
      ${urg.map(urgentBanner).join('')}
      ${infos.map((x) => `<div class="banner info">${ic('info')}<div><p>${esc(x.text)}</p></div></div>`).join('')}
      ${quickLeft ? `<div class="banner soon">${ic('info')}<div><p>You stopped before the end of the quick round. <button class="btn text" data-act="resumequiz">Answer the rest</button></p></div></div>` : ''}
      ${!quickLeft && deepLeft ? `<div class="deeper"><div><h3>Want a sharper file?</h3><p>A few more questions make this list more specific.</p></div><button class="btn" data-act="deep">Go deeper</button></div>` : ''}
      <div id="evlist">${items.map((e) => evCard(e, must.has(e.id))).join('')}</div>
      <div class="panel">
        <h2>Next steps</h2>
        <div class="row"><button class="btn line" data-go="timeline">${ic('cal', 18)} Add dates</button><button class="btn go" data-go="report">${ic('file', 18)} Make my lawyer folder</button></div>
        <hr style="border:0;border-top:1px solid var(--line);margin:16px 0">
        <label class="check"><input type="checkbox" data-act="savetoggle" ${saveOn ? 'checked' : ''}> Keep my file on this device</label>
        <p class="small muted" style="margin:6px 0 0">Off by default. On a shared phone, others may see it. You can delete it any time.</p>
        <div class="row" style="margin-top:6px"><button class="btn text" data-go="answers">Change my answers</button><button class="btn text" data-act="clear">Clear everything</button></div>
      </div>
    </div>`, { inJourney: true });
  }
  function evCard(e, flagged) {
    const st = S.status[e.id]; const opts = e.action ? ACTION_ST : STATUSES; const recs = S.records[e.id] || [];
    const justStamped = S._stamp === e.id;
    return `<article class="ev ${flagged ? 'flag' : ''}" id="ev-${e.id}">
      ${st === 'have' ? `<span class="instamp ${justStamped ? 'pop' : ''}">${e.action ? 'Done' : 'In file'}</span>` : ''}
      <h3>${esc(e.name)}</h3>
      <div class="tags">${flagged ? '<span class="tag adv">Advocate asked</span>' : ''}${e.action ? '<span class="tag act">Step to take</span>' : ''}${e.time ? '<span class="tag time">Time-sensitive</span>' : ''}${e.holder === 'others' ? '<span class="tag others">Held by others</span>' : ''}</div>
      <p class="w">${esc(e.why)}</p>
      <details><summary>Where to find it, how to keep it</summary><dl>
        <dt>Helps show</dt><dd>${esc(e.fact)}</dd>
        ${e.where ? `<dt>Where to look</dt><dd>${esc(e.where)}</dd>` : ''}
        ${e.preserve ? `<dt>Keep it safe</dt><dd>${esc(e.preserve)}</dd>` : ''}
        ${e.time ? `<dt>Timing</dt><dd>${esc(e.time)}</dd>` : ''}
        ${e.limit ? `<dt>Keep in mind</dt><dd>${esc(e.limit)}</dd>` : ''}
      </dl></details>
      <div class="sts" role="group" aria-label="Status of ${esc(e.name)}">${opts.map(([k, l]) => `<button class="sbtn" data-status="${k}" data-ev="${e.id}" aria-pressed="${st === k}">${esc(l)}</button>`).join('')}</div>
      ${st === 'have' && !e.action ? `<div class="records">
        <p class="small" style="margin:0 0 8px"><b>Name each document you have.</b> Only named documents go into your annexure index.</p>
        ${recs.map((r, i) => `<div class="rec"><span>${esc(r.label)}${r.date ? ', ' + esc(r.date) : ''}${r.pages ? ', ' + esc(r.pages) + ' p.' : ''}</span><button class="btn text" data-delrec="${e.id}:${i}" aria-label="Remove ${esc(r.label)}">Remove</button></div>`).join('')}
        <form class="recform" data-addrec="${e.id}">
          <label class="f full">Document name<input class="t" name="label" required maxlength="120" placeholder="e.g. SBI statement, Apr–Oct 2026"></label>
          <label class="f">Date or period<input class="t" name="date" maxlength="40" placeholder="12 Jan 2026"></label>
          <label class="f">Pages<input class="t" name="pages" inputmode="numeric" maxlength="4" placeholder="3"></label>
          <button class="btn line" type="submit">Add</button>
        </form></div>` : ''}
    </article>`;
  }

  function viewAnswers() {
    const iss = issue(); const qs = iss.questions.filter((q) => S.answers[q.id] != null || S.skipped[q.id]);
    return shell(`<div class="wrap narrow" style="padding:20px 0 40px"><button class="btn text" data-go="list">${ic('back', 18)} Your file</button>
      <h1 style="font-size:clamp(28px,5vw,42px);margin:8px 0 10px">Your answers</h1>
      <p class="muted">Change any answer. Questions that depend on it will be asked again. Documents you named are kept.</p>
      <div class="grid">${qs.map((q) => `<div class="helpcard" style="justify-content:space-between;align-items:center"><div><p class="small muted" style="margin:0">${esc(q.text)}</p><p style="margin:2px 0 0;font-weight:700">${S.skipped[q.id] ? '<span class="muted">Skipped</span>' : esc(answerText(q, S.answers[q.id]))}</p></div><button class="btn line" data-act="change" data-q="${q.id}">Change</button></div>`).join('') || '<p class="muted">No answers yet.</p>'}</div>
    </div>`, { inJourney: true });
  }

  function viewTimeline() {
    const items = [...S.chrono].sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
    return shell(`<div class="wrap narrow" style="padding:20px 0 40px"><button class="btn text" data-go="list">${ic('back', 18)} Your file</button>
      <h1 style="font-size:clamp(28px,5vw,42px);margin:8px 0 10px">Your timeline</h1>
      <p class="muted">List the main events in your own words. Approximate dates are fine — mark them.</p>
      ${items.length ? `<ol class="tl">${items.map((t) => `<li><div class="d">${t.date ? esc(fmtDate(t.date)) + (t.approx ? ' (approx.)' : '') : 'Date unknown'}</div><div>${esc(t.text)}</div><button class="btn text small" data-delchrono="${t.id}">Remove</button></li>`).join('')}</ol>` : '<p class="panel muted">No events yet. Add the first one below.</p>'}
      <form class="panel" id="chronoform">
        <h2>Add an event</h2>
        <div class="grid" style="grid-template-columns:1fr 1fr;align-items:end"><label class="f">Date<input class="t" type="date" name="date" max="${today()}"></label><label class="check"><input type="checkbox" name="approx"> Approximate</label></div>
        <label class="f" style="margin-top:10px">What happened?<textarea class="t" name="text" rows="2" maxlength="300" required placeholder="e.g. Paid ₹40,000 deposit by UPI"></textarea></label>
        <p class="small muted">Stick to what happened. Leave out private details you don't need.</p>
        <button class="btn go" type="submit">Add to timeline</button>
      </form>
      <div class="row" style="margin-top:18px"><button class="btn go" data-go="report">${ic('file', 18)} Make my lawyer folder</button></div>
    </div>`, { inJourney: true });
  }

  /* ============ REPORT ============ */
  const INSTRUCTION = 'Arrange the documents in the order shown in this preparation report. Keep related pages together, preserve original records, and make clear, complete copies. Where appropriate, add dates and page numbers so your advocate can review the materials and determine how they should be presented as annexures or exhibits in court. The final order, numbering, certification, format, admissibility and filing requirements must be confirmed by your advocate and the relevant court.';
  function reportData() {
    const iss = issue(); const items = E.evidence(iss, S.answers);
    const shown = iss.questions.filter((q) => S.answers[q.id] != null && !(S.excludeSensitive && q.sensitive));
    const unresolved = iss.questions.filter((q) => E.applicable(q, S.answers) && (S.skipped[q.id] || (S.answers[q.id] && [].concat(S.answers[q.id]).includes('unsure'))));
    const by = (k) => items.filter((e) => (S.status[e.id] || '') === k);
    const annex = []; items.forEach((e) => (S.status[e.id] === 'have' ? (S.records[e.id] || []) : []).forEach((r) => annex.push({ ...r, ev: e })));
    return { iss, shown, unresolved, have: by('have').filter((e) => !e.action), others: by('others'), missing: items.filter((e) => ['find', 'unsure', ''].includes(S.status[e.id] || '') && !e.action),
      todo: items.filter((e) => e.action && !['have', 'na'].includes(S.status[e.id])), annex, urgent: E.urgent(iss, S.answers).filter((u) => u.level !== 'info'), lqs: E.lawyerQs(iss, S.answers),
      chrono: [...S.chrono].sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999')) };
  }
  function reportHTML(d) {
    const iss = d.iss; const li = (arr, f) => arr.length ? `<ul>${arr.map((x) => `<li>${f(x)}</li>`).join('')}</ul>` : '<p class="muted">None recorded.</p>';
    return `<p class="meta">EvidenceReady preparation pack. Prepared ${esc(fmtDate(today()))}. Content v${esc(KB.version)} (${esc(KB.reviewed.label)}).</p>
      <h1>Lawyer preparation pack</h1><p><b>${esc(S.topic ? S.topic.title : iss.title)}</b></p>
      ${S.adv && S.adv.issueId === iss.id && S.adv.name ? `<p class="meta">Prepared at the request of ${esc(S.adv.name)}.</p>` : ''}
      ${d.urgent.length ? `<p class="instr" style="background:var(--tape-l)">Flagged for prompt attention: ${d.urgent.map((u) => esc(u.title)).join('; ')}.</p>` : ''}
      <h2>A. Matter overview: what I told the tool</h2>
      <p class="meta">These are my own answers and have not been checked by anyone.${S.excludeSensitive && d.shown.length < Object.keys(S.answers).length ? ' Some sensitive answers are left out at my request.' : ''}</p>
      ${d.shown.length ? `<table><thead><tr><th>Question</th><th>My answer</th></tr></thead><tbody>${d.shown.map((q) => `<tr><td>${esc(q.text)}</td><td>${esc(answerText(q, S.answers[q.id]))}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">No answers.</p>'}
      ${S.notes ? `<p><b>In my own words:</b> ${esc(S.notes)}</p>` : ''}
      <h2>B. Chronology</h2>
      ${d.chrono.length ? `<table><thead><tr><th style="width:30%">Date</th><th>Event</th></tr></thead><tbody>${d.chrono.map((t) => `<tr><td>${t.date ? esc(fmtDate(t.date)) + (t.approx ? ' (approx.)' : '') : 'Unknown'}</td><td>${esc(t.text)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">No timeline entries yet.</p>'}
      <h2>C. Records I have</h2>${li(d.have, (e) => `<b>${esc(e.name)}</b>${(S.records[e.id] || []).length ? ': ' + S.records[e.id].map((r) => esc(r.label)).join('; ') : ' <span class="muted">(not named yet)</span>'}`)}
      <h2>D. Records still to find or check</h2>${li(d.missing, (e) => `${esc(e.name)} <span class="muted">(${esc(e.where || '')})</span>${e.time ? ' <b>Time-sensitive.</b>' : ''}`)}
      ${d.todo.length ? `<p><b>Steps not yet done:</b></p>${li(d.todo, (e) => esc(e.name))}` : ''}
      <h2>E. Records held by others</h2>${li(d.others, (e) => `${esc(e.name)} <span class="muted">(${esc(e.where || '')})</span>`)}
      <p class="meta">I will not try to obtain other people's records without lawful permission.</p>
      <h2>F. Unresolved points</h2>${li(d.unresolved, (q) => esc(q.text) + (S.skipped[q.id] ? ' <span class="muted">(skipped)</span>' : ' <span class="muted">(not sure)</span>'))}
      <h2>G. Questions for my advocate</h2>${li(d.lqs, (l) => esc(l.text))}<p class="meta">${esc(iss.juris)}</p>
      <h2>H. Proposed annexure index (provisional)</h2>
      ${d.annex.length ? `<table><thead><tr><th>Proposed</th><th>Document</th><th>Date / period</th><th>Pages</th></tr></thead><tbody>${d.annex.map((r, i) => `<tr><td class="lab">A-${i + 1}</td><td>${esc(r.label)}<br><span class="meta">${esc(r.ev.name)}</span></td><td>${esc(r.date || '—')}</td><td>${esc(r.pages || '—')}</td></tr>`).join('')}</tbody></table>`
        : '<p class="muted">No documents named yet. Mark a record "I have it" and name it to include it here. Missing records are never listed as annexures.</p>'}
      <p class="meta">These numbers are provisional preparation references, not final court exhibit labels.</p>
      <p class="instr">${esc(INSTRUCTION)}</p>
      <p class="meta" style="margin-top:22px">Prepared with EvidenceReady, a free preparation tool. Not legal advice and not a court filing. It does not show that any record is admissible or legally required. Electronic records may have additional legal requirements.</p>`;
  }
  function viewReport() {
    return shell(`<div class="wrap narrow" style="padding-bottom:30px">
      <div class="toolbar noprint"><button class="btn text" data-go="list">${ic('back', 18)} Your file</button><button class="btn go" data-act="print">${ic('file', 18)} Print or save as PDF</button>${downloads ? '<button class="btn line" data-act="download">Download</button>' : ''}<button class="btn line" data-act="copytext">Copy as text</button></div>
      <div class="panel noprint" style="margin:0 0 16px">
        <label class="check"><input type="checkbox" data-act="excl" ${S.excludeSensitive ? 'checked' : ''}> Leave out my answers to sensitive questions</label>
        <label class="f" style="margin-top:12px">Anything else your advocate should know? (optional)<textarea class="t" id="notes" rows="2" maxlength="500">${esc(S.notes)}</textarea></label>
        <p class="small muted" style="margin:8px 0 0">${ic('lock', 14)} A printed or downloaded file can stay on this device and in print queues.</p>
        <p class="small muted" id="printhint" hidden style="margin:6px 0 0">If nothing happened, use your browser menu → Print, or Ctrl+P (⌘P on Mac).</p>
      </div>
      <article class="report" id="report">${reportHTML(reportData())}</article>
    </div>`, { inJourney: true });
  }
  function reportText() {
    const el = document.getElementById('report'); if (!el) return ''; const c = el.cloneNode(true);
    c.querySelectorAll('tr').forEach((tr) => { tr.insertAdjacentText('beforeend', '\n'); tr.querySelectorAll('td,th').forEach((x) => x.insertAdjacentText('afterend', ' | ')); });
    c.querySelectorAll('h1,h2,p,li').forEach((n) => n.insertAdjacentText('afterend', '\n'));
    return c.textContent.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+\n/g, '\n').trim();
  }
  const standaloneReport = () => `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lawyer preparation pack</title><style>${document.getElementById('appcss').textContent} body{padding:24px}</style></head><body><article class="report">${document.getElementById('report').innerHTML}</article></body></html>`;

  /* ============ LEGAL QUESTIONS ============ */
  function viewQuestions(openId) {
    const cats = [['all', 'All'], ...KB.categories.map((c) => [c.id, c.title])].filter(([id]) => id === 'all' || KB.questions.some((q) => q.cat === id));
    const s = UI.qsearch.toLowerCase();
    const list = KB.questions.filter((q) => (UI.qcat === 'all' || q.cat === UI.qcat || q.id === openId) && (!s || (q.q + ' ' + q.a + ' ' + q.kw.join(' ')).toLowerCase().includes(s)));
    return shell(`<div class="wrap narrow" style="padding:26px 0 40px">
      <h1 style="font-size:clamp(30px,5.4vw,48px)">Legal questions, answered plainly</h1>
      <p class="lead" style="margin-top:12px">Short answers to what people ask most. Each one says what can change the answer — and links to a guide if you need to prepare for a lawyer.</p>
      <label class="sr" for="qsearch">Search questions</label>
      <input id="qsearch" class="t" type="search" placeholder="Search, e.g. bail, deposit, gratuity" value="${esc(UI.qsearch)}" style="margin-top:14px">
      <div class="filters">${cats.map(([id, t]) => `<button class="fchip" data-qcat="${id}" aria-pressed="${UI.qcat === id}">${esc(t)}</button>`).join('')}</div>
      <div id="qalist">${list.map((q) => `<details class="qa" id="qa-${q.id}" ${q.id === openId ? 'open' : ''}><summary>${esc(q.q)}</summary><div class="body">
        <p>${esc(q.a)}</p><p class="small" style="margin:0"><b>What can change the answer</b></p><ul>${q.depends.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <p class="law">Law: ${esc(q.law)}. ${esc(KB.reviewed.label)}.</p>
        ${q.journey && BY_ID[q.journey] ? `<button class="btn line" data-play="${q.journey}">Prepare for a lawyer: ${esc(BY_ID[q.journey].short)}</button>` : ''}
      </div></details>`).join('') || '<p class="panel muted">No match. Try other words, or <button class="btn text" data-go="start-general">use general preparation</button>.</p>'}</div>
    </div>`);
  }

  /* ============ MYTH OR FACT ============ */
  function viewMyths() {
    const mf = UI.mf; if (!mf.order) mf.order = KB.myths.map((_, i) => i).sort(() => Math.random() - 0.5);
    if (mf.i >= mf.order.length) {
      return shell(`<div class="wrap mf"><h1 style="font-size:clamp(30px,5vw,44px)">You got ${mf.score} of ${mf.order.length}</h1>
        <p class="lead" style="margin-top:12px">${mf.score >= mf.order.length * 0.8 ? 'You know your rights better than most.' : 'Now you know a few things most people get wrong.'}</p>
        <div class="row" style="margin-top:18px"><button class="btn go" data-act="mfrestart">Play again</button><button class="btn line" data-go="questions">Read the legal questions</button></div></div>`);
    }
    const m = KB.myths[mf.order[mf.i]]; const a = mf.ans;
    return shell(`<div class="wrap mf">
      <h1 style="font-size:clamp(28px,4.6vw,40px);margin-bottom:6px">Myth or fact?</h1>
      <p class="muted">Card ${mf.i + 1} of ${mf.order.length} <span class="score" style="margin-left:10px">Score ${mf.score}</span></p>
      <div class="mfcard"><span class="n">Card ${mf.i + 1}</span><p class="s">${esc(m.s)}</p></div>
      ${a == null ? `<div class="mfbtns"><button class="btn line" data-mf="myth">Myth</button><button class="btn go" data-mf="fact">Fact</button></div>`
        : `<div class="mfresult ${a === m.fact ? 'right' : 'wrong'}" role="status"><b>${a === m.fact ? 'Right' : 'Not quite'}: it's a ${m.fact ? 'fact' : 'myth'}.</b><p style="margin:6px 0 0">${esc(m.why)}</p></div>
           <div class="row" style="margin-top:14px"><button class="btn go" data-act="mfnext">${mf.i + 1 < mf.order.length ? 'Next card' : 'See my score'}</button></div>`}
      <p class="small muted" style="margin-top:20px">General information, not legal advice. ${esc(KB.reviewed.label)}.</p>
    </div>`);
  }

  /* ============ ADVOCATES ============ */
  const encodeHex = (s) => Array.from(new TextEncoder().encode(s)).map((b) => b.toString(16).padStart(2, '0')).join('');
  function decodeHex(h) { try { return new TextDecoder().decode(new Uint8Array((h.match(/.{2}/g) || []).map((x) => parseInt(x, 16)))); } catch (e) { return ''; } }
  function viewAdvocates() {
    const d = UI.advDraft || {}; const sel = d.issueId || BUILT[0].id; const iss = BY_ID[sel]; const must = new Set(d.must || []);
    return shell(`<div class="wrap narrow" style="padding:26px 0 40px">
      <h1 style="font-size:clamp(30px,5vw,46px)">Send a client a preparation link</h1>
      <p class="lead" style="margin-top:12px">Choose a guide, tick the records you want the client to bring, and add a note. The link carries only these choices — never client information.</p>
      <form id="advform" class="panel">
        <label class="f">Guide<select class="t" name="issue" id="advissue">${KB.categories.map((c) => `<optgroup label="${esc(c.title)}">${BUILT.filter((i) => i.cat === c.id).map((i) => `<option value="${i.id}" ${i.id === sel ? 'selected' : ''}>${esc(i.short)}</option>`).join('')}</optgroup>`).join('')}</select></label>
        <fieldset style="margin-top:14px"><legend class="f">Records to flag as “Advocate asked”</legend><p class="small muted" style="margin:2px 0 6px">The client only sees items that apply to their answers.</p>
          ${iss.evidence.map((e) => `<label class="check" style="margin:7px 0"><input type="checkbox" name="must" value="${e.id}" ${must.has(e.id) ? 'checked' : ''}> ${esc(e.name)}</label>`).join('')}</fieldset>
        <label class="f" style="margin-top:14px">Your name as the client knows you (optional)<input class="t" name="name" maxlength="60" placeholder="e.g. Adv. R. Mohanty" value="${esc(d.name || '')}"></label>
        <label class="f" style="margin-top:10px">Short note (optional)<input class="t" name="note" maxlength="140" placeholder="e.g. Bring originals and copies on Friday." value="${esc(d.note || '')}"></label>
        <div class="row" style="margin-top:16px"><button class="btn go" type="submit">Create link</button></div><div id="advout"></div>
      </form></div>`);
  }
  function makeAdvCode(id, mustIds, name, note) {
    const idx = BUILT.findIndex((i) => i.id === id); const ev = BY_ID[id].evidence;
    let mask = 0; mustIds.forEach((m) => { const k = ev.findIndex((e) => e.id === m); if (k >= 0) mask += 2 ** k; });
    return ['a', idx.toString(36), mask.toString(36), encodeHex(name.trim()), encodeHex(note.trim())].join('-');
  }
  function applyAdvLink(raw) {
    const p = raw.split('-'); const iss = BUILT[parseInt(p[1], 36)]; if (!iss) { location.hash = 'home'; return; }
    const mask = parseInt(p[2] || '0', 36) || 0;
    const must = iss.evidence.filter((e, k) => Math.floor(mask / 2 ** k) % 2 === 1).map((e) => e.id);
    if (S.issueId !== iss.id) S = blank();
    S.adv = { issueId: iss.id, must, name: decodeHex(p[3] || '').slice(0, 60), note: decodeHex(p[4] || '').slice(0, 140) };
    location.replace('#start-' + iss.id);
  }

  /* ============ HELP / ABOUT ============ */
  function viewHelp() {
    const order = ['e112', 'w181', 'c1098', 's14567', 'cy1930', 'l15100', 'rbi', 'nch', 'ejag', 'ins', 'cio', 'rera', 'posh', 'samadhan'];
    return shell(`<div class="wrap narrow" style="padding:26px 0 40px">
      <h1 style="font-size:clamp(30px,5vw,46px)">Urgent help and free legal aid</h1>
      <div class="banner now" style="margin-top:16px">${ic('alert')}<div><h3>In immediate danger?</h3><p>Call <b>112</b>. You don't need this tool first.</p></div></div>
      <p class="muted">Free legal aid is available to many people, including women, children, people with disabilities, people in custody, and those below the income limit. Call <b>15100</b> to ask.</p>
      <div class="grid">${order.filter((k) => KB.help[k]).map((k) => helpCard(KB.help[k])).join('')}</div>
      <p class="small muted" style="margin-top:16px">Phone links may not open from this page; dial the number shown. Checked October 2026.</p>
    </div>`);
  }
  function viewAbout() {
    const counts = KB.categories.map((c) => `${c.title}: ${BUILT.filter((i) => i.cat === c.id).length}`).join(', ');
    return shell(`<div class="wrap narrow" style="padding:26px 0 40px">
      <h1 style="font-size:clamp(30px,5vw,46px)">How this works</h1>
      <div class="panel"><h2>What it does</h2><p>You pick a problem and answer short questions in chapters. Each answer changes which records we suggest. The rules live in a structured, tested knowledge base — not generated on the fly by a chatbot.</p><p style="margin:0">You end with a preparation pack: your answers, a timeline, records you have and need, questions for your advocate, and a provisional annexure index built only from documents you named.</p></div>
      <div class="panel"><h2>What it doesn't do</h2><ul style="margin:0;padding-left:20px"><li>Give legal advice or predict results.</li><li>Say a record is legally required or admissible.</li><li>Prepare court filings.</li><li>Ask you to upload documents.</li></ul></div>
      <div class="panel"><h2>Why these problems</h2><p style="margin:0">Guides are chosen from what most often reaches Indian courts (cheque bounce, matrimonial, motor accident, rent and property cases), the National Consumer Helpline (e-commerce, durables, banking, telecom, travel) and the RBI Ombudsman (loans and credit cards lead). Guides by area — ${esc(counts)}.</p></div>
      <div class="panel"><h2>Privacy</h2><p>Your answers stay in this browser tab. Nothing is sent to us. If you switch on "Keep my file on this device", it is saved only in this browser. Advocate links contain only the guide choice and the advocate's note.</p><p style="margin:0">Exit clears the page and opens a neutral website. It does not erase browser history.</p></div>
      <div class="panel"><h2>Review status</h2><p style="margin:0">All guides are <b>drafts</b>, not yet reviewed by a practising advocate. Each guide will show its reviewer and date once reviewed. Languages: English now; Hindi and Odia only after legal and language review. Content v${esc(KB.version)}: ${BUILT.length} guided problems, ${KB.questions.length} answered questions, ${KB.myths.length} myth cards.</p></div>
      ${S.issueId || loadSaved() ? '<button class="btn line" data-act="clear" style="margin-top:16px">Clear everything on this device</button>' : ''}
    </div>`);
  }
  function showLang() {
    const ov = document.createElement('div'); ov.className = 'overlay'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'langh');
    ov.innerHTML = `<div class="dialog"><h2 id="langh">Choose your language</h2><p class="small muted">Languages switch on only after their guides are legally reviewed.</p>
      <button class="langopt" aria-current="true">English <span class="tag act">Available</span></button><button class="langopt" disabled lang="hi">हिन्दी <span class="tag act">Coming</span></button><button class="langopt" disabled lang="or">ଓଡ଼ିଆ <span class="tag act">Coming</span></button>
      <div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn line" data-close>Close</button></div></div>`;
    document.body.appendChild(ov);
    const close = () => { ov.remove(); document.querySelector('[data-act="lang"]')?.focus(); };
    ov.addEventListener('click', (e) => { if (e.target === ov || e.target.closest('[data-close]')) close(); });
    ov.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    ov.querySelector('[data-close]').focus();
  }

  /* ============ events ============ */
  function flyToTray(names) {
    const tray = document.getElementById('tray'); const cnt = document.getElementById('traycount');
    if (!tray || !names.length || issue().sensitive || matchMedia('(prefers-reduced-motion: reduce)').matches) { if (names.length) announce(names.length + ' record' + (names.length > 1 ? 's' : '') + ' added to your file'); return; }
    const from = document.querySelector('.qtext').getBoundingClientRect(); const to = tray.getBoundingClientRect();
    const final = Number(cnt.textContent); const shown = names.slice(0, 3); cnt.textContent = final - names.length;
    shown.forEach((n, i) => {
      const el = document.createElement('div'); el.className = 'flyslip'; el.textContent = n; document.body.appendChild(el);
      const sx = Math.max(12, Math.min(from.left, window.innerWidth - 310)), sy = from.top + 20 + i * 8;
      el.style.left = sx + 'px'; el.style.top = sy + 'px';
      const dx = to.left + 30 - sx, dy = to.top - sy;
      const a = el.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 0 }, { transform: 'translate(0,-6px) rotate(-2deg)', opacity: 1, offset: 0.25 }, { transform: `translate(${dx}px,${dy}px) rotate(4deg) scale(.5)`, opacity: 0.2 }],
        { duration: 900, delay: i * 160, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' });
      a.onfinish = () => { el.remove(); cnt.textContent = i === shown.length - 1 ? final : Number(cnt.textContent) + 1; };
    });
    announce(names.length + ' record' + (names.length > 1 ? 's' : '') + ' added to your file');
  }
  function afterRender(view) {
    const m = document.getElementById('matter'); if (m) m.addEventListener('input', () => renderResults(m.value));
    const qs = document.getElementById('qsearch'); if (qs) qs.addEventListener('input', () => { UI.qsearch = qs.value; const pos = qs.selectionStart; render(); const n = document.getElementById('qsearch'); n.focus(); n.setSelectionRange(pos, pos); });
    const form = document.getElementById('qform');
    if (form) {
      const qq = issue().questions.find((x) => x.id === form.dataset.q); const multi = qq.type === 'multi';
      form.addEventListener('change', (e) => {
        if (e.target.name !== 'a') return;
        if (multi) { const ex = ['none', 'unsure', 'prefer_not'];
          if (e.target.checked && ex.includes(e.target.value)) form.querySelectorAll('input[name=a]').forEach((i) => { if (i !== e.target) i.checked = false; });
          else if (e.target.checked) form.querySelectorAll('input[name=a]').forEach((i) => { if (ex.includes(i.value)) i.checked = false; });
        } else setTimeout(() => answer(qq, e.target.value), 180);
      });
      form.addEventListener('submit', (e) => { e.preventDefault(); const v = [...form.querySelectorAll('input[name=a]:checked')].map((i) => i.value); if (!v.length) { announce('Choose at least one option, or Skip.'); return; } answer(qq, multi ? v : v[0]); });
      if (S._fly) { const f = S._fly; S._fly = null; requestAnimationFrame(() => flyToTray(f)); }
    }
    const cf = document.getElementById('chronoform');
    if (cf) cf.addEventListener('submit', (e) => { e.preventDefault(); const f = new FormData(cf); S.chrono.push({ id: Date.now().toString(36), date: f.get('date') || '', approx: !!f.get('approx'), text: String(f.get('text')).trim() }); persist(); render(); announce('Event added'); });
    const af = document.getElementById('advform');
    if (af) {
      document.getElementById('advissue').addEventListener('change', (e) => { UI.advDraft = { issueId: e.target.value, must: [] }; render(); });
      af.addEventListener('submit', (e) => { e.preventDefault(); const f = new FormData(af);
        const d = { issueId: f.get('issue'), must: f.getAll('must'), name: String(f.get('name') || ''), note: String(f.get('note') || '') }; UI.advDraft = d;
        const code = makeAdvCode(d.issueId, d.must, d.name, d.note); history.replaceState(null, '', '#' + code);
        document.getElementById('advout').innerHTML = `<div class="banner info" style="margin-top:14px">${ic('check')}<div><h3>Link ready</h3><p>This page's address now carries your guide. Copy it from the address bar, or use Share → Copy link, and send it to your client.</p><p class="small" style="margin-top:6px;word-break:break-all">Guide code: <code>${esc(code)}</code> <button type="button" class="btn text" data-copy="${esc(code)}">Copy code</button></p></div></div>`; });
    }
    const notes = document.getElementById('notes'); if (notes) notes.addEventListener('change', () => { S.notes = notes.value.trim(); persist(); render(); });
    S._stamp = null;
  }
  document.addEventListener('keydown', (e) => {
    const form = document.getElementById('qform'); if (!form || e.metaKey || e.ctrlKey || e.altKey) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) && document.activeElement.type !== 'radio' && document.activeElement.type !== 'checkbox') return;
    const k = e.key.toUpperCase(); let idx = KEYS.indexOf(k); if (idx < 0 && /^[1-9]$/.test(k)) idx = Number(k) - 1;
    const inputs = form.querySelectorAll('input[name=a]'); if (idx < 0 || idx >= inputs.length) return;
    e.preventDefault(); const inp = inputs[idx]; inp.checked = inp.type === 'checkbox' ? !inp.checked : true; inp.dispatchEvent(new Event('change', { bubbles: true })); inp.focus();
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-addrec]'); if (!f) return; e.preventDefault();
    const d = new FormData(f); const id = f.dataset.addrec; const label = String(d.get('label') || '').trim(); if (!label) return;
    (S.records[id] = S.records[id] || []).push({ label, date: String(d.get('date') || '').trim(), pages: String(d.get('pages') || '').replace(/\D/g, '') });
    persist(); rerenderList('ev-' + id, 'input[name=label]'); announce('Document added');
  });
  function rerenderList(anchor, sel) {
    const y = window.scrollY; app.innerHTML = viewList(); afterRender('list'); window.scrollTo(0, y);
    const a = document.getElementById(anchor); if (a) { const b = a.querySelector(sel) || a.querySelector('[aria-pressed=true]'); if (b) b.focus({ preventScroll: true }); }
  }
  document.addEventListener('click', async (e) => {
    const pl = e.target.closest('[data-play]');
    if (pl) { e.preventDefault(); startIssue(pl.dataset.play, pl.dataset.topic != null ? KB.directory[Number(pl.dataset.topic)] : null); go('quiz'); return; }
    const t = e.target.closest('[data-go],[data-act],[data-status],[data-delrec],[data-delchrono],[data-ex],[data-copy],[data-club],[data-qcat],[data-mf]'); if (!t) return;
    if (t.dataset.go) { e.preventDefault(); go(t.dataset.go); return; }
    if (t.dataset.club) { UI.club = t.dataset.club; document.querySelectorAll('.tab').forEach((x) => x.setAttribute('aria-selected', x === t)); const d = document.getElementById('drawer'); d.setAttribute('aria-labelledby', t.id); d.innerHTML = clubRows(UI.club) + '<button class="issue gen" data-play="general"><b>Something else, or not sure</b><span>Answer a few general questions</span><em>general</em></button>'; return; }
    if (t.dataset.qcat) { UI.qcat = t.dataset.qcat; render(); return; }
    if (t.dataset.ex) { const m = document.getElementById('matter'); m.value = t.dataset.ex; renderResults(m.value); m.focus(); return; }
    if (t.dataset.copy) { try { await navigator.clipboard.writeText(t.dataset.copy); toast('Copied'); } catch (err) { toast('Copy blocked — select and copy manually'); } return; }
    if (t.dataset.mf) { UI.mf.ans = t.dataset.mf === 'fact'; const m = KB.myths[UI.mf.order[UI.mf.i]]; if (UI.mf.ans === m.fact) UI.mf.score++; render(); document.querySelector('.mfresult')?.focus?.(); return; }
    if (t.dataset.status) { const id = t.dataset.ev; const nv = S.status[id] === t.dataset.status ? undefined : t.dataset.status; if (nv) S.status[id] = nv; else delete S.status[id]; if (nv === 'have') S._stamp = id; persist(); rerenderList('ev-' + id, nv === 'have' ? 'input[name=label]' : '[aria-pressed=true]'); return; }
    if (t.dataset.delrec) { const [id, i] = t.dataset.delrec.split(':'); S.records[id].splice(Number(i), 1); persist(); rerenderList('ev-' + id, 'input[name=label]'); return; }
    if (t.dataset.delchrono) { S.chrono = S.chrono.filter((c) => c.id !== t.dataset.delchrono); persist(); render(); return; }
    const iss = issue();
    switch (t.dataset.act) {
      case 'toshelf': document.getElementById('shelf').scrollIntoView({ behavior: 'smooth' }); break;
      case 'lang': showLang(); break;
      case 'begin': startIssue(t.dataset.id, t.dataset.topic != null ? KB.directory[Number(t.dataset.topic)] : null); go('quiz'); break;
      case 'skip': { const q = currentQ(); if (q) { S.skipped[q.id] = true; S.history.push({ id: q.id, stage: S.stage, skip: true }); persist(); nextAfter(q); } break; }
      case 'qback': { const last = S.history.pop(); if (!last) break; S.prefill[last.id] = S.answers[last.id]; delete S.answers[last.id]; delete S.skipped[last.id]; S.stage = last.stage; E.prune(iss, S.answers); persist(); go('quiz'); break; }
      case 'continue': S.breaks = (S.breaks || 0) + 1; S.chapterFound = []; S.breakChapter = null; go('quiz'); break;
      case 'showlist': S.pendingUrgent = null; S.chapterFound = []; go('list'); break;
      case 'ackurgent': S.ackUrgent[S.pendingUrgent] = true; S.pendingUrgent = null; persist(); if (currentQ()) go('quiz'); else { finishStage(); go('list'); } break;
      case 'resumequiz': S.stage = 'quick'; S.skipped = Object.fromEntries(Object.entries(S.skipped).filter(([k]) => iss.questions.find((q) => q.id === k && q.deep))); go('quiz'); break;
      case 'deep': S.stage = 'deep'; S.chapterFound = []; persist(); go('quiz'); break;
      case 'change': { const q = iss.questions.find((x) => x.id === t.dataset.q); if (!q) break; S.prefill[q.id] = S.answers[q.id]; delete S.answers[q.id]; delete S.skipped[q.id]; S.stage = q.deep ? 'deep' : 'quick'; S.history = S.history.filter((h) => h.id !== q.id); if (q.deep) S.deepDone = false; else S.quickDone = false; S.chapterFound = []; persist(); go('quiz'); break; }
      case 'savetoggle': saveOn = t.checked; if (saveOn) persist(); else clearSaved(); toast(saveOn ? 'Saved on this device' : 'Removed from this device'); break;
      case 'clear': S = blank(); saveOn = false; clearSaved(); toast('Cleared'); go('home'); break;
      case 'forget': clearSaved(); render(); break;
      case 'resume': { const v = loadSaved(); if (v) { S = Object.assign(blank(), v); saveOn = true; go('list'); } break; }
      case 'exit': S = blank(); saveOn = false; clearSaved(); app.innerHTML = ''; history.replaceState(null, '', '#home'); render(); break;
      case 'excl': S.excludeSensitive = t.checked; persist(); render(); break;
      case 'print': try { window.print(); } catch (err) { /* blocked */ } document.getElementById('printhint').hidden = false; break;
      case 'copytext': try { await navigator.clipboard.writeText(reportText()); toast('Report copied as text'); } catch (err) { toast('Copy was blocked by the browser'); } break;
      case 'download': if (!downloads) break;
        try { await downloads.save({ filename: 'lawyer-preparation-pack.html', data: standaloneReport() }); toast('Saved'); }
        catch (err) { const c = err && err.code; if (c === 'declined') break; if (c === 'rate_limited') { toast('Please wait a moment and try again'); break; } downloads = null; toast('Download isn\'t available here — use Print or Copy'); render(); }
        break;
      case 'mfnext': UI.mf.i++; UI.mf.ans = null; render(); break;
      case 'mfrestart': UI.mf = { i: 0, score: 0, ans: null, order: null }; render(); break;
    }
  });
  render();
})();
