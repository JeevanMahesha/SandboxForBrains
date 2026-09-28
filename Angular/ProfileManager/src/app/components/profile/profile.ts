import { DatePipe } from '@angular/common';
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
  FormRoot,
  min,
  patternError,
  readonly,
  required,
  validate,
} from '@angular/forms/signals';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideLoaderCircle, lucidePlus, lucideTrash2 } from '@ng-icons/lucide';
import { BrnSheetContent } from '@spartan-ng/brain/sheet';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import {
  DISPLAY_DATE_FORMAT,
  DISPLAY_DATE_TIME_FORMAT,
  DISTRICT_LIST,
  PROFILE_STATUS,
  PROFILE_STATUS_STYLES,
  STAR_SCORES,
  StarKey,
  ZODIAC_LIST,
  ZodiacKey,
} from '../../constant/common.const';
import { TOOLBAR_ACTIONS } from '../../constant/toolbar.const';
import { Comment, ProfileDetail } from '../../models/profile.model';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { ProfilesService } from '../../services/profiles.service';
import {
  CANONICAL_MOBILE_NUMBER_PATTERN,
  mobileNumberDigits,
  toCanonicalMobileNumber,
} from '../../utils/mobile-number.util';
import { ProfileFormFieldsComponent } from './profile-form-fields/profile-form-fields';

@Component({
  selector: 'app-profile',
  imports: [
    FormRoot,
    FormsModule,
    DatePipe,
    TimeAgoPipe,
    BrnSheetContent,
    HlmBadge,
    HlmButton,
    HlmInput,
    HlmSeparator,
    ...HlmSheetImports,
    ...HlmFieldImports,
    ...HlmIconImports,
    HlmSpinner,
    HlmSkeleton,
    ProfileFormFieldsComponent,
  ],
  templateUrl: './profile.html',
  providers: [provideIcons({ lucidePlus, lucideTrash2, lucideCheck, lucideLoaderCircle })],
})
export class Profile {
  protected readonly profileService = inject(ProfilesService);
  readonly userActionType = computed(() => this.profileService.drawerState().actionType);
  readonly isOpened = computed(() => this.profileService.drawerState().isOpen);
  readonly TOOLBAR_ACTIONS_VALUES = TOOLBAR_ACTIONS;
  readonly DATE_FORMAT = DISPLAY_DATE_FORMAT;
  readonly DATE_TIME_FORMAT = DISPLAY_DATE_TIME_FORMAT;
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

  readonly profileStatusLabel = computed(() => {
    const id = this.profileDetailForm.profileStatusId().value() as
      keyof typeof PROFILE_STATUS | null;
    return id ? PROFILE_STATUS[id] : null;
  });

  readonly profileStatusColor = computed(() => {
    const id = this.profileDetailForm.profileStatusId().value() as
      keyof typeof PROFILE_STATUS_STYLES | null;
    return id ? PROFILE_STATUS_STYLES[id].badge : null;
  });

  private readonly starList = computed(() => {
    const zodiac = this.profileDetailForm.zodiacSign().value();
    return zodiac ? ((ZODIAC_LIST[zodiac as ZodiacKey]?.stars as readonly string[]) ?? []) : [];
  });

  private readonly cityList = computed(
    () =>
      DISTRICT_LIST[
        this.profileDetail().state as keyof typeof DISTRICT_LIST
      ] as unknown as string[],
  );

  readonly newComment = model<string>('');

  private static readonly BLANK_PROFILE: ProfileDetail = {
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
  };

