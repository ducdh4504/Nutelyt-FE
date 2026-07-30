# Figma-to-Code Screen Matrix

## Inspection scope

Source file: [Nutelyt Figma design](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=11-873&m=dev). Figma MCP metadata was read for all ten top-level sections; design context and screenshots were additionally inspected for representative onboarding, sign-in, health-profile, Home, History, Chat, Profile, Premium, and Dashboard frames.

The file contains one page (`0:1`, misspelled “Deisgn”), 50 application frames, and three top-level brand assets. Figma is treated as authoritative for screen structure, component states, sheets/dialogs, navigation affordances, and visual patterns. Numbers, thresholds, dates, prices, medical copy, and feature promises remain placeholders until confirmed by product/backend rules.

Proposed routes below are planning targets only. No route was changed in Phase 0.

## Brand asset inventory

| Section / node | Asset | Current equivalent | Requirement / action |
|---|---|---|---|
| `00 - Brand Assets` `1:301` / `1:300` | Mascot AI | `assets/images/Nutelyt-AI.png` | Compare/export canonical raster/vector and usage variants; REUSE/REPLACE asset after approval. |
| `00 - Brand Assets` `1:301` / `1:298` | Full Logo | `assets/images/Nutelyt-logo.png` | Canonical full-logo asset; also needed by existing Splash KEEP flow. |
| `00 - Brand Assets` `1:301` / `1:299` | Text Nutelyt | `assets/images/Nutelyt-text.png` | Canonical wordmark; verify transparent background and scale. |

## Complete 50-frame matrix

### 01 - Onboarding (`11:870`)

| Figma Section & Frame | Frame State & Proposed Route | Current Route & Screen Path | Current Feature | Existing Reusable Component | Required Model/Data | Action | Dependencies & Risks & Notes |
|---|---|---|---|---|---|---|---|
| Onboarding — `Giới thiệu 1 (Onboarding)` `1:2` | Step 1/3; `/onboarding` internal step | `/onboarding`; `onboarding-flow-screen.tsx` | onboarding | `ScreenContainer`, progress dots, Button | persisted onboarding state, localized copy, brand/mascot assets | REPLACE UI | Figma uses personalization/weight-loss message; current copy promotes scanning. Splash is separate and remains KEEP. |
| Onboarding — `Giới thiệu 2 (Onboarding)` `1:44` | Step 2/3; `/onboarding` | same | onboarding | transition/progress behavior | step copy, dietary chips, mascot asset | REPLACE UI | Floating assistant affordance is visual; do not imply chat availability before auth without product approval. |
| Onboarding — `Giới thiệu 3 (Onboarding)` `1:96` | Step 3/3; `/onboarding` -> auth | same | onboarding | asset prefetch, CTA flow | completion persistence, dashboard preview data as decorative content | REPLACE UI | Current completion is not persisted. Target redirect must be boot/session-aware. |

### 02 - Authentication (`11:871`)

| Figma Section & Frame | Frame State & Proposed Route | Current Route & Screen Path | Current Feature | Existing Reusable Component | Required Model/Data | Action | Dependencies & Risks & Notes |
|---|---|---|---|---|---|---|---|
| Authentication — `Đăng nhập (Sign In)` `1:155` | Default sign-in; `/login` | `/login`; `auth/screens/login-screen.tsx` | auth | `AuthTextInput`, Google-button shell, Button | sign-in schema, Supabase provider result, backend exchange/session, field/server errors | REPLACE UI | Current credentials are hard-coded; Google/forgot password are no-ops. |
| Authentication — `Đăng ký (Sign Up)` `1:222` | Default sign-up; `/register` | `/register`; `auth/screens/register-screen.tsx` | auth | auth inputs, Button | sign-up/verification schema, terms consent, Supabase identity, backend profile bootstrap | REPLACE UI | Current submit/Google actions are no-ops; Figma fields are examples only. |

