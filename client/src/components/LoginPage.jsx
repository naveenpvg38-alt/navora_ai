import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Clock,
  Edit3,
} from 'lucide-react';
import { api } from '../api';

export default function LoginPage({
  initialMode = 'login',
  onSuccess,
  onBack,
  onExploreAsGuest,
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [signupStep, setSignupStep] = useState('details'); // 'details' | 'verify'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');

  // OTP 6-Digit input state & refs
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [expirySeconds, setExpirySeconds] = useState(600); // 10 min
  const [resendCooldown, setResendCooldown] = useState(0);

  const input0Ref = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const otpInputRefs = [input0Ref, input1Ref, input2Ref, input3Ref, input4Ref, input5Ref];

  // OTP countdown & resend cooldown timer
  useEffect(() => {
    let interval = null;
    if (signupStep === 'verify') {
      interval = setInterval(() => {
        setExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [signupStep]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const nextDigits = [...otpDigits];
      nextDigits[index] = '';
      setOtpDigits(nextDigits);
      return;
    }

    const nextDigits = [...otpDigits];
    nextDigits[index] = cleaned[cleaned.length - 1];
    setOtpDigits(nextDigits);

    if (index < 5 && otpInputRefs[index + 1]?.current) {
      otpInputRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      if (otpInputRefs[index - 1]?.current) {
        otpInputRefs[index - 1].current.focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    if (digits.length > 0) {
      const nextDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        nextDigits[i] = digits[i] || '';
      }
      setOtpDigits(nextDigits);
      const focusIndex = Math.min(digits.length, 5);
      if (otpInputRefs[focusIndex]?.current) {
        otpInputRefs[focusIndex].current.focus();
      }
    }
  };

  // Step 1: Request Email Verification Code
  const handleSendVerificationCode = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setOtpSuccessMsg('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const data = await api.sendOtp(cleanEmail, name.trim());
      setSignupStep('verify');
      setExpirySeconds(600);
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpSuccessMsg(`Security verification code sent to ${cleanEmail}`);
      setTimeout(() => {
        if (otpInputRefs[0]?.current) otpInputRefs[0].current.focus();
      }, 100);
    } catch (err) {
      setError(err.message || 'Failed to dispatch verification code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Code and Create Explorer Account
  const handleVerifyOtpAndCreateAccount = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join('').trim();
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setError('');
    setOtpSuccessMsg('');
    setLoading(true);

    try {
      const data = await api.verifyAndSignup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        otp: fullOtp,
      });

      if (data && data.token) {
        localStorage.setItem('navora_token', data.token);
        if (data.user) {
          localStorage.setItem('navora_user', JSON.stringify(data.user));
        }
        if (onSuccess) onSuccess(data.user);
      } else {
        setError(data?.error || 'Verification failed. Please check the code.');
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend code handler
  const handleResendCode = async () => {
    if (resendCooldown > 0 || loading) return;
    setError('');
    setOtpSuccessMsg('');
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const data = await api.sendOtp(cleanEmail, name.trim());
      setResendCooldown(60);
      setExpirySeconds(600);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpSuccessMsg(`Fresh verification code sent to ${cleanEmail}`);
      setTimeout(() => {
        if (otpInputRefs[0]?.current) otpInputRefs[0].current.focus();
      }, 100);
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'signup') {
      if (signupStep === 'details') {
        return handleSendVerificationCode(e);
      } else {
        return handleVerifyOtpAndCreateAccount(e);
      }
    }

    // Login mode
    setError('');
    setLoading(true);

    try {
      const data = await api.login(email.trim().toLowerCase(), password);

      if (data && data.token) {
        localStorage.setItem('navora_token', data.token);
        if (data.user) {
          localStorage.setItem('navora_user', JSON.stringify(data.user));
        }
        if (onSuccess) onSuccess(data.user);
      } else {
        setError(data?.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Ambient background glow orbs */}
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-cyan-500/12 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/12 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[450px] h-[450px] rounded-full bg-cyan-600/10 blur-[130px] pointer-events-none" />

      {/* Top navigation row */}
      <header className="relative z-20 max-w-4xl mx-auto w-full px-5 sm:px-8 py-5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-cyan-400/40 transition-all text-xs font-medium cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={onExploreAsGuest || onBack}
          className="text-xs text-slate-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
        >
          Explore as Guest →
        </button>
      </header>

      {/* Main Single-Panel Container */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* ── SINGLE AUTH PANEL ── */}
          <div className="w-full rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 relative overflow-hidden bg-[#09101f]/95 border border-cyan-500/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(34,211,238,0.12)_inset] backdrop-blur-2xl text-white animate-fade-up">
            
            {/* Luminous top scanline */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]" />

            {/* Ambient inner card glows */}
            <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-cyan-500/10 blur-[50px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full bg-indigo-600/10 blur-[50px] pointer-events-none" />

            {/* ── TOP NAVORA AI BRANDING ── */}
            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center justify-center gap-2 mb-2">
                <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
                  NAVORA
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                </span>
                <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-gradient-cyan">
                  AI
                </span>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 ml-1">
                  Tumkur
                </span>
              </div>

              <p className="text-slate-400 text-xs sm:text-[13px] leading-relaxed max-w-sm mx-auto">
                {mode === 'signup'
                  ? signupStep === 'verify'
                    ? 'Enter the 6-digit code sent to your email to activate your account.'
                    : 'Create your account to unlock AI outing itineraries in Tumkur.'
                  : 'Sign in to access your saved itineraries and personalized routes.'}
              </p>
            </div>

            {/* Futuristic Mode Switcher (Hidden in OTP verify step) */}
            {signupStep !== 'verify' && (
              <div className="flex rounded-2xl p-1 bg-[#060a14]/90 border border-cyan-500/20 shadow-inner mb-5 relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setSignupStep('details');
                    setError('');
                    setOtpSuccessMsg('');
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_18px_rgba(34,211,238,0.35)] scale-[1.01]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setSignupStep('details');
                    setError('');
                    setOtpSuccessMsg('');
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_18px_rgba(34,211,238,0.35)] scale-[1.01]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}


            {/* Success Notification */}
            {otpSuccessMsg && (
              <div className="mb-4 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-300 animate-fade-in bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{otpSuccessMsg}</span>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3.5 rounded-2xl flex items-start sm:items-center gap-2.5 text-xs text-rose-300 animate-fade-in bg-rose-500/10 border border-rose-500/30">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5 sm:mt-0" />
                <div className="flex-1 flex flex-wrap items-center justify-between gap-1">
                  <span>{error}</span>
                  {error.toLowerCase().includes('create account') && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setSignupStep('details');
                        setError('');
                      }}
                      className="text-cyan-300 underline font-semibold hover:text-white cursor-pointer ml-1 text-xs"
                    >
                      Click here to register →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Form Views */}
            {mode === 'signup' && signupStep === 'verify' ? (
              /* ── STEP 2: 6-DIGIT SECURITY OTP CODE ENTRY ── */
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs text-slate-300 truncate">
                      Code sent to: <strong className="text-cyan-300 font-mono">{email}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSignupStep('details');
                      setError('');
                    }}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline shrink-0 ml-2 cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" /> Change
                  </button>
                </div>

                {/* 6-Digit Segmented Code Input */}
                <div className="flex justify-center items-center gap-2 sm:gap-2.5 my-4">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpInputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className="w-11 sm:w-12 h-13 sm:h-15 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl bg-[#060B16]/95 border border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_18px_rgba(34,211,238,0.4)] text-cyan-300 outline-none transition-all select-all"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                {/* Expiry & Resend Bar */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1 mb-2">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Expires: <strong className="text-cyan-300">{formatTimer(expirySeconds)}</strong></span>
                  </span>
                  {resendCooldown > 0 ? (
                    <span className="text-slate-500 text-[11px]">Resend in {resendCooldown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={loading}
                      className="text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3" /> Resend Code
                    </button>
                  )}
                </div>


                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-clash font-bold text-sm tracking-wide text-white flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.35)]"
                  style={{
                    background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #6366F1 100%)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Security Code...</span>
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-cyan-200" />
                      <span>Verify & Activate Account</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSignupStep('details');
                    setError('');
                  }}
                  className="w-full py-2.5 rounded-2xl border border-white/10 hover:border-white/20 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Account Details</span>
                </button>
              </form>
            ) : (
              /* ── STEP 1: CREDENTIALS (OR SIGN IN) ── */
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {mode === 'signup' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5 ml-1">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-cyan-300/80 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        Full Name
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">REQUIRED</span>
                    </div>
                    <div className="relative rounded-2xl bg-[#0c1426]/90 border border-cyan-500/25 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all duration-200">
                      <User className="w-4 h-4 text-cyan-400/70 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Spiderman"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 bg-transparent outline-none font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5 ml-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-cyan-300/80 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      Email Address
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">REQUIRED</span>
                  </div>
                  <div className="relative rounded-2xl bg-[#0c1426]/90 border border-cyan-500/25 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all duration-200">
                    <Mail className="w-4 h-4 text-cyan-400/70 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 bg-transparent outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5 ml-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-cyan-300/80 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      Password
                    </label>
                    {mode === 'login' && (
                      <span className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer">
                        Forgot password?
                      </span>
                    )}
                  </div>
                  <div className="relative rounded-2xl bg-[#0c1426]/90 border border-cyan-500/25 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all duration-200">
                    <Lock className="w-4 h-4 text-cyan-400/70 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 bg-transparent outline-none font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-clash font-bold text-sm tracking-wide text-white flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer transition-all duration-300 mt-2"
                  style={{
                    background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #6366F1 100%)',
                    boxShadow: '0 0 25px rgba(6,182,212,0.35), 0 8px 20px -6px rgba(59,130,246,0.5)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>
                        {mode === 'signup' ? 'Sending Verification Code...' : 'Authenticating...'}
                      </span>
                    </span>
                  ) : (
                    <>
                      {mode === 'signup' ? (
                        <>
                          <Mail className="w-4 h-4 text-cyan-200" />
                          <span>Send Verification Code</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                        </>
                      )}
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Bottom toggle / disclaimer */}
            <div className="mt-5 pt-4 border-t border-cyan-500/20 text-center space-y-2 relative z-10">
              <p className="text-xs text-slate-400">
                {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signup' ? 'login' : 'signup');
                    setSignupStep('details');
                    setError('');
                    setOtpSuccessMsg('');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-2 cursor-pointer ml-1"
                >
                  {mode === 'signup' ? 'Sign In' : 'Create Account'}
                </button>
              </p>

              <p className="text-[10px] text-slate-500">
                By continuing, you agree to NAVORA AI’s Terms of Use & Privacy Protocol.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
