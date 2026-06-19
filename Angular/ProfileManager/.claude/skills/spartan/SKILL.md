---
name: spartan-ng
description: "Manages Spartan Angular UI components — adding, searching, composing, styling, and debugging. Provides project context, component docs (Brain/Helm APIs), and usage examples. Applies when working with @spartan-ng packages, Brain/Helm components, or any Angular project with Spartan UI installed. Also triggers for 'nx generate @spartan-ng/cli:ui' or Spartan component imports."
user-invocable: false
allowed-tools: Bash(npx nx generate @spartan-ng/cli:ui *), Bash(npx nx generate @spartan-ng/cli:init *), Bash(npm install @spartan-ng/*), Bash(pnpm add @spartan-ng/*), Bash(yarn add @spartan-ng/*)
---

# Spartan Angular UI

A headless (Brain) + styled (Helm) component library for Angular. Components are installed as npm packages and composed using Angular directives and hostDirectives.

> **IMPORTANT:** Run Nx generators using the project's package runner. Examples use `npx` but substitute the correct runner for the project.

## Principles

1. **Use existing components first.** Use `spartan_search` MCP tool before writing custom UI.
2. **Choose the right layer.** Use Helm for styled components, Brain for headless/custom styling.
3. **Compose with hostDirectives.** Don't wrap Brain directives manually; use Angular's hostDirectives.
4. **Use CVA variants and `hlm()`/`classes()`.** Never override component styles with raw Tailwind classes.
5. **Use semantic color tokens.** `bg-primary`, `text-muted-foreground` — never `bg-blue-500`.

## Critical Rules

These rules are **always enforced**. Each links to a file with Incorrect/Correct code pairs.

### Brain vs Helm → [brain-helm.md](./rules/brain-helm.md)

- **Use Helm when you want styling.** Brain is for custom-styled or headless use cases.
- **Never mix Brain selectors and Helm selectors** on the same element.
- **Helm wraps Brain (or CDK) via hostDirectives.** Don't manually apply Brain directives when using Helm.
- **Both layers use mixed selector patterns.** Brain: mostly `[brnX]` but some `brn-x`. Helm: `[hlmBtn]`, `hlm-dialog-content`, or both `[hlmCard],hlm-card`.
- **Some Helm components use CDK directly** (DropdownMenu, ContextMenu, Menubar use `@angular/cdk/menu`).

### Component Composition → [composition.md](./rules/composition.md)

- **Dialog, Sheet, and AlertDialog always need a Title.** For accessibility. Use `class="sr-only"` if visually hidden.
- **Use full Card composition.** `hlmCardHeader` / `hlmCardTitle` / `hlmCardDescription` / `hlmCardContent` / `hlmCardFooter`.
- **TabsTrigger inside TabsList.** Never render triggers directly in Tabs.
- **Avatar needs AvatarFallback.** For when image fails to load.
- **Use existing components, not custom markup.** Alert for callouts, Separator instead of `<hr>`, Skeleton for loading, Badge instead of styled spans.

### Styling & Tailwind → [styling.md](./rules/styling.md)

- **Use `hlm()` for inline class merging, `classes()` for host class management.**
- **No `space-x-*`/`space-y-*`.** Use `flex` with `gap-*`.
- **Use `size-*` when width and height are equal.**
- **No manual `dark:` color overrides.** Use semantic tokens.
- **No manual `z-index` on overlays.** Components handle stacking.
- **Use CVA variants before className.** `variant="outline"` not custom classes.

### Forms → [forms.md](./rules/forms.md)

- **Use Angular Reactive Forms.** `FormGroup` + `FormControl`, not template-driven.
- **Use the HlmField system for form layout.** `HlmField` + `HlmFieldLabel` + `HlmFieldError`.
- **Use `hlm-field-error` for validation.** Auto-detects state. Not manual `@if` with `text-destructive`.
- **Use `HlmFieldGroup` for grouping fields**, `HlmFieldSet` + `HlmFieldLegend` for fieldsets.
- **Use BrnSelect for complex dropdowns, HlmNativeSelect for simple ones.**
- **Use `hlmTextarea` for textareas** (separate directive, not `hlmInput`).

### Icons → [icons.md](./rules/icons.md)

- **Use `ng-icon` with `hlm` directive.** Not raw SVGs or icon fonts.
- **No manual sizing on icons inside Spartan components.** Components handle sizing via CSS.
- **Import from `@ng-icons/*`.** Check which icon set the project uses.

### Angular Directives → [directives.md](./rules/directives.md)

- **Use signals for reactive state.** `input()`, `signal()`, `computed()`, `linkedSignal()`.
- **Standalone is the default.** Angular 19+ — no need to write `standalone: true`.
- **Use new control flow syntax.** `@if`, `@for`, `@switch` — not `*ngIf`, `*ngFor`.
- **Use `inject()` for DI.** Not constructor injection.
- **OnPush change detection.** All Spartan components use OnPush.
- **Import patterns:** Brain from `@spartan-ng/brain/{name}`, Helm from `@spartan-ng/helm/{name}`, utils from `@spartan-ng/helm/utils`.

## Component Selection

| Need | Component |
|------|-----------|
| Button/action | `hlmBtn` directive on `<button>` |
| Text input | `hlmInput` directive on `<input>` |
| Textarea | `hlmTextarea` directive on `<textarea>` |
| Select dropdown | `BrnSelect` + `HlmSelect*` directives |
| Native select | `HlmNativeSelect` on `<select>` |
| Combobox/autocomplete | `BrnCombobox` / `BrnAutocomplete` |
| Checkbox | `BrnCheckbox` / `HlmCheckbox` |
| Radio group | `BrnRadioGroup` / `HlmRadioGroup` |
| Switch/toggle | `BrnSwitch` / `HlmSwitch` |
| Slider | `BrnSlider` / `HlmSlider` |
| Form field layout | `HlmField` + `HlmFieldLabel` + `HlmFieldError` |
| Data display | `HlmTable*`, `HlmBadge`, `HlmAvatar*`, `HlmCarousel*` |
| Navigation | `HlmSidebar*`, `HlmTabs*`, `HlmBreadcrumb*`, `HlmPagination*` |
| Dialog (modal) | `BrnDialog` + `HlmDialog*` |
| Sheet (side panel) | `BrnSheet` + `HlmSheet*` |
| Alert dialog | `BrnAlertDialog` + `HlmAlertDialog*` |
| Dropdown menu | `HlmDropdownMenu*` (wraps CDK, no Brain) |
| Context menu | `HlmContextMenu*` (wraps CDK, no Brain) |
| Feedback | `HlmAlert*`, `HlmProgress`, `HlmSkeleton`, `HlmSpinner`, `HlmToaster` |
| Command palette | `BrnCommand` inside `BrnDialog` |
| Layout | `hlmCard*`, `HlmSeparator`, `BrnAccordion*`, `BrnCollapsible*`, `HlmScrollArea` |
| Tooltip/info | `BrnTooltip` / `BrnHoverCard` / `BrnPopover` |
| Empty states | `HlmEmpty*` |
| Typography | `HlmH1`, `HlmP`, `HlmKbd`, `ng-icon[hlm]` |

## Workflow

1. **Get project context** — use `spartan_project_info` MCP tool
2. **Check installed components** — use `spartan_project_components` MCP tool
3. **Find components** — use `spartan_search` MCP tool
4. **Get docs and examples** — use `spartan_view` MCP tool
5. **Check dependencies** — use `spartan_dependencies` MCP tool
6. **Get source code if needed** — use `spartan_source` MCP tool
7. **Install** — use `spartan_install_command` MCP tool, then run the command
8. **Verify installation** — use `spartan_audit` MCP tool
9. **Review code against rules** — check Brain/Helm usage, composition, styling

## Detailed References

- [rules/brain-helm.md](./rules/brain-helm.md) — Brain vs Helm layer selection, CDK-based components
- [rules/composition.md](./rules/composition.md) — Component structure, Dialog/Card/Tabs patterns
- [rules/styling.md](./rules/styling.md) — Tailwind, CVA, `hlm()`, `classes()`, semantic tokens
- [rules/forms.md](./rules/forms.md) — HlmField system, Angular Reactive Forms, form controls
- [rules/icons.md](./rules/icons.md) — ng-icon patterns, icon sizing
- [rules/directives.md](./rules/directives.md) — Signals, standalone, OnPush, control flow, `inject()`
- [cli.md](./cli.md) — Nx generators, migration tools
- [customization.md](./customization.md) — Theming, CSS variables, Spartan Tailwind preset
- [mcp.md](./mcp.md) — MCP server tools documentation
