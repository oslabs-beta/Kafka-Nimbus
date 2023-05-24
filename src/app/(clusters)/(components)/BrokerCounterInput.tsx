'use client';
import React, { useState } from 'react';
import { useAppDispatch } from '~/app/redux/hooks';
import { setBrokerNumbers } from '~/app/redux/features/createClusterSlice';

interface ProviderProps {
  inFocusHandler: (string: string) => void;
}

const BrokerCounterInput: React.FC<ProviderProps> = ({ inFocusHandler }) => {
  const dispatch = useAppDispatch();
  const [number, setNumber] = useState(0);
  const brokerNumArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  

  const onSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumber(Number(e.target.value));
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setBrokerNumbers(number));
    inFocusHandler('storage');
  };

  return (
    <div className='flex h-[70vh] flex-col items-center justify-center'>
      <h1 className='mb-4 text-2xl font-bold'>Select Zones</h1>
      <form onSubmit={onSubmitHandler}>
        <select
          className='select-bordered select w-full max-w-xs'
          onChange={onSelectHandler}
          defaultValue={4}
        >
          <option disabled value={'How many brokers'}>
            How many zones
          </option>
          <option value={2} key={2}>
            2 *recommended
          </option>
          <option value={3} key={3}>
            3
          </option>
        </select>
        <h1 className='mb-4 mt-12 text-2xl font-bold'>
          Select brokers per zone
        </h1>
        <select
          className='select-bordered select w-full max-w-xs'
          onChange={onSelectHandler}
        >
          <option disabled value={'How many brokers'}>
            How many brokers
          </option>
          {brokerNumArray.map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
        <button type='submit' className='btn-primary btn mt-8 w-full'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default BrokerCounterInput;
