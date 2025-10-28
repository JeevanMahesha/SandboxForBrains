import { matchingStars, PROFILE_STATUS, zodiacSignList } from '../constant/common';

export interface Profile {
  updatedAt: Date;
  createdAt: Date;
  comments: string[];
  star: keyof typeof matchingStars;
  starMatchScore: (typeof matchingStars)[keyof typeof matchingStars];
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
}

export type ProfileColumn = keyof Pick<
  Profile,
  'name' | 'zodiacSign' | 'city' | 'profileStatusId' | 'starMatchScore' | 'actions'
>;
