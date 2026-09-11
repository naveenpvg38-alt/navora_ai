import React, { useState } from 'react';
import { X, Zap, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../api';

const InputField = ({ icon: Icon, type, placeholder, value, onChange, required }) => (
  <div className="relative rounded-xl bg-slate-50 dark:bg-[#0c1426] border border-slate-200 dark:border-cyan-500/25 focus-within:border-cyan-400 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-200">
    <Icon className="w-4 h-4 text-cyan-600 dark:text-cyan-400/70 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
    <input
      type={type}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-transparent outline-none font-medium"
    />
  </div>
);

export default function AuthModal({ isOpen, initialMode = 'login', onClose, onSuccess }) {
  const [mode, setMode]         = useState(initialMode);
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  React.useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = mode === 'signup'
        ? await api.signup({ name, email, password })
        : await api.login({ email, password });
      localStorage.setItem('navora_token', data.token);
      onSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await api.demoLogin();
      localStorage.setItem('navora_token', data.token);
      onSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-[#0A0E1A]/95 border border-slate-200 dark:border-white/10 shadow-2xl transition-all"
      >
        {/* Ambient glow orbs */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer bg-slate-100 dark:bg-white/4 border border-slate-200 dark:border-white/8"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Brand wordmark: NAVORA · AI */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">
                NAVORA
              </span>
              <span className="relative flex h-2 w-2 mx-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
              </span>
              <span className="font-display font-extrabold text-2xl tracking-tight text-gradient-cyan">
                AI
              </span>
            </div>
            <span className="label-overline text-slate-400 dark:text-slate-500 ml-1 pl-2 border-l border-slate-200 dark:border-white/10">Tumkur</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
            {mode === 'signup' ? 'Get Started with NAVORA AI' : 'Welcome back'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            {mode === 'signup'
              ? 'Join to discover personalized itineraries and explore Tumkur District.'
              : 'Sign in to access your saved itineraries and personalized routes.'}
          </p>

          {/* Demo Login */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl cursor-pointer transition-all duration-200 mb-2 group bg-cyan-50 dark:bg-white/4 border border-cyan-200 dark:border-white/8 hover:border-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-500/10"
          >
            <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="font-mono text-xs tracking-widest text-cyan-800 dark:text-slate-300 font-semibold">
              ⚡ 1-CLICK DEMO ACCESS
            </span>
          </button>
          <p className="text-center text-[10px] text-slate-500 dark:text-slate-600 font-mono mb-5">
            FOR ACADEMIC EVALUATION ONLY
          </p>

          {/* Divider */}
          <div className="divider-gradient mb-5" />

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl flex items-center gap-2.5 text-xs text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/25">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1.5 ml-1">Full Name</label>
                <InputField icon={User} type="text" placeholder="e.g. Naveen Kumar"
                  value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1.5 ml-1">Email</label>
              <InputField icon={Mail} type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1.5 ml-1">Password</label>
              <InputField icon={Lock} type="password" placeholder="Min. 6 characters"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !rounded-xl !py-3.5 justify-center mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  {mode === 'signup' ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-xs text-slate-600 dark:text-slate-400 mt-5">
            {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(''); }}
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold underline underline-offset-2 cursor-pointer"
            >
              {mode === 'signup' ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
