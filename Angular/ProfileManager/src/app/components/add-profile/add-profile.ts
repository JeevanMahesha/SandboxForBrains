import { Component, effect, inject, Signal, signal } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import {
  matchingStars,
  PROFILE_STATUS,
  zodiacSignList,
  StateList,
  DistrictList,
} from '../../constant/common';
import { ProfileForm } from './add-profile.forms';
import { map, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
  ],
  templateUrl: './add-profile.html',
  styleUrl: './add-profile.css',
})
export class AddProfileComponent {
  profileForm: FormGroup<ProfileForm>;
  comments = signal<string[]>([]);
  newComment = signal<string>('');
  zodiacSigns = Object.entries(zodiacSignList).map(([key, value]) => ({
    value: key,
    label: value.tanglish,
  }));
  stars = Object.keys(matchingStars);
  profileStatuses = Object.entries(PROFILE_STATUS).map(([key, value]) => ({
    value: key,
    label: value,
  }));
  states = [...StateList];
  cities: Signal<string[]>;
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  constructor() {
    this.profileForm = this.formBuilder.group<ProfileForm>({
      name: new FormControl<string | null>(null, [Validators.required, Validators.minLength(2)]),
      mobileNumber: new FormControl<string | null>('+91', [
        Validators.required,
        Validators.pattern(/^\+91[0-9]{10}$/),
      ]),
      zodiacSign: new FormControl<keyof typeof zodiacSignList | null>(null, Validators.required),
      star: new FormControl<keyof typeof matchingStars | null>(null, Validators.required),
      age: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(18),
        Validators.max(30),
      ]),
      starMatchScore: new FormControl<(typeof matchingStars)[keyof typeof matchingStars] | null>(
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
        tap(() => this.profileForm.controls.city.reset(null)),
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
      if (star && star in matchingStars) {
        this.profileForm.controls.starMatchScore.setValue(
          matchingStars[star as keyof typeof matchingStars],
          { emitEvent: false }
        );
      }
    });
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
      const profileData = {
        ...this.profileForm.value,
        comments: this.comments(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      console.log('Profile Data:', profileData);
      // TODO: Add service call to save profile
      // For now, just navigate back
      // this.router.navigate(['/']);
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
}
