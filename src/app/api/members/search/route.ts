import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q') || ''
    if (!q || q.trim().length < 1) {
      return successResponse([])
    }

    const query = q.trim()

    const members = await prisma.user.findMany({
      where: {
        role: 'CLIENT',
        isDeleted: false,
        OR: [
          { memberId: { contains: query } },
          { name: { contains: query } },
          { phone: { contains: query } },
          { email: { contains: query } },
        ],
      },
      select: {
        id: true,
        memberId: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        status: true,
        memberships: {
          where: { isDeleted: false },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { planName: true, status: true },
        },
        clientAllocations: {
          where: { isActive: true },
          take: 1,
          select: { trainer: { select: { name: true } } },
        },
      },
      take: 10,
    })

    return successResponse(members)
  } catch (error) {
    console.error('GET /api/members/search error:', error)
    return errorResponse('Failed to search members', 500)
  }
}
