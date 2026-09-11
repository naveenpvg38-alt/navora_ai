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
  Navigation,
  Check
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

const SIMULATED_VIBES = [
  {
    id: 'monolith-trek',
    tag: 'WEEKEND PEAK TREK',
    title: 'Madhugiri Dawn Monolith & Hot Thatte Idlis',
    icon: '🌄',
    badge: 'Adventure · 5.5 Hrs',
    matchScore: '99.4%',
    duration: '5.5 Hours',
    budget: '₹180 / person',
    transport: 'Two-Wheeler · 42 km',
    energy: 'High Energy',
    preset: {
      mood: 'Adventurous',
      interests: ['Scenic Outdoors', 'Cafes & Dining'],
      location: 'Madhugiri Fort',
      budget: 300,
      transport: 'bike',
      time: '06:00 AM'
    },
    stops: [
      {
        time: '06:30 AM',
        title: 'Madhugiri Monolith Base',
        activity: 'Sunrise ascent along Asia’s 2nd largest monolithic granite fortress',
        cost: 'Free Entry',
        category: 'Peak Trek'
      },
      {
        time: '09:15 AM',
        title: 'Kyathsandra Thatte Idli Corridor',
        activity: 'Steaming butter-soft thatte idlis with red chutney & filter coffee',
        cost: '₹80',
        category: 'Food Trail'
      },
      {
        time: '11:00 AM',
        title: 'Channarayana Durga Bastion',
        activity: 'Explore hidden stone gateways and untouched panoramic hill ridges',
        cost: 'Free Entry',
        category: 'Historic Fortress'
      }
    ]
  },
  {
    id: 'heritage-foodie',
    tag: 'TASTE & CULTURE',
    title: 'Kyathsandra Breakfast Trail & Sacred Shrines',
    icon: '🧈',
    badge: 'Foodie · 4.0 Hrs',
    matchScore: '98.8%',
    duration: '4.0 Hours',
    budget: '₹220 / person',
    transport: 'Car / Transit · 24 km',
    energy: 'Relaxed & Savoring',
    preset: {
      mood: 'Foodie',
      interests: ['Cafes & Dining', 'Heritage & Sightseeing'],
      location: 'Kyathsandra',
      budget: 500,
      transport: 'car',
      time: '08:30 AM'
    },
    stops: [
      {
        time: '08:30 AM',
        title: 'Sri Ravi Hotel, Kyathsandra',
        activity: 'Iconic hot thatte idlis soaked in spiced butter & crisp uddin vada',
        cost: '₹95',
        category: 'Iconic Breakfast'
      },
      {
        time: '10:15 AM',
        title: 'Siddaganga Hill & Bell Shrine',
        activity: 'Historic hillside promenade, panoramic Tumkur viewpoint & peaceful walk',
        cost: 'Free Entry',
        category: 'Heritage Sight'
      },
      {
        time: '11:45 AM',
        title: 'Town Market Sweets & Filter Kaapi',
        activity: 'Freshly roasted coffee and local Tumkur jaggery sweets at Gandhi Circle',
        cost: '₹75',
        category: 'Local Treats'
      }
    ]
  },
  {
    id: 'forest-springs',
    tag: 'NATURE RETREAT',
    title: 'Namada Chilume Forest Spring & DD Hills Mist',
    icon: '🌿',
    badge: 'Relaxed · 4.5 Hrs',
    matchScore: '99.1%',
    duration: '4.5 Hours',
    budget: '₹90 / person',
    transport: 'Scenic Drive · 32 km',
    energy: 'Mindful Serenity',
    preset: {
      mood: 'Relaxed',
      interests: ['Hidden Gems', 'Lake Walks'],
      location: 'Devarayanadurga',
      budget: 200,
      transport: 'bike',
      time: '07:00 AM'
    },
    stops: [
      {
        time: '07:30 AM',
        title: 'Namada Chilume Spring',
        activity: 'Perennial natural rock spring canopy and peaceful spotted deer sanctuary',
        cost: '₹20 Entry',
        category: 'Forest Oasis'
      },
      {
        time: '09:30 AM',
        title: 'DD Hills Yoga Narasimha Summit',
        activity: 'Cool hilltop breeze at 1,204m with 360-degree misty valley views',
        cost: 'Free Entry',
        category: 'Misty Summit'
      },
      {
        time: '11:15 AM',
        title: 'Kalyani Lake Garden Pavilions',
        activity: 'Ancient stone stepped tank surrounded by peaceful evergreen trees',
        cost: 'Free Entry',
        category: 'Historic Lake'
      }
    ]
  },
  {
    id: 'sunset-lake',
    tag: 'GOLDEN HOUR',
    title: 'Amanikere Lake Promenade & Twilight Cafes',
    icon: '🌅',
    badge: 'Chill · 3.0 Hrs',
    matchScore: '98.5%',
    duration: '3.0 Hours',
    budget: '₹140 / person',
    transport: 'City Mobility · 12 km',
    energy: 'Evening Breeze',
    preset: {
      mood: 'Chill',
      interests: ['Lake Walks', 'Art & Culture'],
      location: 'Amanikere',
      budget: 350,
      transport: 'bike',
      time: '04:30 PM'
    },
    stops: [
      {
        time: '04:45 PM',
        title: 'Amanikere Glass Boardwalk',
        activity: 'Lakeside garden walk, floating fountains and tranquil lotus wetland',
        cost: '₹10 Entry',
        category: 'Waterfront Promenade'
      },
      {
        time: '06:00 PM',
        title: 'Sunset Island Gazebo',
        activity: 'Watch the sun dip behind the distant monolithic Tumkur hills over water',
        cost: 'Free',
        category: 'Golden Hour'
      },
      {
        time: '07:15 PM',
        title: 'Lakeside Twilight Street Cafes',
        activity: 'Steaming ginger tea, spiced sweet corn, and live outdoor music ambience',
        cost: '₹130',
        category: 'Twilight Bites'
      }
    ]
  }
];

