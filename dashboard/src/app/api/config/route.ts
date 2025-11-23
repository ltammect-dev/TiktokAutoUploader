import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const getConfigPath = () => {
  const projectRoot = join(process.cwd(), '..');
  return join(projectRoot, 'channels_config.json');
};

export async function GET() {
  try {
    const configPath = getConfigPath();
    const content = await readFile(configPath, 'utf-8');
    const config = JSON.parse(content);
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error reading config:', error);
    
    // Return default config if file doesn't exist
    return NextResponse.json({
      channels: [],
      settings: {
        check_interval: 2,
        min_duration: 45,
        max_duration: 180,
        target_duration: 60,
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const config = await request.json();
    const configPath = getConfigPath();
    
    // Write config to file
    await writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, message: 'Config saved successfully' });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save config' },
      { status: 500 }
    );
  }
}
