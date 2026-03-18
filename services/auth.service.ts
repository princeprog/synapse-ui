import { SYNAPSE_API_ENDPOINTS } from '../constants/api';
import {
  AuthMessageResponse,
  LoginRequest,
  ProfileResponse,
  RegisterRequest,
} from '@/lib/types/auth.types';
import { apiService } from './api.service';

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

  async getProfile(): Promise<ProfileResponse> {
    return apiService.request<ProfileResponse>('POST', SYNAPSE_API_ENDPOINTS.AUTH.PROFILE);
  }
}

export const authService = new AuthService();
