import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 200);
          return 100;
        }
        return prev + 2.5;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070B14] overflow-hidden select-none px-6">
      {/* Soft, minimal ambient background glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none -z-10 translate-x-20 translate-y-20" />

      {/* Main Minimalist Center Container */}
      <div className="flex flex-col items-center text-center max-w-sm w-full animate-fade-up">

        {/* 1. Single-Line Brandmark: NAVORA · AI */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap mb-3">
          <span className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.15)]">
            NAVORA
          </span>

          {/* Pulsing Neon Beacon Dot */}
          <span className="relative flex h-2.5 sm:h-3 w-2.5 sm:w-3 mx-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 sm:h-3 w-2.5 sm:w-3 bg-cyan-400 shadow-[0_0_12px_#22d3ee]"></span>
          </span>

          <span className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-gradient-cyan drop-shadow-[0_2px_20px_rgba(34,211,238,0.3)]">
            AI
          </span>
        </div>

        {/* 2. Tagline */}
        <p className="text-slate-400 text-sm sm:text-base font-normal tracking-wide mb-8">
          Plan less, <span className="text-cyan-300 font-medium">Experience more.</span>
        </p>

        {/* 3. Ultra-Clean Minimalist Progress Line */}
        <div className="w-48 sm:w-56">
          <div className="w-full h-[2.5px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100 ease-linear"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #22D3EE 0%, #6366F1 100%)',
                boxShadow: '0 0 10px rgba(34,211,238,0.6)',
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
