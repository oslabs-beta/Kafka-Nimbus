const AWS = {
  config: {
    update: jest.fn()
  },
  EC2: jest.fn().mockReturnValue({
    createSecurityGroup: jest.fn().mockReturnThis(),
    authorizeSecurityGroupIngress: jest.fn().mockReturnThis(),
    promise: jest.fn().mockResolvedValue({ GroupId: 'testGroupId' })
  }),
  Kafka: jest.fn().mockReturnValue({
    createCluster: jest.fn().mockReturnThis(),
    promise: jest.fn().mockResolvedValue({ ClusterArn: 'testArn' })
  })
}
module.exports = AWS;