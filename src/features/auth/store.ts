import { create } from 'zustand';

import { setOnAuthExpired } from '@/api/client';
import { clearTokens, getAccessToken, setTokens, type TokenPair } from '@/lib/secure';
import { storage } from '@/lib/storage';
import type { AuthUser } from './schema';

const USER_KEY = 'auth.user';

/** `loading` until we've read secure storage on boot; then authed/unauthed. */
type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
  /** Read persisted tokens/user on app start; resolves the initial auth gate. */
  hydrate: () => Promise<void>;
  /** Persist a real session after login/register succeeds. */
  setSession: (tokens: TokenPair, user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  user: null,

  hydrate: async () => {
    const token = await getAccessToken();
    if (token) {
      set({ status: 'authenticated', user: storage.get<AuthUser | null>(USER_KEY, null) });
    } else {
      set({ status: 'unauthenticated', user: null });
    }
  },

  setSession: async (tokens, user) => {
    await setTokens(tokens);
    storage.set(USER_KEY, user);
    set({ status: 'authenticated', user });
  },

  signOut: async () => {
    await clearTokens();
    storage.remove(USER_KEY);
    set({ status: 'unauthenticated', user: null });
  },
}));

// When a token refresh fails inside the api client, sign the user out.
setOnAuthExpired(() => {
  void useAuthStore.getState().signOut();
});
