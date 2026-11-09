"""Family Group — cast generator. One parametric flat-vector style so every
character stays on-model across episodes. Each character has 4 expressions:
neutral, worried, happy, shocked. Output: SVG + PNG (full body, avatar)."""
import os, sys, cairosvg

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
os.makedirs(OUT, exist_ok=True)
INK = '#2b2522'
# Animation state for the frame being drawn: mouth 0-3 (talking), blink, head tilt in degrees, arm pose, held prop.
ANIM = dict(mouth=0, blink=False, tilt=0, pose='idle', prop=None, look=0)
ARM = {}

def shade(hexc, f):
    h = hexc.lstrip('#'); r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    if f < 1: r, g, b = int(r * f), int(g * f), int(b * f)
    else: r, g, b = [int(c + (255 - c) * (f - 1)) for c in (r, g, b)]
    return '#%02x%02x%02x' % (r, g, b)

# ---------------------------------------------------------------- face
def face(c, expr):
    s = []
    sk = c['skin']
    # ears
    s.append(f'<ellipse cx="125" cy="178" rx="13" ry="19" fill="{shade(sk, .93)}"/><ellipse cx="275" cy="178" rx="13" ry="19" fill="{shade(sk, .93)}"/>')
    if c.get('earrings'):
        s.append('<circle cx="124" cy="203" r="6" fill="#d9a62e"/><circle cx="276" cy="203" r="6" fill="#d9a62e"/>')
    # head
    s.append(f'<ellipse cx="200" cy="170" rx="76" ry="86" fill="{sk}"/>')
    s.append(f'<path d="M200,84 C252,84 276,124 276,170 C276,214 252,250 214,256 C246,236 262,206 262,170 C262,126 240,96 200,84Z" fill="{shade(sk, .94)}"/>')
    # cheeks
    blush = .55 if expr == 'happy' else .28
    s.append(f'<ellipse cx="160" cy="205" rx="14" ry="8" fill="#e07a6a" opacity="{blush}"/><ellipse cx="240" cy="205" rx="14" ry="8" fill="#e07a6a" opacity="{blush}"/>')
    # eyes
    ey = 178; ry = 11 if expr == 'shocked' else 9
    if expr == 'happy':
        s.append(f'<path d="M163,{ey+2} Q172,{ey-9} 181,{ey+2}" stroke="{INK}" stroke-width="5" fill="none" stroke-linecap="round"/>')
        s.append(f'<path d="M219,{ey+2} Q228,{ey-9} 237,{ey+2}" stroke="{INK}" stroke-width="5" fill="none" stroke-linecap="round"/>')
    elif ANIM['blink']:
        s.append(f'<path d="M164,{ey+1} Q172,{ey+5} 180,{ey+1} M220,{ey+1} Q228,{ey+5} 236,{ey+1}" stroke="{INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>')
    else:
        lk = ANIM.get('look', 0) * 5
        for x in (172, 228):
            s.append(f'<ellipse cx="{x+lk}" cy="{ey}" rx="7.5" ry="{ry}" fill="{INK}"/><circle cx="{x+lk+2.5}" cy="{ey-3.5}" r="2.4" fill="#fff"/>')
    # brows
    bc = c.get('brow', INK); by = 152
    B = {'neutral': ((158, by, 184, by - 3), (216, by - 3, 242, by)),
         'worried': ((158, by + 2, 184, by - 8), (216, by - 8, 242, by + 2)),
         'happy':   ((158, by - 2, 184, by - 7), (216, by - 7, 242, by - 2)),
         'shocked': ((158, by - 10, 184, by - 14), (216, by - 14, 242, by - 10)),
         'angry':   ((158, by - 6, 184, by + 4), (216, by + 4, 242, by - 6))}[expr]
    for (x1, y1, x2, y2) in B:
        s.append(f'<path d="M{x1},{y1} Q{(x1+x2)/2},{min(y1,y2)-4} {x2},{y2}" stroke="{bc}" stroke-width="{c.get("bw", 5)}" fill="none" stroke-linecap="round"/>')
    # wrinkles
    if c.get('old'):
        s.append(f'<g stroke="{shade(sk, .72)}" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M178,128 Q200,122 222,128"/><path d="M184,136 Q200,132 216,136"/><path d="M150,182 l-8,-4 M150,190 l-8,2 M250,182 l8,-4 M250,190 l8,2"/><path d="M170,226 q-6,8 -2,16 M230,226 q6,8 2,16"/></g>')
    # nose
    s.append(f'<path d="M199,186 Q193,203 203,205" stroke="{shade(sk, .70)}" stroke-width="3.5" fill="none" stroke-linecap="round"/>')
    # mouth
    my = 226
    mo = ANIM['mouth']
    if mo:
        ry_ = 3 + mo * 4.5; rx_ = 13 - mo * 0.8
        s.append(f'<ellipse cx="200" cy="{my+2}" rx="{rx_}" ry="{ry_}" fill="#7a2626"/>')
        if mo >= 2: s.append(f'<path d="M{200-rx_+3},{my+2-ry_+2} Q200,{my-ry_+6} {200+rx_-3},{my+2-ry_+2}" stroke="#fff" stroke-width="3" fill="none"/>')
    elif expr == 'happy':
        s.append(f'<path d="M180,{my-4} Q200,{my+22} 220,{my-4} Q200,{my+3} 180,{my-4}Z" fill="#8a2f2f"/><path d="M186,{my-1} Q200,{my+4} 214,{my-1} L212,{my+3} Q200,{my+7} 188,{my+3}Z" fill="#fff"/>')
    elif expr in ('worried', 'angry'):
        s.append(f'<path d="M186,{my+6} Q200,{my-4} 214,{my+6}" stroke="#8a2f2f" stroke-width="4.5" fill="none" stroke-linecap="round"/>')
    elif expr == 'shocked':
        s.append(f'<ellipse cx="200" cy="{my+3}" rx="10" ry="13" fill="#8a2f2f"/>')
    else:
        s.append(f'<path d="M186,{my} Q200,{my+8} 214,{my}" stroke="#8a2f2f" stroke-width="4.5" fill="none" stroke-linecap="round"/>')
    # moustache
    m = c.get('moustache'); mc = c.get('mcol', c['hair'])
    if m == 'thick':
        s.append(f'<path d="M174,{my-6} Q186,{my-20} 200,{my-12} Q214,{my-20} 226,{my-6} Q214,{my-8} 200,{my-6} Q186,{my-8} 174,{my-6}Z" fill="{mc}"/>')
    elif m == 'big':
        s.append(f'<path d="M160,{my-14} Q168,{my-2} 176,{my-6} Q188,{my-22} 200,{my-13} Q212,{my-22} 224,{my-6} Q232,{my-2} 240,{my-14} Q236,{my+4} 222,{my} Q210,{my-6} 200,{my-5} Q190,{my-6} 178,{my} Q164,{my+4} 160,{my-14}Z" fill="{mc}"/>')
    elif m == 'thin':
        s.append(f'<path d="M182,{my-6} Q200,{my-14} 218,{my-6}" stroke="{mc}" stroke-width="5" fill="none" stroke-linecap="round"/>')
    # glasses
    g = c.get('glasses'); gc = c.get('gcol', '#3a3330')
    if g == 'round':
        s.append(f'<g stroke="{gc}" stroke-width="3.5" fill="#ffffff" fill-opacity=".12"><circle cx="172" cy="178" r="18"/><circle cx="228" cy="178" r="18"/></g><path d="M190,176 Q200,170 210,176 M154,176 L128,170 M246,176 L272,170" stroke="{gc}" stroke-width="3.5" fill="none"/>')
    elif g == 'rect':
        s.append(f'<g stroke="{gc}" stroke-width="3.5" fill="#ffffff" fill-opacity=".12"><rect x="151" y="165" width="42" height="27" rx="7"/><rect x="207" y="165" width="42" height="27" rx="7"/></g><path d="M193,175 L207,175 M151,174 L128,170 M249,174 L272,170" stroke="{gc}" stroke-width="3.5" fill="none"/>')
    if c.get('bindi'):
        s.append(f'<circle cx="200" cy="142" r="{c.get("bindi")}" fill="#c62f3a"/>')
    return ''.join(s)

