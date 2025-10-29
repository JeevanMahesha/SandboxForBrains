import { FormControl } from '@angular/forms';
import { MATCHING_STARS, PROFILE_STATUS, zodiacSignList } from '../../constant/common';

export interface ProfileForm {
  name: FormControl<string | null>;
  mobileNumber: FormControl<string | null>;
  zodiacSign: FormControl<keyof typeof zodiacSignList | null>;
  star: FormControl<keyof typeof MATCHING_STARS | null>;
  age: FormControl<number | null>;
  starMatchScore: FormControl<(typeof MATCHING_STARS)[keyof typeof MATCHING_STARS] | null>;
  state: FormControl<string | null>;
  city: FormControl<string | null>;
  profileStatusId: FormControl<keyof typeof PROFILE_STATUS | null>;
  matrimonyId: FormControl<string | null>;
}
