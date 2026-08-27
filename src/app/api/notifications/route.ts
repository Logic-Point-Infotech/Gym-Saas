import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { parsePaginationParams, paginationArgs } from '@/lib/utils'

// GET /api/notifications — List all sent notifications
export async function GET(request: NextRequest) {
  try {
    const { page, pageSize } = parsePaginationParams(request.nextUrl.searchParams)

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        include: {
          sentBy: { select: { id: true, name: true, email: true } },
          recipients: {
            select: {
              id: true,
              userId: true,
              readAt: true,
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        ...paginationArgs(page, pageSize),
      }),
      prisma.notification.count(),
    ])

    return paginatedResponse(notifications, total, page, pageSize)
  } catch (error) {
    console.error('GET /api/notifications error:', error)
    return errorResponse('Failed to fetch notifications', 500)
  }
}
