import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

// Maqam Hijaz scale frequencies (rooted on D)
// D3, A3 (drones) | D4, Eb4, F#4, G4, A4, Bb4, C5, D5
const MAQAM_HIJAZ_PHRASE = [
  { freq: 293.66, duration: 1.4, delay: 0.0, gain: 0.22 },   // D4
  { freq: 311.13, duration: 1.1, delay: 0.65, gain: 0.18 },  // Eb4
  { freq: 369.99, duration: 1.6, delay: 1.35, gain: 0.24 },  // F#4
  { freq: 392.00, duration: 1.2, delay: 2.15, gain: 0.20 },  // G4
  { freq: 440.00, duration: 2.0, delay: 2.90, gain: 0.25 },  // A4
  { freq: 466.16, duration: 1.1, delay: 4.10, gain: 0.18 },  // Bb4
  { freq: 440.00, duration: 1.2, delay: 4.75, gain: 0.20 },  // A4
  { freq: 392.00, duration: 1.2, delay: 5.45, gain: 0.19 },  // G4
  { freq: 369.99, duration: 1.5, delay: 6.15, gain: 0.23 },  // F#4
  { freq: 311.13, duration: 1.2, delay: 7.00, gain: 0.18 },  // Eb4
  { freq: 293.66, duration: 2.8, delay: 7.75, gain: 0.26 },  // D4 (resolve)
  { freq: 587.33, duration: 2.4, delay: 8.40, gain: 0.11 },  // D5 (harmonic shimmer)
];

