# Model, Schema, and Mock Audit

## Summary

The codebase has validated read-models for six mock-backed features, but most contracts are shaped for the current UI rather than the target backend. Local bundled image module IDs, localized display strings, preformatted units, date-group labels, and presentation tags appear inside API schemas. Auth, profile, health-profile, conversation, activity, confirmed logging, weight measurement, and payment state are either absent or unvalidated.

No production models were changed or created during this audit.

## Type and model inventory

| Model/type | File | Owner | Current fields / use | Schema/API relation | Duplication / coupling | Phase 1 action |
|---|---|---|---|---|---|---|
| `RouteProfileParams` | `src/types/navigation.types.ts` | shared navigation | `profile`, `foodId` strings/arrays | none | Carries serialized health PII through URLs | **Replace** with IDs/store-backed state |
| `HealthOption` | `src/features/health-profile/health-profile.types.ts` | health-profile | UI id/label/icon/tone/description | none | UI option and color/icon coupled | Expand/split domain option from presentation |
| `HealthProfilePayload` | same | health-profile | name, DOB, gender, height, current weight, one goal/diet, conditions, allergy text | none | Overlaps `HealthProfileSummary` and Profile display type | **Replace** with validated request/response contracts |
| `HealthProfileSummary` | same | health-profile/profile | payload plus age, purpose, diseases, nullable goal/diet | none | Duplicated aliases (`conditions`, `diseases`, labels/IDs); mixed computed/display fields | **Replace** |
| `ProfileDisplayData` | `src/features/profile/screens/profile-screen.tsx` | profile UI | extends health payload with legacy fields | none | Screen-local duplicate contract | Remove after migration |
| `FoodRecommendation` | `src/features/home/home.types.ts` | home | id, name, description, bundled image | `foodRecommendationsSchema`; `GET /home/recommendations` | Card-shaped, no time/nutrition/status/context | **Replace/expand** |
| `HistoryItem` / `HistorySection` / `HistoryStatus` | `src/features/history/history.types.ts` | history | display card with title/status/time/image grouped by title | `historySectionsSchema`; `GET /history` | Not an event model; status localized | **Replace** with discriminated union |
| `RecipeId` | `src/features/ai-chat/ai-chat.types.ts` | ai-chat | closed union of seven fixture IDs | recipe schema | Fixture-specific, cannot accept backend IDs | **Replace** with opaque string/UUID |
| `MockRecipe` | same | ai-chat | chips, intro, string nutrition, overview, ingredients, steps, rows, bundled image | `recipeSchema`; `GET /ai-chat/recipes` | Combines recipe entity, AI copy, card view, and detail view | **Replace**, preserve content concepts |
| `RecipeCatalog` | same | ai-chat | record of recipes plus two hard-coded recommendation lists | `recipeCatalogSchema` | Fixture catalog, not conversation response | Remove/replace |
| screen-local `ChatMessage` | `src/features/ai-chat/screens/chat-ai-screen.tsx` | ai-chat UI | plain text or assistant recipe-card | none | No timestamps, status, conversation ID, warnings, actions, or structured response envelope | **Replace** with message/content discriminated unions |
| `NutritionFacts` | `src/features/food-analysis/food-analysis.types.ts` | food-analysis | numeric calories/protein/carbs/fat/sodium plus serving string | `foodAnalysisSchema`; `GET /food-analysis/:id` | Closest domain-like type; units/serving still ambiguous | **Expand** and move to nutrition domain |
| `MockFood` / `FoodStatus` | same | food-analysis | analyzed food, score/status/copy/tags/nutrition/alternatives | `foodAnalysisSchema` | UI copy and backend analysis combined | Replace for Production; do not prioritize MVP |
| `DashboardData` and item aliases | `src/features/dashboard/dashboard.types.ts` | dashboard | inferred from dashboard Zod schema | `dashboardSchema`; `GET /dashboard` | Strong schema/type linkage, but presentation-ready strings dominate | **Replace schema**, keep inference pattern |
| `SubscriptionPlan` / `SubscriptionPlanId` | `src/features/subscription/subscription.types.ts` | subscription | three fixed plan IDs, display price/period/tagline/features/badge/current | plan schemas; plan GETs | UI-ready and fixed IDs; no currency/minor units/status | **Expand/replace** |
| `FeatherIconName`, `ImageSource` helpers | shared types/utils | shared UI | presentation utilities | custom Zod image checks | Correctly UI-specific, must not enter REST DTOs | Keep in UI layer only |

## Zod schema inventory

