# fabrashion-mobile — agent guide

> **Expo has changed a lot. This is Expo SDK 57.** Read the exact versioned docs at
> https://docs.expo.dev/versions/v57.0.0/ before writing any Expo/native code, and prefer the
> project's Expo skills (`building-native-ui`, `native-data-fetching`) over memory.
>
> **Running on device:** SDK 57 is newer than the store **Expo Go** bundles, so Expo Go can't open
> this project — run on a phone via a **dev build** (`expo-dev-client` + EAS Build; also needed for
> the PhonePe SDK later). Dev-runtime constraint only; production/Play Store builds are unaffected
> (EAS compiles a standalone binary).

Customer mobile app (React Native + Expo + TypeScript). **Design docs are the source of truth in
`../plans/`** — read `plans/README.md`, `plans/04-frontend-structure.md`, and
`plans/11-phase-0c-mobile-scaffold.md`; backend contract in `plans/05-api-design.md`.

## Status
**Phase 0c done:** production-shaped foundation + navigable app shell. Feature network calls go
live as the backend ships (Phase 1 auth · 2 catalog · 4 cart/checkout · 6 trials); until then
screens show graceful `Loader`/`EmptyState`. A `__DEV__`-only "Continue as demo user" on the login
screen walks the shell without a backend — remove it when Phase 1 lands.

## Architecture & conventions
- **Routes live under `src/app/`** (not a top-level `app/`), alias `@/* → ./src/*`. Only route and
  `_layout` files belong in `src/app/` — never co-locate components/utils there.
- **Feature-first** in `src/features/<name>/` (`schema.ts`, `api.ts`, `hooks.ts`, `store.ts`,
  `README.md`) mirroring backend modules. Keep each feature README current.
- **Server state → TanStack Query** (it *is* the cache; don't duplicate into Zustand). **Client/
  session state → Zustand** (`features/auth/store.ts`).
- **All HTTP goes through `src/api/client.ts`** (axios: injects the bearer token, does
  401→refresh→retry, normalizes errors to `ApiError` from `{ error: { code, message } }`). Paths in
  `api/endpoints.ts`.
- **Server is authoritative on money/stock/totals.** Money is integer **paise**; format only via
  `lib/money.ts` — never hand-format ₹ or compute totals on the client.
- **Styling is native — NO NativeWind / Tailwind / CSS.** Inline styles + semantic tokens from
  `src/theme` (`colors.*` via the `Color` API; `spacing`/`radii`/`fontSize`). Never hardcode hex.
  Any component that renders `colors.*` must call `useColorScheme()` (or `useColors()`) so it
  re-renders on theme flip (Android + React Compiler).
- **Navigation:** `NativeTabs` (`expo-router/unstable-native-tabs`); each tab is a route group with
  its own `Stack` for headers. Auth gate = `Stack.Protected` in `src/app/_layout.tsx`.
- **Storage:** tokens in `expo-secure-store` (`lib/secure.ts`); non-sensitive KV in
  `expo-sqlite/kv-store` (`lib/storage.ts`). No MMKV (needs a dev build), no AsyncStorage.
- **Config:** only `process.env.EXPO_PUBLIC_*` (via `src/env.ts`) — no secrets in the bundle.
- Filenames **kebab-case**; prefer `@/` alias imports; `expo-image` for images and SF Symbols.

## Commands
- `npx expo start` — dev server (Expo Go). `npx tsc --noEmit` — typecheck.
- `npx expo export --platform ios` — verify the whole graph bundles.

## Git
Git Flow: work on a `feature/*` branch off `dev`; **never commit directly to `main` or `dev`.**
Conventional Commits (`feat:` / `fix:` / `chore:` / `docs:`).
