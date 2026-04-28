import type { MoodId } from "./moods";

/**
 * Procedural ambient sound — no network fetch, no CORS issues.
 * Each mood returns a cleanup function that stops & disconnects nodes.
 */
export type StopFn = () => void;

const makeNoiseBuffer = (ctx: AudioContext, seconds = 2) => {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
};

const makeBrownNoise = (ctx: AudioContext, seconds = 4) => {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buf;
};

export const startMoodAudio = (
  ctx: AudioContext,
  master: GainNode,
  mood: MoodId,
): StopFn => {
  const nodes: AudioNode[] = [];
  const stoppables: Array<{ stop: (t?: number) => void }> = [];
  const intervals: number[] = [];

  const register = <T extends AudioNode>(n: T) => { nodes.push(n); return n; };

  switch (mood) {
    case "rainy": {
      // White noise -> bandpass = rain hiss
      const src = ctx.createBufferSource();
      src.buffer = makeNoiseBuffer(ctx, 4);
      src.loop = true;
      const bp = register(ctx.createBiquadFilter());
      bp.type = "bandpass"; bp.frequency.value = 1400; bp.Q.value = 0.7;
      const hp = register(ctx.createBiquadFilter());
      hp.type = "highpass"; hp.frequency.value = 500;
      const g = register(ctx.createGain()); g.gain.value = 0.55;
      src.connect(bp).connect(hp).connect(g).connect(master);
      src.start(); stoppables.push(src);

      // Occasional thunder rumble
      const thunder = () => {
        const n = ctx.createBufferSource();
        n.buffer = makeBrownNoise(ctx, 3);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass"; lp.frequency.value = 120;
        const tg = ctx.createGain();
        const t = ctx.currentTime;
        tg.gain.setValueAtTime(0, t);
        tg.gain.linearRampToValueAtTime(0.6, t + 0.3);
        tg.gain.exponentialRampToValueAtTime(0.001, t + 2.8);
        n.connect(lp).connect(tg).connect(master);
        n.start(t); n.stop(t + 3);
      };
      intervals.push(window.setInterval(thunder, 12000 + Math.random() * 8000));
      break;
    }

    case "ocean": {
      // Brown noise with slow LFO on filter = waves
      const src = ctx.createBufferSource();
      src.buffer = makeBrownNoise(ctx, 6);
      src.loop = true;
      const lp = register(ctx.createBiquadFilter());
      lp.type = "lowpass"; lp.frequency.value = 500;
      const g = register(ctx.createGain()); g.gain.value = 0;
      src.connect(lp).connect(g).connect(master);

      // LFO for wave swell
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.35;
      lfo.connect(lfoGain).connect(g.gain);
      g.gain.value = 0.45;
      src.start(); lfo.start();
      stoppables.push(src, lfo);
      break;
    }

    case "fresh": {
      // Gentle wind + chirping bird tones
      const wind = ctx.createBufferSource();
      wind.buffer = makeBrownNoise(ctx, 4);
      wind.loop = true;
      const wlp = register(ctx.createBiquadFilter());
      wlp.type = "lowpass"; wlp.frequency.value = 700;
      const wg = register(ctx.createGain()); wg.gain.value = 0.18;
      wind.connect(wlp).connect(wg).connect(master);
      wind.start(); stoppables.push(wind);

      const chirp = () => {
        const o = ctx.createOscillator();
        o.type = "sine";
        const base = 1800 + Math.random() * 2400;
        const t = ctx.currentTime;
        o.frequency.setValueAtTime(base, t);
        o.frequency.exponentialRampToValueAtTime(base * 1.6, t + 0.08);
        o.frequency.exponentialRampToValueAtTime(base * 0.9, t + 0.16);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.12, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        o.connect(g).connect(master);
        o.start(t); o.stop(t + 0.25);
      };
      intervals.push(window.setInterval(() => {
        const bursts = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < bursts; i++) setTimeout(chirp, i * 140);
      }, 2200 + Math.random() * 1800));
      break;
    }

    case "night": {
      // Slow pad + cricket-like shimmer
      const makePad = (freq: number, detune = 0, gain = 0.08) => {
        const o = ctx.createOscillator();
        o.type = "sine"; o.frequency.value = freq; o.detune.value = detune;
        const g = ctx.createGain(); g.gain.value = gain;
        o.connect(g).connect(master);
        o.start(); stoppables.push(o);
      };
      makePad(110, 0, 0.1);
      makePad(164.8, 3, 0.08);
      makePad(220, -4, 0.06);

      // crickets (short high pulses)
      const cricket = () => {
        const o = ctx.createOscillator();
        o.type = "triangle";
        o.frequency.value = 4200 + Math.random() * 600;
        const g = ctx.createGain();
        const t = ctx.currentTime;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.05, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        o.connect(g).connect(master);
        o.start(t); o.stop(t + 0.1);
      };
      intervals.push(window.setInterval(cricket, 400));
      break;
    }

    case "sunset": {
      // Warm drone chord
      const freqs = [130.8, 196, 261.6, 329.6]; // C3 G3 C4 E4
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = i === 0 ? "sine" : "triangle";
        o.frequency.value = f;
        const g = ctx.createGain(); g.gain.value = 0.05;
        // subtle vibrato via LFO
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.2 + i * 0.05;
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.02;
        lfo.connect(lfoGain).connect(g.gain);
        o.connect(g).connect(master);
        o.start(); lfo.start();
        stoppables.push(o, lfo);
      });
      break;
    }

    case "calm":
    default: {
      // Airy pad + soft wind
      const wind = ctx.createBufferSource();
      wind.buffer = makeBrownNoise(ctx, 5);
      wind.loop = true;
      const lp = register(ctx.createBiquadFilter());
      lp.type = "lowpass"; lp.frequency.value = 400;
      const wg = register(ctx.createGain()); wg.gain.value = 0.15;
      wind.connect(lp).connect(wg).connect(master);
      wind.start(); stoppables.push(wind);

      const freqs = [220, 329.6, 440];
      freqs.forEach((f) => {
        const o = ctx.createOscillator();
        o.type = "sine"; o.frequency.value = f;
        const g = ctx.createGain(); g.gain.value = 0.035;
        o.connect(g).connect(master);
        o.start(); stoppables.push(o);
      });
      break;
    }
  }

  return () => {
    intervals.forEach((id) => clearInterval(id));
    stoppables.forEach((n) => { try { n.stop(); } catch {} });
    nodes.forEach((n) => { try { n.disconnect(); } catch {} });
  };
};
