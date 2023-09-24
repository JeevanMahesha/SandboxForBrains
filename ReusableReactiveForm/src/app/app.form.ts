import { FormControl, FormGroup } from '@angular/forms';

export interface IUserForm {
  userName: FormControl<string | null>;
  address: FormGroup<IAddressForm>;
}

interface IAddressForm {
  state: FormControl<string | null>;
  country: FormControl<string | null>;
}
