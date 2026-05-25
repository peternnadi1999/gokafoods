'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils';
import Image from 'next/image';
import { useForgotPassword } from '@/lib/hooks/use-api';

const schema = z.object({ userEmail: z.string().email('Enter a valid email address'), platform: z.enum(['web', 'app']).default('web'), });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { mutateAsync: forgotPasswordMutation, isPending: isForgotPasswordPending } = useForgotPassword();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await forgotPasswordMutation(data);
      router.push(`/reset-password?email=${encodeURIComponent(data.userEmail)}`);
      toast.success('Reset code has been sent!');
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
        <span className="text-gray-900 font-bold text-xl">GokaFood</span>
      </div>

      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-8 w-fit">
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Back</span>
      </button>

        <>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Forgot Password?</h2>
          <p className="text-gray-500 text-sm font-roboto mb-8">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('userEmail')} type="email" placeholder="Email address" autoComplete="email" className="input-field pl-11" />
              </div>
              {errors.userEmail && <p className="text-red-500 text-xs mt-1 ml-1">{errors.userEmail.message}</p>}
            </div>
            <button type="submit" disabled={isForgotPasswordPending} className="btn-primary">
              {isForgotPasswordPending ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6 font-roboto">
            Remembered it?{' '}
            <Link href="/login" className="text-primary-500 font-semibold hover:underline">Sign In</Link>
          </p>
        </>
     
    </div>
  );
}
