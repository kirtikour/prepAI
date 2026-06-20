'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PricingPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      {/* Navigation Header */}
      <Header />

      {/* Main Pricing Content */}
      <main className="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col items-center justify-center py-20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="bg-primary/10 text-primary text-label-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Pricing Plans
          </span>
          <h1 className="font-display-lg text-display-lg text-on-background font-bold leading-tight">
            Flexible Plans for Every Stage of Your Career
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Boost your interview success rates with advanced AI scoring, tailored analysis, and STAR coaching tools.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl items-stretch">
          
          {/* Plan 1: Free Starter */}
          <div className="bg-white border border-outline-variant rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:border-outline transition-all">
            <div className="space-y-6">
              <div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Starter</h3>
                <p className="text-label-md text-on-surface-variant mt-1">Get a feel for the AI Coach</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-on-surface-variant font-label-md text-label-md ml-2">/ lifetime free</span>
              </div>
              <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant pt-4 border-t border-outline-variant">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                  <span>1 AI Mock Interview Session</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                  <span>1 Resume ATS Optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                  <span>Basic performance metrics</span>
                </li>
                <li className="flex items-center gap-2 text-outline-variant/60">
                  <span className="material-symbols-outlined text-lg">cancel</span>
                  <span>No STAR framework analysis</span>
                </li>
              </ul>
            </div>
            <Link href="/signup" className="mt-8 w-full py-3 bg-surface-container-low text-on-surface text-center rounded-xl font-title-lg hover:bg-surface-container-high transition-colors">
              Get Started
            </Link>
          </div>

          {/* Plan 2: Pro Coach (Recommended) */}
          <div className="bg-white border-2 border-primary rounded-3xl p-8 flex flex-col justify-between shadow-lg relative transform md:-translate-y-4">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white text-label-sm font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                  Pro Coach
                  <span className="material-symbols-outlined text-primary text-[22px]">auto_awesome</span>
                </h3>
                <p className="text-label-md text-on-surface-variant mt-1">Accelerate mock preparation</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold">$19</span>
                <span className="text-on-surface-variant font-label-md text-label-md ml-2">/ month</span>
              </div>
              <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant pt-4 border-t border-outline-variant">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span className="text-on-surface font-semibold">Unlimited Mock Interviews</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span className="text-on-surface font-semibold">Unlimited Resume Uploads</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span>Deep AI evaluation breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span>STAR methodology coaching</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span>Historical analytics dashboards</span>
                </li>
              </ul>
            </div>
            <Link href="/signup" className="mt-8 w-full py-3 bg-primary text-white text-center rounded-xl font-title-lg hover:opacity-90 active:scale-95 transition-transform shadow-md">
              Try Pro Free
            </Link>
          </div>

          {/* Plan 3: Enterprise Team */}
          <div className="bg-white border border-outline-variant rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:border-outline transition-all">
            <div className="space-y-6">
              <div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Enterprise</h3>
                <p className="text-label-md text-on-surface-variant mt-1">For universities & recruit teams</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold">$99</span>
                <span className="text-on-surface-variant font-label-md text-label-md ml-2">/ month</span>
              </div>
              <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant pt-4 border-t border-outline-variant">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                  <span>Everything in Pro Coach</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                  <span>Custom role template creation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                  <span>Recruiter review dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                  <span>SLA support & custom analytics</span>
                </li>
              </ul>
            </div>
            <Link href="/contact" className="mt-8 w-full py-3 bg-surface-container-low text-on-surface text-center rounded-xl font-title-lg hover:bg-surface-container-high transition-colors">
              Contact Sales
            </Link>
          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
