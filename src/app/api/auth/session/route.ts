import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return errorResponse('Not authenticated', 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return errorResponse('User not found', 404)
    }

    return NextResponse.json(
      { success: true, data: user, message: 'Session valid' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Session error:', error)
    return errorResponse('Internal server error', 500)
  }
}
