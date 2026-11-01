"""Static extras for the deployed site: one indexable page per guide, sitemap, robots, PWA manifest,
service worker, privacy and terms pages. Called from build.py."""
import json, os, re, base64, subprocess, html, pathlib

BASE = os.environ.get('SITE_URL', 'https://saboot.org').rstrip('/')
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


def _disclaimer_points():
    """The disclaimer points, read from src/app.js so the app and the guide pages always say the same thing."""
    src = (ROOT / 'src' / 'app.js').read_text(encoding='utf-8')
    block = re.search(r"const pts = \[(.*?)\];", src, re.S).group(1)
    pts = [json.loads('"' + m.replace('"', '\\"') + '"') for m in re.findall(r"'((?:[^'\\]|\\.)*)'", block)]
    assert len(pts) >= 6, 'disclaimer points not found in src/app.js'
    return pts


# Bar Council of India Rule 36: the same disclaimer as the app, on every visit to a guide page.
# Not on /privacy and /terms (the disclaimer links to them). Without JavaScript the page stays readable.
GATE_CSS = """#dg{position:fixed;inset:0;z-index:50;background:rgba(11,31,54,.62);display:flex;align-items:center;justify-content:center;padding:14px}
#dg .d{background:#fff;border-radius:18px;max-width:560px;width:100%;max-height:92vh;overflow:auto;padding:22px 22px 18px;box-shadow:0 20px 50px -20px rgba(0,0,0,.5)}
#dg h2{margin:0 0 4px}#dg ol{padding-left:20px;font-size:15.5px;line-height:1.5}#dg li{margin:7px 0}
#dg .b{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}#dg button,#dg .l{font:700 16px/1 'Noto Sans',system-ui,sans-serif;border-radius:12px;padding:14px 20px;cursor:pointer;border:1.5px solid #1B3A5C;text-decoration:none}
#dg .y{background:#1B3A5C;color:#fff;flex:1}#dg .n{background:#fff;color:#1B3A5C}#dg .l{background:#fff;color:#1B3A5C;display:inline-block}
#dg .s{background:#FDF3F1;border-radius:12px;padding:10px 12px;font-size:14.5px;color:#7A2418;margin-top:10px}#dg .s a{color:#B3261E;font-weight:700}
body.dgon{overflow:hidden}"""


def gate_html():
    pts = ''.join(f'<li>{e(t)}</li>' for t in _disclaimer_points())
    sos = '<div class="s">In danger right now? Call <a href="tel:112">112</a> · Free legal aid <a href="tel:15100">15100</a> · Cyber fraud <a href="tel:1930">1930</a></div>'
    ask = (f'<h2 id="dgh">Disclaimer</h2><p class="muted" style="margin:0">Please read and agree to continue.</p><ol>{pts}</ol>'
           '<p class="muted">By clicking “I agree”, you confirm that you have read and accept the above, and our <a href="/terms">Terms</a> and <a href="/privacy">Privacy</a> policy.</p>'
           f'{sos}<div class="b"><button class="y" data-dg="agree">I agree</button><button class="n" data-dg="no">I disagree</button></div>')
    no = ('<h2 id="dgh">That is okay. You can still get free help</h2><ul><li><a href="tel:15100"><b>15100</b></a> NALSA free legal aid — a free lawyer if you are eligible</li>'
          '<li><a href="tel:112"><b>112</b></a> Emergency — police, ambulance, fire</li><li><a href="tel:181"><b>181</b></a> Women helpline</li>'
          '<li><a href="tel:1930"><b>1930</b></a> Cyber fraud — call fast if money was taken</li><li><a href="tel:1098"><b>1098</b></a> Child helpline</li></ul>'
          '<div class="b"><button class="y" data-dg="back">Go back and read again</button><a class="l" href="https://nalsa.gov.in" rel="noopener">Leave Saboot</a></div>')
    js = """(function(){var V=1;function handed(){try{var s=JSON.parse(sessionStorage.getItem('saboot_ok')||'null');var n=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};
var inSite=!!document.referrer&&new URL(document.referrer).origin===location.origin;return !!(s&&s.v===V&&Date.now()-s.t<1800000&&n.type!=='reload'&&(inSite||n.type==='back_forward'));}catch(e){return false;}}
if(handed())return;var ASK=%s,NO=%s;var o=document.createElement('div');o.id='dg';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-labelledby','dgh');
var d=document.createElement('div');d.className='d';d.tabIndex=-1;o.appendChild(d);function show(h){d.innerHTML=h;d.scrollTop=0;d.focus();}
var main=document.querySelector('main');document.body.appendChild(o);document.body.classList.add('dgon');if(main)main.setAttribute('aria-hidden','true');show(ASK);
o.addEventListener('click',function(ev){var b=ev.target.closest('[data-dg]');if(!b)return;var a=b.getAttribute('data-dg');
if(a==='agree'){try{sessionStorage.setItem('saboot_ok',JSON.stringify({v:V,t:Date.now()}));}catch(e){}o.remove();document.body.classList.remove('dgon');if(main)main.removeAttribute('aria-hidden');var h=document.querySelector('h1');if(h){h.tabIndex=-1;h.focus();}}
else if(a==='no')show(NO);else if(a==='back')show(ASK);});
o.addEventListener('keydown',function(ev){if(ev.key!=='Tab')return;var f=o.querySelectorAll('a[href],button');if(!f.length)return;if(ev.shiftKey&&document.activeElement===f[0]){ev.preventDefault();f[f.length-1].focus();}else if(!ev.shiftKey&&document.activeElement===f[f.length-1]){ev.preventDefault();f[0].focus();}});})();""" % (json.dumps(ask), json.dumps(no))
    return f'<script>{js.replace("</", "<\\/")}</script>'


