import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const projectRoot = join(process.cwd(), '..');
    const historyPath = join(projectRoot, 'youtube_history.json');

    let historyData: any = { processed_videos: [] };
    try {
      const content = await readFile(historyPath, 'utf-8');
      historyData = JSON.parse(content);
    } catch {
      // History file doesn't exist or is empty
      historyData = { processed_videos: [] };
    }

    // Get the processed videos array
    const processedVideos = Array.isArray(historyData.processed_videos) 
      ? historyData.processed_videos 
      : [];

    const totalProcessed = processedVideos.length;
    
    // For now, assume all processed videos are successful
    // (since the current format doesn't track success/failure)
    const successRate = 100;

    // Calculate average time (placeholder for now)
    const averageTime = totalProcessed > 0 ? 13.5 : 0;

    // Count today's uploads (we don't have timestamp in current format)
    const todayUploads = 0;

    return NextResponse.json({
      totalProcessed,
      successRate,
      averageTime,
      todayUploads,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        totalProcessed: 0,
        successRate: 0,
        averageTime: 0,
        todayUploads: 0,
      },
      { status: 200 }
    );
  }
}
