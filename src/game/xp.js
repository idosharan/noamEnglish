// Subs (XP) economy: thresholds, combo multipliers, round rewards
export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000];

export const MILESTONES = [
  { subs: 100, label: '100 סאבים', icon: '🎬' },
  { subs: 1000, label: '1K סאבים', icon: '🥈' },
  { subs: 10000, label: '10K סאבים', icon: '🥇' },
  { subs: 100000, label: '100K – כפתור כסף', icon: '🏅' },
  { subs: 1000000, label: '1M – כפתור זהב', icon: '🏆' },
];

export function thresholdFor(level) {
  if (level <= 1) return 0;
  if (level <= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[level - 1];
  // beyond table: keep doubling from the last entry
  return LEVEL_THRESHOLDS.at(-1) * 2 ** (level - LEVEL_THRESHOLDS.length);
}

export function levelFor(subs) {
  let level = 1;
  while (subs >= thresholdFor(level + 1)) level++;
  return level;
}

export function levelProgress(subs) {
  const level = levelFor(subs);
  const from = thresholdFor(level);
  const to = thresholdFor(level + 1);
  return { level, from, to, ratio: Math.min(1, (subs - from) / (to - from)) };
}

export function comboMultiplier(combo) {
  if (combo >= 6) return 3;
  if (combo >= 3) return 2;
  return 1;
}

export const SUBS_PER_CORRECT = 10;
export const LIKES_PER_CORRECT = 1;
export const PERFECT_ROUND_BONUS = 50;
export const BOSS_WIN_BONUS = 100;

export function correctReward(combo) {
  return { subs: SUBS_PER_CORRECT * comboMultiplier(combo), likes: LIKES_PER_CORRECT };
}

// Aggregates a finished round. answers: [{correct:boolean}], mode: string, bossWon?: boolean
export function roundReward({ answers, mode, bossWon = false }) {
  let combo = 0;
  let subs = 0;
  let likes = 0;
  let maxCombo = 0;
  for (const a of answers) {
    if (a.correct) {
      combo++;
      maxCombo = Math.max(maxCombo, combo);
      const r = correctReward(combo);
      subs += r.subs;
      likes += r.likes;
    } else {
      combo = 0;
    }
  }
  const correct = answers.filter((a) => a.correct).length;
  const perfect = answers.length > 0 && correct === answers.length && mode !== 'boss';
  if (perfect) subs += PERFECT_ROUND_BONUS;
  if (bossWon) subs += BOSS_WIN_BONUS;
  return { subs, likes, correct, total: answers.length, perfect, maxCombo };
}

// Unlock rule for difficulty per player level
export function maxDifficultyFor(level) {
  if (level >= 6) return 3;
  if (level >= 3) return 2;
  return 1;
}
