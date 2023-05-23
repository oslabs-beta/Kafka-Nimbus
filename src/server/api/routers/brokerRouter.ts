import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { z } from 'zod';

import { type Broker, PrismaClient } from '@prisma/client';

export const brokerRouter = createTRPCRouter({
  findBroker: publicProcedure
    .input(
      z.object({
        id: z.string(),
        Address: z.string(),
        Size: z.string(),
        Leader: z.string(),
        clusterId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      //console.log('CTX CONSOLE', ctx);
      const prisma = new PrismaClient();

      try {
        const findBroker: Broker[] = await prisma.broker.findMany({
          where: { clusterId: input.clusterId },
        });
        return `Broker ${input.id} created!`;
      } catch (error) {
        console.log(
          'Error while trying to find broker information'
        );
      }
    }),
});
