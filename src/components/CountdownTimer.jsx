import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

// Friday, November 20, 2026 at 16:30:00 (4:30 PM Ceremony Start)
const WEDDING_TIMESTAMP = new Date('2026-11-20T16:30:00+03:00').getTime();

const calculateTimeRemaining = () => {
  const now = Date.now();
  const diff = Math.max(0, WEDDING_TIMESTAMP - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
};

const ArchCard = ({ value, label, arabicLabel }) => {
  const numberRef = useRef(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value && numberRef.current) {
      prevValueRef.current = value;
      gsap.fromTo(
        numberRef.current,
        {
          y: -18,
          rotateX: -75,
          opacity: 0.2,
        },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.48,
          ease: 'back.out(1.8)',
        }
      );
    }
  }, [value]);

  return (
    <div className="relative group flex flex-col items-center">
      {/* Traditional Moorish Palace Archway Card */}
      <div className="relative w-full max-w-[165px] h-[205px] sm:h-[225px] moorish-arch bg-gradient-to-b from-[#09241B] via-emerald-royal to-obsidian border-2 border-gold-primary/70 shadow-gold-glow flex flex-col items-center justify-center px-4 pt-6 pb-4 overflow-hidden transition-transform duration-500 group-hover:-translate-y-1">
        {/* Intricate Inner Moorish Arch SVG Filigree */}
        <svg
          viewBox="0 0 160 220"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <path
            d="M 12,212 L 12,92 C 12,38 80,10 80,10 C 80,10 148,38 148,92 L 148,212 Z"
            fill="none"
            stroke="#D4AF37"
            strokeOpacity="0.4"
            strokeWidth="1.2"
          />
          <path
            d="M 20,204 L 20,95 C 20,48 80,22 80,22 C 80,22 140,48 140,95 L 140,204 Z"
            fill="none"
            stroke="#E8C868"
            strokeOpacity="0.22"
            strokeWidth="0.9"
            strokeDasharray="3 3"
          />
          {/* Keystone Crescent Star at Arch Apex */}
          <circle cx="80" cy="24" r="3" fill="#D4AF37" fillOpacity="0.7" />
        </svg>

        {/* Subtle Top Lantern Glow */}
        <div
          aria-hidden="true"
          className="absolute top-2 w-20 h-20 rounded-full bg-gold-primary/15 blur-xl pointer-events-none"
        />

        {/* Arabic Calligraphy Label */}
        <span className="font-amiri text-sm sm:text-base text-gold-accent/80 mb-1">
          {arabicLabel}
        </span>

        {/* 3D Flip/Roll Number Container */}
        <div
          style={{ perspective: '400px' }}
          className="my-1 h-14 sm:h-16 flex items-center justify-center overflow-hidden"
        >
          <span
            ref={numberRef}
            className="inline-block font-cinzel text-3xl sm:text-5xl font-bold text-gold-foil tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
          >
            {value}
          </span>
        </div>

        {/* Ornamental Divider */}
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-primary/70 to-transparent my-2" />

        {/* English Metadata Label */}
        <span className="font-montserrat text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-parchment/80">
          {label}
        </span>
      </div>
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-16 sm:py-20 px-4 max-w-4xl mx-auto text-center">
      {/* Header */}
      <div className="mb-12">
        <p className="font-montserrat text-[11px] uppercase tracking-[0.35em] text-gold-accent mb-2">
          The Royal Hourglass
        </p>
        <h3 className="font-cinzel text-2xl sm:text-4xl text-gold-foil mb-3">
          Countdown to Laylat Al-Umur
        </h3>
        <p className="font-cormorant italic text-lg text-parchment/75">
          Every passing second brings our two houses closer in eternal harmony
        </p>
      </div>

      {/* 4 Moorish Palace Archway Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
        <ArchCard
          value={timeLeft.days}
          label="Days"
          arabicLabel="أَيَّام"
        />
        <ArchCard
          value={timeLeft.hours}
          label="Hours"
          arabicLabel="سَاعَات"
        />
        <ArchCard
          value={timeLeft.minutes}
          label="Minutes"
          arabicLabel="دَقَائِق"
        />
        <ArchCard
          value={timeLeft.seconds}
          label="Seconds"
          arabicLabel="ثَوَانٍ"
        />
      </div>
    </section>
  );
};

export default CountdownTimer;

