# Análisis de Políticas Actuales - Usuario: bumteka

## Política Actual Detectada

El usuario `bumteka` tiene actualmente una política personalizada que solo permite:

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
        }
    ]
}
```

## Permisos Actuales
- ✅ **Cambiar su propia contraseña**
- ✅ **Ver política de contraseñas de la cuenta**
- ❌ **Acceso a servicios AWS** (S3, DynamoDB, Lambda, EC2)

## Políticas Adicionales Necesarias

Para que el proyecto TypeScript funcione, necesitas **ADICIONAR** (no reemplazar) estas políticas administradas:

### 1. AmazonS3ReadOnlyAccess
```bash
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
```

### 2. AmazonDynamoDBReadOnlyAccess
```bash
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess
```

### 3. AWSLambda_ReadOnlyAccess
```bash
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AWSLambda_ReadOnlyAccess
```

### 4. AmazonEC2ReadOnlyAccess
```bash
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess
```

## Alternativa: Política Personalizada Combinada

Si prefieres mantener todo en una sola política personalizada, puedes reemplazar la actual con esta:

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
                "s3:GetBucketVersioning",
                "s3:GetBucketPolicy",
                "s3:GetBucketAcl",
                "s3:GetBucketCORS",
                "s3:GetBucketWebsite",
                "s3:GetBucketNotification",
                "s3:GetBucketLogging",
                "s3:GetBucketTagging",
                "s3:GetBucketRequestPayment",
                "s3:GetBucketReplication",
                "s3:GetBucketAccelerateConfiguration",
                "s3:GetBucketAnalyticsConfiguration",
                "s3:GetBucketInventoryConfiguration",
                "s3:GetBucketMetricsConfiguration",
                "s3:GetBucketNotificationConfiguration",
                "s3:GetBucketOwnershipControls",
                "s3:GetBucketPublicAccessBlock",
                "s3:GetBucketPolicyStatus",
                "s3:GetBucketEncryption",
                "s3:GetBucketIntelligentTieringConfiguration",
                "s3:GetBucketLifecycleConfiguration",
                "s3:GetBucketLocation",
                "s3:GetBucketVersioning",
                "s3:GetBucketPolicy",
                "s3:GetBucketAcl",
                "s3:GetBucketCORS",
                "s3:GetBucketWebsite",
                "s3:GetBucketNotification",
                "s3:GetBucketLogging",
                "s3:GetBucketTagging",
                "s3:GetBucketRequestPayment",
                "s3:GetBucketReplication",
                "s3:GetBucketAccelerateConfiguration",
                "s3:GetBucketAnalyticsConfiguration",
                "s3:GetBucketInventoryConfiguration",
                "s3:GetBucketMetricsConfiguration",
                "s3:GetBucketNotificationConfiguration",
                "s3:GetBucketOwnershipControls",
                "s3:GetBucketPublicAccessBlock",
                "s3:GetBucketPolicyStatus",
                "s3:GetBucketEncryption",
                "s3:GetBucketIntelligentTieringConfiguration",
                "s3:GetBucketLifecycleConfiguration",
                "s3:GetObject",
                "s3:GetObjectVersion",
                "s3:GetObjectAcl",
                "s3:GetObjectVersionAcl",
                "s3:GetObjectTagging",
                "s3:GetObjectVersionTagging",
                "s3:GetObjectTorrent",
                "s3:GetObjectVersionTorrent",
                "s3:ListBucket",
                "s3:ListBucketVersions",
                "s3:ListBucketMultipartUploads",
                "s3:ListMultipartUploadParts",
                "s3:GetBucketPolicyStatus",
                "s3:GetBucketPublicAccessBlock",
                "s3:GetBucketAcl",
                "s3:GetBucketCORS",
                "s3:GetBucketWebsite",
                "s3:GetBucketNotification",
                "s3:GetBucketLogging",
                "s3:GetBucketTagging",
                "s3:GetBucketRequestPayment",
                "s3:GetBucketReplication",
                "s3:GetBucketAccelerateConfiguration",
                "s3:GetBucketAnalyticsConfiguration",
                "s3:GetBucketInventoryConfiguration",
                "s3:GetBucketMetricsConfiguration",
                "s3:GetBucketNotificationConfiguration",
                "s3:GetBucketOwnershipControls",
                "s3:GetBucketPublicAccessBlock",
                "s3:GetBucketPolicyStatus",
                "s3:GetBucketEncryption",
                "s3:GetBucketIntelligentTieringConfiguration",
                "s3:GetBucketLifecycleConfiguration"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:ListTables",
                "dynamodb:DescribeTable",
                "dynamodb:DescribeTimeToLive",
                "dynamodb:ListTagsOfResource",
                "dynamodb:DescribeContinuousBackups",
                "dynamodb:DescribeContributorInsights",
                "dynamodb:DescribeGlobalTable",
                "dynamodb:DescribeGlobalTableSettings",
                "dynamodb:DescribeLimits",
                "dynamodb:DescribeTableReplicaAutoScaling",
                "dynamodb:DescribeEndpoints",
                "dynamodb:DescribeExport",
                "dynamodb:DescribeKinesisStreamingDestination",
                "dynamodb:DescribeReservedCapacity",
                "dynamodb:DescribeReservedCapacityOfferings",
                "dynamodb:ListExports",
                "dynamodb:ListGlobalTables",
                "dynamodb:ListStreams",
                "dynamodb:ListTagsOfResource",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:BatchGetItem",
                "dynamodb:GetItem"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "lambda:ListFunctions",
                "lambda:GetFunction",
                "lambda:GetFunctionConfiguration",
                "lambda:ListVersionsByFunction",
                "lambda:ListAliases",
                "lambda:GetAlias",
                "lambda:GetPolicy",
                "lambda:ListEventSourceMappings",
                "lambda:GetEventSourceMapping",
                "lambda:ListFunctionEventInvokeConfigs",
                "lambda:GetFunctionEventInvokeConfig",
                "lambda:ListProvisionedConcurrencyConfigs",
                "lambda:GetProvisionedConcurrencyConfig",
                "lambda:ListLayers",
                "lambda:GetLayerVersion",
                "lambda:ListLayerVersions",
                "lambda:GetAccountSettings",
                "lambda:ListCodeSigningConfigs",
                "lambda:GetCodeSigningConfig",
                "lambda:ListFunctionsByCodeSigningConfig"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeImages",
                "ec2:DescribeSnapshots",
                "ec2:DescribeVolumes",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeKeyPairs",
                "ec2:DescribeVpcs",
                "ec2:DescribeSubnets",
                "ec2:DescribeRouteTables",
                "ec2:DescribeInternetGateways",
                "ec2:DescribeNatGateways",
                "ec2:DescribeNetworkAcls",
                "ec2:DescribeNetworkInterfaces",
                "ec2:DescribeAvailabilityZones",
                "ec2:DescribeRegions",
                "ec2:DescribeAccountAttributes",
                "ec2:DescribeAddresses",
                "ec2:DescribeTags",
                "ec2:DescribeReservedInstances",
                "ec2:DescribeReservedInstancesOfferings",
                "ec2:DescribeSpotInstanceRequests",
                "ec2:DescribeSpotPriceHistory",
                "ec2:DescribeSpotDatafeedSubscription",
                "ec2:DescribeSpotFleetInstances",
                "ec2:DescribeSpotFleetRequestHistory",
                "ec2:DescribeSpotFleetRequests",
                "ec2:DescribeSpotFleetInstances",
                "ec2:DescribeSpotFleetRequestHistory",
                "ec2:DescribeSpotFleetRequests"
            ],
            "Resource": "*"
        }
    ]
}
```

## Recomendación

**Opción 1 (Recomendada)**: Adjuntar las políticas administradas de AWS
- Más seguras y mantenidas por AWS
- Fácil de gestionar
- Permisos bien definidos

**Opción 2**: Política personalizada combinada
- Todo en un solo lugar
- Requiere más mantenimiento
- Más control granular

## Verificación Post-Implementación

Una vez implementadas las políticas, ejecuta:

```bash
./test-permissions.sh
npm run dev
```

Deberías ver listas de recursos en lugar de errores de acceso denegado.
