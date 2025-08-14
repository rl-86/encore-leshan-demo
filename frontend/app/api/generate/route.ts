import { NextRequest, NextResponse } from 'next/server';
import { ConfigGeneratorParams, ConfigGenerationResponse } from '@/lib/types';
import { createErrorResponse } from '@/lib/error-helper';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ConfigGeneratorParams>;

    const params: ConfigGeneratorParams = {
      devicePrefix: String(body.devicePrefix ?? '').trim(),
      startNumber: Number(body.startNumber ?? 1),
      count: Number(body.count ?? 1),
      paddingLength: Number(body.paddingLength ?? 2),
    };

    // Basvalidering (samma regler som backend)
    if (
      !params.devicePrefix ||
      params.count < 1 ||
      params.count > 100 ||
      params.paddingLength < 1 ||
      params.paddingLength > 6
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const encoreResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/configs/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
        },
        body: JSON.stringify(params),
      }
    );

    const data = await encoreResponse.json().catch(() => ({}));

    if (!encoreResponse.ok) {
      return createErrorResponse(
        'Encore API request failed',
        data,
        encoreResponse.status
      );
    }
    // Backend returnerar { successful, total, results }
    const successful = Number(data.successful ?? 0);
    const total = Number(data.total ?? 0);
    const devices: string[] = Array.isArray(data.results)
      ? data.results.map((r: any) => r?.endpoint).filter(Boolean)
      : [];

    const res: ConfigGenerationResponse = {
      success: true,
      message: `Generated ${successful}/${total} configs`,
      generated: successful,
      failed: Math.max(0, total - successful),
      devices,
      source: 'manual',
    };

    return NextResponse.json(res);
  } catch (error) {
    return createErrorResponse('Configuration generation failed', error);
  }
}
