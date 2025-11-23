#!/bin/bash
set -e

echo "=== Starting TikTok Auto Uploader ==="

# Start Python monitor in background
echo "📺 Starting Python monitor..."
python3 /app/youtube_monitor.py > /tmp/monitor.log 2>&1 &
echo "✓ Python PID: $!"

# Start Next.js dashboard - use node directly from dashboard directory
echo "🎨 Starting Next.js dashboard on port ${PORT:-3000}..."
cd /app/dashboard
exec node ./node_modules/.bin/next start -p ${PORT:-3000}





