import { el, shuffle } from '../core/utils.js';
import { choiceGrid, prompt } from './common.js';
import { renderTiles, renderTyping } from './spelling.js';
import { traceBoard } from './trace.js';

export const KID_NAME = 'Noam';
const WRONG_SPELLINGS = ['Naom', 'Noem', 'Nuam', 'Noan', 'Moam', 'Noamm'];
const SENTENCES = [
  { text: `My name is ${KID_NAME}.`, ok: true },
  { text: `Name my is ${KID_NAME}.`, ok: false },
  { text: `My is name ${KID_NAME}.`, ok: false },
  { text: `${KID_NAME} name my is.`, ok: false },
];

// One round walks through: recognise → build → trace → sentence → type
export default {
  id: 'myname', title: 'השם שלי באנגלית', desc: `לומדים לכתוב ${KID_NAME}`, icon: '📛', kind: 'questions', count: 5,
  create(level, api) {
    let step = 0;
    const steps = ['pick', 'tiles', 'trace', 'sentence', level >= 2 ? 'type' : 'tiles'];
    return {
      next() {
        const type = steps[step++ % steps.length];
        return {
          render(container) {
            const done = (ok) => api.answer(ok, { word: 'name', text: ok ? `מעולה! ${KID_NAME} ✨` : `כותבים כך: ${KID_NAME}` });
            if (type === 'pick') {
              const items = shuffle([KID_NAME, ...shuffle(WRONG_SPELLINGS).slice(0, 3)]);
              container.append(
                prompt('איך כותבים את השם שלך באנגלית?', 'נועם'),
                choiceGrid(items, { render: (t) => `<span class="en">${t}</span>`, cols: 2, correct: (t) => t === KID_NAME, onPick: (t, ok) => { api.speak(KID_NAME); done(ok); } }),
              );
            } else if (type === 'tiles') {
              container.append(prompt('בנו את השם שלך', 'שימו לב: אות ראשונה גדולה N'), el('div.he-word', {}, 'נועם'));
              renderTiles(container, { en: KID_NAME, he: 'נועם' }, { ...api, answer: (ok) => done(ok) }, level === 1 ? 1 : 3);
            } else if (type === 'trace') {
              const board = traceBoard(KID_NAME, { sfx: api.sfx, onResult: done });
              api.onCleanup(() => board.cleanup?.());
              container.append(prompt('כתבו את השם שלכם', 'עברו עם האצבע על האותיות'), board);
            } else if (type === 'sentence') {
              container.append(
                prompt('איזה משפט נכון?', 'קוראים לי נועם'),
                choiceGrid(shuffle(SENTENCES), { render: (s) => `<span class="en">${s.text}</span>`, cols: 1, cls: 'stack', correct: (s) => s.ok, onPick: (s, ok) => { api.speak(SENTENCES[0].text); done(ok); } }),
              );
            } else {
              container.append(prompt('הקלידו את השם שלכם באנגלית', 'נועם'));
              renderTyping(container, { en: KID_NAME.toLowerCase(), he: 'נועם' }, { ...api, answer: (ok) => done(ok) });
            }
          },
        };
      },
    };
  },
};
