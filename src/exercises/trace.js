import { el } from '../core/utils.js';
import { prompt, pickFresh } from './common.js';

const FONT = 'Andika, "Comic Sans MS", "Segoe Print", sans-serif';

// Canvas tracing board with the 4-line writing guide. onResult(ok) fires once the kid presses "check".
export function traceBoard(text, { onResult, sfx }) {
  const wrap = el('div.trace-wrap');
  const canvas = el('canvas.trace-canvas', { dir: 'ltr', 'aria-label': `כתיבה של ${text}` });
  const msg = el('div.trace-msg', { role: 'status', 'aria-live': 'polite' });
  const clearBtn = el('button.ghost.small', { type: 'button' }, '🧽 נקה');
  const checkBtn = el('button.primary', { type: 'button' }, '✓ בדיקה');
  wrap.append(canvas, msg, el('div.actions', {}, clearBtn, checkBtn));

  const ctx = canvas.getContext('2d');
  let strokes = [];
  let current = null;
  let geo = null;
  let attempts = 0;
  let done = false;

  function layout() {
    const w = Math.min(wrap.clientWidth || 340, 560);
    const h = Math.round(Math.min(320, Math.max(220, w * 0.62)));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.direction = 'ltr';
    ctx.textAlign = 'left';
    let size = h * 0.72;
    ctx.font = `700 ${size}px ${FONT}`;
    const width = ctx.measureText(text).width;
    if (width > w * 0.86) size *= (w * 0.86) / width;
    ctx.font = `700 ${size}px ${FONT}`;
    const m = (s) => ctx.measureText(s);
    const base = h * 0.74;
    geo = {
      w, h, size, base,
      top: base - m('H').actualBoundingBoxAscent,
      mid: base - m('x').actualBoundingBoxAscent,
      desc: base + m('g').actualBoundingBoxDescent,
      x: (w - ctx.measureText(text).width) / 2,
      pen: Math.max(8, size * 0.11),
    };
  }

  function drawGuide(c, g, { fill, stroke, lineWidth = 0 }) {
    c.font = `700 ${g.size}px ${FONT}`;
    // the page is RTL; canvas text must be anchored left-to-right or the guide and the scoring mask drift apart
    c.direction = 'ltr';
    c.textAlign = 'left';
    c.textBaseline = 'alphabetic';
    if (fill) { c.fillStyle = fill; c.fillText(text, g.x, g.base); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lineWidth; c.lineJoin = 'round'; c.strokeText(text, g.x, g.base); }
  }

  function drawStrokes(c, color, width) {
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round';
    for (const s of strokes) {
      c.beginPath();
      s.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
      if (s.length === 1) c.lineTo(s[0].x + 0.1, s[0].y);
      c.stroke();
    }
  }

  function render() {
    const { w, h } = geo;
    ctx.clearRect(0, 0, w, h);
    const css = getComputedStyle(canvas);
    const lineCol = css.getPropertyValue('--trace-line').trim() || '#6b7bb8';
    ctx.lineWidth = 2;
    ctx.strokeStyle = lineCol;
    for (const [y, dashed] of [[geo.top, false], [geo.mid, true], [geo.base, false], [geo.desc, false]]) {
      ctx.setLineDash(dashed ? [10, 8] : []);
      ctx.beginPath(); ctx.moveTo(8, y); ctx.lineTo(w - 8, y); ctx.stroke();
    }
    ctx.setLineDash([]);
    drawGuide(ctx, geo, { fill: css.getPropertyValue('--trace-guide').trim() || 'rgba(255,255,255,.25)' });
    ctx.setLineDash([6, 6]);
    drawGuide(ctx, geo, { stroke: css.getPropertyValue('--trace-line').trim() || '#6b7bb8', lineWidth: 2 });
    ctx.setLineDash([]);
    drawStrokes(ctx, css.getPropertyValue('--trace-ink').trim() || '#b6f36a', geo.pen);
  }

  // Compares the kid's ink with the letter shape on a small offscreen canvas
  function score() {
    const s = 0.25;
    const W = Math.ceil(geo.w * s), H = Math.ceil(geo.h * s);
    const off = (paint) => {
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const x = c.getContext('2d', { willReadFrequently: true });
      x.scale(s, s);
      paint(x);
      return x.getImageData(0, 0, W, H).data;
    };
    const glyph = off((x) => drawGuide(x, geo, { fill: '#000' }));
    const zone = off((x) => drawGuide(x, geo, { fill: '#000', stroke: '#000', lineWidth: geo.pen * 2.2 }));
    const ink = off((x) => drawStrokes(x, '#000', geo.pen * 1.3));
    let g = 0, gi = 0, u = 0, uz = 0;
    for (let i = 3; i < glyph.length; i += 4) {
      const inG = glyph[i] > 100, inU = ink[i] > 100;
      if (inG) { g++; if (inU) gi++; }
      if (inU) { u++; if (zone[i] > 100) uz++; }
    }
    return { coverage: g ? gi / g : 0, precision: u ? uz / u : 0 };
  }

  const pos = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  canvas.addEventListener('pointerdown', (e) => {
    if (done) return;
    try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic / stale pointer */ }
    current = [pos(e)];
    strokes.push(current);
    render();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!current) return;
    current.push(pos(e));
    render();
  });
  const end = () => { current = null; };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  clearBtn.addEventListener('click', () => { if (done) return; strokes = []; msg.textContent = ''; render(); });
  checkBtn.addEventListener('click', () => {
    if (done) return;
    if (!strokes.length) { msg.textContent = 'כתבו עם האצבע על הקווים ✍️'; return; }
    const { coverage, precision } = score();
    const ok = coverage >= 0.6 && precision >= 0.7;
    attempts++;
    if (!ok && attempts < 2) {
      sfx?.('wrong');
      msg.textContent = coverage < 0.6 ? 'כמעט! עברו על כל האות 🙂 נסו שוב' : 'נסו להישאר בתוך האות 🙂';
      strokes = [];
      render();
      return;
    }
    done = true;
    clearBtn.disabled = checkBtn.disabled = true;
    wrap.classList.add(ok ? 'is-correct' : 'is-wrong');
    onResult(ok);
  });

  const init = () => { layout(); render(); };
  const ro = new ResizeObserver(() => { if (!strokes.length) init(); });
  requestAnimationFrame(() => {
    ro.observe(wrap);
    (document.fonts?.load(`700 40px Andika`) || Promise.resolve()).catch(() => {}).then(init);
  });
  wrap.cleanup = () => ro.disconnect();
  return wrap;
}

