import { Badge } from '@/components/ui';

/** Availability pill derived from a variant's live `availableQty`. */
export function StockLabel({ availableQty, lowThreshold = 5 }: { availableQty: number; lowThreshold?: number }) {
  if (availableQty <= 0) return <Badge label="Out of stock" tone="danger" />;
  if (availableQty <= lowThreshold) return <Badge label={`Only ${availableQty} left`} tone="primary" />;
  return <Badge label="In stock" tone="success" />;
}
