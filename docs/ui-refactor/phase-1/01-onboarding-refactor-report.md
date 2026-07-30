# Phase 1A — Onboarding Refactor Report

## Scope

Implemented the three-screen Nutelyt onboarding as one feature-owned, data-driven Expo Router flow. The refactor covers the Figma-mapped content, responsive safe-area layout, local Inter font, canonical Nutelyt brand assets, progress and action states, Back/Continue/Skip/Start Now behavior, accessibility metadata, bounded transition handling, and entrance/idle motion derived from the supplied recordings.

The existing Splash implementation, Authentication UI, Health Profile, tabs, backend/data infrastructure, SDK version, and global navigation architecture were intentionally not refactored. No package was installed, and no commit or push was made.

## Audit Sources Used

- `docs/ui-refactor/phase-0/00-executive-summary.md`
- `docs/ui-refactor/phase-0/01-route-and-navigation-audit.md`
- `docs/ui-refactor/phase-0/02-feature-architecture-audit.md`
- `docs/ui-refactor/phase-0/03-model-schema-and-mock-audit.md`
- `docs/ui-refactor/phase-0/04-figma-screen-mapping.md`
- `docs/ui-refactor/phase-0/05-infrastructure-audit.md`
- `docs/ui-refactor/phase-0/06-risk-decisions-and-migration-plan.md`
- `docs/ui-refactor/phase-0/audit-summary.json`

The audit established `/onboarding` as the current post-Splash route, `/login` as the Authentication entry, the existing onboarding feature ownership, available aliases and tokens, the absence of completion persistence, and the requirement to preserve Splash.

## Figma Nodes

- Onboarding Screen 1 — node `1:2`: <https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=1-2&m=dev>
- Onboarding Screen 2 — node `1:44`: <https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=1-44&m=dev>
- Onboarding Screen 3 — node `1:96`: <https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=1-96&m=dev>
- Brand Assets — node `1:301`: <https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=1-301&m=dev>

Figma MCP supplied the frame geometry, text, hierarchy, fills, typography, logo and mascot dimensions, badge placement, progress dimensions, CTA sizes/radii, and Back/Skip visibility. The existing `Nutelyt-logo.png`, `Nutelyt-text.png`, and `Nutelyt-AI.png` files were verified byte-for-byte against the Figma brand exports, so no duplicate brand images were added.

## Previous Implementation

- Route: `src/app/onboarding.tsx`, already a thin route rendering the feature API.
- Screen: `src/features/onboarding/screens/onboarding-flow-screen.tsx`, a monolithic local-state implementation with duplicated presentation and a raw `/login` route string.
- Content: `src/features/onboarding/data/onboarding-data.ts`.
- Visuals: `food-scan-illustration.tsx`, `onboarding-illustrations.tsx`, and `onboarding-progress-dots.tsx` plus the legacy `onboarding1-bg.png` and `Scan-Fruit-Vegetable.png` references.
- Completion: route replacement only; no completion flag or storage abstraction existed.

## New Implementation

- `onboarding.types.ts` owns stable slide and badge types.
- `config/onboarding-slides.ts` owns static typed content and accessibility labels.
- `config/onboarding-theme.ts` owns the smallest Figma-specific color set.
- `config/onboarding-fonts.ts` registers the local Inter variable font without changing root font/Splash initialization.
- `components/` owns the header, hero, badges, slide presentation, progress, and action layout.
- `hooks/use-onboarding-flow.ts` owns bounded navigation state, transition and completion locks, route replacement, and local navigation error recovery.
- `hooks/use-onboarding-activity.ts` owns route focus, app activity, and reduced-motion state.
- `screens/onboarding-flow-screen.tsx` composes the feature, prefetches existing login assets on the final step, applies safe-area/status-bar behavior, and provides a vertical scroll fallback for short devices.
- `src/app/onboarding.tsx` remains unchanged and thin, importing the public API from `src/features/onboarding/index.ts`.

Only the current slide is rendered, so hidden hero animations are not mounted. Button control is used instead of horizontal swiping because the supplied prototypes and motion recordings demonstrate explicit Back/Continue navigation and the controlled transition avoids gesture/entrance-animation conflicts.

## Animation

Inspected files:

- `C:\Users\MSI\Videos\Screen Recordings\01_Onboarding1_EntranceAndIdle.mp4` — 4.395 seconds, 232×556, 30 fps.
- `C:\Users\MSI\Videos\Screen Recordings\02_Onboarding2_EntranceAndIdle.mp4` — 4.779 seconds, 236×552, 30 fps.
- `C:\Users\MSI\Videos\Screen Recordings\03_Onboarding3_EntranceAndIdle.mp4` — 5.355 seconds, 234×540, 30 fps.

The prompt did not resolve the `FINAL RUNTIME ASSET / VISUAL ANIMATION REFERENCE` placeholder. Because the three files are narrow screen recordings rather than clean transparent product assets and no supported video package is installed, they were treated as visual motion references. Their entrance followed by subtle idle movement was reproduced with the already-installed Reanimated package. The active mascot/badges fade, rise, and scale into place, then use a restrained idle float.

Animation is stopped while the route is unfocused or the app is inactive, and it is disabled when the operating-system reduced-motion preference is active. Only one hero is mounted. The canonical static mascot is always the visual base; if that image fails, a neutral local icon fallback prevents a blank hero. No video decoder, controls, audio, or new dependency was introduced.

