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
export type FinderKey =
  | 'mood' | 'like' | 'avoid' | 'intensity'
  | 'detail' | 'daypart' | 'occasion' | 'projection' | 'sillage';
export type FinderQuestion = { key: FinderKey; eyebrow: string; question: string; multi?: boolean; options: FinderOption[] };

export type Pack = { name: string; for?: string; inclusions?: string[]; price?: string; image?: string };
