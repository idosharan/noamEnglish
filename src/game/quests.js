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
  { id: 'answers_digraph', title: 'ענה נכון על {n} שאלות ch/sh/th', n: 6, reward: 25,
    progress: (e) => (e.type === 'answer' && e.correct && e.mode === 'digraph' ? 1 : 0) },
  { id: 'rounds_3', title: 'סיים {n} סבבים', n: 3, reward: 20,
    progress: (e) => (e.type === 'round' ? 1 : 0) },
  { id: 'perfect_1', title: 'סיים סבב מושלם', n: 1, reward: 40,
    progress: (e) => (e.type === 'round' && e.perfect ? 1 : 0) },
  { id: 'boss_win', title: 'נצח את הבוס', n: 1, reward: 40,
    progress: (e) => (e.type === 'boss' && e.won ? 1 : 0) },
  { id: 'reading_1', title: 'קרא קטע וענה על השאלות', n: 1, reward: 20,
    progress: (e) => (e.type === 'round' && e.mode === 'reading' ? 1 : 0) },
  { id: 'exam_1', title: 'סיים מבחן ניסיון', n: 1, reward: 40,
    progress: (e) => (e.type === 'round' && e.mode === 'exam' ? 1 : 0) },
  { id: 'translate_10', title: 'תרגם נכון {n} מילים', n: 10, reward: 20,
    progress: (e) => (e.type === 'answer' && e.correct && e.mode === 'translate' ? 1 : 0) },
  { id: 'trace_5', title: 'כתוב יפה {n} אותיות', n: 5, reward: 25,
    progress: (e) => (e.type === 'answer' && e.correct && e.mode === 'trace' ? 1 : 0) },
  { id: 'numbers_8', title: 'ענה נכון על {n} שאלות מספרים', n: 8, reward: 20,
    progress: (e) => (e.type === 'answer' && e.correct && e.mode === 'numbers' ? 1 : 0) },
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
