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
}

/**
 * Utility functions for calculating message timing and animations
 */
export class TimingUtils {
    private timing: typeof BASE_TIMING;

    constructor(speedMultiplier: number = 1) {
        this.timing = getAdjustedTiming(speedMultiplier);
    }

    /**
     * Calculate time needed to read a message
     */
    calculateReadingTime(text: string): number {
        const charCount = text.length;
        const readingSeconds = charCount / this.timing.CHARS_PER_SECOND;
        return Math.ceil(readingSeconds * this.timing.FPS);
    }

    /**
     * Calculate delay for a message based on its position and content
     */
    calculateMessageTiming(
        message: MessageData,
        index: number,
        prevMessage?: MessageWithTiming
    ): MessageWithTiming {
        const readingTime = this.calculateReadingTime(message.text);
        
        // First message appears immediately
        if (index === 0) {
            return {
                ...message,
                delay: 0,
                customDelay: 0,
                readingTime,
            };
        }

        // For subsequent messages, use max(readingTime + buffer, MIN_DELAY)
        const baseDelay = prevMessage!.delay + prevMessage!.customDelay;
        const customDelay = message.delay || Math.max(
            readingTime + this.timing.READING_BUFFER,
            this.timing.MIN_DELAY
        );

        return {
            ...message,
            delay: baseDelay,
            customDelay,
            readingTime,
        };
    }

    // Getter for timing constants
    get TIMING() {
        return this.timing;
    }
}
