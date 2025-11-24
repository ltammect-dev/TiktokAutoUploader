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
      // Kill the Python monitor process - try multiple patterns
      try {
        // Try pkill with different patterns
        await execAsync("pkill -f 'youtube_monitor.py' || true");
        await execAsync("pkill -f 'python.*youtube_monitor' || true");
        await execAsync("pkill -9 -f 'youtube_monitor' || true");
        
        // Also try killing by checking ps directly
        const { stdout: processes } = await execAsync(
          "ps aux | grep youtube_monitor | grep -v grep | awk '{print $2}' || echo ''"
        );
        
        if (processes.trim()) {
          const pids = processes.trim().split('\n').filter(p => p);
          for (const pid of pids) {
            try {
              await execAsync(`kill -9 ${pid} || true`);
            } catch (e) {
              // Ignore errors
            }
          }
        }
      } catch (error) {
        console.error('Error stopping process:', error);
      }
      
      return NextResponse.json({ success: true, message: 'Monitor stopped' });
    }

    if (action === 'start') {
      // Start the Python monitor script
      // First check if it's already running
      const { stdout } = await execAsync(
        "ps aux | grep 'youtube_monitor.py' | grep -v grep || echo ''"
      );

      if (stdout.trim().length > 0) {
        return NextResponse.json(
          { error: 'Monitor is already running' },
          { status: 400 }
        );
      }

      // Start the monitor in background - use venv python
      const pythonPath = join(projectRoot, 'venv', 'bin', 'python');
      const scriptPath = join(projectRoot, 'youtube_monitor.py');
      const logPath = join(projectRoot, 'youtube_monitor.log');
      
      exec(
        `${pythonPath} ${scriptPath} > ${logPath} 2>&1 &`,
        { cwd: projectRoot },
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
      try {
        await execAsync("pkill -f 'youtube_monitor.py' || true");
        await execAsync("pkill -9 -f 'youtube_monitor' || true");
        
        // Kill by PID as backup
        const { stdout: processes } = await execAsync(
          "ps aux | grep youtube_monitor | grep -v grep | awk '{print $2}' || echo ''"
        );
        
        if (processes.trim()) {
          const pids = processes.trim().split('\n').filter(p => p);
          for (const pid of pids) {
            try {
              await execAsync(`kill -9 ${pid} || true`);
            } catch (e) {
              // Ignore errors
            }
          }
        }
      } catch (error) {
        console.error('Error stopping process:', error);
      }
      
      // Wait a moment before restarting
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Start with venv python
      const pythonPath = join(projectRoot, 'venv', 'bin', 'python');
      const scriptPath = join(projectRoot, 'youtube_monitor.py');
      const logPath = join(projectRoot, 'youtube_monitor.log');
      
      exec(
        `${pythonPath} ${scriptPath} > ${logPath} 2>&1 &`,
        { cwd: projectRoot },
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
