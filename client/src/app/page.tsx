'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.scroll-reveal');
    animatedElements.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
      observer.observe(el);
    });

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      {/* TopNavBar */}
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 px-4 md:px-8 max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="z-10 flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full mb-6">
                <span className="material-symbols-outlined text-[16px] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="font-semibold text-xs tracking-wide uppercase">New: AI Behavioral Coaching</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-on-background mb-6 leading-tight tracking-tight">
                Ace Your Next <br className="hidden lg:inline" />
                <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Interview with AI</span>
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant mb-10 max-w-lg leading-relaxed">
                Master your presence, refine your answers, and land your dream job with real-time feedback from our intelligent coaching platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/signup" className="bg-primary text-white text-center px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:translate-y-[-2px] hover:bg-primary/95 transition-all duration-200">
                  Get Started Free
                </Link>
                <a href="#about" className="bg-white border border-outline-variant text-center px-8 py-4 rounded-xl font-bold text-on-surface hover:bg-surface-container-low transition-all duration-200 flex items-center justify-center gap-2 shadow-sm">
                  <span className="material-symbols-outlined text-lg">play_circle</span>
                  See How it Works
                </a>
              </div>
            </div>
            <div className="relative w-full max-w-xl lg:max-w-none mx-auto lg:h-[500px] flex items-center justify-center mt-12 lg:mt-0">
              <div className="absolute inset-0 bg-primary/5 rounded-[40px] rotate-3 -z-10"></div>
              <div className="absolute inset-0 bg-surface-container-high rounded-[40px] -rotate-3 -z-10"></div>
              <div className="ai-border-gradient rounded-3xl p-3 w-full shadow-2xl overflow-hidden h-[300px] sm:h-[400px] lg:h-[480px]">
                <img
                  className="w-full h-full object-cover rounded-2xl"
                  alt="PrepAI AI-powered interview coaching and ATS resume scanning dashboard"
                  src="/hero-image.webp"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trust Row */}
        <section className="bg-surface py-10 border-y border-outline-variant/60">
          <div className="max-w-container-max mx-auto px-4 md:px-8">
            <p className="text-center text-xs font-semibold text-outline mb-8 uppercase tracking-widest">
              Empowering candidates at world-class companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
              {/* Google */}
              <div className="text-on-surface-variant hover:text-[#4285F4] transition-colors duration-200" title="Google">
                <svg className="h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.92 1 1 5.92 1 12s4.92 11 11.24 11c6.59 0 11-4.63 11-11.2 0-.756-.08-1.333-.18-1.815H12.24z" />
                </svg>
              </div>
              {/* Microsoft */}
              <div className="text-on-surface-variant hover:text-[#F25022] transition-colors duration-200" title="Microsoft">
                <svg className="h-5 fill-current" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
                </svg>
              </div>
              {/* Meta */}
              <div className="text-on-surface-variant hover:text-[#0668E1] transition-colors duration-200" title="Meta">
                <svg className="h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.51 6.06c-1.378 0-2.637.57-3.418 1.482-.78-.912-2.04-1.482-3.418-1.482C6.837 6.06 4.5 8.396 4.5 11.282c0 2.886 2.337 5.223 5.092 5.223 1.378 0 2.637-.57 3.418-1.482.78.912 2.04 1.482 3.418 1.482 2.755 0 5.092-2.337 5.092-5.223 0-2.886-2.337-5.222-5.092-5.222zm0 8.922c-2.043 0-3.707-1.663-3.707-3.7 0-2.037 1.664-3.7 3.707-3.7 2.043 0 3.707 1.663 3.707 3.7 0 2.037-1.664 3.7-3.707 3.7zm-6.836 0c-2.043 0-3.707-1.663-3.707-3.7 0-2.037 1.664-3.7 3.707-3.7 2.043 0 3.707 1.663 3.707 3.7 0 2.037-1.664 3.7-3.707 3.7z" />
                </svg>
              </div>
              {/* Amazon */}
              <div className="text-on-surface-variant hover:text-[#FF9900] transition-colors duration-200" title="Amazon">
                <svg className="h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.28 13.56c-.55 0-.85-.16-1.12-.39-.24-.2-.55-.65-.55-1.45 0-1.57.9-2.22 2.65-2.22H18v.85c0 .9-.57 1.61-1.62 1.61h-1.1zm2.72 4.19c-.31.25-.72.37-1.07.37-.62 0-1.12-.37-1.12-.99 0-.91.73-1.22 1.77-1.22h.42v1.84zm-3.08-5.36c0-1.66.9-2.36 2.68-2.36H18v-1.16c0-.98-.67-1.39-1.83-1.39-1.12 0-2.1.37-2.61.64l-.38-1.27c.65-.36 1.94-.74 3.42-.74 2.22 0 3.4.99 3.4 2.87V15.7c0 1.25.46 1.83.82 2.22h-1.88c-.28-.36-.49-.96-.49-1.53-.41.65-1.16 1.72-2.88 1.72-1.78 0-2.94-1.03-2.94-2.58 0-2 1.55-2.66 3.72-2.66H18V12.7c0-.91-.5-1.31-1.46-1.31-.89 0-1.53.33-1.92.57l-.34-.95zM22.04 19.34C18.66 21.05 13.72 22 9.22 22c-4.14 0-7.7-.76-10.22-2.24l.51-1.3c2.32 1.34 5.67 2.05 9.48 2.05 4.15 0 8.7-.85 11.95-2.45l.54 1.28zm.96-1.96c-.34-.23-1.1-.11-1.51-.06-.52.07-2.21.35-3.1.42-.36.03-.44-.2-.13-.37 1.05-.58 2.78-1.01 3.97-.96.41.02.6.26.49.61-.17.55-.78 1.95-1.43 2.73-.23.28-.56.14-.45-.18.23-.71.57-1.72.53-2.19z" />
                </svg>
              </div>
              {/* Netflix */}
              <div className="text-on-surface-variant hover:text-[#E50914] transition-colors duration-200" title="Netflix">
                <svg className="h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.9 0h3.27v16.14c.73-1.07 1.8-2.64 3.28-4.83V0h3.27v24H12.45l-3.28-5.36V24H5.9V0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-16 md:py-24 px-4 md:px-8 bg-surface-container-low/20 border-b border-outline-variant/40" id="features">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Precision Coaching for Every Candidate</h2>
              <p className="text-base md:text-lg text-on-surface-variant">Our tools are built with industrial-grade AI to give you the winning edge.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Feature Card 1 */}
              <div className="md:col-span-8 group bg-surface-container-lowest border border-outline-variant/60 p-8 rounded-3xl hover:shadow-2xl hover:border-primary/20 hover:translate-y-[-2px] transition-all duration-300 scroll-reveal flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <span className="material-symbols-outlined text-primary text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
                    description
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Resume Analysis</h3>
                  <p className="text-sm md:text-base text-on-surface-variant mb-6 leading-relaxed">
                    Upload your resume and get instant feedback on keyword optimization, structure, and impact scores specifically tuned for top ATS systems.
                  </p>
                  <Link href="/dashboard" className="inline-flex items-center gap-1 text-primary font-bold hover:underline">
                    Scan Resume <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
                <div className="flex-1 w-full bg-surface-container-low rounded-2xl p-4 overflow-hidden border border-outline-variant/30 relative group-hover:scale-[1.02] transition-transform duration-300">
                  <img
                    className="w-full h-48 object-cover rounded-xl shadow-md"
                    alt="Resume being scanned by laser line"
                    src="/resume-analyser.webp"
                  />
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="md:col-span-4 group bg-surface-container-lowest border border-outline-variant/60 p-8 rounded-3xl hover:shadow-2xl hover:border-primary/20 hover:translate-y-[-2px] transition-all duration-300 scroll-reveal flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-primary text-4xl mb-4">keyboard_voice</span>
                  <h3 className="text-lg md:text-xl font-bold mb-2">Mock Interviews</h3>
                  <p className="text-sm md:text-base text-on-surface-variant mb-6 leading-relaxed">
                    Practice with realistic voice-enabled AI avatars that adapt their questions based on your previous answers.
                  </p>
                </div>
                <Link href="/dashboard" className="inline-flex items-center gap-1 text-primary font-bold hover:underline mt-auto">
                  Start Mock Session <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Feature Card 3 */}
              <div className="md:col-span-4 group bg-surface-container-lowest border border-outline-variant/60 p-8 rounded-3xl hover:shadow-2xl hover:border-primary/20 hover:translate-y-[-2px] transition-all duration-300 scroll-reveal flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-primary text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
                    quiz
                  </span>
                  <h3 className="text-lg md:text-xl font-bold mb-2">AI Feedback</h3>
                  <p className="text-sm md:text-base text-on-surface-variant mb-6 leading-relaxed">
                    Receive detailed transcripts and sentiment analysis on your tone, body language, and content accuracy.
                  </p>
                </div>
                <Link href="/dashboard" className="inline-flex items-center gap-1 text-primary font-bold hover:underline mt-auto">
                  View Demo Feedback <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Feature Card 4 */}
              <div className="md:col-span-8 group bg-surface-container-lowest border border-outline-variant/60 p-8 rounded-3xl hover:shadow-2xl hover:border-primary/20 hover:translate-y-[-2px] transition-all duration-300 scroll-reveal flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="flex-1">
                  <span className="material-symbols-outlined text-primary text-4xl mb-4">query_stats</span>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Performance Tracking</h3>
                  <p className="text-sm md:text-base text-on-surface-variant mb-6 leading-relaxed">
                    Visualize your progress over time with advanced analytics charts. Identify weak spots and track your 'Ready-to-Hire' index.
                  </p>
                  <Link href="/dashboard" className="inline-flex items-center gap-1 text-primary font-bold hover:underline">
                    Track Progress <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
                <div className="flex-1 w-full bg-surface-container-low rounded-2xl p-4 overflow-hidden border border-outline-variant/30 relative group-hover:scale-[1.02] transition-transform duration-300">
                  <img
                    className="w-full h-48 object-cover rounded-xl shadow-md"
                    alt="Dashboard showing performance charts"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB75iAWsO9bG910VaLfX334N4EZEj9oU5pZIlN78qp9wFk-YWzG80EwC-NOYr9pdyCTmaDJ3jVXTUxetbb_U6kun9Y9grqAvTSZowUGoOqf51NqdetsVa5PI5cRaSYsgi0Cw76WEd-gCIHoEhasZim7Vyc7Htw62wcVV3c14zhxa3sJ7spbCN0e2kj17CnQWraUhX8jc0dRU2hsuPBixYq9LBtnm12sOH6sU829DFNrMWCXz7WJTXG4BNqxeICdzvaTFO1Pqg-u6A"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="about" className="py-16 md:py-24 px-4 md:px-8 bg-white">
          <div className="max-w-container-max mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-16">Three Steps to Success</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connecting Line (Only visible on medium devices and up) */}
              <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-0.5 border-t border-dashed border-outline-variant/80 -z-0"></div>
              
              {/* Step 1 */}
              <div className="relative flex flex-col items-center scroll-reveal">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-6 z-10 shadow-lg font-bold text-xl">
                  1
                </div>
                <h4 className="text-lg md:text-xl font-bold mb-2">Upload</h4>
                <p className="text-sm md:text-base text-on-surface-variant px-4 leading-relaxed">
                  Upload your CV and the job description for target analysis.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center scroll-reveal">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-6 z-10 shadow-lg font-bold text-xl">
                  2
                </div>
                <h4 className="text-lg md:text-xl font-bold mb-2">Practice</h4>
                <p className="text-sm md:text-base text-on-surface-variant px-4 leading-relaxed">
                  Run through interactive mock sessions with AI-powered roleplay.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center scroll-reveal">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-6 z-10 shadow-lg font-bold text-xl">
                  3
                </div>
                <h4 className="text-lg md:text-xl font-bold mb-2">Improve</h4>
                <p className="text-sm md:text-base text-on-surface-variant px-4 leading-relaxed">
                  Review analytics and refine your approach until you're ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-4 md:px-8 bg-surface-container-low/10">
          <div className="max-w-container-max mx-auto bg-gradient-to-br from-primary to-indigo-800 rounded-[32px] p-12 md:p-20 text-center text-on-primary overflow-hidden relative shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-fixed-dim/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to Land Your Dream Job?</h2>
              <p className="text-lg text-on-primary-container mb-10 opacity-90 max-w-xl leading-relaxed">
                Join over 50,000+ candidates who have already leveled up their careers using PrepAI.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                <Link href="/signup" className="bg-white text-primary text-center px-10 py-4 rounded-xl font-bold shadow-xl hover:bg-opacity-95 hover:translate-y-[-2px] active:scale-95 transition-all">
                  Get Started Free
                </Link>
                <Link href="/pricing" className="border border-white/40 hover:border-white text-white text-center px-10 py-4 rounded-xl font-bold hover:bg-white/5 transition-all flex items-center justify-center">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
