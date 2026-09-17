import { el, escapeHtml, shuffle, pickMany, pick } from '../core/utils.js';
import { mediaHtml } from '../data/words.js';

// Picks `count` items from pool avoiding `used` ids where possible, marks the pick as used
export function pickFresh(pool, used, key = (w) => w.en) {
  const fresh = pool.filter((w) => !used.has(key(w)));
  const source = fresh.length ? fresh : (used.clear(), pool);
  const item = pick(source);
  used.add(key(item));
  return item;
}

export function distractorsFor(target, pool, count, { sameCategory = false } = {}) {
  let candidates = pool.filter((w) => w.en !== target.en);
  if (sameCategory) {
    const same = candidates.filter((w) => w.category === target.category);
    if (same.length >= count) candidates = same;
  }
  return pickMany(candidates, count);
}

export function mediaCard(word, { hint = '', size = 'lg' } = {}) {
  return el('div.media-card', { html: `${mediaHtml(word, `media ${size}`)}${hint ? `<div class="hint">${escapeHtml(hint)}</div>` : ''}` });
}

export function speakButton(onSpeak, label = 'השמע') {
  return el('button.listen', { type: 'button', onclick: onSpeak, 'aria-label': label }, '🔊 ', label);
}

// Grid of answer buttons; onPick(item, btn). Locks all buttons after first pick and colors result.
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

export const wordChoice = (w) => `<span class="en">${escapeHtml(w.en)}</span>`;
export const pictureChoice = (w) => `${mediaHtml(w, 'media md')}<span class="sr-only">${escapeHtml(w.en)}</span>`;
export const textChoice = (t) => `<span>${escapeHtml(t)}</span>`;

export function shuffled(arr) { return shuffle(arr); }

export function prompt(text, sub = '') {
  return el('div.prompt', {}, el('h2', {}, text), sub ? el('p.sub', {}, sub) : null);
}
