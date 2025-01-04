import React from 'react';

interface MediaTrack {
    id: string;
    name: string;
    url: string;
    type: 'video' | 'image';
}

interface MediaTracksListProps {
    tracks: MediaTrack[];
    onAddTrack: () => void;
}

export const MediaTracksList: React.FC<MediaTracksListProps> = ({
    tracks,
    onAddTrack
}) => {
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

                        {/* Track Name */}
                        <span className="text-[#657b83] group-hover:text-[#fdf6e3] font-medium">
                            {track.name}
                        </span>

                        {/* Actions */}
                        <div className="ml-auto flex gap-2">
                            <button
                                className="text-[#657b83] hover:text-[#dc322f] p-1 rounded"
                                title="Remove track"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Track Button */}
            <button
                onClick={onAddTrack}
                className="w-full py-2 px-4 rounded-lg border-2 border-dashed border-[#93a1a1] text-[#93a1a1] hover:border-[#268bd2] hover:text-[#268bd2] transition-colors flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                </svg>
                Add Media Track
            </button>
        </div>
    );
}; 