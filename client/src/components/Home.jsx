import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Compass,
  MapPin,
  Clock,
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
          {/* Overline badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/4 border border-slate-200 dark:border-white/10 mb-6 sm:mb-8 animate-fade-up shadow-sm dark:shadow-none">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse-glow" />
            <span className="label-overline text-cyan-700 dark:text-cyan-400">Tumkur · AI-Powered Outing Planner</span>
          </div>

          {/* Hero headline */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight leading-[1.1] animate-fade-up">
            Plan less,{' '}
            <span className="text-gradient-cyan-animated drop-shadow-[0_0_25px_rgba(34,211,238,0.25)]">Experience</span>
            {' '}more.
          </h1>

          {/* ── Single-Line Project Route Animation for Tagline ── */}
          <div className="relative w-full max-w-xl sm:max-w-2xl mx-auto my-7 sm:my-9 px-4 sm:px-6 select-none animate-fade-up">
            {/* The Single Route Rail Line */}
            <div className="relative h-[2.5px] sm:h-[3px] w-full bg-slate-200 dark:bg-white/10 rounded-full">
              {/* Glowing Route Base Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 opacity-70 rounded-full" />

              {/* Moving Laser Sweep Beam along the single line */}
              <div className="animate-laser-line rounded-full pointer-events-none" />

              {/* Traveling GPS Rover Beacon */}
              <div className="absolute -top-[8px] sm:-top-[9px] animate-route-travel z-20 flex items-center justify-center pointer-events-none">
                <div className="relative flex items-center justify-center">
                  {/* Radar ping */}
                  <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-cyan-400 opacity-75" />
                  {/* Center glowing beacon puck */}
                  <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 sm:h-5 sm:w-5 bg-gradient-to-tr from-cyan-500 to-blue-500 shadow-[0_0_14px_#22d3ee] border-2 border-white dark:border-[#0B1120]">
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                  </span>
                </div>
              </div>

              {/* 5 Project Waypoints along the Single Line */}
              <div className="absolute inset-0 flex justify-between items-center -top-[6px] sm:-top-[7px]">
                {[
                  { emoji: '📍', name: 'Tumkur', sub: 'Start' },
                  { emoji: '⛰️', name: 'DD Hills', sub: 'Sunrise' },
                  { emoji: '🍽️', name: 'Thatte Idli', sub: 'Food Stop' },
                  { emoji: '🏰', name: 'Madhugiri', sub: 'Trek' },
                  { emoji: '✨', name: 'Experience', sub: 'Destination' },
                ].map((stop, idx) => (
                  <div key={idx} className="relative flex flex-col items-center group">
                    {/* Waypoint milestone pin */}
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white dark:bg-[#0B1120] border-2 border-cyan-500 dark:border-cyan-400 flex items-center justify-center shadow-sm z-10 transition-transform group-hover:scale-125">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    </div>

                    {/* Waypoint Label */}
                    <div className="absolute top-5 sm:top-6 flex flex-col items-center whitespace-nowrap pointer-events-none">
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <span>{stop.emoji}</span>
                        <span className="hidden xs:inline">{stop.name}</span>
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                        {stop.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Caption underneath the single-line route */}
            <div className="mt-12 sm:mt-14 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400/90">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span>AI Route Trajectory · Zero Backtracking Circuit</span>
            </div>
          </div>

          {/* Glowing Live Typewriter Pill */}
          <div className="flex flex-col items-center mb-8 animate-fade-up">
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

      <div className="divider-gradient mx-auto max-w-5xl" />

      {/* ── READY TO EXPLORE CTA ──────────────────────── */}
      <section className="py-20 px-5 sm:px-8 max-w-5xl mx-auto">
        <div
          className="relative rounded-3xl p-8 sm:p-14 text-center overflow-hidden scroll-load-reveal bg-white dark:bg-gradient-to-br dark:from-[#0D1224]/95 dark:to-[#151D30]/90 border border-slate-200 dark:border-cyan-500/25 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_35px_rgba(34,211,238,0.08)_inset] transition-all"
        >
          {/* Ambient decorative glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-violet-600/10 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="label-overline text-cyan-600 dark:text-cyan-400 mb-2 block">Tumkur Outing Intelligence</span>
            <h3 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Ready to Discover Tumkur with AI?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
              {user
                ? 'Your personalized outing workspace is ready. Hop directly into the planner to discover fresh scenic trails and iconic eats.'
                : 'Craft your perfect day in seconds — generate intelligent, zero-backtracking routes tailored exclusively for Tumkur.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={onGetStarted || onStartPlanning}
                className="btn-primary text-[15px] !py-3.5 !px-8 !rounded-2xl cursor-pointer group shadow-glow-sm hover:shadow-glow-md transition-all"
              >
                {user ? (
                  <>
                    <Compass className="w-4.5 h-4.5 text-cyan-300 group-hover:rotate-45 transition-transform duration-300" />
                    <span>Explore Tumkur Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    <Compass className="w-4.5 h-4.5 text-cyan-300 group-hover:rotate-45 transition-transform duration-300" />
                    <span>Start Exploring</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
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
