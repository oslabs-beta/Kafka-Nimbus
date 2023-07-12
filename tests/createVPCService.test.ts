/**
 * These mocks are written using the v3 version of the sdk
 */

import { 
  EC2Client, 
  CreateVpcCommand, 
  CreateInternetGatewayCommand,
  AttachInternetGatewayCommand,
  CreateSubnetCommand,
} from '@aws-sdk/client-ec2';

import { 
  createVPC, 
  createIGW,
  connectIGWandVPC,
  createSubnets,
} from '../src/server/service/createVPCService'

import { mockClient } from 'aws-sdk-client-mock'
import { connect } from 'http2';

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

  describe("connectIGWandVPC", () => {
    const igwId = 'igw-1234abcd';
    const vpcId = 'vpc-1234abcd';

    afterEach(() => {
      mockClient(EC2Client).reset();
    });
    
    it('Succefully attaches the IGW to VPC', async () => {
      mockClient(EC2Client)
        .on(AttachInternetGatewayCommand, {
          InternetGatewayId: igwId,
          VpcId: vpcId
        })
        .resolves('success')

      const result = await connectIGWandVPC(new EC2Client({}), vpcId, igwId);
      expect(result).toEqual('success');
    });
  })

  describe('createSubnets', () => {
    const vpcId = 'vpc-1234abcd';
    const region = 'us-east1'
    const subnetIdArr = ['sub-1','sub-1','sub-1']

    afterEach(() => {
      mockClient(EC2Client).reset();
    })

    xit('Successfully creates 3 subnets', async () => {
      mockClient(EC2Client)
      .on(CreateSubnetCommand, {
        CidrBlock: '10.0.0.0/24',
        VpcId: vpcId,
        AvailabilityZone: `us-east-1`
      })
      .resolves(subnetIdArr[0])

      const result = await createSubnets(new EC2Client({}), vpcId, region);
      expect(result).toEqual(subnetIdArr);
    })
  })
})
