/* eslint-disable @typescript-eslint/unbound-method */
import AWS from 'aws-sdk';
import * as awsService from '../service/createClusterService';
// import { mocked } from 'jest-mock-extended';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({v4: jest.fn() }));

jest.mock('aws-sdk', () => {
  return {
    EC2: jest.fn(() => ({
      createSecurityGroup: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ GroupId: 'sg-12345' })
      }),
      authorizeSecurityGroupIngress: jest.fn().mockReturnValue({
        promise: jest.fn()
      })
    })),
    Kafka: jest.fn(() => ({
      createCluster: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ ClusterArn: 'arn:aws:kafka:us-east-2:0905' })
      })
    }))
  };
});

describe('createSecurityGroup',() => {
  let mockEC2: AWS.EC2;

  beforeEach(() => {
    mockEC2 = new AWS.EC2();
    jest.clearAllMocks();
  });

  it('Should create a new security group', async () => {
    const vpcId = 'vpc-12345';
    const randomString = 'randomString';
    // we have to tell typescript that uuidv4 is a function we are mocking
    (uuidv4 as jest.Mock).mockReturnValue(randomString);
    const groupId = await awsService.createSecurityGroup(mockEC2, vpcId);
    // mocks a call to the ec2 create security group function
    expect(mockEC2.createSecurityGroup).toHaveBeenCalledWith({
      Description: 'Security group for MSK Cluster',
      GroupName: 'MSKSecurityGroup' + randomString,
      VpcId: vpcId
    });
    expect(groupId).toEqual('sg-12345');
  }),

  it('Should fail to create a new security group when not given vpc', async () => {
    const error = new Error('VPC Id doesn\'t exist');
    const vpcId = '';
    const randomString = 'randomString';

    (uuidv4 as jest.Mock).mockReturnValue(randomString);
    try {
      await awsService.createSecurityGroup(mockEC2, vpcId);
    }
    catch(e) {
      expect(e).toEqual(error);
    }
    expect(mockEC2.createSecurityGroup).toBeCalledTimes(0);
  })
})

describe('authorizeSecurityGroupIngress', () => {
  let mockEC2: AWS.EC2;

  beforeEach(() => {
    mockEC2 = new AWS.EC2();
    jest.clearAllMocks();
  });

  it('Should authorize securit group ingress with correct parameters', async () => {
    const groupId = 'sg-12345';
    await awsService.authorizeSecurityGroupIngress(mockEC2, groupId);

    expect(mockEC2.authorizeSecurityGroupIngress).toHaveBeenCalledWith({
      GroupId: groupId,
      IpPermissions: [
        {
          IpProtocol: 'tcp',
          FromPort: 0,
          ToPort: 65535,
          IpRanges: [{ CidrIp: '0.0.0.0/0' }] // all access
        }
      ]
    })
  }),

  it('Should fail if groupId does not exist', async () => {
    const groupId = '';
    const error = new Error('Error, groupId does not exist')
    try {
      await awsService.authorizeSecurityGroupIngress(mockEC2, groupId);
    }
    catch (e) {
      expect(e).toEqual(error);
    }
    expect(mockEC2.authorizeSecurityGroupIngress).toBeCalledTimes(0);
  })
})

describe('createKafkaCluster', () => {
  let mockKafka: AWS.Kafka;

  beforeEach(() => {
    mockKafka = new AWS.Kafka();
    jest.clearAllMocks();
  });

  // only test we can really do is seeing that it spins up the cluster 
  // successfully
  it('Should call create cluster successfully', async () => {
    const kafkaParams = {test: 'test-param'};
    const clusterARN  = await awsService.createKafkaCluster(mockKafka, kafkaParams);

    expect(mockKafka.createCluster).toHaveBeenCalledWith({
      test: 'test-param'
    })
    expect(clusterARN).toEqual('arn:aws:kafka:us-east-2:0905')
  })
})

