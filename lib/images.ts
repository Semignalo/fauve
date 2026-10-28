/* Image slots. Each slot is a placeholder plate until a real photograph is dropped into
   /public/img/photo and its path is set as `src`. Nothing else in the code needs to change. */
export type Tone = 'canyon' | 'amber' | 'driftwood' | 'stone' | 'dune' | 'grove' | 'dusk' | 'sand';

export type Slot = { tone: Tone; src?: string; alt: string; note: string };

export const SLOTS = {
  hero: { tone: 'canyon', alt: 'Warm canyon light falling across tawny stone', note: 'Canyon light' },
  story: { tone: 'driftwood', src: '/img/photo/story.jpg', alt: 'Driftwood on a beach at sunset', note: 'Driftwood' },
  statement: { tone: 'amber', src: '/img/photo/statement.jpg', alt: 'Perfume bottles on travertine in a shaft of light', note: 'Bottles in light' },
  bar: { tone: 'dusk', src: '/img/photo/bar.jpg', alt: 'A shelf of perfume bottles against a warm textured wall', note: 'Perfume bar at dusk' },
  manufacturing: { tone: 'amber', src: '/img/photo/manufacturing.jpg', alt: 'A perfumer blending oils at a worktable', note: 'Amber glass' },
  finder: { tone: 'dune', src: '/img/photo/finder.jpg', alt: 'A hand reaching for one of two perfume bottles in morning light', note: 'Dune grass' },
  earth: { tone: 'stone', src: '/img/photo/earth.jpg', alt: 'Stacked river stones', note: 'Earth' },
  wood: { tone: 'driftwood', src: '/img/photo/wood.jpg', alt: 'A length of driftwood', note: 'Wood' },
  light: { tone: 'canyon', src: '/img/photo/light.jpg', alt: 'A shaft of light in a cave', note: 'Light' },
  fur: { tone: 'dune', src: '/img/photo/fur.jpg', alt: 'Tawny animal fur', note: 'Fur' },
  vision: { tone: 'grove', src: '/img/photo/vision.jpg', alt: 'Dried grasses and flowers in warm light', note: 'Dried plants' },
  contact: { tone: 'amber', src: '/img/photo/contact.jpg', alt: 'A candle glowing in an amber glass jar', note: 'Amber' },
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
