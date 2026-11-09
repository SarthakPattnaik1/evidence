"""Procedural score + sound effects for the case-study films. Everything is synthesised here (no samples)."""
import numpy as np, wave, subprocess

SR = 44100
NOTE = {n: i for i, n in enumerate(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}
def hz(name, octave): return 440.0 * 2 ** ((NOTE[name] + 12 * (octave + 1) - 69) / 12)

def env(n, a, r):
    e = np.ones(n); ai = min(n, int(a * SR)); ri = min(n, int(r * SR))
    if ai: e[:ai] = np.linspace(0, 1, ai)
    if ri: e[-ri:] *= np.linspace(1, 0, ri)
    return e

def piano(f, dur=1.8, vel=0.5):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f * k * t + k) * np.exp(-t * (2.2 + k * 0.9)) for k, a in zip((1, 2, 3, 4, 5), (1, .42, .18, .08, .04)))
    s *= np.minimum(1, t / 0.004)
    return vel * s / 1.7

def pad(freqs, dur, vel=0.12):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for d in (-0.6, 0.6):
            ph = 2 * np.pi * (f + d) * t
            s += np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
    s /= (len(freqs) * 2.6)
    k = 200; s = np.convolve(s, np.ones(k) / k, mode='same')        # soften
    return vel * s * env(n, 0.9, 1.0) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.25 * t))

def bass(f, dur, vel=0.18):
    n = int(dur * SR); t = np.arange(n) / SR
    return vel * (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 1.6) * np.minimum(1, t / 0.01)

def shaker(vel=0.03):
    n = int(0.09 * SR); t = np.arange(n) / SR
    x = np.random.default_rng(3).standard_normal(n); x = x - np.convolve(x, np.ones(6) / 6, mode='same')
    return vel * x * np.exp(-t * 45)

CHORD = {  # (root for bass, chord tones)
 'C': ('C', [('C', 4), ('E', 4), ('G', 4)]), 'G': ('G', [('G', 3), ('B', 3), ('D', 4)]), 'Am': ('A', [('A', 3), ('C', 4), ('E', 4)]),
 'F': ('F', [('F', 3), ('A', 3), ('C', 4)]), 'Dm': ('D', [('D', 4), ('F', 4), ('A', 4)]), 'E': ('E', [('E', 3), ('G#', 3), ('B', 3)]),
 'Em': ('E', [('E', 3), ('G', 3), ('B', 3)]), 'Cmaj7': ('C', [('C', 4), ('E', 4), ('G', 4), ('B', 4)]), 'Fmaj7': ('F', [('F', 3), ('A', 3), ('C', 4), ('E', 4)]),
}
MOODS = {
 # progression, bpm, arpeggio density (notes per bar), melody octave shift, pulse, shaker
 'warm':    (['C', 'G', 'Am', 'F'], 84, 8, 1, False, True),
 'tense':   (['Am', 'F', 'Dm', 'E'], 76, 4, 0, True, False),
 'sad':     (['Am', 'F', 'C', 'G'], 62, 3, 1, False, False),
 'neutral': (['Cmaj7', 'Fmaj7', 'Cmaj7', 'Fmaj7'], 70, 2, 1, False, False),
 'hopeful': (['F', 'C', 'G', 'Am', 'F', 'C', 'G', 'C'], 88, 8, 1, False, True),
}

def music(segments, total):
    """segments: [(start_s, end_s, mood)] -> float array (mono)."""
    out = np.zeros(int((total + 3) * SR))
    for (a, b, mood) in segments:
        prog, bpm, dens, octv, pulse, shk = MOODS[mood]
        bar = 4 * 60 / bpm; t = a; i = 0
        seg = np.zeros(int((b - a + 3) * SR))
        while t < b:
            root, tones = CHORD[prog[i % len(prog)]]
            o = int((t - a) * SR)
            p = pad([hz(n, oc) for n, oc in tones], bar + 0.9)
            seg[o:o + len(p)] += p[:max(0, len(seg) - o)]
            bs = bass(hz(root, 2), bar)
            seg[o:o + len(bs)] += bs[:max(0, len(seg) - o)]
            arp = [hz(n, oc + octv) for n, oc in tones] + [hz(tones[0][0], tones[0][1] + octv + 1)]
            for k in range(dens):
                tt = o + int(k * bar / dens * SR)
                f = arp[(k * 2 + i) % len(arp)] if mood != 'sad' else arp[(len(arp) - 1 - k) % len(arp)]
                pn = piano(f, 1.6 if mood != 'sad' else 2.6, 0.16 if mood in ('warm', 'hopeful') else 0.13)
                seg[tt:tt + len(pn)] += pn[:max(0, len(seg) - tt)]
            if pulse:
                for k in range(8):
                    tt = o + int(k * bar / 8 * SR); bsn = bass(hz(root, 2), 0.25, 0.10)
                    seg[tt:tt + len(bsn)] += bsn[:max(0, len(seg) - tt)]
            if shk:
                for k in range(8):
                    tt = o + int((k + 0.5) * bar / 8 * SR); sh = shaker(0.022 if k % 2 else 0.012)
                    seg[tt:tt + len(sh)] += sh[:max(0, len(seg) - tt)]
            t += bar; i += 1
        n = int((b - a) * SR); seg = seg[:n + int(1.2 * SR)]
        seg[:n] *= env(n, 0.8, 0.0); seg[n:] *= np.linspace(1, 0, len(seg) - n) if len(seg) > n else 1   # fade in, tail out
        o = int(a * SR); out[o:o + len(seg)] += seg[:max(0, len(out) - o)]
    return out[:int(total * SR)]

