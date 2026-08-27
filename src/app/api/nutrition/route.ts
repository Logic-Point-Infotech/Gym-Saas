import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { createNutritionLogSchema } from '@/lib/validators/nutrition'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { parsePaginationParams, paginationArgs } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { page, pageSize } = parsePaginationParams(request.nextUrl.searchParams)
    const clientId = request.nextUrl.searchParams.get('clientId') || undefined

    const where = { ...(clientId && { clientId }) }

    const [logs, total] = await Promise.all([
      prisma.dailyNutrition.findMany({
        where,
        include: { client: { select: { id: true, name: true, email: true } } },
        orderBy: { loggedAt: 'desc' },
        ...paginationArgs(page, pageSize),
      }),
      prisma.dailyNutrition.count({ where }),
    ])

    return paginatedResponse(logs, total, page, pageSize)
  } catch (error) {
    console.error('GET /api/nutrition error:', error)
    return errorResponse('Failed to fetch nutrition logs', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createNutritionLogSchema.safeParse(body)
    if (!parsed.success) return errorResponse('Validation failed', 422)

    const log = await prisma.dailyNutrition.create({
      data: parsed.data,
      include: { client: { select: { id: true, name: true } } },
    })

    return successResponse(log, 'Nutrition log created', 201)
  } catch (error) {
    console.error('POST /api/nutrition error:', error)
    return errorResponse('Failed to create nutrition log', 500)
  }
}
