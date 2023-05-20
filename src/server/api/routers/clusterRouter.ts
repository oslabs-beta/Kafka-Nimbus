import { z } from 'zod';
import AWS from 'aws-sdk';
import { v4 } from 'uuid';
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
        const userResponse = await prisma.user.findUnique({
          where: {
            id: input.id
          }
        });
        if (!userResponse || !userResponse.vpcId) {
          throw new Error('User doesn\'t exist in database')
        }
        // store the vpcId and subnets l
        const vpcId = userResponse.vpcId;
        const subnetIds = userResponse.subnetID;
        const configArn = userResponse.configArn;
        
          // Create security groups within the vpc
        if (!vpcId) {
          throw new Error('vpcId assignment error');
        }
        // create security group for msk cluster
        const randString: string = v4(); 
        const createSecurityGroupParams = {
          Description: 'Security group for MSK Cluster',
          GroupName: 'MSKSecurityGroup' + randString,
          VpcId: vpcId
        }

        const createSecurityGroupData = await ec2.createSecurityGroup(createSecurityGroupParams).promise();
        let groupId: string | undefined = createSecurityGroupData?.GroupId;
        if (groupId === undefined) groupId = '';

        const authorizeSecurityGroupParams = {
          GroupId: groupId,
          IpPermissions: [
            {
              IpProtocol: 'tcp',
              FromPort: 9092,
              ToPort: 9092,
              IpRanges: [{ CidrIp: '0.0.0.0/0'}]  // all access open
            },
            {
              IpProtocol: 'tcp',
              FromPort: 9094,
              ToPort: 9094,
              IpRanges: [{ CidrIp: '0.0.0.0/' }] // all access
            }
          ]
        }
        await ec2.authorizeSecurityGroupIngress(authorizeSecurityGroupParams).promise();
        console.log(`Added inbound rules to security group ${groupId}`);

        // kafka params
        const kafkaParams = {
          BrokerNodeGroupInfo: {
            BrokerAZDistribution: 'DEFAULT',  // We should always keep it like this, could change in future
            ClientSubnets: subnetIds,
            InstanceType: input.instanceSize,
            SecurityGroups: [...groupId],
            StorageInfo: {
              EbsStorageInfo: {
                VolumeSize: input.storagePerBroker,
              },
            },
          },
          clusterName: input.name,
          KafkaVersion: '2.8.1',        // allow user to choose version?
          NumberOfBrokerNodes: input.brokerPerZone,
          EncryptionInfo: {
            EncryptionInTransit: {
              ClientBroker: 'TLS', // Changing from PLAINTEXT to TLS for disabling plaintext traffic
              InCluster: true, // Enabling encryption within the cluster
            }
          },
          OpenMonitoring: {
            Prometheus: {
              JmxExporter: {
                EnabledInBroker: true
              },
              NodeExporter: {
                EnabledInBroker: true
              }
            }
          },
          ClientAuthentication: {
            Sasl: {
              Scram: {
                Enabled: true,
              },
            },
          },
          ConfigurationInfo: {
            Arn: configArn, // Providing the ARN for kafka-ACL
            Revision: 1,
          },
        };

        const kafkaData = await kafka.createCluster(kafkaParams).promise();
        if (!kafkaData?.ClusterArn) {
          throw new Error("Error creating the msk cluster");
        }
        const kafkaArn: string = kafkaData.ClusterArn;
        console.log(`Created Kafka Cluster with ARN ${kafkaArn}`)

        /**
         * Now we want to store stuff in the database
         */
        const response = await prisma.cluster.create({
          data: {
            name: input.name,
            userId: input.id,
            securityGroup: groupId,
            brokerPerZone: input.brokerPerZone,
            instanceSize: input.instanceSize,
            zones: input.zones,
            storagePerBroker: input.storagePerBroker,
            kafkaArn: kafkaArn,
          }
        })
        if (!response) {
          throw new Error('Could not create cluster in dateabase');
        }

        return response;

      }
      catch (err) {
        console.log('Error creating kafka cluster using SDK | ', err)
      }
    }),


    
  checkClusterStatus: publicProcedure
    .input(z.object({
      name: z.string()
    }))
    .query(async({ input }) => {
      try {
        const clusterResponse = await prisma.cluster.findUnique({
          where: {
            name: input.name
          }
        })
        if (!clusterResponse) {
          throw new Error('Didn\'t find cluster in db');
        }
        const kafkaArn: string = clusterResponse?.kafkaArn;
        
        const sdkResponse = await kafka.describeCluster(
          {ClusterArn: kafkaArn}
          ).promise();

          if (!sdkResponse) {
            throw new Error('SDK couldn\'t find the cluster');
          }
          const curState: string = sdkResponse.ClusterInfo?.State;

          console.log(curState);
          return curState;

      }
      catch (err) {
        console.log('error fetching data from database', err)
      }
    })
});