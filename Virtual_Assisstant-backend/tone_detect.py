import librosa
import numpy as np
import sys
import json

audio_path = sys.argv[1]

# Load audio
y, sr = librosa.load(audio_path)

# Features
pitch = librosa.yin(y, fmin=50, fmax=300)
pitch_mean = np.nanmean(pitch)
energy = np.mean(y ** 2)
tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

# Simple tone rules
if energy < 0.01 and pitch_mean < 150:
    emotion = "sad"
elif energy > 0.05 and pitch_mean > 200:
    emotion = "excited"
elif energy > 0.04:
    emotion = "angry"
else:
    emotion = "calm"

# IMPORTANT: only JSON output
print(json.dumps({
    "emotion": emotion,
    "pitch": round(float(pitch_mean), 2),
    "energy": round(float(energy), 5),
    "tempo": round(float(tempo), 2)
}))
