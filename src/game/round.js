import { roundReward, levelFor } from './xp.js';
import { applyProgress } from './quests.js';
import { evaluate } from './badges.js';
import { touchStreak, addRewards, recordRound } from '../core/store.js';

// Pure: applies a finished round to state. Returns { state, summary }
// round = { mode, answers:[{correct}], won?, elapsedSec?, day? }
export function applyRound(state, round) {
  const { mode, answers, won = false, elapsedSec = null, day } = round;
  const reward = roundReward({ answers, mode, bossWon: mode === 'boss' && won });
  const levelBefore = levelFor(state.subs);

  let next = touchStreak(state, day);
  next = addRewards(next, { subs: reward.subs, likes: reward.likes });
  next = recordRound(next, { mode, correct: reward.correct, total: reward.total, perfect: reward.perfect, won, elapsedSec, maxCombo: reward.maxCombo });

  // quests
  let quests = next.quests;
  const completed = [];
  const push = (event) => {
    const r = applyProgress(quests, event);
    quests = r.quests;
    completed.push(...r.completed);
  };
  for (const a of answers) push({ type: 'answer', mode, correct: a.correct });
  push({ type: 'round', mode, correct: reward.correct, total: reward.total, perfect: reward.perfect });
  if (mode === 'boss') push({ type: 'boss', won });
  const questLikes = completed.reduce((s, q) => s + q.reward, 0);
  quests = { ...quests, items: quests.items.map((q) => (completed.some((c) => c.id === q.id) ? { ...q, claimed: true } : q)) };
  next = { ...next, quests };
  if (questLikes) next = addRewards(next, { likes: questLikes });

  const newBadges = evaluate(next);
  next = { ...next, badges: [...next.badges, ...newBadges] };

  const levelAfter = next.level;
  return {
    state: next,
    summary: {
      mode, ...reward, won, elapsedSec,
      questsCompleted: completed, questLikes,
      newBadges, levelBefore, levelAfter, leveledUp: levelAfter > levelBefore,
      subsTotal: next.subs, likesTotal: next.likes,
    },
  };
}
