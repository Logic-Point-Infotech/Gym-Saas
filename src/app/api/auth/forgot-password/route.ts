import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return errorResponse('Please provide a valid email address', 422)
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't leak user existence for security, but return successful message
      return successResponse(
        null,
        'If an account exists with this email, password reset instructions have been sent.'
      )
    }

    return successResponse(
      { email: user.email },
      'Password reset instructions have been sent to your email.'
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return errorResponse('Failed to process password reset request', 500)
  }
}
