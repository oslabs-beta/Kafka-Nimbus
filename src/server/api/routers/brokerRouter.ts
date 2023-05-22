import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from 'zod';
import { prisma } from '../../db';

export const clusterRouter = createTRPCRouter({
  createBroker: publicProcedure
    .input(z.object({
      id: z.string(),
      Address: z.number(),
      Size: z.string(),
      Leader: z.number(),
      brokerEndpoints: z.array(z.string()),
    }))
    .query(async ({ input }) => {
      try {
        const userResponse = await prisma.broker.findUnique({
          where: {
            id: input.id
          }
        });

        if (userResponse) {
          // User object found in the database, proceed with further logic
          // ...
          return { success: true, message: 'User found!' };
        } else {
          // User object not found in the database
          return { success: false, message: 'User not found!' };
        }
      } catch (err) {
        console.log('Error creating a broker', err);
        return { success: false, message: 'Error creating broker' };
      }
    })
});
