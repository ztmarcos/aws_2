# Solicitud de Políticas AWS para Usuario: bumteka

## Información del Usuario
- **Usuario**: bumteka
- **Account ID**: 307657261121
- **ARN**: arn:aws:iam::307657261121:user/bumteka

## Políticas Administradas Recomendadas

Para que el proyecto TypeScript funcione correctamente, necesitas solicitar al administrador de AWS que adjunte estas políticas de **solo lectura** al usuario `bumteka`:

### 1. AmazonS3ReadOnlyAccess
- **Propósito**: Listar buckets de S3
- **ARN**: arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
- **Comando para adjuntar**:
```bash
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
```

### 2. AmazonDynamoDBReadOnlyAccess
- **Propósito**: Listar tablas de DynamoDB
- **ARN**: arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess
- **Comando para adjuntar**:
```bash
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess
```

### 3. AWSLambda_ReadOnlyAccess
- **Propósito**: Listar funciones de Lambda
- **ARN**: arn:aws:iam::aws:policy/AWSLambda_ReadOnlyAccess
- **Comando para adjuntar**:
```bash
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AWSLambda_ReadOnlyAccess
```

### 4. AmazonEC2ReadOnlyAccess
- **Propósito**: Describir instancias de EC2
- **ARN**: arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess
- **Comando para adjuntar**:
```bash
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess
```

## Alternativa: Política Personalizada Mínima

Si prefieres una política más restrictiva, puedes crear una política personalizada con solo los permisos necesarios:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListAllMyBuckets",
                "dynamodb:ListTables",
                "lambda:ListFunctions",
                "ec2:DescribeInstances"
            ],
            "Resource": "*"
        }
    ]
}
```

## Verificación

Una vez que se adjunten las políticas, puedes verificar que funcionan ejecutando:

```bash
npm run dev
```

El proyecto debería mostrar los recursos disponibles en lugar de errores de acceso denegado.

## Notas de Seguridad

- Todas estas políticas son de **solo lectura**
- No permiten crear, modificar o eliminar recursos
- Son políticas administradas por AWS, consideradas seguras
- Perfectas para desarrollo y aprendizaje
