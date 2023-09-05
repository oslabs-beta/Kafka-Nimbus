"use client";
// react and redux imports
import React, { useState } from "react";
import { useAppSelector } from "~/app/redux/hooks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// component imports
import CloudProvider from "../(components)/CloudProvider";
import AwsSecrets from "../(components)/AwsSecrets";
import RegionInput from "../(components)/RegionInput";
import ClusterNameInput from "../(components)/ClusterNameInput";
import BrokerCountInput from "../(components)/BrokerCounterInput";
import StoragePerBroker from "../(components)/StoragePerBroker";
import ClusterSize from "../(components)/ClusterSize";
import ClusterLoadingState from "../(components)/ClusterLoadingState";

// TRPC IMPORTS
import { trpc } from "../../../trpc/trpc-provider";

// Which component is currently in view 
export type ComponentState = {
  inFocus?: string;
  loadingState: string;
};

const CreateClusterPage = () => {
  const router = useRouter();   // use router hook
  const [inFocus, setInFocus] = useState<ComponentState["inFocus"]>("provider");  // state that switches which component is in focus
  const [loadingState, setLoadingState] =
    useState<ComponentState["loadingState"]>("Creating VPC");   // loading state when the user creates cluster
  const { createCluster } = useAppSelector((state) => state);   // pulling down the redux store, createCluster slice
  const { data: sessionData } = useSession(); // gets current user info. .id references
  const createVPC = trpc.createVPC.createVPC.useMutation(); // createVPC route, as hook
  const createNewCluster = trpc.createCluster.createCluster.useMutation(); // create cluster route, as hook
  const id = (sessionData?.user) ? sessionData.user.id : '';    // which user is currently logged in
  const findVPC = trpc.createVPC.findVPC.useQuery({ id }); // defining the query

  /**
   * Handles which component is in view / focus
   */
  const inFocusHandler = (string: string) => {
    setInFocus(string);
  };

  /**
   * Takes user input and sends it to the create cluster route
   */
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
        zones: zones, 
      });
    } else {
      throw new Error("Error, user not found");
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
