import { z } from 'zod'

export const createTrainerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  phone: z.string().max(20).optional().or(z.literal('')),
  specialization: z.string().max(100).optional().or(z.literal('')),
  experience: z
    .number()
    .int()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Invalid experience')
    .optional()
    .or(z.nan())
    .transform((v) => (Number.isNaN(v) ? undefined : v)),
})

export const updateTrainerSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional().or(z.literal('')),
  specialization: z.string().max(100).optional().or(z.literal('')),
  experience: z
    .number()
    .int()
    .min(0)
    .max(50)
    .optional()
    .or(z.nan())
    .transform((v) => (Number.isNaN(v) ? undefined : v)),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
})

export type CreateTrainerInput = z.infer<typeof createTrainerSchema>
export type UpdateTrainerInput = z.infer<typeof updateTrainerSchema>
