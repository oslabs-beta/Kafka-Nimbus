import React, {Children, cloneElement} from 'react';

export type metrics = {
  ClusterName: string;
  CreationTime: string;
  KafkaVersion: string;
  NumberOfBrokerNodes: number;
  State: string;
};

const layout = (props) => {
  const metrics: metrics = {
    ClusterName: 'ExampleCN',
    CreationTime: 'TypeDate',
    KafkaVersion: '3.8.1',
    NumberOfBrokerNodes: 4,
    State:
      'ACTIVE',
  };

  props.params.metrics = metrics

  return (
    <div>
      {/* <Page params={params} metrics={metrics} /> */}
      {props.children}
    </div>
  );
};

export default layout;
