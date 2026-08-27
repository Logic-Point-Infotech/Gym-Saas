'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { allocationsService } from '@/services/allocations.service'
import { queryKeys } from '@/lib/query-keys'

export function useAllocations() {
  return useQuery({
    queryKey: ['allocations', 'list'],
    queryFn: async () => {
      const res = await allocationsService.getAll()
      return res.data || []
    },
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateAllocation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { trainerId: string; clientId: string }) =>
      allocationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
      queryClient.invalidateQueries({ queryKey: ['members'] })
      queryClient.invalidateQueries({ queryKey: ['trainers'] })
    },
  })
}

export function useDeleteAllocation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => allocationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
      queryClient.invalidateQueries({ queryKey: ['members'] })
      queryClient.invalidateQueries({ queryKey: ['trainers'] })
    },
  })
}
