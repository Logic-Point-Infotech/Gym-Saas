'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { membershipsService } from '@/services/memberships.service'
import { queryKeys } from '@/lib/query-keys'
import type { PaginationParams, CreateMembershipInput, UpdateMembershipInput } from '@/types'

export function useMemberships(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.memberships.list(params as Record<string, unknown>),
    queryFn: () => membershipsService.getAll(params),
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateMembership() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMembershipInput) => membershipsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all })
    },
  })
}

export function useUpdateMembership() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMembershipInput }) =>
      membershipsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all })
    },
  })
}
