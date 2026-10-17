"use client";

let audioContext: AudioContext | null = null;
let musicGain: GainNode | null = null;
let musicTimer: number | null = null;
let musicIndex = 0;
let seaSource: AudioBufferSourceNode | null = null;
let seaFilter: BiquadFilterNode | null = null;
let seaGain: GainNode | null = null;
let seaStopTimer: number | null = null;
let enabled = false;

const melody = [196, 246.94, 293.66, 246.94, 174.61, 220, 261.63, 220];

function getAudioContext() {
  if (!audioContext) audioContext = new window.AudioContext();
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

function playTone(frequency: number, duration: number, volume: number, type: OscillatorType) {
  if (!enabled) return;
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function playNextMusicNote() {
  if (!enabled || !audioContext || !musicGain) return;
  const context = audioContext;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  const now = context.currentTime;
  oscillator.type = "sine";
  oscillator.frequency.value = melody[musicIndex % melody.length];
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(0.025, now + 0.5);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
  oscillator.connect(envelope);
  envelope.connect(musicGain);
  oscillator.start(now);
  oscillator.stop(now + 2.25);
  musicIndex += 1;
  musicTimer = window.setTimeout(playNextMusicNote, 1800);
}

function startSeaAmbience(context: AudioContext) {
  if (!seaSource) {
    const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) {
      samples[index] = (Math.random() * 2 - 1) * 0.6;
    }

    seaSource = context.createBufferSource();
    seaSource.buffer = buffer;
    seaSource.loop = true;
    seaFilter = context.createBiquadFilter();
    seaFilter.type = "lowpass";
    seaFilter.frequency.value = 420;
    seaFilter.Q.value = 0.45;
    seaGain = context.createGain();
    seaGain.gain.value = 0;
    seaSource.connect(seaFilter);
    seaFilter.connect(seaGain);
    seaGain.connect(context.destination);
    const source = seaSource;
    const filter = seaFilter;
    const gain = seaGain;
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
      if (seaSource === source) {
        seaSource = null;
        seaFilter = null;
        seaGain = null;
        if (enabled) startSeaAmbience(context);
      }
    };
    seaSource.start();
  }

  if (seaStopTimer !== null) window.clearTimeout(seaStopTimer);
  seaStopTimer = null;
  seaGain?.gain.setTargetAtTime(0.0016, context.currentTime, 0.45);
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
  if (!value) {
    if (musicTimer !== null) window.clearTimeout(musicTimer);
    musicTimer = null;
    if (seaStopTimer !== null) window.clearTimeout(seaStopTimer);
    seaGain?.gain.setTargetAtTime(0, audioContext?.currentTime ?? 0, 0.12);
    seaStopTimer = window.setTimeout(() => {
      seaSource?.stop();
      seaStopTimer = null;
    }, 800);
    if (musicGain && audioContext) {
      musicGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.12);
    }
    return;
  }

  const context = getAudioContext();
  if (!musicGain) {
    musicGain = context.createGain();
    musicGain.gain.value = 0.35;
    musicGain.connect(context.destination);
  }
  musicGain.gain.setTargetAtTime(0.35, context.currentTime, 0.12);
  startSeaAmbience(context);
  if (musicTimer === null) playNextMusicNote();
}

export function playUiSound(kind: "select" | "success" | "reveal" | "miss" | "fanfare") {
  if (!enabled) return;
  const notes = {
    select: [523.25],
    reveal: [392, 523.25],
    success: [523.25, 659.25, 783.99],
    miss: [311.13, 233.08],
    fanfare: [523.25, 659.25, 783.99, 1046.5, 1318.5]
  }[kind];

  notes.forEach((note, index) => {
    window.setTimeout(() => playTone(note, 0.32, 0.045, "sine"), index * 100);
  });
}
