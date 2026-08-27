'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationsService } from '@/services/notifications.service'
import { queryKeys } from '@/lib/query-keys'
import type { PaginationParams, SendNotificationInput } from '@/types'

export function useNotifications(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.notifications.list(params as Record<string, unknown>),
    queryFn: () => notificationsService.getAll(params),
    staleTime: 1 * 60 * 1000,
  })
}

export function useSendNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SendNotificationInput) => notificationsService.send(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })
}
