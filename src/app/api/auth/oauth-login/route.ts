import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { signToken, hashPassword, COOKIE_NAME } from '@/lib/auth'
import { errorResponse } from '@/lib/api-response'
import { Role } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { email, name, avatarUrl } = await request.json()

    if (!email) {
      return errorResponse('Email is required for Google OAuth', 422)
    }

    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Auto-register Google user as Admin
      const today = new Date()
      const dayStr = String(today.getDate()).padStart(2, '0')
      const monthStr = String(today.getMonth() + 1).padStart(2, '0')
      const memberId = `vyayam_${dayStr}${monthStr}`
      const dummyPasswordHash = await hashPassword(Math.random().toString(36) + 'GoogleAuth@2026')

      user = await prisma.user.create({
        data: {
          name: name || 'Google User',
          email,
          passwordHash: dummyPasswordHash,
          memberId,
          role: 'ADMIN',
          status: 'ACTIVE',
          avatarUrl: avatarUrl || null,
        },
      })
    }

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
        message: 'OAuth login successful',
      },
      { status: 200 }
    )

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('OAuth backend error:', error)
    return errorResponse('Failed to authenticate Google user', 500)
  }
}
