import { SignJWT, jwtVerify } from 'jose'
import { hash, compare } from 'bcryptjs'
import { cookies } from 'next/headers'
import { Role } from '@/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface JWTPayload {
  userId: string
  email: string
  role: Role
  name: string
}

const COOKIE_NAME = 'admin-token'
const SALT_ROUNDS = 12

// ---------------------------------------------------------------------------
// Secret key — cached as Uint8Array for jose
// ---------------------------------------------------------------------------
function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET environment variable is not set')
  return new TextEncoder().encode(secret)
}

// ---------------------------------------------------------------------------
// JWT helpers
// ---------------------------------------------------------------------------

/** Create a signed JWT that expires in 24 hours */
export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecretKey())
}

/** Verify a JWT and return the decoded payload */
export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getSecretKey())
  return payload as unknown as JWTPayload
}

// ---------------------------------------------------------------------------
// Password helpers
// ---------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS)
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword)
}

// ---------------------------------------------------------------------------
// Session helpers (server-side only)
// ---------------------------------------------------------------------------

/** Read the JWT from the cookie jar and verify it. Returns null on failure. */
export async function getSession(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    return await verifyToken(token)
  } catch {
    return null
  }
}

/** Extract JWT from an Authorization header (Bearer scheme) and verify. */
export async function getSessionFromHeader(
  authHeader: string | null
): Promise<JWTPayload | null> {
  try {
    if (!authHeader?.startsWith('Bearer ')) return null
    const token = authHeader.slice(7)
    return await verifyToken(token)
  } catch {
    return null
  }
}

export { COOKIE_NAME }
