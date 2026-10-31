# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

The package manager is **pnpm** (see `pnpm-lock.yaml`, `.npmrc`). Run all commands from this directory (`Angular/ProfileManager`), which is a subfolder of the `SandboxForBrains` git repository.

```bash
pnpm start              # ng serve — dev server at http://localhost:4200
pnpm build              # production build to dist/
pnpm watch              # dev build with --watch
pnpm lint               # ng lint (ESLint over src/**/*.{ts,html})
pnpm lint:fix           # ng lint --fix
pnpm format             # prettier --write over src
pnpm format:check       # prettier --check
pnpm run firebase:deploy   # pnpm lint && pnpm e2e && firebase deploy --only hosting:profilearc,firestore
pnpm e2e                # ng e2e — Playwright against Firebase emulators (see Testing)
pnpm e2e:ui             # ng e2e --ui
pnpm e2e:rules          # only the Firestore security-rules tests
pnpm e2e --files e2e/profile-search.spec.ts   # one spec file (also: --grep "<title regex>", --headed)
pnpm emulators          # firebase emulators:start --only auth,firestore --project demo-profilemanager
pnpm start:e2e          # ng serve --configuration e2e (emulator-backed app on http://127.0.0.1:4300)
```

There are **no unit tests by design** (no `ng test` target). Testing is end-to-end only; see the Testing section below.

The Husky pre-commit hook `cd`s into `Angular/ProfileManager` and runs `lint-staged` (eslint --fix + prettier on staged `.ts`/`.html`, prettier on `.css`/`.scss`/`.json`).

## Required setup before running

`src/environments/environment.ts` is **gitignored** and must be created by copying `src/environments/environment.template.ts` and filling in real Firebase credentials. The app imports `environment.ts` directly and will not build without it. Its shape is the `Environment` interface in `environment.model.ts`; it must include `useEmulators: false`.

## Architecture

A single-feature Angular 22 SPA for managing matrimony profiles, backed entirely by Firebase (Auth + Firestore). There is no backend server — the browser talks to Firestore directly.

**This codebase targets bleeding-edge Angular 22 APIs.** When writing code, match these patterns:

- **Zoneless** change detection (`provideZonelessChangeDetection`) — no zone.js. All components use `ChangeDetectionStrategy.OnPush`.
- **Signals everywhere** for state; `computed()` for derived state; `resource()` for async data.
- **Signal forms** (`@angular/forms/signals`: `form`, `FormField`, `required`, `pattern`, etc.) — experimental. See [profile-form.ts](src/app/components/profile/profile-form.ts).
- **Standalone components only** (no NgModules). Components use default exports for lazy `loadComponent` (see [app.routes.ts](src/app/app.routes.ts)).
- `inject()` over constructor injection; `input()`/`output()`/`model()` over decorators.

### Firebase layer (`src/app/firebase/`)

Firebase is wired manually via the **modular Firebase JS SDK** — NOT AngularFire. Do not add `@angular/fire`.

- [provide-firebase.ts](src/app/firebase/provide-firebase.ts) exposes `provideFirebase(config)` and three `InjectionToken`s: `FIREBASE_APP`, `FIREBASE_AUTH`, `FIRESTORE`. Inject these tokens to get Firebase instances. Auth uses **session persistence** (`browserSessionPersistence`).
- [firebase-rx.ts](src/app/firebase/firebase-rx.ts) bridges Firebase callback listeners (`onAuthStateChanged`, `onIdTokenChanged`) into shared RxJS observables.

### Auth (`src/app/services/auth.service.ts`, `src/app/guard/`)

`AuthService` exposes auth state as signals (`user`, `currentUser`, `isAuthenticated`) derived from the Firebase listeners via `toSignal`. The critical piece is `waitForAuthInit()`: route guards (`authGuard`, `loginGuard`) **await** it before checking auth, so the app never decides auth state before Firebase has restored the session. The route table is `/login`, `/` (profiles list) and `/profiles/new` (create wizard), all guarded. `/` also runs `legacyCreateRedirectGuard`, which redirects the old `/?actionType=create…` links to `/profiles/new`.

### Profiles data (`src/app/services/profiles.service.ts`)

The `providedIn: 'root'` `ProfilesService` is the data hub. Key pattern:

- A `filterOptions` **signal** (`SortOption`: search/status/star-match/sort-direction) drives a `resource()` named `profiles`. Changing `filterOptions` re-runs the Firestore query automatically; mutations call `this.profiles.reload()`.
- Firestore queries are composed with `where`/`orderBy`; rejected profiles are always sorted to the end client-side.
- `mapDocToProfile` converts Firestore `Timestamp`s to `Date`s and handles legacy comment formats (string vs object) for backwards compatibility — preserve this when touching profile mapping.
- **The view/edit drawer is driven by a service signal, not the URL**: `userActionEvent('view' | 'edit', id)` sets `drawerState` (`isOpen`, `actionType`, `selectedProfileId`) and `closeDrawer()` resets it; `'delete'` goes straight to `deleteProfile()`. `userActionEvent('create')` is unused legacy — create is the `/profiles/new` page, opened by `Toolbar.addNewProfileAction()` via the router.
- **Targeted writes** (use these instead of a full `updateProfile` when only one thing changes): `updateProfileStatus(id, statusId)` updates the matching row of the loaded list optimistically, rolls back and re-throws on failure, and deliberately does **not** reload (the card keeps its place until the next reload/filter change; Undo is just another call). `addNote(id, value)` appends with Firestore `arrayUnion` so notes added elsewhere are never overwritten (the edit form, by contrast, replaces the whole `comments` array).

