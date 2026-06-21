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
    <div className="w-full max-w-md bg-white border border-outline-variant/60 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col bg-surface-container-lowest animate-fade-in">
      {/* Top brand row */}
      <div className="flex justify-between items-center mb-6">
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
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              mode === 'login' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleSwitchMode('signup')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
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
      <div className="flex-1 flex flex-col justify-center w-full">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-none mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-xs text-on-surface-variant">
            {mode === 'login' 
              ? 'Maximize your interview performance with AI' 
              : 'Join top-tier developers practicing with Gemini AI'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block font-label-md text-xs text-on-surface mb-1">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  person
                </span>
                <input
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
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
            <label className="block font-label-md text-xs text-on-surface mb-1">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                mail
              </span>
              <input
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                placeholder="alex@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-label-md text-xs text-on-surface">Password</label>
              {mode === 'login' && (
                <a className="text-primary font-semibold text-[10px] hover:underline" href="#">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                lock
              </span>
              <input
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
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
                <span className="material-symbols-outlined text-[16px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="p-2.5 bg-error/5 rounded-xl border border-error/20 flex gap-2 items-start animate-fade-in">
              <span className="material-symbols-outlined text-error text-[16px]">error</span>
              <p className="font-label-md text-xs text-error leading-snug">{displayError}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-2.5 bg-green-50 rounded-xl border border-green-250 flex gap-2 items-start animate-fade-in">
              <span className="material-symbols-outlined text-green-700 text-[16px]">check_circle</span>
              <p className="font-label-md text-xs text-green-700 leading-snug">{successMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            className="w-full bg-primary text-white py-2.5 rounded-xl font-bold hover:bg-primary/95 hover:shadow-lg active:scale-98 transition-all mt-3 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs font-semibold"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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
      <div className="text-center mt-6">
        <p className="text-[10px] text-on-surface-variant/80">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-primary">Terms</Link> and{' '}
          <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
