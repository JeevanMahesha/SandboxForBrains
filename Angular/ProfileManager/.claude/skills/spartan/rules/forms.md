# Forms

## Contents

- HlmField system for form layout
- Angular Reactive Forms with Spartan
- Form control selection guide
- Validation states
- FieldSet for grouping related fields

---

## HlmField system for form layout

Spartan provides a complete form field system. Always use it instead of raw divs.

**Incorrect:**

```html
<label hlmLabel for="name">Name</label>
<input hlmInput id="name" formControlName="name" />
@if (form.controls.name.invalid && form.controls.name.touched) {
  <p class="text-destructive text-sm">Name is required.</p>
}
```

**Correct:**

```html
<div hlmField>
  <label hlmFieldLabel>Name</label>
  <input hlmInput formControlName="name" />
  <hlm-field-error validator="required">Name is required.</hlm-field-error>
</div>
```

### Full form example

```typescript
@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div hlmFieldGroup>
        <div hlmField>
          <label hlmFieldLabel>Name</label>
          <input hlmInput formControlName="name" />
          <hlm-field-error validator="required">Name is required.</hlm-field-error>
        </div>
        <div hlmField>
          <label hlmFieldLabel>Email</label>
          <input hlmInput formControlName="email" type="email" />
          <hlm-field-error validator="required">Email is required.</hlm-field-error>
          <hlm-field-error validator="email">Invalid email.</hlm-field-error>
        </div>
      </div>
      <button hlmBtn type="submit">Submit</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFormComponent {
  private readonly _fb = inject(FormBuilder);
  form = this._fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });
}
```

---

## Form control selection guide

| Need | Component |
|------|-----------|
| Text input | `hlmInput` on `<input>` |
| Multi-line text | `hlmTextarea` on `<textarea>` (**NOT** `hlmInput`) |
| Simple dropdown (no JS) | `hlmNativeSelect` on `<select>` |
| Rich dropdown | `brn-select` + `hlm-select-*` directives |
| Searchable dropdown | `brn-combobox` + `hlm-combobox-*` |
| Boolean toggle | `brn-switch` / `hlm-switch` (settings) or `brn-checkbox` (forms) |
| Single choice | `brn-radio-group` / `hlm-radio-group` |
| Range value | `brn-slider` / `hlm-slider` |
| Date | `brn-calendar` + `brn-popover` |
| OTP/verification | `brn-input-otp` / `hlm-input-otp` |

---

## FieldSet for grouping related fields

Use `HlmFieldSet` + `HlmFieldLegend` for related checkboxes, radios, or switches.

```html
<fieldset hlmFieldSet>
  <legend hlmFieldLegend>Preferences</legend>
  <p hlmFieldDescription>Select all that apply.</p>
  <div hlmFieldGroup class="gap-3">
    <div hlmField class="flex-row items-center gap-2">
      <brn-checkbox hlmCheckbox id="dark" formControlName="darkMode" />
      <label hlmFieldLabel for="dark" class="font-normal">Dark mode</label>
    </div>
  </div>
</fieldset>
```
