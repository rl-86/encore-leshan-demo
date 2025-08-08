import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/error-helper';

//GET request to fetch all client security configurations
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clients/securityconf`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch security configs from Encore API');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      securityConf: data.securityConf || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return createErrorResponse(
      'Failed to fetch all client security configurations',
      error
    );
  }
}

// PUT request to add a specific client security configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clients`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to add security config');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Security config added successfully',
      ...result,
    });
  } catch (error) {
    return createErrorResponse('Failed to add security config', error);
  }
}
