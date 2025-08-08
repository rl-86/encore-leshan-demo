import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/error-helper';

// GET request to fetch all bootstrap configs
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bsclients`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch bootstrap configs from Encore API');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      bsClients: data.bsClients || {},
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Error handling using helper function
    return createErrorResponse('Failed to fetch bootstrap configs', error);
  }
}
