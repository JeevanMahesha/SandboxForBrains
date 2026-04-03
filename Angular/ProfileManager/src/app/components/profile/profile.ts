import { DatePipe, KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
  resource,
  signal,
  viewChild,
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
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TimelineModule } from 'primeng/timeline';
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
    DrawerModule,
    InputTextModule,
    FloatLabelModule,
    SelectModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,
    FormField,
    FormsModule,
    ButtonModule,
    TimelineModule,
    KeyValuePipe,
    DatePipe,
    FormRoot,
    SkeletonModule,
  ],
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile implements OnDestroy {
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
  readonly submitButtonRef = viewChild<ElementRef<HTMLButtonElement>>('submitButton');
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
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfilesService);
  private messageService = inject(MessageService);
  readonly newComment = model<string>('');
  private readonly profileDetail = signal<ProfileDetail>({
    name: '',
    mobileNumber: '+91',
    zodiacSign: '',
    star: '',
    age: 0,
    starMatchScore: 0,
    state: '',
    city: '',
    profileStatusId: '',
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
      disabled(profileForm, () => this.actionType() === 'view');
    },
    {
      submission: {
        action: async (profileForm) => {
          if (this.actionType() === 'edit') {
            return this.updateProfile(profileForm().value());
          } else {
            return this.addProfile(profileForm().value());
          }
        },
      },
    },
  );

  readonly selectedProfile = resource<ProfileDetail | null, string>({
    params: () => this.selectedProfileId()!,
    loader: ({ params }) =>
      params ? this.profileService.getProfileById(params) : Promise.resolve(null),
    defaultValue: null,
  });

  constructor() {
    effect(() => {
      const actionType = this.actionType();
      if (actionType && ['view', 'edit'].includes(actionType)) {
        const selectedProfile = this.selectedProfile.value();
        if (selectedProfile) {
          this.profileDetail.set(selectedProfile);
        }
        if (actionType === 'view') {
          this.profileDetailForm().disabled();
        }
      }
    });
  }

  onStarChange(event: SelectChangeEvent): void {
    this.profileDetailForm
      .starMatchScore()
      .value.set(MATCHING_STARS[event.value as keyof typeof MATCHING_STARS]);
  }

  copyToClipboard(value: string | null | undefined, label: string): void {
    this.profileService.copyToClipboard(value, label);
  }

  closeDrawer(): void {
    this.openDrawer.set(false);
    this.router.navigate(['/']);
  }

  addComment(): void {
    const currentComments = this.profileDetailForm.comments().value();
    this.profileDetailForm.comments().value.set([
      ...currentComments,
      {
        value: this.newComment(),
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

  ngOnDestroy(): void {
    this.profileDetailForm().reset();
  }

  private async addProfile(profileData: Partial<ProfileDetail>): Promise<void> {
    return await this.profileService
      .addProfile(profileData)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile added successfully',
          life: 3000,
        });
        this.profileService.profiles.reload();
        this.closeDrawer();
      })
      .catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add profile',
        });
      });
  }

  private async updateProfile(profileData: Partial<ProfileDetail>): Promise<void> {
    return await this.profileService
      .updateProfile(this.selectedProfileId()!, profileData)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully',
          life: 3000,
        });
        this.profileService.profiles.reload();
        this.closeDrawer();
      })
      .catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update profile',
        });
      });
  }
}
