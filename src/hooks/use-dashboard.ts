'use client'

import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard.service'
import { queryKeys } from '@/lib/query-keys'

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: async () => {
      const res = await dashboardService.getStats()
      return res.data!
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useMembershipGrowth() {
  return useQuery({
    queryKey: queryKeys.dashboard.membershipGrowth,
    queryFn: async () => {
      const res = await dashboardService.getMembershipGrowth()
      return res.data!
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useRevenueTrend() {
  return useQuery({
    queryKey: queryKeys.dashboard.revenueTrend,
    queryFn: async () => {
      const res = await dashboardService.getRevenueTrend()
      return res.data!
    },
    staleTime: 10 * 60 * 1000,
  })
}
