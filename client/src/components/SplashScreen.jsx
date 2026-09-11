import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function SplashScreen({ onComplete }) {
  const { theme, toggleTheme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Status message sequence milestones
  const sequence = [
    { at: 0, text: 'Calibrating Tumkur geo-coordinates...', n1: false, n2: false, n3: false },
    { at: 28, text: 'Optimizing Devarayanadurga sunrise trails...', n1: true, n2: false, n3: false },
    { at: 58, text: 'Sequencing Kyathsandra Thatte Idli stops...', n1: true, n2: true, n3: false },
    { at: 86, text: 'Synthesizing zero-backtracking circuit...', n1: true, n2: true, n3: true },
    { at: 100, text: 'Itinerary curated. Welcome to NAVORA AI.', n1: true, n2: true, n3: true },
  ];

  const handleFinish = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete?.();
    }, 450);
  }, [onComplete]);

  // Smooth loading progression over ~2.6s
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2600; // 2.6 seconds

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);

      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        // Short pause at 100% to let user see "Itinerary curated" completion
        setTimeout(() => {
          handleFinish();
        }, 380);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [handleFinish]);

  // Keyboard shortcut (Escape or Space to skip)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  // Derive current status stage
  const currentStage =
    sequence.slice().reverse().find((s) => progress >= s.at) || sequence[0];

  // SVG route path dash calculation (track length is approx 490px)
  const pathTotalLength = 490;
  const dashOffset = Math.max(0, pathTotalLength - (progress / 100) * pathTotalLength);

  const isDark = theme === 'dark';

  return (
    <div
      className={`navora-splash-root fixed inset-0 z-[99999] overflow-hidden select-none flex flex-col justify-between transition-opacity duration-500 ease-out ${
        isExiting ? 'opacity-0 scale-[0.99] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: 'var(--splash-bg)',
        color: 'var(--splash-text)',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      <style>{`
        .navora-splash-root {
          --splash-bg: #FBF8F3;
          --splash-subtle: #F3ECE2;
          --splash-text: #1C1917;
          --splash-muted: #78716C;
          --splash-dim: #A8A29E;
          --splash-coral: #FF5A5F;
          --splash-amber: #F59E0B;
          --splash-gold: #EAB308;
          --splash-card-bg: rgba(255, 255, 255, 0.75);
          --splash-card-border: rgba(120, 113, 108, 0.16);
          --splash-topo: rgba(180, 160, 140, 0.14);
          --splash-path: rgba(245, 158, 11, 0.35);
          --splash-badge-bg: rgba(245, 158, 11, 0.12);
          --splash-badge-border: rgba(245, 158, 11, 0.3);
          --splash-badge-text: #D97706;
        }

        html.dark .navora-splash-root,
        .dark .navora-splash-root {
          --splash-bg: #131110;
          --splash-subtle: #1C1917;
          --splash-text: #FAF8F5;
          --splash-muted: #A8A29E;
          --splash-dim: #78716C;
          --splash-coral: #FF6B6B;
          --splash-amber: #FBBF24;
          --splash-gold: #F59E0B;
          --splash-card-bg: rgba(28, 25, 23, 0.75);
          --splash-card-border: rgba(255, 255, 255, 0.12);
          --splash-topo: rgba(255, 255, 255, 0.06);
          --splash-path: rgba(251, 191, 36, 0.25);
          --splash-badge-bg: rgba(251, 191, 36, 0.12);
          --splash-badge-border: rgba(251, 191, 36, 0.25);
          --splash-badge-text: #FBBF24;
        }

        @keyframes ambientDrift {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(-30px, 20px) scale(1.06); }
          100% { transform: translate(20px, -25px) scale(0.96); }
        }

        @keyframes dashFlight {
          to { stroke-dashoffset: -400; }
        }

        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.35); opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .navora-splash-root .ambient-sun {
          position: absolute;
          top: -15%;
          right: -10%;
          width: 65vw;
          height: 65vw;
          max-width: 900px;
          max-height: 900px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(251, 191, 36, 0.18) 0%, rgba(255, 90, 95, 0.08) 45%, transparent 70%);
          filter: blur(80px);
          pointer-events-none;
          z-index: 1;
          animation: ambientDrift 18s ease-in-out infinite alternate;
        }

        .navora-splash-root .ambient-warmth-secondary {
          position: absolute;
          bottom: -20%;
          left: 20%;
          width: 50vw;
          height: 50vw;
          max-width: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 90, 95, 0.1) 0%, rgba(245, 158, 11, 0.05) 50%, transparent 75%);
          filter: blur(90px);
          pointer-events-none;
          z-index: 1;
        }

        .navora-splash-root .travel-motif-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events-none;
          z-index: 2;
        }

        .navora-splash-root .topo-lines {
          fill: none;
          stroke: var(--splash-topo);
          stroke-width: 1.25;
          stroke-linecap: round;
          transition: stroke 0.5s ease;
        }

        .navora-splash-root .route-arc {
          fill: none;
          stroke: var(--splash-path);
          stroke-width: 1.75;
          stroke-dasharray: 6 8;
          animation: dashFlight 30s linear infinite;
        }

        .navora-splash-root .top-telemetry {
          position: relative;
          z-index: 10;
          width: 100%;
          padding: 36px 56px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .navora-splash-root .geo-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: var(--splash-card-bg);
          border: 1px solid var(--splash-card-border);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.04);
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--splash-muted);
        }

        .navora-splash-root .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--splash-coral);
          box-shadow: 0 0 8px var(--splash-coral);
          animation: pulseGlow 2.5s ease-in-out infinite;
        }

        .navora-splash-root .hero-container {
          position: relative;
          z-index: 10;
          padding: 0 56px 64px 64px;
          max-width: 1050px;
          margin-top: auto;
        }

        .navora-splash-root .overline-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border-radius: 9999px;
          background: var(--splash-badge-bg);
          border: 1px solid var(--splash-badge-border);
          color: var(--splash-badge-text);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 20px;
          animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s backwards;
        }

        .navora-splash-root .brand-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(3.25rem, 7vw, 6.25rem);
          font-weight: 900;
          line-height: 0.98;
          letter-spacing: -0.035em;
          color: var(--splash-text);
          margin-bottom: 18px;
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.25s backwards;
        }

        .navora-splash-root .gradient-ai {
          background: linear-gradient(135deg, var(--splash-coral) 0%, var(--splash-amber) 55%, var(--splash-gold) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          position: relative;
          padding-right: 0.05em;
        }

        .navora-splash-root .brand-tagline {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(1.2rem, 2.1vw, 1.75rem);
          font-weight: 500;
          letter-spacing: -0.015em;
          color: var(--splash-muted);
          margin-bottom: 34px;
          line-height: 1.35;
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s backwards;
        }

        .navora-splash-root .brand-tagline strong {
          color: var(--splash-text);
          font-weight: 700;
        }

        .navora-splash-root .loading-block {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.45s backwards;
          max-width: 580px;
          width: 100%;
        }

        .navora-splash-root .route-meter {
          position: relative;
          width: 100%;
          height: 48px;
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }

        .navora-splash-root .route-svg {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .navora-splash-root .route-bg-line {
          fill: none;
          stroke: var(--splash-card-border);
          stroke-width: 3;
          stroke-linecap: round;
        }

        .navora-splash-root .route-drawn-line {
          fill: none;
          stroke: url(#coral-amber-grad);
          stroke-width: 3.5;
          stroke-linecap: round;
          stroke-dasharray: 490;
          transition: stroke-dashoffset 0.08s linear;
        }

        .navora-splash-root .beacon-rover {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events-none;
          transition: left 0.08s linear;
          z-index: 12;
        }

        .navora-splash-root .rover-core {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--splash-coral), var(--splash-amber));
          box-shadow: 0 0 14px var(--splash-coral);
          border: 2px solid var(--splash-bg);
        }

        .navora-splash-root .rover-halo {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: var(--splash-coral);
          opacity: 0.4;
          animation: pulseGlow 1.8s ease-in-out infinite;
        }

        .navora-splash-root .milestones {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 8;
        }

        .navora-splash-root .milestone-node {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background-color: var(--splash-bg);
          border: 2px solid var(--splash-dim);
          transition: all 0.3s ease;
          position: relative;
        }

        .navora-splash-root .milestone-node.active {
          border-color: var(--splash-coral);
          background-color: var(--splash-amber);
          box-shadow: 0 0 9px var(--splash-amber);
          transform: scale(1.15);
        }

        .navora-splash-root .loading-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12.5px;
          color: var(--splash-muted);
        }

        .navora-splash-root .loading-status-text {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .navora-splash-root .status-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--splash-amber);
          animation: pulseGlow 2s infinite;
        }

        .navora-splash-root .progress-percent {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          color: var(--splash-coral);
        }

        @media (max-width: 768px) {
          .navora-splash-root .top-telemetry {
            padding: 24px 20px;
          }
          .navora-splash-root .hero-container {
            padding: 0 20px 40px 20px;
          }
          .navora-splash-root .brand-title {
            font-size: 3rem;
          }
          .navora-splash-root .geo-pill {
            font-size: 9.5px;
            padding: 5px 10px;
          }
        }
      `}</style>

      {/* WARM SUNLIGHT AMBIENT LIGHT MESH */}
      <div className="ambient-sun"></div>
      <div className="ambient-warmth-secondary"></div>

      {/* TRAVEL MOTIF VECTOR CANVAS: TOPOGRAPHY, SILHOUETTES & FLIGHT PATH */}
      <svg
        className="travel-motif-canvas"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="coral-amber-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF5A5F" />
            <stop offset="55%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <linearGradient id="horizon-fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#FF5A5F" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Faint Topographic Contour Curves Across Right & Center */}
        <path className="topo-lines" d="M 650,-50 C 950,180 1200,80 1500,240 S 1900,120 2050,300" />
        <path className="topo-lines" d="M 580,-20 C 880,220 1150,130 1450,290 S 1850,180 2050,360" />
        <path className="topo-lines" d="M 520,30 C 820,260 1100,180 1400,340 S 1800,240 2050,420" />
        <path className="topo-lines" d="M 450,90 C 750,310 1050,230 1350,390 S 1750,300 2050,480" />
        <path className="topo-lines" d="M 900,450 C 1200,600 1450,520 1750,680 S 1950,620 2050,750" />
        <path className="topo-lines" d="M 850,510 C 1150,660 1400,580 1700,740 S 1900,680 2050,810" />

        {/* Distant Mountain / Horizon Silhouette Layer in Lower Right */}
        <path fill="url(#horizon-fade)" d="M 700,1080 L 700,880 Q 950,740 1150,820 T 1550,780 Q 1750,850 1920,810 L 1920,1080 Z" />

        {/* Dotted Travel Flight Path Arcing from Origin to Destination */}
        <path className="route-arc" d="M 220,1020 Q 850,380 1720,220" />

        {/* Destination Star Waypoint */}
        <circle cx="1720" cy="220" r="4.5" fill="#F59E0B" opacity="0.65" />
        <circle
          cx="1720"
          cy="220"
          r="14"
          stroke="#F59E0B"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          fill="none"
          opacity="0.4"
        />
      </svg>

      {/* ── TOP ASYMMETRIC TELEMETRY BAR ────────────────────────────────── */}
      <header className="top-telemetry">
        <div className="geo-pill">
          <span className="live-dot"></span>
          <span>TUMKUR DISTRICT · 13.34°N, 77.10°E · ALT 822M</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
            style={{
              background: 'var(--splash-card-bg)',
              border: '1px solid var(--splash-card-border)',
              backdropFilter: 'blur(12px)',
              color: 'var(--splash-text)',
            }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          {/* Quick Skip Button */}
          <button
            type="button"
            onClick={handleFinish}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'var(--splash-card-bg)',
              border: '1px solid var(--splash-card-border)',
              backdropFilter: 'blur(12px)',
              color: 'var(--splash-muted)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
            aria-label="Skip splash screen"
          >
            Skip ➔
          </button>
        </div>
      </header>

      {/* ── ASYMMETRIC LOWER-THIRD BRAND HERO ────────────────────────────── */}
      <main className="hero-container">
        {/* Micro Overline Badge */}
        <div className="overline-badge">
          <span>✦</span>
          <span>Autonomous Travel Intelligence</span>
        </div>

        {/* Asymmetric Master Wordmark */}
        <h1 className="brand-title">
          NAVORA <span className="gradient-ai">AI</span>
        </h1>

        {/* Editorial Tagline */}
        <p className="brand-tagline">
          Plan less, <strong>Experience more.</strong>
        </p>

        {/* Organic Drawn Route Loading Indicator */}
        <div className="loading-block">
          <div className="route-meter">
            <svg className="route-svg" viewBox="0 0 500 48" preserveAspectRatio="none">
              {/* Background Base Track */}
              <path className="route-bg-line" d="M 0,24 Q 130,8 250,24 T 500,24" />
              {/* Animated Drawn Route Path */}
              <path
                className="route-drawn-line"
                d="M 0,24 Q 130,8 250,24 T 500,24"
                style={{
                  strokeDashoffset: dashOffset,
                }}
              />
            </svg>

            {/* Traveling Beacon Rover Head */}
            <div
              className="beacon-rover"
              style={{
                left: `${progress}%`,
              }}
            >
              <div className="rover-halo"></div>
              <div className="rover-core"></div>
            </div>

            {/* Waypoint Milestone Nodes */}
            <div className="milestones">
              <div className="milestone-node active" title="Departure"></div>
              <div
                className={`milestone-node ${currentStage.n1 ? 'active' : ''}`}
                title="Optimization"
              ></div>
              <div
                className={`milestone-node ${currentStage.n2 ? 'active' : ''}`}
                title="Waypoint Sequencing"
              ></div>
              <div
                className={`milestone-node ${currentStage.n3 ? 'active' : ''}`}
                title="Experience Complete"
              ></div>
            </div>
          </div>

          {/* Live Loading Status & Smooth Counter */}
          <div className="loading-status-bar">
            <div className="loading-status-text">
              <span className="status-pulse"></span>
              <span>{currentStage.text}</span>
            </div>
            <div className="progress-percent">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

