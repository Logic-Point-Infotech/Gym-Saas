import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/allocations — Get all trainer-client allocations
export async function GET() {
  try {
    const allocations = await prisma.trainerAllocation.findMany({
      where: { isActive: true },
      include: {
        trainer: { select: { id: true, name: true, email: true, specialization: true, avatarUrl: true } },
        client: { select: { id: true, name: true, email: true, status: true, avatarUrl: true } },
      },
      orderBy: { allocatedAt: 'desc' },
    })
    return successResponse(allocations)
  } catch (error) {
    console.error('GET /api/allocations error:', error)
    return errorResponse('Failed to fetch allocations', 500)
  }
}

// POST /api/allocations — Assign trainer to client
export async function POST(request: NextRequest) {
  try {
    const { trainerId, clientId } = await request.json()
    if (!trainerId || !clientId) return errorResponse('trainerId and clientId are required', 422)

    // Deactivate existing allocation for this client
    await prisma.trainerAllocation.updateMany({
      where: { clientId, isActive: true },
      data: { isActive: false },
    })

    const allocation = await prisma.trainerAllocation.upsert({
      where: { trainerId_clientId: { trainerId, clientId } },
      update: { isActive: true, allocatedAt: new Date() },
      create: { trainerId, clientId },
      include: {
        trainer: { select: { id: true, name: true } },
        client: { select: { id: true, name: true } },
      },
    })

    return successResponse(allocation, 'Trainer assigned successfully', 201)
  } catch (error) {
    console.error('POST /api/allocations error:', error)
    return errorResponse('Failed to assign trainer', 500)
  }
}

// DELETE /api/allocations — Remove allocation
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const id = searchParams.get('id')
    if (!id) return errorResponse('Allocation ID is required', 422)

    await prisma.trainerAllocation.update({ where: { id }, data: { isActive: false } })
    return successResponse(null, 'Allocation removed successfully')
  } catch (error) {
    console.error('DELETE /api/allocations error:', error)
    return errorResponse('Failed to remove allocation', 500)
  }
}