# ---------------------------------------------------------------- hair
def hair(c, layer):
    h = c['hair']; st = c['hstyle']; hd = shade(h, .82)
    if layer == 'back':
        if st == 'part_bun':
            return f'<ellipse cx="200" cy="160" rx="86" ry="90" fill="{hd}"/><circle cx="200" cy="78" r="1" fill="none"/>'
        if st == 'white_bun':
            return f'<circle cx="200" cy="80" r="30" fill="{hd}"/><ellipse cx="200" cy="160" rx="84" ry="88" fill="{hd}"/>'
        if st == 'pony':
            return f'<ellipse cx="200" cy="158" rx="84" ry="88" fill="{hd}"/><path d="M262,118 C320,140 322,230 300,300 C292,320 278,318 282,296 C296,230 290,170 252,140Z" fill="{h}"/><circle cx="266" cy="126" r="10" fill="{c.get("accent", "#e0566f")}"/>'
        if st == 'long':
            return f'<path d="M116,170 C108,96 150,72 200,72 C250,72 292,96 284,170 L296,300 Q298,322 276,322 L262,322 L262,190 L138,190 L138,322 L124,322 Q102,322 104,300Z" fill="{hd}"/>'
        if st == 'bob':
            return f'<path d="M112,170 C108,96 150,74 200,74 C250,74 292,96 288,170 L292,244 Q292,258 278,258 L262,258 L262,170 L138,170 L138,258 L122,258 Q108,258 108,244Z" fill="{hd}"/>'
        return ''
    if st in ('short', 'messy', 'side', 'neat'):
        p = f'<path d="M124,172 C116,100 160,72 200,72 C242,72 286,100 276,172 C272,140 256,120 232,114 C214,124 184,126 164,114 C142,122 128,142 124,172Z" fill="{h}"/>'
        if st == 'messy':
            p += f'<path d="M138,112 L150,70 L168,98 L184,60 L200,92 L220,58 L232,96 L254,70 L262,112 Z" fill="{h}"/>'
        if st == 'side':
            p = f'<path d="M124,172 C116,100 160,72 204,72 C246,72 286,102 276,172 C272,138 250,114 214,108 C196,108 150,118 124,172Z" fill="{h}"/><path d="M168,80 Q160,96 150,112" stroke="{shade(h, 1.25)}" stroke-width="3" fill="none"/>'
        if c.get('grey_sides'):
            p += f'<path d="M124,172 C122,150 126,134 134,124 L138,172Z" fill="{c["grey_sides"]}"/><path d="M276,172 C278,150 274,134 266,124 L262,172Z" fill="{c["grey_sides"]}"/>'
        return p
    if st == 'receding':
        return f'<path d="M124,176 C118,136 130,108 152,96 C142,122 138,146 138,176Z" fill="{h}"/><path d="M276,176 C282,136 270,108 248,96 C258,122 262,146 262,176Z" fill="{h}"/><path d="M180,90 Q200,84 220,90" stroke="{h}" stroke-width="4" fill="none" opacity=".6"/>'
    if st in ('part_bun', 'white_bun'):
        p = f'<path d="M124,176 C118,100 160,76 200,78 C240,76 282,100 276,176 C272,128 240,104 200,102 C160,104 128,128 124,176Z" fill="{h}"/>'
        if c.get('sindoor'): p += '<path d="M200,80 L200,102" stroke="#c62f3a" stroke-width="4" stroke-linecap="round"/>'
        else: p += f'<path d="M200,80 L200,100" stroke="{shade(h, .7)}" stroke-width="2.5"/>'
        return p
    if st == 'pony':
        return f'<path d="M124,172 C118,98 160,74 202,74 C244,74 284,100 276,172 C268,128 240,106 210,104 C196,118 168,128 140,128 C132,140 126,154 124,172Z" fill="{h}"/>'
    if st == 'long':
        return f'<path d="M122,186 C116,100 158,74 200,74 C244,74 284,100 278,186 C274,130 244,104 204,100 C196,112 178,118 160,118 C140,126 126,150 122,186Z" fill="{h}"/><path d="M204,80 Q200,92 204,100" stroke="{shade(h, .7)}" stroke-width="2.5" fill="none"/>'
    if st == 'bob':
        return f'<path d="M122,176 C116,100 158,74 200,74 C244,74 284,100 278,176 C272,140 262,124 250,118 L246,134 C224,128 210,116 204,104 C190,122 160,132 132,134 C128,146 124,160 122,176Z" fill="{h}"/>'
    return ''

