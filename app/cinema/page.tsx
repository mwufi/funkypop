"use client";

import React, { useState } from 'react';
import { VideoEditor } from '@/components/editor/VideoEditor';
import { LayerPanel } from '@/components/editor/LayerPanel';
import { Timeline } from '@/components/editor/Timeline';
import { useVideoProject } from '@/hooks/useVideoProject';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function CinemaPage() {
    const {
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
    } = useVideoProject({
        id: 'default',
        name: 'Untitled Project',
        dimensions: { width: 1920, height: 1080 },
        fps: 30,
        duration: 300, // 10 seconds at 30fps
        layers: [],
        currentTime: 0,
    });

    return (
        <div className="h-screen w-screen bg-gray-900 text-white">
            <ResizablePanelGroup direction="horizontal">
                {/* Left Panel - Project/Assets */}
                <ResizablePanel defaultSize={15} minSize={10} maxSize={20}>
                    <div className="h-full p-4 border-r border-gray-700">
                        <h2 className="text-lg font-semibold mb-4">Project</h2>
                        {/* Project settings and assets will go here */}
                    </div>
                </ResizablePanel>

                <ResizableHandle />

                {/* Main Editor Area */}
                <ResizablePanel defaultSize={65}>
                    <ResizablePanelGroup direction="vertical">
                        {/* Video Preview */}
                        <ResizablePanel defaultSize={70}>
                            <div className="h-full flex items-center justify-center p-4">
                                <VideoEditor
                                    project={project}
                                    onProjectUpdate={updateProject}
                                    selectedLayerId={selectedLayerId}
                                    onLayerSelect={setSelectedLayerId}
                                />
                            </div>
                        </ResizablePanel>

                        <ResizableHandle />

                        {/* Timeline */}
                        <ResizablePanel defaultSize={30}>
                            <Timeline
                                project={project}
                                onProjectUpdate={updateProject}
                                selectedLayerId={selectedLayerId}
                                onLayerSelect={setSelectedLayerId}
                            />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle />

                {/* Right Panel - Layer Properties */}
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                    <LayerPanel
                        project={project}
                        onProjectUpdate={updateProject}
                        selectedLayerId={selectedLayerId}
                        onLayerSelect={setSelectedLayerId}
                        onAddLayer={addLayer}
                        onRemoveLayer={removeLayer}
                        onUpdateLayer={updateLayer}
                        onAddComponent={addComponent}
                        onRemoveComponent={removeComponent}
                        onUpdateComponent={updateComponent}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
} 