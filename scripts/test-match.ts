/* Checks the matching rules with sample scents. Run: npm test */
import assert from 'node:assert/strict';
import { topThree, whySentence } from '../lib/match';
import { finder } from '../data/finder';
import type { Scent } from '../lib/types';

const mk = (id: string, family: string, moods: string[], time: string, intensity: string): Scent => ({
  id, name: id, family, top: '', heart: '', base: '', moods, places: [], time, intensity, description: '', image: '',
});

const catalogue = [
  mk('a', 'woody', ['bold'], 'night', 'lingering'),
  mk('b', 'floral', ['calm'], 'morning', 'close'),
  mk('c', 'gourmand', ['warm'], 'dusk', 'present'),
  mk('d', 'amber', ['soft', 'warm'], 'dusk', 'lingering'),
  mk('e', 'fresh', ['calm'], 'afternoon', 'close'),
];

const answers = { mood: 'warm', like: ['amber'], avoid: ['woody'], intensity: 'lingering', daypart: 'night' } as const;

const r1 = topThree(catalogue, { ...answers, like: ['amber'], avoid: ['woody'] });
assert.equal(r1.length, 3, 'three results when four scents remain');
assert.equal(r1[0].scent.id, 'd', 'best match first');
assert.ok(!r1.some((m) => m.scent.family === 'woody'), 'avoided family never appears');

const r2 = topThree(catalogue, { ...answers, like: ['amber'], avoid: ['woody'] });
assert.deepEqual(r1.map((m) => m.scent.id), r2.map((m) => m.scent.id), 'same answers, same result');

const other = topThree(catalogue, { mood: 'calm', like: ['floral'], avoid: ['none'], intensity: 'close', daypart: 'day' });
assert.equal(other[0].scent.id, 'b', 'different answers, different result');

assert.equal(topThree(catalogue.slice(0, 2), { avoid: ['none'] }).length, 2, 'fewer scents than three is fine');
assert.ok(whySentence(r1[0], finder, { mood: 'warm', like: ['amber'] }).length > 10, 'gives a reason');
assert.ok(!/\bAI\b/i.test(whySentence(r1[0], finder, { mood: 'warm', like: ['amber'] })), 'no mention of AI');

/* Several liked families all count. */
const multi = topThree(catalogue, { like: ['floral', 'amber'] });
assert.deepEqual(new Set(multi.slice(0, 2).map((m) => m.scent.id)), new Set(['b', 'd']), 'every liked family scores');
assert.ok(multi[0].why.includes('like'), 'like is recorded as a reason');
assert.ok(whySentence(multi[0], finder, { like: ['floral', 'amber'] }).includes('floral and herbal, sweet and warm'), 'lists every liked note');

/* Ruling a family out removes it, even when it is also liked and matches everything else. */
const trap = [mk('t1', 'woody', ['warm'], 'dusk', 'lingering'), mk('t2', 'fresh', [], 'morning', 'close')];
const ruled = topThree(trap, { mood: 'warm', like: ['woody'], avoid: ['woody'], intensity: 'lingering' });
assert.deepEqual(ruled.map((m) => m.scent.id), ['t2'], 'ruled-out family is removed even when liked');
assert.equal(topThree(trap, { avoid: ['none'] }).length, 2, 'nothing removed when the visitor likes them all');
assert.equal(topThree(trap, { avoid: ['woody', 'fresh'] }).length, 0, 'ruling out everything gives no result');

/* "Throughout the entire day" has no preference, so it adds nothing. */
const day = topThree(catalogue, { daypart: 'all' });
assert.ok(day.every((m) => m.points === 0), 'entire day adds no points');

console.log('match: all checks passed');

/* Follow-up question: a matching note group adds points inside the liked family, nothing is removed. */
import { followUps } from '../data/finder';
import { hasNoteGroup, NOTE_GROUPS } from '../lib/notes';
const withNotes = (id: string, family: string, notes: string): Scent => ({ ...mk(id, family, [], 'morning', 'close'), heart: notes });
const fresh = [withNotes('f1', 'fresh', 'Aquatic, Pear'), withNotes('f2', 'fresh', 'Lemon, Aquatic'), withNotes('f3', 'fresh', 'Orange Blossom, Aquatic')];
const lemon = topThree(fresh, { like: 'fresh', detail: 'citrus' });
assert.equal(lemon[0].scent.id, 'f2', 'citrus follow-up puts the lemon scent first');
assert.ok(lemon[0].why.includes('detail'), 'follow-up is recorded as a reason');
assert.ok(!hasNoteGroup(fresh[2], 'citrus'), 'orange blossom is a flower, not citrus');
assert.equal(topThree(fresh, { like: 'fresh', detail: 'citrus' }).length, 3, 'follow-up never removes a scent');
assert.deepEqual(topThree(fresh, { like: 'fresh', detail: 'any' }).map((m) => m.scent.id), ['f1', 'f2', 'f3'], '"no preference" keeps catalogue order');
assert.ok(whySentence(lemon[0], finder, { like: 'fresh', detail: 'citrus' }).includes('citrus, like lemon and orange'), 'sentence names the follow-up');
for (const fam of ['woody', 'floral', 'gourmand', 'amber', 'fresh']) {
  const groups = Object.keys(NOTE_GROUPS[fam]);
  const opts = followUps[fam].options.map((o) => o.value).filter((v) => v !== 'any');
  assert.deepEqual(opts, groups, `${fam}: follow-up options match the note groups`);
}

console.log('follow-up: all checks passed');
