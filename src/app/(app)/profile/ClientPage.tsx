"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ClipboardList, Gift, Stamp, CreditCard,
  Settings, CircleX, HelpCircle, LogOut, Camera,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLogout, useProfile, useStampCount, useUploadAvatar } from '@/lib/hooks/use-api';
import { formatNaira, getInitials } from '@/lib/utils';
import { useRef } from 'react';

// SEO Metadata

export default function ProfilePage() {
  const router = useRouter();
  const { mutateAsync: logout, isPending } = useLogout();
  const {data: stamp }= useStampCount()
  const STAMP_MAX = 10;
  const { data: profile } = useProfile();

  const user = profile?.user
  const stampCount = stamp?.userStamp || 0;

  const {
    mutateAsync: uploadAvatar,
    isPending: uploading,
  } = useUploadAvatar();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/login');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      await uploadAvatar(file);

      toast.success('Profile image updated');
    } catch (error) {
      console.error(error);

      toast.error('Failed to upload image');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Page header */}
      <div className="sticky top-0 bg-gray-50 backdrop-blur-sm border-b border-gray-200/60 z-10 px-5 lg:px-8 pt-12 lg:pt-8 pb-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        </div>
      </div>

      <div className="px-5 lg:px-8 py-6 max-w-screen-xl mx-auto">
        {/* Desktop: two-column. Mobile: single column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ── LEFT PANEL: Avatar + balance ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-card text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="relative w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mx-auto">
                  {user?.userPhoto ? (
                    <Image
                      src={user?.userPhoto}
                      alt={user.userName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-500">
                      {user
                        ? getInitials(user.userName)
                        : '?'}
                    </span>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2
                        size={20}
                        className="text-white animate-spin"
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  className="absolute bottom-1 right-1 w-7 h-7 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center shadow transition-colors disabled:opacity-50"
                >
                  <Camera
                    size={13}
                    className="text-white"
                  />
                </button>
              </div>

              {user?.userName && (
                <p className="font-bold text-gray-900 text-lg">{user.userName}</p>
              )}
              {user?.userEmail && (
                <p className="text-gray-400 text-sm font-roboto mt-0.5">{user.userEmail}</p>
              )}

              {/* Balance card */}
              <div className="mt-5 bg-primary-500 rounded-2xl px-4 py-4">
                <p className="text-primary-100 text-xs font-roboto mb-1">Wallet Balance</p>
                <p className="text-white font-bold text-2xl">{formatNaira(user?.userBalance || 0)}</p>
                <button
                  onClick={() => router.push('/profile/wallet')}
                  className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
                >
                  Fund Wallet
                </button>
              </div>

              {/* Stamp Card */}
              <div className="mt-5 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Stamp size={16} className="text-gray-600" />
                  <span className="font-semibold text-gray-800 text-sm">Stamp Card</span>
                  <span className="ml-auto text-xs text-gray-400 font-roboto">{stampCount}/{STAMP_MAX}</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {Array.from({ length: STAMP_MAX }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${i < stampCount
                        ? 'bg-primary-500 border-primary-500 scale-110'
                        : 'bg-gray-100 border-gray-200'
                        }`}
                    />
                  ))}
                </div>
                {stampCount < STAMP_MAX && (
                  <p className="text-xs text-gray-400 font-roboto mt-2">
                    {STAMP_MAX - stampCount} more order{STAMP_MAX - stampCount !== 1 ? 's' : ''} to unlock a free meal
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL: Menu items ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Account section */}
            <div className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="px-5 pt-5 pb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</p>
              </div>
              <div className="divide-y divide-gray-50">
                <MenuItem icon={<ClipboardList size={20} />} label="My Orders" onClick={() => router.push('/orders')} />
                <MenuItem icon={<Gift size={20} />} label="Reward" onClick={() => router.push('/rewards')}/>
              </div>
            </div>

            {/* Settings section */}
            <div className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="px-5 pt-5 pb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Settings</p>
              </div>
              <div className="divide-y divide-gray-50">
                <MenuItem icon={<CreditCard size={20} />} label="Fund Wallet" onClick={() => router.push('/profile/wallet')} />
                <MenuItem icon={<Settings size={20} />} label="Account Management" onClick={() => router.push('/profile/account')} />
                <MenuItem icon={<HelpCircle size={20} />} label="Help & Support" onClick={() => router.push('/help')} />
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="divide-y divide-gray-50">
                <MenuItem
                  icon={<CircleX size={20} className="text-red-400" />}
                  label="Close Account"
                  labelClass="text-red-500"
                  onClick={() => { }}
                />
                <MenuItem
                  icon={<LogOut size={20} className="text-primary-500" />}
                  label="Logout"
                  labelClass="text-primary-500"
                  onClick={handleLogout}
                  disabled={isPending}
                />
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 font-roboto py-2">
              GokaFood v1.0 · Tastes That Move You
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  labelClass?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string;
}

function MenuItem({ icon, label, labelClass, onClick, disabled, badge }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors disabled:opacity-40 group"
    >
      <span className="text-gray-600 flex-shrink-0">{icon}</span>
      <span className={`font-medium text-gray-800 flex-1 ${labelClass || ''}`}>{label}</span>
      {badge && (
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-roboto">{badge}</span>
      )}
      {!disabled && (
        <ChevronRight size={16} className="text-gray-300 flex-shrink-0 group-hover:text-gray-400 transition-colors" />
      )}
    </button>
  );
}
