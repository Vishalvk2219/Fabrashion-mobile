import { useMutation } from '@tanstack/react-query';

import { requestOtp, verifyOtp } from './api';
import type { OtpVerifyInput } from './schema';
import { useAuthStore } from './store';

/** Current session status + user. Selects primitives to avoid extra re-renders. */
export function useSession() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  return { status, user, isAuthenticated: status === 'authenticated' };
}

/** Step 1: request an OTP for a phone number. Returns `{ expiresInSec, devCode? }`. */
export function useRequestOtp() {
  return useMutation({ mutationFn: (phone: string) => requestOtp(phone) });
}

/** Step 2: verify the OTP. On success persists the session (with the account role) and flips the
 * auth gate — `src/app/_layout.tsx` then routes to the customer/staff/admin shell. */
export function useVerifyOtp() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (input: OtpVerifyInput) => verifyOtp(input),
    onSuccess: (res) =>
      setSession({ accessToken: res.accessToken, refreshToken: res.refreshToken }, res.user),
  });
}