| Schema | File | Validates | Backend readiness | Findings |
|---|---|---|---|---|
| `environmentSchema` | `src/config/env.ts` | public Expo environment | Good | Centralized `process.env`, URL validation, production baseURL requirement. |
| `foodRecommendationSchema[]` | `home/schemas/home.schema.ts` | Home cards | Low | Requires a React Native `ImageSource`; missing nutrition, time window, confirm state. |
| `historySectionsSchema` | `history/schemas/history.schema.ts` | localized grouped cards | Low | Localized statuses and `ImageSource`; no timestamp/event kind/pagination. |
| `recipeSchema` / `recipeCatalogSchema` | `ai-chat/schemas/recipes.schema.ts` | static recipe catalog | Low | Fixture ID enum, preformatted nutrition strings, no conversation response. |
| `foodAnalysisSchema` / array | `food-analysis/schemas/food-analysis.schema.ts` | food analysis card/detail | Medium-low | Numeric nutrition is useful; score/copy/status and serving units need API design. |
| `dashboardSchema` | `dashboard/schemas/dashboard.schema.ts` | complete Dashboard view model | Low | Most metrics are strings; no canonical window timestamps, completeness, or source references. |
| `subscriptionPlanSchema` / array | `subscription/schemas/subscription.schema.ts` | plan cards | Low | Fixed IDs and display price; no subscription/payment/status schemas. |

Missing schemas:

- account/profile and Supabase/backend auth exchange/session/refresh/logout;
- health-profile create/update/read and weight-goal editing;
- dietary preference/allergy/restriction reference data;
- time-window and recommendation request/response;
- food/ingredient/recipe/nutrition canonical entities;
- conversations, messages, structured AI parts, pagination, retry/error;
- meal/activity/weight History event union and confirmation mutations;
- seven-day Dashboard query/result and health alerts;
- subscription status, checkout intent, transaction, and payment result.

## Mock and hard-coded data inventory

| Mock / hard-coded source | File | Used by | Hard-coded characteristics | Contract / risk | Phase 1 action |
|---|---|---|---|---|---|
| Home recommendations | `home/data/mock-home.ts` | Home repository/hook/screen | Three foods, local images, no time/diet/nutrition | Schema-valid but card-only; unrelated to History | Replace fixture against recommendation DTO |
| History sections | `history/data/mock-history.ts` | History repository/hook | Six viewed/saved food cards; titles like “Hôm nay”; invalid mixed 12/24h strings such as `15:45PM` | No confirmed meal/activity/weight entries | Replace with event fixtures |
| Recipe catalog | `ai-chat/data/mock-recipes.ts` | recipe repository/Chat | Seven fixed Vietnamese foods, canned intros, nutrition, steps, recommendation groups | Large UI-coupled fixture; no AI response contract | Split domain recipe fixtures from conversation fixtures |
| Food analyses | `food-analysis/data/mock-foods.ts` | food repository/results | Seven products/meals, mixed Vietnamese/English copy and relative dates | Production-deferred; local analysis thresholds | Retain only for deferred feature tests, redesign later |
| Dashboard | `dashboard/data/mock-dashboard.ts` | Dashboard repository/screens | Fixed `08/06-14/06`, independent charts/warnings/diary/AI copy/sodium detail | **Critical:** disconnected from History/Profile; diary overlaps labels only | Replace with derived seven-day fixture set |
| Subscription plans | `subscription/data/subscription-plans.ts` | plan repository/screens | `0đ`, `59.000đ`, `590.000đ`, fixed marketing copy | UI placeholder acceptable for demo, not payment contract | Keep content as mock seed; add state contracts |
| Health goals/diets/conditions | `health-profile/data/health-profile-options.ts` | health wizard/Profile utilities | Multiple non-MVP goals, five diets, six conditions, UI icons/colors | No reference IDs/version/API; goal scope conflicts | Replace reference data after product approval |
| Onboarding step copy/assets | `onboarding/data/*` | onboarding UI/Splash prefetch | three static steps and two images | UI-only and replaceable; Splash prefetch dependency | Keep Splash asset list; replace onboarding content |
| Hard-coded auth account | `auth/screens/login-screen.tsx` | login | one email/password | Security/demo-only blocker | Remove when auth implemented |
| Chat intent recognizers/responses | `ai-chat/screens/chat-ai-screen.tsx` | Chat | keyword matching, canned failure copy, fake voice insertion | Business/AI behavior in UI | Remove; replace with backend structured response |
| Food analysis thresholds | `food-analysis/utils/analysis-summary.ts` | analysis result | sodium 450/900, carbs 45, fat 15, calories 350 | Backend Nutrition Engine should own | Remove from frontend after backend integration |
| Profile fallbacks and BMI labels | health/profile utilities/screens | profile | `--`, localized labels, BMI cutoffs in screen | Mixed display/domain logic | Centralize approved calculation/display policy |
| Subscription dates | `subscription-success-screen.tsx` | success UI | `new Date()` plus +1 month/year | No transaction authority | Replace with payment/subscription result |

There is no fake repository delay or fake pagination. UI animations and the 2.3-second Splash minimum are not data delays. The absence of latency simulation is why current initial-data screens do not exercise loading/error states.

## Required domain coverage

