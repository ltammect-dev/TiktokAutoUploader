#!/bin/bash

echo "🔑 Setting up cookies on Railway..."
echo ""
echo "OPTION 1: Upload via Railway Dashboard (EASIEST)"
echo "=============================================="
echo "1. Go to: https://railway.app/dashboard"
echo "2. Open your project: amused-renewal"
echo "3. Click 'Settings' → 'Volumes' → 'New Volume'"
echo "4. Name: cookies-storage"
echo "5. Mount path: /app/CookiesDir"
echo "6. Upload your cookie files to the volume"
echo ""
echo "OPTION 2: Use Railway CLI with base64"
echo "=============================================="
echo "Encoding cookies to base64..."

# Encode cookies
COOKIE_B64=$(cat CookiesDir/tiktok_session-japanese.207.cookie | base64)
EMPTY_B64=$(cat CookiesDir/empty.cookie | base64)

echo ""
echo "Run these commands on Railway shell:"
echo ""
echo "railway shell"
echo ""
echo "Then in the Railway shell, run:"
echo ""
echo "mkdir -p CookiesDir"
echo "echo '$COOKIE_B64' | base64 -d > CookiesDir/tiktok_session-japanese.207.cookie"
echo "echo '$EMPTY_B64' | base64 -d > CookiesDir/empty.cookie"
echo "ls -lh CookiesDir/"
echo ""
echo "OPTION 3: Create Volume and mount local folder"
echo "=============================================="
echo "This will be set in railway.json"
