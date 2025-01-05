'use client';

import { Player } from '@remotion/player';
import { useEffect, useState } from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';

const MESSAGE_STYLE = {
    padding: '24px 32px',
    borderRadius: '30px',
    maxWidth: '75%',
    marginBottom: '24px',
    fontSize: '64px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    lineHeight: '1.2',
};

const BLUE_BUBBLE = {
    ...MESSAGE_STYLE,
    backgroundColor: '#007AFF',
    color: 'white',
    marginLeft: 'auto',
};

const GRAY_BUBBLE = {
    ...MESSAGE_STYLE,
    backgroundColor: '#E9E9EB',
    color: 'black',
    marginRight: 'auto',
};

interface MessageProps {
    text: string;
    delay: number;
    isReceived?: boolean;
}

const Message: React.FC<MessageProps> = ({ text, delay, isReceived = false }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame: frame - delay,
        fps,
        config: {
            damping: 12,
        },
    });

    return (
        <div
            style={{
                ...(isReceived ? GRAY_BUBBLE : BLUE_BUBBLE),
                opacity: scale,
                transform: `scale(${scale})`,
            }}
        >
            {text}
        </div>
    );
};

const MyComposition = ({ bgImage = false }) => {
    const messages = [
        { text: "Hey! 👋", isReceived: true },
        { text: "Hi there! How are you?", isReceived: false },
        { text: "Check out this cool TikTok", isReceived: true },
        { text: "I made it with Remotion! 🎥", isReceived: false },
    ];

    return (
        <AbsoluteFill style={{ backgroundColor: 'white' }}>
            {bgImage && (
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${staticFile('image.png')})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.5,
                }} />
            )}
            <div style={{
                position: 'relative',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
            }}>
                {messages.map((msg, index) => (
                    <Message
                        key={index}
                        text={msg.text}
                        delay={index * 15}
                        isReceived={msg.isReceived}
                    />
                ))}
            </div>
        </AbsoluteFill>
    );
};

export default function ScriptWriter() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // TikTok aspect ratio is 9:16
    const tiktokWidth = 360; // This will make it a reasonable size on desktop
    const tiktokHeight = (tiktokWidth * 16) / 9;

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                width: tiktokWidth,
                height: tiktokHeight,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderRadius: '8px',
                overflow: 'hidden',
            }}>
                <Player
                    component={MyComposition}
                    durationInFrames={120}
                    fps={30}
                    compositionWidth={1080}
                    compositionHeight={1920}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    controls
                />
            </div>
        </div>
    );
}