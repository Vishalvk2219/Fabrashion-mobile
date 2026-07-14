/**
 * Admin domain model — display maps + derivations over the server data (`schema.ts`).
 * Money arrives as paise and is formatted via `lib/money.ts`; statuses/labels map the
 * wire enums to the ANDRÓ design language.
 */
import { colors } from '@/theme/colors';
import type { AdminOrderStatus, AdminStaffStatus } from './schema';

// ── Staff directory ──
export const STAFF_STATUS_META: Record<AdminStaffStatus, { label: string; bg: string; fg: string }> = {
  ACTIVE: { label: 'Active', bg: colors.okBg, fg: colors.okFg },
  INVITED: { label: 'Invited', bg: colors.accentSoft, fg: colors.accent },
};

export const ROLE_LABEL: Record<'STAFF' | 'ADMIN', string> = {
  STAFF: 'Store Staff',
  ADMIN: 'Administrator',
};

// ── Catalog ──
export type CatalogStatus = 'Live' | 'Low' | 'Out of Stock';
export const CATALOG_STATUS_PILL: Record<CatalogStatus, { bg: string; fg: string }> = {
  Live: { bg: colors.okBg, fg: colors.okFg },
  Low: { bg: colors.warnBg, fg: colors.warnFg },
  'Out of Stock': { bg: colors.dangerBg, fg: colors.dangerFg },
};
export function catalogStatus(stock: number): CatalogStatus {
  if (stock === 0) return 'Out of Stock';
  if (stock < 20) return 'Low';
  return 'Live';
}
export const CATALOG_FILTERS: (CatalogStatus | 'All')[] = ['All', 'Live', 'Low', 'Out of Stock'];

// ── Orders ──
export const ADMIN_ORDER_META: Record<AdminOrderStatus, { label: string; bg: string; fg: string }> = {
  NEW: { label: 'New', bg: colors.accentSoft, fg: colors.accent },
  PACKED: { label: 'Packed', bg: colors.infoBg, fg: colors.infoFg },
  DELIVERED: { label: 'Delivered', bg: colors.okBg, fg: colors.okFg },
  CANCELLED: { label: 'Cancelled', bg: colors.dangerBg, fg: colors.dangerFg },
};
export const ADMIN_ORDER_FILTERS: (AdminOrderStatus | 'All')[] = ['All', 'NEW', 'PACKED', 'DELIVERED', 'CANCELLED'];

export const initials = (name: string): string =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('');
