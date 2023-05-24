/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from "~/env.mjs";
import { prisma } from '../../db';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { KafkaClient, DescribeClusterCommand, type DescribeClusterCommandInput, type DescribeClusterCommandOutput } from '@aws-sdk/client-kafka';
import { Kafka, logLevel, type ITopicMetadata, ConfigResourceTypes, type Admin, type Producer, type Consumer, type DescribeConfigResponse } from 'kafkajs';
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
          throw new Error('Error: Cluster does not exist in the database');
        }

        //get bootstrap public endpoints
        const brokers = ['b-1-public.24demo.ss1zbk.c2.kafka.us-east-2.amazonaws.com:9198', 'b-2-public.24demo.ss1zbk.c2.kafka.us-east-2.amazonaws.com:9198'];
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
        console.log('KJS Successfully connected to cluster');



        //Getting Cluster Dashboard Information from MSK
        const input: DescribeClusterCommandInput = {
          ClusterArn: clusterInfo?.kafkaArn ? clusterInfo?.kafkaArn : "",
        };

        const command = new DescribeClusterCommand(input);
        console.log('Sending DescribeClusterCommand through MSK client');
        const descClusterResponse: DescribeClusterCommandOutput = await client.send(command);
        const cluster = descClusterResponse.ClusterInfo;
        //response.ClusterName, response.CreationTime, response.CurrentBrokerSoftwareInfo.KafkaVersion, response.InstanceType,
        //response.NumberOfBrokerNodes, response.State
        if (!cluster) throw new Error('Error: MSK Cluster does not have info');
        const { ClusterName, CreationTime, CurrentBrokerSoftwareInfo, NumberOfBrokerNodes, State } = cluster;



        //Getting Topics
        const admin: Admin = kafka.admin();
        console.log('KJS: Successfully created admin');

        console.log('Sending fetchTopicMetadata through KJS client');
        const fetchTopicMetaResponse = await admin.fetchTopicMetadata();
        if (!fetchTopicMetaResponse) throw new Error('Error: No topics data received from KJS client');

        //Processing each topic's data and storing it in an array topicsData
        const kTopicsData: ITopicMetadata[] = fetchTopicMetaResponse.topics;

        const topicsData = [];
        kTopicsData.forEach(topic => {
          //add list of Consumer Groups subscribed to this topic

          //add config description to topic
          const configData = descTopicConfig(topic.name);

          topicsData.push({
            ...topic,
            configData,
          })
        });

        await admin.describeConfigs({
          includeSynonyms: false,
          resources: [
            {
              type: ConfigResourceTypes.TOPIC,
              name: 'topic-name',
              configNames: ['cleanup.policy', 'retention.ms', 'message.downconversion.enable', 'message.format.version', 'max.compaction.lag.ms', 'file.delete.delay.ms', 'max.message.bytes', 'index.interval.bytes'] //optional to specify else it'll return the entire config of that topic
            }
          ]
        })

        //Helper function to get Topic config information
        const descTopicConfig = async function (name: string): DescribeConfigResponse {
          const response: DescribeConfigResponse = await admin.describeConfigs({
            includeSynonyms: false,
            resources: [
              {
                type: ConfigResourceTypes.TOPIC,
                name,
              }
            ]
          });
          return response;
        }

        //Getting Consumer Groups



        //Getting Metrics




      } catch (err) {
        console.log('Error occurred in metricRouter getClusterInformation: ', err);
      }
    })
});