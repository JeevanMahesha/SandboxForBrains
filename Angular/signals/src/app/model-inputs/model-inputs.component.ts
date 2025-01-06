import { Component, signal } from '@angular/core';
import { CustomToggleComponent } from './custom-toggle.component';

@Component({
    selector: 'app-model-inputs',
    imports: [CustomToggleComponent],
    templateUrl: './model-inputs.component.html',
    styleUrl: './model-inputs.component.css'
})
export class ModelInputsComponent {
  isToggled = signal(true);
  isDisabled = false;

  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
  }
}
