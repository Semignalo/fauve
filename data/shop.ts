/* Retail orders: the ready-made catalogue and the order form.
   PRICES are placeholders until the real retail prices are set. Change the numbers here only. */

export const SIZES = [10, 30, 50, 100] as const;
export type Size = (typeof SIZES)[number];

export const CONCENTRATIONS = ['EDP', 'Extrait 30', 'Extrait 50'] as const;
export type Concentration = (typeof CONCENTRATIONS)[number];

/** One line under each concentration in the order form. */
export const CONCENTRATION_NOTE: Record<Concentration, string> = {
  EDP: 'Light and easy, for every day',
  'Extrait 30': 'Deeper, stays through the day',
  'Extrait 50': 'The richest, lingers longest',
};

/** Retail price per bottle in IDR. Placeholder numbers. */
export const PRICES: Record<Concentration, Record<Size, number>> = {
  EDP: { 10: 95000, 30: 195000, 50: 285000, 100: 495000 },
  'Extrait 30': { 10: 125000, 30: 255000, 50: 375000, 100: 650000 },
  'Extrait 50': { 10: 165000, 30: 325000, 50: 475000, 100: 850000 },
};

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

export function priceOf(c: Concentration, s: Size): number {
  return PRICES[c][s];
}

/** Lowest price in the table, shown as "From ..." on catalogue cards. */
export const FROM_PRICE = Math.min(...CONCENTRATIONS.flatMap((c) => SIZES.map((s) => PRICES[c][s])));

export function formatIDR(n: number): string {
  return `IDR ${n.toLocaleString('id-ID')}`;
}
