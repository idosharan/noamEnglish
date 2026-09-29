import { el } from '../core/utils.js';
import { store } from '../core/store.js';
import { navigate } from '../core/router.js';
import { WORLDS, modeById, roundLength } from '../exercises/index.js';
import { EXAM_WORDS, wordByEn } from '../data/words.js';

const pct = (c, t) => (t ? Math.round((c / t) * 100) : 0);

function wordLabel(key) {
  if (key.startsWith('letter:')) { const c = key.slice(7); return { en: `${c.toUpperCase()}${c}`, he: 'אות' }; }
  if (key === 'name') return { en: 'Noam', he: 'כתיבת השם' };
  const w = wordByEn(key);
  return { en: w?.display || key, he: w?.he || '' };
}

export function renderParent(root) {
  const state = store.get();
  const stats = Object.values(state.stats);
  const rounds = stats.reduce((s, m) => s + (m.rounds || 0), 0);
  const correct = stats.reduce((s, m) => s + (m.correct || 0), 0);
  const total = stats.reduce((s, m) => s + (m.total || 0), 0);
  const exam = state.stats.exam;
  const words = Object.entries(state.words || {}).map(([k, v]) => ({ key: k, ...v, t: v.c + v.w, acc: pct(v.c, v.c + v.w) }));
  const weak = words.filter((w) => w.w > 0 && (w.acc < 70 || !w.lastOk)).sort((a, b) => a.acc - b.acc || b.w - a.w).slice(0, 20);
  const strong = words.filter((w) => w.t >= 3 && w.acc >= 90).length;
  const unseen = EXAM_WORDS.filter((w) => !state.words?.[w.en]);

  root.innerHTML = '';
  root.append(
    el('section.parent', {},
      el('div.page-head', {},
        el('button.icon-btn', { type: 'button', 'aria-label': 'חזרה', onclick: () => navigate('/profile') }, '→'),
        el('h1', {}, '👨‍👩‍👦 מסך הורים'),
      ),
      el('p.muted', {}, 'מבחן מיפוי: 15/10/2026 · החומר: אותיות וצלילים, ch/sh/th, מספרים 1-12, אוצר מילים, קריאה, כתיבת השם.'),

      el('div.kpis', {},
        kpi('🎮', String(rounds), 'סבבים'),
        kpi('🎯', `${pct(correct, total)}%`, 'דיוק כללי'),
        kpi('📝', exam?.rounds ? String(pct(exam.best, roundLength(modeById('exam')))) : '—', 'ציון מבחן ניסיון'),
        kpi('💪', String(strong), 'מילים שנשלטות'),
      ),

      el('h2', {}, 'לפי נושא'),
      el('div.list-card', {}, ...WORLDS.map((w) => {
        const s = w.modes.map((m) => state.stats[m.id]).filter(Boolean);
        const c = s.reduce((a, m) => a + m.correct, 0);
        const t = s.reduce((a, m) => a + m.total, 0);
        const p = pct(c, t);
        return el('div.topic-row', {},
          el('span.topic-name', {}, `${w.icon} ${w.title}`),
          el('div.bar', {}, el('div', { class: `fill ${t && p < 60 ? 'low' : ''}`, style: `width:${t ? Math.max(3, p) : 0}%` })),
          el('span.num.topic-val', {}, t ? `${p}%` : 'עוד לא'),
        );
      })),

      el('h2', {}, `⚠️ מילים לחיזוק (${weak.length})`),
      weak.length
        ? el('div.word-table', {}, ...weak.map((w) => {
          const l = wordLabel(w.key);
          return el('div.word-row', {},
            el('span.en.word-en', {}, l.en), el('span.word-he', {}, l.he),
            el('span.num.word-score', {}, `✓${w.c} ✗${w.w}`),
          );
        }))
        : el('p.muted', {}, 'אין עדיין מילים חלשות — ממשיכים לתרגל 🎉'),

      el('h2', {}, `👀 מילים מהמבחן שעוד לא תורגלו (${unseen.length})`),
      unseen.length
        ? el('div.tag-cloud', {}, ...unseen.map((w) => el('span.tag', {}, el('span.en', {}, w.display || w.en), ` ${w.he}`)))
        : el('p.muted', {}, 'כל מילות המבחן תורגלו לפחות פעם אחת ✅'),

      el('button.primary.big', { type: 'button', onclick: () => navigate('/play/exam?level=1') }, '📝 מבחן ניסיון'),
    ),
  );
}

function kpi(icon, value, label) {
  return el('div.kpi', {}, el('span.kpi-icon', {}, icon), el('strong.num', {}, value), el('small', {}, label));
}
