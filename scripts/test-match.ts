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
