'use client';

import { MapPin, Minus, Plus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { formatDistance, formatNaira, generateShortUniqueKey } from '@/lib/utils';
import { useCart, useClearCart, useConfirmOrderCost, useRemoveCartItem } from '@/lib/hooks/use-api';
import { estimateTime, getCurrentPosition } from '@/lib/utils/location';
import { useEffect, useMemo, useState } from 'react';
import { CartItemresponse } from '@/types';
import ConfirmOrderModal from '@/components/cart/ConfirmOrderModal';
import LocationModal from '@/components/cart/LocationModal';

export default function CartPage() {
  const { mutateAsync: serverRemove } = useRemoveCartItem();
  const { mutateAsync: serverClear } = useClearCart();
  const [confirmDetails, setConfirmDetails] = useState(null);
  const [quantities, setQuantities] = useState<
    Record<string, number>
  >({});
  const { mutateAsync: serverConfirmCost } = useConfirmOrderCost()
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(true);
  const [showLocationModal, setShowLocationModal] =
    useState(false);
  const { data: itemsData, isLoading } = useCart(userLocation?.lat, userLocation?.lng);

  useEffect(() => {
    const fetchLocation = async () => {
      try {

        setIsGettingLocation(true);
        const location = await getCurrentPosition();
        setUserLocation(location);
      } catch (error) {
        toast.error('Unable to get your location');
      } finally {
        setIsGettingLocation(false);
      }
    };

    fetchLocation();
  }, []);

  useMemo(() => {
    if (Array.isArray(itemsData?.data)) {
      const initialQuantities: Record<string, number> = {};
      itemsData.data.forEach((item: any) => {
        initialQuantities[item._id] = item.quantity || 1;
      });
      setQuantities(initialQuantities);
    }
  }, [itemsData]);

  const items = useMemo(() => {
    return Array.isArray(itemsData?.data) ? itemsData.data : [];
  }, [itemsData]);

  const averageSpeed = 50; // average delivery speed in km/h for time estimation


  const updateQuantity = (
    itemId: string,
    quantity: number
  ) => {
    if (quantity < 1) return;

    setQuantities((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const { totalAmount, itemCount } = useMemo(() => {
    let total = 0;
    let count = 0;

    items.forEach((item: any) => {
      const quantity = quantities[item._id] ?? item.quantity ?? 1;
      total += item.productPrice * quantity;
      count += quantity;
    });

    return { totalAmount: total, itemCount: count };
  }, [items, quantities]);


  const handleConfirm = async (
    selectedLocation: {
      lat: number;
      lng: number;
      address: string;
    }
  ) => {
    if (!userLocation) {
      toast.error('Unable to get your location. Please enable location services.');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const uniqueKey = generateShortUniqueKey();
    localStorage.setItem('order_unique_key', uniqueKey);

    console.log('Order confirmation result:', selectedLocation.address);

    try {
      const result = await serverConfirmCost({
        cartItems: items.map((item: CartItemresponse) => ({
          _id: item._id,
          quantity: quantities[item._id] ?? item.quantity ?? 1,
        })),
        uniqueKey: uniqueKey,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      });

      setUserLocation({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      });


      setConfirmDetails({
        ...result,
        deliveryAddress:
          selectedLocation.address,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        uniqueKey,
      });

    } catch (error: any) {
      console.error('Order confirmation failed:', error);
      toast.error(error.message || 'Failed to confirm order');
    }
  };


  const removeItem = async (itemId: string) => {
    await serverRemove(itemId);
  }

  const clearCart = async () => {
    await serverClear();
  }


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 px-5 lg:px-8 py-6 max-w-screen-xl mx-auto">
        <div className="h-8 w-1/3 skeleton rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 flex items-center gap-3 h-32">
              <div className="w-20 h-[72px] rounded-xl skeleton flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-3/4 skeleton rounded" />
                <div className="h-3 w-1/2 skeleton rounded" />
                <div className="h-3.5 w-1/3 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isGettingLocation) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
      <div className="w-16 h-16 rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin" />

      <h2 className="mt-6 text-lg font-semibold text-gray-900">
        Getting your location...
      </h2>

      <p className="mt-2 text-sm text-center text-gray-500 max-w-xs">
        We need your location to calculate delivery distance,
        estimated arrival time and delivery fees.
      </p>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-gray-100/95 backdrop-blur-sm border-b border-gray-200/60 z-10 px-5 lg:px-8 pt-12 lg:pt-8 pb-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Shopping Cart {itemCount > 0 && <span className="text-gray-400">({itemCount})</span>}
            </h1>
          </div>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors underline">
              Clear Cart
            </button>
          )}
        </div>
      </div>

      <div className="px-5 lg:px-8 py-6 max-w-screen-xl mx-auto">
        {items.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-5">
              <ShoppingCart size={40} className="text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 text-sm font-roboto max-w-[300px] mb-8">
              Looks like you haven&apos;t added anything yet. Browse our delicious menu and find
              something you love!
            </p>
            <Link href="/discover" className="btn-primary max-w-[220px]">
              Start Ordering
            </Link>
          </div>
        ) : (
          /* ── Cart layout: items left, summary right ── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item: any) => (
                <div key={item._id} className="bg-white rounded-2xl p-4 shadow-card">
                  <div className="flex items-center gap-4">
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{item.productName}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-400">⭐ {item.rating !== 0 ? item.rating.toFixed(1) : 'Not Rated'}</span>
                            <span className="text-gray-200">|</span>
                            <span className="text-primary-500 text-xs font-semibold uppercase">
                              {item.partnerId?.brandName || 'Unknown Store'}
                            </span>
                          </div>
                          <div className="text-gray-400 flex items-center text-xs mt-0.5 font-roboto">
                            <MapPin size={13} className='mr-2' /> {formatDistance(item.distance)} <span className='ml-3'>{(estimateTime(item.distance, averageSpeed) * 60).toFixed(0)}mins</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-gray-500 hover:text-red-400 text-xs underline transition-colors flex-shrink-0 ml-2"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-primary-500 font-bold text-lg">
                          {formatNaira(item.productPrice)}
                        </span>
                        {/* Qty controls */}
                        <div className="flex items-center gap-3">
                          <button onClick={() =>
                            updateQuantity(
                              item._id,
                              (quantities[item._id] ??
                                item.quantity ??
                                1) - 1
                            )
                          } className="qty-btn-minus"><Minus size={15} /></button>
                          <span className="text-gray-900 font-bold w-5 text-center">{quantities[item._id] ?? item.quantity ?? 1}</span>
                          <button onClick={() =>
                            updateQuantity(
                              item._id,
                              (quantities[item._id] ??
                                item.quantity ??
                                1) + 1
                            )
                          } className="qty-btn-plus font-extrabold"><Plus size={15} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-5 shadow-card lg:sticky lg:top-28">
                <h2 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm font-roboto">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                    <span className="font-semibold text-gray-900">{formatNaira(totalAmount)}</span>
                  </div>

                </div>
                <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between mb-5">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-primary-500 text-xl">{formatNaira(totalAmount)}</span>
                </div>
                <button
                  onClick={() =>
                    setShowLocationModal(true)
                  } className="btn-primary">
                  Confirm Order
                </button>

                <p className="text-center text-xs text-gray-400 font-roboto mt-3">
                  🔒 Secured checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <LocationModal
        open={showLocationModal}
        onClose={() =>
          setShowLocationModal(false)
        }
        onConfirm={(location) => {
          setShowLocationModal(false);
          handleConfirm(location);
        }}
      />
      <ConfirmOrderModal
        open={!!confirmDetails}
        confirmDetails={confirmDetails}
        totalAmount={totalAmount}
        quantity={itemCount}
        quantities={quantities}
        cartItems={items}
        userLocation={userLocation!}
        clearCart={clearCart}
        onClose={() => setConfirmDetails(null)}
      />
    </div>
  );
}