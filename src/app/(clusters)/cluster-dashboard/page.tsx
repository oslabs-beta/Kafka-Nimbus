import React from "react";
import { PrismaClient, type Cluster } from "@prisma/client";
import { redirect } from 'next/navigation';
import { getServerAuthSession } from '~/server/auth';


import ClusterCard from "~/app/components/ClusterCard";
import CreateClusterCard from "~/app/components/CreateClusterCard";


const ClusterDashboard = async () => {
  const sessionData = await getServerAuthSession();
  if (!sessionData) {
    redirect('../../api/auth/signin?callbackUrl=/cluster-dashboard');
  }

  // error handling
  let clusters: Cluster[] = [];
  try {
    const prisma = new PrismaClient();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
      <div className="mx-20 my-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="my-8 text-lg">Your Clusters</p>
        <div className="flex flex-row gap-4">
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
