#!/bin/bash
# Run on a Linux machine with internet. Puts files where the scripts expect them, installs, fetches models, renders.
set -e
sudo mkdir -p /tmp/vid/out /home/claude/cast /home/claude/er/build /usr/share/fonts/truetype/noto
sudo chown -R "$(id -u)" /tmp/vid /home/claude
cp -r vid/* /tmp/vid/ && cp -r cast/* /home/claude/cast/
python3 -m pip install -q pillow numpy fonttools cairosvg kokoro-onnx soundfile imageio-ffmpeg
FF=$(python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())'); sudo ln -sf "$FF" /usr/local/bin/ffmpeg
[ -f /usr/share/fonts/truetype/noto/NotoColorEmoji.ttf ] || sudo curl -sSL -o /usr/share/fonts/truetype/noto/NotoColorEmoji.ttf https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf
cd /tmp/vid
[ -f kokoro.onnx ] || curl -sSL -o kokoro.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
[ -f voices.bin ] || curl -sSL -o voices.bin https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
echo SETUP_OK
