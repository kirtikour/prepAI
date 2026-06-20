'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-margin-mobile py-20">
        <div className="space-y-4 mb-12">
          <span className="bg-primary/10 text-primary text-label-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Legal Policies
          </span>
          <h1 className="font-display-lg text-display-lg text-on-background font-bold leading-tight">
            Terms of Service
          </h1>
          <p className="text-on-surface-variant font-body-md text-body-md">
            Last Updated: June 20, 2026
          </p>
        </div>

        <div className="space-y-8 text-on-surface-variant font-body-lg text-body-lg leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-title-lg text-title-lg font-bold text-on-surface">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the PrepAI platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-title-lg text-title-lg font-bold text-on-surface">2. Description of Service</h2>
            <p>
              PrepAI provides AI-powered mock interview practice, voice/text feedback, performance tracking, and resume analysis tools to help users prepare for professional interviews.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-title-lg text-title-lg font-bold text-on-surface">3. User Accounts & Registration</h2>
            <p>
              To access certain features of the Service, you must register for an account. You agree to provide accurate information and maintain the security of your credentials. You are responsible for all activities occurring under your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-title-lg text-title-lg font-bold text-on-surface">4. AI Insights & Accuracy</h2>
            <p>
              AI-generated feedback, scores, and resume insights are simulations designed to assist in training. We make no guarantees that mock scores or suggestions correspond to actual recruiter behavior, ATS performance, or hiring decisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-title-lg text-title-lg font-bold text-on-surface">5. Prohibited Uses</h2>
            <p>
              You agree not to bypass access controls, exploit the API for bulk text generations, upload malicious files, or utilize automated scripts to scrape or interact with mock models in a manner that degrades performance for other users.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
