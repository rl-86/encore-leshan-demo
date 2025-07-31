// components/ConfigurationsTab.tsx
import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Check, X } from 'lucide-react';

interface DeviceConfig {
  endpoint: string;
  hasBootstrapConfig: boolean;
  hasSecurityConfig: boolean;
  securityMode: 'NO_SEC' | 'PSK' | 'RPK' | 'X509' | 'OSCORE';
  bootstrapServer?: string;
  lwm2mServer?: string;
  lastUpdated?: string;
}

export default function ConfigList() {
  const [configs, setConfigs] = useState<DeviceConfig[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<DeviceConfig | null>(null);

  // Implementera saknade funktioner
  const toggleBootstrapConfig = async (endpoint: string) => {
    try {
      const config = configs.find((c) => c.endpoint === endpoint);
      if (!config) return;

      const newStatus = !config.hasBootstrapConfig;

      if (newStatus) {
        // Skapa bootstrap config via API
        const response = await fetch('/api/bootstrap-configs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint,
            bootstrapServer: 'coap://localhost:5683',
            lwm2mServer: 'coap://localhost:5783',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create bootstrap config');
        }
      } else {
        // Ta bort bootstrap config via API
        const response = await fetch(`/api/bootstrap-configs/${endpoint}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete bootstrap config');
        }
      }

      // Uppdatera local state
      setConfigs((prev) =>
        prev.map((c) =>
          c.endpoint === endpoint
            ? {
                ...c,
                hasBootstrapConfig: newStatus,
                lastUpdated: new Date().toISOString(),
              }
            : c
        )
      );
    } catch (error) {
      console.error('Error toggling bootstrap config:', error);
      // Här kan du visa en toast/notification för fel
    }
  };

  const toggleSecurityConfig = async (endpoint: string) => {
    try {
      const config = configs.find((c) => c.endpoint === endpoint);
      if (!config) return;

      const newStatus = !config.hasSecurityConfig;

      if (newStatus) {
        // Skapa security config via API
        const response = await fetch('/api/security-configs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint,
            securityMode: config.securityMode || 'PSK',
            // Lägg till andra security parametrar baserat på mode
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create security config');
        }
      } else {
        // Ta bort security config via API
        const response = await fetch(`/api/security-configs/${endpoint}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete security config');
        }
      }

      // Uppdatera local state
      setConfigs((prev) =>
        prev.map((c) =>
          c.endpoint === endpoint
            ? {
                ...c,
                hasSecurityConfig: newStatus,
                lastUpdated: new Date().toISOString(),
              }
            : c
        )
      );
    } catch (error) {
      console.error('Error toggling security config:', error);
    }
  };

  const deleteConfig = async (endpoint: string) => {
    if (
      !confirm(
        `Are you sure you want to delete all configurations for ${endpoint}?`
      )
    ) {
      return;
    }

    try {
      // Ta bort både bootstrap och security configs
      const deletePromises = [];

      const config = configs.find((c) => c.endpoint === endpoint);
      if (config?.hasBootstrapConfig) {
        deletePromises.push(
          fetch(`/api/bootstrap-configs/${endpoint}`, { method: 'DELETE' })
        );
      }

      if (config?.hasSecurityConfig) {
        deletePromises.push(
          fetch(`/api/security-configs/${endpoint}`, { method: 'DELETE' })
        );
      }

      await Promise.all(deletePromises);

      // Ta bort från local state
      setConfigs((prev) => prev.filter((c) => c.endpoint !== endpoint));
    } catch (error) {
      console.error('Error deleting config:', error);
    }
  };

  // Läs in befintliga configs när komponenten laddas
  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      // Hämta både bootstrap och security configs parallellt
      const [bootstrapResponse, securityResponse] = await Promise.all([
        fetch('/api/bootstrap-configs'),
        fetch('/api/security-configs'),
      ]);

      const bootstrapConfigs = await bootstrapResponse.json();
      const securityConfigs = await securityResponse.json();

      // Kombinera data från båda APIs
      const allEndpoints = new Set([
        ...bootstrapConfigs.map((c: any) => c.endpoint),
        ...securityConfigs.map((c: any) => c.endpoint),
      ]);

      const combinedConfigs: DeviceConfig[] = Array.from(allEndpoints).map(
        (endpoint) => {
          const bootstrap = bootstrapConfigs.find(
            (c: any) => c.endpoint === endpoint
          );
          const security = securityConfigs.find(
            (c: any) => c.endpoint === endpoint
          );

          return {
            endpoint: endpoint as string,
            hasBootstrapConfig: !!bootstrap,
            hasSecurityConfig: !!security,
            securityMode: security?.securityMode || 'NO_SEC',
            bootstrapServer: bootstrap?.bootstrapServer,
            lwm2mServer: bootstrap?.lwm2mServer,
            lastUpdated:
              Math.max(
                bootstrap?.lastUpdated
                  ? new Date(bootstrap.lastUpdated).getTime()
                  : 0,
                security?.lastUpdated
                  ? new Date(security.lastUpdated).getTime()
                  : 0
              ) > 0
                ? new Date(
                    Math.max(
                      bootstrap?.lastUpdated
                        ? new Date(bootstrap.lastUpdated).getTime()
                        : 0,
                      security?.lastUpdated
                        ? new Date(security.lastUpdated).getTime()
                        : 0
                    )
                  ).toISOString()
                : undefined,
          };
        }
      );

      setConfigs(combinedConfigs);
    } catch (error) {
      console.error('Error loading configs:', error);
    }
  };

  // Bulk actions
  const enableBootstrapForAll = async () => {
    const endpoints = configs
      .filter((c) => !c.hasBootstrapConfig)
      .map((c) => c.endpoint);

    for (const endpoint of endpoints) {
      await toggleBootstrapConfig(endpoint);
    }
  };

  const applyOscoreToAll = async () => {
    try {
      const updatePromises = configs.map((config) =>
        fetch(`/api/security-configs/${config.endpoint}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...config,
            securityMode: 'OSCORE',
          }),
        })
      );

      await Promise.all(updatePromises);

      // Uppdatera local state
      setConfigs((prev) =>
        prev.map((c) => ({
          ...c,
          securityMode: 'OSCORE' as const,
          lastUpdated: new Date().toISOString(),
        }))
      );
    } catch (error) {
      console.error('Error applying OSCORE to all:', error);
    }
  };

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
          onClick={() => setShowAddModal(true)}
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2'
        >
          <Plus size={20} />
          Add New Configuration
        </button>
      </div>

      {/* Server Certificates Section */}
      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='p-4 border-b'>
          <h3 className='font-semibold text-gray-900'>Server Certificates</h3>
        </div>
        <div className='p-4 space-y-4'>
          <CertificateSection
            title='Bootstrap Server Certificate'
            type='bootstrap'
          />
          <CertificateSection title='LwM2M Server Certificate' type='lwm2m' />
        </div>
      </div>

      {/* Configurations Table */}
      <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
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
                Security Mode
              </th>
              <th className='text-center p-4 font-semibold text-gray-900'>
                Last Updated
              </th>
              <th className='text-center p-4 font-semibold text-gray-900'>
                Actions
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
                  <ConfigStatusBadge
                    hasConfig={config.hasBootstrapConfig}
                    onClick={() => toggleBootstrapConfig(config.endpoint)}
                  />
                </td>
                <td className='p-4 text-center'>
                  <ConfigStatusBadge
                    hasConfig={config.hasSecurityConfig}
                    onClick={() => toggleSecurityConfig(config.endpoint)}
                  />
                </td>
                <td className='p-4 text-center'>
                  <SecurityModeBadge mode={config.securityMode} />
                </td>
                <td className='p-4 text-center text-sm text-gray-500'>
                  {config.lastUpdated
                    ? new Date(config.lastUpdated).toLocaleString()
                    : 'Never'}
                </td>
                <td className='p-4 text-center'>
                  <div className='flex justify-center gap-2'>
                    <button
                      onClick={() => setEditingConfig(config)}
                      className='p-1 text-blue-600 hover:bg-blue-100 rounded'
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteConfig(config.endpoint)}
                      className='p-1 text-red-600 hover:bg-red-100 rounded'
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className='bg-blue-50 rounded-lg p-4'>
        <h3 className='font-semibold text-blue-900 mb-3'>Quick Actions</h3>
        <div className='flex gap-3'>
          <button
            onClick={enableBootstrapForAll}
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          >
            Enable Bootstrap for All Connected Clients
          </button>
          <button
            onClick={applyOscoreToAll}
            className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
          >
            Apply OSCORE to All Configs
          </button>
          <button className='border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50'>
            Export All Configurations
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper Components (samma som tidigare)
function ConfigStatusBadge({
  hasConfig,
  onClick,
}: {
  hasConfig: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
        hasConfig
          ? 'bg-green-100 text-green-600 hover:bg-green-200'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
      }`}
    >
      {hasConfig ? <Check size={16} /> : <X size={16} />}
    </button>
  );
}

function SecurityModeBadge({ mode }: { mode: string }) {
  const colors = {
    NO_SEC: 'bg-gray-100 text-gray-600',
    PSK: 'bg-blue-100 text-blue-600',
    RPK: 'bg-purple-100 text-purple-600',
    X509: 'bg-green-100 text-green-600',
    OSCORE: 'bg-orange-100 text-orange-600',
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colors[mode as keyof typeof colors]
      }`}
    >
      {mode}
    </span>
  );
}

function CertificateSection({
  title,
  type,
}: {
  title: string;
  type: 'bootstrap' | 'lwm2m';
}) {
  return (
    <div className='border rounded-lg p-4'>
      <h4 className='font-medium text-gray-900 mb-2'>{title}</h4>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Hex
          </label>
          <textarea
            className='w-full h-24 text-xs font-mono bg-gray-50 border rounded p-2'
            readOnly
            placeholder='Certificate hex data...'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Base64
          </label>
          <textarea
            className='w-full h-24 text-xs font-mono bg-gray-50 border rounded p-2'
            readOnly
            placeholder='Certificate base64 data...'
          />
        </div>
      </div>
      <p className='text-sm text-gray-500 mt-2'>
        Clients generally need this for {type === 'bootstrap' ? 'X509' : 'RPK'}{' '}
        authentication.
      </p>
    </div>
  );
}
