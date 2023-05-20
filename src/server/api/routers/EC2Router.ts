import { z } from 'zod';
import AWS from 'aws-sdk';
import { v4 } from 'uuid';
import { prisma } from '../../db'

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

const ec2 = new AWS.EC2({apiVersion: '2016-11-15'})

export const EC2Router = createTRPCRouter({
  createEC2: publicProcedure
    .input(z.object({
      id: z.string() // cluster id that the EC2 instance is associated with
    }))
    .query(async({ input }) => {
      
    }),
})