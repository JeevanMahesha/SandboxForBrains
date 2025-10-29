export interface IUserProfile {
  name: string | null;
  granted_scopes: string | null;
  id: string | null;
  verified_email: boolean | null;
  given_name: string | null;
  family_name: string | null;
  email: string | null;
  picture: string | null;
}

export interface IAuthStateResponse {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  isAnonymous: boolean;
  photoURL: string;
  providerData: IProviderDatum[];
  stsTokenManager: IStsTokenManager;
  createdAt: string;
  lastLoginAt: string;
  apiKey: string;
  appName: string;
}

export interface IProviderDatum {
  providerId: string;
  uid: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
}

export interface IStsTokenManager {
  refreshToken: string;
  accessToken: string;
  expirationTime: number;
}
