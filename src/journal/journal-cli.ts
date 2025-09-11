import { JournalManager } from './journal-manager';
import * as readline from 'readline';

export class JournalCLI {
  private journalManager: JournalManager;
  private rl: readline.Interface;

  constructor() {
    this.journalManager = new JournalManager();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // Menú principal
  async start(): Promise<void> {
    console.log('📖 Bienvenido a tu Journal Personal');
    console.log('=====================================');
    
    while (true) {
      await this.showMenu();
      const choice = await this.getInput('\nElige una opción: ');
      
      switch (choice.trim()) {
        case '1':
          await this.createEntry();
          break;
        case '2':
          await this.viewEntries();
          break;
        case '3':
          await this.searchByDate();
          break;
        case '4':
          await this.searchByTag();
          break;
        case '5':
          await this.setupStorage();
          break;
        case '6':
          console.log('👋 ¡Hasta luego!');
          this.rl.close();
          return;
        default:
          console.log('❌ Opción no válida. Intenta de nuevo.');
      }
    }
  }

  private async showMenu(): Promise<void> {
    console.log('\n📋 Menú Principal:');
    console.log('1. ✍️  Crear nueva entrada');
    console.log('2. 📖 Ver todas las entradas');
    console.log('3. 📅 Buscar por fecha');
    console.log('4. 🏷️  Buscar por tag');
    console.log('5. ⚙️  Configurar almacenamiento');
    console.log('6. 🚪 Salir');
  }

  private async createEntry(): Promise<void> {
    console.log('\n✍️ Crear Nueva Entrada');
    console.log('======================');
    
    const title = await this.getInput('Título: ');
    if (!title.trim()) {
      console.log('❌ El título no puede estar vacío.');
      return;
    }

    console.log('\nEscribe tu entrada (presiona Enter dos veces para terminar):');
    const content = await this.getMultiLineInput();
    
    const tagsInput = await this.getInput('Tags (separados por comas, opcional): ');
    const tags = tagsInput.trim() ? tagsInput.split(',').map(tag => tag.trim()) : [];

    try {
      const entry = await this.journalManager.createEntry(title, content, tags);
      console.log(`\n✅ ¡Entrada creada exitosamente!`);
      console.log(`📅 Fecha: ${entry.date}`);
      console.log(`🆔 ID: ${entry.id}`);
    } catch (error) {
      console.log('❌ Error creando la entrada. Verifica que el almacenamiento esté configurado.');
    }
  }

  private async viewEntries(): Promise<void> {
    console.log('\n📖 Todas las Entradas');
    console.log('=====================');
    
    try {
      const entries = await this.journalManager.getAllEntries();
      if (entries.length === 0) {
        console.log('📝 No hay entradas aún. ¡Crea tu primera entrada!');
      } else {
        entries.forEach((entry, index) => {
          console.log(`\n${index + 1}. ${entry.title}`);
          console.log(`   📅 ${entry.date} | 🏷️ ${entry.tags?.join(', ') || 'Sin tags'}`);
          console.log(`   📄 ${entry.content.substring(0, 100)}...`);
        });
      }
    } catch (error) {
      console.log('❌ Error leyendo entradas.');
    }
  }

  private async searchByDate(): Promise<void> {
    const date = await this.getInput('\n📅 Ingresa la fecha (YYYY-MM-DD): ');
    
    try {
      const entries = await this.journalManager.getEntriesByDate(date);
      if (entries.length === 0) {
        console.log(`📝 No hay entradas para la fecha ${date}`);
      } else {
        console.log(`\n📅 Entradas para ${date}:`);
        entries.forEach(entry => {
          console.log(`\n• ${entry.title}`);
          console.log(`  🏷️ ${entry.tags?.join(', ') || 'Sin tags'}`);
        });
      }
    } catch (error) {
      console.log('❌ Error buscando por fecha.');
    }
  }

  private async searchByTag(): Promise<void> {
    const tag = await this.getInput('\n🏷️ Ingresa el tag a buscar: ');
    
    try {
      const entries = await this.journalManager.getEntriesByTag(tag);
      if (entries.length === 0) {
        console.log(`📝 No hay entradas con el tag "${tag}"`);
      } else {
        console.log(`\n🏷️ Entradas con tag "${tag}":`);
        entries.forEach(entry => {
          console.log(`\n• ${entry.title} (${entry.date})`);
        });
      }
    } catch (error) {
      console.log('❌ Error buscando por tag.');
    }
  }

  private async setupStorage(): Promise<void> {
    console.log('\n⚙️ Configurando Almacenamiento');
    console.log('==============================');
    
    try {
      await this.journalManager.setupJournalStorage();
      console.log('\n✅ ¡Almacenamiento configurado! Ahora puedes crear entradas.');
    } catch (error) {
      console.log('❌ Error configurando almacenamiento. Verifica tus permisos AWS.');
    }
  }

  private async getInput(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  private async getMultiLineInput(): Promise<string> {
    return new Promise((resolve) => {
      let content = '';
      let emptyLines = 0;
      
      const onLine = (line: string) => {
        if (line.trim() === '') {
          emptyLines++;
          if (emptyLines >= 2) {
            this.rl.removeListener('line', onLine);
            resolve(content.trim());
          } else {
            content += '\n';
          }
        } else {
          emptyLines = 0;
          content += line + '\n';
        }
      };
      
      this.rl.on('line', onLine);
    });
  }
}
