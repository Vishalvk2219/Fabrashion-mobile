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

/** Indian compact notation for dashboard KPIs: `482000_00` → `"₹4.82L"`, crores → `"₹1.2Cr"`. */
export function formatPaiseLakhs(paise: number): string {
  const rupees = paise / 100;
  const compact = (value: number) =>
    value.toLocaleString('en-IN', { maximumFractionDigits: value >= 100 ? 0 : 2 });
  if (rupees >= 1_00_00_000) return `₹${compact(rupees / 1_00_00_000)}Cr`;
  if (rupees >= 1_00_000) return `₹${compact(rupees / 1_00_000)}L`;
  return formatPaiseCompact(paise);
}

/** Basis points (server delta) → signed percent label, e.g. `1240` → `"+12.4%"`; null → `"—"`. */
export function formatBps(bps: number | null): string {
  if (bps === null) return '—';
  const pct = bps / 100;
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toLocaleString('en-IN', { maximumFractionDigits: 1 })}%`;
}
