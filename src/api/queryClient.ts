import { QueryClient } from '@tanstack/react-query';

import { ApiError } from './client';

/**
 * Shared TanStack Query client. Server data (products, cart, orders, trials) lives here —
 * it is the cache; we don't duplicate it into Zustand. Retries transient network/5xx
 * errors but never 4xx (auth/validation/not-found are terminal).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
        return failureCount < 2;
      },
    },
    mutations: { retry: false },
  },
});
