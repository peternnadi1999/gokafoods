'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show splash on first visit
    const shown = sessionStorage.getItem('gkf_splash');
    if (!shown) {
      setVisible(true);
      sessionStorage.setItem('gkf_splash', '1');
      const t = setTimeout(() => setVisible(false), 2200);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center animate-fade-in"
      style={{
        animation: visible ? 'fadeIn 0.3s ease-out, fadeOut 0.4s ease-in 1.8s forwards' : '',
      }}
    >
      <style jsx>{`
        @keyframes fadeOut {
          to { opacity: 0; pointer-events: none; }
        }
        @keyframes dotBounce {
          0%, 100% { transform: scale(0.6); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        .dot { animation: dotBounce 0.8s ease-in-out infinite; }
        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }
      `}</style>

      <h1 className="text-5xl font-black text-primary-500 tracking-tight mb-2">GKF</h1>
      <p className="text-gray-400 text-sm italic font-roboto mb-6">Tastes That Move You</p>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="dot w-3 h-3 rounded-full bg-primary-400"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
