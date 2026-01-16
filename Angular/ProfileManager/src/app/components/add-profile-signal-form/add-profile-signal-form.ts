import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfilesService } from '../../services/profiles.service';
import { Comments } from './comments/comments';

export interface Comment {
  value: string;
  createDateAndTime: Date;
}

export interface ProfileDetail {
  name: string;
  mobileNumber: string;
  zodiacSign: keyof typeof zodiacSignList;
  star: keyof typeof MATCHING_STARS;
  age: number;
  starMatchScore: (typeof MATCHING_STARS)[keyof typeof MATCHING_STARS];
  state: keyof typeof DistrictList;
  city: string;
  profileStatusId: keyof typeof PROFILE_STATUS;
  matrimonyId: string;
  comments: Comment[];
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
    Comments,
  ],
  templateUrl: './add-profile-signal-form.html',
  styleUrl: './add-profile-signal-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddProfileSignalForm {
  public readonly id = input<string | null>();
  public readonly action = input<string | null>();
  public readonly returnUrl = input<string | null>();
  private readonly profileDetailModel = signal<ProfileDetail>({
    name: '',
    mobileNumber: '+91',
    zodiacSign: 'aquarius',
    star: 'Aswini',
    age: 0,
    starMatchScore: 8,
    state: 'Tamil Nadu',
    city: '',
    profileStatusId: 'NEW',
    matrimonyId: '',
    comments: [],
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
  isPageLoading = signal(true);
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

  selectedStateDistrictList = computed(() => DistrictList[this.profileDetailForm.state().value()]);

  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly profilesService = inject(ProfilesService);

  constructor() {
    effect(() => {
      this.handleRouteChange(this.id(), this.action());
    });
  }

  onCancel() {
    this.navigateBack();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log(this.profileDetailForm());
  }

  onStateChange() {
    this.profileDetailForm.city().reset('');
  }

  private navigateBack(): void {
    const url = this.returnUrl();
    if (url) {
      this.router.navigateByUrl(url);
    } else {
      this.router.navigate(['/']);
    }
  }

  private handleRouteChange(
    selectedId: string | null | undefined,
    selectedAction: string | null | undefined,
  ): void {
    // Reset form state first
    this.profileDetailForm().reset();
    // this.profileDetailForm().enable();
    // this.comments.set([]);

    if (!selectedAction) {
      this.snackBar.open('Invalid request', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
      this.router.navigate(['/']);
      return;
    }

    if (selectedAction === 'view') {
      if (!selectedId) {
        this.snackBar.open('Invalid request', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
        this.router.navigate(['/']);
        return;
      }
      this.profilesService.getProfileById(selectedId).subscribe((profile) => {
        if (profile) {
          this.profileDetailModel.set(profile);
          // this.comments.set(profile.comments);
        }
        this.isPageLoading.set(false);
      });
    } else if (selectedAction === 'edit') {
      if (!selectedId) {
        this.snackBar.open('Invalid request', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
        this.router.navigate(['/']);
        return;
      }
      this.profilesService.getProfileById(selectedId).subscribe((profile) => {
        if (profile) {
          this.profileDetailModel.set(profile);
          // this.comments.set(profile.comments);
        }
        this.isPageLoading.set(false);
      });
    } else {
      // For 'add' action, no data to fetch
      this.isPageLoading.set(false);
    }
  }
}
