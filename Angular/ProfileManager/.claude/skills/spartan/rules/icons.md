# Icons

**Always use the project's configured icon library.** Check `@ng-icons/*` packages in the project's `package.json`. Common: `@ng-icons/lucide`, `@ng-icons/heroicons`, `@ng-icons/tabler-icons`.

---

## Use ng-icon with hlm directive

**Incorrect:**

```html
<!-- Don't use raw SVG or icon fonts -->
<svg viewBox="0 0 24 24"><path d="M12..."/></svg>
<i class="fa fa-check"></i>
```

**Correct:**

```html
<ng-icon hlm name="lucideCheck" size="sm" />
```

Import using the convenience array:

```typescript
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideSearch } from '@ng-icons/lucide';

@Component({
  imports: [...HlmIconImports],
  providers: [provideIcons({ lucideCheck, lucideSearch })],
})
```

---

## No manual sizing on icons inside Spartan components

Spartan components handle icon sizing via CSS.

**Incorrect:**

```html
<button hlmBtn>
  <ng-icon hlm name="lucideSearch" class="w-4 h-4 mr-2" />
  Search
</button>
```

**Correct:**

```html
<button hlmBtn>
  <ng-icon hlm name="lucideSearch" size="sm" />
  Search
</button>
```

The `size` input on `hlm` directive handles sizing: `xs`, `sm`, `base`, `lg`, `xl`.

---

## Pass icons as component references, not strings

When building reusable components that accept icons:

**Incorrect:**

```typescript
// String-based lookup
@Component({...})
export class StatusBadge {
  icon = input<string>('');
}
```

**Correct:**

```typescript
// Type-safe icon component
@Component({
  template: `
    <span hlmBadge>
      <ng-icon hlm [name]="icon()" size="sm" />
      <ng-content />
    </span>
  `
})
export class StatusBadge {
  icon = input.required<string>();
}
```
