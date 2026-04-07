import { SYNAPSE_API_ENDPOINTS } from '../constants/api';
import {
  AuthMessageResponse,
  LoginRequest,
  UserProfile,
  ProfileResponse,
  RegisterRequest,
  UpdateProfileInput,
  UpdateProfileRequest,
} from '@/lib/types/auth.types';
import { apiService } from './api.service';

const normalizeProfileResponse = (profile: ProfileResponse): UserProfile => ({
  id: profile.id ?? profile.userId ?? '',
  username: profile.username ?? '',
  email: profile.email ?? '',
  displayName: profile.display_name,
  firstName: profile.first_name,
  lastName: profile.last_name,
  avatarUrl: profile.avatar_url ?? null,
  timeZone: profile.timezone ?? profile.time_zone ?? null,
  emailVerified: profile.email_verified,
  sessionId: profile.sessionId,
});

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthMessageResponse> {
    return apiService.request<AuthMessageResponse, LoginRequest>(
      'POST',
      SYNAPSE_API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
  }

  async logout(): Promise<AuthMessageResponse> {
    return apiService.request<AuthMessageResponse>(
      'POST',
      SYNAPSE_API_ENDPOINTS.AUTH.LOGOUT,
    );
  }

  async refresh(): Promise<AuthMessageResponse> {
    return apiService.request<AuthMessageResponse>(
      'POST',
      SYNAPSE_API_ENDPOINTS.AUTH.REFRESH,
    );
  }

  async register(payload: RegisterRequest): Promise<AuthMessageResponse> {
    return apiService.request<AuthMessageResponse, RegisterRequest>(
      'POST',
      SYNAPSE_API_ENDPOINTS.AUTH.REGISTER,
      payload,
    );
  }

  async getProfile(): Promise<UserProfile> {
    try {
      const profile = await apiService.request<ProfileResponse>(
        'GET',
        SYNAPSE_API_ENDPOINTS.USERS.MY_PROFILE,
      );

      return normalizeProfileResponse(profile);
    } catch {
      // Backward compatibility for older auth profile endpoint.
      const profile = await apiService.request<ProfileResponse>(
        'POST',
        SYNAPSE_API_ENDPOINTS.AUTH.PROFILE,
      );

      return normalizeProfileResponse(profile);
    }
  }

  async updateProfile(
    userId: string,
    payload: UpdateProfileInput,
  ): Promise<UserProfile> {
    const normalizedPayload: UpdateProfileRequest = {
      username: payload.username,
      email: payload.email,
      display_name: payload.displayName,
      first_name: payload.firstName,
      last_name: payload.lastName,
      avatar_url: payload.avatarUrl,
      timezone: payload.timeZone,
    };

    const profile = await apiService.request<ProfileResponse, UpdateProfileRequest>(
      'PATCH',
      SYNAPSE_API_ENDPOINTS.USERS.DETAIL(userId),
      normalizedPayload,
    );

    return normalizeProfileResponse(profile);
  }
}

export const authService = new AuthService();
