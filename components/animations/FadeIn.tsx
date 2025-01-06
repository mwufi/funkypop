import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import React from 'react';

interface AnimationProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
}

export const FadeIn: React.FC<AnimationProps> = ({ 
    children, 
    delay = 0,
    duration = 15 
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    if (frame < delay) {
        return null;
    }

    const opacity = spring({
        frame: frame - delay,
        from: 0,
        to: 1,
        fps,
        durationInFrames: duration,
        config: {
            damping: 15,
            mass: 0.5,
            stiffness: 100,
        }
    });

    return (
        <div style={{ opacity }}>
            {children}
        </div>
    );
};
