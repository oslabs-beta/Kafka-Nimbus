"use client";
import React, { useState } from "react";
import { ChevronRightIcon, Bars3Icon } from "@heroicons/react/24/solid";
import ClusterConsumers from "./components/ClusterConsumers";
import ClusterMetrics from "./components/ClusterMetrics";
import ClusterTopics from "./components/ClusterTopics";

type Props = {
  inFocus: string;

};

const Page = (props: Props) => {
  const [inFocus, setInFocus] = useState<string>("metrics");
  let result;

  switch (inFocus) {
    case "consumers":
      result = <ClusterConsumers />;
      break;
    case "metrics":
      result = <ClusterMetrics />;
      break;
    case "topics":
      result = <ClusterTopics />;
      break;
  }

  return (
    <>
      <div className="drawer w-screen">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* <!-- Page content here --> */}
          <label
            htmlFor="my-drawer"
            className="drawer-button absolute mx-4  my-4 "
          >
            <Bars3Icon height={24} width={24} />
          </label>
          {result}
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu w-80 bg-base-100 p-4 text-base-content">
            {/* <!-- Sidebar content here --> */}
            <li>
              <a onClick={() => setInFocus("metrics")}>Metrics</a>
            </li>
            <li>
              <a className="" onClick={() => setInFocus("consumers")}>
                Consumers
              </a>
            </li>
            <li>
              <a onClick={() => setInFocus("topics")}>Topics</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu w-80 bg-base-100 p-4 text-base-content">
          {/* <!-- Sidebar content here --> */}
          <li>
            <a className="" onClick={() => setInFocus("consumers")}>
              Consumers
            </a>
          </li>
          <li>
            <a onClick={() => setInFocus("metrics")}>Metrics</a>
          </li>
          <li>
            <a onClick={() => setInFocus("topics")}>Topics</a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Page;
