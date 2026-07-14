import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

import { env } from '@/env';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@/lib/secure';
import { endpoints } from './endpoints';

/**
 * Normalized API error. Every failed request from `apiClient` rejects with one of these,
 * shaped from the backend envelope `{ error: { code, message, details? } }`
 * (see `fabrashion-backend/src/lib/errors.ts`). Screens/hooks branch on `code`/`status`.
 */
export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(message: string, code: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/** Registered by the auth store; invoked when a refresh fails so the app can sign out. */
let onAuthExpired: (() => void) | null = null;
export function setOnAuthExpired(cb: (() => void) | null): void {
  onAuthExpired = cb;
}

// `axios.create` is the canonical instance factory; the named-export lint hint doesn't apply.
// eslint-disable-next-line import/no-named-as-default-member
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the bearer access token to every outgoing request.
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAccessToken();
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

// A bare client (no interceptors) for the refresh call itself, to avoid recursion.
// eslint-disable-next-line import/no-named-as-default-member
const refreshClient = axios.create({ baseURL: env.apiUrl, timeout: 15000 });
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');
  // Contract (Phase 1): POST /auth/refresh { refreshToken } → { accessToken, refreshToken }.
  const { data } = await refreshClient.post<{ accessToken: string; refreshToken: string }>(
    endpoints.auth.refresh,
    { refreshToken },
  );
  await setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data.accessToken;
}

apiClient.interceptors.response.use(
  (res) => res,
  async (
    error: AxiosError<{ error?: { code?: string; message?: string; details?: unknown } }>,
  ) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;

    // On 401, try a single refresh-and-retry (deduped across concurrent requests).
    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true;
      try {
        refreshPromise ??= refreshAccessToken();
        const newAccess = await refreshPromise;
        original.headers.set('Authorization', `Bearer ${newAccess}`);
        return apiClient(original);
      } catch {
        await clearTokens();
        onAuthExpired?.();
      } finally {
        refreshPromise = null;
      }
    }

    const envelope = error.response?.data?.error;
    throw new ApiError(
      envelope?.message ?? error.message ?? 'Network request failed',
      envelope?.code ?? (error.response ? 'UNKNOWN' : 'NETWORK_ERROR'),
      error.response?.status ?? 0,
      envelope?.details,
    );
  },
);

/** GET helper that unwraps `response.data`. */
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.get<T>(url, config);
  return data;
}

/** POST helper that unwraps `response.data`. */
export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await apiClient.post<T>(url, body, config);
  return data;
}
