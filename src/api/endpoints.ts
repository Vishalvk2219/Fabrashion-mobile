/**
 * Typed path builders for the versioned REST API. Paths are relative to `env.apiUrl`
 * (which already includes `/api/v1`). Mirrors `plans/05-api-design.md`. Keeping paths
 * here means screens/hooks never hardcode URL strings.
 */
export const endpoints = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  categories: '/categories',
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    availability: (id: string) => `/products/${id}/availability`,
  },
  cart: {
    root: '/cart',
    items: '/cart/items',
    item: (itemId: string) => `/cart/items/${itemId}`,
  },
  checkout: '/checkout',
  orders: {
    list: '/orders',
    detail: (id: string) => `/orders/${id}`,
    cancel: (id: string) => `/orders/${id}/cancel`,
  },
  trials: {
    root: '/trials',
    eligibility: '/trials/eligibility',
    detail: (id: string) => `/trials/${id}`,
    outcome: (id: string) => `/trials/${id}/outcome`,
    cancel: (id: string) => `/trials/${id}/cancel`,
  },
} as const;
