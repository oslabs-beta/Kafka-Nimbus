import { z } from 'zod';
import AWS from 'aws-sdk';
import { v4 } from 'uuid';
import { prisma } from '../../db'

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

import { KafkaClient, GetBootstrapBrokersCommand, UpdateConnectivityCommand, DescribeClusterCommand } from '@aws-sdk/client-kafka';

// importing functionality
import * as awsService from '../../service/createClusterService';

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
    .mutation(async ({ input }) => {
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

        // store aws key and sescret, and put into the AWS config
        const awsAccessKey = userResponse.awsAccessKey;
        const awsSecretAccessKey = userResponse.awsSecretAccessKey;
        const region = userResponse.region;
        // config update has to be before instantializing ec2 and kafka
        AWS.config.update({
          accessKeyId: awsAccessKey,
          secretAccessKey: awsSecretAccessKey,
          region: region
        })
        const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' })
        const kafka = new AWS.Kafka({ apiVersion: '2018-11-14' });

        // Create security groups within the vpc
        if (!vpcId) {
          throw new Error('vpcId assignment error');
        }

        const createSecurityGroupData = await awsService.createSecurityGroup(ec2, vpcId);

        await awsService.authorizeSecurityGroupIngress(ec2, createSecurityGroupData);

        // kafka params
        const kafkaParams = {
          BrokerNodeGroupInfo: {
            BrokerAZDistribution: 'DEFAULT',  // We should always keep it like this, could change in future
            ClientSubnets: subnetIds,
            InstanceType: input.instanceSize,
            SecurityGroups: [createSecurityGroupData],
            StorageInfo: {
              EbsStorageInfo: {
                VolumeSize: input.storagePerBroker,
              },
            },
          },
          ClusterName: input.name,
          KafkaVersion: '2.8.1',        // allow user to choose version?
          NumberOfBrokerNodes: input.brokerPerZone * input.zones,
          EncryptionInfo: {
            EncryptionInTransit: {
              ClientBroker: 'TLS', // Changing from PLAINTEXT to TLS for disabling plaintext traffic
              InCluster: true, // Enabling encryption within the cluster
            }
          },
          // not going to use open monitoring as our way of monitoring
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
              Iam: {
                Enabled: true,
              }
            },
          },
          ConfigurationInfo: {
            Arn: configArn, // Providing the ARN for kafka-ACL
            Revision: 1,
          },
        };

        const kafkaData = await awsService.createKafkaCluster(kafka, kafkaParams);

        /**
         * Now we want to store stuff in the database
         */
        const response = await prisma.cluster.create({
          data: {
            name: input.name,
            securityGroup: [createSecurityGroupData],
            brokerPerZone: input.brokerPerZone,
            instanceSize: input.instanceSize,
            zones: input.zones,
            storagePerBroker: input.storagePerBroker,
            kafkaArn: kafkaData,
            lifeCycleStage: 0,
            User: {
              connect: { id: input.id }
            }
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

  /**
   * This route will return the cluster status
   * @returns 
   *  ACTIVE
   * CREATING
   * DELETING
   * FAILED
   * HEALING
   * MAINTENANCE
   * REBOOTING_BROKER
   * UPDATING
   */

  checkClusterStatus: publicProcedure
    .input(z.object({
      name: z.string()
    }))
    .query(async ({ input }) => {
      try {
        const clusterResponse = await prisma.cluster.findUnique({
          where: {
            name: input.name
          },
          include: {
            User: true,
          }
        })
        if (clusterResponse?.User === undefined) {
          throw new Error('User does not exist on the cluster Response')
        }
        const awsAccessKey = clusterResponse?.User.awsAccessKey;
        const awsSecretAccessKey = clusterResponse?.User.awsSecretAccessKey;
        const region = clusterResponse?.User.region;
        const lifeCycleStage = clusterResponse?.lifeCycleStage;
        // setting sdk config
        AWS.config.update({
          accessKeyId: awsAccessKey,
          secretAccessKey: awsSecretAccessKey,
          region: region
        })
        const kafka = new AWS.Kafka({ apiVersion: '2018-11-14' });

        if (awsAccessKey === undefined || awsSecretAccessKey === undefined) {
          throw new Error('One or both access keys doesn\'t exist');
        }

        if (!clusterResponse) {
          throw new Error('Didn\'t find cluster in db');
        }
        const kafkaArn = clusterResponse.kafkaArn;   // obtaining the arn of the cluster
        if (kafkaArn) {
          const sdkResponse = await kafka.describeCluster(
            { ClusterArn: kafkaArn }
          ).promise();

          if (!sdkResponse) {
            throw new Error('SDK couldn\'t find the cluster');
          }
          const curState = sdkResponse.ClusterInfo?.State;
          if (curState === undefined) {
            throw new Error('Cur state undefined')
          }

          console.log(`Current cluster state: ${curState}`);
          
          /**
           * Cluster going from Creating to active
           */
          if (curState === 'ACTIVE' && lifeCycleStage === 0) {
            const client = new KafkaClient({region: region});

            try {
              // get the current version so that we can update the public access params
              const cluster = new DescribeClusterCommand({ClusterArn: kafkaArn});
              const describeClusterResponse = await client.send(cluster);
  
              const currentVersion = describeClusterResponse.ClusterInfo?.CurrentVersion;
  
              // now we want to turn on public access
              const updateParams = {
                ClusterArn: kafkaArn,
                ConnectivityInfo: {
                  PublicAccess: {
                    Type: 'SERVICE_PROVIDED_EIPS'   // enables public access
                  }
                },
                CurrentVersion: currentVersion
              };
              
              const commandUpdate = new UpdateConnectivityCommand(updateParams);
              await client.send(commandUpdate);
              console.log(`Successfully updated the public access`)

              // now update it in the database
              const updateResponse = prisma.cluster.update({
                where: {
                  name: input.name
                },
                data: {
                  lifeCycleStage: 1
                }
              })
            }
            catch (err) {
              console.error('Error updating cluster, ', err);
            }
          }
          /**
           * Cluster going from updating to active - get boostrap servers
           */
          else if (curState === 'ACTIVE' && lifeCycleStage === 1) {
            const client = new KafkaClient({region: region});

            try {
              const getBootstrapBrokersCommand = new GetBootstrapBrokersCommand({
                ClusterArn: kafkaArn
              })
              const bootstrapResponse = await client.send(getBootstrapBrokersCommand);
              const brokers = bootstrapResponse.BootstrapBrokerStringSaslIam;
              if (brokers === undefined) {
                throw new Error('Error getting brokers');
              }
              console.log("successfully got boostrap brokers: ", brokers);

              // store in the database
              const updateResponse = prisma.cluster.update({
                where: {
                  name: input.name,
                },
                data: {
                  bootStrapServer: [brokers]
                }
              })
            }
            catch(err) {
              console.error('Error going from updating to active, ', err);
            }
          }

          return curState;
        }
        return undefined;
      }
      catch (err) {
        console.log('error fetching data from database', err)
      }
    }),


  deleteCluster: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({ input }) => {
      try {
        //deleting cluster in database
        const deletedCluster = await prisma.cluster.delete({
          where: {
            id: input.id,
          },
          include: {
            User: true
          }
        });

        if (!deletedCluster) throw new Error('Cluster to delete was not found in the database');

        const accessKeyId = deletedCluster.User.awsAccessKey;
        const secretAccessKey = deletedCluster.User.awsSecretAccessKey;
        const region = deletedCluster.User.region;
        const ClusterArn = deletedCluster.kafkaArn ? deletedCluster.kafkaArn : '';

        const client = new Kafka({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey
          }
        });

        //deleting cluster in AWS
        const params: DeleteClusterCommandInput = {
          ClusterArn
        };
        const command = new DeleteClusterCommand(params);

        const response: DeleteClusterCommandOutput = await client.send(command);
        if (response.State !== 'DELETING') throw new Error('Failed to delete cluster from AWS');

        return deletedCluster;
      }
      catch (err) {
        console.log('Error deleting from aws , ', err);
      }
    }),


  /**
   * ID: userId
   * @returns true or false if vpcid exists or not
   */

  /**
   * Does not work correctly
   */

  clusterExists: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ input }) => {
      try {
        const userResponse = await prisma.user.findUnique({
          where: {
            id: input.id
          }
        });

        if (userResponse && userResponse.vpcId !== '') {
          return true;
        }
        return false;
      }
      catch (err) {
        console.log('Error finding user in db ', err)
      }
    })
});