import { el, shuffle, pickMany, escapeHtml } from '../core/utils.js';
import { PICTURE_WORDS, byLevel, mediaHtml } from '../data/words.js';
import { prompt } from './common.js';

export default {
  id: 'memory', title: 'משחק זיכרון', desc: 'התאם/י מילה לתמונה', icon: '🧠', kind: 'single',
  create(level, api) {
    const pairs = level === 1 ? 4 : 6;
    const timeLimit = level >= 3 ? 90 : 0;
    const words = pickMany(byLevel(PICTURE_WORDS, level), pairs);
    return {
      next() {
        return {
          render(container) {
            const cards = shuffle([
              ...words.map((w) => ({ id: w.en, face: 'word', html: `<span class="en">${escapeHtml(w.en)}</span>` })),
              ...words.map((w) => ({ id: w.en, face: 'pic', html: mediaHtml(w, 'media sm') })),
            ]);
            let open = [];
            let matched = 0;
            let busy = false;
            const start = Date.now();
            const timer = el('div.timer', { 'aria-live': 'off' });
            let interval = 0;

            const tick = () => {
              const s = Math.floor((Date.now() - start) / 1000);
              timer.textContent = timeLimit ? `⏱️ ${Math.max(0, timeLimit - s)}` : `⏱️ ${s}`;
              if (timeLimit && s >= timeLimit) finish(false);
            };
            interval = setInterval(tick, 250);
            tick();
            api.onCleanup(() => clearInterval(interval));

            function finish(won = true) {
              clearInterval(interval);
              const elapsedSec = Math.round((Date.now() - start) / 1000);
              api.finish({ elapsedSec, won, text: won ? `סיימת ב-${elapsedSec} שניות!` : 'נגמר הזמן!' });
            }

            const grid = el('div.memory-grid', { style: `--cols:${pairs === 4 ? 4 : 4}` });
            cards.forEach((c) => {
              const btn = el('button.memory-card', { type: 'button', 'aria-label': 'קלף' });
              btn.innerHTML = `<div class="inner"><div class="front">❔</div><div class="back">${c.html}</div></div>`;
              btn.addEventListener('click', () => {
                if (busy || btn.classList.contains('flipped')) return;
                btn.classList.add('flipped');
                api.sfx('flip');
                open.push({ c, btn });
                if (open.length === 2) {
                  busy = true;
                  const [a, b] = open;
                  const ok = a.c.id === b.c.id && a.c.face !== b.c.face;
                  setTimeout(() => {
                    if (ok) {
                      a.btn.classList.add('matched'); b.btn.classList.add('matched');
                      a.btn.disabled = true; b.btn.disabled = true;
                      matched++;
                      api.speak(a.c.id);
                      api.answer(true, { text: `${a.c.id} ✔️`, silent: matched === pairs });
                      if (matched === pairs) finish(true);
                    } else {
                      a.btn.classList.remove('flipped'); b.btn.classList.remove('flipped');
                      api.answer(false, { text: 'לא תואם, נסה/י שוב' });
                    }
                    open = [];
                    busy = false;
                  }, ok ? 350 : 800);
                }
              });
              grid.append(btn);
            });

            container.append(prompt('מצא/י את הזוגות: מילה ↔ תמונה'), timer, grid);
          },
        };
      },
    };
  },
};
