import React from 'react';
import AuthForm from '@/components/AuthForm';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-background via-surface-container-lowest to-primary-fixed/20 relative overflow-hidden">
      {/* Dynamic background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>

      <div className="w-full flex justify-center items-center z-10 transition-all duration-500 transform scale-98 hover:scale-100">
        <AuthForm initialMode="signup" />
      </div>
    </main>
  );
}
