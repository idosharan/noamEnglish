import { el, shuffle, pick } from '../core/utils.js';
import { PASSAGES } from '../data/reading.js';
import { choiceGrid, textChoice, prompt, speakButton } from './common.js';

export default {
  id: 'reading', title: 'קוראים ועונים', desc: 'קראו את הקטע וענו על השאלות', icon: '📖', kind: 'questions', count: 8,
  create(level, api) {
    const pool = PASSAGES.filter((s) => s.level <= level);
    let story = null;
    let queue = [];
    let asked = 0;
    const recent = [];

    function loadStory() {
      const candidates = pool.filter((s) => !recent.includes(s.id));
      story = pick(candidates.length ? candidates : pool);
      recent.push(story.id);
      if (recent.length > Math.min(3, pool.length - 1)) recent.shift();
      // level 1: yes/no; level 2: yes/no + multiple choice; level 3: multiple choice
      const yn = story.yesNo.map((q) => ({ type: 'yn', ...q }));
      const mc = story.mcq.map((q) => ({ type: 'mcq', ...q }));
      queue = level === 1 ? shuffle(yn) : level === 2 ? shuffle([...pickFew(yn, 2), ...mc]) : shuffle(mc);
      asked = 0;
    }
    const pickFew = (arr, n) => shuffle(arr).slice(0, n);

    return {
      next() {
        if (!queue.length) loadStory();
        const q = queue.shift();
        const isNewStory = asked++ === 0;
        return {
          render(container) {
            const readAll = () => api.speak(story.lines.join(' '), { rate: 0.8 });
            const storyBox = el('div.story-box', {},
              el('div.story-head', {}, el('span.story-icon', {}, story.icon), el('h3.en', {}, story.title), speakButton(readAll, 'הקראה')),
              el('div.story-lines.en', {}, ...story.lines.map((l) => el('span.line', { onclick: () => api.speak(l, { rate: 0.8 }) }, l, ' '))),
            );
            const items = q.type === 'yn' ? ['כן', 'לא'] : q.options;
            const isCorrect = q.type === 'yn' ? (t) => (t === 'כן') === q.answer : (t) => q.options.indexOf(t) === q.answer;
            const correctText = q.type === 'yn' ? (q.answer ? 'כן' : 'לא') : q.options[q.answer];
            const englishOptions = q.type === 'mcq' && /[a-z]/i.test(q.options[0]);

            container.append(
              storyBox,
              prompt(q.q),
              choiceGrid(items, {
                render: englishOptions ? (t) => `<span class="en">${t}</span>` : textChoice,
                cols: 2,
                correct: isCorrect,
                onPick: (t, ok) => api.answer(ok, { text: ok ? 'קראת נכון!' : `התשובה הנכונה: ${correctText}` }),
              }),
            );
            if (isNewStory && level === 1) setTimeout(readAll, 300);
          },
        };
      },
    };
  },
};
