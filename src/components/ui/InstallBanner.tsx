'use client';

import { useState } from 'react';
import { X, Download, Share } from 'lucide-react';
import { usePWAInstall } from '@/lib/hooks/use-pwa-install';
import Image from 'next/image';

/**
 * Shows an install banner when the app is installable.
 * - Android: triggers native prompt
 * - iOS: shows "Share → Add to Home Screen" instructions
 */
export default function InstallBanner() {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  if (isInstalled || dismissed) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[390px] z-40 animate-slide-up">
        <div className="bg-gray-900 text-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <Image src="/images/gkf-logo.png" alt="GokaFood Logo" width={20} height={20} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Install GokaFood</p>
            <p className="text-gray-400 text-xs font-roboto">Get the full app experience</p>
          </div>

          <button
            onClick={isIOS ? () => setShowIOSInstructions(true) : promptInstall}
            className="flex items-center gap-1.5 bg-primary-500 text-white text-xs font-semibold px-3 py-2 rounded-xl flex-shrink-0"
          >
            <Download size={14} />
            Install
          </button>

          <button onClick={() => setDismissed(true)} className="text-gray-400 flex-shrink-0">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowIOSInstructions(false)}
          />
          <div className="relative w-full max-w-[430px] bg-white rounded-t-4xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Add to Home Screen</h3>
              <button onClick={() => setShowIOSInstructions(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: <Share size={20} className="text-blue-500" />,
                  text: 'Tap the Share button at the bottom of Safari',
                },
                {
                  icon: <span className="text-xl">⬇️</span>,
                  text: 'Scroll down and tap "Add to Home Screen"',
                },
                {
                  icon: <span className="text-xl">✅</span>,
                  text: 'Tap "Add" to install GokaFood on your phone',
                },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {step.icon}
                  </div>
                  <p className="text-gray-600 text-sm font-roboto pt-1">{step.text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="btn-primary mt-6"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
