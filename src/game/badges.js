// Badge definitions. `test(state)` is pure and receives the full store state.
export const BADGES = [
  { id: 'first_round', icon: '🎬', title: 'סרטון ראשון', desc: 'סיימת סבב ראשון', test: (s) => totalRounds(s) >= 1 },
  { id: 'subs_100', icon: '💯', title: '100 סאבים', desc: 'הגעת ל-100 סאבים', test: (s) => s.subs >= 100 },
  { id: 'subs_1k', icon: '🥈', title: '1K סאבים', desc: 'הגעת ל-1,000 סאבים', test: (s) => s.subs >= 1000 },
  { id: 'subs_10k', icon: '🥇', title: '10K סאבים', desc: 'הגעת ל-10,000 סאבים', test: (s) => s.subs >= 10000 },
  { id: 'streak_3', icon: '🔥', title: '3 ימים ברצף', desc: 'תרגלת 3 ימים ברצף', test: (s) => s.streak.best >= 3 },
  { id: 'streak_7', icon: '🌋', title: 'שבוע ברצף', desc: 'תרגלת 7 ימים ברצף', test: (s) => s.streak.best >= 7 },
  { id: 'boss_first', icon: '👾', title: 'מנצח בוסים', desc: 'ניצחת את הבוס בפעם הראשונה', test: (s) => (s.stats.boss?.wins || 0) >= 1 },
  { id: 'boss_5', icon: '🐉', title: 'צייד בוסים', desc: 'ניצחת 5 בוסים', test: (s) => (s.stats.boss?.wins || 0) >= 5 },
  { id: 'perfect_spelling', icon: '✍️', title: 'מאסטר איות', desc: '10/10 באיות', test: (s) => (s.stats.spelling?.perfect || 0) >= 1 },
  { id: 'perfect_listening', icon: '🎧', title: 'אוזן זהב', desc: '10/10 בהאזנה', test: (s) => (s.stats.listening?.perfect || 0) >= 1 },
  { id: 'perfect_builder', icon: '🧱', title: 'בנאי משפטים', desc: '10/10 בבניית משפטים', test: (s) => (s.stats.builder?.perfect || 0) >= 1 },
  { id: 'perfect_story', icon: '📖', title: 'קורא מקצועי', desc: '10/10 בסיפור', test: (s) => (s.stats.story?.perfect || 0) >= 1 },
  { id: 'memory_fast', icon: '⚡', title: 'זיכרון בזק', desc: 'משחק זיכרון מתחת ל-60 שניות', test: (s) => (s.stats.memory?.bestTime || Infinity) < 60 },
  { id: 'words_50', icon: '🔤', title: '50 מילים', desc: 'איית נכון 50 מילים', test: (s) => (s.stats.spelling?.correct || 0) >= 50 },
  { id: 'level_5', icon: '⭐', title: 'רמה 5', desc: 'הגעת לרמה 5', test: (s) => s.level >= 5 },
  { id: 'level_10', icon: '🌟', title: 'רמה 10', desc: 'הגעת לרמה 10', test: (s) => s.level >= 10 },
  { id: 'combo_6', icon: '🚀', title: 'קומבו x3', desc: '6 תשובות נכונות ברצף', test: (s) => (s.bestCombo || 0) >= 6 },
  { id: 'all_modes', icon: '🎮', title: 'שחקן כל-יכול', desc: 'שיחקת בכל 10 המצבים', test: (s) => Object.values(s.stats).filter((m) => m.rounds > 0).length >= 10 },
];

function totalRounds(s) {
  return Object.values(s.stats).reduce((sum, m) => sum + (m.rounds || 0), 0);
}

// Returns ids of badges that pass test() and are not yet in state.badges
export function evaluate(state) {
  const owned = new Set(state.badges || []);
  return BADGES.filter((b) => !owned.has(b.id) && b.test(state)).map((b) => b.id);
}

export function badgeById(id) {
  return BADGES.find((b) => b.id === id);
}
