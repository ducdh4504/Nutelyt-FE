# Phase 1B — Authentication Refactor Report

## Scope

Implemented the Figma-driven Login and Register interfaces inside the existing `src/features/auth` feature. The work includes responsive safe-area and keyboard-aware layouts, shared Authentication components, controlled form state, Zod validation, field and submission errors, loading/duplicate-submit guards, password visibility, Login/Register cross-navigation, exact local Figma assets, and accessibility labels.

Splash, Onboarding, Health Profile, application tabs, Expo configuration, dependency versions, and backend authentication were intentionally excluded. No package was installed, and no commit or push was performed.

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

The Expo SDK 54 Font, StatusBar, and Expo Router documentation was also checked before implementation.

## Figma Nodes

- Login — `https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=1-155&m=dev`, node `1:155`.
- Register — `https://www.figma.com/design/nWwlWMJdfhUjO7ytN4hCzQ/Nutelyt?node-id=1-222&m=dev`, node `1:222`.

Both complete nodes and their child metadata were inspected. The implementation follows the 390 px reference width, 64 px brand header, 113.77 × 32 px wordmark, 350 px content width, 24 px cards, 56/54 px controls, Inter typography, Figma colors, dividers, social buttons, legal/support content, and the Register decoration. Figma did not define interactive error or loading variants, so those states retain the same geometry and use the existing product palette.

## Previous Authentication Implementation

- Routes: `src/app/login.tsx` and `src/app/register.tsx`, both already thin and public.
- Screens: `src/features/auth/screens/login-screen.tsx` and `register-screen.tsx`.
- Components: `auth-text-input.tsx` and `auth-google-button.tsx`.
- Schemas/hooks/API: none.
- Login contract: a local demo check for `admin@gmail.com` / `Test@123`; success replaced the route with `/home` when the Health Profile was completed during the current runtime, otherwise `/health-profile`.
- Register: UI only, with a no-op submit action.
- Google sign-in and Forgot Password: visible no-op actions with no integration.
- Auth session/JWT/Supabase/Refresh Token: not implemented.

## New Implementation

The existing `src/features/auth` ownership boundary was retained:

- `components/` owns the screen shell, card, divider, input, feedback, and Google button.
- `hooks/` owns Login/Register form state, validation mapping, submission locks, mounted-state checks, and unavailable-action feedback.
- `schemas/` owns the Zod Login and Register schemas.
- `services/` isolates the current demo Login contract and explicitly unavailable Register contract from UI.
- `screens/` composes the Figma layouts and focus order.
- `auth.types.ts` separates UI values, field errors, and authentication results.
- `auth-theme.ts` owns Authentication-specific Figma colors and reuses the existing Inter font asset.
- `data/auth-assets.ts` owns local brand and Figma-exported assets.
- `index.ts` remains the public feature API.

Form values and field errors remain in feature hooks. Zod is the client validation source of truth. Submission/API feedback is separate from field validation. Route files remain unchanged and thin.

## Login

The Login screen contains the exact Figma heading, description, email and password fields, Forgot Password action, Login CTA, divider, Google button, Register link, and support links. Email is trimmed and validated by Zod; passwords are never normalized or logged. The email keyboard/autofill hints, password secure entry, Next/Done focus behavior, field-level errors, generic credential failure, loading state, value preservation, and duplicate-submit guard are implemented.

The existing demo account contract is preserved. Only a confirmed successful result navigates, using route replacement to the existing `/home` or `/health-profile` destination selected by the existing Profile context.

## Register

The Register screen implements the Figma fields: Họ và Tên, Email, Mật khẩu, and Xác nhận mật khẩu. Zod validates required values, email shape, minimum eight-character password, and password confirmation. Inputs use the appropriate keyboard/autofill configuration and Next/Done focus chain. Password visibility is available where shown by Figma.

No Register backend handler exists. A valid submission remains on Register, preserves all input, and displays `Đăng ký tài khoản hiện chưa khả dụng.` It does not simulate success, verification, auto-login, tokens, or navigation.

## Google Sign-In

No Google authentication handler or OAuth dependency exists. The Figma buttons and exact exported Google mark are present, duplicate taps are guarded, and each action returns visible unavailable feedback. No fake OAuth result, token, or account state was introduced.

## Navigation

The preserved flow is:

`Splash → Onboarding → Login ↔ Register → existing post-authentication destination`

