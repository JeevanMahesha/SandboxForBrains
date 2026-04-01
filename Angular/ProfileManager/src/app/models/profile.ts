import { DistrictList, MATCHING_STARS, PROFILE_STATUS, zodiacSignList } from '../constant/common';

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
  zodiacSign: keyof typeof zodiacSignList;
  age: number;
  state: keyof typeof DistrictList;
  name: string;
  profileStatusId: keyof typeof PROFILE_STATUS;
  matrimonyId: string;
  city: string;
  id?: number;
  sNo?: number;
  profileStatus?: (typeof PROFILE_STATUS)[keyof typeof PROFILE_STATUS];
}

export type ProfileColumn = keyof Pick<
  ProfileDetail,
  'name' | 'zodiacSign' | 'city' | 'profileStatusId' | 'starMatchScore' | 'sNo'
>;
