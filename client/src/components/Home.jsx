import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Wallet,
  ArrowRight,
  Sliders,
  Route,
  BookmarkCheck,
  Flame,
  Zap,
  Shield,
  Dices
} from 'lucide-react';
import VibeRouletteModal from './VibeRouletteModal';

const DISCOVER_ITEMS = [
  { emoji: '⛰️', text: 'Devarayanadurga Peak Sunrise (1,204m)' },
  { emoji: '🍽️', text: 'Kyathsandra Iconic Thatte Idli Trail' },
  { emoji: '🏰', text: 'Madhugiri Asia’s 2nd Monolith Fort Trek' },
  { emoji: '🦌', text: 'Namada Chilume Forest Spring & Deer Park' },
  { emoji: '🏞️', text: 'Amanikere Lakefront Sunset & Boating' },
  { emoji: '🛕', text: 'Historic Siddaganga Kshetra & Dasoha' },
  { emoji: '🏛️', text: 'Kaidala Masterpiece Hoysala Temple' },
  { emoji: '💧', text: 'Markonahalli Automatic Siphon Dam' },
  { emoji: '🦌', text: 'Jayamangali Blackbuck Wildlife Sanctuary' },
  { emoji: '✨', text: 'Goravanahalli Mahalakshmi Shrine' },
];

