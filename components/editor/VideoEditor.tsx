import React, { useRef, useEffect, useState } from 'react';
import { Player } from '@remotion/player';
import { Project, TextComponent, MediaComponent } from '@/types/editor';

interface VideoEditorProps {
    project: Project;
    onProjectUpdate: (project: Project) => void;
    selectedLayerId: string | null;
    onLayerSelect: (layerId: string | null) => void;
}

interface DragState {
    isDragging: boolean;
    componentId: string | null;
    startX: number;
    startY: number;
    originalX: number;
    originalY: number;
}

const VideoComposition: React.FC<VideoEditorProps> = ({ project, onProjectUpdate, selectedLayerId, onLayerSelect }) => {
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        componentId: null,
        startX: 0,
        startY: 0,
        originalX: 0,
        originalY: 0
    });

    const handleComponentClick = (e: React.MouseEvent, component: TextComponent | MediaComponent) => {
        e.stopPropagation();
        // Find the layer containing this component
        const layerId = project.layers.find(layer =>
            layer.components.some(comp => comp.id === component.id)
        )?.id;

        if (layerId) {
            onLayerSelect(layerId);
        }
    };

    const handleMouseDown = (e: React.MouseEvent, component: TextComponent | MediaComponent) => {
        e.stopPropagation();
        if (e.button !== 0) return; // Only handle left click

        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setDragState({
            isDragging: true,
            componentId: component.id,
            startX: x,
            startY: y,
            originalX: component.type === 'text'
                ? component.style.position.x
                : component.properties.position.x,
            originalY: component.type === 'text'
                ? component.style.position.y
                : component.properties.position.y
        });

        // Also select the layer when starting to drag
        handleComponentClick(e, component);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragState.isDragging || !dragState.componentId) return;

        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const deltaX = x - dragState.startX;
        const deltaY = y - dragState.startY;

        const newX = Math.max(0, Math.min(project.dimensions.width, dragState.originalX + deltaX));
        const newY = Math.max(0, Math.min(project.dimensions.height, dragState.originalY + deltaY));

        // Update component position
        const updatedLayers = project.layers.map(layer => ({
            ...layer,
            components: layer.components.map(comp => {
                if (comp.id === dragState.componentId) {
                    if (comp.type === 'text') {
                        const textComp = comp as TextComponent;
                        return {
                            ...textComp,
                            style: {
                                ...textComp.style,
                                position: { x: newX, y: newY }
                            }
                        };
                    } else if (comp.type === 'image') {
                        const mediaComp = comp as MediaComponent;
                        return {
                            ...mediaComp,
                            properties: {
                                ...mediaComp.properties,
                                position: { x: newX, y: newY }
                            }
                        };
                    }
                }
                return comp;
            })
        }));

        onProjectUpdate({ ...project, layers: updatedLayers });
    };

    const handleMouseUp = () => {
        setDragState({
            isDragging: false,
            componentId: null,
            startX: 0,
            startY: 0,
            originalX: 0,
            originalY: 0
        });
    };

    const handleBackgroundClick = () => {
        onLayerSelect(null);
    };

    useEffect(() => {
        if (dragState.isDragging) {
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('mousemove', handleMouseMove as any);
            return () => {
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('mousemove', handleMouseMove as any);
            };
        }
    }, [dragState.isDragging]);

    const renderComponent = (component: TextComponent | MediaComponent) => {
        const isSelected = selectedLayerId === project.layers.find(
            l => l.components.some(c => c.id === component.id)
        )?.id;

        if (component.type === 'text') {
            const textComp = component as TextComponent;
            return (
                <div
                    key={component.id}
                    style={{
                        position: 'absolute',
                        left: textComp.style.position.x,
                        top: textComp.style.position.y,
                        fontSize: textComp.style.fontSize,
                        fontFamily: textComp.style.fontFamily,
                        color: textComp.style.color,
                        opacity: textComp.style.opacity,
                        backgroundColor: textComp.style.backgroundColor || 'transparent',
                        padding: textComp.style.padding ? `${textComp.style.padding}px` : undefined,
                        borderRadius: textComp.style.borderRadius ? `${textComp.style.borderRadius}px` : undefined,
                        cursor: 'move',
                        userSelect: 'none',
                        border: isSelected ? '2px solid #3b82f6' : 'none',
                        zIndex: component.zIndex,
                        textShadow: textComp.style.shadowBlur
                            ? `${textComp.style.shadowOffset?.x || 0}px ${textComp.style.shadowOffset?.y || 0}px ${textComp.style.shadowBlur}px ${textComp.style.shadowColor || 'rgba(0,0,0,0.5)'}`
                            : undefined,
                        WebkitTextStroke: textComp.style.strokeWidth
                            ? `${textComp.style.strokeWidth}px ${textComp.style.strokeColor || '#000'}`
                            : undefined,
                    }}
                    onClick={(e) => handleComponentClick(e, component)}
                    onMouseDown={(e) => handleMouseDown(e, component)}
                >
                    {textComp.content}
                </div>
            );
        } else if (component.type === 'image') {
            const mediaComp = component as MediaComponent;
            if (!mediaComp.source) return null; // Don't render if no source

            return (
                <img
                    key={component.id}
                    src={mediaComp.source}
                    style={{
                        position: 'absolute',
                        left: mediaComp.properties.position.x,
                        top: mediaComp.properties.position.y,
                        width: mediaComp.properties.size.width,
                        height: mediaComp.properties.size.height,
                        opacity: mediaComp.properties.opacity,
                        transform: `rotate(${mediaComp.properties.rotation || 0}deg) scale(${mediaComp.properties.scale || 1
                            })`,
                        objectFit: mediaComp.properties.fit,
                        cursor: 'move',
                        border: isSelected ? '2px solid #3b82f6' : 'none',
                        zIndex: component.zIndex,
                        filter: mediaComp.filters ? `
                            brightness(${mediaComp.filters.brightness || 1})
                            contrast(${mediaComp.filters.contrast || 1})
                            saturate(${mediaComp.filters.saturation || 1})
                            hue-rotate(${mediaComp.filters.hue || 0}deg)
                            blur(${mediaComp.filters.blur || 0}px)
                            ${mediaComp.filters.grayscale ? 'grayscale(1)' : ''}
                        ` : undefined,
                    }}
                    onClick={(e) => handleComponentClick(e, component)}
                    onMouseDown={(e) => handleMouseDown(e, component)}
                    alt=""
                />
            );
        }
        return null;
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: project.settings?.backgroundColor || '#000000',
            }}
            onClick={handleBackgroundClick}
        >
            {project.layers
                .filter(layer => layer.isVisible)
                .flatMap(layer =>
                    layer.components
                        .filter(comp =>
                            project.currentTime >= comp.timeRange.start &&
                            project.currentTime <= comp.timeRange.start + comp.timeRange.duration
                        )
                        .map(comp => renderComponent(comp as TextComponent | MediaComponent))
                )}
        </div>
    );
};

export function VideoEditor({ project, onProjectUpdate, selectedLayerId, onLayerSelect }: VideoEditorProps) {
    return (
        <div className="w-full h-full bg-black rounded-lg overflow-hidden shadow-lg">
            <Player
                component={() => (
                    <VideoComposition
                        project={project}
                        onProjectUpdate={onProjectUpdate}
                        selectedLayerId={selectedLayerId}
                        onLayerSelect={onLayerSelect}
                    />
                )}
                durationInFrames={project.duration}
                fps={project.fps}
                compositionWidth={project.dimensions.width}
                compositionHeight={project.dimensions.height}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                controls
                autoPlay
                loop
            />
        </div>
    );
} 