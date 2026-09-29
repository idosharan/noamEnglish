import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyRound } from '../src/game/round.js';
import { defaultState } from '../src/core/store.js';
import { questsFor } from '../src/game/quests.js';

const perfect = Array.from({ length: 10 }, () => ({ correct: true }));

test('applyRound grants subs, likes, streak, stats and badges', () => {
  const s0 = { ...defaultState(), quests: questsFor('2026-09-17') };
  const { state, summary } = applyRound(s0, { mode: 'spelling', answers: perfect, day: '2026-09-17' });
  assert.equal(summary.subs, 280);
  assert.equal(state.subs, 280);
  assert.equal(state.level, 3);
  assert.equal(summary.leveledUp, true);
  assert.equal(state.streak.count, 1);
  assert.equal(state.stats.spelling.rounds, 1);
  assert.equal(state.stats.spelling.perfect, 1);
  assert.ok(state.badges.includes('first_round'));
  assert.ok(state.badges.includes('perfect_spelling'));
  assert.ok(state.badges.includes('subs_100'));
  assert.ok(state.badges.includes('combo_6'));
});

test('applyRound completes matching quests and pays likes once', () => {
  const s0 = { ...defaultState(), quests: { day: 'd', items: [{ id: 'perfect_1', title: '', n: 1, reward: 40, done: 0, claimed: false }] } };
  const r1 = applyRound(s0, { mode: 'vocabulary', answers: perfect, day: 'd' });
  assert.equal(r1.summary.questsCompleted.length, 1);
  assert.equal(r1.state.likes, 10 + 40);
  const r2 = applyRound(r1.state, { mode: 'vocabulary', answers: perfect, day: 'd' });
  assert.equal(r2.summary.questsCompleted.length, 0);
  assert.equal(r2.state.likes, 50 + 10);
});

test('applyRound boss win counts wins and bonus', () => {
  const s0 = { ...defaultState(), quests: questsFor('x') };
  const { state, summary } = applyRound(s0, { mode: 'boss', answers: [{ correct: true }, { correct: false }], won: true, day: 'x' });
  assert.equal(state.stats.boss.wins, 1);
  assert.equal(summary.subs, 110);
  assert.ok(state.badges.includes('boss_first'));
});
