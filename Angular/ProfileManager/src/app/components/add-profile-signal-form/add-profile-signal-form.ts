import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { form, FormField, min, pattern, readonly, required } from '@angular/forms/signals';
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
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Comment, Profile } from '../../models/profile';

export interface ProfileDetail {
  name: string;
  mobileNumber: string;
  zodiacSign: keyof typeof zodiacSignList;
  star: keyof typeof MATCHING_STARS;
  age: number;
  starMatchScore: (typeof MATCHING_STARS)[keyof typeof MATCHING_STARS] | 0;
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
    MatButtonModule,
    MatTooltipModule,
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
    name: 'Test Name',
    mobileNumber: '+919876543210',
    zodiacSign: 'aquarius',
    star: 'Aswini',
    age: 25,
    starMatchScore: 8,
    state: 'Tamil Nadu',
    city: 'Chennai',
    profileStatusId: 'NEW',
    matrimonyId: '1234567890',
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
    pattern(profileForm.mobileNumber, /^\+91[0-9]{10}$/, {
      message: 'Invalid mobile number (e.g., +919876543210)',
    });
    readonly(profileForm.starMatchScore);
  });
  commentValueState = signal<boolean>(false);
  copyState = signal<Record<string, { icon: string; tooltip: string }>>({});
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
    if (this.profileDetailForm().valid()) {
      this.isSaving.set(true);

      const profileData = {
        name: this.profileDetailForm.name().value(),
        mobileNumber: this.profileDetailForm.mobileNumber().value(),
        zodiacSign: this.profileDetailForm.zodiacSign().value(),
        star: this.profileDetailForm.star().value(),
        age: this.profileDetailForm.age().value(),
        starMatchScore: this.profileDetailForm.starMatchScore().value(),
        state: this.profileDetailForm.state().value(),
        city: this.profileDetailForm.city().value(),
        profileStatusId: this.profileDetailForm.profileStatusId().value(),
        matrimonyId: this.profileDetailForm.matrimonyId().value(),
        comments: this.profileDetailForm.comments().value(),
      };
      switch (this.action()) {
        case 'add':
          this.addProfile(profileData as unknown as Partial<Profile>);
          break;
        case 'edit':
          this.updateProfile(profileData as unknown as Partial<Profile>);
          break;
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.profileDetailForm().markAsTouched();
    }
  }

  onStateChange() {
    this.profileDetailForm.city().reset('');
  }

  copyField(field: string, value: string | null | undefined, label: string): void {
    if (!value) return;

    navigator.clipboard.writeText(value).then(
      () => {
        // Update state for this field
        this.copyState.update((state) => ({
          ...state,
          [field]: { icon: 'check', tooltip: 'Copied!' },
        }));

        this.snackBar.open(`${label} copied to clipboard!`, 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });

        // Reset after 1.5s
        setTimeout(() => {
          this.copyState.update((state) => {
            const newState = { ...state };
            delete newState[field];
            return newState;
          });
        }, 1500);
      },
      () => {
        this.snackBar.open(`Failed to copy ${label.toLowerCase()}`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    );
  }

  getCopyTooltip(field: string): string {
    const labels: Record<string, string> = {
      mobileNumber: 'Copy mobile number',
      matrimonyId: 'Copy Matrimony ID',
    };
    return this.copyState()[field]?.tooltip ?? labels[field] ?? 'Copy';
  }

  getCopyIcon(field: string): string {
    return this.copyState()[field]?.icon ?? 'content_copy';
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
        }
        this.isPageLoading.set(false);
      });
    } else {
      // For 'add' action, no data to fetch
      this.isPageLoading.set(false);
    }
  }

  private addProfile(profileData: Partial<Profile>) {
    this.profilesService.addProfile(profileData).subscribe({
      next: (id) => {
        this.isSaving.set(false);
        this.snackBar.open('Profile added successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
        this.navigateBack();
      },
      error: (error) => {
        this.isSaving.set(false);
        console.error('Error saving profile:', error);
        this.snackBar.open('Error adding profile. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  private updateProfile(profileData: Partial<Profile>) {
    this.profilesService.updateProfile(this.id() as string, profileData).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
        this.navigateBack();
      },
      error: (error) => {
        this.isSaving.set(false);
        console.error('Error updating profile:', error);
        this.snackBar.open('Error updating profile. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
