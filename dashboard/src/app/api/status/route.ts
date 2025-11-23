import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Check if the Python monitor script is running
    // Look for python process running youtube_monitor.py
    const { stdout } = await execAsync(
      "ps aux | grep 'python.*youtube_monitor.py' | grep -v grep || echo ''"
    );

    const isRunning = stdout.trim().length > 0;
    let pid = null;
    let uptime = null;

    if (isRunning) {
      // Extract PID from ps output
      const match = stdout.match(/\s+(\d+)\s+/);
      if (match) {
        pid = parseInt(match[1]);
      }
    }

    return NextResponse.json({
      running: isRunning,
      pid,
      uptime,
      lastCheck: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error checking status:', error);
    return NextResponse.json(
      { running: false, error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
