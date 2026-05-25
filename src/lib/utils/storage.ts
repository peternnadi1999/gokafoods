/**
 * Type-safe localStorage wrapper with JSON serialization.
 * Falls back gracefully in SSR (no window).
 */
const isBrowser = typeof window !== 'undefined';

export const storage = {
  get<T>(key: string, fallback?: T): T | undefined {
    if (!isBrowser) return fallback;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage quota exceeded or private mode — silently fail
    }
  },

  remove(key: string): void {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  },

  clear(): void {
    if (!isBrowser) return;
    localStorage.clear();
  },
};

// ============================================================
// APP-SPECIFIC STORAGE KEYS
// ============================================================
export const STORAGE_KEYS = {
  RECENT_SEARCHES: 'gkf_recent_searches',
  SPLASH_SHOWN: 'gkf_splash',
  DELIVERY_ADDRESS: 'gkf_delivery_addr',
  INSTALL_DISMISSED: 'gkf_install_dismissed',
} as const;
