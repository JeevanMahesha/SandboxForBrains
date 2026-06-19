import { DatePipe, KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  disabled,
  form,
  FormField,
  FormRoot,
  min,
  pattern,
  readonly,
  required,
} from '@angular/forms/signals';
import { Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy, lucidePlus, lucideTrash2 } from '@ng-icons/lucide';
import { BrnSheetContent } from '@spartan-ng/brain/sheet';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import {
  DISTRICT_LIST,
  MATCHING_STARS,
  PROFILE_STATUS,
  STATE_LIST,
  ZODIAC_SIGN_LIST,
} from '../../constant/common.const';
import { Comment, ProfileDetail } from '../../models/profile.model';
import { ToolbarAction } from '../../models/toolbar.model';
import { ProfilesService } from '../../services/profiles.service';

@Component({
  selector: 'app-profile',
  imports: [
    FormField,
    FormRoot,
    FormsModule,
    KeyValuePipe,
    DatePipe,
    NgTemplateOutlet,
    BrnSheetContent,
    HlmButton,
    HlmInput,
    ...HlmSheetImports,
    ...HlmFieldImports,
    ...HlmSelectImports,
    ...HlmIconImports,
  ],
  templateUrl: './profile.html',
  providers: [provideIcons({ lucideCopy, lucidePlus, lucideTrash2, lucideCheck })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  readonly actionType = input.required<ToolbarAction | undefined>();
  readonly openDrawer = model<boolean | undefined>();
  readonly selectedProfileId = input.required<string | undefined>();
  readonly title = computed(() => {
    switch (this.actionType()) {
      case 'view':
        return 'View Profile';
      case 'edit':
        return 'Edit Profile';
      default:
        return 'Add New Profile';
    }
  });
  readonly buttonLabel = computed(() =>
    this.actionType() === 'edit' ? 'Update Profile' : 'Save Changes',
  );

  PROFILE_STATUS_DATA = PROFILE_STATUS;
  ZODIAC_SIGN_DATA = Object.entries(ZODIAC_SIGN_LIST).map(([key, value]) => ({
    key,
    value: `${value.tanglish} (${value.english})`,
  }));
  STARS_DATA = Object.entries(MATCHING_STARS).map(([key, value]) => ({
    key,
    value: `${key} (${value})`,
  }));
  STATE_LIST = STATE_LIST as unknown as string[];
  readonly cityList = computed(
    () =>
      DISTRICT_LIST[
        this.profileDetail().state as keyof typeof DISTRICT_LIST
      ] as unknown as string[],
  );
  readonly cityPlaceholder = computed(() =>
    this.profileDetailForm.state().value() ? 'Select City' : 'Select a state to choose a city',
  );
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfilesService);

  readonly newComment = model<string>('');

  private readonly profileDetail = signal<ProfileDetail>({
    name: '',
    mobileNumber: '+91',
    zodiacSign: null,
    star: null,
    age: null,
    starMatchScore: null,
    state: null,
    city: null,
    profileStatusId: null,
    matrimonyId: '',
    comments: [],
  });

  profileDetailForm = form(
    this.profileDetail,
    (profileForm) => {
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
      pattern(profileForm.mobileNumber, /^(\+91)?[6-9]\d{9}$/, {
        message: 'Invalid mobile number (e.g., 9876543210 or +919876543210)',
      });
      readonly(profileForm.starMatchScore);
      disabled(profileForm, { when: () => this.actionType() === 'view' });
      disabled(profileForm.city, { when: ({ valueOf }) => !valueOf(profileForm.state) });
    },
    {
      submission: {
        action: async (profileForm) => {
          // Flush a comment the user typed but didn't explicitly add, so it isn't lost on save.
          if (this.newComment().trim()) {
            this.addComment();
          }
          if (this.actionType() === 'edit') {
            return this.updateProfile(profileForm().value());
          } else {
            return this.addProfile(profileForm().value());
          }
        },
      },
    },
  );

  constructor() {
    effect(() => {
      const actionType = this.actionType();
      if (actionType && ['view', 'edit'].includes(actionType)) {
        this.profileService
          .getProfileById(this.selectedProfileId()!)
          .then((profile) => {
            if (profile) {
              this.profileDetail.set(profile);
            }
            if (actionType === 'view') {
              this.profileDetailForm().disabled();
            }
          })
          .catch(() => {
            toast.error('Failed to fetch profile');
          });
      }
    });

    // Derive starMatchScore from the selected star (replaces PrimeNG's (onChange) handler).
    effect(() => {
      const star = this.profileDetailForm.star().value();
      if (star && star in MATCHING_STARS) {
        const score = MATCHING_STARS[star as keyof typeof MATCHING_STARS];
        untracked(() => this.profileDetailForm.starMatchScore().value.set(score));
      }
    });

    // Clear a stale city when the state changes to one that no longer lists it.
    effect(() => {
      this.profileDetailForm.state().value();
      untracked(() => {
        const currentCity = this.profileDetailForm.city().value();
        if (currentCity && !(this.cityList() ?? []).includes(currentCity)) {
          this.profileDetailForm.city().value.set(null);
        }
      });
    });
  }

  copyToClipboard(value: string | null | undefined, label: string): void {
    this.profileService.copyToClipboard(value, label);
  }

  closeDrawer(): void {
    this.openDrawer.set(false);
    this.router.navigate(['/']);
  }

  addComment(): void {
    const value = this.newComment().trim();
    if (!value) {
      return;
    }
    const currentComments = this.profileDetailForm.comments().value();
    this.profileDetailForm.comments().value.set([
      ...currentComments,
      {
        value,
        createDateAndTime: new Date(),
      },
    ]);
    this.newComment.set('');
  }

  deleteComment(comment: Comment): void {
    const currentComments = this.profileDetailForm.comments().value();
    this.profileDetailForm
      .comments()
      .value.set(
        currentComments.filter(
          (eachComment) =>
            eachComment.createDateAndTime !== comment.createDateAndTime &&
            eachComment.value !== comment.value,
        ),
      );
  }

  private async addProfile(profileData: Partial<ProfileDetail>): Promise<void> {
    return await this.profileService
      .addProfile(profileData)
      .then(() => {
        toast.success('Profile added successfully');
        this.profileService.profiles.reload();
        this.closeDrawer();
      })
      .catch(() => {
        toast.error('Failed to add profile');
      });
  }

  private async updateProfile(profileData: Partial<ProfileDetail>): Promise<void> {
    return await this.profileService
      .updateProfile(this.selectedProfileId()!, profileData)
      .then(() => {
        toast.success('Profile updated successfully');
        this.profileService.profiles.reload();
        this.closeDrawer();
      })
      .catch(() => {
        toast.error('Failed to update profile');
      });
  }
}
