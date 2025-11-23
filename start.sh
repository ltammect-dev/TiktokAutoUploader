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

# Start Next.js dashboard on Railway's PORT
echo "🎨 Starting Dashboard on port ${PORT:-3000}..."
cd dashboard
PORT=${PORT:-3000} npm start

