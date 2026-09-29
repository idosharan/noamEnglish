import { el, shuffle, pick, pickMany } from '../core/utils.js';
import { NUMBER_WORDS } from '../data/words.js';
import { choiceGrid, prompt, pickFresh } from './common.js';
import { renderTiles, renderTyping } from './spelling.js';

const COUNT_EMOJI = ['🐟', '🥚', '🐔', '🐄', '🐶', '🐱', '🧀', '🚢'];
const digitChoice = (w) => `<span class="digit-choice">${w.digit}</span>`;
const wordChoice = (w) => `<span class="en">${w.en}</span>`;

// Neighbouring numbers make better distractors (six / seven)
function wrongNumbers(target, count) {
  const near = NUMBER_WORDS.filter((w) => w !== target && Math.abs(w.digit - target.digit) <= 3);
  const far = NUMBER_WORDS.filter((w) => w !== target && !near.includes(w));
  return [...pickMany(near, count), ...pickMany(far, count)].slice(0, count);
}

export default {
  id: 'numbers', title: 'מספרים 1-12', desc: 'שומעים, קוראים וכותבים מספרים', icon: '🔟', kind: 'questions',
  create(level, api) {
    const used = new Set();
    const types = level === 1 ? ['hear', 'toWord', 'toDigit'] : level === 2 ? ['hear', 'toWord', 'toDigit', 'count', 'tiles'] : ['hear', 'toWord', 'count', 'tiles', 'type', 'type'];
    return {
      next() {
        const target = pickFresh(NUMBER_WORDS, used);
        const type = pick(types);
        const items = shuffle([target, ...wrongNumbers(target, 3)]);
        const answer = (ok) => api.answer(ok, { word: target.en, text: `${target.digit} = ${target.en} = ${target.he}` });
        const onPick = (w, ok) => { api.speak(target.en); answer(ok); };
        return {
          render(container) {
            if (type === 'hear') {
              const say = () => api.speak(target.en);
              container.append(
                prompt('איזה מספר שמעתם?'),
                el('button.listen.huge', { type: 'button', 'aria-label': 'השמע שוב', onclick: say }, '🔊'),
                choiceGrid(items, { render: digitChoice, cols: 4, cls: 'digits', correct: (w) => w === target, onPick: (w, ok) => answer(ok) }),
              );
              setTimeout(say, 300);
            } else if (type === 'toWord') {
              container.append(
                prompt('איך כותבים את המספר באנגלית?'),
                el('div.media-card', {}, el('span.media.lg.digit', {}, String(target.digit))),
                choiceGrid(items, { render: wordChoice, cols: 2, correct: (w) => w === target, onPick }),
              );
            } else if (type === 'toDigit') {
              container.append(
                prompt('איזה מספר כתוב כאן?'),
                el('div.en-word.en', {}, target.en),
                choiceGrid(items, { render: digitChoice, cols: 4, cls: 'digits', correct: (w) => w === target, onPick }),
              );
            } else if (type === 'count') {
              const emoji = pick(COUNT_EMOJI);
              container.append(
                prompt('כמה יש? בחרו את המילה'),
                el('div.count-box', { 'aria-label': `${target.digit} פריטים` }, ...Array.from({ length: target.digit }, () => el('span', {}, emoji))),
                choiceGrid(items, { render: wordChoice, cols: 2, correct: (w) => w === target, onPick }),
              );
            } else {
              container.append(
                prompt(type === 'type' ? 'כתבו את המספר באנגלית' : 'בנו את המילה של המספר'),
                el('div.media-card', {}, el('span.media.md.digit', {}, String(target.digit))),
              );
              if (type === 'type') renderTyping(container, target, api);
              else renderTiles(container, target, api, 2);
            }
          },
        };
      },
    };
  },
};
