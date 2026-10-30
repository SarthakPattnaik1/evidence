"""Static extras for the deployed site: one indexable page per guide, sitemap, robots, PWA manifest,
service worker, privacy and terms pages. Called from build.py."""
import json, os, re, base64, subprocess, html, pathlib

BASE = os.environ.get('SITE_URL', 'https://evidence-orpin.vercel.app').rstrip('/')
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'build'
e = lambda s: html.escape(str(s or ''), quote=True)

CSS = """body{margin:0;font:17px/1.6 'Noto Sans',system-ui,sans-serif;color:#0B1F36;background:#FBF8F3}
main{max-width:760px;margin:0 auto;padding:28px 20px 60px}main:has(.legal){max-width:none;padding:0}a{color:#1B3A5C}
header{display:flex;align-items:center;gap:10px;padding:14px max(20px,calc(50% - 480px));border-bottom:1px solid #e6e1d3;background:#FBF8F3;position:sticky;top:0;z-index:2}
header .back{margin-left:auto;font-size:15px;font-weight:700;text-decoration:none;background:#1B3A5C;color:#fff;padding:8px 16px;border-radius:999px}
header img{height:34px}h1{font:800 34px/1.15 'Bricolage Grotesque',system-ui,sans-serif;margin:18px 0 10px}
h2{font:700 22px/1.25 'Bricolage Grotesque',system-ui,sans-serif;margin:28px 0 8px}
.cta{display:inline-block;background:#1B3A5C;color:#fff;padding:14px 22px;border-radius:999px;text-decoration:none;font-weight:700;margin:14px 0}
.muted{color:#566476;font-size:15px}.box{background:#fff;border:1px solid #e6e1d3;border-radius:14px;padding:14px 18px;margin:12px 0}
li{margin:6px 0}.tag{display:inline-block;background:#D7A455;color:#0B1F36;border-radius:6px;padding:1px 8px;font-size:13px;font-weight:700}
footer{max-width:960px;margin:0 auto;padding:20px;color:#566476;font-size:14px}
.legal{max-width:960px;margin:0 auto;padding:0 20px 40px}
.lhead{padding:34px 0 18px}
.lhead .kicker{font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#1B3A5C;margin:0}
.lhead h1{font-size:clamp(32px,5vw,46px);margin:6px 0 8px}
.lhead p{margin:0;color:#566476}
.short{background:#E3F4EC;border:1px solid #CDE6D8;border-radius:18px;padding:18px 20px;margin:8px 0 26px}
.short h2{margin:0 0 10px;font-size:19px}
.short ul{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.short li{display:flex;gap:10px;align-items:flex-start;margin:0;background:#fff;border-radius:12px;padding:12px 14px;font-size:15.5px;line-height:1.45}
.short li span{flex:none;width:28px;height:28px;border-radius:8px;background:#1B3A5C;color:#D7A455;display:grid;place-items:center;font-size:15px}
.lgrid{display:grid;grid-template-columns:220px minmax(0,1fr);gap:34px;align-items:start}
.toc{position:sticky;top:84px;font-size:14.5px;border-left:2px solid #e6e1d3;padding-left:14px}
.toc b{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#566476;margin-bottom:8px}
.toc a{display:block;color:#46566A;text-decoration:none;padding:5px 0}
.toc a:hover{color:#1B3A5C;text-decoration:underline}
.sec{background:#fff;border:1px solid #e6e1d3;border-radius:16px;padding:18px 22px;margin:0 0 14px;scroll-margin-top:84px}
.sec h2{margin:0 0 8px;font-size:21px;display:flex;gap:10px;align-items:baseline}
.sec h2 i{font-style:normal;font-size:13px;font-weight:800;color:#1B3A5C;background:#E3F4EC;border-radius:999px;padding:2px 9px}
.sec p{margin:6px 0}.sec ul{margin:6px 0;padding-left:20px}.sec li{margin:5px 0}
.sos{background:#FDF3F1;border:1px solid #EFC9C2;border-radius:16px;padding:16px 20px;margin:4px 0 14px;color:#7A2418}
.sos b{display:block;font-size:17px;margin-bottom:6px}
.sos a{display:inline-block;background:#B3261E;color:#fff;text-decoration:none;font-weight:700;border-radius:999px;padding:6px 14px;margin:4px 6px 0 0}
@media (max-width:820px){.lgrid{grid-template-columns:1fr}.toc{display:none}.short ul{grid-template-columns:1fr}.sec{padding:16px}}
"""


