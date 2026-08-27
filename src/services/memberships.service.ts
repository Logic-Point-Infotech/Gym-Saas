import { apiClient } from './api-client'
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Membership,
  CreateMembershipInput,
  UpdateMembershipInput,
} from '@/types'

export const membershipsService = {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Membership>> {
    return apiClient.get<PaginatedResponse<Membership>>('/api/memberships', params as Record<string, unknown>)
  },

  async getById(id: string): Promise<ApiResponse<Membership>> {
    return apiClient.get<ApiResponse<Membership>>(`/api/memberships/${id}`)
  },

  async create(data: CreateMembershipInput): Promise<ApiResponse<Membership>> {
    return apiClient.post<ApiResponse<Membership>>('/api/memberships', data)
  },

  async update(id: string, data: UpdateMembershipInput): Promise<ApiResponse<Membership>> {
    return apiClient.put<ApiResponse<Membership>>(`/api/memberships/${id}`, data)
  },
}
