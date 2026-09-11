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
  Dices,
  ChevronRight,
  ChevronDown,
  Navigation,
  Check,
  HelpCircle,
  Lightbulb,
  Wind,
  Thermometer,
  Radio,
  Activity,
  Eye,
  TrendingUp
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

const TALUK_TELEMETRY = [
  {
    id: 'all',
    name: 'District Overview',
    weather: '28°C · Crisp Hill Air',
    rockTemp: '31°C (Safe Grip)',
    wind: '14 km/h East Breeze',
    visibility: '9.4 km Clear Horizon',
    activeExplorers: 184,
    idliWait: '~12 min wait',
    rushLevel: 45,
    trailStatus: 'Safe & Optimal',
    secret: {
      title: 'The Hidden Sunset Steppes of Channarayana Durga',
      coords: '13.5678° N, 77.2145° E',
      desc: 'Behind the secondary gateway of Channarayana Durga fort, follow the natural granite fissure 40m south to find an untouched boulder plateau with zero tourists and panoramic valley views.'
    }
  },
  {
    id: 'dd-hills',
    name: 'Devarayanadurga & Kyathsandra',
    weather: '25°C · Hilltop Canopy Mist',
    rockTemp: '27°C (Cool & Shaded)',
    wind: '18 km/h Mountain Breeze',
    visibility: '8.1 km (Morning Mist)',
    activeExplorers: 76,
    idliWait: '~15 min wait (Peak)',
    rushLevel: 70,
    trailStatus: 'Ideal Morning Trek',
    secret: {
      title: 'Namada Chilume Sacred Spring Secluded Stream',
      coords: '13.3644° N, 77.1942° E',
      desc: '300 meters past the deer sanctuary enclosure, an unpaved forest trail leads down to an ancient natural stone water trough fed by deep subterranean rock springs.'
    }
  },
  {
    id: 'madhugiri',
    name: 'Madhugiri Monolith',
    weather: '29°C · Sunlit Monolith',
    rockTemp: '34°C (Ascend Before 11 AM)',
    wind: '12 km/h Gentle Ridge Air',
    visibility: '11.5 km High Horizon',
    activeExplorers: 52,
    idliWait: '~8 min wait',
    rushLevel: 30,
    trailStatus: 'Granite Heat Advisory (Climb Early)',
    secret: {
      title: 'The Secret Cistern of the 3rd Gateway',
      coords: '13.6624° N, 77.2117° E',
      desc: 'At the 3rd stone bastion level, a narrow stepped cleft in the granite opens up into an underground rainwater reservoir that has stayed icy cold for over 400 years.'
    }
  },
  {
    id: 'amanikere',
    name: 'Amanikere & City Center',
    weather: '27°C · Waterfront Breeze',
    rockTemp: '28°C (Pleasant)',
    wind: '16 km/h Lake Current',
    visibility: '10.0 km Clear',
    activeExplorers: 38,
    idliWait: '~5 min wait',
    rushLevel: 25,
    trailStatus: 'Perfect Sunset Boardwalk',
    secret: {
      title: 'Lotus Wetland Wooden Gazebo Lookout',
      coords: '13.3421° N, 77.1089° E',
      desc: 'The eastern wooden boardwalk bypasses the main park crowds and features wooden benches right over the blooming lotus beds, framed by sunset reflections.'
    }
  },
  {
    id: 'kunigal',
    name: 'Kunigal & Markonahalli Dam',
    weather: '28°C · Open Reservoir Air',
    rockTemp: '30°C (Warm)',
    wind: '20 km/h Reservoir Breeze',
    visibility: '12.0 km Open Waters',
    activeExplorers: 18,
    idliWait: '~10 min wait',
    rushLevel: 35,
    trailStatus: 'Breezy Lakefront',
    secret: {
      title: 'Automatic Siphon Dam Acoustic Echo Cave',
      coords: '12.9845° N, 76.9812° E',
      desc: 'The masonry spillway at Markonahalli features 10 historic automatic siphon bells designed in 1940 — standing near the lower base creates an acoustic water chime.'
    }
  }
];

