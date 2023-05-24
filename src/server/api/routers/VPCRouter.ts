import { z } from 'zod';
import AWS from 'aws-sdk';
import { prisma } from '../../db';
import path from 'path';


import { KafkaClient, CreateConfigurationCommand } from '@aws-sdk/client-kafka';
import fs from 'fs';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

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
      AWS.config.update({
        accessKeyId: input.aws_access_key_id,
        secretAccessKey: input.aws_secret_access_key,
        region: input.region,
      });
      // it is important to instantaiate ec2 instance after updating the 
      // aws config.
      const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

      const client = new KafkaClient({
        region: input.region,
        credentials: {
          accessKeyId: input.aws_access_key_id,
          secretAccessKey: input.aws_secret_access_key,
        },
      });

      try {
        // create the vpc
        const vpcData = await ec2
          .createVpc({
            CidrBlock: '10.0.0.0/16',
          })
          .promise();
        // make sure data is correct
        if (!vpcData.Vpc || !vpcData.Vpc.VpcId) {
          throw new Error('VPC creation failed');
        }
        const vpcId: string = vpcData.Vpc.VpcId;
        console.log(`Created VPC with id ${vpcId}`);

        // Create the IGW
        const igwData = await ec2.createInternetGateway({}).promise();
        // checking it exists
        if (!igwData.InternetGateway) {
          throw new Error('IGW creation failed');
        }

        const igwId = igwData.InternetGateway.InternetGatewayId;
        if (igwId === undefined) {
          throw new Error('IgwId is undefined');
        }

        // attach IGW to VPC
        await ec2
          .attachInternetGateway({ InternetGatewayId: igwId, VpcId: vpcId })
          .promise();
        console.log(`Attached Internet Gateway ${igwId} to VPC ${vpcId}`);

        // Create subnets
        const subnet1Data = await ec2
          .createSubnet({
            CidrBlock: '10.0.0.0/24',
            VpcId: vpcId,
            AvailabilityZone: 'us-east-2a', // change this so  that they can enter their specific region
          })
          .promise();
        const subnet2Data = await ec2
          .createSubnet({
            CidrBlock: '10.0.1.0/24',
            VpcId: vpcId,
            AvailabilityZone: 'us-east-2b',
          })
          .promise();
        const subnet1Id = subnet1Data.Subnet?.SubnetId;
        const subnet2Id = subnet2Data.Subnet?.SubnetId;
        if (subnet1Id === undefined || subnet2Id === undefined) {
          throw new Error('One or both of the subnets failed to create');
        }
        console.log(`Created subnet with id ${subnet1Id}`);
        console.log(`Created subnet with id ${subnet2Id}`);

        // Create route table connections
        const routeTables = await ec2.describeRouteTables({
            Filters: [
              {
                Name: 'vpc-id',
                Values: [vpcId],
              },
            ],
          })
          .promise();
        if (!routeTables || routeTables.RouteTables === undefined || routeTables.RouteTables?.length === 0) {
          throw new Error('Route table failed to create');
        }
        const routeTableId = routeTables.RouteTables[0]?.RouteTableId;
        if (!routeTableId) {
          throw new Error('Route table failed to create');
        }

        // Create route for IGW
        await ec2
          .createRoute({
            DestinationCidrBlock: '0.0.0.0/0',
            GatewayId: igwId,
            RouteTableId: routeTableId,
          })
          .promise();
        console.log(
          `Added route for IGW ${igwId} to Route Table ${routeTableId}`
        );

        // create cluster config file
        // hardcoding server properties
        const ServerProperties = 'auto.create.topics.enable=false\n' +
        'default.replication.factor=3\n' +
        'min.insync.replicas=2\n' +
        'num.io.threads=8\n' +
        'num.network.threads=5\n' +
        'num.partitions=1\n' +
        'num.replica.fetchers=2\n' +
        'replica.lag.time.max.ms=30000\n' +
        'socket.receive.buffer.bytes=102400\n' +
        'socket.request.max.bytes=104857600\n' +
        'socket.send.buffer.bytes=102400\n' +
        'unclean.leader.election.enable=true\n' +
        'zookeeper.session.timeout.ms=18000\n' +
        'allow.everyone.if.no.acl.found=false'; 

        const configParams = {
          Description: 'Configuration settings for custom cluster',
          KafkaVersion: ['2.8.1'],
          Name: 'Kafka-NimbusConfiguration',
          ServerProperties: ServerProperties,
        };

        const configData = await client.send(
          new CreateConfigurationCommand(configParams)
        );
        const configArn = configData.Arn;
        if (configArn === undefined) {
          throw new Error("ConfigARN doesn't exist on client");
        }
        console.log(`Created config with Arn ${configArn}`);

        /**
         * Send required info to db
         */
        const subnets: string[] = [subnet1Id, subnet2Id];
        try {
          // updates the user in the database with the vpc and subnet ids
          await prisma.user.update({
            where: {
              id: input.id,
            },
            data: {
              vpcId: vpcId,
              subnetID: {
                push: subnets,
              },
              awsAccessKey: input.aws_access_key_id,
              awsSecretAccessKey: input.aws_secret_access_key,
              region: input.region,
              configArn: configArn,
            },
          });
        } catch (error) {
          console.log(
            'Ran into error updating user, lost VPC, fix in cli., ',
            error
          );
        }
      } catch (error) {
        console.log('Ran into error creating VPC and subnets ', error);
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
