import { z } from 'zod';
import AWS from 'aws-sdk';
import { prisma } from '../../db'
import type { User, Cluster } from '@prisma/client';

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

const ec2 = new AWS.EC2({apiVersion: '2016-11-15'})
const kafka = new AWS.Kafka({apiVersion: '2018-11-14'});

export const clusterRouter = createTRPCRouter({
  createCluster: publicProcedure
    .input(z.object({
      id: z.string(),
      brokerPerZone: z.number(),
      instanceSize: z.string(),
      zones: z.number(),
      storagePerBroker: z.number(),
      name: z.string(),
    }))
    .query(async({ input }) => {
      // First, find the user object in the database using id
      try {
        const userResponse: User | null = await prisma.user.findUnique({
          where: {
            id: input.id
          }
        });
        if (!userResponse || !userResponse.vpcId) {
          throw new Error('User doesn\'t exist in database')
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const vpcId: string = userResponse.vpcId;
        
        
      }
      catch (error) {
        console.log('Error accessing database, ', error);
      }
        // Create security groups within the vpc
      return;
    })



})