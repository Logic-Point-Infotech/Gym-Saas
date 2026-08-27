export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
  },
  members: {
    all: ['members'] as const,
    list: (params: Record<string, unknown>) =>
      ['members', 'list', params] as const,
    detail: (id: string) => ['members', 'detail', id] as const,
  },
  memberships: {
    all: ['memberships'] as const,
    list: (params: Record<string, unknown>) =>
      ['memberships', 'list', params] as const,
    detail: (id: string) => ['memberships', 'detail', id] as const,
  },
  trainers: {
    all: ['trainers'] as const,
    list: (params: Record<string, unknown>) =>
      ['trainers', 'list', params] as const,
    detail: (id: string) => ['trainers', 'detail', id] as const,
  },
  allocations: {
    all: ['allocations'] as const,
    list: (params: Record<string, unknown>) =>
      ['allocations', 'list', params] as const,
  },
  healthMetrics: {
    all: ['healthMetrics'] as const,
    list: (params: Record<string, unknown>) =>
      ['healthMetrics', 'list', params] as const,
    byClient: (clientId: string) =>
      ['healthMetrics', 'client', clientId] as const,
  },
  nutrition: {
    all: ['nutrition'] as const,
    list: (params: Record<string, unknown>) =>
      ['nutrition', 'list', params] as const,
    byClient: (clientId: string) =>
      ['nutrition', 'client', clientId] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: (params: Record<string, unknown>) =>
      ['notifications', 'list', params] as const,
  },
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
    membershipGrowth: ['dashboard', 'membershipGrowth'] as const,
    revenueTrend: ['dashboard', 'revenueTrend'] as const,
  },
} as const
