
import { 
  EC2Client, 
  CreateVpcCommand, 
  CreateInternetGatewayCommand,
  AttachInternetGatewayCommand } from '@aws-sdk/client-ec2';



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
    return;
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
    const response = await client.send(command);
    return;
  }
  catch (err){
    throw new Error('Failed to attach IGW to VPC');
  }
}

// create subnets

// create route tables

// add ec2 route to igw

// create custom cluster config

// store info in db
