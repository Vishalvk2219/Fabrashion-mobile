# Feature: `address`

Saved delivery addresses, server-backed (`fabrashion-backend/src/modules/address`). Used at Checkout.
No local store.

## Pieces
| File | Purpose |
|------|---------|
| `schema.ts` | `Address` + `AddressInput` (label HOME/WORK/OTHER, recipientName/Phone, line1/2, city, state, pincode, isDefault). |
| `api.ts` | `fetchAddresses`, `createAddress`, `updateAddress`, `removeAddress`. |
| `hooks.ts` | `useAddresses`, `useDefaultAddress` (checkout pre-selection), `useCreateAddress`, `useUpdateAddress`, `useRemoveAddress`. |

## Used by
- `app/addresses.tsx` â€” list, edit/delete/set-default, add new.
- `app/address-form.tsx` â€” add/edit form (Full Name, Phone, Address Line, City, **State**, Pincode,
  type Home/Work/Other).
- `app/checkout.tsx` â€” `useDefaultAddress` supplies the `addressId` for `POST /checkout`.

## Notes
Default handling is server-side (first address is default; setting a default clears others; deleting
the default promotes another). Endpoints: `addresses.*` in `api/endpoints.ts`.