def page(title, desc, body, path, icon, gate=True):
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(desc)}"><link rel="canonical" href="{BASE}{path}">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:type" content="article"><meta property="og:url" content="{BASE}{path}"><meta property="og:site_name" content="Saboot"><meta property="og:locale" content="en_IN"><meta property="og:image" content="{BASE}/og.jpg?v=5"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Saboot: Walk into your lawyer’s office ready."><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="{BASE}/og.jpg?v=5"><link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2">
<meta name="theme-color" content="#1B3A5C"><meta name="author" content="Sarthak Pattnaik, Subhankar Das"><link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml"><link rel="icon" href="/icon-64.png?v=2" type="image/png"><link rel="manifest" href="/manifest.webmanifest">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet">
<style>{CSS}{GATE_CSS if gate else ''}</style></head><body><header><a href="/" style="display:flex;align-items:center;gap:8px;text-decoration:none"><img src="/mark.png?v=2" alt="" style="height:28px;width:auto"><img src="/wordmark.png?v=2" alt="Saboot" style="height:26px;width:auto"></a><a class="back" href="/">Open Saboot</a></header>
<main>{body}</main><footer>Saboot is a free preparation tool, not a law firm, and does not give legal advice. Made by <a href="https://www.linkedin.com/in/sarthakad" rel="noopener">Sarthak Pattnaik</a> and <a href="https://www.linkedin.com/in/subhankar-das-311030b1/" rel="noopener">Subhankar Das</a>. Emergency: 112 · Free legal aid: 15100 · Cyber fraud: 1930.<br><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/">Open Saboot</a></footer>{gate_html() if gate else ''}</body></html>"""


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
    sits = data.get('situations', [])
    by_g = {}
    for x in sits:
        by_g.setdefault(x['g'], []).append(x)
    def sit_links(gid):
        xs = by_g.get(gid, [])
        return ('<h2>Common situations</h2><ul>' + ''.join(f'<li><a href="/s/{e(x["slug"])}">{e(x["t"])}</a></li>' for x in xs) + '</ul>') if xs else ''
    guides = {i['id']: i for i in data['issues']}
    for i in data['issues']:
        if i['id'] == 'general':
            continue
        srcs = ''.join((f'<li><a href="{e(s["u"])}" rel="noopener">{e(s["t"])}</a></li>' if s.get('u') else f'<li>{e(s["t"])}</li>') for s in (i.get('sources') or []))
        ev = ''.join(f'<li><b>{e(x["name"])}</b><br><span class="muted">{e(x["why"])}</span></li>' for x in i['evidence'][:14])
        qs = ''.join(f'<li>{e(q)}</li>' for q in i['questions'])
        body = f"""<p class="muted">{e(cats.get(i['cat'], ''))}</p><h1>{e(i['title'])}</h1><p>{e(i['intro'])}</p>
<a class="cta" href="/#start-{e(i['id'])}">Answer a few questions and get your list →</a>
<h2>What the law says</h2><div class="box"><p>{e(i['juris'])}</p><p class="muted">{('Reviewed by ' + e(i['review']['by']) + (' (' + e(i['review'].get('enrol','')) + ')' if i['review'].get('enrol') else '') + ' on ' + e(i['review']['date'])) if i.get('review') else 'Draft — not yet reviewed by a named advocate.'}</p></div>
<h2>Papers that usually help</h2><ul>{ev}</ul>
<h2>Questions Saboot will ask you</h2><ul>{qs}</ul>
<h2>Sources</h2><ul>{srcs}</ul>
{sit_links(i['id'])}<a class="cta" href="/#start-{e(i['id'])}">Start — it's free, no sign-up</a>
<p class="muted">Also searched as: {e(', '.join(i.get('synonyms', [])[:12]))}</p>"""
        desc = (i['short'] + ' — ' + i['intro'])[:155]
        (gdir / f"{i['id']}.html").write_text(page(f"{i['title']} — papers to take to your advocate | Saboot", desc, body, f"/guide/{i['id']}", icon))
        urls.append((f"/guide/{i['id']}", '0.8'))
        index_rows.append(f'<li><a href="/guide/{e(i["id"])}">{e(i["title"])}</a> <span class="muted">— {e(i["short"])}</span></li>')
    (gdir / 'index.html').write_text(page('All guides | Saboot', 'Every legal situation Saboot helps you prepare for, in plain language.', '<h1>All guides</h1><ul>' + ''.join(index_rows) + '</ul>', '/guide', icon))
    urls.append(('/guide', '0.9'))

    # One page per everyday situation (/s/<slug>). The papers, points and warnings are computed by the app's own
    # engine from the answers the situation pre-fills, so each page is specific. Pages whose content would be
    # identical to an earlier situation of the same guide (and have no safety note) are kept for visitors but
    # marked noindex, so search engines never see near-duplicates.
    sdir = OUT / 's'; sdir.mkdir(exist_ok=True)
    seen_sig = set(); n_index = 0; area_rows = {}
    KIND = {'good': 'In your favour', 'risk': 'Be careful', 'next': 'Next step'}
    for x in sits:
        g = guides[x['g']]
        sig = (x['g'], tuple(v['id'] for v in x['ev']), tuple(v['id'] for v in x.get('maybe', [])), tuple(v['t'] for v in x['stand']), tuple(v['t'] for v in x['urg']))
        dup = sig in seen_sig and not x['note']
        seen_sig.add(sig)
        note = f'<div class="sos"><b>Before anything else</b>{e(x["note"])}</div>' if x['note'] else ''
        urg = ''.join(f'<div class="sos"><b>{e(u["t"])}</b>{e(u["x"])}</div>' for u in x['urg'])
        told = ''.join(f'<li>{e(t["q"])} <b>{e(t["a"])}</b></li>' for t in x['told'] if t.get('a'))
        stand = ''.join(f'<li><span class="tag">{e(KIND.get(v["k"], "Note"))}</span> {e(v["t"])}</li>' for v in x['stand'])
        acts = [v for v in x['ev'] if v['action']]; docs = [v for v in x['ev'] if not v['action']]
        li = lambda v: f'<li><b>{e(v["name"])}</b><br><span class="muted">{e(v["why"])}{(" Where: " + e(v["where"])) if v["where"] else ""}</span></li>'
        rel = [y for y in by_g.get(x['g'], []) if y['slug'] != x['slug']][:8]
        srcs = ''.join((f'<li><a href="{e(v["u"])}" rel="noopener">{e(v["t"])}</a></li>' if v.get('u') else f'<li>{e(v["t"])}</li>') for v in (g.get('sources') or []))
        cta = f'<a class="cta" href="/#sit-{e(x["slug"])}">Make my own list — free, 2 minutes</a>'
        body = f'''<p class="muted"><a href="/guide/{e(x["g"])}">{e(cats.get(x["cat"], ""))} › {e(g["short"])}</a></p><h1>{e(x["t"])}</h1>
<p>What usually matters in this situation, and the papers to keep ready before you meet an advocate or free legal aid (call 15100).</p>{note}{urg}{cta}
{('<h2>Your situation</h2><ul>' + told + '</ul>') if told else ''}
{('<h2>Where you stand</h2><ul>' + stand + '</ul>') if stand else ''}
{('<h2>Do these now</h2><ul>' + ''.join(li(v) for v in acts) + '</ul>') if acts else ''}
<h2>Papers to gather</h2><ul>{''.join(li(v) for v in docs)}</ul>
{('<h2>You may also need, depending on your answers</h2><ul>' + ''.join(f'<li>{e(v["name"])} <span class="muted">— {e(v["why"])}</span></li>' for v in x["maybe"][:10]) + '</ul>') if x.get('maybe') else ''}
<h2>What the law says</h2><div class="box"><p>{e(g["juris"])}</p><p class="muted">Draft — not yet reviewed by a named advocate. General information, not legal advice.</p></div>
{('<h2>Saboot will also ask</h2><ul>' + ''.join(f"<li>{e(q)}</li>" for q in x["ask"]) + '</ul>') if x['ask'] else ''}
{cta}
{('<h2>Similar situations</h2><ul>' + ''.join(f'<li><a href="/s/{e(y["slug"])}">{e(y["t"])}</a></li>' for y in rel) + '</ul>') if rel else ''}
<h2>Sources</h2><ul>{srcs}</ul><p class="muted"><a href="/guide/{e(x["g"])}">The full guide: {e(g["title"])}</a> · <a href="/s">All situations</a></p>'''
        desc = (x['t'] + ' — ' + (x['note'] or g['intro']))[:155]
        html = page(f'{x["t"]} — what to do and which papers to keep | Saboot', desc, body, f'/s/{x["slug"]}', icon)
        if dup:
            html = html.replace('<link rel="canonical"', '<meta name="robots" content="noindex,follow"><link rel="canonical"', 1)
        else:
            urls.append((f'/s/{x["slug"]}', '0.6')); n_index += 1
        (sdir / f'{x["slug"]}.html').write_text(html, encoding='utf-8')
        area_rows.setdefault(x['cat'], []).append(f'<li><a href="/s/{e(x["slug"])}">{e(x["t"])}</a></li>')
    sidx = ''.join(f'<h2>{e(cats.get(c, c))}</h2><ul>' + ''.join(rows) + '</ul>' for c, rows in area_rows.items())
    (sdir / 'index.html').write_text(page('Everyday legal situations — what to do and which papers to keep | Saboot', f'{len(sits)} everyday legal problems in plain words, each with the papers to gather and where to go.', f'<h1>Everyday situations</h1><p>{len(sits)} problems in plain words. Pick yours to see what to do and which papers to keep.</p>{sidx}', '/s', icon), encoding='utf-8')
    urls.append(('/s', '0.9'))
    print('situation pages', len(sits), 'indexed', n_index)

    upd = 'Last updated 31 October 2026'
    privacy = legal('Privacy', 'Your answers stay with you', upd + '. Saboot is built to help you without collecting your personal story.', [
        ('🔒', 'Your answers stay on your phone or computer. They are <b>never sent to us</b>. Voice and non-English searches are turned into text by Google and not stored.'),
        ('🚫', 'No account, no sign-up, no ads, and no tracking cookies.'),
        ('📊', 'We count anonymous things — like which guides are used — to make Saboot better.'),
        ('🗑️', 'Delete everything any time with one tap: <b>Delete all</b>.')], [
        ('device', 'What stays on your device', '<p>Your answers, ticks, notes and timeline live only in your browser while you use Saboot. If you switch on <b>“Save my list on this phone”</b>, they are kept in your browser’s local storage until you delete them. <b>Delete all</b> removes them immediately.</p><p>Pages you print or save as PDF are created on your device.</p><p>To ask once whether Saboot helped, your phone remembers which guide you last used and when (nothing else). <b>Delete all</b> removes it. Reminders you add go only to your own calendar or WhatsApp.</p>'),
        ('counts', 'What we count, anonymously', '<p>To improve the guides we count events such as “a list was made for the cheque-bounce guide”, which language was used, which helpline number was tapped, and which page someone left from.</p><ul><li>We never receive your answers, notes, names, dates or documents.</li><li>We do not store IP addresses. Unique visitors are counted with a code that changes every day, so no one can be followed over time.</li><li>To keep the numbers honest, each visit gets a short-lived signed code from our server, and we note whether there was a real tap or keypress (not what was tapped). This lets us ignore fake or automated traffic. The code contains nothing about you.</li><li>As an independent check on our own numbers, Vercel Web Analytics also counts page views. It uses no cookies and does not identify you.</li><li>Daily counts are deleted after 400 days.</li></ul>'),
        ('search', 'What you type in search', '<p>Search text is kept so we can add missing guides. Numbers, email addresses and links are removed automatically, and only the latest 1,000 searches are kept.</p><p><b>Please don’t type names or personal details into search.</b></p>'),
        ('translate', 'Translation', '<p>If you choose a language other than English, the app’s own text — never your answers — may be sent to a translation service (Google Gemini) to show it in your language. Translations are saved on your device and on our server so the next person gets them instantly.</p>'),
        ('voice', 'Voice and searches in other languages', '<p>If you tap the microphone, or type your problem in a language other than English, what you said or typed is sent through our server to Google Gemini only to turn it into text and a short English meaning, so we can find the right guide. In English, your browser’s own speech service (for example Google in Chrome) may be used instead. We do not store the recording or the text, and it is not linked to you. Your answers to the questions are never sent. If you prefer, just type in English or tap a situation.</p>'),
        ('reports', 'Mistakes you report', '<p>If you use <b>Report a mistake</b>, we receive the guide, the type of problem and what you wrote, with numbers removed. Please don’t include personal details.</p>'),
        ('choices', 'Your choices', '<ul><li>Use Saboot without saving anything — nothing is kept after you close the page.</li><li>Tap <b>Delete all</b> to remove a saved list.</li><li>If your browser sends “Do Not Track”, nothing is counted.</li></ul>'),
        ('changes', 'Changes to this page', '<p>If we change how Saboot handles information, we will update this page and the date at the top.</p>')])
    (OUT / 'privacy.html').write_text(page('Privacy | Saboot', 'Your answers stay on your device. How Saboot handles information, in plain words.', privacy, '/privacy', icon, gate=False))
    terms = legal('Terms of use', 'Simple terms for a free tool', upd + '. Please read these before you rely on Saboot.', [
        ('🧭', 'Saboot helps you <b>prepare</b> — it lists the papers and facts to take to an advocate.'),
        ('⚖️', 'It is <b>not legal advice</b> and does not replace an advocate.'),
        ('🔁', 'Laws and deadlines change. <b>Check with an advocate</b> before you act.'),
        ('🆓', 'It is free to use. There is nothing to buy.')], [
        ('what', 'What Saboot is', '<p>Saboot is a free tool that asks simple questions and gives you a list of papers and facts to take to an advocate, in your language.</p>'),
        ('barcouncil', 'Disclaimer (Bar Council of India rules)', '<p>The Bar Council of India does not allow advocates to advertise or solicit work. Saboot is made by advocates. By using Saboot you confirm that you are visiting it on your own wish to get general information, and that there has been no advertisement, solicitation, invitation or inducement of any kind from Saboot, its makers or any advocate. Nothing on Saboot is an offer of legal services. Saboot shows this disclaimer, with “I agree” and “I disagree”, before it can be used.</p>'),
        ('advice', 'Not legal advice', '<p>Saboot gives general information. It does not give legal advice, does not tell you what a court will decide, and does not say whether a document will be accepted. Using Saboot does not create an advocate–client relationship.</p>'),
        ('accuracy', 'Accuracy and updates', '<p>Each guide lists its sources: the Act, rule or judgment it relies on, linked to the full text where we could confirm the exact page. Guides marked <b>Draft</b> have not yet been reviewed by an advocate. Laws, deadlines and fees can change, so confirm with an advocate before you act.</p>'),
        ('use', 'Using Saboot fairly', '<ul><li>Use Saboot only for lawful purposes.</li><li>Do not try to obtain other people’s records without lawful permission.</li><li>Do not misuse the service or try to disrupt it.</li></ul>'),
        ('advocates', 'Advocates', '<p>Saboot does not recommend, rank or advertise any advocate. Choose any advocate you trust. Free legal aid is available from your Legal Services Authority — call 15100.</p>'),
        ('links', 'Links to other websites', '<p>Guides link to official websites (for example cybercrime.gov.in or e-Jagriti). We are not responsible for their content or availability.</p>'),
        ('liability', 'Limits of responsibility', '<p>Saboot is provided free and “as is”. To the extent the law allows, its makers are not responsible for any loss arising from reliance on it.</p>'),
        ('law', 'Governing law', '<p>These terms are governed by the laws of India.</p>'),
        ('changes', 'Changes to these terms', '<p>We may update these terms. The date at the top shows the latest version.</p>')],
        extra='<div class="sos"><b>In an emergency, don’t wait.</b><a href="tel:112">📞 112 Emergency</a><a href="tel:1930">📞 1930 Cyber fraud</a><a href="tel:15100">📞 15100 Free legal aid</a></div>')
    (OUT / 'terms.html').write_text(page('Terms | Saboot', 'Simple terms of use for Saboot, a free legal preparation tool.', terms, '/terms', icon, gate=False))
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
