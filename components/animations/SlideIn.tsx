import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import React from 'react';

type Direction = 'left' | 'right' | 'up' | 'down';

interface AnimationProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    direction?: Direction;
    distance?: number;
}

export const SlideIn: React.FC<AnimationProps> = ({ 
    children, 
    delay = 0,
    duration = 15,
    direction = 'left',
    distance = 50
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    if (frame < delay) {
        return null;
    }

    const progress = spring({
        frame: frame - delay,
        from: 0,
        to: 1,
        fps,
        durationInFrames: duration,
        config: {
            damping: 20,
            mass: 0.6,
            stiffness: 120,
            overshootClamping: true
        }
    });

    const getTransform = () => {
        const offset = distance * (1 - progress);
        switch (direction) {
            case 'left':
                return `translateX(${-offset}px)`;
            case 'right':
                return `translateX(${offset}px)`;
            case 'up':
                return `translateY(${-offset}px)`;
            case 'down':
                return `translateY(${offset}px)`;
        }
    };

    return (
        <div style={{ 
            transform: getTransform(),
            opacity: progress,
        }}>
            {children}
        </div>
    );
};
