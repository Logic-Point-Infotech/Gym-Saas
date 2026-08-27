import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/attendance — List recent check-in/out records
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const records = await prisma.attendance.findMany({
      take: limit,
      orderBy: { checkInAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true, role: true }
        }
      }
    })

    const totalToday = await prisma.attendance.count({
      where: {
        checkInAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })

    return successResponse({ records, totalToday })
  } catch (error) {
    console.error('GET /api/attendance error:', error)
    return errorResponse('Failed to fetch attendance records', 500)
  }
}

// POST /api/attendance — Record member QR / Manual Check-in
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, deviceType, notes } = body

    if (!userId) {
      return errorResponse('User ID is required for check-in', 400)
    }

    // Check if member exists
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return errorResponse('User not found', 404)
    }

    // Record check-in
    const record = await prisma.attendance.create({
      data: {
        userId,
        deviceType: deviceType || 'QR_SCANNER',
        notes: notes || 'Check-in recorded via Admin Portal',
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } }
      }
    })

    return successResponse(record, 'Check-in recorded successfully', 201)
  } catch (error) {
    console.error('POST /api/attendance error:', error)
    return errorResponse('Failed to record check-in', 500)
  }
}
