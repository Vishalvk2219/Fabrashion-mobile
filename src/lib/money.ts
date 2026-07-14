/**
 * Money helpers. Money is transmitted as integer **paise** everywhere (never floats);
 * ₹1 = 100 paise. Mirrors `fabrashion-backend/src/lib/money.ts`. The server is
 * authoritative on all totals — the app only formats for display.
 */

/** Convert integer paise to a rupee number (display/formatting only). */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/** Format paise as a localized ₹ string, e.g. `49900` → `"₹499.00"`. */
export function formatPaise(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Format paise with no decimals when whole, e.g. `49900` → `"₹499"`, `49950` → `"₹499.50"`. */
export function formatPaiseCompact(paise: number): string {
  const rupees = paise / 100;
  const hasFraction = paise % 100 !== 0;
  return `₹${rupees.toLocaleString('en-IN', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

/** Discount percentage of `mrpPaise` vs selling `pricePaise` (rounded), or 0. */
export function discountPct(pricePaise: number, mrpPaise: number): number {
  if (mrpPaise <= 0 || pricePaise >= mrpPaise) return 0;
  return Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100);
}
