/* Private label manufacturing (maklon). Source: Canva "FAUVE PRICELIST FLYER".
   Used by the home page and /manufacturing. A price of null shows "Price on request". */

export { formatIDR } from './shop';

export const MOQ = 100;

/** Custom perfume is made as Extrait (50%) only. */
export const MFG_CONCENTRATION = 'Extrait (50%)';

export type PriceRow = { label: string; price: number | null };

/** Personalized perfume pricelist, IDR per piece, minimum order MOQ pieces. */
export const personalized: PriceRow[] = [
  { label: '10 ml', price: 45000 },
  { label: '30 ml', price: 98000 },
  { label: '50 ml', price: 170000 },
  { label: '100 ml', price: 265000 },
];
export const personalizedIncludes = ['Box', 'Bottle', 'Formula', 'Design', 'Label', 'Stickering'];

/** Bulk / wholesale pricelist. Prices not set yet. */
export const wholesale: PriceRow[] = [
  { label: '50 pcs', price: null },
  { label: '100 pcs', price: null },
];
export const wholesaleIncludes = ['30 ml standard perfume bottle', 'Customised formula', 'Label design'];

export const FROM_PRICE = Math.min(...personalized.map((r) => r.price).filter((p): p is number => p !== null));

export const audiences = [
  { h: 'New perfume brands', p: 'Launch your first line without building a lab.' },
  { h: 'Creators and stores', p: 'A signature scent under your own name, for your audience.' },
  { h: 'Corporate gifts', p: 'A scent for your company, bottled for clients and teams.' },
  { h: 'Weddings and occasions', p: 'Souvenirs your guests will keep wearing.' },
];

export const faq = [
  {
    q: 'What is the minimum order?',
    a: `${MOQ} pieces per scent for personalised perfume. Bulk orders start from 50 pieces with a standard bottle.`,
  },
  {
    q: 'What does the price include?',
    a: 'Personalised perfume includes the formula, bottle, box, label design and stickering. You receive finished bottles, ready to sell or give.',
  },
  {
    q: 'Can I bring my own scent idea?',
    a: 'Yes. Bring a story, a reference or a mood. We shape the formula with you and send samples before production.',
  },
  {
    q: 'Which sizes can I order?',
    a: '10, 30, 50 and 100 ml. Custom perfume is made as Extrait (50%).',
  },
];

/** Price per piece for the inquiry form estimate, or null when that size has no listed price. */
export function mfgPrice(size: string): number | null {
  return personalized.find((r) => r.label === size)?.price ?? null;
}
