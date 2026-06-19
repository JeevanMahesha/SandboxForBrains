import {
  DISTRICT_LIST,
  MATCHING_STARS,
  PROFILE_STATUS,
  ZODIAC_SIGN_LIST,
} from '../constant/common.const';

export interface Comment {
  value: string;
  createDateAndTime: Date;
}

export interface ProfileDetail {
  updatedAt?: Date;
  createdAt?: Date;
  comments: Comment[];
  star: keyof typeof MATCHING_STARS | null;
  starMatchScore: (typeof MATCHING_STARS)[keyof typeof MATCHING_STARS] | 0 | null;
  mobileNumber: string;
  zodiacSign: keyof typeof ZODIAC_SIGN_LIST | null;
  age: number | null;
  state: keyof typeof DISTRICT_LIST | null;
  name: string;
  profileStatusId: keyof typeof PROFILE_STATUS | null;
  matrimonyId: string;
  city: string | null;
  id?: number;
  sNo?: number;
  profileStatus?: (typeof PROFILE_STATUS)[keyof typeof PROFILE_STATUS];
  profileStatusColor?: string;
}
