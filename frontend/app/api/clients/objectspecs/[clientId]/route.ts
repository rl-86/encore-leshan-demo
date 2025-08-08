import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/error-helper';

// GET request to fetch object specifications for a specific client
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/objectspecs/${clientId}`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch object specs for client ${clientId} from Encore API`
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      objectSpecs: data.objectSpecs || {},
      clientId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return createErrorResponse(
      `Failed to fetch client object specs for`,
      error
    );
  }
}
