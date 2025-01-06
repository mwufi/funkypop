import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import React from 'react';

interface AnimationProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    from?: number;
    to?: number;
}

export const ScaleIn: React.FC<AnimationProps> = ({ 
    children, 
    delay = 0,
    duration = 15,
    from = 0.95,
    to = 1
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    if (frame < delay) {
        return null;
    }

    const scale = spring({
        frame: frame - delay,
        from,
        to,
        fps,
        durationInFrames: duration,
        config: {
            damping: 15,
            mass: 0.5,
            stiffness: 100,
        }
    });

    return (
        <div style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'left center'
        }}>
            {children}
        </div>
    );
};
