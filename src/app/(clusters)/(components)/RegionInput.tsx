"use client";
import React, { useState } from "react";
import { useAppDispatch } from "~/app/redux/hooks";
import { setRegion } from "~/app/redux/features/createClusterSlice";

interface ProviderProps {
  inFocusHandler: (string: string) => void;
}

const RegionInput: React.FC<ProviderProps> = ({ inFocusHandler }) => {
  const regions = [
    "N. Virginia (us-east-1)",
    "Ohio (us-east-2)",
    "Ireland (eu-west-1)",
    "Tokyo (ap-northeast-1)",
    "Oregon (us-west-2)",
  ];

  const dispatch = useAppDispatch();
  const [regionsArray, setRegionsArray] = useState(regions);
  const [currentRegion, setCurrentRegion] = useState<string>(
    "N. Virginia (us-east-1)"
  );

  const onSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const getContentInParentheses = (str: string): string => {
      const regex = /\(([^)]+)\)/; // Regular expression to match content inside parentheses
      const matches: RegExpMatchArray | null = str.match(regex); // Find matches using the regex
      const matchResult = matches !== null ? matches[1] : "";
      const result = matchResult !== undefined ? matchResult : "";
      return result; // Return the content inside the parentheses (group 1)
    };

    // changes region stored in state
    const selectedRegion = getContentInParentheses(e.target.value);
    setCurrentRegion(selectedRegion);
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setRegion(currentRegion));
    inFocusHandler("name");
  };

    // sets state to previous page
    const backHandler = (event: React.FormEvent) => {
      event.preventDefault();
      inFocusHandler("provider");
    };

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center text-center p-6">
      <h1 className="mb-8 text-2xl font-bold">Select Region</h1>
      <form onSubmit={onSubmitHandler}>
        <select
          className="select w-full max-w-xs shadow-xl"
          onChange={onSelectHandler}
        >
          <option disabled value={"Select Region"}>
            Select Region
          </option>
          {regionsArray.map((region) => {
            return (
              <option key={region} value={region}>
                {region}
              </option>
            );
          })}
        </select>
        <button type="submit" className="btn-primary btn mt-8 w-full max-w-xs">
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
  );
};

export default RegionInput;
