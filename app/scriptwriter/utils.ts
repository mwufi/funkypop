// Timing constants (in frames)
export const TIMING = {
    MIN_DELAY: 30,           // Minimum delay between messages
    READING_BUFFER: 5,      // Extra frames to add to reading time
    TYPING_THRESHOLD: 45,     // Show typing indicator if delay > this
    CHARS_PER_SECOND: 60,     // Reading speed (characters per second)
    FPS: 30,                  // Frames per second
} as const;

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
export const TimingUtils = {
    /**
     * Calculate time needed to read a message
     * @param text Message text
     * @returns Number of frames needed to read
     */
    calculateReadingTime(text: string): number {
        const charCount = text.length;
        const readingSeconds = charCount / TIMING.CHARS_PER_SECOND;
        return Math.ceil(readingSeconds * TIMING.FPS);
    },

    /**
     * Calculate delay for a message based on its position and content
     * @param message Current message
     * @param index Position in conversation
     * @param prevMessage Previous message (if any)
     * @returns Timing information for the message
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
            readingTime + TIMING.READING_BUFFER,
            TIMING.MIN_DELAY
        );
        console.log('baseDelay', baseDelay);
        console.log('customDelay', customDelay);

        return {
            ...message,
            delay: baseDelay,
            customDelay,
            readingTime,
        };
    }
};
