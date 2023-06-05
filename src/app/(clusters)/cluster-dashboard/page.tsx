import React from "react";
import { type Cluster } from "@prisma/client";
import { redirect } from 'next/navigation';
import { getServerAuthSession } from '~/server/auth';
import { prisma } from '../../../server/db'

import ClusterCard from "~/app/components/ClusterCard";
import CreateClusterCard from "~/app/components/CreateClusterCard";


const ClusterDashboard = async () => {
  const sessionData = await getServerAuthSession();
  // if user is not logged in, will first go to log in page before going to cluster dashboard
  if (!sessionData) {
    redirect('../../api/auth/signin?callbackUrl=/cluster-dashboard');
  }

  let clusters: Cluster[] = [];
  // looks for clusters only made by user
  try {
    clusters = await prisma.cluster.findMany({
      where: {
        userId: sessionData?.user?.id,
      },
    });

  } catch (error) {
    console.log(error);
  }
  return (
    <>
      <div className="mx-20 my-8 py-16">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="my-8 text-lg">Your Clusters</p>
        <div className="flex flex-row gap-4 flex-wrap">
          {clusters
            ? clusters.map((cluster: Cluster) => {
              return <ClusterCard key={cluster.id} cluster={cluster} />;
            })
            : null}
          <CreateClusterCard  />
        </div>
      </div>
    </>
  );
};

export default ClusterDashboard;
