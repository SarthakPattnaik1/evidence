"""Justice Through Stories — Lokesh's pension (3 parts). Uses the same studio as Vidyut & Anjali."""
import sys, math
sys.path.insert(0, '/tmp/vid')
import film as F
import case as CS
from film import W, H, TOP, BOT, SH, GROUND, INK, ease, text_w, draw_text, wrap, render, _room
from episode import NAVY, GOLD, CREAM, MUTED
from PIL import Image, ImageDraw

F.HEADER = 'JUSTICE THROUGH STORIES · LOKESH'; F.NARRATOR = 'lawyer'; F.SLUG = 'lokesh-pension'

# ---------------------------------------------------------------- sets
def set_office():
    im, d = _room((214, 226, 210), (168, 164, 150))
    d.rectangle([0, 0, W, 90], fill=(190, 200, 186))
    d.ellipse([480, 60, 600, 100], fill=(90, 90, 96)); d.rectangle([536, 0, 544, 70], fill=(90, 90, 96))
    d.polygon([(400, 76), (480, 72), (480, 86)], fill=(120, 120, 128)); d.polygon([(680, 76), (600, 72), (600, 86)], fill=(120, 120, 128))
    t = 'PENSION SECTION'; tw = text_w(t, 'ns700', 36); d.rounded_rectangle([700 - tw // 2 - 26, 200, 700 + tw // 2 + 26, 262], 8, fill=(40, 70, 50)); draw_text(im, (700 - tw // 2, 210), t, 'ns700', 36, (255, 255, 240))
    for k in range(6): d.rectangle([880, 420 + k * 70, 1040, 470 + k * 70], fill=[(222, 196, 140), (200, 170, 120), (236, 214, 160)][k % 3])
    for k in range(5): d.rectangle([60, 460 + k * 60, 200, 500 + k * 60], fill=[(236, 214, 160), (210, 180, 130)][k % 2])
    return im

def fg_counter(img, oy):
    d = ImageDraw.Draw(img)
    d.rectangle([470, oy + 960, W, oy + GROUND - 110], fill=(120, 96, 70)); d.rectangle([470, oy + 960, W, oy + 990], fill=(146, 118, 86))
    glass = Image.new('RGBA', (W - 490, 420), (210, 236, 246, 70)); img.paste(glass, (490, oy + 545), glass)
    d.rectangle([486, oy + 540, 494, oy + 965], fill=(150, 150, 150)); d.rectangle([486, oy + 540, W, oy + 548], fill=(150, 150, 150))
    d.rounded_rectangle([600, oy + 900, 760, oy + 965], 8, fill=(30, 30, 30)); t = 'WINDOW 3'; tw = text_w(t, 'ns700', 24); draw_text(img, (680 - tw // 2, oy + 916), t, 'ns700', 24, (255, 255, 255))

def set_dlsa():
    im, d = _room((234, 228, 214), (160, 132, 104))
    t1 = 'DISTRICT LEGAL SERVICES AUTHORITY'; tw = text_w(t1, 'ns700', 32); d.rounded_rectangle([540 - tw // 2 - 26, 190, 540 + tw // 2 + 26, 248], 8, fill=(18, 52, 92)); draw_text(im, (540 - tw // 2, 199), t1, 'ns700', 32, (255, 255, 255))
    d.rounded_rectangle([60, 330, 380, 720], 14, fill=(255, 250, 236)); d.rectangle([60, 330, 380, 400], fill=(196, 72, 48))
    draw_text(im, (86, 346), 'FREE LEGAL AID', 'ns700', 30, (255, 255, 255))
    for k, ln in enumerate(['Women · Children', 'SC / ST', 'Persons with disability', 'Low income']): draw_text(im, (86, 420 + k * 52), ln, 'ns700', 27, INK)
    draw_text(im, (86, 640), 'Helpline 15100', 'ns700', 34, (196, 72, 48))
    return im

def set_tribunal():
    im = F.set_court(); d = ImageDraw.Draw(im)
    d.rectangle([140, 196, 940, 270], fill=(226, 214, 196))
    t = 'CENTRAL ADMINISTRATIVE TRIBUNAL'; tw = text_w(t, 'ns700', 34); d.rounded_rectangle([540 - tw // 2 - 24, 200, 540 + tw // 2 + 24, 262], 10, fill=(255, 250, 240)); draw_text(im, (540 - tw // 2, 209), t, 'ns700', 34, INK)
    return im

F.EXTRA_SETS.update({'office': set_office, 'dlsa': set_dlsa, 'tribunal': set_tribunal})
F.FG['counter'] = fg_counter

def sms_fx(img, dt):
    a = ease(dt / 0.4) * (1 - ease((dt - 3.4) / 0.4))
    if a <= 0: return
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer); A = int(255 * a)
    x, y = 590, TOP + 330 + int((1 - ease(dt / 0.4)) * 60)
    d.rounded_rectangle([x, y, x + 420, y + 250], 28, fill=(20, 24, 32, A))
    d.rounded_rectangle([x + 20, y + 22, x + 400, y + 228], 20, fill=(245, 248, 250, A))
    draw_text(layer, (x + 44, y + 40), 'BANK · just now', 'ns700', 24, (110, 118, 130, A))
    for k, ln in enumerate(['Pension arrears + interest', 'credited to your account.']): draw_text(layer, (x + 44, y + 84 + k * 44), ln, 'ns700', 32, (19, 35, 58, A))
    img.paste(layer, (0, 0), layer)

def hearts(img, dt): F.hearts_fx(img, dt)

# ---------------------------------------------------------------- title card
def title_frames(part, sub, n=72):
    frames = []
    for i in range(n):
        im = Image.new('RGB', (W, H), NAVY); a = ease(i / 10); b = ease((i - 8) / 12); c = ease((i - 18) / 12)
        layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        draw_text(layer, (80, 470), 'JUSTICE THROUGH STORIES', 'ns700', 36, GOLD + (int(255 * a),))
        draw_text(layer, (80, 540), f'Part {part} of 3', 'ns400', 40, (205, 214, 226, int(255 * a)))
        draw_text(layer, (80, 620), 'Lokesh’s Pension', 'bg800', 100, CREAM + (int(255 * b),))
        y = 760
        for ln in wrap('30 years of service. Not a rupee of pension.', 'bg800', 58, W - 160):
            draw_text(layer, (80, y), ln, 'bg800', 58, (233, 196, 120, int(255 * b))); y += 74
        draw_text(layer, (80, y + 30), sub, 'ns400', 46, (205, 214, 226, int(255 * c)))
        im.paste(layer, (0, 0), layer)
        r = render('lokesh', 'happy' if part == 3 else 'worried', 0, False, 0, 'idle', 'paper' if part == 2 else None, 900, 0)
        rr = r.copy(); rr.putalpha(rr.split()[3].point(lambda q: int(q * c))); im.paste(rr, (int(540 - r.width / 2), int(1880 - r.height)), rr)
        frames.append(im)
    return frames
F.TITLE_FN = title_frames

# ---------------------------------------------------------------- the three parts
TI = {1: 'Part 1 · The problem', 2: 'Part 2 · The legal remedy', 3: 'Part 3 · Justice delivered'}
LK = dict(x=290, expr='worried')
F.COLD = {
 1: dict(set='office', title=TI[1], chip='', music='tense', counter=True, zoom=1.2, tail=0.3,
         cast={'lokesh': dict(LK), 'clerk': dict(x=800, expr='neutral', base=1300, h=1000)},
         beats=[('say', 'clerk', 'Pension? Agle mahine aana, babuji.', {}), ('say', 'lokesh', 'Aath mahine se yahi sun raha hoon.', {'pose': 'open'})]),
 2: dict(set='dlsa', title=TI[2], chip='', music='hopeful', desk=True, plate='FREE LEGAL AID', zoom=1.2, tail=0.3,
         cast={'lokesh': dict(x=270, expr='worried'), 'officer': dict(x=800, expr='happy')},
         beats=[('say', 'officer', 'Aapse vakeel ki ek paisa fees nahi li jaayegi.', {'pose': 'gesture'}), ('say', 'lokesh', 'Sach mein?', {'expr': 'shocked'})]),
 3: dict(set='tribunal', title=TI[3], chip='', music='neutral', zoom=1.2, tail=0.3,
         cast={'judge': dict(x=540, expr='neutral', base=1090, h=820), 'lawyer': dict(x=185, expr='neutral', h=980), 'lokesh': dict(x=895, expr='worried', h=980)},
         beats=[('sfx', 'gavel'), ('wait', 0.6), ('say', 'judge', 'Pension bina kisi kanooni wajah ke roki gayi hai.', {})]),
}
F.FILMS = {
 1: dict(sub='The problem', nxt='Part 2 · The legal remedy', scenes=[
   dict(set='warm', title=TI[1], chip='Retirement day · 30 years of service', music='warm',
        cast={'lokesh': dict(x=420, expr='happy'), 'sushma': dict(x=690, expr='happy')},
        beats=[('fx', hearts), ('say', 'sushma', 'Tees saal ki naukri poori! Ab aaram kariye.', {'tilt': -4}), ('say', 'lokesh', 'Haan… ab pension se ghar araam se chalega.', {'pose': 'gesture'}), ('wait', 0.6)]),
   dict(set='office', title=TI[1], chip='Three months later', music='tense', counter=True,
        cast={'lokesh': dict(x=290, expr='neutral'), 'clerk': dict(x=800, expr='neutral', base=1300, h=1000)},
        beats=[('say', 'lokesh', 'Meri pension abhi tak shuru nahi hui.', {}), ('say', 'clerk', 'File upar gayi hui hai. Agle mahine aana.', {'pose': 'gesture'}),
               ('say', 'lokesh', 'Main teen baar likh kar de chuka hoon.', {'expr': 'worried', 'pose': 'open', 'prop': None}, {'clerk': {'pose': 'idle'}}),
               ('say', 'clerk', 'Hum kya karein, babuji? System hai.', {'pose': 'open'}), ('set', 'lokesh', {'pose': 'idle'}), ('wait', 0.5)]),
   dict(set='night', title=TI[1], chip='Eight months without pension', music='sad',
        cast={'lokesh': dict(x=330, expr='worried'), 'sushma': dict(x=750, expr='worried')},
        beats=[('say', 'sushma', 'Dawaai ke paise bhi khatam ho gaye.', {'tilt': 4}), ('say', 'lokesh', 'Vakeel ki fees kahan se laaun, Sushma?', {'pose': 'open'}),
               ('set', 'lokesh', {'pose': 'cover', 'tilt': 5}), ('wait', 0.8), ('say', 'lokesh', 'Kya main bas haar maan loon?', {'pose': 'idle', 'tilt': 0}), ('wait', 0.6)]),
   ('card', dict(say='Lokesh kya kare? A — haar maan le. Ya B — District Legal Services Authority se free legal aid maange. Aap kya chunenge? Comment kariye.',
                 kicker='YOU DECIDE', head='What should Lokesh do?', body=['• A — Accept it and give up.', '• B — Ask the District Legal Services Authority (DLSA) for free legal aid.', 'Comment A or B.'], cta='Watch Part 2', n=260)),
 ]),
 2: dict(sub='The legal remedy', nxt='Part 3 · Justice delivered', scenes=[
   dict(set='dlsa', title=TI[2], chip='Lokesh chose B · District Legal Services Authority', music='neutral', desk=True, plate='FREE LEGAL AID',
        cast={'lokesh': dict(x=270, expr='worried'), 'officer': dict(x=800, expr='neutral')},
        beats=[('say', 'lokesh', 'Meri pension aath mahine se ruki hai. Mere paas vakeel ke paise nahi hain.', {'pose': 'open'}),
               ('say', 'officer', 'Isiliye toh hum hain. Yeh form bhariye, aur apni income ka affidavit dijiye.', {'pose': 'gesture', 'expr': 'happy'}, {'lokesh': {'pose': 'idle'}}),
               ('say', 'officer', 'Aapko ek panel lawyer milega — muft mein.', {}), ('set', 'lokesh', {'expr': 'happy'}), ('wait', 0.6)]),
   ('card', dict(say='Legal Services Authorities Act ke Section 12 ke tahat, agar aapki income tay seema se kam hai, toh vakeel muft mein milta hai. Helpline 15100.',
                 kicker='THE LAW', chip='Legal Services Authorities Act, 1987 · Section 12', head='Free legal aid is a legal right.',
                 body=['If your income is below your state’s limit — or you are a woman, a child, SC/ST or a person with disability, among others — you get a lawyer at no cost.', 'An affidavit about your income is usually enough.', 'NALSA helpline: 15100'], n=300)),
   dict(set='dlsa', title=TI[2], chip='Panel lawyer · no fees', music='neutral', desk=True, plate='PANEL LAWYER',
        cast={'lokesh': dict(x=270, expr='neutral'), 'lawyer': dict(x=800, expr='neutral')},
        beats=[('say', 'lawyer', 'Retirement order, pension ke kaagaz, aur aapki saari applications — laaye hain?', {'pose': 'gesture'}),
               ('say', 'lokesh', 'Haan, sab sambhaal ke rakha hai.', {'prop': 'paper', 'expr': 'happy'}, {'lawyer': {'pose': 'idle'}}),
               ('say', 'lawyer', 'Aapki pension rokne ki koi kanooni wajah nahi hai.', {'expr': 'happy'}),
               ('say', 'lawyer', 'Hum Central Administrative Tribunal jaayenge.', {'pose': 'gesture'}), ('wait', 0.5)]),
   ('card', dict(say='Central Government ke karmachari ka pension ka maamla Central Administrative Tribunal mein jaata hai. Har chitthi ki copy sambhaal kar rakhiye — wahi aapka saboot hai.',
                 kicker='WHERE TO GO', chip='Administrative Tribunals Act, 1985', head='Central Government pension disputes go to the Central Administrative Tribunal.',
                 body=['First, a written representation to your department.', 'Keep a copy of every letter and reply — that is your proof.'], n=270, dark=False)),
   ('card', dict(say='Kya Lokesh ko uski mehnat ki pension milegi? Dekhiye Part 3.', kicker='THE QUESTION', head='Will Lokesh finally get the pension he earned?', body=[],
                 cta='Watch Part 3', fig=[('lokesh', 'worried', 820, 560)], n=150)),
 ]),
 3: dict(sub='Justice delivered', nxt=None, scenes=[
   dict(set='tribunal', title=TI[3], chip='Central Administrative Tribunal', music='neutral',
        cast={'judge': dict(x=540, expr='neutral', base=1090, h=820), 'lawyer': dict(x=185, expr='neutral', h=980), 'lokesh': dict(x=895, expr='worried', h=980)},
        beats=[('say', 'lawyer', 'Mere client ne tees saal seva ki. Aath mahine se unki pension ruki hai.', {'pose': 'gesture'}),
               ('say', 'judge', 'Service records dekhe gaye. Pension rokne ka koi lawful justification nahi hai.', {}, {'lawyer': {'pose': 'idle'}}),
               ('say', 'judge', 'Department saari bakaya pension, deri ke byaaj ke saath, jaari kare.', {'pose': 'open'}),
               ('sfx', 'gavel'), ('set', 'lokesh', {'expr': 'happy'}), ('set', 'lawyer', {'expr': 'happy'}), ('wait', 1.0)]),
   dict(set='warm', title=TI[3], chip='A few weeks later', music='hopeful',
        cast={'lokesh': dict(x=380, expr='neutral', pose='phone'), 'sushma': dict(x=720, expr='neutral')},
        beats=[('sfx', 'ding'), ('fx', sms_fx), ('wait', 1.0), ('say', 'sushma', 'Kya hua? Phone kyun dekh rahe ho?', {}),
               ('say', 'lokesh', 'Pension aa gayi, Sushma. Byaaj ke saath.', {'expr': 'happy'}), ('say', 'sushma', 'Aur vakeel ki fees?', {'expr': 'happy', 'tilt': -4}),
               ('say', 'lokesh', 'Ek paisa nahi.', {'pose': 'gesture'}), ('fx', hearts), ('wait', 1.2)]),
   ('card', dict(say='Pension koi ehsaan nahi hai. Yeh aapka kamaaya hua haq hai. Supreme Court ne baar baar kaha hai — pension koi tohfa nahi.',
                 kicker='THE LEGAL LESSON', head='Pension is not a favour.',
                 body=['It is an earned right under the pension rules.', 'The Supreme Court has repeatedly held that pension is not a bounty or a gift (Deokinandan Prasad, 1971 · D.S. Nakara, 1983).'], n=300)),
   ('card', dict(say='Insaaf paison ka mohtaaj nahi hona chahiye. Free legal aid ke liye 15100 par call kariye.',
                 kicker='THE MESSAGE', head='“Justice should not depend on how much money you have.”', body=['Free legal aid: your District Legal Services Authority.', 'NALSA helpline 15100.'], n=240, dark=False)),
 ]),
}
F.END = 'Know your rights. Understand your remedies. Justice is for everyone.'
F.END_SAY = 'Apne adhikaar jaaniye. Saboot dot org par — free mein.'

HINDI_EXTRA = {
 'Pension? Agle mahine aana, babuji.': 'पेंशन? अगले महीने आना, बाबूजी।',
 'Aath mahine se yahi sun raha hoon.': 'आठ महीने से यही सुन रहा हूँ।',
 'Tees saal ki naukri poori! Ab aaram kariye.': 'तीस साल की नौकरी पूरी! अब आराम करिए।',
 'Haan… ab pension se ghar araam se chalega.': 'हाँ… अब पेंशन से घर आराम से चलेगा।',
 'Meri pension abhi tak shuru nahi hui.': 'मेरी पेंशन अभी तक शुरू नहीं हुई।',
 'File upar gayi hui hai. Agle mahine aana.': 'फ़ाइल ऊपर गई हुई है। अगले महीने आना।',
 'Main teen baar likh kar de chuka hoon.': 'मैं तीन बार लिख कर दे चुका हूँ।',
 'Hum kya karein, babuji? System hai.': 'हम क्या करें, बाबूजी? सिस्टम है।',
 'Dawaai ke paise bhi khatam ho gaye.': 'दवाई के पैसे भी ख़त्म हो गए।',
 'Vakeel ki fees kahan se laaun, Sushma?': 'वकील की फ़ीस कहाँ से लाऊँ, सुषमा?',
 'Kya main bas haar maan loon?': 'क्या मैं बस हार मान लूँ?',
 'Lokesh kya kare? A — haar maan le. Ya B — District Legal Services Authority se free legal aid maange. Aap kya chunenge? Comment kariye.': 'लोकेश क्या करे? ए — हार मान ले। या बी — डिस्ट्रिक्ट लीगल सर्विसेज़ अथॉरिटी से फ़्री लीगल एड माँगे। आप क्या चुनेंगे? कमेंट करिए।',
 'Aapse vakeel ki ek paisa fees nahi li jaayegi.': 'आपसे वकील की एक पैसा फ़ीस नहीं ली जाएगी।',
 'Sach mein?': 'सच में?',
 'Meri pension aath mahine se ruki hai. Mere paas vakeel ke paise nahi hain.': 'मेरी पेंशन आठ महीने से रुकी है। मेरे पास वकील के पैसे नहीं हैं।',
 'Isiliye toh hum hain. Yeh form bhariye, aur apni income ka affidavit dijiye.': 'इसीलिए तो हम हैं। ये फ़ॉर्म भरिए, और अपनी इनकम का एफ़िडेविट दीजिए।',
 'Aapko ek panel lawyer milega — muft mein.': 'आपको एक पैनल लॉयर मिलेगा — मुफ़्त में।',
 'Legal Services Authorities Act ke Section 12 ke tahat, agar aapki income tay seema se kam hai, toh vakeel muft mein milta hai. Helpline 15100.': 'लीगल सर्विसेज़ अथॉरिटीज़ एक्ट के सेक्शन बारह के तहत, अगर आपकी इनकम तय सीमा से कम है, तो वकील मुफ़्त में मिलता है। हेल्पलाइन एक पाँच एक ज़ीरो ज़ीरो।',
 'Retirement order, pension ke kaagaz, aur aapki saari applications — laaye hain?': 'रिटायरमेंट ऑर्डर, पेंशन के काग़ज़, और आपकी सारी एप्लीकेशंस — लाए हैं?',
 'Haan, sab sambhaal ke rakha hai.': 'हाँ, सब सँभाल के रखा है।',
 'Aapki pension rokne ki koi kanooni wajah nahi hai.': 'आपकी पेंशन रोकने की कोई क़ानूनी वजह नहीं है।',
 'Hum Central Administrative Tribunal jaayenge.': 'हम सेंट्रल एडमिनिस्ट्रेटिव ट्रिब्यूनल जाएँगे।',
 'Central Government ke karmachari ka pension ka maamla Central Administrative Tribunal mein jaata hai. Har chitthi ki copy sambhaal kar rakhiye — wahi aapka saboot hai.': 'सेंट्रल गवर्नमेंट के कर्मचारी का पेंशन का मामला सेंट्रल एडमिनिस्ट्रेटिव ट्रिब्यूनल में जाता है। हर चिट्ठी की कॉपी सँभाल कर रखिए — वही आपका सबूत है।',
 'Kya Lokesh ko uski mehnat ki pension milegi? Dekhiye Part 3.': 'क्या लोकेश को उसकी मेहनत की पेंशन मिलेगी? देखिए पार्ट थ्री।',
 'Pension bina kisi kanooni wajah ke roki gayi hai.': 'पेंशन बिना किसी क़ानूनी वजह के रोकी गई है।',
 'Mere client ne tees saal seva ki. Aath mahine se unki pension ruki hai.': 'मेरे क्लाइंट ने तीस साल सेवा की। आठ महीने से उनकी पेंशन रुकी है।',
 'Service records dekhe gaye. Pension rokne ka koi lawful justification nahi hai.': 'सर्विस रिकॉर्ड्स देखे गए। पेंशन रोकने का कोई लॉफ़ुल जस्टिफ़िकेशन नहीं है।',
 'Department saari bakaya pension, deri ke byaaj ke saath, jaari kare.': 'डिपार्टमेंट सारी बकाया पेंशन, देरी के ब्याज के साथ, जारी करे।',
 'Kya hua? Phone kyun dekh rahe ho?': 'क्या हुआ? फ़ोन क्यों देख रहे हो?',
 'Pension aa gayi, Sushma. Byaaj ke saath.': 'पेंशन आ गई, सुषमा। ब्याज के साथ।',
 'Aur vakeel ki fees?': 'और वकील की फ़ीस?',
 'Ek paisa nahi.': 'एक पैसा नहीं।',
 'Pension koi ehsaan nahi hai. Yeh aapka kamaaya hua haq hai. Supreme Court ne baar baar kaha hai — pension koi tohfa nahi.': 'पेंशन कोई एहसान नहीं है। ये आपका कमाया हुआ हक़ है। सुप्रीम कोर्ट ने बार बार कहा है — पेंशन कोई तोहफ़ा नहीं।',
 'Insaaf paison ka mohtaaj nahi hona chahiye. Free legal aid ke liye 15100 par call kariye.': 'इंसाफ़ पैसों का मोहताज नहीं होना चाहिए। फ़्री लीगल एड के लिए एक पाँच एक ज़ीरो ज़ीरो पर कॉल करिए।',
 'Apne adhikaar jaaniye. Saboot dot org par — free mein.': 'अपने अधिकार जानिए। सबूत डॉट ओ आर जी पर — फ़्री में।',
}

if __name__ == '__main__':
    F.build(int(sys.argv[1]), sys.argv[2] if len(sys.argv) > 2 else 'full')
