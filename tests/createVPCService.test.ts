/**
 * These mocks are written using the v3 version of the sdk
 */

import { 
  EC2Client, 
  CreateVpcCommand, 
  CreateInternetGatewayCommand,
} from '@aws-sdk/client-ec2';

import { 
  createVPC, 
  createIGW,
} from '../src/server/service/createVPCService'

import { mockClient } from 'aws-sdk-client-mock'

describe("Tests for the createVPC route", () => {
  describe("createVPC", () => {
    const vpcId = 'vpc-1234abcd';
  
    afterEach(() => {
      mockClient(EC2Client).reset();
    });
  
    it("Creates VPC successfully", async () => {
      mockClient(EC2Client)
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
      mockClient(EC2Client) 
        .on(CreateVpcCommand, { CidrBlock: '10.0.0.0/16' })
        .resolves({});
  
      await expect(createVPC(new EC2Client({}))).rejects.toThrow('Failed to create VPC');
    })
  })
  
  describe("createIGW", () => {
    const igwId = "igw-1234abcd";
  
    afterEach(() => {
      mockClient(EC2Client).reset();
    });
  
    it("creates an IGW successfully", async () => {
      mockClient(EC2Client)
        .on(CreateInternetGatewayCommand, {})
        .resolves({
          InternetGateway: {
            InternetGatewayId: igwId,
          },
        });
  
      const result = await createIGW(new EC2Client({}));
      expect(result).toEqual(igwId);
    });
  
    it("throws an error when IGW creation fails", async () => {
      mockClient(EC2Client)
        .on(CreateInternetGatewayCommand, {})
        .resolves({});
  
      await expect(createIGW(new EC2Client({}))).rejects.toThrow('Failed to create IGW');
    });
  });
})