export default function Home({ user, onGetStarted, onStartPlanning, onQuickTemplate }) {
  const [showRoulette, setShowRoulette] = useState(false);
  const [simVibeId, setSimVibeId] = useState('monolith-trek');
  const currentSim = SIMULATED_VIBES.find((v) => v.id === simVibeId) || SIMULATED_VIBES[0];
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

      {/* ── 1-TAP VIBE ROUTE SIMULATOR ────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
        <div
          className="relative rounded-[28px] sm:rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden scroll-load-reveal bg-white dark:bg-gradient-to-br dark:from-[#09101f]/95 dark:via-[#0D1424]/95 dark:to-[#080d1a]/95 border border-slate-200 dark:border-cyan-500/25 shadow-xl dark:shadow-[0_25px_70px_rgba(0,0,0,0.65),0_0_35px_rgba(34,211,238,0.08)_inset] transition-all"
        >
          {/* Luminous top scanline */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]" />

          {/* Ambient decorative glow orbs */}
          <div className="absolute -top-28 -right-28 w-72 h-72 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-28 -left-28 w-72 h-72 bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-[90px] pointer-events-none" />

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase mb-3.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>LIVE ROUTE SIMULATOR // 0-BACKTRACKING ENGINE</span>
            </div>

            <h2 className="font-clash text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
              Simulate Your <span className="text-gradient-cyan">Tumkur Day-Route</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Tap any archetype below to preview an instant AI-synthesized day route with real waypoints, timings, and fuel-saving transit links.
            </p>
          </div>

          {/* Vibe Selection Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-8 relative z-10">
            {SIMULATED_VIBES.map((v) => {
              const active = v.id === simVibeId;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSimVibeId(v.id)}
                  className={`relative p-3.5 sm:p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 select-none overflow-hidden group ${
                    active
                      ? 'border-cyan-400 dark:border-cyan-400 bg-cyan-50/90 dark:bg-gradient-to-br dark:from-[#0E1C33] dark:to-[#081122] shadow-[0_0_20px_rgba(34,211,238,0.22)] scale-[1.02]'
                      : 'border-slate-200 dark:border-white/8 bg-slate-50/80 dark:bg-white/[0.025] hover:border-cyan-400/40 dark:hover:border-cyan-400/40 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  {/* Status dot on active */}
                  {active && (
                    <div className="absolute top-2.5 right-2.5 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl sm:text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">
                      {v.icon}
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                      active ? 'text-cyan-600 dark:text-cyan-300' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {v.tag}
                    </span>
                  </div>

                  <h4 className={`text-xs sm:text-sm font-bold tracking-tight line-clamp-1 mb-1 transition-colors ${
                    active ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}>
                    {v.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span>{v.badge}</span>
                    <span className={active ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>{v.budget}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Simulation Preview Box */}
          <div className="rounded-2xl p-5 sm:p-7 bg-slate-50/90 dark:bg-[#070B16]/90 border border-slate-200 dark:border-cyan-500/20 shadow-inner relative z-10 mb-6">
            {/* Top Telemetry Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-200 dark:border-white/8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-spaceMono text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  {currentSim.title}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3 h-3" />
                  {currentSim.matchScore} ROUTE MATCH
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300">
                  ⚡ {currentSim.transport}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 font-bold">
                  💰 {currentSim.budget}
                </span>
              </div>
            </div>

            {/* Waypoints Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative">
              {currentSim.stops.map((st, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-white/6 hover:border-cyan-400/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
                        STOP 0{idx + 1} · {st.time}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {st.cost}
                      </span>
                    </div>

                    <h5 className="font-semibold text-sm text-slate-900 dark:text-white mb-1 tracking-tight group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors">
                      {st.title}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light mb-3">
                      {st.activity}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    <span>{st.category}</span>
                    <span className="text-cyan-500/80 dark:text-cyan-400/80">Waypoint ✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Launch Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono text-center sm:text-left">
              <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Calibrated for zero-backtracking with Tumkur local topography.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onQuickTemplate ? onQuickTemplate(currentSim.preset) : (onStartPlanning && onStartPlanning())}
                className="btn-primary w-full sm:w-auto text-xs sm:text-sm !py-3.5 !px-6 !rounded-xl cursor-pointer group shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
                <span>Launch This Route in Planner</span>
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
