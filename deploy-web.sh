#!/bin/bash

echo "🚀 Desplegando Journal Web App a AWS"
echo "===================================="

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI no está configurado. Ejecuta 'aws configure' primero."
    exit 1
fi

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
    echo "📦 Instalando Serverless Framework..."
    npm install -g serverless
fi

# Install dependencies
echo "📦 Instalando dependencias..."
cd lambda/api
npm init -y
npm install serverless
npm install @aws-sdk/client-dynamodb @aws-sdk/util-dynamodb

# Deploy the API
echo "🚀 Desplegando API Lambda..."
serverless deploy --stage dev

# Get the API URL
API_URL=$(aws cloudformation describe-stacks --stack-name journal-api-dev --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' --output text)
echo "✅ API desplegada: $API_URL"

# Update the web app with the API URL
cd ../../web
echo "🔧 Configurando API URL en la aplicación web..."
sed -i.bak "s|const API_BASE_URL = '.*'|const API_BASE_URL = '$API_URL'|g" js/app.js

# Deploy web files to S3
echo "🌐 Desplegando aplicación web a S3..."
BUCKET_NAME="journal-web-dev"
aws s3 sync . s3://$BUCKET_NAME --delete

# Get CloudFront URL
CLOUDFRONT_URL=$(aws cloudformation describe-stacks --stack-name journal-api-dev --query 'Stacks[0].Outputs[?OutputKey==`WebUrl`].OutputValue' --output text)
echo "✅ Aplicación web desplegada: $CLOUDFRONT_URL"

echo ""
echo "🎉 ¡Despliegue completado!"
echo "📋 URLs:"
echo "   API: $API_URL"
echo "   Web: $CLOUDFRONT_URL"
echo ""
echo "💡 Para actualizar la aplicación web:"
echo "   aws s3 sync web/ s3://$BUCKET_NAME --delete"
