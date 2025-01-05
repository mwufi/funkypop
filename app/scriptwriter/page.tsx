'use client';

import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { TimingUtils } from './utils';
import { Message, MessageData, MessageWithTiming } from './Message';

const MESSAGES: MessageData[] = [
    { type: 'grayMessage', text: "yo fam, u hear bout that lit af party this weekend? 🔥🎉", showTime: true },
    { type: 'blueMessage', text: "omg yesss! the one w/ the sick beats and laser show, rite?" },
    { type: 'grayMessage', text: "fr fr! it's gonna be straight fire, no cap 🚫🧢", delay: 30 },
    { type: 'blueMessage', text: "i'm so hyped! heard they're doing a fit check contest too 👀", delay: 30 },
    { type: 'blueMessage', text: "and bruh, the food trucks? gonna be bussin fr 🍔🌮", delay: 30 },
    { type: 'grayMessage', text: "plus first 100 get that vip drip. we gotta roll up early, deadass ⏰", delay: 30 },
];

const MyComposition = ({ bgImage = false, speedMultiplier = 1, scrollSpeed = 0.5 }) => {
    const timingUtils = new TimingUtils(speedMultiplier);

    // Calculate message timings
    const messagesWithDelays = MESSAGES.reduce<MessageWithTiming[]>((acc, msg, i) => {
        const prevMessage = acc[i - 1];
        const messageWithTiming = timingUtils.calculateMessageTiming(msg, i, prevMessage);
        return [...acc, messageWithTiming];
    }, []);

    // Group messages
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

    const lastBlueMessageIndex = messagesWithDelays
        .map((msg, i) => ({ type: msg.type, index: i }))
        .filter(msg => msg.type === 'blueMessage')
        .pop()?.index;

    return (
        <AbsoluteFill style={{
            backgroundColor: 'white',
            fontFamily: 'SF Pro',
        }}>
            <div style={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '1rem',
                gap: '0.5rem',
                overflowY: 'hidden',
                transform: `translateY(${-scrollSpeed * 1000}px)`,
            }}>
                {messageGroups.map((group, groupIndex) => (
                    <div key={groupIndex} style={{
                        marginBottom: '1.6rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.2rem',
                    }}>
                        {group.messages.map((msg: any, msgIndex: number) => (
                            <Message
                                key={msgIndex}
                                {...msg}
                                timingUtils={timingUtils}
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
    const [speed, setSpeed] = useState(1);
    const [scrollSpeed, setScrollSpeed] = useState(0.5);

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
            padding: '40px',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
            }}>
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#333',
                }}>
                    Message Video Controls
                </h1>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <label style={{ fontSize: '14px', width: '80px' }} htmlFor="speed">Speed:</label>
                        <input
                            id="speed"
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            style={{
                                width: '200px',
                            }}
                        />
                        <span style={{ fontSize: '14px', minWidth: '40px' }}>{speed}x</span>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <label style={{ fontSize: '14px', width: '80px' }} htmlFor="scroll">Scroll:</label>
                        <input
                            id="scroll"
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={scrollSpeed}
                            onChange={(e) => setScrollSpeed(Number(e.target.value))}
                            style={{
                                width: '200px',
                            }}
                        />
                        <span style={{ fontSize: '14px', minWidth: '40px' }}>{Math.round(scrollSpeed * 100)}%</span>
                    </div>
                </div>
            </div>

            <div style={{
                width: '400px',
                aspectRatio: '9/16',
                backgroundColor: 'black',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}>
                <Player
                    component={MyComposition}
                    durationInFrames={360}
                    fps={30}
                    compositionWidth={1080}
                    compositionHeight={1920}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    controls
                    inputProps={{
                        speedMultiplier: speed,
                        scrollSpeed: scrollSpeed
                    }}
                />
            </div>
        </div>
    );
}