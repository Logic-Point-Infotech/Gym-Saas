// ---------------------------------------------------------------------------
// Custom API error classes for consistent error handling
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Authentication required') {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Access denied') {
    super(message, 403)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends ApiError {
  public readonly errors: Record<string, string[]>

  constructor(message = 'Validation failed', errors: Record<string, string[]> = {}) {
    super(message, 422)
    this.name = 'ValidationError'
    this.errors = errors
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource already exists') {
    super(message, 409)
    this.name = 'ConflictError'
  }
}
