import { el, shuffle } from '../core/utils.js';
import { PICTURE_WORDS, EXAM_WORDS, byLevel, hasPicture, mediaHtml, label } from '../data/words.js';
import { prompt, pickManyWeighted, confusable } from './common.js';

export default {
  id: 'order', title: 'האזינו ומספרו', desc: 'שומעים מילים ומסמנים לפי הסדר', icon: '🔢', kind: 'questions', count: 6,
  create(level, api) {
    const n = level + 2;
    // level 1 shows pictures, higher levels show only the written words
    const pool = level === 1 ? byLevel(PICTURE_WORDS, 1) : byLevel([...EXAM_WORDS, ...PICTURE_WORDS], level).filter((w, i, a) => a.indexOf(w) === i);
    return {
      next() {
        const words = pickManyWeighted(pool, n, (w, out) => !out.some((o) => confusable(o, w)));
        const cards = shuffle(words);
        return {
          render(container) {
            const picked = [];
            let locked = false;
            const play = () => api.speakList(words.map((w) => label(w)), { gap: level === 3 ? 450 : 800 });

            const grid = el('div.order-grid', { style: `--cols:${n > 4 ? 3 : 2}` });
            const cardEls = cards.map((w) => {
              const b = el('button.order-card', { type: 'button' },
                el('span.order-num', { 'aria-hidden': 'true' }),
                level === 1 && hasPicture(w) ? el('span', { html: mediaHtml(w, 'media sm') }) : null,
                el('span.en.order-word', {}, label(w)),
              );
              b.addEventListener('click', () => {
                if (locked || picked.includes(w)) return;
                picked.push(w);
                api.sfx('tick');
                draw();
                if (picked.length === n) check();
              });
              b._w = w;
              grid.append(b);
              return b;
            });

            function draw() {
              cardEls.forEach((b) => {
                const i = picked.indexOf(b._w);
                b.classList.toggle('numbered', i >= 0);
                b.querySelector('.order-num').textContent = i >= 0 ? String(i + 1) : '';
              });
            }

            function check() {
              locked = true;
              const ok = picked.every((w, i) => w === words[i]);
              cardEls.forEach((b) => {
                const right = words.indexOf(b._w);
                b.disabled = true;
                b.classList.add(picked[right] === b._w ? 'is-correct' : 'is-wrong');
                b.querySelector('.order-num').textContent = String(right + 1);
              });
              api.answer(ok, { text: ok ? 'בדיוק לפי הסדר!' : `הסדר הנכון: ${words.map((w) => label(w)).join(' → ')}` });
            }

            const undo = el('button.ghost.small', { type: 'button', onclick: () => { if (!locked && picked.length) { picked.pop(); draw(); } } }, '↩ ביטול');
            container.append(
              prompt('האזינו ומספרו את המילים לפי הסדר', 'לחצו על המילים לפי הסדר ששמעתם'),
              el('button.listen.huge', { type: 'button', 'aria-label': 'השמע שוב', onclick: play }, '🔊'),
              grid,
              undo,
            );
            setTimeout(play, 400);
          },
        };
      },
    };
  },
};
