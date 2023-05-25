/* eslint-disable @next/next/no-img-element */
"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { trpc } from '../../trpc/trpc-provider';

export interface cardCluster {
  cluster: {
    img: string;
    name: string;
    id: string;
  };
}


export default function ClusterCard({ cluster }: cardCluster) {
  const router = useRouter();
  // Fetching the cluster status to display
  const { data: status } = trpc.createCluster.checkClusterStatus.useQuery({
    name: cluster.name
  })


  const routeToCluster = () => {
    router.push(`${cluster.id}/dashboard`);
  };
  try {

  }
  catch (err) {
    console.log('couldn\'t get cluster status')
  }

  return (
    <div onClick={routeToCluster} className="card bg-base-100 h-48 w-72 overflow-hidden rounded-xl shadow-xl hover:ring-4 ">
      <figure className="w-full  ">
        <img
          src={cluster.img}
          alt="cluster-image"
          className="h-24 w-full object-cover"
        />
      </figure>
      <div className="m-4 flex  w-full">
        <h2 className="card-title ">{cluster.name}</h2>
        <p className="px-3">{status}</p>
      </div>
    </div>
  );
}
