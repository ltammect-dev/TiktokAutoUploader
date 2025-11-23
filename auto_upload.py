#!/usr/bin/env python3
"""
Auto upload script for TikTok
- Skip videos < 45s
- Scale videos 45-60s to 60s with slow motion
- Upload processed videos
"""

import os
import sys
from pathlib import Path
from moviepy.editor import VideoFileClip
import subprocess

VIDEO_DIR = "VideosDirPath"
PROCESSED_DIR = "ProcessedVideos"
USERNAME = "japanese.207"
MIN_DURATION = 45  # seconds
MAX_DURATION = 60  # seconds
TARGET_DURATION = 60  # seconds


def get_video_duration(video_path):
    """Get video duration in seconds"""
    try:
        clip = VideoFileClip(video_path)
        duration = clip.duration
        clip.close()
        return duration
    except Exception as e:
        print(f"Error getting duration for {video_path}: {e}")
        return None


def scale_to_60s(input_path, output_path):
    """Scale video to 60 seconds using slow motion"""
    try:
        clip = VideoFileClip(input_path)
        original_duration = clip.duration
        
        # Calculate speed factor (< 1 means slow motion)
        speed_factor = original_duration / TARGET_DURATION
        
        print(f"  Original duration: {original_duration:.2f}s")
        print(f"  Speed factor: {speed_factor:.3f}")
        
        # Apply slow motion
        slowed_clip = clip.fx(lambda c: c.speedx(speed_factor))
        
        # Write the output
        slowed_clip.write_videofile(
            output_path,
            codec='libx264',
            audio_codec='aac',
            temp_audiofile='temp-audio.m4a',
            remove_temp=True,
            fps=30
        )
        
        clip.close()
        slowed_clip.close()
        
        print(f"  ✓ Scaled to {TARGET_DURATION}s: {output_path}")
        return True
        
    except Exception as e:
        print(f"  ✗ Error processing {input_path}: {e}")
        return False


def upload_video(video_name, title):
    """Upload video to TikTok"""
    try:
        cmd = [
            "python", "cli.py", "upload",
            "--user", USERNAME,
            "-v", video_name,
            "-t", title
        ]
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True
        )
        
        if "Published successfully" in result.stdout:
            print(f"  ✓ Uploaded successfully: {title}")
            return True
        else:
            print(f"  ✗ Upload failed: {result.stdout}")
            return False
            
    except subprocess.CalledProcessError as e:
        print(f"  ✗ Upload error: {e.stderr}")
        return False


def main():
    # Create processed directory if it doesn't exist
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    
    # Get all video files
    video_extensions = ['.mp4', '.mov', '.avi', '.mkv']
    video_files = []
    
    for ext in video_extensions:
        video_files.extend(Path(VIDEO_DIR).glob(f'*{ext}'))
    
    if not video_files:
        print("No video files found in VideosDirPath/")
        return
    
    print(f"Found {len(video_files)} video(s)")
    print("=" * 60)
    
    uploaded_count = 0
    skipped_count = 0
    processed_count = 0
    
    for video_path in video_files:
        video_name = video_path.name
        print(f"\n📹 Processing: {video_name}")
        
        # Get duration
        duration = get_video_duration(str(video_path))
        if duration is None:
            print(f"  ⚠ Skipped: Cannot read video")
            skipped_count += 1
            continue
        
        print(f"  Duration: {duration:.2f}s")
        
        # Skip if < 45s
        if duration < MIN_DURATION:
            print(f"  ⏭ Skipped: Too short (< {MIN_DURATION}s)")
            skipped_count += 1
            continue
        
        # If between 45-60s, scale to 60s
        if MIN_DURATION <= duration <= MAX_DURATION:
            print(f"  🎬 Scaling to {TARGET_DURATION}s...")
            
            # Create output filename
            base_name = video_path.stem
            output_name = f"{base_name}_60s.mp4"
            output_path = os.path.join(PROCESSED_DIR, output_name)
            
            # Scale the video
            if scale_to_60s(str(video_path), output_path):
                processed_count += 1
                
                # Move processed video to VideosDirPath for upload
                final_path = os.path.join(VIDEO_DIR, output_name)
                os.rename(output_path, final_path)
                
                # Upload
                title = f"{base_name}"
                print(f"  📤 Uploading...")
                if upload_video(output_name, title):
                    uploaded_count += 1
                    # Clean up uploaded file
                    os.remove(final_path)
            else:
                skipped_count += 1
        
        # If already 60s or close, upload directly
        elif duration > MAX_DURATION and duration <= MAX_DURATION + 1:
            print(f"  📤 Uploading directly (already ~{TARGET_DURATION}s)...")
            title = video_path.stem
            if upload_video(video_name, title):
                uploaded_count += 1
        else:
            print(f"  ⏭ Skipped: Duration {duration:.2f}s out of range")
            skipped_count += 1
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Summary:")
    print(f"  Processed & scaled: {processed_count}")
    print(f"  Uploaded: {uploaded_count}")
    print(f"  Skipped: {skipped_count}")
    print("=" * 60)


if __name__ == "__main__":
    main()
