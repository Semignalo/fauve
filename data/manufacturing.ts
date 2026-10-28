/* Private label manufacturing (maklon). Source: Canva "FAUVE PRICELIST FLYER".
   Used by the home page and /manufacturing. A price of null shows "Price on request". */

import type { Concentration } from './shop';

export { CONCENTRATIONS, formatIDR } from './shop';

export const MOQ = 100;

export type PriceRow = { label: string; prices: Record<Concentration, number | null> };

/** Personalized perfume pricelist, IDR per piece, minimum order MOQ pieces. */
export const personalized: PriceRow[] = [
  { label: '30 ml', prices: { EDP: 53750, 'Extrait 30': 81700, 'Extrait 50': 107500 } },
  { label: '50 ml', prices: { EDP: 90300, 'Extrait 30': 133300, 'Extrait 50': 187050 } },
];
export const personalizedIncludes = ['Box', 'Bottle', 'Formula', 'Design', 'Label', 'Stickering'];
export const personalizedNote = '10 ml and 100 ml available on request.';

/** Bulk / wholesale pricelist. Prices not set yet. */
export const wholesale: PriceRow[] = [
  { label: '50 pcs', prices: { EDP: null, 'Extrait 30': null, 'Extrait 50': null } },
  { label: '100 pcs', prices: { EDP: null, 'Extrait 30': null, 'Extrait 50': null } },
];
export const wholesaleIncludes = ['30 ml standard perfume bottle', 'Customised formula', 'Label design'];

export const FROM_PRICE = Math.min(
  ...personalized.flatMap((r) => Object.values(r.prices).filter((p): p is number => p !== null)),
);

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
    a: '30 ml and 50 ml as standard. 10 ml and 100 ml on request.',
  },
];

/** Price per piece for the inquiry form estimate, or null when that size has no listed price. */
export function mfgPrice(size: string, c: Concentration): number | null {
  return personalized.find((r) => r.label === size)?.prices[c] ?? null;
}
