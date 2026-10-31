import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
  afterNextRender,
  Injector,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormRoot } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideCheck,
  lucidePlus,
  lucideTrash2,
} from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { NOT_SPECIFIED_LABEL } from '../../constant/common.const';
import { Comment, ProfileDetail } from '../../models/profile.model';
import { ProfilesService } from '../../services/profiles.service';
import { createProfileForm } from '../profile/profile-form';
import {
  FieldGroup,
  ProfileFormFieldsComponent,
} from '../profile/profile-form-fields/profile-form-fields';
import { ProfileAvatar } from '../shared/profile-avatar/profile-avatar';
import { ScoreRing } from '../shared/score-ring/score-ring';

interface WizardStep {
  readonly title: string;
  readonly hint: string;
  readonly groups: readonly FieldGroup[];
}

const STEPS: readonly WizardStep[] = [
  { title: 'Contact', hint: 'Name, phone, ID', groups: ['contact'] },
  { title: 'Horoscope', hint: 'Zodiac, star, age', groups: ['astro', 'age'] },
  { title: 'Location & notes', hint: 'State, city, comments', groups: ['place'] },
];

@Component({
  selector: 'app-profile-wizard',
  imports: [
    FormRoot,
    FormsModule,
    DatePipe,
    RouterLink,
    ProfileAvatar,
    ScoreRing,
    HlmBadge,
    HlmButton,
    HlmInput,
    HlmSpinner,
    ...HlmFieldImports,
    ...HlmIconImports,
    ProfileFormFieldsComponent,
  ],
  templateUrl: './profile-wizard.html',
  providers: [
    provideIcons({ lucideArrowLeft, lucideArrowRight, lucideCheck, lucidePlus, lucideTrash2 }),
  ],
})
export default class ProfileWizard {
  private readonly profileService = inject(ProfilesService);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  readonly steps = STEPS;
  readonly NOT_SPECIFIED = NOT_SPECIFIED_LABEL;
  readonly stepIndex = signal(0);
  readonly step = computed(() => STEPS[this.stepIndex()]);
  readonly isLastStep = computed(() => this.stepIndex() === STEPS.length - 1);
  readonly progressWidth = computed(() => ['w-1/3', 'w-2/3', 'w-full'][this.stepIndex()]);

  private readonly stepHeading = viewChild<ElementRef<HTMLElement>>('stepHeading');

  private readonly shared = createProfileForm({ save: (data) => this.addProfile(data) });
  readonly profileDetailForm = this.shared.profileDetailForm;
  readonly newComment = this.shared.newComment;
  readonly profileStatusLabel = this.shared.profileStatusLabel;
  readonly profileStatusColor = this.shared.profileStatusColor;
  readonly zodiacLabel = this.shared.zodiacLabel;
  readonly starLabel = this.shared.starLabel;
  readonly locationLabel = this.shared.locationLabel;
  readonly name = computed(() => this.profileDetailForm.name().value());
  readonly mobileNumber = computed(() => {
    const value = this.profileDetailForm.mobileNumber().value().trim();
    // The "+91" prefix alone is the untouched default, not a typed number.
    return value === '+91' ? '' : value;
  });

  /** Fields whose validity gates leaving each step. */
  private stepFields(index: number) {
    const f = this.profileDetailForm;
    switch (index) {
      case 0:
        return [f.name, f.mobileNumber, f.matrimonyId, f.profileStatusId];
      case 1:
        return [f.zodiacSign, f.star, f.starMatchScore, f.age];
      default:
        return [f.state, f.city];
    }
  }

  private stepValid(index: number): boolean {
    const fields = this.stepFields(index);
    fields.forEach((field) => field().markAsTouched());
    return fields.every((field) => field().valid() || field().disabled());
  }

  next(): void {
    if (this.isLastStep() || !this.stepValid(this.stepIndex())) return;
    this.setStep(this.stepIndex() + 1);
  }

  back(): void {
    if (this.stepIndex() > 0) this.setStep(this.stepIndex() - 1);
  }

  /** Rail navigation: backwards is free, forwards needs every step in between to be valid. */
  goTo(target: number): void {
    if (target <= this.stepIndex()) {
      this.setStep(target);
      return;
    }
    for (let i = this.stepIndex(); i < target; i++) {
      if (!this.stepValid(i)) {
        this.setStep(i);
        return;
      }
    }
    this.setStep(target);
  }

  private setStep(index: number): void {
    if (index === this.stepIndex()) return;
    this.stepIndex.set(index);
    // Move focus to the new step heading once it has rendered.
    afterNextRender(() => this.stepHeading()?.nativeElement.focus(), { injector: this.injector });
  }

  /** Enter in a text input advances the wizard instead of submitting a half-filled form. */
  onEnter(event: Event): void {
    if (this.isLastStep() || !(event.target instanceof HTMLInputElement)) return;
    event.preventDefault();
    this.next();
  }

  addComment(): void {
    this.shared.addComment();
  }

  deleteComment(comment: Comment): void {
    this.shared.deleteComment(comment);
  }

  private async addProfile(profileData: Partial<ProfileDetail>): Promise<void> {
    return await this.profileService
      .addProfile(profileData)
      .then(() => {
        toast.success('Profile added successfully');
        this.profileService.refreshProfiles();
        void this.router.navigate(['/']);
      })
      .catch(() => {
        toast.error('Failed to add profile');
      });
  }
}