| Target domain model | Exists? | Current approximation | Missing / concern | Discriminated union needed? |
|---|---|---|---|---|
| User account | No | auth form fields only | IDs, email verification, provider, status, created/updated metadata | No |
| User profile | Partial | health summary also carries name/DOB/gender | Separate account/profile contract, avatar, locale, timezone | No |
| Health profile | Partial | `HealthProfilePayload/Summary` | target weight, units, multi-preferences, structured restrictions, edit version/policy | No |
| Weight goal | No | broad `goal` string and current `weight` | starting/current/target weights, pace, status, effective dates | Possibly status union |
| Diet preference / allergy / restriction | Partial | option IDs/labels and one allergy text | canonical IDs, multiple selection, severity/notes where supported | Restriction kind union recommended |
| Meal time window | No | none | canonical local time ranges, meal period, timezone/personalization source | Meal-period enum; config object |
| Food item / ingredient / recipe | Partial | `MockFood`, `MockRecipe` | domain IDs, portions/units, providers, media URL, ingredients, versioning | Recipe content parts may be unions |
| Recipe version | No | none | base/basic vs AI-adjusted, provenance, parent ID, changes/warnings | **Yes** or explicit `versionKind` |
| Nutrition facts | Partial | numeric `NutritionFacts` and string recipe/dashboard values | consistent numeric units, per-serving basis, confidence/source | Nutrient entries may use keyed records |
| Meal suggestion | Partial | Home card and recipe catalog lists | time context, rationale, suitability, actions, expires/refresh | Suggestion content/action union useful |
| Meal log | No | History viewed/saved card | confirmed consumed time, portion, nutrition snapshot, source suggestion/recipe | **Yes**, as History event member |
| Activity / activity log | No | text in Figma/History design only | type, duration, estimated calories, status, timestamps | **Yes**, as History event member |
| History entry | No | `HistoryItem` | canonical union across meal, saved recipe, food, activity, weight, conversation | **Yes, required** |
| Conversation | No | component-local message array | ID/title/timestamps/status/pagination/user ownership | No |
| Chat message | Minimal | local text or recipe card | IDs, timestamps, delivery/error, structured parts, quick messages, warnings/actions | **Yes, required** for content parts |
| AI structured response | No | canned text + recipe card | answer text, recipe/food/activity cards, warnings, confirmations, citations/meta | **Yes, required** |
| Dashboard summary | UI-only | `DashboardData` | canonical seven-day window, source completeness, numeric aggregates, comparison | State/result union or `state` discriminator recommended |
| Weight measurement | No | Profile display strings | numeric value/unit/measuredAt/source/note | **Yes**, as History event member |
| Health alert | Partial UI | Dashboard warnings | stable code/severity/evidence/window/actions/disclaimer | Severity enum; evidence/action parts may be unions |
| Subscription plan | Partial | `SubscriptionPlan` | product/store IDs, currency/minor units, availability, benefits codes | No |
| Subscription status | No | `isCurrent` card flag | free/trial/active/grace/past-due/cancelled/expired, renewal | **Yes** or status enum |
| Payment state | No | navigation to success screen | idle/confirming/processing/succeeded/failed/cancelled with transaction reference | **Yes, required** |

## Contract quality risks

### Bundled images in REST schemas

Home, History, recipes, and Dashboard validate `number | ImageSource`. A backend will return URLs/storage keys/media objects, not Metro module numbers. Domain/API models should use serializable media references; a UI adapter may resolve local fixture images separately.

### Display strings instead of data

Examples include `1,950`, `kcal/ngày`, `+150 vs mục tiêu`, `4/7 ngày`, `08/06 - 14/06`, and `59.000đ`. These prevent localization, numeric aggregation, timezone-safe filtering, and backend parity. DTOs should carry numbers, units/currency, timestamps, and stable codes; presentation formatting belongs at the view-model boundary.

### Route JSON as storage

Health data is serialized to a query param, parsed by multiple functions, and sent through Home/Profile/Dashboard/food-analysis navigation. This duplicates contracts, leaks sensitive data into URLs, and makes back/deep-link behavior fragile.

### Query hooks always seed mock data

All six query hooks provide repository data as `initialData`, set `initialDataUpdatedAt: 0`, and the global QueryClient sets `refetchOnMount: false`. This can prevent the query function from running on mount even when `enableMockApi` is false. It also makes loading/error states unreachable. Phase 1 must separate fixture seeding from production request behavior.

## History and Dashboard coherence check

The target History requires meals, saved recipes, consumed foods, activities, and weight updates with timestamps/status/nutrition/activity details. Current History contains only viewed/saved food-like cards. It cannot represent any target aggregate.

Dashboard is an entirely separate static fixture. It does not import History or Profile data, does not filter a timestamp range, and contains its own diary entries, date range, warning evidence, and calorie/macro values. Some dish names overlap (`Cơm tấm`, `Salad cá hồi`, `Bún bò`) but IDs/status/times do not form shared records.

**Risk: critical.** A user can see one set of events in History and an unrelated Dashboard summary. Phase 1 must define a shared confirmed event fixture/repository or one backend read model before migrating either screen.

## Camera, image, and voice references

- `expo-camera` and two scan/analysis routes are active, not merely installed.
- Figma Chat includes camera and voice affordances.
- Current Chat voice is a simulated local toggle/canned-text insertion, not audio input.
- No image-message model or upload contract exists.

Per product scope, these inputs remain Production-deferred. Their existing references should not expand the MVP migration.