### 03 - Health Profile (`11:872`)

| Figma Section & Frame | Frame State & Proposed Route | Current Route & Screen Path | Current Feature | Existing Reusable Component | Required Model/Data | Action | Dependencies & Risks & Notes |
|---|---|---|---|---|---|---|---|
| Health Profile — `Thông tin cơ bản (Step 1/4)` `5:31` | Wizard step 1; `/health-profile` | `/health-profile`; `health-profile-flow-screen.tsx` | health-profile | fields, header, progress, option controls | name/DOB/gender/height/current weight schema with units | REPLACE UI; REUSE LOGIC | Current local validation only; date/profile persistence absent. |
| Health Profile — `Mục tiêu giảm cân (Step 2/4)` `5:272` | Wizard step 2; `/health-profile` | same | health-profile | option cards/progress | starting/current/target weight, pace `0.25/0.5/0.75`, goal metadata | REPLACE UI | Target weight does not exist. Pace values need business approval; MVP goal fixed to weight loss. |
| Health Profile — `Chế độ ăn và dị ứng (Step 3/4)` `5:125` | Wizard step 3; `/health-profile` | same | health-profile | option list, allergy text input | multi-diet preferences, structured allergies, supported restrictions | REPLACE UI | Current diet is single-select and conditions are a separate step; Figma says multi-select. |
| Health Profile — `Kiểm tra lại hồ sơ (Step 4/4)` `5:349` | Review/confirm; `/health-profile/review` | current flow pushes `/profile` review; `profile-screen.tsx` | profile + health-profile | BMI/summary utilities after review | complete validated draft, BMI display, consent/version | ROUTE CHANGE REQUIRED; REPLACE UI | Do not pass health profile JSON in route params. BMI is advisory only. |

### 04 - Home (`11:873`)

| Figma Section & Frame | Frame State & Proposed Route | Current Route & Screen Path | Current Feature | Existing Reusable Component | Required Model/Data | Action | Dependencies & Risks & Notes |
|---|---|---|---|---|---|---|---|
| Home — `Home UI` `7:716` | Time-based default (screenshot: breakfast); `/home` | `/home`; `home/screens/home-screen.tsx` | home | tab behavior, image skeleton, header concept | local time/timezone, meal period, daily confirmed progress, nutrition recommendation cards, save/confirm state | REPLACE UI; REUSE LOGIC | Current Home never reads time and has no log mutation. Figma meal/content values are placeholders; apply confirmed window config outside screen. |

### 05 - History (`15:3`)

| Figma Section & Frame | Frame State & Proposed Route | Current Route & Screen Path | Current Feature | Existing Reusable Component | Required Model/Data | Action | Dependencies & Risks & Notes |
|---|---|---|---|---|---|---|---|
| History — `History - Overview` `13:896` | Populated all filter; `/history` | `/history`; `history/screens/history-screen.tsx` | history | search UI, image skeleton, Dashboard CTA | paged History event union: meal/activity/saved/conversation/weight with timestamps/status | REPLACE UI | Current list has only viewed/saved food cards. Dashboard must use confirmed entries only. |
| History — `History - Filter` `13:1749` | Filter bottom sheet open; `/history` state | same; current filter button no-op | history | Pressable/sheet route pattern to design | type filters, 7/30-day range, applied filter state | NEW | Figma 30-day History is allowed; Dashboard remains exactly seven days. |
| History — `History - Loading` `13:1324` | Initial/refresh loading; `/history` | no reachable equivalent due mock `initialData` | history | shared Shimmer | query status, skeleton layout | NEW | Fix query seeding/refetch before this state can be tested. |
| History — `History - Null` `13:1463` | Empty history; `/history` | no full empty state | history | mascot/CTA patterns | zero-event result, chat/home actions | NEW | Must distinguish empty account from filtered-empty. |
| History — `History - Filter no matching results` `13:1588` | Filter/search empty; `/history` | current search-empty card only | history | current search filter logic | active filters/query and reset action | REFACTOR / REPLACE UI | Keep semantic distinction and accessible reset. |