- Onboarding still replaces to `/login`; no Splash or Onboarding file changed.
- Login pushes the centralized `/register` route with a rapid-tap lock.
- Register uses `back()` when history exists and replaces with `/login` only as a deep-link fallback, preventing duplicate Login entries.
- Successful Login preserves the prior replacement behavior to `/health-profile` or `/home`.

## Files Changed

Created:

- `assets/images/auth-email-icon.svg` — exact Login email icon from Figma.
- `assets/images/auth-eye-icon.svg` — exact password visibility icon from Figma.
- `assets/images/auth-google.jpg` — exact Google mark exported by Figma.
- `assets/images/auth-lock-icon.svg` — exact password icon from Figma.
- `assets/images/auth-register-decoration.jpg` — exact Register decoration from Figma.
- `assets/images/auth-shield-icon.svg` — exact confirm-password icon from Figma.
- `assets/images/auth-user-icon.svg` — exact full-name icon from Figma.
- `src/features/auth/auth-theme.ts` — feature-local Figma colors and Inter registration.
- `src/features/auth/auth.types.ts` — form and result types.
- `src/features/auth/components/auth-card.tsx` — shared Figma card.
- `src/features/auth/components/auth-divider.tsx` — shared Authentication divider.
- `src/features/auth/components/auth-feedback.tsx` — accessible submission feedback.
- `src/features/auth/components/auth-screen-shell.tsx` — safe-area, keyboard, scroll, brand header, and optional decoration shell.
- `src/features/auth/hooks/auth-form-utils.ts` — Zod issue-to-field mapping.
- `src/features/auth/hooks/use-login-form.ts` — Login state, validation, contract call, and success navigation.
- `src/features/auth/hooks/use-register-form.ts` — Register state, validation, and unavailable submission handling.
- `src/features/auth/hooks/use-unavailable-auth-action.ts` — guarded feedback for missing handlers.
- `src/features/auth/schemas/auth.schemas.ts` — Login and Register Zod schemas.
- `src/features/auth/services/auth-service.ts` — preserved demo Login and explicit unavailable Register contracts.
- `docs/ui-refactor/phase-1/02-authentication-refactor-report.md` — this report.

Modified:

- `src/config/routes.ts` — added the already-existing `/register` route to centralized constants.
- `src/features/auth/components/auth-google-button.tsx` — Figma styling, exact asset, loading, disabled, and accessibility states.
- `src/features/auth/components/auth-text-input.tsx` — Figma styling, exact icons, focus/error states, refs, accessibility, and password visibility.
- `src/features/auth/data/auth-assets.ts` — feature-owned local asset map while preserving the existing onboarding prefetch export.
- `src/features/auth/index.ts` — public form type exports.
- `src/features/auth/screens/login-screen.tsx` — complete data/behavior-connected Figma Login screen.
- `src/features/auth/screens/register-screen.tsx` — complete data/behavior-connected Figma Register screen.

Removed: none. Existing route files and reusable Authentication files were retained.

## Validation

- `npx tsc --noEmit` — passed.
- `npx eslint . --no-cache` — passed.
- `git diff --check` — passed; Git only reported the repository's LF-to-CRLF conversion notices.
- `npm run build:web` — passed; exported all 28 static routes including `/login` and `/register`.
- `npx expo install --check` — reporting-only failure: installed `expo@54.0.35`, expected `~54.0.36`; intentionally not upgraded.
- Tests — no test script/suite exists.
- Browser smoke test at the 390 × 884 reference viewport — Onboarding Skip reached Login; Login and Register rendered their expected accessible controls; Login → Register and Register → Login worked without a loop; password visibility changed state; invalid Login and empty Register submissions produced field errors; failed Login preserved entered values; the preserved demo Login navigated to `/health-profile`.

The successful export repeated existing unrelated warnings for the missing configured favicon and the root layout's `health-profile` screen-name declaration. Splash and Onboarding source files had no diff.

## Remaining Risks

- Production Login, Register, Google OAuth, Forgot Password, legal links, and persistent auth/session handling remain backend/integration work. Login still uses the audited demo credential contract.
- Native iOS/Android keyboard and screen-reader behavior was implemented from React Native conventions but was not exercised on a native simulator in this environment.
- The explicitly deferred Expo patch mismatch and pre-existing export warnings remain.

## Next Recommended Task

Phase 1C — refactor the Health Profile UI against its audited Figma nodes while preserving the existing profile model and navigation contract.
