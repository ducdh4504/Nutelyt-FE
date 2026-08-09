# Phase 1D — Home Refactor Report

## Scope

Implemented the Figma-informed Home UI and its Home-owned daily snapshot, time resolver, save/bookmark operation, meal logging operation, and minimal outside-meal-window activity logging boundary. The Home route remains thin and the existing tab layout remains the sole bottom navigation owner.

Excluded: Splash, Onboarding, Authentication, Health Profile UI, History UI, Chat UI, Profile UI, Dashboard UI, backend APIs, Supabase/JWT, packages, and configuration. No package was installed, no commit was created, and nothing was pushed.

## Audit Sources Used

- `docs/ui-refactor/phase-0/00-executive-summary.md`
- `docs/ui-refactor/phase-0/01-route-and-navigation-audit.md`
- `docs/ui-refactor/phase-0/02-feature-architecture-audit.md`
- `docs/ui-refactor/phase-0/03-model-schema-and-mock-audit.md`
- `docs/ui-refactor/phase-0/04-figma-screen-mapping.md`
- `docs/ui-refactor/phase-0/05-infrastructure-audit.md`
- `docs/ui-refactor/phase-0/06-risk-decisions-and-migration-plan.md`
- `docs/ui-refactor/phase-0/audit-summary.json`
- `docs/ui-refactor/phase-1/01-onboarding-refactor-report.md`
- `docs/ui-refactor/phase-1/02-authentication-refactor-report.md`
- `docs/ui-refactor/phase-1/03-health-profile-refactor-report.md`

The Expo SDK 54 native UI, Router, StatusBar, safe-area, and keyboard conventions were also reviewed.

## Figma Node

- Link: `https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=11-873&m=dev`
- Node ID: `11:873`
- Frame: `Home UI`

The Figma connector was not callable in this session. The implementation uses the audited Figma screen mapping plus existing Nutelyt colors, typography, images, bottom navigation, and local brand assets. Exact raw frame measurements, icon bounds, and token values remain to be re-verified once Figma MCP is available.

## Previous Home

The old `/home` route already rendered the Home feature, but its sole screen built a vertical list directly from a small `FoodRecommendation` card model. It had no local-time behavior, snapshot contract, save state, meal log, activity log, progress card, empty/error state, or dedicated mutation hooks. The old `use-home-recommendations` query and its array-only model/schema/mock seed were removed and replaced rather than kept in parallel.

## New Architecture

```text
Home Screen
  → useHomeTime + useHomeSnapshot + useHomeActions
  → homeApi
  → homeMockRepository
  → typed mock recommendation seed / runtime logs
```

`homeApi.getSnapshot` retains the existing `/home/recommendations` REST boundary for non-mock mode and validates a `HomeSnapshot` with Zod. Mock mode uses the same public API contract and a feature-owned repository so the UI does not import mock arrays. Separate Home API methods represent save, unsave, meal-consumed, and activity-completed operations; non-mock mutation calls intentionally fail until approved backend contracts exist rather than invent endpoints.

## Time-Based Behavior

`resolveMealPeriod(date)` accepts an explicit device-local `Date` and has non-overlapping windows:

- Breakfast: 06:00–10:29
- Lunch: 10:30–12:29
- Snack: 12:30–15:59
- Dinner: 16:00–18:29
- Outside meal window: all remaining times, including 05:59, 18:30, and 22:00

`useHomeTime` refreshes on first render, route focus, and app return to foreground. It does not use a minute-by-minute timer.

## Health Profile Integration

Home consumes the existing public Profile context, not route params or a duplicate store. It uses the active full name for the greeting, diet for compatibility filtering, and saved allergy labels for simple allergen exclusion. Missing or unknown values use a safe generic greeting and generic compatible recommendations. The mock catalog avoids obvious diet contradictions, but it is not a medical safety engine.

## Home Data Model

`HomeSnapshot` contains generated time, local date, meal period, greeting, daily progress, personalized recommendations, companion copy, and an optional activity suggestion. `MealRecommendation` has structured nutrition, tags, diet support, allergens, images, and runtime save/log state. `MealLog` and `ActivityLog` have stable per-date identifiers, timestamps, and the data future History/Dashboard aggregation would need.

## Recommendation Cards

Recommendation cards are rendered through a horizontal `FlatList`, with stable IDs, fixed card proportions, image fallback, calorie badge, tags, bookmark control, and explicit consumed-meal action. Long Vietnamese names are constrained to two lines. The parent page remains vertically scrollable; the list only scrolls on its horizontal axis.

