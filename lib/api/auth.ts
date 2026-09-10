import { apiClient, ApiResponse } from './client';

export interface UserSessionDto {
  userId: string;
  identifier: string;
  email: string;
  fullName: string;
  institutionId: string;
  roles: string[];
  permissions: string[];
  sessionId?: string;
}

export const authApi = {
  login: async (identifier: string, password: string): Promise<ApiResponse<UserSessionDto>> => {
    return apiClient<UserSessionDto>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  getCurrentUser: async (): Promise<ApiResponse<UserSessionDto>> => {
    return apiClient<UserSessionDto>('/api/v1/auth/me', {
      method: 'GET',
    });
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return apiClient<void>('/api/v1/auth/logout', {
      method: 'POST',
    });
  },

  activateAccount: async (token: string, password: string): Promise<ApiResponse<void>> => {
    return apiClient<void>('/api/v1/auth/activate-account', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },

  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<void>> => {
    return apiClient<void>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};
