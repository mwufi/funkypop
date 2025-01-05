'use client';

import { Player } from '@remotion/player';
import { useEffect, useState } from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { TIMING, TimingUtils, type MessageData, type MessageWithTiming } from './utils';

const MESSAGES: MessageData[] = [
    { type: 'grayMessage', text: "Hey, have you heard about that awesome new startup, Codeium? 🚀", showTime: true },
    { type: 'blueMessage', text: "Oh yeah! The AI-powered coding assistant, right? It's amazing!" },
    { type: 'grayMessage', text: "Exactly! It's revolutionizing how developers write code." },
    { type: 'blueMessage', text: "Totally! I've been using it and it's increased my productivity so much." },
    { type: 'grayMessage', text: "Same here! The code completions are incredibly accurate." },
    { type: 'grayMessage', text: "And it works with so many languages and frameworks out of the box." },
    { type: 'blueMessage', text: "True. What's your favorite feature? I love the instant documentation." },
    { type: 'grayMessage', text: "For me, it's the AI-powered code explanations. So helpful! 🤓" },
    { type: 'grayMessage', text: "Plus, their free tier is super generous. It's a game-changer for devs." },
];

const BASE_SIZE = '2.8rem';

const MESSAGE_STYLE = {
    padding: '1.4rem 1.8rem',
    borderRadius: '2.4rem',
    maxWidth: '70%',
    marginBottom: '0.4rem',
    fontSize: BASE_SIZE,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    lineHeight: 1.2,
    position: 'relative' as const,
};

const BLUE_BUBBLE = {
    ...MESSAGE_STYLE,
    backgroundColor: '#0A84FF',
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

const MESSAGE_GROUP_STYLE = {
    marginBottom: '1.6rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.2rem',
};

const TIME_STYLE = {
    fontSize: '1.6rem',
    color: '#86868B',
    marginBottom: '2.4rem',
    marginTop: '1.2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    textAlign: 'center' as const,
};

const DELIVERED_STYLE = {
    fontSize: '1.4rem',
    color: '#86868B',
    textAlign: 'right' as const,
    marginRight: '7%',
    marginTop: '0.4rem',
};

interface MessageProps extends MessageWithTiming {
    isPartOfGroup?: boolean;
    showDelivered?: boolean;
}

const Message: React.FC<MessageProps> = ({
    text,
    delay,
    type,
    customDelay,
    readingTime,
    showTime = false,
    isPartOfGroup = false,
    showDelivered = false,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Only show typing for gray messages with long delays
    const showTyping = type === 'grayMessage' && customDelay > TIMING.TYPING_THRESHOLD;
    const messageDelay = delay + customDelay;
    const scale = spring({
        frame: frame - messageDelay,
        fps,
        config: {
            damping: 12,
        },
    });

    const bubbleStyle = {
        ...(type === 'grayMessage' ? GRAY_BUBBLE : BLUE_BUBBLE),
        transform: `scale(${scale})`,
        marginBottom: isPartOfGroup ? '0.2rem' : '0.8rem',
    };

    // Show typing indicator if delay is longer than standard
    if (showTyping && frame >= delay && frame < messageDelay) {
        return (
            <div style={{
                ...GRAY_BUBBLE,
                width: 'auto',
                padding: '0.8rem 1.2rem',
                opacity: 1,
                transform: `scale(1)`,
            }}>
                <div style={{
                    display: 'flex',
                    gap: '0.4rem',
                    height: '1.2rem',
                    alignItems: 'center',
                }}>
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: '0.8rem',
                                height: '0.8rem',
                                borderRadius: '50%',
                                backgroundColor: '#86868B',
                                opacity: frame % 60 > i * 20 ? 1 : 0.4,
                                transition: 'opacity 0.2s',
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }

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
    // Calculate all message timings
    const messagesWithDelays = MESSAGES.reduce<MessageWithTiming[]>((acc, msg, i) => {
        const prevMessage = acc[i - 1];
        const messageWithTiming = TimingUtils.calculateMessageTiming(msg, i, prevMessage);
        return [...acc, messageWithTiming];
    }, []);

    // Group messages by type
    const messageGroups = messagesWithDelays.reduce((groups: any[], message) => {
        const prevGroup = groups[groups.length - 1];
        const isPartOfGroup = prevGroup && prevGroup.type === message.type;

        if (isPartOfGroup) {
            prevGroup.messages.push({ ...message, isPartOfGroup: true });
        } else {
            groups.push({
                type: message.type,
                messages: [{ ...message, isPartOfGroup: false }],
            });
        }
        return groups;
    }, []);

    // Find last blue message for "Delivered" status
    const lastBlueMessageIndex = messagesWithDelays
        .map((msg, i) => ({ ...msg, index: i }))
        .filter(msg => msg.type === 'blueMessage')
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
                        {group.messages.map((msg: any, msgIndex: number) => (
                            <Message
                                key={`${groupIndex}-${msgIndex}`}
                                text={msg.text}
                                delay={msg.delay}
                                type={msg.type}
                                customDelay={msg.customDelay}
                                readingTime={msg.readingTime}
                                showTime={msg.showTime}
                                isPartOfGroup={msg.isPartOfGroup}
                                showDelivered={msg.index === lastBlueMessageIndex}
                            />
                        ))}
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
                    durationInFrames={360}  // Increased for longer reading times
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