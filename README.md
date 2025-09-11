# AWS TypeScript Project

A comprehensive TypeScript project with AWS SDK v3 integration for cloud development.

## Features

- **TypeScript** with modern configuration
- **AWS SDK v3** with modular clients
- **Helper classes** for common AWS operations
- **Example implementations** for S3, DynamoDB, Lambda, and EC2
- **Development tools** with hot reload and build scripts

## Prerequisites

- Node.js (v16 or higher)
- AWS Account with appropriate permissions
- AWS CLI configured (optional but recommended)

## Installation

```bash
npm install
```

## AWS Configuration

Set up your AWS credentials using one of these methods:

### Environment Variables
```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1
```

### AWS CLI
```bash
aws configure
```

## Usage

### Development Mode
```bash
npm run dev
```

### Build and Run
```bash
npm run build
npm start
```

### Watch Mode (Auto-restart)
```bash
npm run watch
```

## Project Structure

```
src/
├── index.ts              # Main entry point
├── utils/
│   └── aws-helpers.ts    # AWS helper classes
└── examples/
    └── aws-examples.ts   # Example implementations
```

## Available AWS Services

### S3 (Simple Storage Service)
- List buckets
- Create buckets
- Upload objects

### DynamoDB (NoSQL Database)
- List tables
- Create tables
- Add items

### Lambda (Serverless Functions)
- List functions
- Create functions
- Invoke functions

### EC2 (Elastic Compute Cloud)
- List instances
- Launch instances
- Terminate instances

## Example Usage

```typescript
import { S3Helper } from './utils/aws-helpers';

const s3Helper = new S3Helper('us-east-1');

// List all buckets
const buckets = await s3Helper.listBuckets();
console.log(buckets);

// Create a new bucket
const newBucket = await s3Helper.createBucket('my-new-bucket');
console.log(newBucket);
```

## Scripts

- `npm run dev` - Run in development mode with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled JavaScript
- `npm run watch` - Auto-restart on file changes

## Dependencies

### Development
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions
- `ts-node` - Run TypeScript directly
- `nodemon` - Auto-restart on changes

### AWS SDK
- `@aws-sdk/client-s3` - S3 storage service
- `@aws-sdk/client-dynamodb` - DynamoDB database
- `@aws-sdk/client-lambda` - Lambda functions
- `@aws-sdk/client-ec2` - EC2 compute service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC
