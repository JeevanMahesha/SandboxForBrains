import { Component, signal } from '@angular/core';
import {
  apply,
  Control,
  email,
  form,
  minLength,
  required,
  schema,
  validate,
} from '@angular/forms/signals';

interface UserDetail {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const passwordSchema = schema<Pick<UserDetail, 'confirmPassword' | 'password'>>((filedPath) => {
  minLength(filedPath.password, 8, {
    message: 'Password must be at least 8 characters long',
  });
  validate(filedPath.confirmPassword, ({ valueOf, value }): any => {
    if (valueOf(filedPath.password) !== value()) {
      return {
        kind: 'password-match',
        message: 'Password is not match',
      };
    } else {
      return undefined;
    }
  });
});

@Component({
  selector: 'app-root',
  imports: [Control],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ngIndiaSignalForms');
  protected userDetail = signal<UserDetail>({
    firstName: 'John',
    lastName: 'Doe',
    userName: 'john.doe',
    email: 'john.doe@examplecom',
    password: 'password',
    confirmPassword: 'password',
  });
  protected userDetailForm = form(this.userDetail, (formState) => {
    required(formState.firstName),
      required(formState.lastName),
      required(formState.userName),
      required(formState.email),
      required(formState.password),
      required(formState.confirmPassword),
      apply(formState, passwordSchema);
    email(formState.email, {
      message: 'Invalid email address',
    });
  });

  public onSubmit() {
    console.log(this.userDetailForm.password().errors());
    console.log(this.userDetailForm.confirmPassword().errors());
    console.log(this.userDetailForm.email().errors());
  }
}
