import { el, pick } from '../core/utils.js';
import letters from './letters.js';
import vocabulary from './vocabulary.js';
import vowels from './vowels.js';
import sentences from './sentences.js';
import spelling from './spelling.js';
import listening from './listening.js';

const BOSSES = [
  { name: 'Glitch King', emoji: '👾', he: 'מלך הגליץ\'' },
  { name: 'Lag Dragon', emoji: '🐉', he: 'דרקון הלאג' },
  { name: 'Dislike Bot', emoji: '🤖', he: 'רובוט הדיסלייקים' },
  { name: 'Spam Ghost', emoji: '👻', he: 'רוח הספאם' },
];

export default {
  id: 'boss', title: 'Boss Battle', desc: '60 שניות · שאלות מעורבות · קומבו', icon: '👾', kind: 'timed',
  create(level, api) {
    const boss = pick(BOSSES);
    const bossMaxHp = 8 + level * 2;
    const timeLimit = 60;
    const subLevel = Math.min(level, 2); // keep sub-questions quick enough for the clock

    return {
      next() {
        return {
          render(container) {
            let bossHp = bossMaxHp;
            let playerHp = 3;
            let combo = 0;
            let ended = false;
            const start = Date.now();

            const hud = el('div.boss-hud');
            const bossBar = el('div.hp-bar.boss', { role: 'progressbar', 'aria-label': 'חיי הבוס' }, el('div.fill'));
            const playerHearts = el('div.hearts', { 'aria-label': 'החיים שלך' });
            const timer = el('div.timer.big');
            const comboEl = el('div.combo-badge', { 'aria-live': 'off' });
            hud.append(
              el('div.boss-title', {}, el('span.boss-emoji', {}, boss.emoji), el('div', {}, el('strong.en', {}, boss.name), el('small', {}, boss.he))),
              bossBar, el('div.hud-row', {}, playerHearts, timer, comboEl),
            );
            const qArea = el('div.boss-question');
            container.append(hud, qArea);

            function drawHud() {
              bossBar.querySelector('.fill').style.width = `${(bossHp / bossMaxHp) * 100}%`;
              bossBar.setAttribute('aria-valuenow', bossHp);
              playerHearts.textContent = '❤️'.repeat(playerHp) + '🖤'.repeat(3 - playerHp);
              comboEl.textContent = combo >= 3 ? `🔥 x${combo >= 6 ? 3 : 2} קומבו ${combo}` : combo > 0 ? `רצף ${combo}` : '';
            }

            const interval = setInterval(() => {
              const left = timeLimit - Math.floor((Date.now() - start) / 1000);
              timer.textContent = `⏱️ ${Math.max(0, left)}`;
              timer.classList.toggle('danger', left <= 10);
              if (left <= 10 && left > 0) api.sfx('tick');
              if (left <= 0) end(false);
            }, 500);
            api.onCleanup(() => clearInterval(interval));

            function end(won) {
              if (ended) return;
              ended = true;
              clearInterval(interval);
              hud.classList.add(won ? 'won' : 'lost');
              api.finish({ won, elapsedSec: Math.round((Date.now() - start) / 1000), text: won ? `ניצחת את ${boss.he}!` : `${boss.he} ניצח הפעם…` });
            }

            const subApi = {
              ...api,
              answer(correct, opts = {}) {
                if (ended) return;
                if (correct) {
                  combo++;
                  bossHp -= 1;
                  hud.classList.add('shake');
                  setTimeout(() => hud.classList.remove('shake'), 400);
                  api.sfx('hit');
                } else {
                  combo = 0;
                  playerHp -= 1;
                }
                drawHud();
                api.answer(correct, { ...opts, silent: true });
                if (bossHp <= 0) return end(true);
                if (playerHp <= 0) return end(false);
                setTimeout(nextQuestion, correct ? 500 : 900);
              },
            };
            const gens = [letters, vocabulary, vowels, sentences, spelling, listening].map((m) => m.create(subLevel, subApi));

            function nextQuestion() {
              if (ended) return;
              qArea.innerHTML = '';
              qArea.classList.remove('enter');
              void qArea.offsetWidth;
              qArea.classList.add('enter');
              pick(gens).next().render(qArea);
            }

            drawHud();
            nextQuestion();
          },
        };
      },
    };
  },
};
