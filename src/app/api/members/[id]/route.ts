import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { updateMemberSchema } from '@/lib/validators/member'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/members/[id] — Get member details with all relations
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const member = await prisma.user.findFirst({
      where: {
        role: 'CLIENT',
        isDeleted: false,
        OR: [
          { id },
          { memberId: id },
        ],
      },
      select: {
        id: true, memberId: true, name: true, email: true, phone: true, gender: true,
        dateOfBirth: true, address: true, role: true, heightCm: true,
        weightKg: true, status: true, avatarUrl: true, createdAt: true, updatedAt: true,
        memberships: {
          where: { isDeleted: false },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true, planName: true, amount: true, startDate: true,
            endDate: true, status: true, createdAt: true, notes: true,
          },
        },
        clientAllocations: {
          orderBy: { allocatedAt: 'desc' },
          select: {
            id: true, allocatedAt: true, isActive: true,
            trainer: { select: { id: true, name: true, email: true, specialization: true, phone: true } },
          },
        },
        gymHistories: {
          orderBy: { startDate: 'desc' },
          select: {
            id: true, gymName: true, startDate: true, endDate: true,
            durationMonths: true, isCurrent: true, createdAt: true,
          },
        },
        documents: {
          orderBy: { uploadedAt: 'desc' },
          select: {
            id: true, title: true, fileUrl: true, fileType: true, uploadedAt: true,
          },
        },
        healthMetrics: {
          orderBy: { recordedAt: 'desc' },
          take: 20,
          select: {
            id: true, bmi: true, weightKg: true, bodyFatPercent: true,
            notes: true, recordedAt: true, bloodReportJson: true,
          },
        },
        nutritionLogs: {
          orderBy: { loggedAt: 'desc' },
          take: 30,
          select: {
            id: true, detectedFood: true, calories: true, protein: true,
            carbs: true, fats: true, mealType: true, loggedAt: true, imageUrl: true,
          },
        },
      },
    })

    if (!member) return errorResponse('Member not found', 404)
    return successResponse(member)
  } catch (error) {
    console.error('GET /api/members/[id] error:', error)
    return errorResponse('Failed to fetch member', 500)
  }
}

// PUT /api/members/[id] — Update member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateMemberSchema.safeParse(body)

    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path.join('.')
        if (!fieldErrors[field]) fieldErrors[field] = []
        fieldErrors[field].push(issue.message)
      }
      return errorResponse('Validation failed', 422, fieldErrors)
    }

    const existing = await prisma.user.findFirst({ where: { id, role: 'CLIENT', isDeleted: false } })
    if (!existing) return errorResponse('Member not found', 404)

    const data = parsed.data
    const member = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
      select: {
        id: true, name: true, email: true, phone: true, gender: true,
        status: true, heightCm: true, weightKg: true, updatedAt: true,
      },
    })

    return successResponse(member, 'Member updated successfully')
  } catch (error) {
    console.error('PUT /api/members/[id] error:', error)
    return errorResponse('Failed to update member', 500)
  }
}

// DELETE /api/members/[id] — Soft delete member
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.user.findFirst({ where: { id, role: 'CLIENT', isDeleted: false } })
    if (!existing) return errorResponse('Member not found', 404)

    await prisma.user.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    })

    return successResponse(null, 'Member deleted successfully')
  } catch (error) {
    console.error('DELETE /api/members/[id] error:', error)
    return errorResponse('Failed to delete member', 500)
  }
}
