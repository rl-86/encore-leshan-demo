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
import { useMobile } from '@/hooks/use-mobile';

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
  const isMobile = useMobile();

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/clients', {
          headers: {
            'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN!,
          },
        });
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

  const MobileClientCard = ({ client }: { client: Client }) => (
    <Card className='mb-4 overflow-hidden'>
      <CardHeader className='p-4 bg-applio-lightgray flex flex-row items-center justify-between'>
        <div>
          <CardTitle className='text-base'>{client.endpoint}</CardTitle>
          <CardDescription className='text-xs'>
            {client.registrationId}
          </CardDescription>
        </div>
        {client.status === 'OFFLINE' ? (
          <Badge className='bg-green-600 flex items-center gap-1'>
            <Wifi className='h-3 w-3' /> Online
          </Badge>
        ) : (
          <Badge
            variant='outline'
            className='text-applio-gray flex items-center gap-1'
          >
            <WifiOff className='h-3 w-3' /> Offline
          </Badge>
        )}
      </CardHeader>
      <CardContent className='p-4 space-y-2 text-sm'>
        <div className='grid grid-cols-3'>
          <span className='font-medium'>Address:</span>
          <span className='col-span-2 break-all'>{client.address}</span>
        </div>
        <div className='grid grid-cols-3'>
          <span className='font-medium'>Last Seen:</span>
          <span className='col-span-2'>
            {new Date(client.lastSeen).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className='border-none shadow-md'>
      <CardHeader className='bg-applio-lightgray'>
        <CardTitle>Connected Clients</CardTitle>
        <CardDescription>
          List of LwM2M clients connected to the server
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'p-4' : 'p-0'}>
        {loading ? (
          <div className='flex justify-center py-8'>Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className='text-center py-8'>No clients connected</div>
        ) : isMobile ? (
          <div className='space-y-4'>
            {clients.map((client) => (
              <MobileClientCard key={client.id} client={client} />
            ))}
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='bg-applio-lightgray'>
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
