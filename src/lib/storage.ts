import { Storage } from 'expo-sqlite/kv-store';

/**
 * Non-sensitive key-value storage (selected filters, cart draft, cached prefs),
 * backed by SQLite via `expo-sqlite/kv-store`. Synchronous JSON get/set with a tiny
 * subscription layer for reactive reads (see `hooks/use-storage.ts`). Works in Expo Go.
 *
 * For tokens/secrets use `lib/secure.ts` instead.
 */
type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = Storage.getItemSync(key);
      return raw != null ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    Storage.setItemSync(key, JSON.stringify(value));
    listeners.get(key)?.forEach((fn) => fn());
  },
  remove(key: string): void {
    Storage.removeItemSync(key);
    listeners.get(key)?.forEach((fn) => fn());
  },
  subscribe(key: string, listener: Listener): () => void {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(listener);
    return () => {
      listeners.get(key)?.delete(listener);
    };
  },
} as const;
