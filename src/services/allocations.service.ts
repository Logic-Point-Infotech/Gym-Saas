import { apiClient } from './api-client'
import type { ApiResponse } from '@/types'

export interface Allocation {
  id: string
  trainerId: string
  clientId: string
  allocatedAt: string
  isActive: boolean
  trainer: {
    id: string
    name: string
    email: string
    specialization: string | null
    avatarUrl: string | null
  }
  client: {
    id: string
    name: string
    email: string
    status: string
    avatarUrl: string | null
  }
}

export const allocationsService = {
  async getAll(): Promise<ApiResponse<Allocation[]>> {
    return apiClient.get<ApiResponse<Allocation[]>>('/api/allocations')
  },

  async create(data: { trainerId: string; clientId: string }): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>('/api/allocations', data)
  },

  async delete(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete<ApiResponse<any>>(`/api/allocations?id=${id}`)
  },
}
