# Phase 1C — Health Profile Refactor Report

## Scope

Replaced only the Health Profile setup experience with a four-step, weight-loss-only wizard. Splash, Onboarding, Authentication UI, tabs, API clients, React Query, package versions, and backend integrations were not changed. No dependency was installed, no commit was created, and nothing was pushed.

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

The Expo SDK 54 StatusBar, Router, and keyboard-handling documentation was reviewed before implementation.

## Figma Nodes

- Basic Information — `5:31`
- Weight Goal — `5:272`
- Diet Preference & Food Allergies — `5:125`
- Review Health Profile — `5:349`

The Figma MCP authentication handoff succeeded, but the design-context tool was unavailable immediately afterwards. The implementation therefore uses the existing Phase 0 Figma inventory and the already verified local Nutelyt brand/mascot assets. Exact node metadata (including raw spacing, typography, and layer bounds) must be re-verified once the MCP connection is available.

## Previous Implementation

The previous flow mixed all wizard state, validation, navigation, payload construction, and animation in `health-profile-flow-screen.tsx`. It collected a broad health goal, placed medical conditions in the fourth step, had no target weight or review screen, had no Zod schema, and handed PII to the Profile screen through route parameters.

## New Architecture

- `health-profile.types.ts` separates user-entered values, wizard state, presentation values, and the legacy runtime summary adapter.
- `schemas/health-profile.schemas.ts` is the single validation source for the full profile and each wizard step.
- `config/health-profile-options.ts` owns goal-speed, diet, and local allergy options.
- `use-health-profile-wizard.ts` owns bounded navigation, validation, field errors, retained draft state, tap locks, and completion.
- `utils/health-profile.ts` owns BMI/category/presentation derivation and conversion to the runtime profile summary.
- `storage/health-profile-storage.ts` establishes the Health Profile storage boundary.
- `screens/health-profile-flow-screen.tsx` composes the responsive, accessible presentation only.

The existing `MainProfileProvider` now uses the feature-owned storage boundary whenever it receives a profile, allowing the completed wizard to hydrate Home without query parameters.

## Wizard Flow

1. Basic Information — full name, birthday, gender, height, current weight.
2. Weight Goal — target weight and one goal speed; Balanced is the default.
3. Diet & Allergies — exactly one diet from Standard, Vegetarian, Vegan, Low Carb, High Protein, or Other; optional multi-select allergies with a local-only search field.
4. Review — editable Basic Information, Weight Goal, and Diet & Allergies summaries plus BMI.

Each forward transition validates its own step. Values are retained when moving backward or editing from Review. Navigation is clamped to 0–3 and rapid navigation taps are locked briefly so a step cannot be skipped. Finish is locked after the first valid submission.

## Validation

Zod validates all required data: name, date of birth, gender, height, current weight, target weight, goal speed, and diet. Numeric height and weights are bounded to reasonable user-input ranges. Errors are field-specific and announced politely to assistive technology.

## BMI Calculation

BMI is calculated locally as `weightKg / (heightCm / 100)²`. Review displays a one-decimal value and a local category: Underweight, Normal, Overweight, or Obesity. There is no API request.

## Persistence

There was no AsyncStorage, SecureStore, SQLite, or existing persistent profile abstraction in the repository. `healthProfileStorage` is a feature-owned runtime storage boundary used by `MainProfileProvider`; UI code does not call a platform storage API. It saves the profile for the active app runtime and supports safe future replacement with an approved persistent adapter.

## Navigation

`Login → /health-profile → /home`

Finish saves the converted profile into the existing runtime profile provider, marks Health Profile complete for the current runtime, then uses `router.replace('/home')`. It does not serialize health data into route params.

## Files Changed

- `src/features/health-profile/health-profile.types.ts`
- `src/features/health-profile/config/health-profile-options.ts`
- `src/features/health-profile/schemas/health-profile.schemas.ts`
- `src/features/health-profile/storage/health-profile-storage.ts`
- `src/features/health-profile/use-health-profile-wizard.ts`
- `src/features/health-profile/utils/health-profile.ts`
- `src/features/health-profile/screens/health-profile-flow-screen.tsx`
- `src/features/health-profile/index.ts`
- `src/features/profile/context/profile-context.tsx` — minimal integration with the feature-owned storage boundary.

## Validation Results

- `npx --no-install tsc --noEmit` — passed.
- `npx --no-install eslint . --no-cache` — passed with zero warnings/errors after cleanup.
- `npm run build:web` — bundled and enumerated all 28 static routes, including `/health-profile`; the command exceeded the 120-second execution cap after export output. It also repeated the pre-existing missing favicon and root `health-profile` screen-name warnings.
- No test or formatting script is defined in `package.json`.
- `npx --no-install expo install --check` — completed and reported the known pre-existing mismatch: installed `expo@54.0.35`, expected `~54.0.36`. No package was changed.

## Remaining Risks

- Figma MCP became unavailable after authentication, so raw node geometry/tokens could not be extracted or visually revalidated in this run.
- Durable persistence across a cold restart remains unavailable without an approved existing persistent-storage dependency. The current feature storage is runtime-only.
- Native iOS/Android keyboard, rotation, and screen-reader behavior was implemented using Expo/React Native safe-area and keyboard conventions but was not run on a device simulator.
- The existing Expo patch mismatch and build warnings are intentionally outside this Health Profile scope.

## Next Recommended Phase

Refactor the protected Home UI against its Figma frame, using the newly completed health-profile runtime data without introducing new API behavior.
