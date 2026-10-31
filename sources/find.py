import re, json, time, urllib.parse, urllib.request, html
UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36'}
def get(u):
    try:
        with urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30) as r: return r.read().decode('utf8','replace')
    except Exception as e: return 'ERR '+str(e)
CASES=json.load(open('sources/cases.json')); ACTS=json.load(open('sources/acts.json'))
out={'cases':{},'acts':{}}
for k,q in CASES.items():
    h=get('https://indiankanoon.org/search/?formInput='+urllib.parse.quote(q))
    res=re.findall(r'<a href="/docfragment/(\d+)/[^"]*"[^>]*>(.*?)</a>|<a href="/doc/(\d+)/"[^>]*>(.*?)</a>',h,re.S)
    hits=[]
    for a,b,c,d in res:
        i=a or c; t=re.sub('<[^>]+>','',html.unescape(b or d)).strip()
        if i and t and len(hits)<5: hits.append({'u':'https://indiankanoon.org/doc/%s/'%i,'t':t})
    out['cases'][k]={'q':q,'hits':hits,'err':h[:120] if h.startswith('ERR') else ''}; time.sleep(2)
for k,q in ACTS.items():
    h=get('https://www.indiacode.nic.in/simple-search?query='+urllib.parse.quote(q))
    res=re.findall(r'href="(/handle/123456789/\d+)(?:\?[^"]*)?"[^>]*>([^<]{3,200})</a>',h)
    hits=[];seen=set()
    for p,t in res:
        if p in seen: continue
        seen.add(p); hits.append({'u':'https://www.indiacode.nic.in'+p,'t':html.unescape(t).strip()})
        if len(hits)>=5: break
    out['acts'][k]={'q':q,'hits':hits,'err':h[:120] if h.startswith('ERR') else ''}; time.sleep(2)
json.dump(out,open('sources/found.json','w'),indent=1,ensure_ascii=False); print(json.dumps(out,indent=1,ensure_ascii=False)[:3000])
