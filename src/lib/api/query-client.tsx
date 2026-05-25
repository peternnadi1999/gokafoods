'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/types';

// ============================================================
// QUERY CLIENT FACTORY — creates a per-request client (SSR safe)
// ============================================================
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Don't re-fetch on window focus in production
        refetchOnWindowFocus: process.env.NODE_ENV === 'development',
        // Retry up to 2 times, but not on 4xx client errors
        retry: (failureCount, error) => {
          const axiosError = error as AxiosError<ApiError>;
          const status = axiosError?.response?.status;
          if (status && status >= 400 && status < 500) return false;
          return failureCount < 2;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new client
    return makeQueryClient();
  }
  // Browser: reuse existing client or create new one
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

// ============================================================
// REACT QUERY PROVIDER
// ============================================================
export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
