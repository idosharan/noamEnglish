import { todayKey, daysBetween } from './utils.js';
import { levelFor } from '../game/xp.js';
import { questsFor } from '../game/quests.js';

export const STORAGE_KEY = 'noam_english_v2';
export const LEGACY_KEY = 'noam_english_progress';
export const STATE_VERSION = 2;

export function defaultState() {
  return {
    version: STATE_VERSION,
    profile: { name: '', avatar: 'gamer' },
    subs: 0,
    likes: 0,
    level: 1,
    bestCombo: 0,
    streak: { count: 0, best: 0, lastDay: null },
    quests: { day: null, items: [] },
    badges: [],
    stats: {},
    unlockedAvatars: ['gamer', 'cat', 'robot'],
    settings: { muted: false, theme: 'dark', reducedMotion: false },
    onboarded: false,
  };
}

// Pure: merge legacy {mode:{correct,total}} into stats
export function migrateLegacy(state, legacy) {
  if (!legacy || typeof legacy !== 'object') return state;
  const stats = { ...state.stats };
  for (const [mode, v] of Object.entries(legacy)) {
    if (!v || typeof v !== 'object') continue;
    const cur = stats[mode] || emptyModeStats();
    stats[mode] = { ...cur, correct: cur.correct + (v.correct || 0), total: cur.total + (v.total || 0) };
  }
  return { ...state, stats };
}

export function emptyModeStats() {
  return { correct: 0, total: 0, rounds: 0, perfect: 0, best: 0, wins: 0, bestTime: null };
}

// Pure: ensure quests belong to today and streak is consistent with today
export function refreshDaily(state, day = todayKey()) {
  let next = state;
  if (state.quests.day !== day) next = { ...next, quests: questsFor(day) };
  if (state.streak.lastDay && daysBetween(state.streak.lastDay, day) > 1) {
    next = { ...next, streak: { ...next.streak, count: 0 } };
  }
  return next;
}

// Pure: mark activity today, bump streak once per day
export function touchStreak(state, day = todayKey()) {
  const { lastDay, count, best } = state.streak;
  if (lastDay === day) return state;
  const continues = lastDay && daysBetween(lastDay, day) === 1;
  const newCount = continues ? count + 1 : 1;
  return { ...state, streak: { count: newCount, best: Math.max(best, newCount), lastDay: day } };
}

export function addRewards(state, { subs = 0, likes = 0 }) {
  const total = state.subs + subs;
  return { ...state, subs: total, likes: state.likes + likes, level: levelFor(total) };
}

export function recordRound(state, { mode, correct, total, perfect, won, elapsedSec, maxCombo = 0 }) {
  const cur = state.stats[mode] || emptyModeStats();
  const next = {
    ...cur,
    correct: cur.correct + correct,
    total: cur.total + total,
    rounds: cur.rounds + 1,
    perfect: cur.perfect + (perfect ? 1 : 0),
    best: Math.max(cur.best, correct),
    wins: cur.wins + (won ? 1 : 0),
    bestTime: elapsedSec != null ? Math.min(cur.bestTime ?? Infinity, elapsedSec) : cur.bestTime,
  };
  return { ...state, stats: { ...state.stats, [mode]: next }, bestCombo: Math.max(state.bestCombo || 0, maxCombo) };
}

// ---- persistence wrapper (browser) ----
let current = null;
const listeners = new Set();

export function createStore(storage) {
  return {
    load() {
      let state = defaultState();
      try {
        const raw = storage.getItem(STORAGE_KEY);
        if (raw) state = { ...state, ...JSON.parse(raw) };
        else {
          const legacy = storage.getItem(LEGACY_KEY);
          if (legacy) state = migrateLegacy(state, JSON.parse(legacy));
        }
      } catch { /* corrupt storage → fresh state */ }
      state = refreshDaily(state);
      state.level = levelFor(state.subs);
      this.set(state);
      return state;
    },
    get() { return current; },
    set(state) {
      current = state;
      try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* quota / private mode */ }
      listeners.forEach((fn) => fn(state));
      return state;
    },
    update(fn) { return this.set(fn(current)); },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    reset() { storage.removeItem(STORAGE_KEY); storage.removeItem(LEGACY_KEY); return this.load(); },
  };
}

export const store = typeof localStorage !== 'undefined' ? createStore(localStorage) : null;
