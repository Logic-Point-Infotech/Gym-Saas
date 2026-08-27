import { apiClient } from './api-client'
import type { ApiResponse, LoginCredentials, AuthResponse, User } from '@/types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', credentials)
  },

  async logout(): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/api/auth/logout')
  },

  async getSession(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>('/api/auth/session')
  },
}
