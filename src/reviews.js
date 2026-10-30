/* Advocate reviews, per guide. When an advocate checks a guide, add an entry here and redeploy:
     'cheque-bounce': { by: 'Adv. Full Name', enrol: 'OD/1234/2015', date: '2026-11-15', note: 'Optional short note' },
   The guide then shows "Reviewed by …" instead of "Draft". Only add a review the advocate has actually done. */
(function (root) {
  const REVIEWS = {
  };
  for (const iss of root.ER_KB.issues) if (REVIEWS[iss.id]) iss.review = REVIEWS[iss.id];
})(typeof window !== 'undefined' ? window : globalThis);
