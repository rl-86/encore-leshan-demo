'use client';

import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

interface Client {
  id: string;
  endpoint: string;
  registrationId: string;
  address: string;
  status: 'ONLINE' | 'OFFLINE';
  lastSeen: string;
}

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/clients', {});
        const data = await res.json();

        const mapped = data.clients.map((c: any) => ({
          id: c.registrationId,
          endpoint: c.endpoint,
          registrationId: c.registrationId,
          address: c.address.startsWith('coap')
            ? c.address
            : `coap://${c.address}`,
          status: c.secure ? 'ONLINE' : 'OFFLINE',
          lastSeen: c.lastUpdate,
        }));

        setClients(mapped);
      } catch (err) {
        console.error('Failed to fetch clients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();

    // Optional: Poll every 60s
    const interval = setInterval(fetchClients, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className='border-solid '>
      <CardHeader className='bg-gray-100 rounded-md '>
        <CardTitle>Connected Clients</CardTitle>
        <CardDescription>
          List of LwM2M clients connected to the server
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        {loading ? (
          <div className='flex justify-center py-8'>Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className='text-center py-8'>No clients connected</div>
        ) : (
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='bg-gray-100 border-t-2'>
                  <TableHead>Status</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Registration ID</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      {client.status === 'OFFLINE' ? (
                        <Badge className='bg-green-600 hover:bg-green-600/90 flex justify-between gap-1 h-6 w-20'>
                          <Wifi className='h-4 w-4' /> Online
                        </Badge>
                      ) : (
                        <Badge
                          variant='outline'
                          className='text-gray-500 flex justify-between gap-1 h-6 w-20'
                        >
                          <WifiOff className='h-4 w-4' /> Offline
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className='font-medium text-sm'>
                      {client.endpoint}
                    </TableCell>
                    <TableCell>{client.registrationId}</TableCell>
                    <TableCell>{client.address}</TableCell>
                    <TableCell>
                      {new Date(client.lastSeen).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
