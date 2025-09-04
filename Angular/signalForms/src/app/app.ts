import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Control, disabled, form, required, validateHttp } from '@angular/forms/signals';

interface signalForms {
  requiredField: string;
  optionalField: string;
  defaultValueField: string;
  disabledField: string;
  asyncValidatorField: string | null;
}

@Component({
  selector: 'app-root',
  imports: [Control, JsonPipe, NgTemplateOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('signalForms');

  public signalForm = form<signalForms>(
    signal({
      asyncValidatorField: null,
      disabledField: '',
      defaultValueField: 'CUSTOM DEFAULT VALUE',
      optionalField: '',
      requiredField: '',
    }),
    (currentControl) => {
      required(currentControl.requiredField);
      disabled(currentControl.disabledField, () => 'Reason for disabling this field');
      validateHttp(currentControl.asyncValidatorField, {
        request: ({ value }) => `https://dummyjson.com/users/search?q=${value()}`,
        errors: (result) => {
          const apiResult = result as unknown as { users: unknown[] };
          return !apiResult.users.length ? [{ kind: 'notUnique' }] : undefined;
        },
      });
    }
  );

  printFormValues() {
    console.log(this.signalForm());
  }
}
