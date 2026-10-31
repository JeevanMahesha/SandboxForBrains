import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
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
import { toCanonicalMobileNumber } from '../../utils/mobile-number.util';
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

/**
 * Every field that must be filled to create a profile gets a red asterisk after its label. The
 * ids match the shared fields component; the star is optional so it is deliberately absent.
 */
const REQUIRED_MARKS =
  "[&_:is(label[for=name],label[for=mobile],label[for=matrimony],label[for^=profile],label[for^=zodiac],label[for=age],label[for=state],label[for=city])]:after:content-['_*'] [&_:is(label[for=name],label[for=mobile],label[for=matrimony],label[for^=profile],label[for^=zodiac],label[for=age],label[for=state],label[for=city])]:after:text-destructive";

/** The star select stays disabled until a zodiac sign is chosen; say so right under it. */
const STAR_HELPER =
  "[&_[data-slot=field]:has(hlm-select[id^=star]_[role=combobox]:disabled)]:after:content-['Choose_a_zodiac_sign_first'] [&_[data-slot=field]:has(hlm-select[id^=star]_[role=combobox]:disabled)]:after:text-sm [&_[data-slot=field]:has(hlm-select[id^=star]_[role=combobox]:disabled)]:after:text-muted-foreground";

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
    NgTemplateOutlet,
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
  host: { '(window:beforeunload)': 'onBeforeUnload($event)' },
})
export default class ProfileWizard {
  private readonly profileService = inject(ProfilesService);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  readonly steps = STEPS;
  readonly formClass = `glass-strong flex min-w-0 flex-col gap-5 rounded-3xl p-5 md:p-7 ${REQUIRED_MARKS} ${STAR_HELPER}`;
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
    if (value === '+91') return '';
    // Show a complete number the way the list does (+91XXXXXXXXXX); partial input stays as typed.
    return toCanonicalMobileNumber(value) ?? value;
  });

  /** Set once the profile is saved so the post-save navigation is never treated as discarding. */
  private saved = false;

  /** True when something was typed or chosen (the untouched "+91" prefix does not count). */
  private readonly isDirty = computed(() => {
    const f = this.profileDetailForm;
    const mobile = f.mobileNumber().value().trim();
    return !!(
      f.name().value() ||
      f.matrimonyId().value() ||
      (mobile && mobile !== '+91') ||
      f.profileStatusId().value() ||
      f.zodiacSign().value() ||
      f.star().value() ||
      f.age().value() !== null ||
      f.state().value() ||
      f.city().value() ||
      f.comments().value().length ||
      this.newComment().trim()
    );
  });

  /** Used by the discard guard and the beforeunload prompt. */
  hasUnsavedInput(): boolean {
    return !this.saved && this.isDirty();
  }

  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.hasUnsavedInput()) event.preventDefault();
  }

  /** Gap between the layout viewport bottom and the on-screen keyboard, so the bar rides above it. */
  private readonly actionBar = viewChild<ElementRef<HTMLElement>>('actionBar');

  constructor() {
    afterNextRender(() => {
      const viewport = window.visualViewport;
      if (!viewport) return;
      const update = () => {
        const inset =
          viewport.scale > 1.01
            ? 0
            : Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
        const bar = this.actionBar()?.nativeElement;
        if (bar) bar.style.bottom = `${Math.round(inset)}px`;
      };
      viewport.addEventListener('resize', update);
      viewport.addEventListener('scroll', update);
      this.destroyRef.onDestroy(() => {
        viewport.removeEventListener('resize', update);
        viewport.removeEventListener('scroll', update);
      });
    });
  }

  /**
   * Per-step "n of m required fields done", derived from the same field states the validators
   * use. The star match score is derived from the star (never typed), so it is not counted.
   */
  readonly stepProgress = computed(() =>
    STEPS.map((_, index) => {
      const f = this.profileDetailForm;
      const required = this.stepFields(index).filter(
        (field) => field !== f.starMatchScore && field().required(),
      );
      const done = required.filter((field) => {
        const value: unknown = field().value();
        if (field === f.mobileNumber) return toCanonicalMobileNumber(String(value)) !== null;
        return field().valid() && value !== null && value !== undefined && value !== '';
      }).length;
      return { done, total: required.length, complete: done === required.length };
    }),
  );

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
        this.saved = true;
        toast.success('Profile added successfully');
        this.profileService.refreshProfiles();
        void this.router.navigate(['/']);
      })
      .catch(() => {
        toast.error('Failed to add profile');
      });
  }
}