## Navigation

Final behavior:

`/` Splash → `/onboarding` → `/login`

- Splash remains byte-for-byte unchanged and still performs its existing prefetch, minimum 2300 ms timing, and `router.replace('/onboarding')` handoff.
- Screen 1 Continue opens Screen 2; Skip replaces the route with `/login`.
- Screen 2 Back opens Screen 1; Continue opens Screen 3; Skip replaces the route with `/login`.
- Screen 3 Back opens Screen 2; Start Now replaces the route with `/login`.
- Android hardware Back moves to the previous onboarding step from Screens 2 and 3; on Screen 1 it keeps the platform default.
- Transition and completion refs prevent rapid taps from advancing out of bounds or submitting multiple exits.

## Persistence

The audit and dependency inspection confirmed that the project has no AsyncStorage, Expo SQLite, or other persistent storage dependency and no existing onboarding-completion abstraction. Following the no-install and no-fake-persistence constraints, this phase does not write a completion flag.

Skip and Start Now safely replace the route with the existing `/login` entry for the current run, but a later cold start follows the preserved Splash behavior and returns to onboarding. A durable first-time gate remains blocked until an approved storage dependency or existing product storage service is available. Authentication session storage was not modified.

## Files Changed

Created:

- `assets/fonts/Inter-Variable.ttf` — local Figma-matching Inter font from the official Google Fonts repository.
- `assets/fonts/Inter-OFL.txt` — Inter SIL Open Font License.
- `src/features/onboarding/onboarding.types.ts` — typed slide and badge model.
- `src/features/onboarding/config/onboarding-fonts.ts` — feature font registration.
- `src/features/onboarding/config/onboarding-slides.ts` — three-slide content configuration.
- `src/features/onboarding/config/onboarding-theme.ts` — Figma-specific onboarding colors.
- `src/features/onboarding/hooks/use-onboarding-activity.ts` — focus, app-state, and reduced-motion lifecycle.
- `src/features/onboarding/hooks/use-onboarding-flow.ts` — bounded interaction and exit behavior.
- `src/features/onboarding/components/onboarding-badge.tsx` — decorative Figma badge variants.
- `src/features/onboarding/components/onboarding-header.tsx` — logo and accessible Back control.
- `src/features/onboarding/components/onboarding-hero.tsx` — responsive mascot composition and motion.
- `src/features/onboarding/components/onboarding-progress.tsx` — accessible step progress.
- `src/features/onboarding/components/onboarding-slide.tsx` — shared responsive presentation and actions.
- `docs/ui-refactor/phase-1/01-onboarding-refactor-report.md` — this report.

Modified:

- `src/config/routes.ts` — added the audited `/login` route to the central route map.
- `src/features/onboarding/data/onboarding-assets.ts` — Splash now preloads the exact logo/mascot assets used by the new flow.
- `src/features/onboarding/index.ts` — exports the public screen and onboarding types.
- `src/features/onboarding/screens/onboarding-flow-screen.tsx` — replaced duplicated legacy UI with the feature composition.

Removed after reference verification:

- `src/features/onboarding/components/food-scan-illustration.tsx`
- `src/features/onboarding/components/onboarding-illustrations.tsx`
- `src/features/onboarding/components/onboarding-progress-dots.tsx`
- `src/features/onboarding/data/onboarding-data.ts`

Unchanged by design:

- `src/features/onboarding/screens/splash-screen.tsx`
- `src/app/index.tsx`
- `src/app/onboarding.tsx`
- `src/app/_layout.tsx`
- `app.json`

## Validation

- `npx --no-install tsc --noEmit` — passed.
- `npx --no-install eslint . --no-cache` — passed.
- `git diff --check` — passed; Git reported only the repository's LF-to-CRLF checkout notices.
- `npm run build:web` — passed and exported all routes. It reported the existing missing `assets/images/favicon.png` warning and existing root-layout `health-profile` route-name warning; neither is in Phase 1A scope.
- `npx --no-install expo install --check` — reporting-only check completed with the known mismatch: installed `expo@54.0.35`, expected `~54.0.36`. No package was changed.
- No formatting-check or test script exists in `package.json`, so neither was available to run.
- Local web smoke test — verified Screen 1 rendering, Continue to Screens 2 and 3, Back to the prior slide, Skip to `/login`, Start Now to `/login`, accessible progress/action names, the compact-height scroll fallback, and absence of hidden slide content.
- Git diff verification — Splash implementation and configuration files listed above remain unchanged; no package manifest/lockfile changes were introduced.

## Remaining Risks

- Durable onboarding completion is unavailable because no persistent storage dependency or abstraction exists. Cold starts will continue to show onboarding.
- The clip-intent placeholder was unresolved; the implementation treats the three recordings as visual references. If product intent was to ship them as runtime video, clean runtime assets and an approved existing video capability are still required.
- Native-device visual and lifecycle validation on iOS/Android was not available in this environment; web rendering and code-level lifecycle behavior were verified.
- The pre-existing Expo `54.0.35` versus expected `~54.0.36` patch mismatch remains intentionally unchanged.

## Next Recommended Task

Implement the Phase 0 shared design foundation: consolidate approved Figma semantic colors, typography, spacing, radii, elevation, icons, and reusable query-state primitives before another feature screen is replaced.