### 06 - Chat AI (`15:1692`)

| Figma Section & Frame | Frame State & Proposed Route | Current Route & Screen Path | Current Feature | Existing Reusable Component | Required Model/Data | Action | Dependencies & Risks & Notes |
|---|---|---|---|---|---|---|---|
| Chat AI — `New Chat Session` `15:38` | Empty unified workspace; `/chat` | `/chat-ai`; `ai-chat/screens/chat-ai-screen.tsx` | ai-chat | input shell/mascot idea | conversation draft, time-based quick prompts, input capabilities | ROUTE CHANGE REQUIRED; REPLACE UI | Removes current cooking/self-select split. Camera/voice controls remain Production-deferred. |
| Chat AI — `Bun bo Recipe Recommend` `15:224` | Structured recipe answer; `/chat/[conversationId]` | `/chat-ai` local mode | ai-chat | recipe content, nutrition display concept | message/content union, adjusted recipe version, warnings, confirm-consumed mutation | REPLACE UI; REUSE LOGIC | “Ghi nhận đã ăn” must explicitly create a History meal log; save recipe is separate. |
| Chat AI — `Pho ga Eat out` `15:475` | Consumed-food feedback; `/chat/[conversationId]` | current eat-out entry disabled | ai-chat | card/feedback concepts | food analysis response, confirmed meal action, nutrition estimate/confidence | NEW | Do not treat placeholder scoring as a business rule. |
| Chat AI — `Using camera` `15:704` | Image-message conversation; Production-deferred | current `/scan` is separate, not chat | ai-chat / food-analysis | none for MVP | image upload/message content and analysis job, later | REMOVE LATER / DEFER | Audit only; do not implement in MVP refactor. |
| Chat AI — `Nutelyt Response Loading` `15:897` | Assistant typing/loading; conversation route | no current conversation loading state | ai-chat | shimmer/typing primitives | pending message/request ID/cancel/retry | NEW | REST request state for MVP; SignalR is post-MVP. |
| Chat AI — `Error` `15:1247` | Response error with retry/home; conversation route | no current equivalent | ai-chat | shared error state/Button | failed message/request, retryability, error code | NEW | Preserve input/conversation on retry. |
| Chat AI — `Chat History` `15:1411` | Quick prompts + history drawer; `/chat` and `/chat/[id]` | messages are local and cleared | ai-chat | current local messages only as prototype | conversation list/search/pagination/title/timestamps | NEW | Drawer is transient UI; individual conversation should be route-addressable for restoration/deep links. |

### 07 - Profile Setting (`22:2998`)

