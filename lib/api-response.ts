import { NextResponse } from 'next/server';

export function apiResponse<T>(
  data: T,
  status: number = 200,
  headers?: Record<string, string>
) {
  return NextResponse.json(data, { status, ...(headers && { headers }) });
}

export function apiError(
  message: string,
  status: number = 400,
  code?: string,
  details?: unknown
) {
  return NextResponse.json(
    {
      error: {
        message,
        code,
        details,
      },
    },
    { status }
  );
}

export function validationError(errors: Record<string, string[]>) {
  return NextResponse.json(
    {
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors,
      },
    },
    { status: 400 }
  );
}

export function unauthorizedError(message: string = 'Unauthorized') {
  return apiError(message, 401, 'UNAUTHORIZED');
}

export function notFoundError(message: string = 'Resource not found') {
  return apiError(message, 404, 'NOT_FOUND');
}

export function serverError(message: string = 'Internal server error') {
  return apiError(message, 500, 'INTERNAL_ERROR');
}
