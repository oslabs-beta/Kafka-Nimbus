// import statements
import { prisma } from '../db';
import AWS from 'aws-sdk';

import {
  KafkaClient,
  GetBootstrapBrokersCommand,
  UpdateConnectivityCommand,
  DescribeClusterCommand,
  DeleteClusterCommand,
  type DeleteClusterCommandInput,
  type DeleteClusterCommandOutput,
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
    throw new Error('Error finding the unique user in database ');
  }
}

export const describeCluster = async (kafka: AWS.Kafka, kafkaArn: string) => {
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
  } catch (err) {
    throw new Error("Error going from updating to active, ");
  }
}