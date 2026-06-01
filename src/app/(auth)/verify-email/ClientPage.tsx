'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  useEmailVerifiedStatus,
  useResendVerification,
} from '@/lib/hooks/use-email-verification';

const RESEND_COOLDOWN = 60;

export default function VerifyEmailClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { mutateAsync: resend, isPending: resending } = useResendVerification();

  const { data: statusData } = useEmailVerifiedStatus(email, true);
  const isVerified = (statusData as any)?.isVerified ?? false;

  useEffect(() => {
    if (isVerified) {
      toast.success('Email verified! Welcome to GokaFood');
      setTimeout(() => router.replace('/discover'), 1200);
    }
  }, [isVerified, router]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    try {
      await resend({ userEmail: email, platform: 'web' });
      toast.success('Verification email sent!');
      startCooldown();
    } catch {
      toast.error('Could not send email. Try again.');
    }
  };

  const maskedEmail = email.replace(/(.{2}).+(@.+)/, '$1***$2');

  return (
    <div className="flex flex-col justify-center flex-1 px-8 py-12 lg:px-14 max-w-[520px] w-full mx-auto lg:mx-0">
      <div className="lg:hidden flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
          <Image src="/images/gkf-logo.png" alt="GokaFood Logo" width={20} height={20} />
        </div>
        <span className="text-primary-500 font-bold text-xl">GokaFood</span>
      </div>

      {isVerified ? (
        <div className="text-center py-8 animate-fade-in">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Email Verified!</h2>
          <p className="text-gray-500 font-roboto text-sm">Taking you to GokaFood…</p>
          <div className="flex justify-center gap-1.5 mt-6">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center">
              <Mail size={44} className="text-primary-500" strokeWidth={1.5} />
            </div>
            <span className="absolute inset-0 rounded-full border-2 border-primary-300 animate-ping opacity-40" />
          </div>

          <h2 className="text-3xl font-black text-gray-900 text-center mb-3">
            Check your email
          </h2>
          <p className="text-gray-500 text-sm font-roboto text-center leading-relaxed mb-2">
            We sent a verification link to
          </p>
          <p className="font-bold text-gray-900 text-center mb-8 text-base">
            {maskedEmail || 'your email address'}
          </p>

          <div className="flex items-center justify-center gap-2 mb-6 text-xs text-gray-400 font-roboto">
            <RefreshCw size={12} className="animate-spin" />
            <span>Checking automatically every 10 seconds…</span>
          </div>

          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="btn-primary mb-4"
          >
            {resending ? (
              <>
                <RefreshCw size={16} className="animate-spin mr-2" />
                Sending…
              </>
            ) : cooldown > 0 ? (
              `Resend in ${cooldown}s`
            ) : (
              'Resend Verification Email'
            )}
          </button>

          <button
            onClick={() => router.push('/login')}
            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mx-auto"
          >
            <ArrowLeft size={15} />
            Back to Sign In
          </button>

          <p className="text-center text-xs text-gray-400 font-roboto mt-6">
            Can&apos;t find it? Check your <span className="font-semibold">spam</span> or{' '}
            <span className="font-semibold">junk</span> folder.
          </p>
        </>
      )}
    </div>
  );
}