| Figma Section & Frame | Frame State & Proposed Route | Current Route & Screen Path | Current Feature | Existing Reusable Component | Required Model/Data | Action | Dependencies & Risks & Notes |
|---|---|---|---|---|---|---|---|
| Profile — `Profile - Overview` `20:39` | Populated profile; `/profile` | `/profile`; `profile/screens/profile-screen.tsx` | profile | BMI/initials helpers, card concepts | account, profile, goal, health summary, latest weight, entitlements | REPLACE UI | Current runtime Context and duplicate display parsing are not persistent. |
| Profile — `Edit Information` `20:664` | Personal-info edit; `/profile/personal` | partial `/health-profile-summary` and settings | profile | auth/health fields | profile update request/schema, avatar reference | NEW / ROUTE CHANGE REQUIRED | Email authority belongs to auth provider; clarify editable fields. |
| Profile — `Edit Health Personal` `20:790` | Health/goal edit form; `/profile/health` | `/health-profile` recreates wizard | health-profile/profile | option/field controls | canonical health profile, target weight, pace, preferences/allergies | NEW / REPLACE UI | Open decision: edit cooldown. |
| Profile — `Confirm Edit Health` `22:1294` | Goal-change confirm dialog; `/profile/health` state | no equivalent | health-profile/profile | generic dialog pattern to create | change summary, version/conflict, confirmation mutation | NEW | Dialog copy is not evidence of a 15/30-day rule. |
| Profile — `Quick Setup Weight` `22:1572` | Weight-entry overlay/sheet; `/profile` state | profile displays weight only | profile/history | numeric field/Button | `WeightMeasurement` with value/unit/measuredAt | NEW | Successful entry must append History event and invalidate Dashboard/Profile. |
| Profile — `Setup Notificatino` `22:2118` | Notification preferences; `/profile/notifications` | settings has no notification screen; flag false | profile/settings | Switch pattern | preference schema/capability status | NEW | Native scheduling/backend policy is undefined; UI state alone is insufficient. |
| Profile — `Logout Dialog` `22:2732` | Logout confirmation dialog; `/profile` state | settings immediately replaces `/login` | auth/profile | dialog pattern | logout/revoke result, pending/error state | NEW / REFACTOR | Must clear Supabase/backend sessions and query cache. |
| Profile — `Loading Profile` `22:2774` | Loading; `/profile` | no reachable equivalent | profile | Shimmer | profile query status | NEW | Replace route-param hydration with query/session store. |
| Profile — `Error` `22:2915` | Error/retry/home; `/profile` | no equivalent | profile | shared error/Button | normalized API error/retry | NEW | Guard must distinguish session expiry from transient failure. |

### 08 - Premium Container (`30:2264`)

| Figma Section & Frame | Frame State & Proposed Route | Current Route & Screen Path | Current Feature | Existing Reusable Component | Required Model/Data | Action | Dependencies & Risks & Notes |
|---|---|---|---|---|---|---|---|
| Premium — `Premium Plan` `28:3005` | Plan list/comparison; `/subscription` | `/subscription`; `subscription-screen.tsx` | subscription | plan query/card concepts | serializable plans, benefit codes, MVP-mock disclosure | REPLACE UI | Prices/features are placeholders; do not promise post-MVP features as active. |
| Premium — `Choosing Monthly Plan Dialog` `30:8` | Monthly selected tray; `/subscription` state | local selected plan exists | subscription | local selection logic | selected plan | REPLACE UI | Transient state, not a route. |
| Premium — `Choosing Annual Plan Dialog` `30:447` | Annual selected tray; `/subscription` state | same | subscription | local selection logic | selected plan/savings presentation | REPLACE UI | Savings must be data-derived if retained. |
| Premium — `Review Chosen Plan` `30:884` | Review, consent unchecked; `/subscription/review` | no equivalent; current pushes success | subscription | plan detail hook | selected plan, billing terms, consent state | NEW | MVP demo only; no real store payment implied. |
| Premium — `Argee Privacy Policy` `30:1074` | Review, consent checked; `/subscription/review` | no equivalent | subscription | checkbox/Button | consent timestamp/version | NEW | Misspelling is Figma frame name only. |
| Premium — `Confirm Payment Dialog` `30:1266` | Confirm dialog; review state | no equivalent | subscription | dialog pattern | mock checkout intent/payment summary | NEW | Must be clearly simulated for MVP. |
| Premium — `Loading Payment` `30:1509` | Processing; checkout state | no equivalent | subscription | loading primitive | payment state discriminator | NEW | Never infer success from timer in production architecture. |
| Premium — `Payment Successfully` `30:1574` | Success; checkout state | `/subscription/success`; success screen | subscription | current success layout/data concepts | succeeded result, mock subscription status | REPLACE UI | Current route is directly addressable and uses device dates. |
| Premium — `Payment Failed` `30:1724` | Failed; checkout state | no equivalent | subscription | error/Button | failure code/retry/change-plan action | NEW | UI-mock state only. |
| Premium — `Payment Cancelled` `30:1824` | Cancelled; checkout state | no equivalent | subscription | empty/result pattern | cancelled state | NEW | Must not modify subscription status. |
| Premium — `Premium Management` `30:1910` | Active-plan management; `/subscription/manage` | no equivalent | subscription | plan benefit list concept | subscription status/renewal/store-management link | NEW | Real management is post-MVP/unknown; demo must be labeled. |
| Premium — `Loading Premium Management` `30:2131` | Management loading; `/subscription/manage` | no equivalent | subscription | Shimmer | subscription-status query | NEW | Avoid unreachable state caused by unconditional mock initial data. |

