import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { form, FormField, min, required } from '@angular/forms/signals';
import {
  DistrictList,
  MATCHING_STARS,
  PROFILE_STATUS,
  StateList,
  zodiacSignList,
} from '../../constant/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { KeyValuePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

export interface ProfileDetail {
  name: string;
  mobileNumber: string;
  zodiacSign: keyof typeof zodiacSignList;
  star: keyof typeof MATCHING_STARS;
  age: number;
  starMatchScore: (typeof MATCHING_STARS)[keyof typeof MATCHING_STARS];
  state: string;
  city: string;
  profileStatusId: keyof typeof PROFILE_STATUS;
  matrimonyId: string;
}

@Component({
  selector: 'app-add-profile-signal-form',
  imports: [
    FormField,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    KeyValuePipe,
  ],
  templateUrl: './add-profile-signal-form.html',
  styleUrl: './add-profile-signal-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddProfileSignalForm {
  public readonly id = input<string | null>();
  public readonly action = input<string | null>();
  public readonly returnUrl = input<string | null>();
  profileDetailModel = signal<ProfileDetail>({
    name: '',
    mobileNumber: '+91',
    zodiacSign: 'aquarius',
    star: 'Aswini',
    age: 1,
    starMatchScore: 8,
    state: '',
    city: '',
    profileStatusId: 'NEW',
    matrimonyId: '',
  });
  profileDetailForm = form(this.profileDetailModel, (profileForm) => {
    required(profileForm.name, { message: 'Name is required' });
    required(profileForm.mobileNumber, { message: 'Mobile number is required' });
    required(profileForm.zodiacSign, { message: 'Zodiac sign is required' });
    required(profileForm.star, { message: 'Star is required' });
    required(profileForm.age, { message: 'Age is required' });
    required(profileForm.starMatchScore, { message: 'Star match score is required' });
    required(profileForm.state, { message: 'State is required' });
    required(profileForm.city, { message: 'City is required' });
    required(profileForm.profileStatusId, { message: 'Profile status is required' });
    required(profileForm.matrimonyId, { message: 'Matrimony ID is required' });
    min(profileForm.age, 18, { message: 'Age must be greater than 18' });
  });
  isPageLoading = signal(false);
  PROFILE_STATUS_DATA = PROFILE_STATUS;
  ZODIAC_SIGN_DATA = zodiacSignList;
  STARS_DATA = MATCHING_STARS;
  STATE_LIST = StateList;
  isSaving = signal(false);
  public readonly title = computed(() => {
    switch (this.action()) {
      case 'view':
        return 'View Profile';
      case 'edit':
        return 'Edit Profile';
      default:
        return 'Add New Profile';
    }
  });

  selectedStateDistrictList = computed(() => {
    const state = this.profileDetailForm().value().state;
    return state ? DistrictList[state as keyof typeof DistrictList] : [];
  });

  private readonly router = inject(Router);

  onCancel() {
    // this.router.navigate([this.returnUrl()]);
    const asdas = this.profileDetailForm.age;
    const asdasq = this.profileDetailForm.name;
    const tead = this.profileDetailForm.age().errors;
    const test = tead();
    console.log(test.at(0)?.message);

    // console.log(this.profileDetailForm().errorSummary());
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log(this.profileDetailForm());
    // this.profileDetailForm().value().state;
  }

  onStateChange() {
    // this.profileDetailModel.set({
    //   ...this.profileDetailModel(),
    //   city: '',
    // });
  }
}
