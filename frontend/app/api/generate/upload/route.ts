import { NextRequest, NextResponse } from 'next/server';
import { parseDeviceFile } from '@/lib/config-helpers';
import { FileUploadResponse } from '@/lib/types';
import { createErrorResponse } from '@/lib/error-helper';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type',
          message: 'Only .txt and .csv files are supported',
        },
        { status: 400 }
      );
    }

    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: 'File too large',
          message: 'File size must be less than 1MB',
        },
        { status: 400 }
      );
    }

    // Read and parse file content
    const fileContent = await file.text();
    const parsedResult = parseDeviceFile(fileContent);

    if (parsedResult.validDevices.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid devices found',
          message: 'The uploaded file contains no valid device names',
          details: parsedResult.invalidLines,
        },
        { status: 400 }
      );
    }

    // Generate configs via the generate endpoint
    const generateResponse = await fetch(
      `${request.nextUrl.origin}/api/configs/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
        },
        body: JSON.stringify({
          deviceList: parsedResult.validDevices,
          source: 'file',
        }),
      }
    );

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json();
      throw new Error(errorData.message || 'Failed to generate configurations');
    }

    const generateResult = await generateResponse.json();

    const response: FileUploadResponse = {
      success: true,
      message: `Successfully processed file and generated ${generateResult.generated} configurations`,
      parsedDevices: parsedResult.validDevices,
      generated: generateResult.generated,
      failed: generateResult.failed,
    };

    // Include warnings if there were invalid lines
    if (parsedResult.invalidLines.length > 0) {
      response.message += ` (${parsedResult.invalidLines.length} invalid lines skipped)`;
    }

    return NextResponse.json(response);
  } catch (error) {
    return createErrorResponse('File upload and processing failed', error);
  }
}
