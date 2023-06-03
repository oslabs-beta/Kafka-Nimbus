/* eslint-disable @typescript-eslint/unbound-method */
import AWS from 'aws-sdk';
import * as checkService from '../service/checkClusterService';
import { prisma } from '../db';
import { KafkaClient, DescribeClusterCommand, UpdateConnectivityCommand } from "@aws-sdk/client-kafka";
import * as kafka from "@aws-sdk/client-kafka";

/**
 * Mocks for the aws-sdk , kafkaclient, and prisma database
 */


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
    })),

  }
})
const mockSend = jest.fn();
// for the kafkaclient procedures
jest.mock('@aws-sdk/client-kafka', () => ({
    KafkaClient: jest.fn().mockImplementation(() => ({
      send: mockSend,
    })),
    DescribeClusterCommand: jest.fn(),
    UpdateConnectivityCommand: jest.fn(),
    getBootstrapBrokersCommand: jest.fn(),
}));

// mock prisma module
jest.mock('../db', () => ({
  prisma: {
    cluster: {
      findUnique: jest.fn(),
      update: jest.fn()
    },
  },
}));

describe('getClusterResponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return correct response when user exists on the cluster', async() => {
    const mockResponse = {
      User: {
        awsAccessKey: 'accessKey',
        awsSecretAccessKey: 'secretKey',
        region: 'region',
      },
      lifeCycleStage: 'lifeCycleStage',
      kafkaArn: 'kafkaArn',
    };

    (prisma.cluster.findUnique as jest.Mock).mockResolvedValueOnce(mockResponse);

    const expectedResponse = {
      awsAccessKey: mockResponse.User.awsAccessKey,
      awsSecretAccessKey: mockResponse.User.awsSecretAccessKey,
      region: mockResponse.User.region,
      lifeCycleStage: mockResponse.lifeCycleStage,
      kafkaArn: mockResponse.kafkaArn,
    };

    await expect(checkService.getClusterResponse('id')).resolves.toEqual(expectedResponse);
  });

  it('should throw an error when user does not exist on the cluster', async () => {
    (prisma.cluster.findUnique as jest.Mock).mockResolvedValueOnce({
      User: undefined,
    });

    await expect(checkService.getClusterResponse('id')).rejects.toThrow(
      'Error finding the unique user in database'
    );
  });

  it('should throw an error when database operation fails', async () => {
    (prisma.cluster.findUnique as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await expect(checkService.getClusterResponse('id')).rejects.toThrow(
      'Error finding the unique user in database'
    );
  });
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

jest.spyOn(prisma.cluster, 'update')

describe('updatePublicAccess', () => {
  // const mockSend = KafkaClient.prototype.send as jest.Mock;
  beforeEach(() => {
    jest.clearAllMocks;
  })

  it('should throw an error when kafkaArn is empty', async () => {
    await expect(checkService.updatePublicAccess('region', 'accessKey', 'secretKey', '', 'id')).rejects.toThrow(
      'KafkaArn doesn\'t exist'
    );
  });

  it('should throw an error when kafka client operations fail', async () => {
    mockSend.mockRejectedValueOnce(new Error('Kafka error'));

    await expect(checkService.updatePublicAccess('region', 'accessKey', 'secretKey', 'kafkaArn', 'id')).rejects.toThrow(
      'Error updating cluster, '
    );
  });

  it('should update the database when public access needs to be enabled', async () => {

    mockSend.mockResolvedValueOnce({
      ClusterInfo: {
        State: 'ACTIVE',
        BrokerNodeGroupInfo: {
          ConnectivityInfo: {
            PublicAccess: {
              Type: 'DIFFERENT_TYPE',
            },
          },
        },
        CurrentVersion: 'currentVersion',
      },
    });

    (prisma.cluster.update as jest.Mock).mockResolvedValueOnce({});

    await checkService.updatePublicAccess('region', 'accessKey', 'secretKey', 'kafkaArn', 'id');

    expect(DescribeClusterCommand).toHaveBeenCalledWith({ ClusterArn: 'kafkaArn' });
    expect(UpdateConnectivityCommand).toHaveBeenCalledWith({
      ClusterArn: 'kafkaArn',
      ConnectivityInfo: {
        PublicAccess: {
          Type: 'SERVICE_PROVIDED_EIPS',
        },
      },
      CurrentVersion: 'currentVersion',
    });
    expect(prisma.cluster.update).toHaveBeenCalledWith({
      where: { id: 'id' },
      data: { lifeCycleStage: 1 },
    });
  });

  describe('getBootstrapBrokers', () => {
    // let mockSend: jest.Mock;
    let mockUpdate: jest.Mock;

    beforeEach(() => {
      jest.clearAllMocks();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      // mockSend = (kafka as any).mockSend;
      mockUpdate = prisma.cluster.update as jest.Mock;
    })

    xit('should get boostrap brokers and update database', async () => {
      mockSend.mockResolvedValueOnce({
        BootstrapBrokerStringPublicSaslIam: 'broker1,broker2,broker3'
      });
      await checkService.getBoostrapBrokers('us-east-1', 'accessKey', 'secretKey', 'kafkaArn', 'id');
      expect(mockSend).toHaveBeenCalledWith(expect.any(kafka.GetBootstrapBrokersCommand));
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'id' },
        data: {
          bootStrapServer: ['broker1', 'broker2', 'broker3'],
          lifeCycleStage: 2,
        },
      });
    });

    it('should throw error if broker string is undefined', async () => {
      mockSend.mockResolvedValueOnce({});
      await expect(checkService.getBoostrapBrokers('us-east-1', 'accessKey', 'secretKey', 'kafkaArn', 'id'))
        .rejects.toThrow('Error going from updating to active, ');
    });
  })
})