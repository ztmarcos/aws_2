import { S3Helper, DynamoDBHelper } from '../utils/aws-helpers';

async function setupJournal() {
  console.log('🚀 Configurando Journal de una vez por todas...');
  
  const s3Helper = new S3Helper();
  const dynamoHelper = new DynamoDBHelper();
  
  const bucketName = 'bumteka-journal-2024';
  const tableName = 'JournalEntries';
  
  try {
    // Crear bucket S3
    console.log('📦 Creando bucket S3...');
    try {
      await s3Helper.createBucket(bucketName);
      console.log(`✅ Bucket S3 creado: ${bucketName}`);
    } catch (error: any) {
      if (error.name === 'BucketAlreadyExists') {
        console.log(`✅ Bucket S3 ya existe: ${bucketName}`);
      } else {
        throw error;
      }
    }
    
    // Crear tabla DynamoDB
    console.log('🗄️ Creando tabla DynamoDB...');
    try {
      await dynamoHelper.createTable(
        tableName,
        [{ AttributeName: 'id', KeyType: 'HASH' }],
        [{ AttributeName: 'id', AttributeType: 'S' }]
      );
      console.log(`✅ Tabla DynamoDB creada: ${tableName}`);
    } catch (error: any) {
      if (error.name === 'ResourceInUseException') {
        console.log(`✅ Tabla DynamoDB ya existe: ${tableName}`);
      } else {
        throw error;
      }
    }
    
    console.log('🎉 ¡Journal configurado exitosamente!');
    console.log('📋 Ahora puedes:');
    console.log('   1. Crear entradas');
    console.log('   2. Ver entradas');
    console.log('   3. Buscar por fecha y tags');
    
  } catch (error) {
    console.error('❌ Error configurando journal:', error);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  setupJournal();
}

export { setupJournal };
