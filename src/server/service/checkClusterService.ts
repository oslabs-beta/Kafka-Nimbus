// import statements
import { prisma } from '../db';
import AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import {
  KafkaClient,
  GetBootstrapBrokersCommand,
  UpdateConnectivityCommand,
  DescribeClusterCommand,
} from '@aws-sdk/client-kafka';

/**
 * 
 * @param id 
 * @returns awsAccessKey, awsSecretAccessKey, region, lifeCycleStage, kafkaArn
 * 
 * This function fetches the cluster from the database and returns the specified
 * values that are needed
 */
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

    // store in the targets.json file for prometheus
    addToPrometheusTarget(splitBrokers, id)
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

export const createDash = (clusterName: string, apiKey: string) => {
  // create dash
  fetch('http://localhost:3001/api/dashboards/db', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dashboard: {
        id: null,
        title: clusterName,
        tags: ['msk'],
        timezone: 'browser',
        rows: [{}],
        schemaVersion: 6,
        version: 0,
      },
      overwrite: false,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
};


export const addToPrometheusTarget = (
  brokers: string[],
  clusterUuid: string
) => {
  // get the boostrapbrokers
  // slice the last four digits off
  const newBrokerArr: string[] = [];
  for (const broker of brokers) {

    // remove the port and replace with 11001 so that prometheus can see it
    newBrokerArr.push(broker.slice(0, broker.length-4) + '11001');
  }

  // define the newjob obj that we are going to store in targets.json so that 
  // prometheus tracks it
  const newJob = {
    labels: {
      job: clusterUuid,
    },
    "targets": newBrokerArr
  }
  
  
  const srcPath = path.join('./src/server/targets.json');
  const targetsData = JSON.parse(fs.readFileSync(srcPath, 'utf8')) as Job[];

  // Add the new job to the targets data
  targetsData.push(newJob);
  const updatedTargetsData = JSON.stringify(targetsData, null, 2);
  fs.writeFileSync(srcPath, updatedTargetsData, 'utf8');

  const destPath = path.resolve('/usr/app/config', 'targets.json');
  fs.copyFileSync(srcPath, destPath);


  createDash(clusterUuid, "eyJrIjoiVkJodDVwSkg0SXB5RlZUMjdGVVkwSUpxdGNxZko0UzEiLCJuIjoiYXBpa2V5Y3VybCIsImlkIjoyfQ==")

};


export const getDash = (uuid: string, apiKey: string) => {
  fetch(`http://localhost:3001/api/dashboards/uid/${uuid}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error(error));
}; 
