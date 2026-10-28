/* Checks the matching rules with sample scents. Run: npm test */
import assert from 'node:assert/strict';
import { topThree, whySentence } from '../lib/match';
import { finder } from '../data/finder';
import type { Scent } from '../lib/types';

const mk = (id: string, family: string, moods: string[], places: string[], time: string, intensity: string): Scent => ({
  id, name: id, family, top: '', heart: '', base: '', moods, places, time, intensity, description: '', image: '',
});

const catalogue = [
  mk('a', 'woody', ['bold'], ['study'], 'night', 'lingering'),
  mk('b', 'floral', ['calm'], ['coast'], 'morning', 'close'),
  mk('c', 'gourmand', ['warm'], ['city'], 'dusk', 'present'),
  mk('d', 'amber', ['soft', 'warm'], ['forest'], 'dusk', 'lingering'),
  mk('e', 'fresh', ['calm'], ['forest'], 'afternoon', 'close'),
];

const answers = { mood: 'warm', place: 'forest', time: 'dusk', like: 'amber', avoid: 'woody', intensity: 'lingering' } as const;

const r1 = topThree(catalogue, answers);
assert.equal(r1.length, 3, 'always three results');
assert.equal(r1[0].scent.id, 'd', 'best match first');
assert.ok(!r1.some((m) => m.scent.family === 'woody'), 'avoided family never appears');

const r2 = topThree(catalogue, answers);
assert.deepEqual(r1.map((m) => m.scent.id), r2.map((m) => m.scent.id), 'same answers, same result');

const other = topThree(catalogue, { mood: 'calm', place: 'coast', time: 'morning', like: 'floral', avoid: 'none', intensity: 'close' });
assert.equal(other[0].scent.id, 'b', 'different answers, different result');

assert.equal(topThree(catalogue.slice(0, 2), { avoid: 'none' }).length, 2, 'fewer scents than three is fine');
assert.ok(whySentence(r1[0], finder, answers).length > 10, 'gives a reason');
assert.ok(!/\bAI\b/i.test(whySentence(r1[0], finder, answers)), 'no mention of AI');

console.log('match: all checks passed');

const multi = topThree(catalogue, { character: ['floral', 'sweet'], daypart: 'day' });
assert.equal(multi[0].scent.id, 'b', 'multi-select character and daypart drive the match');
assert.ok(multi[0].why.includes('character'), 'character is recorded as a reason');
assert.ok(whySentence(multi[0], finder, { character: ['floral', 'sweet'] }).includes('floral, sweet'), 'lists every chosen character');

/* Option C: ruling a family out removes it, however well it matches everything else. */
const trap = [
  mk('t1', 'woody', ['warm'], ['forest'], 'dusk', 'lingering'),
  mk('t2', 'fresh', [], [], 'morning', 'close'),
];
const ruled = topThree(trap, { mood: 'warm', place: 'forest', time: 'dusk', like: 'woody', avoid: 'woody', intensity: 'lingering' });
assert.deepEqual(ruled.map((m) => m.scent.id), ['t2'], 'ruled-out family is removed even when it matches everything else');
assert.equal(topThree(trap, { avoid: 'none' }).length, 2, 'nothing removed when the visitor likes them all');
