import { DatePipe, KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  model,
  resource,
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
import { provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideCopy,
  lucideLoaderCircle,
  lucidePlus,
  lucideTrash2,
} from '@ng-icons/lucide';
import { BrnSheetContent } from '@spartan-ng/brain/sheet';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import {
  DISTRICT_LIST,
  MATCHING_STARS,
  PROFILE_STATUS,
  STATE_LIST,
  ZODIAC_SIGN_LIST,
} from '../../constant/common.const';
import { TOOLBAR_ACTIONS } from '../../constant/toolbar.const';
import { Comment, ProfileDetail } from '../../models/profile.model';
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
    HlmSpinner,
    HlmSkeleton,
  ],
  templateUrl: './profile.html',
  providers: [
    provideIcons({ lucideCopy, lucidePlus, lucideTrash2, lucideCheck, lucideLoaderCircle }),
  ],
})
export class Profile {
  protected readonly profileService = inject(ProfilesService);
  readonly userActionType = computed(() => this.profileService.drawerState().actionType);
  readonly isOpened = computed(() => this.profileService.drawerState().isOpen);
  readonly TOOLBAR_ACTIONS_VALUES = TOOLBAR_ACTIONS;
  readonly title = computed(() => {
    switch (this.profileService.drawerState().actionType) {
      case 'view':
        return 'View Profile';
      case 'edit':
        return 'Edit Profile';
      default:
        return 'Add New Profile';
    }
  });
  readonly buttonLabel = computed(() =>
    this.profileService.drawerState().actionType === 'edit' ? 'Update Profile' : 'Save Changes',
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
  STATE_LIST = STATE_LIST;

  // The select trigger renders the stored *value* (the key) via itemToString — not the
  // projected <hlm-select-item> content. Map each key back to its readable label so the
  // trigger shows the same text as the dropdown option. (state/city need none: value === label.)
  readonly statusToLabel = (key: string): string =>
    PROFILE_STATUS[key as keyof typeof PROFILE_STATUS] ?? key;
  readonly zodiacToLabel = (key: string): string => {
    const zodiac = ZODIAC_SIGN_LIST[key as keyof typeof ZODIAC_SIGN_LIST];
    return zodiac ? `${zodiac.tanglish} (${zodiac.english})` : key;
  };
  readonly starToLabel = (key: string): string => {
    const score = MATCHING_STARS[key as keyof typeof MATCHING_STARS];
    return score === undefined ? key : `${key} (${score})`;
  };
  readonly cityList = computed(
    () =>
      DISTRICT_LIST[
        this.profileDetail().state as keyof typeof DISTRICT_LIST
      ] as unknown as string[],
  );
  readonly cityPlaceholder = computed(() =>
    this.profileDetailForm.state().value() ? 'Select City' : 'Select a state to choose a city',
  );

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

  readonly profileResource = resource({
    params: () => {
      const { actionType, selectedProfileId } = this.profileService.drawerState();
      return actionType === TOOLBAR_ACTIONS.view || actionType === TOOLBAR_ACTIONS.edit
        ? selectedProfileId
        : undefined;
    },
    loader: ({ params }) => this.profileService.getProfileById(params!),
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
      disabled(profileForm, {
        when: () => this.profileService.drawerState().actionType === 'view',
      });
      disabled(profileForm.city, { when: ({ valueOf }) => !valueOf(profileForm.state) });
    },
    {
      submission: {
        action: async (profileForm) => {
          // Flush a comment the user typed but didn't explicitly add, so it isn't lost on save.
          if (this.newComment().trim()) {
            this.addComment();
          }
          if (this.profileService.drawerState().actionType === 'edit') {
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
      const profileDetail = this.profileResource.value();
      const profileError = this.profileResource.error();
      if (profileDetail) {
        this.profileDetail.set(profileDetail);
      }
      if (profileError) {
        toast.error('Failed to fetch profile');
        this.closeDrawer();
      }
      untracked(() => {
        if (this.userActionType() === TOOLBAR_ACTIONS.view) {
          this.profileDetailForm().disabled();
        }
      });
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
    this.profileService.closeDrawer();
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
      .updateProfile(this.profileService.drawerState().selectedProfileId!, profileData)
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
