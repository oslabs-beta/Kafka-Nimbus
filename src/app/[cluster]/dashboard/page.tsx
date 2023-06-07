"use client";
// react imports
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~/app/redux/hooks";
import {
  updateClusterInfo,
} from "~/app/redux/features/clusterInfoSlice";

// component imports
import ClusterConsumers from "./components/ClusterConsumers";
import ClusterMetrics from "./components/ClusterMetrics";
import ClusterTopics from "./components/ClusterTopics";
import { Bars3Icon } from "@heroicons/react/24/solid";


// type imports
import type { metrics, topics, consumerGroups } from './layout';

// Giving a type to prop to the type of page
// this is the props of the cluster layout
type PageProps = {
  params: { metrics: metrics; topics: topics; consumerGroups: consumerGroups, cluster: string };
};

const Page = ({ params }: PageProps) => {
  // pulling in redux dispatch
  const dispatch = useAppDispatch();
  // saving the metrics to the clusterMetrics store
  useEffect(() => {
    dispatch(updateClusterInfo(params.metrics));
  }, []);
  // retrieving those metrics to pass to ClusterMetrics components
  const { clusterInfo } = useAppSelector((state) => state);
  const [inFocus, setInFocus] = useState<string>("metrics");
  let result;

  /**
   * Rendering the new page when you navigate using the side bar
   */
  switch (inFocus) {
    case "consumers":
      result = <ClusterConsumers consumers={params.consumerGroups} />;
      break;
    case "metrics":
      result = <ClusterMetrics clusterInfo={clusterInfo} metricsDashboard={params.metrics.metricsDashboard} />;
      break;
    case "topics":
      result = (
        <ClusterTopics
          clusterInfo={clusterInfo}
          topics={params.topics}
          clusterid={params.cluster}
        />
      );
      break;
  }

  return (
    <div className="drawer w-screen overflow-hidden py-16">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Renders a new component here, based on state */}
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
          {/* Content displayed on the side bar menu */}
          <li>
            <a onClick={() => setInFocus("metrics")}>Metrics</a>
          </li>
          <li>
            <a className="" onClick={() => setInFocus("consumers")}>Consumers</a>
          </li>
          <li>
            <a onClick={() => setInFocus("topics")}>Topics</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Page;
