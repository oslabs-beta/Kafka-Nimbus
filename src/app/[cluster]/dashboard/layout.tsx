import React from 'react';
import { KafkaClient, DescribeClusterCommand, type DescribeClusterCommandInput, type DescribeClusterCommandOutput } from '@aws-sdk/client-kafka';
import { Kafka, logLevel, AssignerProtocol, type ITopicMetadata, ConfigResourceTypes, type Admin, type DescribeConfigResponse } from 'kafkajs';
import { createMechanism } from '@jm18457/kafkajs-msk-iam-authentication-mechanism';
import { prisma } from '~/server/db';

export type metrics = {
  ClusterName: string;
  CreationTimeString: string;
  KafkaVersion: string;
  NumberOfBrokerNodes: number;
  State: string;
};

export type partitions = {
  partitionErrorCode: number,
  partitionId: number,
  leader: number,
  isr: any[],
  offlineReplicas: any[]
}

export type topics = {
  name: string,
  partitions: partitions[]
};

export type consumerGroups = {
  groupId: string,
  protocol: string,
  state: string,
  members: string[],
  subscribedTopics: string[]
}

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

    const bootStrapServer = clusterInfo.bootStrapServer;
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


    //GETTING METRICS

    //Cluster Dashboard Information from MSK
    const commInput: DescribeClusterCommandInput = {
      ClusterArn: clusterInfo?.kafkaArn ? clusterInfo?.kafkaArn : "",
    };

    const command = new DescribeClusterCommand(commInput);
    const descClusterResponse: DescribeClusterCommandOutput = await client.send(command);
    const cluster = descClusterResponse.ClusterInfo;
    if (!cluster) throw new Error('Error: MSK Cluster does not have info');
    const { ClusterName, CreationTime, CurrentBrokerSoftwareInfo, NumberOfBrokerNodes, State } = cluster;

    response.Metrics = {
      ClusterName,
      CreationTimeString: CreationTime?.toLocaleDateString(),
      KafkaVersion: CurrentBrokerSoftwareInfo?.KafkaVersion,
      NumberOfBrokerNodes,
      State,
      bootStrapServer
    };
    console.log('------ADDED metrics to response');


    //GETTING TOPICS
    const admin: Admin = kafka.admin();

    const fetchTopicMetaResponse = await admin.fetchTopicMetadata();
    if (!fetchTopicMetaResponse) throw new Error('Error: No topics data received from KJS client');

    //Helper function to get Topic config information
    const descTopicConfig = async function (name: string): Promise<DescribeConfigResponse> {
      return new Promise(async (resolve, reject) => {
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
          resolve(responseConfig)
        } catch (err) {
          reject(err);
        }
      });

    }

    //Processing each topic's data and storing it in an array topicsData

    const kTopicsData: ITopicMetadata[] = fetchTopicMetaResponse.topics;

    const topicsData: any[] = [];
    for (const topic of kTopicsData) {

      //add config description to topic
      const configData = await descTopicConfig(topic.name);

      //get offsetdata for each Topic
      const offSetData = await admin.fetchTopicOffsets(topic.name);
      if (configData != undefined) {
        const config = (configData?.resources?.length != 0) ? configData?.resources[0]?.configEntries : [];
        topicsData.push({
          ...topic,
          config,
          offsets: offSetData,
        });
      }
    }

    response.Topics = topicsData;
    console.log('------ADDED topics to response');


    //GETTING CONSUMER GROUPS
    const listGroups = await admin.listGroups();
    //getting list of consumer group Ids
    const groupIds = listGroups.groups.map(group => group.groupId);

    const groupsData: any[] = [];
    const describeGroupsResponse = await admin.describeGroups(groupIds);
    const descGroups = describeGroupsResponse.groups;

    //for each group in array add to members and subscribedTopics List
    for (const group of descGroups) {
      const { groupId, protocol, state, members } = group;
      let membersId: string[] = [];
      const subscribedTopics: string[] = [];
      if (members.length > 0) {
        membersId = members.map(member => member.memberId);
        if (members[0] !== undefined) {
          const memberAssignment = AssignerProtocol.MemberAssignment.decode(members[0].memberAssignment);
          for (const key in memberAssignment) {
            subscribedTopics.push(key);
          }
        }
      }
      groupsData.push({
        groupId,
        protocol,
        state,
        members: membersId,
        subscribedTopics,
      });
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



  return (
    <div>
      {props.children}
    </div>
  );
};

export default layout;
