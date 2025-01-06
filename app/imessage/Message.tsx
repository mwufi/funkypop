import { useCurrentFrame } from 'remotion';
import { GRAY_BUBBLE, BLUE_BUBBLE } from './styles';
import { TypingIndicator } from './TypingIndicator';
import { TimingUtils } from './utils';
import { FadeIn, SlideIn } from '@/components/animations';

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
    const showTyping = type === 'grayMessage' && delay > timingUtils.TYPING_THRESHOLD;

    if (frame < messageDelay) {
        return null;
    }

    // Show typing indicator if delay is longer than standard
    if (showTyping && frame >= delay && frame < messageDelay) {
        return <TypingIndicator />;
    }

    return (
        <FadeIn delay={messageDelay} duration={20}>
            <SlideIn 
                delay={messageDelay} 
                duration={25}
                direction={type === 'blueMessage' ? 'right' : 'left'}
                distance={20}
            >
                <div style={{
                    ...(type === 'blueMessage' ? BLUE_BUBBLE : GRAY_BUBBLE),
                }}>
                    {text}
                </div>
                {showDelivered && (
                    <FadeIn delay={messageDelay + 10}>
                        <div style={{
                            fontSize: '1.6rem',
                            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                            color: '#86868B',
                            textAlign: 'right' as const,
                            marginRight: '7%',
                            marginTop: '0.4rem',
                        }}>
                            Delivered
                        </div>
                    </FadeIn>
                )}
                {showTime && (
                    <FadeIn delay={messageDelay + 5}>
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
                    </FadeIn>
                )}
            </SlideIn>
        </FadeIn>
    );
};
