'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Star, ChevronDown, ShoppingCart } from 'lucide-react';
import { useAddToCart, useFoodDetail, useProductCategory, useRateProduct, useRatings } from '@/lib/hooks/use-api';
import WishlistButton from '@/components/food/WishlistButton';
import { Modal } from '@/components/ui/Sheet';
import { formatNaira, getInitials } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getDistanceAndTime } from '@/lib/utils/location';
import PairingFoodCard from '@/components/food/PairingFoodCard';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { mutateAsync: serverAdd } = useAddToCart();
  const {mutateAsync: serverRate}=useRateProduct();
  const [quantity, setQuantity] = useState(1);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [distance, setDistance] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const { data: food, isLoading } = useFoodDetail(id);
  const category:any = food?.productCategory;
  const {data: suggestedFood} = useProductCategory(category);
  const { data: ratings } = useRatings(food?._id || '');

  const rates = (ratings as any)?.ratingsWithUserPhoto;


  useEffect(() => {
    if (food?.coordinates.lat && food?.coordinates.lng) {
      getDistanceAndTime({ lat: food.coordinates.lat, lon: food.coordinates.lng })
        .then(({ distance, time }) => {
          setDistance(`${distance.toFixed(1)} km`);
          setTime(`${time} mins`);
        })
        .catch((error) => {
          console.error('Error calculating distance and time:', error);
        });
    }
  }, [food]);

  const handleAddToCart = async (food: any) => {
    if (!food) return;
    await serverAdd({ productId: food._id, quantity });
  };

  const openRatingModal = () => {
    setSelectedRating(5);
    setRatingComment('');
    setShowRatingModal(true);
  };

  const handleRateProduct = async (rating: number, comment: string) => {
    if (!food) return;
    setRatingSubmitting(true);
    try {
      await serverRate({ productId: food._id, rating, comment });
      toast.success('Your rating has been submitted.');
      setShowRatingModal(false);
    } catch (error: any) {
      console.error('Rating submission failed:', error);
      toast.error(error?.message || 'Unable to submit rating.');
    } finally {
      setRatingSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-5 lg:px-8 py-8 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[400px] skeleton rounded-3xl" />
          <div className="space-y-4 pt-4">
            <div className="h-8 w-2/3 skeleton rounded" />
            <div className="h-4 w-1/2 skeleton rounded" />
            <div className="h-20 skeleton rounded-2xl" />
            <div className="h-12 skeleton rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Food item not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button row */}
      <div className="px-5 lg:px-8 pt-12 lg:pt-8 pb-2 max-w-screen-xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-card group-hover:shadow-card-hover transition-shadow">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-medium hidden lg:block">Back</span>
        </button>
      </div>

      <div className="px-5 lg:px-8 pb-10 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── LEFT: Hero image ── */}
          <div className="relative aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden bg-gray-200 shadow-card">
            <Image
              src={food.productImage}
              alt={food.productName}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

            {/* ❤️ Wishlist overlay — top-right, large and clear */}
            <div className="absolute top-4 right-4">
              <WishlistButton food={food} size={22} variant="overlay" className="w-12 h-12 shadow-lg" />
            </div>

            {/* Restaurant badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2 shadow">
              <span className="text-primary-500 text-xs">🍽</span>
              <span className="text-primary-600 text-xs font-bold uppercase">{food.partnerId.brandName}</span>
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="lg:sticky lg:top-24 space-y-5">
            {/* Title + price row */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight flex-1">{food.productName}</h1>
              <span className="text-primary-500 font-bold text-2xl flex-shrink-0">
                {formatNaira(food.productPrice)}
              </span>
            </div>

            {/* Restaurant + distance + wishlist pill */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-primary-50 border border-primary-100 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <span className="text-xs">🍽</span>
                <span className="text-primary-500 text-xs font-bold uppercase">{food.partnerId.brandName}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <MapPin size={14} />
                <span className="text-sm font-roboto">
                  {distance ? `${distance} · ${time}` : 'Calculating...'}
                </span>
              </div>
              <WishlistButton food={food} size={15} variant="pill" />
            </div>

            {/* Rating dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-roboto">Your Rating:</span>
              <button
                type="button"
                onClick={openRatingModal}
                className="border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2 bg-white cursor-pointer hover:border-primary-300 transition-colors"
              >
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-gray-700">
                  {food.rating ? food.rating.toFixed(1) : 'Rate product'}
                </span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
            </div>

            <Modal isOpen={showRatingModal} onClose={() => setShowRatingModal(false)} title="Rate this product">
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Select a rating and leave a short comment below.</p>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const value = index + 1;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedRating(value)}
                        className={
                          `rounded-full p-2 transition ${
                            selectedRating >= value
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-gray-100 text-gray-400'
                          }`
                        }
                        aria-label={`${value} star rating`}
                      >
                        <Star size={18} className="fill-current" />
                      </button>
                    );
                  })}
                </div>
                <textarea
                  value={ratingComment}
                  onChange={(event) => setRatingComment(event.target.value)}
                  rows={4}
                  placeholder="Write your review..."
                  className="w-full resize-none rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                />
                <button
                  type="button"
                  onClick={() => handleRateProduct(selectedRating, ratingComment)}
                  disabled={ratingSubmitting || selectedRating === 0}
                  className="w-full rounded-3xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:opacity-50"
                >
                  {ratingSubmitting ? 'Submitting...' : 'Submit review'}
                </button>
              </div>
            </Modal>

            {/* Description */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <h2 className="font-bold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-500 text-sm leading-relaxed font-roboto">{food.productDesc}</p>
            </div>

            {/* Key Ingredients */}
            {food.productIngredients?.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-card">
                <h2 className="font-bold text-gray-900 mb-3">Key Ingredients</h2>
                <div className="flex flex-wrap gap-2">
                  {food.productIngredients.map((ing, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 text-xs font-medium px-3 py-1.5 rounded-full border border-yellow-100">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings & Reviews */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-bold text-gray-900">Ratings & Reviews</h2>

                  {(food.ratingData as any)?.generalStorage.ratingaggr && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star
                          size={16}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="font-bold text-gray-900">
                          {(food.ratingData as any).generalStorage.ratingaggr.toFixed(1)}
                        </span>
                      </div>

                      <span className="text-sm text-gray-400">
                        (
                        {rates?.length}
                        review
                        {(rates?.length) !== 1
                          ? 's'
                          : ''}
                        )
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {rates?.length === 0 ||
                rates?.length === 0 ? (
                <p className="text-gray-400 text-sm font-roboto">
                  No reviews yet — be the first!
                </p>
              ) : (
                <div className="space-y-4">
                  {
                    (showAllReviews
                      ? rates
                      : rates?.slice(0, 4)
                    )?.map(
                      (
                        rating: {
                          rating: number;
                          comment: string;
                          userName: string;
                          userPhoto: string;
                        },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="border-b border-gray-100 pb-4 last:border-none"
                        >
                          {/* User row */}
                          <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="relative overflow-hidden w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                              {rating?.userPhoto ? (
                                <Image
                                  src={rating.userPhoto}
                                  alt={rating.userName}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <span className="font-semibold text-gray-900 text-sm truncate">
                                  {rating.userName
                                    ? getInitials(rating.userName)
                                    : '?'}
                                </span>
                              )}
                            </div>

                            <div className="flex-1">
                              {/* Name + stars */}
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-sm text-gray-900">
                                    {rating.userName || 'Anonymous'}
                                  </p>

                                  <div className="flex items-center gap-1 mt-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        size={14}
                                        className={
                                          i < rating.rating
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-200'
                                        }
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Comment */}
                              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                                {rating.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}

                  {/* Show more button */}
                  {(food.ratingData as any).generalStorage.ratingcount > 4 && (
                    <button onClick={() =>
                      setShowAllReviews(!showAllReviews)
                    } className="w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                      {showAllReviews
                        ? 'Show less reviews'
                        : `See all ${(food.ratingData as any).generalStorage.ratingcount} reviews`}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-700">Quantity</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn-minus">–</button>
                  <span className="font-bold text-gray-900 w-5 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="qty-btn-plus">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm font-roboto">Total</span>
                <span className="text-primary-500 font-bold text-xl">{formatNaira(food.productPrice * quantity)}</span>
              </div>
              <button onClick={() => handleAddToCart(food)} className="btn-primary flex items-center justify-center gap-2">
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Pairing suggestions */}
        {(suggestedFood as any)?.length > 0 && (
          <div className="mt-10">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Pairing Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {suggestedFood?.map((item) => (
                <PairingFoodCard key={item._id} food={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
