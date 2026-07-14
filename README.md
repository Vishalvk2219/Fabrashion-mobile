# fabrashion-mobile

Customer mobile app for the Fabrashion platform — **React Native + Expo (SDK 57) + TypeScript**,
file-based routing with **Expo Router**. Talks to `fabrashion-backend` over REST (`/api/v1`).

Design docs live in `../plans/` (start with `plans/README.md`, `plans/04-frontend-structure.md`,
and `plans/11-phase-0c-mobile-scaffold.md`). **Read the SDK-57 docs before changing native code**
(see `AGENTS.md`). SDK 57 is too new for the store Expo Go, so run on device via a **dev build**
(`expo-dev-client` + EAS) — a dev-runtime constraint only; production/Play Store builds are unaffected.

## Status

**Phase 0c — Foundation & App Shell.** The full data/state/theme stack is wired and every customer
screen exists as a real route with loading/empty states. Feature network calls light up as the
backend phases (1 auth, 2 catalog, 4 cart/checkout, 6 trials) ship. Until then screens show
graceful empty states; a **DEV-only "Continue as demo user"** on the login screen lets you walk the
whole shell without a backend.

## Getting started

```bash
npm install
cp .env.example .env        # set EXPO_PUBLIC_API_URL
npx expo start              # scan the QR with Expo Go
```

On a **physical device** (recommended on Windows — no local iOS sim), set `EXPO_PUBLIC_API_URL`
to your computer's LAN IP, e.g. `http://192.168.1.5:4000/api/v1` — the phone can't reach the
laptop's `localhost`.

### Scripts
| Script | Does |
|--------|------|
| `npm start` | `expo start` |
| `npm run android` / `ios` | run on device/emulator |
| `npm run web` | run in the browser |
| `npm run lint` | `expo lint` |
| `npx tsc --noEmit` | typecheck |

## Tech stack
Expo Router · TanStack Query (server state) · Zustand (session/UI state) · Axios (auth + refresh
interceptors) · React Hook Form + Zod (forms) · `expo-secure-store` (tokens) · `expo-sqlite/kv-store`
(non-sensitive KV) · `expo-image`. **Styling is native** (inline styles + the `Color` API + `src/theme`
tokens + `NativeTabs`) — no NativeWind/Tailwind.

## Folder guide

```
src/
├── app/            # Expo Router routes (file = screen)
│   ├── _layout.tsx           # providers + Stack.Protected auth gate
│   ├── (auth)/               # login, register
│   └── (tabs)/               # Shop, Search, Cart, Trials, Account (NativeTabs)
│       ├── (home)/           # catalog + product/[id]
│       └── (search|cart|trials|account)/
├── api/            # client (axios+interceptors+refresh), queryClient, endpoints
├── features/       # feature-first, mirrors backend modules — each has a README
│   ├── auth/ catalog/ cart/ checkout/ orders/ trial/
├── components/     # ui/ (Button, Input, Card, …), product/, layout/
├── hooks/          # cross-feature hooks (use-storage, use-debounce)
├── lib/            # money, storage (KV), secure (tokens)
├── theme/          # colors (Color API), tokens, useColors
└── env.ts          # typed EXPO_PUBLIC_* access
```

## Conventions
- **Screens stay thin** — compose feature hooks + components; no inline fetch logic.
- **Server is authoritative** on price/stock/totals — the app never computes money; format via `lib/money.ts`.
- **Semantic color tokens only** (`colors.primary`, `colors.label`, …) — never hex literals.
- Env via `process.env.EXPO_PUBLIC_*` only — no secrets in the bundle.
- **Git:** work on `feature/*` off `dev`; never commit to `main`/`dev` directly.
