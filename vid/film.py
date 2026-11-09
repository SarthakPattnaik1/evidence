"""Vidyut & Anjali — animated short films with talking characters, score and sound effects.
Director's engine: each scene is a timeline of beats (lines of dialogue, moves, reactions, sound cues)."""
import sys, os, math, io, subprocess, hashlib
sys.path.insert(0, '/tmp/vid'); sys.path.insert(0, '/home/claude/cast')
import cast as CAST, cairosvg, audio
from episode import font, draw_text, wrap, text_w, encode, NAVY, GOLD, CREAM, MUTED
import case as CS
from PIL import Image, ImageDraw

W, H, FPS = 1080, 1920, 30
TOP, BOT = 150, 1700                 # scene band
SH = BOT - TOP                       # 1550
GROUND = 1440                        # feet line, scene-local
CH_H = 1100                           # character height on screen
INK = (19, 35, 58)
OUT = '/tmp/vid/out/'
COL = {'vidyut': (31, 95, 139), 'anjali': (180, 85, 45), 'vakeel': (34, 34, 34), 'judge': (60, 60, 60), 'mediator': (47, 122, 107), 'phone': (110, 118, 130)}
NAME = {'vidyut': 'Vidyut', 'anjali': 'Anjali', 'vakeel': 'Advocate', 'judge': 'Judge', 'mediator': 'Mediator', 'phone': 'Relative · on the phone'}

def ease(t): t = max(0, min(1, t)); return t * t * (3 - 2 * t)

# ---------------------------------------------------------------- voices (made by tts.py); films still work without them
import json, wave
import numpy as np
VDIR = '/tmp/vid/voice/'
VIDX = json.load(open(VDIR + 'index.json')) if os.path.exists(VDIR + 'index.json') else {}
_venv = {}
def voice_of(who, text):
    v = VIDX.get(who + '|' + text)
    return (VDIR + v['file'], v['dur']) if v else None
def mouth_track(path):
    """Loudness of the voice for each video frame -> mouth opening 0..3 (real lip sync)."""
    if path not in _venv:
        w = wave.open(path); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(float) / 32768
        hop = sr // FPS; r = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) if len(x[i:i + hop]) else 0 for i in range(0, len(x), hop)])
        r = r / (np.percentile(r, 95) or 1)
        _venv[path] = [0 if v < 0.12 else 1 if v < 0.38 else 2 if v < 0.7 else 3 for v in r]
    return _venv[path]

# ---------------------------------------------------------------- character renders (cached)
_rc = {}
def render(key, expr, mouth, blink, tilt, pose, prop, h=CH_H):
    k = (key, expr, mouth, blink, tilt, pose, prop, h)
    if k not in _rc:
        CAST.ANIM.update(dict(mouth=mouth, blink=blink, tilt=tilt, pose=pose, prop=prop))
        png = cairosvg.svg2png(bytestring=CAST.svg(key, expr).encode(), output_width=int(h * 400 / 610))
        _rc[k] = Image.open(io.BytesIO(png)).convert('RGBA')
        CAST.ANIM.update(dict(mouth=0, blink=False, tilt=0, pose='idle', prop=None))
    return _rc[k]

# ---------------------------------------------------------------- sets
def _room(wall, floor, night=False):
    im = Image.new('RGB', (W, SH), wall); d = ImageDraw.Draw(im)
    d.rectangle([0, GROUND - 120, W, SH], fill=floor)
    d.rectangle([0, GROUND - 130, W, GROUND - 118], fill=tuple(max(0, c - 25) for c in floor))
    return im, d

