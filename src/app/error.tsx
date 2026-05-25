'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="app-shell flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <p className="text-5xl mb-4">⚠️</p>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-500 text-sm font-roboto mb-8 max-w-[260px]">
        Don&apos;t worry — it&apos;s not your fault. Please try again.
      </p>
      <button onClick={reset} className="btn-primary max-w-[200px]">
        Try again
      </button>
    </div>
  );
}
