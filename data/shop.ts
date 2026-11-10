/* Retail orders: the ready-made catalogue and the order form.
   PRICES are placeholders until the real retail prices are set. Change the numbers here only. */

export const SIZES = [10, 30, 50, 100] as const;
export type Size = (typeof SIZES)[number];

/** Everything sold is Extrait (50%). */
export const CONCENTRATION = 'Extrait (50%)';

/** Retail price per bottle in IDR. Placeholder numbers. */
export const PRICES: Record<Size, number> = { 10: 165000, 30: 325000, 50: 475000, 100: 850000 };

/** The ten scents sold ready-made. Ids come from data/scents.ts; swap any id to change the catalogue. */
export const CATALOG_IDS = [
  'bold-saffron-ember',
  'bold-dark-roast',
  'man-quiet-sandal',
  'manis-segar-vanilla-roast',
  'fruity-floral-lychee-bloom',
  'extra-garden-rose',
  'man-open-water',
  'fruity-floral-peach-tea',
  'manis-segar-white-jasmine',
  'manis-segar-soft-lavender',
];

export function priceOf(s: Size): number {
  return PRICES[s];
}

/** Lowest price in the table, shown as "From ..." on catalogue cards. */
export const FROM_PRICE = Math.min(...SIZES.map((s) => PRICES[s]));

export function formatIDR(n: number): string {
  return `IDR ${n.toLocaleString('id-ID')}`;
}
