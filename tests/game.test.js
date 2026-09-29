import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questsFor, applyProgress } from '../src/game/quests.js';
import { evaluate, BADGES } from '../src/game/badges.js';
import { defaultState, migrateLegacy, refreshDaily, touchStreak, addRewards, recordRound, createStore, STORAGE_KEY, LEGACY_KEY } from '../src/core/store.js';
import { rng, shuffle, pickMany, todayKey, daysBetween, formatCount, hashString } from '../src/core/utils.js';

test('questsFor is deterministic per day and yields 3 distinct quests', () => {
  const a = questsFor('2026-09-17');
  const b = questsFor('2026-09-17');
  assert.deepEqual(a, b);
  assert.equal(a.items.length, 3);
  assert.equal(new Set(a.items.map((q) => q.id)).size, 3);
  assert.ok(a.items.every((q) => !q.title.includes('{n}')));
});

test('applyProgress increments and reports completion once', () => {
  const quests = { day: 'x', items: [{ id: 'perfect_1', title: '', n: 1, reward: 40, done: 0, claimed: false }] };
  const r1 = applyProgress(quests, { type: 'round', mode: 'spelling', perfect: true });
  assert.equal(r1.quests.items[0].done, 1);
  assert.equal(r1.completed.length, 1);
  const r2 = applyProgress(r1.quests, { type: 'round', mode: 'spelling', perfect: true });
  assert.equal(r2.completed.length, 0);
});

test('badges evaluate only new ones', () => {
  const s = { ...defaultState(), subs: 150, badges: ['subs_100'], streak: { count: 0, best: 0, lastDay: null } };
  const ids = evaluate(s);
  assert.ok(!ids.includes('subs_100'));
  assert.ok(!ids.includes('first_round'));
  s.stats = { spelling: { rounds: 1, perfect: 1, correct: 10, total: 10 } };
  const ids2 = evaluate(s);
  assert.ok(ids2.includes('first_round'));
  assert.ok(ids2.includes('perfect_spelling'));
  assert.equal(new Set(BADGES.map((b) => b.id)).size, BADGES.length);
});

test('migrateLegacy merges totals', () => {
  const s = migrateLegacy(defaultState(), { vocabulary: { correct: 5, total: 8 } });
  assert.equal(s.stats.vocabulary.correct, 5);
  assert.equal(s.stats.vocabulary.total, 8);
  assert.equal(s.stats.vocabulary.rounds, 0);
});

test('refreshDaily regenerates quests and breaks stale streak', () => {
  const s = { ...defaultState(), quests: { day: '2026-09-15', items: [] }, streak: { count: 4, best: 4, lastDay: '2026-09-14' } };
  const n = refreshDaily(s, '2026-09-17');
  assert.equal(n.quests.day, '2026-09-17');
  assert.equal(n.streak.count, 0);
  assert.equal(n.streak.best, 4);
});

test('touchStreak continues on consecutive day, once per day', () => {
  let s = touchStreak(defaultState(), '2026-09-16');
  assert.equal(s.streak.count, 1);
  s = touchStreak(s, '2026-09-16');
  assert.equal(s.streak.count, 1);
  s = touchStreak(s, '2026-09-17');
  assert.equal(s.streak.count, 2);
  s = touchStreak(s, '2026-09-20');
  assert.equal(s.streak.count, 1);
  assert.equal(s.streak.best, 2);
});

test('addRewards updates level', () => {
  const s = addRewards(defaultState(), { subs: 260, likes: 3 });
  assert.equal(s.level, 3);
  assert.equal(s.likes, 3);
});

test('recordRound aggregates stats', () => {
  let s = recordRound(defaultState(), { mode: 'memory', correct: 6, total: 6, perfect: true, elapsedSec: 70 });
  s = recordRound(s, { mode: 'memory', correct: 6, total: 6, perfect: true, elapsedSec: 45, maxCombo: 6 });
  assert.equal(s.stats.memory.rounds, 2);
  assert.equal(s.stats.memory.bestTime, 45);
  assert.equal(s.stats.memory.perfect, 2);
  assert.equal(s.bestCombo, 6);
});

test('createStore loads legacy and persists', () => {
  const mem = new Map();
  const storage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v), removeItem: (k) => mem.delete(k) };
  storage.setItem(LEGACY_KEY, JSON.stringify({ letters: { correct: 2, total: 3 } }));
  const store = createStore(storage);
  const s = store.load();
  assert.equal(s.stats.letters.total, 3);
  assert.ok(mem.has(STORAGE_KEY));
  store.update((st) => ({ ...st, likes: 9 }));
  assert.equal(JSON.parse(mem.get(STORAGE_KEY)).likes, 9);
});

test('utils: seeded rng, shuffle, pickMany, dates, formatCount', () => {
  const r1 = rng(42); const r2 = rng(42);
  assert.equal(r1(), r2());
  const arr = [1, 2, 3, 4, 5];
  assert.deepEqual([...shuffle(arr, rng(1))].sort(), arr);
  assert.equal(pickMany(arr, 3, rng(2)).length, 3);
  assert.equal(pickMany(arr, 9, rng(2)).length, 5);
  assert.equal(todayKey(new Date(2026, 8, 7)), '2026-09-07');
  assert.equal(daysBetween('2026-09-15', '2026-09-17'), 2);
  assert.equal(formatCount(999), '999');
  assert.equal(formatCount(1000), '1K');
  assert.equal(formatCount(1500), '1.5K');
  assert.equal(formatCount(1_000_000), '1M');
  assert.equal(hashString('a'), hashString('a'));
  assert.notEqual(hashString('a'), hashString('b'));
});
