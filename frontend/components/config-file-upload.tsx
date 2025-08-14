// components/config-file-upload.tsx
import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatFileSize } from '@/lib/config-helpers';

interface FileUploadResult {
  success: boolean;
  message: string;
  parsedDevices: string[];
  generated: number;
  failed: number;
}

interface ConfigFileUploadProps {
  onUploadComplete?: (result: FileUploadResult) => void;
}

export default function ConfigFileUpload({
  onUploadComplete,
}: ConfigFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<FileUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Direct fetch call to Next.js API
      const response = await fetch('/api/configs/upload', {
        method: 'POST',
        headers: {
          'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();

      if (data.success) {
        setResult(data);
        onUploadComplete?.(data);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file) return;
    uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='space-y-4'>
      {/* File Drop Zone */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <CardContent className='p-8 text-center'>
          <div className='mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4'>
            <Upload className='w-6 h-6 text-gray-600' />
          </div>

          <div className='space-y-2'>
            <p className='text-lg font-medium text-gray-900'>
              {uploading
                ? 'Uploading and processing...'
                : 'Upload device list file'}
            </p>
            <p className='text-sm text-gray-500'>
              Drag and drop your file here, or click to browse
            </p>
            <p className='text-xs text-gray-400'>
              Supports .txt and .csv files (max 1MB)
            </p>
          </div>

          <Button
            variant='outline'
            disabled={uploading}
            className='mt-4'
            onClick={(e) => {
              e.stopPropagation();
              openFileDialog();
            }}
          >
            <FileText className='w-4 h-4 mr-2' />
            {uploading ? 'Processing...' : 'Choose File'}
          </Button>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type='file'
        accept='.txt,.csv'
        onChange={handleFileInputChange}
        className='hidden'
      />

      {/* Error Display */}
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Result */}
      {result && (
        <Alert>
          <CheckCircle2 className='h-4 w-4' />
          <AlertDescription>
            <div className='space-y-1'>
              <p className='font-medium'>{result.message}</p>
              <div className='text-sm text-gray-600'>
                <p>• Parsed devices: {result.parsedDevices.length}</p>
                <p>• Successfully generated: {result.generated}</p>
                {result.failed > 0 && (
                  <p className='text-amber-600'>• Failed: {result.failed}</p>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* File Format Help */}
      <Card className='bg-gray-50'>
        <CardContent className='p-4'>
          <h4 className='font-medium text-sm mb-2'>File Format</h4>
          <p className='text-xs text-gray-600 mb-2'>
            Each line should contain one device name. Example:
          </p>
          <pre className='text-xs bg-white p-2 rounded border font-mono'>
            {`Sensor01
Device_Kitchen
Node-Garage
Temperature_01`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
