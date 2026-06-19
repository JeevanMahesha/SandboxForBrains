# Brain vs Helm

## Contents

- When to use Brain vs Helm
- Never mix layers on the same element
- hostDirectives composition
- Selector conventions
- CDK-based components (no Brain)

---

## When to use Brain vs Helm

| Scenario | Use |
|----------|-----|
| Standard styled component | **Helm** — comes with Tailwind styling and CVA variants |
| Custom-styled component | **Brain** — headless, apply your own styles |
| Building a component library | **Brain** — consumers apply their own styling |
| Quick prototyping | **Helm** — ready-to-use, zero configuration |
| Accessibility-only behavior | **Brain** — gets ARIA, keyboard, focus management |

---

## Never mix Brain and Helm selectors on the same element

**Incorrect:**

```html
<!-- Don't apply Brain directive on a Helm component -->
<button hlmBtn brnButton>Click me</button>
```

**Correct:**

```html
<!-- Helm already wraps Brain internally via hostDirectives -->
<button hlmBtn>Click me</button>
```

---

## hostDirectives composition

Helm components use Angular's `hostDirectives` to compose Brain directives internally:

```typescript
// How HlmButton works internally (you don't write this — Spartan does)
@Directive({
  selector: 'button[hlmBtn], a[hlmBtn]',
  hostDirectives: [
    { directive: BrnButton, inputs: ['disabled'] }
  ],
})
export class HlmButtonDirective { /* adds CVA variant styling */ }
```

**Using Helm in your template — just use Helm:**

```html
<button hlmBtn variant="outline" size="sm">Click me</button>
```

Some Helm components use **class inheritance** instead of hostDirectives:

```typescript
// HlmDialog extends BrnDialog (not hostDirectives)
export class HlmDialog extends BrnDialog { }
```

---

## Selector conventions

Both layers use **mixed selector patterns**. Do not assume a single pattern.

| Layer | Prefix | Selector Patterns | Examples |
|-------|--------|-------------------|---------|
| Brain | `brn` | Mostly attribute, some element, some both | `[brnDialogTrigger]`, `brn-avatar`, `[brnDialog],brn-dialog` |
| Helm | `hlm` | Attribute, element, or both | `[hlmBtn]`, `hlm-dialog-content`, `[hlmCard],hlm-card` |

**Common patterns:**

- Directives that attach to existing elements → attribute selectors: `[hlmBtn]` on `<button>`
- Self-contained UI elements → element selectors: `hlm-dialog-content`, `hlm-spinner`
- Flexible components → both: `[hlmCard],hlm-card` — use either
- Restricted selectors → `button[brnDialogTrigger]` (attribute only on `<button>` elements)

---

## CDK-based components (no Brain layer)

Some Helm components wrap `@angular/cdk` directly instead of Brain:

| Component | Helm wraps | Note |
|-----------|-----------|------|
| DropdownMenu | `@angular/cdk/menu` (`CdkMenu`) | No `BrnDropdownMenu` exists |
| ContextMenu | `@angular/cdk/menu` (`CdkContextMenuTrigger`) | No `BrnContextMenu` exists |
| Menubar | `@angular/cdk/menu` (`CdkMenuBar`) | No `BrnMenubar` exists |

For these components, only import from `@spartan-ng/helm/*`. There is no Brain package to install.

**Incorrect:**

```typescript
// This doesn't exist
import { BrnDropdownMenu } from '@spartan-ng/brain/dropdown-menu';
```

**Correct:**

```typescript
import { HlmDropdownMenuComponent } from '@spartan-ng/helm/dropdown-menu';
```
