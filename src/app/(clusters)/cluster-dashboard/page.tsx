import React from "react";
import { type Cluster } from "@prisma/client";
import { redirect } from 'next/navigation';
import { getServerAuthSession } from '~/server/auth';
import { prisma } from '../../../server/db'

import * as fs from 'fs';
import * as path from 'path';

import ClusterCard from "~/app/components/ClusterCard";
import CreateClusterCard from "~/app/components/CreateClusterCard";


const ClusterDashboard = async () => {
  const sessionData = await getServerAuthSession();
  if (!sessionData) {
    redirect('../../api/auth/signin?callbackUrl=/cluster-dashboard');
  }

  let clusters: Cluster[] = [];
  try {
    clusters = await prisma.cluster.findMany({
      where: {
        userId: sessionData?.user?.id,
      },
    });

  } catch (error) {
    console.log(error);
  }

  const srcPath = path.join('./src/server/targets.json');
  console.log(srcPath);
  const destPath = path.resolve('/usr/app/config', 'targets.json');
  fs.copyFileSync(srcPath, destPath);
  console.log('copied file over', srcPath, ' and ', destPath);

  return (
    <>
      <div className="mx-20 my-8">
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
