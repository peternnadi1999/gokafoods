'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Heart,
  ShoppingCart,
  User,
  Search,
  Package,
  HelpCircle,
  LogOut,
  Bell,
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { useCart, useLogout, useProfile, useUnreadNotificationCount } from '@/lib/hooks/use-api';
import { toast } from 'sonner';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getCurrentPosition } from '@/lib/utils/location';

const NAV_ITEMS = [
  { href: '/discover', label: 'Discover', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/orders', label: 'Orders', icon: Package },
];

const BOTTOM_ITEMS = [
  { href: '/help', label: 'Help & Support', icon: HelpCircle },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {data: unreadCount }= useUnreadNotificationCount();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { data: cartData } = useCart(userLocation?.lat, userLocation?.lng);

  const cartCount = (cartData as any)?.count ?? 0



  const { mutateAsync: logout } = useLogout();
  const { data: profile } = useProfile();
  const user = profile?.user;

  useEffect(() => {
      const fetchLocation = async () => {
        try {

          const location = await getCurrentPosition();
          setUserLocation(location);
        } catch (error) {
          toast.error('Unable to get your location');
        }
      };
  
      fetchLocation();
    }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/login');
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="desktop-sidebar thin-scrollbar flex-col justify-between py-6 px-4">
      {/* Logo */}
      <div>
        <Link href="/discover" className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <Image src="/images/gkf-logo.png" alt="GokaFood Logo" width={20} height={20} />
          </div>
          <div>
            <p className="font-black text-primary-500 text-base leading-tight">GokaFood</p>
            <p className="text-gray-400 text-[11px] font-roboto">Tastes That Move You</p>
          </div>
        </Link>

        {/* Main nav */}
        <nav className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            const isCart = href === '/cart';
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
                  active
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <div className="relative flex-shrink-0">
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 1.8}
                    className={cn(active ? 'text-primary-500' : 'text-gray-500 group-hover:text-gray-700')}
                  />
                  {isCart && cartCount !== 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span>{label}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-100 my-4" />

        {/* Bottom items */}
        <nav className="space-y-1">
          {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                  active
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={cn(active ? 'text-primary-500' : 'text-gray-500 group-hover:text-gray-700')}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User section at bottom */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        {user ? (
          <div className="px-2 space-y-3">
            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mx-auto">
                {user?.userPhoto ? (
                  <Image
                    src={user?.userPhoto}
                    alt={user.userName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="font-semibold text-gray-900 text-sm truncate">
                    {user
                      ? getInitials(user.userName)
                      : '?'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {user.userName?.split(' ')[0]}
                </p>
                <p className="text-gray-400 text-xs font-roboto truncate">{user.userEmail}</p>
              </div>
              <button className="w-7 relative h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Bell size={14} className="text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
             </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="block w-full text-center bg-primary-500 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary-600 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </aside>
  );
}
