import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface IUserForm {
  userName: FormControl<string | null>;
  address: FormArray<FormGroup<IAddressForm>>;
}

export interface IAddressForm {
  state: FormControl<string | null>;
  country: FormControl<string | null>;
}
