"use client";
import React, { Suspense, useState } from "react";
import { useAppDispatch } from "~/app/redux/hooks";
import {
  settopicName,
  setPartitions,
  setReplications,
} from "~/app/redux/features/topicSlice";

interface ProviderProps {
  inFocusHandler: (string: string) => void;
}

const TopicInfo: React.FC<ProviderProps> = ({}) => {
  const dispatch = useAppDispatch();
  const [number, setNumber] = useState(0);
  const [topicNameValue, settopicName] = useState<string>("");
  const [partitionValue, setPartitions] = useState<number>(0);
  const [replicationValue, setReplications] = useState<number>(1);
  const TopicReplications: number[] = [1, 2, 3];
  const TopicPartitions: number[] = [1, 2, 3];

  const onSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumber(e.target.value);
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(settopicName(topicNameValue));
    dispatch(setPartitions(partitionValue));
    dispatch(setReplications(replicationValue));
  };

  const nameChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    settopicName(event.currentTarget.value);
  };
  const partitionChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    setPartitions(event.currentTarget.value);
  };
  const replicationChangeHandler = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    console.log(event.currentTarget.value);
    setReplications(event.currentTarget.value);
  };

  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h1 className="mb-8 text-2xl font-bold">Create Topic</h1>
        <div className="form-control w-full max-w-xs ">
          <form id="aws-form" onSubmit={onSubmitHandler}>
            <label htmlFor="aws-form" className="label ">
              Topic Name
            </label>
            <input
              onChange={nameChangeHandler}
              type="text"
              placeholder="Topic Name"
              className="input-bordered input mt-1 w-full max-w-xs rounded-md p-2"
            />
            <label htmlFor="aws-form" className="label ">
              Replication Count
            </label>
            <select
              className="select-bordered select w-full max-w-xs"
              onChange={partitionChangeHandler}
            >
              <option disabled value={"How many replications"}>
                How Many replications
              </option>
              {TopicReplications.map((num) => (
                <option value={num} key={num}>
                  {num}
                </option>
              ))}
            </select>
            <label htmlFor="aws-form" className="label ">
              Number of Partitions
            </label>
            <select
              className="select-bordered select w-full max-w-xs"
              onChange={partitionChangeHandler}
            >
              <option disabled value={"How many replications"}>
                How Many replications
              </option>
              {TopicPartitions.map((num) => (
                <option value={num} key={num}>
                  {num}
                </option>
              ))}
            </select>
            <button className="btn-primary btn mt-6 w-full" type="submit">
              Submit
            </button>
            <button className="btn-primary btn mt-6 w-full" type="submit">
              Cancel
            </button>
          </form>
        </div>
      </div>
    </Suspense>
  );
};

export default TopicInfo;
