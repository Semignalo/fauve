export type Scent = {
  id: string;
  name: string;
  family: string;
  top: string;
  heart: string;
  base: string;
  moods: string[];
  places: string[];
  time: string;
  intensity: string;
  description: string;
  image: string;
};

export type FinderOption = { value: string; label: string; image?: string; tint?: 'sand' | 'olive' | 'clay' | 'ash' };
export type FinderQuestion = { key: 'mood' | 'place' | 'time' | 'like' | 'avoid' | 'intensity'; eyebrow: string; question: string; options: FinderOption[] };

export type Pack = { name: string; for?: string; inclusions?: string[]; price?: string; image?: string };
