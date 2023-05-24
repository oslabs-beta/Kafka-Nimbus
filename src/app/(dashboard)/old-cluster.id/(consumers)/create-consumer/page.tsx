"use client";
import React, { Suspense, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/app/redux/hooks";
import {
  setid,
  setEndpoint,
  setStatus,
} from "~/app/redux/features/clusterInfoSlice";

const TopicInfo: React.FC = ({}) => {
  const dispatch = useAppDispatch();
  const [Status, changeStatus] = useState<string>("");
  const [Endpoint, changeEndpoint] = useState<number>(0);
  const [id, changeid] = useState<number>(1);
  const ListOfTopics: string[] = ["topic 1", "topic 2", "topic 3"];
  const EntryPoint: string[] = ["Start", "Middle", "End"];
  const { consumerGroup } = useAppSelector((state) => state);

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setStatus(Status));
    dispatch(setEndpoint(Endpoint));
    dispatch(setid(id));
    console.log(consumerGroup);
  };

  const statusHandler = (event: React.FormEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    changeStatus(event.currentTarget.value);
  };
  const endpointHandler = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    console.log(event.currentTarget.value);
    changeEndpoint(event.target.value);
  };

  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h1 className="mb-8 text-2xl font-bold">Create Consumer Group</h1>
        <div className="form-control w-full max-w-xs ">
          <form id="topic-form" onSubmit={onSubmitHandler}>
            <label htmlFor="aws-form" className="label ">
              Topics
            </label>
            <select
              className="select-bordered select w-full max-w-xs "
              onChange={endpointHandler}
            >
              <option disabled value={"How many replications"}></option>
              {ListOfTopics.map((str) => (
                <option value={str} key={str}>
                  {str}
                </option>
              ))}
            </select>
            <label htmlFor="aws-form" className="label ">
              Data Entry point
            </label>
            <select
              className="select-bordered select w-full max-w-xs "
              onChange={statusHandler}
            >
              <option disabled value={"How many replications"}></option>
              {EntryPoint.map((str) => (
                <option value={str} key={str}>
                  {str}
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
