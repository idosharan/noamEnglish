import { el, shuffle, pickMany } from '../core/utils.js';
import { SPELLABLE, VOWELS, byLevel } from '../data/words.js';
import { prompt, pickFresh, mediaCard, speakButton } from './common.js';

function vowelPositions(word) {
  return [...word].map((ch, i) => (VOWELS.includes(ch) ? i : -1)).filter((i) => i >= 0);
}

export default {
  id: 'vowels', title: 'השלמת תנועות', desc: 'איזו אות חסרה במילה?', icon: '🅰️', kind: 'questions',
  create(level, api) {
    const pool = byLevel(SPELLABLE, level).filter((w) => vowelPositions(w.en).length >= (level >= 3 ? 2 : 1));
    const used = new Set();
    return {
      next() {
        const target = pickFresh(pool, used);
        const positions = vowelPositions(target.en);
        const slots = level >= 3 ? pickMany(positions, 2).sort((a, b) => a - b) : [positions[Math.floor(Math.random() * positions.length)]];
        const options = level >= 2 ? VOWELS : ['a', 'e', 'i', 'o'];
        const optionList = shuffle(options.filter((v) => v !== target.en[slots[0]]).slice(0, options.length - 1).concat(target.en[slots[0]]));
        // ensure every slot's answer is present
        for (const s of slots) if (!optionList.includes(target.en[s])) optionList.push(target.en[s]);

        return {
          render(container) {
            const filled = [];
            let idx = 0;
            const wordEl = el('div.masked-word.en', { 'aria-label': 'המילה עם אותיות חסרות' });
            const draw = () => {
              wordEl.innerHTML = [...target.en].map((ch, i) => {
                const sIdx = slots.indexOf(i);
                if (sIdx === -1) return `<span>${ch}</span>`;
                const v = filled[sIdx];
                return `<span class="slot ${sIdx === idx ? 'active' : ''} ${v ? 'filled' : ''}">${v || '_'}</span>`;
              }).join('');
            };
            draw();

            const buttons = el('div.choices.vowels', { style: `--cols:${optionList.length}` });
            let locked = false;
            optionList.forEach((v) => {
              const b = el('button.choice.letter-tile', { type: 'button' }, v.toUpperCase());
              b.addEventListener('click', () => {
                if (locked) return;
                filled[idx] = v;
                idx++;
                draw();
                api.sfx('tick');
                if (idx >= slots.length) {
                  locked = true;
                  const ok = slots.every((s, i) => target.en[s] === filled[i]);
                  wordEl.classList.add(ok ? 'is-correct' : 'is-wrong');
                  if (!ok) wordEl.innerHTML = [...target.en].map((ch, i) => `<span class="${slots.includes(i) ? 'slot filled reveal' : ''}">${ch}</span>`).join('');
                  buttons.querySelectorAll('button').forEach((x) => (x.disabled = true));
                  api.speak(target.en);
                  api.answer(ok, { text: `${target.en} — ${target.he}` });
                }
              });
              buttons.append(b);
            });

            container.append(
              prompt(slots.length > 1 ? 'השלם/י את שתי האותיות החסרות' : 'איזו אות חסרה?'),
              mediaCard(target, { hint: target.he, size: 'md' }),
              speakButton(() => api.speak(target.en), 'השמע את המילה'),
              wordEl,
              buttons,
            );
          },
        };
      },
    };
  },
};
