/* eslint-disable @typescript-eslint/unbound-method */
import AWS from 'aws-sdk';
import * as awsService from '../service/awsService';
// import { mocked } from 'jest-mock-extended';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({v4: jest.fn() }));

jest.mock('aws-sdk', () => {
  return {
    EC2: jest.fn(() => ({
      createSecurityGroup: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ GroupId: 'sg-12345' })
      }),
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

