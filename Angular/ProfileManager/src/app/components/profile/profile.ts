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
import { disabled, form, FormRoot, min, pattern, readonly, required } from '@angular/forms/signals';
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
  DISTRICT_LIST,
  MATCHING_STARS,
  PROFILE_STATUS,
  PROFILE_STATUS_COLORS_MAP,
  ZODIAC_SIGN_LIST,
} from '../../constant/common.const';
import { TOOLBAR_ACTIONS } from '../../constant/toolbar.const';
import { Comment, ProfileDetail } from '../../models/profile.model';
import { ProfilesService } from '../../services/profiles.service';
import { ProfileFormFieldsComponent } from './profile-form-fields/profile-form-fields';

@Component({
  selector: 'app-profile',
  imports: [
    FormRoot,
    FormsModule,
    DatePipe,
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
      keyof typeof PROFILE_STATUS_COLORS_MAP | null;
    return id ? PROFILE_STATUS_COLORS_MAP[id] : null;
  });

  private readonly starList = computed(() => {
    const zodiac = this.profileDetailForm.zodiacSign().value();
    return zodiac
      ? (ZODIAC_SIGN_LIST[zodiac as keyof typeof ZODIAC_SIGN_LIST]?.stars as readonly string[] ?? [])
      : [];
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
      disabled(profileForm.star, { when: ({ valueOf }) => !valueOf(profileForm.zodiacSign) });
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
      } else if (!this.profileResource.isLoading()) {
        // Resource is idle (create mode) — reset form so stale edit data doesn't carry over.
        this.profileDetail.set({ ...Profile.BLANK_PROFILE });
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
    effect(() => {
      const star = this.profileDetailForm.star().value();
      untracked(() => {
        if (star && star in MATCHING_STARS) {
          this.profileDetailForm.starMatchScore().value.set(
            MATCHING_STARS[star as keyof typeof MATCHING_STARS],
          );
        } else {
          this.profileDetailForm.starMatchScore().value.set(null);
        }
      });
    });

    // Clear a stale star when the zodiac changes to one that no longer lists it.
    effect(() => {
      this.profileDetailForm.zodiacSign().value();
      untracked(() => {
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
