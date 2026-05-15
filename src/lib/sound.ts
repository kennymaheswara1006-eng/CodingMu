// Web Audio sound synth (Bagian 9). No external assets.
import { getSettings } from "./storage";

let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
        .AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

interface ToneOpts {
  freq: number;
  duration: number;
  type?: OscillatorType;
  vol?: number;
  slideTo?: number;
}

function tone({ freq, duration, type = "sine", vol = 0.15, slideTo }: ToneOpts, when = 0) {
  const a = ac();
  if (!a) return;
  const settings = getSettings();
  if (!settings.sound.enabled) return;
  const masterVol = (settings.sound.volume / 100) * vol;
  const osc = a.createOscillator();
  const gain = a.createGain();
  const start = a.currentTime + when;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(masterVol, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain).connect(a.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

export const Sound = {
  click: () => tone({ freq: 600, duration: 0.06, type: "square", vol: 0.08 }),
  correct: () => {
    tone({ freq: 523.25, duration: 0.12, type: "triangle", vol: 0.18 });
    tone({ freq: 783.99, duration: 0.18, type: "triangle", vol: 0.18 }, 0.1);
  },
  wrong: () => tone({ freq: 220, duration: 0.3, type: "sawtooth", vol: 0.15, slideTo: 110 }),
  levelUp: () => {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone({ freq: f, duration: 0.15, type: "triangle", vol: 0.2 }, i * 0.1),
    );
  },
  xp: () => tone({ freq: 880, duration: 0.1, type: "sine", vol: 0.12 }),
  achievement: () => {
    [392, 523, 659, 784, 1047].forEach((f, i) =>
      tone({ freq: f, duration: 0.18, type: "triangle", vol: 0.22 }, i * 0.08),
    );
  },
  heartLost: () => tone({ freq: 300, duration: 0.4, type: "triangle", vol: 0.18, slideTo: 80 }),
  complete: () => {
    [523, 784, 1047, 1568].forEach((f, i) =>
      tone({ freq: f, duration: 0.2, type: "sine", vol: 0.2 }, i * 0.1),
    );
  },
};
