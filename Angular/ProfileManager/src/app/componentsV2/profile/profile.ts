import { DatePipe, KeyValuePipe } from '@angular/common';
import { Component, computed, inject, input, model, signal } from '@angular/core';
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
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TimelineModule } from 'primeng/timeline';
import {
  DistrictList,
  MATCHING_STARS,
  PROFILE_STATUS,
  StateList,
  zodiacSignList,
} from '../../constant/common';
import { Comment } from '../../models/profile';
import { ToolbarAction } from '../../models/toolbar.model';

export interface ProfileDetail {
  name: string;
  mobileNumber: string;
  zodiacSign: keyof typeof zodiacSignList;
  star: keyof typeof MATCHING_STARS;
  age: number;
  starMatchScore: (typeof MATCHING_STARS)[keyof typeof MATCHING_STARS] | 0;
  state: keyof typeof DistrictList;
  city: string;
  profileStatusId: keyof typeof PROFILE_STATUS;
  matrimonyId: string;
  comments: Comment[];
}

@Component({
  selector: 'app-profile',
  imports: [
    DrawerModule,
    InputTextModule,
    SelectModule,
    FloatLabelModule,
    InputMaskModule,
    InputNumberModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    TimelineModule,
    FormField,
    KeyValuePipe,
    FormRoot,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  actionType = input.required<ToolbarAction | undefined>();
  openDrawer = model<boolean | undefined>();
  selectedProfileId = input.required<string | undefined>();
  title = computed(() => {
    switch (this.actionType()) {
      case 'view':
        return 'View Profile';
      case 'edit':
        return 'Edit Profile';
      default:
        return 'Add New Profile';
    }
  });

  PROFILE_STATUS_DATA = PROFILE_STATUS;
  ZODIAC_SIGN_DATA = Object.entries(zodiacSignList).map(([key, value]) => ({
    key,
    value: `${value.tanglish} (${value.english})`,
  }));
  STARS_DATA = Object.entries(MATCHING_STARS).map(([key, value]) => ({
    key,
    value: `${key} (${value})`,
  }));
  STATE_LIST = StateList as unknown as string[];
  cityList = computed(() => DistrictList[this.profileDetail().state] as unknown as string[]);
  private readonly router = inject(Router);

  events = [
    {
      status: 'Ordered',
      date: '15/10/2020 10:30',
      icon: 'pi pi-shopping-cart',
      color: '#9C27B0',
      image: 'game-controller.jpg',
    },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
    { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' },
  ];

  newComment = model<string>('');

  private readonly profileDetail = signal<ProfileDetail>({
    name: '',
    mobileNumber: '+91',
    zodiacSign: 'aquarius',
    star: 'Aswini',
    age: 25,
    starMatchScore: 8,
    state: 'Tamil Nadu',
    city: 'Chennai',
    profileStatusId: 'NEW',
    matrimonyId: '',
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

  closeDrawer() {
    this.openDrawer.set(false);
    this.router.navigate(['/']);
  }

  addComment() {
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

  onSubmit() {
    console.log(this.profileDetailForm().value());
    console.log(this.profileDetailForm().valid());
    console.log(this.profileDetailForm.name().touched());
  }
}
