import { el, shuffle, pick } from '../core/utils.js';
import { STORIES } from '../data/stories.js';
import { choiceGrid, textChoice, prompt, speakButton } from './common.js';

export default {
  id: 'story', title: 'סיפור קצר', desc: 'קרא/י סיפור וענה/י על שאלות', icon: '📖', kind: 'questions',
  create(level, api) {
    const pool = STORIES.filter((s) => s.level <= level);
    let story = null;
    let queue = [];
    let lastId = null;

    function loadStory() {
      const candidates = pool.filter((s) => s.id !== lastId);
      story = pick(candidates.length ? candidates : pool);
      lastId = story.id;
      const qs = level === 1
        ? story.yesNo.map((q) => ({ type: 'yn', ...q }))
        : story.mcq.map((q) => ({ type: 'mcq', ...q }));
      queue = shuffle(qs);
    }

    return {
      next() {
        if (!queue.length) loadStory();
        const q = queue.shift();
        const isNewStory = queue.length === (level === 1 ? story.yesNo.length : story.mcq.length) - 1;
        return {
          render(container) {
            const storyBox = el('div.story-box', {},
              el('div.story-head', {}, el('span.story-icon', {}, story.icon), el('h3.en', {}, story.title), speakButton(() => api.speak(story.lines.join(' '), { rate: 0.85 }), 'הקרא')),
              el('ol.story-lines.en', {}, ...story.lines.map((l) => el('li', { onclick: () => api.speak(l) }, l))),
            );
            const toggle = el('button.ghost.small', { type: 'button' }, level >= 3 && !isNewStory ? '👀 הצג את הסיפור שוב' : '🙈 הסתר סיפור');
            const collapsed = level >= 3 && !isNewStory;
            if (collapsed) storyBox.classList.add('collapsed');
            toggle.addEventListener('click', () => {
              storyBox.classList.toggle('collapsed');
              toggle.textContent = storyBox.classList.contains('collapsed') ? '👀 הצג את הסיפור שוב' : '🙈 הסתר סיפור';
            });

            const items = q.type === 'yn' ? ['כן', 'לא'] : q.options;
            const isCorrect = q.type === 'yn' ? (t) => (t === 'כן') === q.answer : (t) => q.options.indexOf(t) === q.answer;
            const correctText = q.type === 'yn' ? (q.answer ? 'כן' : 'לא') : q.options[q.answer];

            container.append(
              storyBox,
              toggle,
              prompt(q.q),
              choiceGrid(items, {
                render: textChoice,
                cols: q.type === 'yn' ? 2 : 1,
                cls: q.type === 'yn' ? '' : 'stack',
                correct: isCorrect,
                onPick: (t, ok) => {
                  storyBox.classList.remove('collapsed');
                  api.answer(ok, { text: ok ? 'קראת נכון!' : `התשובה הנכונה: ${correctText}` });
                },
              }),
            );
            if (isNewStory) setTimeout(() => api.speak(story.lines.join(' '), { rate: 0.85 }), 300);
          },
        };
      },
    };
  },
};