def set_wedding():
    im, d = _room((122, 32, 54), (176, 58, 72))
    for row in range(3):                     # marigold strings
        y = 120 + row * 70
        for x in range(-20, W + 40, 34):
            yy = y + 30 * math.sin((x + row * 40) / 160)
            d.ellipse([x, yy, x + 30, yy + 30], fill=(244, 160, 32) if (x // 34 + row) % 2 else (250, 196, 48))
    for x in range(40, W, 90):               # fairy lights
        for y in range(380, 900, 110):
            d.ellipse([x + (y % 40), y, x + 10 + (y % 40), y + 10], fill=(255, 230, 160))
    d.rounded_rectangle([140, 520, 940, 1180], 40, fill=(150, 40, 66)); d.rounded_rectangle([170, 550, 910, 1150], 30, outline=(240, 190, 90), width=8)
    return im

def set_home(night=False, warm=False, door=False):
    wall = (58, 64, 92) if night else ((246, 232, 210) if warm else (236, 230, 220))
    floor = (74, 70, 86) if night else ((206, 172, 134) if warm else (196, 178, 152))
    im, d = _room(wall, floor, night)
    d.rounded_rectangle([90, 300, 400, 650], 14, fill=(30, 40, 70) if night else (170, 205, 226))
    if night:
        d.ellipse([300, 340, 360, 400], fill=(240, 236, 210))
        for (x, y) in ((140, 360), (220, 460), (330, 560), (180, 600)): d.ellipse([x, y, x + 6, y + 6], fill=(240, 240, 255))
    d.line([245, 300, 245, 650], fill=wall, width=10); d.line([90, 475, 400, 475], fill=wall, width=10)
    d.rounded_rectangle([600, 330, 860, 520], 10, fill=(150, 112, 80)); d.rounded_rectangle([616, 346, 844, 504], 6, fill=(250, 238, 222) if not night else (120, 112, 130))
    d.ellipse([680, 385, 730, 435], fill=(200, 140, 110)); d.ellipse([736, 385, 786, 435], fill=(210, 150, 120))
    sofa = (160, 92, 70) if warm else ((70, 66, 90) if night else (122, 108, 120))
    d.rounded_rectangle([40, 900, 1040, 1150], 40, fill=sofa); d.rounded_rectangle([70, 820, 1010, 960], 40, fill=tuple(min(255, c + 16) for c in sofa))
    if warm:
        for i in range(6): d.ellipse([860 + i * 22, 200, 920 + i * 22, 260], fill=(255, 222, 160))
    if night:
        d.rectangle([880, 700, 900, 1060], fill=(60, 54, 60)); d.polygon([(830, 700), (950, 700), (920, 620), (860, 620)], fill=(250, 214, 140))
    return im

def set_split():
    im = Image.new('RGB', (W, SH), (236, 230, 220)); d = ImageDraw.Draw(im)
    d.rectangle([W // 2, 0, W, SH], fill=(222, 230, 238))
    d.rectangle([0, GROUND - 120, W // 2, SH], fill=(196, 178, 152)); d.rectangle([W // 2, GROUND - 120, W, SH], fill=(176, 186, 198))
    d.rectangle([W // 2 - 6, 0, W // 2 + 6, SH], fill=(255, 255, 255))
    d.rounded_rectangle([60, 330, 300, 600], 12, fill=(170, 205, 226)); d.rounded_rectangle([780, 330, 1020, 600], 12, fill=(196, 222, 200))
    for x, t in ((W // 4, "Vidyut's home"), (3 * W // 4, "Her parents' home")):
        tw = text_w(t, 'ns700', 32); d.rounded_rectangle([x - tw // 2 - 22, GROUND + 30, x + tw // 2 + 22, GROUND + 88], 29, fill=(255, 255, 255)); draw_text(im, (x - tw // 2, GROUND + 39), t, 'ns700', 32, INK)
    return im

def set_chamber():
    im, d = _room((232, 222, 204), (150, 116, 86))
    d.rectangle([60, 250, 520, 1000], fill=(110, 76, 52))
    for r in range(5):
        y = 280 + r * 140; d.rectangle([80, y + 110, 500, y + 122], fill=(86, 58, 40))
        x = 90
        for k in range(11):
            w = 26 + (k * 7 + r * 5) % 18; h = 80 + (k * 13 + r) % 26
            d.rectangle([x, y + 110 - h, x + w, y + 110], fill=[(150, 40, 50), (40, 70, 120), (200, 160, 70), (60, 110, 80), (120, 60, 100)][(k + r) % 5]); x += w + 6
            if x > 470: break
    return im

def set_court():
    im, d = _room((226, 214, 196), (170, 130, 96))
    d.rectangle([0, 0, W, 120], fill=(120, 82, 56))
    t = 'FAMILY COURT'; tw = text_w(t, 'ns700', 38); d.rounded_rectangle([540 - tw // 2 - 28, 200, 540 + tw // 2 + 28, 264], 10, fill=(255, 250, 240)); draw_text(im, (540 - tw // 2, 210), t, 'ns700', 38, INK)
    return im

def set_mediation():
    im, d = _room((228, 236, 230), (186, 196, 182))
    d.rounded_rectangle([70, 260, 330, 560], 14, fill=(190, 216, 228)); d.line([200, 260, 200, 560], fill=(228, 236, 230), width=10)
    d.ellipse([880, 760, 1020, 880], fill=(70, 140, 100)); d.ellipse([910, 700, 1000, 800], fill=(86, 160, 116)); d.rounded_rectangle([910, 860, 990, 1000], 10, fill=(176, 110, 70))
    t = 'MEDIATION CENTRE'; tw = text_w(t, 'ns700', 34); d.rounded_rectangle([540 - tw // 2 - 26, 200, 540 + tw // 2 + 26, 260], 10, fill=(255, 255, 255)); draw_text(im, (540 - tw // 2, 210), t, 'ns700', 34, (31, 94, 82))
    return im

SETS = {}
def get_set(name):
    if name not in SETS:
        SETS[name] = {'wedding': set_wedding, 'home': set_home, 'night': lambda: set_home(night=True), 'warm': lambda: set_home(warm=True),
                      'split': set_split, 'chamber': set_chamber, 'court': set_court, 'mediation': set_mediation}[name]()
    return SETS[name]

def fg_court(im, oy):
    d = ImageDraw.Draw(im); y = oy
    d.rectangle([220, y + 700, 860, y + GROUND - 110], fill=(120, 82, 56)); d.rectangle([220, y + 700, 860, y + 736], fill=(146, 104, 72))
    g = (226, 186, 110); cx, cy = 540, y + 800
    d.line([cx, cy, cx, cy + 130], fill=g, width=8); d.rectangle([cx - 38, cy + 126, cx + 38, cy + 138], fill=g)
    d.line([cx - 78, cy + 20, cx + 78, cy + 20], fill=g, width=8); d.ellipse([cx - 10, cy - 10, cx + 10, cy + 10], fill=g)
    for sx in (-78, 78):
        d.line([cx + sx, cy + 20, cx + sx - 24, cy + 78], fill=g, width=3); d.line([cx + sx, cy + 20, cx + sx + 24, cy + 78], fill=g, width=3)
        d.chord([cx + sx - 34, cy + 56, cx + sx + 34, cy + 102], 0, 180, fill=g)

def fg_table(im, oy):
    d = ImageDraw.Draw(im)
    d.ellipse([180, oy + 1170, 900, oy + 1320], fill=(150, 104, 70)); d.ellipse([180, oy + 1146, 900, oy + 1286], fill=(176, 124, 84))

def fg_desk(im, oy):
    d = ImageDraw.Draw(im)
    d.rectangle([560, oy + 1060, 1060, oy + 1330], fill=(122, 84, 58)); d.rectangle([560, oy + 1060, 1060, oy + 1086], fill=(146, 104, 72))
    d.rectangle([600, oy + 1030, 720, oy + 1062], fill=(240, 236, 226)); d.rectangle([740, oy + 1040, 830, oy + 1062], fill=(160, 40, 40))
    t = 'ADVOCATE'; tw = text_w(t, 'ns700', 32); d.rounded_rectangle([810 - tw // 2 - 24, oy + 1110, 810 + tw // 2 + 24, oy + 1166], 8, fill=(255, 250, 240)); draw_text(im, (810 - tw // 2, oy + 1118), t, 'ns700', 32, INK)

def fg_door(im, oy, state):
    d = ImageDraw.Draw(im); x0, x1, y0, y1 = 900, 1080, 560, GROUND - 120
    d.rectangle([x0 - 16, oy + y0 - 16, x1, oy + y1], fill=(90, 62, 44))
    if state < 1:   # open: dark corridor, door swung
        d.rectangle([x0, oy + y0, x1, oy + y1], fill=(30, 28, 36))
        w = int((x1 - x0) * (1 - state)); d.rectangle([x0, oy + y0, x0 + max(8, int(w * 0.25)), oy + y1], fill=(126, 88, 62))
    if state > 0:
        w = int((x1 - x0) * state); d.rectangle([x1 - w, oy + y0, x1, oy + y1], fill=(138, 98, 72)); d.ellipse([x1 - w + 20, oy + 900, x1 - w + 36, oy + 916], fill=(230, 196, 120))

# ---------------------------------------------------------------- bubbles
def bubble(im, who, text, shown, cx, a, oy, top=True):
    if a <= 0: return
    lines = wrap(text, 'ns700', 46, 780)
    vis = text[:shown]
    # draw full-size box so it does not jump while typing
    bw = max(text_w(l, 'ns700', 46) for l in lines) + 70; bw = max(bw, text_w(NAME[who], 'ns700', 28) + 70)
    bh = 60 + len(lines) * 60 + 30
    x0 = int(min(max(30, cx - bw / 2), W - 30 - bw)); y0 = oy + 118
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer); A = int(255 * a)
    d.rounded_rectangle([x0 + 4, y0 + 8, x0 + bw + 4, y0 + bh + 8], 32, fill=(0, 0, 0, int(40 * a)))
    d.rounded_rectangle([x0, y0, x0 + bw, y0 + bh], 32, fill=(255, 255, 255, A))
    tx = int(min(max(x0 + 50, cx), x0 + bw - 50)); d.polygon([(tx - 26, y0 + bh - 2), (tx + 26, y0 + bh - 2), (tx + (14 if who != 'phone' else 30), y0 + bh + 44)], fill=(255, 255, 255, A))
    c = COL[who]; draw_text(layer, (x0 + 34, y0 + 22), NAME[who], 'ns700', 28, c + (A,))
    yy = y0 + 66; left = vis
    for ln in lines:
        part = left[:len(ln)]; left = left[len(ln):].lstrip(' ') if len(left) > len(ln) else ''
        if part: draw_text(layer, (x0 + 34, yy), part, 'ns700', 46, INK + (A,))
        yy += 60
    im.paste(layer, (0, 0), layer)

def chip(im, text, a):
    if not text or a <= 0: return
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer); A = int(255 * a)
    tw = text_w(text, 'ns700', 32); d.rounded_rectangle([40, TOP + 24, 40 + tw + 44, TOP + 84], 30, fill=(11, 31, 54, int(220 * a)))
    draw_text(layer, (62, TOP + 33), text, 'ns700', 32, (255, 236, 200, A)); im.paste(layer, (0, 0), layer)

# ---------------------------------------------------------------- scene engine
def line_dur(text): return 1.3 + 0.058 * len(text)

def plan(scene):
    """Turn beats into a timeline: returns events [(t0, t1, beat)] and total seconds."""
    t = 0.4; ev = []
    for b in scene['beats']:
        k = b[0]
        if k == 'say':
            v = voice_of(b[1], b[2]); d = max(1.1, v[1] + 0.5) if v else line_dur(b[2])
            ev.append((t, t + d, b)); t += d + (0.25 if v else 0.15)
        elif k == 'wait': t += b[1]
        elif k == 'move': ev.append((t, t + b[3], b)); t += b[3] if not (len(b) > 4 and b[4].get('parallel')) else 0
        else: ev.append((t, t, b))
    return ev, t + scene.get('tail', 0.6)

MOUTH = [1, 2, 3, 2, 1, 0, 2, 3, 1, 2, 0, 1, 3, 2]
VOICE_EVENTS = []
def scene_frames(part, scene, sfx_out, t_offset):
    ev, total = plan(scene); n = int(total * FPS)
    st = {k: dict(v) for k, v in scene['cast'].items()}
    for v in st.values(): v.setdefault('expr', 'neutral'); v.setdefault('pose', 'idle'); v.setdefault('prop', None); v.setdefault('tilt', 0); v.setdefault('a', 1.0)
    base = Image.new('RGB', (W, H), (245, 240, 232))
    d = ImageDraw.Draw(base); d.rectangle([0, 0, W, TOP], fill=NAVY)
    draw_text(base, (44, 40), f'VIDYUT & ANJALI · PART {part} OF 3', 'ns700', 30, GOLD); draw_text(base, (44, 84), scene['title'], 'ns400', 36, (200, 210, 224))
    t2 = 'A fictional story · general legal information, not legal advice'; tw = text_w(t2, 'ns400', 25); draw_text(base, ((W - tw) // 2, BOT + 70), t2, 'ns400', 25, MUTED)
    t3 = 'saboot.org'; tw = text_w(t3, 'ns700', 34); draw_text(base, ((W - tw) // 2, BOT + 120), t3, 'ns700', 34, INK)
    stage = get_set(scene['set'])
    # schedule sounds
    for (t0, t1, b) in ev:
        if b[0] == 'say':
            v = voice_of(b[1], b[2])
            if v: VOICE_EVENTS.append((t_offset + t0 + 0.15, v[0]))
            else: sfx_out.append((t_offset + t0, 'pop'))
        if b[0] == 'sfx': sfx_out.append((t_offset + t0, b[1]))
        if b[0] == 'move' and b[1] in st:
            for k in range(int((t1 - t0) / 0.42)): sfx_out.append((t_offset + t0 + k * 0.42, 'step'))
    applied = set(); frames = []; moves = {}
    door = scene.get('door', None)
    for i in range(n):
        t = i / FPS
        speaking = None; line = None
        for j, (t0, t1, b) in enumerate(ev):
            if t >= t0 and j not in applied and b[0] in ('set', 'say', 'move', 'door'):
                applied.add(j)
                opts = b[3] if b[0] == 'say' and len(b) > 3 else (b[2] if b[0] == 'set' else {})
                tgt = b[1] if len(b) > 1 else None
                if b[0] in ('say', 'set') and tgt in st: st[tgt].update(opts)
                if b[0] == 'say' and len(b) > 4:            # listener reactions
                    for who, o in b[4].items(): st[who].update(o)
                if b[0] == 'move': moves[tgt] = (t0, t1, st[tgt]['x'], b[2])
                if b[0] == 'door': door = ('closing', t0)
            if b[0] == 'say' and t0 <= t < t1 + 0.1: speaking, line = b[1], (b, t0, t1)
        img = base.copy(); sc = stage.copy()
        # door behind characters? draw door in set layer, characters in front
        if door is not None:
            ds = 0.0
            if isinstance(door, tuple): ds = ease((t - door[1]) / 0.25)
            fg_door(sc, 0, ds)
        img.paste(sc, (0, TOP))
        for who, s in st.items():
            if who in moves:
                t0, t1, x0, x1 = moves[who]; p = ease((t - t0) / max(0.01, t1 - t0)); s['x'] = x0 + (x1 - x0) * p
                walking = t0 <= t <= t1
            else: walking = False
            talk = speaking == who and line and t < line[2] - 0.25
            mouth = MOUTH[(i // 3 + hash(who) % 5) % len(MOUTH)] if talk else 0
            if speaking == who and line:
                v = voice_of(who, line[0][2])
                if v:
                    tr = mouth_track(v[0]); fi = int((t - line[1] - 0.15) * FPS)
                    mouth = tr[fi] if 0 <= fi < len(tr) else 0
            blink = ((i + (hash(who) % 50)) % 110) < 4
            sway = s['tilt'] + (int(round(2.5 * math.sin(i / 9))) if talk else 0) + (int(round(3 * math.sin(i / 3))) if walking else 0)
            r = render(who, s['expr'], mouth, blink, max(-8, min(8, sway)), s['pose'], s['prop'], s.get('h', CH_H))
            bob = (abs(math.sin(i / 3)) * -14 if walking else math.sin((i + hash(who) % 30) / 20) * 3)
            hy = s.get('base', GROUND)
            x = int(s['x'] - r.width / 2); y = int(TOP + hy - r.height * 0.995 + bob)
            if s['a'] < 1 or s.get('fade_in'):
                al = s['a'] * (ease((t - s['fade_in']) / 0.4) if s.get('fade_in') is not None else 1)
                rr = r.copy(); rr.putalpha(rr.split()[3].point(lambda v: int(v * al))); img.paste(rr, (x, y), rr)
            else: img.paste(r, (x, y), r)
            if who == 'judge': fg_court(img, TOP)
        if scene.get('table'): fg_table(img, TOP)
        if scene.get('desk'): fg_desk(img, TOP)
        for (t0, t1, b) in ev:
            if b[0] == 'fx' and t >= t0: b[1](img, t - t0)
        chip(img, scene.get('chip'), ease(t / 0.4) * (1 - ease((t - 3.2) / 0.5)))
        if line:
            b, t0, t1 = line; txt = b[2]; v = voice_of(b[1], txt)
            span = (v[1] * 0.8) if v else max(0.4, min(1.0, len(txt) * 0.022))
            shown = int(len(txt) * min(1, (t - t0 - (0.15 if v else 0)) / span))
            if shown < len(txt): sp = txt.rfind(' ', 0, shown + 1); shown = sp if sp > 0 else 0
            who = b[1]; cx = st[who]['x'] if who in st else st[b[3].get('via', 'vidyut')]['x'] if len(b) > 3 else 540
            a = min(ease((t - t0) / 0.15), 1 - ease((t - t1) / 0.12))
            bubble(img, who, txt, shown, cx, a, TOP)
        if i < 6: img = Image.blend(Image.new('RGB', (W, H), (0, 0, 0)), img, i / 6)
        frames.append(img)
    return frames, total

# ---------------------------------------------------------------- fx helpers
def hearts_fx(img, dt):
    for k in range(5):
        tt = ((dt * 30 + k * 34) % 150) / 150
        CS.heart(img, 300 + k * 120, int(TOP + 900 - tt * 500), 24, (232, 100, 110), a=max(0, 1 - tt) * ease(dt / 0.4))
def heart_beat(img, dt): CS.heart(img, 540, TOP + 420, int(64 + 7 * abs(math.sin(dt * 5))), (224, 86, 96), a=ease(dt / 0.4))
def heart_break(img, dt): CS.heart(img, 540, TOP + 420, 62, (200, 120, 124), a=ease(dt / 0.3), broken=True)
def petition_fx(img, dt):
    s = ease(dt / 0.4) * (1 - ease((dt - 2.6) / 0.4)); x = int(200 + (1 - ease(dt / 0.4)) * -300)
    if s <= 0: return
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer); A = int(255 * s); y = TOP + 330
    d.rounded_rectangle([x, y, x + 300, y + 380], 18, fill=(255, 255, 255, A), outline=(19, 35, 58, A), width=6)
    d.rounded_rectangle([x + 24, y + 26, x + 276, y + 96], 10, fill=(179, 38, 30, A))
    for k, t in enumerate(['PETITION FOR', 'DIVORCE']):
        tw = text_w(t, 'ns700', 26); draw_text(layer, (x + 150 - tw // 2, y + 30 + k * 30), t, 'ns700', 26, (255, 255, 255, A))
    t = 'Family Court'; tw = text_w(t, 'ns700', 28); draw_text(layer, (x + 150 - tw // 2, y + 116), t, 'ns700', 28, INK + (A,))
    for k in range(6): d.rounded_rectangle([x + 34, y + 176 + k * 30, x + 266 - (k % 2) * 60, y + 188 + k * 30], 6, fill=(190, 198, 210, A))
    img.paste(layer, (0, 0), layer)

# ---------------------------------------------------------------- the three films
L, R = 300, 780
FILMS = {
 1: dict(sub='The conflict', nxt='Part 2 · The legal remedy', scenes=[
   dict(set='wedding', title='Part 1 · The conflict', chip='December 2025 · Their wedding', music='warm',
        cast={'vidyut': dict(x=400, expr='happy'), 'anjali': dict(x=690, expr='happy')},
        beats=[('fx', hearts_fx), ('say', 'anjali', 'Promise karo… hamesha saath rahoge?', {'tilt': -4}), ('say', 'vidyut', 'Hamesha. Har mushkil mein.', {'pose': 'gesture'}), ('wait', 0.8)]),
   dict(set='home', title='Part 1 · The conflict', chip='A few months later', music='tense',
        cast={'vidyut': dict(x=L, expr='neutral', pose='phone'), 'anjali': dict(x=R, expr='neutral')},
        beats=[('sfx', 'buzz'), ('wait', 0.6), ('say', 'phone', 'Bahu ko samjhao… ghar aise nahi chalta.', {'via': 'vidyut'}), ('say', 'vidyut', 'Haan haan… main baat karta hoon.', {'expr': 'worried'}),
               ('set', 'vidyut', {'pose': 'idle'}), ('say', 'anjali', 'Har baat mein bahar waale kyun bolte hain, Vidyut?', {'expr': 'angry', 'pose': 'open'}),
               ('say', 'vidyut', 'Woh family hai, Anjali.', {'pose': 'open'}, {'anjali': {'pose': 'idle'}}), ('say', 'anjali', 'Aur main? Main kaun hoon?', {'expr': 'worried', 'pose': 'fold'}), ('wait', 0.6)]),
   dict(set='night', title='Part 1 · The conflict', chip='That night', music='sad', door=0.0,
        cast={'vidyut': dict(x=L, expr='worried'), 'anjali': dict(x=720, expr='worried', prop='bag')},
        beats=[('say', 'vidyut', 'Anjali, ruko… baat karte hain na.', {'pose': 'open'}), ('say', 'anjali', 'Bahut baat ho gayi. Main maa ke ghar ja rahi hoon.', {'tilt': 4}),
               ('move', 'anjali', 1300, 1.7), ('door',), ('sfx', 'door'), ('set', 'vidyut', {'expr': 'shocked', 'pose': 'idle'}), ('wait', 0.9), ('set', 'vidyut', {'pose': 'cover', 'tilt': 5, 'expr': 'worried'}), ('wait', 1.4)]),
   dict(set='split', title='Part 1 · The conflict', chip='Two weeks later', music='tense',
        cast={'vidyut': dict(x=270, expr='neutral'), 'anjali': dict(x=810, expr='worried')},
        beats=[('sfx', 'ding'), ('fx', petition_fx), ('wait', 0.9), ('say', 'vidyut', 'Divorce ki petition…? Anjali ne?', {'expr': 'shocked', 'prop': 'paper'}),
               ('say', 'anjali', 'Shaayad yahi theek hai… shaayad.', {'tilt': -5}), ('wait', 0.5)]),
   dict(set='night', title='Part 1 · The conflict', chip='', music='sad',
        cast={'vidyut': dict(x=540, expr='worried')},
        beats=[('sfx', 'heart'), ('fx', heart_beat), ('say', 'vidyut', 'Main use khona nahi chahta.', {'tilt': 4}), ('say', 'vidyut', 'Kya koi raasta hai… ise bachane ka?', {'pose': 'open', 'tilt': 0}), ('wait', 0.8)]),
   ('card', dict(kicker='DID YOU KNOW?', chip='Section 14 · Hindu Marriage Act', head='Divorce in the first year needs the court’s permission.', body=['A divorce petition cannot normally be filed within one year of marriage.', 'The court allows it early only for exceptional hardship or exceptional depravity.'], n=270, music='neutral')),
   ('card', dict(kicker='THE QUESTION', head='What legal options does Vidyut have?', body=['He doesn’t want a divorce. He wants his wife back.'], cta='Watch Part 2', fig=[('vidyut', 'worried', 820, 560)], n=170, music='neutral')),
 ]),
 2: dict(sub='The legal remedy', nxt='Part 3 · Mediation and reconciliation', scenes=[
   dict(set='chamber', title='Part 2 · The legal remedy', chip="Next morning · An advocate's chamber", music='neutral', desk=True,
        cast={'vidyut': dict(x=270, expr='worried'), 'vakeel': dict(x=800, expr='neutral')},
        beats=[('say', 'vidyut', 'Main divorce nahi chahta. Main Anjali ko wapas chahta hoon.', {'pose': 'open'}),
               ('say', 'vakeel', 'Hindu Marriage Act mein iska ek raasta hai — Section 9.', {'pose': 'gesture'}, {'vidyut': {'pose': 'idle'}}),
               ('say', 'vakeel', 'Restitution of conjugal rights. Court se kehte hain ki married life wapas shuru ho.', {}),
               ('say', 'vidyut', 'Matlab court use wapas aane ko kahega?', {'expr': 'neutral'}, {'vakeel': {'pose': 'idle'}}), ('wait', 0.4)]),
   ('card', dict(kicker='THE LAW', chip='Section 9 · Hindu Marriage Act', head='Restitution of conjugal rights', body=['If one spouse leaves the other without a reasonable excuse, the court can order that married life be restored.', 'The spouse who left has to show the reasonable excuse.', '(This assumes both are Hindus, so the Act applies.)'], n=300, music='neutral')),
   dict(set='chamber', title='Part 2 · The legal remedy', chip='', music='tense', desk=True,
        cast={'vidyut': dict(x=270, expr='neutral'), 'vakeel': dict(x=800, expr='neutral')},
        beats=[('say', 'vakeel', 'Par ek baat saaf samjho — court kisi ko saath rehne pe majboor nahi kar sakta.', {'pose': 'gesture'}),
               ('say', 'vidyut', 'Phir iska fayda kya?', {'expr': 'worried', 'pose': 'open'}, {'vakeel': {'pose': 'idle'}}),
               ('say', 'vakeel', 'Court pehle dono ko milane ki koshish karta hai. Asli mauka wahi hai.', {'expr': 'happy', 'pose': 'gesture'}, {'vidyut': {'pose': 'idle'}}), ('wait', 0.4)]),
   ('card', dict(kicker='BUT KNOW THIS', head='A court order cannot rebuild a marriage.', body=['• No court can force anyone to live together.', '• If the order is not followed for a year, either spouse can ask for divorce (Section 13(1A)(ii)).', '• The Supreme Court is still examining whether this remedy is valid.'], n=330, dark=False, music='neutral')),
   dict(set='court', title='Part 2 · The legal remedy', chip='Family Court', music='neutral',
        cast={'judge': dict(x=540, expr='neutral', base=1090, h=820), 'vidyut': dict(x=185, expr='neutral', h=980), 'anjali': dict(x=895, expr='worried', h=980)},
        beats=[('sfx', 'gavel'), ('wait', 0.9), ('say', 'judge', 'Faisle se pehle, court dekhna chahta hai ki yeh shaadi bach sakti hai ya nahi.', {}),
               ('say', 'judge', 'Dono pakshon ko mediation ke liye bheja jaata hai.', {'pose': 'open'}),
               ('say', 'anjali', '…Theek hai.', {'expr': 'neutral', 'tilt': -4}, {'judge': {'pose': 'idle'}}), ('set', 'vidyut', {'expr': 'happy'}), ('wait', 1.0)]),
   ('card', dict(kicker='THE COURT’S DUTY', chip='Sec 23(2) HMA · Sec 9 Family Courts Act', head='Reconciliation comes first.', body=['Family Courts must, in the first instance, try to settle the dispute or reconcile the couple — often through counselling or mediation.'], n=240, music='neutral')),
   ('card', dict(kicker='THE QUESTION', head='Can a court case actually help them reconcile?', body=[], cta='Watch Part 3', fig=[('vidyut', 'worried', 700, 520), ('anjali', 'worried', 900, 500)], n=150, music='neutral')),
 ]),
 3: dict(sub='Mediation and reconciliation', nxt=None, scenes=[
   dict(set='mediation', title='Part 3 · Mediation', chip='Mediation centre', music='neutral', table=True,
        cast={'mediator': dict(x=540, expr='happy', base=1300, h=900), 'vidyut': dict(x=185, expr='worried', h=980), 'anjali': dict(x=895, expr='worried', h=980)},
        beats=[('say', 'mediator', 'Yahan koi jeetega ya haarega nahi. Aap bas ek doosre ko suniye.', {'pose': 'open'}),
               ('say', 'mediator', 'Aur jo yahan kaha jaata hai, woh yahin rehta hai.', {'pose': 'idle'}), ('wait', 0.4)]),
   dict(set='mediation', title='Part 3 · Mediation', chip='', music='sad', table=True,
        cast={'mediator': dict(x=540, expr='neutral', base=1300, h=900), 'vidyut': dict(x=185, expr='worried', h=980), 'anjali': dict(x=895, expr='worried', h=980)},
        beats=[('say', 'anjali', 'Mujhe lagta tha meri baat ka koi matlab hi nahi.', {'pose': 'open'}),
               ('say', 'vidyut', 'Main sun raha hoon, Anjali. Galti meri bhi thi.', {'pose': 'open'}, {'anjali': {'pose': 'idle'}}),
               ('say', 'vidyut', 'Ab hamare faisle hum dono lenge. Koi bahar waala nahi.', {'pose': 'gesture', 'expr': 'neutral'}),
               ('say', 'anjali', '…Pakka?', {'expr': 'neutral', 'tilt': -5}, {'vidyut': {'pose': 'idle'}}),
               ('say', 'vidyut', 'Pakka.', {'expr': 'happy'}), ('set', 'anjali', {'expr': 'happy', 'tilt': 0}), ('set', 'mediator', {'expr': 'happy'}), ('wait', 1.0)]),
   dict(set='warm', title='Part 3 · Mediation', chip='A month later', music='hopeful',
        cast={'vidyut': dict(x=420, expr='happy'), 'anjali': dict(x=1250, expr='happy')},
        beats=[('sfx', 'chime'), ('move', 'anjali', 670, 1.4), ('fx', hearts_fx), ('say', 'anjali', 'Chai banaun?', {'tilt': -4}), ('say', 'vidyut', 'Aaj main banata hoon.', {'pose': 'gesture'}), ('wait', 1.2)]),
   ('card', dict(kicker='THE LEGAL LEARNING', head='Matrimonial law is not only about divorce.', body=['Counselling, mediation and the court’s duty to attempt reconciliation can help a couple find their way back —', 'while respecting the rights, dignity and choice of both.'], n=270, music='hopeful')),
   ('card', dict(kicker='SAFETY FIRST', head='Reconciliation only where both are willing — and it is safe.', body=['If there is violence or threats, safety comes first.', 'Women’s helpline 181 · Emergency 112.'], n=230, dark=False, music='neutral')),
 ]),
}
END = 'Understand your rights. Explore your legal options. Make informed decisions about your matrimonial future.'

def build(p, mode='full'):
    F = FILMS[p]; parts = []; sfx = []; music = []; t = 0.0; VOICE_EVENTS.clear()
    segs = [('title', None)] + F['scenes'] + [('end', None)]
    for idx, sc in enumerate(segs):
        kind = sc[0] if isinstance(sc, tuple) else 'scene'
        if kind == 'title':
            fr = CS.title_frames(p, F['sub']); mood = 'sad' if p == 1 else ('neutral' if p == 2 else 'hopeful')
        elif kind == 'card':
            o = sc[1]; fr = CS.card_frames(p, '', o['kicker'], o['head'], o['body'], n=o.get('n', 200), chip=o.get('chip'), dark=o.get('dark', True), cta=o.get('cta'), fig=o.get('fig'))
            mood = o.get('music', 'neutral'); sfx.append((t + 0.05, 'whoosh'))
        elif kind == 'end':
            fr = CS.end_frames(END, F['nxt']); mood = 'hopeful' if p == 3 else 'neutral'; sfx.append((t + 0.3, 'chime'))
        else:
            fr, _ = scene_frames(p, sc, sfx, t); mood = sc['music']
        dur = len(fr) / FPS
        if music and music[-1][2] == mood: music[-1] = (music[-1][0], t + dur, mood)
        else: music.append((t, t + dur, mood))
        if mode == 'stills':
            for q in (0.35, 0.75): fr[int(len(fr) * q)].resize((360, 640)).save(f'/tmp/vid/fs{p}_{idx:02d}_{int(q*100)}.jpg', quality=82)
        else:
            path = f'{OUT}film{p}_{idx:02d}.mp4'; encode(path, fr); parts.append(path)
        t += dur; del fr
    print('part', p, 'length', round(t, 1), 's', 'music', [(round(a, 1), round(b, 1), m) for a, b, m in music])
    if mode == 'stills': return
    lst = f'{OUT}film{p}.txt'; open(lst, 'w').write(''.join(f"file '{x}'\n" for x in parts))
    v = f'{OUT}film{p}_v.mp4'; subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', v], check=True)
    a = f'{OUT}film{p}_a.m4a'; audio.mix(t, music, sfx, a, voices=list(VOICE_EVENTS))
    final = f'{OUT}vidyut-anjali-part{p}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', v, '-i', a, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', final], check=True)
    print('done', final)

if __name__ == '__main__':
    build(int(sys.argv[1]), sys.argv[2] if len(sys.argv) > 2 else 'full')
