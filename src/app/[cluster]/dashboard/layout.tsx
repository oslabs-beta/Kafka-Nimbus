/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { KafkaClient, DescribeClusterCommand, type DescribeClusterCommandInput, type DescribeClusterCommandOutput } from '@aws-sdk/client-kafka';
import { Kafka, logLevel, AssignerProtocol, type ITopicMetadata, ConfigResourceTypes, type Admin, type Producer, type Consumer, type DescribeConfigResponse } from 'kafkajs';
import { createMechanism } from '@jm18457/kafkajs-msk-iam-authentication-mechanism';
import { prisma } from '~/server/db';

export type metrics = {
  ClusterName: string;
  CreationTime: string;
  KafkaVersion: string;
  NumberOfBrokerNodes: number;
  State: string;
};

const layout = async (props) => {

  try {
    interface ResponseBody {
      Metrics: any;
      Topics: any[];
      ConsumerGroups: any[];
    }
    const response: ResponseBody = {
      Metrics: {},
      Topics: [],
      ConsumerGroups: [],
    };

    //get Cluster Information from the database
    const clusterInfo = await prisma.cluster.findUnique({
      where: {
        id: props.params.cluster,
      },
      include: {
        User: true
      }
    });
    if (!clusterInfo) {
      throw new Error('Error: Cluster does not exist in the database');
    }

    //get bootstrap public endpoints
    const brokers = clusterInfo.bootStrapServer;

    const accessKeyId = clusterInfo.User.awsAccessKey;
    const secretAccessKey = clusterInfo.User.awsSecretAccessKey;
    const region = clusterInfo.User.region;

    const authParams = {
      region,
      credentials: {
        accessKeyId, secretAccessKey
      }
    }

    //AWS kafka client
    const client = new KafkaClient(
      authParams
    );

    //KafkaJS client
    const kafka: Kafka = new Kafka({
      clientId: `Cluster${props.params.cluster}`,
      brokers,
      logLevel: logLevel.ERROR,
      ssl: true,
      sasl: createMechanism(authParams)
    });
    console.log('KJS Successfully connected to cluster');


    //GETTING METRICS

    //Cluster Dashboard Information from MSK
    const commInput: DescribeClusterCommandInput = {
      ClusterArn: clusterInfo?.kafkaArn ? clusterInfo?.kafkaArn : "",
    };

    const command = new DescribeClusterCommand(commInput);
    console.log('Sending DescribeClusterCommand through MSK client');
    const descClusterResponse: DescribeClusterCommandOutput = await client.send(command);
    const cluster = descClusterResponse.ClusterInfo;
    //cluster.ClusterName, cluster.CreationTime, cluster.CurrentBrokerSoftwareInfo.KafkaVersion, cluster.InstanceType,
    //cluster.NumberOfBrokerNodes, cluster.State
    if (!cluster) throw new Error('Error: MSK Cluster does not have info');
    const { ClusterName, CreationTime, CurrentBrokerSoftwareInfo, NumberOfBrokerNodes, State } = cluster;

    response.Metrics = {
      ClusterName,
      CreationTime,
      KafkaVersion: CurrentBrokerSoftwareInfo?.KafkaVersion,
      NumberOfBrokerNodes,
      State
    };
    console.log('------ADDED metrics to response');


    //GETTING TOPICS
    const admin: Admin = kafka.admin();
    console.log('KJS: Successfully created admin');

    console.log('Sending fetchTopicMetadata through KJS client');
    const fetchTopicMetaResponse = await admin.fetchTopicMetadata();
    if (!fetchTopicMetaResponse) throw new Error('Error: No topics data received from KJS client');

    //Helper function to get Topic config information
    const descTopicConfig = async function (name: string): DescribeConfigResponse {
      try {
        const responseConfig = await admin.describeConfigs({
          includeSynonyms: false,
          resources: [
            {
              type: ConfigResourceTypes.TOPIC,
              name,
              configNames: ['cleanup.policy', 'retention.ms', 'message.format.version', 'file.delete.delay.ms', 'max.message.bytes', 'index.interval.bytes'],
            },
          ]
        });
        return responseConfig;
      } catch (err) {
        console.log('Error occurred in descTopicConfig');
      }
    }

    //Processing each topic's data and storing it in an array topicsData

    const kTopicsData: ITopicMetadata[] = fetchTopicMetaResponse.topics;

    const topicsData = [];
    for (const topic of kTopicsData) {
      //add list of Consumer Groups subscribed to this topic [TODO]

      //add config description to topic
      //[WEIRD BUG] must put await for this function else it will cause an error: KafkaJSConnectionError: Connection error: Client network socket disconnected before secure TLS connection was established
      const configData = await descTopicConfig(topic.name);

      //get offsetdata for each Topic
      const offSetData = await admin.fetchTopicOffsets(topic.name);
      const config = (configData.resources.length != 0) ? configData.resources[0].configEntries : [];
      topicsData.push({
        ...topic,
        config,
        offsets: offSetData,
      });
      // console.log("Pushed topic data to Topics");
    }

    response.Topics = topicsData;
    console.log('------ADDED topics to response');


    //GETTING CONSUMER GROUPS
    const listGroups = await admin.listGroups();
    //getting list of consumer group Ids
    const groupIds = listGroups.groups.map(group => group.groupId);
    console.log('Consumer Groups: ', groupIds);

    const groupsData = [];
    const describeGroupsResponse = await admin.describeGroups(groupIds);
    console.log('Consumer Groups Descriptions: ', describeGroupsResponse);
    const descGroups = describeGroupsResponse.groups;

    //for each group in array add to members and subscribedTopics List
    for (const group of descGroups) {
      const { groupId, protocol, state, members } = group;
      let membersId = [];
      const subscribedTopics = [];
      if (members.length > 0) {
        membersId = members.map(member => member.memberId);
        const memberAssignment = AssignerProtocol.MemberAssignment.decode(members[0].memberAssignment);
        for (const key in memberAssignment) {
          subscribedTopics.push(key);
        }
      }
      groupsData.push({
        groupId,
        protocol,
        state,
        members: membersId,
        subscribedTopics,
      });
      // console.log(`Pushed consumer group to Consumer Groups`);
    }

    response.ConsumerGroups = groupsData;
    console.log('------ADDED consumer groups to response');

    //return response as the response body
    props.params.metrics = response.Metrics;
    props.params.topics = response.Topics;
    props.params.consumerGroups = response.ConsumerGroups;
  } catch (err) {
    console.log('Error occurred in metricRouter getClusterInformation: ', err);
  }


  console.log(props.params);
  return (
    <div>
      {/* <Page params={params} metrics={metrics} /> */}
      {props.children}
    </div>
  );
};

export default layout;
