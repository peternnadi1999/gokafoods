"use client";
import { ArrowLeft, User, Lock, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useProfile, useUpdateProfile } from '@/lib/hooks/use-api';
import { getErrorMessage } from '@/lib/utils';
import { useEffect } from 'react';

// SEO Metadata

const profileSchema = z.object({
  userName: z.string().min(2, 'Full name is required'),
  userPhone: z.string().min(10, 'Enter a valid phone number'),
  userPassword: z.string().min(2, 'Enter your password'),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function AccountManagementPage() {
  const router = useRouter();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const { data: profile } = useProfile();
  const user = profile?.user

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: '',
      userPhone: '',
      userPassword: '',
    },
  });

 
  useEffect(() => {
    if (user) {
      reset({
        userName: user.userName || '',
        userPhone: String(user.userPhone || ''),
        userPassword: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-gray-50 z-10 px-5 pt-14 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-card"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Account Management</h1>
        </div>
      </div>

      <div className="px-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
                User Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('userName')}
                  type="text"
                  className="input-field pl-10"
                />
              </div>
              {errors.userName && (
                <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>
              )}
            </div>


            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
                Phone
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('userPhone')}
                  type="tel"
                  className="input-field pl-10"
                />
              </div>
              {errors.userPhone && (
                <p className="text-red-500 text-xs mt-1">{errors.userPhone.message}</p>
              )}
            </div>


            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('userPassword')}
                  type="password"
                  className="input-field pl-10"
                />
              </div>
              {errors.userPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.userPassword.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || !isDirty}
            className="btn-primary"
          >
            {isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
