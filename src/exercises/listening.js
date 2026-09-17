import { el, shuffle } from '../core/utils.js';
import { PICTURE_WORDS, byLevel } from '../data/words.js';
import { choiceGrid, pictureChoice, prompt, pickFresh, distractorsFor } from './common.js';

export default {
  id: 'listening', title: 'האזנה', desc: 'שמע/י מילה ובחר/י תמונה', icon: '🎧', kind: 'questions',
  create(level, api) {
    const pool = byLevel(PICTURE_WORDS, level);
    const used = new Set();
    return {
      next() {
        const target = pickFresh(pool, used);
        const count = level >= 2 ? 5 : 3;
        const items = shuffle([target, ...distractorsFor(target, pool, count, { sameCategory: level >= 3 })]);
        return {
          render(container) {
            const big = el('button.listen.huge', { type: 'button', 'aria-label': 'השמע שוב', onclick: () => api.speak(target.en) }, '🔊');
            container.append(
              prompt('הקשב/י ובחר/י את התמונה המתאימה', 'לחיצה על הרמקול משמיעה שוב'),
              big,
              choiceGrid(items, {
                render: pictureChoice,
                cols: 3,
                correct: (w) => w.en === target.en,
                onPick: (w, ok) => {
                  api.answer(ok, { text: ok ? `${target.en} = ${target.he}` : `שמעת: ${target.en} = ${target.he}` });
                },
              }),
            );
            setTimeout(() => api.speak(target.en), 300);
          },
        };
      },
    };
  },
};
