import { z } from 'zod'

export const createMembershipSchema = z
  .object({
    clientId: z.string().min(1, 'Client is required'),
    planName: z.string().min(1, 'Plan name is required'),
    amount: z.number().min(0, 'Amount must be positive'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine(
    (data) => new Date(data.endDate) > new Date(data.startDate),
    { message: 'End date must be after start date', path: ['endDate'] }
  )

export const updateMembershipSchema = z.object({
  status: z.enum(['ACTIVE', 'EXPIRED', 'FROZEN']).optional(),
  endDate: z.string().optional(),
  notes: z.string().max(1000).optional().or(z.literal('')),
})

export type CreateMembershipInput = z.infer<typeof createMembershipSchema>
export type UpdateMembershipInput = z.infer<typeof updateMembershipSchema>
