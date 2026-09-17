import { rng, hashString, pickMany } from '../core/utils.js';

// Quest templates. `event` shapes emitted by the round controller:
//  { type:'answer', mode, correct }  { type:'round', mode, correct, total, perfect }
//  { type:'boss', won }
export const QUEST_TEMPLATES = [
  { id: 'answers_any', title: 'ענה נכון על {n} שאלות', n: 15, reward: 20,
    progress: (e) => (e.type === 'answer' && e.correct ? 1 : 0) },
  { id: 'answers_spelling', title: 'ענה נכון על {n} שאלות איות', n: 8, reward: 25,
    progress: (e) => (e.type === 'answer' && e.correct && e.mode === 'spelling' ? 1 : 0) },
  { id: 'answers_listening', title: 'ענה נכון על {n} שאלות האזנה', n: 8, reward: 25,
    progress: (e) => (e.type === 'answer' && e.correct && e.mode === 'listening' ? 1 : 0) },
  { id: 'answers_builder', title: 'בנה נכון {n} משפטים', n: 6, reward: 25,
    progress: (e) => (e.type === 'answer' && e.correct && e.mode === 'builder' ? 1 : 0) },
  { id: 'rounds_3', title: 'סיים {n} סבבים', n: 3, reward: 20,
    progress: (e) => (e.type === 'round' ? 1 : 0) },
  { id: 'perfect_1', title: 'סיים סבב מושלם 10/10', n: 1, reward: 40,
    progress: (e) => (e.type === 'round' && e.perfect ? 1 : 0) },
  { id: 'boss_win', title: 'נצח את הבוס', n: 1, reward: 40,
    progress: (e) => (e.type === 'boss' && e.won ? 1 : 0) },
  { id: 'story_1', title: 'קרא סיפור וענה על השאלות', n: 1, reward: 20,
    progress: (e) => (e.type === 'round' && e.mode === 'story' ? 1 : 0) },
  { id: 'memory_1', title: 'סיים משחק זיכרון', n: 1, reward: 20,
    progress: (e) => (e.type === 'round' && e.mode === 'memory' ? 1 : 0) },
  { id: 'vocab_10', title: 'ענה נכון על {n} כרטיסיות מילים', n: 10, reward: 20,
    progress: (e) => (e.type === 'answer' && e.correct && e.mode === 'vocabulary' ? 1 : 0) },
];

export function questsFor(dayKey) {
  const random = rng(hashString(dayKey));
  const chosen = pickMany(QUEST_TEMPLATES, 3, random);
  return {
    day: dayKey,
    items: chosen.map((t) => ({ id: t.id, title: t.title.replace('{n}', t.n), n: t.n, reward: t.reward, done: 0, claimed: false })),
  };
}

// Returns { quests, completed: [questItem] } — completed are the ones that just hit n
export function applyProgress(quests, event) {
  const completed = [];
  const items = quests.items.map((q) => {
    if (q.done >= q.n) return q;
    const tpl = QUEST_TEMPLATES.find((t) => t.id === q.id);
    const inc = tpl ? tpl.progress(event) : 0;
    if (!inc) return q;
    const done = Math.min(q.n, q.done + inc);
    const next = { ...q, done };
    if (done >= q.n) completed.push(next);
    return next;
  });
  return { quests: { ...quests, items }, completed };
}
