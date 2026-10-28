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

/* Each scent family has a few photographs. A scent takes one by its id and position,
   so three scents from the same family never show the same picture. */
const FAMILY_IMG: Record<string, string[]> = {
  woody: ['/img/finder/oud.jpg', '/img/photo/wood.jpg', '/img/photo/earth.jpg', '/img/photo/light.jpg'],
  floral: ['/img/finder/lavender.jpg', '/img/photo/vision.jpg', '/img/finder/morning.jpg', '/img/finder/afternoon.jpg'],
  gourmand: ['/img/finder/coffee.jpg', '/img/finder/vanilla.jpg', '/img/photo/contact.jpg', '/img/photo/fur.jpg'],
  amber: ['/img/finder/vanilla.jpg', '/img/finder/dusk.jpg', '/img/photo/contact.jpg', '/img/finder/afternoon.jpg'],
  fresh: ['/img/finder/forest.jpg', '/img/finder/coast.jpg', '/img/finder/morning.jpg', '/img/photo/earth.jpg'],
};

export function scentImage(family: string, id: string, k = 0): string | undefined {
  const pool = FAMILY_IMG[family];
  if (!pool) return undefined;
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return pool[(h + k) % pool.length];
}
