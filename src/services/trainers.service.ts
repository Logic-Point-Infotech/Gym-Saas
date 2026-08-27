import { apiClient } from './api-client'
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  User,
  CreateTrainerInput,
  UpdateTrainerInput,
} from '@/types'

export const trainersService = {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>('/api/trainers', params as Record<string, unknown>)
  },

  async getById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>(`/api/trainers/${id}`)
  },

  async create(data: CreateTrainerInput): Promise<ApiResponse<User>> {
    return apiClient.post<ApiResponse<User>>('/api/trainers', data)
  },

  async update(id: string, data: UpdateTrainerInput): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>(`/api/trainers/${id}`, data)
  },

  async delete(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/api/trainers/${id}`)
  },
}
