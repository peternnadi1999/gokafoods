import type { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'GokaFood – Sign In or Join',
  description: 'Login to your GokaFood account or create a new account to order food from your favorite restaurants. Fast, secure, and convenient.',
  keywords: ['login', 'sign up', 'create account', 'GokaFood account', 'food delivery account'],
  openGraph: {
    title: 'GokaFood – Authentication',
    description: 'Login or create your GokaFood account to start ordering food.',
    type: 'website',
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-white">
      <div
        className="hidden bg-cover bg-center lg:flex lg:w-[52%] xl:w-1/2 sticky top-0 h-screen flex-col justify-between p-10 flex-shrink-0 overflow-hidden"
        style={{
          backgroundImage: "url('/images/img1.jpg')",
        }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/45 to-primary-800/40" />

        {/* Logo — top */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/25 shadow-lg">
            <Image src="/images/gkf-logo.png" alt="GokaFood Logo" width={20} height={20} />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">GokaFood</span>
        </div>

        {/* Hero copy — middle */}
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl xl:text-[2.8rem] font-black text-white leading-[1.15]">
            Your next favorite<br />meal is one tap<br />away.
          </h1>
          <p className="text-white/95 text-base font-roboto leading-relaxed max-w-sm">
            Discover local kitchens, save your favorites,<br />and order in seconds.
          </p>
        </div>

        {/* Footer — bottom */}
        <p className="relative z-10 text-white/95 text-xs font-roboto">
          © 2026 GokaFood. All rights reserved.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center min-h-screen overflow-y-auto bg-white">
        <Suspense fallback={<div className="flex-1" />}>{children}</Suspense>
      </div>

    </div>
  );
}
