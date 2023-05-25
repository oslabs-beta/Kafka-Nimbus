/**
 * Add a topic, edit a topic, delete a topic
 * create partitions
 * fetch metadata
 *
 */

import { z } from "zod";
import AWS from "aws-sdk";
import { prisma } from "../../db";

import { Kafka, logLevel } from "kafkajs";
import { createMechanism } from "@jm18457/kafkajs-msk-iam-authentication-mechanism";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/**
 * Custom zod schema
 */
const replicaAssignmentSchema = z.object({
  partition: z.number(),
  replicas: z.array(z.number()),
});

const configEntriesSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const topicRouter = createTRPCRouter({
  createTopic: publicProcedure
    .input(
      z.object({
        id: z.string(),
        clusterName: z.string(),
        topicName: z.string(),
        numPartitions: z.number().default(-1),
        replicationFactor: z.number().default(-1),
        replicaAssignment: z.array(replicaAssignmentSchema).default([]),
        configEntries: z.array(configEntriesSchema).default([]),
      })
    )
    .mutation(async ({ input }) => {
      // First, use id to get the aws access that we need to make changes
      try {
        const userResponse = await prisma.user.findUnique({
          where: {
            id: input.id,
          },
          include: {
            clusters: {
              where: {
                name: input.clusterName,
              },
            },
          },
        });
        if (
          !userResponse ||
          (userResponse && userResponse.clusters.length > 0)
        ) {
          throw new Error("User response does not exist");
        }
        const awsAccessKey = userResponse.awsAccessKey;
        const awsSecretAccessKey = userResponse.awsSecretAccessKey;
        const region = userResponse.region;
        const cluster = userResponse.clusters[0];
        if (!cluster) throw new Error("Cluster does not exist");
        const BootstrapIds = cluster.bootStrapServer;
        // update aws config
        // possibly unneccessary
        AWS.config.update({
          accessKeyId: awsAccessKey,
          secretAccessKey: awsSecretAccessKey,
          region: region,
        });

        // create kafkajs config
        const kafka = new Kafka({
          clientId: "my-app",
          brokers: BootstrapIds,
          logLevel: logLevel.ERROR,
          ssl: true,
          sasl: createMechanism({
            region: region,
            credentials: {
              accessKeyId: awsAccessKey,
              secretAccessKey: awsSecretAccessKey,
            },
          }),
        });

        // create kafkajs instance
        const admin = kafka.admin();
        await admin.connect();

        // create the topic
        const createResult = await admin.createTopics({
          timeout: 30000,
          topics: [
            {
              topic: input.topicName,
              numPartitions: input.numPartitions,
              replicationFactor: input.replicationFactor,
              replicaAssignment: input.replicaAssignment,
              configEntries: input.configEntries,
            },
          ],
        });

        await admin.disconnect();
        if (!createResult) {
          return "Topic already exists";
        }

        /**
         * Store new cluster in db
         */
        // don't need to error check if the cluster name already exists because we
        // do that when grabbing the user.
        const topicResponse = await prisma.topic.create({
          data: {
            Name: input.topicName,
            numPartitions: input.numPartitions,
            replicationFactor: input.replicationFactor,
            Cluster: {
              connect: {
                name: input.clusterName,
              },
            },
          },
        });

        return createResult;
      } catch (error) {
        console.log("Error creating topic ,", error);
      }
    }),
});
