# 🔐 Permisos AWS CodeCommit Necesarios

## 📋 Política Adicional Requerida

Para crear y gestionar repositorios en AWS CodeCommit, necesitas **ADICIONAR** esta política a tu usuario `bumteka`:

### AmazonCodeCommitFullAccess
```bash
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AmazonCodeCommitFullAccess
```

## 🎯 Permisos Específicos Necesarios

Si prefieres una política más restrictiva, necesitas estos permisos:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "codecommit:ListRepositories",
                "codecommit:CreateRepository",
                "codecommit:GetRepository",
                "codecommit:DeleteRepository",
                "codecommit:PutRepositoryTriggers",
                "codecommit:GetRepositoryTriggers",
                "codecommit:TestRepositoryTriggers",
                "codecommit:ListBranches",
                "codecommit:CreateBranch",
                "codecommit:GetBranch",
                "codecommit:DeleteBranch",
                "codecommit:ListCommits",
                "codecommit:GetCommit",
                "codecommit:GetDifferences",
                "codecommit:GetBlob",
                "codecommit:GetTree",
                "codecommit:GetFile",
                "codecommit:GetFolder",
                "codecommit:PutFile",
                "codecommit:PostCommentForComparedCommit",
                "codecommit:PostCommentForPullRequest",
                "codecommit:PostCommentReply",
                "codecommit:GetCommentsForComparedCommit",
                "codecommit:GetCommentsForPullRequest",
                "codecommit:GetComment",
                "codecommit:UpdateComment",
                "codecommit:DeleteComment",
                "codecommit:GetMergeConflicts",
                "codecommit:BatchDescribeMergeConflicts",
                "codecommit:DescribeMergeConflicts",
                "codecommit:GetMergeCommit",
                "codecommit:GetMergeOptions",
                "codecommit:CreateUnreferencedMergeCommit",
                "codecommit:BatchGetRepositories"
            ],
            "Resource": "*"
        }
    ]
}
```

## 🚀 Comandos para el Administrador

### Opción 1: Política Administrada (Recomendado)
```bash
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::aws:policy/AmazonCodeCommitFullAccess
```

### Opción 2: Política Personalizada
```bash
# Crear política personalizada
aws iam create-policy --policy-name CodeCommitJournalAccess --policy-document file://codecommit-policy.json

# Adjuntar al usuario
aws iam attach-user-policy --user-name bumteka --policy-arn arn:aws:iam::307657261121:policy/CodeCommitJournalAccess
```

## 📋 Comandos para Crear Repositorio

Una vez que tengas los permisos, podrás ejecutar:

```bash
# Crear repositorio
aws codecommit create-repository --repository-name journal-personal --repository-description "Personal Journal with AWS Integration"

# Clonar repositorio
aws codecommit get-repository --repository-name journal-personal

# Configurar Git para usar CodeCommit
git remote add codecommit https://git-codecommit.us-east-1.amazonaws.com/v1/repos/journal-personal
```

## 🔧 Configuración de Credenciales Git

Para usar CodeCommit con Git, necesitarás configurar las credenciales:

```bash
# Instalar Git Credential Helper
git config --global credential.helper '!aws codecommit credential-helper $@'
git config --global credential.UseHttpPath true
```

## ✅ Verificación Post-Implementación

Una vez implementados los permisos, ejecuta:

```bash
# Verificar permisos
aws codecommit list-repositories

# Crear repositorio
aws codecommit create-repository --repository-name journal-personal --repository-description "Personal Journal with AWS Integration"
```

## 🎯 Beneficios de CodeCommit

- ✅ **Repositorio privado** en AWS
- ✅ **Integración nativa** con otros servicios AWS
- ✅ **Sin límites** de repositorios privados
- ✅ **Cifrado** en tránsito y en reposo
- ✅ **Acceso controlado** con IAM

## 💡 Estado Actual vs Requerido

| Servicio | Estado Actual | Requerido para CodeCommit |
|----------|---------------|---------------------------|
| S3 | ✅ Funcionando | ✅ Suficiente |
| DynamoDB | ✅ Funcionando | ✅ Suficiente |
| Lambda | ✅ Funcionando | ✅ Suficiente |
| EC2 | ✅ Funcionando | ✅ Suficiente |
| CodeCommit | ❌ Sin permisos | ❌ Necesita permisos |

## 🔐 Nota de Seguridad

La política de CodeCommit es segura porque:
- ✅ Solo afecta repositorios de código
- ✅ No da acceso a otros servicios AWS
- ✅ Perfecta para desarrollo y colaboración
- ✅ Integración nativa con el ecosistema AWS
