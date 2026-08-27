import { z } from 'zod'

export const sendNotificationSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(5000, 'Message is too long'),
  type: z.enum([
    'RENEWAL_REMINDER',
    'EXPIRY_ALERT',
    'HOLIDAY_NOTICE',
    'MAINTENANCE',
    'GENERAL',
  ]),
  recipientIds: z
    .array(z.string())
    .min(1, 'At least one recipient is required'),
})

export type SendNotificationInput = z.infer<typeof sendNotificationSchema>
