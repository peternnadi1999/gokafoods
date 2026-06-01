"use client";
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import VerifiedStoresSkeleton from './loading';
import { useStores } from '@/lib/hooks/use-api';
import Image from 'next/image';
import { useEffect } from 'react';
import { getDistanceAndTime } from '@/lib/utils/location';

// SEO Metadata

export default function VerifiedStoresPage() {
  const router = useRouter();
  const { data: storesData, isLoading } = useStores()


  useEffect(() => {
      async function fetchDistances() {
        if (storesData) {
          const results = await Promise.all(
            storesData.map(async ({ _id, coordinates }) => {
              try {
                const result = await getDistanceAndTime({
                  lat: coordinates.lat,
                  lon: coordinates.lng,
                });
                return { _id, distance: result.distance, time: result.time };
              } catch (error) {
                console.error(`Error fetching distance for item ${_id}:`, error);
                return { _id, distance: 0, time: 0 };
              }
            })
          );
  
          results.reduce((acc, { _id, distance, time }) => {
            acc[_id] = { distance, time };
            return acc;
          }, {} as Record<string, { distance: number, time: number }>);
  
          fetchDistances();
        }
      }
  
      fetchDistances();
    }, [storesData]);


  const handleStoreClick = (storeId: string) => {
    router.push(`/store/${storeId}`);
  };

  if (isLoading) {
    return <VerifiedStoresSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 bg-gray-50 backdrop-blur-sm border-b border-gray-200/60 px-5 pt-12 pb-3 lg:pt-8 lg:px-8">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-gray-700 flex items-center gap-2"
          >
            <ArrowRight size={16} className="rotate-180" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Verified Stores</h1>
        </div>
      </div>

      <div className="px-5 lg:px-8 max-w-screen-xl mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storesData?.map((store) => (
            <div
              key={store._id}
              onClick={() => handleStoreClick(store._id)}
              className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <Image
                src={store.logo ?? '/placeholder.png'}
                alt={store.brandName}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-full"
              />
              <div className="flex-1">
                <div className='flex items-center justify-between'>
                  <h2 className="text-lg font-bold text-gray-900">{store.brandName}</h2>
                  {store.verification.isVerified && (
                    <div className="inline-flex items-center gap-1 ml-2">
                      <span className='border border-primary-500 rounded-full p-[2px]'>
                        <Check size={12} className="text-primary-500" />
                      </span>
                      <span className="text-primary-500 font-semibold text-[10px]">VERIFIED</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">{store.location.slice(0, 60)}</p>

                {/* <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 text-sm">{store.distance}</span>
                  <span className="text-gray-500 text-sm">|</span>
                  <span className="text-gray-500 text-sm">{store.time}</span>
                </div> */}

              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
