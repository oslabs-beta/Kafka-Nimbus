'use client';
import React from 'react';
import { CheckBadgeIcon, Cog6ToothIcon, CloudIcon } from "@heroicons/react/24/solid";

type Props = {};

const ClusterMetrics = (props: Props) => {
  return (
    <div className=' h-full w-screen'>
      <div className='w-full mt-8 p-8'>
      <h1 className='text-3xl mb-8'>Cluster Name</h1>
        <div className='stats shadow w-full'>
          <div className='stat'>
            <div className='stat-figure text-secondary'>
              <CheckBadgeIcon className="text-green-400" height={40} width={40}/>
            </div>
            <div className='stat-title'>Status</div>
            <div className='stat-value text-green-400'>{props.status}</div>
            <div className='stat-desc'>Created at</div>
          </div>

          <div className='stat'>
            <div className='stat-figure text-secondary'>
              <CloudIcon height={40} width={40}/>
            </div>
            <div className='stat-title'>Number of Brokers</div>
            <div className='stat-value'>32</div>
            <div className='stat-desc'>↗︎ 400 (22%)</div>
          </div>

          <div className='stat'>
            <div className='stat-figure text-secondary'>
              <Cog6ToothIcon height={40} width={40}/>
            </div>
            <div className='stat-title'>Kafka Version</div>
            <div className='stat-value'>2.8.1</div>
            <div className='stat-desc'>@latest</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterMetrics;
