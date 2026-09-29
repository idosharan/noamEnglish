import { test } from 'node:test';
import assert from 'node:assert/strict';
import { levelFor, thresholdFor, levelProgress, comboMultiplier, roundReward, maxDifficultyFor } from '../src/game/xp.js';

test('levelFor follows thresholds', () => {
  assert.equal(levelFor(0), 1);
  assert.equal(levelFor(99), 1);
  assert.equal(levelFor(100), 2);
  assert.equal(levelFor(250), 3);
  assert.equal(levelFor(30000), 10);
  assert.equal(levelFor(60000), 11);
});

test('thresholdFor doubles beyond table', () => {
  assert.equal(thresholdFor(10), 30000);
  assert.equal(thresholdFor(11), 60000);
  assert.equal(thresholdFor(12), 120000);
});

test('levelProgress ratio', () => {
  const p = levelProgress(175);
  assert.equal(p.level, 2);
  assert.equal(p.from, 100);
  assert.equal(p.to, 250);
  assert.equal(p.ratio, 0.5);
});

test('comboMultiplier tiers', () => {
  assert.equal(comboMultiplier(0), 1);
  assert.equal(comboMultiplier(2), 1);
  assert.equal(comboMultiplier(3), 2);
  assert.equal(comboMultiplier(6), 3);
});

test('roundReward perfect round with combo', () => {
  const answers = Array.from({ length: 10 }, () => ({ correct: true }));
  const r = roundReward({ answers, mode: 'spelling' });
  // combos 1,2 → 10 each; 3,4,5 → 20 each; 6..10 → 30 each = 20+60+150 = 230 + 50 bonus
  assert.equal(r.subs, 280);
  assert.equal(r.likes, 10);
  assert.equal(r.perfect, true);
  assert.equal(r.maxCombo, 10);
});

test('roundReward resets combo on wrong answer', () => {
  const answers = [true, true, true, false, true].map((c) => ({ correct: c }));
  const r = roundReward({ answers, mode: 'vocabulary' });
  assert.equal(r.subs, 10 + 10 + 20 + 0 + 10);
  assert.equal(r.perfect, false);
  assert.equal(r.correct, 4);
});

test('roundReward boss win bonus, no perfect bonus for boss', () => {
  const answers = [{ correct: true }];
  const r = roundReward({ answers, mode: 'boss', bossWon: true });
  assert.equal(r.subs, 110);
});

test('maxDifficultyFor', () => {
  assert.equal(maxDifficultyFor(1), 1);
  assert.equal(maxDifficultyFor(3), 2);
  assert.equal(maxDifficultyFor(6), 3);
});
