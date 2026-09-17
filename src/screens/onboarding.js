import { el } from '../core/utils.js';
import { store } from '../core/store.js';
import { navigate } from '../core/router.js';
import { sfx, unlockAudio } from '../core/audio.js';
import { burst } from '../core/confetti.js';
import { AVATARS } from '../data/avatars.js';

export function renderOnboarding(root) {
  const state = store.get();
  let avatar = state.profile.avatar || 'gamer';
  const free = AVATARS.filter((a) => state.unlockedAvatars.includes(a.id));

  const input = el('input.text-input', {
    type: 'text', maxlength: 18, required: true, placeholder: 'למשל: NoamGaming', value: state.profile.name || '',
    'aria-label': 'שם הערוץ', autocomplete: 'nickname',
  });
  const grid = el('div.avatar-grid', { role: 'radiogroup', 'aria-label': 'בחירת דמות' });
  const draw = () => {
    grid.innerHTML = '';
    free.forEach((a) => grid.append(el('button', {
      type: 'button', role: 'radio', 'aria-checked': String(a.id === avatar),
      class: `avatar-opt ${a.id === avatar ? 'selected' : ''}`,
      onclick: () => { avatar = a.id; sfx('tick'); draw(); },
    }, el('span.avatar-emoji', {}, a.emoji), el('small', {}, a.name))));
  };
  draw();

  const form = el('form.onboarding', {},
    el('div.logo', {}, '🎬'),
    el('h1', {}, 'ברוך הבא ל-English Studio!'),
    el('p.sub', {}, 'פותחים ערוץ, עונים על שאלות באנגלית, אוספים סאבים ולייקים ומנצחים בוסים.'),
    el('label', {}, 'איך ייקרא הערוץ שלך?', input),
    el('div', {}, el('p.label', {}, 'בחר/י דמות (עוד דמויות נפתחות בהמשך):'), grid),
    el('button.primary.big', { type: 'submit' }, '🚀 פתח את הערוץ'),
  );
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim().slice(0, 18);
    if (!name) { input.focus(); return; }
    unlockAudio();
    store.update((s) => ({ ...s, profile: { name, avatar }, onboarded: true }));
    sfx('win');
    burst({ count: 120 });
    setTimeout(() => navigate('/studio', { replace: true }), 500);
  });

  root.innerHTML = '';
  root.append(form);
  setTimeout(() => input.focus(), 100);
}
