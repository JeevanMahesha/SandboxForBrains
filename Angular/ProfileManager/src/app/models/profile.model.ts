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
  star: keyof typeof MATCHING_STARS;
  starMatchScore: (typeof MATCHING_STARS)[keyof typeof MATCHING_STARS] | 0;
  mobileNumber: string;
  zodiacSign: keyof typeof ZODIAC_SIGN_LIST;
  age: number;
  state: keyof typeof DISTRICT_LIST;
  name: string;
  profileStatusId: keyof typeof PROFILE_STATUS;
  matrimonyId: string;
  city: string;
  id?: number;
  sNo?: number;
  profileStatus?: (typeof PROFILE_STATUS)[keyof typeof PROFILE_STATUS];
}
