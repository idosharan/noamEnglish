import { el } from '../core/utils.js';
import hearletter from './hearletter.js';
import missing from './missing.js';
import digraph from './digraph.js';
import firstletter from './firstletter.js';
import sort from './sort.js';
import order from './order.js';
import translate from './translate.js';
import numbers from './numbers.js';
import reading from './reading.js';
import myname from './myname.js';

// Same task order and instructions as the real mapping test
export const EXAM_PLAN = [
  { mode: hearletter, n: 2, title: 'האזינו למורה והקיפו את האות הנכונה' },
  { mode: missing, n: 2, title: 'השלימו את האותיות' },
  { mode: digraph, n: 2, title: 'התאימו בין הצלילים ch, sh, th לתמונות' },
  { mode: firstletter, n: 2, title: 'הקיפו את האות הראשונה של התמונה' },
  { mode: sort, n: 1, title: 'רשמו את המילים ממחסן המילים בקבוצה המתאימה' },
  { mode: order, n: 1, title: 'האזינו ומספרו את המילים לפי הסדר' },
  { mode: translate, n: 3, title: 'כתבו בעברית את המילים הבאות' },
  { mode: numbers, n: 3, title: 'מספרים 1-12' },
  { mode: reading, n: 3, title: 'קראו את הקטע וענו על השאלות' },
  { mode: myname, n: 1, title: 'כתבו את השם שלכם באנגלית' },
];
export const EXAM_LENGTH = EXAM_PLAN.reduce((s, p) => s + p.n, 0);

export default {
  id: 'exam', title: 'מבחן ניסיון', desc: 'כל סוגי השאלות של מבחן המיפוי', icon: '📝', kind: 'questions', count: EXAM_LENGTH,
  create(level, api) {
    const sections = EXAM_PLAN.map((p, i) => ({ ...p, index: i + 1, gen: p.mode.create(level, api) }));
    const queue = sections.flatMap((s) => Array.from({ length: s.n }, () => s));
    let i = 0;
    return {
      next() {
        const s = queue[i++ % queue.length];
        const q = s.gen.next();
        return {
          render(container) {
            container.append(el('div.exam-section', {}, el('span.exam-num', {}, String(s.index)), el('span', {}, s.title)));
            q.render(container);
          },
        };
      },
    };
  },
};
