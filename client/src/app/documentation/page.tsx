'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type SectionType = 'getting-started' | 'mock-interviews' | 'resume-analysis' | 'star-framework' | 'faqs';

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState<SectionType>('getting-started');

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      {/* Top Header */}
      <Header />

      {/* Docs Body Wrapper */}
      <div className="flex-1 max-w-container-max mx-auto w-full flex flex-col md:flex-row gap-12 p-margin-mobile md:p-margin-desktop py-16">
        
        {/* Left Side Navigation Links (w-[240px]) */}
        <aside className="md:w-[240px] shrink-0 space-y-6">
          <div className="space-y-2">
            <p className="text-label-sm text-outline uppercase tracking-wider font-bold">User Documentation</p>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => setActiveSection('getting-started')}
                className={`w-full text-left px-4 py-2 rounded-lg font-label-md text-label-md transition-colors ${
                  activeSection === 'getting-started'
                    ? 'text-primary bg-primary/5 font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                Getting Started
              </button>
              <button
                onClick={() => setActiveSection('mock-interviews')}
                className={`w-full text-left px-4 py-2 rounded-lg font-label-md text-label-md transition-colors ${
                  activeSection === 'mock-interviews'
                    ? 'text-primary bg-primary/5 font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                Mock Interviews
              </button>
              <button
                onClick={() => setActiveSection('resume-analysis')}
                className={`w-full text-left px-4 py-2 rounded-lg font-label-md text-label-md transition-colors ${
                  activeSection === 'resume-analysis'
                    ? 'text-primary bg-primary/5 font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                Resume Analysis
              </button>
              <button
                onClick={() => setActiveSection('star-framework')}
                className={`w-full text-left px-4 py-2 rounded-lg font-label-md text-label-md transition-colors ${
                  activeSection === 'star-framework'
                    ? 'text-primary bg-primary/5 font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                STAR Framework
              </button>
              <button
                onClick={() => setActiveSection('faqs')}
                className={`w-full text-left px-4 py-2 rounded-lg font-label-md text-label-md transition-colors ${
                  activeSection === 'faqs'
                    ? 'text-primary bg-primary/5 font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                Frequently Asked Questions
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content Sheet */}
        <main className="flex-1 bg-white border border-outline-variant rounded-3xl p-8 shadow-sm max-w-3xl">
          
          {activeSection === 'getting-started' && (
            <div className="space-y-6">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Getting Started with PrepAI</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Welcome to PrepAI! Our platform is engineered to offer comprehensive, high-fidelity interview training using state-of-the-art Large Language Models.
              </p>
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <p className="font-bold text-primary mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                  Quick Checklist
                </p>
                <ul className="list-disc pl-5 space-y-1 font-body-md text-body-md text-on-surface-variant mt-2">
                  <li>Create a free account or sign in to your dashboard.</li>
                  <li>Perform a Resume Scan to establish your keyword baseline.</li>
                  <li>Initiate a Mock Practice Session to benchmark your spoken answers.</li>
                  <li>Check the Performance tab for growth curves.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'mock-interviews' && (
            <div className="space-y-6">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">AI Mock Interview Simulator</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Our Mock Interview Simulator presents tailored questions based on your discipline. You can select Frontend, Backend, Data Science, AI/ML, and Product roles.
              </p>
              <h3 className="font-title-lg text-title-lg font-bold text-on-surface mt-4">Simulation Rules</h3>
              <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant pl-4 border-l-2 border-primary/20">
                <li>
                  <strong>Questions count:</strong> Standard sessions comprise 5 questions.
                </li>
                <li>
                  <strong>Response timer:</strong> You have 2 minutes (120 seconds) per question to formulate your answer.
                </li>
                <li>
                  <strong>Realtime Evaluation:</strong> After each question, our coach extracts your answer structure, returns an individual score (0-10), and details key strengths and improvements.
                </li>
              </ul>
            </div>
          )}

          {activeSection === 'resume-analysis' && (
            <div className="space-y-6">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">ATS Resume Scanner</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Optimize your CV keyword matching before submitting to top-tier hiring pipelines.
              </p>
              <h3 className="font-title-lg text-title-lg font-bold text-on-surface mt-4">Scanner Features</h3>
              <ul className="list-disc pl-5 space-y-2 font-body-md text-body-md text-on-surface-variant">
                <li><strong>ATS Score (0 - 100):</strong> Evaluates overall visual layout, typography structure, and skill verb density.</li>
                <li><strong>Strengths & Weaknesses:</strong> Specific points regarding formatting consistency and metric inclusion.</li>
                <li><strong>Missing Keywords:</strong> Compares your CV contents to target job titles to identify missing skills.</li>
              </ul>
            </div>
          )}

          {activeSection === 'star-framework' && (
            <div className="space-y-6">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">The STAR Interview Method</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                To maximize behavioral mock interview scores, structure your responses using the **STAR** method.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-surface rounded-xl border border-outline-variant">
                  <h4 className="font-bold text-primary">S - Situation</h4>
                  <p className="text-body-md text-on-surface-variant mt-1">Set the scene and provide details of the task or challenge.</p>
                </div>
                <div className="p-4 bg-surface rounded-xl border border-outline-variant">
                  <h4 className="font-bold text-primary">T - Task</h4>
                  <p className="text-body-md text-on-surface-variant mt-1">Describe your responsibility in that situation.</p>
                </div>
                <div className="p-4 bg-surface rounded-xl border border-outline-variant">
                  <h4 className="font-bold text-primary">A - Action</h4>
                  <p className="text-body-md text-on-surface-variant mt-1">Explain the specific steps you took to address the problem.</p>
                </div>
                <div className="p-4 bg-surface rounded-xl border border-outline-variant">
                  <h4 className="font-bold text-primary">R - Result</h4>
                  <p className="text-body-md text-on-surface-variant mt-1">Share the quantifiable outcomes achieved (e.g. metrics, savings).</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'faqs' && (
            <div className="space-y-6">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Frequently Asked Questions</h2>
              <div className="space-y-6 pt-4 border-t border-outline-variant">
                <div className="space-y-2">
                  <h4 className="font-title-lg text-title-lg font-bold text-on-surface">Is my uploaded resume safe?</h4>
                  <p className="text-body-md text-on-surface-variant">Yes. Resumes are only processed to compile ATS scores. Under mock db configurations, they are safely stored in RAM and never shared.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-title-lg text-title-lg font-bold text-on-surface">Can I change roles between mock sessions?</h4>
                  <p className="text-body-md text-on-surface-variant">Absolutely! Select any engineering discipline (e.g. Frontend Developer, Data Scientist, Product Manager) on the selectors prior to starting an interview session.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-title-lg text-title-lg font-bold text-on-surface">How often should I test?</h4>
                  <p className="text-body-md text-on-surface-variant">We recommend practicing at least 3-5 sessions, checking your Performance growth curve, and reading AI-provided behavioral hints between runs.</p>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
