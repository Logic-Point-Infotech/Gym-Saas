import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, signToken, COOKIE_NAME } from '@/lib/auth'
import { errorResponse } from '@/lib/api-response'
import { Role } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password) {
      return errorResponse('Name, email, and password are required', 422)
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return errorResponse('An account with this email already exists', 409)
    }

    const passwordHash = await hashPassword(password)
    
    // Auto-generate Member ID
    const today = new Date()
    const dayStr = String(today.getDate()).padStart(2, '0')
    const monthStr = String(today.getMonth() + 1).padStart(2, '0')
    let baseMemberId = `vyayam_${dayStr}${monthStr}`
    let memberId = baseMemberId
    let count = 1
    while (await prisma.user.findFirst({ where: { memberId } })) {
      count++
      memberId = `${baseMemberId}_${count}`
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        memberId,
        role: role === 'TRAINER' ? 'TRAINER' : 'ADMIN',
        status: 'ACTIVE',
      },
    })

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
      name: user.name,
    })

    const { passwordHash: _, ...safeUser } = user

    const response = NextResponse.json(
      {
        success: true,
        data: { user: safeUser, token },
        message: 'Account created successfully',
      },
      { status: 201 }
    )

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return errorResponse(
      (error as Error)?.message || 'Failed to create account. Check database connection.',
      500
    )
  }
}
