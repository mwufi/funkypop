import React, { useRef, useEffect, useState } from 'react';
import { Project, BaseComponent } from '@/types/editor';

interface TimelineProps {
    project: Project;
    onProjectUpdate: (project: Project) => void;
    selectedLayerId: string | null;
    onLayerSelect: (layerId: string | null) => void;
}

const TIMELINE_SCALE = 30; // pixels per frame
const TRACK_HEIGHT = 32; // Reduced from 40
const HEADER_HEIGHT = 40; // Increased from 30 to accommodate timestamps better

export function Timeline({ project, onProjectUpdate, selectedLayerId, onLayerSelect }: TimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragComponent, setDragComponent] = useState<{ id: string; startFrame: number } | null>(null);

    const timelineWidth = project.duration * TIMELINE_SCALE;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollLeft(e.currentTarget.scrollLeft);
    };

    const handleTimelineClick = (e: React.MouseEvent) => {
        if (!timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left + containerRef.current!.scrollLeft;
        const frame = Math.floor(x / TIMELINE_SCALE);

        // Update project time
        onProjectUpdate({
            ...project,
            currentTime: Math.max(0, Math.min(frame, project.duration))
        });
    };

    const formatTime = (frames: number) => {
        const seconds = frames / project.fps;
        const mm = Math.floor(seconds / 60);
        const ss = Math.floor(seconds % 60);
        const ff = frames % project.fps;
        return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}:${ff.toString().padStart(2, '0')}`;
    };

    const handleMouseDown = (e: React.MouseEvent, component: BaseComponent) => {
        if (e.button !== 0) return; // Only handle left click
        setIsDragging(true);
        setDragStartX(e.clientX);
        setDragComponent({ id: component.id, startFrame: component.timeRange.start });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !dragComponent) return;

        const deltaX = e.clientX - dragStartX;
        const deltaFrames = Math.round(deltaX / TIMELINE_SCALE);

        if (deltaFrames !== 0) {
            const updatedLayers = project.layers.map(layer => ({
                ...layer,
                components: layer.components.map(comp => {
                    if (comp.id === dragComponent.id) {
                        return {
                            ...comp,
                            timeRange: {
                                ...comp.timeRange,
                                start: Math.max(0, dragComponent.startFrame + deltaFrames)
                            }
                        };
                    }
                    return comp;
                })
            }));

            onProjectUpdate({ ...project, layers: updatedLayers });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragComponent(null);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mouseup', handleMouseUp);
            return () => document.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isDragging]);

    const renderTimelineRuler = () => {
        const frameMarkers = [];
        const secondMarkers = [];
        const totalFrames = project.duration;

        for (let i = 0; i <= totalFrames; i++) {
            if (i % project.fps === 0) {
                const seconds = i / project.fps;
                secondMarkers.push(
                    <div
                        key={`s-${i}`}
                        className="absolute h-4 border-l border-gray-500"
                        style={{ left: i * TIMELINE_SCALE }}
                    >
                        <span className="absolute -top-8 text-xs transform -translate-x-1/2 whitespace-nowrap text-gray-400">
                            {formatTime(i)}
                        </span>
                    </div>
                );
            } else if (i % 5 === 0) {
                frameMarkers.push(
                    <div
                        key={`f-${i}`}
                        className="absolute h-2 border-l border-gray-600"
                        style={{ left: i * TIMELINE_SCALE }}
                    />
                );
            }
        }

        return (
            <div className="h-10 relative border-b border-gray-700 mt-8">
                {frameMarkers}
                {secondMarkers}
            </div>
        );
    };

    const renderPlayhead = () => {
        return (
            <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
                style={{ left: project.currentTime * TIMELINE_SCALE }}
            >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xs text-red-500 whitespace-nowrap">
                    {formatTime(project.currentTime)}
                </div>
            </div>
        );
    };

    const getComponentColor = (type: string) => {
        switch (type) {
            case 'text': return 'bg-blue-500';
            case 'shape': return 'bg-green-500';
            case 'transition': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-900">
            <div
                ref={containerRef}
                className="flex-1 overflow-x-auto overflow-y-auto"
                onScroll={handleScroll}
                onMouseMove={handleMouseMove}
            >
                <div
                    ref={timelineRef}
                    className="relative"
                    style={{
                        width: timelineWidth,
                        minHeight: project.layers.length * TRACK_HEIGHT + HEADER_HEIGHT
                    }}
                    onClick={handleTimelineClick}
                >
                    {renderTimelineRuler()}
                    {renderPlayhead()}

                    {project.layers.map((layer, index) => (
                        <div
                            key={layer.id}
                            className={`h-${TRACK_HEIGHT} relative border-b border-gray-700 ${selectedLayerId === layer.id ? 'bg-gray-800' : ''
                                }`}
                            onClick={() => onLayerSelect(layer.id)}
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gray-800 border-r border-gray-700 flex items-center px-2">
                                <span className="truncate">{layer.name}</span>
                            </div>
                            <div className="ml-24 h-full relative">
                                {layer.components.map(component => (
                                    <div
                                        key={component.id}
                                        className={`absolute top-1 h-[calc(100%-8px)] rounded ${getComponentColor(
                                            component.type
                                        )} cursor-move`}
                                        style={{
                                            left: component.timeRange.start * TIMELINE_SCALE,
                                            width: component.timeRange.duration * TIMELINE_SCALE,
                                        }}
                                        onMouseDown={(e) => handleMouseDown(e, component)}
                                    >
                                        <div className="px-2 truncate text-xs">
                                            {component.type}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 