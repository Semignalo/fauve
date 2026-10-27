import type { FinderQuestion, Scent } from './types';

export type Answers = Partial<Record<FinderQuestion['key'], string>>;
export type Match = { scent: Scent; points: number; why: string[] };

/** Score one scent against the visitor's answers. Fixed weights, no randomness. */
export function score(scent: Scent, a: Answers): Match {
  let points = 0;
  const why: string[] = [];
  if (a.mood && scent.moods.includes(a.mood)) { points += 3; why.push('mood'); }
  if (a.place && scent.places.includes(a.place)) { points += 2; why.push('place'); }
  if (a.time && scent.time === a.time) { points += 1; why.push('time'); }
  if (a.like && scent.family === a.like) { points += 3; why.push('like'); }
  if (a.avoid && a.avoid !== 'none' && scent.family === a.avoid) points -= 10;
  if (a.intensity && scent.intensity === a.intensity) { points += 1; why.push('intensity'); }
  return { scent, points, why };
}

/** Top three scents. Ties keep the catalogue order, so the same answers always give the same result. */
export function topThree(scents: Scent[], a: Answers): Match[] {
  return scents
    .map((s, i) => ({ m: score(s, a), i }))
    .filter(({ m }) => m.points > -5)
    .sort((x, y) => y.m.points - x.m.points || x.i - y.i)
    .slice(0, 3)
    .map(({ m }) => m);
}

export function labelOf(questions: FinderQuestion[], a: Answers, key: FinderQuestion['key']): string {
  const q = questions.find((x) => x.key === key);
  const o = q?.options.find((x) => x.value === a[key]);
  return o ? o.label.toLowerCase() : '';
}

/** One calm sentence on why a scent fits, built from the answers that matched. */
export function whySentence(m: Match, questions: FinderQuestion[], a: Answers): string {
  const w = m.why;
  const L = (k: FinderQuestion['key']) => labelOf(questions, a, k);
  if (w.includes('mood') && w.includes('place')) return `It holds the ${L('mood')} you asked for, and the feeling of ${L('place')}.`;
  if (w.includes('like') && w.includes('time')) return `It is built on ${L('like')}, and it belongs to ${L('time')}.`;
  if (w.includes('mood')) return `It is the one that feels ${L('mood')}.`;
  if (w.includes('like')) return `It begins where you said you are drawn: ${L('like')}.`;
  if (w.includes('place')) return `It carries something of ${L('place')}.`;
  return 'It sits alongside your answers, a quieter way into the same story.';
}
