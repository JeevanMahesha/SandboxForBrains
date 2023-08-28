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
      email: this._fb.control<null | string>({
        value: 'jeevan',
        disabled: true,
      }),
      userName: this._fb.control<null | string>(null),
    });
  }

  saveUser() {
    /*
    this is for reactive form
    */
    // console.log(this.userForm.value);
    // ==================================================== //
    /*
    this is for ngmodel
    */
    // console.log(this.title);
  }
}
