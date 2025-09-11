import { S3Helper, DynamoDBHelper } from '../utils/aws-helpers';

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export class JournalManager {
  private s3Helper: S3Helper;
  private dynamoHelper: DynamoDBHelper;
  private bucketName: string;
  private tableName: string;

  constructor(region: string = 'us-east-1') {
    this.s3Helper = new S3Helper(region);
    this.dynamoHelper = new DynamoDBHelper(region);
    this.bucketName = 'bumteka-journal-2024';
    this.tableName = 'JournalEntries';
  }

  // Crear una nueva entrada en el journal
  async createEntry(title: string, content: string, tags: string[] = []): Promise<JournalEntry> {
    const now = new Date().toISOString();
    const entry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: now.split('T')[0], // YYYY-MM-DD
      title,
      content,
      tags,
      createdAt: now,
      updatedAt: now
    };

    try {
      // Guardar en DynamoDB (metadatos)
      await this.dynamoHelper.putItem(this.tableName, {
        id: { S: entry.id },
        date: { S: entry.date },
        title: { S: entry.title },
        content: { S: entry.content },
        tags: { SS: entry.tags },
        createdAt: { S: entry.createdAt },
        updatedAt: { S: entry.updatedAt }
      });

      // Guardar archivo completo en S3
      const fileName = `${entry.date}/${entry.id}.md`;
      const fileContent = this.formatMarkdown(entry);
      await this.s3Helper.uploadObject(this.bucketName, fileName, fileContent);

      console.log(`✅ Entrada creada: ${entry.title}`);
      return entry;
    } catch (error) {
      console.error('❌ Error creando entrada:', error);
      throw error;
    }
  }

  // Leer todas las entradas
  async getAllEntries(): Promise<JournalEntry[]> {
    try {
      console.log('📋 Buscando entradas en DynamoDB...');
      
      // Usar Scan para leer todas las entradas de la tabla
      const { ScanCommand } = await import('@aws-sdk/client-dynamodb');
      const command = new ScanCommand({
        TableName: this.tableName
      });
      
      const result = await this.dynamoHelper['client'].send(command);
      
      if (!result.Items || result.Items.length === 0) {
        console.log('📝 No hay entradas aún. ¡Crea tu primera entrada!');
        return [];
      }
      
      // Convertir los items de DynamoDB a JournalEntry
      const entries: JournalEntry[] = result.Items.map(item => ({
        id: item.id?.S || '',
        date: item.date?.S || '',
        title: item.title?.S || '',
        content: item.content?.S || '',
        tags: item.tags?.SS || [],
        createdAt: item.createdAt?.S || '',
        updatedAt: item.updatedAt?.S || ''
      }));
      
      console.log(`✅ Encontradas ${entries.length} entradas:`);
      return entries;
      
    } catch (error) {
      console.error('❌ Error leyendo entradas:', error);
      console.log('💡 Asegúrate de que la tabla esté creada y tengas permisos de lectura');
      return [];
    }
  }

  // Buscar entradas por fecha
  async getEntriesByDate(date: string): Promise<JournalEntry[]> {
    console.log(`📅 Buscando entradas para: ${date}`);
    return [];
  }

  // Buscar entradas por tags
  async getEntriesByTag(tag: string): Promise<JournalEntry[]> {
    console.log(`🏷️ Buscando entradas con tag: ${tag}`);
    return [];
  }

  // Formatear entrada como Markdown
  private formatMarkdown(entry: JournalEntry): string {
    return `# ${entry.title}

**Fecha:** ${entry.date}
**Creado:** ${entry.createdAt}
**Tags:** ${entry.tags?.join(', ') || 'Ninguno'}

---

${entry.content}

---

*Entrada ID: ${entry.id}*
`;
  }

  // Crear bucket S3 para el journal
  async setupJournalStorage(): Promise<void> {
    try {
      console.log('🚀 Configurando almacenamiento para el journal...');
      
      // Crear bucket S3
      await this.s3Helper.createBucket(this.bucketName);
      console.log(`✅ Bucket S3 creado: ${this.bucketName}`);
      
      // Crear tabla DynamoDB
      await this.dynamoHelper.createTable(
        this.tableName,
        [{ AttributeName: 'id', KeyType: 'HASH' }],
        [{ AttributeName: 'id', AttributeType: 'S' }]
      );
      console.log(`✅ Tabla DynamoDB creada: ${this.tableName}`);
      
      console.log('🎉 ¡Journal configurado exitosamente!');
    } catch (error) {
      console.error('❌ Error configurando journal:', error);
      throw error;
    }
  }
}
