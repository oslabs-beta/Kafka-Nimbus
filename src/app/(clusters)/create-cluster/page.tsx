'use client';
import React, { useState } from 'react';
import { useAppSelector } from '~/app/redux/hooks';
import { useSession } from 'next-auth/react';
import CloudProvider from '../(components)/CloudProvider';
import AwsSecrets from '../(components)/AwsSecrets';
import RegionInput from '../(components)/RegionInput';
import ClusterNameInput from '../(components)/ClusterNameInput';
import BrokerCountInput from '../(components)/BrokerCounterInput';
import StoragePerBroker from '../(components)/StoragePerBroker';
import ClusterSize from '../(components)/ClusterSize';
import ClusterLoadingState from '../(components)/ClusterLoadingState';

import { useRouter } from 'next/navigation';

// TRPC IMPORTS
import { trpc } from '../../../trpc/trpc-provider';

export type ComponentState = {
  inFocus: string;
  loadingState: string;
};

const CreateClusterPage = () => {
  const [inFocus, setInFocus] = useState<ComponentState['inFocus']>('provider');
  const [loadingState, setLoadingState] = useState<ComponentState['loadingState']>('Creating VPC')
  const { createCluster } = useAppSelector((state) => state);
  const router = useRouter()
  const { data: sessionData } = useSession();
  const createVPC = trpc.createVPC.createVPC.useMutation();
  const createNewCluster = trpc.createCluster.createCluster.useMutation()
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
      provider,
      storagePerBroker,
      clusterSize,
    } = createCluster;


    await createVPC.mutateAsync({
      aws_access_key_id: awsId,
      aws_secret_access_key: awsSecret,
      id: sessionData?.user.id ? sessionData?.user.id : '',
      region: region,
    });

    setLoadingState('Creating Cluster')
    await createNewCluster.mutateAsync({
      brokerPerZone: brokerNumbers,
      id: sessionData?.user.id ? sessionData?.user.id : '',
      instanceSize: clusterSize,
      name: clusterName,
      storagePerBroker: storagePerBroker,
      zones: 2
    })

    router.push('/cluster-dashboard');
  };

  switch (inFocus) {
    case 'provider':
      return <CloudProvider inFocusHandler={inFocusHandler} />;
    case 'aws':
      return <AwsSecrets inFocusHandler={inFocusHandler} />;
    case 'region':
      return <RegionInput inFocusHandler={inFocusHandler} />;
    case 'name':
      return <ClusterNameInput inFocusHandler={inFocusHandler} />;
    case 'size':
      return <ClusterSize inFocusHandler={inFocusHandler} />;
    case 'brokers':
      return <BrokerCountInput inFocusHandler={inFocusHandler} />;
    case 'storage':
      return (
        <StoragePerBroker
          inFocusHandler={inFocusHandler}
          createClusterHandler={createClusterHandler}
        />
      );
    case 'loading':
      return <ClusterLoadingState loadingState={loadingState }/>;
  }
};

export default CreateClusterPage;