### Profile form (`src/app/components/profile/`, `profile-wizard/`)

- `createProfileForm({ isView?, save })` in [profile-form.ts](src/app/components/profile/profile-form.ts) owns the signal form shared by create and edit: validators and messages, mobile-number canonicalisation, star → `starMatchScore` derivation (read-only in the UI), clearing a stale star/city when zodiac/state changes, and comment add/delete (a typed-but-not-added comment is saved on submit). Change form rules there, once.
- The drawer (`Profile`, `profile.ts`) is **view + edit only**; the wizard (`ProfileWizard`, default export, 3 steps with a live preview) is **create only**. Both reuse `ProfileFormFieldsComponent` for the field markup and ids.
- View mode has an always-visible quick-note input (`#quick-note`, saves via `addNote`) and a status menu in the header. Edit mode is split into **Details / Notes tabs** (shared form state; an error dot marks a tab holding a validation error). Age lives under Horoscope in both modes; Star Match Score is a read-only `ScoreRing` (`#star_match_score`, derived from the star).
- The wizard marks required fields (`*`, so accessible names end in " *"), shows "n of m required fields done" per step, and pins Back/Continue in a fixed bar below `lg`. Leaving it with typed input asks "Discard this new profile?" via `discardChangesGuard` (`CanDeactivate` + `beforeunload`); the guard **imports the dialog lazily** because route guards ship in the initial bundle (a static import added ~160 kB).

### UI

**Spartan-ng** (Brain + Helm) + Tailwind CSS 4 — NOT PrimeNG (do not add it). Tailwind is configured via PostCSS and imported in `src/styles.css`, which also imports `@spartan-ng/brain/hlm-tailwind-preset.css` and defines the theme tokens (oklch CSS variables for `:root` and `.dark`).

- **Brain** (`@spartan-ng/brain/*`) = headless behavior primitives (`Brn*`); **Helm** (`@spartan-ng/helm/*`) = styled wrappers (`Hlm*`). Import the `Hlm*` components/import-arrays into a component's `imports`.
- Helm components are **vendored into the repo** at `libs/ui/` (one folder per component), aliased as `@spartan-ng/helm` (see `components.json`). `libs/**` is gitignored from ESLint. Add new components with the Spartan CLI (`nx generate @spartan-ng/cli:ui` / the `spartan-ng` MCP) rather than hand-writing them.
- Icons via `@ng-icons/lucide`.
- **Dark mode** is driven by `ThemeService` ([theme.service.ts](src/app/services/theme.service.ts)), which toggles the `.dark` class on `<html>` and persists a `'light' | 'dark' | 'system'` preference. `App` injects it eagerly so its theme `effect()` runs for the session.
- The profiles list renders a separate desktop view and mobile view component (both are card layouts; the mobile filters live in a bottom sheet). On desktop/tablet the status filter is a Helm select in the main toolbar row (`[Search] [Status] [Sort] [Star match] [Clear] … [Add Profile] [account]`, wrapping below `lg`): trigger id `profile_status_filter` with a visually hidden `<label>` as its accessible name ("Profile status"), options "All statuses" (`null`) plus each status with its `PROFILE_STATUS_STYLES` dot, and a primary border/ring tint while a status is active. The phone Filters sheet keeps wrapped status buttons (`toolbar/status-chips`, `role="group"` "Profile status", `aria-pressed`) bound to the same `profileStatus` filter field; `filter-selects` only holds the star-match select.
- **Glass design system** (the "Bold / glass" redesign): tokens, the aurora `body::before` backdrop, and the `glass`, `glass-strong`, `bg-gradient-brand` utilities live in `src/styles.css`. Default (primary) Spartan buttons get the brand gradient from a global `[data-slot='button'].bg-primary` rule, and popover/select/dialog panels are near-opaque on purpose (translucent ones let form text show through). Use the shared `ScoreRing`, `ProfileAvatar`, `StatusMenu` (status pill that is a menu / bottom sheet with Undo toast) and `ProfilesEmptyState` components (`components/shared/`) instead of re-implementing them. Below `md` Add Profile is a floating button inside `app-toolbar`, and CSS (`body:has([data-add-fab])`, `body:has([data-wizard-bar])`) lifts toasts above it. **Hand-edited vendored Spartan files** (the Spartan CLI would overwrite them): `libs/ui/pagination` (left cell is an `<ng-content>` slot, used for the single profile count) and `libs/ui/tabs/.../hlm-tabs-trigger.ts` (`data-[state=active]:` because Brain emits `data-state`, not `data-active`). Contrast was tuned for both themes — re-check ratios when changing tokens.

