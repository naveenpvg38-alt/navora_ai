import React, { useEffect, useRef } from 'react';

/**
 * High-performance, zero-dependency interactive canvas background.
 * Renders glowing waypoint nodes and dynamic route connection lines.
 * Automatically pauses when off-screen to preserve CPU/battery.
 */
export default function HeroBackgroundAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId;
    let isVisible = true;
    let width = 0;
    let height = 0;

    // Mouse tracking with smooth return
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Handle high-DPI crisp rendering and sizing
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Node count based on screen width
    const nodeCount = Math.max(24, Math.min(50, Math.floor(window.innerWidth / 30)));

    // Theme detection
    const isDark = () => document.documentElement.classList.contains('dark');

    // Create particles (representing Tumkur route coordinate waypoints)
    const particles = Array.from({ length: nodeCount }).map(() => ({
      x: Math.random() * (width || 800),
      y: Math.random() * (height || 600),
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2.2 + 1.2,
      baseAlpha: Math.random() * 0.5 + 0.35,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulsePhase: Math.random() * Math.PI * 2,
      // Color variant: 0 = cyan, 1 = violet, 2 = emerald/amber
      colorType: Math.random() > 0.4 ? 0 : (Math.random() > 0.5 ? 1 : 2),
    }));

    // Visibility observer to halt animation when user scrolls past hero
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let lastTime = performance.now();

    function render(currentTime) {
      if (!isVisible) {
        animId = null;
        return;
      }

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      const dark = isDark();

      // Palette definitions
      const colors = dark
        ? {
            cyan: 'rgba(56, 189, 248, ',
            violet: 'rgba(129, 140, 248, ',
            emerald: 'rgba(52, 211, 153, ',
            line: 'rgba(56, 189, 248, ',
            lineAlt: 'rgba(129, 140, 248, ',
          }
        : {
            cyan: 'rgba(2, 132, 199, ',
            violet: 'rgba(99, 102, 241, ',
            emerald: 'rgba(16, 185, 129, ',
            line: 'rgba(2, 132, 199, ',
            lineAlt: 'rgba(99, 102, 241, ',
          };

      // 1. Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update positions with delta time
        p.x += p.vx * delta * 60;
        p.y += p.vy * delta * 60;

        // Wrap around boundaries
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // Mouse gentle magnetic interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 0.8;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }

        // Pulse alpha
        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.2;
        const clampedAlpha = Math.max(0.15, Math.min(0.9, currentAlpha));

        const baseColor =
          p.colorType === 0
            ? colors.cyan
            : p.colorType === 1
            ? colors.violet
            : colors.emerald;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor}${clampedAlpha})`;
        ctx.shadowColor = `${baseColor}0.6)`;
        ctx.shadowBlur = dark ? 8 : 4;
        ctx.fill();

        // Subtle glow halo for larger nodes
        if (p.radius > 2.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `${baseColor}${clampedAlpha * 0.15})`;
          ctx.shadowBlur = 0;
          ctx.fill();
        }
      }

      ctx.shadowBlur = 0; // reset shadow for lines

      // 2. Draw Dynamic Connecting Route Lines between nearby waypoints
      const maxDistance = Math.min(125, width * 0.28);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * (dark ? 0.22 : 0.14);
            const lineColor = i % 2 === 0 ? colors.line : colors.lineAlt;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${lineColor}${lineAlpha})`;
            ctx.lineWidth = dark ? 0.85 : 0.7;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-85 dark:opacity-90 transition-opacity duration-500"
      />
    </div>
  );
}
