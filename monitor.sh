#!/bin/bash
# YouTube to TikTok Monitor Control Script

SCRIPT_NAME="youtube_monitor.py"
LOG_FILE="youtube_monitor.log"
PID_FILE=".monitor.pid"

case "$1" in
    start)
        if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
            echo "⚠️  Monitor is already running (PID: $(cat $PID_FILE))"
            exit 1
        fi
        
        echo "🚀 Starting YouTube Monitor..."
        source venv/bin/activate
        python -u $SCRIPT_NAME >> $LOG_FILE 2>&1 &
        echo $! > $PID_FILE
        echo "✅ Monitor started (PID: $(cat $PID_FILE))"
        echo "📋 View logs: ./monitor.sh logs"
        ;;
    
    stop)
        if [ ! -f "$PID_FILE" ]; then
            echo "⚠️  Monitor is not running"
            exit 1
        fi
        
        PID=$(cat $PID_FILE)
        echo "🛑 Stopping monitor (PID: $PID)..."
        kill $PID 2>/dev/null
        rm -f $PID_FILE
        echo "✅ Monitor stopped"
        ;;
    
    restart)
        $0 stop
        sleep 2
        $0 start
        ;;
    
    status)
        if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
            PID=$(cat $PID_FILE)
            echo "✅ Monitor is running (PID: $PID)"
            echo ""
            ps aux | grep $PID | grep -v grep
        else
            echo "❌ Monitor is not running"
            [ -f "$PID_FILE" ] && rm -f $PID_FILE
        fi
        ;;
    
    logs)
        if [ ! -f "$LOG_FILE" ]; then
            echo "⚠️  No log file found"
            exit 1
        fi
        
        tail -f $LOG_FILE
        ;;
    
    clear-logs)
        echo "🗑️  Clearing logs..."
        > $LOG_FILE
        echo "✅ Logs cleared"
        ;;
    
    test)
        echo "🧪 Running one-time check..."
        source venv/bin/activate
        python -u $SCRIPT_NAME --once
        ;;
    
    *)
        echo "YouTube to TikTok Monitor Control"
        echo ""
        echo "Usage: $0 {start|stop|restart|status|logs|clear-logs|test}"
        echo ""
        echo "Commands:"
        echo "  start       - Start the monitor in background"
        echo "  stop        - Stop the monitor"
        echo "  restart     - Restart the monitor"
        echo "  status      - Check if monitor is running"
        echo "  logs        - View logs in real-time (Ctrl+C to exit)"
        echo "  clear-logs  - Clear log file"
        echo "  test        - Run one-time check (no loop)"
        echo ""
        exit 1
        ;;
esac
