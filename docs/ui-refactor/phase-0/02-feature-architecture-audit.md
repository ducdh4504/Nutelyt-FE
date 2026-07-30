# Feature Architecture Audit

## Actual feature inventory

Ten current feature folders exist under `src/features`. Six implement the expected query/API/mock/schema read path. Four are screen/context/template features without a backend-ready contract.

| Current feature | Path | Public API (`index.ts`) | Internal structure | Current -> target domain | Disposition |
|---|---|---|---|---|---|
| `auth` | `src/features/auth` | login assets, Login/Register screens | `components`, `data`, `screens`; no types/schema/api/hooks/repository | `auth` -> `identity/auth` | Replace UI; create contract/session layer |
| `onboarding` | `src/features/onboarding` | Splash and onboarding screens | `components`, `data`, `screens`; no persisted state | `onboarding` -> `identity/onboarding` | **Keep Splash only**; replace onboarding UI |
| `health-profile` | `src/features/health-profile` | flow screen, parsers/calculators, payload/summary types | `components`, `data`, `screens`, `steps`, `utils`, types; no schema/api/hooks/repository | `health-profile` -> `health-profile` | Reuse only reviewed utilities/option concepts; replace UI and contracts |
| `profile` | `src/features/profile` | provider/hooks and three screens | `context`, `screens`, `utils`; reuses health-profile types | `profile` -> `profile` plus shared identity state | Replace UI; split persisted account/profile/health state |
| `home` | `src/features/home` | screen, recommendations hook/type | Full `api/data/hooks/repositories/schemas/screens/types/index` | `home` -> `recommendation/home` + `nutrition` | Reuse query pipeline, replace UI/contract |
| `history` | `src/features/history` | screen, history hook/types | Full read feature | `history` -> `meal-logging/history` + `activity` + conversation references | Replace UI and model with event union |
| `ai-chat` | `src/features/ai-chat` | screen, recipe hook/types | `api/data/hooks/repositories/schemas/screens/types`; no component folder despite many inline components | `ai-chat` -> `conversation/chat` plus recipe/nutrition references | Replace screen; retain mock-repository pattern only |
| `food-analysis` | `src/features/food-analysis` | scan/result screens, hook/types | Full read feature plus components/utils | `food-analysis` -> post-MVP capture + `nutrition` analysis | Defer/retire UI for MVP; audit logic before backend move |
| `dashboard` | `src/features/dashboard` | two screens, hook, inferred data type | Full read feature | `dashboard` -> `dashboard` projection over history/profile | Replace UI and source model |
| `subscription` | `src/features/subscription` | screens, hooks, plan types | Full read feature | `subscription` -> `subscription` | Replace UI; add status/payment state contracts |
| `modal` | `src/features/modal` | Expo-template modal screen only | template `components/hooks/screens/theme` | none -> shared presentation if needed | Remove later |

## Feature-by-feature detail

### Auth

- Screens: `login-screen.tsx`, `register-screen.tsx`.
- Reusable candidates: `AuthTextInput`, Google-button visual shell only.
- Current behavior: login compares exactly `admin@gmail.com` / `Test@123`; Google, forgot-password, and registration submit actions are no-ops.
- State: local component state; no React Query, schema, auth repository, Supabase, secure storage, or session type.
- Boundary issue: Login reaches into Profile Context to decide first destination. Auth should consume an application/session readiness result, not own health-profile routing logic.
- Target: Supabase session restoration and provider login, backend token exchange, secure token/session adapter, logout/revocation, auth query/mutations, Zod contracts, and guard-readable session state.

### Onboarding

- Screens: in-app Splash and a three-step onboarding flow.
- Components/data: illustrations, progress dots, `ScreenContainer`, local step data/assets.
- Cross-feature dependency: onboarding imports `loginAssets` through the Auth public API; this complies with the public-boundary rule but couples prefetch ownership.
- State: local only; completion is not persisted.
- **Splash is the sole UI KEEP.** Onboarding content is replaceable and does not match the new Figma copy/structure.

### Health Profile

- Current steps: basic body data, broad health goal, one diet/no-diet choice, conditions/allergy free text.
- Types: `HealthOption`, `HealthProfilePayload`, and `HealthProfileSummary`.
- Utilities: route-param parsing/serialization, age, BMI, normalization, and condition matching.
- Missing target data: current/starting/target weight separation, rate/cadence, multiple dietary preferences, structured allergies/restrictions, edit metadata, version/audit fields, units, timezone, and backend identifiers.
- Business logic in screen: required-field checks, step progression, option-label lookup, and payload construction.
- Product mismatch: current options allow maintain, muscle gain, and weight gain despite the confirmed MVP primary goal being weight loss.
- Validation gap: there is no Zod schema; malformed route JSON silently falls back.

### Profile