  private readonly profileDetail = signal<ProfileDetail>({ ...Profile.BLANK_PROFILE });

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
      required(profileForm.age, { message: 'Age is required' });
      // Star is optional. The score is derived from it, so it is only required once a star is set.
      required(profileForm.starMatchScore, {
        when: ({ valueOf: readValue }) => !!readValue(profileForm.star),
        message: 'Star match score is required',
      });
      required(profileForm.state, { message: 'State is required' });
      required(profileForm.city, { message: 'City is required' });
      required(profileForm.profileStatusId, { message: 'Profile status is required' });
      required(profileForm.matrimonyId, { message: 'Matrimony ID is required' });
      min(profileForm.age, 18, { message: 'Age must be greater than 18' });
      // Accept any spacing / prefix the user types ("98 76 5 43 21 0", "+91 98765 43210", "0987...").
      // Empty input is left to the required() rule above.
      validate(profileForm.mobileNumber, ({ value }) => {
        const raw = value();
        return !mobileNumberDigits(raw) || toCanonicalMobileNumber(raw)
          ? null
          : patternError(CANONICAL_MOBILE_NUMBER_PATTERN, {
              message: 'Invalid mobile number (e.g., 98765 43210 or +91 98765 43210)',
            });
      });
      readonly(profileForm.starMatchScore);
      disabled(profileForm, {
        when: () => this.profileService.drawerState().actionType === 'view',
      });
      disabled(profileForm.star, {
        when: ({ valueOf: readValue }) => !readValue(profileForm.zodiacSign),
      });
      disabled(profileForm.city, {
        when: ({ valueOf: readValue }) => !readValue(profileForm.state),
      });
    },
    {
      submission: {
        action: async (profileForm) => {
          // Flush a comment the user typed but didn't explicitly add, so it isn't lost on save.
          if (this.newComment().trim()) {
            this.addComment();
          }
          // Persist the canonical "+91XXXXXXXXXX" form regardless of how the user typed it.
          // Validation guarantees a canonical form exists here; the fallback only satisfies the type.
          const rawMobileNumber = profileForm().value().mobileNumber;
          const profileData: ProfileDetail = {
            ...profileForm().value(),
            mobileNumber: toCanonicalMobileNumber(rawMobileNumber) ?? rawMobileNumber,
          };
          if (this.profileService.drawerState().actionType === 'edit') {
            return this.updateProfile(profileData);
          } else {
            return this.addProfile(profileData);
          }
        },
      },
    },
  );

  constructor() {
    // Start from a blank form whenever the drawer closes or opens in create mode, so a value
    // typed and abandoned in "Add Profile" doesn't reappear next time. The profile resource is
    // idle in create mode (no id), so it cannot drive this reset itself.
    effect(() => {
      const { isOpen, actionType } = this.profileService.drawerState();
      if (isOpen === 'closed' || actionType === TOOLBAR_ACTIONS.create) {
        untracked(() => {
          this.newComment.set('');
          // reset() also clears touched/dirty so no stale validation errors show.
          this.profileDetailForm().reset({ ...Profile.BLANK_PROFILE, comments: [] });
        });
      }
    });

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

    // Derive starMatchScore from the selected star; clear it when no star is selected.
    // Skipped in view mode — saved data is displayed as-is.
    effect(() => {
      const star = this.profileDetailForm.star().value();
      untracked(() => {
        if (this.profileService.drawerState().actionType === 'view') return;
        if (star && star in STAR_SCORES) {
          this.profileDetailForm.starMatchScore().value.set(STAR_SCORES[star as StarKey]);
        } else {
          this.profileDetailForm.starMatchScore().value.set(null);
        }
      });
    });

    // Clear a stale star when the zodiac changes to one that no longer lists it.
    // Skipped in view mode — saved data is displayed as-is.
    effect(() => {
      this.profileDetailForm.zodiacSign().value();
      untracked(() => {
        if (this.profileService.drawerState().actionType === 'view') return;
        const currentStar = this.profileDetailForm.star().value();
        if (currentStar && !this.starList().includes(currentStar)) {
          this.profileDetailForm.star().value.set(null);
        }
      });
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
        this.profileService.refreshProfiles();
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
        this.profileService.refreshProfiles();
        this.closeDrawer();
      })
      .catch(() => {
        toast.error('Failed to update profile');
      });
  }
}
