import { useState, useCallback } from 'react';
import { Project, Layer, BaseComponent } from '@/types/editor';

interface UseVideoProjectProps {
    id: string;
    name: string;
    dimensions: { width: number; height: number };
    fps: number;
    duration: number;
    layers: Layer[];
    currentTime: number;
}

interface UseVideoProjectReturn {
    project: Project;
    updateProject: (project: Project) => void;
    selectedLayerId: string | null;
    setSelectedLayerId: (id: string | null) => void;
    // Layer operations
    addLayer: (name?: string) => void;
    removeLayer: (layerId: string) => void;
    updateLayer: (layerId: string, updates: Partial<Layer>) => void;
    // Component operations
    addComponent: (layerId: string, component: BaseComponent) => void;
    removeComponent: (layerId: string, componentId: string) => void;
    updateComponent: (layerId: string, componentId: string, updates: Partial<BaseComponent>) => void;
}

export function useVideoProject(initialProject: UseVideoProjectProps): UseVideoProjectReturn {
    const [project, setProject] = useState<Project>({
        ...initialProject,
        settings: {
            backgroundColor: '#000000',
            audioSampleRate: 48000,
            renderQuality: 'preview'
        }
    });
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

    const updateProject = useCallback((newProject: Project) => {
        setProject(newProject);
    }, []);

    const addLayer = useCallback((name?: string) => {
        const newLayer: Layer = {
            id: `layer-${Date.now()}`,
            name: name || `Layer ${project.layers.length + 1}`,
            isVisible: true,
            isLocked: false,
            components: []
        };

        setProject(prev => ({
            ...prev,
            layers: [...prev.layers, newLayer]
        }));
    }, [project.layers.length]);

    const removeLayer = useCallback((layerId: string) => {
        setProject(prev => ({
            ...prev,
            layers: prev.layers.filter(layer => layer.id !== layerId)
        }));

        if (selectedLayerId === layerId) {
            setSelectedLayerId(null);
        }
    }, [selectedLayerId]);

    const updateLayer = useCallback((layerId: string, updates: Partial<Layer>) => {
        setProject(prev => ({
            ...prev,
            layers: prev.layers.map(layer =>
                layer.id === layerId ? { ...layer, ...updates } : layer
            )
        }));
    }, []);

    const addComponent = useCallback((layerId: string, component: BaseComponent) => {
        setProject(prev => ({
            ...prev,
            layers: prev.layers.map(layer => {
                if (layer.id === layerId) {
                    return {
                        ...layer,
                        components: [...layer.components, component]
                    };
                }
                return layer;
            })
        }));
    }, []);

    const removeComponent = useCallback((layerId: string, componentId: string) => {
        setProject(prev => ({
            ...prev,
            layers: prev.layers.map(layer => {
                if (layer.id === layerId) {
                    return {
                        ...layer,
                        components: layer.components.filter(comp => comp.id !== componentId)
                    };
                }
                return layer;
            })
        }));
    }, []);

    const updateComponent = useCallback((
        layerId: string,
        componentId: string,
        updates: Partial<BaseComponent>
    ) => {
        setProject(prev => ({
            ...prev,
            layers: prev.layers.map(layer => {
                if (layer.id === layerId) {
                    return {
                        ...layer,
                        components: layer.components.map(comp =>
                            comp.id === componentId ? { ...comp, ...updates } : comp
                        )
                    };
                }
                return layer;
            })
        }));
    }, []);

    return {
        project,
        updateProject,
        selectedLayerId,
        setSelectedLayerId,
        addLayer,
        removeLayer,
        updateLayer,
        addComponent,
        removeComponent,
        updateComponent
    };
} 