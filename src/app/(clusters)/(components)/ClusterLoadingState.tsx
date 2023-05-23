'use client';
import React from 'react';

interface ProviderProps {
  inFocusHandler: (string: string) => void;
}

const ClusterNameInput: React.FC<ProviderProps> = ({ inFocusHandler }) => {
  return (
    <div className='flex h-[70vh] flex-col items-center justify-center'>
      <progress className='progress w-56'></progress>
    </div>
  );
};

export default ClusterNameInput;
