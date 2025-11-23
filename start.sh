#!/bin/bash

echo "🚀 Starting TikTok Auto Uploader..."

# Create necessary directories
mkdir -p VideosDirPath
mkdir -p ProcessedVideos
mkdir -p CookiesDir

# Start Python monitor in background
echo "📺 Starting YouTube Monitor..."
python youtube_monitor.py > youtube_monitor.log 2>&1 &
PYTHON_PID=$!
echo "Python Monitor started with PID: $PYTHON_PID"

# Start Next.js dashboard
echo "🎨 Starting Dashboard..."
cd dashboard
PORT=${PORT:-3000} npm start &
NEXTJS_PID=$!
echo "Dashboard started with PID: $NEXTJS_PID"

# Wait for both processes
wait $PYTHON_PID $NEXTJS_PID
