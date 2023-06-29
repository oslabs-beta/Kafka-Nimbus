import { z } from 'zod';
import AWS from 'aws-sdk';
import { prisma } from '../../db';
import path from 'path';
import { v4 } from 'uuid'

import { EC2Client } from '@aws-sdk/client-ec2';
import { KafkaClient, CreateConfigurationCommand } from '@aws-sdk/client-kafka';
import fs from 'fs';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import { 
  createVPC,
  createIGW,
  connectIGWandVPC,
  createSubnets,
  createRouteTables,
  createRouteIGW,
  createClusterConfig } from '../../service/createVPCService';


export const createVPCRouter = createTRPCRouter({
  createVPC: publicProcedure
    .input(
      z.object({
        id: z.string(),
        aws_access_key_id: z.string(),
        aws_secret_access_key: z.string(),
        region: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // creating custom config based on user input
      const config = {
        region: input.region,
        credentials: {
          accessKeyId: input.aws_access_key_id,
          secretAccessKey: input.aws_secret_access_key,
        },
      }

      const ec2Client = new EC2Client(config);

      const client = new KafkaClient(config);

      /**
       * This will go through all the steps in the initial set up of the VPC
       */
      try {
        // get vpc id
        const vpcId = await createVPC(ec2Client);

        // Create the IGW
        const igwId = await createIGW(ec2Client);

        // attach IGW to VPC
        await connectIGWandVPC(ec2Client, vpcId, igwId);

        // Create subnets
        const subnetIdArr = await createSubnets(ec2Client, vpcId, input.region)

        // Create route table 
        const routeTableId = await createRouteTables(ec2Client, vpcId);

        // Create route for IGW
        await createRouteIGW(ec2Client, routeTableId, igwId);

        // create cluster config file
        const configArn = await createClusterConfig(client);

        /**
         * Send required info to db
         */
        try {
          // updates the user in the database with the vpc and subnet ids
          await prisma.user.update({
            where: {
              id: input.id,
            },
            data: {
              vpcId: vpcId,
              subnetID: {
                push: subnetIdArr,
              },
              awsAccessKey: input.aws_access_key_id,
              awsSecretAccessKey: input.aws_secret_access_key,
              region: input.region,
              configArn: configArn,
            },
          });
        } catch (error) {
          console.log(
            'Ran into error updating user in db, lost VPC, fix in cli., ',
            error
          );
          return false
        }
      } catch (error) {
        console.log('Ran into error creating VPC and subnets ', error);
        return false
      }
    }),

  /**
   * given a id of a user, will return the respective vpcId
   */
  findVPC: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const userResponse = await prisma.user.findUnique({
          where: {
            id: input.id,
          },
        });
        return userResponse?.vpcId;
      } catch (error) {
        console.log(
          'Encountered error finding the user in the database',
          error
        );
        return undefined;
      }
    }),

  /**
   * given a id of a user, will return the respective list of subnets
   */
  findSubnets: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const userResponse = await prisma.user.findUnique({
          where: {
            id: input.id,
          },
        });
        return userResponse?.subnetID;
      } catch (error) {
        console.log(
          'Encountered error finding the user in the database',
          error
        );
      }
    }),
});
