// import statements
import { prisma } from '../db';
import type AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import {
  KafkaClient,
  GetBootstrapBrokersCommand,
  UpdateConnectivityCommand,
  DescribeClusterCommand,
} from '@aws-sdk/client-kafka';

export const getClusterResponse = async (id: string) => {
  try {
    const clusterResponse = await prisma.cluster.findUnique({
      where: {
        id: id,
      },
      include: {
        User: true,
      },
    });
    if (clusterResponse?.User === undefined) {
      throw new Error('User does not exist on the cluster Response');
    }

    // only take out the values that we need
    const response = {
      awsAccessKey: clusterResponse?.User.awsAccessKey,
      awsSecretAccessKey: clusterResponse?.User.awsSecretAccessKey,
      region: clusterResponse?.User.region,
      lifeCycleStage: clusterResponse?.lifeCycleStage,
      kafkaArn: clusterResponse?.kafkaArn,
    };
    return response;
  } catch (err) {
    throw new Error('Error finding the unique user in database');
  }
};

/**
 *
 * @param kafka
 * @param kafkaArn
 * @returns curState of the cluster
 *
 * Uses the amazon sdk to fetch the response of describing the cluster,
 * which lets ups grab the current state of the cluster.
 */
export const describeCluster = async (kafka: AWS.Kafka, kafkaArn: string) => {
  if (kafkaArn === '' || kafkaArn === undefined) {
    throw new Error('kafkaArn not included in request');
  }
  try {
    const sdkResponse = await kafka
      .describeCluster({ ClusterArn: kafkaArn })
      .promise();

    if (!sdkResponse) {
      throw new Error("SDK couldn't find the cluster");
    }
    const curState = sdkResponse.ClusterInfo?.State;
    if (curState === undefined) {
      throw new Error('Cur state is undefined');
    }
    return curState;
  } catch (err) {
    throw new Error('Error describing cluster ');
  }
};

/**
 *
 * @param region C
 * @param awsAccessKey
 * @param awsSecretAccessKey
 * @param kafkaArn
 * @param id
 * @returns none
 *
 * When the cluster first goes from creating to active, it updates the public
 * access, which can only be done on an active cluster. This so that there
 * are public endpoints which we can access.
 */
export const updatePublicAccess = async (
  region: string,
  awsAccessKey: string,
  awsSecretAccessKey: string,
  kafkaArn: string,
  id: string
) => {
  const client = new KafkaClient({
    region: region,
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretAccessKey,
    },
  });
  if (kafkaArn === '' || kafkaArn === undefined) {
    throw new Error("KafkaArn doesn't exist");
  }
  if (client === undefined) {
    throw new Error('Kafka error');
  }
  try {
    // get the current version so that we can update the public access params
    const cluster = new DescribeClusterCommand({
      ClusterArn: kafkaArn,
    });
    const describeClusterResponse = await client.send(cluster);

    const connectivityInfo =
      describeClusterResponse.ClusterInfo?.BrokerNodeGroupInfo?.ConnectivityInfo
        ?.PublicAccess?.Type;

    const currentVersion = describeClusterResponse.ClusterInfo?.CurrentVersion;
    if (connectivityInfo !== 'SERVICE_PROVIDED_EIPS') {
      // now we want to turn on public access
      const updateParams = {
        ClusterArn: kafkaArn,
        ConnectivityInfo: {
          PublicAccess: {
            Type: 'SERVICE_PROVIDED_EIPS', // enables public access
          },
        },
        CurrentVersion: currentVersion,
      };

      const commandUpdate = new UpdateConnectivityCommand(updateParams);
      await client.send(commandUpdate);
    }

    // now update it in the database
    await prisma.cluster.update({
      where: {
        id: id,
      },
      data: {
        lifeCycleStage: 1,
      },
    });
  } catch (err) {
    throw new Error('Error updating cluster, ');
  }
};

