'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { healthMetricsService } from '@/services/health-metrics.service'
import { queryKeys } from '@/lib/query-keys'
import type { PaginationParams, CreateHealthMetricInput } from '@/types'

export function useHealthMetrics(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.healthMetrics.list(params as Record<string, unknown>),
    queryFn: () => healthMetricsService.getAll(params),
    staleTime: 2 * 60 * 1000,
  })
}

export function useClientHealthMetrics(clientId: string) {
  return useQuery({
    queryKey: queryKeys.healthMetrics.byClient(clientId),
    queryFn: () => healthMetricsService.getByClientId(clientId),
    enabled: !!clientId,
  })
}

export function useCreateHealthMetric() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateHealthMetricInput) => healthMetricsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.healthMetrics.all })
    },
  })
}
