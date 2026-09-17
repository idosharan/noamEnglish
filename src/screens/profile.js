import { el, formatCount } from '../core/utils.js';
import { store } from '../core/store.js';
import { navigate } from '../core/router.js';
import { sfx, setMuted } from '../core/audio.js';
import { burst } from '../core/confetti.js';
import { MODES } from '../exercises/index.js';
import { BADGES } from '../game/badges.js';
import { AVATARS, avatarById } from '../data/avatars.js';
import { applyTheme } from '../app.js';
import { installButton } from './install.js';

export function renderProfile(root) {
  const state = store.get();
  const avatar = avatarById(state.profile.avatar);
  const owned = new Set(state.badges);

  root.innerHTML = '';
  root.append(
    el('section.profile', {},
      el('div.channel-card', {},
        el('div.avatar-btn.static', {}, avatar.emoji),
        el('div.channel-info', {},
          el('h1', {}, state.profile.name),
          el('div.stat-row', {},
            el('span.stat', {}, '🔔 ', formatCount(state.subs)), el('span.stat', {}, '👍 ', formatCount(state.likes)),
            el('span.stat', {}, '⭐ רמה ', String(state.level)), el('span.stat', {}, '🔥 שיא ', String(state.streak.best)),
          ),
        ),
        el('button.ghost.small', { type: 'button', onclick: () => navigate('/onboarding') }, '✏️ שינוי שם'),
      ),

      // avatar shop
      el('h2', {}, '🧑‍🎤 דמויות'),
      el('div.avatar-grid.shop', {}, ...AVATARS.map((a) => {
        const unlocked = state.unlockedAvatars.includes(a.id);
        const selected = a.id === state.profile.avatar;
        const canBuy = !unlocked && a.cost > 0 && state.likes >= a.cost;
        const lockedByLevel = !unlocked && a.level && state.level < a.level;
        const label = unlocked ? (selected ? 'נבחר ✓' : 'בחר') : a.level ? `רמה ${a.level}` : `${a.cost} 👍`;
        return el('button', {
          type: 'button', class: `avatar-opt ${selected ? 'selected' : ''} ${unlocked ? '' : 'locked'}`,
          disabled: !unlocked && !canBuy,
          'aria-label': `${a.name} – ${label}`,
          onclick: () => {
            if (unlocked) {
              store.update((s) => ({ ...s, profile: { ...s.profile, avatar: a.id } }));
              sfx('tick');
            } else if (canBuy) {
              store.update((s) => ({ ...s, likes: s.likes - a.cost, unlockedAvatars: [...s.unlockedAvatars, a.id], profile: { ...s.profile, avatar: a.id } }));
              sfx('coin'); burst({ count: 60 });
            }
            renderProfile(root);
          },
        }, el('span.avatar-emoji', {}, unlocked || !lockedByLevel ? a.emoji : '🔒'), el('small', {}, a.name), el('small.price', {}, label));
      })),

      // badges
      el('h2', {}, `🏅 תגים (${owned.size}/${BADGES.length})`),
      el('div.badge-grid', {}, ...BADGES.map((b) => el('div', { class: `badge-tile ${owned.has(b.id) ? 'on' : ''}`, title: b.desc },
        el('span.badge-icon', {}, owned.has(b.id) ? b.icon : '🔒'), el('strong', {}, b.title), el('small', {}, b.desc)))),

      // stats
      el('h2', {}, '📊 סטטיסטיקה'),
      el('div.stats-table', {}, ...MODES.map((m) => {
        const s = state.stats[m.id];
        const pct = s?.total ? Math.round((s.correct / s.total) * 100) : 0;
        return el('div.stats-row', {},
          el('span.mode-icon', {}, m.icon), el('span.name', {}, m.title),
          el('span.val', {}, s ? `${s.rounds} סבבים · ${pct}%${m.id === 'boss' ? ` · ${s.wins} ניצחונות` : m.id === 'memory' && s.bestTime ? ` · שיא ${s.bestTime}ש'` : s.best ? ` · שיא ${s.best}/10` : ''}` : '—'),
        );
      })),

      // settings
      el('h2', {}, '⚙️ הגדרות'),
      el('div.settings', {},
        toggleRow('🔊 צלילים ודיבור', !state.settings.muted, (on) => { setMuted(!on); store.update((s) => ({ ...s, settings: { ...s.settings, muted: !on } })); }),
        toggleRow('🌙 מצב כהה', state.settings.theme !== 'light', (on) => { const theme = on ? 'dark' : 'light'; applyTheme(theme); store.update((s) => ({ ...s, settings: { ...s.settings, theme } })); }),
        el('div.install-box', {}, installButton()),
        el('button.danger.small', { type: 'button', onclick: () => {
          if (confirm('לאפס את כל ההתקדמות? אי אפשר לבטל.')) { store.reset(); navigate('/onboarding', { replace: true }); }
        } }, '🗑️ איפוס התקדמות'),
      ),
      el('button.ghost', { type: 'button', onclick: () => navigate('/studio') }, '🏠 חזרה לסטודיו'),
    ),
  );
}

function toggleRow(label, on, onChange) {
  const btn = el('button', { type: 'button', role: 'switch', 'aria-checked': String(on), class: `switch ${on ? 'on' : ''}` }, el('span.knob'));
  btn.addEventListener('click', () => {
    const next = btn.getAttribute('aria-checked') !== 'true';
    btn.setAttribute('aria-checked', String(next));
    btn.classList.toggle('on', next);
    onChange(next);
  });
  return el('div.setting-row', {}, el('span', {}, label), btn);
}
