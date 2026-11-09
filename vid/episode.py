"""Family Group — weekly Saboot series renderer.
Each episode: cold open card -> family group chat -> Meera checks Saboot (real app screens) -> chat payoff -> next-week card.
Usage: python3 episode.py <ep> stills|full
"""
import sys, os, json, math, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from fontTools.ttLib import TTFont

W, H, FPS = 1080, 1920, 30
T = '/tmp/vid/ttf/'
FONTS = {'bg800': T + 'bg800.ttf', 'ns400': T + 'ns400.ttf', 'ns700': T + 'ns700.ttf', 'dv700': T + 'dv700.ttf'}
EMOJI = '/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf'
CMAP = {k: set(TTFont(v).getBestCmap().keys()) for k, v in FONTS.items()}
EMAP = set(TTFont(EMOJI).getBestCmap().keys())
BG = (251, 248, 243); NAVY = (11, 31, 54); NAVY2 = (27, 58, 92); GOLD = (215, 164, 85); MUTED = (86, 100, 118); CREAM = (251, 248, 243)
CHATBG = (241, 236, 226); MINE = (220, 240, 228); OTHER = (255, 255, 255); RED = (179, 38, 30)
_fc = {}
def font(k, s):
    if (k, s) not in _fc: _fc[(k, s)] = ImageFont.truetype(FONTS[k], s)
    return _fc[(k, s)]
EF = ImageFont.truetype(EMOJI, 109)
_ec = {}
def emoji_img(ch, size):
    key = (ch, size)
    if key not in _ec:
        im = Image.new('RGBA', (136, 128), (0, 0, 0, 0)); ImageDraw.Draw(im).text((0, 0), ch, font=EF, embedded_color=True)
        bb = im.getbbox() or (0, 0, 1, 1); im = im.crop(bb); r = size / 109 * 1.05
        _ec[key] = im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))), Image.LANCZOS)
    return _ec[key]

def is_emoji(ch):
    o = ord(ch)
    return o in EMAP and (o >= 0x2190 or o in (0x23, 0x2A)) and o not in (0x20B9,) and not (0x30 <= o <= 0x39)

def runs(text, k):
    out = []
    for ch in text:
        if ch in '️‍': continue
        if is_emoji(ch): fk = 'emoji'
        else: fk = k if (ord(ch) in CMAP[k] or ch == ' ') else 'dv700'
        if out and out[-1][0] == fk and fk != 'emoji': out[-1][1] += ch
        else: out.append([fk, ch])
    return out

def text_w(text, k, s):
    w = 0
    for fk, t in runs(text, k):
        w += emoji_img(t, s).width + 4 if fk == 'emoji' else font(fk, s).getlength(t)
    return w

def draw_text(img, xy, text, k, s, fill):
    d = ImageDraw.Draw(img); x, y = xy
    for fk, t in runs(text, k):
        if fk == 'emoji':
            e = emoji_img(t, s)
            if len(fill) == 4 and fill[3] < 255:
                e = e.copy(); e.putalpha(e.getchannel('A').point(lambda v: v * fill[3] // 255))
            img.paste(e, (int(x), int(y + s * 0.12)), e); x += e.width + 4
        else:
            d.text((x, y), t, font=font(fk, s), fill=fill); x += font(fk, s).getlength(t)

def wrap(text, k, s, maxw):
    lines = []
    for para in text.split('\n'):
        cur = ''
        for wd in para.split(' '):
            t = (cur + ' ' + wd).strip()
            if text_w(t, k, s) <= maxw: cur = t
            else: lines.append(cur); cur = wd
        lines.append(cur)
    return lines

def centered(img, lines, k, s, cy, fill, lh=1.15):
    y = cy - len(lines) * s * lh / 2
    for ln in lines:
        draw_text(img, ((W - text_w(ln, k, s)) / 2, y), ln, k, s, fill); y += s * lh

ease = lambda t: t * t * (3 - 2 * t)

# ---------------- cards ----------------
def card(spec, n, bg=NAVY):
    out = []
    for i in range(n):
        im = Image.new('RGB', (W, H), bg)
        for text, k, s, col, a0, cy in spec:
            if i < a0: continue
            al = min(1, (i - a0 + 1) / 9)
            lay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            centered(lay, wrap(text, k, s, 920), k, s, cy + int(18 * (1 - al)), col + (int(255 * al),))
            im.paste(lay, (0, 0), lay)
        out.append(im)
    return out

# ---------------- chat ----------------
PEOPLE = {
    'Papa': ((27, 58, 92), 'P'), 'Mummy': ((176, 74, 96), 'M'), 'Meera': ((46, 128, 92), 'M'),
    'Mama ji': ((150, 100, 30), 'MJ'), 'Bunty': ((90, 80, 170), 'B'), 'Dadi': ((120, 90, 70), 'D'), 'Chacha': ((60, 110, 140), 'C'),
}
CHAT_TOP, CHAT_BOT = 250, 1800
BS, NS = 41, 29  # bubble text size, name size

def header(img, title, sub, meter=None, mt=1.0):
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, W, 220), fill=NAVY)
    d.ellipse((48, 70, 148, 170), fill=(46, 86, 128)); draw_text(img, (70, 92), '🏠', 'ns700', 46, (255, 255, 255))
    draw_text(img, (176, 72), title, 'ns700', 44, (255, 255, 255))
    draw_text(img, (176, 132), sub, 'ns400', 30, (190, 205, 222))
    if meter:
        label, frac, col = meter
        x0, y0, x1 = 660, 92, 1036
        draw_text(img, (x0, y0 - 6), label, 'ns700', 27, (255, 255, 255))
        d.rounded_rectangle((x0, y0 + 42, x1, y0 + 58), 8, fill=(46, 70, 100))
        d.rounded_rectangle((x0, y0 + 42, x0 + int((x1 - x0) * frac * mt), y0 + 58), 8, fill=col)

