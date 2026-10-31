# Saboot

**Walk into your lawyer’s office ready.**

Saboot (सबूत, “proof”) is a free tool for people in India facing a legal problem. You say what happened — by tapping, typing or speaking, in English or any of the 22 scheduled Indian languages — answer a few simple questions, and get a personal list of the papers to carry to your advocate: what each one proves, where to get it lawfully, how to keep it safe, and the deadlines that matter.

Made by [Sarthak Pattnaik](https://www.linkedin.com/in/sarthakad) and [Subhankar Das](https://www.linkedin.com/in/subhankar-das-311030b1/).

Live: https://saboot.org

> **Status: draft content.** No guide has yet been reviewed by a practising advocate. Each guide says so until a review is recorded in `src/reviews.js`. Saboot is a preparation tool — it is not legal advice, does not recommend advocates, and takes no fees.

---

## What it does

- **85 legal situations** across 11 areas — money & banking (12), family (11), police & notices (11), home & land (9), work (8), young people & students (7), shopping & services (7), online & other (7), NRI (6), business (5), accidents (3) — plus a general route for anything else.
  Chosen from real demand: LawRato question volumes (property, divorce, criminal, family, service matters lead), Tele-Law case categories (government entitlements are the largest), National Consumer Helpline sectors, RBI Ombudsman and NCRP cyber-crime data.
- **Short branching questions → a printable list of papers**, with “where you stand” notes (what helps, what to watch, the usual next step), urgent warnings, and questions to ask the advocate.
- **Voice input in all 23 languages.** Tap the mic and describe the problem in your own words.
- **Search that understands how people actually write**: English, Hinglish (“kabza”, “udhaar wapas nahi”), and native scripts (“मेरा फोन चोरी हो गया”, “ମୋ ଜମି ଦଖଲ”).
- **23 languages**: English plus all 22 scheduled languages.
- **Help first**: 112, 1930 and 15100 are one tap away; sensitive guides (domestic violence, sexual assault, caste atrocity, missing person, trafficking) have a quick-exit button.
- **Legal questions hub** (52 plain-language answers), **Myth or fact** quiz (22 cards), WhatsApp share, “report a mistake”, and an advocate link that sends a client a guide without any client data.
- **Every guide shows its official sources** and the date its law was last checked.

### Guides added in October 2026 (from search testing)

Neighbour disputes · housing society / RWA · land records and mutation (khata, 7/12, jamabandi, patta) · will, gift deed and release deed · adoption and guardianship · government job and pension · injury at work · assault, threats and extortion · defamation · lost or stolen phone and documents · missing person · sexual assault and POCSO · caste abuse (SC/ST Atrocities Act) · bonded labour, trafficking and child labour · vehicle RC transfer · dog bite · name and document correction · government benefits and RTI · income tax and GST notices · land acquisition.

## Privacy

- No login, no uploads, no tracking cookies. **Answers to the questions are never sent to the server** — they stay in the browser tab unless the user chooses to save them on the device.
- **Voice and non-English searches** are the one exception: the recording or the typed search text is sent through `/api/voice` to Google Gemini only to turn it into text and a short English meaning. It is not stored and not linked to anyone. In English, the browser’s own speech recognition is used where available. This is stated on `/privacy` and in the app.
- Analytics are anonymous and aggregate (see *Admin* below). Do Not Track is honoured.

## Project layout

```
src/
  kb.js          help directory, categories, first guides, general route, engine helpers
  j-money.js     cheque bounce, loan recovery, credit cards, credit report
  j-family.js    domestic violence, custody, dowry/498A, inheritance
  j-consumer.js  defective products, insurance, builder delay
  j-other.js     eviction, encroachment, termination, POSH, FIR, arrest, legal notice, road accident, online harassment
  j-nri.js       NRI guides
  j-business.js  business and company guides
  j-more.js      scams, loan apps, e-commerce, travel, telecom, bank service, challans, electricity, court marriage,
                 senior citizens, death claims, property purchase, PF/gratuity, medical, education
  j-genz.js      young people: leaked/deepfake photos, hacked accounts, betting, internships, ragging, live-in,
                 trans & queer rights, police stops, gig workers
  j-gaps.js      the 20 guides found missing by search testing, plus search words for existing guides
  stand.js       “where you stand” checks
  law-2026.js    2025–26 law changes and official sources per guide (CHECKED date)
  reviews.js     advocate reviews (empty until a guide is reviewed)
  qa.js          legal questions and myth/fact cards
  i18n.js        23 languages: interface strings and language metadata
  engine.js      interview engine and search (stemming, Hindi/Hinglish dictionary, rare-word weighting)
  app.js         UI, voice input
  style.css      visual system
  brand.js       logo and hero illustration (inlined)
  shell.html     page template
  static/        icons, logo, share image, admin page
  tr/            pre-translated app text per language
api/
  translate.js   guide translation (Bhashini → Gemini → Anthropic), allow-listed to the app’s own text
  voice.js       voice transcription and non-English search meaning (Gemini); nothing stored
  e.js           anonymous analytics events
  admin.js       admin login and stats
  health.js      setup check
  _lib.js        storage (Supabase or Upstash) and helpers
supabase/schema.sql   tables and functions for analytics and the translation cache
tools/site.py         static pages: /guide/<id>, /privacy, /terms, 404, sitemap, manifest, service worker
build.py              inlines everything into build/index.html and runs tools/site.py
```

## Build and test

```bash
python3 build.py                 # writes build/ (index.html + 89 static pages)
node test/test.js                # ~110,000 content and engine checks (random walks through every guide)
node test/search.js              # 537 real-world searches must find the right guide (fails below 97% top-3)

# browser tests (Playwright + Chromium); start the local server first:
FAKE_TRANSLATE=50 node test/devserver.js &
node test/e2e.js                 # walks all 86 journeys on mobile
node test/voice.js               # fake microphone: Hindi voice, typed Hindi/Odia, 320px, permission denied
node test/nav.js
node test/analytics.js
```

`test/devserver.js` serves `build/`, runs `api/*.js`, fakes Upstash (or a local Postgres for Supabase with `STORE=supabase`) and, with `FAKE_TRANSLATE`, fakes Gemini for translation and voice.

### Search coverage

`test/search/` holds four query sets in English and Hinglish: the tuning set, a hold-out set, and two sets written blind after tuning. Current result: right guide in the top 3 for 100%, first for 96%. On wording never seen before, expect roughly 86–90% — add misses from `/admin` (“Searched for → no guide found”) to the guides’ `synonyms` and to `test/search/`.

## Deploy (Vercel)

Connected to this repo; every push to `main` deploys. `vercel.json` sets security headers, allows the microphone for the site itself, and keeps `sw.js` uncached.

Environment variables (Vercel → Project → Settings → Environment Variables), then redeploy:

| Purpose | Variables | Notes |
|---|---|---|
| Translation + voice | `GEMINI_API_KEY` | Free at aistudio.google.com. Used by `/api/translate` and `/api/voice`. Optional `GEMINI_MODEL`, `GEMINI_VOICE_MODEL`. |
| Translation (Govt of India, free) | `BHASHINI_USER_ID`, `BHASHINI_API_KEY` | Tried first for translation. bhashini.gov.in |
| Analytics storage | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` **or** `KV_REST_API_URL`, `KV_REST_API_TOKEN` | For Supabase, run `supabase/schema.sql` once in the SQL Editor. |
| Admin | `ADMIN_PASSWORD` (required), `ADMIN_USER` (default `admin`), `ADMIN_SECRET` | |

Checks after deploying:
- `/api/health` — everything should be `true`.
- `/api/translate?check=hi` — tests translation end to end.
- `/api/voice` — returns `{"ok":true}` when voice is available.

**Models (measured live, Oct 2026):** translation and voice use `gemini-flash-lite-latest` first (≈1 s per translation batch, ≈1–1.5 s per voice clip), with `gemini-3.5-flash-lite` as an automatic backup if the first is slow or busy. The larger 3.x flash models took 20–47 s and are only a last resort. Voice was tested end to end with synthetic speech in Odia, Tamil, Hindi, Bengali, Telugu, Malayalam, Kannada, Nepali, Urdu and English, with the app set to English: the spoken language was identified and the meaning was correct every time. The app stops recording by itself about 1.2 s after the person stops speaking.

`/api/diag` is a private, token-locked endpoint for re-running these live checks.

**Quota:** each voice search and each non-English typed search is one Gemini call. On the free tier, heavy use can hit the daily limit; the app then asks people to type. Add billing or Bhashini ASR if usage grows.

## Pre-translated text

The GitHub Action **Pre-translate app text** translates all ~5,000 app strings into the 22 languages and commits them to `src/tr/<lang>.json`, so languages load instantly and keep working when the free quota runs out.

1. GitHub → Settings → Secrets and variables → Actions → add `GEMINI_API_KEY`.
2. Actions → *Pre-translate app text* → Run workflow. It saves after every batch and re-runs daily until done.

The app uses the pre-translated file first, then the shared cache, then live translation for anything new (including newly added guides).

## Admin analytics (`/admin`)

Password-protected dashboard (small “Admin” link at the bottom right of the home page). Shows visitors and visits, the journey from opening a guide to printing a list, where people stop, languages, translation failures, microphone use, helpline taps, urgent warnings shown, searches with no match, traffic sources, devices, reported mistakes, law freshness per guide, advocate review status and browser errors.

No answers, names or dates are ever collected. No cookies on the public site, no IPs stored; unique visitors use a hash with a daily-rotating salt. Search text is scrubbed of numbers, emails and links, and only the latest 1,000 are kept.

## Disclaimer (Bar Council of India)

On the first visit — including links shared on WhatsApp — Saboot shows a disclaimer with **I agree / I disagree** before it can be used, as advocates’ websites do under the Bar Council of India rules on advertising and solicitation: visiting on one’s own wish, no solicitation, not a law firm, not legal advice, no advocate–client relationship, no advocate recommended, information may be incomplete, no liability. Emergency numbers (112, 15100, 1930) work before agreeing, and “I disagree” shows free-help numbers instead of a dead end. The language can be changed on the disclaimer itself. It is shown again whenever the wording changes (`CONSENT_V` in `src/app.js`), and can be reopened from the footer. The same text is in `/terms`.

## Trustworthy numbers

Anyone can send fake events to an analytics endpoint, so the admin separates **raw activity** from **verified people**:

1. **Signed session token.** `/api/s` gives each page load a token signed with the server secret and bound to that browser; `/api/e` refuses events without a valid one, from another browser, or from another website. Refused events are counted as “rejected”, never used.
2. **Real-person signals.** A visit counts as a person only after a real tap or keypress, ≥ 3 s with the page visible, and no automation flag.
3. **Counted once per network per day.** Verified numbers are distinct networks (daily-salted hash; no IP stored), so repeating an action cannot inflate them. This undercounts families on one Wi-Fi — state them as “at least”.
4. **Tamper-evident public record.** `/api/impact` publishes verified daily totals with a SHA-256 hash chain; the **Impact ledger** GitHub Action commits it nightly to `impact/ledger.json` and refuses to overwrite a day that has already been recorded. The git history is an independent, timestamped record.
5. **Independent cross-check.** Vercel Web Analytics (Project → Analytics → Enable; cookieless) gives a third-party page-view count to compare with.

Tests: `FIXED_IP=10.9.9.9 node test/devserver.js` then `node test/consent.js` (forged, token-less, wrong-site and cross-browser events are rejected; an automated visitor is not counted; a real person is counted once).

## Content rules

- Conditions reference stable question/option IDs, never display text.
- Every paper states the fact it helps show, why it matters, where to get it lawfully, and how to keep it safe.
- No case-strength scores, no win predictions. Missing papers never stop someone from seeing an advocate.
- Every guide lists official sources; re-verify and update `CHECKED` in `src/law-2026.js`.
- No advocate is recommended or advertised (Bar Council of India Rule 36). Makers are credited only as makers.

## Advocate reviews

When an advocate reviews a guide, add them to `src/reviews.js` (name, enrolment number, date). The guide then shows “Reviewed by …” instead of “Draft” in the app and on its `/guide/<id>` page, and `/admin` tracks progress. Suggested first: UPI fraud, cheque bounce, divorce, maintenance, domestic violence, FIR, property, salary, sexual assault, caste atrocity, missing person.

## Licence

Not yet chosen. Suggested: MIT or Apache-2.0 for code, CC BY-SA 4.0 for legal content.