# ---------------------------------------------------------------- sound effects
rng = np.random.default_rng(7)
def _t(d): return np.arange(int(d * SR)) / SR
def sfx(kind):
    if kind == 'pop':
        t = _t(0.09); return 0.25 * np.sin(2 * np.pi * (620 + 900 * t / 0.09) * t) * np.exp(-t * 40)
    if kind == 'ding':
        t = _t(0.9); return 0.22 * (np.sin(2 * np.pi * 1318 * t) + 0.5 * np.sin(2 * np.pi * 1975 * t)) * np.exp(-t * 5)
    if kind == 'buzz':
        t = _t(1.2); on = ((t % 0.4) < 0.25).astype(float); return 0.12 * np.sign(np.sin(2 * np.pi * 150 * t)) * on * np.convolve(on, np.ones(400) / 400, 'same')
    if kind == 'door':
        t = _t(0.7); x = rng.standard_normal(len(t)); x = np.convolve(x, np.ones(60) / 60, 'same')
        return 0.9 * (x * np.exp(-t * 14) + 0.6 * np.sin(2 * np.pi * 70 * t) * np.exp(-t * 9))
    if kind == 'gavel':
        out = np.zeros(int(0.8 * SR))
        for o in (0, 0.28):
            t = _t(0.25); x = rng.standard_normal(len(t)); x = np.convolve(x, np.ones(20) / 20, 'same')
            hit = 0.7 * (x * np.exp(-t * 40) + 0.8 * np.sin(2 * np.pi * 180 * t) * np.exp(-t * 30)); i = int(o * SR); out[i:i + len(hit)] += hit
        return out
    if kind == 'whoosh':
        t = _t(0.6); x = rng.standard_normal(len(t)); x = np.convolve(x, np.ones(30) / 30, 'same')
        return 0.25 * x * np.sin(np.pi * t / 0.6) ** 2
    if kind == 'step':
        t = _t(0.12); x = rng.standard_normal(len(t)); x = np.convolve(x, np.ones(40) / 40, 'same'); return 0.35 * x * np.exp(-t * 35)
    if kind == 'heart':
        out = np.zeros(int(0.9 * SR))
        for o, v in ((0, 1), (0.22, 0.7)):
            t = _t(0.18); b = v * 0.5 * np.sin(2 * np.pi * 55 * t) * np.exp(-t * 22); i = int(o * SR); out[i:i + len(b)] += b
        return out
    if kind == 'chime':
        out = np.zeros(int(2.0 * SR))
        for k, n in enumerate(['C', 'E', 'G', 'C']):
            p = piano(hz(n, 5 if k < 3 else 6), 1.6, 0.18); i = int(k * 0.12 * SR); out[i:i + len(p)] += p
        return out
    raise ValueError(kind)

def load_voice(path):
    w = wave.open(path); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(float) / 32768
    if sr != SR: x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x)
    return x

def mix(total, music_segments, events, out_path, voices=()):
    m = music(music_segments, total) * 0.55
    fx = np.zeros_like(m); vo = np.zeros_like(m)
    for (t, path) in voices:
        x = load_voice(path); x = x / (np.max(np.abs(x)) or 1) * 0.9; i = int(t * SR); vo[i:i + len(x)] += x[:max(0, len(vo) - i)]
    if len(voices):
        act = np.convolve(np.abs(vo), np.ones(int(0.25 * SR)) / int(0.25 * SR), 'same'); act = np.clip(act * 12, 0, 1)
        m = m * (1 - 0.6 * act)                      # music steps back while someone speaks
        fx += vo * 1.6
    for (t, kind) in events:
        s = sfx(kind); i = int(t * SR); fx[i:i + len(s)] += s[:max(0, len(fx) - i)]
    # duck music a little under door/gavel hits
    y = m + fx
    pk = np.max(np.abs(y)) or 1; y = y / pk * 0.89
    pcm = (y * 32767).astype('<i2')
    wav = out_path + '.wav'
    with wave.open(wav, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'aac', '-b:a', '128k', out_path], check=True)
