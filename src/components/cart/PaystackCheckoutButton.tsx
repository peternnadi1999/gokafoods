"use client";

import { useMemo, type ReactNode } from 'react';
import { usePaystackPayment } from 'react-paystack';

interface PaystackCheckoutButtonProps {
  email: string;
  amount: number;
  userId: string;
  onSuccess: (reference: any) => void;
  onClose?: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export default function PaystackCheckoutButton({
  email,
  amount,
  userId,
  onSuccess,
  onClose,
  disabled,
  className,
  children,
}: PaystackCheckoutButtonProps) {
  const config = useMemo(
    () => ({
      reference: `PAY-${Date.now()}-${userId}`,
      email,
      amount: Number.isFinite(amount) && amount > 0 ? amount * 100 : 0,
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    }),
    [amount, email, userId],
  );

  const initializePayment = usePaystackPayment(config);

  return (
    <button
      type="button"
      disabled={disabled}
      className={className}
      onClick={() =>
        initializePayment({
          onSuccess,
          onClose,
        })
      }
    >
      {children}
    </button>
  );
}
