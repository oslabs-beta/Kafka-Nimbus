/* eslint-disable @typescript-eslint/unbound-method */
import AWS from 'aws-sdk';
import * as checkService from '../service/checkClusterService';

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
      }),
      describeCluster: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          ClusterInfo: {
            State: 'ACTIVE'
          }
        })
      })
    }))
  }
})


describe('describeCluster', () => {
  let mockKafka: AWS.Kafka;
  beforeEach(() => {
    mockKafka = new AWS.Kafka();
    jest.clearAllMocks();
  })

  it('should return current kafka state', async () => {
    const kafkaArn = 'arn';
    const state = await checkService.describeCluster(mockKafka, kafkaArn);

    expect(state).toEqual('ACTIVE');
    expect(mockKafka.describeCluster).toHaveBeenCalledWith({ ClusterArn: kafkaArn })
  })

  it('should fail if no kafkaArn provided', async() => {
    const kafkaArn = 'arn';
    const error = 'kafkaArn not included in request'
    try {
      await checkService.describeCluster(mockKafka, kafkaArn);
    }
    catch (e) {
      expect(e).toEqual(error);
    }


  })
})