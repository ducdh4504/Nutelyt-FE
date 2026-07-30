# Shared Infrastructure Audit

## HTTP and API client

### Current implementation

`src/services/http/client.ts` creates one Axios instance with:

- `baseURL` from validated public environment configuration;
- 15-second timeout from `appConfig`;
- JSON `Accept` and `Content-Type` headers;
- request auth/logging interceptors;
- response logging, future-refresh hook, and `ApiError` normalization.

Feature screens do not call Axios directly. All observed Axios requests live in feature API files. Endpoints currently present:

- `GET /home/recommendations`
- `GET /history`
- `GET /ai-chat/recipes`
- `GET /food-analysis/:id`
- `GET /dashboard`
- `GET /subscription/plans`
- `GET /subscription/plans/:id`

### Strengths

- Central client and timeout.
- Abort signals flow from React Query to Axios.
- API responses are parsed through Zod before reaching screens.
- Normalized `ApiError`, `ValidationError`, `NetworkError`, and `UnknownError` classes.
- Feature flag selects a per-request mock adapter without changing the API call site.
- No hard-coded backend URL outside centralized environment defaults.

### Gaps

- Auth token reader is a constant that always returns `null`.
- Refresh handler always rejects; there is no queue/single-flight refresh, retry-once marker, logout callback, or token rotation.
- No ASP.NET problem-details/error-envelope schema is defined.
- Mock adapters return immediate 200s only; no fixture latency/error/pagination/mutation behavior.
- API models containing local `ImageSource` values cannot be shared with REST.
- Logging prints request paths/status but has no redaction policy or correlation/request ID.
- No upload/media client; camera/image is Production-deferred.

## React Query

### Client defaults

| Option | Current value |
|---|---|
| `staleTime` | 5 minutes |
| `gcTime` | 30 minutes |
| `retry` | 2 |
| `refetchOnMount` | `false` |
| `refetchOnReconnect` | `true` |
| `refetchOnWindowFocus` | `false` |

Query keys follow a consistent feature-root array convention (`home`, `history`, `ai-chat/recipes`, `food-analysis`, `dashboard`, `subscription`). One module-level QueryClient is mounted through `QueryProvider`.

### Critical mock-seeding issue

Every current hook supplies mock repository output as `initialData`, usually with `initialDataUpdatedAt: 0`. Because global `refetchOnMount` is false, mounting a stale initial query does not reliably execute the feature API. Consequently:

- disabling the mock Axios adapter may still leave mock data on screen;
- loading states are skipped;
- initial API errors are hidden;
- Figma loading/error frames are not testable;
- REST integration can appear complete while never requesting the backend.

Phase 1 should make mock mode choose the repository/transport at the data layer, not unconditionally seed every query. Production paths should have real pending/error states. Tests/previews may opt into explicit fixture seeding.

### Additional gaps

- No `useMutation` implementation exists for sign-in, profile save, meal/activity/weight confirmation, recipe save, or payment simulation.
- No invalidation graph exists between Home, History, Dashboard, Profile, and Chat actions.
- No pagination/infinite query conventions exist.
- No persisted/offline query cache.
- No global mutation defaults or normalized error UI adapter.

## Environment and feature flags

`src/config/env.ts` is a positive foundation:

- Zod validates `EXPO_PUBLIC_API_BASE_URL`, environment name, logging, devtools, and mock mode.
- `process.env` access is centralized; no direct feature/screen access was found.
- production requires an explicit base URL.
- defaults are development, mock API enabled, logger enabled, and devtools disabled.

`feature-flags.ts` enables AI and Subscription, disables Notifications and Analytics, and derives mock/logger/devtools from the environment. These are compile-time public flags, not server entitlements.

Risks:

- default base URL is `http://localhost:3000`, while the target backend is ASP.NET Core; platform-specific host handling is not documented;
- no `.env.example` or documented environment matrix was found;
- AI/Subscription booleans are not authorization or subscription checks;
- no runtime remote config/versioning.

## Authentication readiness

Confirmed target architecture: **Supabase Auth alongside ASP.NET Core JWT + refresh token**.

| Concern | Current state | Required gap closure |
|---|---|---|
| Supabase client/package | Absent | Configure client and public URL/key only after approved dependency/config task. |
| Provider sign-in | Visual Google button, no action | Supabase OAuth/provider mutation and callback handling. |
| Email/password sign-in | One hard-coded account | Supabase sign-in schema/mutation/error mapping. |
| Registration/verification | UI no-op | Sign-up, verification/deep-link callback, resend/recovery. |
| Session restoration | Absent | Boot-time listener/get-session state before first guarded redirect. |
| Token storage | Absent | Define secure storage and responsibility split; do not use route params. |
| Backend token exchange | Absent | Exchange Supabase identity for ASP.NET access/refresh tokens under a documented endpoint. |
| Request bearer token | Stub | Inject current backend access token. |
| Refresh token rotation | Stub rejects | Single-flight refresh, retry once, rotate/store atomically, revoke on failure. |
| Guards | Absent | Public, profile-setup, protected, and entitlement-aware groups. |
| Logout | Route replacement only | Supabase sign-out, backend revoke, clear secure session/query cache, return to auth. |

Do not conflate Supabase access tokens and ASP.NET access tokens. The API client needs an explicit token source and refresh authority. This is the main infrastructure blocker before protected screens are migrated.

## Providers and UI state

