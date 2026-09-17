// Speech (Web Speech API) + synthesized SFX (WebAudio) + haptics
let muted = false;
let ctx = null;

export function setMuted(v) { muted = !!v; }
export function isMuted() { return muted; }

function audioCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

let voice = null;
function pickVoice() {
  if (voice || !('speechSynthesis' in window)) return voice;
  const voices = speechSynthesis.getVoices();
  voice = voices.find((v) => /en[-_]US/i.test(v.lang) && /Google|Natural|Samantha|Zira|Aria/i.test(v.name))
    || voices.find((v) => /^en/i.test(v.lang)) || null;
  return voice;
}
if ('speechSynthesis' in window) speechSynthesis.addEventListener?.('voiceschanged', () => { voice = null; pickVoice(); });

export function speak(text, { rate = 0.9 } = {}) {
  if (muted || !text || !('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate;
  const v = pickVoice();
  if (v) u.voice = v;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

function tone(freq, { type = 'sine', dur = 0.15, gain = 0.2, at = 0, slideTo = null } = {}) {
  const ac = audioCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  const t0 = ac.currentTime + at;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

const SFX = {
  correct: () => { tone(660, { dur: 0.1 }); tone(880, { dur: 0.16, at: 0.09 }); },
  wrong: () => { tone(220, { type: 'square', dur: 0.18, gain: 0.12, slideTo: 140 }); },
  combo: () => { [523, 659, 784, 1046].forEach((f, i) => tone(f, { dur: 0.09, at: i * 0.07 })); },
  levelup: () => { [392, 523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, { type: 'triangle', dur: 0.14, at: i * 0.09 })); },
  win: () => { [523, 523, 523, 659, 784, 1046].forEach((f, i) => tone(f, { type: 'triangle', dur: 0.16, at: i * 0.12 })); },
  lose: () => { [392, 349, 311, 262].forEach((f, i) => tone(f, { type: 'sawtooth', dur: 0.22, gain: 0.1, at: i * 0.18 })); },
  tick: () => tone(1200, { dur: 0.04, gain: 0.08 }),
  flip: () => tone(500, { type: 'triangle', dur: 0.06, gain: 0.1, slideTo: 700 }),
  coin: () => { tone(988, { dur: 0.06 }); tone(1319, { dur: 0.18, at: 0.06 }); },
  hit: () => tone(90, { type: 'square', dur: 0.2, gain: 0.25, slideTo: 40 }),
};

export function sfx(name) {
  if (muted) return;
  try { SFX[name]?.(); } catch { /* audio blocked until user gesture */ }
}

export function vibrate(pattern) {
  if (muted) return;
  try { navigator.vibrate?.(pattern); } catch { /* unsupported */ }
}

export function unlockAudio() {
  audioCtx();
}
