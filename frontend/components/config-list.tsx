import { useState, useEffect } from 'react';
import { Trash2, Check, X, RefreshCw, AlertTriangle, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ConfigAddModal from './config-add-modal';

interface DeviceConfig {
  endpoint: string;
  hasBootstrapConfig: boolean;
  hasSecurityConfig: boolean;
}

export default function ConfigsList() {
  const [configs, setConfigs] = useState<DeviceConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  const baseURL = 'http://localhost/api';

  // Hämta alla configs från båda endpoints
  const loadConfigs = async () => {
    setLoading(true);
    try {
      // Hämta security och bootstrap configs parallellt
      const [securityResponse, bootstrapResponse] = await Promise.all([
        fetch(`${baseURL}/clients/securityconf`, {
          headers: {
            'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
            'Accept': 'application/json',
          },
        }),
        fetch(`${baseURL}/bsclients`, {
          headers: {
            'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
            'Accept': 'application/json',
          },
        }),
      ]);

      if (!bootstrapResponse.ok) {
        throw new Error('Failed to fetch bootstrap config');
      }

      if (!securityResponse.ok) {
        throw new Error('Failed to fetch security config');
      }

      const securityData = await securityResponse.json();
      const bootstrapData = await bootstrapResponse.json();

      // Extrahera endpoints från security configs
      const securityEndpoints = new Set(
        securityData.securityConf?.map((config: any) => config.endpoint) || []
      );

      // Extrahera endpoints från bootstrap configs (keys i bsClients objektet)
      const bootstrapEndpoints = new Set(
        Object.keys(bootstrapData.bsClients || {})
      );

      // Kombinera alla unika endpoints
      const allEndpoints = new Set([
        ...securityEndpoints,
        ...bootstrapEndpoints,
      ]);

      // Skapa kombinerad config data
      const combinedConfigs: DeviceConfig[] = Array.from(allEndpoints).map(
        (endpoint) => ({
          endpoint: endpoint as string,
          hasBootstrapConfig: bootstrapEndpoints.has(endpoint as string),
          hasSecurityConfig: securityEndpoints.has(endpoint as string),
        })
      );

      setConfigs(combinedConfigs);
    } catch (error) {
      console.error('Error loading configs:', error);
      // Här kan du visa en toast/notification för fel
    } finally {
      setLoading(false);
    }
  };

  const openConfigDialog = () => {
    setShowConfigDialog(true);
  };

  const closeConfigDialog = () => {
    setShowConfigDialog(false);
  };

  const handleConfigGenerated = () => {
    // Refresh the configs list after new configs are generated
    loadConfigs();
  };

  // Ta bort både bootstrap och security config för en endpoint
  const deleteConfig = async (endpoint: string) => {
    if (
      !confirm(
        `Are you sure you want to delete all configurations for ${endpoint}?`
      )
    ) {
      return;
    }

    try {
      const config = configs.find((c) => c.endpoint === endpoint);
      if (!config) return;

      const deletePromises = [];

      // Ta bort bootstrap config om den finns
      if (config.hasBootstrapConfig) {
        deletePromises.push(
          fetch(`${baseURL}/bsclients/${endpoint}`, {
            method: 'DELETE',
            headers: {
              'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
            },
          })
        );
      }

      // Ta bort security config om den finns
      if (config.hasSecurityConfig) {
        deletePromises.push(
          fetch(`${baseURL}/clients/${endpoint}`, {
            method: 'DELETE',
            headers: {
              'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
            },
          })
        );
      }

      await Promise.all(deletePromises);

      // Ta bort från local state
      setConfigs((prev) => prev.filter((c) => c.endpoint !== endpoint));
    } catch (error) {
      console.error('Error deleting config:', error);
      // Här kan du visa en toast/notification för fel
    }
  };

  // Ta bort ALLA configs för alla endpoints
  const deleteAllConfigs = async () => {
    const totalConfigs = configs.filter(
      (c) => c.hasBootstrapConfig || c.hasSecurityConfig
    ).length;

    if (totalConfigs === 0) {
      alert('No configurations to delete.');
      return;
    }

    const confirmMessage =
      `Delete ALL configurations!\n\n` +
      `This will remove:\n` +
      `• ${
        configs.filter((c) => c.hasBootstrapConfig).length
      } Bootstrap configurations\n` +
      `• ${
        configs.filter((c) => c.hasSecurityConfig).length
      } Security configurations\n` +
      `• Total of ${totalConfigs} configurations\n\n`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setDeleting(true);

    try {
      const deletePromises: Promise<Response>[] = [];

      // Gå igenom alla configs och skapa delete requests
      configs.forEach((config) => {
        // Ta bort bootstrap config om den finns
        if (config.hasBootstrapConfig) {
          deletePromises.push(
            fetch(`${baseURL}/bsclients/${config.endpoint}`, {
              method: 'DELETE',
              headers: {
                'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
              },
            })
          );
        }

        // Ta bort security config om den finns
        if (config.hasSecurityConfig) {
          deletePromises.push(
            fetch(`${baseURL}/clients/${config.endpoint}`, {
              method: 'DELETE',
              headers: {
                'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
              },
            })
          );
        }
      });

      // Kör alla delete requests parallellt
      const results = await Promise.allSettled(deletePromises);

      // Kontrollera om några requests failade
      const failed = results.filter((result) => result.status === 'rejected');
      if (failed.length > 0) {
        console.error('Some delete requests failed:', failed);
        alert(
          `Warning: ${failed.length} delete requests failed. Please check the console for details.`
        );
      }

      // Rensa local state
      setConfigs([]);
    } catch (error) {
      console.error('Error deleting all configs:', error);
      alert(
        'Error occurred while deleting configurations. Please check the console for details.'
      );
    } finally {
      setDeleting(false);
    }
  };

  // Ladda configs när komponenten mountas
  useEffect(() => {
    loadConfigs();
  }, []);

  return (
    <div className='space-y-6'>
      {/* Warning Banner when deleting */}
      {deleting && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-center gap-2 text-red-800'>
            <AlertTriangle size={20} />
            <span className='font-semibold'>
              Deleting all configurations...
            </span>
          </div>
          <p className='text-red-700 text-sm mt-1'>
            Please wait while all bootstrap and security configurations are
            being removed.
          </p>
        </div>
      )}

      <Card className='border shadow-sm'>
        <CardHeader className='bg-gray-100'>
          <div className='flex justify-between items-center h-12'>
            <div>
              <CardTitle>Device Configurations</CardTitle>
              <CardDescription>
                Manage LwM2M client bootstrap and security configurations
              </CardDescription>
            </div>
            <div className='flex gap-3'>
              <Button
                onClick={loadConfigs}
                disabled={loading || deleting}
                variant='outline'
                className='flex items-center gap-2'
              >
                <RefreshCw
                  size={20}
                  className={loading ? 'animate-spin' : ''}
                />
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
              {/* Button to open Add Config dialog */}
              <Button
                onClick={openConfigDialog}
                disabled={deleting || loading}
                variant='default'
                className='flex items-center gap-2'
              >
                <Plus size={20} />
                Add New Configs
              </Button>
              <Button
                onClick={deleteAllConfigs}
                disabled={deleting || loading || configs.length === 0}
                variant='destructive'
                className='flex items-center gap-2'
              >
                <AlertTriangle size={20} />
                {deleting ? 'Deleting All...' : 'Delete All Configs'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          {configs.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              {loading
                ? 'Loading configurations...'
                : deleting
                ? 'Deleting configurations...'
                : 'No configurations found'}
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-gray-100 border-t-2'>
                    <TableHead>Client Endpoint</TableHead>
                    <TableHead className='text-center'>
                      Bootstrap Config
                    </TableHead>
                    <TableHead className='text-center'>
                      Security Config
                    </TableHead>
                    <TableHead className='text-center'>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configs.map((config) => (
                    <TableRow key={config.endpoint}>
                      <TableCell className='font-medium text-sm'>
                        {config.endpoint}
                      </TableCell>
                      <TableCell className='text-center'>
                        <ConfigStatusBadge
                          hasConfig={config.hasBootstrapConfig}
                        />
                      </TableCell>
                      <TableCell className='text-center'>
                        <ConfigStatusBadge
                          hasConfig={config.hasSecurityConfig}
                        />
                      </TableCell>
                      <TableCell className='text-center'>
                        <button
                          onClick={() => deleteConfig(config.endpoint)}
                          disabled={deleting}
                          className='p-2 text-red-700 hover:bg-red-100 disabled:text-red-400 disabled:hover:bg-transparent rounded-full transition-colors'
                          title={`Delete all configurations for ${config.endpoint}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Config Modal */}
      <ConfigAddModal
        isOpen={showConfigDialog}
        onClose={closeConfigDialog}
        onConfigGenerated={handleConfigGenerated}
      />

      {/* Summary */}
      {configs.length > 0 && (
        <Card className='border shadow-sm'>
          <CardContent className='p-6'>
            <div className='grid grid-cols-3 gap-4 text-center'>
              <div>
                <div className='text-2xl font-bold text-gray-900'>
                  {configs.length}
                </div>
                <div className='text-sm text-gray-600'>Total Endpoints</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-blue-600'>
                  {configs.filter((c) => c.hasBootstrapConfig).length}
                </div>
                <div className='text-sm text-gray-600'>
                  With Bootstrap Config
                </div>
              </div>
              <div>
                <div className='text-2xl font-bold text-green-600'>
                  {configs.filter((c) => c.hasSecurityConfig).length}
                </div>
                <div className='text-sm text-gray-600'>
                  With Security Config
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper Component för status badges
function ConfigStatusBadge({ hasConfig }: { hasConfig: boolean }) {
  return (
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center ${
        hasConfig ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {hasConfig ? <Check size={16} /> : <X size={16} />}
    </div>
  );
}
