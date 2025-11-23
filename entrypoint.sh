#!/bin/bash
set -e

echo "=== Starting TikTok Auto Uploader ==="

# Start Python monitor in background
echo "📺 Starting Python monitor..."
python3 /app/youtube_monitor.py > /tmp/monitor.log 2>&1 &
echo "✓ Python PID: $!"

# Start Next.js dashboard - NO CD COMMAND
echo "🎨 Starting Next.js dashboard..."
exec npm start --prefix /app/dashboard




