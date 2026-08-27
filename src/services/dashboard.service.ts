import { apiClient } from './api-client'
import type { ApiResponse, DashboardStats, ChartDataPoint } from '@/types'

export const dashboardService = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<ApiResponse<DashboardStats>>('/api/dashboard/stats')
  },

  async getMembershipGrowth(): Promise<ApiResponse<ChartDataPoint[]>> {
    return apiClient.get<ApiResponse<ChartDataPoint[]>>('/api/dashboard/membership-growth')
  },

  async getRevenueTrend(): Promise<ApiResponse<ChartDataPoint[]>> {
    return apiClient.get<ApiResponse<ChartDataPoint[]>>('/api/dashboard/revenue-trend')
  },
}
