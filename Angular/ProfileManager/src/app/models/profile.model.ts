import {
  DISTRICT_LIST,
  PROFILE_STATUS,
  STAR_SCORES,
  StarKey,
  ZodiacKey,
} from '../constant/common.const';

export interface Comment {
  value: string;
  createDateAndTime: Date;
}

export interface ProfileDetail {
  updatedAt?: Date;
  createdAt?: Date;
  comments: Comment[];
  star: StarKey | null;
  starMatchScore: (typeof STAR_SCORES)[StarKey] | 0 | null;
  mobileNumber: string;
  zodiacSign: ZodiacKey | null;
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
