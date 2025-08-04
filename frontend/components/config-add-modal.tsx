// components/config-add-modal.tsx
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface ConfigGeneratorParams {
  devicePrefix: string;
  startNumber: number;
  count: number;
  paddingLength: number;
}

interface ConfigAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigGenerated: () => void; // Callback to refresh the configs list
}

export default function ConfigAddModal({
  isOpen,
  onClose,
  onConfigGenerated,
}: ConfigAddModalProps) {
  const [generating, setGenerating] = useState(false);
  const [useRandomStart, setUseRandomStart] = useState(false);

  // Form state för nya configs
  const [configForm, setConfigForm] = useState<ConfigGeneratorParams>({
    devicePrefix: 'Sensor',
    startNumber: 1,
    count: 5,
    paddingLength: 2,
  });

  const resetForm = () => {
    setConfigForm({
      devicePrefix: 'Sensor',
      startNumber: 1,
      count: 5,
      paddingLength: 2,
    });
    setUseRandomStart(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const generateRandomStart = () => {
    // Generate 10-digit random number
    const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
    setConfigForm((prev) => ({ ...prev, startNumber: randomNum }));
  };

  const handleGenerateConfigs = async () => {
    setGenerating(true);
    try {
      // If using random start, generate it now
      const finalConfig = {
        ...configForm,
        startNumber: useRandomStart
          ? Math.floor(Math.random() * 9000000000) + 1000000000
          : configForm.startNumber,
      };

      // Call your configGenerator.ts logic here
      const response = await fetch('/api/generate-configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
        },
        body: JSON.stringify(finalConfig),
      });

      if (!response.ok) {
        throw new Error('Failed to generate configurations');
      }

      const result = await response.json();
      console.log('Generated configs:', result);

      // Call callback to refresh configs list
      onConfigGenerated();

      // Close dialog and reset form
      handleClose();

      // Show success message
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

  // Generate effect for random start checkbox
  useEffect(() => {
    if (useRandomStart) {
      generateRandomStart();
    }
  }, [useRandomStart]);

  // Reset form when modal closes
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
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='useRandom'
                checked={useRandomStart}
                onCheckedChange={(checked) =>
                  setUseRandomStart(checked === true)
                }
              />
              <Label htmlFor='useRandom' className='text-sm'>
                Use random 10-digit start number
              </Label>
            </div>
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
              disabled={useRandomStart}
              min='1'
            />
            {useRandomStart && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={generateRandomStart}
                className='w-fit'
              >
                Generate New Random Number
              </Button>
            )}
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
