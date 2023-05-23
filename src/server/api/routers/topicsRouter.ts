/**
 * Add a topic, edit a topic, delete a topic
 * create partitions
 * fetch metadata
 * 
 */

import { z } from 'zod';
import AWS from 'aws-sdk';
import { v4 } from 'uuid';
import { prisma } from '../../db'

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

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
    .input(z.object({
      id: z.string(),
      name: z.string(),
      numPartitions: z.number().default(-1),
      replicationFactor: z.number().default(-1),
      replicaAssignment: z.array(replicaAssignmentSchema).default([]),
      configEntries: z.array(configEntriesSchema).default([])
    }))
    .mutation(async({ input }) => {
      // First, use id to get the aws access that we need to make changes
      try {
        const userResponse = await prisma.user.findUnique({
          where: {
            id: input.id
          },
          include: {
            clusters: {
              where: {
                name: input.name
              }
            }
          }
        })
        const awsAccessKey = userResponse?.awsAccessKey;
        const awsSecretAccessKey = userResponse?.awsSecretAccessKey;
        const region = userResponse?.region;
        if (userResponse && userResponse.clusters.length > 0) {
          const cluster = userResponse.clusters[0];
          const BootstrapId = cluster?.bootStrapServer;
        }
        // update aws config
        AWS.config.update({
          accessKeyId: awsAccessKey,
          secretAccessKey: awsSecretAccessKey,
          region: region
        })

      }
      catch (error) {
        console.log('Error creating topic ,', error);
      }
    })
})