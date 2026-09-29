import { el, escapeHtml, shuffle, pickMany, pick } from '../core/utils.js';
import { mediaHtml, weighted, hasPicture, label } from '../data/words.js';

// Picks an item from pool avoiding `used` ids where possible, marks the pick as used.
// Priority words are weighted higher.
export function pickFresh(pool, used, key = (w) => w.en) {
  const fresh = pool.filter((w) => !used.has(key(w)));
  const source = fresh.length ? fresh : (used.clear(), pool);
  const item = pick(weighted(source));
  used.add(key(item));
  return item;
}

// Like pickMany but priority words are more likely to be included
export function pickManyWeighted(pool, count, accept = () => true) {
  const out = [];
  for (const w of shuffle(weighted(pool))) {
    if (out.length >= count) break;
    if (!out.includes(w) && accept(w, out)) out.push(w);
  }
  return out;
}

// Words that mean nearly the same thing must never be offered as competing answers
const SYNONYMS = [['hen', 'chicken'], ['clock', 'watch'], ['dad', 'father', 'man'], ['boy', 'kid', 'girl'], ['have', 'has'], ['mother', 'queen']];
export function confusable(a, b) {
  if (a.en === b.en || a.he === b.he) return true;
  return SYNONYMS.some((g) => g.includes(a.en) && g.includes(b.en));
}

export function distractorsFor(target, pool, count, { sameCategory = false } = {}) {
  let candidates = pool.filter((w) => !confusable(w, target));
  if (sameCategory) {
    const same = candidates.filter((w) => w.category === target.category);
    if (same.length >= count) candidates = same;
  }
  const out = [];
  for (const w of shuffle(candidates)) {
    if (out.length >= count) break;
    if (!out.some((o) => confusable(o, w))) out.push(w);
  }
  return out;
}

// Picture for the word; words without a picture show their Hebrew meaning instead (never the English answer)
export function mediaCard(word, { hint = '', size = 'lg' } = {}) {
  if (!hasPicture(word) && !word.digit) {
    return el('div.media-card', {}, el('div.he-word', {}, word.he));
  }
  return el('div.media-card', { html: `${mediaHtml(word, `media ${size}`)}${hint ? `<div class="hint">${escapeHtml(hint)}</div>` : ''}` });
}

export function speakButton(onSpeak, text = 'השמע') {
  return el('button.listen', { type: 'button', onclick: onSpeak, 'aria-label': text }, el('span.listen-ico', { 'aria-hidden': 'true' }, '🔊'), text);
}

// Grid of answer buttons; onPick(item, ok, btn). Locks all buttons after first pick and colors result.
export function choiceGrid(items, { render, onPick, correct, cols, cls = '' }) {
  const grid = el(`div.choices${cls ? ' ' + cls : ''}`, { role: 'group', style: cols ? `--cols:${cols}` : null });
  let locked = false;
  items.forEach((item) => {
    const btn = el('button.choice', { type: 'button' });
    const content = render(item);
    if (content instanceof Node) btn.append(content); else btn.innerHTML = content;
    btn.addEventListener('click', () => {
      if (locked) return;
      locked = true;
      const ok = correct(item);
      btn.classList.add(ok ? 'is-correct' : 'is-wrong');
      if (!ok) {
        const right = [...grid.children].find((b) => b !== btn && correct(b._item));
        right?.classList.add('is-correct', 'reveal');
      }
      grid.querySelectorAll('button').forEach((b) => (b.disabled = true));
      onPick(item, ok, btn);
    });
    btn._item = item;
    grid.append(btn);
  });
  return grid;
}

export const wordChoice = (w) => `<span class="en">${escapeHtml(label(w))}</span>`;
export const pictureChoice = (w) => `${mediaHtml(w, 'media md')}<span class="sr-only">${escapeHtml(w.en)}</span>`;
export const textChoice = (t) => `<span>${escapeHtml(t)}</span>`;
export const letterChoice = (ch) => `<span class="en letter-choice">${escapeHtml(ch.toUpperCase())}${escapeHtml(ch.toLowerCase())}</span>`;

export function prompt(text, sub = '') {
  return el('div.prompt', {}, el('h2', {}, text), sub ? el('p.sub', {}, sub) : null);
}

export { pickMany };
