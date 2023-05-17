/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useAppDispatch } from "~/app/redux/hooks";
import { setProvider } from "~/app/redux/features/createClusterSlice";

interface ProviderProps {
  inFocusHandler: (string: string) => void;
}

const CloudProvider: React.FC<ProviderProps> = ({ inFocusHandler }) => {
  const dispatch = useAppDispatch();

  const onClickHandler = () => {
    inFocusHandler("aws");
    dispatch(setProvider("aws"));
  };

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center ">
      <h1 className="mb-8 text-3xl">Choose Your Provider</h1>
      <div
        onClick={onClickHandler}
        className="flex h-48  w-48 items-center justify-center rounded-xl bg-slate-100 shadow-lg hover:shadow-2xl hover:ring-4"
      >
        <img
          className=""
          src="https://www.zencos.com/wp-content/uploads/2021/11/aws-logo.png"
          alt="aws-cloud-provider"
        />
      </div>
    </div>
  );
};

export default CloudProvider;