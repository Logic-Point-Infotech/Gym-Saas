import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { createMemberSchema } from '@/lib/validators/member'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { parsePaginationParams, paginationArgs } from '@/lib/utils'

// GET /api/members — List all clients with pagination, search, sort
export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, search, sortBy, sortOrder } = parsePaginationParams(
      request.nextUrl.searchParams
    )
    const status = request.nextUrl.searchParams.get('status') || undefined

    const where = {
      role: 'CLIENT' as const,
      isDeleted: false,
      ...(search && {
        OR: [
          { memberId: { contains: search } },
          { name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ],
      }),
      ...(status && { status: status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' }),
    }

    const [members, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, memberId: true, name: true, email: true, phone: true, gender: true,
          dateOfBirth: true, role: true, heightCm: true, weightKg: true,
          status: true, avatarUrl: true, createdAt: true, updatedAt: true,
          memberships: {
            where: { isDeleted: false },
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { id: true, planName: true, status: true, startDate: true, endDate: true },
          },
          clientAllocations: {
            where: { isActive: true },
            take: 1,
            select: { trainer: { select: { id: true, name: true } } },
          },
        },
        orderBy: { [sortBy === 'name' || sortBy === 'email' || sortBy === 'createdAt' || sortBy === 'memberId' ? sortBy : 'createdAt']: sortOrder },
        ...paginationArgs(page, pageSize),
      }),
      prisma.user.count({ where }),
    ])

    return paginatedResponse(members, total, page, pageSize)
  } catch (error) {
    console.error('GET /api/members error:', error)
    return errorResponse('Failed to fetch members', 500)
  }
}

// POST /api/members — Create a new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createMemberSchema.safeParse(body)

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

    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return errorResponse('Email already exists', 409)
    }

    const passwordHash = await hashPassword(password)

    // Generate unique memberId in vyayam_DDMM format (e.g. vyayam_0410)
    const dob = data.dateOfBirth ? new Date(data.dateOfBirth) : new Date()
    const dayStr = String(dob.getDate()).padStart(2, '0')
    const monthStr = String(dob.getMonth() + 1).padStart(2, '0')
    let baseMemberId = `vyayam_${dayStr}${monthStr}`

    // Ensure uniqueness
    let generatedMemberId = baseMemberId
    let count = 1
    while (await prisma.user.findFirst({ where: { memberId: generatedMemberId } })) {
      count++
      generatedMemberId = `${baseMemberId}_${count}`
    }

    const member = await prisma.user.create({
      data: {
        ...data,
        memberId: generatedMemberId,
        passwordHash,
        role: 'CLIENT',
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
      select: {
        id: true, memberId: true, name: true, email: true, phone: true, gender: true,
        dateOfBirth: true, role: true, heightCm: true, weightKg: true,
        status: true, createdAt: true,
      },
    })

    // Trigger Python FastAPI AI Health Risk Assessment (Port 8000)
    try {
      fetch('http://localhost:8000/api/v1/ai/member/health-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: 28,
          bmi: (data.weightKg && data.heightCm) ? Math.round(data.weightKg / Math.pow(data.heightCm / 100, 2)) : 22.5,
          systolic_bp: 120,
          diastolic_bp: 80
        })
      }).catch(err => console.log('Python FastAPI notification dispatch (port 8000):', err.message))
    } catch (e) {}

    // Trigger Express Standalone Backend Webhook (Port 5000)
    try {
      fetch('http://localhost:5000/api/express/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'member.created',
          payload: { memberId: member.id, name: member.name, email: member.email }
        })
      }).catch(err => console.log('Express backend webhook dispatch (port 5000):', err.message))
    } catch (e) {}

    return successResponse(member, 'Member created successfully', 201)
  } catch (error) {
    console.error('POST /api/members error:', error)
    return errorResponse('Failed to create member', 500)
  }
}
