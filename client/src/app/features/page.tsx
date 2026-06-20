'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function FeaturesPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      {/* Navigation Header */}
      <Header />

      {/* Main Showcase Area */}
      <main className="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full py-20">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="bg-primary/10 text-primary text-label-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            AI Technology
          </span>
          <h1 className="font-display-lg text-display-lg text-on-background font-bold leading-tight">
            Industrial-Grade AI Tools Built for Job Candidates
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Explore the advanced technical features designed to give you the competitive edge.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* Feature Card 1: Mock Interviews */}
          <div className="bg-white border border-outline-variant rounded-3xl p-8 shadow-sm space-y-4 hover:border-primary/25 transition-all">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                keyboard_voice
              </span>
            </div>
            <h3 className="font-title-lg text-title-lg font-bold text-on-surface">Interactive AI Mock Sessions</h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Practice answering questions verbally or with high-speed keyboard transcription. Our simulator queries role-specific scenarios from a comprehensive engineering library and times responses with a 120-second countdown.
            </p>
          </div>

          {/* Feature Card 2: ATS Scanner */}
          <div className="bg-white border border-outline-variant rounded-3xl p-8 shadow-sm space-y-4 hover:border-primary/25 transition-all">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                description
              </span>
            </div>
            <h3 className="font-title-lg text-title-lg font-bold text-on-surface">ATS Resume Scanner</h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Scan your PDF or DOCX file using advanced text parsers. The scanner analyzes key engineering verbs, checks format layout consistency, highlights keywords, and returns an ATS match score (0-100).
            </p>
          </div>

          {/* Feature Card 3: Dashboard Stats */}
          <div className="bg-white border border-outline-variant rounded-3xl p-8 shadow-sm space-y-4 hover:border-primary/25 transition-all">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                equalizer
              </span>
            </div>
            <h3 className="font-title-lg text-title-lg font-bold text-on-surface">Advanced Performance Analytics</h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              View your practice history over time. Track score growth trends with interactive Recharts line charts, view category breakdowns by target role with bar charts, and log resume improvement milestones in a single view.
            </p>
          </div>

          {/* Feature Card 4: STAR Coaching */}
          <div className="bg-white border border-outline-variant rounded-3xl p-8 shadow-sm space-y-4 hover:border-primary/25 transition-all">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <h3 className="font-title-lg text-title-lg font-bold text-on-surface">STAR Behavioral Coaching</h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Get targeted coaching advice to format answers according to Situation, Task, Action, and Result models. Instantly view good points, improvement tips, and communication highlights for every response.
            </p>
          </div>

        </div>

        {/* CTA section */}
        <div className="mt-20 text-center">
          <Link href="/signup" className="inline-flex items-center gap-2 bg-primary text-white font-title-lg text-title-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all">
            Unlock AI Tools
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
