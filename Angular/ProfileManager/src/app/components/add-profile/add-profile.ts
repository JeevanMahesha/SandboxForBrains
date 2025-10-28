import { Component, computed, effect, inject, input, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import {
  PROFILE_STATUS,
  zodiacSignList,
  StateList,
  DistrictList,
  MATCHING_STARS,
} from '../../constant/common';
import { ProfileForm } from './add-profile.forms';
import { map, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProfilesService } from '../../services/profiles.service';
import { Profile } from '../../models/profile';

@Component({
  selector: 'app-add-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-profile.html',
  styleUrl: './add-profile.css',
})
export default class AddProfileComponent {
  public readonly id = input<string | null>();
  public readonly action = input<string | null>();
  profileForm: FormGroup<ProfileForm>;
  comments = signal<string[]>([]);
  newComment = signal<string>('');
  isLoading = signal<boolean>(false);
  zodiacSigns = Object.entries(zodiacSignList).map(([key, value]) => ({
    value: key,
    label: value.tanglish,
  }));
  stars = Object.keys(MATCHING_STARS);
  profileStatuses = Object.entries(PROFILE_STATUS).map(([key, value]) => ({
    value: key,
    label: value,
  }));
  states = [...StateList];
  cities: Signal<string[]>;
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
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly profilesService = inject(ProfilesService);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    this.profileForm = this.formBuilder.group<ProfileForm>({
      name: new FormControl<string | null>(null, [Validators.required, Validators.minLength(2)]),
      mobileNumber: new FormControl<string | null>('+91', [
        Validators.required,
        Validators.pattern(/^\+91[0-9]{10}$/),
      ]),
      zodiacSign: new FormControl<keyof typeof zodiacSignList | null>(null, Validators.required),
      star: new FormControl<keyof typeof MATCHING_STARS | null>(null, Validators.required),
      age: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(18),
        Validators.max(30),
      ]),
      starMatchScore: new FormControl<(typeof MATCHING_STARS)[keyof typeof MATCHING_STARS] | null>(
        null,
        [Validators.required, Validators.min(0), Validators.max(10)]
      ),
      state: new FormControl<string | null>(null, Validators.required),
      city: new FormControl<string | null>(null, Validators.required),
      profileStatusId: new FormControl<keyof typeof PROFILE_STATUS | null>(
        'NEW',
        Validators.required
      ),
      matrimonyId: new FormControl<string | null>(null, Validators.required),
    });

    this.cities = toSignal(
      this.profileForm.controls.state.valueChanges.pipe(
        map(
          (state) =>
            (state && state in DistrictList
              ? DistrictList[state as keyof typeof DistrictList]
              : []) as string[]
        )
      ),
      { initialValue: [] as string[] }
    );

    const starEvent = toSignal(this.profileForm.controls.star.valueChanges);

    effect(() => {
      const star = starEvent();
      if (star && star in MATCHING_STARS) {
        this.profileForm.controls.starMatchScore.setValue(
          MATCHING_STARS[star as keyof typeof MATCHING_STARS],
          { emitEvent: false }
        );
      }
    });
  }

  ngOnInit() {
    const selectedId = this.id();
    const selectedAction = this.action();
    if (!selectedAction) {
      this.snackBar.open('Invalid request', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
      this.router.navigate(['/']);
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
      }
      this.profilesService.getProfileById(selectedId as string).subscribe((profile) => {
        if (profile) {
          this.profileForm.patchValue(profile);
          this.comments.set(profile.comments);
          this.profileForm.disable();
        }
      });
    }
    if (selectedAction === 'edit') {
      if (!selectedId) {
        this.snackBar.open('Invalid request', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      }
      this.profilesService.getProfileById(selectedId as string).subscribe((profile) => {
        if (profile) {
          this.profileForm.patchValue(profile);
          this.comments.set(profile.comments);
        }
      });
    }
  }

  onStateChange(event: MatSelectChange) {
    this.profileForm.controls.city.reset(null);
  }

  addComment() {
    const comment = this.newComment().trim();
    if (comment) {
      this.comments.update((prev) => [...prev, comment]);
      this.newComment.set('');
    }
  }

  removeComment(index: number) {
    this.comments.update((prev) => prev.filter((_, i) => i !== index));
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading.set(true);

      const profileData = {
        name: this.profileForm.value.name,
        mobileNumber: this.profileForm.value.mobileNumber,
        zodiacSign: this.profileForm.value.zodiacSign,
        star: this.profileForm.value.star,
        age: this.profileForm.value.age,
        starMatchScore: this.profileForm.value.starMatchScore,
        state: this.profileForm.value.state!,
        city: this.profileForm.value.city!,
        profileStatusId: this.profileForm.value.profileStatusId,
        matrimonyId: this.profileForm.value.matrimonyId!,
        comments: this.comments(),
      };
      switch (this.action()) {
        case 'add':
          this.addProfile(profileData as Partial<Profile>);
          break;
        case 'edit':
          this.updateProfile(profileData as Partial<Profile>);
          break;
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.profileForm.controls).forEach((key) => {
        this.profileForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  getErrorMessage(controlName: keyof ProfileForm): string {
    const control = this.profileForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength}`;
    }
    if (control?.hasError('pattern')) {
      return 'Invalid format (e.g., +919876543210)';
    }
    if (control?.hasError('min')) {
      return `Minimum value is ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `Maximum value is ${control.errors?.['max'].max}`;
    }
    return '';
  }

  private addProfile(profileData: Partial<Profile>) {
    this.profilesService.addProfile(profileData).subscribe({
      next: (id) => {
        this.isLoading.set(false);
        this.snackBar.open('Profile added successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
        console.log('Profile saved with ID:', id);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading.set(false);
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
        this.isLoading.set(false);
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
        console.log('Profile updated successfully!');
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading.set(false);
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
