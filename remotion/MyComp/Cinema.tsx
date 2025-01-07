"use client";

import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { CinematicTitle } from './CinematicTitle';
import { TypingText } from './TypingText';

interface CinemaProps {
    title: string;
    titleSettings?: any;
}

export const Cinema: React.FC<CinemaProps> = ({ title, titleSettings }) => {
    const titleDuration = 90; // Duration of first scene
    const typingDuration = 120; // Duration of typing scene

    return (
        <AbsoluteFill style={{ backgroundColor: '#000000' }}>
            {/* First Scene - Title with Image */}
            <Sequence from={0} durationInFrames={titleDuration}>
                <div className="absolute inset-0">
                    <img
                        src="/image.png"
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

                <CinematicTitle
                    text={title}
                    startFrame={0}
                    endFrame={titleDuration}
                    titleSettings={titleSettings}
                />
            </Sequence>

            {/* Second Scene - Typing Effect */}
            <Sequence from={titleDuration} durationInFrames={typingDuration}>
                <TypingText
                    text="once upon a time...."
                    startFrame={0}
                />
            </Sequence>
        </AbsoluteFill>
    );
}; 