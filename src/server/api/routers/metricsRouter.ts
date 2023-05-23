/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Kafka } from "kafkajs";
import { env } from "~/env.mjs";
import { prisma } from '../../db'
import { KafkaClient, DescribeClusterCommand } from '@aws-sdk/client-kafka';

const brokers: string[] = ['b-1-public.prometheus4acae81144d6.0my001.c2.kafka.us-east-2.amazonaws.com:9196', 'b-2-public.prometheus4acae81144d6.0my001.c2.kafka.us-east-2.amazonaws.com:9196']
const region = 'us-east-2';
//jackson/clusterRouter
//getting broker/boostrap public endpoints
//username: user's id in prisma database (input.id)
//password: kafka-nimbus
// const user_id: string | undefined = ; //get user id
const request = { body: { cluster_id: 'cluster id' } };

const client = new KafkaClient(
  { region }
);

const kafka: Kafka = new Kafka({
  clientId: 'my-app',
  brokers,
  ssl: true,
  sasl: {
    mechanism: 'scram-sha-512',
    username: process.env.AWS_SASL_USERNAME ? process.env.AWS_SASL_USERNAME : "",
    password: 'kafka-nimbus',
  },
});

console.log('Successfully connected to cluster');
const admin = kafka.admin();

const runAdmin = async (): Promise<void> => {
  try {
    await admin.connect();
    console.log('Admin has connected');
    const clusterData = await admin.describeCluster();
    console.log('ClusterData: ', clusterData);
    await admin.disconnect();
    console.log('Admin has disconnected');
  } catch (err) {
    console.error('Error in admin: ', err);
  }
}

const clusterData = async (): Promise<void> => {
  try {
    const clusterResponse = await prisma.cluster.findUnique({
      where: {
        id: request.body.cluster_id
      }
    });

    const input = { // DescribeClusterRequest
      ClusterArn: clusterResponse?.kafkaArn,
    };

    const command = new DescribeClusterCommand(input);
    const response = await client.send(command);
    //response.ClusterName, response.CreationTime, response.CurrentBrokerSoftwareInfo.KafkaVersion, response.InstanceType,
    //response.NumberOfBrokerNodes, response.State

  } catch (err) {
    throw new Error('Could not find cluster inside DB');
  }


};



const producer = kafka.producer();

const runProducer = async (): Promise<void> => {
  try {
    await producer.connect();
    console.log('Producer has connected');

    // Produce messages or perform other operations here
    await producer.disconnect();
    console.log('Producer has disconnected');
  } catch (err) {
    console.error('Error in producer:', err);
  }
};

runAdmin().then(() =>
  console.log('Successfully completed admin run')
).catch((err) =>
  console.log('Error occurred when running admin: ', err)
);

runProducer().then(() =>
  console.log('Successfully completed producer run')
).catch((err) =>
  console.log('Error occurred when running producer: ', err)
);