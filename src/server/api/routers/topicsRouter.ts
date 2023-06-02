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

const configEntriesSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const topicRouter = createTRPCRouter({
  createTopic: publicProcedure
    .input(
      z.object({
        id: z.string(),
        topicName: z.string(),
        numPartitions: z.number().default(-1),
        replicationFactor: z.number().default(-1),
      })
    )
    .mutation(async ({ input }) => {
      // First, use id to get the aws access that we need to make changes
      try {
        const userResponse = await prisma.cluster.findUnique({
          where: {
            id: input.id,
          },
          include: {
            User: true,
          },
        });
        if (
          !userResponse
        ) {
          throw new Error("Cluster does not exist");
        }
        const awsAccessKey = userResponse.User.awsAccessKey;
        const awsSecretAccessKey = userResponse.User.awsSecretAccessKey;
        const region = userResponse.User.region;

        /** TODO getting bootStrapServer public endpoints. For now manually adding the brokers */
        // const BootstrapIds = userResponse.bootStrapServer;
        const BootstrapIds = ['b-1-public.andrewtesting.nn8jqe.c2.kafka.us-east-2.amazonaws.com:9198', 'b-2-public.andrewtesting.nn8jqe.c2.kafka.us-east-2.amazonaws.com:9198'];

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
              // replicaAssignment: input.replicaAssignment,
              // configEntries: input.configEntries,
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
                id: userResponse.id,
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
