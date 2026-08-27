import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { gymName, startDate, endDate, durationMonths, isCurrent } = body

    if (!gymName || !startDate) {
      return errorResponse('Gym name and start date are required', 400)
    }

    // Find member by id or memberId
    const member = await prisma.user.findFirst({
      where: {
        role: 'CLIENT',
        isDeleted: false,
        OR: [{ id }, { memberId: id }],
      },
      select: { id: true },
    })

    if (!member) return errorResponse('Member not found', 404)

    const gymHistory = await prisma.gymHistory.create({
      data: {
        clientId: member.id,
        gymName,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        durationMonths: durationMonths ? Number(durationMonths) : null,
        isCurrent: Boolean(isCurrent),
      },
    })

    return successResponse(gymHistory, 'Gym history added successfully', 201)
  } catch (error) {
    console.error('POST /api/members/[id]/gym-history error:', error)
    return errorResponse('Failed to add gym history', 500)
  }
}
