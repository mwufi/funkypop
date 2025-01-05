import React, { useState, useRef } from 'react';
import { MediaTracks, MediaItem, PrimaryTrack, SecondaryTrack } from '@/types/media';

interface MediaTrackEditorProps {
  tracks: MediaTracks;
  currentFrame: number;
  onTracksUpdate: (tracks: MediaTracks) => void;
  onAddClip: () => Promise<MediaItem | null>;
}

const MediaTrackEditor: React.FC<MediaTrackEditorProps> = ({
  tracks,
  currentFrame,
  onTracksUpdate,
  onAddClip
}) => {
  const [draggingClip, setDraggingClip] = useState<{
    trackId: string;
    clipId: string;
    type: 'move' | 'start' | 'end';
  } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Calculate total frames based on primary track
  const totalFrames = tracks.primary?.media.endFrame || 300;

  const handleAddSecondaryTrack = async () => {
    const newClip = await onAddClip();
    if (!newClip) return;

    onTracksUpdate({
      ...tracks,
      secondary: [
        ...tracks.secondary,
        {
          id: Math.random().toString(),
          clips: [{
            ...newClip,
            startFrame: 0,
            endFrame: totalFrames / 2
          }]
        }
      ]
    });
  };

  const handleAddClip = async (trackId: string) => {
    const newClip = await onAddClip();
    if (!newClip) return;

    onTracksUpdate({
      ...tracks,
      secondary: tracks.secondary.map(track => {
        if (track.id === trackId) {
          return {
            ...track,
            clips: [...track.clips, {
              ...newClip,
              startFrame: 0,
              endFrame: totalFrames / 2
            }]
          };
        }
        return track;
      })
    });
  };

  const handleClipDrag = (e: React.MouseEvent) => {
    if (!draggingClip || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const framePosition = Math.round((x / rect.width) * totalFrames);

    onTracksUpdate({
      ...tracks,
      secondary: tracks.secondary.map(track => {
        if (track.id === draggingClip.trackId) {
          return {
            ...track,
            clips: track.clips.map(clip => {
              if (clip.id === draggingClip.clipId) {
                const duration = (clip.endFrame || 0) - (clip.startFrame || 0);

                switch (draggingClip.type) {
                  case 'start':
                    return {
                      ...clip,
                      startFrame: Math.max(0, Math.min(framePosition, (clip.endFrame || totalFrames) - 1))
                    };
                  case 'end':
                    return {
                      ...clip,
                      endFrame: Math.max((clip.startFrame || 0) + 1, Math.min(framePosition, totalFrames))
                    };
                  case 'move':
                    const newStart = Math.max(0, Math.min(framePosition, totalFrames - duration));
                    return {
                      ...clip,
                      startFrame: newStart,
                      endFrame: newStart + duration
                    };
                }
              }
              return clip;
            })
          };
        }
        return track;
      })
    });
  };

  return (
    <div className="space-y-4">
      {/* Primary Track */}
      {tracks.primary && (
        <div className="bg-[#eee8d5] rounded-lg p-3 flex items-center gap-3">
          <div className="w-16 h-9 bg-black rounded overflow-hidden flex-shrink-0">
            <video
              src={tracks.primary.media.url}
              className="w-full h-full object-cover"
              muted
              loop
              onMouseEnter={e => e.currentTarget.play()}
              onMouseLeave={e => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#657b83] font-medium">
                {tracks.primary.media.name}
              </span>
              <span className="px-2 py-1 text-xs rounded bg-green-500 text-white">
                Primary
              </span>
            </div>
            <div className="h-2 bg-[#93a1a1] rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Secondary Tracks */}
      <div className="space-y-2">
        {tracks.secondary && tracks.secondary.length > 0 ? (
          tracks.secondary.map(track => (
            <div key={track.id} className="bg-[#eee8d5] rounded-lg p-3">
              <div
                ref={timelineRef}
                className="relative h-12 bg-[#93a1a1] rounded overflow-hidden"
                onMouseMove={handleClipDrag}
                onMouseUp={() => setDraggingClip(null)}
                onMouseLeave={() => setDraggingClip(null)}
              >
                {/* Clips */}
                {track.clips.map(clip => (
                  <div
                    key={clip.id}
                    className="absolute top-0 h-full group"
                    style={{
                      left: `${((clip.startFrame || 0) / totalFrames) * 100}%`,
                      width: `${(((clip.endFrame || totalFrames) - (clip.startFrame || 0)) / totalFrames) * 100}%`
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
                      {/* Drag Handles */}
                      <div
                        className="absolute left-0 w-1 h-full bg-green-600 cursor-ew-resize hover:bg-green-700"
                        onMouseDown={() => setDraggingClip({ trackId: track.id, clipId: clip.id, type: 'start' })}
                      />
                      <div
                        className="absolute right-0 w-1 h-full bg-green-600 cursor-ew-resize hover:bg-green-700"
                        onMouseDown={() => setDraggingClip({ trackId: track.id, clipId: clip.id, type: 'end' })}
                      />
                      <div
                        className="absolute inset-2 cursor-move"
                        onMouseDown={() => setDraggingClip({ trackId: track.id, clipId: clip.id, type: 'move' })}
                      />
                    </div>
                  </div>
                ))}

                {/* Playhead */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-white shadow-sm pointer-events-none"
                  style={{
                    left: `${(currentFrame / totalFrames) * 100}%`,
                    transform: 'translateX(-50%)'
                  }}
                />
              </div>

              {/* Add Clip Button */}
              <button
                onClick={() => handleAddClip(track.id)}
                className="mt-2 w-full py-1 px-2 text-sm bg-[#93a1a1] text-[#fdf6e3] hover:bg-[#657b83] rounded transition-colors"
              >
                Add Clip
              </button>
            </div>
          ))
        ) : (
          <div className="text-[#657b83]">No secondary tracks</div>
        )}
      </div>

      {/* Add Track Button */}
      <button
        onClick={handleAddSecondaryTrack}
        className="w-full py-2 px-4 bg-[#eee8d5] hover:bg-[#93a1a1] text-[#657b83] hover:text-[#fdf6e3] rounded-lg transition-colors"
      >
        Add Secondary Track
      </button>
    </div>
  );
};

export default MediaTrackEditor;
