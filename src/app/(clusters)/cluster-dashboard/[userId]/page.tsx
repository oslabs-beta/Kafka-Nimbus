import React from "react";
import { PrismaClient, Cluster } from "@prisma/client";

import ClusterCard from "~/app/components/ClusterCard";
import CreateClusterCard from "~/app/components/CreateClusterCard";

interface PageProps {
  params: {
    userId: string;
  };
}



const ClusterDashboard = async ({ params }: PageProps) => {
  // error handling
  let clusters: Array<Cluster> = [];
  try {
    const prisma = new PrismaClient();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    clusters = await prisma.cluster.findMany({
      where: {
        userId: params.userId,
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
          <CreateClusterCard userId={params.userId}/>
        </div>
      </div>
    </>
  );
};

export default ClusterDashboard;
