
import { EC2Client, CreateVpcCommand } from '@aws-sdk/client-ec2';



export const createVPC = async(client: EC2Client) => {
  // declare the ec2 client

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
    return response;
  }
  catch (err) {
    throw new Error('Failed to create VPC');
  }
}