'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail } from 'lucide-react';

export default function WelcomePage() {
 
  return (
    <div className="flex flex-col justify-center flex-1 px-8 py-12 lg:px-14 max-w-[520px] w-full mx-auto lg:mx-0">

      {/* Mobile-only logo */}
      <div className="lg:hidden flex items-center gap-2 mb-10">
        <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
          <Image src="/images/gkf-logo.png" alt="GokaFood Logo" width={20} height={20} />
        </div>
        <span className="text-primary-500 font-bold text-xl">GokaFood</span>
      </div>

      <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome to GokaFood</h2>
      <p className="text-gray-500 text-sm font-roboto mb-10 leading-relaxed">
        Join or return with ease. We&apos;ll recognize you and handle the rest.
      </p>

      <div className="relative mb-6">
        {/* Email */}
        <Link
          href="/login"
          className="w-full border border-gray-200 justify-center rounded-2xl py-3.5 px-5 flex items-center gap-3 hover:bg-gray-50 active:scale-[0.99] transition-all"
        >
          <Mail size={20} />
          <span className="font-semibold text-gray-800 text-center text-sm">Continue with Email</span>
        </Link>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-gray-400 text-sm font-roboto px-1">or with</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Social options */}
      <div className="space-y-3">
        {/* Google */}
        <button className="w-full border justify-center border-gray-200 rounded-2xl py-3.5 px-5 flex items-center gap-3 hover:bg-gray-50 active:scale-[0.99] transition-all">
          <Image src="/images/google.png" alt="Email Icon" width={20} height={20} />
          <span className="font-semibold text-gray-800 text-center text-sm">Continue with Google</span>
        </button>

      </div>

      <div className='mt-7'>
        <h2 className='text-sm font-semibold text-gray-600 uppercase text-center'>Follow us on</h2>

        <div>
          <div className='flex items-center justify-center gap-6 mt-4'>
            <Link href="https://www.facebook.com/gokafood" target="_blank" rel="noopener noreferrer" className='w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors'>
              <Image src="/images/facebook.jpeg" alt="Facebook" width={18} height={18} />
            </Link>
            <Link href="https://www.instagram.com/gokafood" target="_blank" rel="noopener noreferrer" className='w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors'>
              <Image src="/images/instagram.jpeg" alt="Instagram" width={18} height={18} />
            </Link>
            <Link href="https://www.tiktok.com/@gokafood" target="_blank" rel="noopener noreferrer" className='w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors'>
              <Image src="/images/tiktok.png" alt="TikTok" width={18} height={18} />
            </Link>
          </div>
        </div>
      </div >

      {/* Legal */}
      <p className="text-center text-xs text-gray-400 font-roboto mt-8 leading-relaxed">
        By continuing, you agree to our{' '}
        <Link href="/terms" className="text-primary-500 hover:underline">Terms of Service</Link>
        {' '}and{' '}
        <Link href="/privacy" className="text-primary-500 hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}
