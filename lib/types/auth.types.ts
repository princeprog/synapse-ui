export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthMessageResponse {
  message: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  emailVerified?: boolean;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
}

export type ProfileResponse = UserProfile;
