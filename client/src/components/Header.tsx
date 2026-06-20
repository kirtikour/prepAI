'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <nav className="bg-surface sticky top-0 z-50 border-b border-outline-variant shadow-sm shrink-0">
      <div className="flex justify-between items-center px-margin-desktop h-16 max-w-container-max mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span className="font-headline-md text-headline-md font-bold text-primary">PrepAI</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-body-md text-body-md">
          <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/features">Features</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/pricing">Pricing</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/contact">Contact</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/documentation">Documentation</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md px-4 py-2">
            Login
          </Link>
          <Link href="/signup" className="bg-primary text-white font-label-md text-label-md px-5 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm">
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
