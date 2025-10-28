export interface Profile {
  id: number;
  name: string;
  caste: string;
  city: string;
  state: string;
  profileStatus: 'New' | 'Rejected' | 'Unknown';
  star: string;
  starMatchScore: number;
}

