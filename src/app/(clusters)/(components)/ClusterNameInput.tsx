"use client";
import React, { useState } from "react";
import { useAppDispatch } from "~/app/redux/hooks";
import { setClusterName } from "~/app/redux/features/createClusterSlice";

interface ProviderProps {
  inFocusHandler: (string: string) => void;
}

const ClusterNameInput: React.FC<ProviderProps> = ({ inFocusHandler }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setClusterName(name));
    inFocusHandler("brokers");
  };

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center">
      <h1 className="mb-8 text-2xl font-bold">Name Cluster</h1>
      <form onSubmit={onSubmitHandler}>
        <input
          type="text"
          placeholder="my-cluster"
          className="input w-full max-w-xs shadow-xl"
          onChange={onChangeHandler}
        />
        <button type="submit" className="btn-primary btn mt-8 w-full">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ClusterNameInput;
