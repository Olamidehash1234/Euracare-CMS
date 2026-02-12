import apiClient, { resetSessionTimeout } from './apiClient';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
}

export interface ResetPasswordPayload {
  email: string;
}

export interface VerifyCodePayload {
  email: string;
  code: string;
}

export interface UpdatePasswordPayload {
  email: string;
  code: string;
  newPassword: string;
}

const authService = {
  // Login user
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>('/auth/login', payload)
      .then((response) => {
        // Reset session timeout flag on successful login
        resetSessionTimeout();
        return response;
      })
      .catch((error) => {
        throw error;
      }),

  // Request password reset
  requestPasswordReset: (payload: ResetPasswordPayload) =>
    apiClient.post('/auth/forgot-password', payload),

  // Verify reset code
  verifyCode: (payload: VerifyCodePayload) =>
    apiClient.post('/auth/verify-code', payload),

  // Update password
  updatePassword: (payload: UpdatePasswordPayload) =>
    apiClient.post('/auth/reset-password', payload),

  // Logout
  logout: () => apiClient.post('/auth/logout'),

  // Get current user
  getCurrentUser: () => apiClient.get('/auth/me'),
};

export default authService;
