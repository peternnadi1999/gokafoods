'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================
// STAR RATING DISPLAY (read-only)
// ============================================================
interface StarRatingDisplayProps {
  rating: number | null;
  max?: number;
  size?: number;
  showLabel?: boolean;
}

export function StarRatingDisplay({
  rating,
  max = 5,
  size = 16,
  showLabel = false,
}: StarRatingDisplayProps) {
  if (!rating) {
    return (
      <div className="flex items-center gap-1">
        <Star size={size} className="text-yellow-400 fill-yellow-400" />
        <span className="text-xs text-gray-500 font-roboto">Not Rated</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i < Math.round(rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-200 fill-gray-200'
          )}
        />
      ))}
      {showLabel && (
        <span className="text-xs text-gray-500 font-roboto ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

// ============================================================
// STAR RATING INPUT (interactive)
// ============================================================
interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
  size?: number;
}

export function StarRatingInput({ value, onChange, max = 5, size = 24 }: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= (hovered || value);

        return (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(starValue)}
            className="transition-transform active:scale-90"
          >
            <Star
              size={size}
              className={cn(
                'transition-colors duration-100',
                filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
