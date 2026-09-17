import { el, shuffle, pick } from '../core/utils.js';
import { SENTENCES, BUILDER_DISTRACTORS } from '../data/sentences.js';
import { prompt, pickFresh, speakButton } from './common.js';

const tokenize = (s) => s.replace(/[.!?]$/, '').split(' ');

export default {
  id: 'builder', title: 'בניית משפט', desc: 'סדר/י את המילים בסדר הנכון', icon: '🧱', kind: 'questions',
  create(level, api) {
    const maxWords = level === 1 ? 5 : level === 2 ? 6 : 9;
    let pool = SENTENCES.filter((s) => s.level <= level && tokenize(s.en).length <= maxWords);
    if (pool.length < 6) pool = SENTENCES.filter((s) => tokenize(s.en).length <= maxWords);
    const used = new Set();

    return {
      next() {
        const target = pickFresh(pool, used, (s) => s.en);
        const words = tokenize(target.en);
        const punct = target.en.match(/[.!?]$/)?.[0] || '.';
        const extras = level >= 3 ? [pick(BUILDER_DISTRACTORS.filter((d) => !words.map((w) => w.toLowerCase()).includes(d)))] : [];
        const bankWords = shuffle([...words, ...extras]);

        return {
          render(container) {
            const answer = [];
            let locked = false;
            const line = el('div.build-line.en', { 'aria-live': 'polite' });
            const bank = el('div.tile-bank.en');
            const check = el('button.primary', { type: 'button', disabled: true }, 'בדיקה ✅');

            const chips = bankWords.map((w, i) => {
              const c = el('button.word-chip', { type: 'button', dataset: { i } }, w);
              c.addEventListener('click', () => {
                if (locked || c.disabled) return;
                answer.push({ w, i });
                c.disabled = true;
                api.sfx('tick');
                draw();
              });
              return c;
            });
            bank.append(...chips);

            function draw() {
              line.innerHTML = '';
              if (!answer.length) line.append(el('span.placeholder', {}, 'לחץ/י על המילים לפי הסדר…'));
              answer.forEach((a, idx) => {
                const c = el('button.word-chip.placed', { type: 'button' }, a.w);
                c.addEventListener('click', () => {
                  if (locked) return;
                  answer.splice(idx, 1);
                  chips[a.i].disabled = false;
                  draw();
                });
                line.append(c);
              });
              check.disabled = answer.length < words.length;
            }
            draw();

            check.addEventListener('click', () => {
              if (locked) return;
              locked = true;
              const built = answer.map((a) => a.w).join(' ');
              const ok = built === words.join(' ');
              line.classList.add(ok ? 'is-correct' : 'is-wrong');
              line.querySelectorAll('button').forEach((b) => (b.disabled = true));
              chips.forEach((c) => (c.disabled = true));
              check.disabled = true;
              if (!ok) line.append(el('div.reveal-line.en', {}, target.en));
              api.speak(target.en);
              api.answer(ok, { text: ok ? target.he : `המשפט הנכון: ${target.en}` });
            });

            container.append(
              prompt('בנה/י את המשפט באנגלית', target.he),
              speakButton(() => api.speak(target.en), 'רמז: השמע את המשפט'),
              line,
              bank,
              el('div.actions', {}, check, el('span.punct.en', {}, punct)),
            );
          },
        };
      },
    };
  },
};
