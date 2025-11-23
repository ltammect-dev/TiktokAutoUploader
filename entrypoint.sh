#!/bin/sh
set -e

echo "Starting services..."

# Start Python monitor in background
python3 /app/youtube_monitor.py > /tmp/monitor.log 2>&1 &

# Start Next.js in foreground (without using cd)
exec npm start --prefix /app/dashboard

