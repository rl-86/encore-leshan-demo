// components/config-add-modal.tsx
import { useState, useEffect } from 'react';
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
import { ConfigGeneratorParams } from '@/lib/types';

interface ConfigAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigGenerated: () => void;
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

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleGenerateConfigs = async () => {
    setGenerating(true);
    try {
      const finalConfig = {
        ...configForm,
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalConfig),
      });

      if (!response.ok) {
        throw new Error('Failed to generate configurations');
      }

      const result = await response.json();
      console.log('Generated configs:', result);

      onConfigGenerated();
      handleClose();

      alert(
        `Successfully generated ${finalConfig.count} device configurations!`
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
    if (!isOpen) {
      resetForm();
    }
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
          {/* Resten av din kod är perfekt som den är... */}
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
            />
            <p className='text-sm text-gray-500'>
              Prefix for device endpoints (e.g., "Sensor" → Sensor01,
              Sensor02...)
            </p>
          </div>

          {/* Start Number */}
          <div className='grid gap-2'>
            <Label htmlFor='startNumber'>Start Number</Label>
            <div className='flex items-center space-x-2'></div>
            <Input
              id='startNumber'
              type='number'
              value={configForm.startNumber}
              onChange={(e) =>
                setConfigForm((prev) => ({
                  ...prev,
                  startNumber: parseInt(e.target.value) || 1,
                }))
              }
              min='1'
            />
          </div>

          {/* Count */}
          <div className='grid gap-2'>
            <Label htmlFor='count'>Number of Devices</Label>
            <Input
              id='count'
              type='number'
              value={configForm.count}
              onChange={(e) =>
                setConfigForm((prev) => ({
                  ...prev,
                  count: parseInt(e.target.value) || 1,
                }))
              }
              min='1'
              max='100'
            />
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
              value={configForm.paddingLength}
              onChange={(e) =>
                setConfigForm((prev) => ({
                  ...prev,
                  paddingLength: parseInt(e.target.value) || 2,
                }))
              }
              min='1'
              max='5'
            />
            <p className='text-sm text-gray-500'>
              Padding for numbers (2 = 01, 02... | 3 = 001, 002...)
            </p>
          </div>

          {/* Preview */}
          <div className='bg-gray-50 p-3 rounded-lg'>
            <Label className='text-sm font-medium'>Preview:</Label>
            <p className='text-sm text-gray-600 mt-1'>
              {configForm.devicePrefix}
              {configForm.startNumber
                .toString()
                .padStart(configForm.paddingLength, '0')}
              , {configForm.devicePrefix}
              {(configForm.startNumber + 1)
                .toString()
                .padStart(configForm.paddingLength, '0')}
              , {configForm.devicePrefix}
              {(configForm.startNumber + 2)
                .toString()
                .padStart(configForm.paddingLength, '0')}
              ... ({configForm.count} total)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerateConfigs}
            disabled={
              generating ||
              !configForm.devicePrefix.trim() ||
              configForm.count < 1
            }
          >
            {generating
              ? 'Generating...'
              : `Generate ${configForm.count} Configs`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
