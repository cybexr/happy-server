# GitHub Actions Secrets Setup for Aliyun ACR

This document describes the required GitHub Actions Secrets for pushing Docker images to Aliyun Container Registry (ACR).

## Required Secrets

Configure the following secrets in your GitHub repository Settings > Secrets and variables > Actions:

### 1. ACR_USERNAME
Your Aliyun ACR username for authentication.

**How to obtain:**
- Log in to Aliyun Console: https://cr.console.aliyun.com/
- Navigate to "Access Tokens" under your registry
- Set a password for your registry username (typically your Aliyun account ID)
- Copy the username

### 2. ACR_PASSWORD
Your Aliyun ACR password/access token.

**How to obtain:**
- In the same "Access Tokens" page
- Click "Set Password" if not already set
- Use a strong password or access token
- Copy the password/token

### 3. ACR_NAMESPACE
Your Aliyun ACR namespace (registry path).

**Format:**
- For Personal Edition: Your Aliyun account ID or custom namespace
- Example: `your-namespace` (this becomes part of the image path)

### 4. ACR_IMAGE_NAME
The name of your Docker image in ACR.

**Format:**
- Use lowercase letters, numbers, and hyphens only
- Example: `happy-server`

## Resulting Registry URL

The workflow will push images to:
```
registry.cn-shanghai.aliyuncs.com/${ACR_NAMESPACE}/${ACR_IMAGE_NAME}:<tag>
```

Example:
```
registry.cn-shanghai.aliyuncs.com/your-namespace/happy-server:abc123def
registry.cn-shanghai.aliyuncs.com/your-namespace/happy-server:0.0.0
registry.cn-shanghai.aliyuncs.com/your-namespace/happy-server:latest
```

## Image Tags

The workflow automatically creates three tags:
1. **Git SHA tag**: `abc123def` (short commit hash) - every build
2. **Version tag**: `0.0.0` (from package.json) - every build
3. **Latest tag**: `latest` - always points to most recent build

## Troubleshooting

### 401 Unauthorized
- Verify ACR_USERNAME and ACR_PASSWORD are correct
- Check if access token has expired
- Ensure namespace exists in your Aliyun ACR

### Registry Not Found
- Verify ACR_NAMESPACE matches your actual namespace
- Check region is correct (cn-shanghai for this workflow)
- Ensure you have permissions to push to this namespace

### Image Name Invalid
- Use only lowercase letters, numbers, and hyphens
- Cannot start or end with a hyphen
- Maximum 128 characters

## Aliyun ACR Personal Edition

This workflow is configured for Aliyun ACR Personal Edition in the `cn-shanghai` region. For other regions, update the registry URL in `.github/workflows/docker-build.yml`.
