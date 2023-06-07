"use client";
import React, { useState } from "react";
import { useAppDispatch } from "~/app/redux/hooks";
import {
  setAwsId,
  setAwsSecret,
} from "~/app/redux/features/createClusterSlice";

//  ProviderProps is the focus handler
interface ProviderProps {
  inFocusHandler: (string: string) => void;
}

const AwsSecrets: React.FC<ProviderProps> = ({ inFocusHandler }) => {
  const dispatch = useAppDispatch();
  const [awsIdValue, setAwsIdValue] = useState<string>("");   // states to handle input
  const [awsSecretValue, setAwsSecretValue] = useState<string>("");

  // add current user info from state to redux
  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setAwsId(awsIdValue));
    dispatch(setAwsSecret(awsSecretValue));
    inFocusHandler("region");
  };

  // changes the aws id stored in state
  const idChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setAwsIdValue(event.currentTarget.value);
  };

  // changes the aws secret stored in state
  const secretChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setAwsSecretValue(event.currentTarget.value);
  };

  // sets state to previous page
  const backHandler = (event: React.FormEvent) => {
    event.preventDefault();
    inFocusHandler("provider");
  };

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center py-16">
      <h1 className="mb-8 text-2xl font-bold">AWS Credentials</h1>
      <div className="form-control w-full max-w-xs ">
        <form id="aws-form" onSubmit={onSubmitHandler}>
          <label htmlFor="aws-form" className="label ">
            AWS Id
          </label>
          <input
            onChange={idChangeHandler}
            type="text"
            placeholder="Id"
            className="input-bordered input mt-1 w-full max-w-xs rounded-md p-2"
          />
          <div className="mt-6">
            <label htmlFor="aws-form" className="label  ">
              AWS Secret
            </label>
            <input
              onChange={secretChangeHandler}
              type="text"
              placeholder="Secret"
              className="input-bordered input mt-1 w-full max-w-xs rounded-md p-2"
            />
          </div>
          <button className="btn-primary btn mt-6 w-full" type="submit">
            Submit
          </button>
          <button
            className="btn-primary btn mt-8 w-full max-w-xs"
            onClick={backHandler}
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default AwsSecrets;
