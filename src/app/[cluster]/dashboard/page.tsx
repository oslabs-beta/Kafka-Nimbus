'use client';
import React, { useState } from 'react';
import ClusterConsumers from './components/ClusterConsumers';
import ClusterMetrics from './components/ClusterMetrics';
import ClusterTopics from './components/ClusterTopics';

type Props = {
  inFocus: string;
  // cluster: {
  //   clusterId:'string',
  // }
};

const Page = (props: Props) => {
  const [inFocus, setInFocus] = useState<string>('consumers');
  let result;

  switch (inFocus) {
    case 'consumers':
      result = <ClusterConsumers />;
      break;
    case 'metrics':
      result = <ClusterMetrics />;
      break;
    case 'topics':
      result = <ClusterTopics />;
      break;
  }

  return (
    
      <div className='drawer'>
        <input id='my-drawer' type='checkbox' className='drawer-toggle' />
        <div className='drawer-content'>
          {/* <!-- Page content here --> */}
          {result}
          <label htmlFor='my-drawer' className='btn-primary drawer-button btn'>
            Open drawer
          </label>
        </div>
        <div className='drawer-side'>
          <label htmlFor='my-drawer' className='drawer-overlay'></label>
          <ul className='menu w-80 bg-base-100 p-4 text-base-content'>
            {/* <!-- Sidebar content here --> */}
            <li>
              <a onClick={() => setInFocus('consumers')}>Consumers</a>
            </li>
            <li>
              <a onClick={() => setInFocus('metrics')}>Metrics</a>
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
