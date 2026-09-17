import { el } from '../core/utils.js';
import { store } from '../core/store.js';
import { sfx } from '../core/audio.js';
import { installState, promptInstall, isStandalone } from '../app.js';

const ua = navigator.userAgent;
const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isAndroid = /android/i.test(ua);
const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios|edg/i.test(ua);

export function shouldShowInstall(state) {
  if (isStandalone()) return false;
  const until = state.settings.installDismissedUntil || 0;
  return Date.now() > until;
}

// Animated hero card shown in the Studio
export function installBanner({ onDismiss } = {}) {
  const card = el('section.install-banner', { 'aria-label': 'התקנת המשחק בטלפון' },
    el('div.ib-glow', { 'aria-hidden': 'true' }),
    el('div.ib-phone', { 'aria-hidden': 'true' },
      el('div.ib-screen', {}, el('span.ib-app', {}, '🎬'), el('span.ib-spark.s1', {}, '✨'), el('span.ib-spark.s2', {}, '⭐'), el('span.ib-spark.s3', {}, '🔔')),
    ),
    el('div.ib-text', {},
      el('span.ib-kicker', {}, '🎮 שדרוג לערוץ'),
      el('h2', {}, 'התקן את המשחק בטלפון!'),
      el('p', {}, 'אייקון במסך הבית · מסך מלא בלי דפדפן · עובד גם בלי אינטרנט'),
      el('div.ib-actions', {},
        el('button.ib-btn', { type: 'button', onclick: () => { sfx('coin'); openInstallSheet(); } },
          el('span.ib-btn-ico', {}, '📲'), el('span', {}, installState.canInstall ? 'התקן עכשיו – זה חינם' : 'איך מתקינים?')),
        el('button.ib-later', { type: 'button', 'aria-label': 'לא עכשיו', onclick: () => {
          store.update((s) => ({ ...s, settings: { ...s.settings, installDismissedUntil: Date.now() + 3 * 86400000 } }));
          card.classList.add('leaving');
          setTimeout(() => { card.remove(); onDismiss?.(); }, 350);
        } }, 'אחר כך'),
      ),
    ),
  );
  return card;
}

// Compact button for the profile/settings screen
export function installButton() {
  if (isStandalone()) return el('div.installed-ok', {}, '✅ המשחק מותקן במכשיר הזה');
  return el('button.ib-btn.full', { type: 'button', onclick: () => { sfx('coin'); openInstallSheet(); } },
    el('span.ib-btn-ico', {}, '📲'), el('span', {}, installState.canInstall ? 'התקן את המשחק בטלפון' : 'איך מתקינים בטלפון?'));
}

// Bottom sheet: native prompt when available, otherwise per-platform steps
export function openInstallSheet() {
  document.querySelector('.sheet-backdrop')?.remove();
  const steps = instructions();
  const close = () => { backdrop.classList.add('closing'); setTimeout(() => backdrop.remove(), 250); };

  const nativeBtn = installState.canInstall
    ? el('button.ib-btn.full.pulse', { type: 'button', onclick: async () => { await promptInstall(); close(); } }, el('span.ib-btn-ico', {}, '📲'), el('span', {}, 'התקן עכשיו'))
    : null;

  const backdrop = el('div.sheet-backdrop', { onclick: (e) => { if (e.target === backdrop) close(); } },
    el('div.sheet', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'sheet-title' },
      el('div.sheet-handle', { 'aria-hidden': 'true' }),
      el('div.sheet-hero', {}, el('span.sheet-icon', {}, steps.icon), el('h2#sheet-title', {}, steps.title)),
      nativeBtn,
      nativeBtn ? el('p.muted.center', {}, 'או ידנית:') : null,
      el('ol.sheet-steps', {}, ...steps.list.map((s) => el('li', {}, el('span.step-ico', {}, s[0]), el('span', { html: s[1] })))),
      el('div.sheet-perks', {},
        perk('⚡', 'נפתח מיד'), perk('📴', 'בלי אינטרנט'), perk('🖥️', 'מסך מלא'), perk('💾', 'ההתקדמות נשמרת'),
      ),
      el('button.ghost', { type: 'button', onclick: close }, 'סגור'),
    ),
  );
  document.body.append(backdrop);
  requestAnimationFrame(() => backdrop.classList.add('open'));
  backdrop.querySelector('button')?.focus();
  const onKey = (e) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } };
  document.addEventListener('keydown', onKey);
}

function perk(icon, text) { return el('div.perk', {}, el('span', {}, icon), el('small', {}, text)); }

function instructions() {
  if (isIOS) {
    return {
      icon: '', title: 'התקנה באייפון / אייפד',
      list: [
        ['1️⃣', isSafari ? 'למטה במסך לחצו על כפתור <b>שיתוף</b> <span class="kbd">⬆️</span>' : 'פתחו את הכתובת הזו ב-<b>Safari</b> (רק משם אפשר להתקין)'],
        ['2️⃣', 'גללו ובחרו <b>"הוסף למסך הבית"</b> <span class="kbd">➕</span>'],
        ['3️⃣', 'לחצו <b>"הוסף"</b> – ה-🎬 יופיע במסך הבית!'],
      ],
    };
  }
  if (isAndroid) {
    return {
      icon: '🤖', title: 'התקנה באנדרואיד',
      list: [
        ['1️⃣', 'לחצו על <b>⋮</b> (שלוש הנקודות) למעלה בדפדפן'],
        ['2️⃣', 'בחרו <b>"התקנת אפליקציה"</b> או <b>"הוסף למסך הבית"</b>'],
        ['3️⃣', 'אשרו – ה-🎬 יופיע במסך הבית!'],
      ],
    };
  }
  return {
    icon: '💻', title: 'התקנה במחשב',
    list: [
      ['1️⃣', 'בשורת הכתובת למעלה יש אייקון <b>התקנה</b> <span class="kbd">⊕</span> (Chrome / Edge)'],
      ['2️⃣', 'או: תפריט <b>⋮</b> → <b>"התקנת English Studio"</b>'],
      ['3️⃣', 'המשחק ייפתח בחלון משלו כמו אפליקציה'],
    ],
  };
}
