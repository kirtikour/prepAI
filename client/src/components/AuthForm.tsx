'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface AuthFormProps {
  initialMode: 'login' | 'signup';
}

export default function AuthForm({ initialMode }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, signup, error: authError, clearError, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMode(initialMode);
    clearError();
    setLocalError(null);
    setSuccessMessage(null);
  }, [initialMode, clearError]);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSwitchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    clearError();
    setLocalError(null);
    setSuccessMessage(null);
    if (newMode === 'login') {
      router.push('/login');
    } else {
      router.push('/signup');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    clearError();

    // Client-side validation
    if (mode === 'signup' && !name.trim()) {
      setLocalError('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setLocalError('Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    if (password.toLowerCase() === email.toLowerCase()) {
      setLocalError('Password cannot be the same as your email address');
      return;
    }

    setSubmitting(true);
    let success = false;

    if (mode === 'login') {
      success = await login(email, password);
    } else {
      success = await signup(name, email, password);
    }

    setSubmitting(false);

    if (success) {
      const msg = mode === 'signup' 
        ? 'Account created successfully! Redirecting you to the dashboard...'
        : 'Welcome back! Redirecting you to the dashboard...';
      setSuccessMessage(msg);
      router.push('/dashboard');
    }
  };



  const displayError = localError || authError;

  return (
    <div className="w-full max-w-5xl bg-white border border-outline-variant/60 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
      {/* Left Panel: Auth Form */}
      <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-surface-container-lowest">
        
        {/* Top brand row */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-200">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <span className="font-title-lg text-title-lg font-bold text-on-surface">PrepAI</span>
          </Link>
          
          <div className="flex bg-surface-container-low p-1 rounded-xl items-center border border-outline-variant/30">
            <button
              onClick={() => handleSwitchMode('login')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                mode === 'login' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleSwitchMode('signup')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                mode === 'signup' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          {/* Mobile/Tablet Gemini Brand Banner */}
          <div className="lg:hidden flex justify-center mb-6 w-full">
            <img 
              src="/gemini.png" 
              alt="Gemini AI Powered prepAI" 
              className="rounded-2xl border border-outline-variant/60 shadow-md max-h-36 object-cover w-full opacity-95"
            />
          </div>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight leading-none mb-3">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-body-md text-on-surface-variant">
              {mode === 'login' 
                ? 'Maximize your interview performance with AI' 
                : 'Join top-tier developers practicing with Gemini AI'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    person
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md font-body-md"
                    placeholder="Alex Johnson"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  mail
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md font-body-md"
                  placeholder="alex@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block font-label-md text-label-md text-on-surface">Password</label>
                {mode === 'login' && (
                  <a className="text-primary font-semibold text-xs hover:underline" href="#">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  lock
                </span>
                <input
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md font-body-md"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={submitting}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {displayError && (
              <div className="p-3.5 bg-error/5 rounded-xl border border-error/20 flex gap-3 items-start animate-fade-in">
                <span className="material-symbols-outlined text-error text-[18px]">error</span>
                <p className="font-label-md text-label-md text-error leading-snug">{displayError}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3.5 bg-green-50 rounded-xl border border-green-250 flex gap-3 items-start animate-fade-in">
                <span className="material-symbols-outlined text-green-700 text-[18px]">check_circle</span>
                <p className="font-label-md text-label-md text-green-700 leading-snug">{successMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/95 hover:shadow-lg active:scale-98 transition-all mt-4 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Please wait...
                </>
              ) : mode === 'login' ? (
                'Sign In to Account'
              ) : (
                'Get Started Free'
              )}
            </button>
          </form>
        </div>

        {/* Footer info row */}
        <div className="text-center mt-10">
          <p className="text-[11px] text-on-surface-variant/80">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-primary">Terms</Link> and{' '}
            <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* Right Panel: AI Showcase (Promotional Graphics/Insights) */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-950 via-primary to-indigo-900 p-12 text-white flex-col justify-between relative overflow-hidden">
        
        {/* Soft grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full">
            <span className="material-symbols-outlined text-[14px] animate-pulse text-yellow-300" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-white/95">Gemini 2.5 Active</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">The developer's edge</h3>
          <p className="text-xs text-white/80 max-w-xs leading-relaxed">
            Practice mock coding and behavior questions, get automated feedback, and level up.
          </p>
        </div>

        {/* Visual elements container */}
        <div className="relative z-10 my-6 flex flex-col gap-5">
          {/* Gemini AI Brand Image */}
          <div className="w-full flex justify-center mb-1">
            <img 
              src="/gemini.png" 
              alt="Gemini AI Powered prepAI" 
              className="rounded-2xl border border-white/20 shadow-xl max-h-48 object-cover w-full opacity-95 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          
          {/* Card 1: ATS Score Optimization */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-lg max-w-sm hover:translate-y-[-2px] transition-transform duration-300">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">ATS Optimizer</span>
              <div className="bg-green-500/20 text-green-300 font-bold text-xs px-2 py-0.5 rounded-full">
                87% Score
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-green-400 text-[16px] font-bold">check_circle</span>
                <span className="text-white/90">React Hooks architecture optimized</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-green-400 text-[16px] font-bold">check_circle</span>
                <span className="text-white/90">Resolved weakness: "Scalable State"</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-yellow-400 text-[16px] font-bold">info</span>
                <span className="text-white/70">Missing key: "Docker Containerization"</span>
              </div>
            </div>
          </div>

          {/* Card 2: AI Voice Wave Feedback */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-lg max-w-sm hover:translate-y-[-2px] transition-transform duration-300">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">Coaching Assistant</span>
              <span className="text-[10px] text-white/50">Active Session</span>
            </div>
            
            {/* Mock Audio Wave */}
            <div className="flex items-end justify-center gap-1 h-8 my-4">
              <div className="w-1 bg-white/40 h-3 rounded-full animate-pulse"></div>
              <div className="w-1 bg-white/60 h-6 rounded-full"></div>
              <div className="w-1 bg-white/80 h-5 rounded-full animate-pulse"></div>
              <div className="w-1 bg-white h-7 rounded-full"></div>
              <div className="w-1 bg-white/70 h-4 rounded-full"></div>
              <div className="w-1 bg-white/80 h-6 rounded-full animate-pulse"></div>
              <div className="w-1 bg-white/40 h-2 rounded-full"></div>
            </div>

            <p className="text-xs italic text-white/90 leading-relaxed">
              "Great articulation on your microservices scalability. Expand slightly on data partition mechanisms..."
            </p>
          </div>
        </div>

        {/* User Testimonial Bottom Row */}
        <div className="relative z-10 flex gap-3 items-center">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Candidate Profile"
            className="w-8 h-8 rounded-full border border-white/20 object-cover"
          />
          <div>
            <p className="text-[11px] font-bold leading-none">Sarah Chen</p>
            <p className="text-[9px] text-white/60">Software Engineer, Landed Offer at Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
}
