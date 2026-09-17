import { shuffle } from '../core/utils.js';
import { PICTURE_WORDS, byLevel } from '../data/words.js';
import { choiceGrid, wordChoice, prompt, pickFresh, distractorsFor, mediaCard, speakButton } from './common.js';

export default {
  id: 'vocabulary', title: 'כרטיסיות מילים', desc: 'תמונה → המילה באנגלית', icon: '🃏', kind: 'questions',
  create(level, api) {
    const pool = byLevel(PICTURE_WORDS, level);
    const used = new Set();
    return {
      next() {
        const target = pickFresh(pool, used);
        const count = level >= 3 ? 5 : 3;
        const items = shuffle([target, ...distractorsFor(target, pool, count, { sameCategory: level >= 2 })]);
        return {
          render(container) {
            container.append(
              prompt('איזו מילה באנגלית מתאימה לתמונה?'),
              mediaCard(target, { hint: level >= 3 ? '' : target.he }),
              speakButton(() => api.speak(target.example), 'משפט לדוגמה'),
              choiceGrid(items, {
                render: wordChoice,
                cols: level >= 3 ? 3 : 2,
                correct: (w) => w.en === target.en,
                onPick: (w, ok) => {
                  api.speak(target.en);
                  api.answer(ok, { text: ok ? `${target.en} = ${target.he}` : `התשובה: ${target.en} = ${target.he}` });
                },
              }),
            );
          },
        };
      },
    };
  },
};
