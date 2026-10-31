# Plan: UX follow-ups from the independent review

Status: **approved direction, not started**. Branch: continue on `feat/ux-redesign-glass` (or a follow-up branch from it).
Origin: independent UX review of the redesigned app. Phases A–E cover the top finding (status change and notes take about 5 interactions each today). Phases F–I cover the remaining review items.

## 1. Goal

1. Change a profile's status **directly from its card** in 2 interactions (open the status control, pick a status), saved immediately, with an **Undo** toast.
2. Add a note **from the view drawer** in 1 interaction (type, press Enter) without entering edit mode.
3. Make the list toolbar usable at tablet and phone widths (Phase F).
4. Make the edit drawer shorter to work in and consistent with the view drawer (Phase G).
5. Make the create wizard safer and clearer without changing what is required (Phase H).
6. Make search feel responsive (Phase I).

## 2. Hard constraints

- No new or changed profile properties. Both features write fields that already exist: `profileStatusId` (+ the existing `updatedAt` stamp) and appended entries in `comments` (`{ value, createDateAndTime }`).
- No change to the `ProfileDetail` model, Firestore queries, indexes or `firestore.rules`.
- Validation rules for the full edit form are untouched. This is an extra path, not a replacement for edit.
- Stack rules from `CLAUDE.md`: zoneless, signals, Spartan Helm only, no new dependencies. If a control is missing from `libs/ui`, add it with the Spartan CLI, not by hand.
- Existing ids, aria-labels and headings that e2e depends on stay unless this plan names them.
- Commits carry no AI co-author line.

## 3. How it works today (so the plan stays honest)

- `ProfilesService.updateProfile(id, partial)` = `updateDoc(doc, { ...partial, updatedAt: serverTimestamp() })`. It is already generic, so a one-field update needs no new Firestore code.
- Writes are followed by `refreshProfiles()` (reload of the `profiles` resource). The list sorts client-side, with **REJECTED always last**, and may be narrowed by the status chip.
- Status label/colour on a card come from `profileStatusId` through `PROFILE_STATUS` / `PROFILE_STATUS_STYLES` in the mapping (`profiles.service.ts`), so changing `profileStatusId` is enough.
- The drawer saves comments by replacing the **whole `comments` array** from the form (`profile-form.ts`). The quick note must not copy that approach (see D3).
- Toasts use Spartan's sonner (`toast.success/error`).

## 4. Design decisions (recommendation first; reply if you disagree)

| # | Question | Recommendation |
|---|---|---|
| D1 | What does the status control look like on the card? | The **status pill itself becomes the trigger** of a small menu (Helm dropdown-menu) listing all 9 statuses with their colour dot and a check on the current one. A small chevron on the pill signals it is interactive. Keyboard: Enter/Space opens, arrows move, Enter picks, Esc closes. |
| D2 | Undo? | **Yes**: success toast "Status changed to Accepted" with an **Undo** action for about 6 s. Undo writes the previous `profileStatusId` back. It also bumps `updatedAt` again (the app stores no history); this is acceptable and is stated in the code comment. |
| D3 | How is a quick note saved? | Append with Firestore **`arrayUnion`** on `comments` (value + `new Date()`), plus the `updatedAt` stamp, not a read-modify-write of the whole array. This avoids overwriting notes added elsewhere between load and save. Legacy string comments in the array are untouched (the mapper already handles them). |
| D4 | Optimistic update? | **Yes** for status: update the card immediately, roll back with an error toast if the write fails. Then reload to pick up server order/timestamps. Notes: show the note after the write resolves (it is a small, fast write) with the input disabled while saving. |
| D5 | What when the change moves the card? | See section 6: (a) REJECTED re-sorts to the end, (b) an active status chip filters the card out. Recommendation: **keep the card in place until the next reload/filter change** and let Undo restore it; do not make cards jump under the user's pointer. |
| D6 | Mobile | The status pill on the mobile card opens the same menu as a **bottom sheet** (consistent with the Filters sheet); tap target at least 44 px. |
| D7 | Where else? | Also available in the **view drawer** header (same component), so a user already looking at a profile can change status without Edit. |
| D8 | Toolbar below desktop width (Phase F) | **One horizontally scrolling status-chip row** with an edge fade (single line at 768–1024) instead of 2–3 wrapped rows; sort / star / Clear stay on one row beside the search. On phones **Add Profile becomes a floating button** (bottom-right, 56 px, above the toast area); the top row keeps theme, Filters, account. Status stays in the Filters sheet on phones (decision from the redesign), no second chip strip. |
| D9 | Edit drawer length (Phase G) | **Two tabs in edit mode: "Details" and "Notes"** (with a note count and an error dot on a tab that holds a validation error). View mode keeps its single scroll. **Age moves to the Horoscope section** in both modes, and edit section titles are renamed to match view (Contact, Horoscope, Location, Notes). |
| D10 | Wizard (Phase H) | **Keep the 3-step wizard.** The review suggested marking steps 2 and 3 optional, but **every profile field is required** by the form validators (name, mobile, matrimony ID, status, zodiac, age, star score, state, city), so that would be false. Instead: mark required fields with an asterisk and a legend, show "n of m required fields done" per step in the rail, add a **"Discard changes?" confirm** when leaving with unsaved input, and pin Back/Continue in a sticky bar on phones. No validation rule changes. |
| D11 | Search responsiveness (Phase I) | Lower the **800 ms debounce to 350 ms**, search **immediately on Enter**, and show a small spinner inside the search box while the query runs. The grid already dims while refetching. |

