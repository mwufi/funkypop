import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont();

interface CinematicTitleProps {
    text: string;
    startFrame?: number;
    endFrame?: number;
}

export const CinematicTitle: React.FC<CinematicTitleProps> = ({
    text,
    startFrame = 0,
    endFrame = 90,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Calculate fade in/out progress
    const fadeInDuration = fps; // 1 second fade in
    const fadeOutDuration = fps; // 1 second fade out
    const fadeOutStart = endFrame - fadeOutDuration;

    const opacity = interpolate(
        frame,
        [startFrame, startFrame + fadeInDuration, fadeOutStart, endFrame],
        [0, 1, 1, 0],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Enhanced scale and y-position animation
    const scale = interpolate(
        frame,
        [startFrame, startFrame + fadeInDuration],
        [1.2, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    const yOffset = interpolate(
        frame,
        [startFrame, startFrame + fadeInDuration],
        [30, 0],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    // Letter spacing animation
    const letterSpacing = interpolate(
        frame,
        [startFrame, startFrame + fadeInDuration],
        [8, 2],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        }
    );

    return (
        <AbsoluteFill
            style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    fontFamily,
                    fontSize: '72px',
                    fontWeight: '300', // Light
                    fontStyle: 'italic',
                    color: 'white',
                    opacity,
                    transform: `translateY(${yOffset}px) scale(${scale})`,
                    textAlign: 'center',
                    maxWidth: '90%',
                    letterSpacing: `${letterSpacing}px`,
                    textShadow: '0 4px 12px rgba(0, 0, 0, 0.5), 0 8px 24px rgba(0, 0, 0, 0.3)',
                }}
            >
                {text}
            </div>
        </AbsoluteFill>
    );
}; 