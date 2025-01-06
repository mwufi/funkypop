'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player, PlayerRef } from "@remotion/player";
import { Timeline, Clip } from '@/types/media';
import TimelineEditor from './TimelineEditor';
import { AvatarGrid } from './AvatarGrid';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(1);
  const [timeline, setTimeline] = useState<Timeline>({
    clips: [{
      id: '1',
      name: 'video_1.mp4',
      url: 'https://ynxmunrlesicnfibjctb.supabase.co/storage/v1/object/public/project-images/funkypop-public/videos/video_1.mp4',
      type: 'video',
      sourceStart: 0,
      sourceEnd: 150,
      start: 0,
      duration: 150
    }]
  });

  const [currentFrame, setCurrentFrame] = useState(0);
  const playerRef = useRef<PlayerRef>(null);

  const handleAddClip = async () => {
    setTimeline(prev => ({
      clips: [
        ...prev.clips,
        {
          id: String(prev.clips.length + 1),
          name: 'forest.mp4',
          url: 'https://ynxmunrlesicnfibjctb.supabase.co/storage/v1/object/public/project-images/funkypop-public/forest.mp4',
          type: 'video',
          sourceStart: 0,
          sourceEnd: 150,
          start: prev.clips.reduce((max, clip) => Math.max(max, clip.start + clip.duration), 0),
          duration: 150
        }
      ]
    }));
  };

  const handleTimelineUpdate = (newTimeline: Timeline) => {
    setTimeline(newTimeline);
  };

  const handleAvatarSelect = (avatarNumber: number) => {
    setSelectedAvatar(avatarNumber);
    setTimeline(prev => ({
      clips: [{
        ...prev.clips[0],
        name: `video_${avatarNumber}.mp4`,
        url: `https://ynxmunrlesicnfibjctb.supabase.co/storage/v1/object/public/project-images/funkypop-public/videos/video_${avatarNumber}.mp4`,
      }]
    }));
  };

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

  return (
    <div className="bg-[#fdf6e3] rounded-xl p-6 shadow-sm border border-[#eee8d5]">
      <div className="space-y-4">
        <div className="relative rounded-lg overflow-hidden mb-4">
          <div className="flex items-center justify-center bg-[#eee8d5] rounded-lg p-8">
            <div className="relative w-[320px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.3)]">
              <div className="w-full aspect-[9/16]">
                <Player
                  ref={playerRef}
                  component={component}
                  inputProps={{
                    ...inputProps,
                    timeline: timeline
                  }}
                  durationInFrames={Math.max(
                    30, // Minimum 1 second at 30fps
                    timeline.clips.length === 0 ? 30 : 
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
                  loop
                />
              </div>
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="timeline">
            <AccordionTrigger>Timeline</AccordionTrigger>
            <AccordionContent>
              <TimelineEditor
                timeline={timeline}
                currentFrame={currentFrame}
                onTimelineUpdate={handleTimelineUpdate}
                onAddClip={handleAddClip}
                fps={fps}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="avatar-set">
            <AccordionTrigger>Avatar Set</AccordionTrigger>
            <AccordionContent>
              <AvatarGrid
                selectedAvatar={selectedAvatar}
                onSelect={handleAvatarSelect}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};