## 5. Phases

Each phase is its own commit. Before each commit: `pnpm lint`, `pnpm format:check`, `pnpm build`, and the relevant e2e specs; full `pnpm e2e` at the end of phases B and E. Never run two `ng e2e` at once.

### Phase A: Service layer (small)
- `ProfilesService.updateProfileStatus(id, statusId)` : one-field `updateProfile` call returning the previous status for Undo. Uses the existing `updateProfile`, so `updatedAt` handling stays in one place.
- `ProfilesService.addNote(id, value)` : `updateDoc` with `arrayUnion({ value, createDateAndTime })` + `updatedAt`.
- Optimistic helper: update the matching row in the `profiles` resource value, roll back on failure (use the resource's writable `value`; if the installed API differs, fall back to a local override signal merged in the cards' data).
- No query, index, rule or model change.

### Phase B: Status menu on cards (desktop + mobile)
- New shared component `app-status-menu` (`components/shared/status-menu/`): input = profile id + current `profileStatusId`; renders the pill as trigger; menu items from `PROFILE_STATUS` with `PROFILE_STATUS_STYLES` dots. Disabled with a spinner while its write is in flight.
- Use it in the desktop card, the mobile card, and (D7) the view-drawer header; keep the existing badge look so nothing else shifts.
- On select: optimistic update, toast with Undo, error toast + rollback on failure.
- Accessibility: trigger has `aria-label="Change status, currently <status>"`, `aria-haspopup="menu"`, focus returns to the trigger after close, 44 px mobile target, visible focus ring on glass, not colour-only (label text always visible).

### Phase C: Quick note in the view drawer
- Replace "must click Edit to add a note" with an always-visible **"Add a note"** input at the top of the Notes timeline in **view** mode: Enter or an "Add note" button saves via `addNote`; helper text "Press Enter to add".
- On success the new note appears at the top/bottom of the timeline in the same order the drawer already uses; toast "Note added".
- Fix in the same commit (found in review): on the mobile sheet the "Notes" heading was reported hidden behind the sticky footer: add bottom padding equal to the footer height and show the note count in the heading ("Notes · 3"). Verify first that the report is real.
- Edit mode keeps its current comment controls; relabel the "+" button "Add note" (not icon-only).

### Phase D: Tests
- New spec `e2e/profile-status-inline.spec.ts`: change a card's status from the menu and see the pill + colour edge update; Undo restores it; error path (force the write to fail via the emulator helper used by the search error test, if feasible, else assert rollback with a blocked request); keyboard-only flow; mobile (390) bottom-sheet flow; changing to REJECTED moves it to the end only after reload (D5); with the "Accepted" chip active, changing an Accepted card to New keeps it visible until the filter changes.
- New cases in `e2e/profile-comments.spec.ts` (or a new file): add a note from the view drawer with Enter; existing notes are preserved (seed 2, add 1, expect 3); a legacy string comment is still shown after adding.
- Existing specs that open the View drawer or count notes must still pass untouched. Update only text/locators the new UI genuinely changes.

### Phase E: Verify and polish
- Contrast and focus checks for the new menu in light and dark (same method as Phase 5 of the redesign).
- Screenshots at 1280 and 390, both themes: card with trigger, open menu, open mobile sheet, Undo toast, view drawer with the note input.
- Final full e2e twice, lint, format, build.

