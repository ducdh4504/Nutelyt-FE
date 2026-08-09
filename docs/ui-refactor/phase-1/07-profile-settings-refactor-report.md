# Phase 1G — Profile & Settings Refactor Report

## Scope

Replaced the legacy Profile, Profile Settings, and Health Summary presentations with one Profile tab workspace. It implements the Profile overview, runtime personal edit, health-profile edit with confirmation, quick weight check-in, Premium entry, logout confirmation, and loading/error presentations.

Excluded: Notification Settings functionality, push permissions, persistent profile/weight backend storage, Supabase email/password mutations, avatar upload, Premium plans/payments, Dashboard UI/aggregation, and changes to other feature UIs. No dependency was installed, no commit was created, and nothing was pushed.

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
- `docs/ui-refactor/phase-1/04-home-refactor-report.md`
- `docs/ui-refactor/phase-1/05-history-refactor-report.md`
- `docs/ui-refactor/phase-1/06-chat-ai-refactor-report.md`

Current Profile provider/storage, Health Profile schemas/utilities, Home/History runtime event boundaries, Dashboard routes/models, Auth service, existing Subscription route, bottom tabs, shared Shimmer/Image primitives, and installed camera/avatar capabilities were also inspected.

## Figma Nodes

- Profile Overview — [node `20:39`](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=20-39&m=dev).
- Edit Personal Information — [node `20:664`](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=20-664&m=dev).
- Edit Health Profile — [node `20:790`](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=20-790&m=dev).
- Confirm Health Update — [node `22:1294`](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=22-1294&m=dev).
- Quick Weight Check-in — [node `22:1572`](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=22-1572&m=dev).
- Notification Settings — [node `22:2118`](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=22-2118&m=dev) — **DEFERRED — inspected but not implemented**.
- Logout Dialog — [node `22:2732`](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=22-2732&m=dev).
- Loading — [node `22:2774`](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=22-2774&m=dev).
- Error — [node `22:2915`](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=22-2915&m=dev).

Figma MCP was unavailable in this session. Existing Nutelyt design tokens, safe-area patterns, cards, tabs, imagery, and Phase 0 mapping were used instead. Exact raw layer measurements, typography, shadows, and exported assets remain for an MCP-enabled visual pass.

## Previous Profile Architecture

The old Profile tab combined a large health/review presentation, route-param hydration, local review mode, navigation to the Health Profile creation wizard, and static/repeated display helpers. Separate `ProfileSettingsScreen` and `HealthProfileSummaryScreen` repeated profile summaries, settings rows, disabled/fake two-factor state, logout navigation, and health data displays. There was no WeightMeasurement model/repository and no actual health-update confirmation boundary.

The old Profile Settings and Health Summary screen modules were removed. Their legacy deep-link routes now redirect safely to `/profile`; the Profile tab is the sole active Profile UI.

## New Architecture

```text
Profile Screen
  → useProfileManagement
  → MainProfileProvider + Health Profile public contracts
  → runtime weight repository / Auth logout boundary

Future
  → same feature contracts
  → ASP.NET Profile API / Supabase identity and storage services
```

The existing `MainProfileProvider` remains the canonical runtime source. `useProfileManagement` derives temporary edit drafts, applies validated updates through the provider, creates runtime weight measurements, and invalidates only affected Home/Dashboard query roots. Presentation components receive callbacks and do not import the provider or repositories.

## Profile Data Ownership

- Personal information and Health Profile fields remain in the Phase 1C `HealthProfileSummary` provider/storage boundary.
- Current weight is `currentWeight` with the legacy `weight` field synchronized for existing consumers.
- Target weight remains `targetWeight` in the same canonical summary.
- Quick check-ins create `WeightMeasurement` records in a Profile-owned runtime repository, then synchronize canonical current weight.

No disconnected `mockProfile` or second Health Profile store was created.

## Edit Personal Information

Full name, birthday, and gender prefill from canonical Profile state, validate locally with a feature-owned Zod schema, and update the runtime provider. The email is shown as the current demo-account identity but intentionally is not editable or persisted: no Supabase/Auth email update abstraction exists. The avatar displays initials and a safe deferred note; no picker or upload pipeline was added.

## Edit Health Profile

The screen derives a temporary draft from the same Phase 1C fields: height, current/target weight, goal speed, diet, and allergies. It reuses `healthProfileValuesSchema`, has no edit cooldown, supports local allergy addition/removal, and opens the supplied confirmation dialog only after validation. Canceling the dialog retains the edit draft. Confirming replaces canonical health values, updates Profile, and invalidates Home snapshot queries. Future Chat requests read the updated provider context without a duplicated Chat profile state.

