import { Component, input, signal } from '@angular/core';
import { disabled, form, min, pattern, readonly, required } from '@angular/forms/signals';
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
  zodiacSignList,
} from '../../constant/common';

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
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  isVisable = false;
  public readonly action = input<string | null>();

  events = [
    {
      status: 'Ordered',
      date: '15/10/2020 10:30',
      icon: 'pi pi-shopping-cart',
      color: '#9C27B0',
      image: 'game-controller.jpg',
    },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
    { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' },
  ];

  private readonly profileDetailModel = signal<ProfileDetail>({
    name: '',
    mobileNumber: '+91',
    zodiacSign: 'aquarius',
    star: 'Aswini',
    age: 0,
    starMatchScore: 0,
    state: 'Tamil Nadu',
    city: '',
    profileStatusId: 'NEW',
    matrimonyId: '',
    comments: [],
  });
  profileDetailForm = form(this.profileDetailModel, (profileForm) => {
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
    pattern(profileForm.mobileNumber, /^\+91[0-9]{10}$/, {
      message: 'Invalid mobile number (e.g., +919876543210)',
    });
    readonly(profileForm.starMatchScore);
    disabled(profileForm, () => this.action() === 'view');
  });
}
