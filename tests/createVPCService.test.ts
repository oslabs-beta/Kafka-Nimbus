/**
 * These mocks are written using the v3 version of the sdk
 */

import { 
  EC2Client, 
  CreateVpcCommand,
} from '@aws-sdk/client-ec2'

import { createVPC } from '../src/server/service/createVPCService'
import { mockClient } from 'aws-sdk-client-mock'

describe("createVPC", () => {
  const ec2Mock = mockClient(EC2Client);
  const vpcId = 'vpc-1234abcd';

  afterEach(() => {
    ec2Mock.reset();
  });

  it("Creates VPC successfully", async () => {
    ec2Mock
      .on(CreateVpcCommand, { CidrBlock: '10.0.0.0/16' })
      .resolves({
        Vpc: {
          VpcId: vpcId,
        },
      });

    const result = await createVPC(new EC2Client({}));
    expect(result).toEqual(vpcId);
  })

  it("Throws an error when VPC creation fails", async () => {
    ec2Mock 
      .on(CreateVpcCommand, { CidrBlock: '10.0.0.0/16' })
      .resolves({});

    await expect(createVPC(new EC2Client({}))).rejects.toThrow('Failed to create VPC');
  })
})