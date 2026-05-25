'use client';

import { Loader2, MapPin, Navigation } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { getCurrentPosition } from '@/lib/utils/location';

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
}

export default function LocationModal({
  open,
  onClose,
  onConfirm,
}: LocationModalProps) {
  const [address, setAddress] = useState('');
  const [loadingLocation, setLoadingLocation] =
    useState(false);

  if (!open) return null;

  const handleUseCurrentLocation =
    async () => {
      try {
        setLoadingLocation(true);

        const location =
          await getCurrentPosition();

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
        );

        const data = await response.json();

        onConfirm({
          lat: location.lat,
          lng: location.lng,
          address:
            data.display_name ||
            'Current Location',
        });

        onClose();
      } catch (error) {
        toast.error(
          'Unable to fetch current location'
        );
      } finally {
        setLoadingLocation(false);
      }
    };

  const handleManualAddress = async () => {
    if (!address.trim()) {
      toast.error('Enter your address');
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );

      const data = await response.json();

      if (!data.length) {
        toast.error('Address not found');
        return;
      }

      const place = data[0];

      onConfirm({
        lat: Number(place.lat),
        lng: Number(place.lon),
        address: place.display_name,
      });

      onClose();
    } catch (error) {
      toast.error(
        'Failed to get location coordinates'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end lg:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full lg:max-w-md bg-white rounded-t-3xl lg:rounded-3xl p-6 animate-in slide-in-from-bottom duration-300">

        <div className="w-14 h-1.5 bg-gray-200 rounded-full mx-auto mb-5 lg:hidden" />

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Delivery Location
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Choose your delivery location
          </p>
        </div>

        <div className="space-y-4">
          {/* Current Location */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={loadingLocation}
            className="w-full border border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:border-primary-500 transition"
          >
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
              {loadingLocation ? (
                <Loader2 className="animate-spin text-primary-500" />
              ) : (
                <Navigation className="text-primary-500" />
              )}
            </div>

            <div className="text-left">
              <p className="font-semibold text-gray-900">
                Use Current Location
              </p>

              <p className="text-sm text-gray-500">
                Automatically detect location
              </p>
            </div>
          </button>

          {/* Manual Address */}
          <div className="border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin
                size={18}
                className="text-primary-500"
              />

              <p className="font-semibold text-gray-900">
                Enter Address
              </p>
            </div>

            <textarea
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="Type your delivery address..."
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-primary-500 resize-none"
              rows={3}
            />

            <button
              onClick={handleManualAddress}
              className="btn-primary mt-4"
            >
              Continue
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 text-gray-500 font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}