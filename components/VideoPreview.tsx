import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Player, PlayerRef } from "@remotion/player";
import { z } from "zod";
import { CompositionProps } from "@/types/constants";
import { MediaTracksList } from './MediaTracksList';

interface VideoPreviewProps {
    inputProps: z.infer<typeof CompositionProps>;
    durationInFrames: number;
    fps: number;
    height: number;
    width: number;
    component: React.ComponentType<any>;
}

type AspectRatio = "9:16" | "16:9" | "1:1" | "4:5";

const aspectRatios: Record<AspectRatio, { width: number; height: number }> = {
    "9:16": { width: 1080, height: 1920 },
    "16:9": { width: 1920, height: 1080 },
    "1:1": { width: 1080, height: 1080 },
    "4:5": { width: 1080, height: 1350 }
};

export const VideoPreview: React.FC<VideoPreviewProps> = ({
    inputProps,
    durationInFrames,
    fps,
    component,
}) => {
    const [selectedRatio, setSelectedRatio] = useState<AspectRatio>("9:16");
    const { width, height } = aspectRatios[selectedRatio];

    // Sample track for testing
    const [tracks, setTracks] = useState([
        {
            id: '1',
            name: 'forest.mp4',
            url: 'https://ynxmunrlesicnfibjctb.supabase.co/storage/v1/object/public/project-images/funkypop-public/forest.mp4?t=2025-01-04T22%3A36%3A21.098Z',
            type: 'video' as const,
        }
    ]);

    const [currentFrame, setCurrentFrame] = useState(0);
    const playerRef = useRef<PlayerRef>(null);

    // Update current frame
    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current) {
                setCurrentFrame(playerRef.current.getCurrentFrame());
            }
        }, 1000 / fps); // Update at the video's frame rate

        return () => clearInterval(interval);
    }, [fps]);

    const handleAddTrack = useCallback(() => {
        // TODO: Implement file selection
        console.log('Add track clicked');
    }, []);

    const handleTrackUpdate = useCallback((updatedTrack: any) => {
        const newTracks = tracks.map(track => 
            track.id === updatedTrack.id ? updatedTrack : track
        );
        setTracks(newTracks);
    }, [tracks]);

    const handlePrimaryChange = useCallback((trackId: string) => {
        setTracks(tracks => 
            tracks.map(track => ({
                ...track,
                isPrimary: track.id === trackId
            }))
        );
    }, []);

    // Combine the background video URL with other input props
    const combinedInputProps = useMemo(() => ({
        ...inputProps,
        backgroundVideo: tracks[0]?.url,
    }), [inputProps, tracks]);

    return (
        <div className="bg-[#fdf6e3] rounded-xl p-6 shadow-sm border border-[#eee8d5]">
            {/* Video Container */}
            <div className="relative rounded-lg overflow-hidden mb-4">
                <div className="flex items-center justify-center bg-[#eee8d5] rounded-lg p-8">
                    <div className={`
                        relative
                        ${selectedRatio === "9:16" ? "w-[320px]" :
                            selectedRatio === "16:9" ? "w-[640px]" :
                                selectedRatio === "1:1" ? "w-[480px]" :
                                    "w-[400px]"}
                        shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]
                        rounded-lg
                        overflow-hidden
                        transition-all
                        duration-300
                        hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.3)]
                    `}>
                        <div className={`
                            w-full
                            ${selectedRatio === "9:16" ? "aspect-[9/16]" :
                                selectedRatio === "16:9" ? "aspect-[16/9]" :
                                    selectedRatio === "1:1" ? "aspect-square" :
                                        "aspect-[4/5]"}
                        `}>
                            <Player
                                ref={playerRef}
                                component={component}
                                inputProps={combinedInputProps}
                                durationInFrames={durationInFrames}
                                fps={fps}
                                compositionHeight={height}
                                compositionWidth={width}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "0.5rem",
                                }}
                                controls
                                autoPlay
                                loop={true}
                                clickToPlay={false}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Tracks */}
            <div className="mb-4">
                <MediaTracksList
                    tracks={tracks}
                    onAddTrack={handleAddTrack}
                    onTrackUpdate={handleTrackUpdate}
                    onPrimaryChange={handlePrimaryChange}
                    currentFrame={currentFrame}
                />
            </div>

            {/* Controls */}
            <div className="space-y-4">
                {/* Aspect Ratio Selector */}
                <div className="flex gap-2 justify-center">
                    {(Object.keys(aspectRatios) as AspectRatio[]).map((ratio) => (
                        <button
                            key={ratio}
                            onClick={() => setSelectedRatio(ratio)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                ${selectedRatio === ratio
                                    ? "bg-[#268bd2] text-white hover:bg-[#2aa198]"
                                    : "bg-[#eee8d5] text-[#657b83] hover:bg-[#93a1a1] hover:text-[#fdf6e3]"
                                }`}
                        >
                            {ratio}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}; 