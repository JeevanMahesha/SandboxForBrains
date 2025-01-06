import { FormControl } from '@angular/forms';

export interface IUserForm {
  userName: FormControl<null | string>;
  email: FormControl<null | string>;
}
