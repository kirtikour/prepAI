'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/60 mt-auto shrink-0 relative overflow-hidden">
      {/* Visual Accent Gradient bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-primary/30 via-primary to-indigo-600/30"></div>

      <div className="px-margin-desktop py-16 max-w-container-max mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-200">
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
              <span className="font-headline-md text-headline-md font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                PrepAI
              </span>
            </Link>
            <p className="text-body-md text-on-surface-variant max-w-sm leading-relaxed">
              Supercharge your career prep. Practice interviews with feedback, analyze ATS compatibility, and refine your resume using Gemini intelligence.
            </p>
            
            {/* Newsletter Input Form */}
            <div className="space-y-3 max-w-sm">
              <p className="font-label-md text-label-md font-bold text-on-surface">Subscribe to our newsletter</p>
              <form onSubmit={handleSubscribe} className="relative flex gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    mail
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/80 rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white font-label-md px-5 py-2.5 rounded-xl hover:bg-primary/95 active:scale-95 transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Join
                </button>
              </form>
              {subscribed && (
                <p className="text-green-700 font-label-sm text-label-sm flex items-center gap-1.5 animate-fade-in">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Thank you! You've been subscribed.
                </p>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-200" title="Twitter">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-200" title="GitHub">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-200" title="LinkedIn">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-200" title="Discord">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Column 1: Product */}
            <div className="space-y-4">
              <p className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider text-[11px]">
                Product
              </p>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/resume" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    Resume Checker
                  </Link>
                </li>
                <li>
                  <Link href="/interview" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    AI Interview
                  </Link>
                </li>
                <li>
                  <Link href="/quizzes" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    Practice Quizzes
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    Pricing Plans
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="space-y-4">
              <p className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider text-[11px]">
                Resources
              </p>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/documentation" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    Docs & Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    Interview Prep Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/health" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    System Status
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="space-y-4">
              <p className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider text-[11px]">
                Company
              </p>
              <ul className="space-y-2.5">
                <li>
                  <Link href="#" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    Partnerships
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div className="space-y-4">
              <p className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider text-[11px]">
                Legal
              </p>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/terms" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    Cookie Settings
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
                    Security Info
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="border-t border-outline-variant/50 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-label-sm text-label-sm text-on-surface-variant/80">
            © {new Date().getFullYear()} PrepAI. Designed for outstanding candidates.
          </p>
          <p className="font-label-sm text-label-sm text-on-surface-variant/50">
            Powered by Gemini 2.5 Flash
          </p>
        </div>
      </div>
    </footer>
  );
}
