'use client'

import React, { useState } from 'react';
import { Timeline, Clip } from '@/types/media';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ClipLengthPopover from './ClipLengthPopover';

interface TimelineEditorProps {
  timeline: Timeline;
  currentFrame: number;
  onTimelineUpdate: (timeline: Timeline) => void;
  onAddClip: () => Promise<void>;
  fps: number;
}

const TimelineEditor: React.FC<TimelineEditorProps> = ({
  timeline,
  currentFrame,
  onTimelineUpdate,
  onAddClip,
  fps
}) => {
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);

  // Calculate total duration
  const totalDuration = timeline.clips.reduce((sum, clip) => 
    Math.max(sum, clip.start + clip.duration), 0);

  const handleDragStart = () => {
    // Prevent scrolling during drag but keep scrollbar visible
    document.body.style.pointerEvents = 'none';
  };

  const handleDragEnd = (result: any) => {
    // Restore pointer events
    document.body.style.pointerEvents = '';

    if (!result.destination) return;

    const clips = Array.from(timeline.clips);
    const [removed] = clips.splice(result.source.index, 1);
    clips.splice(result.destination.index, 0, removed);

    // Recalculate positions
    let currentPosition = 0;
    const updatedClips = clips.map(clip => {
      const updatedClip = {
        ...clip,
        start: currentPosition
      };
      currentPosition += clip.duration;
      return updatedClip;
    });

    onTimelineUpdate({
      ...timeline,
      clips: updatedClips
    });
  };

  const handleClipUpdate = (updatedClip: Clip) => {
    // First update the modified clip
    const newClips = timeline.clips.map(clip => 
      clip.id === updatedClip.id ? updatedClip : clip
    );

    // Then reposition all clips to be sequential
    let currentPosition = 0;
    const repositionedClips = newClips.map(clip => {
      const positionedClip = {
        ...clip,
        start: currentPosition
      };
      currentPosition += clip.duration;
      return positionedClip;
    });

    onTimelineUpdate({
      ...timeline,
      clips: repositionedClips
    });
  };

  const handleDelete = (clipId: string) => {
    const updatedClips = timeline.clips.filter(clip => clip.id !== clipId);
    
    // Recalculate positions
    let currentPosition = 0;
    const reposClips = updatedClips.map(clip => {
      const updatedClip = {
        ...clip,
        start: currentPosition
      };
      currentPosition += clip.duration;
      return updatedClip;
    });

    onTimelineUpdate({
      ...timeline,
      clips: reposClips
    });
  };

  return (
    <div className="space-y-4">
      {/* Timeline */}
      <div className="relative h-32 bg-[#93a1a1] rounded-lg overflow-hidden">
        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <Droppable droppableId="timeline" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="relative h-full flex"
              >
                {/* Clips */}
                {timeline.clips.map((clip, index) => (
                  <Draggable key={clip.id} draggableId={clip.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onMouseDown={(e) => {
                          // Middle click (button 1)
                          if (e.button === 1) {
                            e.preventDefault();
                            handleDelete(clip.id);
                          }
                        }}
                        onAuxClick={(e) => {
                          // Prevent the context menu on middle click
                          if (e.button === 1) {
                            e.preventDefault();
                          }
                        }}
                        className={`h-full ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                        style={{
                          width: `${(clip.duration / totalDuration) * 100}%`,
                          ...provided.draggableProps.style
                        }}
                      >
                        <div className="relative h-full bg-green-500/50 hover:bg-green-500/70 transition-colors group">
                          {/* Preview - pointer-events-none to allow drag through */}
                          <div className="absolute inset-1 bg-black rounded overflow-hidden pointer-events-none">
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

                          {/* Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(clip.id);
                            }}
                            className="absolute right-2 top-2 p-1 bg-red-500/10 hover:bg-red-500/20 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
                          >
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                          {/* Clip Name */}
                          <div className="absolute top-2 left-2 right-8 text-white text-sm font-medium truncate pointer-events-none">
                            {clip.name}
                          </div>

                          {/* Edit Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClip(clip);
                            }}
                            className="absolute right-2 bottom-2 p-1 bg-white/10 hover:bg-white/20 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
                          >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                {/* Playhead */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-white shadow-sm pointer-events-none"
                  style={{
                    left: `${(currentFrame / totalDuration) * 100}%`,
                    transform: 'translateX(-50%)'
                  }}
                />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Add Clip Button */}
      <button
        onClick={onAddClip}
        className="w-full py-2 px-4 bg-[#eee8d5] hover:bg-[#93a1a1] text-[#657b83] hover:text-[#fdf6e3] rounded-lg transition-colors"
      >
        Add Clip
      </button>

      {/* Clip Length Popover */}
      {selectedClip && (
        <ClipLengthPopover
          clip={selectedClip}
          onClose={() => setSelectedClip(null)}
          onUpdate={handleClipUpdate}
          fps={fps}
        />
      )}
    </div>
  );
};

export default TimelineEditor;
