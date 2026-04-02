import { DatePipe, KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
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
  ],
  templateUrl: './profile.html',
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
    () => DISTRICT_LIST[this.profileDetail().state] as unknown as string[],
  );
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfilesService);
  private messageService = inject(MessageService);

  readonly newComment = model<string>('');
  readonly isSubmitting = signal<boolean>(false);

  private readonly profileDetail = signal<ProfileDetail>({
    name: 'Test-'.concat(Math.random().toString(36).substring(2, 15)),
    mobileNumber: '+919876543210',
    zodiacSign: 'aquarius',
    star: 'Aswini',
    age: 25,
    starMatchScore: 8,
    state: 'Tamil Nadu',
    city: 'Chennai',
    profileStatusId: 'NEW',
    matrimonyId: '123456',
    comments: [],
  });
  profileDetailForm = form(this.profileDetail, (profileForm) => {
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
  });

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
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to fetch profile',
            });
          });
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

  async onSubmit(): Promise<void> {
    this.isSubmitting.set(true);
    if (this.actionType() === 'edit') {
      this.profileService
        .updateProfile(this.selectedProfileId()!, this.profileDetailForm().value())
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
        })
        .finally(() => {
          this.isSubmitting.set(false);
        });
    } else {
      this.profileService
        .addProfile(this.profileDetailForm().value())
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
        })
        .finally(() => {
          this.isSubmitting.set(false);
        });
    }
  }
}
