# Phase 1F — Unified AI Chat Refactor Report

## Scope

Replaced the legacy separated AI Chat UI with one unified, runtime-persisted Chat workspace. The work includes typed conversations and structured messages, a deterministic mock conversation engine, time-aware quick prompts, query/mutation hooks, a conversation sidebar, structured recipe/food-analysis/activity cards, explicit saved/confirmed event actions, and the required welcome/thinking/error states.

Excluded: real Gemini, direct provider calls, ASP.NET API implementation, persistent storage, streaming, SignalR, full camera food recognition, voice input, recipe-detail expansion, and UI refactors outside the Chat feature. No package was installed, no commit was created, and nothing was pushed.

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

Repository evidence reviewed includes the single `/chat-ai` tab route, legacy Chat screen/mocks, Profile runtime context, Home meal-period and runtime-log source, History adapter/query key, existing Scan camera capability, bottom-tab shell, UI primitives, and installed packages.

## Figma Nodes

- Welcome — [Chat Empty / Welcome](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=15-38&m=dev), node `15:38`.
- Recipe Response — [Meal Recommendation / Recipe Response](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=15-224&m=dev), node `15:224`.
- Food Analysis — [Food Analysis / Eating-out Response](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=15-475&m=dev), node `15:475`.
- Loading — [Thinking / Loading](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=15-897&m=dev), node `15:897`.
- Error — [Error / Retry](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=15-1247&m=dev), node `15:1247`.
- Conversation Sidebar — [Conversation Sidebar](https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=15-1411&m=dev), node `15:1411`.

Figma MCP was not callable in this session. The implementation follows the Phase 0 mapping and existing Nutelyt colors, imagery, bottom tabs, safe-area conventions, card elevation, and shared controls. Raw node dimensions, layer-level type styles, shadows, and spacing remain to be confirmed through an MCP-enabled visual review.

## Previous Chat Architecture

The existing thin `/chat-ai` route led to one large screen that contained three legacy conceptual modes: self-selected cooking, suggested home meals, and a disabled eating-out option. It embedded local keyword matching, local messages, faux voice interaction, recipe cards, a recipe detail view, and image loading directly in the screen. The old `MockRecipe` catalog, recipe API, query key, query hook, schema, and repository only supported that screen and had no connection to Profile, Home, or History events.

The route itself remains the single Chat tab route. The old mode-selection, detail state, voice simulation, recipe modules, and all recipe-specific mocks/API/schema/hooks were removed.

## Unified Chat Architecture

```text
Chat Workspace
  → conversation hooks
  → conversation feature API
  → mock conversations repository
  → deterministic mock conversation engine

Future replacement
  → same hooks/contracts
  → ASP.NET conversation API
  → Gemini for language generation + Nutelyt nutrition/business services
```

No UI calls Axios, Gemini, or the runtime store directly. Non-mock conversation methods deliberately fail with an explicit unapproved-backend error instead of inventing production endpoints. The UI therefore remains replaceable when the approved backend contract exists.

## Conversation Model

`Conversation` has a stable ID, title, created/updated timestamps, and messages. `ChatMessage` has a stable ID, conversation ID, role, timestamp, status, and a discriminated `content` union:

- `text`
- `recipe-recommendation`
- `food-analysis`
- `activity-suggestion`

Zod validates the complete conversation at the mock repository/API boundary. Thinking and retry failure are request states managed by the mutation hook, rather than fake persisted assistant messages.

## Health Profile Integration

Chat consumes the public Profile runtime context only. It reads the user display name, current/target weight values, goal speed, diet, and allergies without serializing profile data into routes or creating a Chat profile store. The mock engine asks the public Home runtime catalog for a compatible recommendation; it avoids obvious diet/allergy conflicts when structured catalog data permits. Missing/unknown profile values use a generic weight-loss-oriented fallback and never claim medical certainty.

## Time-Based Quick Prompts

Chat imports the public `resolveMealPeriod` and `useHomeLocalTime` contracts from Home; it does not duplicate meal-window boundaries.

- Breakfast: breakfast-focused meal prompts.
- Lunch: lunch and balanced-meal prompts.
- Snack: light snack/weight-loss questions.
- Dinner: light dinner and food-analysis prompts.
- Outside meal windows: hunger, light activity, and warm-up prompts.

Quick prompts submit to the exact same mutation path as composer text.

## Mock Conversation Engine

The deterministic engine is isolated in `mock-conversation-engine.ts`. It normalizes Vietnamese text and maps representative requests to predefined structured data:

- Bún bò / meal recommendation.
- General meal suggestion.
- Phở gà / consumed-food analysis.
- Five-minute light activity.
- Safe generic fallback.

`Mô phỏng lỗi`, `test lỗi`, or `fail chat` intentionally exercises the error state without random failures or visible debugging controls. The request has a short deterministic delay so the mutation-backed thinking state is observable. Replacing the repository/API later does not require rewriting the message UI.

## Recipe Recommendation

The structured recipe card provides image, title, description, tags, predefined calories/protein, profile note, appropriate non-medical disclaimer, Save, explicit `Ghi nhận đã ăn`, and a safe deferred recipe-detail notice. No undocumented recipe-details route was introduced.

## Food Analysis

The Food Analysis card renders a predefined phở gà portion, suitability label, estimated calories/protein, strengths, cautions, Save, and explicit meal confirmation. Typing a consumed-food message never creates a History meal event on its own. Diet conflicts are marked as cautions rather than treated as a suitable personalized recommendation.