The root mounts React Navigation ThemeProvider, QueryProvider, and `MainProfileProvider`. Profile Context currently mixes:

- health-profile data;
- session-only profile-completion state;
- route-param hydration;
- serialized route payload generation.

It is not a persistence or server-state solution. In Phase 1, query-backed account/health data and auth/session state should replace it; Context can remain for ephemeral UI coordination only.

## Theme, NativeWind, and design tokens

### Current setup

- NativeWind `4.2.6`, TailwindCSS `3.4.19`.
- Babel uses Expo preset with NativeWind JSX source and `nativewind/babel`.
- Metro wraps default Expo config with NativeWind and reads `src/theme/global.css`.
- Tailwind scans all `src` JS/TS/TSX files.
- `src/theme/tokens.ts` exports a small TS color/spacing set.
- Tailwind independently repeats a similar but not identical color/spacing set.
- React Navigation uses stock Default/Dark themes; product token mapping is absent.

### Violations and risks

- Hundreds of raw hex/RGBA values and inline style objects exist across production screens/components.
- Multiple local color maps (`ui`, `dashboardColors`, modal theme) duplicate or conflict with global tokens.
- Shadows, radii, spacing, typography sizes, and semantic states are mostly screen-local.
- Dark theme selection exists at navigation level, but product screens mostly use fixed light colors.
- Tailwind background is `#F9F9FC`, while root Stack uses `#FAFAF7` and Figma commonly uses `#F9FAF7`/similar values.
- Typography uses system defaults; Figma context references Inter, but no font assets/loading exist.
- Chat duplicates the shared image skeleton implementation.

Phase 1 should extract approved semantic tokens from Figma and map them once to TypeScript, NativeWind, navigation theme, and native splash/app surfaces. Do not carry arbitrary Figma layer values directly into screens.

## Shared components

Positive findings:

- `Button`, `Typography`, `ImageWithSkeleton`, and `Shimmer` are feature-agnostic.
- `MainScreenHeader` and `BottomTabBar` are shared navigation/layout components.
- No shared component imports a product feature.
- Accessibility roles/labels are present on many interactions.

Gaps:

- no shared input, field-error, query-state, sheet, dialog, toast, list/card, metric, or form controller conventions;
- fixed pixel widths/heights and absolute bottom bars need accessibility/dynamic-type testing;
- several Pressables are no-ops but still exposed as actionable;
- no central icon abstraction beyond a Feather-name type;
- no design-system documentation/story previews.

## Expo, TypeScript, Metro, Babel, and assets

### Expo configuration

Active settings include portrait orientation, automatic interface style, new architecture, Android edge-to-edge, static web export, custom URL scheme, typed routes, React Compiler, Expo Router, Expo Splash Screen, and Expo Asset plugins.

All six app-config image paths are missing:

- `assets/images/icon.png`
- `assets/images/android-icon-foreground.png`
- `assets/images/android-icon-background.png`
- `assets/images/android-icon-monochrome.png`
- `assets/images/favicon.png`
- `assets/images/splash-icon.png`

This affects native build/config validation and the Splash KEEP flow. Canonical brand assets exist under different filenames, but the fix must be an explicit Phase 1 asset/config task; Phase 0 did not alter config.

### TypeScript and aliases

- `strict: true`.
- `@/* -> ./src/*` and `@assets/* -> ./assets/*`.
- Expo base config and generated typed-route declarations included.
- No deep relative imports were found.

### Package compatibility

- `package.json` requests `expo ~54.0.34`; installed check reports `54.0.35` and expects `~54.0.36`.
- `expo-router ~6.0.23`; the currently published SDK 54 versioned reference lists `~6.0.24`.
- No package was changed or installed during the audit.

## Validation results

| Command | Result | Warnings / errors | Affected files / impact |
|---|---|---|---|
| `npx --no-install tsc --noEmit` | PASS, exit 0 | None | Current TypeScript compiles; does not validate runtime/route/data behavior. |
| `npm run lint` (`expo lint`) | INFRA FAILURE, exit 1 | `EPERM` writing `.expo/cache/eslint/.cache_*` | No source lint error was reported; Expo cache is unwritable in this environment. No fix made. |
| `npx --no-install eslint . --no-cache` | PASS, exit 0 | None | Confirms current source satisfies configured ESLint rules when cache writes are disabled. |
| `npx expo install --check` | FAIL, exit 1 | `expo@54.0.35`, expected `~54.0.36`; “Found outdated dependencies” | Patch compatibility drift; update only in a separately approved config/dependency task. |
| `npx --no-install expo-doctor` | NOT COMPLETED | `expo-doctor` is not present in `node_modules/.bin`; completing through `npx` could download a package, prohibited in Phase 0 | Doctor coverage remains a documented validation gap. |
| tests | NOT AVAILABLE | No `test` script or test files found | No automated behavior/regression safety net for refactor. |

The initial sandboxed dependency check also failed with `fetch failed`; it was rerun with network permission as a read-only `--check` and produced the version result above.

## Infrastructure disposition

| Keep | Refactor/expand | Replace/remove later |
|---|---|---|
| Central env validation, Axios instance concept, error classes, Zod response parser, mock-adapter pattern, Query provider, aliases | Auth token/refresh interceptors, query mock selection, invalidation/mutations, semantic tokens, shared state components, product themes, logging redaction | Runtime Profile Context as data store, template modal theme, REST contracts containing bundled images, duplicate local token maps |
