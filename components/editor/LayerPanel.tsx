import React, { useState } from 'react';
import { Project, Layer, BaseComponent, TextComponent, MediaComponent } from '@/types/editor';
import { Plus, Type, Image as ImageIcon, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

interface LayerPanelProps {
    project: Project;
    onProjectUpdate: (project: Project) => void;
    selectedLayerId: string | null;
    onLayerSelect: (layerId: string | null) => void;
    onAddLayer: (name?: string) => void;
    onRemoveLayer: (layerId: string) => void;
    onUpdateLayer: (layerId: string, updates: Partial<Layer>) => void;
    onAddComponent: (layerId: string, component: BaseComponent) => void;
    onRemoveComponent: (layerId: string, componentId: string) => void;
    onUpdateComponent: (layerId: string, componentId: string, updates: Partial<BaseComponent>) => void;
}

export function LayerPanel({
    project,
    onProjectUpdate,
    selectedLayerId,
    onLayerSelect,
    onAddLayer,
    onRemoveLayer,
    onUpdateLayer,
    onAddComponent,
    onRemoveComponent,
    onUpdateComponent
}: LayerPanelProps) {
    const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());

    const handleLayerVisibilityToggle = (layerId: string) => {
        onUpdateLayer(layerId, { isVisible: !project.layers.find(l => l.id === layerId)?.isVisible });
    };

    const handleLayerLockToggle = (layerId: string) => {
        onUpdateLayer(layerId, { isLocked: !project.layers.find(l => l.id === layerId)?.isLocked });
    };

    const toggleLayerExpanded = (layerId: string) => {
        const newExpanded = new Set(expandedLayers);
        if (newExpanded.has(layerId)) {
            newExpanded.delete(layerId);
        } else {
            newExpanded.add(layerId);
        }
        setExpandedLayers(newExpanded);
    };

    const addTextComponent = (layerId: string) => {
        const newComponent: TextComponent = {
            id: `text-${Date.now()}`,
            type: 'text',
            content: 'New Text',
            timeRange: { start: project.currentTime, duration: 60 }, // 2 seconds at 30fps
            zIndex: 1,
            style: {
                fontSize: 48,
                fontFamily: 'Inter',
                color: '#ffffff',
                position: { x: 100, y: 100 },
                opacity: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: 16,
                borderRadius: 8,
            }
        };

        onAddComponent(layerId, newComponent);
    };

    const addImageComponent = (layerId: string) => {
        const newComponent: MediaComponent = {
            id: `image-${Date.now()}`,
            type: 'image',
            source: '', // Will be set when user selects an image
            timeRange: { start: project.currentTime, duration: 60 },
            zIndex: 1,
            properties: {
                position: { x: 100, y: 100 },
                size: { width: 300, height: 200 },
                opacity: 1,
                rotation: 0,
                scale: 1,
                fit: 'contain'
            }
        };

        onAddComponent(layerId, newComponent);
    };

    const renderComponentProperties = (layerId: string, component: BaseComponent) => {
        if (component.type === 'text') {
            const textComp = component as TextComponent;
            return (
                <div className="space-y-2 mt-2">
                    <input
                        type="text"
                        value={textComp.content}
                        onChange={(e) => {
                            onUpdateComponent(layerId, component.id, {
                                content: e.target.value
                            } as Partial<TextComponent>);
                        }}
                        className="w-full bg-gray-800 px-2 py-1 rounded"
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-gray-400">Font Size</label>
                            <input
                                type="number"
                                value={textComp.style.fontSize}
                                onChange={(e) => {
                                    onUpdateComponent(layerId, component.id, {
                                        style: {
                                            ...textComp.style,
                                            fontSize: Number(e.target.value)
                                        }
                                    } as Partial<TextComponent>);
                                }}
                                className="w-full bg-gray-800 px-2 py-1 rounded"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400">Color</label>
                            <input
                                type="color"
                                value={textComp.style.color}
                                onChange={(e) => {
                                    onUpdateComponent(layerId, component.id, {
                                        style: {
                                            ...textComp.style,
                                            color: e.target.value
                                        }
                                    } as Partial<TextComponent>);
                                }}
                                className="w-full h-8 bg-gray-800 rounded"
                            />
                        </div>
                    </div>
                </div>
            );
        }
        // Add more component type properties here
        return null;
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Layers</h2>
                <button
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                    onClick={() => onAddLayer()}
                >
                    <Plus size={16} /> Add Layer
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
                {project.layers.map(layer => (
                    <div
                        key={layer.id}
                        className={`rounded-lg border ${selectedLayerId === layer.id
                                ? 'border-blue-500 bg-gray-800'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                    >
                        <div
                            className="p-2 flex items-center gap-2 cursor-pointer"
                            onClick={() => onLayerSelect(layer.id)}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLayerExpanded(layer.id);
                                }}
                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded"
                            >
                                {expandedLayers.has(layer.id) ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLayerVisibilityToggle(layer.id);
                                }}
                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded"
                            >
                                {layer.isVisible ? '👁️' : '👁️‍🗨️'}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLayerLockToggle(layer.id);
                                }}
                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded"
                            >
                                {layer.isLocked ? '🔒' : '🔓'}
                            </button>
                            <span className="flex-1 truncate">{layer.name}</span>
                            {selectedLayerId === layer.id && (
                                <div className="flex gap-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addTextComponent(layer.id);
                                        }}
                                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded"
                                        title="Add Text"
                                    >
                                        <Type size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addImageComponent(layer.id);
                                        }}
                                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded"
                                        title="Add Image"
                                    >
                                        <ImageIcon size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveLayer(layer.id);
                                        }}
                                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded text-red-500"
                                        title="Delete Layer"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {expandedLayers.has(layer.id) && layer.components.length > 0 && (
                            <div className="ml-8 mr-2 mb-2 space-y-1">
                                {layer.components.map(component => (
                                    <div
                                        key={component.id}
                                        className="p-2 rounded bg-gray-800/50 hover:bg-gray-800"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="flex-1 text-sm">
                                                {component.type === 'text'
                                                    ? (component as TextComponent).content
                                                    : component.type}
                                            </span>
                                            <button
                                                onClick={() => onRemoveComponent(layer.id, component.id)}
                                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        {renderComponentProperties(layer.id, component)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 