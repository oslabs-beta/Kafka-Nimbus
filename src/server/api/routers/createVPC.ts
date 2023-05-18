import { z } from 'zod';
import AWS from 'aws-sdk';
import uuid from 'uuid';

const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const createVPCRouter = createTRPCRouter({
  createVPC: publicProcedure
    .input(z.object({
      aws_access_key_id : z.string(),
      aws_secret_access_key: z.string(),
      region: z.string()
    }))
    .query(({ input }) => {
      resolve: async () => {
        try{
          // create the vpc
          const vpcData: any = await ec2.createVpc({
            CidrBlock: '10.0.0.0/16',
          }).promise();
          // make sure data is correct
          if (!vpcData.Vpc || !vpcData.Vpc.VpcId) {
            throw new Error('VPC creation failed');
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const vpcId: string = vpcData.Vpc.VpcId;
          console.log(`Created VPC with id ${vpcId}`)

        }
        catch (error) {
          console.log('Ran into error creating VPC and subnets ', error)
        }
      }
    })
})