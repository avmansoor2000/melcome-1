import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';

const RoyalEnvelope = ({ onOpenComplete, onTriggerAudio }) => {
  const [isOpening, setIsOpening] = useState(false);

  const overlayRef = useRef(null);
  const envelopeStageRef = useRef(null);
  const envelopeShellRef = useRef(null);
  const topFlapRef = useRef(null);
  const waxSealRef = useRef(null);
  const letterCardRef = useRef(null);
  const promptTextRef = useRef(null);

  const handleOpenEnvelope = () => {
    if (isOpening) return;
    setIsOpening(true);

    // 1. Trigger audio click + start background Maqam Hijaz synth
    if (onTriggerAudio) {
      onTriggerAudio();
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        if (onOpenComplete) onOpenComplete();
      },
    });

    // Step 1: Quick micro-scale depress on the ruby wax seal
    tl.to(waxSealRef.current, {
      scale: 0.86,
      duration: 0.14,
      ease: 'power2.in',
    })
      .to(waxSealRef.current, {
        scale: 1.08,
        opacity: 0,
        duration: 0.28,
        ease: 'back.out(2)',
        onStart: () => {
          // Step 2: Canvas confetti burst in gold/bronze (#D4AF37, #F3E5AB)
          confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.54 },
            colors: ['#D4AF37', '#F3E5AB', '#E8C868', '#AA771C'],
            ticks: 220,
            gravity: 0.85,
            scalar: 0.95,
          });
        },
      })
      // Fade out helper prompt text
      .to(
        promptTextRef.current,
        {
          opacity: 0,
          y: 12,
          duration: 0.3,
        },
        '<'
      )
      // Step 3: Top flap folds upward in 3D (rotateX: -180deg, transformOrigin: "top center")
      .to(
        topFlapRef.current,
        {
          rotateX: -180,
          transformOrigin: 'top center',
          duration: 0.95,
          ease: 'power2.inOut',
          onUpdate: function () {
            // Lower flap z-index once past 90 degrees so the rising letter passes cleanly in front
            if (this.progress() > 0.45 && topFlapRef.current) {
              topFlapRef.current.style.zIndex = '15';
            }
          },
        },
        '-=0.08'
      )
      // Step 4: Letter card slides vertically out of the envelope cavity
      .to(
        letterCardRef.current,
        {
          y: -175,
          scale: 1.04,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(212, 175, 55, 0.35)',
          duration: 1.05,
          ease: 'power3.out',
        },
        '-=0.35'
      )
      // Step 5: Envelope shell drops & fades out while the letter expands into the full-page layout
      .to(
        envelopeShellRef.current,
        {
          opacity: 0,
          y: 90,
          scale: 0.92,
          duration: 0.75,
          ease: 'power2.inOut',
        },
        '-=0.15'
      )
      .to(
        letterCardRef.current,
        {
          y: 0,
          scale: 1.25,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        '<'
      )
      .to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out',
        },
        '-=0.35'
      );
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center px-4 py-8 bg-obsidian/95 backdrop-blur-md select-none overflow-visible"
    >
      {/* Ambient Radial Spotlight behind the Envelope */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,24,18,0.85)_0%,rgba(11,15,13,0.98)_75%)]"
      />

      {/* Top Ceremonial Subtitle */}
      <div className="relative z-10 text-center mb-10 sm:mb-14">
        <p className="font-amiri text-2xl sm:text-3xl text-gold-primary mb-2 tracking-wide">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <p className="font-montserrat text-[10px] sm:text-xs uppercase tracking-[0.35em] text-parchment/70">
          By Royal Decree &bull; The House of Al-Mansoor &amp; Al-Hashimi
        </p>
      </div>

      {/* 3D Perspective Stage (perspective: 1200px) */}
      <div
        ref={envelopeStageRef}
        style={{ perspective: '1200px' }}
        className="relative z-20 w-full max-w-[460px] h-[300px] sm:h-[320px] flex items-center justify-center"
      >
        <div className="relative w-full h-full preserve-3d">
          {/* Layer 1: Back Cavity of the Envelope */}
          <div
            ref={envelopeShellRef}
            className="absolute inset-0 preserve-3d pointer-events-none"
          >
            {/* Inner Velvet & Gold Filigree Backboard */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#04100C] via-emerald-royal to-[#04100C] border border-gold-primary/50 shadow-[0_30px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.18)]">
              <div className="absolute inset-2 rounded-lg border border-gold-primary/20" />
            </div>

            {/* Layer 3: Front Pocket Flaps (Left, Right, Bottom) rendered in SVG so Letter slides out cleanly */}
            <svg
              viewBox="0 0 460 320"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full z-30 rounded-xl overflow-hidden drop-shadow-[0_-6px_16px_rgba(0,0,0,0.65)]"
            >
              <defs>
                <linearGradient id="leftRightFlap" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#071D16" />
                  <stop offset="50%" stopColor="#061812" />
                  <stop offset="100%" stopColor="#04110C" />
                </linearGradient>
                <linearGradient id="bottomFlap" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#08221A" />
                  <stop offset="100%" stopColor="#05140F" />
                </linearGradient>
                <linearGradient id="goldEdge" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8A6621" />
                  <stop offset="50%" stopColor="#E8C868" />
                  <stop offset="100%" stopColor="#8A6621" />
                </linearGradient>
              </defs>

              {/* Left Folded Flap */}
              <polygon
                points="0,0 230,170 0,320"
                fill="url(#leftRightFlap)"
                stroke="url(#goldEdge)"
                strokeWidth="1.2"
              />
              {/* Right Folded Flap */}
              <polygon
                points="460,0 230,170 460,320"
                fill="url(#leftRightFlap)"
                stroke="url(#goldEdge)"
                strokeWidth="1.2"
              />
              {/* Bottom Folded Pocket Flap */}
              <polygon
                points="0,320 230,148 460,320"
                fill="url(#bottomFlap)"
                stroke="url(#goldEdge)"
                strokeWidth="1.5"
              />
              {/* Inner Ornamental Gold Filigree Line on Bottom Flap */}
              <polyline
                points="24,316 230,164 436,316"
                fill="none"
                stroke="#D4AF37"
                strokeOpacity="0.35"
                strokeWidth="0.9"
                strokeDasharray="4 3"
              />
            </svg>

            {/* Outer Gold Frame Border */}
            <div className="absolute inset-0 z-30 rounded-xl border border-gold-primary/60 pointer-events-none" />
          </div>

          {/* Layer 2: The Royal Letter Card Seated Inside the Envelope Cavity */}
          <div
            ref={letterCardRef}
            className="absolute left-5 right-5 top-4 bottom-5 z-20 rounded-lg bg-gradient-to-b from-[#FAF7EE] via-[#F5EFE0] to-[#EDE3CC] text-obsidian p-5 sm:p-6 shadow-2xl border-2 border-gold-primary flex flex-col items-center justify-between text-center pointer-events-none"
          >
            {/* Inner Gold Double Filigree Border */}
            <div className="w-full h-full border border-gold-primary/60 rounded p-3 sm:p-4 flex flex-col items-center justify-between relative">
              {/* Corner Arabesque Accents */}
              <span className="absolute top-1.5 left-2 text-gold-primary text-xs">✦</span>
              <span className="absolute top-1.5 right-2 text-gold-primary text-xs">✦</span>
              <span className="absolute bottom-1.5 left-2 text-gold-primary text-xs">✦</span>
              <span className="absolute bottom-1.5 right-2 text-gold-primary text-xs">✦</span>

              <div className="font-amiri text-lg sm:text-xl text-[#8A6621]">
                لَيْلَةُ الْعُمُرِ
              </div>

              <div className="my-1">
                <p className="font-montserrat text-[9px] uppercase tracking-[0.28em] text-obsidian/70 mb-1">
                  The Royal Wedding Of
                </p>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-emerald-royal tracking-wider">
                  Zayd &amp; Layla
                </h2>
              </div>

              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold-primary to-transparent" />

              <p className="font-cormorant italic text-sm sm:text-base text-obsidian/80">
                Friday, November 20, 2026 &bull; Doha, Qatar
              </p>
            </div>
          </div>

          {/* Layer 4: 3D Top Triangular Flap (transformOrigin: "top center") */}
          <div
            ref={topFlapRef}
            style={{
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
            }}
            className="absolute top-0 left-0 right-0 h-[190px] z-40 pointer-events-none"
          >
            <svg
              viewBox="0 0 460 190"
              preserveAspectRatio="none"
              className="w-full h-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.75)]"
            >
              <defs>
                <linearGradient id="topFlapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#09261D" />
                  <stop offset="65%" stopColor="#061812" />
                  <stop offset="100%" stopColor="#04120D" />
                </linearGradient>
              </defs>
              <polygon
                points="0,0 460,0 230,184"
                fill="url(#topFlapGrad)"
                stroke="#D4AF37"
                strokeWidth="1.6"
              />
              <polyline
                points="22,6 230,168 438,6"
                fill="none"
                stroke="#E8C868"
                strokeOpacity="0.45"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Layer 5: 3D-Embossed Ruby Wax Seal Button Centered on Flap Tip */}
          <div className="absolute left-1/2 top-[176px] -translate-x-1/2 -translate-y-1/2 z-50">
            <button
              ref={waxSealRef}
              type="button"
              onClick={handleOpenEnvelope}
              disabled={isOpening}
              aria-label="Break the royal wax seal to open wedding invitation"
              className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-full cursor-pointer focus:outline-none wax-seal-glow transition-transform duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, #B82525 0%, #841414 55%, #4A0808 100%)',
              }}
            >
              {/* Irregular Embossed Wax Outer Rim SVG */}
              <svg
                viewBox="0 0 120 120"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                {/* Outer scalloped wax edge */}
                <circle
                  cx="60"
                  cy="60"
                  r="55"
                  fill="none"
                  stroke="#D4AF37"
                  strokeOpacity="0.55"
                  strokeWidth="1.5"
                  strokeDasharray="6 3"
                />
                {/* Recessed inner stamp ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke="#E8C868"
                  strokeOpacity="0.85"
                  strokeWidth="1.8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="39"
                  fill="none"
                  stroke="#D4AF37"
                  strokeOpacity="0.4"
                  strokeWidth="0.8"
                />
              </svg>

              {/* Gold Calligraphy Monogram Inside Seal */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <span className="font-amiri text-2xl sm:text-3xl font-bold text-gold-foil drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none">
                  ز ✦ ل
                </span>
                <span className="font-cinzel text-[9px] tracking-[0.25em] text-gold-accent/90 mt-1 uppercase">
                  Z &amp; L
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Call-to-Action Below Envelope */}
      <div ref={promptTextRef} className="relative z-20 mt-12 text-center">
        <button
          type="button"
          onClick={handleOpenEnvelope}
          disabled={isOpening}
          className="group inline-flex flex-col items-center gap-2 focus:outline-none"
        >
          <span className="font-montserrat text-xs uppercase tracking-[0.35em] text-gold-accent group-hover:text-parchment transition-colors">
            Touch the Royal Wax Seal to Unseal
          </span>
          <span className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold-primary to-transparent group-hover:w-28 transition-all duration-500" />
        </button>
      </div>
    </div>
  );
};

export default RoyalEnvelope;

