import { AWSExamples } from './examples/aws-examples';
import { getRegionFromEnv, validateAWSConfig } from './utils/aws-helpers';

// Main execution
async function main() {
  console.log('🚀 AWS TypeScript Project Started');
  console.log(`📍 Region: ${getRegionFromEnv()}`);
  console.log('='.repeat(50));
  
  if (!validateAWSConfig()) {
    console.warn('⚠️ AWS credentials not configured.');
    console.log('Set the following environment variables:');
    console.log('- AWS_ACCESS_KEY_ID');
    console.log('- AWS_SECRET_ACCESS_KEY');
    console.log('- AWS_REGION (optional, defaults to us-east-1)');
    console.log('');
    console.log('You can also use AWS CLI: aws configure');
    console.log('='.repeat(50));
  }
  
  // Run AWS examples
  const examples = new AWSExamples();
  await examples.runAllExamples();
}

// Run the main function
main().catch(console.error);
