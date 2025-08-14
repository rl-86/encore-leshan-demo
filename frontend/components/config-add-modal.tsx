// components/config-add-modal.tsx
import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { ConfigGeneratorParams } from '@/lib/types';

interface ConfigAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigGenerated: () => void;
}

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export default function ConfigAddModal({
  isOpen,
  onClose,
  onConfigGenerated,
}: ConfigAddModalProps) {
  const [generating, setGenerating] = useState(false);

  const [configForm, setConfigForm] = useState<ConfigGeneratorParams>({
    devicePrefix: 'Device',
    startNumber: 1,
    count: 5,
    paddingLength: 1,
  });

  const resetForm = () => {
    setConfigForm({
      devicePrefix: 'Device',
      startNumber: 1,
      count: 5,
      paddingLength: 1,
    });
  };

  // ---- Validering (matchar backend) ----
  const errors = useMemo(() => {
    return {
      devicePrefix: configForm.devicePrefix.trim()
        ? ''
        : 'Device prefix is required',
      startNumber:
        configForm.startNumber >= 1 ? '' : 'Start number must be ≥ 1',
      count:
        configForm.count >= 1 && configForm.count <= 100
          ? ''
          : 'Count must be between 1 and 100',
      paddingLength:
        configForm.paddingLength >= 1 && configForm.paddingLength <= 6
          ? ''
          : 'Padding length must be between 1 and 6',
    };
  }, [configForm]);

  const isValid = useMemo(
    () => Object.values(errors).every((e) => !e),
    [errors]
  );

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleGenerateConfigs = async () => {
    if (!isValid) return; // extra skydd
    setGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configForm),
      });

      if (!response.ok) {
        throw new Error('Failed to generate configurations');
      }

      const result = await response.json();
      console.log('Generated configs:', result);

      onConfigGenerated();
      handleClose();

      alert(
        `Successfully generated ${configForm.count} device configurations!`
      );
    } catch (error) {
      console.error('Error generating configs:', error);
      alert(
        'Failed to generate configurations. Please check the console for details.'
      );
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Generate New Device Configurations</DialogTitle>
          <DialogDescription className='pt-1 pr-2'>
            Configure the parameters for generating multiple device
            configurations. (This will create new bootstrap and security
            configurations for each device.)
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-6 py-4'>
          {/* Device Prefix */}
          <div className='grid gap-2'>
            <Label htmlFor='devicePrefix'>Device Prefix</Label>
            <Input
              id='devicePrefix'
              value={configForm.devicePrefix}
              onChange={(e) =>
                setConfigForm((prev) => ({
                  ...prev,
                  devicePrefix: e.target.value,
                }))
              }
              placeholder='e.g., Sensor, Node, Device'
              required
              aria-invalid={!!errors.devicePrefix}
              aria-describedby='devicePrefix-error'
            />
            {errors.devicePrefix && (
              <p id='devicePrefix-error' className='text-sm text-red-600'>
                {errors.devicePrefix}
              </p>
            )}
            <p className='text-sm text-gray-500'>
              Prefix for device endpoints (e.g., "Sensor" → Sensor01, Sensor02…)
            </p>
          </div>

          {/* Start Number */}
          <div className='grid gap-2'>
            <Label htmlFor='startNumber'>Start Number</Label>
            <Input
              id='startNumber'
              type='number'
              inputMode='numeric'
              min={1}
              value={configForm.startNumber}
              onChange={(e) =>
                setConfigForm((prev) => ({
                  ...prev,
                  startNumber: clamp(
                    parseInt(e.target.value, 10),
                    1,
                    Number.MAX_SAFE_INTEGER
                  ),
                }))
              }
              aria-invalid={!!errors.startNumber}
              aria-describedby='startNumber-error'
            />
            {errors.startNumber && (
              <p id='startNumber-error' className='text-sm text-red-600'>
                {errors.startNumber}
              </p>
            )}
          </div>

          {/* Count */}
          <div className='grid gap-2'>
            <Label htmlFor='count'>Number of Devices</Label>
            <Input
              id='count'
              type='number'
              inputMode='numeric'
              min={1}
              max={100}
              value={configForm.count}
              onChange={(e) =>
                setConfigForm((prev) => ({
                  ...prev,
                  count: clamp(parseInt(e.target.value, 10), 1, 100),
                }))
              }
              aria-invalid={!!errors.count}
              aria-describedby='count-error'
            />
            {errors.count && (
              <p id='count-error' className='text-sm text-red-600'>
                {errors.count}
              </p>
            )}
            <p className='text-sm text-gray-500'>
              How many device configurations to generate (1-100)
            </p>
          </div>

          {/* Padding Length */}
          <div className='grid gap-2'>
            <Label htmlFor='paddingLength'>Number Padding</Label>
            <Input
              id='paddingLength'
              type='number'
              inputMode='numeric'
              min={1}
              max={6}
              value={configForm.paddingLength}
              onChange={(e) =>
                setConfigForm((prev) => ({
                  ...prev,
                  paddingLength: clamp(parseInt(e.target.value, 10), 1, 6),
                }))
              }
              aria-invalid={!!errors.paddingLength}
              aria-describedby='paddingLength-error'
            />
            {errors.paddingLength && (
              <p id='paddingLength-error' className='text-sm text-red-600'>
                {errors.paddingLength}
              </p>
            )}
            <p className='text-sm text-gray-500'>
              Padding for numbers (2 = 01, 02… | 3 = 001, 002…)
            </p>
          </div>

          {/* Preview */}
          <div className='bg-gray-50 p-3 rounded-lg'>
            <Label className='text-sm font-medium'>Preview:</Label>
            <p className='text-sm text-gray-600 mt-1'>
              {configForm.devicePrefix}
              {String(configForm.startNumber).padStart(
                configForm.paddingLength,
                '0'
              )}
              , {configForm.devicePrefix}
              {String(configForm.startNumber + 1).padStart(
                configForm.paddingLength,
                '0'
              )}
              , {configForm.devicePrefix}
              {String(configForm.startNumber + 2).padStart(
                configForm.paddingLength,
                '0'
              )}
              … ({configForm.count} total)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerateConfigs}
            disabled={generating || !isValid}
          >
            {generating
              ? 'Generating…'
              : `Generate ${configForm.count} Configs`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
