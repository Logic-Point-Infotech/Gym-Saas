import type { ApiResponse, PaginatedResponse } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || ''

class ApiClientError extends Error {
  public status: number
  public errors?: Record<string, string[]>

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.errors = errors
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()

  if (!response.ok) {
    throw new ApiClientError(
      data.message || 'Request failed',
      response.status,
      data.errors
    )
  }

  return data as T
}

function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return ''
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  }
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

export const apiClient = {
  async get<T = ApiResponse>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    const response = await fetch(
      `${BASE_URL}${endpoint}${buildQueryString(params)}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    )
    return handleResponse<T>(response)
  },

  async post<T = ApiResponse>(
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    return handleResponse<T>(response)
  },

  async put<T = ApiResponse>(
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    return handleResponse<T>(response)
  },

  async delete<T = ApiResponse>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    return handleResponse<T>(response)
  },
}

export { ApiClientError }
export type { ApiResponse, PaginatedResponse }
