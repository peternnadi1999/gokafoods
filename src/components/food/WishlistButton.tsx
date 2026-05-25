'use client';

import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlistItem } from '@/lib/hooks/use-wishlist-item';
import type { FoodItem } from '@/types';

interface WishlistButtonProps {
  food: FoodItem;
  className?: string;
  size?: number;
  variant?: 'overlay' | 'card' | 'pill';
}

export default function WishlistButton({
  food,
  className,
  size = 20,
  variant = 'card',
}: WishlistButtonProps) {
  
  const id = (food as any).productId || food._id;

  const { isWishlisted, handleToggle, isPending, animating } = useWishlistItem(id);

  if (variant === 'overlay') {
    return (
      <button
        onClick={handleToggle}
        disabled={isPending}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        className={cn(
          'flex items-center justify-center rounded-full transition-all duration-200',
          'active:scale-90 disabled:opacity-60',
          'w-9 h-9 bg-white/90 backdrop-blur-sm shadow-md hover:bg-white',
          isWishlisted && 'bg-red-50 hover:bg-red-100',
          className
        )}
      >
        <Heart
          size={size}
          strokeWidth={2}
          className={cn(
            'transition-colors duration-200',
            animating && 'heart-pop',
            isWishlisted
              ? 'text-red-500 fill-red-500'
              : 'text-gray-500 hover:text-red-400'
          )}
        />
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <button
        onClick={handleToggle}
        disabled={isPending}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        className={cn(
          'flex items-center justify-center rounded-full transition-all duration-200',
          'active:scale-90 disabled:opacity-60 flex-shrink-0',
          'w-9 h-9',
          isWishlisted
            ? 'bg-red-50 hover:bg-red-100'
            : 'bg-gray-100 hover:bg-red-50',
          className
        )}
      >
        <Heart
          size={size}
          strokeWidth={2.2}
          className={cn(
            'transition-colors duration-200',
            animating && 'heart-pop',
            isWishlisted
              ? 'text-red-500 fill-red-500'
              : 'text-gray-400 hover:text-red-400'
          )}
        />
      </button>
    );
  }

  // pill variant
  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-sm',
        'transition-all duration-200 active:scale-95 disabled:opacity-60',
        isWishlisted
          ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-200',
        className
      )}
    >
      <Heart
        size={size}
        strokeWidth={2}
        className={cn(
          'transition-colors duration-200',
          animating && 'heart-pop',
          isWishlisted ? 'fill-red-500 text-red-500' : ''
        )}
      />
      <span>{isWishlisted ? 'Saved' : 'Save'}</span>
    </button>
  );
}
