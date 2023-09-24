import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IUserForm } from './app.form';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ReusableReactiveForm';
  userForm: FormGroup<IUserForm>;
  constructor() {
    this.userForm = new FormGroup({
      userName: new FormControl<string | null>(null),
      address: new FormGroup({
        country: new FormControl<string | null>(null),
        state: new FormControl<string | null>(null),
      }),
    });
  }

  submitForm() {
    console.log(this.userForm.value);
  }
}
