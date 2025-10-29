import { MATCHING_STARS, PROFILE_STATUS, zodiacSignList } from '../constant/common';

export interface Profile {
  updatedAt: Date;
  createdAt: Date;
  comments: string[];
  star: keyof typeof MATCHING_STARS;
  starMatchScore: (typeof MATCHING_STARS)[keyof typeof MATCHING_STARS];
  mobileNumber: string;
  zodiacSign: keyof typeof zodiacSignList;
  age: number;
  state: string;
  name: string;
  profileStatusId: keyof typeof PROFILE_STATUS;
  matrimonyId: string;
  city: string;
  id: number;
  actions: string;
  sNo?: number;
}

export type ProfileColumn = keyof Pick<
  Profile,
  'name' | 'zodiacSign' | 'city' | 'profileStatusId' | 'starMatchScore' | 'actions' | 'sNo'
>;