TypeScript is in **strict** mode with `noPropertyAccessFromIndexSignature` — access dynamic Firestore fields with bracket notation (`data?.['field']`).

## Testing

End-to-end only, via **`ng e2e`** (`playwright-ng-schematics` builder → Playwright). Everything runs against the **Firebase emulators**; the real project must never be touched.

- **Emulator safety**: `angular.json` has an `e2e` build/serve configuration whose `fileReplacements` swaps `environment.ts` for the committed, secret-free [environment.e2e.ts](src/environments/environment.e2e.ts) (`useEmulators: true`, projectId `demo-profilemanager`). `provideFirebase(config, { useEmulators })` connects Auth/Firestore to the emulators and **throws** if the project id does not start with `demo-`. The `e2e` architect target's `devServerTarget` must stay on `ProfileManager:serve:e2e`; never add a configuration that serves the real `environment.ts`. That build configuration is deliberately **optimized** (`optimization: true`, no source maps): with it the dev server serves one bundle instead of transforming hundreds of unbundled modules on every cold page load, which took the suite from ~4m50s to ~1m30s (every test starts a fresh browser context, so nothing is cached). Do not switch it back to `optimization: false` to debug; use `pnpm start` for that.
- **Layout**: [playwright.config.ts](playwright.config.ts) (root) has two projects: `rules` (Node only, `e2e/rules/`, uses `@firebase/rules-unit-testing` against `firestore.rules`) and `chromium` (browser specs in `e2e/*.spec.ts`). Shared helpers live in `e2e/support/`: `emulator.ts` (REST helpers for the emulators using the emulator-only `Bearer owner` token: create admin user with the `admin` claim, clear Auth/Firestore, seed profiles), `fixtures.ts` (`test` with an auto `resetFirestore` fixture, `loginAsAdmin()`, `pickOption()` for Spartan selects, `profileRows()`/`profilesTotal()` locators, `selectStatusFilter()`/`statusFilter()` for the desktop status select (combobox named "Profile status", shows "All statuses" when cleared) and `sheetStatusButton()` for the phone Filters sheet buttons, and `openNewProfileWizard()`/`wizardContinue()`/`fillWizardProfile()` for the create wizard), `global-setup.ts`.
- **Servers**: the `ng e2e` builder starts the dev server on `127.0.0.1:4300`; Playwright's `webServer` starts the emulators (`firebase emulators:start --only auth,firestore --project demo-profilemanager`, readiness on Firestore 8080, then `waitForEmulators()` in global setup waits for Auth 9099 too). `gracefulShutdown` sends SIGTERM so the detached Java Firestore emulator is stopped as well.
- **Prerequisite**: a Java runtime on PATH for the Firestore emulator (`brew install openjdk` + add `/opt/homebrew/opt/openjdk/bin` to PATH). Auth emulator does not need Java.
- **Browser**: `pnpm exec playwright install chromium` once. If Playwright's Chromium is not installed (its CDN is unreachable on some networks), `playwright.config.ts` automatically falls back to the installed Google Chrome; `PLAYWRIGHT_BROWSER_CHANNEL` forces a channel.
- **Locators**: prefer ids (`#name`, `#login-email`), ARIA roles (Spartan select trigger = `role="combobox"` **without an accessible name**, so locate it by its host id or `getByRole('combobox').filter({ hasText: placeholder })`; options = `role="option"`; pagination `nav[aria-label="pagination"]`) and visible text. The only `data-testid`s are `profile-card` (desktop and mobile cards alike) and `profiles-total`. The desktop status filter is `getByRole('combobox', { name: 'Profile status' })` (the one select with an accessible name); the phone sheet's status buttons have `aria-pressed`. The create wizard shows one step at a time, so specs must click **Continue** between steps (`wizardContinue()`), and a dirty wizard prompts on leave, so abandon it with `leaveWizardAndDiscard()`. In the edit drawer, notes live on the Notes tab: call `openNotesTab()` before touching `#comment`. `expectToolbarControlsUnclipped()` asserts nothing in the toolbar overflows the viewport.
- Tests run serially (`workers: 1`) because they share one emulator instance, so never run two `ng e2e` at once (ports 4300/8080/9099 collide). The suite is timing-sensitive: on a heavily loaded machine a random test (often `theme-toggle`) can time out — re-run before assuming a regression. A positional arg after `--` is treated as the _project_ name, not a file filter; use `--files`/`--grep`. Login happens through the UI in every test because Auth uses `browserSessionPersistence`, which Playwright's `storageState` cannot restore.

## MCP servers

`.mcp.json` / `.vscode/mcp.json` configure `angular-cli` (schematics, best practices, docs), `spartan-ng` (Spartan component lookup/add), and `firebase` (Firestore/Auth) MCP servers. Prefer these over raw shell for equivalent actions.
