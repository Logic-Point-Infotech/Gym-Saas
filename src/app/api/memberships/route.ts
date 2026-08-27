import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { createMembershipSchema } from '@/lib/validators/membership'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { parsePaginationParams, paginationArgs } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, search, sortBy, sortOrder } = parsePaginationParams(request.nextUrl.searchParams)
    const status = request.nextUrl.searchParams.get('status') || undefined

    const where = {
      isDeleted: false,
      ...(status && { status: status as 'ACTIVE' | 'EXPIRED' | 'FROZEN' }),
      ...(search && {
        client: {
          OR: [{ name: { contains: search } }, { email: { contains: search } }],
        },
      }),
    }

    const [memberships, total] = await Promise.all([
      prisma.membership.findMany({
        where,
        include: { client: { select: { id: true, name: true, email: true, avatarUrl: true } } },
        orderBy: { [sortBy === 'startDate' || sortBy === 'endDate' || sortBy === 'amount' ? sortBy : 'createdAt']: sortOrder },
        ...paginationArgs(page, pageSize),
      }),
      prisma.membership.count({ where }),
    ])

    return paginatedResponse(memberships, total, page, pageSize)
  } catch (error) {
    console.error('GET /api/memberships error:', error)
    return errorResponse('Failed to fetch memberships', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createMembershipSchema.safeParse(body)
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path.join('.')
        if (!fieldErrors[field]) fieldErrors[field] = []
        fieldErrors[field].push(issue.message)
      }
      return errorResponse('Validation failed', 422, fieldErrors)
    }

    const { clientId, planName, amount, startDate, endDate } = parsed.data

    // Check client exists
    const client = await prisma.user.findFirst({ where: { id: clientId, role: 'CLIENT', isDeleted: false } })
    if (!client) return errorResponse('Client not found', 404)

    // Expire any existing active memberships
    await prisma.membership.updateMany({
      where: { clientId, status: 'ACTIVE' },
      data: { status: 'EXPIRED' },
    })

    const membership = await prisma.membership.create({
      data: { clientId, planName, amount, startDate: new Date(startDate), endDate: new Date(endDate), status: 'ACTIVE' },
      include: { client: { select: { id: true, name: true, email: true } } },
    })

    return successResponse(membership, 'Membership created successfully', 201)
  } catch (error) {
    console.error('POST /api/memberships error:', error)
    return errorResponse('Failed to create membership', 500)
  }
}
