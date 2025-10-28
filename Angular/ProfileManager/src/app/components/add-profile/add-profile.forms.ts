import { FormControl } from '@angular/forms';
import { matchingStars, PROFILE_STATUS, zodiacSignList } from '../../constant/common';

export interface ProfileForm {
  name: FormControl<string | null>;
  mobileNumber: FormControl<string | null>;
  zodiacSign: FormControl<keyof typeof zodiacSignList | null>;
  star: FormControl<keyof typeof matchingStars | null>;
  age: FormControl<number | null>;
  starMatchScore: FormControl<(typeof matchingStars)[keyof typeof matchingStars] | null>;
  state: FormControl<string | null>;
  city: FormControl<string | null>;
  profileStatusId: FormControl<keyof typeof PROFILE_STATUS | null>;
  matrimonyId: FormControl<string | null>;
}
