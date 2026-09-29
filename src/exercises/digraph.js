import { el, shuffle, pick } from '../core/utils.js';
import { DIGRAPH_WORDS, DIGRAPHS, DIGRAPH_HE, digraphOf, hasPicture, byLevel, label } from '../data/words.js';
import { choiceGrid, pictureChoice, prompt, pickFresh, mediaCard, speakButton } from './common.js';

// "__ip" – the word with its ch/sh/th hidden
export function maskDigraph(w) {
  const d = digraphOf(w);
  const text = label(w);
  const i = text.toLowerCase().indexOf(d);
  return `${text.slice(0, i)}<span class="slot filled">_</span><span class="slot filled">_</span>${text.slice(i + 2)}`;
}

const soundChoice = (d) => `<span class="en digraph">${d}</span><small>${DIGRAPH_HE[d]}</small>`;

export default {
  id: 'digraph', title: 'ch · sh · th', desc: 'התאימו את הצליל לתמונה', icon: '🔊', kind: 'questions',
  create(level, api) {
    const pool = byLevel(DIGRAPH_WORDS, level).filter((w) => level >= 2 || hasPicture(w));
    const pictured = DIGRAPH_WORDS.filter((w) => hasPicture(w) && w.level <= Math.max(level, 1));
    const used = new Set();
    return {
      next() {
        // level 2+: sometimes reversed — hear the sound, find the picture
        if (level >= 2 && Math.random() < 0.4) {
          const sound = pick(DIGRAPHS);
          const target = pickFresh(pictured.filter((w) => digraphOf(w) === sound), used);
          const others = DIGRAPHS.filter((d) => d !== sound).map((d) => pick(pictured.filter((w) => digraphOf(w) === d)));
          const items = shuffle([target, ...others]);
          return {
            render(container) {
              container.append(
                prompt(`באיזו תמונה שומעים ${sound}?`),
                el('div.big-letter.en', {}, sound),
                choiceGrid(items, {
                  render: pictureChoice,
                  cols: 3,
                  correct: (w) => digraphOf(w) === sound,
                  onPick: (w, ok) => {
                    api.speak(target.en);
                    api.answer(ok, { word: target.en, text: `${target.en} — ${target.he} (${sound})` });
                  },
                }),
              );
            },
          };
        }

        const target = pickFresh(pool, used);
        const d = digraphOf(target);
        return {
          render(container) {
            const word = el('div.masked-word.en', { html: level === 1 ? maskDigraph(target) : '' });
            container.append(...[
              prompt('איזה צליל יש במילה?', hasPicture(target) ? '' : target.he),
              hasPicture(target) ? mediaCard(target, { size: 'md' }) : null,
              speakButton(() => api.speak(target.en), 'שמע את המילה'),
              level === 1 ? word : null,
              choiceGrid(DIGRAPHS, {
                render: soundChoice,
                cols: 3,
                cls: 'sounds',
                correct: (x) => x === d,
                onPick: (x, ok) => {
                  word.innerHTML = label(target).replace(new RegExp(d, 'i'), (m) => `<b class="hl">${m}</b>`);
                  word.classList.add(ok ? 'is-correct' : 'is-wrong');
                  if (level > 1) container.insertBefore(word, container.querySelector('.choices'));
                  api.speak(target.en);
                  api.answer(ok, { word: target.en, text: `${label(target)} — ${target.he}` });
                },
              }),
            ].filter(Boolean));
            setTimeout(() => api.speak(target.en), 300);
          },
        };
      },
    };
  },
};