## Save vs Log

`Save` ≠ `Meal Log` ≠ `Activity Log` ≠ conversation message.

- Saving records a saved recommendation with timestamp in the existing public Home runtime source; it may appear in History Saved but does not change Home meal progress.
- `Ghi nhận đã ăn` calls the same public Home meal-log action as Home; it creates one confirmed event, invalidates Home/History queries, and may influence the future Dashboard.
- `Ghi nhận đã tập` calls the same public Home activity-log action and produces a History activity event.
- User/assistant conversation messages remain Chat-owned and never enter History.

## Home / History Integration

Chat only imports Home through the public `@/features/home` feature API. The Home runtime source owns recommendation save, meal log, activity log, and event projection. Chat mutation success invalidates narrowly scoped `home/snapshot` and `history` query roots. History continues adapting the public runtime event projection, so it can display confirmed Chat actions without holding Chat messages or a second event store.

## Conversation Sidebar

The dedicated sidebar belongs solely to Chat. It supports local accent-insensitive title search, New Conversation, selection, close, newest-first ordering, and timestamp-derived Today/Yesterday/older grouping. Conversation titles derive deterministically from the first user message. The runtime repository preserves conversations while the app process is alive; creating a conversation never removes earlier conversations or domain events.

## Camera / Voice

`expo-camera` and the existing Scan route are installed, but that camera feature is not connected to a Chat image-message pipeline. The Chat camera control is therefore visible and disabled. No voice-input dependency or working voice flow exists, so the microphone control is also visible and disabled. Both are explicitly marked deferred; no fake image/voice AI behavior was added.

## UI States

- Welcome: header, mascot, contextual quick prompts, and composer.
- Conversation: FlatList-based bubbles and structured assistant cards.
- Thinking: mutation-backed user bubble plus Nutelyt typing indicator.
- Error: retained failed user message and retry action.
- Sidebar: modal conversation list/search/new/select state.

The workspace uses `KeyboardAvoidingView`, safe-area-aware composer spacing above the existing tabs, multiline input limits, disabled empty/duplicate sends, scroll-to-latest behavior after new items, wrapping Vietnamese copy, meaningful control labels, and decorative-image suppression.

## Legacy Chat Cleanup

Removed obsolete Chat-only modules:

- `api/recipes.api.ts`
- `api/recipes.keys.ts`
- `data/mock-recipes.ts`
- `hooks/use-recipes.ts`
- `repositories/mock-recipes.repository.ts`
- `schemas/recipes.schema.ts`

The legacy screen’s mode selector, separate intent states, recipe-detail view, static recipe-chat model, and faux voice state were replaced. No duplicate Chat screen or route remains. The existing unrelated Scan/Food Analysis routes remain outside Chat scope.

## Files Changed

Created:

- `src/features/ai-chat/api/conversations.api.ts`
- `src/features/ai-chat/api/conversations.keys.ts`
- `src/features/ai-chat/chat-ui.tsx`
- `src/features/ai-chat/hooks/use-chat-workspace.ts`
- `src/features/ai-chat/hooks/use-conversation-actions.ts`
- `src/features/ai-chat/hooks/use-conversations.ts`
- `src/features/ai-chat/quick-prompts.ts`
- `src/features/ai-chat/repositories/mock-conversation-engine.ts`
- `src/features/ai-chat/repositories/mock-conversations.repository.ts`
- `src/features/ai-chat/schemas/conversations.schema.ts`
- `docs/ui-refactor/phase-1/06-chat-ai-refactor-report.md`

Modified:

- `src/features/ai-chat/ai-chat.types.ts`
- `src/features/ai-chat/index.ts`
- `src/features/ai-chat/screens/chat-ai-screen.tsx`
- `src/features/home/data/mock-home.ts` — two structured catalog items required for shared Chat actions.
- `src/features/home/home.types.ts`
- `src/features/home/index.ts`
- `src/features/home/repositories/mock-home.repository.ts`
- `src/components/ui/image-with-skeleton.tsx` — permits existing percent-width card images.

Removed:

- Legacy Chat recipe API, keys, data, hook, repository, and schema listed above.

## Validation Results

- `npx --no-install tsc --noEmit` — passed.
- `npx --no-install eslint . --no-cache` — passed.
- `git diff --check` — passed; only repository LF-to-CRLF notices were printed.
- No test suite or formatting-check script exists in `package.json`.
- `npx --no-install expo install --check` — reported the existing compatibility mismatch: installed `expo@54.0.35`, expected `~54.0.36`. No package was changed.
- Web build/export was intentionally skipped.

## Remaining Risks

- Figma MCP was unavailable, leaving exact visual measurements and exported assets unverified.
- Conversations and shared event logs are runtime-only and disappear on app restart.
- The non-mock conversation backend contract, Gemini integration, nutrition engine, server search/pagination, and durable history are not implemented.
- Camera and voice controls are intentionally disabled because no Chat media pipeline exists.
- Native-device keyboard, modal, screen-reader, and layout validation remains outstanding.

## Deferred Work

- ASP.NET conversation API and durable persistence.
- Gemini/Nutrition Engine integration with approved structured contract.
- Camera food recognition and voice input.
- Recipe-detail screen once Figma/route scope exists.
- Streaming/SignalR, server conversation search, and pagination.

## Next Recommended Phase

Refactor the seven-day Dashboard UI to derive from confirmed History events and Health Profile data.
