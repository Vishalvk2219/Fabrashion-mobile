/**
 * Catalog view-model. Screens render `CatalogItem`, not the raw backend `Product`, so the ANDRÓ
 * cards/PDP have everything they need (derived offer %, a placeholder "tone" behind imagery, colour
 * swatches, sizes) regardless of which fields the backend fills. `toCatalogItem` maps a live
 * `Product`; the preview fixture (`preview.ts`) builds `CatalogItem`s directly.
 */
import { productTones } from '@/theme/colors';
import type { IconName } from '@/theme/material-icons';
import type { Department, Product } from './schema';

/** A category tile for the Home rail + Categories grid (icon/count are UI concerns). */
export type CategoryTile = {
  id: string;
  name: string;
  icon: IconName;
  count: string;
  tone: string;
};

/** Sellable variant — the unit added to the cart. `size`+`colorHex` resolve the PDP selection. */
export type CatalogVariant = {
  id: string;
  size: string;
  colorName: string;
  colorHex: string | null;
  pricePaise: number;
  mrpPaise: number;
  availableQty: number;
};

export type CatalogItem = {
  id: string;
  name: string;
  brand: string | null;
  department: Department;
  description: string;
  pricePaise: number;
  mrpPaise: number;
  /** Whole-percent discount off MRP. */
  offerPct: number;
  /** Average rating (null until the reviews backend lands). */
  rating: number | null;
  ratingCount: number | null;
  /** Warm placeholder behind product imagery (design uses solid tones). */
  tone: string;
  /** Live image; when absent the tone shows. */
  imageUrl: string | null;
  trialEligible: boolean;
  /** Colour swatch hexes. */
  colors: string[];
  sizes: string[];
  /** Sellable variants — the PDP resolves the chosen size+colour to one of these to add to cart. */
  variants: CatalogVariant[];
  material: string | null;
  care: string | null;
};

/** Deterministic tone from an id so real products without imagery still get a pleasant background. */
export function toneFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return productTones[h % productTones.length];
}

export function offerPct(pricePaise: number, mrpPaise: number): number {
  if (mrpPaise <= 0 || pricePaise >= mrpPaise) return 0;
  return Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100);
}

/** Map a live backend product to the display view-model. */
export function toCatalogItem(p: Product): CatalogItem {
  const variant = p.variants[0];
  const pricePaise = variant?.pricePaise ?? 0;
  const mrpPaise = variant?.mrpPaise ?? pricePaise;
  const colors = Array.from(
    new Set(p.variants.map((v) => v.colorHex).filter((c): c is string => !!c)),
  );
  const sizes = Array.from(new Set(p.variants.map((v) => v.size)));
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    department: p.department,
    description: p.description,
    pricePaise,
    mrpPaise,
    offerPct: offerPct(pricePaise, mrpPaise),
    rating: null,
    ratingCount: null,
    tone: toneFor(p.id),
    imageUrl: p.images[0]?.url ?? null,
    trialEligible: p.trialEligible,
    colors,
    sizes,
    variants: p.variants.map((v) => ({
      id: v.id,
      size: v.size,
      colorName: v.colorName,
      colorHex: v.colorHex,
      pricePaise: v.pricePaise,
      mrpPaise: v.mrpPaise,
      availableQty: v.availableQty,
    })),
    material: null,
    care: null,
  };
}
