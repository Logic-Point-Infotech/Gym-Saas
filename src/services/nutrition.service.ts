import { apiClient } from './api-client'
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  NutritionLog,
  CreateNutritionLogInput,
} from '@/types'

export const nutritionService = {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<NutritionLog>> {
    return apiClient.get<PaginatedResponse<NutritionLog>>('/api/nutrition', params as Record<string, unknown>)
  },

  async getByClientId(clientId: string): Promise<ApiResponse<NutritionLog[]>> {
    return apiClient.get<ApiResponse<NutritionLog[]>>('/api/nutrition', { clientId })
  },

  async create(data: CreateNutritionLogInput): Promise<ApiResponse<NutritionLog>> {
    return apiClient.post<ApiResponse<NutritionLog>>('/api/nutrition', data)
  },
}
