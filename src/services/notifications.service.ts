import { apiClient } from './api-client'
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Notification as AppNotification,
  SendNotificationInput,
} from '@/types'

export const notificationsService = {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<AppNotification>> {
    return apiClient.get<PaginatedResponse<AppNotification>>('/api/notifications', params as Record<string, unknown>)
  },

  async send(data: SendNotificationInput): Promise<ApiResponse<AppNotification>> {
    return apiClient.post<ApiResponse<AppNotification>>('/api/notifications/send', data)
  },
}
