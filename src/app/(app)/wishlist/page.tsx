'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Star, Plus } from 'lucide-react';
import { useAddToCart, useWishlist } from '@/lib/hooks/use-api';
import WishlistButton from '@/components/food/WishlistButton';
import { formatNaira } from '@/lib/utils';
import { getDistanceAndTime } from '@/lib/utils/location';
import { useState, useEffect } from 'react';

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();
  const { mutateAsync: serverAdd } = useAddToCart();
  const [distances, setDistances] = useState<Record<string, { distance: number; time: number }>>({});

  useEffect(() => {
    async function fetchDistances() {
      if (wishlist) {
        const results = await Promise.all(
          wishlist.map(async ({ id, foodItem }) => {
            try {
              const result = await getDistanceAndTime({
                lat: foodItem.coordinates.lat,
                lon: foodItem.coordinates.lng,
              });
              return { id, distance: result.distance, time: result.time };
            } catch (error) {
              console.error(`Error fetching distance for item ${id}:`, error);
              return { id, distance: 0, time: 0 };
            }
          })
        );

        const distanceMap = results.reduce((acc, { id, distance, time }) => {
          acc[id] = { distance, time };
          return acc;
        }, {} as Record<string, { distance: number, time: number }>);

        setDistances(distanceMap);
      }
    }

    fetchDistances();
  }, [wishlist]);

  const handleAddToCart = async (food: any) => {
    if (!food) return;
    await serverAdd({ productId: food._id, quantity: 1 });

  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-gray-50 backdrop-blur-sm border-b border-gray-200/60 z-10 px-5 lg:px-8 pt-12 lg:pt-8 pb-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Your Wishlist</h1>
          {wishlist && wishlist.length > 0 && (
            <p className="text-sm text-gray-500 font-roboto mt-0.5">
              {wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}
            </p>
          )}

        </div>
      </div>

      <div className="px-5 lg:px-8 py-6 max-w-screen-xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 flex items-center gap-3 h-24">
                <div className="w-20 h-[72px] rounded-xl skeleton flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-3/4 skeleton rounded" />
                  <div className="h-3 w-1/2 skeleton rounded" />
                  <div className="h-3.5 w-1/3 skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : !wishlist?.length ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-5">
              <Heart size={40} className="text-red-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No favourites yet</h2>
            <p className="text-gray-500 text-sm font-roboto max-w-[280px] mb-8">
              Tap the ❤️ on any meal to save it here. Your cravings deserve a home!
            </p>
            <Link href="/discover" className="btn-primary max-w-[220px]">
              Browse Menu
            </Link>
          </div>
        ) : (
          /* ── Grid of wishlisted items ── */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {wishlist.map((foodItem: any) => (
              <Link
                key={foodItem._id}
                href={`/product/${foodItem._id}`}
                className="block group"
              >
                <div className="food-card flex items-center gap-3 p-3 hover:shadow-card-hover transition-shadow duration-200">

                  {/* Image with heart overlay */}
                  <div className="relative w-[88px] h-[80px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={foodItem.productImage}
                      alt={foodItem.productName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="88px"
                    />
                    {/* Heart — always filled red since these are wishlisted */}
                    <div className="absolute bottom-1 right-1">
                      <WishlistButton
                        food={foodItem}
                        size={14}
                        variant="overlay"
                        className="w-6 h-6"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {foodItem.productName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 font-roboto capitalize">
                        {foodItem.productCategory}
                      </span>
                      <span className="text-gray-200">|</span>
                      <span className="text-primary-500 text-xs font-semibold truncate">
                        {foodItem.partnerId.brandName}
                      </span>
                    </div>
                    <p className="text-primary-500 font-bold text-base mt-1">
                      {formatNaira(foodItem.productPrice)}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <div className="flex items-center gap-1">
                        <Star
                          size={11}
                          className={foodItem.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}
                        />
                        <span className="text-xs text-gray-500 font-roboto">
                          {foodItem.rating ? foodItem.rating.toFixed(1) : 'Not Rated'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <MapPin size={11} />
                        <span className="text-xs font-roboto">
                          {distances[foodItem._id]?.distance?.toFixed(2)} km · {Math.round(distances[foodItem._id]?.time || 0)} mins
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(foodItem);
                    }}
                    className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-btn active:scale-90 transition-transform hover:bg-primary-600"
                    aria-label={`Add ${foodItem.productName} to cart`}
                  >
                    <Plus size={18} className="text-white" strokeWidth={3} />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
