'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/hooks/use-api';

const navItems = [
  { href: '/discover', label: 'Discover', icon: Home },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const {data:cartData} = useCart();

  const cartCount =( cartData as any)?.count ?? 0;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white shadow-nav z-50 bottom-nav">
      <div className="flex items-center justify-around pt-3 pb-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          const isCart = href === '/cart';

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 min-w-[64px] relative"
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={cn(
                    'transition-colors duration-200',
                    isActive ? 'text-primary-500' : 'text-gray-400'
                  )}
                  fill={isActive && href === '/wishlist' ? 'currentColor' : 'none'}
                />
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-[11px] font-medium transition-colors duration-200',
                  isActive ? 'text-primary-500' : 'text-gray-400'
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
