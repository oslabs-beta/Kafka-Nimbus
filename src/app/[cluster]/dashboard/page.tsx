  'use client';
  import React, { useState, useEffect } from 'react';
  import { Bars3Icon } from '@heroicons/react/24/solid';
  import ClusterConsumers from './components/ClusterConsumers';
  import ClusterMetrics from './components/ClusterMetrics';
  import ClusterTopics from './components/ClusterTopics';
  import type { metrics } from './layout';
  import type { topics } from './layout'
  import type { consumerGroups } from './layout'


  //REDUX
  import { useAppDispatch, useAppSelector } from '~/app/redux/hooks';
  import {
    ClusterInfo,
    updateClusterInfo,
  } from '~/app/redux/features/clusterInfoSlice';


type Props = {
  inFocus: string;
  
  // cluster: {
  //   clusterId:'string',
  // }
};

  type Props = {
    inFocus: string;
    params: { metrics: metrics, topics:topics, consumerGroups: consumerGroups };
  };


  const Page = ({ params }: Props) => {
    console.log("params:", params);
    // console.log("params.topics:", params.topics)
    // pulling in redux dispatch
    const dispatch = useAppDispatch();
    // saving the metircs to the clusterMetrics store
    // console.log("params:", params);
    useEffect(() => {
      dispatch(updateClusterInfo(params.metrics));
    }, []);
    // retrieving those metrics to pass to ClusterMetrics components
    const { clusterInfo } = useAppSelector((state) => state);
    const [inFocus, setInFocus] = useState<string>('metrics');
    let result;

    switch (inFocus) {
      case 'consumers':
        result = <ClusterConsumers consumer={params.consumerGroups} />;
        break;
      case 'metrics':
        result = <ClusterMetrics clusterInfo={clusterInfo} />;
        break;
      case 'topics':
        result = <ClusterTopics clusterInfo={clusterInfo} topics={params.topics} clusterid={params.cluster}/>;
        break;
    }

    return (
      <div className='drawer w-screen overflow-hidden'>
        <input id='my-drawer' type='checkbox' className='drawer-toggle' />
        <div className='drawer-content'>
          {/* <!-- Page content here --> */}
          <label
            htmlFor='my-drawer'
            className='drawer-button absolute mx-4  my-4 '
          >
            <Bars3Icon height={24} width={24} />
          </label>
          {result}
        </div>
        <div className='drawer-side'>
          <label htmlFor='my-drawer' className='drawer-overlay'></label>
          <ul className='menu w-80 bg-base-100 p-4 text-base-content'>
            {/* <!-- Sidebar content here --> */}
            <li>
              <a onClick={() => setInFocus('metrics')}>Metrics</a>
            </li>
            <li>
              <a className='' onClick={() => setInFocus('consumers')}>
                Consumers
              </a>
            </li>
            <li>
              <a onClick={() => setInFocus('topics')}>Topics</a>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  export default Page;