const UPPER = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((c) => ({ en: c }));
const LOWER = [...'abcdefghijklmnopqrstuvwxyz'].map((c) => ({ en: c }));
const TRACE_WORDS = ['cat', 'dog', 'fish', 'milk', 'egg', 'bed', 'bag', 'sad', 'ship', 'Noam'].map((en) => ({ en }));

export default {
  id: 'trace', title: 'כתיבת אותיות', desc: 'עוברים עם האצבע על האותיות', icon: '✏️', kind: 'questions', count: 6,
  create(level, api) {
    const pool = level === 1 ? UPPER : level === 2 ? LOWER : TRACE_WORDS;
    const used = new Set();
    return {
      next() {
        const item = pickFresh(pool, used);
        const isLetter = item.en.length === 1;
        return {
          render(container) {
            const board = traceBoard(item.en, {
              sfx: api.sfx,
              onResult: (ok) => api.answer(ok, { word: isLetter ? `letter:${item.en.toLowerCase()}` : item.en, text: ok ? 'כתיבה יפה!' : 'לא נורא, ממשיכים לתרגל' }),
            });
            api.onCleanup(() => board.cleanup?.());
            container.append(
              prompt(isLetter ? `כתבו את האות ${item.en}` : `כתבו את המילה ${item.en}`, 'עברו עם האצבע על האות האפורה'),
              board,
            );
            setTimeout(() => (isLetter ? api.speakLetter(item.en) : api.speak(item.en)), 300);
          },
        };
      },
    };
  },
};
