/* eslint-disable @next/next/no-img-element */
import * as React from "react";

export interface cardCluster {
  cluster: {
    img: string;
    name: string;
  };
}

export default function ClusterCard({ cluster }: cardCluster) {
  return (
    <div className="card bg-base-100 h-48 w-72 overflow-hidden rounded-xl shadow-xl hover:ring-4 ">
      <figure className="w-full  ">
        <img
          src={cluster.img}
          alt="cluster-image"
          className="h-24 w-full object-cover"
        />
      </figure>
      <div className="m-4 flex  w-full">
        <h2 className="card-title ">{cluster.name}</h2>
      </div>
    </div>
  );
}
