import { el, shuffle, pickMany } from '../core/utils.js';
import { SPELLABLE, VOWELS, byLevel, hasPicture } from '../data/words.js';
import { prompt, pickFresh, mediaCard, speakButton } from './common.js';
import { wrongLetters } from './firstletter.js';

const vowelPositions = (word) => [...word].map((ch, i) => (VOWELS.includes(ch) ? i : -1)).filter((i) => i >= 0);

export default {
  id: 'missing', title: 'השלימו את האותיות', desc: 'איזו אות חסרה? כולל a e i o u', icon: '🧩', kind: 'questions',
  create(level, api) {
    const maxLen = level === 1 ? 5 : level === 2 ? 7 : 12;
    const pool = byLevel(SPELLABLE, level).filter((w) => w.en.length <= maxLen && vowelPositions(w.en).length);
    const used = new Set();
    return {
      next() {
        const target = pickFresh(pool, used);
        const w = target.en;
        let slots;
        if (level === 1) slots = [pickMany(vowelPositions(w), 1)[0]];
        else if (level === 2) slots = [Math.random() < 0.5 ? pickMany(vowelPositions(w), 1)[0] : Math.floor(Math.random() * w.length)];
        else slots = pickMany([...w].map((_, i) => i), 2).sort((a, b) => a - b);
        const needed = [...new Set(slots.map((s) => w[s]))];
        const options = level === 1
          ? VOWELS
          : shuffle([...needed, ...wrongLetters(needed[0], (level === 2 ? 4 : 6) - needed.length, true).filter((c) => !needed.includes(c))]);

        return {
          render(container) {
            const filled = [];
            let idx = 0;
            const wordEl = el('div.masked-word.en', { 'aria-label': 'המילה עם אותיות חסרות' });
            const draw = () => {
              wordEl.innerHTML = [...w].map((ch, i) => {
                const sIdx = slots.indexOf(i);
                if (sIdx === -1) return `<span>${ch}</span>`;
                const v = filled[sIdx];
                return `<span class="slot ${sIdx === idx ? 'active' : ''} ${v ? 'filled' : ''}">${v || '_'}</span>`;
              }).join('');
            };
            draw();

            const buttons = el('div.choices.letters', { style: `--cols:${Math.min(options.length, 5)}` });
            let locked = false;
            options.forEach((v) => {
              const b = el('button.choice.letter-tile', { type: 'button' }, v);
              b.addEventListener('click', () => {
                if (locked) return;
                filled[idx] = v;
                idx++;
                draw();
                api.sfx('tick');
                if (idx >= slots.length) {
                  locked = true;
                  const ok = slots.every((s, i) => w[s] === filled[i]);
                  wordEl.classList.add(ok ? 'is-correct' : 'is-wrong');
                  if (!ok) wordEl.innerHTML = [...w].map((ch, i) => `<span class="${slots.includes(i) ? 'slot filled reveal' : ''}">${ch}</span>`).join('');
                  buttons.querySelectorAll('button').forEach((x) => (x.disabled = true));
                  api.speak(w);
                  api.answer(ok, { word: w, text: `${w} — ${target.he}` });
                }
              });
              buttons.append(b);
            });

            container.append(
              prompt(slots.length > 1 ? 'השלימו את שתי האותיות החסרות' : 'איזו אות חסרה?', hasPicture(target) ? target.he : ''),
              mediaCard(target, { size: 'md' }),
              speakButton(() => api.speak(w), 'שמע את המילה'),
              wordEl,
              buttons,
            );
          },
        };
      },
    };
  },
};
