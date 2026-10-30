/* EvidenceReady deterministic interview engine. Pure functions; no DOM. */
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

  const ER_ENGINE = { evalWhen, applicable, prune, stageQuestions, nextQuestion, progress, evidence, urgent, info, lawyerQs, stand, hasDeep, refs };
  root.ER_ENGINE = ER_ENGINE;
})(globalThis);
