import { NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// Standard API response helpers
// ---------------------------------------------------------------------------

interface SuccessBody<T> {
  success: true
  data: T
  message: string
}

interface ErrorBody {
  success: false
  message: string
  errors?: Record<string, string[]>
}

interface PaginationMeta {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface PaginatedBody<T> extends SuccessBody<T[]> {
  pagination: PaginationMeta
}

export function successResponse<T>(
  data: T,
  message = 'Success',
  status = 200
): NextResponse<SuccessBody<T>> {
  return NextResponse.json({ success: true, data, message }, { status })
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: Record<string, string[]>
): NextResponse<ErrorBody> {
  return NextResponse.json({ success: false, message, errors }, { status })
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
  message = 'Success'
): NextResponse<PaginatedBody<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    },
    { status: 200 }
  )
}
