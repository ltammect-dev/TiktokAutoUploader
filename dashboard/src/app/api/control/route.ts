import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (!['start', 'stop', 'restart'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    const projectRoot = join(process.cwd(), '..');

    if (action === 'stop') {
      // Kill the Python monitor process
      await execAsync("pkill -f 'python.*youtube_monitor.py' || true");
      return NextResponse.json({ success: true, message: 'Monitor stopped' });
    }

    if (action === 'start') {
      // Start the Python monitor script
      // First check if it's already running
      const { stdout } = await execAsync(
        "ps aux | grep 'python.*youtube_monitor.py' | grep -v grep || echo ''"
      );

      if (stdout.trim().length > 0) {
        return NextResponse.json(
          { error: 'Monitor is already running' },
          { status: 400 }
        );
      }

      // Start the monitor in background
      exec(
        `cd "${projectRoot}" && source venv/bin/activate && python youtube_monitor.py > youtube_monitor.log 2>&1 &`,
        (error) => {
          if (error) {
            console.error('Error starting monitor:', error);
          }
        }
      );

      return NextResponse.json({ success: true, message: 'Monitor started' });
    }

    if (action === 'restart') {
      // Stop then start
      await execAsync("pkill -f 'python.*youtube_monitor.py' || true");
      
      // Wait a moment before restarting
      await new Promise(resolve => setTimeout(resolve, 1000));

      exec(
        `cd "${projectRoot}" && source venv/bin/activate && python youtube_monitor.py > youtube_monitor.log 2>&1 &`,
        (error) => {
          if (error) {
            console.error('Error restarting monitor:', error);
          }
        }
      );

      return NextResponse.json({ success: true, message: 'Monitor restarted' });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Control action error:', error);
    return NextResponse.json(
      { error: 'Failed to execute action' },
      { status: 500 }
    );
  }
}
