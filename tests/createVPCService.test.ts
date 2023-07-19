/**
 * These mocks are written using the v3 version of the sdk
 */

import { 
  EC2Client, 
  CreateVpcCommand, 
  CreateInternetGatewayCommand,
  AttachInternetGatewayCommand,
  CreateSubnetCommand,
  DescribeRouteTablesCommand,
} from '@aws-sdk/client-ec2';

import { 
  createVPC, 
  createIGW,
  connectIGWandVPC,
  createSubnets,
  createRouteTables
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
    const region = 'us-east'    

    afterEach(() => {
      mockClient(EC2Client).reset();
    })

    xit('Successfully creates 3 subnets', async () => {
      const subnetIds = ['subnet-1', 'subnet-2', 'subnet-3'];
      // make a mock call for all three subnets
      subnetIds.forEach((subnetId, i) => {
        const input = {
          CidrBlock: `10.0.${i}.0/24`,
          VpcId: vpcId,
          AvailabilityZone: `${region}${String.fromCharCode(97 + i)}`, // a, b, c
        };
        const output = { Subnet: { SubnetId: subnetId}};
        mockClient(EC2Client)
         .on(CreateSubnetCommand, input)
         .resolves(output)
        
        console.log(input)
      });
      const result = await createSubnets(new EC2Client({}), vpcId, region);
      expect(result).toEqual(subnetIds);
    });
    
    xit('should throw an error when subnet ID is undefined', async () => {
      const subnetIds = ['subnet-1', undefined, 'subnet-3'];

      subnetIds.forEach((subnetId, i) => {
        const input = {
          CidrBlock: `10.0.${i}.0/24`,
          VpcId: vpcId,
          AvailabilityZone: `${region}${String.fromCharCode(97 + i)}`, // a, b, c
        };
        const output = subnetId ? { Subnet: { SubnetId: subnetId }} : {};
        mockClient(EC2Client).on(CreateSubnetCommand, input).resolves(output);
      });

      await expect(createSubnets(new EC2Client({}), vpcId, region))
        .rejects.toThrow('SubnetId undefined, failed to create');
      });

    it('should throw error when subnet creation fails', async () => {
      mockClient(EC2Client)
      .on(CreateSubnetCommand)
      .rejects(new Error('Some failure'));
  
      await expect(createSubnets(new EC2Client({}), vpcId, region)).rejects.toThrow('Failed to create subnets');
    });
  })

  describe('createRouteTable', () => {
    const vpcId = 'vpc-1234abcd';

    afterEach(() => {
      mockClient(EC2Client).reset();
    })

    it('successfully creates a route table', async () => {
      const mockResponse = { RouteTables: [{ RouteTableId: 'rtb-1'}]}
      mockClient(EC2Client)
        .on(DescribeRouteTablesCommand, {
          Filters: [{ 
            Name: 'vpc-id', 
            Values: [vpcId] 
          }],
        })
        .resolves(mockResponse);

        const result = await createRouteTables(new EC2Client({}), vpcId);
        expect(result).toEqual('rtb-1')
    })

    it('throws an error when no route tables found', async() => {
      const mockResponse = { RouteTables: [] };

      mockClient(EC2Client)
        .on(DescribeRouteTablesCommand, {
          Filters: [{ Name: 'vpc-id', Values: [vpcId] }],
        })
        .resolves(mockResponse);

      await expect(createRouteTables(new EC2Client({}), vpcId)).rejects.toThrow('Failed to create route table');
    });

    it('Throws error when RouteTableId is not defined', async () => {
      const mockResponse = { RouteTables: [{}] };
  
      mockClient(EC2Client)
        .on(DescribeRouteTablesCommand, {
          Filters: [{ Name: 'vpc-id', Values: [vpcId] }],
        })
        .resolves(mockResponse);
  
      await expect(createRouteTables(new EC2Client({}), vpcId)).rejects.toThrow('Failed to create route table');
    });
  })
})
