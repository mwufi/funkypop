'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player, PlayerRef } from "@remotion/player";
import { Timeline, Clip } from '@/types/media';
import TimelineEditor from './TimelineEditor';

interface VideoPreviewProps {
  durationInFrames: number;
  fps: number;
  component: React.FC<any>;
  inputProps: any;
}

const AVAILABLE_CLIPS = [
  {
    name: 'forest.mp4',
    url: 'https://ynxmunrlesicnfibjctb.supabase.co/storage/v1/object/public/project-images/funkypop-public/forest.mp4',
    type: "video" as const
  },
  {
    name: 'house.mp4',
    url: 'https://ynxmunrlesicnfibjctb.supabase.co/storage/v1/object/public/project-images/funkypop-public/house.mp4',
    type: "video" as const
  }
] as const;

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  durationInFrames,
  fps,
  component,
  inputProps,
}) => {
  // Initialize with forest.mp4
  const [timeline, setTimeline] = useState<Timeline>({
    clips: [{
      id: '1',
      name: 'forest.mp4',
      url: 'https://ynxmunrlesicnfibjctb.supabase.co/storage/v1/object/public/project-images/funkypop-public/forest.mp4?t=2025-01-04T22%3A36%3A21.098Z',
      type: 'video',
      sourceStart: 0,
      sourceEnd: 150, // Will be updated when video loads
      start: 0,
      duration: 150
    }]
  });

  const [currentFrame, setCurrentFrame] = useState(0);
  const playerRef = useRef<PlayerRef>(null);

  // Detect video duration for first clip
  useEffect(() => {
    const firstClip = timeline.clips[0];
    if (firstClip && firstClip.type === 'video') {
      const video = document.createElement('video');
      video.src = firstClip.url;
      video.onloadedmetadata = () => {
        const durationInFrames = Math.floor(video.duration * fps);
        setTimeline(prev => ({
          ...prev,
          clips: prev.clips.map((clip, index) => 
            index === 0 ? {
              ...clip,
              sourceEnd: durationInFrames,
              duration: durationInFrames
            } : clip
          )
        }));
      };
    }
  }, [fps]);

  // Update current frame
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        setCurrentFrame(playerRef.current.getCurrentFrame());
      }
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [fps]);

  const handleAddClip = useCallback(async () => {
    const randomIndex = Math.floor(Math.random() * AVAILABLE_CLIPS.length);
    const randomClip = AVAILABLE_CLIPS[randomIndex];
    
    const newClip: Clip = {
      id: crypto.randomUUID(),
      ...randomClip,
      start: timeline.clips.reduce((max, clip) => Math.max(max, clip.start + clip.duration), 0),
      sourceStart: 0,
      sourceEnd: 150,
      duration: 150
    };

    setTimeline({
      ...timeline,
      clips: [...timeline.clips, newClip]
    });
  }, [timeline.clips]);

  return (
    <div className="bg-[#fdf6e3] rounded-xl p-6 shadow-sm border border-[#eee8d5]">
      {/* Video Container */}
      <div className="relative rounded-lg overflow-hidden mb-4">
        <div className="flex items-center justify-center bg-[#eee8d5] rounded-lg p-8">
          <div className="relative w-[320px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.3)]">
            <div className="w-full aspect-[9/16]">
              <Player
                ref={playerRef}
                component={component}
                durationInFrames={Math.max(
                  150, // Minimum 5 seconds at 30fps
                  timeline.clips.reduce((max, clip) => 
                    Math.max(max, clip.start + clip.duration), 0)
                )}
                fps={fps}
                compositionWidth={1080}
                compositionHeight={1920}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "0.5rem",
                }}
                controls
                autoPlay
                loop={true}
                clickToPlay={false}
                inputProps={{
                  ...inputProps,
                  timeline
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Editor */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
        <TimelineEditor
          timeline={timeline}
          currentFrame={currentFrame}
          onTimelineUpdate={setTimeline}
          onAddClip={handleAddClip}
          fps={fps}
        />
      </div>
    </div>
  );
};