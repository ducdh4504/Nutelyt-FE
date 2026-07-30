# Phase 0 Executive Summary

Audit date: 2026-07-27 (Asia/Saigon)  
Repository: `Nutelyt-FE`  
Branch observed: `feature/refactor-new-design`  
Scope: read-only production audit plus these documents. No routes, UI, models, mocks, APIs, packages, or Expo configuration were changed.

## Executive verdict

The frontend is a working UI prototype with a recognizable feature-based architecture, but it is not ready for a direct screen-by-screen visual swap. The strongest existing foundation is the read path used by six data features:

`Screen -> React Query hook -> feature API -> Axios client -> mock adapter -> Zod response parsing`

That path is present for Home, History, AI recipe data, food analysis, Dashboard, and Subscription. TypeScript and an uncached ESLint run both pass. The main readiness problem is contract integrity: authentication and health-profile persistence are runtime mocks, the domain types are mostly shaped around current UI, History and Dashboard use independent static datasets, and the current Query configuration can leave mock `initialData` displayed without executing the API query.

The new Figma file was inspected through Figma MCP. It contains 50 application frames across nine product sections, plus three brand assets. It defines substantially more state coverage than the current code, notably History filters/empty/loading, Chat loading/error/history drawer, Profile edit/weight/notification/dialog states, Premium checkout outcomes, and seven Dashboard states.

## Non-negotiable disposition

- **KEEP:** the current application-level Splash flow only: native splash configuration, `/` entry route, `SplashScreen`, initial asset prefetch, and first redirect. Its missing configured asset files are a blocker to resolve without redesigning the flow.
- **REPLACE UI:** every other user-facing screen.
- **REUSE LOGIC selectively:** shared HTTP error normalization, environment validation, Query provider shape, mock-adapter pattern, Zod response parsing, alias configuration, and small shared UI primitives after contract review.
- **DO NOT carry forward as domain contracts:** screen-shaped recipe, history, Dashboard, health-profile, or bundled-image models without redesign.
- **REMOVE LATER, not in Phase 0:** legacy redirect routes, temporary health-profile completion UI, Expo-template modal, and deferred camera/analysis routes after product sign-off.

## Actual technology status

