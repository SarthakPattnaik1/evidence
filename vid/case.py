"""Case study: Vidyut & Anjali — 3 vertical episodes (1080x1920, 30 fps)."""
import sys, os, math, subprocess
sys.path.insert(0, '/tmp/vid')
from episode import font, draw_text, wrap, text_w, encode, NAVY, GOLD, CREAM, MUTED
from PIL import Image, ImageDraw, ImageFilter

W, H, FPS = 1080, 1920, 30
CAST = '/home/claude/cast/out/'
OUT = '/tmp/vid/out/'
INK = (19, 35, 58)
SCENE_Y0, SCENE_Y1 = 330, 1330
_cache = {}

def ch(key, expr, h):
    k = (key, expr, h)
    if k not in _cache:
        im = Image.open(f'{CAST}{key}_{expr}.png').convert('RGBA')
        bb = im.getbbox(); im = im.crop(bb)
        r = h / im.height; _cache[k] = im.resize((int(im.width * r), h), Image.LANCZOS)
    return _cache[k]

def ease(t): t = max(0, min(1, t)); return t * t * (3 - 2 * t)

# ---------------------------------------------------------------- backgrounds (drawn once, cached)
def bg_home(warm=False):
    im = Image.new('RGB', (W, SCENE_Y1 - SCENE_Y0), (244, 233, 214) if warm else (236, 230, 220)); d = ImageDraw.Draw(im)
    d.rectangle([0, 780, W, 1000], fill=(205, 176, 140) if warm else (196, 178, 152))
    d.rounded_rectangle([110, 120, 400, 420], 14, fill=(170, 205, 226)); d.line([255, 120, 255, 420], fill=(236, 230, 220), width=10); d.line([110, 270, 400, 270], fill=(236, 230, 220), width=10)
    d.rounded_rectangle([640, 150, 900, 340], 10, fill=(150, 112, 80)); d.rounded_rectangle([656, 166, 884, 324], 6, fill=(250, 238, 222))
    d.ellipse([720, 205, 770, 255], fill=(200, 140, 110)); d.ellipse([776, 205, 826, 255], fill=(210, 150, 120))
    d.rounded_rectangle([60, 600, 1020, 800], 40, fill=(160, 92, 70) if warm else (122, 108, 120)); d.rounded_rectangle([90, 540, 990, 660], 40, fill=(178, 106, 82) if warm else (138, 124, 136))
    if warm:
        for i in range(5): d.ellipse([880 + i * 20, 60, 940 + i * 20, 120], fill=(255, 220, 160))
    return im

