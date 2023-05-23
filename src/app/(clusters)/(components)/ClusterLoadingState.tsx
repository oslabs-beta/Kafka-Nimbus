'use client';
import React from 'react';
import type { ComponentState } from '../create-cluster/page';



const ClusterNameInput: React.FC<ComponentState> = ({ loadingState }) => {
  return (
    <div className='flex h-[70vh] flex-col items-center justify-center'>
      <h1 className='mb-8 text-2xl font-bold'>
        {loadingState}
      </h1>
      <progress className='progress w-56'></progress>
    </div>
  );
};

export default ClusterNameInput;
