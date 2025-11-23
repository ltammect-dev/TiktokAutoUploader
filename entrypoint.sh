#!/bin/bash
set -e

echo "=== Starting TikTok Auto Uploader ==="

# If a base64-encoded cookies file is provided via env, decode it to disk so yt-dlp can use it
if [ -n "${YOUTUBE_COOKIES_BASE64:-}" ]; then
	echo "🔐 Decoding YOUTUBE_COOKIES_BASE64 to /app/youtube_cookies.txt"
	# Ensure the target directory exists
	mkdir -p /app
	echo "$YOUTUBE_COOKIES_BASE64" | base64 --decode > /app/youtube_cookies.txt 2>/dev/null || {
		echo "❌ Failed to decode YOUTUBE_COOKIES_BASE64"
	}
	chmod 600 /app/youtube_cookies.txt 2>/dev/null || true
fi

# Start Python monitor in background
echo "📺 Starting Python monitor..."
python3 /app/youtube_monitor.py > /tmp/monitor.log 2>&1 &
echo "✓ Python PID: $!"

# Start Next.js dashboard - use node directly from dashboard directory
echo "🎨 Starting Next.js dashboard on port ${PORT:-3000}..."
cd /app/dashboard
exec node ./node_modules/.bin/next start -p ${PORT:-3000}





