import { api } from 'encore.dev/api';
import { secret } from 'encore.dev/config';

const allClients = secret('clients');
const objectSpecs = secret('objectSpecs');
const bootstrap_clients = secret('bootstrap_clients');
const spescificClient = secret('client');
const username = secret('username');
const password = secret('password');

export const getAllClients = api(
  { method: 'GET', path: '/api/clients', expose: true, auth: true },
  async (): Promise<{ clients: any }> => {

    // auth for nginx basic auth
    const userLogin = username();
    const pass = password();
    const authHeader =
      'Basic ' + Buffer.from(`${userLogin}:${pass}`).toString('base64');

    // Call the external API
    const url = allClients();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
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

export const getBootstrapClients = api(
  { method: 'GET', path: '/api/bsclients', expose: true, auth: true },
  async (): Promise<{ bsClients: any }> => {

    const url = bootstrap_clients();
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.statusText}`);
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

export const getObjectSpec = api(
  { method: 'GET', path: '/api/objectspecs/:clientId', expose: true, auth: true },
  async ({ clientId }: GetClientRequest): Promise<GetClientResponse> => {

    const userLogin = username();
    const pass = password();
    const authHeader =
      'Basic ' + Buffer.from(`${userLogin}:${pass}`).toString('base64');

    const url = objectSpecs();
    const response = await fetch(url + `${clientId}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.statusText}`);
    }

    const client = await response.json();

    return { client };
  }
);

export const getClient = api(
  { method: 'GET', path: '/api/clients/:clientId', expose: true, auth: true },
  async ({ clientId }: GetClientRequest): Promise<GetClientResponse> => {

    const userLogin = username();
    const pass = password();
    const authHeader =
      'Basic ' + Buffer.from(`${userLogin}:${pass}`).toString('base64');

    const url = spescificClient();
    const response = await fetch(url + `${clientId}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.statusText}`);
    }

    const client = await response.json();

    return { client };
  }
);
