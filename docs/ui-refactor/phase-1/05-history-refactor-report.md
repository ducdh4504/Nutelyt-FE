# Phase 1E — History Refactor Report

## Scope

Replaced the legacy search-history card list with the weight-loss event History flow only. The flow records and displays runtime Home meal-consumed, activity-completed, and saved-recipe events through one source; it deliberately excludes Chat conversation history. Splash, Onboarding, Authentication, Health Profile, Dashboard UI, Chat UI, Profile UI, HTTP client configuration, package versions, and backend contracts were not refactored. No package was installed, no commit was created, and nothing was pushed.

## Audit Sources

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
- `docs/ui-refactor/phase-1/04-home-refactor-report.md`

The existing Expo SDK 54 routing, safe-area, native input, Modal, and list conventions previously reviewed for this repository remain the implementation baseline.

## Figma Nodes

- Main History — `13:896`
- Filter — `13:1749`
- Loading — `13:1324`
- Empty — `13:1463`
- Filter No Result — `13:1588`

The Figma MCP connector was unavailable in this session. The implementation follows the Phase 0 screen mapping, existing Nutelyt tokens, assets, card surfaces, bottom-tab shell, and status-state guidance. Raw Figma layer measurements, exact type styles, shadows, and spacing require a later MCP-enabled visual verification.

## Previous Implementation

`/history` was already a thin route, but the feature rendered a static `HistorySection[]` of viewed/saved food cards. It called the filter control a no-op, used a search placeholder for conversations, had no category/range filters, did not distinguish empty-account from filtered-empty, and seeded React Query with `initialData`, preventing a visible initial loading state. Its data had no relationship to Home confirmation actions.

## Architecture

```text
Home actions
  → Home public runtime-log projection
  → History mock repository adapter
  → historyApi + Zod HistorySnapshot
  → useHistory query
  → filtering/grouping presentation helpers
  → History screen and filter sheet
```

`homeRuntimeLogSource` is a public Home feature export, not a cross-feature private import. It projects typed confirmed meal, activity, and saved events. The History repository only adapts that public union to `HistoryEntry`; it does not retain or copy a static History array. The feature separates data contracts (`history.types.ts`), Zod validation, query API/keys, runtime repository adapter, filtering/date grouping helpers, time refresh hook, and presentation components.

## Home Log Integration

- Home meal confirmation creates a `MealLog` with a stable date-based ID, local timestamp, nutrition, and recommendation metadata.
- Home activity confirmation creates an `ActivityLog` with a stable date-based ID, duration, calorie estimate, and timestamp.
- Saving a recommendation now records its save timestamp in the same Home runtime source; unsaving removes that saved event.
- Each successful Home action invalidates both its Home snapshot and the `history` query root, so an open History tab refreshes from the exact same source.

No History UI imports Home fixture arrays, no equivalent event is manually created in History, and saved entries do not affect Home daily progress.

## Supported History Types

- `meal` — consumed meal with image, calories, and protein.
- `activity` — completed activity with duration and estimated calories.
- `saved` — saved recipe/recommendation with image.

Conversation/search-history data is intentionally excluded. Weight events remain deferred because the current Profile flow has no confirmed weight-entry mutation contract.

## Search & Filters

The toolbar supports accent-insensitive local search and immediate All / Meals / Activity / Saved category chips. The Filter sheet uses a staged draft: selection changes remain inside the sheet until Apply; dismissing the sheet leaves the applied filters intact. The time presets are Today, Last 7 Days, and Last 30 Days. Search, category, and range conditions combine using AND semantics. Reset clears all applied and draft filters. There is no backend search call or pagination contract.

## Date Grouping

Entries are sorted newest-first and grouped by device-local calendar date. The current and preceding local dates render as `Hôm nay` and `Hôm qua`; older groups render a Vietnamese local calendar date. Range boundaries are local-day inclusive and calculated from the explicit current `Date`, not from display strings.

## UI States

The state order is explicit:

1. Initial pending query — Shimmer header, search, chip, and card skeletons.
2. Successful snapshot with zero source events — true empty state with Home and Nutelyt Chat actions.
3. Successful nonempty source with zero matching search/filter entries — filter-no-result state with Reset.
4. Successful matching data — grouped `SectionList` cards.
5. No successful snapshot — generic retry fallback.

The screen uses safe-area-aware top/bottom spacing, respects the existing tab bar, keeps large touch targets for chips and controls, labels inputs/actions, announces applied filters, and hides decorative empty-state art from assistive technology.

## Legacy History Cleanup

- Removed `src/features/history/data/mock-history.ts` and the old viewed/saved search-card model.
- Removed `historyMockAdapter` and query `initialData` seeding.
- Replaced the current route’s legacy screen in place; `/history` remains the sole History route and the existing custom four-tab shell remains unchanged.

## Navigation Flow

`Home confirmation → invalidate History → /history event list`

The existing bottom navigation owns Home/History/Chat/Profile. From true empty, the History screen can navigate to Home or Chat through centralized route constants. The old fixed Dashboard CTA and serialized Profile route parameter were removed from History; Dashboard has not been altered in this phase.

## Files Changed

Created:

- `src/features/history/history-filtering.ts`
- `src/features/history/history-ui.tsx`
- `src/features/history/hooks/use-history-time.ts`
- `docs/ui-refactor/phase-1/05-history-refactor-report.md`

Modified:

- `src/features/history/api/history.api.ts`
- `src/features/history/api/history.keys.ts`
- `src/features/history/history.types.ts`
- `src/features/history/hooks/use-history.ts`
- `src/features/history/index.ts`
- `src/features/history/repositories/mock-history.repository.ts`
- `src/features/history/schemas/history.schema.ts`
- `src/features/history/screens/history-screen.tsx`
- `src/features/home/api/home.api.ts`
- `src/features/home/hooks/use-home-actions.ts`
- `src/features/home/home.types.ts`
- `src/features/home/index.ts`
- `src/features/home/repositories/mock-home.repository.ts`
- `src/features/home/screens/home-screen.tsx`

Removed:

- `src/features/history/data/mock-history.ts`

## Validation Results

- `npx --no-install tsc --noEmit` — passed.
- `npx --no-install eslint . --no-cache` — passed with zero errors/warnings.
- `git diff --check` — passed; Git only reported the repository’s existing LF-to-CRLF notices.
- No formatting command or test script exists in `package.json`.
- `npx --no-install expo install --check` — completed after network access was approved and reported the existing compatibility mismatch: installed `expo@54.0.35`, expected `~54.0.36`. No package was changed.
- Web build/export was intentionally skipped for this phase.

## Remaining Risks

- Figma MCP was unavailable, leaving raw design measurements and final native visual comparison unverified.
- The Home runtime log source is intentionally in-memory because no approved durable log-storage dependency/contract exists; records are lost on app restart.
- The non-mock `GET /history` response is now expected to satisfy the new `HistorySnapshot` union, but the audited backend contract has not been approved or verified.
- Native device/simulator coverage for small screens, rotation, screen readers, and sheet keyboard behavior remains outstanding.
- Dashboard remains its existing independent fixture and has not yet begun reading this event source.

## Next Recommended Phase

Refactor the seven-day Dashboard UI to derive its projection from the confirmed History event contract and Health Profile data.
