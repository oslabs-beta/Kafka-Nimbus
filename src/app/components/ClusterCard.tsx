/* eslint-disable @next/next/no-img-element */
'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '~/trpc/trpc-provider';

export interface cardCluster {
  cluster: {
    img: string;
    name: string;
    id: string;
  };
}

export default function ClusterCard({ cluster }: cardCluster) {
  const router = useRouter();
  // Fetching the cluster status to display
  const { data: status } = trpc.createCluster.checkClusterStatus.useQuery({
    name: cluster.name,
  });

  console.log('STATUS',status)
  const routeToCluster = () => {
    router.push(`${cluster.id}/dashboard`);
  };

  
  const statusColor = status === 'ACTIVE' ? 'green' : 'red';
  console.log(`text-${statusColor}-600`);
  return (
    <div
      onClick={routeToCluster}
      className='max-w-98 card h-48 w-72 overflow-hidden rounded-xl bg-base-100 shadow-xl hover:ring-4 '
    >
      <figure className='w-full'>
        <div className={`h-24 w-full object-cover ${cluster.img}`} />
      </figure>
      <div className='m-4 flex w-full flex-col justify-between'>
        <h2 className='card-title '>{cluster.name}</h2>
        <div className='flex items-end justify-end'>
          {statusColor ? (
            <p
              className={`text-${statusColor}-600  mr-6 w-min rounded-xl bg-${statusColor}-100  mx-1 items-end px-4 align-bottom shadow-md`}
            >
              {status}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
