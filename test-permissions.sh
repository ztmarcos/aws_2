#!/bin/bash

# Script para probar permisos AWS específicos
echo "🔍 Probando permisos AWS para usuario: bumteka"
echo "=============================================="

echo ""
echo "1. Verificando identidad..."
aws sts get-caller-identity

echo ""
echo "2. Probando S3 (ListAllMyBuckets)..."
aws s3 ls 2>&1 | head -3

echo ""
echo "3. Probando DynamoDB (ListTables)..."
aws dynamodb list-tables 2>&1 | head -3

echo ""
echo "4. Probando Lambda (ListFunctions)..."
aws lambda list-functions 2>&1 | head -3

echo ""
echo "5. Probando EC2 (DescribeInstances)..."
aws ec2 describe-instances --max-items 1 2>&1 | head -3

echo ""
echo "✅ Pruebas completadas"
echo ""
echo "Si ves errores 'AccessDenied', necesitas las políticas de solo lectura."
echo "Consulta el archivo 'request-policies.md' para más detalles."
