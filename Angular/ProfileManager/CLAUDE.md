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
pnpm run firebase:deploy   # firebase deploy --only hosting:profilearc
```

There is **no test runner configured** (no `ng test`/Karma/Jest setup despite README mentioning `ng test`). Do not assume tests exist.

The Husky pre-commit hook `cd`s into `Angular/ProfileManager` and runs `lint-staged` (eslint --fix + prettier on staged `.ts`/`.html`, prettier on `.css`/`.scss`/`.json`).

## Required setup before running

`src/environments/environment.ts` is **gitignored** and must be created by copying `src/environments/environment.template.ts` and filling in real Firebase credentials. The app imports `environment.ts` directly and will not build without it.

## Architecture

A single-feature Angular 21 SPA for managing matrimony profiles, backed entirely by Firebase (Auth + Firestore). There is no backend server — the browser talks to Firestore directly.

**This codebase targets bleeding-edge Angular 21 APIs.** When writing code, match these patterns:
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

PrimeNG 21 (Aura theme, dark mode via `.my-app-dark` selector) + Tailwind CSS 4 (configured via PostCSS, imported in `src/styles.css`). The profiles list renders a separate desktop view and mobile view component.

## Conventions (enforced by ESLint — see eslint.config.js)

The config extends `@angular-eslint`'s **`all`** rule set, so linting is strict. Notable rules:
- Component selectors: `app-` prefix, kebab-case element; directives: `app` prefix, camelCase attribute.
- Inline template/style declarations capped at 30 lines (`component-max-inline-declarations`).
- `unused-imports/no-unused-imports` is an **error** (auto-fixed); unused vars warn unless prefixed `_`.
- From `.cursor/rules/cursor.mdc`: never set `standalone: true` (it's the default); no `@HostBinding`/`@HostListener` (use `host` object); no `ngClass`/`ngStyle` (use `class`/`style` bindings); native control flow (`@if`/`@for`/`@switch`) only; reactive/signal forms over template-driven; avoid `any` (use `unknown`); don't use signal `.mutate()`.

TypeScript is in **strict** mode with `noPropertyAccessFromIndexSignature` — access dynamic Firestore fields with bracket notation (`data?.['field']`).

## MCP servers

`.cursor/mcp.json` configures `angular-cli` and `primeng` MCP servers — useful for Angular schematics and PrimeNG component lookups.
