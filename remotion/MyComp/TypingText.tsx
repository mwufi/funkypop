import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { loadFont } from "@remotion/google-fonts/DMSerifText";

const { fontFamily } = loadFont();

interface TypingTextProps {
    text: string;
    startFrame?: number;
}

export const TypingText: React.FC<TypingTextProps> = ({
    text,
    startFrame = 0,
}) => {
    const frame = useCurrentFrame();
    const adjustedFrame = Math.max(0, frame - startFrame);

    // Characters to show based on frame
    const charactersToShow = interpolate(
        adjustedFrame,
        [0, text.length * 3], // 3 frames per character for a nice typing speed
        [0, text.length],
        {
            extrapolateRight: 'clamp',
            extrapolateLeft: 'clamp',
        }
    );

    // Add blinking cursor effect
    const cursorOpacity = interpolate(
        adjustedFrame % 30,
        [0, 15, 16, 30],
        [1, 1, 0, 0],
        {
            extrapolateRight: 'clamp',
            extrapolateLeft: 'clamp',
        }
    );

    return (
        <AbsoluteFill
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#000000',
            }}
        >
            <div
                style={{
                    fontFamily,
                    fontSize: '72px',
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative',
                    letterSpacing: '1px',
                }}
            >
                {text.slice(0, Math.floor(charactersToShow))}
                <span
                    style={{
                        opacity: cursorOpacity,
                        color: 'white',
                        marginLeft: '2px',
                    }}
                >
                    |
                </span>
            </div>
        </AbsoluteFill>
    );
}; 