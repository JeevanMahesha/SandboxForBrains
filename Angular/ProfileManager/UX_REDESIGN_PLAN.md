# UX Redesign Plan: "Bold / Glass"

Status: **approved, not started**. Reference mockup: `ux-redesign.html` (scratchpad copy, review only).

## 1. Goal

Modernise the look and flow of ProfileManager (Angular 22 + Spartan + Tailwind 4) with a bold, glass-style UI, light and dark, desktop and mobile.

## 2. Hard constraints

- **No property changes.** `profile.model.ts`, `profiles.service.ts`, `auth.service.ts`, `src/app/firebase/*`, `firestore.rules` and the signal-form validation rules are not modified.
- Same fields only: `name, mobileNumber, matrimonyId, profileStatusId, zodiacSign, star, starMatchScore, age, state, city, comments, createdAt, updatedAt`. Login stays email + password.
- Search stays "ID or phone". Filters stay sort / status / star match.
- Follow the existing stack rules in `CLAUDE.md`: zoneless, OnPush, signals, signal forms, standalone components, Spartan Brain/Helm only (no PrimeNG, no `@angular/fire`).
- Never point e2e at the real Firebase project (emulators only).
- Commits and PR descriptions carry **no AI co-author lines**.
- Work on a **new branch** from `main`, not on `fix/profiles-search-empty-and-error-state`.

## 3. Chosen designs

| Screen | Choice | Desktop | Mobile |
|---|---|---|---|
| Login | **B**: split screen / hero | Brand panel + form | Headline on top, form in bottom panel |
| Create profile | **B**: 3-step wizard + live preview | New full page `/profiles/new` | Stepper with mini preview, sticky action bar |
| List | **B**: card grid | Cards with status edge + star-match ring | Cards + Filters bottom sheet |
| Profile view | **A**: glass drawer | Right-side drawer | Bottom sheet |

### Decisions taken (recommendations accepted)

1. **Edit stays in the drawer.** Only create moves to the wizard. The view drawer's "Edit" button still opens edit mode in the drawer.
2. **Status filter uses chips** on desktop and a bottom sheet on mobile. Sort and star-match remain selects (desktop) or sheet options (mobile).
3. **Score shows the number only.** No invented labels such as "Good compatibility".
4. **Login heading stays "Login"** (not "Sign in"), to keep `auth.spec.ts` valid.

## 4. Phases

Each phase is a separate commit. Before each commit run `pnpm lint`, `pnpm format:check`, `pnpm build` and the relevant e2e specs. Run the full `pnpm e2e` at the end of phases 3, 4 and 5.

### Phase 0: Design foundation
- Add tokens to `src/styles.css`: glass surfaces, aurora background, gradient primary, status colours, ring colours (light and dark).
- Keep `ThemeService` (light / dark / system) unchanged.
- Restyle Spartan primitives (button, input, select, badge, sheet, pagination) via tokens and classes. Avoid editing `libs/ui` unless unavoidable.
- New small shared components: `score-ring`, `profile-avatar` (initials).
- Lighter background (no heavy blur) on small or low-power screens.

Files: `src/styles.css`, new `src/app/components/shared/*`.

### Phase 1: Login B
- Rework `components/login/login.html` into the split layout; keep loading and error states.
- Keep ids `#login-email`, `#login-password`, heading text "Login".

Verify: `auth.spec.ts`, mobile width check.

### Phase 2: Profile view A (drawer)
- Restyle `components/profile/profile.html` view mode: avatar + status header, call / WhatsApp / copy actions, details, notes timeline.
- Drawer opens from the right on desktop and from the bottom on mobile (via `ViewportService`).
- URL-driven open state unchanged.

Verify: `profile-view.spec.ts`, `profile-edit.spec.ts`, `profile-comments.spec.ts`.

### Phase 3: List B (card grid)
- Replace the desktop table with a card grid in `profiles-list-desktop-view`. Each card: status edge, ring, view / edit / call / WhatsApp / copy / delete.
- Mobile view: cards + Filters bottom sheet (sort, status, star match).
- Toolbar: search, sort, status chips, star-match select, Clear. Restyle pagination.
- Keep empty and error (retry) states and `data-testid`s (`profile-row`, `profile-card`, `profiles-total`) where feasible.

Verify: `filter-*.spec.ts`, `profile-search.spec.ts`, `profile-delete.spec.ts`, `mobile-view.spec.ts`, `theme-toggle.spec.ts`.

### Phase 4: Create B (wizard)
- Add route `/profiles/new` (lazy `loadComponent`, default export, `authGuard`).
- 3 steps: Contact, Horoscope, Location and notes. Live preview card.
- Reuse the **same** signal form and validators (extract a shared form factory if needed, no rule changes).
- "Add Profile" navigates to `/profiles/new`. Old `?actionType=create` links redirect there. On save, return to the list and reload profiles.
- Keep ids `#name`, `#mobile`, `#matrimony`, `#age`, `#comment` and heading "Add New Profile". Prevent leaving a step with invalid fields.

Verify: `profile-create.spec.ts`, `profile-form-validation.spec.ts`, `mobile-number.spec.ts`, `star-match-score.spec.ts`, `star-zodiac-popovers.spec.ts`.

### Phase 5: Tests, polish, release
- Update e2e specs for chips and wizard steps. Add a mobile-width pass.
- Accessibility pass: focus order, contrast in both themes, labels on icon buttons, reduced-motion.
- Final `pnpm lint && pnpm e2e`, then PR.

## 5. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Wizard puts fields on separate steps | Create-related e2e tests break | Update specs to click through steps; keep ids and button labels |
| Status chips replace the select | Filter specs break (`Select Status` combobox) | Rewrite those specs; keep `Clear` button name |
| Two patterns (page for create, drawer for edit) | Slight inconsistency | Share the form factory and field components so look and validation match |
| Desktop cards replace the table | Row-based test helpers fail | Keep `profile-row`/`profile-card` ids or update `e2e/support/fixtures.ts` |
| Drawer as bottom sheet on phones | Layout bugs at real widths | Test at 360 / 390 / 430 px; fall back to a full-height sheet |
| Glass blur is GPU-heavy | Jank on low-end phones | Reduce blur and drop blobs on small screens; respect `prefers-reduced-motion` |
| Low contrast on glass in light mode | Accessibility failures | Check contrast of text and borders in both themes |
| Editing vendored `libs/ui` | Hard to regenerate via Spartan CLI | Prefer token and class overrides; document any edit |
| Legacy URLs with `actionType=create` | Broken bookmarks | Redirect to `/profiles/new` |
| Large UI diff | Hard to review, regressions | One commit per phase, run e2e per phase |
| Mockup shows items not in the app | Scope creep | Do not build: stat tiles, compatibility labels, "Sign in" wording |
| Local setup (Java, Playwright browser) | e2e cannot run | See the e2e machine-setup memory: openjdk on PATH, Chrome fallback |

## 6. Out of scope

New fields or properties, backend or Firestore changes, auth changes, stat tiles, wizard-based edit, new third-party UI libraries.

## 7. Definition of done

- All four screens match the chosen designs in light and dark, desktop and mobile.
- No changes to models, services, Firebase layer or rules (`git diff` confirms).
- `pnpm lint`, `pnpm format:check`, `pnpm build` and `pnpm e2e` all pass.
- Manual check at 360, 390, 768 and 1280 px.
