import React, { useState } from 'react';
import { useAppDispatch } from '~/app/redux/hooks';
import { setClusterSize } from '~/app/redux/features/createClusterSlice';

interface ProviderProps {
  inFocusHandler: (string: string) => void;
}

const ClusterSize: React.FC<ProviderProps> = ({ inFocusHandler }) => {
  const storageOptions = {
    large: {
      name: 'kafka.m5.large',
      partitions: '1000 recommended max partition count',
      vCPU: 'vCPUU+ff1a2',
      mem: "Memory (GiB)U+ff1a 8",
      gbps: "Network bandwidth (Gbps)U+ff1a 10"
    },
    xlarge: {
      name: 'kafka.m5.xlarge',
      partitions: '1000 recommended max partition count',
      vCPU: 'vCPUU+ff1a 4',
      mem: "Memory (GiB)U+ff1a 16",
      gbps: "Network bandwidth (Gbps)U+ff1a 10"
    },
    _2xlarge: {
      name: 'kafka.m5.2xlarge',
      partitions: '2000 recommended max partition count',
      vCPU: 'vCPUU+ff1a 8',
      mem: "Memory (GiB)U+ff1a 32",
      gbps: "Network bandwidth (Gbps)U+ff1a 10"
    },
    _4xlarge: {
      name: 'kafka.m5.4xlarge',
      partitions: '4000 recommended max partition count',
      vCPU: 'vCPUU+ff1a 16',
      mem: "Memory (GiB)U+ff1a 64",
      gbps: "Network bandwidth (Gbps)U+ff1a 10"
    },
    _8xlarge: {
      name: 'kafka.m5.8xlarge',
      partitions: '4000 recommended max partition count',
      vCPU: 'vCPUU+ff1a 32',
      mem: "Memory (GiB)U+ff1a 128",
      gbps: "Network bandwidth (Gbps)U+ff1a 10"
    },
    _12xlarge: {
      name: 'kafka.m5.12xlarge',
      partitions: '4000 recommended max partition count',
      vCPU: 'vCPUU+ff1a 48',
      mem: "Memory (GiB)U+ff1a 192",
      gbps: "Network bandwidth (Gbps)U+ff1a 12"
    },
    _16xlarge: {
      name: 'kafka.m5.16xlarge',
      partitions: '4000 recommended max partition count',
      vCPU: 'vCPUU+ff1a 64',
      mem: "Memory (GiB)U+ff1a 256",
      gbps: "Network bandwidth (Gbps)U+ff1a 20"
    },
    _24xlarge: {
      name: 'kafka.m5.24xlarge',
      partitions: '4000 recommended max partition count',
      vCPU: 'vCPUU+ff1a 64',
      mem: "Memory (GiB)U+ff1a 256",
      gbps: "Network bandwidth (Gbps)U+ff1a 25"
    },
  };

  const dispatch = useAppDispatch();
  const [sizeValue, setSizeValue] = useState('');

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setClusterSize(sizeValue));
  };

  const onSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSizeValue(e.target.value);
  };

  return (
    <div className='flex h-[70vh] flex-col items-center justify-center'>
      <h1 className='mb-8 text-2xl font-bold'>Select Server Size</h1>
    </div>
  );
};

export default ClusterSize;
