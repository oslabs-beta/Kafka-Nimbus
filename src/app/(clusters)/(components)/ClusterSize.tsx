import React, { useState } from "react";
import { useAppDispatch } from "~/app/redux/hooks";
import { setClusterSize } from "~/app/redux/features/createClusterSlice";

interface ProviderProps {
  inFocusHandler: (string: string) => void;
}

type StorageOptions = {
  name: string;
  partitions: string;
  vCPU: string;
  mem: string;
  gbps: string;
};

const ClusterSize: React.FC<ProviderProps> = ({ inFocusHandler }) => {
  const storageOptions: StorageOptions[] = [
    {
      name: "kafka.t3.small",
      partitions: "300 recommended max partition count",
      vCPU: "vCPU: 2",
      mem: "Memory (GiB): 2",
      gbps: "Network bandwidth (Gbps): 5",
    },
    {
      name: "kafka.m5.large",
      partitions: "1000 recommended max partition count",
      vCPU: "vCPU: 2",
      mem: "Memory (GiB): 8",
      gbps: "Network bandwidth (Gbps): 10",
    },
    {
      name: "kafka.m5.xlarge",
      partitions: "1000 recommended max partition count",
      vCPU: "vCPU: 4",
      mem: "Memory (GiB): 16",
      gbps: "Network bandwidth (Gbps): 10",
    },
    {
      name: "kafka.m5.2xlarge",
      partitions: "2000 recommended max partition count",
      vCPU: "vCPU: 8",
      mem: "Memory (GiB): 32",
      gbps: "Network bandwidth (Gbps): 10",
    },
    {
      name: "kafka.m5.4xlarge",
      partitions: "4000 recommended max partition count",
      vCPU: "vCPU: 16",
      mem: "Memory (GiB): 64",
      gbps: "Network bandwidth (Gbps): 10",
    },
    {
      name: "kafka.m5.8xlarge",
      partitions: "4000 recommended max partition count",
      vCPU: "vCPU: 32",
      mem: "Memory (GiB): 128",
      gbps: "Network bandwidth (Gbps): 10",
    },
    {
      name: "kafka.m5.12xlarge",
      partitions: "4000 recommended max partition count",
      vCPU: "vCPU: 48",
      mem: "Memory (GiB): 192",
      gbps: "Network bandwidth (Gbps): 12",
    },
    {
      name: "kafka.m5.16xlarge",
      partitions: "4000 recommended max partition count",
      vCPU: "vCPU: 64",
      mem: "Memory (GiB): 256",
      gbps: "Network bandwidth (Gbps): 20",
    },
    {
      name: "kafka.m5.24xlarge",
      partitions: "4000 recommended max partition count",
      vCPU: "vCPU: 64",
      mem: "Memory (GiB): 256",
      gbps: "Network bandwidth (Gbps): 25",
    },
  ];

  const dispatch = useAppDispatch();
  const [sizeValue, setSizeValue] = useState("kafka.t3.small");

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setClusterSize(sizeValue));
    inFocusHandler("brokers");
  };

  // changes cluster size stored in state
  const onSelectHandler = (size: string) => {
    console.log(size);
    setSizeValue(size);
  };

  // sets state to previous page
  const backHandler = (event: React.FormEvent) => {
    event.preventDefault();
    inFocusHandler("name");
  };

  return (
    <div className="flex flex-col items-center p-20">
      <div className="flex h-[45vh] flex-col items-center justify-center text-center">
        <h1 className="mb-8 text-2xl font-bold">Select Server Size</h1>
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col items-center justify-center "
        >
          <div className="dropdown ">
            <label
              tabIndex={0}
              className="select m-1 flex w-56 items-center shadow-xl "
            >
              {sizeValue}
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box flex w-full flex-col bg-base-100 p-2 shadow "
            >
              {storageOptions.map((storageOption) => (
                <li key={storageOption.name} className="cursor-pointer p-4">
                  <a onClick={() => onSelectHandler(storageOption.name)}>
                    {storageOption.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="submit"
            className="btn-primary btn mt-8 w-full max-w-xs"
            onSubmit={onSubmitHandler}
          >
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
      <div>
        {storageOptions.map((item) => {
          if (item.name === sizeValue) {
            return (
              <div
                className=" min-w-xl overflow-x-auto rounded-xl border-2 shadow-lg "
                key={item.name}
              >
                <table className="table w-full items-center justify-center">
                  <thead>
                    <tr className="bg-slate-200">
                      <th>Name</th>
                      <th>Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>GBS</td>
                      <td>{item.gbps}</td>
                    </tr>
                    <tr>
                      <td>Memory</td>
                      <td>{item.mem}</td>
                    </tr>
                    <tr>
                      <td>Partitions</td>
                      <td>{item.partitions}</td>
                    </tr>
                    <tr>
                      <td>vCPU</td>
                      <td>{item.vCPU}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default ClusterSize;
