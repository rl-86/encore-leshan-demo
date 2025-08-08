import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/error-helper';

// GET request to fetch all connected clients
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clients`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch clients from Encore API');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      clients: data.clients || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return createErrorResponse('Failed to fetch all connected clients', error);
  }
}
