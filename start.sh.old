#!/bin/bash

echo "🚀 Starting TikTok Auto Uploader..."

# Debug: Show current directory and files
echo "📂 Current directory: $(pwd)"
echo "📂 Files in current directory:"
ls -la

# Create necessary directories
mkdir -p VideosDirPath
mkdir -p ProcessedVideos
mkdir -p CookiesDir

# Start Python monitor in background
echo "📺 Starting YouTube Monitor..."
python3 youtube_monitor.py > youtube_monitor.log 2>&1 &
PYTHON_PID=$!
echo "Python Monitor started with PID: $PYTHON_PID"

# Start Next.js dashboard
echo "🎨 Starting Dashboard on port ${PORT:-3000}..."
echo "📂 Changing to dashboard directory..."

if [ -d "dashboard" ]; then
    cd dashboard || exit 1
    echo "✓ Changed to dashboard directory"
    echo "📂 Files in dashboard:"
    ls -la
    
    # Start Next.js
    PORT=${PORT:-3000} npm start
else
    echo "❌ ERROR: dashboard directory not found!"
    echo "📂 Available directories:"
    ls -la /app
    exit 1
fi


