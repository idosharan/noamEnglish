import { el, formatCount } from '../core/utils.js';
import { store } from '../core/store.js';
import { navigate } from '../core/router.js';
import { sfx } from '../core/audio.js';
import { WORLDS, LEVEL_LABELS, roundLength, modeById } from '../exercises/index.js';
import { levelProgress, maxDifficultyFor } from '../game/xp.js';
import { avatarById } from '../data/avatars.js';
import { installBanner, shouldShowInstall } from './install.js';

export function starsFor(mode, stats) {
  const st = stats[mode.id];
  if (!st?.rounds) return 0;
  const pct = st.best / roundLength(mode);
  return pct >= 1 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0;
}

// Next suggested mode: first one on the path without 2+ stars
function nextMode(state) {
  for (const w of WORLDS) for (const m of w.modes) if (starsFor(m, state.stats) < 2) return m;
  return modeById('exam');
}

export function renderStudio(root) {
  const state = store.get();
  const prog = levelProgress(state.subs);
  const avatar = avatarById(state.profile.avatar);
  const maxLevel = maxDifficultyFor(state.level);
  const questsDone = state.quests.items.filter((q) => q.done >= q.n).length;
  const suggested = nextMode(state);

  root.innerHTML = '';
  root.append(
    el('section.studio', {},
      el('header.hud', {},
        el('button.hud-avatar', { type: 'button', 'aria-label': 'פרופיל', onclick: () => navigate('/profile') },
          el('span', {}, avatar.emoji),
          el('span.hud-lvl', { 'aria-label': `רמה ${prog.level}` }, String(prog.level)),
        ),
        el('div.hud-main', {},
          el('div.hud-name', {}, state.profile.name || 'השחקן שלי'),
          el('div.xp', { role: 'progressbar', 'aria-label': 'התקדמות לרמה הבאה', 'aria-valuenow': Math.round(prog.ratio * 100) },
            el('div.xp-fill', { style: `width:${Math.max(4, Math.round(prog.ratio * 100))}%` }),
            el('span.xp-text.num', {}, `${formatCount(state.subs)} / ${formatCount(prog.to)}`),
          ),
        ),
        el('div.hud-stats', {},
          el('span.chip', { title: 'סאבים' }, '🔔', el('b.num', {}, formatCount(state.subs))),
          el('span', { class: `chip ${state.streak.count ? 'hot' : ''}`, title: 'ימים ברצף' }, '🔥', el('b.num', {}, String(state.streak.count))),
        ),
      ),

      el('button.next-card', { type: 'button', onclick: () => openModeSheet(suggested, maxLevel) },
        el('span.next-kicker', {}, 'המשימה הבאה'),
        el('span.next-icon', { 'aria-hidden': 'true' }, suggested.icon),
        el('span.next-text', {}, el('strong', {}, suggested.title), el('small', {}, suggested.desc)),
        el('span.next-go', { 'aria-hidden': 'true' }, '▶'),
      ),

      shouldShowInstall(state) ? installBanner() : null,

      el('div.map', {}, ...WORLDS.map((w, wi) => worldBlock(w, wi, state, maxLevel))),

      el('div.finale', {},
        el('h2.world-title', {}, el('span', {}, '🏰'), 'אתגר הסיום'),
        el('div.finale-grid', {},
          finaleCard(modeById('exam'), 'exam', state, () => openModeSheet(modeById('exam'), maxLevel)),
          finaleCard(modeById('boss'), 'boss', state, () => navigate(`/play/boss?level=${maxLevel}`)),
        ),
      ),

      el('details.quests', { open: questsDone < state.quests.items.length },
        el('summary.section-head', {}, el('h2', {}, '📋 משימות יומיות'), el('span.pill.num', {}, `${questsDone}/${state.quests.items.length}`)),
        ...state.quests.items.map((q) => el('div', { class: `quest ${q.done >= q.n ? 'done' : ''}` },
          el('div.quest-text', {}, el('span', {}, q.title), el('small', {}, el('span.num', {}, `${Math.min(q.done, q.n)}/${q.n}`), ` · +${q.reward} 👍`)),
          el('div.bar.small', {}, el('div.fill', { style: `width:${Math.round((Math.min(q.done, q.n) / q.n) * 100)}%` })),
        )),
      ),
    ),
  );
}

