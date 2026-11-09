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
    json.dump(idx, open(os.path.join(VOICE_DIR, 'index.json'), 'w'), ensure_ascii=False, indent=1)

if __name__ == '__main__':
    sys.path.insert(0, HERE)
    import film
    lines = []
    for p, F in film.FILMS.items():
        for sc in F['scenes']:
            if isinstance(sc, tuple): continue
            for b in sc['beats']:
                if b[0] == 'say' and (b[1], b[2]) not in lines: lines.append((b[1], b[2]))
    missing = [r for _, r in lines if r not in HINDI]
    if missing: sys.exit('No Hindi for: ' + '; '.join(missing))
    main(lines)
