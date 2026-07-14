import { useMutation } from '@tanstack/react-query';

import { login as loginRequest, register as registerRequest } from './api';
import type { LoginInput, RegisterInput } from './schema';
import { useAuthStore } from './store';

/** Current session status + user. Selects primitives to avoid extra re-renders. */
export function useSession() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  return { status, user, isAuthenticated: status === 'authenticated' };
}

/** Email/password login. On success persists the session and flips the auth gate. */
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (input: LoginInput) => loginRequest(input),
    onSuccess: (res) =>
      setSession({ accessToken: res.accessToken, refreshToken: res.refreshToken }, res.user),
  });
}

/** Registration. On success persists the session and flips the auth gate. */
export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (input: RegisterInput) => registerRequest(input),
    onSuccess: (res) =>
      setSession({ accessToken: res.accessToken, refreshToken: res.refreshToken }, res.user),
  });
}
