/* Image slots. Each slot is a placeholder plate until a real photograph is dropped into
   /public/img/photo and its path is set as `src`. Nothing else in the code needs to change. */
export type Tone = 'canyon' | 'amber' | 'driftwood' | 'stone' | 'dune' | 'grove' | 'dusk' | 'sand';

export type Slot = { tone: Tone; src?: string; alt: string; note: string };

export const SLOTS = {
  hero: { tone: 'canyon', alt: 'Warm canyon light falling across tawny stone', note: 'Canyon light' },
  story: { tone: 'driftwood', alt: 'Weathered driftwood in soft light', note: 'Driftwood' },
  bar: { tone: 'dusk', alt: 'A perfume bar glowing at dusk', note: 'Perfume bar at dusk' },
  manufacturing: { tone: 'amber', alt: 'Amber glass bottles in warm light', note: 'Amber glass' },
  finder: { tone: 'dune', alt: 'Sunlit dune grass', note: 'Dune grass' },
  earth: { tone: 'stone', alt: 'Stacked river stones', note: 'Earth' },
  wood: { tone: 'driftwood', alt: 'A length of driftwood', note: 'Wood' },
  light: { tone: 'canyon', alt: 'A shaft of light in a cave', note: 'Light' },
  fur: { tone: 'dune', alt: 'A spotted hide in sunlight', note: 'Fur' },
  vision: { tone: 'grove', alt: 'Dried plants in low light', note: 'Dried plants' },
  contact: { tone: 'amber', alt: 'Amber glass catching the light', note: 'Amber' },
} satisfies Record<string, Slot>;

export type SlotName = keyof typeof SLOTS;

/** Maps the older stock-photo paths used in the finder data to a placeholder tone. */
export const LEGACY_TONE: Record<string, Tone> = {
  '/img/photo/ingredient-oud.jpg': 'driftwood',
  '/img/photo/ingredient-lavender.jpg': 'dusk',
  '/img/photo/ingredient-coffee.jpg': 'amber',
  '/img/photo/ingredient-vanilla.jpg': 'dune',
  '/img/photo/campaign-leaf.jpg': 'grove',
  '/img/photo/bottle-still.jpg': 'stone',
};