export default function Home({ user, onGetStarted, onStartPlanning, onQuickTemplate }) {
  const [showRoulette, setShowRoulette] = useState(false);
  const [discIdx, setDiscIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Smooth medium-speed typewriter loop
  useEffect(() => {
    const current = DISCOVER_ITEMS[discIdx].text;
    const speed = isDeleting ? 25 : 50;
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(current.slice(0, typedText.length + 1));
        if (typedText.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setTypedText(current.slice(0, typedText.length - 1));
        if (typedText.length - 1 === 0) {
          setIsDeleting(false);
          setDiscIdx((prev) => (prev + 1) % DISCOVER_ITEMS.length);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, discIdx]);

  // Scroll-triggered load reveal (activates when scrolling down or up)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-loaded');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const elements = document.querySelectorAll('.scroll-load-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      title: 'Instant Planning',
      desc: 'AI evaluates open hours, geographic proximity, and personal interests to build a frictionless itinerary in seconds.',
      accent: 'cyan'
    },
    {
      icon: <Wallet className="w-5 h-5 text-emerald-400" />,
      title: 'Budget Precise',
      desc: 'From free scenic trails to luxury experiences, every plan is calculated down to per-person rupee estimates.',
      accent: 'emerald'
    },
    {
      icon: <Flame className="w-5 h-5 text-amber-400" />,
      title: 'Vibe Matched',
      desc: 'Relaxed, adventurous, romantic, foodie — your outing reflects your exact mood and energy for the day.',
      accent: 'amber'
    },
    {
      icon: <Shield className="w-5 h-5 text-violet-400" />,
      title: 'Locally Curated',
      desc: 'Every location, route, and tip is handcrafted for Tumkur — no generic results from global databases.',
      accent: 'violet'
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Set Your Preferences',
      desc: 'Mood, interests, budget, group size, start time.',
      icon: <Sliders className="w-4 h-4 text-cyan-400" />,
    },
    {
      number: '02',
      title: 'Pick Your Location',
      desc: 'Choose a taluk or landmark anywhere in Tumkur.',
      icon: <MapPin className="w-4 h-4 text-violet-400" />,
    },
    {
      number: '03',
      title: 'AI Builds Your Plan',
      desc: 'Optimized routing, timings, food stops, and tips.',
      icon: <Route className="w-4 h-4 text-pink-400" />,
    },
    {
      number: '04',
      title: 'Go & Explore',
      desc: 'Save to profile, view on map, mark as complete.',
      icon: <BookmarkCheck className="w-4 h-4 text-emerald-400" />,
    }
  ];

  const accentMap = {
    cyan:    'border-cyan-500/20 text-cyan-300 bg-cyan-500/8',
    emerald: 'border-emerald-500/20 text-emerald-300 bg-emerald-500/8',
    amber:   'border-amber-500/20 text-amber-300 bg-amber-500/8',
    violet:  'border-violet-500/20 text-violet-300 bg-violet-500/8',
  };

  return (
    <div className="min-h-screen">
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Futuristic Travel-Tech Wordmark Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-white/95 dark:bg-[#09101f]/90 border border-cyan-500/35 dark:border-cyan-400/50 shadow-[0_4px_20px_rgba(0,0,0,0.06),0_0_15px_rgba(6,182,212,0.15)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35),0_0_20px_rgba(34,211,238,0.2),inset_0_1px_1px_rgba(255,255,255,0.12)] mb-6 sm:mb-8 animate-fade-up backdrop-blur-md relative overflow-hidden group">
            {/* Subtle glass reflection highlight */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/12 via-transparent to-transparent pointer-events-none rounded-full" />
            
            {/* Luminous cyan status dot */}
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            </span>

            {/* Monospaced Wordmark */}
            <span className="font-spaceMono text-[11px] sm:text-[12px] font-bold tracking-[0.14em] uppercase text-cyan-700 dark:text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.25)] select-none">
              TUMKUR · AI-POWERED OUTING PLANNER
            </span>
          </div>

          {/* Hero headline with Clash Display & Unbounded */}
          <h1 className="font-clash text-3xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 sm:mb-8 tracking-tight leading-[1.15] animate-fade-up">
            <span>Plan less,</span>{' '}
            <span className="font-unbounded tracking-normal text-gradient-cyan-animated drop-shadow-[0_0_30px_rgba(34,211,238,0.3)] inline-block">
              Experience
            </span>{' '}
            <span>more.</span>
          </h1>

          {/* Glowing Live Typewriter Pill */}
          <div className="flex flex-col items-center mb-8 sm:mb-10 animate-fade-up">
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border transition-all bg-white/90 dark:bg-[#0D1224]/75 border-slate-300/80 dark:border-cyan-500/25 shadow-sm dark:shadow-[0_0_20px_rgba(34,211,238,0.12)]"
              style={{
                backdropFilter: 'blur(16px)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Discovering:
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1.5 min-w-[200px] sm:min-w-[250px] text-left">
                <span>{DISCOVER_ITEMS[discIdx].emoji}</span>
                <span className="text-cyan-600 dark:text-cyan-300">{typedText}</span>
                <span className="text-cyan-500 dark:text-cyan-400 font-mono animate-pulse">|</span>
              </span>
            </div>
          </div>


          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up">
            <button
              onClick={onGetStarted || onStartPlanning}
              className="btn-primary w-full sm:w-auto text-[14px] sm:text-[15px] !py-3.5 !px-7 !rounded-2xl cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setShowRoulette(true)}
              className="btn-secondary w-full sm:w-auto text-[14px] sm:text-[15px] !py-3.5 !px-6 !rounded-2xl !gap-2 cursor-pointer hover:border-cyan-400/40 transition-all group"
            >
              <Dices className="w-4 h-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
              <span>🎲 Surprise Vibe Roulette</span>
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-white/6">
            {[
              { val: '99%',  label: 'Match Accuracy',   color: 'text-cyan-400' },
              { val: '4×',   label: 'Faster Planning',  color: 'text-violet-400' },
              { val: '₹0+',  label: 'Flexible Budget',  color: 'text-emerald-400' },
              { val: '100%', label: 'Tumkur Exclusive', color: 'text-amber-400' },
            ].map((s, i) => (
              <div key={i} className="stat-card text-center !p-3 sm:!p-5">
                <div className={`font-mono text-xl sm:text-3xl font-bold ${s.color} mb-1`}>
                  {s.val}
                </div>
                <div className="text-slate-500 text-[10px] sm:text-[11px] font-medium tracking-wide uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-gradient mx-auto max-w-5xl" />

      {/* ── BENEFITS ──────────────────────────────────── */}
      <section className="py-12 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 scroll-load-reveal">
          <p className="label-overline mb-3">Why Choose Navora</p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Built for Tumkur Explorers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b, i) => (
            <div
              key={i}
              className={`glass-card p-6 group cursor-default scroll-load-reveal scroll-delay-${(i % 4) + 1}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 border ${accentMap[b.accent]} transition-transform group-hover:scale-110`}>
                {b.icon}
              </div>
              <h3 className="text-white font-semibold text-base mb-2 tracking-tight">{b.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider-gradient mx-auto max-w-5xl" />

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 scroll-load-reveal">
          <p className="label-overline mb-3">The Process</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Four Steps. One Perfect Day.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`relative p-6 rounded-2xl bg-navora-card border border-white/5 hover:border-white/10 transition-all duration-300 group scroll-load-reveal scroll-delay-${(i % 4) + 1}`}
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-9 -right-2.5 w-5 h-px bg-gradient-to-r from-white/15 to-transparent z-10" />
              )}
              <div className="flex items-center justify-between mb-5">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center group-hover:border-white/15 transition-colors">
                  {step.icon}
                </div>
                <span className="font-mono text-xs font-bold text-white/15 group-hover:text-white/30 transition-colors">{step.number}</span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{step.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>



      {/* Vibe Roulette Modal */}
      <VibeRouletteModal
        isOpen={showRoulette}
        onClose={() => setShowRoulette(false)}
        onSelectVibe={onQuickTemplate}
      />
    </div>
  );
}
