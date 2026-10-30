# Pehlo (formerly EvidenceReady)

**Going to a lawyer? Know what to bring.**

A free, open-source preparation tool for people in India facing a legal problem. Users pick what happened, answer short game-like chapters of questions, and build a case file: the records to collect, where to find them lawfully, the dates that matter, and questions for their advocate. It ends with a printable lawyer preparation pack and a provisional annexure index built only from documents the user has actually named.

> **Status: draft content.** None of the legal content has yet been reviewed by a practising advocate. Do not present it to the public as verified legal guidance.

## What's in it

- **56 guided problems** with branching questions, chosen from what most often reaches Indian courts and Lok Adalats (cheque bounce, matrimonial, motor accident, traffic challans, bank recovery, electricity), the National Consumer Helpline (e-commerce, durables, banking, telecom, travel), the RBI Ombudsman (loans and credit cards lead) and NCRB cyber-crime data (fraud is 72.6% of cyber cases; "digital arrest" scams hit a record in 2024).
- **Where you stand**: after the quick questions, each guide shows what helps you, what to watch out for, and the usual next step.
- **23 languages**: English plus all 22 scheduled languages; 16 with a hand-written interface, the rest and all guide text machine-translated live and labelled.
  - Money & banking: cheque bounce (both sides), loan/EMI recovery and SARFAESI, credit cards, CIBIL errors, UPI/online fraud, frozen accounts, failed payments
  - Family: divorce, maintenance, domestic violence, child custody, dowry/498A (both sides), inheritance and partition
  - Shopping & services: refunds, defective products, insurance claims, builder delays
  - NRI: property abroad, sale & repatriation, power of attorney from abroad, NRI marriage disputes (both sides), running a case from abroad, NRI bank/tax issues
  - Business & company: unpaid invoices (MSME council, commercial suit, insolvency), shareholder/director disputes, partnership/LLP, commercial contracts, brand copying and trade secrets
  - Home & land, police & notices, work, accidents, online harassment, money lent
- **General preparation route** for other problems (clearly labelled)
- **Legal questions hub** — 52 answer-first explainers with "what can change the answer" and the governing law
- **Myth or fact** — 22-card rights quiz
- **Advocate links** — advocates can send clients a guide with flagged records and a note (no client data in the link)
- **Urgent routing** — help-first screens for danger, fresh fraud, cheque deadlines, custody/arrest
- **Privacy** — no login, no uploads, no server; answers stay in the browser tab unless the user opts in to local saving

## Project layout

```
src/
  kb.js          help directory, categories, original 9 guides, general route, directory
  j-money.js     cheque bounce, loan recovery, credit card, credit report
  j-family.js    domestic violence, custody, dowry/498A, inheritance
  j-consumer.js  defective product, insurance claim, builder delay
  j-nri.js       NRI guides
  j-business.js  business and company guides
  j-more.js      high-search gaps: scams, loan apps, e-commerce, travel, telecom, bank service, challans, electricity,
                 court marriage, senior citizens, death claims, property purchase, PF/gratuity, medical, education
  stand.js       "Where you stand" situation checks for existing guides
  i18n.js        23 languages: UI strings and language metadata
  j-other.js     eviction, encroachment, termination, POSH, FIR, arrest, legal notice, road accident, online harassment
  qa.js          legal questions and myth/fact cards
  engine.js      deterministic interview engine (pure functions)
  app.js         UI
  style.css      "case file" visual system
  shell.html     page template
build.py         inlines everything into build/index.html (single self-contained file)
test/test.js     knowledge-base invariants + random-walk branch tests
test/e2e.js      Playwright walk-through of every guide (mobile + desktop)
```

## Build and test

```bash
python3 build.py            # writes build/index.html
node test/test.js           # content and engine checks
node test/e2e.js            # needs Playwright + Chromium
```

Open `build/index.html` in a browser — it runs fully offline.

## Content rules

- Conditions reference stable question/option IDs, never display text.
- Every evidence item states the fact it helps show, why, where to find it lawfully, how to preserve it, limits and time-sensitivity.
- No case-strength scores, no win predictions. Missing records never block a user from seeing an advocate.
- Before publishing a guide: review by a qualified advocate, recorded with name, date and version.

## Licence

Not yet chosen. Suggested: MIT/Apache-2.0 for code, CC BY-SA 4.0 for legal content.
