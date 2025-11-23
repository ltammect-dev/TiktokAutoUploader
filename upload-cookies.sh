#!/bin/bash

echo "🔑 Uploading TikTok Cookies to Railway..."

# Create CookiesDir on Railway
railway run mkdir -p CookiesDir

# Upload cookie files
echo "📤 Uploading tiktok_session-japanese.207.cookie..."
railway run bash -c "cat > CookiesDir/tiktok_session-japanese.207.cookie" < CookiesDir/tiktok_session-japanese.207.cookie

echo "📤 Uploading empty.cookie..."
railway run bash -c "cat > CookiesDir/empty.cookie" < CookiesDir/empty.cookie

echo "✅ Cookies uploaded successfully!"

# Verify
echo ""
echo "🔍 Verifying cookies on Railway..."
railway run ls -lh CookiesDir/

echo ""
echo "✅ Done! Now restart the service:"
echo "   railway restart"
