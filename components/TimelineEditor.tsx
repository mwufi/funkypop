'use client'

import React, { useState, useRef } from 'react';
import { Timeline, Clip } from '@/types/media';

interface TimelineEditorProps {
  timeline: Timeline;
  currentFrame: number;
  onTimelineUpdate: (timeline: Timeline) => void;
  onAddClip: () => Promise<void>;
}

const TimelineEditor: React.FC<TimelineEditorProps> = ({
  timeline,
  currentFrame,
  onTimelineUpdate,
  onAddClip
}) => {
  const [draggingClip, setDraggingClip] = useState<{
    clipId: string;
    type: 'move' | 'trim-start' | 'trim-end';
  } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Calculate total duration
  const totalDuration = timeline.clips.reduce((sum, clip) => 
    Math.max(sum, clip.start + clip.duration), 0);

  const handleDrag = (e: React.MouseEvent) => {
    if (!draggingClip || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const framePosition = Math.round((x / rect.width) * totalDuration);

    onTimelineUpdate({
      ...timeline,
      clips: timeline.clips.map(clip => {
        if (clip.id === draggingClip.clipId) {
          switch (draggingClip.type) {
            case 'move':
              return {
                ...clip,
                start: Math.max(0, framePosition)
              };
            case 'trim-start': {
              const newSourceStart = Math.max(0, framePosition);
              const sourceLength = clip.sourceEnd - newSourceStart;
              return {
                ...clip,
                sourceStart: newSourceStart,
                duration: sourceLength
              };
            }
            case 'trim-end': {
              const newSourceEnd = Math.min(clip.sourceEnd, framePosition);
              return {
                ...clip,
                sourceEnd: newSourceEnd,
                duration: newSourceEnd - clip.sourceStart
              };
            }
          }
        }
        return clip;
      })
    });
  };

  return (
    <div className="space-y-4">
      {/* Timeline */}
      <div 
        ref={timelineRef}
        className="relative h-32 bg-[#93a1a1] rounded-lg overflow-hidden"
        onMouseMove={handleDrag}
        onMouseUp={() => setDraggingClip(null)}
        onMouseLeave={() => setDraggingClip(null)}
      >
        {/* Clips */}
        {timeline.clips.map((clip) => (
          <div
            key={clip.id}
            className="absolute top-0 h-full group"
            style={{
              left: `${(clip.start / totalDuration) * 100}%`,
              width: `${(clip.duration / totalDuration) * 100}%`
            }}
          >
            <div className="relative h-full bg-green-500/50 hover:bg-green-500/70 transition-colors">
              {/* Preview */}
              <div className="absolute inset-1 bg-black rounded overflow-hidden">
                {clip.type === 'video' ? (
                  <video
                    src={clip.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    onMouseEnter={e => e.currentTarget.play()}
                    onMouseLeave={e => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                ) : (
                  <img
                    src={clip.url}
                    className="w-full h-full object-cover"
                    alt={clip.name}
                  />
                )}
              </div>

              {/* Clip Name */}
              <div className="absolute top-2 left-2 right-2 text-white text-sm font-medium truncate">
                {clip.name}
              </div>

              {/* Drag Handles */}
              <div
                className="absolute left-0 w-1 h-full bg-green-600 cursor-ew-resize hover:bg-green-700"
                onMouseDown={() => setDraggingClip({ clipId: clip.id, type: 'trim-start' })}
              />
              <div
                className="absolute right-0 w-1 h-full bg-green-600 cursor-ew-resize hover:bg-green-700"
                onMouseDown={() => setDraggingClip({ clipId: clip.id, type: 'trim-end' })}
              />
              <div
                className="absolute inset-2 cursor-move"
                onMouseDown={() => setDraggingClip({ clipId: clip.id, type: 'move' })}
              />
            </div>
          </div>
        ))}

        {/* Playhead */}
        <div
          className="absolute top-0 h-full w-0.5 bg-white shadow-sm pointer-events-none"
          style={{
            left: `${(currentFrame / totalDuration) * 100}%`,
            transform: 'translateX(-50%)'
          }}
        />
      </div>

      {/* Add Clip Button */}
      <button
        onClick={onAddClip}
        className="w-full py-2 px-4 bg-[#eee8d5] hover:bg-[#93a1a1] text-[#657b83] hover:text-[#fdf6e3] rounded-lg transition-colors"
      >
        Add Clip
      </button>
    </div>
  );
};

export default TimelineEditor;
