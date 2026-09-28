# E2E Test Suite Review

Reviewed: `e2e/*.spec.ts`, `e2e/rules/firestore.rules.spec.ts`, `e2e/support/*.ts`, `playwright.config.ts`.

Current state: **13 tests**, all happy-path. Good foundations (locator discipline, no
arbitrary sleeps, real security-rules tests), but coverage is thin and a few patterns work
against "easy to update when something changes."

Checkboxes are for tracking progress as we go through these one by one — not a reflection of
difficulty or priority order (see "Suggested order" at the bottom).

---

## 1. Coverage gaps

### High priority (guard things that already broke once, or that we just touched)

- [x] **Keyboard-only pagination.** Every existing test drives the UI with `.click()`. Nothing
      would have caught (or will catch a regression of) the pagination keyboard-accessibility
      fix from this session (`hlm-pagination-link.ts`).
- [x] **Logout round-trip.** `auth.spec.ts` tests anonymous redirect and login, but never
      clicks Log Out and asserts it signs out. The Log Out control just moved to a new account
      menu with no coverage at all.
- [x] **Drawer reset on close/reopen.** Fixed by commit `0c3cbee2` ("reset the profile form when
      the drawer closes or opens in create mode") — a real shipped bug. No regression test
      exists to keep it fixed.

### Medium priority (real features with zero coverage)

- [x] **Mobile view.** The `chromium` Playwright project is fixed at 1280px desktop width. The
      entire `profiles-list-mobile-view` component — card layout, kebab menu, the FAB we just
      removed — is never rendered by any test.
- [x] **Comments** (add + delete). `profile.ts`'s `addComment`/`deleteComment` — a whole feature,
      untested.
- [x] **View-only drawer.** Only create/edit are tested; "View" mode is never opened.
- [ ] **Preferred Star / Zodiac Signs popovers** (`star-match`, `zodiac-signs` components).
- [ ] **Theme toggle** (`ThemeService`).
- [ ] **Search by ID/phone** (toolbar search box, uses the same mobile-number canonicalization
      as create/edit).
- [x] **Rejected-profiles-sorted-last.** A deliberate, non-obvious business rule
      (`profiles.service.ts: sortWithRejectedLast`) with no test.
- [x] **Mobile number formats.** `mobile-number.util.ts` documents 4 accepted input shapes
      (bare 10 digits, leading 0, `91` prefix, `+91` prefix) — only 1 is tested. No test that an
      invalid number is rejected with a validation error.
- [ ] **Star Match Score auto-calc + "Not specified" flow** when no Star Sign is selected.
- [ ] **Form validation errors** (required fields, invalid mobile number) — the signal-forms
      validation in `profile-form-fields.ts` has no e2e coverage.
- [ ] **Sort order toggle, page-size change, Clear filters, and combinations of filters** — only
      "page 2" and "filter by status" alone are tested today.

---

## 2. Best-practice findings

### Working well (keep doing this)

- Locators are role/id/testid-based almost everywhere — matches the convention CLAUDE.md
  itself documents, and is what makes tests resist markup churn.
- `resetFirestore` auto-fixture + `makeProfile()`/`seedProfiles()` factory centralizes seed-data
  shape in one place.
- No arbitrary `sleep`/`waitForTimeout` — everything relies on Playwright's auto-retrying
  `expect(...)`.
- Firestore rules tests use `assertFails`/`assertSucceeds` against the real `firestore.rules`
  file, not a hand-rolled copy — rule changes get tested against the actual deployed artifact.

### Gaps against "easy to update if we change something"

- [x] **`SeedProfile` (in `e2e/support/emulator.ts`) is a hand-maintained duplicate of the app's
      `ProfileDetail` model**, not imported from it. A required field added/renamed on the model
      won't fail the build — it'll silently drift from what `mapDocToProfile` expects and fail
      at test-run time with a confusing error.
- [x] **Status/zodiac labels are re-typed as literal strings in tests** (e.g. `'Accepted'`,
      `'Mesham (Aries)'`) instead of derived from `PROFILE_STATUS`/`ZODIAC_LIST`. Renaming a
      label in `common.const.ts` won't fail the build — it'll fail at test-run time with a
      locator-not-found error, in every file that happens to reference that label.
- [ ] **Minor:** `profile-delete.spec.ts` scopes the confirm dialog by tag name
      (`page.locator('app-confirm-dialog')`) rather than by role — the one place that departs
      from the file's own role-first convention. Defensible (disambiguates two same-named
      "Delete" buttons), but a `getByRole('dialog')`/`alertdialog` scope would be more resistant
      to a future selector rename.
- [x] **Flaky: ambiguous "Close" button in `mobile-view.spec.ts`.** Found while verifying this
      list: the sheet has both a footer "Close" button and an icon-only close control that also
      resolves to the accessible name "Close" (`hlmsheetclose`), so
      `page.getByRole('button', { name: 'Close' })` was a strict-mode violation waiting to happen
      — it failed on one run out of two before the fix. Now scoped to `page.getByRole('dialog')`
      with `.first()`, matching the pattern the new view-profile test uses. Verified stable across
      3 consecutive full-suite runs after the fix.

---

## Suggested order

1. [x] Keyboard-accessible pagination test
2. [x] Logout round-trip test
3. [x] Drawer-reset-on-reopen regression test
4. [x] Comments add/delete
5. [x] One mobile-viewport smoke test
6. [x] Fix the two maintainability issues (import real types/constants into test support code)
       so new tests don't inherit the same drift risk
7. Everything else in the medium-priority list, taken one at a time:
   - [x] 7a. Rejected-profiles-sorted-last business rule (also caught and fixed a real
         inverted-sort-direction bug along the way)
   - [x] 7b. Mobile number formats (remaining 3 accepted shapes + invalid-number rejection)
   - [x] 7c. Desktop view-only drawer
   - [ ] 7d. Search by ID/phone
   - [ ] 7e. Form validation errors (required fields, invalid mobile number)
   - [ ] 7f. Star Match Score auto-calc + "Not specified" flow
   - [ ] 7g. Sort order / page-size / Clear-filters combinations
   - [ ] 7h. Theme toggle
   - [ ] 7i. Preferred Star / Zodiac Signs popovers
