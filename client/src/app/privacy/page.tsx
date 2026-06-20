'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-margin-mobile py-20">
        <div className="space-y-4 mb-12">
          <span className="bg-primary/10 text-primary text-label-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Data Safeguards
          </span>
          <h1 className="font-display-lg text-display-lg text-on-background font-bold leading-tight">
            Privacy Policy
          </h1>
          <p className="text-on-surface-variant font-body-md text-body-md">
            Last Updated: June 20, 2026
          </p>
        </div>

        <div className="space-y-8 text-on-surface-variant font-body-lg text-body-lg leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-title-lg text-title-lg font-bold text-on-surface">1. Information We Collect</h2>
            <p>
              We collect user details (name, email) during signup. We also process and store mock interview answers, voice logs, and uploaded resumes to generate AI evaluations, ATS scores, and historical performance tracking.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-title-lg text-title-lg font-bold text-on-surface">2. How We Use Your Data</h2>
            <p>
              Your data is solely used to render your progress dashboards, provide STAR behavioral feedback, scan ATS keyword matches, and allow you to track score increases. We do not sell your personal files or logs to third-party data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-title-lg text-title-lg font-bold text-on-surface">3. AI Processing & Third Parties</h2>
            <p>
              Resume texts and interview transcriptions are processed securely via LLM inference engines (such as Google Gemini APIs) to compute feedback scores. No sensitive documents are utilized to train public underlying models.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-title-lg text-title-lg font-bold text-on-surface">4. Security</h2>
            <p>
              We employ encryption in transit and secure database storage. Under the mock database fallback configuration, candidate session profiles are temporarily held in volatile RAM to preserve security limits.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
