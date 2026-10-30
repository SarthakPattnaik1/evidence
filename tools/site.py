"""Static extras for the deployed site: one indexable page per guide, sitemap, robots, PWA manifest,
service worker, privacy and terms pages. Called from build.py."""
import json, os, re, base64, subprocess, html, pathlib

BASE = os.environ.get('SITE_URL', 'https://evidence-orpin.vercel.app').rstrip('/')
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'build'
e = lambda s: html.escape(str(s or ''), quote=True)

CSS = """body{margin:0;font:17px/1.6 'Noto Sans',system-ui,sans-serif;color:#01312E;background:#FCFAF4}
main{max-width:760px;margin:0 auto;padding:28px 20px 60px}a{color:#04453B}
header{display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid #e6e1d3;background:#fff}
header img{height:34px}h1{font:800 34px/1.15 'Bricolage Grotesque',system-ui,sans-serif;margin:18px 0 10px}
h2{font:700 22px/1.25 'Bricolage Grotesque',system-ui,sans-serif;margin:28px 0 8px}
.cta{display:inline-block;background:#04453B;color:#fff;padding:14px 22px;border-radius:999px;text-decoration:none;font-weight:700;margin:14px 0}
.muted{color:#4f6662;font-size:15px}.box{background:#fff;border:1px solid #e6e1d3;border-radius:14px;padding:14px 18px;margin:12px 0}
li{margin:6px 0}.tag{display:inline-block;background:#EBAB47;color:#01312E;border-radius:6px;padding:1px 8px;font-size:13px;font-weight:700}
footer{max-width:760px;margin:0 auto;padding:20px;color:#4f6662;font-size:14px}"""


def page(title, desc, body, path, icon):
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(desc)}"><link rel="canonical" href="{BASE}{path}">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:type" content="article">
<meta name="theme-color" content="#04453B"><meta name="author" content="Sarthak Pattnaik, Subhankar Das"><link rel="icon" href="/icon.svg"><link rel="manifest" href="/manifest.webmanifest">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body><header><a href="/"><img src="/mark.svg" alt="" width="28" height="35"></a><a href="/" style="font-weight:800;text-decoration:none;font-size:20px">Saboot</a></header>
<main>{body}</main><footer>Saboot is a free preparation tool, not a law firm, and does not give legal advice. Made by <a href="https://www.linkedin.com/in/sarthakad" rel="noopener">Sarthak Pattnaik</a> and <a href="https://www.linkedin.com/in/subhankar-das-311030b1/" rel="noopener">Subhankar Das</a>. Saboot does not take cases, referrals or fees. Emergency: 112 · Free legal aid: 15100 · Cyber fraud: 1930.<br><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/">Open Saboot</a></footer></body></html>"""


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

    (OUT / 'privacy.html').write_text(page('Privacy | Saboot', 'How Saboot handles your answers.', """<h1>Privacy</h1>
<p>Your answers stay on your own device. Saboot has no accounts and does not send your answers to a server.</p>
<ul><li>If you tick "save on this device", your answers are kept in your browser's local storage. "Delete all" removes them.</li>
<li>If you choose a language other than English, the app's own text (not your answers) may be sent to a translation service so it can be shown in your language. Translations are stored on your device.</li>
<li>To improve the guides, the app counts anonymous events such as "a list was made for the cheque-bounce guide", which language was used, and which helpline number was tapped. It never sends your answers, notes, names, dates or documents. It uses no cookies and stores no IP address; unique visitors are counted with a code that changes every day, so no one can be followed over time.</li>
<li>What you type into the search box is kept, with numbers, emails and links removed, along with which guide you then chose. Only the latest 1,000 searches are kept. This shows us which guides are missing or hard to find. Don't type names or personal details into search.</li>
<li>If your browser sends "Do Not Track", nothing is counted.</li>
<li>We do not sell data or track you across other sites.</li>
<li>Documents you print or save are created in your browser.</li></ul>
<p class="muted">Contact: through the GitHub project page.</p>""", '/privacy', icon))
    (OUT / 'terms.html').write_text(page('Terms | Saboot', 'Terms of use for Saboot.', """<h1>Terms of use</h1>
<p>Saboot is a free tool that helps you organise facts and papers before meeting an advocate. It is not a law firm and does not give legal advice. Using it does not create an advocate–client relationship.</p>
<p>Saboot is made by Sarthak Pattnaik and Subhankar Das. It does not recommend, refer to or advertise any advocate, including its makers, and no cases, referrals or fees are taken through it.</p>
<ul><li>The content is a draft prepared from official sources and has not yet been reviewed by a named advocate. Laws, deadlines and fees change; check with an advocate before acting.</li>
<li>Saboot does not recommend or rank advocates. Any directory is for convenience only.</li>
<li>In an emergency call 112. For free legal aid call 15100 (NALSA). For cyber fraud call 1930.</li></ul>""", '/terms', icon))
    urls += [('/privacy', '0.3'), ('/terms', '0.3')]

    (OUT / 'guides.json').write_text(json.dumps({'checked': data.get('checked'), 'version': data.get('version'), 'langs': data['langs'], 'cats': data['cats'],
        'help': {re.sub(r'\D', '', h['label']): h['name'] for h in data['help'].values() if re.sub(r'\D', '', h.get('label') or '')},
        'guides': [{'id': i['id'], 'title': i['title'], 'cat': i['cat'], 'checked': i.get('checked'), 'sources': len(i.get('sources') or []), 'review': i.get('review'), 'nq': i['nq'], 'urgent': i['urgent']} for i in data['issues']]}, ensure_ascii=False))
    lastmod = data.get('checked') or ''
    (OUT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join(f'<url><loc>{BASE}{u}</loc><lastmod>{lastmod}</lastmod><priority>{p}</priority></url>' for u, p in urls) + '</urlset>\n')
    (OUT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: {BASE}/sitemap.xml\n')
    (OUT / 'manifest.webmanifest').write_text(json.dumps({
        'name': 'Saboot — papers for your advocate', 'short_name': 'Saboot', 'start_url': '/', 'display': 'standalone',
        'background_color': '#FCFAF4', 'theme_color': '#04453B', 'lang': 'en',
        'icons': [{'src': '/icon.svg', 'sizes': 'any', 'type': 'image/svg+xml'}, {'src': '/icon-192.png', 'sizes': '192x192', 'type': 'image/png'}, {'src': '/icon-512.png', 'sizes': '512x512', 'type': 'image/png'}]}, ensure_ascii=False))
    # Network-first so law updates reach people immediately; cache only as an offline fallback.
    (OUT / 'sw.js').write_text("""const C='saboot-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['/'])))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin||r.url.includes('/api/'))return;
e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('/'))))});
""")
    return len(urls)


if __name__ == '__main__':
    print(run())
