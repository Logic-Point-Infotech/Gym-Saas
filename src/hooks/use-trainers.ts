'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { trainersService } from '@/services/trainers.service'
import { queryKeys } from '@/lib/query-keys'
import type { PaginationParams, CreateTrainerInput, UpdateTrainerInput } from '@/types'

export function useTrainers(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.trainers.list(params as Record<string, unknown>),
    queryFn: () => trainersService.getAll(params),
    staleTime: 2 * 60 * 1000,
  })
}

export function useTrainer(id: string) {
  return useQuery({
    queryKey: queryKeys.trainers.detail(id),
    queryFn: () => trainersService.getById(id),
    enabled: !!id,
  })
}

export function useCreateTrainer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTrainerInput) => trainersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all })
    },
  })
}

export function useUpdateTrainer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTrainerInput }) =>
      trainersService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.trainers.detail(variables.id) })
    },
  })
}

export function useDeleteTrainer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => trainersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trainers.all })
    },
  })
}
