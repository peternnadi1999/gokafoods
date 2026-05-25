'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, ArrowLeft, EyeOff, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils';
import Image from 'next/image';
import { useResetPassword } from '@/lib/hooks/use-api';

const schema = z.object(
    {
        email: z.string().email('Enter a valid email address'),
        otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
        userPassword: z.string().min(6, 'Password must be at least 6 characters'),
        confirmNewPassword: z.string().min(6, 'Confirm Password must be at least 6 characters'),
    },

).refine(
    (data) =>
        data.userPassword ===
        data.confirmNewPassword,
    {
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
    }
);

type FormData = z.infer<typeof schema>;


export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPwd, setShowPwd] = useState(false);

    const email = searchParams.get('email');

    // Redirect if email is missing
    useEffect(() => {
        if (!email) {
            toast.error('Invalid reset password session');
            router.replace('/forgot-password');
        }
    }, [email, router]);

    const { mutateAsync: resetPasswordMutation, isPending: isResetPasswordPending } = useResetPassword();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema), defaultValues: {
            email: email || '',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await resetPasswordMutation({ ...data, email: email || data.email });
            router.push('/login');
            toast.success('Password has been reset successfully!');
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    if (!email) return null;
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
                <h2 className="text-3xl font-black text-gray-900 mb-2">Reset Password?</h2>
                <p className="text-gray-500 text-sm font-roboto mb-8">
                    Enter the OTP sent to your email and set a new password.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div>
                        <input {...register('otp')} type="text" placeholder="OTP Code" autoComplete="one-time-code" className="input-field" />
                        {errors.otp && <p className="text-red-500 text-xs mt-1 ml-1">{errors.otp.message}</p>}
                    </div>
                    <div>
                        <div className="relative">
                            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                {...register('userPassword')}
                                type={showPwd ? 'text' : 'password'}
                                placeholder="New Password"
                                autoComplete="new-password"
                                className="input-field pl-11 pr-11"
                            />
                            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>

                        {errors.userPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.userPassword.message}</p>}
                    </div>
                    <div>
                        <div className="relative">
                            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                {...register('confirmNewPassword')}
                                type={showPwd ? 'text' : 'password'}
                                placeholder="Confirm New Password"
                                autoComplete="new-password"
                                className="input-field pl-11 pr-11"
                            />
                            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>

                        {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmNewPassword.message}</p>}
                    </div>


                    <button type="submit" disabled={isResetPasswordPending} className="btn-primary">
                        {isResetPasswordPending ? 'Resetting…' : 'Reset Password'}
                    </button>
                </form>
            </>

        </div>
    );
}
