'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { membersService } from '@/services/members.service'
import { queryKeys } from '@/lib/query-keys'
import type { PaginationParams, CreateMemberInput, UpdateMemberInput } from '@/types'

export function useMembers(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.members.list(params as Record<string, unknown>),
    queryFn: () => membersService.getAll(params),
    staleTime: 2 * 60 * 1000,
  })
}

export function useMember(id: string) {
  return useQuery({
    queryKey: queryKeys.members.detail(id),
    queryFn: () => membersService.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMemberInput) => membersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.all })
    },
  })
}

export function useUpdateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberInput }) =>
      membersService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.members.detail(variables.id) })
    },
  })
}

export function useDeleteMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => membersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.all })
    },
  })
}
