import { el, shuffle, pick } from '../core/utils.js';
import { PICTURE_WORDS } from '../data/words.js';
import { choiceGrid, letterChoice, prompt, pickFresh } from './common.js';
import { wrongLetters } from './firstletter.js';

const LETTERS = [...'abcdefghijklmnopqrstuvwyz'].map((c) => ({ en: c }));
const exampleFor = (c) => {
  const opts = PICTURE_WORDS.filter((w) => w.en[0] === c && !/^(ch|sh|th)/.test(w.en));
  return opts.length ? pick(opts) : null;
};

export default {
  id: 'hearletter', title: 'שומעים אות', desc: 'האזינו ובחרו את האות הנכונה', icon: '👂', kind: 'questions',
  create(level, api) {
    const used = new Set();
    return {
      next() {
        const letter = pickFresh(LETTERS, used).en;
        const example = level === 1 ? exampleFor(letter) : null;
        const items = shuffle([letter, ...wrongLetters(letter, level >= 3 ? 5 : 3, level >= 2)]);
        const say = () => api.speakLetter(letter, example?.en);
        return {
          render(container) {
            container.append(
              prompt('האזינו ובחרו את האות ששמעתם', example ? `רמז: כמו במילה ${example.he}` : 'לחיצה על הרמקול משמיעה שוב'),
              el('button.listen.huge', { type: 'button', 'aria-label': 'השמע שוב', onclick: say }, '🔊'),
              choiceGrid(items, {
                render: level >= 3 ? (c) => `<span class="en letter-choice">${c}</span>` : letterChoice,
                cols: items.length > 4 ? 3 : 2,
                cls: 'letters',
                correct: (c) => c === letter,
                onPick: (c, ok) => {
                  api.answer(ok, { word: `letter:${letter}`, text: ok ? `נכון! ${letter.toUpperCase()}${letter}` : `שמעת את האות ${letter.toUpperCase()}${letter}` });
                },
              }),
            );
            setTimeout(say, 300);
          },
        };
      },
    };
  },
};
