import { store } from './core/store.js';
import { onRoute, setNotFound, navigate, start, currentPath } from './core/router.js';
import { setMuted, unlockAudio } from './core/audio.js';
import { maxDifficultyFor } from './game/xp.js';
import { renderOnboarding } from './screens/onboarding.js';
import { renderStudio } from './screens/studio.js';
import { renderPlay } from './screens/play.js';
import { renderResults } from './screens/results.js';
import { renderProfile } from './screens/profile.js';

export const installState = {
  get prompt() { return window.__installPrompt || null; },
  get canInstall() { return !!window.__installPrompt; },
};

export function isStandalone() {
  return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}

// Returns 'accepted' | 'dismissed' | 'unavailable'
export async function promptInstall() {
  const ev = window.__installPrompt;
  if (!ev) return 'unavailable';
  window.__installPrompt = null;
  try {
    ev.prompt();
    const { outcome } = await ev.userChoice;
    if (outcome === 'accepted') document.querySelectorAll('.install-banner').forEach((b) => b.remove());
    return outcome;
  } catch {
    return 'unavailable';
  }
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f5f3ff' : '#0b0f1e');
}

export function toast(msg, { actionLabel, onAction, duration = 2500 } = {}) {
  const t = document.getElementById('toast');
  t.innerHTML = '';
  t.append(document.createTextNode(msg));
  if (actionLabel) {
    const b = document.createElement('button');
    b.textContent = actionLabel;
    b.className = 'toast-action';
    b.addEventListener('click', () => { onAction?.(); t.hidden = true; });
    t.append(b);
  }
  t.hidden = false;
  clearTimeout(t._timer);
  if (!actionLabel) t._timer = setTimeout(() => (t.hidden = true), duration);
}

function boot() {
  const state = store.load();
  setMuted(state.settings.muted);
  applyTheme(state.settings.theme || 'dark');

  const root = document.getElementById('app');
  const nav = document.getElementById('bottom-nav');

  const guard = (render) => (ctx) => {
    if (!store.get().onboarded) { navigate('/onboarding', { replace: true }); return; }
    return render(root, ctx);
  };

  onRoute('/', () => navigate(store.get().onboarded ? '/studio' : '/onboarding', { replace: true }));
  onRoute('/onboarding', () => renderOnboarding(root));
  onRoute('/studio', guard(renderStudio));
  onRoute('/play/:mode', guard(renderPlay));
  onRoute('/results', guard(renderResults));
  onRoute('/profile', guard(renderProfile));
  setNotFound(() => navigate('/', { replace: true }));

  window.addEventListener('hashchange', () => updateNav(nav));
  store.subscribe(() => updateNav(nav));
  updateNav(nav);

  document.addEventListener('pointerdown', unlockAudio, { once: true });
  window.addEventListener('es:installable', () => {
    if (currentPath() === '/studio') renderStudio(root);
  });
  window.addEventListener('appinstalled', () => {
    document.querySelectorAll('.install-banner, .sheet-backdrop').forEach((b) => b.remove());
    toast('המשחק הותקן! חפשו את 🎬 במסך הבית 🎉');
  });

  registerServiceWorker();
  start();
}

function updateNav(nav) {
  const path = currentPath();
  const state = store.get();
  const onboarded = state?.onboarded;
  nav.hidden = !onboarded || path.startsWith('/play') || path === '/onboarding';
  const bossLink = nav.querySelector('.boss-link');
  if (bossLink && state) bossLink.href = `#/play/boss?level=${maxDifficultyFor(state.level)}`;
  nav.querySelectorAll('a').forEach((a) => {
    const active = path === a.dataset.route || (a.dataset.route === '/studio' && path === '/results');
    a.classList.toggle('active', active);
    a.setAttribute('aria-current', active ? 'page' : 'false');
  });
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  // local dev: skip caching so edits show immediately (add ?sw to the URL to test the worker)
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && !location.search.includes('sw')) {
    (await navigator.serviceWorker.getRegistrations()).forEach((r) => r.unregister());
    return;
  }
  try {
    const reg = await navigator.serviceWorker.register('./sw.js');
    reg.addEventListener('updatefound', () => {
      const sw = reg.installing;
      sw?.addEventListener('statechange', () => {
        if (sw.state === 'installed' && navigator.serviceWorker.controller) {
          toast('יש גרסה חדשה של המשחק', { actionLabel: 'רענן', onAction: () => { sw.postMessage({ type: 'SKIP_WAITING' }); } });
        }
      });
    });
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      location.reload();
    });
  } catch { /* SW unavailable (e.g. http on LAN) — app still works online */ }
}

document.addEventListener('DOMContentLoaded', boot);
