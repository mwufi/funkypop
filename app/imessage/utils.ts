// Base timing constants (in frames)
const BASE_TIMING = {
    MIN_DELAY: 25,           // Minimum delay between messages (~0.83s)
    READING_BUFFER: 5,       // Extra frames to add to reading time (~0.17s)
    TYPING_THRESHOLD: 40,    // Show typing indicator if delay > this (~1.33s)
    CHARS_PER_SECOND: 75,    // Reading speed (characters per second)
    FPS: 30,                 // Frames per second
} as const;

// Get adjusted timing based on speed multiplier (0.5 = slower, 2 = faster)
export const getAdjustedTiming = (speedMultiplier: number = 1) => ({
    ...BASE_TIMING,
    MIN_DELAY: Math.round(BASE_TIMING.MIN_DELAY / speedMultiplier),
    READING_BUFFER: Math.round(BASE_TIMING.READING_BUFFER / speedMultiplier),
    TYPING_THRESHOLD: Math.round(BASE_TIMING.TYPING_THRESHOLD / speedMultiplier),
    CHARS_PER_SECOND: Math.round(BASE_TIMING.CHARS_PER_SECOND * speedMultiplier),
});

// Message types and interfaces
export type MessageType = 'blueMessage' | 'grayMessage';

export interface MessageData {
    type: MessageType;
    text: string;
    showTime?: boolean;
    delay?: number;  // Optional custom delay override
}

export interface MessageWithTiming extends MessageData {
    delay: number;      // Calculated total delay before this message
    customDelay: number; // Time to wait after previous message
    readingTime: number; // Time needed to read this message
    messageDelay: number;
    index: number;
}

/**
 * Utility functions for calculating message timing and animations
 */
export class TimingUtils {
    private MIN_DELAY = 25;
    private READING_BUFFER = 5;
    private TYPING_THRESHOLD = 40;
    private CHARS_PER_SECOND = 75;

    constructor(private speedMultiplier: number = 1) {}

    calculateMessageTiming(message: MessageData, index: number, prevMessage?: MessageWithTiming): MessageWithTiming {
        const baseDelay = prevMessage?.messageDelay || 0;
        const customDelay = message.delay || this.MIN_DELAY;
        const readingTime = Math.max(
            (message.text.length / this.CHARS_PER_SECOND) * 30,
            this.READING_BUFFER
        );

        const messageDelay = baseDelay + customDelay;

        return {
            ...message,
            delay: customDelay,
            messageDelay,
            index,
            readingTime
        };
    }
}