### Phase F: Compact toolbar (tablet + phone)
Touches `components/toolbar/` (toolbar, status-chips), `profiles-list` (FAB placement).
- Chips: below `lg`, one `overflow-x-auto` row, no wrap, hidden scrollbar, edge fade mask, the selected chip scrolled into view; keep `role="group"` + `aria-pressed`. Desktop (`lg` and up) stays as today.
- Sort, star select and Clear sit on one line next to the search at 768–1024; verify no clipped controls at 768, 820, 1024.
- Phones: Add Profile becomes a floating action button (icon + accessible name "Add Profile", same route). Top row keeps theme toggle, Filters, account. Reserve space so the FAB never covers the last card or the pager, and keep toasts visible (move the toaster offset above the FAB on phones).
- The toolbar's `Add Profile` button must keep its accessible name for the e2e helpers (`openNewProfileWizard` scopes to `app-toolbar`: keep the FAB inside that scope or update the helper).
- Tap targets at least 44 px; the card 3-dot menu target is raised from about 32 px to 44 px on phones (small fix from the review). The kebab hides View: add a visible **View** affordance on the mobile card (the card tap already opens it; add an explicit "View" button or an icon so it is discoverable).
- Tests: extend `e2e/mobile-view.spec.ts` (FAB navigates to the wizard; chips scroll row exists at 768) and the existing filter specs must still pass.

### Phase G: Edit drawer tabs + consistent sections
Touches `components/profile/profile.html`, `profile-form-fields`. **Run after Phase C** (same files).
- Add the Spartan **tabs** component through the Spartan CLI (it is not in `libs/ui` yet; verify the CLI command works in this repo, fallback is an accessible `role="tablist"` built from existing Helm buttons).
- Edit mode: tabs "Details" (all fields) and "Notes" (add-note input + list). Form state is shared, so a typed-but-not-added note is still saved on "Update Profile" (existing behaviour) even from the other tab; the Notes tab shows the count; a tab with a validation error shows an error dot and the first error moves focus to its field on submit.
- Move **Age** into the Horoscope section in both view and edit; rename edit sections to Contact, Horoscope, Location, Notes. Keep every field id, label and aria-label.
- Show the read-only **Star Match Score** as the `ScoreRing` with the line "Calculated from the selected star" instead of a disabled text input (it is derived and not typeable).
- Dark-theme legibility: the review flagged small labels on the busy blurred drawer background; re-measure contrast and raise the drawer panel opacity if any label is under 4.5:1.
- Tests: `profile-comments.spec.ts` and `profile-edit.spec.ts` reach `#comment` through the Notes tab (update locators, keep assertions); add a case for the error dot / focus on a hidden-tab error.

### Phase H: Wizard clarity and safety
Touches `components/profile-wizard/`; one new guard if needed. **No validation or data changes.**
- Asterisks on required fields plus a short "* required" legend. Rail shows "n of m required fields done" per step (computed from the same form state), and a done check only when the step is complete.
- **Discard guard:** leaving the wizard (header back link, browser back, or navigating away) with any entered input asks "Discard this new profile?" using the existing confirm dialog (`CanDeactivate` guard on `/profiles/new`, plus a `beforeunload` prompt while dirty). No prompt when nothing was typed or after a successful save.
- Mobile: Back/Continue move into a sticky bottom bar (respecting the safe area and the keyboard), removing the empty space under short steps.
- Header back arrow vs step Back button look alike: give the header control a text label ("Profiles") and keep the step control as "Back".
- Disabled star select: add visible helper text ("Choose a zodiac sign first") instead of relying on the greyed look; keep the existing behaviour.
- Tests: add wizard cases for the discard confirm (cancel keeps data; confirm leaves) and the per-step counter; existing wizard specs keep passing.

### Phase I: Search responsiveness
Touches `components/toolbar/toolbar.ts|html` and nothing in the service.
- Debounce 800 ms to 350 ms; pressing Enter flushes immediately; clearing the box searches immediately.
- Spinner in the search input while the `profiles` resource is loading from a search change; `aria-busy` on the results is already set.
- Check Firestore read volume is acceptable (queries are per debounced change and stale ones are discarded by the resource); say so in the commit message if the debounce change is measurable.
- Tests: existing `profile-search.spec.ts` must pass unchanged; add one case that Enter searches without waiting for the debounce.

### Execution order and cadence
A → B → C → D → E first (status + note, with their own verification), then F, G, H, I, **one phase per sub-agent, one at a time** (they share files such as `profile.html` and the toolbar, and `ng e2e` can only run once at a time). Every phase ends with lint, format check, build and the **full** e2e suite, run twice if anything flakes, and its own commit. I re-run the checks myself before each commit.

## 6. Edge cases to handle explicitly

