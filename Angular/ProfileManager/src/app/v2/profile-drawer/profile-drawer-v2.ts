import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, resource, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  disabled,
  form,
  FormField,
  FormRoot,
  min,
  pattern,
  readonly as formReadonly,
  required,
} from '@angular/forms/signals';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCheck, lucideCopy, lucidePlus, lucideTrash2, lucideX,
} from '@ng-icons/lucide';
import { BrnSheetContent } from '@spartan-ng/brain/sheet';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
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
import { V2_STAR_META } from '../tokens';
import V2StatusBadge from '../shared/status-badge';

interface ProfileFormModel {
  name: string;
  profileStatusId: string;
  mobileNumber: string;
  matrimonyId: string;
  zodiacSign: string;
  star: string;
  age: number | null;
  starMatchScore: number | null;
  state: string;
  city: string;
}

@Component({
  selector: 'app-v2-profile-drawer',
  imports: [
    FormField, FormRoot, FormsModule, DatePipe,
    BrnSheetContent,
    ...HlmSheetImports,
    ...HlmIconImports,
    V2StatusBadge,
  ],
  providers: [
    provideIcons({ lucideCopy, lucidePlus, lucideTrash2, lucideCheck, lucideX }),
  ],
  templateUrl: './profile-drawer-v2.html',
})
export default class V2ProfileDrawer {
  protected readonly svc = inject(ProfilesService);

  readonly drawerState    = computed(() => this.svc.drawerState());
  readonly isOpen         = computed(() => this.drawerState().isOpen);
  readonly actionType     = computed(() => this.drawerState().actionType);
  readonly selectedId     = computed(() => this.drawerState().selectedProfileId);
  readonly isView         = computed(() => this.actionType() === TOOLBAR_ACTIONS.view);
  readonly isEdit         = computed(() => this.actionType() === TOOLBAR_ACTIONS.edit);
  readonly isCreate       = computed(() => this.actionType() === TOOLBAR_ACTIONS.create);

  readonly PROFILE_STATUS = PROFILE_STATUS;
  readonly ZODIAC_LIST    = ZODIAC_SIGN_LIST;
  readonly STAR_LIST      = MATCHING_STARS;
  readonly STATE_LIST     = STATE_LIST;
  readonly DISTRICT_LIST  = DISTRICT_LIST;
  readonly V2_STAR_META   = V2_STAR_META;

  readonly newComment     = signal('');
  readonly comments       = signal<Comment[]>([]);
  readonly cityOptions    = signal<string[]>([]);

  readonly profileModel   = signal<ProfileFormModel>({
    name: '', profileStatusId: '', mobileNumber: '', matrimonyId: '',
    zodiacSign: '', star: '', age: null, starMatchScore: null, state: '', city: '',
  });

  readonly profileResource = resource<ProfileDetail | null, string | null>({
    params: () => this.selectedId(),
    loader: async ({ params }) => {
      if (!params) return null;
      return this.svc.getProfileById(params);
    },
  });

  constructor() {
    effect(() => {
      const profile = this.profileResource.value();
      if (!profile) return;
      untracked(() => {
        this.profileModel.set({
          name:            profile.name ?? '',
          profileStatusId: profile.profileStatusId ?? '',
          mobileNumber:    profile.mobileNumber ?? '',
          matrimonyId:     profile.matrimonyId ?? '',
          zodiacSign:      profile.zodiacSign ?? '',
          star:            profile.star ?? '',
          age:             profile.age ?? null,
          starMatchScore:  profile.starMatchScore ?? null,
          state:           profile.state ?? '',
          city:            profile.city ?? '',
        });
        this.comments.set(profile.comments ?? []);
        this.updateCityOptions(profile.state ?? '');
      });
    });
  }

  readonly profileForm = form(
    this.profileModel,
    (f) => {
      required(f.name, { message: 'Name is required' });
      required(f.profileStatusId, { message: 'Status is required' });
      required(f.mobileNumber, { message: 'Mobile number is required' });
      pattern(f.mobileNumber, /^(\+91)?[6-9]\d{9}$/, { message: 'Enter a valid Indian mobile number' });
      required(f.matrimonyId, { message: 'Matrimony ID is required' });
      required(f.zodiacSign, { message: 'Zodiac sign is required' });
      required(f.star, { message: 'Star is required' });
      required(f.age, { message: 'Age is required' });
      min(f.age, 18, { message: 'Minimum age is 18' });
      required(f.state, { message: 'State is required' });
      required(f.city, { message: 'City is required' });
      if (this.isView()) {
        formReadonly(f.name);
        formReadonly(f.profileStatusId);
        formReadonly(f.mobileNumber);
        formReadonly(f.matrimonyId);
        formReadonly(f.zodiacSign);
        formReadonly(f.star);
        formReadonly(f.age);
        formReadonly(f.state);
        formReadonly(f.city);
      }
      disabled(f.starMatchScore);
    },
    {
      submission: {
        action: async (fields) => {
          const data: Partial<ProfileDetail> = {
            name:            fields.name().value(),
            profileStatusId: fields.profileStatusId().value() as keyof typeof PROFILE_STATUS,
            mobileNumber:    fields.mobileNumber().value(),
            matrimonyId:     fields.matrimonyId().value(),
            zodiacSign:      fields.zodiacSign().value() as keyof typeof ZODIAC_SIGN_LIST,
            star:            fields.star().value() as keyof typeof MATCHING_STARS,
            starMatchScore:  fields.starMatchScore().value() as 0 | 8 | 9 | null | undefined,
            age:             fields.age().value(),
            state:           fields.state().value() as keyof typeof DISTRICT_LIST,
            city:            fields.city().value(),
            comments:        this.comments(),
          };
          if (this.isCreate()) {
            await this.svc.addProfile(data as ProfileDetail);
            toast.success('Profile added successfully');
          } else {
            await this.svc.updateProfile(this.selectedId()!, data);
            toast.success('Profile updated successfully');
          }
          this.svc.profiles.reload();
          this.svc.closeDrawer();
        },
      },
    },
  );

  onStarChange(value: string): void {
    const score = MATCHING_STARS[value as keyof typeof MATCHING_STARS] ?? null;
    this.profileModel.update((m) => ({ ...m, star: value, starMatchScore: score }));
  }

  onStateChange(value: string): void {
    this.profileModel.update((m) => ({ ...m, state: value, city: '' }));
    this.updateCityOptions(value);
  }

  private updateCityOptions(state: string): void {
    const list = DISTRICT_LIST[state as keyof typeof DISTRICT_LIST];
    this.cityOptions.set(list ? [...list] : []);
  }

  addComment(): void {
    const value = this.newComment().trim();
    if (!value) return;
    this.comments.update((c) => [...c, { value, createDateAndTime: new Date() }]);
    this.newComment.set('');
  }

  removeComment(index: number): void {
    this.comments.update((c) => c.filter((_, i) => i !== index));
  }

  copyToClipboard(value: string | null | undefined, label: string): void {
    this.svc.copyToClipboard(value, label);
  }

  close(): void { this.svc.closeDrawer(); }

  starMeta(score: number | null | undefined) {
    if (!score) return null;
    return V2_STAR_META[score] ?? null;
  }

  statusKeys = Object.keys(PROFILE_STATUS) as (keyof typeof PROFILE_STATUS)[];
  zodiacKeys  = Object.keys(ZODIAC_SIGN_LIST) as (keyof typeof ZODIAC_SIGN_LIST)[];
  starKeys    = Object.keys(MATCHING_STARS) as (keyof typeof MATCHING_STARS)[];
}
