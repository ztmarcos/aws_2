# 📖 Journal Personal con AWS

Un journal personal construido con TypeScript y servicios AWS (S3, DynamoDB, Lambda).

## 🚀 Características

- ✍️ **Crear entradas** con título, contenido y tags
- 📅 **Buscar por fecha** para encontrar entradas específicas
- 🏷️ **Buscar por tags** para organizar contenido
- 💾 **Almacenamiento en la nube** usando S3 y DynamoDB
- 📱 **Interfaz de línea de comandos** fácil de usar

## 🏗️ Arquitectura

### S3 (Simple Storage Service)
- **Propósito**: Almacenar archivos Markdown completos de cada entrada
- **Estructura**: `YYYY-MM-DD/entry-id.md`
- **Ventaja**: Acceso directo a archivos, respaldo completo

### DynamoDB (NoSQL Database)
- **Propósito**: Metadatos e indexación para búsquedas rápidas
- **Estructura**: Tabla con ID, fecha, título, tags, timestamps
- **Ventaja**: Búsquedas rápidas por fecha, tags, etc.

### Lambda (Serverless Functions)
- **Propósito**: Procesamiento automático (futuro)
- **Ejemplos**: Generar resúmenes, notificaciones, análisis

## 🛠️ Uso

### 1. Configurar Almacenamiento
```bash
npm run journal
# Selecciona opción 5: Configurar almacenamiento
```

### 2. Crear Entrada
```bash
npm run journal
# Selecciona opción 1: Crear nueva entrada
```

### 3. Ver Entradas
```bash
npm run journal
# Selecciona opción 2: Ver todas las entradas
```

## 📋 Menú Principal

```
📋 Menú Principal:
1. ✍️  Crear nueva entrada
2. 📖 Ver todas las entradas
3. 📅 Buscar por fecha
4. 🏷️  Buscar por tag
5. ⚙️  Configurar almacenamiento
6. 🚪 Salir
```

## 🔧 Scripts Disponibles

- `npm run journal` - Ejecutar el journal
- `npm run journal:dev` - Ejecutar con auto-reload
- `npm run dev` - Ejecutar ejemplos AWS generales

## 📁 Estructura de Archivos

```
src/journal/
├── index.ts              # Punto de entrada
├── journal-manager.ts    # Lógica de negocio
└── journal-cli.ts        # Interfaz de usuario
```

## 💡 Ejemplo de Entrada

```markdown
# Mi Primera Entrada

**Fecha:** 2024-09-11
**Creado:** 2024-09-11T08:30:00.000Z
**Tags:** personal, reflexión

---

Hoy aprendí sobre AWS y creé mi primer journal en la nube.
Es increíble cómo la tecnología puede ayudarnos a organizar
nuestros pensamientos y recuerdos.

---

*Entrada ID: entry-1726038600000*
```

## 🔐 Permisos AWS Necesarios

Para que funcione completamente, necesitas permisos para:
- `s3:CreateBucket`, `s3:PutObject`, `s3:GetObject`
- `dynamodb:CreateTable`, `dynamodb:PutItem`, `dynamodb:Query`

## 🚀 Próximas Características

- [ ] Búsqueda de texto completo
- [ ] Exportar entradas a PDF
- [ ] Sincronización con dispositivos móviles
- [ ] Análisis de sentimientos con Lambda
- [ ] Backup automático
- [ ] Interfaz web

## 🎯 Objetivos de Aprendizaje

Este proyecto te ayuda a aprender:
- **S3**: Almacenamiento de archivos en la nube
- **DynamoDB**: Bases de datos NoSQL
- **Lambda**: Funciones serverless
- **TypeScript**: Desarrollo con tipos
- **AWS SDK**: Integración con servicios AWS
