import { S3Client, ListBucketsCommand, CreateBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, ListTablesCommand, CreateTableCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { LambdaClient, ListFunctionsCommand, CreateFunctionCommand, InvokeCommand } from '@aws-sdk/client-lambda';
import { EC2Client, DescribeInstancesCommand, RunInstancesCommand, TerminateInstancesCommand, _InstanceType } from '@aws-sdk/client-ec2';

// AWS Helper Classes
export class S3Helper {
  private client: S3Client;

  constructor(region: string = 'us-east-1') {
    this.client = new S3Client({ region });
  }

  async listBuckets() {
    const command = new ListBucketsCommand({});
    return await this.client.send(command);
  }

  async createBucket(bucketName: string) {
    const command = new CreateBucketCommand({ Bucket: bucketName });
    return await this.client.send(command);
  }

  async uploadObject(bucketName: string, key: string, body: string) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body
    });
    return await this.client.send(command);
  }
}

export class DynamoDBHelper {
  public client: DynamoDBClient;

  constructor(region: string = 'us-east-1') {
    this.client = new DynamoDBClient({ region });
  }

  async listTables() {
    const command = new ListTablesCommand({});
    return await this.client.send(command);
  }

  async createTable(tableName: string, keySchema: any, attributeDefinitions: any) {
    const command = new CreateTableCommand({
      TableName: tableName,
      KeySchema: keySchema,
      AttributeDefinitions: attributeDefinitions,
      BillingMode: 'PAY_PER_REQUEST'
    });
    return await this.client.send(command);
  }

  async putItem(tableName: string, item: any) {
    const command = new PutItemCommand({
      TableName: tableName,
      Item: item
    });
    return await this.client.send(command);
  }
}

export class LambdaHelper {
  private client: LambdaClient;

  constructor(region: string = 'us-east-1') {
    this.client = new LambdaClient({ region });
  }

  async listFunctions() {
    const command = new ListFunctionsCommand({});
    return await this.client.send(command);
  }

  async createFunction(functionName: string, role: string, handler: string, code: any) {
    const command = new CreateFunctionCommand({
      FunctionName: functionName,
      Runtime: 'nodejs18.x',
      Role: role,
      Handler: handler,
      Code: code
    });
    return await this.client.send(command);
  }

  async invokeFunction(functionName: string, payload?: any) {
    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: payload ? JSON.stringify(payload) : undefined
    });
    return await this.client.send(command);
  }
}

export class EC2Helper {
  private client: EC2Client;

  constructor(region: string = 'us-east-1') {
    this.client = new EC2Client({ region });
  }

  async listInstances() {
    const command = new DescribeInstancesCommand({});
    return await this.client.send(command);
  }

  async launchInstance(imageId: string, instanceType: _InstanceType, keyName?: string) {
    const command = new RunInstancesCommand({
      ImageId: imageId,
      InstanceType: instanceType,
      MinCount: 1,
      MaxCount: 1,
      KeyName: keyName
    });
    return await this.client.send(command);
  }

  async terminateInstance(instanceId: string) {
    const command = new TerminateInstancesCommand({
      InstanceIds: [instanceId]
    });
    return await this.client.send(command);
  }
}

// Utility functions
export function formatAWSResponse(response: any): string {
  return JSON.stringify(response, null, 2);
}

export function getRegionFromEnv(): string {
  return process.env.AWS_REGION || 'us-east-1';
}

export function validateAWSConfig(): boolean {
  return !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
}
