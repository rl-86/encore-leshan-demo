import { NextResponse } from 'next/server';

export function createErrorResponse(
  message: string,
  error?: Error | unknown,
  status: number = 500
): NextResponse {
  console.error('API Error:', error);
  return NextResponse.json(
    {
      success: false,
      error: message,
      message: error instanceof Error ? error.message : 'Unknown error',
    },
    { status }
  );
}