| Case | Behaviour |
|---|---|
| Write fails (offline, rules, expired session) | Roll the card back, `toast.error('Failed to update status')`, menu re-enabled. |
| Rapid second change before the first resolves | Disable the trigger while in flight (simplest and avoids ordering bugs). |
| Undo after the list reloaded or the profile was deleted meanwhile | Undo writes by id; if the doc is gone, show an error toast instead of recreating it (`updateDoc` fails on a missing doc, which is the desired behaviour). |
| Same status picked | No write, no toast. |
| Active status chip hides the changed card | Keep until next reload/filter change (D5); Undo restores. |
| REJECTED sorted last | Order refreshes on reload only. |
| Two admins editing the same profile | Status: last write wins (same as today's edit). Notes: `arrayUnion` means both notes survive. |
| Note is whitespace-only | Not saved; input stays focused. |
| Very long note | Same limits as the existing comment input (no new rule invented). |

## 7. Risks

| Risk | Mitigation |
|---|---|
| Pill becomes interactive but still looks like a badge, so users miss it | Chevron affordance + hover/focus state; verify in the browser. |
| Accidental status change from a mis-tap on mobile | Bottom sheet with large rows + Undo toast. |
| Optimistic update diverges from server state | Reload after the write settles; rollback on error. |
| Undo bumps `updatedAt` (no history) | Documented; acceptable. Writing the old timestamp back is a hack and is not recommended. |
| Toast Undo action API differs in the installed Spartan sonner | Check the `toast` API before building; fallback is a dedicated inline "Undo" button in a custom toast. |
| New menu adds to the initial bundle (already ~63 kB over budget) | Component is small and part of lazy chunks; confirm the initial bundle number does not grow. |
| e2e flakiness on a loaded machine | Re-run once before treating a timeout as a regression; avoid fixed sleeps in the new specs. |
| FAB or fade mask hides content or controls on small screens (F) | Reserve bottom padding for the FAB and pager; test 360, 390, 768, 820, 1024; keep toasts above the FAB. |
| Scrolling chip row hides the active chip off-screen (F) | Scroll the selected chip into view on change and on load. |
| Spartan tabs component missing from libs/ui; the Spartan MCP is deprecated (G) | Add via the Spartan CLI and check the generated files; fallback is an accessible tablist from existing Helm buttons. Document any vendored edit. |
| Errors hidden on the inactive tab make Save look broken (G) | Error dot on the tab, move focus to the first invalid field on submit, keep the Save button state logic unchanged. |
| E2E specs that reach #comment fail once notes move to a tab (G) | Update locators to open the Notes tab first; assertions stay the same. |
| CanDeactivate or beforeunload prompt blocks legitimate navigation or fires after save (H) | Mark the form clean on successful save before navigating; only prompt when something was typed; test cancel and confirm. |
| Per-step required-fields counter disagrees with the validators (H) | Derive it from the same form field states, never a hard-coded list. |
| Lower debounce raises Firestore read volume (I) | 350 ms is still a meaningful debounce; stale queries are discarded by the resource; measure in the emulator and note the result. |

## 8. Effort

Phase A: S. Phase B: M (largest). Phase C: S-M. Phase D: M. Phase E: S. Phase F: M. Phase G: M (tabs component plus locator updates). Phase H: M. Phase I: S. The first block (A to E) delivers the biggest user-visible win and can ship on its own.

## 9. Definition of done

- Status can be changed from a card (desktop and mobile) and from the view drawer in 2 interactions, with Undo, rollback on failure, and full keyboard support.
- A note can be added from the view drawer with Enter, preserving existing notes.
- No changes to models, Firestore queries, rules or the saved data shape (verified with `git diff main --stat`).
- Lint, format, build and the full e2e suite are green; new specs cover the cases in Phase D.
- Phase F: at 768 and 1024 px the status chips are a single scrolling row with no clipped controls; on phones Add Profile is a floating button that never covers content or toasts; the mobile card's View action is discoverable and tap targets are at least 44 px.
- Phase G: edit mode has Details and Notes tabs, Age sits under Horoscope in view and edit, section titles match between view and edit, a hidden-tab validation error is visible and focuses the field, and the Star Match Score shows as a ring, not an input.
- Phase H: the wizard marks required fields, shows per-step progress, asks before discarding typed input, and pins Back/Continue on phones; validation rules and saved data are unchanged.
- Phase I: search starts after 350 ms (or at once on Enter), shows a spinner while running, and the existing search specs pass unchanged.
- Each phase is its own commit with lint, format, build and the full e2e suite green, and git diff main --stat for src/app/models, src/app/firebase and firestore.rules stays empty.