# ---------------------------------------------------------------- body
def arms(sleeve, skin, short=False, l_angle=7, r_angle=-7, right_up=False):
    ARM.update(sleeve=sleeve, skin=skin, short=short)
    if ANIM['pose'] != 'idle' and not right_up:
        sh = shade(sleeve, .9); L = 88 if short else 160
        if ANIM['pose'] in ('gesture', 'phone'):
            return f'<g transform="rotate({l_angle} 106 292)"><rect x="88" y="288" width="36" height="{L}" rx="18" fill="{sh}"/>' + (f'<rect x="91" y="{288+L-14}" width="30" height="84" rx="15" fill="{skin}"/>' if short else '') + '</g>'
        return ''
    s = []
    sh = shade(sleeve, .9)
    L = 88 if short else 160
    s.append(f'<g transform="rotate({l_angle} 106 292)"><rect x="88" y="288" width="36" height="{L}" rx="18" fill="{sh}"/>' + (f'<rect x="91" y="{288+L-14}" width="30" height="84" rx="15" fill="{skin}"/>' if short else '') + '</g>')
    if right_up:
        s.append(f'<path d="M290,300 L334,262 L306,206" stroke="{sh}" stroke-width="36" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
    else:
        s.append(f'<g transform="rotate({r_angle} 294 292)"><rect x="276" y="288" width="36" height="{L}" rx="18" fill="{sh}"/>' + (f'<rect x="279" y="{288+L-14}" width="30" height="84" rx="15" fill="{skin}"/>' if short else '') + '</g>')
    return ''.join(s)

def hands(skin, right_up=False):
    if ANIM['pose'] != 'idle' and not right_up:
        return f'<circle cx="85" cy="458" r="17" fill="{skin}"/>' if ANIM['pose'] in ('gesture', 'phone') else ''
    lx, ly = 85, 458
    s = f'<circle cx="{lx}" cy="{ly}" r="17" fill="{skin}"/>'
    if right_up: s += f'<circle cx="300" cy="196" r="17" fill="{skin}"/>'
    else: s += f'<circle cx="315" cy="458" r="17" fill="{skin}"/>'
    return s

def torso(col, w=1.0, to=470, flare=0):
    x0, x1 = 200 - 92 * w, 200 + 92 * w
    b0, b1 = 200 - (100 * w + flare), 200 + (100 * w + flare)
    return f'<path d="M{x0},304 Q{x0+2},278 {x0+30},272 L{x1-30},272 Q{x1-2},278 {x1},304 L{b1},{to} Q200,{to+8} {b0},{to} Z" fill="{col}"/>'

def legs(col, shoes='#3a2f2a', top=462, bot=600, sneakers=False):
    s = f'<rect x="142" y="{top}" width="54" height="{bot-top}" rx="10" fill="{col}"/><rect x="204" y="{top}" width="54" height="{bot-top}" rx="10" fill="{shade(col, .9)}"/>'
    if sneakers:
        s += f'<path d="M134,{bot+14} Q134,{bot-8} 168,{bot-6} L198,{bot-4} Q206,{bot+2} 200,{bot+16}Z" fill="#f4f4f4"/><path d="M200,{bot+14} Q200,{bot-8} 232,{bot-6} L262,{bot-4} Q270,{bot+2} 266,{bot+16}Z" fill="#f4f4f4"/><path d="M142,{bot+4} l40,0 M208,{bot+4} l40,0" stroke="{shoes}" stroke-width="4"/>'
    else:
        s += f'<ellipse cx="166" cy="{bot+6}" rx="32" ry="13" fill="{shoes}"/><ellipse cx="234" cy="{bot+6}" rx="32" ry="13" fill="{shoes}"/>'
    return s

def neck(skin):
    return f'<rect x="180" y="236" width="40" height="46" rx="12" fill="{shade(skin, .9)}"/>'

def saree(c):
    sc, bd, bl = c['saree'], c['border'], c['blouse']
    s = [f'<path d="M126,446 L274,446 L296,612 L104,612 Z" fill="{sc}"/>',
         f'<path d="M104,598 L296,598 L298,612 L102,612Z" fill="{bd}"/>',
         f'<path d="M184,452 L176,600 M200,452 L200,600 M216,452 L224,600" stroke="{shade(sc, .85)}" stroke-width="3"/>',
         torso(bl, .98, 452), arms(bl, c['skin'], short=True, r_angle=-8),
         f'<path d="M116,282 L170,270 L306,452 L292,512 Z" fill="{sc}"/>',
         f'<path d="M170,270 L306,452 L302,470 L160,276Z" fill="{bd}"/>',
         f'<ellipse cx="170" cy="616" rx="26" ry="9" fill="{shade(c["skin"], .8)}"/><ellipse cx="230" cy="616" rx="26" ry="9" fill="{shade(c["skin"], .8)}"/>']
    return ''.join(s)

# ---------------------------------------------------------------- props
def phone(x=298, y=412, lit=True):
    return f'<g transform="rotate(-8 {x+17} {y+30})"><rect x="{x}" y="{y}" width="36" height="62" rx="7" fill="#1f2430"/><rect x="{x+4}" y="{y+5}" width="28" height="50" rx="4" fill="{"#7fd3a8" if lit else "#39404f"}"/></g>'

def file_folder(x=40, y=360, col='#d9b26a'):
    return f'<g transform="rotate(-6 {x+40} {y+50})"><rect x="{x}" y="{y}" width="78" height="100" rx="5" fill="{col}"/><rect x="{x}" y="{y}" width="78" height="14" rx="5" fill="{shade(col, .82)}"/><rect x="{x+12}" y="{y+30}" width="54" height="5" rx="2" fill="#fff" opacity=".7"/><rect x="{x+12}" y="{y+42}" width="40" height="5" rx="2" fill="#fff" opacity=".7"/></g>'

# ---------------------------------------------------------------- characters
CAST = {
 'papa': dict(name='Papa', full='Rajesh Sharma', skin='#c98e63', hair='#3d3833', hstyle='short', grey_sides='#9c9894', moustache='thick', mcol='#33302c', glasses='rect', sig='#1b3a5c'),
 'mummy': dict(name='Mummy', full='Sunita Sharma', skin='#d9a27a', hair='#2a211d', hstyle='part_bun', sindoor=True, bindi=6, earrings=True, saree='#c23f66', border='#e9b64a', blouse='#7d2440', sig='#b04a60'),
 'meera': dict(name='Meera', full='Meera Sharma', skin='#cf9470', hair='#241b17', hstyle='pony', accent='#f0b429', earrings=True, sig='#2e805c'),
 'bunty': dict(name='Bunty', full='Arjun “Bunty” Sharma', skin='#c58a5e', hair='#1d1714', hstyle='messy', sig='#5a50aa'),
 'dadi': dict(name='Dadi', full='Kamla Devi', skin='#c9926c', hair='#e4e1dc', hstyle='white_bun', old=True, glasses='round', gcol='#8a6a3a', brow='#bdb6ad', bindi=4, saree='#efe6d2', border='#8c2d3c', blouse='#8c2d3c', sig='#78593f'),
 'mamaji': dict(name='Mama ji', full='Vinod Mehra', skin='#c48357', hair='#2c2622', hstyle='receding', moustache='big', mcol='#2a2420', sig='#96641e'),
 'chacha': dict(name='Chacha', full='Suresh Sharma', skin='#be8560', hair='#2b2521', hstyle='side', moustache='thin', glasses='rect', gcol='#5b4a3a', sig='#3c6e8c'),
 'neha': dict(name='Neha didi', full='Neha Sharma', skin='#d49b74', hair='#1f1815', hstyle='bob', glasses='round', gcol='#2a2a2a', earrings=True, sig='#c2601e'),
 'vidyut': dict(name='Vidyut', full='Vidyut', skin='#c48a62', hair='#1f1916', hstyle='side', brow='#1f1916', sig='#1f5f8b'),
 'anjali': dict(name='Anjali', full='Anjali', skin='#d6a07a', hair='#1c1512', hstyle='long', earrings=True, bindi=4, sig='#b4552d'),
 'mediator': dict(name='Mediator', full='Mediator', skin='#c99470', hair='#55504b', hstyle='part_bun', glasses='round', gcol='#4a3a2a', earrings=True, old=True, brow='#6e6862', saree='#2f7a6b', border='#e6c36a', blouse='#245e52', sig='#2f7a6b'),
 'judge': dict(name='Judge', full='Family Court judge', skin='#bf875f', hair='#d9d6d1', hstyle='neat', grey_sides='#ece9e4', glasses='rect', gcol='#2a2420', old=True, brow='#bdb8b2', sig='#222222'),
 'vakeel': dict(name='Vakeel sahab', full='Adv. R. K. Sinha', skin='#b8805a', hair='#8d8985', hstyle='neat', grey_sides='#c9c6c2', glasses='rect', gcol='#2a2420', old=True, moustache='thin', mcol='#8d8985', brow='#7a7672', sig='#222222'),
}

def outfit(key, c):
    sk = c['skin']
    if key == 'papa':
        return (legs('#4a4f5a') + torso('#a9c6e3') + arms('#a9c6e3', sk) +
                '<path d="M120,300 Q122,282 146,276 L200,330 L254,276 Q278,282 280,300 L290,470 Q200,478 110,470Z" fill="#7a3b33"/>' +
                '<path d="M176,272 L200,302 L224,272" fill="#a9c6e3" stroke="#8fb0d2" stroke-width="3"/>' +
                '<path d="M130,452 L270,452" stroke="#62302a" stroke-width="10"/>' + hands(sk) + phone(lit=False))
    if key == 'mummy':
        return saree(c) + hands(sk) + phone()
    if key == 'meera':
        return (legs('#2f3640', top=520, bot=600, sneakers=True, shoes='#2e805c') + torso('#2e805c', 1.0, 540, flare=14) + arms('#2e805c', sk, l_angle=6) +
                '<path d="M176,272 L200,300 L224,272" fill="#2a7353"/>' +
                '<path d="M160,300 l14,0 M176,320 l14,0 M200,340 l14,0 M218,312 l14,0 M150,360 l14,0 M190,380 l14,0 M230,370 l14,0 M170,420 l14,0 M210,440 l14,0 M150,480 l14,0 M240,470 l14,0" stroke="#f0b429" stroke-width="4" stroke-linecap="round" opacity=".7"/>' +
                '<path d="M134,280 L250,470" stroke="#c9a27a" stroke-width="9"/><rect x="236" y="440" width="70" height="86" rx="10" fill="#e4c79e"/>' +
                hands(sk) + phone(300, 404))
    if key == 'bunty':
        return (legs('#3b5b8c', sneakers=True, shoes='#e0475a') +
                '<path d="M140,268 Q200,300 260,268 L268,300 Q200,330 132,300Z" fill="#4a4291"/>' +
                torso('#5a50aa', 1.04) + arms('#5a50aa', sk, l_angle=5, r_angle=-5) +
                '<rect x="150" y="390" width="100" height="56" rx="14" fill="#4c4392"/><path d="M186,284 L184,340 M214,284 L216,340" stroke="#f1f1f1" stroke-width="4" stroke-linecap="round"/>' +
                '<path d="M150,278 Q200,240 250,278" stroke="#1f2430" stroke-width="9" fill="none"/><rect x="134" y="262" width="28" height="38" rx="12" fill="#1f2430"/><rect x="238" y="262" width="28" height="38" rx="12" fill="#1f2430"/><rect x="140" y="270" width="14" height="22" rx="6" fill="#e0475a"/><rect x="246" y="270" width="14" height="22" rx="6" fill="#e0475a"/>' +
                hands(sk) + phone(300, 408))
    if key == 'dadi':
        return ('<path d="M318,452 L336,616" stroke="#6b4a2e" stroke-width="9" stroke-linecap="round"/><path d="M300,452 Q318,430 330,450" stroke="#6b4a2e" stroke-width="9" fill="none" stroke-linecap="round"/>' +
                saree(c) + hands(sk))
    if key == 'mamaji':
        return (legs('#f1ede4', shoes='#6b4a2e', top=520) + torso('#f3efe6', 1.2, 548, flare=8) + arms('#f3efe6', sk, l_angle=9, right_up=True) +
                '<path d="M104,306 Q106,280 140,274 L180,274 L190,520 Q150,522 100,512Z" fill="#a8742a"/><path d="M296,306 Q294,280 260,274 L220,274 L210,520 Q250,522 300,512Z" fill="#a8742a"/>' +
                '<rect x="186" y="270" width="28" height="22" rx="6" fill="#a8742a"/><circle cx="200" cy="330" r="4" fill="#f1d38a"/><circle cx="200" cy="370" r="4" fill="#f1d38a"/><circle cx="200" cy="410" r="4" fill="#f1d38a"/>' +
                '<rect x="126" y="340" width="40" height="8" rx="3" fill="#8a5d1f"/>' +
                hands(sk, right_up=True) + '<g transform="rotate(12 300 160)"><rect x="282" y="120" width="40" height="70" rx="8" fill="#1f2430"/><rect x="287" y="126" width="30" height="56" rx="4" fill="#9ad0ff"/><path d="M292,140 l20,0 M292,150 l14,0 M292,160 l18,0" stroke="#fff" stroke-width="3"/></g>')
    if key == 'chacha':
        return (legs('#6e5640') + torso('#dfe7ea') + arms('#dfe7ea', sk, short=True) +
                '<path d="M176,272 L200,300 L224,272" fill="#c9d4d8"/><path d="M200,300 L200,470" stroke="#c9d4d8" stroke-width="3"/><circle cx="200" cy="330" r="3" fill="#9aa8ad"/><circle cx="200" cy="370" r="3" fill="#9aa8ad"/><circle cx="200" cy="410" r="3" fill="#9aa8ad"/>' +
                '<rect x="218" y="318" width="40" height="34" rx="4" fill="#c9d4d8"/><rect x="226" y="300" width="6" height="34" rx="2" fill="#2b5fa8"/><rect x="238" y="304" width="6" height="30" rx="2" fill="#c62f3a"/>' +
                '<rect x="110" y="456" width="180" height="12" fill="#3a2f2a"/>' + hands(sk) + file_folder(56, 362))
    if key == 'neha':
        return (legs('#2f4a73', sneakers=True, shoes='#c2601e') + torso('#f2efe9') + arms('#c2601e', sk, l_angle=6) +
                '<path d="M110,304 Q112,278 142,272 L176,272 L182,470 L100,470Z" fill="#c2601e"/><path d="M290,304 Q288,278 258,272 L224,272 L218,470 L300,470Z" fill="#c2601e"/>' +
                '<path d="M120,330 L180,330 M118,390 L182,390 M122,440 L182,440 M220,330 L280,330 M218,390 L284,390 M218,440 L290,440" stroke="#9e4a14" stroke-width="3" opacity=".6"/>' +
                '<path d="M150,276 L272,470" stroke="#2a2a2a" stroke-width="8"/><rect x="236" y="430" width="88" height="68" rx="8" fill="#3a3f4a"/><rect x="250" y="444" width="30" height="6" rx="3" fill="#c2601e"/>' +
                hands(sk))
    if key == 'vidyut':
        return (legs('#3d4552', shoes='#2a211c') + torso('#8fb6d6') + arms('#8fb6d6', sk) +
                '<path d="M176,272 L200,302 L224,272" fill="#7aa3c6"/><path d="M200,302 L200,470" stroke="#7aa3c6" stroke-width="3"/><circle cx="200" cy="340" r="3" fill="#5f87aa"/><circle cx="200" cy="385" r="3" fill="#5f87aa"/><circle cx="200" cy="430" r="3" fill="#5f87aa"/>' +
                '<rect x="110" y="456" width="180" height="12" fill="#2a211c"/><circle cx="104" cy="430" r="9" fill="#d9a62e" opacity=".0"/>' + hands(sk) + '<rect x="96" y="446" width="14" height="10" rx="3" fill="#c9a24a"/>')
    if key == 'anjali':
        return (legs('#efe6d8', shoes='#8a4a2a', top=520) + torso('#d07a3c', 1.0, 548, flare=16) + arms('#d07a3c', sk, l_angle=6) +
                '<path d="M176,272 Q200,300 224,272" fill="none" stroke="#a85a26" stroke-width="5"/>' +
                '<path d="M120,286 Q200,330 280,286 L300,316 Q200,368 100,316Z" fill="#7a2f4f" opacity=".95"/><path d="M100,316 Q200,368 300,316" stroke="#e6c36a" stroke-width="5" fill="none"/>' +
                '<path d="M150,420 l10,0 M190,440 l10,0 M230,420 l10,0 M170,480 l10,0 M215,500 l10,0 M250,470 l10,0 M140,505 l10,0" stroke="#f3d9a8" stroke-width="5" stroke-linecap="round"/>' +
                hands(sk) + '<circle cx="85" cy="452" r="18" fill="none" stroke="#c62f3a" stroke-width="4" opacity=".0"/>')
    if key == 'mediator':
        return saree(c) + hands(sk) + file_folder(260, 380, '#e8dcc0')
    if key == 'judge':
        return (legs('#1f1f22', shoes='#111') + torso('#1f1f22', 1.04) + arms('#1f1f22', sk) +
                '<path d="M170,272 L200,330 L230,272Z" fill="#fafafa"/><path d="M160,276 L200,350 L176,276Z" fill="#2c2c30"/><path d="M240,276 L200,350 L224,276Z" fill="#2c2c30"/>' +
                '<rect x="192" y="290" width="7" height="30" rx="2" fill="#fff"/><rect x="201" y="290" width="7" height="30" rx="2" fill="#fff"/>' + hands(sk))
    if key == 'vakeel':
        return (legs('#1f1f22', shoes='#111') + torso('#1f1f22', 1.02) + arms('#1f1f22', sk) +
                '<path d="M170,272 L200,330 L230,272Z" fill="#fafafa"/><path d="M160,276 L200,350 L176,276Z" fill="#2c2c30"/><path d="M240,276 L200,350 L224,276Z" fill="#2c2c30"/>' +
                '<rect x="192" y="290" width="7" height="30" rx="2" fill="#fff"/><rect x="201" y="290" width="7" height="30" rx="2" fill="#fff"/>' +
                hands(sk) + file_folder(256, 380, '#e8dcc0'))
    return ''

def svg(key, expr='neutral', crop='full'):
    c = CAST[key]
    body = outfit(key, c)
    t = ANIM['tilt']
    headg = f'<g transform="rotate({t} 200 262)">' + hair(c, 'back') + '</g>'
    headf = f'<g transform="rotate({t} 200 262)">' + face(c, expr) + hair(c, 'front') + '</g>'
    inner = ('<ellipse cx="200" cy="622" rx="130" ry="12" fill="#000" opacity=".08"/>' +
             headg + neck(c['skin']) + body + (pose_arms(False) if ANIM['pose'] != 'idle' else '') + prop_svg() + headf +
             (pose_arms(True) if ANIM['pose'] != 'idle' else ''))
    # mama ji's raised arm must sit over the head-hand overlap correctly: re-draw hand/phone last
    if key == 'mamaji':
        inner += '<circle cx="300" cy="196" r="17" fill="' + c['skin'] + '"/><g transform="rotate(12 300 160)"><rect x="282" y="120" width="40" height="70" rx="8" fill="#1f2430"/><rect x="287" y="126" width="30" height="56" rx="4" fill="#9ad0ff"/><path d="M292,140 l20,0 M292,150 l14,0 M292,160 l18,0" stroke="#fff" stroke-width="3"/></g>'
    if crop == 'avatar':
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="80 50 240 240" width="240" height="240"><defs><clipPath id="c"><circle cx="200" cy="170" r="120"/></clipPath></defs><circle cx="200" cy="170" r="120" fill="{shade(c["sig"], 1.75)}"/><g clip-path="url(#c)">{inner}</g></svg>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 30 400 610" width="400" height="610">{inner}</svg>'

def limb(pts, short):
    sh = shade(ARM['sleeve'], .9); sk = ARM['skin']
    (x0, y0), (x1, y1), (x2, y2) = pts
    if short:
        mx, my_ = (x0 + x1) / 2, (y0 + y1) / 2
        return (f'<path d="M{x0},{y0} L{mx},{my_}" stroke="{sh}" stroke-width="36" stroke-linecap="round" fill="none"/>' +
                f'<path d="M{mx},{my_} L{x1},{y1} L{x2},{y2}" stroke="{sk}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" fill="none"/>')
    return f'<path d="M{x0},{y0} L{x1},{y1} L{x2},{y2}" stroke="{sh}" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'

def pose_arms(after):
    p = ANIM['pose']; sk = ARM.get('skin', '#c98e63'); short = ARM.get('short', False); o = []
    if not after:
        if p == 'gesture':
            o.append(limb([(294, 300), (330, 392), (356, 322)], short)); o.append(f'<circle cx="356" cy="318" r="18" fill="{sk}"/>')
        elif p == 'open':
            o.append(limb([(106, 300), (74, 392), (44, 410)], short)); o.append(limb([(294, 300), (326, 392), (356, 410)], short))
            o.append(f'<circle cx="42" cy="410" r="18" fill="{sk}"/><circle cx="358" cy="410" r="18" fill="{sk}"/>')
        elif p == 'fold':
            o.append(limb([(106, 300), (112, 384), (250, 392)], short)); o.append(limb([(294, 300), (288, 400), (150, 404)], short))
            o.append(f'<circle cx="262" cy="390" r="17" fill="{sk}"/><circle cx="140" cy="404" r="17" fill="{sk}"/>')
    else:
        if p == 'phone':
            o.append(limb([(294, 300), (322, 372), (276, 214)], short)); o.append(f'<circle cx="276" cy="210" r="18" fill="{sk}"/>')
            o.append('<g transform="rotate(14 282 186)"><rect x="262" y="150" width="36" height="66" rx="7" fill="#1f2430"/><rect x="266" y="156" width="28" height="52" rx="4" fill="#39404f"/></g>')
        elif p == 'cover':
            o.append(limb([(106, 300), (138, 392), (176, 232)], short)); o.append(limb([(294, 300), (262, 392), (224, 232)], short))
            o.append(f'<circle cx="176" cy="222" r="21" fill="{sk}"/><circle cx="224" cy="222" r="21" fill="{sk}"/>')
    return ''.join(o)

def prop_svg():
    if ANIM['prop'] == 'bag':
        return '<path d="M300,430 Q316,392 334,430" stroke="#5a3b28" stroke-width="7" fill="none"/><rect x="286" y="428" width="70" height="92" rx="12" fill="#8a5a3c"/><rect x="286" y="456" width="70" height="8" fill="#6e4630"/>'
    if ANIM['prop'] == 'paper':
        return '<g transform="rotate(-8 330 420)"><rect x="296" y="372" width="78" height="100" rx="5" fill="#ffffff" stroke="#c9ced6" stroke-width="3"/><rect x="306" y="384" width="58" height="12" rx="3" fill="#b3261e"/><rect x="306" y="406" width="50" height="5" rx="2" fill="#c9ced6"/><rect x="306" y="418" width="56" height="5" rx="2" fill="#c9ced6"/><rect x="306" y="430" width="40" height="5" rx="2" fill="#c9ced6"/></g>'
    return ''

EXPR = ['neutral', 'worried', 'happy', 'shocked', 'angry']

def render_all():
    for k in CAST:
        for e in EXPR:
            s = svg(k, e); open(f'{OUT}/{k}_{e}.svg', 'w').write(s)
            cairosvg.svg2png(bytestring=s.encode(), write_to=f'{OUT}/{k}_{e}.png', output_width=800)
            a = svg(k, e, 'avatar'); open(f'{OUT}/{k}_{e}_avatar.svg', 'w').write(a)
            cairosvg.svg2png(bytestring=a.encode(), write_to=f'{OUT}/{k}_{e}_avatar.png', output_width=240)

if __name__ == '__main__':
    render_all(); print('ok', len(os.listdir(OUT)))