def page(title, desc, body, path, icon):
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(desc)}"><link rel="canonical" href="{BASE}{path}">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:type" content="article"><meta property="og:url" content="{BASE}{path}"><meta property="og:site_name" content="Saboot"><meta property="og:locale" content="en_IN"><meta property="og:image" content="{BASE}/og.jpg?v=3"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Saboot: Walk into your lawyer’s office ready."><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="{BASE}/og.jpg?v=3"><link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2">
<meta name="theme-color" content="#1B3A5C"><meta name="author" content="Sarthak Pattnaik, Subhankar Das"><link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml"><link rel="icon" href="/icon-64.png?v=2" type="image/png"><link rel="manifest" href="/manifest.webmanifest">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body><header><a href="/" style="display:flex;align-items:center;gap:8px;text-decoration:none"><img src="/mark.png?v=2" alt="" style="height:28px;width:auto"><img src="/wordmark.png?v=2" alt="Saboot" style="height:26px;width:auto"></a><a class="back" href="/">Open Saboot</a></header>
<main>{body}</main><footer>Saboot is a free preparation tool, not a law firm, and does not give legal advice. Made by <a href="https://www.linkedin.com/in/sarthakad" rel="noopener">Sarthak Pattnaik</a> and <a href="https://www.linkedin.com/in/subhankar-das-311030b1/" rel="noopener">Subhankar Das</a>. Emergency: 112 · Free legal aid: 15100 · Cyber fraud: 1930.<br><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/">Open Saboot</a></footer></body></html>"""


def legal(kicker, title, intro, short, sections, extra=''):
    toc = ''.join(f'<a href="#{sid}">{e(h)}</a>' for sid, h, _ in sections)
    secs = ''.join(f'<section class="sec" id="{sid}"><h2><i>{n}</i>{e(h)}</h2>{body}</section>' for n, (sid, h, body) in enumerate(sections, 1))
    pts = ''.join(f'<li><span>{ic}</span><div>{txt}</div></li>' for ic, txt in short)
    return f"""<div class="legal"><div class="lhead"><p class="kicker">{e(kicker)}</p><h1>{e(title)}</h1><p>{intro}</p></div>
<div class="short"><h2>In short</h2><ul>{pts}</ul></div>
<div class="lgrid"><nav class="toc" aria-label="On this page"><b>On this page</b>{toc}</nav><div>{extra}{secs}</div></div></div>"""


