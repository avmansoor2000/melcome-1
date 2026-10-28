import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Sparkles, Eye } from 'lucide-react';

const ScratchRevealDate = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const dateContentRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const isRevealedRef = useRef(false);

  const paintGoldFoil = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isRevealedRef.current) return;

    const rect = container.getBoundingClientRect();
    const width = Math.max(300, Math.floor(rect.width));
    const height = Math.max(220, Math.floor(rect.height));

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';

    // 1. Metallic Gold Brushed Gradient Base
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#9E7423');
    grad.addColorStop(0.2, '#D4AF37');
    grad.addColorStop(0.4, '#FCF6BA');
    grad.addColorStop(0.6, '#D4AF37');
    grad.addColorStop(0.8, '#E8C868');
    grad.addColorStop(1, '#8E6418');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Brushed Gold Foil Texture Lines
    ctx.strokeStyle = 'rgba(255, 250, 220, 0.16)';
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 3) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + (Math.sin(y) * 2));
      ctx.stroke();
    }

    // 3. Subtle Arabesque Geometric Watermark Rings
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.strokeStyle = 'rgba(6, 24, 18, 0.16)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-65, -65, 130, 130);
    }
    ctx.beginPath();
    ctx.arc(0, 0, 88, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 4. Inner Ornamental Border on Foil
    ctx.strokeStyle = 'rgba(6, 24, 18, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    // 5. Calligraphic Foil Text Overlay
    ctx.fillStyle = '#061812';
    ctx.textAlign = 'center';
    ctx.font = '600 18px "Cinzel Decorative", serif';
    ctx.fillText('✦ ROYAL GOLD FOIL SEAL ✦', width / 2, height / 2 - 14);

    ctx.font = '500 12px "Montserrat", sans-serif';
    ctx.fillStyle = 'rgba(6, 24, 18, 0.82)';
    ctx.fillText(
      'SCRATCH gently TO UNVEIL THE SACRED DATE',
      width / 2,
      height / 2 + 18
    );
  }, []);

  useEffect(() => {
    paintGoldFoil();
    window.addEventListener('resize', paintGoldFoil);
    return () => window.removeEventListener('resize', paintGoldFoil);
  }, [paintGoldFoil]);

  const triggerFullReveal = useCallback(() => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;
    setIsRevealed(true);
    setScratchPercent(100);

    // Golden spark burst via canvas-confetti
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 65,
        spread: 70,
        origin: {
          x: Math.min(0.9, Math.max(0.1, originX)),
          y: Math.min(0.9, Math.max(0.1, originY)),
        },
        colors: ['#D4AF37', '#E8C868', '#FAF7EE', '#F3E5AB'],
        ticks: 190,
        scalar: 0.9,
      });
    }

    // GSAP fade-out of remaining foil + illuminate revealed date
    if (canvasRef.current) {
      gsap.to(canvasRef.current, {
        opacity: 0,
        scale: 1.03,
        duration: 0.75,
        ease: 'power2.out',
      });
    }

    if (dateContentRef.current) {
      gsap.fromTo(
        dateContentRef.current,
        { scale: 0.94, filter: 'brightness(1.5)' },
        {
          scale: 1,
          filter: 'brightness(1)',
          duration: 0.9,
          ease: 'back.out(1.6)',
        }
      );
    }
  }, []);

  const checkScratchCoverage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealedRef.current) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height).data;

    let transparentPixels = 0;
    let totalSampled = 0;
    const stride = 16; // Sample every 4th pixel for smooth 60fps performance

    for (let i = 3; i < imageData.length; i += stride) {
      totalSampled++;
      if (imageData[i] < 128) {
        transparentPixels++;
      }
    }

    const clearedRatio = (transparentPixels / totalSampled) * 100;
    setScratchPercent(Math.min(100, Math.round(clearedRatio)));

    if (clearedRatio > 40) {
      triggerFullReveal();
    }
  }, [triggerFullReveal]);

  const getPointerCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const scratchAt = (point) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealedRef.current) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 44;

    ctx.beginPath();
    if (lastPointRef.current) {
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(point.x, point.y);
    } else {
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x + 0.1, point.y + 0.1);
    }
    ctx.stroke();

    // Soft feathered brush circle
    ctx.beginPath();
    ctx.arc(point.x, point.y, 22, 0, Math.PI * 2);
    ctx.fill();

    lastPointRef.current = point;
  };

  const handlePointerDown = (e) => {
    if (isRevealedRef.current) return;
    isDrawingRef.current = true;
    const coords = getPointerCoords(e);
    lastPointRef.current = coords;
    scratchAt(coords);
    checkScratchCoverage();
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current || isRevealedRef.current) return;
    if (e.cancelable) e.preventDefault();
    const coords = getPointerCoords(e);
    scratchAt(coords);
    checkScratchCoverage();
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    checkScratchCoverage();
  };

  return (
    <section className="relative py-16 sm:py-20 px-4 max-w-2xl mx-auto text-center">
      {/* Section Header */}
      <div className="mb-8">
        <p className="font-montserrat text-[11px] uppercase tracking-[0.35em] text-gold-accent mb-2">
          The Sacred Union Date
        </p>
        <h3 className="font-cinzel text-2xl sm:text-3xl text-gold-foil">
          Unveil the Appointed Night
        </h3>
      </div>

      {/* Scratch Card Frame */}
      <div
        ref={containerRef}
        className="relative w-full min-h-[240px] sm:min-h-[260px] rounded-2xl p-6 sm:p-10 bg-gradient-to-b from-emerald-royal via-[#05140F] to-obsidian border-2 border-gold-primary/70 shadow-gold-glow overflow-hidden flex items-center justify-center select-none"
      >
        {/* Corner Filigree Ornaments */}
        <span className="absolute top-3 left-4 text-gold-primary/70 text-sm pointer-events-none">
          ❖
        </span>
        <span className="absolute top-3 right-4 text-gold-primary/70 text-sm pointer-events-none">
          ❖
        </span>
        <span className="absolute bottom-3 left-4 text-gold-primary/70 text-sm pointer-events-none">
          ❖
        </span>
        <span className="absolute bottom-3 right-4 text-gold-primary/70 text-sm pointer-events-none">
          ❖
        </span>

        {/* Underneath Illuminated Revealed Date Content */}
        <div
          ref={dateContentRef}
          className="relative z-10 flex flex-col items-center justify-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-primary/15 border border-gold-primary/40 text-gold-accent font-montserrat text-[10px] uppercase tracking-[0.28em] mb-4">
            <Sparkles className="w-3 h-3" />
            <span>10 Jumada Al-Akhirah 1448 AH</span>
            <Sparkles className="w-3 h-3" />
          </div>

          <h4 className="font-cinzel text-2xl sm:text-4xl font-bold text-gold-foil tracking-wide drop-shadow-[0_0_25px_rgba(212,175,55,0.45)] mb-3">
            Friday, November 20, 2026
          </h4>

          <p className="font-cormorant italic text-lg sm:text-xl text-parchment/90">
            At the Katara Royal Amphitheatre &amp; Palace Gardens &bull; Doha, Qatar
          </p>
        </div>

        {/* Interactive Gold Foil Canvas Overlay */}
        <canvas
          ref={canvasRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          aria-label="Interactive gold foil scratch card covering the wedding date"
          className={`absolute inset-0 z-20 w-full h-full touch-none ${
            isRevealed ? 'pointer-events-none' : 'cursor-crosshair'
          }`}
        />
      </div>

      {/* Secondary Subtle Button: "Instant Reveal" + Status */}
      <div className="mt-5 flex items-center justify-center gap-6">
        {!isRevealed ? (
          <>
            <span className="font-montserrat text-[11px] tracking-[0.2em] uppercase text-parchment/60">
              {scratchPercent > 0
                ? `${scratchPercent}% Foil Cleared`
                : 'Drag across gold leaf to scratch'}
            </span>
            <button
              type="button"
              onClick={triggerFullReveal}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-primary/40 hover:border-gold-primary bg-emerald-royal/60 hover:bg-gold-primary/15 text-gold-accent font-montserrat text-[11px] uppercase tracking-[0.22em] transition-all duration-300"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Instant Reveal</span>
            </button>
          </>
        ) : (
          <span className="font-montserrat text-[11px] tracking-[0.28em] uppercase text-gold-accent flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-primary" />
            <span>The Sacred Date Has Been Illuminated</span>
          </span>
        )}
      </div>
    </section>
  );
};

export default ScratchRevealDate;

