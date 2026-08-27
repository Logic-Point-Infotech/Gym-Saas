import { z } from 'zod'

export const createMemberSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  phone: z.string().max(20).optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  dateOfBirth: z.string().optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  heightCm: z
    .number()
    .positive('Height must be positive')
    .max(300, 'Invalid height')
    .optional()
    .or(z.nan())
    .transform((v) => (Number.isNaN(v) ? undefined : v)),
  weightKg: z
    .number()
    .positive('Weight must be positive')
    .max(500, 'Invalid weight')
    .optional()
    .or(z.nan())
    .transform((v) => (Number.isNaN(v) ? undefined : v)),
})

export const updateMemberSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  dateOfBirth: z.string().optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  heightCm: z
    .number()
    .positive()
    .max(300)
    .optional()
    .or(z.nan())
    .transform((v) => (Number.isNaN(v) ? undefined : v)),
  weightKg: z
    .number()
    .positive()
    .max(500)
    .optional()
    .or(z.nan())
    .transform((v) => (Number.isNaN(v) ? undefined : v)),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
})

export type CreateMemberInput = z.infer<typeof createMemberSchema>
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>
