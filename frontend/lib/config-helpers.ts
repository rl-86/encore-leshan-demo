import { ConfigGeneratorParams, ParsedDeviceFile } from './types';

/**
 * Generate a list of device endpoint names based on parameters
 */
export function generateDeviceList(params: ConfigGeneratorParams): string[] {
  const devices: string[] = [];

  for (let i = 0; i < params.count; i++) {
    const num = (params.startNumber + i)
      .toString()
      .padStart(params.paddingLength, '0');
    devices.push(`${params.devicePrefix}${num}`);
  }

  return devices;
}

/**
 * Parse uploaded device file content into device list
 */
export function parseDeviceFile(fileContent: string): ParsedDeviceFile {
  const lines = fileContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const validDevices: string[] = [];
  const invalidLines: string[] = [];

  lines.forEach((line, index) => {
    // Basic validation - device name should be alphanumeric with optional dashes/underscores
    const deviceName = line.trim();

    if (/^[a-zA-Z0-9_-]+$/.test(deviceName)) {
      validDevices.push(deviceName);
    } else {
      invalidLines.push(`Line ${index + 1}: "${line}"`);
    }
  });

  return {
    devices: lines,
    totalCount: lines.length,
    validDevices,
    invalidLines,
  };
}

/**
 * Validate device names before sending to backend
 */
export function validateDeviceNames(devices: string[]): {
  valid: string[];
  invalid: string[];
  errors: string[];
} {
  const valid: string[] = [];
  const invalid: string[] = [];
  const errors: string[] = [];

  devices.forEach((device) => {
    if (!device || device.trim().length === 0) {
      invalid.push(device);
      errors.push('Empty device name');
      return;
    }

    const trimmed = device.trim();

    if (trimmed.length > 64) {
      invalid.push(device);
      errors.push(`Device name too long: ${trimmed}`);
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      invalid.push(device);
      errors.push(`Invalid characters in device name: ${trimmed}`);
      return;
    }

    valid.push(trimmed);
  });

  return { valid, invalid, errors };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