- Context: `MainProfileProvider` stores one runtime `HealthProfileSummary` plus a completion boolean. Reloading loses both.
- Screens: combined profile overview/review, a separate health summary, and settings.
- Duplicated logic: health-profile parsing is partially reimplemented in `profile-screen.tsx`; profile-display derivation exists in multiple screens.
- Misplaced logic: BMI classifications, summary-chip construction, edit-readiness checks, and navigation rules live in screen files.
- Settings actions are mostly presentation-only; two-factor state is a local boolean, logout is a route replacement, and destructive/support actions are no-ops.
- No edit cooldown rule exists. Treat 15/30-day limits as an open decision, not inferred behavior.

### Home

- Query key: `['home', 'recommendations']`.
- API: `GET /home/recommendations` through central Axios.
- Mock: three UI cards with local bundled images.
- Schema: validates `id/name/description/image`.
- Screen dependencies: Home query plus hydrated Profile Context.
- Missing behavior: no `Date`, timezone, greeting period, meal-period utility, time-window config, diet filter, target/calorie context, already-eaten mutation, History invalidation, or tracking.
- Current check icons are decorative; recommendations have no selected/confirmed state.
- Target: a time-window configuration/domain utility, a recommendation request contract, `useHomeRecommendations(context)`, and explicit confirm-meal mutation producing a History event.

### History

- Query key: `['history', 'list']`; API `GET /history`.
- Model: date-title sections containing food-image cards with `Đã xem`/`Đã lưu` status and display-only time strings.
- Screen: local text filter, nonfunctional filter button, nonfunctional item presses, Dashboard CTA.
- Missing target structure: event kind, occurred-at timestamp/timezone, meal period, consumption confirmation, nutrition summary, recipe reference, conversation reference, activity duration/calories, weight measurements, lifecycle/status, pagination, and stable ordering.
- Target requires a discriminated History entry union and server-filter/pagination contract.

### AI Chat

- Data read path supplies a static recipe catalog; there is no conversation API.
- `chat-ai-screen.tsx` is 1,109 lines and defines modes, intents, message union, keyword recognizers, rendering components, input state, fake voice state, and recipe detail/save state.
- Current split entry points: “Nấu tại nhà (tự chọn món)”, “Nấu tại nhà (gợi ý món)”, and disabled “Ăn ngoài”.
- Conversation history: local `useState`; cleared when returning to entry mode; not in Context, storage, or React Query.
- Message types: plain `{role,text}` and assistant recipe card only.
- Loading/error/retry: absent for conversation; Figma includes typing/loading and error/retry frames.
- Save: `saved` boolean inside recipe detail only; no mutation or History linkage.
- Voice: toggles a local flag and inserts canned text; no audio capture. Figma camera/voice affordances are Production-deferred.
- Target unified workspace: central conversation, new chat, route-addressable conversation history/drawer, time-based quick prompts, typed structured assistant parts, REST request state, and explicit confirmation mutations for meal/activity logging.

### Food Analysis

- Uses real `expo-camera` permission and camera view, then navigates to a mock result.
- Local analysis rules compare sodium/carbs/fat/calories to hard-coded thresholds and match conditions/goal strings.
- Those rules are in a feature utility rather than a screen, but the target architecture says the backend Nutrition Provider/Engine controls this logic. Do not copy them into new UI.
- Camera/image input is deferred to Production. Keep the audit trail; do not migrate these routes into MVP navigation unless scope changes.

### Dashboard

- Query key: `['dashboard', 'summary']`; API `GET /dashboard`.
- The schema/model contains presentation-ready strings, chart points, warnings, diary cards, and a sodium-detail object.
- Multiple child components call `useDashboard()` independently; Query caching prevents duplicate cache entries but the screen has no single loading/error boundary.
- The entire fixture is independent of History and Profile fixtures. Dates and meals partially overlap by label only.
- Target: one strict seven-day aggregate returned/derived from confirmed History, Profile targets, and weight measurements, with data-completeness metadata and state-specific insight/alert output.

### Subscription

- Query keys: plan list and plan detail; API GETs only.
- Model covers plans and UI feature strings, not subscription status, entitlement, renewal, transaction, or payment state.
- Screen selection is local; success dates use the device clock and can be reached directly by URL.
- Premium capabilities in MVP: UI placeholder/plan preview and simulated states only.
- Post-MVP: advanced personalization including wake/sleep-based windows, deep/long-term analytics, and real entitlement-backed features.

### Modal

- An unchanged Expo-template feature with its own mini theme system.
- It has no Nutelyt domain owner and duplicates theme infrastructure.
- Remove after confirming no target sheet/dialog depends on it; use route-native modal/sheet or an approved shared primitive in Phase 1.

## Architectural rule compliance

