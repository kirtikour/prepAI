'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 1500);
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      {/* Navigation Header */}
      <Header />

      {/* Main Form Content */}
      <main className="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col lg:flex-row gap-16 py-20 items-center justify-center relative">
        {/* Dynamic background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>

        {/* Contact Info Cards */}
        <div className="lg:w-2/5 space-y-8">
          <div className="space-y-4">
            <span className="bg-primary/10 text-primary text-label-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Contact us
            </span>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-background leading-tight text-4xl">
              We'd Love to Hear From You
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Have questions about pricing, features, custom institution licenses, or want to report a bug? Send us a message and our support team will get back to you within 24 hours.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-outline-variant">
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-outline-variant bg-white hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">mail</span>
              </div>
              <div>
                <p className="font-label-md text-label-md font-bold text-on-surface">Email Support</p>
                <p className="text-body-md text-on-surface-variant">support@prepai.ai</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl border border-outline-variant bg-white hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">schedule</span>
              </div>
              <div>
                <p className="font-label-md text-label-md font-bold text-on-surface">Response Time</p>
                <p className="text-body-md text-on-surface-variant">Under 24 hours (Mon - Fri)</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl border border-outline-variant bg-white hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">forum</span>
              </div>
              <div>
                <p className="font-label-md text-label-md font-bold text-on-surface">Developer Community</p>
                <p className="text-body-md text-on-surface-variant">Join our active Discord channel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Glassmorphic Form Card */}
        <div className="w-full lg:w-[520px] bg-white border border-outline-variant rounded-3xl p-8 sm:p-10 shadow-xl z-10">
          {success ? (
            <div className="text-center py-12 space-y-5 flex flex-col items-center animate-fade-in">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-200">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h2 className="font-headline-md text-headline-md font-bold">Message Sent!</h2>
              <p className="text-body-md text-on-surface-variant max-w-sm leading-relaxed">
                Thank you for reaching out. A support engineer has been assigned to your ticket and will contact you shortly.
              </p>
              <button 
                onClick={() => setSuccess(false)} 
                className="mt-4 px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-title-lg text-title-lg font-bold text-on-surface">Send a Message</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1.5">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                      person
                    </span>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md font-body-md"
                      placeholder="Alex Johnson"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                      mail
                    </span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md font-body-md"
                      placeholder="alex@company.com"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1.5">Subject</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                      topic
                    </span>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md font-body-md appearance-none"
                      disabled={loading}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Billing / Pricing">Billing / Pricing</option>
                      <option value="Enterprise / Partnerships">Enterprise / Partnerships</option>
                      <option value="Technical Support">Technical Support</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                      arrow_drop_down
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1.5">Message</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[20px]">
                      edit_note
                    </span>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-32 resize-none text-body-md font-body-md"
                      placeholder="How can we help you?"
                      disabled={loading}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3.5 bg-error/5 text-error rounded-xl border border-error/20 font-label-md leading-relaxed animate-fade-in flex gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/95 hover:shadow-lg active:scale-[0.98] transition-all shadow-md cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Sending Message...
                  </>
                ) : (
                  <>
                    Send Message
                    <span className="material-symbols-outlined text-lg">send</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
