import React, { useState, useRef } from 'react';

interface MediaTrack {
    id: string;
    name: string;
    url: string;
    type: 'video' | 'image';
    startFrame: number;
    endFrame: number;
    isPrimary: boolean;
}

interface MediaTracksListProps {
    tracks: MediaTrack[];
    onAddTrack: () => void;
    onTrackUpdate: (updatedTrack: MediaTrack) => void;
    onPrimaryChange: (trackId: string) => void;
    currentFrame: number;
}

export const MediaTracksList: React.FC<MediaTracksListProps> = ({
    tracks,
    onAddTrack,
    onTrackUpdate,
    onPrimaryChange,
    currentFrame
}) => {
    const [draggingType, setDraggingType] = useState<'start' | 'end' | 'move' | null>(null);
    const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
    const trackContainerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (
        e: React.MouseEvent,
        trackId: string,
        type: 'start' | 'end' | 'move'
    ) => {
        setDraggingType(type);
        setActiveTrackId(trackId);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingType || !activeTrackId || !trackContainerRef.current) return;

        const track = tracks.find(t => t.id === activeTrackId);
        if (!track) return;

        const rect = trackContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const framePosition = Math.round((x / rect.width) * 300); // Using 300 frames as default
        
        const updatedTrack = { ...track };
        
        switch (draggingType) {
            case 'start':
                updatedTrack.startFrame = Math.max(0, Math.min(framePosition, track.endFrame - 1));
                break;
            case 'end':
                updatedTrack.endFrame = Math.max(track.startFrame + 1, Math.min(framePosition, 300));
                break;
            case 'move':
                const duration = track.endFrame - track.startFrame;
                const newStart = Math.max(0, Math.min(framePosition, 300 - duration));
                updatedTrack.startFrame = newStart;
                updatedTrack.endFrame = newStart + duration;
                break;
        }

        onTrackUpdate(updatedTrack);
    };

    const handleMouseUp = () => {
        setDraggingType(null);
        setActiveTrackId(null);
    };

    return (
        <div className="space-y-3">
            {/* Track List */}
            <div className="space-y-2">
                {tracks.map((track) => (
                    <div
                        key={track.id}
                        className="bg-[#eee8d5] rounded-lg p-3 flex items-center gap-3 group hover:bg-[#93a1a1] transition-colors"
                    >
                        {/* Preview Thumbnail */}
                        <div className="w-16 h-9 bg-black rounded overflow-hidden flex-shrink-0">
                            {track.type === 'video' && (
                                <video
                                    src={track.url}
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    onMouseEnter={e => e.currentTarget.play()}
                                    onMouseLeave={e => {
                                        e.currentTarget.pause();
                                        e.currentTarget.currentTime = 0;
                                    }}
                                />
                            )}
                        </div>

                        {/* Track Name and Timeline */}
                        <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[#657b83] group-hover:text-[#fdf6e3] font-medium">
                                    {track.name}
                                </span>
                                <button
                                    className={`px-2 py-1 text-xs rounded ${
                                        track.isPrimary
                                            ? 'bg-green-500 text-white'
                                            : 'bg-[#93a1a1] text-[#fdf6e3] hover:bg-[#657b83]'
                                    }`}
                                    onClick={() => onPrimaryChange(track.id)}
                                >
                                    Primary
                                </button>
                            </div>
                            
                            {/* Timeline */}
                            <div
                                ref={trackContainerRef}
                                className="relative h-2 bg-[#93a1a1] rounded-full overflow-hidden cursor-pointer"
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {/* Active Segment */}
                                <div
                                    className="absolute h-full bg-green-500/50 hover:bg-green-500/70 transition-colors"
                                    style={{
                                        left: `${(track.startFrame / 300) * 100}%`,
                                        width: `${((track.endFrame - track.startFrame) / 300) * 100}%`,
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e, track.id, 'move')}
                                >
                                    {/* Drag Handles */}
                                    <div
                                        className="absolute left-0 w-1 h-full bg-green-600 cursor-ew-resize hover:bg-green-700"
                                        onMouseDown={(e) => handleMouseDown(e, track.id, 'start')}
                                    />
                                    <div
                                        className="absolute right-0 w-1 h-full bg-green-600 cursor-ew-resize hover:bg-green-700"
                                        onMouseDown={(e) => handleMouseDown(e, track.id, 'end')}
                                    />
                                </div>

                                {/* Playhead */}
                                <div
                                    className="absolute top-0 h-full w-0.5 bg-white shadow-sm pointer-events-none"
                                    style={{
                                        left: `${(currentFrame / 300) * 100}%`,
                                        transform: 'translateX(-50%)',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Track Button */}
            <button
                onClick={onAddTrack}
                className="w-full py-2 px-4 bg-[#eee8d5] hover:bg-[#93a1a1] text-[#657b83] hover:text-[#fdf6e3] rounded-lg transition-colors"
            >
                Add Media Track
            </button>
        </div>
    );
};