| Technology | Status | Evidence / qualification |
|---|---|---|
| React Native / React 19 | Active | Screens and shared components are React Native; installed RN `0.81.5`, React `19.1.0`. |
| Expo SDK 54 | Active, patch drift | `expo` resolves to `54.0.35`; `expo install --check` expects `~54.0.36`. SDK 54 targets RN 0.81 and React 19.1 per the [versioned SDK 54 reference](https://docs.expo.dev/versions/v54.0.0/). |
| Expo Router | Active | File routes live in `src/app`; installed `~6.0.23`; the SDK 54 reference recommends `~6.0.24` in the current documentation. |
| TypeScript | Active | Strict mode and aliases are configured; `tsc --noEmit` passes. |
| NativeWind / Tailwind | Active | NativeWind 4, Tailwind 3, Babel and Metro integration, global CSS, and extensive `className` use. |
| TanStack Query | Active but read-only in practice | Six features use `useQuery`; no mutations or invalidation flows exist. Global `refetchOnMount: false` plus mock `initialData` is a migration risk. |
| Axios | Active | Central client, request/response interceptors, mock adapters, and feature API GETs. |
| Zod | Active but incomplete | Six response schemas plus environment validation. No auth, profile, or health-profile schemas. |
| React Context | Active | `MainProfileProvider` holds health/profile state for the current runtime only. |
| Feature-based architecture | Partial | Ten feature folders exist; boundaries and completeness vary. |
| Mock Repository | Active | Mock mode defaults to enabled; repositories validate fixtures and feed Axios adapters. |
| Supabase Auth | Planned, absent | No client, package, storage, session restoration, or auth listener. |
| ASP.NET JWT + refresh token | Planned, stubs only | Token reader always returns `null`; refresh handler always rejects. |
| SignalR | Absent / post-MVP | No package or code. |
| Custom font loading | Planned/unused | `expo-font` is installed but no font loading code or font assets were found. |

## Refactor readiness

| Area | Readiness | Summary |
|---|---|---|
| Splash / boot | Amber | Flow is identifiable and must remain; native splash paths point to six missing files, and there is no `expo-splash-screen` runtime coordination or auth restoration. |
| Routing | Amber-red | File routing is simple, but there are no guards or `+not-found`; health data is serialized in route params; several legacy/temporary routes remain. |
| Shared infrastructure | Amber | Good central Axios/Zod/env foundations; auth and retry refresh are placeholders; mock `initialData` prevents realistic request-state behavior. |
| Feature boundaries | Amber | Public `index.ts` files exist, but screens often deep-import their own internals and cross-feature UI orchestration is coupled to Profile Context. |
| Domain models | Red | Key weight-loss, time-window, history-union, conversation, activity, weight-measurement, and subscription-status contracts are missing. |
| Home | Red | No current time, timezone, meal-period, diet filter, or confirmed-meal linkage exists. |
| Chat | Red | One 1,109-line screen; local-only messages; hard-coded intent recognition; fake voice state; no history persistence, request states, or confirmed logs. |
| History / Dashboard | Red | History is a search-view list; Dashboard is independent static data and does not derive from confirmed History/Profile facts. |
| Figma coverage | Amber | All 50 frames were inventoried, but design placeholders must not be promoted into business rules. |

## Highest-priority blockers

1. **Auth architecture gap:** confirmed Supabase Auth + ASP.NET JWT/refresh strategy has no implementation surface beyond interceptor stubs.
2. **Contract gap:** no backend-ready contracts for weight goal, target weight, time windows, recommendations, conversation/messages, activity logs, history unions, weight measurements, health alerts, subscription status, or payment state.
3. **Data-source split:** Dashboard and History are independent fixtures; Dashboard claims seven-day behavior without consuming confirmed logs.
4. **Mock lock-in:** every query hook supplies mock `initialData`; global mount refetch is disabled. Switching `enableMockApi` off does not guarantee that the REST query runs.
5. **Route-param PII:** health profile JSON is passed between routes and repeatedly parsed into duplicate shapes. This is not a safe session or persistence boundary.
6. **State coverage gap:** most current screens assume successful initial data; Figma requires loading, empty, error, retry, dialog, and confirmation states.
7. **App asset blocker:** all six images referenced by `app.json` for icon, adaptive icon, favicon, and native splash are absent.
8. **Oversized screens:** Chat (1,109 lines), Dashboard (776), Profile (641), and Subscription (509) combine presentation, state, and business decisions.

## Confirmed and open product decisions

Confirmed:

- Primary MVP goal is weight loss.
- Nutrition is primary; activity is lightweight support.
- Dashboard is exactly seven days.
- Supabase Auth will coexist with ASP.NET Core JWT + refresh tokens.
- Premium is an MVP UI mockup; advanced personalization and personalized wake/sleep windows are post-MVP.
- Camera, image, and voice inputs are deferred to Production even though current/Figma references exist.

Open decisions requiring owner sign-off before the relevant Phase 1 slice:

- Whether profile/goal edits are unrestricted, limited to 15 days, limited to 30 days, or only accompanied by a confirmation dialog. No cooldown rule exists in code or Figma.
- Exact REST token-exchange, secure-storage, refresh, revocation, and logout responsibilities across Supabase and ASP.NET.
- Whether conversation identity is route-addressable (`/chat/[conversationId]`) and its retention/pagination policy.
- Canonical timestamp/timezone policy and interval-boundary semantics for meal windows.
- Which History events are retained and which confirmed event types feed Dashboard.
- Whether the MVP Premium checkout screens simulate every payment outcome or stop at plan preview.
- Alert calculation ownership and thresholds; Figma copy is not a rules specification.

## Recommended go/no-go

**Go for Phase 1 only as a contract-first, guarded migration.** Do not begin by restyling the current large screens. First approve the navigation contract, auth/session boundary, canonical domain contracts, confirmed-history-to-dashboard derivation, and time-window ownership. Preserve the Splash flow unchanged while fixing only its missing assets/boot integration as an isolated task.

See the remaining files in this directory for evidence, complete inventories, the 50-frame matrix, risks, rollback strategy, and migration order.
