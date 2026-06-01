"use client";
import dynamic from 'next/dynamic';
import { ArrowLeft, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useFundWallet, useProfile } from '@/lib/hooks/use-api';
import { formatNaira } from '@/lib/utils';

// SEO Metadata

const PaystackCheckoutButton = dynamic(
  () => import('@/components/cart/PaystackCheckoutButton'),
  { ssr: false },
);

const PRESET_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

export default function FundWalletPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const { mutateAsync: fundWallet, isPending } = useFundWallet();

  const { data: profile } = useProfile();

  const user = profile?.user
  const num = parseInt(amount, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-gray-50 z-10 px-5 pt-14 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-card"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Fund Wallet</h1>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Balance card */}
        <div className="bg-primary-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={18} />
            <span className="text-sm opacity-80 font-roboto">Current Balance</span>
          </div>
          <p className="text-3xl font-bold">{formatNaira(user?.userBalance || 0)}</p>
        </div>

        {/* Amount input */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Enter Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold font-roboto">₦</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="100"
              className="input-field pl-9 text-xl font-bold"
            />
          </div>
        </div>

        {/* Quick amounts */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Quick Select
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset.toString())}
                className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${amount === preset.toString()
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
              >
                {formatNaira(preset)}
              </button>
            ))}
          </div>
        </div>

        <PaystackCheckoutButton
          email={user?.userEmail || ''}
          amount={num}
          userId={user?._id || ''}
          disabled={isPending || !amount || num < 100}
          className="btn-primary w-full"
          onSuccess={async (reference) => {
            await fundWallet({ amount: num, reference: reference.reference });
            toast.success(`₦${num.toLocaleString()} added to wallet!`);
            router.back();
          }}
          onClose={() => {
            /* optional close handler */
          }}
        >
          {isPending ? 'Processing…' : `Fund ${amount ? formatNaira(parseInt(amount)) : 'Wallet'}`}
        </PaystackCheckoutButton>

        <p className="text-xs text-center text-gray-400 font-roboto">
          Secured by Paystack · Your payment info is never stored
        </p>
      </div>
    </div>
  );
}
