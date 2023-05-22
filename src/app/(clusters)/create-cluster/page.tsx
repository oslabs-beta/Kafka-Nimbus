'use client';
import React, { useEffect, useState } from 'react';
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

import { redirect } from 'next/navigation';

// TRPC IMPORTS
import { api } from '~/trpc/api';

type ComponentState = {
  inFocus: string;
};

const CreateClusterPage = () => {
  const [inFocus, setInFocus] = useState<ComponentState['inFocus']>('provider');
  const { createCluster } = useAppSelector((state) => state);
  const { data: sessionData } = useSession();

  const inFocusHandler = (string: string) => {
    setInFocus(string);
  };

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

  const saveCLustertoDb = api.database.createCluster.useQuery({
    id: sessionData?.user.id ? sessionData?.user.id : '',
    awsId,
    awsSecret,
    brokerNumbers,
    region,
    clusterName,
    provider,
    storagePerBroker,
    clusterSize,
  });

  const createClusterHandler = () => {
    // const aws = api.createVPC.createVPC.useQuery({
    //   aws_access_key_id: awsId,
    //   aws_secret_access_key: awsSecret,
    //   id: sessionData?.user.id ? sessionData?.user.id : '',
    //   region: region,
    // });

    redirect('/cluster-dashboard');
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
      return <ClusterLoadingState inFocusHandler={inFocusHandler} />;
  }
};

export default CreateClusterPage;
