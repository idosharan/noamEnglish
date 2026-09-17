import { el, shuffle, pickMany } from '../core/utils.js';
import { SENTENCES } from '../data/sentences.js';
import { choiceGrid, textChoice, prompt, pickFresh, speakButton } from './common.js';

export default {
  id: 'sentences', title: 'תרגום משפטים', desc: 'קרא/י והבן/י משפט קצר', icon: '💬', kind: 'questions',
  create(level, api) {
    const pool = SENTENCES.filter((s) => s.level <= level);
    const used = new Set();
    return {
      next() {
        const target = pickFresh(pool, used, (s) => s.en);
        const count = level >= 2 ? 3 : 2;
        const items = shuffle([target.he, ...pickMany(target.distractors, count)]);
        const listenOnly = level >= 3 && Math.random() < 0.5;
        return {
          render(container) {
            const sentenceEl = el('div.sentence-card.en', {}, target.en);
            if (listenOnly) sentenceEl.classList.add('hidden-text');
            container.append(
              prompt(listenOnly ? 'הקשב/י למשפט ובחר/י את התרגום' : 'מה פירוש המשפט?'),
              speakButton(() => api.speak(target.en), 'השמע את המשפט'),
              sentenceEl,
              listenOnly ? el('button.ghost.small', { type: 'button', onclick: () => sentenceEl.classList.remove('hidden-text') }, '👀 הצג את המשפט') : null,
              choiceGrid(items, {
                render: textChoice,
                cols: 1,
                cls: 'stack',
                correct: (t) => t === target.he,
                onPick: (t, ok) => {
                  sentenceEl.classList.remove('hidden-text');
                  api.answer(ok, { text: ok ? 'הבנת מצוין!' : `התרגום: ${target.he}` });
                },
              }),
            );
            if (listenOnly) setTimeout(() => api.speak(target.en), 300);
          },
        };
      },
    };
  },
};
