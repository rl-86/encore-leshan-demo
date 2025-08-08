// Frontend/Backend shared types
export interface ConfigGeneratorParams {
  devicePrefix: string;
  startNumber: number;
  count: number;
  paddingLength: number;
}

export interface DeviceConfig {
  endpoint: string;
  hasBootstrapConfig: boolean;
  hasSecurityConfig: boolean;
}

export interface Client {
  id: string;
  endpoint: string;
  registrationId: string;
  address: string;
  status: 'ONLINE' | 'OFFLINE';
  lastSeen: string;
  secure?: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface ConfigGenerationResponse {
  success: boolean;
  message: string;
  generated: number;
  failed: number;
  devices: string[];
  source: 'manual' | 'file';
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  parsedDevices: string[];
  generated: number;
  failed: number;
}

// File upload types
export interface ParsedDeviceFile {
  devices: string[];
  totalCount: number;
  validDevices: string[];
  invalidLines: string[];
}
