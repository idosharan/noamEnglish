import { el, escapeHtml } from '../core/utils.js';
import { store } from '../core/store.js';
import { speak, sfx, vibrate, stopSpeaking } from '../core/audio.js';
import { burst } from '../core/confetti.js';
import { navigate } from '../core/router.js';
import { modeById, QUESTIONS_PER_ROUND, LEVEL_LABELS } from '../exercises/index.js';
import { maxDifficultyFor, comboMultiplier } from '../game/xp.js';
import { applyRound } from '../game/round.js';
import { setLastResult } from './results.js';

export function renderPlay(root, { params, query }) {
  const mode = modeById(params.mode);
  if (!mode) { navigate('/studio', { replace: true }); return; }
  const state = store.get();
  const level = Math.min(Number(query.level) || 1, maxDifficultyFor(state.level));

  const answers = [];
  let combo = 0;
  let finished = false;
  let cleanups = [];
  let advanceTimer = 0;

  const dots = el('div.progress-dots', { role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': QUESTIONS_PER_ROUND, 'aria-valuenow': 0 });
  const comboEl = el('div.combo', { 'aria-live': 'off' });
  const feedback = el('div.feedback', { role: 'status', 'aria-live': 'polite' });
  const stage = el('div.stage');

  const header = el('header.play-head', {},
    el('button.icon-btn', { type: 'button', 'aria-label': 'יציאה', onclick: quit }, '✕'),
    el('div.play-title', {}, el('span.mode-icon', {}, mode.icon), el('div', {}, el('strong', {}, mode.title), el('small', {}, `רמה: ${LEVEL_LABELS[level]}`))),
    comboEl,
  );

  root.innerHTML = '';
  root.append(el('section.play', {}, header, mode.kind === 'questions' ? dots : null, stage, feedback));
  drawDots();

  const api = {
    level,
    speak: (text, opts) => speak(text, opts),
    sfx,
    onCleanup: (fn) => cleanups.push(fn),
    answer(correct, { text = '', silent = false } = {}) {
      if (finished) return;
      answers.push({ correct });
      combo = correct ? combo + 1 : 0;
      drawDots();
      drawCombo();
      if (correct) {
        sfx(combo >= 3 && combo % 3 === 0 ? 'combo' : 'correct');
        vibrate(30);
        if (combo >= 3 && combo % 3 === 0) burst({ count: 40 });
      } else {
        sfx('wrong');
        vibrate([60, 40, 60]);
      }
      showFeedback(text, correct);
      if (mode.kind === 'questions') {
        if (answers.length >= QUESTIONS_PER_ROUND) {
          advanceTimer = setTimeout(() => finish({}), correct ? 900 : 1500);
        } else {
          advanceTimer = setTimeout(nextQuestion, correct ? 900 : 1600);
        }
      }
      void silent;
    },
    finish(extra) { finish(extra || {}); },
  };

  const gen = mode.create(level, api);

  function nextQuestion() {
    if (finished) return;
    runCleanups();
    stopSpeaking();
    stage.innerHTML = '';
    feedback.textContent = '';
    feedback.className = 'feedback';
    stage.classList.remove('enter');
    void stage.offsetWidth;
    stage.classList.add('enter');
    gen.next().render(stage, api);
  }

  function showFeedback(text, ok) {
    feedback.innerHTML = `<span class="fb-icon">${ok ? '✅' : '❌'}</span> <span>${escapeHtml(text || (ok ? 'נכון!' : 'לא נכון'))}</span>`;
    feedback.className = `feedback show ${ok ? 'ok' : 'bad'}`;
  }

  function drawDots() {
    dots.innerHTML = '';
    for (let i = 0; i < QUESTIONS_PER_ROUND; i++) {
      const a = answers[i];
      dots.append(el('span', { class: `dot ${a ? (a.correct ? 'ok' : 'bad') : i === answers.length ? 'current' : ''}` }));
    }
    dots.setAttribute('aria-valuenow', answers.length);
  }

  function drawCombo() {
    const mult = comboMultiplier(combo);
    comboEl.textContent = mult > 1 ? `🔥 x${mult}` : combo > 0 ? `רצף ${combo}` : '';
    comboEl.classList.toggle('hot', mult > 1);
  }

  function runCleanups() {
    cleanups.forEach((fn) => { try { fn(); } catch { /* ignore */ } });
    cleanups = [];
  }

  function finish({ won = false, elapsedSec = null, text = '' }) {
    if (finished) return;
    finished = true;
    clearTimeout(advanceTimer);
    runCleanups();
    stopSpeaking();
    if (!answers.length) { navigate('/studio', { replace: true }); return; }
    const { state: next, summary } = applyRound(store.get(), { mode: mode.id, answers, won, elapsedSec });
    store.set(next);
    setLastResult({ ...summary, level, text });
    if (text) showFeedback(text, won || summary.correct >= summary.total / 2);
    setTimeout(() => navigate('/results', { replace: true }), text ? 1200 : 300);
  }

  function quit() {
    if (finished) return;
    if (answers.length && !confirm('לצאת מהסבב? ההתקדמות של הסבב הזה תישמר.')) return;
    if (answers.length) finish({});
    else { finished = true; clearTimeout(advanceTimer); runCleanups(); stopSpeaking(); navigate('/studio'); }
  }

  nextQuestion();

  return () => { finished = true; clearTimeout(advanceTimer); runCleanups(); stopSpeaking(); };
}
