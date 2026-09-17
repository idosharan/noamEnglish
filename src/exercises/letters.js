import { el, pick, shuffle } from '../core/utils.js';
import { PICTURE_WORDS, byLevel } from '../data/words.js';
import { choiceGrid, pictureChoice, prompt, pickFresh, speakButton } from './common.js';

const LOOKALIKE = { b: 'dp', d: 'bp', p: 'bdq', m: 'n', n: 'm', c: 'o', o: 'c', e: 'a', a: 'e', i: 'l', l: 'i', h: 'n', s: 'z', t: 'f', g: 'q', w: 'v' };

export default {
  id: 'letters', title: 'זיהוי אותיות', desc: 'איזו תמונה מתחילה באות?', icon: '🔤', kind: 'questions',
  create(level, api) {
    const pool = byLevel(PICTURE_WORDS, level).filter((w) => /^[a-z]/i.test(w.en));
    const used = new Set();
    const first = (w) => w.en[0].toLowerCase();
    const last = (w) => w.en.replace(/[^a-z]/gi, '').slice(-1).toLowerCase();

    return {
      next() {
        const optionCount = level >= 3 ? 6 : 4;
        const useLast = level >= 3 && Math.random() < 0.4;
        const getter = useLast ? last : first;

        let target = pickFresh(pool, used);
        let wrongPool = pool.filter((w) => getter(w) !== getter(target));
        // level 2: prefer distractors starting with lookalike letters
        if (level === 2) {
          const look = LOOKALIKE[first(target)] || '';
          const similar = wrongPool.filter((w) => look.includes(first(w)));
          if (similar.length >= 2) wrongPool = [...similar, ...shuffle(wrongPool.filter((w) => !similar.includes(w))).slice(0, 4)];
        }
        const letter = getter(target).toUpperCase();
        const wrongs = shuffle(wrongPool).slice(0, optionCount - 1);
        const items = shuffle([target, ...wrongs]);

        return {
          render(container) {
            container.append(
              prompt(useLast ? `איזו תמונה מסתיימת באות ${letter}?` : `איזו תמונה מתחילה באות ${letter}?`),
              el('div.big-letter.en', { 'aria-hidden': 'true' }, letter, el('small', {}, letter.toLowerCase())),
              speakButton(() => api.speak(letter), 'שם האות'),
              choiceGrid(items, {
                render: pictureChoice,
                correct: (w) => getter(w) === letter.toLowerCase(),
                onPick: (w, ok) => {
                  api.speak(w.en);
                  api.answer(ok, { text: ok ? `${w.en} — ${w.he}` : `${target.en} — ${target.he}` });
                },
              }),
            );
          },
        };
      },
    };
  },
};
