import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { createHealthMetricSchema } from '@/lib/validators/health-metric'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { parsePaginationParams, paginationArgs } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { page, pageSize } = parsePaginationParams(request.nextUrl.searchParams)
    const clientId = request.nextUrl.searchParams.get('clientId') || undefined

    const where = { ...(clientId && { clientId }) }

    const [metrics, total] = await Promise.all([
      prisma.clientHealthMetric.findMany({
        where,
        include: { client: { select: { id: true, name: true, email: true } } },
        orderBy: { recordedAt: 'desc' },
        ...paginationArgs(page, pageSize),
      }),
      prisma.clientHealthMetric.count({ where }),
    ])

    const parsedMetrics = metrics.map((m) => ({
      ...m,
      bloodReportJson: m.bloodReportJson ? JSON.parse(m.bloodReportJson) : null,
    }))

    return paginatedResponse(parsedMetrics, total, page, pageSize)
  } catch (error) {
    console.error('GET /api/health-metrics error:', error)
    return errorResponse('Failed to fetch health metrics', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createHealthMetricSchema.safeParse(body)
    if (!parsed.success) return errorResponse('Validation failed', 422)

    const metric = await prisma.clientHealthMetric.create({
      data: {
        clientId: parsed.data.clientId,
        weightKg: parsed.data.weightKg,
        bmi: parsed.data.bmi,
        bloodReportJson: parsed.data.bloodReportJson
          ? JSON.stringify(parsed.data.bloodReportJson)
          : null,
        notes: parsed.data.notes,
      },
      include: { client: { select: { id: true, name: true } } },
    })

    const parsedMetric = {
      ...metric,
      bloodReportJson: metric.bloodReportJson ? JSON.parse(metric.bloodReportJson) : null,
    }

    return successResponse(parsedMetric, 'Health metric recorded', 201)
  } catch (error) {
    console.error('POST /api/health-metrics error:', error)
    return errorResponse('Failed to create health metric', 500)
  }
}