def bubble_size(m):
    maxw = 720
    lines = wrap(m['t'], 'ns400', BS, maxw) if m.get('t') else []
    tw = max([text_w(l, 'ns400', BS) for l in lines] + [0])
    nm = m['who'] != 'Meera'
    w = max(tw, text_w(m['who'], 'ns700', NS) + 40 if nm else 0, 200 if m.get('fwd') else 0) + 56
    h = 34 + (NS + 14 if nm else 0) + (38 if m.get('fwd') else 0) + len(lines) * int(BS * 1.32) + 18
    if m.get('img'): h += 250; w = max(w, 600)
    return int(w), int(h), lines

def draw_bubble(img, m, y, alpha=1.0, scale=1.0):
    w, h, lines = bubble_size(m)
    mine = m['who'] == 'Meera'
    col, ini = PEOPLE[m['who']]
    lay = Image.new('RGBA', (W, h + 20), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    x = W - 40 - w if mine else 140
    if not mine:
        d.ellipse((40, 4, 116, 80), fill=col); iw = font('ns700', 28).getlength(ini); d.text((78 - iw / 2, 23), ini, font=font('ns700', 28), fill=(255, 255, 255))
    d.rounded_rectangle((x, 0, x + w, h), 30, fill=(MINE if mine else OTHER) + (255,))
    if m.get('warn'): d.rounded_rectangle((x, 0, x + w, h), 30, outline=(232, 170, 160, 255), width=3)
    cy = 18
    if not mine:
        draw_text(lay, (x + 28, cy), m['who'], 'ns700', NS, col + (255,)); cy += NS + 14
    if m.get('fwd'):
        draw_text(lay, (x + 28, cy), '↪ Forwarded many times', 'ns400', 27, (120, 128, 140, 255)); cy += 38
    if m.get('img'):
        # a paper slip "photo"
        sx, sy = x + 28, cy + 6
        d.rounded_rectangle((sx, sy, sx + w - 56, sy + 226), 16, fill=(250, 246, 236, 255), outline=(220, 210, 190, 255), width=2)
        for i, (t, k, s, c) in enumerate(m['img']):
            draw_text(lay, (sx + 26, sy + 22 + i * 52), t, k, s, c + (255,))
        cy += 250
    for ln in lines:
        draw_text(lay, (x + 28, cy), ln, 'ns400', BS, NAVY + (255,)); cy += int(BS * 1.32)
    tm = m.get('time', '')
    if tm: draw_text(lay, (x + w - 28 - text_w(tm, 'ns400', 24), h - 36), tm, 'ns400', 24, (130, 138, 150, 255))
    if alpha < 1: lay.putalpha(lay.getchannel('A').point(lambda v: int(v * alpha)))
    if scale != 1:
        sw, sh = int(W * scale), int(lay.height * scale); s2 = lay.resize((sw, sh), Image.LANCZOS)
        ox = int((W - sw) * (1 if mine else 0)); img.paste(s2, (ox, int(y + (lay.height - sh) / 2)), s2)
    else: img.paste(lay, (0, int(y)), lay)
    return h

def draw_typing(img, who, y, t):
    col, ini = PEOPLE[who]; d = ImageDraw.Draw(img)
    mine = who == 'Meera'
    x = W - 40 - 170 if mine else 140
    if not mine:
        d.ellipse((40, y + 4, 116, y + 80), fill=col); iw = font('ns700', 28).getlength(ini); d.text((78 - iw / 2, y + 23), ini, font=font('ns700', 28), fill=(255, 255, 255))
    d.rounded_rectangle((x, y, x + 170, y + 84), 30, fill=MINE if mine else OTHER)
    for k in range(3):
        a = 0.35 + 0.65 * max(0, math.sin((t * 6 - k * 0.8)))
        c = tuple(int(150 + (1 - a) * 90) for _ in range(3)); r = 9
        d.ellipse((x + 46 + k * 34 - r, y + 42 - r, x + 46 + k * 34 + r, y + 42 + r), fill=c)

def chat_scene(title, sub, msgs, meter=None, prev=None, caption=None, tail=30):
    """msgs: list of dict(who, t, img, fwd, time, typing(sec), hold(sec), warn). prev: messages already on screen."""
    frames, pops = [], []
    shown = list(prev or [])
    def layout(items):
        hs = [bubble_size(m)[1] + 26 for m in items]
        return hs, sum(hs)
    scroll = 0
    def render(items, newest_alpha=1.0, newest_scale=1.0, typing=None, t=0.0, mt=1.0):
        im = Image.new('RGB', (W, H), CHATBG)
        hs, tot = layout(items)
        extra = 110 if typing else 0
        avail = CHAT_BOT - CHAT_TOP
        off = max(0, tot + extra - avail)
        y = CHAT_TOP - off
        for i, m in enumerate(items):
            last = i == len(items) - 1
            if y + hs[i] > CHAT_TOP - 200:
                draw_bubble(im, m, y, newest_alpha if last else 1.0, newest_scale if last else 1.0)
            y += hs[i]
        if typing: draw_typing(im, typing, y, t)
        header(im, title, sub, meter, mt)
        if caption:
            d = ImageDraw.Draw(im); d.rounded_rectangle((60, 1810, W - 60, 1890), 40, fill=NAVY)
            centered(im, [caption], 'ns700', 34, 1850, (255, 255, 255))
        return im
    for m in msgs:
        ty = m.get('typing', 0.6 if m['who'] != 'Meera' else 0.5)
        for i in range(int(ty * FPS)):
            frames.append(render(shown, typing=m['who'], t=i / FPS))
        pops.append(len(frames) / FPS)
        items = shown + [m]
        for i in range(7):
            a = ease((i + 1) / 7); frames.append(render(items, a, 0.94 + 0.06 * a))
        shown = items
        hold = m.get('hold', max(0.9, min(2.6, len(m.get('t', '')) / 26)))
        for i in range(int(hold * FPS)): frames.append(render(shown))
    for i in range(tail): frames.append(render(shown))
    return frames, pops, shown

# ---------------- phone (real app) ----------------
PX, PY, PW, PH, R = 150, 420, 780, 1400, 48
pmask = Image.new('L', (PW, PH), 0); ImageDraw.Draw(pmask).rounded_rectangle((0, 0, PW - 1, PH - 1), R, fill=255)
shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
ImageDraw.Draw(shadow).rounded_rectangle((PX - 4, PY + 14, PX + PW + 4, PY + PH + 18), R + 4, fill=(11, 31, 54, 70))
shadow = shadow.filter(ImageFilter.GaussianBlur(26))

def pbase(caption, kicker, cap_alpha=1.0):
    im = Image.new('RGB', (W, H), BG); im.paste(shadow, (0, 0), shadow)
    lay = Image.new('RGBA', (W, 420), (0, 0, 0, 0))
    if kicker: centered(lay, [kicker], 'ns700', 30, 120, (46, 128, 92, int(255 * cap_alpha)))
    centered(lay, wrap(caption, 'bg800', 62, 940), 'bg800', 62, 255, NAVY + (int(255 * cap_alpha),))
    im.paste(lay, (0, 0), lay)
    draw_text(im, ((W - text_w('saboot.org', 'ns700', 34)) / 2, 1850), 'saboot.org', 'ns700', 34, MUTED)
    return im

def phone(im, shot):
    im.paste(shot, (PX, PY), pmask)
    ImageDraw.Draw(im).rounded_rectangle((PX - 1, PY - 1, PX + PW, PY + PH), R, outline=(222, 214, 196), width=3)
    return im

def ripple(im, pt, t):
    if t < 0 or t > 1: return im
    x, y = PX + pt[0] * 2, PY + pt[1] * 2
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
    r = 34 + 50 * t; od.ellipse((x - r, y - r, x + r, y + r), fill=(27, 58, 92, int(120 * (1 - t))))
    if t < .6: od.ellipse((x - 22, y - 22, x + 22, y + 22), fill=(27, 58, 92, int(150 * (1 - t / .6))))
    im = im.convert('RGBA'); im.alpha_composite(ov); return im.convert('RGB')

def phone_scene(segs, kicker, fade=5):
    """segs: (caption, image or fn(i,n), nframes, tap, tapstart)"""
    frames = []; prev = None; total = 0; lastcap = None; capstart = 0
    for seg in segs:
        cap, img, n = seg[0], seg[1], seg[2]; tap = seg[3] if len(seg) > 3 else None; ts = seg[4] if len(seg) > 4 else 0
        if cap != lastcap: lastcap = cap; capstart = total
        for i in range(n):
            ph = img(i, n) if callable(img) else img
            if prev is not None and n > 2 and i < fade and not callable(img): ph = Image.blend(prev, ph, (i + 1) / (fade + 1))
            fr = phone(pbase(cap, kicker, min(1, (total - capstart + 1) / 8)), ph)
            if tap and i >= ts: fr = ripple(fr, tap, (i - ts) / 12)
            frames.append(fr); total += 1
        prev = img(n - 1, n) if callable(img) else img
    return frames

def end_card(next_line, n=120):
    mark = Image.open('/home/claude/er/build/mark.png').convert('RGBA').resize((180, 150), Image.LANCZOS)
    out = []
    for i in range(n):
        im = Image.new('RGB', (W, H), BG); lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); a = min(1, (i + 1) / 10)
        centered(lay, ['NEXT WEEK ON FAMILY GROUP'], 'ns700', 32, 420, (46, 128, 92, 255))
        centered(lay, wrap(next_line, 'bg800', 70, 900), 'bg800', 70, 600, NAVY + (255,))
        lay.paste(mark, ((W - 180) // 2, 900), mark)
        centered(lay, wrap('Walk into your lawyer’s office ready.', 'bg800', 60, 900), 'bg800', 60, 1160, NAVY + (255,))
        if i >= 16:
            b = min(1, (i - 15) / 8); d = ImageDraw.Draw(lay); bw, bh = 520, 116; x0 = (W - bw) // 2; y0 = 1330
            d.rounded_rectangle((x0, y0, x0 + bw, y0 + bh), 58, fill=NAVY2 + (int(255 * b),))
            draw_text(lay, ((W - text_w('saboot.org', 'bg800', 56)) / 2, y0 + 22), 'saboot.org', 'bg800', 56, CREAM + (int(255 * b),))
        if i >= 28:
            b = min(1, (i - 27) / 8); centered(lay, ['Free · No sign-up · 23 languages'], 'ns700', 38, 1530, MUTED + (int(255 * b),))
        if a < 1: lay.putalpha(lay.getchannel('A').point(lambda v: int(v * a)))
        im.paste(lay, (0, 0), lay); out.append(im)
    return out

# ---------------- encode ----------------
OUT = '/tmp/vid/out/'
os.makedirs(OUT, exist_ok=True)
def encode(path, frames):
    tmp = path + '.tmp.mp4'
    p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', str(FPS), tmp], stdin=subprocess.PIPE)
    for f in frames: p.stdin.write(f.tobytes())
    p.stdin.close()
    if p.wait() != 0: raise SystemExit('ffmpeg failed ' + path)
    os.replace(tmp, path)

def pop_track(times, dur, out):
    import numpy as np, wave
    sr = 44100; buf = np.zeros(int(sr * (dur + 0.5)), dtype=np.float32)
    tt = np.arange(int(sr * 0.12)) / sr
    pop = 0.22 * np.sin(2 * np.pi * (660 + 520 * tt / 0.09) * tt) * np.exp(-38 * tt)
    for t in times:
        i = int(t * sr); seg = buf[i:i + len(pop)]; seg += pop[:len(seg)]
    pcm = (np.clip(buf, -1, 1) * 32767).astype('<i2')
    wav = out + '.wav'
    with wave.open(wav, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm.tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-c:a', 'aac', '-b:a', '96k', out], check=True)
