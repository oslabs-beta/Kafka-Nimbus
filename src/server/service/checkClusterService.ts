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
} from "@aws-sdk/client-kafka";

export const getClusterResponse = async (id: string) => {
  try {
    const clusterResponse = await prisma.cluster.findUnique({
      where: {
        id: id,
      },
      include: {
        User: true
      }
    });
    if (clusterResponse?.User === undefined) {
      throw new Error("User does not exist on the cluster Response")
    }
    const response = {
      awsAccessKey: clusterResponse?.User.awsAccessKey,
      awsSecretAccessKey: clusterResponse?.User.awsSecretAccessKey,
      region: clusterResponse?.User.region,
      lifeCycleStage: clusterResponse?.lifeCycleStage,
      kafkaArn: clusterResponse?.kafkaArn
    }
    return response;
  }
  catch (err) {
    throw new Error('Error finding the unique user in database');
  }
}

export const describeCluster = async (kafka: AWS.Kafka, kafkaArn: string) => {
  if (kafkaArn === '' || kafkaArn === undefined) {
    throw new Error('kafkaArn not included in request')
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
  }
  catch (err) {
    throw new Error('Error describing cluster ')
  }
}

/**
 * 
 * @param region C
 * @param awsAccessKey 
 * @param awsSecretAccessKey 
 * @param kafkaArn 
 * @param id 
 * @returns none
 */
export const updatePublicAccess = async (region: string, awsAccessKey: string, awsSecretAccessKey: string, kafkaArn: string, id: string) => {
  const client = new KafkaClient({
    region: region,
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretAccessKey,
    },
  });
  if (kafkaArn === '' || kafkaArn === undefined) {
    throw new Error('KafkaArn doesn\'t exist');
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
      describeClusterResponse.ClusterInfo?.BrokerNodeGroupInfo
        ?.ConnectivityInfo?.PublicAccess?.Type;

    const currentVersion =
      describeClusterResponse.ClusterInfo?.CurrentVersion;
    if (connectivityInfo !== "SERVICE_PROVIDED_EIPS") {
      // now we want to turn on public access
      const updateParams = {
        ClusterArn: kafkaArn,
        ConnectivityInfo: {
          PublicAccess: {
            Type: "SERVICE_PROVIDED_EIPS", // enables public access
          },
        },
        CurrentVersion: currentVersion,
      };

      const commandUpdate = new UpdateConnectivityCommand(
        updateParams
      );
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
    throw new Error("Error updating cluster, ");
  }
}

export const getBoostrapBrokers = async (region: string, awsAccessKey: string, awsSecretAccessKey: string, kafkaArn: string, id: string) => {
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
    const getBootstrapBrokersCommand = new GetBootstrapBrokersCommand(
      {
        ClusterArn: kafkaArn,
      }
    );
    const bootstrapResponse = await client.send(
      getBootstrapBrokersCommand
    );
    const brokers =
      bootstrapResponse.BootstrapBrokerStringPublicSaslIam
        ? bootstrapResponse.BootstrapBrokerStringPublicSaslIam
        : "";
    const splitBrokers = brokers.split(",");
    if (brokers === undefined) {
      throw new Error("Error getting brokers");
    }
    console.log("successfully got boostrap brokers: ", splitBrokers);

    // store in the database
    await prisma.cluster.update({
      where: {
        id: id,
      },
      data: {
        bootStrapServer: splitBrokers,
        lifeCycleStage: 2
      },
    });

    // store in the targets.json file for prometheus
    addToPrometheusTarget(splitBrokers, id);
  } catch (err) {
    throw new Error("Error going from updating to active, ");
  }
}

interface Labels {
  job: string;
}

interface Job {
  labels: Labels;
  targets: string[];
}

export const addToPrometheusTarget =(brokers: string[], clusterUuid: string) => {
  // get the boostrapbrokers
  // slice the last four digits off
  for (let i = 0; i < brokers.length; i++) {
    if (brokers[i] === undefined) {
      throw new Error('broker is undefined');
    }
    brokers[i] = brokers[i].slice(0, brokers[i].length-4) + '11001';
  }

  const newJob = {
    "labels": {
      "job": clusterUuid
    },
    "targets": brokers
  }
  
  
  const srcPath = path.join('./src/server/targets.json');
  const targetsData = JSON.parse(fs.readFileSync(srcPath, 'utf8')) as Job[];

   // Add the new job to the targets data
   targetsData.push(newJob);
   const updatedTargetsData = JSON.stringify(targetsData, null, 2);
   fs.writeFileSync(srcPath, updatedTargetsData, 'utf8');

  const destPath = path.resolve('/usr/app/config', 'targets.json');
  fs.copyFileSync(srcPath, destPath);
}