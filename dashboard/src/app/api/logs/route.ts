import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const execAsync = promisify(exec);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lines = parseInt(searchParams.get('lines') || '50');

    const projectRoot = join(process.cwd(), '..');
    const logFile = join(projectRoot, 'youtube_monitor.log');

    // Read last N lines from log file
    try {
      const { stdout } = await execAsync(`tail -n ${lines} "${logFile}" 2>/dev/null || echo "No logs available"`);
      const logs = stdout.trim().split('\n').filter(line => line.length > 0);

      return NextResponse.json({ logs });
    } catch {
      return NextResponse.json({ logs: ['No logs available'] });
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { logs: ['Error loading logs'] },
      { status: 500 }
    );
  }
}
