'use client';

import { Player } from '@remotion/player';
import { useEffect, useState } from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';

// Messages data - easy to edit
const MESSAGES = [
    { text: "Hey! 👋", isReceived: true, showTime: true },
    { text: "Hi there! How are you?", isReceived: false },
    { text: "I'm good! Just working on some cool projects", isReceived: true },
    { text: "Oh nice! What are you working on?", isReceived: false },
    { text: "Check out this cool TikTok", isReceived: true },
    { text: "I've been learning about video generation", isReceived: true },
    { text: "That's awesome! How did you make it?", isReceived: false },
    { text: "I made it with Remotion! 🎥", isReceived: false },
    { text: "It's a React-based video framework", isReceived: false, showTime: true },
];

const BASE_SIZE = '2.8rem';  // This will be our base unit for scaling

const MESSAGE_STYLE = {
    padding: '1.4rem 1.8rem',  // More padding
    borderRadius: '2.4rem',    // Even rounder!
    maxWidth: '70%',
    marginBottom: '0.4rem',
    fontSize: BASE_SIZE,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    lineHeight: 1.2,
    position: 'relative' as const,
};

// Modern iMessage has a slightly different blue
const BLUE_BUBBLE = {
    ...MESSAGE_STYLE,
    backgroundColor: '#0A84FF',  // Updated to latest iOS blue
    color: 'white',
    marginLeft: 'auto',
    marginRight: '5%',
};

const GRAY_BUBBLE = {
    ...MESSAGE_STYLE,
    backgroundColor: '#E9E9EB',
    color: 'black',
    marginRight: 'auto',
    marginLeft: '5%',
};

// Group styles for consecutive messages
const MESSAGE_GROUP_STYLE = {
    marginBottom: '1.6rem', // More space between groups
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.2rem',
};

const TIME_STYLE = {
    fontSize: '1.6rem',
    color: '#86868B',  // Updated to match iOS
    marginBottom: '2.4rem',
    marginTop: '1.2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    textAlign: 'center' as const,
};

const DELIVERED_STYLE = {
    fontSize: '1.4rem',
    color: '#86868B',  // Updated to match iOS
    textAlign: 'right' as const,
    marginRight: '7%',
    marginTop: '0.4rem',
};

interface MessageProps {
    text: string;
    delay: number;
    isReceived?: boolean;
    showTime?: boolean;
    isPartOfGroup?: boolean;
    showDelivered?: boolean;
}

const Message: React.FC<MessageProps> = ({ 
    text, 
    delay, 
    isReceived = false, 
    showTime = false,
    isPartOfGroup = false,
    showDelivered = false,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame: frame - delay,
        fps,
        config: {
            damping: 12,
        },
    });

    const bubbleStyle = {
        ...(isReceived ? GRAY_BUBBLE : BLUE_BUBBLE),
        transform: `scale(${scale})`,
        marginBottom: isPartOfGroup ? '0.2rem' : '0.8rem',
    };

    return (
        <div style={{ opacity: scale }}>
            <div style={bubbleStyle}>
                {text}
            </div>
            {showDelivered && (
                <div style={DELIVERED_STYLE}>
                    Delivered
                </div>
            )}
            {showTime && (
                <div style={TIME_STYLE}>
                    {new Date().toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    })}
                </div>
            )}
        </div>
    );
};

const MyComposition = ({ bgImage = false }) => {
    // Group messages by sender
    const messageGroups = MESSAGES.reduce((groups: any[], message, index) => {
        const prevMessage = MESSAGES[index - 1];
        const isPartOfGroup = prevMessage && prevMessage.isReceived === message.isReceived;
        
        if (isPartOfGroup) {
            groups[groups.length - 1].messages.push({...message, isPartOfGroup: true});
        } else {
            groups.push({
                isReceived: message.isReceived,
                messages: [{...message, isPartOfGroup: false}],
            });
        }
        return groups;
    }, []);

    // Find the last sent message for "Delivered" status
    const lastSentMessageIndex = MESSAGES.map((msg, i) => ({ ...msg, index: i }))
        .filter(msg => !msg.isReceived)
        .pop()?.index;

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
                padding: '5%',
                display: 'flex',
                flexDirection: 'column',
            }}>
                {messageGroups.map((group, groupIndex) => (
                    <div key={groupIndex} style={MESSAGE_GROUP_STYLE}>
                        {group.messages.map((msg: any, msgIndex: number) => {
                            const originalIndex = MESSAGES.findIndex(m => 
                                m.text === msg.text && m.isReceived === msg.isReceived
                            );
                            return (
                                <Message
                                    key={`${groupIndex}-${msgIndex}`}
                                    text={msg.text}
                                    delay={groupIndex * 20 + msgIndex * 15}  // Slower animations
                                    isReceived={msg.isReceived}
                                    showTime={msg.showTime}
                                    isPartOfGroup={msg.isPartOfGroup}
                                    showDelivered={originalIndex === lastSentMessageIndex}
                                />
                            );
                        })}
                    </div>
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
    const tiktokWidth = 360;
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
                    durationInFrames={180}  // Increased duration for more messages
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