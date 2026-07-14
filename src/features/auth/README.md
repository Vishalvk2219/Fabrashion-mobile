# Feature: `auth`

Session and identity. Owns the auth + **role** gate that decides `(auth)` vs the shell for the
account's role — `(tabs)` (customer), `(staff)`, or `(admin)` — in `src/app/_layout.tsx`.

## Flow (ANDRÓ redesign — plans 13–15)
First run: **Splash → Onboarding (4) → Login → OTP → app**. Returning users skip to Login (an
`app.onboarded` flag in `lib/storage`). **Login is phone-OTP only** — you enter a 10-digit number, get
a 4-digit code, and verify. Email/password login and the register screen were removed; email is
optional profile data, never a credential. The account's `role` (from the verify response) picks the
shell; it is stored on the account (admin-seeded), never chosen at login. Google/Apple are a later
phase (buttons are presentational for now).

## Screens
- `app/(auth)/index.tsx` — redirects to `/splash` (first run) or `/login` (onboarded).
- `app/(auth)/splash.tsx` — brand splash, tap to enter.
- `app/(auth)/onboarding.tsx` — 4-page intro; sets `app.onboarded`.
- `app/(auth)/login.tsx` — `+91` phone entry → `requestOtp` → OTP screen (passes `devCode` in dev).
- `app/(auth)/otp.tsx` — 4-digit code (prefilled with `devCode` in dev) + resend → `verifyOtp` → sign in.
- `app/(tabs)/(profile)/index.tsx` / `app/(staff)/(profile)` — show the session and sign out.

## Pieces
| File | Purpose |
|------|---------|
| `schema.ts` | `AuthUser`/`AuthResponse`, role helpers (`isStaff`/`isAdmin`/`isBackOffice`), `phoneSchema`/`otpVerifySchema`, `OtpRequestResponse`. |
| `store.ts` | Zustand session slice: `status`, `user`, `hydrate`, `setSession`, `signOut`. Wires `setOnAuthExpired`. |
| `api.ts` | `requestOtp`, `verifyOtp`, `fetchMe`. |
| `hooks.ts` | `useSession`, `useRequestOtp`, `useVerifyOtp` (verify → `setSession`). |

## Backend contract (live — backend plan 15)
`POST /auth/otp/request { phone }` → `{ expiresInSec, devCode? }` (`devCode` dev-only, no SMS
provider yet — the code is also in the server log). `POST /auth/otp/verify { phone, code }` →
`{ user, accessToken, refreshToken }`; an unknown phone creates a CUSTOMER account. Seeded phones:
Admin `+919000000001`, Staff `+919000000002`, Customer `+919000000003`.

## Notes
- On a physical device (Expo Go), set `EXPO_PUBLIC_API_URL` to your machine's LAN IP, not `localhost`.
- Tokens live in `expo-secure-store` (`lib/secure.ts`); the non-sensitive user snapshot in `lib/storage.ts`.
- Token refresh (401 → `/auth/refresh` → retry) is handled centrally in `api/client.ts`.
