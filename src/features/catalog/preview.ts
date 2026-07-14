/**
 * PREVIEW / SAMPLE catalog — the ANDRÓ demo content from the design (`design/andro-template.html`).
 *
 * ⚠️ This is clearly-labelled sample content, NOT a real backend response and NOT passed off as
 * live data. It renders ONLY when the catalog API returns nothing (backend not built yet), so the
 * screens match the design and stay reviewable. `useCatalog` swaps to real data automatically the
 * moment `GET /products` returns results. Delete this file once the catalog backend + seed exist.
 */
import { productTones } from '@/theme/colors';
import type { IconName } from '@/theme/material-icons';
import type { CatalogItem, CategoryTile } from './model';
import { offerPct } from './model';

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const SHOE_SIZES = ['6', '7', '8', '9', '10', '11'];
const ONE_SIZE = ['One Size'];
const SWATCHES = ['#3A3A38', '#8A6E4B', '#B7B2A6', '#5B6B5E', '#2C3A55', '#7A2E2E'];

type Seed = {
  name: string;
  brand: string;
  /** Rupees (converted to paise below). */
  price: number;
  mrp: number;
  rating: number;
  ratingCount: number;
  sizes: string[];
  material: string;
  care: string;
  trial?: boolean;
};

const SEEDS: Seed[] = [
  { name: 'Silk Wrap Dress', brand: 'ANDRÓ ATELIER', price: 8990, mrp: 12990, rating: 4.8, ratingCount: 214, sizes: APPAREL_SIZES, material: '92% Silk, 8% Elastane', care: 'Dry clean only', trial: true },
  { name: 'Cashmere Overcoat', brand: 'ANDRÓ HERITAGE', price: 18990, mrp: 24990, rating: 4.9, ratingCount: 176, sizes: APPAREL_SIZES, material: '100% Cashmere', care: 'Dry clean only', trial: true },
  { name: 'Tailored Wool Blazer', brand: 'ANDRÓ FORMAL', price: 11990, mrp: 15990, rating: 4.7, ratingCount: 132, sizes: APPAREL_SIZES, material: '98% Wool, 2% Elastane', care: 'Dry clean only', trial: true },
  { name: 'Pleated Midi Skirt', brand: 'ANDRÓ STUDIO', price: 4990, mrp: 6990, rating: 4.6, ratingCount: 98, sizes: APPAREL_SIZES, material: '100% Polyester', care: 'Machine wash cold' },
  { name: 'Linen Resort Shirt', brand: 'ANDRÓ CASUAL', price: 3490, mrp: 4990, rating: 4.5, ratingCount: 87, sizes: APPAREL_SIZES, material: '100% European Linen', care: 'Machine wash cold' },
  { name: 'Leather Loafers', brand: 'ANDRÓ MILANO', price: 9990, mrp: 13990, rating: 4.8, ratingCount: 145, sizes: SHOE_SIZES, material: 'Full-grain leather', care: 'Wipe with a dry cloth' },
  { name: 'Merino Knit Sweater', brand: 'ANDRÓ KNITS', price: 6490, mrp: 8990, rating: 4.7, ratingCount: 119, sizes: APPAREL_SIZES, material: '100% Merino Wool', care: 'Hand wash cold', trial: true },
  { name: 'Structured Tote', brand: 'ANDRÓ MILANO', price: 12990, mrp: 16990, rating: 4.9, ratingCount: 203, sizes: ONE_SIZE, material: 'Saffiano leather', care: 'Wipe with a dry cloth' },
  { name: 'Silk Scarf', brand: 'ANDRÓ HERITAGE', price: 2990, mrp: 3990, rating: 4.6, ratingCount: 64, sizes: ONE_SIZE, material: '100% Mulberry Silk', care: 'Dry clean only' },
  { name: 'Wide-Leg Trousers', brand: 'ANDRÓ STUDIO', price: 5490, mrp: 7490, rating: 4.5, ratingCount: 76, sizes: APPAREL_SIZES, material: '70% Viscose, 30% Linen', care: 'Machine wash cold' },
];

const DESCRIPTION =
  'A fluid silk-blend piece cut for a flattering drape, finished with considered detailing. An elevated staple for evening and occasion, made to be worn for seasons.';

export const previewItems: CatalogItem[] = SEEDS.map((s, i) => {
  const pricePaise = s.price * 100;
  const mrpPaise = s.mrp * 100;
  const colors = SWATCHES.slice(0, 4);
  // Synthesize size×colour variants so the type holds and the PDP can render selections. These
  // carry `preview-` ids and are never sent to the cart API (add-to-cart is disabled in preview).
  const variants = s.sizes.flatMap((size) =>
    colors.map((hex, ci) => ({
      id: `preview-${i + 1}-${size}-${ci}`,
      size,
      colorName: `Colour ${ci + 1}`,
      colorHex: hex,
      pricePaise,
      mrpPaise,
      availableQty: 5,
    })),
  );
  return {
    id: `preview-${i + 1}`,
    name: s.name,
    brand: s.brand,
    department: 'UNISEX',
    description: DESCRIPTION,
    pricePaise,
    mrpPaise,
    offerPct: offerPct(pricePaise, mrpPaise),
    rating: s.rating,
    ratingCount: s.ratingCount,
    tone: productTones[i % productTones.length],
    imageUrl: null,
    trialEligible: s.trial ?? false,
    colors,
    sizes: s.sizes,
    variants,
    material: s.material,
    care: s.care,
  };
});

const CATEGORY_SEEDS: { name: string; icon: IconName }[] = [
  { name: 'Men', icon: 'man' },
  { name: 'Women', icon: 'woman' },
  { name: 'Kids', icon: 'child_care' },
  { name: 'Ethnic Wear', icon: 'checkroom' },
  { name: 'Formal Wear', icon: 'apparel' },
  { name: 'Casual Wear', icon: 'styler' },
  { name: 'Footwear', icon: 'footprint' },
  { name: 'Accessories', icon: 'diamond' },
];

export const previewCategories: CategoryTile[] = CATEGORY_SEEDS.map((c, i) => ({
  id: `cat-${i + 1}`,
  name: c.name,
  icon: c.icon,
  count: `${400 + i * 180} styles`,
  tone: productTones[i % productTones.length],
}));
