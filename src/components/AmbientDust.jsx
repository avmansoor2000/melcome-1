import React, { useEffect, useRef } from 'react';

const AmbientDust = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create particles: combination of fine gold specks and soft bokeh orbs
    const particleCount = Math.min(85, Math.floor((width * height) / 16000));
    const particles = Array.from({ length: particleCount }, () => {
      const isBokeh = Math.random() > 0.72;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isBokeh ? Math.random() * 4.5 + 2.5 : Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.35 + 0.08),
        baseAlpha: isBokeh ? Math.random() * 0.22 + 0.05 : Math.random() * 0.55 + 0.15,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.02 + 0.006,
        hue: Math.random() > 0.4 ? '212, 175, 55' : '232, 200, 104', // #D4AF37 or #E8C868
        isBokeh,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += p.phaseSpeed;
        p.x += p.vx + Math.sin(p.phase * 0.7) * 0.12;
        p.y += p.vy;

        // Wrap around edges
        if (p.y < -15) p.y = height + 15;
        if (p.y > height + 15) p.y = -15;
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        const currentAlpha =
          p.baseAlpha * (0.65 + 0.35 * Math.sin(p.phase));

        ctx.save();
        ctx.beginPath();
        if (p.isBokeh) {
          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.radius * 2.2
          );
          grad.addColorStop(0, `rgba(${p.hue}, ${currentAlpha})`);
          grad.addColorStop(0.5, `rgba(${p.hue}, ${currentAlpha * 0.4})`);
          grad.addColorStop(1, `rgba(${p.hue}, 0)`);
          ctx.fillStyle = grad;
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${p.hue}, ${currentAlpha})`;
          ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
          ctx.shadowBlur = 6;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default AmbientDust;

