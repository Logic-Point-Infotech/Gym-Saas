import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { updateMembershipSchema } from '@/lib/validators/membership'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateMembershipSchema.safeParse(body)
    if (!parsed.success) return errorResponse('Validation failed', 422)

    const existing = await prisma.membership.findFirst({ where: { id, isDeleted: false } })
    if (!existing) return errorResponse('Membership not found', 404)

    const membership = await prisma.membership.update({
      where: { id },
      data: {
        ...parsed.data,
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
      },
      include: { client: { select: { id: true, name: true, email: true } } },
    })

    return successResponse(membership, 'Membership updated successfully')
  } catch (error) {
    console.error('PUT /api/memberships/[id] error:', error)
    return errorResponse('Failed to update membership', 500)
  }
}
