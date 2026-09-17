import { el, formatCount } from '../core/utils.js';
import { store } from '../core/store.js';
import { navigate } from '../core/router.js';
import { MODES, LEVEL_LABELS } from '../exercises/index.js';
import { levelProgress, maxDifficultyFor, MILESTONES } from '../game/xp.js';
import { avatarById } from '../data/avatars.js';
import { installState, promptInstall } from '../app.js';

export function renderStudio(root) {
  const state = store.get();
  const prog = levelProgress(state.subs);
  const avatar = avatarById(state.profile.avatar);
  const maxLevel = maxDifficultyFor(state.level);
  const nextMilestone = MILESTONES.find((m) => m.subs > state.subs);
  const questsDone = state.quests.items.filter((q) => q.done >= q.n).length;

  root.innerHTML = '';
  root.append(
    el('section.studio', {},
      // channel card
      el('div.channel-card', {},
        el('button.avatar-btn', { type: 'button', 'aria-label': 'פרופיל', onclick: () => navigate('/profile') }, avatar.emoji),
        el('div.channel-info', {},
          el('h1', {}, state.profile.name || 'הערוץ שלי'),
          el('div.stat-row', {},
            el('span.stat', { title: 'סאבים' }, '🔔 ', formatCount(state.subs)),
            el('span.stat', { title: 'לייקים' }, '👍 ', formatCount(state.likes)),
            el('span.stat', { title: 'רצף ימים', class: `stat ${state.streak.count ? 'hot' : ''}` }, '🔥 ', String(state.streak.count)),
          ),
        ),
      ),
      el('div.level-card', {},
        el('div.level-row', {}, el('strong', {}, `רמה ${prog.level}`), el('span.num', {}, `${formatCount(state.subs)} / ${formatCount(prog.to)}`)),
        el('div.bar', {}, el('div.fill', { style: `width:${Math.round(prog.ratio * 100)}%` })),
        nextMilestone ? el('small.muted', {}, `${nextMilestone.icon} עוד ${formatCount(nextMilestone.subs - state.subs)} סאבים ל-${nextMilestone.label}`) : null,
      ),

      // boss CTA
      el('button.boss-cta', { type: 'button', onclick: () => navigate(`/play/boss?level=${maxLevel}`) },
        el('span.boss-cta-emoji', {}, '👾'),
        el('span.boss-cta-text', {}, el('strong', {}, 'Boss Battle'), el('small', {}, '60 שניות · שאלות מעורבות · +100 סאבים לניצחון')),
        el('span.chev', {}, '‹'),
      ),

      // daily quests
      el('div.quests', {},
        el('div.section-head', {}, el('h2', {}, '📋 משימות יומיות'), el('span.pill.num', {}, `${questsDone}/${state.quests.items.length}`)),
        ...state.quests.items.map((q) => el('div', { class: `quest ${q.done >= q.n ? 'done' : ''}` },
          el('div.quest-text', {}, el('span', {}, q.title), el('small', {}, el('span.num', {}, `${Math.min(q.done, q.n)}/${q.n}`), ` · +${q.reward} 👍`)),
          el('div.bar.small', {}, el('div.fill', { style: `width:${Math.round((Math.min(q.done, q.n) / q.n) * 100)}%` })),
        )),
      ),

      // modes
      el('div.section-head', {}, el('h2', {}, '🎮 מצבי משחק'), el('small.muted', {}, `רמה מקסימלית: ${LEVEL_LABELS[maxLevel]}`)),
      el('div.mode-grid', {}, ...MODES.filter((m) => m.id !== 'boss').map((m) => modeCard(m, state, maxLevel))),

      installState.canInstall ? el('button.install-cta', { type: 'button', onclick: promptInstall }, '📲 התקן את המשחק בטלפון') : null,
    ),
  );
}

function modeCard(mode, state, maxLevel) {
  const st = state.stats[mode.id];
  const best = st?.best || 0;
  const bestLabel = mode.id === 'memory' ? (st?.bestTime ? `שיא ${st.bestTime} שנ'` : '') : best ? `שיא ${best}/10` : '';
  const card = el('article.mode-card', {},
    el('div.mode-top', {}, el('span.mode-icon', {}, mode.icon), bestLabel ? el('span.pill.best', {}, bestLabel) : null),
    el('h3', {}, mode.title),
    el('p', {}, mode.desc),
    el('div.level-picker', { role: 'group', 'aria-label': 'בחירת רמה' },
      ...[1, 2, 3].map((lv) => el('button', {
        type: 'button',
        class: `lvl ${lv > maxLevel ? 'locked' : ''}`,
        disabled: lv > maxLevel,
        title: lv > maxLevel ? `נפתח ברמה ${lv === 2 ? 3 : 6}` : LEVEL_LABELS[lv],
        onclick: () => navigate(`/play/${mode.id}?level=${lv}`),
      }, lv > maxLevel ? '🔒' : LEVEL_LABELS[lv])),
    ),
  );
  return card;
}
