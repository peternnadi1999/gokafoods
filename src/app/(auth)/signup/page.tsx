'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Lock, Eye, EyeOff, Tag, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useSignup } from '@/lib/hooks/use-api';
import { getErrorMessage } from '@/lib/utils';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up – GokaFood',
  description: 'Create a new GokaFood account to order food from top restaurants. Quick registration with email and phone verification.',
  keywords: ['GokaFood signup', 'create account', 'register', 'new user', 'food delivery registration'],
  openGraph: {
    title: 'Create Your GokaFood Account',
    description: 'Join GokaFood and start ordering from your favorite restaurants today.',
    type: 'website',
  },
};

const schema = z.object({
  userName: z.string().min(2, 'Full name is required'),
  userEmail: z.string().email('Enter a valid email'),
  userPhone: z.string().min(10, 'Enter a valid phone number').regex(/^(\+234|0)[789]\d{9}$/, 'Enter a valid Nigerian phone number'),
  userPassword: z.string().min(8, 'At least 8 characters').regex(/[A-Z]/, 'Add an uppercase letter').regex(/[0-9]/, 'Add a number'),
  platform: z.enum(['web', 'app']).default('web'),
  promoCode: z.string().optional(),
});
type SignupForm = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const { mutateAsync: signup, isPending } = useSignup();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      await signup(data);
      toast.success('Account created! Please verify your email.');
      router.push(`/verify-email?email=${encodeURIComponent(data.userEmail)}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 px-8 py-12 lg:px-14 max-w-[520px] w-full mx-auto lg:mx-0">

      {/* Mobile brand */}
      <div className="lg:hidden flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
          <Image src="/images/gkf-logo.png" alt="GokaFood Logo" width={20} height={20} />
        </div>
        <span className="text-primary-500 font-bold text-xl">GokaFood</span>
      </div>

      {/* Top nav row */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push('/welcome')}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X size={16} className="text-gray-600" />
        </button>
        <Link href="/login" className="text-primary-500 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
          Log In <ArrowRight size={14} />
        </Link>
      </div>

      <h2 className="text-3xl font-black text-gray-900 mb-1">Join Us</h2>
      <p className="text-gray-500 text-sm font-roboto mb-8">Create your GokaFood account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Full Name */}
        <div>
          <div className="relative">
            <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...register('userName')} type="text" placeholder="Full Name" autoComplete="name" className="input-field pl-11" />
          </div>
          {errors.userName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.userName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...register('userEmail')} type="email" placeholder="Email" autoComplete="email" className="input-field pl-11" />
          </div>
          {errors.userEmail && <p className="text-red-500 text-xs mt-1 ml-1">{errors.userEmail.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <div className="relative">
            <Phone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...register('userPhone')} type="tel" placeholder="Phone (e.g. 08012345678)" autoComplete="tel" className="input-field pl-11" />
          </div>
          {errors.userPhone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.userPhone.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('userPassword')}
              type={showPwd ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="new-password"
              className="input-field pl-11 pr-11"
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.userPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.userPassword.message}</p>}
        </div>

        {/* Promo Code */}
        <div>
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Tag size={17} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-gray-400" />
              <input
                {...register('promoCode')}
                type="text"
                placeholder="Promo code (optional)"
                className="input-field pl-11 uppercase tracking-widest text-sm transition-all"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 font-roboto mt-6">
        By continuing, you agree to our{' '}
        <Link href="/terms" className="text-primary-500 hover:underline">Terms of Service</Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-primary-500 hover:underline">Privacy Policy</Link>
      </p>
    </div >
  );
}
