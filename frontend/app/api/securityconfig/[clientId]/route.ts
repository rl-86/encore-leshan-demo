import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/error-helper';

// DELETE request to remove a specific client security configuration
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clients/${clientId}`,
      {
        method: 'DELETE',
        headers: {
          'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete client ${clientId}`);
    }

    return NextResponse.json({
      success: true,
      message: `Client ${clientId} deleted successfully`,
      clientId,
    });
  } catch (error) {
    return createErrorResponse(`Failed to DELETE client`, error);
  }
}
