import { el, shuffle, pickMany, pick } from '../core/utils.js';
import { WORDS, CATEGORIES, DIGRAPHS, digraphOf, shortVowel, hasPicture, mediaHtml, label, byLevel } from '../data/words.js';
import { prompt, pickManyWeighted } from './common.js';

const CAT_ICONS = { animals: '🐾', food: '🍎', people: '👪', actions: '🏃', describing: '🎨', things: '🎒', body: '🦷' };

// Builds a sorting board: { title, groups:[{id,label,icon}], words:[{w, group}] }
export function makeBoard(level) {
  const groupCount = level >= 3 ? 3 : 2;
  const perGroup = level === 1 ? 2 : groupCount === 3 ? 2 : 3;
  const pool = byLevel(WORDS, level).filter((w) => !w.digit);
  const types = level === 1 ? ['category', 'digraph'] : ['category', 'digraph', 'vowel'];
  const type = pick(types);

  let groups;
  let keyOf;
  let title;
  if (type === 'digraph') {
    groups = pickMany(DIGRAPHS, groupCount).map((d) => ({ id: d, label: d, en: true }));
    keyOf = digraphOf;
    title = 'מיינו את המילים לפי הצליל';
  } else if (type === 'vowel') {
    const vowels = ['a', 'e', 'i', 'o', 'u'].filter((v) => pool.filter((w) => shortVowel(w) === v).length >= perGroup);
    groups = pickMany(vowels, groupCount).map((v) => ({ id: v, label: v, en: true }));
    keyOf = shortVowel;
    title = 'מיינו לפי האות האמצעית (התנועה)';
  } else {
    const cats = Object.keys(CAT_ICONS).filter((c) => pool.filter((w) => w.category === c).length >= perGroup);
    groups = pickMany(cats, groupCount).map((c) => ({ id: c, label: CATEGORIES[c], icon: CAT_ICONS[c] }));
    keyOf = (w) => w.category;
    title = 'מיינו את המילים לקבוצות';
  }
  const words = groups.flatMap((g) => pickManyWeighted(pool.filter((w) => keyOf(w) === g.id), perGroup).map((w) => ({ w, group: g.id })));
  return { type, title, groups, words: shuffle(words) };
}

export default {
  id: 'sort', title: 'מחסן מילים', desc: 'רשמו כל מילה בקבוצה המתאימה', icon: '🗂️', kind: 'questions', count: 5,
  create(level, api) {
    return {
      next() {
        const board = makeBoard(level);
        return {
          render(container) {
            let selected = null;
            let mistakes = 0;
            let placed = 0;
            const bank = el('div.word-bank', { role: 'group', 'aria-label': 'מחסן מילים' });
            const bins = el('div.bins', { style: `--cols:${board.groups.length}` });

            const binEls = board.groups.map((g) => {
              const list = el('div.bin-list');
              const bin = el('button.bin', { type: 'button', 'aria-label': `קבוצה ${g.label}` },
                el('span.bin-head', {}, g.icon ? el('span.bin-ico', {}, g.icon) : null, el(g.en ? 'span.en.bin-label' : 'span.bin-label', {}, g.label)),
                list,
              );
              bin.addEventListener('click', () => drop(g, bin, list));
              bins.append(bin);
              return bin;
            });

            board.words.forEach((item) => {
              const chip = el('button.word-chip', { type: 'button' },
                level === 1 && hasPicture(item.w) ? el('span.chip-pic', { html: mediaHtml(item.w, 'media xs') }) : null,
                el('span.en', {}, label(item.w)),
              );
              chip._item = item;
              chip.addEventListener('click', () => {
                if (chip.classList.contains('placed')) return;
                bank.querySelectorAll('.word-chip').forEach((c) => c.classList.remove('selected'));
                selected = chip;
                chip.classList.add('selected');
                binEls.forEach((b) => b.classList.add('ready'));
                if (level <= 2) api.speak(item.w.en);
                else api.sfx('tick');
              });
              bank.append(chip);
            });

            function drop(g, bin, list) {
              if (!selected) { bank.classList.remove('nudge'); void bank.offsetWidth; bank.classList.add('nudge'); return; }
              const chip = selected;
              if (chip._item.group !== g.id) {
                mistakes++;
                api.sfx('wrong');
                chip.classList.remove('shake'); void chip.offsetWidth; chip.classList.add('shake');
                bin.classList.remove('shake'); void bin.offsetWidth; bin.classList.add('shake');
                return;
              }
              api.sfx('tick');
              chip.classList.remove('selected');
              chip.classList.add('placed');
              chip.disabled = true;
              list.append(chip);
              selected = null;
              binEls.forEach((b) => b.classList.remove('ready'));
              placed++;
              if (placed === board.words.length) {
                const ok = mistakes === 0;
                bins.classList.add(ok ? 'is-correct' : 'is-done');
                api.answer(ok, { text: ok ? 'מיון מושלם!' : `סיימת עם ${mistakes} טעויות` });
              }
            }

            container.append(
              prompt(board.title, 'לחצו על מילה ואז על הקבוצה שלה'),
              bank,
              bins,
            );
          },
        };
      },
    };
  },
};
