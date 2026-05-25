'use client';

import { useState, useCallback } from 'react';
import { useWishlist, useToggleWishlist } from '@/lib/hooks/use-api';
import { isAuthenticated } from '@/lib/api/client';
import { toast } from 'sonner';

export function useWishlistItem(foodId: string) {
  const authed = isAuthenticated();
  const { data: wishlist } = useWishlist();
  const { mutateAsync: toggle, isPending: serverPending } = useToggleWishlist();
  // Track animation
  const [animating, setAnimating] = useState(false);


  const isWishlisted =!!wishlist?.find((w: any) => w._id === foodId);

  const triggerAnimation = useCallback(() => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
  }, []);

  const handleToggle = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    triggerAnimation();

    // Live mode
    if (!authed) {
      toast.error('Sign in to save favourites');
      return;
    }
    try {
      await toggle({ productId: foodId, isInWishlist: isWishlisted });
      toast(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist', {
        icon: isWishlisted ? '🤍' : '❤️',
      });
    } catch {
      toast.error('Something went wrong');
    }
  };

  return {
    isWishlisted,
    handleToggle,
    isPending: serverPending,
    animating,
  };
}
