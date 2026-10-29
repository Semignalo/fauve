import { followUps } from '../data/finder';
import { hasNoteGroup } from './notes';
import type { FinderKey, FinderQuestion, Scent } from './types';

export type Answers = Partial<Record<FinderKey, string | string[]>>;
export type Match = { scent: Scent; points: number; why: string[] };

const DAY = ['morning', 'afternoon'];

const list = (v: string | string[] | undefined): string[] =>
  ([] as (string | undefined)[]).concat(v).filter((x): x is string => !!x);

/** Hard rule: a family the visitor said they cannot stand never appears, even if they also liked it. */
export function allowed(scent: Scent, a: Answers): boolean {
  return !list(a.avoid).includes(scent.family);
}

/** Score one scent against the visitor's answers. Fixed weights, no randomness. */
export function score(scent: Scent, a: Answers): Match {
  let points = 0;
  const why: string[] = [];
  if (a.mood && scent.moods.includes(list(a.mood)[0])) { points += 3; why.push('mood'); }
  if (list(a.like).includes(scent.family)) {
    points += 3; why.push('like');
    // The follow-up only adds points; it never removes a scent, so results are never empty because of it.
    if (a.detail && a.detail !== 'any' && hasNoteGroup(scent, a.detail as string)) { points += 2; why.push('detail'); }
  }
  if (a.intensity && scent.intensity === a.intensity) { points += 1; why.push('intensity'); }
  // "all" means no preference, so it neither adds nor removes points.
  if (a.daypart && a.daypart !== 'all' && DAY.includes(scent.time) === (a.daypart === 'day')) { points += 1; why.push('daypart'); }
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
  return list(a[key])
    .map((v) => q?.options.find((x) => x.value === v)?.label.toLowerCase())
    .filter(Boolean)
    .join(', ');
}

/** One calm sentence on why a scent fits, built from the answers that matched. */
export function whySentence(m: Match, questions: FinderQuestion[], a: Answers): string {
  const w = m.why;
  const L = (k: FinderKey) => labelOf(questions, a, k);
  // The follow-up question depends on the family chosen, so its label is looked up from there.
  const detail = w.includes('detail') ? labelOf([followUps[list(a.like)[0]]], a, 'detail') : '';
  const likes = detail ? `${L('like')}, ${detail}` : L('like');
  if (w.includes('mood') && w.includes('like')) return `Fits your mood (${L('mood')}) and the notes you like (${likes}).`;
  if (w.includes('mood')) return `Matches the mood you chose: ${L('mood')}.`;
  if (w.includes('like')) return `Matches the notes you like: ${likes}.`;
  return 'A softer match for your answers.';
}
