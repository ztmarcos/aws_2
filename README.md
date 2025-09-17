# 📖 Journal Personal con AWS

Un journal personal moderno y completo construido con TypeScript, React y servicios AWS serverless.

## ✨ Características

- **Journal Personal** - Tu espacio privado para reflexionar y recordar
- **Interfaz Web Moderna** - Diseño responsivo con React y TypeScript
- **Arquitectura Serverless** - Lambda, DynamoDB, S3 y CloudFront
- **Funcionalidades Completas** - Crear, editar, buscar y gestionar entradas
- **Dashboard Inteligente** - Estadísticas y métricas de tu journal

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

## 🏗️ Arquitectura AWS

### **Frontend (S3 + CloudFront)**
- **S3**: Hosting de archivos estáticos (HTML, CSS, JS)
- **CloudFront**: CDN global para mejor rendimiento y HTTPS

### **Backend (Lambda + API Gateway)**
- **Lambda**: API REST para operaciones CRUD del journal
- **API Gateway**: Endpoints HTTP para la API
- **DynamoDB**: Base de datos NoSQL para almacenar entradas

### **Servicios Utilizados**
- **S3**: Almacenamiento de archivos estáticos del frontend
- **CloudFront**: Distribución global de contenido
- **Lambda**: Funciones serverless para la API
- **API Gateway**: Endpoints REST para el frontend
- **DynamoDB**: Base de datos para entradas del journal

## 🚀 Despliegue

### **Despliegue Automático**
```bash
./deploy-web.sh
```

### **Despliegue Manual**

#### 1. Desplegar API Lambda
```bash
cd lambda/api
npm install
serverless deploy
```

#### 2. Desplegar Frontend
```bash
cd web
npm install
npm run build
# Subir archivos a S3
aws s3 sync dist/ s3://tu-bucket-name --delete
```

## 📱 Funcionalidades del Journal

### **Dashboard**
- Estadísticas de entradas totales
- Entradas de esta semana
- Tags únicos utilizados
- Días consecutivos escribiendo

### **Gestión de Entradas**
- Crear nuevas entradas con título, contenido y tags
- Editar entradas existentes
- Eliminar entradas
- Buscar por texto, fecha o tags

### **Interfaz Moderna**
- Diseño responsivo para móviles y desktop
- Animaciones suaves
- Tema oscuro/claro automático
- Notificaciones toast

## 📁 Estructura del Proyecto

```
aws/
├── lambda/
│   ├── api/
│   │   ├── package.json
│   │   └── serverless.yml      # Configuración de despliegue
│   └── handlers/
│       └── journal-api.ts      # API Lambda para el journal
├── web/
│   ├── src/
│   │   ├── main.ts            # Aplicación principal React/TypeScript
│   │   └── style.css          # Estilos modernos
│   ├── index.html             # Página principal
│   └── package.json           # Dependencias del frontend
├── deploy-web.sh              # Script de despliegue automático
└── README.md                  # Este archivo
```

## 🔧 Scripts Disponibles

### **Frontend (web/)**
- `npm run dev` - Servidor de desarrollo con Vite
- `npm run build` - Compilar para producción
- `npm run preview` - Vista previa de la build

### **Backend (lambda/api/)**
- `serverless deploy` - Desplegar API Lambda
- `serverless remove` - Eliminar recursos AWS

## 📦 Dependencias Principales

### **Frontend**
- `vite` - Build tool moderno
- `typescript` - Compilador TypeScript
- `react` - Framework de UI (implícito en el código)

### **Backend**
- `@aws-sdk/client-dynamodb` - Cliente DynamoDB
- `serverless` - Framework de despliegue
- `typescript` - Compilador TypeScript

## 🎯 API Endpoints

### **Journal API**
- `GET /entries` - Obtener todas las entradas
- `GET /entries/{id}` - Obtener entrada específica
- `POST /entries` - Crear nueva entrada
- `PUT /entries/{id}` - Actualizar entrada
- `DELETE /entries/{id}` - Eliminar entrada

## 🔐 Configuración

### **Variables de Entorno**
```bash
JOURNAL_TABLE_NAME=JournalEntries
AWS_REGION=us-east-1
```

### **Permisos AWS Requeridos**
- DynamoDB: Query, Scan, GetItem, PutItem, UpdateItem, DeleteItem
- S3: GetObject, PutObject, DeleteObject
- CloudFront: CreateDistribution, UpdateDistribution
- Lambda: InvokeFunction

## 🚀 ¡Tu Journal Personal está Listo!

Tu aplicación de journal personal está completamente funcional con:
- ✅ **Frontend moderno** en S3 + CloudFront
- ✅ **API robusta** con Lambda + DynamoDB
- ✅ **Despliegue automático** con un comando
- ✅ **Escalabilidad** automática de AWS
- ✅ **Costo optimizado** con servicios serverless

¡Disfruta escribiendo en tu journal personal! 📖✨