export default function Home({ user, onGetStarted, onStartPlanning, onQuickTemplate }) {
  const [showRoulette, setShowRoulette] = useState(false);
  const [selectedTalukId, setSelectedTalukId] = useState('all');
  const currentTelemetry = TALUK_TELEMETRY.find((t) => t.id === selectedTalukId) || TALUK_TELEMETRY[0];

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

      <div className="divider-gradient mx-auto max-w-5xl" />

      {/* ── LIVE TUMKUR EXPLORATION PULSE (REAL-TIME FIELD INTELLIGENCE) ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div
          className="relative rounded-[28px] sm:rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden scroll-load-reveal bg-white dark:bg-gradient-to-br dark:from-[#09101f]/95 dark:via-[#0D1424]/95 dark:to-[#080d1a]/95 border border-slate-200 dark:border-cyan-500/25 shadow-xl dark:shadow-[0_25px_70px_rgba(0,0,0,0.65),0_0_35px_rgba(34,211,238,0.08)_inset] transition-all"
        >
          {/* Luminous top scanline */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]" />

          {/* Ambient decorative glow */}
          <div className="absolute -top-28 -right-28 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase mb-3.5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>LIVE SATELLITE & SENSOR PULSE // 24/7 TUMKUR RADAR</span>
            </div>

            <h2 className="font-clash text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
              Live Tumkur <span className="text-gradient-cyan">Exploration Pulse</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
              Real-time microclimate sensors, trail granite temperatures, thatte idli kitchen load, and unmapped secret waypoints streamed live across Tumkur district.
            </p>
          </div>

          {/* Taluk Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10 relative z-10">
            {TALUK_TELEMETRY.map((taluk) => {
              const active = selectedTalukId === taluk.id;
              return (
                <button
                  key={taluk.id}
                  type="button"
                  onClick={() => setSelectedTalukId(taluk.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    active
                      ? 'bg-cyan-500 text-white dark:bg-cyan-400 dark:text-black font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-105'
                      : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-cyan-400/40'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white dark:bg-black' : 'bg-cyan-400/60'}`} />
                  <span>{taluk.name}</span>
                </button>
              );
            })}
          </div>

          {/* Telemetry 4-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10 mb-8">
            {/* Card 1: Trail Safety & Rock Heat Telemetry */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200 dark:border-white/8 hover:border-cyan-500/40 transition-all shadow-sm group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">
                      Trail Safety & Rock Heat
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500">Surface sensors & micro-climates</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  {currentTelemetry.trailStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Ambient Weather</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">{currentTelemetry.weather}</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Granite Surface Heat</p>
                  <p className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400">{currentTelemetry.rockTemp}</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Wind className="w-3 h-3 text-cyan-400" /> Wind Velocity
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">{currentTelemetry.wind}</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-cyan-400" /> Visibility Range
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">{currentTelemetry.visibility}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-200 dark:border-white/5">
                <span>Station: Tumkur Met Ground Node</span>
                <span className="text-cyan-500 dark:text-cyan-400">Live Calibration Active</span>
              </div>
            </div>

            {/* Card 2: Kyathsandra Thatte Idli Rush-O-Meter */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200 dark:border-white/8 hover:border-amber-500/40 transition-all shadow-sm group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors">
                      Thatte Idli Rush-O-Meter
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500">Kyathsandra & Highway Joint Load</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
                  {currentTelemetry.idliWait}
                </span>
              </div>

              {/* Kitchen Load Bar */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 mb-4">
                <div className="flex items-center justify-between text-xs mb-2 font-mono">
                  <span className="text-slate-500">Kitchen & Counter Density</span>
                  <span className="font-bold text-amber-500">{currentTelemetry.rushLevel}% Occupancy</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${currentTelemetry.rushLevel}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Butter Batch Status</p>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Fresh Churned Benne
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Sambar Pipeline</p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Steaming & Refilled</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-200 dark:border-white/5">
                <span>Joint: Shivanna / Ravi / Pavithra Hub</span>
                <span className="text-amber-500">Fast Table Turn</span>
              </div>
            </div>

            {/* Card 3: Live Explorer Activity Radar */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200 dark:border-white/8 hover:border-violet-500/40 transition-all shadow-sm group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-400">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-violet-400 transition-colors">
                      Live Explorer Activity Radar
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500">Autonomous itinerary telemetry</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-violet-500/10 border border-violet-500/30 text-violet-600 dark:text-violet-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
                  <span>{currentTelemetry.activeExplorers} Active</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Zero-Backtracking Savings</p>
                  <p className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400">14.6 km avg loop cut</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Most Chained Stop</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">Namada Chilume → DD Hills</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Morning departures trending towards Devarayanadurga summit trails</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-200 dark:border-white/5">
                <span>Mesh Network: Navora AI Nodes</span>
                <span className="text-emerald-500">Low Congestion</span>
              </div>
            </div>

            {/* Card 4: Daily AI Secret Viewpoint & Coordinates */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200 dark:border-white/8 hover:border-cyan-500/40 transition-all shadow-sm group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">
                      Secret Waypoint Intelligence
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500">Unmapped vantage points & spots</p>
                  </div>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-md bg-white dark:bg-black/40 border border-slate-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-300 font-bold">
                  {currentTelemetry.secret.coords}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-500/20 mb-4">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-cyan-300 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  {currentTelemetry.secret.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentTelemetry.secret.desc}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 mb-4 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Zero crowd congestion recorded today. Best visited before direct sunlight.</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-200 dark:border-white/5">
                <span>Discovered via NAVORA Topo-Scan</span>
                <span className="text-cyan-400 font-semibold">Ready to Route</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Action & Quick Planning CTAs */}
          <div className="pt-6 border-t border-slate-200 dark:border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono text-center sm:text-left">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
              <span>All 10 Taluk Nodes Streaming · Real-Time Zero-Backtracking Engine Ready</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowRoulette(true)}
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-cyan-400/50 text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <Dices className="w-4 h-4 text-pink-400" />
                <span>Spin Vibe Roulette</span>
              </button>

              <button
                type="button"
                onClick={onGetStarted || onStartPlanning}
                className="btn-primary w-full sm:w-auto text-xs sm:text-sm !py-3 !px-6 !rounded-xl cursor-pointer group shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
                <span>Launch Day Planner</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