export const getBoostrapBrokers = async (
  region: string,
  awsAccessKey: string,
  awsSecretAccessKey: string,
  kafkaArn: string,
  id: string
) => {
  /**
   * Cluster going from updating to active - get boostrap servers
   */
  const client = new KafkaClient({
    region: region,
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  try {
    const getBootstrapBrokersCommand = new GetBootstrapBrokersCommand({
      ClusterArn: kafkaArn,
    });
    const bootstrapResponse = await client.send(getBootstrapBrokersCommand);
    const brokers = bootstrapResponse.BootstrapBrokerStringPublicSaslIam
      ? bootstrapResponse.BootstrapBrokerStringPublicSaslIam
      : '';
    const splitBrokers = brokers.split(',');
    if (brokers === undefined || splitBrokers === undefined) {
      throw new Error('Error getting brokers');
    }
    console.log('successfully got boostrap brokers: ', splitBrokers);

    // store in the database
    await prisma.cluster.update({
      where: {
        id: id,
      },
      data: {
        bootStrapServer: splitBrokers,
        lifeCycleStage: 2,
      },
    });
    console.log('----CHECKING HERE----');
    // store in the targets.json file for prometheus
    await addToPrometheusTarget(splitBrokers, id);
  } catch (err) {
    throw new Error('Error going from updating to active, ');
  }
};

interface Labels {
  job: string;
}

interface Job {
  labels: Labels;
  targets: string[];
}

export const createDash = (
  clusterName: string,
  apiKey: string,
  clusterId: string
) => {
  // create dash

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${process.env.GRAFANA_API_KEY || ''}`);

  const raw = JSON.stringify({
    dashboard: {
      id: null,
      uid: clusterId,
      title: clusterName,
      tags: ['MSK-Cluster'],
      timezone: 'browser',
      schemaVersion: 16,
      version: 0,
      refresh: '25s',

      annotations: {
        list: [
          {
            $$hashKey: 'object:3299',
            builtIn: 1,
            datasource: {
              type: 'prometheus',
              uid: 'a0301391-f81b-45dc-afcb-dfc7b6bafdeb',
            },
            enable: true,
            hide: true,
            iconColor: 'rgba(0, 211, 255, 1)',
            limit: 100,
            name: 'Annotations & Alerts',
            showIn: 0,
            type: 'dashboard',
          },
        ],
      },
      editable: true,
      fiscalYearStartMonth: 0,
      graphTooltip: 0,
      links: [],
      liveNow: false,
      panels: [
        {
          datasource: {
            type: 'prometheus',
            uid: 'a0301391-f81b-45dc-afcb-dfc7b6bafdeb',
          },
          fieldConfig: {
            defaults: {
              color: {
                mode: 'thresholds',
              },
              mappings: [
                {
                  options: {
                    match: 'null',
                    result: {
                      text: 'N/A',
                    },
                  },
                  type: 'special',
                },
              ],
              thresholds: {
                mode: 'absolute',
                steps: [
                  {
                    color: 'green',
                    value: null,
                  },
                  {
                    color: 'blue',
                    value: 80,
                  },
                ],
              },
              unit: 'none',
            },
            overrides: [],
          },
          gridPos: {
            h: 6,
            w: 2,
            x: 0,
            y: 0,
          },
          id: 1,
          links: [],
          maxDataPoints: 100,
          options: {
            colorMode: 'background',
            graphMode: 'none',
            justifyMode: 'center',
            orientation: 'horizontal',
            reduceOptions: {
              calcs: [],
              fields: '',
              values: false,
            },
            textMode: 'value',
          },
          pluginVersion: '9.5.3',
          targets: [
            {
              datasource: {
                type: 'prometheus',
                uid: 'a0301391-f81b-45dc-afcb-dfc7b6bafdeb',
              },
              editorMode: 'builder',
              expr: `kafka_server_BrokerTopicMetrics_Count{name="TotalProduceRequestsPerSec", job="${clusterId}", topic="__consumer_offsets"}`,
              intervalFactor: 2,
              legendFormat: '',
              metric: '',
              range: true,
              refId: 'A',
              step: 20,
            },
          ],
          title: 'Consumer Offset',
          type: 'stat',
        },
        {
          datasource: {
            type: 'prometheus',
            uid: 'a0301391-f81b-45dc-afcb-dfc7b6bafdeb',
          },
          fieldConfig: {
            defaults: {
              color: {
                mode: 'thresholds',
              },
              mappings: [
                {
                  options: {
                    match: 'null',
                    result: {
                      text: 'N/A',
                    },
                  },
                  type: 'special',
                },
              ],
              thresholds: {
                mode: 'absolute',
                steps: [
                  {
                    color: 'green',
                    value: null,
                  },
                  {
                    color: 'red',
                    value: 80,
                  },
                ],
              },
              unit: 'h',
            },
            overrides: [],
          },
          gridPos: {
            h: 6,
            w: 2,
            x: 2,
            y: 0,
          },
          id: 15,
          links: [],
          maxDataPoints: 100,
          options: {
            colorMode: 'none',
            graphMode: 'none',
            justifyMode: 'center',
            orientation: 'horizontal',
            reduceOptions: {
              calcs: ['mean'],
              fields: '',
              values: false,
            },
            textMode: 'value',
          },
          pluginVersion: '9.5.3',
          targets: [
            {
              datasource: {
                type: 'prometheus',
                uid: 'a0301391-f81b-45dc-afcb-dfc7b6bafdeb',
              },
              editorMode: 'builder',
              expr: `up{job="${clusterId}"}`,
              legendFormat: '__auto',
              range: true,
              refId: 'A',
            },
          ],
          title: 'Kafka Broker Uptime',
          type: 'stat',
        },
        {
          aliasColors: {},
          bars: false,
          dashLength: 10,
          dashes: false,
          datasource: {
            type: 'prometheus',
            uid: 'a0301391-f81b-45dc-afcb-dfc7b6bafdeb',
          },
          editable: true,
          error: false,
          fill: 1,
          fillGradient: 0,
          grid: {},
          gridPos: {
            h: 6,
            w: 8,
            x: 4,
            y: 0,
          },
          hiddenSeries: false,
          id: 6,
          legend: {
            avg: false,
            current: false,
            max: false,
            min: false,
            show: true,
            total: false,
            values: false,
          },
          lines: true,
          linewidth: 2,
          links: [],
          nullPointMode: 'connected',
          options: {
            alertThreshold: true,
          },
          percentage: false,
          pluginVersion: '9.5.3',
          pointradius: 5,
          points: false,
          renderer: 'flot',
          seriesOverrides: [],
          spaceLength: 10,
          stack: false,
          steppedLine: false,
          targets: [
            {
              datasource: {
                type: 'prometheus',
                uid: 'a0301391-f81b-45dc-afcb-dfc7b6bafdeb',
              },
              editorMode: 'builder',
              expr: `kafka_server_group_coordinator_metrics_offset_commit_count{job="${clusterId}"}`,
              intervalFactor: 2,
              range: true,
              refId: 'A',
              step: 2,
            },
          ],
          thresholds: [],
          timeRegions: [],
          title: 'Offset Commit Count',
          tooltip: {
            msResolution: false,
            shared: true,
            sort: 0,
            value_type: 'cumulative',
          },
          type: 'graph',
          xaxis: {
            mode: 'time',
            show: true,
            values: [],
          },
          yaxes: [
            {
              format: 'percentunit',
              logBase: 1,
              show: true,
            },
            {
              format: 'short',
              logBase: 1,
              show: true,
            },
          ],
          yaxis: {
            align: false,
          },
        },
        {
          aliasColors: {},
          bars: false,
          dashLength: 10,
          dashes: false,
          datasource: {
            type: 'prometheus',
            uid: 'a0301391-f81b-45dc-afcb-dfc7b6bafdeb',
          },
          editable: true,
          error: false,
          fill: 1,
          fillGradient: 0,
          grid: {},
          gridPos: {
            h: 8,
            w: 12,
            x: 0,
            y: 6,
          },
          hiddenSeries: false,
          id: 2,
          legend: {
            alignAsTable: false,
            avg: false,
            current: true,
            hideEmpty: false,
            hideZero: false,
            max: false,
            min: false,
            rightSide: false,
            show: true,
            total: false,
            values: true,
          },
          lines: true,
          linewidth: 2,
          links: [],
          nullPointMode: 'connected',
          options: {
            alertThreshold: true,
          },
          percentage: false,
          pluginVersion: '9.5.3',
          pointradius: 5,
          points: false,
          renderer: 'flot',
          seriesOverrides: [],
          spaceLength: 10,
          stack: false,
          steppedLine: false,
          targets: [
            {
              datasource: {
                type: 'prometheus',
                uid: 'a0301391-f81b-45dc-afcb-dfc7b6bafdeb',
              },
              editorMode: 'builder',
              expr: `kafka_server_BrokerTopicMetrics_Count{name="BytesInPerSec", job="${clusterId}"}`,
              intervalFactor: 2,
              range: true,
              refId: 'A',
              step: 2,
            },
            {
              datasource: {
                type: 'prometheus',
                uid: 'a0301391-f81b-45dc-afcb-dfc7b6bafdeb',
              },
              editorMode: 'builder',
              expr: `kafka_server_BrokerTopicMetrics_OneMinuteRate{name="BytesOutPerSec", job="${clusterId}"}`,
              intervalFactor: 2,
              legendFormat: '',
              range: true,
              refId: 'B',
              step: 2,
            },
          ],
          thresholds: [],
          timeRegions: [],
          title: 'Topic BytesIn to BytesOut Rate',
          tooltip: {
            msResolution: false,
            shared: true,
            sort: 0,
            value_type: 'cumulative',
          },
          type: 'graph',
          xaxis: {
            mode: 'time',
            show: true,
            values: [],
          },
          yaxes: [
            {
              format: 'Bps',
              logBase: 1,
              show: true,
            },
            {
              format: 'short',
              logBase: 1,
              show: true,
            },
          ],
          yaxis: {
            align: false,
          },
        },
      ],

      style: 'light',

      templating: {
        list: [],
      },
      time: {
        from: 'now-30m',
        to: 'now',
      },
      timepicker: {
        refresh_intervals: [
          '5s',
          '10s',
          '30s',
          '1m',
          '5m',
          '15m',
          '30m',
          '1h',
          '2h',
          '1d',
        ],
        time_options: [
          '5m',
          '15m',
          '1h',
          '6h',
          '12h',
          '24h',
          '2d',
          '7d',
          '30d',
        ],
      },

      weekStart: '',
    },
  });

  type RequestOptions = {
    method: string;
    headers: Headers;
    body: string;
    redirect: any;
  };

  const requestOptions: RequestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch('http://157.230.13.68:3000/api/dashboards/db', requestOptions)
    .then((response) => {
      console.log('--RESPONSE--', response);
      return response.text();
    })
    .then((result) => console.log(result))
    .catch((error) => console.log('error', error));
};

export const addToPrometheusTarget = async (
  brokers: string[],
  clusterUuid: string
) => {
  // get the boostrapbrokers
  // slice the last four digits off
  const newBrokerArr: string[] = [];
  for (const broker of brokers) {
    // remove the port and replace with 11001 so that prometheus can see it
    newBrokerArr.push(broker.slice(0, broker.length - 4) + '11001');
  }

  // define the newjob obj that we are going to store in targets.json so that
  // prometheus tracks it
  const newJob = {
    labels: {
      job: clusterUuid,
    },
    targets: newBrokerArr,
  };

  const srcPath = path.join('./src/server/targets.json');
  const targetsData = JSON.parse(fs.readFileSync(srcPath, 'utf8')) as Job[];

  // Add the new job to the targets data
  targetsData.push(newJob);
  const updatedTargetsData = JSON.stringify(targetsData, null, 2);
  fs.writeFileSync(srcPath, updatedTargetsData, 'utf8');

  // const destPath = path.resolve('/usr/app/config', 'targets.json');
  // fs.copyFileSync(srcPath, destPath);
  await fetch('http://157.230.13.68:3000/-/reload', {
    method: 'POST',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('HTTP request failed.');
      }
      // Process the successful response here
      console.log('Refreshed Prometheus')
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error(error);
    });

  console.log('---ADDED TO PROMETHEUS---');
  createDash(clusterUuid, process.env.GRAFANA_API_KEY || '', clusterUuid);
};

export const getDash = async (uuid: string, apiKey: string) => {
  try {
    const fetchDashboard = await fetch(
      'http://157.230.13.68:3000/api/dashboards/uid/' + uuid,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const dashboard: string = await fetchDashboard.json();
    return dashboard;
  } catch (error) {
    throw new Error('Error fetching dashboard');
  }
};