function worldBlock(world, index, state, maxLevel) {
  const earned = world.modes.reduce((s, m) => s + starsFor(m, state.stats), 0);
  return el('section.world', { dataset: { world: world.color } },
    el('h2.world-title', {},
      el('span.world-num', {}, String(index + 1)),
      el('span.world-name', {}, world.icon, ' ', world.title),
      el('span.world-stars.num', { 'aria-label': `${earned} כוכבים` }, `★ ${earned}/${world.modes.length * 3}`),
    ),
    el('div.path', {}, ...world.modes.map((m, i) => {
      const stars = starsFor(m, state.stats);
      return el('div', { class: `node-wrap pos-${i % 4}` },
        el('button', {
          type: 'button', class: `node ${stars === 3 ? 'gold' : stars ? 'played' : ''}`,
          'aria-label': `${m.title} – ${stars} כוכבים`,
          onclick: () => { sfx('tick'); openModeSheet(m, maxLevel); },
        }, el('span.node-icon', { 'aria-hidden': 'true' }, m.icon)),
        el('div.node-stars', { 'aria-hidden': 'true' }, ...[0, 1, 2].map((s) => el('span', { class: s < stars ? 'on' : '' }, '★'))),
        el('div.node-label', {}, m.title),
      );
    })),
  );
}

function finaleCard(mode, kind, state, onclick) {
  const st = state.stats[mode.id];
  const sub = kind === 'exam'
    ? (st?.rounds ? `ציון הכי טוב: ${Math.round((st.best / roundLength(mode)) * 100)}` : `${roundLength(mode)} שאלות כמו במבחן`)
    : (st?.wins ? `ניצחת ${st.wins} פעמים` : '60 שניות · שאלות מעורבות');
  return el('button', { type: 'button', class: `finale-card ${kind}`, onclick },
    el('span.finale-icon', { 'aria-hidden': 'true' }, mode.icon),
    el('strong', {}, mode.title),
    el('small', {}, sub),
  );
}

// Bottom sheet to pick difficulty
export function openModeSheet(mode, maxLevel) {
  document.querySelector('.sheet-backdrop')?.remove();
  const state = store.get();
  const st = state.stats[mode.id];
  const close = () => { backdrop.classList.add('closing'); setTimeout(() => backdrop.remove(), 250); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  const go = (lv) => { close(); navigate(`/play/${mode.id}?level=${lv}`); };
  const backdrop = el('div.sheet-backdrop', { onclick: (e) => { if (e.target === backdrop) close(); } },
    el('div.sheet.mode-sheet', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'mode-sheet-title' },
      el('div.sheet-handle', { 'aria-hidden': 'true' }),
      el('div.sheet-hero', {}, el('span.sheet-icon', {}, mode.icon), el('div', {}, el('h2#mode-sheet-title', {}, mode.title), el('p.muted', {}, mode.desc))),
      st?.rounds ? el('p.muted.small-text', {}, `שיחקת ${st.rounds} סבבים · הכי טוב ${st.best}/${roundLength(mode)}`) : null,
      el('div.level-picker', { role: 'group', 'aria-label': 'בחירת רמה' },
        ...[1, 2, 3].map((lv) => el('button', {
          type: 'button',
          class: `lvl lvl-${lv} ${lv > maxLevel ? 'locked' : ''}`,
          disabled: lv > maxLevel,
          onclick: () => go(lv),
        }, el('strong', {}, lv > maxLevel ? '🔒' : LEVEL_LABELS[lv]), el('small', {}, lv > maxLevel ? `נפתח ברמה ${lv === 2 ? 3 : 6}` : '●'.repeat(lv)))),
      ),
      el('button.ghost', { type: 'button', onclick: close }, 'סגור'),
    ),
  );
  document.addEventListener('keydown', onKey);
  document.body.append(backdrop);
  requestAnimationFrame(() => backdrop.classList.add('open'));
  backdrop.querySelector('.lvl:not([disabled])')?.focus();
}
