import { apiClient } from './api-client'
import type { ApiResponse } from '@/types'

export interface GymSettingsData {
  gymName: string
  gymAddress: string
  gymPhone: string
  notificationAlerts: string
  billingCurrency: string
}

export const settingsService = {
  async get(): Promise<ApiResponse<GymSettingsData>> {
    return apiClient.get<ApiResponse<GymSettingsData>>('/api/settings')
  },

  async update(data: Partial<GymSettingsData>): Promise<ApiResponse<any>> {
    return apiClient.put<ApiResponse<any>>('/api/settings', data)
  },
}
