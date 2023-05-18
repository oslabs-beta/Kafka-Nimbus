/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from 'zod';
import AWS from 'aws-sdk';
import prisma from '../../db'


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
        AWS.config.update({
          accessKeyId: input.aws_access_key_id,
          secretAccessKey: input.aws_secret_access_key,
          region: input.region,
        })

        try{
          // create the vpc
          const vpcData: any = await ec2.createVpc({
            CidrBlock: '10.0.0.0/16',
          }).promise();
          // make sure data is correct
          if (!vpcData.Vpc || !vpcData.Vpc.VpcId) {
            throw new Error('VPC creation failed');
          }
          const vpcId: string = vpcData.Vpc.VpcId;
          console.log(`Created VPC with id ${vpcId}`)

          // Create the IGW
          const igwData: any = await ec2.createInternetGateway({}).promise();
          // checking it exists
          if (!igwData.InternetGateway) {
            throw new Error('IGW creation failed');
          }
          const igwId: string = igwData.InternetGateway.InternetGatewayId

          // attach IGW to VPC
          await ec2.attachInternetGateway({ InternetGatewayId: igwId, VpcId: vpcId}).promise();
          console.log(`Attached Internet Gateway ${igwId} to VPC ${vpcId}`);

          // Create subnets
          const subnet1Data: any = await ec2.createSubnet(
            { 
              CidrBlock: '10.0.0.0/24', 
              VpcId: vpcId, 
              AvailabilityZone: 'us-east-2a'
          }).promise();
          const subnet2Data: any = await ec2.createSubnet(
            { 
              CidrBlock: '10.0.1.0/24', 
              VpcId: vpcId, 
              AvailabilityZone: 'us-east-2b'
          }).promise();
          const subnet1Id: string = subnet1Data.Subnet.SubnetId;
          const subnet2Id: string = subnet2Data.Subnet.SubnetId;
          console.log(`Created subnet with id ${subnet1Id}`);
          console.log(`Created subnet with id ${subnet2Id}`);

          // Create route table connections
          const routeTables: any = await ec2.describeRouteTables({
            Filters: [{
              Name: 'vpc-id',
              Values: [vpcId]
            }]
          }).promise();
          const routeTableId: string = routeTables.RouteTables[0].RouteTableId;

          // Create route for IGW
          await ec2.createRoute({
            DestinationCidrBlock: '0.0.0.0/0',
            GatewayId: igwId,
            RouteTableId: routeTableId,
          }).promise();
          console.log(`Added route for IGW ${igwId} to Route Table ${routeTableId}`);

          /**
           * Send required info to db
           */



        }
        catch (error) {
          console.log('Ran into error creating VPC and subnets ', error)
        }
      }
    }),

  createCluster: publicProcedure
    .input(z.object({
      EbsStorageSize : z.number(),
      InstanceType : z.string(),
      ClusterName : z.string(),
      NumberOfBrokers : z.number(),
    }))
    .query(({ input }) => {
      
    }),
})