## Save vs Log

Save / Bookmark is separate from Meal Consumed:

- Bookmark only updates the repository’s saved-ID state and the card icon.
- `Ghi nhận đã ăn` creates one runtime `MealLog` for that recommendation and local date, invalidates only Home snapshot queries, and changes both the card and daily meals progress.

Each action has a per-item tap lock. Repository stable IDs also reject duplicate consumed logs even if a second request is attempted.

## Meal & Activity Logging

Meal logging is available on each recommendation. Outside normal meal windows, Home also presents one lightweight walking suggestion; only its explicit confirmation creates an `ActivityLog`. Activity completion updates actual activity minutes in the daily progress card and cannot be logged twice for the same date. Bookmarking an item never creates either type of log.

## Daily Progress

The progress card reads only the repository’s current-date `MealLog` and `ActivityLog` records. Initial state is `0/3` meals and `0` activity minutes. It does not count viewed recommendations, bookmarks, or conversations.

## History / Dashboard Readiness

The runtime logs now have stable source IDs, timestamps, nutrition, duration, and calorie estimates that a future shared History event repository and 7-Day Dashboard aggregation can consume. The existing History and Dashboard UI/repositories remain intentionally disconnected static fixtures; Home does not mutate their numbers or query state in this phase.

## Navigation

- Health Profile → Home: the existing runtime Profile provider is consumed without PII route params.
- Home → History, Chat, Profile: existing tab layout and custom bottom bar remain the navigation owner.
- Home → Chat: companion card navigates through `routes.chatAi`.
- Home → Dashboard: 7-day progress CTA navigates through `routes.dashboard`.
- Notification: no notification route exists; the header icon safely announces that the destination is forthcoming.

## Legacy Home Cleanup

- Removed `src/features/home/hooks/use-home-recommendations.ts`.
- Removed the old array-only recommendation types/schema/mock shape.
- Replaced the old vertical-card screen in place; no second Home screen, card implementation, or query is retained.

## Files Changed

Created:

- `src/features/home/meal-period.ts`
- `src/features/home/hooks/use-home-actions.ts`
- `src/features/home/hooks/use-home-snapshot.ts`
- `src/features/home/hooks/use-home-time.ts`
- `docs/ui-refactor/phase-1/04-home-refactor-report.md`

Modified:

- `src/components/ui/index.ts`
- `src/features/home/api/home.api.ts`
- `src/features/home/api/home.keys.ts`
- `src/features/home/data/mock-home.ts`
- `src/features/home/home.types.ts`
- `src/features/home/index.ts`
- `src/features/home/repositories/mock-home.repository.ts`
- `src/features/home/schemas/home.schema.ts`
- `src/features/home/screens/home-screen.tsx`

Removed:

- `src/features/home/hooks/use-home-recommendations.ts`

## Validation Results

- `npx --no-install tsc --noEmit` — passed.
- `npx --no-install eslint . --no-cache` — passed.
- `git diff --check` — passed; only repository LF-to-CRLF notices were printed.
- No formatting-check or test script exists in `package.json`.
- `npm run build:web` — passed; exported all 28 routes including `/home`. It repeated the existing missing favicon and root `health-profile` screen-name warnings, then Expo force-exited after export.
- Local browser smoke test could not start because the local Expo web server did not bind to `localhost:8081`; this is reported as a validation limitation.
- `npx --no-install expo install --check` — completed and reported the known pre-existing mismatch: installed `expo@54.0.35`, expected `~54.0.36`. No package was changed.

## Remaining Risks

- Figma MCP was unavailable, so raw Home node measurements and exported assets were not re-verified.
- Runtime logs are not durable across an app restart because the project has no approved persistent-storage dependency.
- Home logs are ready for a shared event layer but do not yet appear in the existing History or Dashboard static mocks.
- Native-device accessibility and layout verification still require a device/simulator session.

## Deferred Work

- Backend Home snapshot and mutation contracts.
- Durable profile/log storage.
- Nutrition recommendation engine.
- History UI and shared event repository.
- Dashboard aggregation/UI refactor.
- Chat UI refactor.
- Personalized schedules and expanded activity support.

## Next Recommended Phase

Refactor the History UI around a typed event-log contract that can consume Home’s meal and activity logs.
