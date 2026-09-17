// Hash router: '#/play/:mode?level=2' → handler({ params, query })
const routes = [];
let notFound = null;
let currentCleanup = null;

export function onRoute(pattern, handler) {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$');
  routes.push({ re, keys, handler });
}

export function setNotFound(handler) { notFound = handler; }

export function navigate(path, { replace = false } = {}) {
  const hash = '#' + path;
  if (replace) history.replaceState(null, '', hash);
  else location.hash = path;
  if (replace) dispatch();
}

export function currentPath() {
  return location.hash.replace(/^#/, '') || '/';
}

function dispatch() {
  const full = currentPath();
  const [path, qs = ''] = full.split('?');
  const query = Object.fromEntries(new URLSearchParams(qs));
  if (typeof currentCleanup === 'function') { try { currentCleanup(); } catch { /* ignore */ } }
  currentCleanup = null;
  for (const r of routes) {
    const m = path.match(r.re);
    if (m) {
      const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
      currentCleanup = r.handler({ params, query, path });
      window.scrollTo({ top: 0 });
      return;
    }
  }
  currentCleanup = notFound?.({ path, query });
}

export function start() {
  window.addEventListener('hashchange', dispatch);
  dispatch();
}
