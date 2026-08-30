// Procedural Web Audio API sound generator for Money Heist Cyberpunk atmosphere
let audioCtx = null;
let ambientOsc = null;
let ambientGain = null;
let isPlaying = false;

export const toggleCyberpunkAudio = () => {
  if (isPlaying) {
    stopCyberpunkAudio();
    return false;
  } else {
    startCyberpunkAudio();
    return true;
  }
};

export const startCyberpunkAudio = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Deep sub bass oscillator for tension
    ambientOsc = audioCtx.createOscillator();
    ambientGain = audioCtx.createGain();
    
    // Low frequency pulsing synth drone
    ambientOsc.type = 'sawtooth';
    ambientOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // Low A

    // Lowpass filter for dark subterranean sound
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, audioCtx.currentTime);

    // LFO for subtle pulse
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.setValueAtTime(0.2, audioCtx.currentTime); // Slow 0.2Hz pulse
    lfoGain.gain.setValueAtTime(40, audioCtx.currentTime);
    lfo.connect(filter.frequency);
    lfo.start();

    ambientGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    ambientGain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 2.5);

    ambientOsc.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);

    ambientOsc.start();
    isPlaying = true;
  } catch (err) {
    console.warn('Web Audio API initialized on user interaction:', err);
  }
};

export const stopCyberpunkAudio = () => {
  if (ambientGain && audioCtx) {
    ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    setTimeout(() => {
      if (ambientOsc) {
        try { ambientOsc.stop(); } catch(e){}
      }
      isPlaying = false;
    }, 500);
  }
};

export const playHeistClickSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
};

export const playVaultGateSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
};
