# Feature: `trial`

At-Home Trial: pieces are delivered, the customer keeps some and returns the rest â€” **only kept
pieces are charged**. Flow: `plans/07-home-trial.md`; build: `plans/19-phase-6-trials.md`.
**Server-backed** since plan 19 â€” the local zustand list is gone.

## Files
| File | Purpose |
|------|---------|
| `schema.ts` | Wire types mirroring `fabrashion-backend/src/modules/trial` (booking, items+outcomes, eligibility + slot grid). |
| `api.ts` | `GET /trials/eligibility` Â· `POST /trials` Â· `GET /trials(/:id)` Â· `POST /trials/:id/outcome` Â· `/cancel` Â· dev `/confirm-dev`. |
| `hooks.ts` | React Query: `useTrialEligibility`, `useTrials`, `useTrial`, `useCreateTrial` (books **and**, in dev, captures the charge â€” the PhonePe sheet replaces that in 4c), `useTrialOutcome` (invalidates orders too â€” kept pieces became one), `useCancelTrial`. |

## Screens
- `app/try-home.tsx` â€” booking, launched from the PDP with the **selected variant**: server
  eligibility + serviceable boutique, real default address, the server slot grid (full days
  disabled), instructions, and the honest Strategy-A money copy ("fully refundable trial hold â€”
  only kept pieces are charged"). Confirm â†’ book (+ dev capture) â†’ Orders "Try at Home".
- `app/trial/[id].tsx` â€” booking detail: status timeline (Requested â†’ Confirmed â†’ On its way â†’
  Delivered â†’ Completed), logistics + hold/refund info, **keep/return selector per piece while
  IN_TRIAL** with the decide-by deadline, Cancel while REQUESTED/CONFIRMED, and a link to the
  conversion order once completed.
- Trials list under **Orders â†’ "Try at Home"** (server truth, tappable into the detail).

## Money & stock (server-owned)
The full basket value is held at booking (v1 = charged; PhonePe in 4c) and `refundPaise` records
what comes back for returns/cancellations. Stock holds live in `Inventory.quantityOnTrial` at the
fulfilling boutique. Past `trialEndsAt` the backend auto-returns undecided pieces (plan 07 policy)
â€” the app just re-reads.
