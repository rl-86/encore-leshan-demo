import { api } from 'encore.dev/api';
import { secret } from 'encore.dev/config';
import { DMConfigInterface } from './types/dm-config-interface';
import { BSConfigInterface } from './types/bs-config-interface';

const allClients = secret('clients');
const objectSpecs = secret('objectSpecs');
const bootstrap_clients = secret('bootstrap_clients');
const spescificClient = secret('client');
const clientSecurityConfDelete = secret('clientSecurityConfDelete');
const bootstrapDelete = secret('bootstrapDelete');
const postBsConf = secret('postBsConf');
const postDmConf = secret('postDmConf');

// Get all the clients configurations
export const getAllClients = api(
  { method: 'GET', path: '/clients', expose: true, auth: true },
  async (): Promise<{ clients: any }> => {
    // Call the external API
    const url = allClients();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.statusText}`);
    }
    // Parse the JSON data from the response
    const clients = await response.json();

    // Return the data in a JSON object
    return { clients };
  }
);
// Get all the bootstrap clients configurations
export const getBootstrapClients = api(
  { method: 'GET', path: '/bsclients', expose: true, auth: true },
  async (): Promise<{ bsClients: any }> => {
    // Call the external API
    const url = bootstrap_clients();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch bsclients: ${response.statusText}`);
    }

    const bsClients = await response.json();

    return { bsClients };
  }
);

interface GetClientRequest {
  clientId: string;
}

interface GetClientResponse {
  client: any;
}
// Get the object specification of a client
export const getObjectSpec = api(
  { method: 'GET', path: '/objectspecs/:clientId', expose: true, auth: true },
  async ({ clientId }: GetClientRequest): Promise<GetClientResponse> => {
    const url = objectSpecs();
    const response = await fetch(url + `${clientId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch clients specs: ${response.statusText}`);
    }

    const client = await response.json();

    return { client };
  }
);
// Get specific client
export const getClient = api(
  { method: 'GET', path: '/clients/:clientId', expose: true, auth: true },
  async ({ clientId }: GetClientRequest): Promise<GetClientResponse> => {
    const url = spescificClient();
    const response = await fetch(url + `${clientId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch client: ${response.statusText}`);
    }

    const client = await response.json();

    return { client };
  }
);

interface PostBootstrapConfig {
  clientId: string;
  config: BSConfigInterface;
}

export const postBootstrapConfig = api<PostBootstrapConfig, void>(
  {
    method: 'POST',
    path: '/bsclient/:clientId',
    expose: true,
    auth: true,
  },

  async ({ clientId, config }) => {
    const url = postBsConf();

    const response = await fetch(url + `${clientId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Failed to post config: ${response.statusText}`);
    }
  }
);

// Post a client security configuration
export const postClientSecurityConf = api<DMConfigInterface, void>(
  { method: 'PUT', path: '/clients', expose: true, auth: true },
  async (config) => {
    const url = postDmConf();

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Failed to post config: ${response.statusText}`);
    }
  }
);

// Delete a specific bootstrap configuration
export const deleteBsConf = api(
  { method: 'DELETE', path: '/bsclients/:clientId', expose: true, auth: true },
  async ({ clientId }: { clientId: string }): Promise<void> => {
    const url = bootstrapDelete();
    const response = await fetch(url + `${clientId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `External delete failed: ${response.status} ${errorBody}`
      );
    }
  }
);

// Delete a client security configuration
export const deleteClientSecurityConf = api(
  { method: 'DELETE', path: '/clients/:clientId', expose: true, auth: true },
  async ({ clientId }: { clientId: string }): Promise<void> => {
    const url = clientSecurityConfDelete();
    const response = await fetch(url + `${clientId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `External delete failed: ${response.status} ${errorBody}`
      );
    }
  }
);
