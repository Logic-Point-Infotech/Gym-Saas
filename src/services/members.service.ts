import { apiClient } from './api-client'
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  User,
  UserWithRelations,
  CreateMemberInput,
  UpdateMemberInput,
} from '@/types'

export const membersService = {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>('/api/members', params as Record<string, unknown>)
  },

  async getById(id: string): Promise<ApiResponse<UserWithRelations>> {
    return apiClient.get<ApiResponse<UserWithRelations>>(`/api/members/${id}`)
  },

  async create(data: CreateMemberInput): Promise<ApiResponse<User>> {
    return apiClient.post<ApiResponse<User>>('/api/members', data)
  },

  async update(id: string, data: UpdateMemberInput): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>(`/api/members/${id}`, data)
  },

  async delete(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/api/members/${id}`)
  },
}