def run():
    OUT.mkdir(exist_ok=True)
    data = json.loads(subprocess.check_output(['node', str(ROOT / 'tools' / 'dump.js')]))
    icon = True
    import shutil
    for f in (ROOT / 'src' / 'static').glob('*'):
        shutil.copy(f, OUT / f.name)
    trd = OUT / 'tr'; trd.mkdir(exist_ok=True)
    for f in (ROOT / 'src' / 'tr').glob('*.json'):
        shutil.copy(f, trd / f.name)
    cats = {c['id']: c['title'] for c in data['cats']}
    gdir = OUT / 'guide'; gdir.mkdir(exist_ok=True)
    urls = [('/', '1.0')]
    index_rows = []
    for i in data['issues']:
        if i['id'] == 'general':
            continue
        srcs = ''.join(f'<li><a href="{e(s["u"])}" rel="noopener">{e(s["t"])}</a></li>' for s in (i.get('sources') or []))
        ev = ''.join(f'<li><b>{e(x["name"])}</b><br><span class="muted">{e(x["why"])}</span></li>' for x in i['evidence'][:14])
        qs = ''.join(f'<li>{e(q)}</li>' for q in i['questions'])
        body = f"""<p class="muted">{e(cats.get(i['cat'], ''))}</p><h1>{e(i['title'])}</h1><p>{e(i['intro'])}</p>
<a class="cta" href="/#start-{e(i['id'])}">Answer a few questions and get your list →</a>
<h2>What the law says</h2><div class="box"><p>{e(i['juris'])}</p><p class="muted"><span class="tag">Law checked {e(i.get('checked',''))}</span> {('Reviewed by ' + e(i['review']['by']) + (' (' + e(i['review'].get('enrol','')) + ')' if i['review'].get('enrol') else '') + ' on ' + e(i['review']['date'])) if i.get('review') else 'Draft — not yet reviewed by a named advocate.'}</p></div>
<h2>Papers that usually help</h2><ul>{ev}</ul>
<h2>Questions Saboot will ask you</h2><ul>{qs}</ul>
<h2>Official sources</h2><ul>{srcs}</ul>
<a class="cta" href="/#start-{e(i['id'])}">Start — it's free, no sign-up</a>
<p class="muted">Also searched as: {e(', '.join(i.get('synonyms', [])[:12]))}</p>"""
        desc = (i['short'] + ' — ' + i['intro'])[:155]
        (gdir / f"{i['id']}.html").write_text(page(f"{i['title']} — papers to take to your advocate | Saboot", desc, body, f"/guide/{i['id']}", icon))
        urls.append((f"/guide/{i['id']}", '0.8'))
        index_rows.append(f'<li><a href="/guide/{e(i["id"])}">{e(i["title"])}</a> <span class="muted">— {e(i["short"])}</span></li>')
    (gdir / 'index.html').write_text(page('All guides | Saboot', 'Every legal situation Saboot helps you prepare for, in plain language.', '<h1>All guides</h1><ul>' + ''.join(index_rows) + '</ul>', '/guide', icon))
    urls.append(('/guide', '0.9'))

    upd = 'Last updated 31 October 2026'
    privacy = legal('Privacy', 'Your answers stay with you', upd + '. Saboot is built to help you without collecting your personal story.', [
        ('🔒', 'Your answers stay on your phone or computer. They are <b>never sent to us</b>.'),
        ('🚫', 'No account, no sign-up, no ads, and no tracking cookies.'),
        ('📊', 'We count anonymous things — like which guides are used — to make Saboot better.'),
        ('🗑️', 'Delete everything any time with one tap: <b>Delete all</b>.')], [
        ('device', 'What stays on your device', '<p>Your answers, ticks, notes and timeline live only in your browser while you use Saboot. If you switch on <b>“Save my list on this phone”</b>, they are kept in your browser’s local storage until you delete them. <b>Delete all</b> removes them immediately.</p><p>Pages you print or save as PDF are created on your device.</p>'),
        ('counts', 'What we count, anonymously', '<p>To improve the guides we count events such as “a list was made for the cheque-bounce guide”, which language was used, which helpline number was tapped, and which page someone left from.</p><ul><li>We never receive your answers, notes, names, dates or documents.</li><li>We do not store IP addresses. Unique visitors are counted with a code that changes every day, so no one can be followed over time.</li><li>Daily counts are deleted after 400 days.</li></ul>'),
        ('search', 'What you type in search', '<p>Search text is kept so we can add missing guides. Numbers, email addresses and links are removed automatically, and only the latest 1,000 searches are kept.</p><p><b>Please don’t type names or personal details into search.</b></p>'),
        ('translate', 'Translation', '<p>If you choose a language other than English, the app’s own text — never your answers — may be sent to a translation service (Google Gemini) to show it in your language. Translations are saved on your device and on our server so the next person gets them instantly.</p>'),
        ('reports', 'Mistakes you report', '<p>If you use <b>Report a mistake</b>, we receive the guide, the type of problem and what you wrote, with numbers removed. Please don’t include personal details.</p>'),
        ('choices', 'Your choices', '<ul><li>Use Saboot without saving anything — nothing is kept after you close the page.</li><li>Tap <b>Delete all</b> to remove a saved list.</li><li>If your browser sends “Do Not Track”, nothing is counted.</li></ul>'),
        ('changes', 'Changes to this page', '<p>If we change how Saboot handles information, we will update this page and the date at the top.</p>')])
    (OUT / 'privacy.html').write_text(page('Privacy | Saboot', 'Your answers stay on your device. How Saboot handles information, in plain words.', privacy, '/privacy', icon))
    terms = legal('Terms of use', 'Simple terms for a free tool', upd + '. Please read these before you rely on Saboot.', [
        ('🧭', 'Saboot helps you <b>prepare</b> — it lists the papers and facts to take to an advocate.'),
        ('⚖️', 'It is <b>not legal advice</b> and does not replace an advocate.'),
        ('🔁', 'Laws and deadlines change. <b>Check with an advocate</b> before you act.'),
        ('🆓', 'It is free to use. There is nothing to buy.')], [
        ('what', 'What Saboot is', '<p>Saboot is a free tool that asks simple questions and gives you a list of papers and facts to take to an advocate, in your language.</p>'),
        ('advice', 'Not legal advice', '<p>Saboot gives general information. It does not give legal advice, does not tell you what a court will decide, and does not say whether a document will be accepted. Using Saboot does not create an advocate–client relationship.</p>'),
        ('accuracy', 'Accuracy and updates', '<p>Each guide is prepared from official sources and shows the date its law was last checked. Guides marked <b>Draft</b> have not yet been reviewed by an advocate. Laws, deadlines and fees can change, so confirm with an advocate before you act.</p>'),
        ('use', 'Using Saboot fairly', '<ul><li>Use Saboot only for lawful purposes.</li><li>Do not try to obtain other people’s records without lawful permission.</li><li>Do not misuse the service or try to disrupt it.</li></ul>'),
        ('advocates', 'Advocates', '<p>Saboot does not recommend, rank or advertise any advocate. Choose any advocate you trust. Free legal aid is available from your Legal Services Authority — call 15100.</p>'),
        ('links', 'Links to other websites', '<p>Guides link to official websites (for example cybercrime.gov.in or e-Jagriti). We are not responsible for their content or availability.</p>'),
        ('liability', 'Limits of responsibility', '<p>Saboot is provided free and “as is”. To the extent the law allows, its makers are not responsible for any loss arising from reliance on it.</p>'),
        ('law', 'Governing law', '<p>These terms are governed by the laws of India.</p>'),
        ('changes', 'Changes to these terms', '<p>We may update these terms. The date at the top shows the latest version.</p>')],
        extra='<div class="sos"><b>In an emergency, don’t wait.</b><a href="tel:112">📞 112 Emergency</a><a href="tel:1930">📞 1930 Cyber fraud</a><a href="tel:15100">📞 15100 Free legal aid</a></div>')
    (OUT / 'terms.html').write_text(page('Terms | Saboot', 'Simple terms of use for Saboot, a free legal preparation tool.', terms, '/terms', icon))
    urls += [('/privacy', '0.3'), ('/terms', '0.3')]

    (OUT / 'guides.json').write_text(json.dumps({'checked': data.get('checked'), 'version': data.get('version'), 'langs': data['langs'], 'cats': data['cats'],
        'help': {re.sub(r'\D', '', h['label']): h['name'] for h in data['help'].values() if re.sub(r'\D', '', h.get('label') or '')},
        'guides': [{'id': i['id'], 'title': i['title'], 'cat': i['cat'], 'checked': i.get('checked'), 'sources': len(i.get('sources') or []), 'review': i.get('review'), 'nq': i['nq'], 'urgent': i['urgent']} for i in data['issues']]}, ensure_ascii=False))
    lastmod = data.get('checked') or ''
    (OUT / '404.html').write_text(page('Page not found | Saboot', 'This page does not exist. Start again from the Saboot home page.', '<h1>We could not find that page</h1><p class="muted">The link may be old or mistyped.</p><a class="cta" href="/">Go to Saboot home</a><p class="muted">Need help now? Call <a href="tel:112">112</a> for emergencies, <a href="tel:1930">1930</a> for cyber fraud, <a href="tel:15100">15100</a> for free legal aid.</p>', '/404', None).replace('<link rel="canonical" href="' + BASE + '/404">', '<meta name="robots" content="noindex">'), encoding='utf-8')
    (OUT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join(f'<url><loc>{BASE}{u}</loc><lastmod>{lastmod}</lastmod><priority>{p}</priority></url>' for u, p in urls) + '</urlset>\n')
    (OUT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: {BASE}/sitemap.xml\n')
    (OUT / 'manifest.webmanifest').write_text(json.dumps({
        'name': 'Saboot — papers for your advocate', 'short_name': 'Saboot', 'start_url': '/', 'display': 'standalone',
        'background_color': '#FBF8F3', 'theme_color': '#1B3A5C', 'lang': 'en',
        'id': '/', 'scope': '/', 'description': 'Answer a few questions and get the list of papers to take to your advocate. Free, in English and 22 Indian languages.', 'categories': ['utilities', 'education'], 'icons': [{'src': '/icon-192.png?v=2', 'sizes': '192x192', 'type': 'image/png', 'purpose': 'any'}, {'src': '/icon-512.png?v=2', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any'}, {'src': '/icon-maskable-512.png?v=2', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'}]}, ensure_ascii=False))
    # Network-first so law updates reach people immediately; cache only as an offline fallback.
    (OUT / 'sw.js').write_text("""const C='saboot-v2';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['/'])))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin||r.url.includes('/api/'))return;
e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('/'))))});
""")
    return len(urls)


if __name__ == '__main__':
    print(run())
