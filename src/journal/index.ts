import { JournalCLI } from './journal-cli';

// Función principal para ejecutar el journal
async function main() {
  console.log('🚀 Iniciando Journal Personal...');
  
  const journalCLI = new JournalCLI();
  
  try {
    await journalCLI.start();
  } catch (error) {
    console.error('❌ Error ejecutando el journal:', error);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

export { JournalManager } from './journal-manager';
export { JournalCLI } from './journal-cli';