const createReverbImpulse = (ctx, duration = 3.2, decay = 2.6) => {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      channelData[i] =
        (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
};

const AudioPlayer = forwardRef(({ externalAudioSrc = '' }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState([35, 65, 45, 80, 50]);

  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const reverbNodeRef = useRef(null);
  const loopIntervalRef = useRef(null);
  const fallbackAudioRef = useRef(null);
  const isPlayingRef = useRef(false);

  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.65, ctx.currentTime);

      const convolver = ctx.createConvolver();
      convolver.buffer = createReverbImpulse(ctx, 3.2, 2.5);

      const wetGain = ctx.createGain();
      wetGain.gain.setValueAtTime(0.48, ctx.currentTime);

      const dryGain = ctx.createGain();
      dryGain.gain.setValueAtTime(0.65, ctx.currentTime);

      masterGain.connect(dryGain);
      masterGain.connect(convolver);
      convolver.connect(wetGain);

      dryGain.connect(ctx.destination);
      wetGain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;
      reverbNodeRef.current = convolver;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    return audioCtxRef.current;
  }, []);

  // Plucked Oud / Oriental Harp note synthesizer
  const playOudNote = useCallback((ctx, dest, freq, startTime, duration, peakGain = 0.2) => {
    if (!ctx || !dest) return;

    // Warm fundamental + octave overtone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const noteGain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    // Subtle pitch pluck inflection
    osc1.frequency.exponentialRampToValueAtTime(
      freq * 1.004,
      startTime + 0.04
    );
    osc1.frequency.exponentialRampToValueAtTime(freq, startTime + 0.18);

    // Warm resonant low-pass filter envelope (mimics wooden oud body)
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(3.2, startTime);
    filter.frequency.setValueAtTime(freq * 5.5, startTime);
    filter.frequency.exponentialRampToValueAtTime(
      freq * 1.6,
      startTime + duration * 0.85
    );

    // Plucked string envelope
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(peakGain, startTime + 0.035);
    noteGain.gain.exponentialRampToValueAtTime(
      peakGain * 0.35,
      startTime + duration * 0.4
    );
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.22, startTime);

    osc1.connect(filter);
    osc2.connect(overtoneGain);
    overtoneGain.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(dest);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);
  }, []);

  // Schedule one full bar of the Maqam Hijaz melodic phrase + warm D3/A3 drone
  const scheduleHijazPhrase = useCallback(() => {
    const ctx = audioCtxRef.current;
    const dest = masterGainRef.current;
    if (!ctx || !dest || !isPlayingRef.current) return;

    const now = ctx.currentTime + 0.08;

    // Deep warm drone on D3 (146.83 Hz) and A3 (220 Hz)
    playOudNote(ctx, dest, 146.83, now, 5.5, 0.14);
    playOudNote(ctx, dest, 220.00, now + 2.8, 5.0, 0.10);
    playOudNote(ctx, dest, 146.83, now + 5.6, 5.2, 0.13);

    // Schedule each note in the Maqam Hijaz phrase
    MAQAM_HIJAZ_PHRASE.forEach((note) => {
      playOudNote(
        ctx,
        dest,
        note.freq,
        now + note.delay,
        note.duration,
        note.gain
      );
    });
  }, [playOudNote]);

  // Tactile wax-seal click + royal golden chime sound effect
  const playSealClick = useCallback(() => {
    try {
      const ctx = ensureAudioContext();
      const dest = masterGainRef.current;
      const now = ctx.currentTime;

      // 1. Tactile low-mid wax crack/click
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(190, now);
      clickOsc.frequency.exponentialRampToValueAtTime(52, now + 0.09);

      clickGain.gain.setValueAtTime(0.45, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      clickOsc.connect(clickGain);
      clickGain.connect(dest);
      clickOsc.start(now);
      clickOsc.stop(now + 0.1);

      // 2. Shimmering Hijaz chord arpeggio (D4 - F#4 - A4 - D5)
      const chimeFreqs = [293.66, 369.99, 440.0, 587.33, 739.99];
      chimeFreqs.forEach((f, idx) => {
        playOudNote(ctx, dest, f, now + 0.06 + idx * 0.09, 2.2, 0.18);
      });
    } catch {
      // Ignore if blocked before gesture
    }
  }, [ensureAudioContext, playOudNote]);

  const startMusic = useCallback(() => {
    if (isPlayingRef.current) return;

    // If external audio file is provided in fallback <audio>, use that
    if (externalAudioSrc && fallbackAudioRef.current) {
      fallbackAudioRef.current
        .play()
        .then(() => {
          isPlayingRef.current = true;
          setIsPlaying(true);
        })
        .catch(() => {});
      return;
    }

    const ctx = ensureAudioContext();
    if (masterGainRef.current) {
      masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
      masterGainRef.current.gain.setValueAtTime(0.65, ctx.currentTime);
    }

    isPlayingRef.current = true;
    setIsPlaying(true);

    scheduleHijazPhrase();
    if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
    loopIntervalRef.current = setInterval(() => {
      if (isPlayingRef.current) {
        scheduleHijazPhrase();
      }
    }, 10800);
  }, [ensureAudioContext, externalAudioSrc, scheduleHijazPhrase]);

  const stopMusic = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);

    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }

    if (externalAudioSrc && fallbackAudioRef.current) {
      fallbackAudioRef.current.pause();
      return;
    }

    if (audioCtxRef.current && masterGainRef.current) {
      const now = audioCtxRef.current.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.setValueAtTime(
        masterGainRef.current.gain.value,
        now
      );
      masterGainRef.current.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.4
      );
    }
  }, [externalAudioSrc]);

  const toggleMusic = useCallback(() => {
    if (isPlayingRef.current) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [startMusic, stopMusic]);

  useImperativeHandle(ref, () => ({
    startMusic,
    stopMusic,
    toggleMusic,
    playSealClick,
  }));

  // Animate equalizer visualizer bars while playing
  useEffect(() => {
    if (!isPlaying) {
      setBars([22, 22, 22, 22, 22]);
      return;
    }
    const interval = setInterval(() => {
      setBars([
        Math.floor(Math.random() * 65) + 25,
        Math.floor(Math.random() * 75) + 25,
        Math.floor(Math.random() * 60) + 30,
        Math.floor(Math.random() * 80) + 20,
        Math.floor(Math.random() * 55) + 25,
      ]);
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <>
      {/* Fallback <audio> ref for easy client MP3 swapping */}
      <audio
        ref={fallbackAudioRef}
        src={externalAudioSrc || undefined}
        loop
        preload="none"
        className="hidden"
      />

      {/* Fixed Top-Right Audio Pill */}
      <div className="fixed top-5 right-5 z-50">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Mute ambient Maqam music' : 'Play ambient Maqam music'}
          className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-obsidian/85 backdrop-blur-md border border-gold-primary/40 hover:border-gold-primary shadow-gold-glow transition-all duration-300"
        >
          {/* Golden Frequency Visualizer */}
          <div className="flex items-end gap-[3px] h-4 w-5" aria-hidden="true">
            {bars.map((height, idx) => (
              <span
                key={idx}
                style={{ height: `${height}%` }}
                className={`w-[2.5px] rounded-full transition-all duration-200 ${
                  isPlaying
                    ? 'bg-gradient-to-t from-gold-primary to-gold-accent'
                    : 'bg-gold-primary/40'
                }`}
              />
            ))}
          </div>

          <span className="font-montserrat text-[10px] tracking-[0.22em] uppercase text-parchment/90 hidden sm:inline">
            {isPlaying ? 'Maqam Hijaz' : 'Sound Off'}
          </span>

          <span className="text-gold-primary group-hover:text-gold-accent transition-colors">
            {isPlaying ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 opacity-70" />
            )}
          </span>
        </button>
      </div>
    </>
  );
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;

