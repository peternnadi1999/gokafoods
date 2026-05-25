'use client';

import { usePaystackPayment } from 'react-paystack';

interface PayButtonProps {
  email: string;
  amount: number;
  userId: string;
}

export default function usePaystack({
  email,
  amount,
  userId,
}: PayButtonProps) {
  const config = {
    reference: `PAY-${Date.now()}-${userId}`,
    email,
    amount: amount * 100,
    publicKey:
      process.env
        .NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  };

  return usePaystackPayment(config);
}