## Weight Check-in

`WeightMeasurement` has a stable runtime ID, real `measuredAt` timestamp, and numeric `weightKg`. Quick Weight Check-in reuses the canonical Phase 1C weight bounds, accepts decimal input, updates both `currentWeight` and `weight`, invalidates the Dashboard query root for future consumption, and does not write any History event. The runtime repository is publicly exported for a later Dashboard read model.

## Notification Settings

**Deferred and not implemented in Phase 1G.**

The supplied node was inspected for design context. No notification preferences, toggle persistence, permissions, scheduler, Expo Notifications setup, or APIs were added. The overview contains only a disabled “coming soon” row. The old `/profile/settings` deep link redirects to Profile instead of exposing the unrelated legacy settings UI.

## Premium

The Profile Overview renders only a Premium entry card and navigates to the existing valid `/subscription` route. It does not implement plan selection, checkout, entitlement, or payment behavior.

## Logout

The Profile logout dialog calls the new public `logoutWithCurrentContract` Auth boundary, prevents repeated confirmation while awaiting completion, and then replaces to `/login`. Since the current authentication implementation is still a runtime demo contract, logout performs no Supabase operation and does not delete profile/event data.

## UI States

- Overview.
- Edit Personal Information.
- Edit Health Profile.
- Confirm Health Update dialog.
- Quick Weight Check-in sheet.
- Logout confirmation dialog.
- Provider-initialization loading skeleton.
- Error/retry presentation.

The Profile overview scrolls above the existing tab bar; forms use `KeyboardAvoidingView`, dialogs/sheets have safe dismiss behavior, interactive controls have labels/roles, and long labels use flexible layout.

## Legacy Profile Cleanup

Removed:

- `ProfileSettingsScreen` and its fake two-factor/settings actions.
- `HealthProfileSummaryScreen` and duplicated health-summary cards.
- Legacy Profile review-mode presentation in the tab screen.
- Old Profile-only display/navigation code tied to serialized route-profile state.

The retained Health Profile creation wizard, runtime provider, Auth services, and Subscription route are shared/active responsibilities and were preserved.

## Files Changed

Created:

- `src/features/profile/profile-ui.tsx`
- `src/features/profile/profile.types.ts`
- `src/features/profile/schemas/profile.schemas.ts`
- `src/features/profile/repositories/runtime-weight.repository.ts`
- `src/features/profile/use-profile-management.ts`
- `docs/ui-refactor/phase-1/07-profile-settings-refactor-report.md`

Modified:

- `src/features/profile/screens/profile-screen.tsx`
- `src/features/profile/index.ts`
- `src/features/health-profile/schemas/health-profile.schemas.ts`
- `src/features/health-profile/index.ts`
- `src/features/auth/services/auth-service.ts`
- `src/features/auth/index.ts`
- `src/app/profile/settings.tsx`
- `src/app/health-profile-summary.tsx`
- `src/app/health-profile/review.tsx`

Removed:

- `src/features/profile/screens/profile-settings-screen.tsx`
- `src/features/profile/screens/health-profile-summary-screen.tsx`

## Validation Results

- `npx --no-install tsc --noEmit` — passed.
- `npx --no-install eslint . --no-cache` — passed.
- `git diff --check` — passed; only repository LF-to-CRLF notices were printed.
- No tests or formatting-check script exists in `package.json`.
- `npx --no-install expo install --check` — reported the existing compatibility mismatch: installed `expo@54.0.35`, expected `~54.0.36`. No package was changed.
- Web build/export was intentionally skipped.

## Remaining Risks

- Figma MCP was unavailable, so exact Profile geometry and visual parity remain unverified.
- Profile and WeightMeasurement data are runtime-only; app restart loses updates until an approved persistent/backend contract exists.
- The current demo auth logout has no real session/Supabase state to clear.
- Email changes, avatar upload, Notification Settings, Premium entitlement, and Dashboard consumption of measurements remain deferred.
- Native-device keyboard, bottom-sheet, accessibility, and responsive visual validation remains outstanding.

## Deferred Work

- Notification Settings.
- Durable backend Profile and WeightMeasurement persistence.
- Supabase email update/verification.
- Avatar upload/storage.
- Premium flow.
- Dashboard aggregation from weight measurements.

## Next Recommended Phase

Refactor the seven-day Dashboard UI to derive from confirmed History events and Profile weight measurements.
