import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { comparePassword, signToken, COOKIE_NAME } from '@/lib/auth'
import { loginSchema } from '@/lib/validators/auth'
import { errorResponse } from '@/lib/api-response'
import { Role } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path.join('.')
        if (!fieldErrors[field]) fieldErrors[field] = []
        fieldErrors[field].push(issue.message)
      }
      return errorResponse('Validation failed', 422, fieldErrors)
    }

    const { email, password } = parsed.data
    console.log('[Login API] Input email:', email)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })
    console.log('[Login API] User found:', user ? { id: user.id, email: user.email, role: user.role, isDeleted: (user as any).isDeleted } : 'null')

    if (!user || (user as any).isDeleted) {
      return errorResponse('Invalid email or password', 401)
    }

    // Only allow admin login
    if (user.role !== 'ADMIN') {
      console.log('[Login API] Non-admin user attempted login:', user.role)
      return errorResponse('Access denied. Admin portal only.', 403)
    }

    // Verify password
    const isValid = await comparePassword(password, user.passwordHash)
    console.log('[Login API] Password isValid:', isValid)
    if (!isValid) {
      return errorResponse('Invalid email or password', 401)
    }

    // Check account status
    if (user.status !== 'ACTIVE') {
      return errorResponse('Account is suspended. Contact support.', 403)
    }

    // Generate JWT
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
      name: user.name,
    })

    // Build response with user data (omit password)
    const { passwordHash: _, ...safeUser } = user

    const response = NextResponse.json(
      {
        success: true,
        data: { user: safeUser, token },
        message: 'Login successful',
      },
      { status: 200 }
    )

    // Set HTTP-only cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return errorResponse('Internal server error', 500)
  }
}