| Desired rule | Assessment | Evidence / deviation |
|---|---|---|
| Screen -> hook -> API -> repository/client | Partial pass | Present for six read features; absent for auth/profile/health/onboarding; UI mutations do not exist. |
| No business logic in screens | Fail | Chat keyword/response logic, login credentials, profile classifications/payload logic, subscription dates, and health wizard construction live in screens. |
| No direct Axios from UI | Pass | Axios usage is confined to feature API files and shared HTTP infrastructure. |
| Cross-feature imports through `index.ts` | Mostly pass | Cross-feature usages of Auth, Profile, and Health Profile use public APIs. Food Analysis imports Health Profile publicly. |
| Feature internals remain internal | Partial | Many screens import their own hooks/types by absolute internal path even when exported; not a cross-feature leak, but inconsistent direction. |
| Shared components independent of features | Pass | `src/components` does not import feature modules. Root providers legitimately compose features. |
| No deep relative imports | Pass | No `../../` imports were found under `src`. |
| Validation uses Zod | Partial fail | Response/env validation uses Zod; auth, health profile, profile route payloads, and conversation messages do not. |
| Server state through React Query | Partial | Read data does; Profile/Chat/Auth/confirmation/payment state does not. |
| Mock and REST exact contract | Partial | Mock adapters and APIs share schemas, but contracts contain local `ImageSource` values and display strings that a REST API cannot naturally return. |
| Feature owns expected folders | Fail | Only read-only features approach the expected shape; Auth, Onboarding, Profile, Health Profile, Modal lack several layers. |

## Import and dependency findings

- No deep relative imports were found.
- No definite circular feature dependency was found by static import review.
- Current feature dependency direction is roughly: onboarding -> auth; auth/home/history -> profile; profile/home/dashboard/food-analysis -> health-profile. Shared infrastructure does not import product features.
- Same-feature absolute deep imports are common (`@/features/x/hooks/...`) even where the hook is exported publicly. Standardize internal import style later, but it is not a Phase 0 production change.
- `dashboard.types.ts` infers types from the Zod schema, which is a useful single-source pattern. Other features duplicate explicit types and schemas, increasing drift risk.
- Zod schemas for bundled images make current REST contracts frontend-specific.

## Reusable components and logic

Reuse only after comparing against Figma tokens and accessibility requirements:

| Candidate | Current location | Recommendation |
|---|---|---|
| `Button` | `src/components/ui/button.tsx` | Reuse behavior/API; restyle against new component variants. |
| `Typography` | `src/components/ui/typography.tsx` | Reuse concept; replace typography scale after token extraction. |
| `ImageWithSkeleton` / `Shimmer` | `src/components/ui` | Reuse loading behavior after fixing image load handling and consolidating Chat's duplicate skeleton. |
| `MainScreenHeader` | `src/components/layout` | Refactor/replace visual API; new screens need several header variants. |
| `BottomTabBar` | `src/components/navigation` | Reuse navigation behavior only; replace UI to match Figma. |
| Auth inputs | `src/features/auth/components` | Reuse interaction/accessibility ideas; replace visual implementation. |
| Health option/field/progress components | `src/features/health-profile/components` | Reuse selection/form logic after new schema; replace visuals. |
| HTTP client/error/env/query helpers | `src/services`, `src/config`, `src/providers` | Strong reuse candidates with auth/initial-data corrections. |
| Mock adapter + response parser | `src/services/http` | Reuse; change fixture contracts to backend-ready JSON. |

## Current-to-target ownership map

| Target domain | Current sources | Phase 1 ownership recommendation |
|---|---|---|
| `identity/auth` | `auth`, root routing, HTTP auth stubs | Auth feature owns provider login/exchange/session; root owns guards. |
| `profile` | `profile`, part of `health-profile` | Account/profile feature owns identity and settings; no route-param storage. |
| `health-profile` | `health-profile`, Profile Context | Own validated health preferences, weight goal, restrictions, and edit policy. |
| `nutrition` | `food-analysis`, `home`, `ai-chat`, Dashboard strings | Shared domain contracts owned by nutrition feature/infrastructure, not screens. |
| `recommendation/home` | `home`, some Chat quick prompts | Own meal-period context and recommendations; logging remains History. |
| `conversation/chat` | `ai-chat`, History chat cards | Own conversations, messages, structured parts, and persistence. |
| `meal-logging/history` | `history`, Chat saves, Home check actions | Own confirmed append-only events and filters. |
| `activity` | only Figma/current mock labels | New lightweight activity suggestion/log contracts. |
| `dashboard` | independent Dashboard fixture | Read-model/projection over confirmed history/profile, strict seven days. |
| `subscription` | `subscription`, Profile premium card | Own plans, mock checkout state, status, and UI-only entitlement preview. |
| shared infrastructure | config/providers/services/theme/components | Keep product-agnostic; expose stable adapters and tokens. |
