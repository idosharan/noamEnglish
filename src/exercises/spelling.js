import { el, shuffle } from '../core/utils.js';
import { SPELLABLE, byLevel } from '../data/words.js';
import { prompt, pickFresh, mediaCard, speakButton } from './common.js';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

export default {
  id: 'spelling', title: 'איות', desc: 'הרכב/י את המילה מאותיות', icon: '✍️', kind: 'questions',
  create(level, api) {
    const pool = byLevel(SPELLABLE, level);
    const used = new Set();
    return {
      next() {
        const target = pickFresh(pool, used);
        return {
          render(container) {
            container.append(
              prompt(level >= 3 ? 'הקלד/י את המילה באנגלית' : 'הרכב/י את המילה מהאותיות'),
              mediaCard(target, { hint: target.he, size: 'md' }),
              speakButton(() => api.speak(target.en), 'השמע את המילה'),
            );
            if (level >= 3) renderTyping(container, target, api);
            else renderTiles(container, target, api, level === 2 ? 2 : 0);
            setTimeout(() => api.speak(target.en), 250);
          },
        };
      },
    };
  },
};

function renderTiles(container, target, api, extra) {
  const letters = [...target.en];
  const extras = shuffle([...ALPHABET].filter((c) => !letters.includes(c))).slice(0, extra);
  const tiles = shuffle([...letters, ...extras]);
  const answer = [];
  let locked = false;

  const slots = el('div.spell-slots.en', { 'aria-live': 'polite' });
  const drawSlots = () => {
    slots.innerHTML = letters.map((_, i) => `<span class="slot ${answer[i] ? 'filled' : ''}">${answer[i] || ''}</span>`).join('');
  };
  drawSlots();

  const bank = el('div.tile-bank');
  const tileEls = tiles.map((ch) => {
    const t = el('button.letter-tile', { type: 'button' }, ch);
    t.addEventListener('click', () => {
      if (locked || t.disabled) return;
      answer.push(ch);
      t.disabled = true;
      t.dataset.pos = answer.length - 1;
      api.sfx('tick');
      drawSlots();
      if (answer.length === letters.length) check();
    });
    return t;
  });
  bank.append(...tileEls);

  const undo = el('button.ghost.small', { type: 'button' }, '↩️ מחק אות');
  undo.addEventListener('click', () => {
    if (locked || !answer.length) return;
    answer.pop();
    const t = tileEls.find((x) => x.disabled && Number(x.dataset.pos) === answer.length);
    if (t) { t.disabled = false; delete t.dataset.pos; }
    drawSlots();
  });

  function check() {
    locked = true;
    const typed = answer.join('');
    const ok = typed === target.en;
    slots.classList.add(ok ? 'is-correct' : 'is-wrong');
    if (!ok) slots.innerHTML = letters.map((ch) => `<span class="slot filled reveal">${ch}</span>`).join('');
    api.speak(target.en);
    api.answer(ok, { text: ok ? `${target.en} — מושלם!` : `האיות הנכון: ${target.en}` });
  }

  container.append(slots, bank, undo);
}

function renderTyping(container, target, api) {
  const form = el('form.type-form', { autocomplete: 'off' });
  const input = el('input.type-input.en', {
    type: 'text', inputmode: 'latin', autocapitalize: 'off', autocorrect: 'off', spellcheck: false,
    placeholder: '_'.repeat(target.en.length), maxlength: target.en.length + 3, 'aria-label': 'הקלדת המילה',
  });
  const hint = el('div.type-hint.en', {}, `${target.en.length} אותיות · מתחילה ב-${target.en[0].toUpperCase()}`);
  const submit = el('button.primary', { type: 'submit' }, 'בדיקה ✅');
  form.append(input, hint, submit);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const typed = input.value.trim().toLowerCase();
    if (!typed) return;
    const ok = typed === target.en;
    input.disabled = true;
    submit.disabled = true;
    input.classList.add(ok ? 'is-correct' : 'is-wrong');
    if (!ok) input.value = target.en;
    api.speak(target.en);
    api.answer(ok, { text: ok ? `${target.en} — מושלם!` : `האיות הנכון: ${target.en}` });
  });
  container.append(form);
  setTimeout(() => input.focus(), 50);
}
