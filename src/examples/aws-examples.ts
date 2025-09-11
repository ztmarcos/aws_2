import { S3Helper, DynamoDBHelper, LambdaHelper, EC2Helper, validateAWSConfig } from '../utils/aws-helpers';

// Example usage of AWS services
export class AWSExamples {
  private s3Helper: S3Helper;
  private dynamoHelper: DynamoDBHelper;
  private lambdaHelper: LambdaHelper;
  private ec2Helper: EC2Helper;

  constructor(region: string = 'us-east-1') {
    this.s3Helper = new S3Helper(region);
    this.dynamoHelper = new DynamoDBHelper(region);
    this.lambdaHelper = new LambdaHelper(region);
    this.ec2Helper = new EC2Helper(region);
  }

  // S3 Examples
  async demonstrateS3Operations() {
    console.log('\n📦 S3 Operations Demo');
    console.log('-'.repeat(30));
    
    try {
      // List existing buckets
      const buckets = await this.s3Helper.listBuckets();
      console.log('Existing buckets:', buckets.Buckets?.map(b => b.Name));
      
      // Example: Create a new bucket (uncomment to use)
      // const newBucket = await this.s3Helper.createBucket('my-test-bucket-' + Date.now());
      // console.log('Created bucket:', newBucket.Location);
      
      // Example: Upload a file (uncomment to use)
      // const uploadResult = await this.s3Helper.uploadObject(
      //   'my-test-bucket',
      //   'test-file.txt',
      //   'Hello from AWS SDK!'
      // );
      // console.log('Upload result:', uploadResult.ETag);
      
    } catch (error) {
      console.error('S3 operation failed:', error);
    }
  }

  // DynamoDB Examples
  async demonstrateDynamoDBOperations() {
    console.log('\n🗄️ DynamoDB Operations Demo');
    console.log('-'.repeat(30));
    
    try {
      // List existing tables
      const tables = await this.dynamoHelper.listTables();
      console.log('Existing tables:', tables.TableNames);
      
      // Example: Create a new table (uncomment to use)
      // const tableResult = await this.dynamoHelper.createTable(
      //   'MyTestTable',
      //   [{ AttributeName: 'id', KeyType: 'HASH' }],
      //   [{ AttributeName: 'id', AttributeType: 'S' }]
      // );
      // console.log('Created table:', tableResult.TableDescription?.TableName);
      
      // Example: Add an item (uncomment to use)
      // const itemResult = await this.dynamoHelper.putItem('MyTestTable', {
      //   id: { S: 'test-id' },
      //   message: { S: 'Hello DynamoDB!' }
      // });
      // console.log('Added item:', itemResult);
      
    } catch (error) {
      console.error('DynamoDB operation failed:', error);
    }
  }

  // Lambda Examples
  async demonstrateLambdaOperations() {
    console.log('\n⚡ Lambda Operations Demo');
    console.log('-'.repeat(30));
    
    try {
      // List existing functions
      const functions = await this.lambdaHelper.listFunctions();
      console.log('Existing functions:', functions.Functions?.map(f => f.FunctionName));
      
      // Example: Create a function (uncomment to use)
      // const functionResult = await this.lambdaHelper.createFunction(
      //   'my-test-function',
      //   'arn:aws:iam::123456789012:role/lambda-execution-role',
      //   'index.handler',
      //   { ZipFile: Buffer.from('exports.handler = async (event) => { return { statusCode: 200, body: "Hello!" }; };') }
      // );
      // console.log('Created function:', functionResult.FunctionName);
      
      // Example: Invoke a function (uncomment to use)
      // const invokeResult = await this.lambdaHelper.invokeFunction('my-test-function', { test: 'data' });
      // console.log('Invoke result:', invokeResult.Payload);
      
    } catch (error) {
      console.error('Lambda operation failed:', error);
    }
  }

  // EC2 Examples
  async demonstrateEC2Operations() {
    console.log('\n🖥️ EC2 Operations Demo');
    console.log('-'.repeat(30));
    
    try {
      // List existing instances
      const instances = await this.ec2Helper.listInstances();
      const instanceList = instances.Reservations?.flatMap(reservation => 
        reservation.Instances?.map(instance => ({
          id: instance.InstanceId,
          state: instance.State?.Name,
          type: instance.InstanceType
        })) || []
      ) || [];
      console.log('Existing instances:', instanceList);
      
      // Example: Launch an instance (uncomment to use)
      // const instanceResult = await this.ec2Helper.launchInstance(
      //   'ami-0abcdef1234567890', // Amazon Linux 2 AMI
      //   't2.micro' as any, // InstanceType
      //   'my-key-pair'
      // );
      // console.log('Launched instance:', instanceResult.Instances?.[0]?.InstanceId);
      
      // Example: Terminate an instance (uncomment to use)
      // const terminateResult = await this.ec2Helper.terminateInstance('i-1234567890abcdef0');
      // console.log('Terminated instance:', terminateResult.TerminatingInstances?.[0]?.InstanceId);
      
    } catch (error) {
      console.error('EC2 operation failed:', error);
    }
  }

  // Run all examples
  async runAllExamples() {
    console.log('🚀 AWS SDK Examples');
    console.log('='.repeat(50));
    
    if (!validateAWSConfig()) {
      console.warn('⚠️ AWS credentials not configured. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
      console.log('Examples will show structure but may fail without proper credentials.');
    }
    
    await this.demonstrateS3Operations();
    await this.demonstrateDynamoDBOperations();
    await this.demonstrateLambdaOperations();
    await this.demonstrateEC2Operations();
    
    console.log('\n✅ All examples completed!');
  }
}
