/**
 * Public runtime configuration. Only `EXPO_PUBLIC_*` variables are inlined into the
 * app bundle by Expo — never put secrets here. Set `EXPO_PUBLIC_API_URL` in `.env`
 * (see `.env.example`). On a physical device over Expo Go, use your machine's LAN IP
 * instead of `localhost`.
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export const env = {
  /** Versioned REST base, e.g. `http://localhost:4000/api/v1`. */
  apiUrl: API_URL,
  /** Host origin without the `/api/v1` suffix — for non-versioned routes like `/health`. */
  apiOrigin: API_URL.replace(/\/api\/v1\/?$/, ''),
} as const;
