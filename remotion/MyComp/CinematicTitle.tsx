"use client";

import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadDMSerifText } from "@remotion/google-fonts/DMSerifText";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";

// Load all fonts
const fonts = {
    montserrat: loadMontserrat(),
    dmseriftext: loadDMSerifText(),
    playfair: loadPlayfair(),
    cinzel: loadCinzel(),
};

const defaultSettings = {
    font: 'montserrat' as keyof typeof fonts,
    size: 100,
    shadowBlur: 20,
    shadowOpacity: 0.3,
    x: 50,
    y: 50,
};

interface CinematicTitleProps {
    text: string;
    startFrame?: number;
    endFrame?: number;
    titleSettings?: Partial<typeof defaultSettings>;
}

export const CinematicTitle: React.FC<CinematicTitleProps> = ({
    text,
    startFrame = 0,
    endFrame = 90,
    titleSettings = {},
}) => {
    const frame = useCurrentFrame();
    const settings = { ...defaultSettings, ...titleSettings };

    // Calculate fade in/out progress
    const fadeInDuration = 30;
    const fadeOutDuration = 30;
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

    // Get the current font family
    const { fontFamily } = fonts[settings.font];

    // Calculate base font size (72px is our reference size for 100%)
    const fontSize = Math.round(72 * (settings.size / 100));

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
                    fontSize: `${fontSize}px`,
                    fontWeight: '300',
                    fontStyle: 'italic',
                    color: 'white',
                    opacity,
                    transform: `translate(${settings.x - 50}%, ${settings.y - 50}%) scale(${scale})`,
                    textAlign: 'center',
                    maxWidth: '90%',
                    position: 'absolute',
                    textShadow: `0 ${settings.shadowBlur}px ${settings.shadowBlur * 2}px rgba(0,0,0,${settings.shadowOpacity})`,
                }}
            >
                {text}
            </div>
        </AbsoluteFill>
    );
}; 