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
- **Signal forms** (`@angular/forms/signals`: `form`, `FormField`, `required`, `pattern`, etc.) — experimental. See [profile.ts](src/app/components/profile/profile.ts).
- **Standalone components only** (no NgModules). Components use default exports for lazy `loadComponent` (see [app.routes.ts](src/app/app.routes.ts)).
- `inject()` over constructor injection; `input()`/`output()`/`model()` over decorators.

### Firebase layer (`src/app/firebase/`)

Firebase is wired manually via the **modular Firebase JS SDK** — NOT AngularFire. Do not add `@angular/fire`.

- [provide-firebase.ts](src/app/firebase/provide-firebase.ts) exposes `provideFirebase(config)` and three `InjectionToken`s: `FIREBASE_APP`, `FIREBASE_AUTH`, `FIRESTORE`. Inject these tokens to get Firebase instances. Auth uses **session persistence** (`browserSessionPersistence`).
- [firebase-rx.ts](src/app/firebase/firebase-rx.ts) bridges Firebase callback listeners (`onAuthStateChanged`, `onIdTokenChanged`) into shared RxJS observables.

### Auth (`src/app/services/auth.service.ts`, `src/app/guard/`)

`AuthService` exposes auth state as signals (`user`, `currentUser`, `isAuthenticated`) derived from the Firebase listeners via `toSignal`. The critical piece is `waitForAuthInit()`: route guards (`authGuard`, `loginGuard`) **await** it before checking auth, so the app never decides auth state before Firebase has restored the session. The route table is just `/login` and `/` (profiles list), both guarded.

### Profiles data (`src/app/services/profiles.service.ts`)

The `providedIn: 'root'` `ProfilesService` is the data hub. Key pattern:

- A `filterOptions` **signal** (`SortOption`: search/status/star-match/sort-direction) drives a `resource()` named `profiles`. Changing `filterOptions` re-runs the Firestore query automatically; mutations call `this.profiles.reload()`.
- Firestore queries are composed with `where`/`orderBy`; rejected profiles are always sorted to the end client-side.
- `mapDocToProfile` converts Firestore `Timestamp`s to `Date`s and handles legacy comment formats (string vs object) for backwards compatibility — preserve this when touching profile mapping.
- **Cross-component navigation uses query params**: `userActionEvent()` navigates with `{ actionType, selectedProfileId, openDrawer }` query params, which the profiles-list and profile components receive as component inputs (`withComponentInputBinding()`). The profile drawer (create/edit/view) is opened by URL state, not by a shared signal.

### UI

**Spartan-ng** (Brain + Helm) + Tailwind CSS 4 — NOT PrimeNG (do not add it). Tailwind is configured via PostCSS and imported in `src/styles.css`, which also imports `@spartan-ng/brain/hlm-tailwind-preset.css` and defines the theme tokens (oklch CSS variables for `:root` and `.dark`).

- **Brain** (`@spartan-ng/brain/*`) = headless behavior primitives (`Brn*`); **Helm** (`@spartan-ng/helm/*`) = styled wrappers (`Hlm*`). Import the `Hlm*` components/import-arrays into a component's `imports`.
- Helm components are **vendored into the repo** at `libs/ui/` (one folder per component), aliased as `@spartan-ng/helm` (see `components.json`). `libs/**` is gitignored from ESLint. Add new components with the Spartan CLI (`nx generate @spartan-ng/cli:ui` / the `spartan-ng` MCP) rather than hand-writing them.
- Icons via `@ng-icons/lucide`.
- **Dark mode** is driven by `ThemeService` ([theme.service.ts](src/app/services/theme.service.ts)), which toggles the `.dark` class on `<html>` and persists a `'light' | 'dark' | 'system'` preference. `App` injects it eagerly so its theme `effect()` runs for the session.
- The profiles list renders a separate desktop view and mobile view component.

TypeScript is in **strict** mode with `noPropertyAccessFromIndexSignature` — access dynamic Firestore fields with bracket notation (`data?.['field']`).

## Testing

End-to-end only, via **`ng e2e`** (`playwright-ng-schematics` builder → Playwright). Everything runs against the **Firebase emulators**; the real project must never be touched.

- **Emulator safety**: `angular.json` has an `e2e` build/serve configuration whose `fileReplacements` swaps `environment.ts` for the committed, secret-free [environment.e2e.ts](src/environments/environment.e2e.ts) (`useEmulators: true`, projectId `demo-profilemanager`). `provideFirebase(config, { useEmulators })` connects Auth/Firestore to the emulators and **throws** if the project id does not start with `demo-`. The `e2e` architect target's `devServerTarget` must stay on `ProfileManager:serve:e2e`; never add a configuration that serves the real `environment.ts`.
- **Layout**: [playwright.config.ts](playwright.config.ts) (root) has two projects: `rules` (Node only, `e2e/rules/`, uses `@firebase/rules-unit-testing` against `firestore.rules`) and `chromium` (browser specs in `e2e/*.spec.ts`). Shared helpers live in `e2e/support/`: `emulator.ts` (REST helpers for the emulators using the emulator-only `Bearer owner` token: create admin user with the `admin` claim, clear Auth/Firestore, seed profiles), `fixtures.ts` (`test` with an auto `resetFirestore` fixture, `loginAsAdmin()`, `pickOption()` for Spartan selects, `profileRows()`/`profilesTotal()` locators), `global-setup.ts`.
- **Servers**: the `ng e2e` builder starts the dev server on `127.0.0.1:4300`; Playwright's `webServer` starts the emulators (`firebase emulators:start --only auth,firestore --project demo-profilemanager`, readiness on Firestore 8080, then `waitForEmulators()` in global setup waits for Auth 9099 too). `gracefulShutdown` sends SIGTERM so the detached Java Firestore emulator is stopped as well.
- **Prerequisite**: a Java runtime on PATH for the Firestore emulator (`brew install openjdk` + add `/opt/homebrew/opt/openjdk/bin` to PATH). Auth emulator does not need Java.
- **Browser**: `pnpm exec playwright install chromium` once. If the download fails (Playwright CDN unreachable), `PLAYWRIGHT_BROWSER_CHANNEL=chrome` runs the `chromium` project on the installed Google Chrome.
- **Locators**: prefer ids (`#name`, `#login-email`), ARIA roles (Spartan select trigger = `role="combobox"` **without an accessible name**, so locate it by its host id or `getByRole('combobox').filter({ hasText: placeholder })`; options = `role="option"`; pagination `nav[aria-label="pagination"]`) and visible text. The only `data-testid`s are `profile-row`, `profile-card` and `profiles-total`.
- Tests run serially (`workers: 1`) because they share one emulator instance. Login happens through the UI in every test because Auth uses `browserSessionPersistence`, which Playwright's `storageState` cannot restore.

## MCP servers

`.mcp.json` / `.vscode/mcp.json` configure `angular-cli` (schematics, best practices, docs), `spartan-ng` (Spartan component lookup/add), and `firebase` (Firestore/Auth) MCP servers. Prefer these over raw shell for equivalent actions.
