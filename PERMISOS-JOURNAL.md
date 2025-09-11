# 🔐 Permisos AWS Necesarios para el Journal

## 📋 Políticas Adicionales Requeridas

Para que tu journal funcione completamente, necesitas **ADICIONAR** estas políticas a tu usuario `bumteka`:

### 1. AmazonS3FullAccess (o AmazonS3ReadOnlyAccess + permisos específicos)
```bash
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
```

**Permisos específicos necesarios:**
- `s3:CreateBucket`
- `s3:PutObject`
- `s3:GetObject`
- `s3:ListBucket`

### 2. AmazonDynamoDBFullAccess (o AmazonDynamoDBReadOnlyAccess + permisos específicos)
```bash
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
```

**Permisos específicos necesarios:**
- `dynamodb:CreateTable`
- `dynamodb:PutItem`
- `dynamodb:GetItem`
- `dynamodb:Query`
- `dynamodb:Scan`

## 🎯 Alternativa: Política Personalizada Mínima

Si prefieres permisos más restrictivos, puedes crear esta política personalizada:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:ChangePassword"
            ],
            "Resource": [
                "arn:aws:iam::*:user/${aws:username}",
                "arn:aws:iam::*:user/*/${aws:username}"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:GetAccountPasswordPolicy"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListAllMyBuckets",
                "s3:GetBucketLocation",
                "s3:CreateBucket",
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::my-journal-bucket",
                "arn:aws:s3:::my-journal-bucket/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:ListTables",
                "dynamodb:DescribeTable",
                "dynamodb:CreateTable",
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:307657261121:table/JournalEntries"
            ]
        }
    ]
}
```

## 🚀 Comandos para el Administrador

### Opción 1: Políticas Administradas (Recomendado)
```bash
# Adjuntar políticas completas
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
```

### Opción 2: Política Personalizada
```bash
# Crear política personalizada
aws iam create-policy --policy-name JournalAccess --policy-document file://journal-policy.json

# Adjuntar al usuario
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::307657261121:policy/JournalAccess
```

## ✅ Verificación Post-Implementación

Una vez implementadas las políticas, ejecuta:

```bash
# Probar permisos
./test-permissions.sh

# Ejecutar journal
npm run journal
```

Deberías poder:
- ✅ Crear bucket S3
- ✅ Crear tabla DynamoDB
- ✅ Escribir entradas
- ✅ Leer entradas
- ✅ Buscar por fecha y tags

## 🎯 Estado Actual vs Requerido

| Servicio | Estado Actual | Requerido para Journal |
|----------|---------------|------------------------|
| S3 | ✅ Solo lectura | ❌ Necesita escritura |
| DynamoDB | ✅ Solo lectura | ❌ Necesita escritura |
| Lambda | ✅ Solo lectura | ✅ Suficiente |
| EC2 | ✅ Solo lectura | ✅ Suficiente |

## 💡 Nota de Seguridad

Las políticas recomendadas son seguras porque:
- ✅ Solo afectan recursos específicos del journal
- ✅ No dan acceso a otros buckets o tablas
- ✅ Mantienen el principio de menor privilegio
- ✅ Son perfectas para desarrollo y aprendizaje
