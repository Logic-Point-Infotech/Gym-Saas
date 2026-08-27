import { apiClient } from './api-client'
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  HealthMetric,
  CreateHealthMetricInput,
} from '@/types'

export const healthMetricsService = {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<HealthMetric>> {
    return apiClient.get<PaginatedResponse<HealthMetric>>('/api/health-metrics', params as Record<string, unknown>)
  },

  async getByClientId(clientId: string): Promise<ApiResponse<HealthMetric[]>> {
    return apiClient.get<ApiResponse<HealthMetric[]>>(`/api/health-metrics`, { clientId })
  },

  async create(data: CreateHealthMetricInput): Promise<ApiResponse<HealthMetric>> {
    return apiClient.post<ApiResponse<HealthMetric>>('/api/health-metrics', data)
  },
}
