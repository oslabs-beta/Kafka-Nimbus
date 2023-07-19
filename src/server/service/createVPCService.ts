import {
  KafkaClient,
  CreateConfigurationCommand
} from '@aws-sdk/client-kafka'

import { 
  EC2Client, 
  CreateVpcCommand, 
  CreateInternetGatewayCommand,
  AttachInternetGatewayCommand,
  CreateSubnetCommand,
  DescribeRouteTablesCommand,
  CreateRouteCommand } from '@aws-sdk/client-ec2';

import { v4 } from 'uuid';
import fs from 'fs';



export const createVPC = async(client: EC2Client) => {

  // create the vpc
  try {
    const input = {
      CidrBlock: '10.0.0.0/16',
    }
    const command = new CreateVpcCommand(input);
    const response = await client.send(command);
    if (response === undefined || response.Vpc?.VpcId === undefined) {
      throw new Error('Creation failed');
    }
    return response.Vpc.VpcId;
  }
  catch (err) {
    throw new Error('Failed to create VPC');
  }
}

// creates an internet gateway
export const createIGW = async (client: EC2Client) => {
  try {
    const command = new CreateInternetGatewayCommand({});
    const response = await client.send(command);
    if (response === undefined || response.InternetGateway?.InternetGatewayId === undefined) {
      throw new Error('IGW creation failed');
    }
    return response.InternetGateway?.InternetGatewayId;
  }
  catch (err) {
    throw new Error('Failed to create IGW');
  }
}

export const connectIGWandVPC = async (client: EC2Client, vpcId: string, igwId: string) => {
  try {
    const input = {
      InternetGatewayId: igwId,
      VpcId: vpcId
    }
    const command = new AttachInternetGatewayCommand(input);
    await client.send(command);
    return 'success';
  }
  catch (err){
    throw new Error('Failed to attach IGW to VPC');
  }
}

// create subnets
// creates 3 subnets based on the region
export const createSubnets = async (client: EC2Client, vpcId: string, region: string) => {
  try {
    // creates the inputs
    const input1 = {
      CidrBlock: '10.0.0.0/24',
      VpcId: vpcId,
      AvailabilityZone: `${region}a`
    };
    const input2 = {
      CidrBlock: '10.0.1.0/24',
      VpcId: vpcId,
      AvailabilityZone: `${region}b`
    };
    const input3 = {
      CidrBlock: '10.0.2.0/24',
      VpcId: vpcId,
      AvailabilityZone: `${region}c`
    };
    // instantiate the commands
    const command1 = new CreateSubnetCommand(input1);
    const command2 = new CreateSubnetCommand(input2);
    const command3 = new CreateSubnetCommand(input3);
    const responses = await Promise.all([
      client.send(command1),
      client.send(command2),
      client.send(command3),
    ]);
    const [response1, response2, response3] = responses;
    if (response1 === undefined || response2 === undefined || response3 === undefined) {
      throw new Error('SubnetId undefined, failed to create')
    }
    const subnet1Id = response1.Subnet?.SubnetId;
    const subnet2Id = response2.Subnet?.SubnetId;
    const subnet3Id = response3.Subnet?.SubnetId;
    if (subnet1Id === undefined || subnet2Id === undefined || subnet3Id === undefined) {
      throw new Error('SubnetId undefined, failed to create');
    }
    // returns the subnets as an array of their ids
    return [subnet1Id, subnet2Id, subnet3Id];
  }
  catch (err) {
    throw new Error('Failed to create subnets');
  }
}

// create route tables
export const createRouteTables = async(client: EC2Client, vpcId: string) => {
  try {
    const input = {
      Filters: [
        {
          Name: 'vpc-id',
          Values: [vpcId]
        }
      ]
    }
    const command = new DescribeRouteTablesCommand(input);
    const response = await client.send(command);
    if (!response || response.RouteTables === undefined || response.RouteTables?.length === 0) {
      throw new Error('Failed to create route table');
    }
    const routeTableId = response.RouteTables[0]?.RouteTableId;
    if (!routeTableId) {
      throw new Error('Route table failed to create');
    }
    return routeTableId;
  }
  catch (err) {
    throw new Error('Failed to create route table');
  }
}

// add ec2 route to igw
export const createRouteIGW = async (client: EC2Client, routeTableId: string, igwId: string) => {
  try {
    const input = {
      DestinationCidrBlock: '0.0.0.0/0',
      GatewayId: igwId,
      RouteTableId: routeTableId,
    }
    const command = new CreateRouteCommand(input);
    await client.send(command);
    // no need to check response, bc will just throw an error
  }
  catch (err) {
    throw new Error('Failed to add igw to route table');
  }
}

// create custom cluster config
export const createClusterConfig = async (client: KafkaClient) => {
  try {
    // file system read might not be working properly, could 
    // be a source of error if this function fails
    const ServerProperties = fs.readFileSync('src/server/api/routers/server.properties');
    const configParams = {
      Description: 'Configuration settings for custom cluster',
      KafkaVersion: ['2.8.1'],
      Name: 'Kafka-NimbusConfiguration' + v4(),
      ServerProperties: ServerProperties,
    };
    const configData = await client.send(
      new CreateConfigurationCommand(configParams)
    );
    const configArn = configData.Arn;
    if (configArn === undefined) {
      throw new Error("ConfigARN doesn't exist on client");
    }
    return configArn;
  }
  catch (err){
    throw new Error('Failed to create custom cluster config')
  }
}
