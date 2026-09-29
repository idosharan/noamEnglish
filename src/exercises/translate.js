import { el, shuffle } from '../core/utils.js';
import { WORDS, EXAM_WORDS, byLevel, label } from '../data/words.js';
import { choiceGrid, wordChoice, textChoice, prompt, pickFresh, distractorsFor, speakButton } from './common.js';

export default {
  id: 'translate', title: 'מה פירוש המילה?', desc: 'קוראים מילה באנגלית ובוחרים בעברית', icon: '🔁', kind: 'questions',
  create(level, api) {
    const pool = level === 1 ? EXAM_WORDS.filter((w) => !w.digit) : byLevel(WORDS, level);
    const used = new Set();
    return {
      next() {
        const target = pickFresh(pool, used);
        const reverse = level >= 2 && Math.random() < (level === 2 ? 0.3 : 0.5);
        const items = shuffle([target, ...distractorsFor(target, pool, level === 1 ? 2 : 3)]);
        return {
          render(container) {
            if (reverse) {
              container.append(
                prompt('איך אומרים באנגלית?'),
                el('div.he-word.big', {}, target.he),
                choiceGrid(items, {
                  render: wordChoice,
                  cols: 2,
                  correct: (w) => w.en === target.en,
                  onPick: (w, ok) => {
                    api.speak(target.en);
                    api.answer(ok, { word: target.en, text: `${label(target)} = ${target.he}` });
                  },
                }),
              );
              return;
            }
            container.append(...[
              prompt('מה פירוש המילה?'),
              el('div.en-word.en', {}, label(target)),
              speakButton(() => api.speak(label(target)), 'שמע'),
              level >= 2 ? el('p.example.en', {}, target.example) : null,
              choiceGrid(items, {
                render: (w) => textChoice(w.he),
                cols: items.length > 3 ? 2 : 1,
                cls: items.length > 3 ? '' : 'stack',
                correct: (w) => w.en === target.en,
                onPick: (w, ok) => {
                  api.answer(ok, { word: target.en, text: `${label(target)} = ${target.he}` });
                },
              }),
            ].filter(Boolean));
            setTimeout(() => api.speak(label(target)), 250);
          },
        };
      },
    };
  },
};
