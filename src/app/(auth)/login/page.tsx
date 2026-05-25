'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useLogin } from '@/lib/hooks/use-api';
import { useResendVerification } from '@/lib/hooks/use-email-verification';
import { getErrorMessage } from '@/lib/utils';
import Image from 'next/image';

const schema = z.object({
  userEmail: z.string().email('Enter a valid email address'),
  userPassword: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/discover';
  const [showPwd, setShowPwd] = useState(false);
  const { mutateAsync: login, isPending } = useLogin();
  const { mutateAsync: resend } = useResendVerification();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      toast.success('Welcome back!');
      router.push(redirect);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      if (errorMessage === 'Please verify your email to login') {
        try {
          await resend({ userEmail: data.userEmail, platform: "web" });
          router.push(`/verify-email?email=${encodeURIComponent(data.userEmail)}`);
        } catch (resendError) {
          toast.error('Failed to resend verification email. Please try again.');
        }
      } else {
        toast.error(errorMessage);
      }
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
        <Link href="/signup" className="text-primary-500 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
          Sign Up <ArrowRight size={14} />
        </Link>
      </div>

      <h2 className="text-3xl font-black text-gray-900 mb-1">Welcome Back</h2>
      <p className="text-gray-500 text-sm font-roboto mb-8">Sign in to your account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <div className="relative">
            <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('userEmail')}
              type="email"
              placeholder="Email"
              autoComplete="email"
              className="input-field pl-11"
            />
          </div>
          {errors.userEmail && <p className="text-red-500 text-xs mt-1 ml-1">{errors.userEmail.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('userPassword')}
              type={showPwd ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
              className="input-field pl-11 pr-11"
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.userPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.userPassword.message}</p>}
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-primary-500 text-sm font-medium hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      {/* Demo credentials hint */}
      {/* <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
        <p className="text-xs font-semibold text-amber-700 mb-1">🧪 Demo credentials</p>
        <p className="text-xs text-amber-600 font-roboto">Email: <span className="font-semibold">demo@gokafood.com</span></p>
        <p className="text-xs text-amber-600 font-roboto">Password: <span className="font-semibold">Demo1234</span></p>
      </div> */}

      <p className="text-center text-sm text-gray-500 mt-6 font-roboto">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary-500 font-semibold hover:underline">Join Us</Link>
      </p>
    </div>
  );
}
