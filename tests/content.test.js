import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WORDS, EXAM_WORDS, NUMBER_WORDS, DIGRAPH_WORDS, PICTURE_WORDS, digraphOf, shortVowel, hasPicture } from '../src/data/words.js';
import { PASSAGES } from '../src/data/reading.js';
import { MODES, WORLDS, roundLength } from '../src/exercises/index.js';
import { makeBoard } from '../src/exercises/sort.js';
import { EXAM_LENGTH } from '../src/exercises/exam.js';
import { recordWords, defaultState } from '../src/core/store.js';

// Everything the exam sheet lists
const PDF_WORDS = ['milk', 'run', 'sing', 'mad', 'test', 'fat', 'cut', 'tall', 'bed', 'fast', 'bag', 'not', 'desk', 'swim', 'big', 'egg',
  'mother', 'cow', 'boy', 'small', 'have', 'has', 'dog', 'name', 'cat', 'chicken', 'sad', 'the',
  'chair', 'cheese', 'ship', 'fish', 'short', 'this', 'birthday', 'teeth', 'three'];

test('word bank covers every word from the exam sheet', () => {
  for (const en of PDF_WORDS) {
    const w = WORDS.find((x) => x.en === en);
    assert.ok(w, `missing ${en}`);
    assert.ok(w.priority, `${en} should be a priority word`);
    assert.ok(w.he, `${en} has no Hebrew`);
  }
  assert.deepEqual(NUMBER_WORDS.map((w) => w.digit), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(new Set(WORDS.map((w) => w.en)).size, WORDS.length, 'duplicate words');
});

test('picture words really have a picture; no-picture words are excluded', () => {
  assert.ok(PICTURE_WORDS.every(hasPicture));
  assert.ok(!PICTURE_WORDS.some((w) => ['fat', 'tall', 'the', 'not', 'desk'].includes(w.en)));
  assert.ok(EXAM_WORDS.length >= 45);
});

test('digraph and short-vowel helpers', () => {
  const by = (en) => WORDS.find((w) => w.en === en);
  assert.equal(digraphOf(by('chair')), 'ch');
  assert.equal(digraphOf(by('fish')), 'sh');
  assert.equal(digraphOf(by('teeth')), 'th');
  assert.equal(digraphOf(by('dog')), null);
  for (const d of ['ch', 'sh', 'th']) assert.ok(DIGRAPH_WORDS.filter((w) => digraphOf(w) === d && hasPicture(w)).length >= 3, d);
  assert.equal(shortVowel(by('cat')), 'a');
  assert.equal(shortVowel(by('the')), null);
  assert.equal(shortVowel(by('name')), null);
});

test('reading passages are well formed', () => {
  for (const p of PASSAGES) {
    assert.ok(p.lines.length >= 4, p.id);
    assert.ok(p.yesNo.length >= 2, p.id);
    for (const q of p.mcq) assert.ok(q.answer >= 0 && q.answer < q.options.length, `${p.id}: ${q.q}`);
  }
  for (const lv of [1, 2, 3]) assert.ok(PASSAGES.filter((p) => p.level <= lv).length >= 2);
});

test('sort boards are consistent', () => {
  for (let i = 0; i < 200; i++) {
    const level = (i % 3) + 1;
    const b = makeBoard(level);
    assert.equal(b.groups.length, level >= 3 ? 3 : 2);
    const ids = new Set(b.groups.map((g) => g.id));
    assert.ok(b.words.every((x) => ids.has(x.group)));
    assert.equal(new Set(b.words.map((x) => x.w.en)).size, b.words.length);
    for (const g of b.groups) assert.ok(b.words.filter((x) => x.group === g.id).length >= 2, `${b.type} ${g.id}`);
  }
});

test('every mode generates questions at every level', () => {
  const api = { level: 1, speak() {}, speakList() {}, speakLetter() {}, sfx() {}, onCleanup() {}, answer() {}, finish() {} };
  assert.equal(MODES.length, new Set(MODES.map((m) => m.id)).size);
  for (const mode of MODES) {
    for (const level of [1, 2, 3]) {
      const gen = mode.create(level, { ...api, level });
      for (let i = 0; i < 40; i++) {
        const q = gen.next();
        assert.equal(typeof q.render, 'function', `${mode.id} L${level}`);
      }
    }
  }
  assert.equal(WORLDS.flatMap((w) => w.modes).length + 2, MODES.length);
});

test('mock exam has 20 questions (badge exam_90 expects 18/20)', () => {
  assert.equal(EXAM_LENGTH, 20);
  assert.equal(roundLength(MODES.find((m) => m.id === 'exam')), 20);
});

test('recordWords tracks right and wrong per word', () => {
  let s = recordWords(defaultState(), [{ correct: true, word: 'cat' }, { correct: false, word: 'cat' }, { correct: true }], '2026-10-01');
  s = recordWords(s, [{ correct: true, word: 'dog' }], '2026-10-02');
  assert.deepEqual(s.words.cat, { c: 1, w: 1, last: '2026-10-01', lastOk: false });
  assert.equal(s.words.dog.c, 1);
  assert.equal(Object.keys(s.words).length, 2);
});
