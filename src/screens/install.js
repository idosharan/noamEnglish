import { el } from '../core/utils.js';
import { store } from '../core/store.js';
import { sfx } from '../core/audio.js';
import { installState, promptInstall, isStandalone, toast } from '../app.js';

const ua = navigator.userAgent;
const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isAndroid = /android/i.test(ua);
const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios|edg/i.test(ua);
const isSamsung = /SamsungBrowser/i.test(ua);
const isFirefox = /firefox|fxios/i.test(ua);
const isSecure = window.isSecureContext;

export function shouldShowInstall(state) {
  if (isStandalone()) return false;
  const until = state.settings.installDismissedUntil || 0;
  return Date.now() > until;
}

function mainLabel() {
  return installState.canInstall ? 'התקן עכשיו – זה חינם' : 'התקן בטלפון';
}

// Animated hero card shown in the Studio
export function installBanner({ onDismiss } = {}) {
  const label = el('span', {}, mainLabel());
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
        el('button.ib-btn', { type: 'button', onclick: () => { sfx('coin'); install(); } }, el('span.ib-btn-ico', {}, '📲'), label),
        el('button.ib-later', { type: 'button', 'aria-label': 'לא עכשיו', onclick: () => {
          store.update((s) => ({ ...s, settings: { ...s.settings, installDismissedUntil: Date.now() + 3 * 86400000 } }));
          card.classList.add('leaving');
          setTimeout(() => { card.remove(); onDismiss?.(); }, 350);
        } }, 'אחר כך'),
      ),
    ),
  );
  window.addEventListener('es:installable', () => { label.textContent = mainLabel(); });
  return card;
}

// Compact button for the profile/settings screen
export function installButton() {
  if (isStandalone()) return el('div.installed-ok', {}, '✅ המשחק מותקן במכשיר הזה');
  return el('button.ib-btn.full', { type: 'button', onclick: () => { sfx('coin'); install(); } },
    el('span.ib-btn-ico', {}, '📲'), el('span', {}, installState.canInstall ? 'התקן את המשחק בטלפון' : 'התקן בטלפון'));
}

// One tap: native prompt if the browser offers it, otherwise the guided sheet
async function install() {
  if (installState.canInstall) {
    const outcome = await promptInstall();
    if (outcome === 'accepted') { toast('מתקין… חפשו את 🎬 במסך הבית 🎉'); return; }
    if (outcome === 'dismissed') return;
  }
  openInstallSheet();
}

// Bottom sheet: native prompt when available (also if it becomes available while open), otherwise per-platform steps
export function openInstallSheet() {
  document.querySelector('.sheet-backdrop')?.remove();
  const steps = instructions();
  const nativeArea = el('div.native-area');

  const renderNative = () => {
    nativeArea.innerHTML = '';
    if (!installState.canInstall) return;
    nativeArea.append(
      el('button.ib-btn.full.pulse', { type: 'button', onclick: async () => { const r = await promptInstall(); if (r === 'accepted') close(); else renderNative(); } },
        el('span.ib-btn-ico', {}, '📲'), el('span', {}, 'התקן עכשיו בלחיצה אחת')),
      el('p.muted.center', {}, 'או ידנית:'),
    );
  };

  const onAvail = () => renderNative();
  window.addEventListener('es:installable', onAvail);
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  const close = () => {
    window.removeEventListener('es:installable', onAvail);
    document.removeEventListener('keydown', onKey);
    backdrop.classList.add('closing');
    setTimeout(() => backdrop.remove(), 250);
  };

  const backdrop = el('div.sheet-backdrop', { onclick: (e) => { if (e.target === backdrop) close(); } },
    el('div.sheet', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'sheet-title' },
      el('div.sheet-handle', { 'aria-hidden': 'true' }),
      el('div.sheet-hero', {}, el('span.sheet-icon', {}, steps.icon), el('h2#sheet-title', {}, steps.title)),
      !isSecure ? el('div.sheet-warn', {}, '⚠️ ', el('span', { html: 'התקנה אפשרית רק מכתובת מאובטחת (<b>https://</b>). פתחו את המשחק מהקישור של GitHub Pages ואז לחצו שוב.' })) : null,
      nativeArea,
      el('ol.sheet-steps', {}, ...steps.list.map((s) => el('li', {}, el('span.step-ico', {}, s[0]), el('span', { html: s[1] })))),
      steps.note ? el('p.muted.center.small-text', {}, steps.note) : null,
      el('div.sheet-perks', {},
        perk('⚡', 'נפתח מיד'), perk('📴', 'בלי אינטרנט'), perk('🖥️', 'מסך מלא'), perk('💾', 'ההתקדמות נשמרת'),
      ),
      el('button.ghost', { type: 'button', onclick: close }, 'סגור'),
    ),
  );
  document.body.append(backdrop);
  renderNative();
  requestAnimationFrame(() => backdrop.classList.add('open'));
  backdrop.querySelector('button')?.focus();
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
  if (isAndroid && isSamsung) {
    return {
      icon: '🤖', title: 'התקנה ב-Samsung Internet',
      list: [
        ['1️⃣', 'לחצו על <b>≡</b> (תפריט) למטה בדפדפן'],
        ['2️⃣', 'בחרו <b>"הוסף דף אל"</b> → <b>"מסך הבית"</b>, או על אייקון ההתקנה <span class="kbd">⤓</span> בשורת הכתובת'],
        ['3️⃣', 'אשרו – ה-🎬 יופיע במסך הבית!'],
      ],
    };
  }
  if (isAndroid && isFirefox) {
    return {
      icon: '🦊', title: 'התקנה ב-Firefox',
      list: [
        ['1️⃣', 'לחצו על <b>⋮</b> למעלה בדפדפן'],
        ['2️⃣', 'בחרו <b>"התקנה"</b> / <b>"הוסף למסך הבית"</b>'],
        ['3️⃣', 'אשרו – ה-🎬 יופיע במסך הבית!'],
      ],
    };
  }
  if (isAndroid) {
    return {
      icon: '🤖', title: 'התקנה באנדרואיד (Chrome)',
      list: [
        ['1️⃣', 'לחצו על <b>⋮</b> (שלוש הנקודות) למעלה בדפדפן'],
        ['2️⃣', 'בחרו <b>"התקנת אפליקציה"</b> / <b>"הוסף למסך הבית"</b> → <b>"התקנה"</b>'],
        ['3️⃣', 'אשרו – ה-🎬 יופיע במסך הבית!'],
      ],
      note: isSecure ? 'אם כבר התקנתם – Chrome יציג "פתיחת האפליקציה" במקום התקנה. חפשו את 🎬 במסך הבית.' : '',
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
