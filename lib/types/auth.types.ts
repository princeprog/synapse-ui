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

export type ProfileResponse = Record<string, unknown>;
