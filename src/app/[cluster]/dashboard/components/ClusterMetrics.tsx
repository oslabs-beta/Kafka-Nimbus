'use client';
import React from 'react';
import {
  CheckBadgeIcon,
  Cog6ToothIcon,
  CloudIcon,
} from '@heroicons/react/24/solid';
import type { ClusterInfo } from '~/app/redux/features/clusterInfoSlice';


const ClusterMetrics: React.FC<ClusterInfo> = ({ clusterInfo }) => {
  // console.log(clusterInfo)
  return (
    <div className=' h-full w-screen'>
      <div className='mt-8 w-full p-8'>
        <h1 className='mb-8 text-3xl'>{clusterInfo.ClusterName}</h1>
        <div className='stats w-full shadow'>
          <div className='stat'>
            <div className='stat-figure text-secondary'>
              <CheckBadgeIcon
                className='text-green-400'
                height={40}
                width={40}
              />
            </div>
            <div className='stat-title'>Status</div>
            <div className='stat-value text-green-400'>
              {clusterInfo.State}
            </div>
            <div className='stat-desc'>
              Created at: {clusterInfo.CreationTime}
            </div>
          </div>

          <div className='stat'>
            <div className='stat-figure text-secondary'>
              <CloudIcon height={40} width={40} />
            </div>
            <div className='stat-title'>Number of Brokers</div>
            <div className='stat-value'>
              {clusterInfo.NumberOfBrokerNodes}
            </div>
            {/* <div className='stat-desc'>↗︎ 400 (22%)</div> */}
          </div>

          <div className='stat'>
            <div className='stat-figure text-secondary'>
              <Cog6ToothIcon height={40} width={40} />
            </div>
            <div className='stat-title'>Kafka Version</div>
            <div className='stat-value'>{clusterInfo.KafkaVersion}</div>
            <div className='stat-desc'>@latest</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterMetrics;
