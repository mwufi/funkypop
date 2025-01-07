"use client";

import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { CinematicTitle } from './CinematicTitle';

interface CinemaProps {
    title: string;
}

export const Cinema: React.FC<CinemaProps> = ({ title }) => {
    const { durationInFrames } = useVideoConfig();

    return (
        <AbsoluteFill style={{ backgroundColor: '#000000' }}>
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="/image_2.png"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        filter: 'brightness(0.7)',
                    }}
                    alt="Background"
                />
            </div>

            {/* Cinematic Title */}
            <Sequence from={0} durationInFrames={durationInFrames}>
                <CinematicTitle
                    text={title}
                    startFrame={0}
                    endFrame={durationInFrames}
                />
            </Sequence>
        </AbsoluteFill>
    );
}; 