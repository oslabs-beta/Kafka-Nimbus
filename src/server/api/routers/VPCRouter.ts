

import { z } from 'zod';
import AWS from 'aws-sdk';
import { prisma } from '../../db' 


const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
import { KafkaClient, CreateConfigurationCommand } from '@aws-sdk/client-kafka';
import fs from 'fs';



import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const createVPCRouter = createTRPCRouter({
  createVPC: publicProcedure
    .input(z.object({
      id  : z.string(),
      aws_access_key_id : z.string(),
      aws_secret_access_key: z.string(),
      region: z.string()
    }))
    .mutation(async ({ input }) => {
        AWS.config.update({
          accessKeyId: input.aws_access_key_id,
          secretAccessKey: input.aws_secret_access_key,
          region: input.region,
        })
        const client = new KafkaClient({region: input.region})

        try{
          // create the vpc
          const vpcData = await ec2.createVpc({
            CidrBlock: '10.0.0.0/16',
          }).promise();
          // make sure data is correct
          if (!vpcData.Vpc || !vpcData.Vpc.VpcId) {
            throw new Error('VPC creation failed');
          }
          const vpcId: string = vpcData.Vpc.VpcId;
          console.log(`Created VPC with id ${vpcId}`)

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
          await ec2.attachInternetGateway({ InternetGatewayId: igwId, VpcId: vpcId}).promise();
          console.log(`Attached Internet Gateway ${igwId} to VPC ${vpcId}`);


          // Create subnets
          const subnet1Data = await ec2.createSubnet(
            { 
              CidrBlock: '10.0.0.0/24', 
              VpcId: vpcId, 
              AvailabilityZone: 'us-east-2a'          // change this so  that they can enter their specific region
          }).promise();
          const subnet2Data = await ec2.createSubnet(
            { 
              CidrBlock: '10.0.1.0/24', 
              VpcId: vpcId, 
              AvailabilityZone: 'us-east-2b'
          }).promise();
          const subnet1Id = subnet1Data.Subnet?.SubnetId;
          const subnet2Id = subnet2Data.Subnet?.SubnetId;
          if (subnet1Id === undefined || subnet2Id === undefined) {
            throw new Error('One or both of the subnets failed to create');
          }
          console.log(`Created subnet with id ${subnet1Id}`);
          console.log(`Created subnet with id ${subnet2Id}`);

          // Create route table connections
          const routeTables = await ec2.describeRouteTables({
            Filters: [{
              Name: 'vpc-id',
              Values: [vpcId]
            }]
          }).promise();
          const routeTableId: string = routeTables.RouteTable[0].RouteTableId;

          // Create route for IGW
          await ec2.createRoute({
            DestinationCidrBlock: '0.0.0.0/0',
            GatewayId: igwId,
            RouteTableId: routeTableId,
          }).promise();
          console.log(`Added route for IGW ${igwId} to Route Table ${routeTableId}`);

          // create cluster config file
          const ServerProperties = fs.readFileSync('server.properties', 'utf8');
          const configParams = {
            Description: 'Configuration settings for custom cluster',
            KafkaVersion: ['2.8.1'],
            Name: 'Kafka-NimbusConfiguration',
            ServerProperties: ServerProperties,
          }

          const configData = await client.send(new CreateConfigurationCommand(configParams));
          const configArn = configData.Arn;
          if (configArn === undefined) {
            throw new Error('ConfigARN doesn\'t exist on client')
          }
          console.log(`Created config with Arn ${configArn}`);

          // Create key
          const kms = new AWS.KMS();
          const kmsParams = {
            CustomerMasterKeySpec: "SYMMETRIC_DEFAULT",
            KeyUsage: "ENCRYPT_DECRYPT",
            Origin: 'AWS_KMS',
            Description: "This is a symmetric key for ec and dec"
          };

          // call the method
          const kmsResponse = await kms.createKey(kmsParams).promise();
          const keyId = kmsResponse.KeyMetadata?.KeyId;
          if (keyId === undefined) {
            throw new Error('KeyId doesn\'t exist on kms response obj')
          }
          console.log(`Created kms key with id: ${keyId}`);
          // getting the account id
          const sts = new AWS.STS();
          const stsResponse = await sts.getCallerIdentity({}).promise();
          const accountId: string | undefined = stsResponse.Account;
          if (accountId === undefined) {
            throw new Error('Account id failed');
          }
          console.log(`Got accountID: ${accountId}`);


          // we have to add a policy to the key to grant permissions

          const policy = {
            "Version": "2012-10-17",
            "Id": "key-default-1",
            "Statement": [
                {
                    "Sid": "Enable IAM User Permissions",
                    "Effect": "Allow",
                    "Principal": {
                        "AWS": [
                            `arn:aws:iam::${accountId}:root`    // get user account number
                        ]
                    },
                    "Action": "kms:*",
                    "Resource": "*"
                }
            ]
         };
          if (keyId === undefined) {
            throw new Error('Key id does not exist');
          }

          await kms.putKeyPolicy( {
            KeyId: keyId,
            PolicyName: 'default',
            Policy: JSON.stringify(policy)

          }).promise();

          // create Secret using KMS key
          const secretsmanager = new AWS.SecretsManager();

          const secretsParams = {
            Name: `AmazonMSK_${input.id}`,
            SecretString: JSON.stringify({
              "username": input.id,
              "password": 'kafka-nimbus'
            }),
            KmsKeyId: keyId
          }
          const secretsResponse = await secretsmanager.createSecret(secretsParams).promise();
          const secretArn = secretsResponse.ARN;
          if (secretArn === undefined) {
            throw new Error('SecretArn doesn\'t exist on the secret object');
          }
          console.log(`Created secret with ARN: ${secretArn}`);


          /**
           * Send required info to db
           */
          const subnets : string[] = [subnet1Id, subnet2Id]
          try {
            // updates the user in the database with the vpc and subnet ids
            await prisma.user.update({
              where: {
                id: input.id
              },
              data: {
                vpcId: vpcId,
                subnetID: {
                  push: subnets
                },
                awsAccessKey: input.aws_access_key_id,
                awsSecretAccessKey: input.aws_secret_access_key,
                region: input.region,
                configArn: configArn,
                kmsKey: keyId,
                secretArn: secretArn
              }
            })
          }
          catch (error) {
            console.log('Ran into error updating user, lost VPC, fix in cli., ', error);
          }
        }
        catch (error) {
          console.log('Ran into error creating VPC and subnets ', error)
        }
      }
    ),

  /**
   * given a id of a user, will return the respective vpcId
   */
  findVPC: publicProcedure 
    .input(z.object({
      id :z.string(),
    }))
    .query(async ({input}) => {
      try {
        const userResponse = await prisma.user.findUnique({
          where: {
            id: input.id
          },
        })
        return userResponse?.vpcId;
      }
      catch (error) {
        console.log("Encountered error finding the user in the database", error)
      }
    }),

  /**
   * given a id of a user, will return the respective list of subnets
   */
  findSubnets: publicProcedure 
  .input(z.object({
    id :z.string(),
  }))
  .query(async ({input}) => {
    try {
      const userResponse = await prisma.user.findUnique({
        where: {
          id: input.id
        },
      })
      return userResponse?.subnetID;
    }
    catch (error) {
      console.log("Encountered error finding the user in the database", error)
    }
  })
})