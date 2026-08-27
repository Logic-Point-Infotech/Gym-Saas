import { z } from 'zod'

export const createNutritionLogSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  detectedFood: z.string().max(255).optional().or(z.literal('')),
  calories: z.number().min(0, 'Calories cannot be negative'),
  protein: z.number().min(0, 'Protein cannot be negative'),
  carbs: z.number().min(0, 'Carbs cannot be negative'),
  fats: z.number().min(0, 'Fats cannot be negative'),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export type CreateNutritionLogInput = z.infer<typeof createNutritionLogSchema>
