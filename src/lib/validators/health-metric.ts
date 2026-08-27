import { z } from 'zod'

export const createHealthMetricSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  weightKg: z
    .number()
    .positive('Weight must be positive')
    .max(500, 'Invalid weight'),
  bmi: z.number().positive().max(100).optional(),
  bloodReportJson: z.record(z.string(), z.unknown()).optional(),
  notes: z.string().max(2000).optional().or(z.literal('')),
})

export type CreateHealthMetricInput = z.infer<typeof createHealthMetricSchema>
