'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { settingsService, type GymSettingsData } from '@/services/settings.service'

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await settingsService.get()
      return res.data!
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<GymSettingsData>) => settingsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}
