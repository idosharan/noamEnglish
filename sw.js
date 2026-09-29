/* English Studio service worker — app-shell precache + runtime cache for images */
const CACHE_VERSION = 'v3.0.0';
const SHELL_CACHE = `es-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `es-runtime-${CACHE_VERSION}`;

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/styles.css',
  './assets/fonts/rubik-hebrew.woff2', './assets/fonts/rubik-latin.woff2', './assets/fonts/andika-400.woff2', './assets/fonts/andika-700.woff2',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './src/app.js',
  './src/core/utils.js', './src/core/store.js', './src/core/audio.js', './src/core/router.js', './src/core/confetti.js',
  './src/game/xp.js', './src/game/quests.js', './src/game/badges.js', './src/game/round.js',
  './src/data/words.js', './src/data/reading.js', './src/data/avatars.js',
  './src/exercises/index.js', './src/exercises/common.js',
  './src/exercises/hearletter.js', './src/exercises/firstletter.js', './src/exercises/missing.js', './src/exercises/trace.js',
  './src/exercises/digraph.js', './src/exercises/sort.js', './src/exercises/translate.js', './src/exercises/vocabulary.js',
  './src/exercises/listening.js', './src/exercises/order.js', './src/exercises/spelling.js', './src/exercises/numbers.js',
  './src/exercises/reading.js', './src/exercises/myname.js', './src/exercises/boss.js', './src/exercises/exam.js',
  './src/screens/onboarding.js', './src/screens/studio.js', './src/screens/play.js', './src/screens/results.js',
  './src/screens/profile.js', './src/screens/parent.js', './src/screens/install.js',
  // word pictures, so every exercise works offline right after install
  ...['sing', 'test', 'bed', 'bag', 'big', 'egg', 'cow', 'ihave', 'has', 'dog', 'cat', 'sad', 'hat', 'man', 'dad', 'mat', 'hand',
    'pen', 'hen', 'elephant', 'pig', 'igloo', 'Iguana', 'box', 'sun', 'mouse'].map((n) => `./assets/img/${n}.png`),
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('es-') && k !== SHELL_CACHE && k !== RUNTIME_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // navigations → app shell (SPA with hash routing)
  if (request.mode === 'navigate') {
    event.respondWith(caches.match('./index.html').then((hit) => hit || fetch(request)));
    return;
  }

  event.respondWith(
    caches.match(request).then((hit) => {
      const network = fetch(request).then((res) => {
        if (res.ok) caches.open(RUNTIME_CACHE).then((c) => c.put(request, res.clone()));
        return res;
      }).catch(() => hit);
      // cache-first for shell & images, but refresh in background
      return hit || network;
    }),
  );
});
