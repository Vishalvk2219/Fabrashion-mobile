import { useCallback, useSyncExternalStore } from 'react';

import { storage } from '@/lib/storage';

/**
 * Reactive read/write of a JSON value in non-sensitive KV storage (`lib/storage.ts`).
 * Re-renders any subscribed component when the key changes anywhere in the app.
 */
export function useStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const value = useSyncExternalStore(
    (cb) => storage.subscribe(key, cb),
    () => storage.get(key, defaultValue),
  );
  const setValue = useCallback((next: T) => storage.set(key, next), [key]);
  return [value, setValue];
}
