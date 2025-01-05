import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { GRAY_BUBBLE, BLUE_BUBBLE } from './styles';
import { TypingIndicator } from './TypingIndicator';
import { TimingUtils } from './utils';

export interface MessageData {
    type: 'grayMessage' | 'blueMessage';
    text: string;
    showTime?: boolean;
    delay?: number;
}

export interface MessageWithTiming extends MessageData {
    delay: number;
    messageDelay: number;
    index: number;
}

interface MessageProps extends MessageWithTiming {
    isPartOfGroup?: boolean;
    showDelivered?: boolean;
    timingUtils: TimingUtils;
}

export const Message = ({ 
    type, 
    text, 
    messageDelay, 
    delay = 0, 
    isPartOfGroup, 
    showDelivered, 
    showTime, 
    timingUtils 
}: MessageProps) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const showTyping = type === 'grayMessage' && delay > timingUtils.TYPING_THRESHOLD;

    if (frame < messageDelay) {
        return null;
    }

    // Show typing indicator if delay is longer than standard
    if (showTyping && frame >= delay && frame < messageDelay) {
        return <TypingIndicator />;
    }

    const scale = spring({
        frame: frame - messageDelay,
        from: 0.8,
        to: 1,
        fps,
        durationInFrames: 10,
    });

    const opacity = spring({
        frame: frame - messageDelay,
        from: 0,
        to: 1,
        fps,
        durationInFrames: 10,
    });

    return (
        <>
            <div style={{
                ...(type === 'blueMessage' ? BLUE_BUBBLE : GRAY_BUBBLE),
                opacity,
                transform: `scale(${scale})`,
            }}>
                {text}
            </div>
            {showDelivered && (
                <div style={{
                    fontSize: '1.4rem',
                    color: '#86868B',
                    textAlign: 'right' as const,
                    marginRight: '7%',
                    marginTop: '0.4rem',
                }}>
                    Delivered
                </div>
            )}
            {showTime && (
                <div style={{
                    fontSize: '1.6rem',
                    color: '#86868B',
                    marginBottom: '2.4rem',
                    marginTop: '1.2rem',
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                    textAlign: 'center' as const,
                }}>
                    {new Date().toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    })}
                </div>
            )}
        </>
    );
};
