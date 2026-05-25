import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Welcome to GokaFood',
};

export default function WelcomePage() {
  return (
    <div className="app-shell flex flex-col min-h-screen">
      {/* Illustration */}
      <div className="flex-1 bg-[#FFF] flex items-center justify-center p-10">
        <div className="relative w-full max-w-[280px] aspect-square">
          <Image src="/images/gokafood.jpeg" alt="Food Delivery Illustration" fill className="object-contain pointer-events-none select-none" />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-t-4xl px-6 pt-8 pb-10">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Quick &amp; Fastest Food Delivery for you
        </h1>
        <p className="text-gray-500 text-sm text-center font-roboto mb-8">
          Create and order your food in the fastest and most convenient way possible.
        </p>

        <Link href="/login" className="btn-primary block text-center">
          Get Started <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
}
