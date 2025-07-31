// components/ConfigurationsTab.tsx
import { useState, useEffect } from 'react';
import { Trash2, Check, X, RefreshCw } from 'lucide-react';

interface DeviceConfig {
  endpoint: string;
  hasBootstrapConfig: boolean;
  hasSecurityConfig: boolean;
}

export default function ConfigurationsTab() {
  const [configs, setConfigs] = useState<DeviceConfig[]>([]);
  const [loading, setLoading] = useState(false);

  // Hämta alla configs från båda endpoints
  const loadConfigs = async () => {
    setLoading(true);
    try {
      // Hämta security och bootstrap configs parallellt
      const [securityResponse, bootstrapResponse] = await Promise.all([
        fetch('http://localhost/api/clients/securityconf', {
          headers: {
            'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
            'Accept': 'application/json',
          },
        }),
        fetch('http://localhost/api/bsclients', {
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
          fetch(`http://localhost/api/bsclients/${endpoint}`, {
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
          fetch(`http://localhost/api/clients/${endpoint}`, {
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

  // Ladda configs när komponenten mountas
  useEffect(() => {
    loadConfigs();
  }, []);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            Device Configurations
          </h2>
          <p className='text-gray-600'>
            Manage LwM2M client bootstrap and security configurations
          </p>
        </div>
        <button
          onClick={loadConfigs}
          disabled={loading}
          className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2'
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Configurations Table */}
      <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
        {configs.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>
            {loading ? 'Loading configurations...' : 'No configurations found'}
          </div>
        ) : (
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='text-left p-4 font-semibold text-gray-900'>
                  Client Endpoint
                </th>
                <th className='text-center p-4 font-semibold text-gray-900'>
                  Bootstrap Config
                </th>
                <th className='text-center p-4 font-semibold text-gray-900'>
                  Security Config
                </th>
                <th className='text-center p-4 font-semibold text-gray-900'>
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {configs.map((config) => (
                <tr key={config.endpoint} className='hover:bg-gray-50'>
                  <td className='p-4'>
                    <span className='font-medium text-gray-900'>
                      {config.endpoint}
                    </span>
                  </td>
                  <td className='p-4 text-center'>
                    <ConfigStatusBadge hasConfig={config.hasBootstrapConfig} />
                  </td>
                  <td className='p-4 text-center'>
                    <ConfigStatusBadge hasConfig={config.hasSecurityConfig} />
                  </td>
                  <td className='p-4 text-center'>
                    <button
                      onClick={() => deleteConfig(config.endpoint)}
                      className='p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors'
                      title={`Delete all configurations for ${config.endpoint}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      {configs.length > 0 && (
        <div className='bg-gray-50 rounded-lg p-4'>
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
              <div className='text-sm text-gray-600'>With Bootstrap Config</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-green-600'>
                {configs.filter((c) => c.hasSecurityConfig).length}
              </div>
              <div className='text-sm text-gray-600'>With Security Config</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Component för status badges
function ConfigStatusBadge({ hasConfig }: { hasConfig: boolean }) {
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center ${
        hasConfig ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
      }`}
    >
      {hasConfig ? <Check size={20} /> : <X size={20} />}
    </div>
  );
}
