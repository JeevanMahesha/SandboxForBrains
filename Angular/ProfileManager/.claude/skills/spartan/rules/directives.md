# Angular Directive Patterns

## Contents

- Signals for reactive state
- Standalone is default (Angular 19+)
- New control flow syntax
- `inject()` for dependency injection
- Import organization
- OnPush change detection

---

## Use signals for reactive state

**Incorrect:**

```typescript
@Component({...})
export class MyComponent {
  @Input() name: string = '';
  @Output() nameChange = new EventEmitter<string>();
  isOpen = false;
}
```

**Correct:**

```typescript
@Component({...})
export class MyComponent {
  name = input<string>('');
  nameChange = output<string>();
  isOpen = signal(false);

  displayName = computed(() => this.name().toUpperCase());
}
```

Also available: `linkedSignal()` for writable derived signals, and `model()` for two-way binding signals.

---

## Standalone is default (Angular 19+)

Do not write `standalone: true` — it's the default.

**Incorrect:**

```typescript
@NgModule({
  declarations: [MyComponent],
  imports: [HlmButtonModule],
})
export class MyModule {}

// Also incorrect — redundant
@Component({ standalone: true, ... })
```

**Correct:**

```typescript
@Component({
  imports: [HlmButtonDirective, BrnDialogComponent],
  template: `...`,
})
export class MyComponent {}
```

---

## Use new control flow syntax

**Incorrect:**

```html
<div *ngIf="isOpen">Content</div>
<div *ngFor="let item of items">{{ item.name }}</div>
<div [ngSwitch]="status">
  <span *ngSwitchCase="'active'">Active</span>
</div>
```

**Correct:**

```html
@if (isOpen()) {
  <div>Content</div>
}

@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <hlm-empty>
    <p>No items found.</p>
  </hlm-empty>
}

@switch (status()) {
  @case ('active') { <span hlmBadge>Active</span> }
  @case ('inactive') { <span hlmBadge variant="secondary">Inactive</span> }
}
```

---

## Use `inject()` for dependency injection

**Incorrect:**

```typescript
export class MyComponent {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {}
}
```

**Correct:**

```typescript
export class MyComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);
}
```

---

## Import organization

```typescript
// 1. Angular core
import { Component, inject, signal, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// 2. Spartan Brain
import { BrnDialogComponent, BrnDialogTriggerDirective } from '@spartan-ng/brain/dialog';
import { BrnSelectComponent } from '@spartan-ng/brain/select';

// 3. Spartan Helm
import { HlmDialogContentComponent, HlmDialogHeaderComponent } from '@spartan-ng/helm/dialog';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

// 4. Spartan utils
import { hlm, classes } from '@spartan-ng/helm/utils';

// 5. Icons
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideSearch } from '@ng-icons/lucide';
```

---

## OnPush change detection

All Spartan components use OnPush. Your components should too.

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButtonDirective],
  template: `<button hlmBtn>Click</button>`,
})
export class MyComponent {}
```

This works seamlessly with signals — `input()`, `signal()`, `computed()` all trigger OnPush change detection automatically.
