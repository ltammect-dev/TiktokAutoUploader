#!/bin/bash

echo "🔍 Checking Railway Deployment Status..."
echo ""

# Check current status
echo "📊 Current Status:"
railway status
echo ""

# Check latest logs
echo "📋 Latest Logs (last 20 lines):"
railway logs --tail 20
echo ""

# Check if service is healthy
echo "🏥 Service Health:"
LOGS=$(railway logs --tail 5)

if echo "$LOGS" | grep -q "ModuleNotFoundError"; then
    echo "❌ ERROR: Missing Python modules"
    echo "   → Rebuild in progress or failed"
elif echo "$LOGS" | grep -q "Error"; then
    echo "⚠️  WARNING: Some errors detected"
    echo "   → Check logs above for details"
elif echo "$LOGS" | grep -q "started"; then
    echo "✅ Service appears to be running"
else
    echo "⏳ Service starting or building..."
fi

echo ""
echo "💡 Quick Commands:"
echo "   railway logs          - View all logs"
echo "   railway status        - Check status"
echo "   railway restart       - Restart service"
echo "   railway domain        - Get/generate domain"
