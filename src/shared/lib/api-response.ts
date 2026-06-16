import { NextResponse } from "next/server";
import { ZodError } from "zod";

/** Consistent API response envelope used by every route handler. */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    details?: unknown;
  };
}

export function ok<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T): NextResponse<ApiSuccess<T>> {
  return ok(data, 201);
}

export function fail(
  message: string,
  status = 400,
  details?: unknown
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error: { message, details } },
    { status }
  );
}

/**
 * Wraps a route handler with consistent error handling so individual routes
 * stay thin and never leak stack traces to clients.
 */
export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 400, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function handleRoute<T>(
  fn: () => Promise<NextResponse<T>>
): Promise<NextResponse> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof HttpError) {
      return fail(error.message, error.status, error.details);
    }
    if (error instanceof ZodError) {
      return fail("Validation failed", 400, error.flatten());
    }
    console.error("[api] Unhandled error:", error);
    return fail("Internal server error", 500);
  }
}
