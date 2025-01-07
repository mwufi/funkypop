// Basic types for timeline positioning
export interface TimeRange {
    start: number;  // Start time in frames
    duration: number;  // Duration in frames
}

// Base component that all visual elements inherit from
export interface BaseComponent {
    id: string;
    type: 'text' | 'shape' | 'image' | 'video' | 'audio' | 'transition';
    timeRange: TimeRange;
    zIndex: number;
    // Optional trim settings for media components
    trim?: {
        start: number;  // Start time in source media
        end: number;    // End time in source media
    };
}

// Text component for titles, subtitles, and other text elements
export interface TextComponent extends BaseComponent {
    type: 'text';
    content: string;
    style: {
        fontSize: number;
        fontFamily: string;
        color: string;
        position: { x: number; y: number };
        opacity: number;
        // Text effects
        shadowColor?: string;
        shadowBlur?: number;
        shadowOffset?: { x: number; y: number };
        strokeWidth?: number;
        strokeColor?: string;
        // Background and container styles
        backgroundColor?: string;
        padding?: number;
        borderRadius?: number;
    };
    animation?: {
        type: 'fade' | 'slide' | 'type' | 'custom';
        duration: number;
        easing: string;
        params?: Record<string, any>;
    };
}

// Shape component for basic geometric shapes and masks
export interface ShapeComponent extends BaseComponent {
    type: 'shape';
    shapeType: 'rectangle' | 'circle' | 'line' | 'polygon';
    properties: {
        position: { x: number; y: number };
        size: { width: number; height: number };
        color: string;
        opacity: number;
        rotation?: number;
        points?: Array<{ x: number; y: number }>;  // For polygon shapes
        borderRadius?: number;  // For rectangles
        borderWidth?: number;
        borderColor?: string;
    };
}

// Media component for images and videos
export interface MediaComponent extends BaseComponent {
    type: 'image' | 'video';
    source: string;  // URL or file path
    properties: {
        position: { x: number; y: number };
        size: { width: number; height: number };
        opacity: number;
        rotation?: number;
        scale?: number;
        fit: 'contain' | 'cover' | 'fill';
    };
    filters?: {
        brightness?: number;
        contrast?: number;
        saturation?: number;
        hue?: number;
        blur?: number;
        grayscale?: boolean;
    };
}

// Audio component for sound tracks and effects
export interface AudioComponent extends BaseComponent {
    type: 'audio';
    source: string;
    properties: {
        volume: number;
        muted: boolean;
        loop: boolean;
        fadeIn?: number;  // Duration in frames
        fadeOut?: number;  // Duration in frames
    };
    effects?: {
        equalizer?: Array<{ frequency: number; gain: number }>;
        reverb?: { amount: number; decay: number };
        compression?: { threshold: number; ratio: number };
    };
}

// Transition component for layer transitions
export interface TransitionComponent extends BaseComponent {
    type: 'transition';
    transitionType: 'fade' | 'wipe' | 'slide' | 'dissolve' | 'custom';
    properties: {
        direction?: 'left' | 'right' | 'up' | 'down';
        smoothness?: number;
        pattern?: string;  // For custom transitions
    };
}

// Layer structure
export interface Layer {
    id: string;
    name: string;
    isVisible: boolean;
    isLocked: boolean;
    components: Array<TextComponent | ShapeComponent | MediaComponent | AudioComponent | TransitionComponent>;
}

// Project structure
export interface Project {
    id: string;
    name: string;
    dimensions: {
        width: number;
        height: number;
    };
    fps: number;
    duration: number;  // Total duration in frames
    layers: Layer[];
    currentTime: number;  // Current playhead position
    // Project-wide settings
    settings?: {
        backgroundColor: string;
        audioSampleRate: number;
        renderQuality: 'draft' | 'preview' | 'final';
    };
} 