# Feature: `auth`

Session and identity. Owns the auth gate that decides `(auth)` vs `(tabs)`.

## Screens
- `app/(auth)/login.tsx` — email/password login.
- `app/(auth)/register.tsx` — create account.
- `app/(tabs)/(account)/index.tsx` — shows the session and signs out.

## Pieces
| File | Purpose |
|------|---------|
| `schema.ts` | Zod form schemas (`loginSchema`, `registerSchema`) + `AuthUser`/`AuthResponse` types. |
| `store.ts` | Zustand session slice: `status`, `user`, `hydrate`, `setSession`, `signOut`. Wires `setOnAuthExpired`. |
| `api.ts` | `login`, `register`, `fetchMe` request fns. |
| `hooks.ts` | `useSession`, `useLogin`, `useRegister`. |

## Endpoints (live — backend Phase 1a)
`POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me`.
Set `EXPO_PUBLIC_API_URL` to the backend's LAN IP so the device can reach it.

## Notes
- Tokens live in `expo-secure-store` (`lib/secure.ts`); the non-sensitive user snapshot in `lib/storage.ts`.
- Token refresh (401 → `/auth/refresh` → retry) is handled centrally in `api/client.ts`.
- Dev login (from the backend seed): `customer@shop.test` / `Password123!`.
