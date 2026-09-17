import { el, formatCount } from '../core/utils.js';
import { store } from '../core/store.js';
import { sfx } from '../core/audio.js';
import { burst } from '../core/confetti.js';
import { navigate } from '../core/router.js';
import { modeById, LEVEL_LABELS } from '../exercises/index.js';
import { badgeById } from '../game/badges.js';
import { levelProgress } from '../game/xp.js';
import { avatarById } from '../data/avatars.js';

let lastResult = null;
export function setLastResult(r) { lastResult = r; }

export function renderResults(root) {
  const r = lastResult;
  if (!r) { navigate('/studio', { replace: true }); return; }
  const state = store.get();
  const mode = modeById(r.mode);
  const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0;
  const stars = r.mode === 'boss' ? (r.won ? 3 : r.correct >= 5 ? 1 : 0) : pct === 100 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
  const prog = levelProgress(state.subs);
  const avatar = avatarById(state.profile.avatar);

  const headline = r.mode === 'boss'
    ? (r.won ? 'ניצחת את הבוס! 🏆' : 'הבוס ניצח הפעם… 💀')
    : r.perfect ? 'סבב מושלם! 🌟' : pct >= 70 ? 'עבודה מעולה! 🎉' : pct >= 40 ? 'לא רע, ממשיכים! 💪' : 'עוד תרגול ותשתפר/י 🚀';

  root.innerHTML = '';
  root.append(
    el('section.results', {},
      el('div.result-avatar', {}, avatar.emoji),
      el('h1', {}, headline),
      el('div.stars', { 'aria-label': `${stars} כוכבים` }, ...[0, 1, 2].map((i) => el('span', { class: `star ${i < stars ? 'on' : ''}` }, '★'))),
      el('p.sub', {}, `${mode.icon} ${mode.title} · רמה ${LEVEL_LABELS[r.level]} · `, el('span.num', {}, `${r.correct}/${r.total}`), ` נכונות${r.elapsedSec != null ? ` · ${r.elapsedSec} שניות` : ''}`),

      el('div.reward-grid', {},
        rewardCard('🔔', `+${r.subs}`, 'סאבים'),
        rewardCard('👍', `+${r.likes + (r.questLikes || 0)}`, 'לייקים'),
        rewardCard('🔥', `x${r.maxCombo}`, 'קומבו מקסימלי'),
      ),

      el('div.level-card', {},
        el('div.level-row', {}, el('strong', {}, `רמה ${prog.level}`), el('span.num', {}, `${formatCount(state.subs)} / ${formatCount(prog.to)}`), el('span', {}, 'סאבים')),
        el('div.bar', {}, el('div.fill', { style: `width:${Math.round(prog.ratio * 100)}%` })),
        r.leveledUp ? el('div.levelup', {}, `🆙 עלית לרמה ${r.levelAfter}!`) : null,
      ),

      r.questsCompleted?.length ? el('div.list-card', {},
        el('h3', {}, '✅ משימות שהושלמו'),
        ...r.questsCompleted.map((q) => el('div.list-row', {}, el('span', {}, q.title), el('span.pill', {}, `+${q.reward} 👍`))),
      ) : null,

      r.newBadges?.length ? el('div.list-card', {},
        el('h3', {}, '🏅 תגים חדשים'),
        el('div.badge-row', {}, ...r.newBadges.map(badgeById).filter(Boolean).map((b) => el('div.badge-chip', { title: b.desc }, el('span.badge-icon', {}, b.icon), el('span', {}, b.title)))),
      ) : null,

      el('div.actions.col', {},
        el('button.primary.big', { type: 'button', onclick: () => navigate(`/play/${r.mode}?level=${r.level}`) }, '🔁 שחק/י שוב'),
        r.level < 3 && pct >= 80 && r.mode !== 'boss' ? el('button.secondary', { type: 'button', onclick: () => navigate(`/play/${r.mode}?level=${r.level + 1}`) }, `⬆️ נסה/י רמה ${LEVEL_LABELS[r.level + 1]}`) : null,
        el('button.ghost', { type: 'button', onclick: () => navigate('/studio') }, '🏠 חזרה לסטודיו'),
      ),
    ),
  );

  setTimeout(() => {
    if (stars >= 2 || r.won) { burst({ count: 120 }); sfx(r.leveledUp ? 'levelup' : 'win'); }
    else if (r.mode === 'boss' && !r.won) sfx('lose');
    if (r.leveledUp) setTimeout(() => burst({ count: 80, y: innerHeight / 2 }), 500);
  }, 200);
}

function rewardCard(icon, value, label) {
  return el('div.reward', {}, el('span.reward-icon', {}, icon), el('strong.num', {}, value), el('small', {}, label));
}
