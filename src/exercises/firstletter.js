import { el, shuffle } from '../core/utils.js';
import { PICTURE_WORDS, byLevel } from '../data/words.js';
import { choiceGrid, letterChoice, prompt, pickFresh, mediaCard, speakButton } from './common.js';

export const LOOKALIKE = { b: 'dpv', d: 'bpq', p: 'bdq', q: 'pdg', m: 'nw', n: 'mh', c: 'oks', o: 'ca', e: 'ai', a: 'eo', i: 'lej', l: 'it', h: 'nk', s: 'zc', t: 'fl', g: 'jq', w: 'mv', v: 'wf', f: 'tv', k: 'ch', j: 'gy', r: 'nl', u: 'vo', y: 'jv', z: 'sx', x: 'zk' };
const ABC = 'abcdefghijklmnopqrstuvwxyz';

// Distinct wrong letters, lookalikes first when `tricky`
export function wrongLetters(letter, count, tricky) {
  const look = tricky ? shuffle([...(LOOKALIKE[letter] || '')]) : [];
  const rest = shuffle([...ABC].filter((c) => c !== letter && !look.includes(c)));
  return [...look, ...rest].slice(0, count);
}

export default {
  id: 'firstletter', title: 'האות הראשונה', desc: 'הקיפו את האות הראשונה של התמונה', icon: '🎯', kind: 'questions',
  create(level, api) {
    // ch / sh / th words start with a two-letter sound — confusing for "first letter" at the easy levels
    const pool = byLevel(PICTURE_WORDS, level).filter((w) => /^[a-z]/.test(w.en) && (level >= 3 || !/^(ch|sh|th)/.test(w.en)));
    const used = new Set();
    return {
      next() {
        const target = pickFresh(pool, used);
        const letter = target.en[0];
        const count = level === 1 ? 2 : 3;
        const items = shuffle([letter, ...wrongLetters(letter, count, level >= 2)]);
        return {
          render(container) {
            container.append(
              prompt('מה האות הראשונה של המילה?', level === 1 ? target.he : ''),
              mediaCard(target),
              speakButton(() => api.speak(target.en), 'שמע את המילה'),
              choiceGrid(items, {
                render: letterChoice,
                cols: items.length,
                cls: 'letters',
                correct: (c) => c === letter,
                onPick: (c, ok) => {
                  api.speak(target.en);
                  api.answer(ok, { word: target.en, text: `${target.en} מתחילה ב-${letter.toUpperCase()}` });
                },
              }),
            );
            if (level === 1) setTimeout(() => api.speak(target.en), 300);
          },
        };
      },
    };
  },
};
