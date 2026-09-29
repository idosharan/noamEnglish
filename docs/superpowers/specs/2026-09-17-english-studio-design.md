# English Studio — Design Spec (2026-09-17)

Rewrite of the Hebrew-UI English practice app for a 4th-grade gamer/YouTuber kid.
Approved by user on 2026-09-17.

## Goals
- Modern, mobile-first, accessible UI (Hebrew RTL, English LTR).
- Challenging: 10 exercise modes × 3 difficulty levels, Boss Battle timed mode.
- Gamified "my channel" theme: subs (XP), likes (currency), levels, badges, streak, daily quests, avatars.
- Installable PWA, fully offline, deployable to GitHub Pages at any sub-path (relative URLs only).
- No teacher mode. No build step. Vanilla ES modules + CSS.

## Content
- Existing 46 words keep PNG images (`assets/img/`).
- ~80 new words rendered as large emoji, categories: colors, numbers 1–20, family, school, food, animals, body, days, verbs, adjectives, gaming/YouTube (~20).
- Word shape: `{ en, he, emoji?, img?, example, category, level: 1|2|3 }`.
- ~40 new sentences `{ en, he, distractors[], level }`.
- 8 stories (4 existing + 4 new, 2 gamer-themed) `{ title, lines[], yesNo[], mcq[] }`.

## Exercises (10 questions per round; Boss is time-based)
| id | Easy (L1) | Medium (L2) | Hard (L3) |
|---|---|---|---|
| letters | 4 pictures, first letter | 4 pictures, incl. lookalike letters | 6 pictures, first or last letter |
| vocabulary | 4 options | 4 options, same category | 6 options |
| vowels | 1 missing vowel, 4 options | 1 missing vowel, 5 options (a/e/i/o/u) | 2 missing vowels |
| sentences | 3 Hebrew options | 4 options | 4 close distractors |
| story | yes/no | MCQ | MCQ, story hidden after listening |
| spelling | tap shuffled letter tiles | tiles + 2 extra letters | free typing |
| listening | hear word → 4 pictures | 6 pictures | same category distractors |
| builder | 4 words in order | 5–6 words | 6–7 words + 1 distractor |
| memory | 4 pairs | 6 pairs | 6 pairs + timer |
| boss | 60s, mixed questions, combo ×2/×3, boss HP 10, player HP 3 |

Difficulty is chosen per round (L2 unlocks at player level 3, L3 at level 6).

## Gamification
- Subs (XP): +10 per correct × combo (combo 3+ → ×2, 6+ → ×3), perfect round +50, boss win +100.
- Likes: +1 per correct, +20 per completed daily quest; spent on avatars.
- Level thresholds: cumulative subs 0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000 …(×2). Level names shown as milestone plaques (100 / 1K / 10K / 100K / 1M "Gold Button").
- Streak: consecutive calendar days with ≥1 completed round.
- Daily quests: 3 per day, generated deterministically from the date; e.g. "answer 10 spelling", "win a boss", "complete 3 rounds".
- Badges (15): first round, 100 subs, 1K subs, 7-day streak, first boss win, 10/10 in each of 5 modes, memory under 60s, 50 words spelled, level 5, level 10.
- Avatars: 12 emoji avatars; 3 free, others cost likes (50–300) or unlock at level.
- SFX via WebAudio synth (correct, wrong, combo, level-up, win), confetti canvas, Vibration API, mute toggle, `prefers-reduced-motion` respected.

## Screens & routing (hash router)
- `#/onboarding` — channel name + avatar (first launch only).
- `#/studio` — home: avatar, name, subs, level bar, streak, daily quests, Boss button, mode grid.
- `#/play/:mode?level=1` — exercise; progress dots, combo indicator, feedback area, TTS button.
- `#/results` — round summary: subs earned, new badges, level up, replay / home.
- `#/profile` — stats per mode, badges, avatar shop, mute toggle, theme toggle, install button, reset.

## Accessibility & mobile
- Touch targets ≥48px, safe-area insets, bottom nav on phones, `touch-action: manipulation`.
- Focus-visible rings, `aria-live` feedback, keyboard operable, contrast AA, font size ≥16px.
- Dark neon default + light theme toggle (stored).
- Fonts: system stack + local Hebrew-friendly fallback (no external font requests) so offline is complete.

## PWA
- `manifest.webmanifest`: relative `start_url: "./"`, `scope: "./"`, `display: standalone`, icons 192/512 (+maskable).
- `sw.js`: precache app shell (versioned `CACHE_VERSION`), cache-first for same-origin GET, cleanup old caches, `skipWaiting` on message; UI toast "new version — refresh".
- Install button using `beforeinstallprompt`; iOS hint text.

## Data & persistence
- `localStorage['noam_english_v2']` = `{ version, profile:{name, avatar}, subs, likes, level, streak:{count, lastDay}, quests:{day, items[]}, badges[], stats:{mode:{correct,total,best}}, unlockedAvatars[], settings:{muted, theme} }`.
- Migration: legacy `noam_english_progress` totals are merged into `stats` once.

## Testing
- `tests/*.test.js` with `node:test` for pure logic: xp/levels, combo, quests generation, badge evaluation, store migration, utils (shuffle/pick determinism with seeded RNG).
- Manual: Chrome DevTools mobile viewport, Lighthouse PWA installable check.
