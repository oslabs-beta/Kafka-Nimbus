import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { z } from 'zod';

import { User, Cluster, PrismaClient } from '@prisma/client';

export const databaseRouter = createTRPCRouter({
  createCluster: publicProcedure
    .input(
      z.object({
        id: z.string(),
        awsId: z.string(),
        awsSecret: z.string(),
        brokerNumbers: z.number(),
        region: z.string(),
        clusterName: z.string(),
        provider: z.string(),
        clusterSize: z.string(),
        storagePerBroker: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      console.log('CTX CONSOLE',ctx)
      const prisma = new PrismaClient();

      try {
        const updateAwsCredentials: User = await prisma.user.update({
          where: { id: input.id },
          data: {
            awsAccessKey: input.awsId,
            awsSecretAccessKey: input.awsSecret,
          },
        });
      } catch (error) {
        console.log(
          'ERROR HAPPENED updateAwsCredentials IN DATABASE.CREATECLUSTER'
        );
      }

      try {
        const createNewCluster: Cluster = await prisma.cluster.create({
          data: {
            userId: input.id,
            brokerPerZone: input.brokerNumbers,
            name: input.clusterName,
            instanceSize: input.clusterSize,
            storagePerBroker: input.storagePerBroker,
          },
        });
        return `cluster ${input.clusterName} created!`;
      } catch (error) {
        console.log(
          'ERROR HAPPENED createNewCluster IN DATABASE.CREATECLUSTER'
        );
      }
    }),
});
