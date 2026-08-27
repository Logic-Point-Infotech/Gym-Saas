import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { createTrainerSchema } from '@/lib/validators/trainer'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { parsePaginationParams, paginationArgs } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, search, sortBy, sortOrder } = parsePaginationParams(request.nextUrl.searchParams)

    const where = {
      role: 'TRAINER' as const,
      isDeleted: false,
      ...(search && {
        OR: [{ name: { contains: search } }, { email: { contains: search } }, { specialization: { contains: search } }],
      }),
    }

    const [trainers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, phone: true, specialization: true,
          experience: true, status: true, avatarUrl: true, createdAt: true,
          _count: { select: { trainerAllocations: { where: { isActive: true } } } },
        },
        orderBy: { [sortBy === 'name' || sortBy === 'experience' ? sortBy : 'createdAt']: sortOrder },
        ...paginationArgs(page, pageSize),
      }),
      prisma.user.count({ where }),
    ])

    return paginatedResponse(trainers, total, page, pageSize)
  } catch (error) {
    console.error('GET /api/trainers error:', error)
    return errorResponse('Failed to fetch trainers', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createTrainerSchema.safeParse(body)
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path.join('.')
        if (!fieldErrors[field]) fieldErrors[field] = []
        fieldErrors[field].push(issue.message)
      }
      return errorResponse('Validation failed', 422, fieldErrors)
    }

    const { password, ...data } = parsed.data
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) return errorResponse('Email already exists', 409)

    const passwordHash = await hashPassword(password)
    const trainer = await prisma.user.create({
      data: { ...data, passwordHash, role: 'TRAINER' },
      select: { id: true, name: true, email: true, phone: true, specialization: true, experience: true, status: true, createdAt: true },
    })

    return successResponse(trainer, 'Trainer created successfully', 201)
  } catch (error) {
    console.error('POST /api/trainers error:', error)
    return errorResponse('Failed to create trainer', 500)
  }
}
