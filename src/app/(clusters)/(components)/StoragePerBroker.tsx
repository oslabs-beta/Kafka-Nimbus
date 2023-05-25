'use client';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/app/redux/hooks';
import { setStoragePerBroker } from '~/app/redux/features/createClusterSlice';

interface ProviderProps {
  inFocusHandler: (string: string) => void;
  createClusterHandler: () => void
}

const StoragePerBroker: React.FC<ProviderProps> = ({ inFocusHandler, createClusterHandler }) => {
  const dispatch = useAppDispatch();
  const { createCluster } = useAppSelector((state) => state);

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(createCluster);
    createClusterHandler()
    inFocusHandler('loading')
  };

  // this is one step behind for some reason
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    dispatch(setStoragePerBroker(value));   // should be dispatching on every change
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
