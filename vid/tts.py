"""Hindi voices for the films (Kokoro-82M, open-source neural TTS). Run where the model files are available.
Each spoken line -> voice/<id>.wav (24 kHz mono) + voice/index.json {roman_line: {file, dur}}."""
import json, os, sys, hashlib, subprocess
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
VOICE_DIR = os.path.join(HERE, 'voice')

# Who speaks with which voice, at what speed, with what pitch shift (semitones).
VOICES = {
    'vidyut':   ('hm_omega', 1.00, 0.0),
    'anjali':   ('hf_alpha', 1.00, 0.0),
    'phone':    ('hf_beta', 0.98, -1.5),   # the relative on the phone: older woman
    'vakeel':   ('hm_psi', 0.97, 0.0),
    'judge':    ('hm_psi', 0.92, -2.0),    # same model as the advocate, lower and slower
    'mediator': ('hf_beta', 0.94, 0.0),
    'lokesh':   ('hm_omega', 0.92, -2.0),  # retired clerk, older and slower
    'sushma':   ('hf_beta', 0.95, -1.0),
    'clerk':    ('hm_psi', 1.06, 1.0),
    'officer':  ('hf_beta', 1.00, 1.0),
    'lawyer':   ('hf_alpha', 1.00, 0.0),
}

# What each line sounds like (Devanagari, so the Hindi voice pronounces it right). Keys are the bubble text.
HINDI = {
 'Promise karo… hamesha saath rahoge?': 'प्रॉमिस करो… हमेशा साथ रहोगे?',
 'Hamesha. Har mushkil mein.': 'हमेशा। हर मुश्किल में।',
 'Bahu ko samjhao… ghar aise nahi chalta.': 'बहू को समझाओ… घर ऐसे नहीं चलता।',
 'Haan haan… main baat karta hoon.': 'हाँ हाँ… मैं बात करता हूँ।',
 'Har baat mein bahar waale kyun bolte hain, Vidyut?': 'हर बात में बाहर वाले क्यों बोलते हैं, विद्युत?',
 'Woh family hai, Anjali.': 'वो फ़ैमिली है, अंजलि।',
 'Aur main? Main kaun hoon?': 'और मैं? मैं कौन हूँ?',
 'Anjali, ruko… baat karte hain na.': 'अंजलि, रुको… बात करते हैं ना।',
 'Bahut baat ho gayi. Main maa ke ghar ja rahi hoon.': 'बहुत बात हो गई। मैं माँ के घर जा रही हूँ।',
 'Divorce ki petition…? Anjali ne?': 'डिवोर्स की पिटीशन…? अंजलि ने?',
 'Shaayad yahi theek hai… shaayad.': 'शायद यही ठीक है… शायद।',
 'Main use khona nahi chahta.': 'मैं उसे खोना नहीं चाहता।',
 'Kya koi raasta hai… ise bachane ka?': 'क्या कोई रास्ता है… इसे बचाने का?',
 'Main divorce nahi chahta. Main Anjali ko wapas chahta hoon.': 'मैं डिवोर्स नहीं चाहता। मैं अंजलि को वापस चाहता हूँ।',
 'Hindu Marriage Act mein iska ek raasta hai — Section 9.': 'हिंदू मैरिज एक्ट में इसका एक रास्ता है — सेक्शन नौ।',
 'Restitution of conjugal rights. Court se kehte hain ki married life wapas shuru ho.': 'रेस्टिट्यूशन ऑफ़ कॉन्जुगल राइट्स। कोर्ट से कहते हैं कि मैरिड लाइफ़ वापस शुरू हो।',
 'Matlab court use wapas aane ko kahega?': 'मतलब कोर्ट उसे वापस आने को कहेगा?',
 'Par ek baat saaf samjho — court kisi ko saath rehne pe majboor nahi kar sakta.': 'पर एक बात साफ़ समझो — कोर्ट किसी को साथ रहने पे मजबूर नहीं कर सकता।',
 'Phir iska fayda kya?': 'फिर इसका फ़ायदा क्या?',
 'Court pehle dono ko milane ki koshish karta hai. Asli mauka wahi hai.': 'कोर्ट पहले दोनों को मिलाने की कोशिश करता है। असली मौका वही है।',
 'Faisle se pehle, court dekhna chahta hai ki yeh shaadi bach sakti hai ya nahi.': 'फ़ैसले से पहले, कोर्ट देखना चाहता है कि ये शादी बच सकती है या नहीं।',
 'Dono pakshon ko mediation ke liye bheja jaata hai.': 'दोनों पक्षों को मीडिएशन के लिए भेजा जाता है।',
 '…Theek hai.': '…ठीक है।',
 'Yahan koi jeetega ya haarega nahi. Aap bas ek doosre ko suniye.': 'यहाँ कोई जीतेगा या हारेगा नहीं। आप बस एक दूसरे को सुनिए।',
 'Aur jo yahan kaha jaata hai, woh yahin rehta hai.': 'और जो यहाँ कहा जाता है, वो यहीं रहता है।',
 'Mujhe lagta tha meri baat ka koi matlab hi nahi.': 'मुझे लगता था मेरी बात का कोई मतलब ही नहीं।',
 'Main sun raha hoon, Anjali. Galti meri bhi thi.': 'मैं सुन रहा हूँ, अंजलि। गलती मेरी भी थी।',
 'Ab hamare faisle hum dono lenge. Koi bahar waala nahi.': 'अब हमारे फ़ैसले हम दोनों लेंगे। कोई बाहर वाला नहीं।',
 '…Pakka?': '…पक्का?',
 'Pakka.': 'पक्का।',
 'Chai banaun?': 'चाय बनाऊँ?',
 'Aaj main banata hoon.': 'आज मैं बनाता हूँ।',
 'Kya aap jaante hain? Shaadi ke pehle saal mein divorce ki petition ke liye court ki ijaazat chahiye — sirf exceptional hardship mein.': 'क्या आप जानते हैं? शादी के पहले साल में डिवोर्स की पिटीशन के लिए कोर्ट की इजाज़त चाहिए — सिर्फ़ एक्सेप्शनल हार्डशिप में।',
 'Toh Vidyut ke paas kya raasta hai? Dekhiye Part 2.': 'तो विद्युत के पास क्या रास्ता है? देखिए पार्ट टू।',
 'Section 9: agar ek saathi bina reasonable excuse ke chala jaaye, toh court married life wapas shuru karne ka order de sakta hai.': 'सेक्शन नौ: अगर एक साथी बिना रीज़नेबल एक्सक्यूज़ के चला जाए, तो कोर्ट मैरिड लाइफ़ वापस शुरू करने का ऑर्डर दे सकता है।',
 'Lekin court kisi ko saath rehne pe majboor nahi kar sakta. Aur order ek saal tak na maana jaaye, toh dono mein se koi bhi divorce maang sakta hai.': 'लेकिन कोर्ट किसी को साथ रहने पे मजबूर नहीं कर सकता। और ऑर्डर एक साल तक न माना जाए, तो दोनों में से कोई भी डिवोर्स माँग सकता है।',
 'Family court ka pehla kaam hai — dono ko milane ki koshish karna.': 'फ़ैमिली कोर्ट का पहला काम है — दोनों को मिलाने की कोशिश करना।',
 'Kya mediation se rishta bach sakta hai? Dekhiye Part 3.': 'क्या मीडिएशन से रिश्ता बच सकता है? देखिए पार्ट थ्री।',
 'Shaadi ka kanoon sirf divorce ke baare mein nahi hai. Counselling aur mediation se bhi raasta nikal sakta hai.': 'शादी का कानून सिर्फ़ डिवोर्स के बारे में नहीं है। काउंसलिंग और मीडिएशन से भी रास्ता निकल सकता है।',
 'Lekin agar hinsa ya dhamki hai, toh pehle apni suraksha. Helpline 181 ya 112 par call kariye.': 'लेकिन अगर हिंसा या धमकी है, तो पहले अपनी सुरक्षा। हेल्पलाइन एक सौ इक्यासी या एक सौ बारह पर कॉल करिए।',
 'Apne adhikaar samjhiye. Saboot dot org par — free mein.': 'अपने अधिकार समझिए। सबूत डॉट ओ आर जी पर — फ़्री में।',
}

