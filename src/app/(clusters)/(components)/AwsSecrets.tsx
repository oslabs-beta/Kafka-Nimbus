"use client";
import React, { useState } from "react";
import { useAppDispatch } from "~/app/redux/hooks";
import {
  setAwsId,
  setAwsSecret,
} from "~/app/redux/features/createClusterSlice";

interface ProviderProps {
  inFocusHandler: (string: string) => void;
}

const AwsSecrets: React.FC<ProviderProps> = ({ inFocusHandler }) => {
  const dispatch = useAppDispatch();
  const [awsIdValue, setAwsIdValue] = useState<string>("");
  const [awsSecretValue, setAwsSecretValue] = useState<string>("");

  const onSubmitHandler = () => {
    dispatch(setAwsId(awsIdValue));
    dispatch(setAwsSecret(awsSecretValue));
    inFocusHandler("region");
  };

  const idChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setAwsIdValue(event.currentTarget.value);
  };
  const secretChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setAwsSecretValue(event.currentTarget.value);
  };

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center ">
      <div className="form-control w-full max-w-xs">
        <form id="aws-form" onSubmit={onSubmitHandler}>
          <label htmlFor="aws-form" className="label">
            AWS Id
          </label>
          <input
            onChange={idChangeHandler}
            type="text"
            placeholder="Secret"
            className="input input-bordered w-full max-w-xs"
          />
          <label htmlFor="aws-form" className="label">
            AWS Secret
          </label>
          <input
            onChange={secretChangeHandler}
            type="text"
            placeholder="Secret"
            className="input input-bordered w-full max-w-xs"
          />
        </form>
      </div>
    </div>
  );
};

export default AwsSecrets;
