"use client";

import { Player } from '@remotion/player';
import { Cinema } from '@/remotion/MyComp/Cinema';
import React, { useState, useEffect, useRef } from 'react';

const ASPECT_RATIOS = {
    'Cinematic (2.35:1)': 2.35,
    'Widescreen (16:9)': 1.77,
    'Standard (4:3)': 1.33,
    'Square (1:1)': 1,
    'Portrait (9:16)': 0.5625,
    'TikTok (9:19.5)': 0.461,
};

export default function CinemaPage() {
    const [aspectRatio, setAspectRatio] = useState<keyof typeof ASPECT_RATIOS>('Cinematic (2.35:1)');
    const ratio = ASPECT_RATIOS[aspectRatio];
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 1920, height: 817 });

    useEffect(() => {
        const updateDimensions = () => {
            if (!containerRef.current) return;

            const maxHeight = window.innerHeight * 0.65; // 75vh
            const maxWidth = window.innerWidth * 0.95;  // 95vw

            // Try setting by height first
            let height = maxHeight;
            let width = height * ratio;

            // If width exceeds max width, set by width instead
            if (width > maxWidth) {
                width = maxWidth;
                height = width / ratio;
            }

            setDimensions({
                width: Math.round(width),
                height: Math.round(height)
            });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [ratio]);

    return (
        <div className="min-h-screen bg-gray-700 p-8 flex flex-col items-center gap-8">
            {/* Controls */}
            <div className="flex justify-center gap-4">
                <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as keyof typeof ASPECT_RATIOS)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {Object.keys(ASPECT_RATIOS).map((ratio) => (
                        <option key={ratio} value={ratio}>
                            {ratio}
                        </option>
                    ))}
                </select>
            </div>

            {/* Player Container */}
            <div className="flex-1 flex items-center justify-center">
                <div
                    ref={containerRef}
                    style={{
                        width: dimensions.width,
                        height: dimensions.height,
                    }}
                    className="relative rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                    <Player
                        component={Cinema}
                        durationInFrames={90}
                        fps={30}
                        compositionWidth={dimensions.width}
                        compositionHeight={dimensions.height}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        controls
                        autoPlay
                        loop
                        inputProps={{
                            title: "Your Cinematic Title"
                        }}
                    />
                </div>
            </div>
        </div>
    );
} 