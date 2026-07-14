import { create } from 'zustand';

import { storage } from '@/lib/storage';

const KEY = 'wishlist.ids';

/**
 * Wishlist = a set of saved product ids, persisted locally (no backend yet — plan 13 lists the
 * wishlist endpoints as a pending delta). The heart on product cards and the Wishlist tab read this.
 */
type WishlistState = {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>((set) => ({
  ids: storage.get<string[]>(KEY, []),
  toggle: (id) =>
    set((s) => {
      const ids = s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id];
      storage.set(KEY, ids);
      return { ids };
    }),
  clear: () => {
    storage.set(KEY, []);
    set({ ids: [] });
  },
}));

/** Subscribe to whether a single id is wished (selector keeps re-renders tight). */
export const useIsWished = (id: string) => useWishlistStore((s) => s.ids.includes(id));
