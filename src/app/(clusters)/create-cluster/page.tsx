"use client";
import React, { useState } from "react";
import { useAppSelector } from "~/app/redux/hooks";
import { useSession } from "next-auth/react";
import CloudProvider from "../(components)/CloudProvider";
import AwsSecrets from "../(components)/AwsSecrets";
import RegionInput from "../(components)/RegionInput";
import ClusterNameInput from "../(components)/ClusterNameInput";
import BrokerCountInput from "../(components)/BrokerCounterInput";
import StoragePerBroker from "../(components)/StoragePerBroker";
import ClusterSize from "../(components)/ClusterSize";
import ClusterLoadingState from "../(components)/ClusterLoadingState";

import { useRouter } from "next/navigation";

// TRPC IMPORTS
import { trpc } from "../../../trpc/trpc-provider";

export type ComponentState = {
  inFocus: string;
  loadingState: string;
};

const CreateClusterPage = () => {
  const [inFocus, setInFocus] = useState<ComponentState["inFocus"]>("provider");
  const [loadingState, setLoadingState] =
    useState<ComponentState["loadingState"]>("Creating VPC");
  const { createCluster } = useAppSelector((state) => state);
  const router = useRouter();
  const { data: sessionData } = useSession(); // gets current user info. .id references
  const createVPC = trpc.createVPC.createVPC.useMutation(); // createVPC route, as hook
  const createNewCluster = trpc.createCluster.createCluster.useMutation(); // create cluster route, as hook
  const findVPC = trpc.createVPC.findVPC.useQuery({ id: sessionData?.user.id }); // defining the query
  const inFocusHandler = (string: string) => {
    setInFocus(string);
  };

  const createClusterHandler = async () => {
    const {
      awsId,
      awsSecret,
      brokerNumbers,
      region,
      clusterName,
      storagePerBroker,
      clusterSize,
      zones,
    } = createCluster;

    // gets the vpcdata from the find vpc route
    // if it returns undefined, then we do error handling
    const vpcId = findVPC.data;
    console.log(vpcId);
    if (vpcId !== undefined) {
      setLoadingState("Creating Cluster"); // sends us to loading page
      if (vpcId === "") {
        // if vpcId is an empty string, vpc hasn't been created yet. so we
        // create it.
        await createVPC.mutateAsync({
          aws_access_key_id: awsId,
          aws_secret_access_key: awsSecret,
          id: sessionData?.user.id ? sessionData?.user.id : "",
          region: region,
        });
      }
      // we will now create the cluster
      await createNewCluster.mutateAsync({
        brokerPerZone: brokerNumbers,
        id: sessionData?.user.id ? sessionData?.user.id : "",
        instanceSize: clusterSize,
        name: clusterName,
        storagePerBroker: storagePerBroker,
        zones: zones, // at the moment this is hard coded in as 2
      });
    } else {
      /**
       * TODO: Error Handling
       */
      console.log("Error, user not found");
    }

    router.push("/cluster-dashboard");
  };


  // rerenders new component instead of redirecting to new page while navigating through cluster creation
  switch (inFocus) {
    case "provider":
      return (
        <CloudProvider
          vpcId={findVPC.data}
          sessionData={sessionData}
          inFocusHandler={inFocusHandler}
        />
      );
    case "aws":
      return <AwsSecrets inFocusHandler={inFocusHandler} />;
    case "region":
      return <RegionInput inFocusHandler={inFocusHandler} />;
    case "name":
      return <ClusterNameInput inFocusHandler={inFocusHandler} />;
    case "size":
      return <ClusterSize inFocusHandler={inFocusHandler} />;
    case "brokers":
      return <BrokerCountInput inFocusHandler={inFocusHandler} />;
    case "storage":
      return (
        <StoragePerBroker
          inFocusHandler={inFocusHandler}
          createClusterHandler={createClusterHandler}
        />
      );
    case "loading":
      return <ClusterLoadingState loadingState={loadingState} />;
  }
};

export default CreateClusterPage;
