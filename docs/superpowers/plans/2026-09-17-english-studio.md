# English Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the English practice app as a gamified, mobile-first, installable PWA with 10 exercise modes.

**Architecture:** Vanilla ES modules, hash router rendering screens into `#app`. Pure logic (xp, quests, badges, store) is separated from DOM code so it can be tested with `node:test`. Exercises share one interface and are driven by a round controller.

**Tech Stack:** HTML/CSS/JS (ES2022 modules), Web Speech API, WebAudio, Service Worker, localStorage, node:test.

## Global Constraints
- No build step; all URLs relative (`./`), app must work at `https://user.github.io/repo/`.
- Hebrew UI (`dir="rtl"`), English content in `.en` LTR containers.
- No external network requests at runtime (fonts local/system).
- Touch targets ≥48px; respect `prefers-reduced-motion`.
- localStorage key `noam_english_v2`; migrate `noam_english_progress`.

## File Structure
```
index.html                     shell: header, #app, bottom nav, toast, confetti canvas
manifest.webmanifest, sw.js
assets/styles.css              design tokens, layout, components, exercises, animations
assets/icons/icon-192.png, icon-512.png, icon-maskable-512.png, icon.svg
src/app.js                     boot: store load, router, SW registration, install prompt
src/core/utils.js              rng(seed), shuffle, pick, pickMany, todayKey, el(), clamp
src/core/store.js              load/save/migrate state, getState(), update(fn), subscribe()
src/core/audio.js              speak(text), sfx(name), setMuted(), vibrate()
src/core/router.js             onRoute(pattern, handler), navigate(path), start()
src/core/confetti.js           burst()
src/game/xp.js                 levelFor(subs), nextLevelAt(level), comboMultiplier(streak), roundReward()
src/game/quests.js             questsFor(dayKey, seed), applyProgress(quests, event)
src/game/badges.js             BADGES, evaluate(state) -> newly earned ids
src/game/round.js              RoundController: start(mode, level) → asks exercise for questions, tracks answers, emits results
src/data/words.js, sentences.js, stories.js, avatars.js
src/exercises/index.js         MODES registry {id, title, desc, icon, create}
src/exercises/*.js             each exports create({level, ctx}) → { render(container, api), speak?() }
src/screens/onboarding.js, studio.js, play.js, results.js, profile.js
tests/xp.test.js, quests.test.js, badges.test.js, store.test.js, utils.test.js
tools/make-icons.mjs           generates PNG icons with pure-node PNG encoder
```

## Exercise interface
```js
// create(level, ctx) -> Question generator
// ctx = { words, sentences, stories, rng }
// returns { next(): Question }
// Question = { render(container, answer), speak?: () => void }
// answer(correct: boolean, meta?: {text}) is called exactly once per question by the exercise
```

## Tasks
1. Core utils + store + xp + quests + badges with node tests.
2. Data files (words, sentences, stories, avatars).
3. Audio, confetti, router.
4. Exercises: letters, vocabulary, vowels, sentences, story (ported), spelling, listening, builder, memory, boss.
5. Screens + app.js + index.html + styles.css.
6. PWA: manifest, sw.js, icons tool, install prompt.
7. Verify: `node --test`, open in browser mobile viewport, Lighthouse installability.