def bg_split():
    im = Image.new('RGB', (W, SCENE_Y1 - SCENE_Y0), (236, 230, 220)); d = ImageDraw.Draw(im)
    d.rectangle([W // 2, 0, W, 1000], fill=(226, 232, 238))
    d.rectangle([0, 800, W // 2, 1000], fill=(196, 178, 152)); d.rectangle([W // 2, 800, W, 1000], fill=(178, 186, 196))
    d.rectangle([W // 2 - 6, 0, W // 2 + 6, 1000], fill=(255, 255, 255))
    d.rounded_rectangle([700, 140, 900, 520], 12, fill=(138, 98, 72)); d.ellipse([862, 330, 878, 346], fill=(230, 196, 120))
    f = font('ns700', 32)
    for x, t in ((W // 4, "Vidyut's home"), (3 * W // 4, "Her parents' home")):
        tw = text_w(t, 'ns700', 32); d.rounded_rectangle([x - tw // 2 - 22, 40, x + tw // 2 + 22, 100], 30, fill=(255, 255, 255)); draw_text(im, (x - tw // 2, 50), t, 'ns700', 32, INK)
    return im

def bg_court():
    im = Image.new('RGB', (W, SCENE_Y1 - SCENE_Y0), (226, 214, 196)); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 90], fill=(120, 82, 56))
    t = 'FAMILY COURT'; tw = text_w(t, 'ns700', 36); d.rounded_rectangle([540 - tw // 2 - 26, 108, 540 + tw // 2 + 26, 168], 10, fill=(255, 250, 240)); draw_text(im, (540 - tw // 2, 118), t, 'ns700', 36, INK)
    d.rectangle([0, 800, W, 1000], fill=(170, 130, 96))
    return im

def bg_mediation():
    im = Image.new('RGB', (W, SCENE_Y1 - SCENE_Y0), (228, 236, 230)); d = ImageDraw.Draw(im)
    d.rectangle([0, 800, W, 1000], fill=(186, 196, 182))
    d.rounded_rectangle([70, 100, 330, 360], 14, fill=(190, 216, 228)); d.line([200, 100, 200, 360], fill=(228, 236, 230), width=10)
    d.ellipse([860, 520, 1000, 640], fill=(70, 140, 100)); d.ellipse([890, 460, 980, 560], fill=(86, 160, 116)); d.rounded_rectangle([890, 620, 970, 740], 10, fill=(176, 110, 70))
    t = 'MEDIATION CENTRE'; tw = text_w(t, 'ns700', 34); d.rounded_rectangle([540 - tw // 2 - 26, 60, 540 + tw // 2 + 26, 120], 10, fill=(255, 255, 255)); draw_text(im, (540 - tw // 2, 70), t, 'ns700', 34, (31, 94, 82))
    return im

BGS = {}
def bg(name):
    if name not in BGS: BGS[name] = {'home': bg_home, 'warm': lambda: bg_home(True), 'split': bg_split, 'court': bg_court, 'mediation': bg_mediation}[name]()
    return BGS[name]

def bench(im):
    d = ImageDraw.Draw(im); y = SCENE_Y0
    d.rectangle([230, y + 470, 850, y + 800], fill=(120, 82, 56)); d.rectangle([230, y + 470, 850, y + 500], fill=(146, 104, 72))
    g = (226, 186, 110); cx, cy = 540, y + 560
    d.line([cx, cy, cx, cy + 120], fill=g, width=7); d.rectangle([cx - 34, cy + 116, cx + 34, cy + 126], fill=g)
    d.line([cx - 70, cy + 18, cx + 70, cy + 18], fill=g, width=7); d.ellipse([cx - 9, cy - 9, cx + 9, cy + 9], fill=g)
    for sx in (-70, 70):
        d.line([cx + sx, cy + 18, cx + sx - 22, cy + 70], fill=g, width=3); d.line([cx + sx, cy + 18, cx + sx + 22, cy + 70], fill=g, width=3)
        d.chord([cx + sx - 30, cy + 50, cx + sx + 30, cy + 92], 0, 180, fill=g)

def table(im, alpha=1.0):
    d = ImageDraw.Draw(im); y = SCENE_Y0
    d.ellipse([230, y + 780, 850, y + 900], fill=(150, 104, 70)); d.ellipse([230, y + 760, 850, y + 870], fill=(176, 124, 84))

# ---------------------------------------------------------------- frame parts
def header(im, part, title):
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, SCENE_Y0], fill=NAVY)
    draw_text(im, (64, 92), f'PART {part} OF 3', 'ns700', 32, GOLD)
    draw_text(im, (64, 140), 'Vidyut & Anjali', 'bg800', 76, CREAM)
    draw_text(im, (64, 238), title, 'ns400', 40, (200, 210, 224))

def footer(im):
    d = ImageDraw.Draw(im)
    d.rectangle([0, 1760, W, H], fill=(245, 240, 232))
    t = 'A fictional story · general legal information, not legal advice'
    tw = text_w(t, 'ns400', 26); draw_text(im, ((W - tw) // 2, 1800), t, 'ns400', 26, MUTED)
    t2 = 'saboot.org'; tw2 = text_w(t2, 'ns700', 34); draw_text(im, ((W - tw2) // 2, 1846), t2, 'ns700', 34, INK)

def caption(im, text, a):
    if not text or a <= 0: return
    lines = wrap(text, 'ns700', 50, W - 180)
    lh = 66; hgt = len(lines) * lh + 70; y0 = 1330 + (430 - hgt) // 2
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    d.rounded_rectangle([50, y0, W - 50, y0 + hgt], 34, fill=(255, 255, 255, int(255 * a)))
    yy = y0 + 35
    for ln in lines:
        draw_text(layer, (90, yy), ln, 'ns700', 50, INK + (int(255 * a),)); yy += lh
    im.paste(layer, (0, 0), layer)

def place(im, img, cx, base_y, a=1.0, dx=0):
    x = int(cx - img.width / 2 + dx); y = int(base_y - img.height)
    if a < 1:
        img = img.copy(); al = img.split()[3].point(lambda v: int(v * a)); img.putalpha(al)
    im.paste(img, (x, y), img)

def icon_doc(im, x, y, a=1.0, label='DIVORCE PETITION'):
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer); A = int(255 * a)
    d.rounded_rectangle([x, y, x + 210, y + 270], 14, fill=(255, 255, 255, A), outline=(19, 35, 58, A), width=5)
    for i in range(5): d.rounded_rectangle([x + 28, y + 90 + i * 30, x + 182 - (i % 2) * 40, y + 102 + i * 30], 6, fill=(190, 198, 210, A))
    d.rounded_rectangle([x + 18, y + 22, x + 192, y + 70], 8, fill=(179, 38, 30, A))
    tw = text_w(label, 'ns700', 20); draw_text(layer, (x + 105 - tw // 2, y + 34), label, 'ns700', 20, (255, 255, 255, A))
    im.paste(layer, (0, 0), layer)

def heart(im, cx, cy, s, col, a=1.0, broken=False):
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer); A = int(255 * a); c = col + (A,)
    d.ellipse([cx - s, cy - s * .6, cx, cy + s * .4], fill=c); d.ellipse([cx, cy - s * .6, cx + s, cy + s * .4], fill=c)
    d.polygon([(cx - s * .97, cy - s * .02), (cx + s * .97, cy - s * .02), (cx, cy + s * 1.1)], fill=c)
    if broken: d.line([(cx, cy - s * .45), (cx - s * .2, cy), (cx + s * .15, cy + s * .3), (cx, cy + s * 1.05)], fill=(255, 255, 255, A), width=int(s * .14))
    im.paste(layer, (0, 0), layer)

# ---------------------------------------------------------------- beats
def beat(part, title, spec, n=165):
    """spec: bg, cast [(key, expr, cx, h, enter_dx, expr2)], cap, props fn"""
    frames = []
    base = Image.new('RGB', (W, H), CREAM); header(base, part, title); footer(base)
    for i in range(n):
        im = base.copy(); im.paste(bg(spec['bg']), (0, SCENE_Y0))
        if spec.get('table'): pass
        t_in = ease(i / 14)
        for c in spec['cast']:
            key, expr, cx, hh = c[:4]; dx0 = c[4] if len(c) > 4 else 0; ex2 = c[5] if len(c) > 5 else None
            e = ex2 if (ex2 and i > n * 0.5) else expr
            img = ch(key, e, hh)
            bob = math.sin((i + cx) / 18) * 3
            if key == 'judge':
                place(im, img, cx, SCENE_Y0 + 690, a=t_in); bench(im); continue
            place(im, img, cx, SCENE_Y0 + 960 + bob, a=t_in, dx=dx0 * (1 - t_in))
        if spec.get('table'): table(im)
        if spec.get('props'): spec['props'](im, i, n)
        caption(im, spec['cap'], ease((i - 6) / 12))
        frames.append(im)
    return frames

def card_frames(part, title, kicker, head, body, n=200, chip=None, dark=True, cta=None, fig=None):
    frames = []
    bgc = NAVY if dark else (250, 246, 238); fg = CREAM if dark else INK; sub = (205, 214, 226) if dark else (52, 64, 82)
    for i in range(n):
        im = Image.new('RGB', (W, H), bgc)
        a1 = ease(i / 12); a2 = ease((i - 10) / 14); a3 = ease((i - 22) / 14)
        y = 330
        layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        draw_text(layer, (80, y), kicker, 'ns700', 34, GOLD + (int(255 * a1),)); y += 70
        if chip:
            tw = text_w(chip, 'ns700', 34); d = ImageDraw.Draw(layer)
            d.rounded_rectangle([80, y, 80 + tw + 48, y + 66], 33, fill=(GOLD[0], GOLD[1], GOLD[2], int(255 * a1)))
            draw_text(layer, (104, y + 12), chip, 'ns700', 34, NAVY + (int(255 * a1),)); y += 110
        for ln in wrap(head, 'bg800', 74, W - 160):
            draw_text(layer, (80, y), ln, 'bg800', 74, fg + (int(255 * a2),)); y += 90
        y += 30
        for para in body:
            bullet = para.startswith('• ')
            txt = para[2:] if bullet else para
            for j, ln in enumerate(wrap(txt, 'ns400', 46, W - 160 - (44 if bullet else 0))):
                if bullet and j == 0: draw_text(layer, (80, y), '•', 'ns700', 46, GOLD + (int(255 * a3),))
                draw_text(layer, (80 + (44 if bullet else 0), y), ln, 'ns400', 46, sub + (int(255 * a3),)); y += 64
            y += 24
        if cta:
            a4 = ease((i - 40) / 14); tw = text_w(cta, 'ns700', 44); d = ImageDraw.Draw(layer)
            d.rounded_rectangle([80, 1560, 80 + tw + 110, 1660], 50, fill=(GOLD[0], GOLD[1], GOLD[2], int(255 * a4)))
            draw_text(layer, (115, 1582), cta, 'ns700', 44, NAVY + (int(255 * a4),))
            tx = 115 + tw + 14; d.polygon([(tx, 1592), (tx, 1628), (tx + 26, 1610)], fill=NAVY + (int(255 * a4),))
        im.paste(layer, (0, 0), layer)
        for f in (fig or []):
            place(im, ch(f[0], f[1], f[3]), f[2], 1760, a=ease((i - 20) / 14))
        d = ImageDraw.Draw(im)
        t = 'A fictional story · general legal information, not legal advice'; tw = text_w(t, 'ns400', 26)
        draw_text(im, ((W - tw) // 2, 1830), t, 'ns400', 26, (150, 165, 186) if dark else MUTED)
        frames.append(im)
    return frames

def title_frames(part, sub, n=105):
    frames = []
    for i in range(n):
        im = Image.new('RGB', (W, H), NAVY)
        a = ease(i / 12); b = ease((i - 10) / 14); c = ease((i - 22) / 14)
        layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        draw_text(layer, (80, 520), f'PART {part} OF 3', 'ns700', 36, GOLD + (int(255 * a),))
        draw_text(layer, (80, 600), 'Vidyut & Anjali', 'bg800', 104, CREAM + (int(255 * b),))
        y = 760
        for ln in wrap('Can their marriage be saved?', 'bg800', 70, W - 160):
            draw_text(layer, (80, y), ln, 'bg800', 70, (233, 196, 120, int(255 * b))); y += 86
        y += 40
        draw_text(layer, (80, y), sub, 'ns400', 48, (205, 214, 226, int(255 * c)))
        im.paste(layer, (0, 0), layer)
        # two figures facing apart / together depending on part
        if part == 3:
            place(im, ch('vidyut', 'happy', 560), 400, 1720, a=c); place(im, ch('anjali', 'happy', 540), 650, 1720, a=c)
        else:
            place(im, ch('vidyut', 'worried', 560), 300, 1720, a=c); place(im, ch('anjali', 'worried', 540), 780, 1720, a=c)
            if c > 0: heart(im, 540, 1300, 70, (232, 112, 112), a=c, broken=True)
        frames.append(im)
    return frames

def end_frames(line, nxt=None, n=150):
    frames = []
    for i in range(n):
        im = Image.new('RGB', (W, H), (250, 246, 238)); a = ease(i / 12); b = ease((i - 14) / 14)
        layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); y = 560
        for ln in wrap(line, 'bg800', 66, W - 160):
            draw_text(layer, (80, y), ln, 'bg800', 66, INK + (int(255 * a),)); y += 84
        y += 50
        draw_text(layer, (80, y), 'saboot.org', 'bg800', 92, (179, 120, 30, int(255 * b))); y += 120
        draw_text(layer, (80, y), 'Free. Anonymous. In 22 Indian languages.', 'ns400', 42, (52, 64, 82, int(255 * b)))
        if nxt:
            c = ease((i - 30) / 14); d = ImageDraw.Draw(layer)
            d.rounded_rectangle([80, 1440, W - 80, 1600], 30, fill=(11, 31, 54, int(255 * c)))
            draw_text(layer, (120, 1468), 'NEXT', 'ns700', 30, GOLD + (int(255 * c),))
            draw_text(layer, (120, 1512), nxt, 'ns700', 44, CREAM + (int(255 * c),))
        im.paste(layer, (0, 0), layer)
        t = 'General legal information, not legal advice. Talk to an advocate about your case.'; tw = text_w(t, 'ns400', 26)
        draw_text(im, ((W - tw) // 2, 1830), t, 'ns400', 26, MUTED)
        frames.append(im)
    return frames

# ---------------------------------------------------------------- scripts
def petition_prop(im, i, n): icon_doc(im, 760, SCENE_Y0 + 230, a=ease((i - 20) / 12))
def heart_prop(im, i, n): heart(im, 540, SCENE_Y0 + 200, 70 + 6 * math.sin(i / 6), (226, 92, 92), a=ease((i - 14) / 12))
def ring_prop(im, i, n): heart(im, 540, SCENE_Y0 + 150, 60, (226, 92, 92), a=ease((i - 10) / 12))
def broken_prop(im, i, n): heart(im, 540, SCENE_Y0 + 150, 60, (190, 120, 120), a=ease((i - 10) / 12), broken=True)
def hearts_up(im, i, n):
    for k in range(4):
        t = ((i + k * 40) % 160) / 160; heart(im, 380 + k * 100, SCENE_Y0 + 520 - t * 420, 26, (232, 100, 110), a=max(0, 1 - t) * ease((i - 10) / 10))

H_FULL = 640
PARTS = {
 1: dict(title='Part 1 · The conflict', sub='The conflict', nxt='Part 2 · The legal remedy', seq=[
   ('beat', dict(bg='warm', cast=[('vidyut', 'happy', 400, H_FULL, -200), ('anjali', 'happy', 660, H_FULL - 20, 200)], cap='Vidyut and Anjali got married in December 2025.', props=ring_prop)),
   ('beat', dict(bg='home', cast=[('vidyut', 'worried', 300, H_FULL), ('anjali', 'worried', 790, H_FULL - 20)], cap='Interference from outside, and growing differences, pulled them apart.', props=broken_prop)),
   ('beat', dict(bg='split', cast=[('vidyut', 'worried', 270, H_FULL), ('anjali', 'worried', 810, H_FULL - 20, 260)], cap='Anjali went back to her parents’ home.')),
   ('beat', dict(bg='split', cast=[('vidyut', 'shocked', 270, H_FULL), ('anjali', 'neutral', 690, H_FULL - 20)], cap='Then she filed a petition for divorce.', props=petition_prop)),
   ('beat', dict(bg='home', cast=[('vidyut', 'worried', 540, H_FULL)], cap='But Vidyut still loves Anjali. He wants to save their marriage.', props=heart_prop)),
   ('card', dict(kicker='DID YOU KNOW?', chip='Section 14 · Hindu Marriage Act', head='Divorce in the first year needs the court’s permission.', body=['A divorce petition cannot normally be filed within one year of marriage.', 'The court allows it early only for exceptional hardship or exceptional depravity.'], n=260)),
   ('card', dict(kicker='THE QUESTION', head='What legal options does Vidyut have?', body=['He doesn’t want a divorce. He wants his wife back.'], cta='Watch Part 2', fig=[('vidyut', 'worried', 820, 560)], n=170)),
 ]),
 2: dict(title='Part 2 · The legal remedy', sub='The legal remedy', nxt='Part 3 · Mediation and reconciliation', seq=[
   ('beat', dict(bg='home', cast=[('vidyut', 'worried', 540, H_FULL)], cap='Vidyut does not want his marriage to end.', props=heart_prop)),
   ('beat', dict(bg='court', cast=[('judge', 'neutral', 540, 470), ('vidyut', 'neutral', 250, H_FULL, -220)], cap='He goes to the Family Court and asks for restitution of conjugal rights.')),
   ('card', dict(kicker='THE LAW', chip='Section 9 · Hindu Marriage Act', head='Restitution of conjugal rights', body=['If one spouse leaves the other without a reasonable excuse, the court can order that married life be restored.', 'The spouse who left has to show the reasonable excuse.', '(This assumes both are Hindus, so the Act applies.)'], n=300)),
   ('card', dict(kicker='BUT KNOW THIS', head='A court order cannot rebuild a marriage.', body=['• No court can force anyone to live together.', '• If the order is not followed for a year, either spouse can ask for divorce (Section 13(1A)(ii)).', '• The Supreme Court is still examining whether this remedy is valid.'], n=330, dark=False)),
   ('beat', dict(bg='court', cast=[('judge', 'neutral', 540, 470), ('vidyut', 'neutral', 230, H_FULL), ('anjali', 'neutral', 850, H_FULL - 20, 220)], cap='Before deciding anything, the court must first try to bring them together.')),
   ('card', dict(kicker='THE COURT’S DUTY', chip='Sec 23(2) HMA · Sec 9 Family Courts Act', head='Reconciliation comes first.', body=['Family Courts must, in the first instance, try to settle the dispute or reconcile the couple — often through counselling or mediation.'], n=240)),
   ('card', dict(kicker='THE QUESTION', head='Can a court case actually help them reconcile?', body=[], cta='Watch Part 3', fig=[('vidyut', 'worried', 700, 520), ('anjali', 'worried', 900, 500)], n=150)),
 ]),
 3: dict(title='Part 3 · Mediation', sub='Mediation and reconciliation', nxt=None, seq=[
   ('beat', dict(bg='mediation', cast=[('mediator', 'neutral', 540, 600), ('vidyut', 'worried', 210, H_FULL, -200), ('anjali', 'worried', 870, H_FULL - 20, 200)], cap='The court refers Vidyut and Anjali to mediation.', table=True)),
   ('beat', dict(bg='mediation', cast=[('mediator', 'happy', 540, 600), ('vidyut', 'neutral', 230, H_FULL), ('anjali', 'neutral', 850, H_FULL - 20)], cap='A trained mediator helps them talk — not to decide who is right, but to listen.', table=True)),
   ('beat', dict(bg='mediation', cast=[('mediator', 'neutral', 540, 600), ('vidyut', 'neutral', 260, H_FULL, 0, 'happy'), ('anjali', 'worried', 820, H_FULL - 20, 0, 'neutral')], cap='What is said there stays confidential. Nobody can be forced to agree.', table=True)),
   ('beat', dict(bg='warm', cast=[('vidyut', 'happy', 430, H_FULL, -120), ('anjali', 'happy', 650, H_FULL - 20, 120)], cap='They resolve their differences and choose to live together again.', props=hearts_up)),
   ('card', dict(kicker='THE LEGAL LEARNING', head='Matrimonial law is not only about divorce.', body=['Counselling, mediation and the court’s duty to attempt reconciliation can help a couple find their way back —', 'while respecting the rights, dignity and choice of both.'], n=270)),
   ('card', dict(kicker='SAFETY FIRST', head='Reconciliation only where both are willing — and it is safe.', body=['If there is violence or threats, safety comes first.', 'Women’s helpline 181 · Emergency 112.'], n=230, dark=False)),
 ]),
}
END = 'Understand your rights. Explore your legal options. Make informed decisions about your matrimonial future.'

def build(p, mode='full'):
    P = PARTS[p]; parts = []
    segs = [('title', None)] + P['seq'] + [('end', None)]
    for idx, (kind, sp) in enumerate(segs):
        if kind == 'title': fr = title_frames(p, P['sub'])
        elif kind == 'beat': fr = beat(p, P['title'], sp)
        elif kind == 'card': fr = card_frames(p, P['title'], sp['kicker'], sp['head'], sp['body'], n=sp.get('n', 200), chip=sp.get('chip'), dark=sp.get('dark', True), cta=sp.get('cta'), fig=sp.get('fig'))
        else: fr = end_frames(END, P['nxt'])
        if mode == 'stills':
            fr[min(len(fr) - 1, 75)].resize((360, 640)).save(f'/tmp/vid/cs{p}_{idx:02d}.jpg', quality=85)
        else:
            path = f'{OUT}case{p}_{idx:02d}.mp4'; encode(path, fr); parts.append(path)
        del fr
    if mode == 'stills': return
    lst = f'{OUT}case{p}.txt'; open(lst, 'w').write(''.join(f"file '{x}'\n" for x in parts))
    final = f'{OUT}vidyut-anjali-part{p}.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-c:v', 'copy', '-c:a', 'aac', '-shortest', '-movflags', '+faststart', final], check=True)
    print('done', final)

if __name__ == '__main__':
    build(int(sys.argv[1]), sys.argv[2] if len(sys.argv) > 2 else 'full')
