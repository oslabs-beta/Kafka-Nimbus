"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "~/app/redux/hooks";
import { setBrokerNumbers } from "~/app/redux/features/createClusterSlice";

interface ProviderProps {
  inFocusHandler: (string: string) => void;
}

const BrokerCounterInput: React.FC<ProviderProps> = ({ inFocusHandler }) => {
  const dispatch = useAppDispatch();
  const [number, setNumber] = useState(0);
  const brokerNumArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const clusterState = useAppSelector(state => state)

  const onSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumber(e.target.value);
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault()
    dispatch(setBrokerNumbers(number));
    console.log(clusterState)
  };

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center">
      <h1 className="mb-8 text-2xl font-bold">Select Brokers</h1>
      <form onSubmit={onSubmitHandler}>
        <select
          className="select-bordered select w-full max-w-xs"
          onChange={onSelectHandler}
        >
          <option disabled value={"How many brokers"}>
            How many brokers
          </option>
          {brokerNumArray.map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary btn mt-8 w-full">
          Submit
        </button>
      </form>
    </div>
  );
};

export default BrokerCounterInput;
