# Styling & Tailwind

## Contents

- Semantic colors
- CVA variants before custom classes
- `hlm()` and `classes()` for class management
- No `space-x-*` / `space-y-*`
- `size-*` for equal dimensions
- No manual `dark:` overrides
- No manual `z-index` on overlays

---

## Semantic colors

**Incorrect:**

```html
<div class="bg-blue-500 text-white">
  <p class="text-gray-600">Secondary text</p>
</div>
```

**Correct:**

```html
<div class="bg-primary text-primary-foreground">
  <p class="text-muted-foreground">Secondary text</p>
</div>
```

Spartan uses OKLCH color tokens: `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, plus `-foreground` variants for each.

---

## CVA variants before custom classes

**Incorrect:**

```html
<button hlmBtn class="border border-input bg-transparent hover:bg-accent">
  Click me
</button>
```

**Correct:**

```html
<button hlmBtn variant="outline">Click me</button>
```

Priority order for customization:

1. **Built-in variants** — `variant="outline"`, `size="sm"`
2. **Semantic color tokens** — `bg-primary`, `text-muted-foreground`
3. **CSS variables** — define custom tokens in global CSS
4. **`hlm()` with layout classes** — margins, padding, width

---

## `hlm()` and `classes()` for class management

Two utilities from `@spartan-ng/helm/utils`:

- **`hlm()`** — simple `twMerge(clsx(inputs))` for inline class merging
- **`classes()`** — signal-aware host class management (preferred in components)

**Incorrect:**

```typescript
@Component({
  host: {
    '[class]': '"flex items-center " + (isActive ? "bg-primary" : "bg-muted")'
  }
})
```

**Correct (classes() — preferred for host class management):**

```typescript
import { classes } from '@spartan-ng/helm/utils';

@Component({...})
export class MyComponent {
  isActive = input(false);
  constructor() {
    classes(() => [
      'flex items-center',
      this.isActive() ? 'bg-primary' : 'bg-muted',
    ]);
  }
}
```

**Correct (hlm() — for inline class merging):**

```typescript
import { hlm } from '@spartan-ng/helm/utils';

const cls = hlm('flex items-center', variant === 'outline' ? 'border' : '');
```

---

## No `space-x-*` / `space-y-*`

Use `gap-*` instead.

**Incorrect:**

```html
<div class="space-y-4">
  <input hlmInput />
  <input hlmInput />
</div>
```

**Correct:**

```html
<div class="flex flex-col gap-4">
  <input hlmInput />
  <input hlmInput />
</div>
```

---

## `size-*` for equal dimensions

**Incorrect:**

```html
<brn-avatar hlmAvatar class="w-10 h-10">
```

**Correct:**

```html
<brn-avatar hlmAvatar class="size-10">
```

---

## No manual `dark:` color overrides

Use semantic tokens — they handle light/dark via CSS variables.

**Incorrect:** `bg-white dark:bg-gray-950`

**Correct:** `bg-background text-foreground`

---

## No manual `z-index` on overlay components

Dialog, Sheet, AlertDialog, DropdownMenu, Popover, Tooltip, HoverCard handle their own stacking. Never add `z-50` or `z-[999]`.
