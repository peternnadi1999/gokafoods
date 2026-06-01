"use client";
import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  AlertCircle,
  CreditCard,
  Calendar,
  User,
  Phone,
  ShieldCheck,
} from 'lucide-react';

import { useOrders } from '@/lib/hooks/use-api';
import { formatNaira } from '@/lib/utils';

// Dynamic metadata for order detail pages

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: batches, isLoading } =
    useOrders();

  const batch = useMemo(() => {
    if (!batches) return null;

    return batches.find(
      (item: any) => item.groupId === id
    );
  }, [batches, id]);

  const totalProducts = useMemo(() => {
    if (!batch) return 0;

    return batch.orders.reduce(
      (sum: number, item: any) =>
        sum +
        item?.product?.productPrice *
        item.quantity,
      0
    );
  }, [batch]);

  const rider = useMemo(() => {
    return (batch?.orders?.find(
      (order: any) => order.rider
    ) as any)?.rider || null;
  }, [batch]);




  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-5">
        <div className="h-12 w-40 skeleton rounded mb-6" />

        <div className="h-40 skeleton rounded-3xl mb-5" />

        <div className="space-y-4">
          {Array.from({
            length: 3,
          }).map((_, index) => (
            <div
              key={index}
              className="h-44 skeleton rounded-3xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Batch not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-gray-50 border-b border-gray-100 px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="font-bold text-xl text-gray-900">
              Consolidated Details
            </h1>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* BLACK CARD */}
        <div className="bg-[#111111] rounded-3xl p-5 text-white">
          <p className="uppercase tracking-widest text-[11px] text-gray-400">
            Consolidated Package Identifier
          </p>

          <h2 className="text-xl font-bold mt-2 break-all">
            #{batch.orderGroupId}
          </h2>

          <div className="border-t border-white/10 mt-5 pt-5 flex justify-between">
            <div>
              <p className="text-xs text-gray-400">
                Allocation Model
              </p>

              <p className="font-bold text-sm mt-1">
                {batch.groupType
                  ?.replaceAll('_', ' ')
                  .toUpperCase()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-400">
                Consolidated Status
              </p>

              <p className="font-bold text-orange-400 mt-1">
                {batch.status}
              </p>
            </div>
          </div>
        </div>

        {/* NOTICE */}
        {/* RIDER INFO / NOTICE */}
        {rider ? (
          <div className="rounded-3xl border border-[#D8EDE5] bg-[#F3FBF7] p-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={22}
                  className="text-[#0D6B50]"
                />

                <span className="font-semibold text-[#0D6B50]">
                  Courier Dispatched
                </span>
              </div>

              <a
                href={`tel:${rider.phone}`}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#18C37E]"
              >
                <Phone
                  size={20}
                  className="text-white"
                />
              </a>
            </div>

            {/* Rider */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DDEFE9]">
                <User
                  size={28}
                  className="text-[#0D6B50]"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {rider.fullName}
                </h3>

                <p className="text-gray-500 capitalize">
                  {rider.role} • {rider.gender}
                </p>
              </div>
            </div>

            <div className="my-5 h-px bg-[#D8EDE5]" />

            {/* ETA */}
            <div className="flex items-center gap-3">
              <Calendar
                size={22}
                className="text-gray-700"
              />

              <p className="text-gray-600">
                ETA Promise:{" "}
                <span className="font-bold text-gray-900">
                  {rider.eta}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3">
            <AlertCircle
              size={18}
              className="text-gray-500 mt-0.5"
            />

            <p className="text-sm text-gray-600">
              Rider allocation assignment sequence processing.
              Dispatched partner contact data will appear here
              once the batch is locked.
            </p>
          </div>
        )}

        {/* TITLE */}
        <div>
          <h2 className="text-gray-400 text-sm uppercase tracking-wide font-semibold">
            Manifest Items
          </h2>
        </div>

        {/* ITEMS */}
        <div className="space-y-4">
          {batch.orders.map(
            (item: any, index: number) => (
              <div
                key={
                  item._id ??
                  `${item.product._id}-${index}`
                }
                className="bg-white rounded-3xl border border-gray-100 p-4"
              >
                {/* TOP */}
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        item.product
                          .productImage
                      }
                      alt={
                        item.product
                          .productName
                      }
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {
                        item.product
                          .productName
                      }
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      Quantity:{' '}
                      {item.quantity}{' '}
                      units
                    </p>

                    <p className="font-bold text-lg text-gray-900 mt-1">
                      {formatNaira(
                        item.product
                          .productPrice
                      )}
                    </p>
                  </div>
                </div>

                {/* NOTE */}
                <div className="mt-4 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                  <p className="text-sm text-orange-700">
                    Instruction Note:{' '}
                    {item.note ||
                      'normal'}
                  </p>
                </div>

                {/* FOOTER */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">

                  {item.paidWith === "card" ?
                    <div className="flex items-center gap-2 text-gray-600">
                      <CreditCard
                        size={16}
                      />
                      <span className="text-sm">
                        Paid Via Card
                      </span>
                    </div> : <div className="flex items-center gap-2 text-gray-600">
                      <CreditCard
                        size={16}
                      />
                      <span className="text-sm">
                        Paid Via Balance
                      </span>
                    </div>


                  }

                  <span className="text-sm font-medium text-gray-700">
                    Status:{' '}
                    {batch.status}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">
                Shipping Delivery
                Fee
              </span>

              <span className="font-semibold">
                {formatNaira(
                  batch.shippingFee
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Manifest Items
              </span>

              <span className="font-semibold">
                {
                  batch.orders.length
                }
              </span>
            </div>

            <div className="border-t pt-4 flex justify-between">
              <span className="font-bold text-lg">
                Total Settlement Scope
              </span>

              <span className="font-bold text-xl text-primary-500">
                {formatNaira(
                  totalProducts +
                  batch.shippingFee
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
