'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { nutritionService } from '@/services/nutrition.service'
import { queryKeys } from '@/lib/query-keys'
import type { PaginationParams, CreateNutritionLogInput } from '@/types'

export function useNutritionLogs(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.nutrition.list(params as Record<string, unknown>),
    queryFn: () => nutritionService.getAll(params),
    staleTime: 2 * 60 * 1000,
  })
}

export function useClientNutrition(clientId: string) {
  return useQuery({
    queryKey: queryKeys.nutrition.byClient(clientId),
    queryFn: () => nutritionService.getByClientId(clientId),
    enabled: !!clientId,
  })
}

export function useCreateNutritionLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateNutritionLogInput) => nutritionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.all })
    },
  })
}
