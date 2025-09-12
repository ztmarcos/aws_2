#!/bin/bash

echo "🚀 Creando Repositorio en AWS CodeCommit"
echo "========================================"

# Verificar permisos
echo "1. Verificando permisos de CodeCommit..."
aws codecommit list-repositories 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Permisos de CodeCommit funcionando"
    
    # Crear repositorio
    echo ""
    echo "2. Creando repositorio 'journal-personal'..."
    aws codecommit create-repository \
        --repository-name journal-personal \
        --repository-description "Personal Journal with AWS Integration - TypeScript + S3 + DynamoDB"
    
    if [ $? -eq 0 ]; then
        echo "✅ Repositorio creado exitosamente"
        
        # Obtener URL del repositorio
        echo ""
        echo "3. Obteniendo información del repositorio..."
        REPO_URL=$(aws codecommit get-repository --repository-name journal-personal --query 'repositoryMetadata.cloneUrlHttp' --output text)
        echo "📋 URL del repositorio: $REPO_URL"
        
        # Configurar Git
        echo ""
        echo "4. Configurando Git para CodeCommit..."
        git remote add codecommit $REPO_URL
        
        echo ""
        echo "🎉 ¡Repositorio AWS configurado exitosamente!"
        echo "📋 Comandos disponibles:"
        echo "   git push codecommit main    # Subir a AWS"
        echo "   git pull codecommit main    # Descargar de AWS"
        echo "   git remote -v              # Ver repositorios"
        
    else
        echo "❌ Error creando repositorio"
    fi
    
else
    echo "❌ No tienes permisos de CodeCommit"
    echo "📋 Necesitas solicitar al administrador que adjunte:"
    echo "   aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AmazonCodeCommitFullAccess"
    echo ""
    echo "📄 Consulta PERMISOS-CODECOMMIT.md para más detalles"
fi
