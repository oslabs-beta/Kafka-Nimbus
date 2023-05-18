'use client';
import React, { useState } from 'react';
import { useAppDispatch } from '~/app/redux/hooks';
import { setStoragePerBroker } from '~/app/redux/features/createClusterSlice';

interface ProviderProps {
  inFocusHandler: (string: string) => void;
}

const StoragePerBroker: React.FC<ProviderProps> = ({ inFocusHandler }) => {
  const dispatch = useAppDispatch();
  const [numValue, setNumValue] = useState<number>(0);

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setStoragePerBroker(numValue));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setNumValue(value);
  };

  return (
    <div className='flex h-[70vh] flex-col items-center justify-center'>
      <h1 className='mb-8 text-2xl font-bold'>
        Enter Storage Amount Per Broker
      </h1>
      <form onSubmit={onSubmitHandler}>
        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>Enter amount</span>
          </label>
          <label className='input-group'>
            <input
              type='number'
              placeholder='10'
              className='input-bordered input'
              onChange={handleInputChange}
            />
            <span>GB</span>
          </label>
        </div>
        <button type='submit' className='btn-primary btn mt-8 w-full'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default StoragePerBroker;
