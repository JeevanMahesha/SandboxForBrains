import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'custom-toggle',
    template: `
    <div class="p-3">
      <h6>Custom Toggle Component</h6>
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckDefault"
          [(ngModel)]="checked"
          [disabled]="disabled()"
        />
        <label class="form-check-label" for="flexSwitchCheckDefault"
          >Custom Toggle
        </label>
      </div>
    </div>
  `,
    imports: [FormsModule]
})
export class CustomToggleComponent {
  // `checked` is a model input, allowing two-way binding
  checked = model(false);

  // `disabled` is a read-only input
  disabled = input(false);

  toggle() {
    if (!this.disabled()) {
      // Toggle the checked state if not disabled
      this.checked.set(!this.checked());
    }
  }
}
