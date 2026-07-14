/**
 * Typed path builders for the versioned REST API. Paths are relative to `env.apiUrl`
 * (which already includes `/api/v1`). Mirrors `plans/05-api-design.md`. Keeping paths
 * here means screens/hooks never hardcode URL strings.
 */
export const endpoints = {
  auth: {
    otpRequest: '/auth/otp/request',
    otpVerify: '/auth/otp/verify',
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
  addresses: {
    root: '/addresses',
    detail: (id: string) => `/addresses/${id}`,
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
    confirmDev: (id: string) => `/orders/${id}/confirm-dev`,
  },
  trials: {
    root: '/trials',
    eligibility: '/trials/eligibility',
    detail: (id: string) => `/trials/${id}`,
    outcome: (id: string) => `/trials/${id}/outcome`,
    cancel: (id: string) => `/trials/${id}/cancel`,
    confirmDev: (id: string) => `/trials/${id}/confirm-dev`,
  },
  staff: {
    summary: '/staff/summary',
    inventory: '/staff/inventory',
    adjust: (variantId: string) => `/staff/inventory/${variantId}`,
    orders: '/staff/orders',
    advance: (id: string) => `/staff/orders/${id}/advance`,
    trials: '/staff/trials',
    advanceTrial: (id: string) => `/staff/trials/${id}/advance`,
  },
  admin: {
    overview: '/admin/overview',
    staff: '/admin/staff',
    catalog: '/admin/catalog',
    products: '/admin/products',
    orders: '/admin/orders',
  },
} as const;
