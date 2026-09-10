import React, { useEffect, useRef } from 'react';

interface Props {
  isDark: boolean;
}

export const AnimatedRiverBackground: React.FC<Props> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes representing capillary sensor network & micro-particles
    const particleCount = Math.min(45, Math.floor(width / 30));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() * 0.4 + 0.2) * (Math.random() > 0.3 ? 1 : 0.8),
      speedY: Math.sin(Math.random() * Math.PI) * 0.25,
      opacity: Math.random() * 0.45 + 0.15,
      pulse: Math.random() * Math.PI,
    }));

    // River wave streams
    let waveStep = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      waveStep += 0.008;

      // Draw flowing river wave currents (subtle streams)
      const streamCount = 4;
      for (let s = 0; s < streamCount; s++) {
        ctx.beginPath();
        const baseY = height * (0.2 + s * 0.22);
        const amplitude = 28 + s * 8;
        const frequency = 0.0018 + s * 0.0006;
        const speedOffset = waveStep * (1.2 + s * 0.4);

        ctx.moveTo(0, baseY + Math.sin(speedOffset) * amplitude);

        for (let x = 0; x <= width; x += 25) {
          const y = baseY + Math.sin(x * frequency + speedOffset) * amplitude + Math.cos(x * 0.003 - speedOffset * 0.5) * 12;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = isDark
          ? `rgba(56, 189, 248, ${0.04 + s * 0.015})`
          : `rgba(14, 116, 144, ${0.05 + s * 0.02})`;
        ctx.lineWidth = 2.5 + s;
        ctx.stroke();
      }

      // Draw capillary network connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.speedX;
        p1.y += p1.speedY + Math.sin(waveStep + p1.x * 0.01) * 0.15;
        p1.pulse += 0.03;

        // Wrap around screen
        if (p1.x > width + 10) p1.x = -10;
        if (p1.y > height + 10) p1.y = -10;
        if (p1.y < -10) p1.y = height + 10;

        // Draw particle (micro-particle / sensor beacon)
        const currentOpacity = p1.opacity + Math.sin(p1.pulse) * 0.15;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(56, 189, 248, ${Math.max(0.08, currentOpacity)})`
          : `rgba(2, 132, 199, ${Math.max(0.12, currentOpacity)})`;
        ctx.fill();

        // Connect nearby particles with subtle capillary filaments
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 130) * (isDark ? 0.06 : 0.08);
            ctx.strokeStyle = isDark
              ? `rgba(125, 211, 252, ${lineAlpha})`
              : `rgba(3, 105, 161, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
