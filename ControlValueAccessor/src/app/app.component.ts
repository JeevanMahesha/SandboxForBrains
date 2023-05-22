import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IUserForm } from './app.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'ControlValueAccessor';
  userForm: FormGroup<IUserForm>;
  constructor(private _fb: FormBuilder) {
    this.userForm = this._fb.group({
      email: this._fb.control<null | string>('jeevan'),
      userName: this._fb.control<null | string>(null),
    });
  }

  saveUser() {
    console.log(this.userForm.value);
  }
}
