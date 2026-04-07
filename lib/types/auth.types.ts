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
  timeZone?: string | null;
  emailVerified?: boolean;
  sessionId?: number;
}

export interface UpdateProfileInput {
  username?: string;
  email?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  timeZone?: string | null;
}

export interface ProfileResponse {
  id: string;
  userId: string;
  username: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  timeZone?: string | null;
  emailVerified?: boolean;
  sessionId?: number;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string | null;
  timezone?: string | null;
}
