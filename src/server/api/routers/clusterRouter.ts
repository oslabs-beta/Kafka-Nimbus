import { z } from 'zod';
import AWS from 'aws-sdk';
import { v4 } from 'uuid';
import { prisma } from '../../db'

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

const ec2 = new AWS.EC2({apiVersion: '2016-11-15'})
const kafka = new AWS.Kafka({apiVersion: '2018-11-14'});
import { KafkaClient, BatchAssociateScramSecretCommand, UpdateConnectivityCommand } from '@aws-sdk/client-kafka';

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
    .mutation(async({ input }) => {
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

        // security group for the cluster
        const createSecurityGroupData = await ec2.createSecurityGroup(createSecurityGroupParams).promise();
        let groupId: string | undefined = createSecurityGroupData?.GroupId;
        if (groupId === undefined) groupId = '';

        const authorizeSecurityGroupParams = {
          GroupId: groupId,
          IpPermissions: [
            {
              IpProtocol: 'tcp',
              FromPort: -1,
              ToPosrt: -1,
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
            lifeCycleStage: 0
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
    .mutation(async({ input }) => {
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
        const lifeCycleStage = clusterResponse?.lifeCycleStage;
        if (awsAccessKey === undefined || awsSecretAccessKey === undefined) {
          throw new Error('One or both access keys doesn\'t exist');
        }
        if (lifeCycleStage === undefined) {
          throw new Error('life cycle stage doesn\'t exist');
        }
        const region = clusterResponse?.User.region;
        const { secretArn } = clusterResponse?.User;

        if (!clusterResponse) {
          throw new Error('Didn\'t find cluster in db');
        }
        const kafkaArn = clusterResponse.kafkaArn;   // obtaining the arn of the cluster
        if (kafkaArn) {
          const sdkResponse = await kafka.describeCluster(
            {ClusterArn: kafkaArn}
            ).promise();
  
            if (!sdkResponse) {
              throw new Error('SDK couldn\'t find the cluster');
            }
            const curState = sdkResponse.ClusterInfo?.State;

            // if the state is active, we want to update public access
            // to SERVICE_PROVIDED_EIPS
            if (curState === 'ACTIVE' && lifeCycleStage === 0) {
              const client = new KafkaClient({region: region, 
                credentials: {
                  accessKeyId: awsAccessKey,
                  secretAccessKey: awsSecretAccessKey,
              }});
              const clientCommandParams = {
                ClusterArn: kafkaArn,
                SecretArnList: [secretArn]
              }
              const command = new BatchAssociateScramSecretCommand(clientCommandParams);
              const commandResponse = await client.send(command);
              if (commandResponse.ClusterArn) {
                console.log(`Created secret with cluster ${commandResponse.ClusterArn}`);
              }
              
              // get the current version so that we can update the public access params
              const kafkaParams = {
                ClusterArn: kafkaArn
              }
              const describeClusterResponse = await kafka.describeCluster(kafkaParams).promise();
              if (describeClusterResponse === undefined) {
                throw new Error('Couldn\'t find cluster')
              }
              const currentVersion = describeClusterResponse.ClusterInfo?.CurrentVersion;
              // store current version in the db
              await prisma.cluster.update({
                where: {
                  name: input.name
                },
                data: {
                  currentVersion: currentVersion,
                  lifeCycleStage: 1             // used to track where in the life cycle the cluster is
                }
              })

              const updateParams = {
                ClusterArn: kafkaArn,
                ConnectivityInfo: {
                  PublicAccess: {
                    Type: 'SERVICE_PROVIDED_EIPS'   // enables public access
                  }
                },
                CurrentVersion: currentVersion
              };
              // send the update command
              const commandUpdate = new UpdateConnectivityCommand(updateParams);
              await client.send(commandUpdate);
              console.log(`Successfully updated the public access`)
            }
            // when state is active again, after updating public access
            else if (curState === 'ACTIVE' && lifeCycleStage === 1) {
              const boostrapResponse = await kafka.getBootstrapBrokers({
                ClusterArn: kafkaArn
              }).promise();
              const endpoints = boostrapResponse.BootstrapBrokerStringPublicSaslScram;

              // store endpoints in the cluster db
              const updateResponse = await prisma.cluster.update({
                where: {
                  name: input.name
                },
                data: {
                  bootStrapServer: {
                    push: endpoints
                  },
                  lifeCycleStage: 2     // last lifeCycleStage
                }
              });
            }
  
            console.log(`Current cluster state: ${curState}`);
            return curState;
        }
        return 'Error finding cluster';
      }
      catch (err) {
        console.log('error fetching data from database', err)
      }
    }),


    deleteCluster: publicProcedure
      .input(z.object({
        name: z.string()
      }))
      .mutation(async({ input }) => {
        try {
          const deletedCluster = await prisma.cluster.delete({
            where :{
              name: input.name,
            }
          });

          /**
           * Add functionality to also delete respective EC2 instance
           */

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

    clusterExists: publicProcedure  
      .input(z.object({
        id: z.string()    
      }))
      .query(async({ input }) => {
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