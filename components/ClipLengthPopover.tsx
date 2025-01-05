'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Clip } from '@/types/media';

interface ClipLengthPopoverProps {
  clip: Clip;
  onClose: () => void;
  onUpdate: (updatedClip: Clip) => void;
  fps: number;
}

const ClipLengthPopover: React.FC<ClipLengthPopoverProps> = ({
  clip,
  onClose,
  onUpdate,
  fps
}) => {
  const [totalFrames, setTotalFrames] = useState<number>(0);
  const [start, setStart] = useState(clip.sourceStart);
  const [end, setEnd] = useState(clip.sourceEnd);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detect video duration
  useEffect(() => {
    if (clip.type === 'video') {
      const video = document.createElement('video');
      video.src = clip.url;
      video.onloadedmetadata = () => {
        const frames = Math.floor(video.duration * fps);
        setTotalFrames(frames);
        if (clip.sourceEnd === 150) { // If using default value
          setEnd(frames);
        }
      };
    }
  }, [clip, fps]);

  // Update video preview position
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = start / fps;
    }
  }, [start, fps]);

  const handleSave = () => {
    onUpdate({
      ...clip,
      sourceStart: start,
      sourceEnd: end,
      duration: end - start
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] space-y-6">
        <h3 className="text-lg font-semibold">Edit {clip.name}</h3>
        
        {/* Preview */}
        <div className="relative h-40 bg-black rounded-lg overflow-hidden">
          {clip.type === 'video' ? (
            <video
              ref={videoRef}
              src={clip.url}
              className="w-full h-full object-cover"
              muted
              autoPlay
              loop
            />
          ) : (
            <img
              src={clip.url}
              className="w-full h-full object-cover"
              alt={clip.name}
            />
          )}
        </div>

        {/* Timeline Control */}
        <div className="space-y-2">
          <div className="relative h-8 bg-gray-200 rounded">
            {/* Full clip indicator */}
            <div className="absolute inset-y-0 bg-gray-300 rounded"
                 style={{
                   left: '0%',
                   right: '0%'
                 }} />
            
            {/* Selected range */}
            <div className="absolute inset-y-0 bg-green-500/50"
                 style={{
                   left: `${(start / totalFrames) * 100}%`,
                   right: `${100 - (end / totalFrames) * 100}%`
                 }} />

            {/* Handles */}
            <button
              className="absolute top-0 w-2 h-full bg-green-600 cursor-ew-resize hover:bg-green-700 rounded"
              style={{ left: `${(start / totalFrames) * 100}%` }}
              onMouseDown={(e) => {
                const bar = e.currentTarget.parentElement!;
                const barRect = bar.getBoundingClientRect();
                const handleMouseMove = (e: MouseEvent) => {
                  const percentage = Math.max(0, Math.min(1, (e.clientX - barRect.left) / barRect.width));
                  const newStart = Math.round(percentage * totalFrames);
                  if (newStart < end) {
                    setStart(newStart);
                  }
                };
                const handleMouseUp = () => {
                  window.removeEventListener('mousemove', handleMouseMove);
                  window.removeEventListener('mouseup', handleMouseUp);
                };
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
              }}
            />
            <button
              className="absolute top-0 w-2 h-full bg-green-600 cursor-ew-resize hover:bg-green-700 rounded"
              style={{ left: `${(end / totalFrames) * 100}%` }}
              onMouseDown={(e) => {
                const bar = e.currentTarget.parentElement!;
                const barRect = bar.getBoundingClientRect();
                const handleMouseMove = (e: MouseEvent) => {
                  const percentage = Math.max(0, Math.min(1, (e.clientX - barRect.left) / barRect.width));
                  const newEnd = Math.round(percentage * totalFrames);
                  if (newEnd > start) {
                    setEnd(newEnd);
                  }
                };
                const handleMouseUp = () => {
                  window.removeEventListener('mousemove', handleMouseMove);
                  window.removeEventListener('mouseup', handleMouseUp);
                };
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
              }}
            />
          </div>

          {/* Info */}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Start: {(start / fps).toFixed(2)}s</span>
            <span>Duration: {((end - start) / fps).toFixed(2)}s</span>
            <span>End: {(end / fps).toFixed(2)}s</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClipLengthPopover;
