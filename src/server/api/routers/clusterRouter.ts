import { z } from "zod";
import AWS from "aws-sdk";
import { prisma } from "../../db";


import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"; 

import {
  KafkaClient,
  GetBootstrapBrokersCommand,
  UpdateConnectivityCommand,
  DescribeClusterCommand,
  DeleteClusterCommand,
  type DeleteClusterCommandInput,
  type DeleteClusterCommandOutput,
} from "@aws-sdk/client-kafka";

// importing functionality
import * as awsService from '../../service/createClusterService';
import * as checkService from '../../service/checkClusterService'

export const clusterRouter = createTRPCRouter({
  createCluster: publicProcedure
    .input(
      z.object({
        id: z.string(),
        brokerPerZone: z.number(),
        instanceSize: z.string(),
        zones: z.number(),
        storagePerBroker: z.number(),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // First, find the user object in the database using id
      try {
        const userResponse = await prisma.user.findUnique({
          where: {
            id: input.id,
          },
        });
        if (!userResponse || !userResponse.vpcId) {
          throw new Error("User doesn't exist in database");
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
          region: region,
        });
        const ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });
        const kafka = new AWS.Kafka({ apiVersion: "2018-11-14" });

        // Create security groups within the vpc
        if (!vpcId) {
          throw new Error("vpcId assignment error");
        }

        // moved functionality to the service folder, to make code easier to read
        const createSecurityGroupData = await awsService.createSecurityGroup(ec2, vpcId);

        await awsService.authorizeSecurityGroupIngress(ec2, createSecurityGroupData);

        // kafka params
        const kafkaParams = {
          BrokerNodeGroupInfo: {
            BrokerAZDistribution: "DEFAULT", // We should always keep it like this, could change in future
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

          KafkaVersion: "2.8.1", // allow user to choose version?
          NumberOfBrokerNodes: input.brokerPerZone * input.zones,
          EncryptionInfo: {
            EncryptionInTransit: {
              ClientBroker: "TLS", // Changing from PLAINTEXT to TLS for disabling plaintext traffic
              InCluster: true, // Enabling encryption within the cluster
            },
          },
          // not going to use open monitoring as our way of monitoring
          OpenMonitoring: {
            Prometheus: {
              JmxExporter: {
                EnabledInBroker: true,
              },
              NodeExporter: {
                EnabledInBroker: true,
              },
            },
          },
          ClientAuthentication: {
            Sasl: {
              Iam: {
                Enabled: true,
              },
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
        const graidients = [
          'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
          'bg-gradient-to-r from-green-300 via-blue-500 to-purple-600',
          'bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100',
          'bg-gradient-to-r from-green-200 via-green-300 to-blue-500',
          'bg-gradient-to-r from-green-300 via-yellow-300 to-pink-300',
        ];

        const random = Math.floor(Math.random() * 5);
        const response = await prisma.cluster.create({
          data: {
            name: input.name,
            securityGroup: [createSecurityGroupData],
            brokerPerZone: input.brokerPerZone,
            img: graidients[random],
            instanceSize: input.instanceSize,
            zones: input.zones,
            storagePerBroker: input.storagePerBroker,
            kafkaArn: kafkaData,
            lifeCycleStage: 0,
            User: {
              connect: { id: input.id },
            },
          },
        });
        if (!response) {
          throw new Error("Could not create cluster in dateabase");
        }

        return response;
      } catch (err) {
        console.log("Error creating kafka cluster using SDK | ", err);
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
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { awsAccessKey, awsSecretAccessKey, region, lifeCycleStage, kafkaArn } =  await checkService.getClusterResponse(input.id);
        // setting sdk config
        AWS.config.update({
          accessKeyId: awsAccessKey,
          secretAccessKey: awsSecretAccessKey,
          region: region,
        });
        const kafka = new AWS.Kafka({ apiVersion: "2018-11-14" });

        if (awsAccessKey === undefined || awsSecretAccessKey === undefined) {
          throw new Error("One or both access keys doesn't exist");
        }

        if (kafkaArn) {
          const curState = await checkService.describeCluster(kafka, kafkaArn);
          /**
           * Cluster going from Creating to active
           */
          if (curState === "ACTIVE" && lifeCycleStage === 0) {
            await checkService.updatePublicAccess(region, awsAccessKey, awsSecretAccessKey, kafkaArn, input.id);
          }
          // cluster going from updating to fully ready to go
          // grabs boostrap broker strings and stores them in the db 
          else if (curState === "ACTIVE" && lifeCycleStage === 1) {
            await checkService.getBoostrapBrokers(region, awsAccessKey, awsSecretAccessKey, kafkaArn, input.id)
          }
          return curState;
        }
        return undefined;
      } catch (err) {
        console.log("error fetching data from database", err);
      }
    }),

  deleteCluster: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        //Getting cluster from db
        const toDelete = await prisma.cluster.findUnique({
          where: {
            id: input.id,
          },
          include: {
            User: true,
          },
        });

        if (!toDelete)
          throw new Error("Cluster to delete was not found in the database");

        const accessKeyId = toDelete.User.awsAccessKey;
        const secretAccessKey = toDelete.User.awsSecretAccessKey;
        const region = toDelete.User.region;
        const ClusterArn = toDelete.kafkaArn ? toDelete.kafkaArn : "";

        const client = new KafkaClient({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });

        //deleting cluster in AWS
        const params: DeleteClusterCommandInput = {
          ClusterArn,
        };
        const command = new DeleteClusterCommand(params);

        const response: DeleteClusterCommandOutput = await client.send(command);
        if (response.State !== "DELETING")
          throw new Error("Failed to delete cluster from AWS");
        else {
          //if the cluster was successfully deleted from AWS, then delete cluster from db
          const deletedCluster = await prisma.cluster.delete({
            where: {
              id: input.id,
            },
            include: {
              User: true,
            },
          });
          if (!deletedCluster)
            throw new Error("Unable to delete cluster from the database");
        }
      } catch (err) {
        console.log("Error deleting from aws: ", err);

      }
    }),

  /**
   * ID: userId
   * @returns true or false if vpcid exists or not
   */
  updateTargetsJson: publicProcedure
  .query(() => {
    // do stuff to file first

  }),

  /**
   * Does not work correctly
   */

  clusterExists: publicProcedure
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

        if (userResponse && userResponse.vpcId !== "") {
          return true;
        }
        return false;
      } catch (err) {
        console.log("Error finding user in db ", err);
      }
    }),
});
