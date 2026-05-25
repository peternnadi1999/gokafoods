import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================
// CLASS NAMES HELPER
// ============================================================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// CURRENCY FORMATTER (Nigerian Naira)
// ============================================================
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

// ============================================================
// DISTANCE FORMATTER
// ============================================================
export function formatDistance(km: number): string {
  if (km < 1) return `${(km * 1000).toFixed(0)}m`;
  return `${km.toFixed(2)}km`;
}

// ============================================================
// TIME FORMATTER
// ============================================================
export function formatDeliveryTime(mins: number): string {
  if (mins < 60) return `${mins} mins`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ============================================================
// RATING DISPLAY
// ============================================================
export function formatRating(rating: number | null): string {
  if (!rating) return 'Not Rated';
  return rating.toFixed(1);
}

// ============================================================
// TRUNCATE TEXT
// ============================================================
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

// ============================================================
// DEBOUNCE
// ============================================================
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ============================================================
// EXTRACT AXIOS ERROR MESSAGE
// ============================================================
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || 'Something went wrong';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}

// ============================================================
// GENERATE INITIALS FROM NAME
// ============================================================
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ============================================================
// LOCATION UTILITIES
// ============================================================
export function generateShortUniqueKey(): string {
  const timestamp = Date.now().toString(36); // Convert timestamp to base36
  const random = Math.random().toString(36).substring(2, 6); // 4 random chars
  return `${timestamp}${random}`;
}