def ffmpeg_bin():
    try:
        import imageio_ffmpeg; return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception: return 'ffmpeg'

def main(lines):
    """lines: [(speaker, roman_text)]"""
    from kokoro_onnx import Kokoro
    import soundfile as sf
    k = Kokoro(os.path.join(HERE, 'kokoro.onnx'), os.path.join(HERE, 'voices.bin'))
    os.makedirs(VOICE_DIR, exist_ok=True)
    idx = {}
    for who, roman in lines:
        voice, speed, semis = VOICES[who]
        text = HINDI[roman]
        fid = hashlib.md5((who + '|' + roman).encode()).hexdigest()[:12]
        raw = os.path.join(VOICE_DIR, fid + '.raw.wav'); out = os.path.join(VOICE_DIR, fid + '.wav')
        audio, sr = k.create(text.replace('…', ', '), voice=voice, speed=speed, lang='hi')
        audio = np.asarray(audio, dtype=np.float32)
        # trim silence at both ends
        nz = np.where(np.abs(audio) > 0.01)[0]
        if len(nz): audio = audio[max(0, nz[0] - 600): nz[-1] + 1800]
        sf.write(raw, audio, sr)
        if semis:
            f = 2 ** (semis / 12)
            subprocess.run([ffmpeg_bin(), '-y', '-loglevel', 'error', '-i', raw, '-af', f'asetrate={int(sr * f)},aresample={sr},atempo={1 / f:.4f}', out], check=True)
            os.remove(raw)
        else:
            os.replace(raw, out)
        info = sf.info(out)
        idx[who + '|' + roman] = {'file': fid + '.wav', 'dur': round(info.duration, 3)}
        print(who, round(info.duration, 2), 's', roman[:40], flush=True)
    old = json.load(open(os.path.join(VOICE_DIR, 'index.json'))) if os.path.exists(os.path.join(VOICE_DIR, 'index.json')) else {}
    old.update(idx); json.dump(old, open(os.path.join(VOICE_DIR, 'index.json'), 'w'), ensure_ascii=False, indent=1)

if __name__ == '__main__':
    sys.path.insert(0, HERE)
    import film
    if len(sys.argv) > 1: __import__(sys.argv[1])          # a story module that sets film.FILMS etc.
    try:
        from pension import HINDI_EXTRA; HINDI.update(HINDI_EXTRA)
    except Exception: pass
    lines = []
    for p, F in film.FILMS.items():
        for sc in [film.COLD[p]] + F['scenes']:
            if isinstance(sc, tuple):
                if sc[1].get('say') and (film.NARRATOR, sc[1]['say']) not in lines: lines.append((film.NARRATOR, sc[1]['say']))
                continue
            for b in sc['beats']:
                if b[0] == 'say' and (b[1], b[2]) not in lines: lines.append((b[1], b[2]))
    lines.append((film.NARRATOR, film.END_SAY))
    done = json.load(open(os.path.join(VOICE_DIR, 'index.json'))) if os.path.exists(os.path.join(VOICE_DIR, 'index.json')) else {}
    lines = [l for l in lines if l[0] + '|' + l[1] not in done] or []
    print('new lines', len(lines))
    missing = [r for _, r in lines if r not in HINDI]
    if missing: sys.exit('No Hindi for: ' + '; '.join(missing))
    main(lines)
