'use client';

import { useState } from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { formatNaira } from '@/lib/utils';
import { useInitiateOrder, useProfile } from '@/lib/hooks/use-api';
import dynamic from 'next/dynamic';
const PaystackCheckoutButton = dynamic(
  () => import('./PaystackCheckoutButton'),
  { ssr: false },
);
import { CartItemresponse } from '@/types';
import { useRouter } from 'next/navigation';

interface ConfirmOrderModalProps {
  open: boolean;
  onClose: () => void;
  quantity: number;
  totalAmount: number;
  userLocation: { lat: number; lng: number };
  cartItems: CartItemresponse[];
  quantities: Record<string, number>;
  confirmDetails: any;
  clearCart: () => void;
}

export default function ConfirmOrderModal({
  open,
  onClose,
  totalAmount,
  confirmDetails,
  quantity,
  userLocation,
  quantities,
  clearCart,
  cartItems,
}: ConfirmOrderModalProps) {
  const [showPaymentModal, setShowPaymentModal] =
    useState(false);
  const { mutateAsync: initiateOrder } = useInitiateOrder();
  const router = useRouter();

  const { data: profile } = useProfile();
  const user = profile?.user;

  const cardPaymentAmount = totalAmount + (confirmDetails?.summary?.grandTotalDeliveryCost || 0);

  if (!open || !confirmDetails) return null;

  const totalCost =
    totalAmount +
    confirmDetails?.summary
      .grandTotalDeliveryCost;

  const handlePaymentSelect = (
    method: 'card' | 'balance'
  ) => {
    if (method === 'balance') {
      initiateOrder({
        cartItems: cartItems.map((item: any) => ({
          _id: item._id,
          quantity: quantities[item._id] ?? item.quantity ?? 1,
          partnerLocationTitle:
            item?.partnerId.location || {},
          partnerCoordinates:
            item?.partnerId.coordinates || {},
          addressDetails:
            confirmDetails.deliveryAddress || {},
        })),
        uniqueKey: localStorage.getItem(
          'order_unique_key'
        ),
        promoKey: "",
        amount: totalCost,
        paidWith: 'balance',
        reference: `PAY-${Date.now()}-${user?._id}`,
        useBalance: true,
        location: {
          address: confirmDetails.deliveryAddress,
          lat: userLocation.lat,
          lng: userLocation.lng,
        },
      });

      localStorage.removeItem(
        'order_unique_key'
      );

      clearCart();
      onClose();
      router.push('/orders');
    }

    setShowPaymentModal(false);
  };


  return (
    <>
      {/* MAIN CONFIRM MODAL */}
      <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="w-full lg:max-w-md bg-white rounded-t-3xl lg:rounded-3xl p-6 animate-in slide-in-from-bottom duration-300">

          {/* Mobile Handle */}
          <div className="w-14 h-1.5 bg-gray-200 rounded-full mx-auto mb-5 lg:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Order Summary ({quantity})
              </h2>

              <p className="text-sm text-gray-500">
                Review your payment details
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Details */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                Items Subtotal
              </span>

              <span className="font-semibold text-gray-900">
                {formatNaira(totalAmount)}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500 mb-3">
                Delivery Breakdown
              </p>

              <div className="bg-white rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    Trip #{' '}
                    {
                      confirmDetails?.summary
                        ?.totalTrips
                    }
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {
                      confirmDetails?.summary
                        ?.totalDistanceInKm
                    }{' '}
                    km combined route
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatNaira(
                      confirmDetails?.summary
                        ?.grandTotalDeliveryCost
                    )}
                  </p>

                  <p className="text-xs text-gray-500">
                    Base:{' '}
                    {formatNaira(
                      confirmDetails?.chunks?.[0]
                        ?.appliedBaseFee
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                Total Cost
              </span>

              <span className="text-xl font-bold text-primary-500">
                {formatNaira(totalCost)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() =>
                setShowPaymentModal(true)
              }
              className="btn-primary"
            >
              Proceed to Payment
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 text-gray-600 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* PAYMENT METHOD MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-end lg:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full lg:max-w-sm bg-white rounded-t-3xl lg:rounded-3xl p-6 animate-in slide-in-from-bottom duration-300">

            {/* Mobile Handle */}
            <div className="w-14 h-1.5 bg-gray-200 rounded-full mx-auto mb-5 lg:hidden" />

            <div className="mb-5 text-center">
              <h2 className="text-xl font-bold text-gray-900">
                Choose Payment Method
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Select how you want to pay
              </p>
            </div>

            <div className="space-y-3">
              {/* Pay with Balance */}
              <button
                onClick={() =>
                  handlePaymentSelect(
                    'balance'
                  )
                }
                className="w-full border border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:border-primary-500 transition"
              >
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                  <Wallet className="text-primary-500" />
                </div>

                <div className="text-left">
                  <p className="font-semibold text-gray-900">
                    Pay with Balance
                  </p>

                  <p className="text-sm text-gray-500">
                    Use your wallet balance
                  </p>
                </div>
              </button>

                <PaystackCheckoutButton
                  email={user?.userEmail || ''}
                  amount={cardPaymentAmount}
                  userId={user?._id || ''}
                  onSuccess={(reference) => {
                    initiateOrder({
                      cartItems: cartItems.map((item: any) => ({
                        _id: item._id,
                        quantity:
                          quantities[item._id] ?? item.quantity ?? 1,
                        partnerLocationTitle:
                          item?.partnerId.location || {},
                        partnerCoordinates:
                          item?.partnerId.coordinates || {},
                        addressDetails:
                          confirmDetails.deliveryAddress || {},
                      })),
                      uniqueKey: localStorage.getItem(
                        'order_unique_key',
                      ),
                      promoKey: '',
                      amount: totalCost,
                      paidWith: 'card',
                      reference: reference.reference,
                      useBalance: false,
                      location: {
                        address: confirmDetails.deliveryAddress,
                        lat: userLocation.lat,
                        lng: userLocation.lng,
                      },
                    });

                    localStorage.removeItem('order_unique_key');
                    clearCart();
                    onClose();
                    router.push('/orders');
                  }}
                  onClose={() => {
                    onClose();
                  }}
                  className="w-full border border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:border-primary-500 transition"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                    <CreditCard className="text-primary-500" />
                  </div>

                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Pay with Card</p>

                    <p className="text-sm text-gray-500">
                      Secure online payment
                    </p>
                  </div>
                </PaystackCheckoutButton>
            </div>

            {/* Cancel */}
            <button
              onClick={() =>
                setShowPaymentModal(false)
              }
              className="w-full mt-6 py-3 text-gray-500 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}