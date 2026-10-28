import type { FinderKey, FinderQuestion, Scent } from './types';

export type Answers = Partial<Record<FinderKey, string | string[]>>;
export type Match = { scent: Scent; points: number; why: string[] };

const DAY = ['morning', 'afternoon'];
const CHARACTER_FAMILIES: Record<string, string[]> = {
  sweet: ['amber', 'gourmand'],
  fresh: ['fresh'],
  woody: ['woody'],
  floral: ['floral'],
  hungry: ['gourmand'],
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Hard rule: a family the visitor said they would rather not wear never appears. */
export function allowed(scent: Scent, a: Answers): boolean {
  return !(a.avoid && a.avoid !== 'none' && scent.family === a.avoid);
}

/** Score one scent against the visitor's answers. Fixed weights, no randomness. */
export function score(scent: Scent, a: Answers): Match {
  let points = 0;
  const why: string[] = [];
  if (a.mood && scent.moods.includes(one(a.mood)!)) { points += 3; why.push('mood'); }
  if (a.place && scent.places.includes(one(a.place)!)) { points += 2; why.push('place'); }
  if (a.time && scent.time === a.time) { points += 1; why.push('time'); }
  if (a.like && scent.family === a.like) { points += 3; why.push('like'); }
  if (a.intensity && scent.intensity === a.intensity) { points += 1; why.push('intensity'); }

  if (a.daypart && DAY.includes(scent.time) === (a.daypart === 'day')) { points += 1; why.push('daypart'); }
  const wanted = (Array.isArray(a.character) ? a.character : []).flatMap((c) => CHARACTER_FAMILIES[c] ?? []);
  if (wanted.includes(scent.family)) { points += 2; why.push('character'); }
  // The catalogue holds one intensity per scent, so projection and sillage each nudge toward it.
  // Longevity is not asked: it follows the concentration (EDP or Extrait) chosen when ordering.
  for (const k of ['projection', 'sillage'] as const) {
    if (a[k] && scent.intensity === a[k]) { points += 1; why.push(k); }
  }
  return { scent, points, why };
}

/** Top three scents: drop what the visitor ruled out, then rank the rest by score.
    Ties keep the catalogue order, so the same answers always give the same result. */
export function topThree(scents: Scent[], a: Answers): Match[] {
  return scents
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => allowed(s, a))
    .map(({ s, i }) => ({ m: score(s, a), i }))
    .sort((x, y) => y.m.points - x.m.points || x.i - y.i)
    .slice(0, 3)
    .map(({ m }) => m);
}

export function labelOf(questions: FinderQuestion[], a: Answers, key: FinderKey): string {
  const q = questions.find((x) => x.key === key);
  const picked = ([] as (string | undefined)[]).concat(a[key]);
  return picked
    .map((v) => q?.options.find((x) => x.value === v)?.label.toLowerCase())
    .filter(Boolean)
    .join(', ');
}

/** One calm sentence on why a scent fits, built from the answers that matched. */
export function whySentence(m: Match, questions: FinderQuestion[], a: Answers): string {
  const w = m.why;
  const L = (k: FinderKey) => labelOf(questions, a, k);
  if (w.includes('mood') && w.includes('place')) return `Fits your mood (${L('mood')}) and your place (${L('place')}).`;
  if (w.includes('like') && w.includes('time')) return `Matches the scent you like (${L('like')}) and suits ${L('time')}.`;
  if (w.includes('mood')) return `Matches the mood you chose: ${L('mood')}.`;
  if (w.includes('like')) return `Matches the scent you like: ${L('like')}.`;
  if (w.includes('character')) return `Has the scent type you picked: ${L('character')}.`;
  if (w.includes('place')) return `Matches the place you chose: ${L('place')}.`;
  return 'A softer match for your answers.';
}
