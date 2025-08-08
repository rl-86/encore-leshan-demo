import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/error-helper';

// POST request to add a bootstrap config for a specific client
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const body = await request.json();
    const { clientId } = await params;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bsclients/${clientId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to add bootstrap config');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: `Bootstrap config added for ${clientId}`,
      clientId,
      ...result,
    });
  } catch (error) {
    // Error handling using helper function
    return createErrorResponse(`Failed to add bootstrap config`, error);
  }
}
// DELETE request to remove a bootstrap config for a specific client
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bsclients/${clientId}`,
      {
        method: 'DELETE',
        headers: {
          'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete bootstrap config for ${clientId}`);
    }

    return NextResponse.json({
      success: true,
      message: `Bootstrap config deleted for ${clientId}`,
      clientId,
    });
  } catch (error) {
    // Error handling using helper function
    return createErrorResponse(`Failed to delete bootstrap config`, error);
  }
}
