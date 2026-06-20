import React from 'react';
import Link from 'next/link';

export default function QuizzesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <span className="material-symbols-outlined text-primary text-6xl mb-4">quiz</span>
      <h1 className="text-3xl font-bold mb-2">Practice Quizzes</h1>
      <p className="text-on-surface-variant mb-6 max-w-md">
        This screen is not yet implemented. In the next phase, we will build quick knowledge testing modules.
      </p>
      <Link href="/dashboard" className="bg-primary text-white px-6 py-2 rounded-lg font-label-md">
        Back to Dashboard
      </Link>
    </div>
  );
}
