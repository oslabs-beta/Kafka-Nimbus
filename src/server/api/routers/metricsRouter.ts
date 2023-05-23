/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from "~/env.mjs";
import { prisma } from '../../db';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { KafkaClient, DescribeClusterCommand, type DescribeClusterCommandInput, type DescribeClusterCommandOutput } from '@aws-sdk/client-kafka';
import { Kafka, logLevel, type Admin, type Producer, type Consumer } from 'kafkajs';
import { createMechanism } from '@jm18457/kafkajs-msk-iam-authentication-mechanism';

//metricRouter contains a getClusterInformation procedure that returns all of a cluster's information given the unique cluster id of the document in mongoDB
export const metricRouter = createTRPCRouter({
  getClusterInformation: publicProcedure
    .input(z.object({
      cluster_id: z.string()
    }))
    .mutation(async ({ input }) => {
      try {
        //get Cluster Information from the database
        const clusterInfo = await prisma.cluster.findUnique({
          where: {
            id: input.cluster_id,
          },
          include: {
            User: true
          }
        });
        if (!clusterInfo) {
          throw new Error('GCI error: Cluster does not exist in the database');
        }

        //get bootstrap public endpoints
        const brokers = ['b-2-public.iamauth.s9rrkn.c2.kafka.us-east-2.amazonaws.com:9198', 'b-1-public.iamauth.s9rrkn.c2.kafka.us-east-2.amazonaws.com:9198'];
        // const brokers = clusterInfo.bootStrapServer;

        const accessKeyId = clusterInfo.User.awsAccessKey;
        const secretAccessKey = clusterInfo.User.awsSecretAccessKey;
        const region = clusterInfo.User.region;

        const authParams = {
          region,
          credentials: {
            accessKeyId, secretAccessKey
          }
        }

        //AWS kafka client
        const client = new KafkaClient(
          authParams
        );

        //KafkaJS client
        const kafka: Kafka = new Kafka({
          clientId: 'my-app',
          brokers,
          logLevel: logLevel.ERROR,
          ssl: true,
          sasl: createMechanism(authParams)
        });
        console.log('KJS: Successfully connected to cluster');

        //Getting DescribeCluster
        const input: DescribeClusterCommandInput = {
          ClusterArn: clusterInfo?.kafkaArn ? clusterInfo?.kafkaArn : "",
        };

        const command = new DescribeClusterCommand(input);
        const response: DescribeClusterCommandOutput = await client.send(command);
        const cluster = response.ClusterInfo;
        //response.ClusterName, response.CreationTime, response.CurrentBrokerSoftwareInfo.KafkaVersion, response.InstanceType,
        //response.NumberOfBrokerNodes, response.State
        if (!cluster) throw new Error('Cluster does not have info');
        const { ClusterName, CreationTime, CurrentBrokerSoftwareInfo, NumberOfBrokerNodes, State } = cluster;


        const admin: Admin = kafka.admin();
        console.log('KJS: Successfully created admin');

      } catch (err) {
        console.log('Error occurred in metricRouter getClusterInformation: ', err);
      }
    })
});