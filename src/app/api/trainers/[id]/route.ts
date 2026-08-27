import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { updateTrainerSchema } from '@/lib/validators/trainer'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const trainer = await prisma.user.findFirst({
      where: { id, role: 'TRAINER', isDeleted: false },
      select: {
        id: true, name: true, email: true, phone: true, specialization: true,
        experience: true, status: true, avatarUrl: true, createdAt: true, updatedAt: true,
        trainerAllocations: {
          where: { isActive: true },
          select: {
            id: true, allocatedAt: true,
            client: { select: { id: true, name: true, email: true, status: true, avatarUrl: true } },
          },
        },
      },
    })
    if (!trainer) return errorResponse('Trainer not found', 404)
    return successResponse(trainer)
  } catch (error) {
    console.error('GET /api/trainers/[id] error:', error)
    return errorResponse('Failed to fetch trainer', 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateTrainerSchema.safeParse(body)
    if (!parsed.success) return errorResponse('Validation failed', 422)

    const existing = await prisma.user.findFirst({ where: { id, role: 'TRAINER', isDeleted: false } })
    if (!existing) return errorResponse('Trainer not found', 404)

    const trainer = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: { id: true, name: true, email: true, phone: true, specialization: true, experience: true, status: true },
    })
    return successResponse(trainer, 'Trainer updated successfully')
  } catch (error) {
    console.error('PUT /api/trainers/[id] error:', error)
    return errorResponse('Failed to update trainer', 500)
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.user.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } })
    return successResponse(null, 'Trainer deleted successfully')
  } catch (error) {
    console.error('DELETE /api/trainers/[id] error:', error)
    return errorResponse('Failed to delete trainer', 500)
  }
}
