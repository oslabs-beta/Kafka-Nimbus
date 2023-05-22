"use client";
import React, { Suspense, useState } from "react";
import { useAppDispatch, useAppSelector} from "~/app/redux/hooks";
import {
  settopicName,
  settopicPartitions,
  settopicReplications,
} from "~/app/redux/features/topicSlice";

const TopicInfo: React.FC = ({ }) => {
  const dispatch = useAppDispatch();
  const [number, setNumber] = useState(0);
  const [topicNameValue, topicName] = useState<string>("");
  const [partitionValue, topicPartitions] = useState<number>(0);
  const [replicationValue, topicReplications] = useState<number>(1);
  const TopicReplications: number[] = [1, 2, 3];
  const TopicPartitions: number[] = [1, 2, 3];
  const { topics } = useAppSelector((state) => state);


  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(settopicName(topicNameValue));
    dispatch(settopicPartitions(partitionValue));
    dispatch(settopicReplications(replicationValue))
    console.log(topics)
  };

  const nameChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    topicName(event.currentTarget.value);
  };
  const partitionChangeHandler = (event: React.FormEvent<HTMLSelectElement>) => {
    console.log(event.currentTarget.value);
    topicPartitions(event.target.value);
  };
  const replicationChangeHandler = (event: React.FormEvent<HTMLSelectElement>) => {
    console.log(event.currentTarget.value);
    topicReplications(event.target.value);
  };

  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h1 className="mb-8 text-2xl font-bold">Create Consumer Group</h1>
        <div className="form-control w-full max-w-xs ">
          <form id="topic-form" onSubmit={onSubmitHandler}>
            <label htmlFor="topic-form" className="label ">
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
              // className="select-bordered select w-full max-w-xs"
              className="select-bordered select w-full max-w-xs "
              onChange={replicationChangeHandler}
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
                How Many partitions
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