### 09 - MAIN - Dashboard (`33:4980`)

| Figma Section & Frame | Frame State & Proposed Route | Current Route & Screen Path | Current Feature | Existing Reusable Component | Required Model/Data | Action | Dependencies & Risks & Notes |
|---|---|---|---|---|---|---|---|
| Dashboard — `Stable` `33:2299` | Stable/behavior improving; `/dashboard` | `/dashboard`; `dashboard-screen.tsx` | dashboard | query pipeline, chart/card concepts | exact seven-day window, completeness, meals/activity/weight, nutrition, alerts, insight | REPLACE UI | Must derive from confirmed History/Profile; current data is independent. |
| Dashboard — `Improve Well` `33:2921` | Positive trend; `/dashboard` | same | dashboard | same | prior-window comparison, trend evidence | NEW state / REPLACE UI | Threshold for state is a backend/product rule, not Figma copy. |
| Dashboard — `Limited Data` `33:3520` | Partial data; `/dashboard` | same static full data | dashboard | same | completeness counts and limited-confidence insight | NEW state / REPLACE UI | Define minimum-data semantics. |
| Dashboard — `Caution` `33:4113` | Caution/low adherence; `/dashboard` | warnings exist but different structure | dashboard | warning card concepts | stable alert codes, evidence, severity/actions | REPLACE UI | Nutrition/medical thresholds must be backend-owned. |
| Dashboard — `No data` `33:4683` | Insufficient/empty; `/dashboard` | no equivalent | dashboard | mascot/CTA patterns | zero confirmed events and actions to log meal/activity/weight | NEW | Dashboard uses only user-confirmed data. |
| Dashboard — `Loading` `33:4796` | Loading; `/dashboard` | no reachable equivalent | dashboard | Shimmer | dashboard query status | NEW | Current hook always seeds mock data. |
| Dashboard — `Error` `33:4903` | Error/retry/home; `/dashboard` | no equivalent | dashboard | shared error/Button | normalized error/retry | NEW | The old `/dashboard/warning-detail` has no direct Figma frame; decide separately. |

## Reusable visual patterns identified in Figma

- Four-item bottom navigation with Home, History, Conversation, Profile.
- Compact top app bars, title/subtitle headers, and back/overflow/menu actions.
- Mascot plus speech/insight cards.
- Reusable query-state shells: skeleton/loading, empty/insufficient, error/retry.
- Filter chips and bottom sheets; confirmation dialogs; bottom CTA trays.
- Nutrition/meal/activity/weight cards with badges and transparency notes.
- Chat bubbles, structured response cards, quick prompts, fixed composer, and history drawer.
- Plan cards, comparison table, checkout result states, and management list.

These patterns justify shared Phase 1 primitives, but component boundaries should be drawn from repeated behavior and data contracts, not copied from Figma layer names such as `Container`.

## Figma-required assets and data dependencies

- Canonical logo, wordmark, AI mascot, food photography/thumbnails, and iconography.
- A serializable media contract; Figma temporary asset URLs expire and must not be committed as runtime sources.
- Numeric nutrition/weight/activity data with explicit units and timestamps.
- Stable localized copy keys for errors, disclaimers, state labels, and actions.
- Server or approved domain ownership for recommendation, alert, and progress rules.
- Persisted auth/onboarding/profile/conversation state and query-backed loading/error behavior.
