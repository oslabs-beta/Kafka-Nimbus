import AWS from 'aws-sdk';
import { v4 } from 'uuid';

// creates security group for the kafka cluster
export const createSecurityGroup = async (ec2: AWS.EC2, vpcId: string) => {
  const randString: string = v4();

  const createSecurityGroupParams = {
    Description: 'Security group for MSK Cluster',
    GroupName: 'MSKSecurityGroup' + randString,
    VpcId: vpcId    
  }
  if (vpcId === '' ) {
    throw new Error('VPC Id doesn\'t exist');
  }

  // security group for the cluster
  try {
    const createSecurityGroupData = await ec2.createSecurityGroup(createSecurityGroupParams).promise();
    let groupId = createSecurityGroupData?.GroupId;
    if (groupId === undefined) groupId = '';
    return groupId;
  }
  catch(error) {
    throw new Error('Failed to create security group');
  }
}

// authorizes the ips that the security group lets in
export const authorizeSecurityGroupIngress = async (ec2: AWS.EC2, groupId: string) => {
  const authorizeSecurityGroupParams = {
    GroupId: groupId,
    IpPermissions: [
      {
        IpProtocol: 'tcp',
        FromPort: 0,
        ToPort: 65535,
        IpRanges: [{ CidrIp: '0.0.0.0/0' }] // all access
      }
    ]
  }
  await ec2.authorizeSecurityGroupIngress(authorizeSecurityGroupParams).promise();
}

// spins up kafka cluster
export const createKafkaCluster = async (kafka: AWS.Kafka, kafkaParams: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const kafkaData = await kafka.createCluster(kafkaParams).promise()
  if (!kafkaData?.ClusterArn) {
    throw new Error('Error creating the msk cluster');
  }
  const kafkaArn: string = kafkaData.ClusterArn;
  return kafkaArn;
}